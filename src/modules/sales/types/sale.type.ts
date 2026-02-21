import { Patient } from "../../patients/types/patient.type";
import { User } from "../../settings/types/user.type";
import { SaleItem } from "./sale-item.type";

export type Sale = {
  id: number;
  patient?: Patient | undefined;
  customerName: string;
  seller: User;
  folio: string;
  sequentialNumber: number;
  status: SaleStatus;
  subTotal: number;
  discount: number;
  total: number;
  paymentMethod: paymentMethods;
  origin: SaleOrigin;
  createdAt: string;
  updatedAt: string;
  items: SaleItem[];
};

export enum SaleStatus {
  CONCRETADA = "CONCRETADA",
  CANCELADA = "CANCELADA",
  DEVOLUCION = "DEVOLUCION",
  GUARDADA = "GUARDADA",
}

export enum SaleOrigin {
  COTIZACION = "COTIZACION",
  DIRECTA = "VENTA DIRECTA",
}

export type paymentMethods =
  | "efectivo"
  | "tarjeta-credito"
  | "transferencia"
  | "tarjeta-debito";
