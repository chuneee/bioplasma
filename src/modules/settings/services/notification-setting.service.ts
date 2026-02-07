import api from "../../../shared/api/axios";
import { NotificationSettings } from "../types/notification-settings.type";

export class NotificationSettingService {
  static async getNotificationSettings(): Promise<NotificationSettings> {
    try {
      const { data } = await api.get("notification-settings");

      return data.data as NotificationSettings;
    } catch (error) {
      console.error("Error fetching notification settings:", error);
      throw error;
    }
  }

  static async updateNotificationSettings(
    id: string,
    credencials: Partial<NotificationSettings>,
  ): Promise<NotificationSettings> {
    try {
      const { data } = await api.patch(
        `notification-settings/${id}`,
        credencials,
      );

      return data.data as NotificationSettings;
    } catch (error) {
      console.error("Error updating notification settings:", error);
      throw error;
    }
  }
}
