import api from "../../../shared/api/axios";
import { User, UserCredentials } from "../types/user.type";

export class UserService {
  static async getUsers(): Promise<User[]> {
    const { data } = await api.get("users");

    return data.data as User[];
  }

  static async createUser(userData: UserCredentials): Promise<User> {
    const { data } = await api.post("users", userData);

    return data.data as User;
  }

  static async updateUser(
    userId: number,
    userData: UserCredentials,
  ): Promise<User> {
    const { data } = await api.patch(`users/${userId}`, userData);

    return data.data as User;
  }
  static async deleteUser(userId: number): Promise<void> {
    await api.delete(`users/${userId}`);
  }
}
