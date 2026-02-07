import { PaymentMethod } from "../types/payment-methods.type";
import api from "../../../shared/api/axios";

export class PaymentMethodService {
  static async getPaymentMethods(): Promise<PaymentMethod> {
    try {
      const { data } = await api.get("payment-methods");

      return data.data as PaymentMethod;
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      throw error;
    }
  }

  static async updatePaymentMethods(
    id: string,
    credencials: Partial<PaymentMethod>,
  ): Promise<PaymentMethod> {
    try {
      const { data } = await api.patch(`payment-methods/${id}`, credencials);

      return data.data as PaymentMethod;
    } catch (error) {
      console.error("Error updating payment methods:", error);
      throw error;
    }
  }
}
