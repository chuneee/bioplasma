import api from "../../../shared/api/axios";
import { Appointment, AppointmentStatus } from "../types/appoiment.type";

export class AppointmentService {
  static async getAppointments() {
    try {
      const { data } = await api.get("/appointments");
      return data;
    } catch (error) {
      console.error("Error fetching appointments:", error);
      throw error;
    }
  }

  static async createAppointment(
    appointmentData: Partial<Appointment>,
  ): Promise<Appointment> {
    try {
      const { data } = await api.post("/appointments", appointmentData);
      return data.data as Appointment;
    } catch (error) {
      console.error("Error creating appointment:", error);
      throw error;
    }
  }

  static async updateAppointment(
    id: string,
    appointmentData: Partial<Appointment>,
  ): Promise<Appointment> {
    try {
      const { data } = await api.patch(`/appointments/${id}`, appointmentData);
      return data.data as Appointment;
    } catch (error) {
      console.error("Error updating appointment:", error);
      throw error;
    }
  }

  static async changeAppointmentStatus(
    statusData: AppointmentStatus,
    id: string,
  ): Promise<Appointment> {
    try {
      const { data } = await api.patch(`/appointments/${id}/change-status`, {
        status: statusData,
      });
      return data.data as Appointment;
    } catch (error) {
      console.error("Error changing appointment status:", error);
      throw error;
    }
  }

  static async recheduleAppointment(
    id: string,
    appointmentData: Partial<Appointment>,
  ): Promise<Appointment> {
    try {
      const { data } = await api.patch(
        `/appointments/reschedule/${id}`,
        appointmentData,
      );
      return data.data as Appointment;
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      throw error;
    }
  }
}
