export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
  profile_image_url?: string;
  phone?: string;
  isActive: boolean;
  updatedAt: string;
  lastLogin: string;
  desactivatedAt: string;
}
