import api from "../../../shared/api/axios";
import { Clinic, ClinicCredentials } from "../types/clinic.type";
import { ClinicBusinessHour } from "../types/clinic_business_hour.type";

export class ClinicService {
  static async getClinicInfo(): Promise<Clinic> {
    const { data } = await api.get("/clinic");
    return data;
  }

  static async updateClinicInfo(
    uuid: string,
    clinicData: ClinicCredentials,
  ): Promise<Clinic> {
    const { data } = await api.patch(`/clinic/${uuid}`, clinicData);
    return data;
  }

  static async uploadClinicLogo(
    uuid: string,
    file: File,
  ): Promise<{ logo_url: string }> {
    const formData = new FormData();
    formData.append("logo", file);

    const { data } = await api.patch(`/clinic/logo/${uuid}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data.data;
  }

  // * New method to get clinic business hours *//
  static async getClinicBusinessHours(): Promise<ClinicBusinessHour[]> {
    const { data } = await api.get("/clinic-business-hours");
    return data;
  }

  static async updateClinicBusinessHours(
    clinicId: string,
    hours: ClinicBusinessHour[],
  ): Promise<ClinicBusinessHour[]> {
    const { data } = await api.patch(
      `/clinic-business-hours/${clinicId}`,
      hours,
    );
    return data;
  }
}
