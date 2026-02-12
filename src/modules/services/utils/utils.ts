import { ServiceSupplie } from "../types/service-supplie.type";
import { Service } from "../types/service.type";

export const categoriasConfig = {
  facial: { label: "Facial", color: "#7DB07D", bgColor: "#7DB07D15" },
  corporal: { label: "Corporal", color: "#8B7355", bgColor: "#8B735515" },
  inyectable: { label: "Inyectable", color: "#D4A574", bgColor: "#D4A57415" },
  laser: { label: "Láser", color: "#E0A75E", bgColor: "#E0A75E15" },
  paquete: { label: "Paquete", color: "#9D6FD8", bgColor: "#9D6FD815" },
  otros: { label: "Otros", color: "#c0c0c0ff", bgColor: "#9D6FD815" },
};

export type CategoriaServicio =
  | "facial"
  | "corporal"
  | "inyectable"
  | "laser"
  | "paquete";

export const calcularCostoInsumos = (insumos: ServiceSupplie[]) => {
  return insumos.reduce(
    (total, insumo) =>
      total + Number(insumo.product.costUnit) * Number(insumo.quantity),
    0,
  );
};

export const countByCategoria = (cat: string, servicios: Service[]) => {
  if (cat === "todos") return servicios.length;
  return servicios.filter((s) => s.category === cat).length;
};
