import { Roles } from "../enums/role.enum";

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: Roles;
  permissions: string[];
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthContextType {
  authUser: AuthUser | null;
  token: string | null;
  login: (data: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  showSessionWarning: boolean;
  continueSession: () => void;
  endSession: () => void;
}
