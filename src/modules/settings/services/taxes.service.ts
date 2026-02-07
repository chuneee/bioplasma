import api from "../../../shared/api/axios";
import { Taxes } from "../types/taxes.type";

export class TaxesService {
  static async getTaxes(): Promise<Taxes> {
    try {
      const { data } = await api.get("taxes");

      return data.data as Taxes;
    } catch (error) {
      console.error("Error fetching taxes:", error);
      throw error;
    }
  }

  static async updateTaxes(
    id: string,
    credencials: Partial<Taxes>,
  ): Promise<Taxes> {
    try {
      const { data } = await api.patch(`taxes/${id}`, credencials);

      return data.data as Taxes;
    } catch (error) {
      console.error("Error updating taxes:", error);
      throw error;
    }
  }
}
