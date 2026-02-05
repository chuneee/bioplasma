import api from "../../../shared/api/axios";

export class AuthService {
  static async login(credentials: { email: string; password: string }) {
    const { data } = await api.post("/auth/login", credentials);

    return data;
  }

  static async refreshToken() {
    const { data } = await api.post("/auth/refresh");

    return data;
  }

  static async logout() {
    const { data } = await api.post("/auth/logout");

    return data;
  }
}
