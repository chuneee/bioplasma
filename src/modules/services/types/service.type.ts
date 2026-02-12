import { ServicePackage } from "./service-package";
import { ServiceSupplie } from "./service-supplie.type";

export type Service = {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  type: "UNICO" | "PAQUETE";
  category: string;

  price: number;
  promoPrice?: number;
  durationMinutes: number; // en minutos

  promoEndAt?: string; // ISO date string

  timesPerformed: number;

  notes?: string;
  isActive: boolean;

  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string

  packageItems?: ServicePackage[];
  partOfPackages?: ServicePackage[];

  supplies: ServiceSupplie[];
};
