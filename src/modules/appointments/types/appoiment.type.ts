import { Patient } from "../../patients/types/patient.type";
import { Service } from "../../services/types/service.type";
import { User } from "../../settings/types/user.type";

export type Appointment = {
  id: string;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:MM
  duration: number; // minutes
  status: AppointmentStatus;
  notes: string;
  patient: Patient;
  service: Service;
  scheduledBy: User;
  history: {
    date: string; // YYYY-MM-DD
    status: AppointmentStatus;
  }[];
};

export type AppointmentStatus =
  | "PENDIENTE"
  | "CONFIRMADO"
  | "CANCELADO"
  | "COMPLETADO"
  | "NO PRESENTE";
