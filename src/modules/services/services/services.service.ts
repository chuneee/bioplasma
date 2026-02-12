import api from "../../../shared/api/axios";
import { Service } from "../types/service.type";

export class ServicesService {
  static async getServicios(): Promise<Service[]> {
    // Simulación de llamada a API
    try {
      const { data } = await api.get("/services");

      return data.data as Service[];
    } catch (error) {
      console.error("Error fetching services:", error);
      throw error;
    }
  }

  static async createServicio(service: Partial<Service>): Promise<Service> {
    try {
      const { data } = await api.post("/services", service);
      return data.data as Service;
    } catch (error) {
      console.error("Error creating service:", error);
      throw error;
    }
  }

  static async updateServicio(
    id: string,
    service: Partial<Service>,
  ): Promise<Service> {
    try {
      const { data } = await api.patch(`/services/${id}`, service);
      return data.data as Service;
    } catch (error) {
      console.error("Error updating service:", error);
      throw error;
    }
  }

  static async deleteServicio(id: string): Promise<void> {
    try {
      await api.delete(`/services/${id}`);
    } catch (error) {
      console.error("Error deleting service:", error);
      throw error;
    }
  }
  static async disableServicio(id: string): Promise<void> {
    try {
      await api.delete(`/services/disable/${id}`);
    } catch (error) {
      console.error("Error disabling service:", error);
      throw error;
    }
  }
}
