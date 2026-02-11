import { User } from "../../settings/types/user.type";
import { Product } from "./product.type";

export type InventoryStockMovement = {
  id: string;
  type: "ENTRADA" | "SALIDA" | "AJUSTE";
  quantity: number;
  movementDate: string;
  reason: string;
  notes: string;
  cost: number;
  createdAt: string;
  createdBy: User;
  product: Product;
};
