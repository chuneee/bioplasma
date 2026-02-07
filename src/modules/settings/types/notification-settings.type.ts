export type NotificationSettings = {
  id: string;
  automatic_reminders: boolean;
  reminder_time_hours: number;
  whatsapp_notifications: boolean;
  email_notifications: boolean;
  appointment_confirmation: boolean;
  patient_birthday: boolean;
  promotions: boolean;
  createdAt: string;
  updatedAt: string;
};
