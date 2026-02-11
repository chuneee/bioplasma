import api from "../../../shared/api/axios";
import { InventoryStockMovement } from "../types/stock-moviment.type";

export class StockMovementService {
  static async createStockMovement(
    movementData: Partial<InventoryStockMovement>,
  ): Promise<InventoryStockMovement> {
    try {
      const { data } = await api.post(
        "inventory/stock-movements",
        movementData,
      );
      return data.data as InventoryStockMovement;
    } catch (error) {
      console.error("Error creating stock movement:", error);
      throw error;
    }
  }

  static async getStockMovementsByProduct(
    productId: string,
  ): Promise<InventoryStockMovement[]> {
    try {
      const { data } = await api.get(
        `inventory/product/stock-movements/${productId}`,
      );
      return data.data as InventoryStockMovement[];
    } catch (error) {
      console.error("Error fetching stock movements:", error);
      throw error;
    }
  }
}
