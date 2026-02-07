export interface User {
  id: number;
  username: string;
  email: string;
  dateOfBirth: string;
  password: string;
  role: { name: string };
  isActive: boolean;
  updatedAt: string;
  lastLogin: string;
  desactivatedAt: string;
}

export interface UserCredentials {
  username: string;
  email: string;
  dateOfBirth: string;
  password?: string;
  role: string;
}
