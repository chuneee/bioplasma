import api from "../../../shared/api/axios";
import { QuotationSummary } from "../types/quotation-sumary.type";
import { Quotation, QuotationStatus } from "../types/quotation.type";

export class QuotationService {
  static async getQuotations({
    year,
    month,
  }: {
    year?: number;
    month?: number;
  }): Promise<Quotation[]> {
    try {
      const { data } = await api.get("/quotations/all", {
        params: { year, month },
      });
      return data.data as Quotation[];
    } catch (error) {
      console.error("Error fetching quotation:", error);
      throw error;
    }
  }

  static async getSummary({
    year,
    month,
  }: {
    year?: number;
    month?: number;
  }): Promise<QuotationSummary> {
    try {
      const { data } = await api.get("/quotations/summary", {
        params: { year, month },
      });
      return data.data as QuotationSummary;
    } catch (error) {
      console.error("Error fetching quotation:", error);
      throw error;
    }
  }

  static async createQuotation(
    quotationData: Partial<Quotation>,
  ): Promise<Quotation> {
    try {
      const { data } = await api.post("/quotations", quotationData);
      return data.data as Quotation;
    } catch (error) {
      console.error("Error creating quotation:", error);
      throw error;
    }
  }

  static async updateQuotation(
    id: number,
    quotationData: Partial<Quotation>,
  ): Promise<Quotation> {
    try {
      const { data } = await api.patch(`/quotations/${id}`, quotationData);
      return data.data as Quotation;
    } catch (error) {
      console.error("Error updating quotation:", error);
      throw error;
    }
  }

  static async changeQuotationStatus(
    id: number,
    status: QuotationStatus,
  ): Promise<Quotation> {
    try {
      const { data } = await api.patch(`/quotations/${id}/status`, { status });
      return data.data as Quotation;
    } catch (error) {
      console.error("Error changing quotation status:", error);
      throw error;
    }
  }

  static async deleteQuotation(id: number): Promise<void> {
    try {
      await api.delete(`/quotations/${id}`);
    } catch (error) {
      console.error("Error deleting quotation:", error);
      throw error;
    }
  }
}
