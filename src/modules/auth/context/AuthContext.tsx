// modules/auth/context/AuthContext.tsx
import { createContext, useEffect, useRef, useState } from "react";
import {
  AuthContextType,
  AuthResponse,
  LoginCredentials,
  AuthUser,
} from "../types/auth.type";
import { AuthService } from "../services/auth.service";
import { isTokenExpired, getTimeUntilExpiration } from "../utils/token.utils";

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType,
);

const WARNING_TIME = 60 * 1000; // 1 minute before expiration

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logoutTimer = useRef<NodeJS.Timeout | null>(null);
  const warningTimer = useRef<NodeJS.Timeout | null>(null);
  const [showSessionWarning, setShowSessionWarning] = useState(false);

  const clearTimers = () => {
    if (logoutTimer.current) clearTimeout(logoutTimer.current);
    if (warningTimer.current) clearTimeout(warningTimer.current);
    logoutTimer.current = null;
    warningTimer.current = null;
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      if (isTokenExpired(storedToken)) {
        logout();
      } else {
        setToken(storedToken);
        setAuthUser(JSON.parse(storedUser));
        scheduleSession(storedToken);
      }
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    const syncLogout = () => {
      if (!localStorage.getItem("token")) {
        logout();
      }
    };

    window.addEventListener("storage", syncLogout);
    return () => window.removeEventListener("storage", syncLogout);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const loginResponse = await AuthService.login(credentials);

      const data: AuthResponse = loginResponse;

      setToken(data.accessToken);
      setAuthUser(data.user);

      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      clearTimers();
      scheduleSession(data.accessToken);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const refreshSession = async () => {
    try {
      const data = await AuthService.refreshToken();
      setToken(data.accessToken);
      localStorage.setItem("token", data.accessToken);

      clearTimers();
      scheduleSession(data.accessToken);
    } catch {
      logout();
    }
  };

  const logout = async () => {
    try {
      clearTimers();

      setToken(null);
      setAuthUser(null);

      await AuthService.logout();

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const continueSession = () => {
    setShowSessionWarning(false);
    refreshSession();
  };

  const endSession = () => {
    setShowSessionWarning(false);
    logout();
  };

  const scheduleSession = (token: string) => {
    const timeLeft = getTimeUntilExpiration(token);

    if (timeLeft <= 0) {
      logout();
      return;
    }

    warningTimer.current = setTimeout(
      () => {
        setShowSessionWarning(true); // 🔥 UI
      },
      Math.max(0, timeLeft - WARNING_TIME),
    );

    logoutTimer.current = setTimeout(() => {
      logout();
    }, timeLeft);
  };

  return (
    <AuthContext.Provider
      value={{
        authUser,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        isLoading,

        showSessionWarning,
        continueSession,
        endSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
