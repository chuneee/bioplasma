import api from "../../../shared/api/axios";
import { SaleFromQuote } from "../types/sale-from-quote.type";
import { Sale, SaleStatus } from "../types/sale.type";

export class SaleService {
  static async createSale(credencials: Partial<Sale>): Promise<Sale> {
    try {
      const { data } = await api.post("/sales", credencials);
      return data.data as Sale;
    } catch (error) {
      console.error("Error creating sale:", error);
      throw error;
    }
  }

  static async createSaleFromQuote(
    credencials: Partial<SaleFromQuote>,
  ): Promise<Sale> {
    try {
      const { data } = await api.post("/sales/from-quote", credencials);
      return data.data as Sale;
    } catch (error) {
      console.error("Error creating sale from quote:", error);
      throw error;
    }
  }

  static async getSales(): Promise<Sale[]> {
    try {
      const { data } = await api.get("/sales");
      return data as Sale[];
    } catch (error) {
      console.error("Error fetching sales:", error);
      throw error;
    }
  }

  async changeStatus(id: number, status: SaleStatus): Promise<Sale> {
    try {
      const { data } = await api.patch(`/sales/${id}/status`, { status });
      return data.data as Sale;
    } catch (error) {
      console.error("Error changing sale status:", error);
      throw error;
    }
  }
}
