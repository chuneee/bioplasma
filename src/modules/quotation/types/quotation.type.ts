import { Patient } from "../../patients/types/patient.type";
import { User } from "../../settings/types/user.type";
import { QuotationItem } from "./quotation-item.type";

export type Quotation = {
  id: number;
  patient: Patient;
  seller: User;
  folio: string;
  sequentialNumber: number;
  expirationDate: string;
  validityDays: number;
  status: QuotationStatus;
  subTotal: number;
  discount: number;
  total: number;
  patientNotes: string;
  internalNotes: string;
  createdAt: string;
  updatedAt: string;
  items: QuotationItem[];
};

export enum QuotationStatus {
  BORRADOR = "BORRADOR",
  ENVIADA = "ENVIADA",
  PENDIENTE = "PENDIENTE",
  NEGOCIACION = "NEGOCIACION",
  RECHAZADA = "RECHAZADA",
  VENCIDA = "VENCIDA",
  CERRADA = "CERRADA",
}
