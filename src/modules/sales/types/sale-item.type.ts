import { Product } from "../../inventory/types/product.type";
import { Service } from "../../services/types/service.type";

export type SaleItem = {
  id: number;
  itemType: "PRODUCTO" | "SERVICIO";
  itemId: string;
  description: string;
  unitPrice: number;
  quantity: number;
  discount: number;
  total: number;
  service: Service;
  product: Product;
};
