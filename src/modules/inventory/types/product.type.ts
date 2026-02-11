import { InventoryStock } from "./inventory-stock.type";

export type Product = {
  id: string;
  imagePath: any;
  name: string;
  description: string;
  brand: string;
  category: CategoriaProducto;
  sku: string;
  unit: string;
  stockMin: number;
  costUnit: number;
  salePrice: number;
  hasExpiration: boolean;
  expirationDate: string | null;
  location: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  stockInfo: InventoryStock;
};

type CategoriaProducto =
  | "insumo-medico"
  | "facial"
  | "corporal"
  | "inyectable"
  | "consumible"
  | "equipamiento";
