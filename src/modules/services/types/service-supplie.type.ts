import { Product } from "../../inventory/types/product.type";

export type ServiceSupplie = {
  id: string;
  quantity: string;
  cost: number;
  product: Product ;
};
