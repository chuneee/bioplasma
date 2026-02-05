import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  sub: string;
  role: string;
  permissions: string[];
  exp: number;
  iat: number;
}

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    const decodedToken = jwtDecode<DecodedToken>(token);

    return decodedToken;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) return true;

  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

export const getTokenExpirationTime = (token: string): number | null => {
  const decoded = decodeToken(token);
  if (!decoded) return null;

  const expirationTime = decoded.exp * 1000;

  // console.log("Token expiration time (ms):", expirationTime);
  // console.log("Current time (ms):", decoded.exp * 1000 - Date.now());

  return expirationTime;
};

export const getTimeUntilExpiration = (token: string): number => {
  const expirationTime = getTokenExpirationTime(token);
  if (!expirationTime) return 0;

  return Math.max(0, expirationTime - Date.now());
};
