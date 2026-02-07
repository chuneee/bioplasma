import api from "../../../shared/api/axios";
import { TermsAndPolicies } from "../types/terms-and-policies.type";

export class TermsAndPoliciesService {
  static async getTermsAndPolicies(): Promise<TermsAndPolicies> {
    try {
      const { data } = await api.get("terms-and-policies");

      return data.data as TermsAndPolicies;
    } catch (error) {
      console.error("Error fetching terms and policies:", error);
      throw error;
    }
  }

  static async updateTermsAndPolicies(
    id: string,
    credencials: Partial<TermsAndPolicies>,
  ): Promise<TermsAndPolicies> {
    try {
      const { data } = await api.patch(`terms-and-policies/${id}`, credencials);

      return data.data as TermsAndPolicies;
    } catch (error) {
      console.error("Error updating terms and policies:", error);
      throw error;
    }
  }
}
