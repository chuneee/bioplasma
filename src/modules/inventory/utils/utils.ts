import { Product } from "../types/product.type";

export const getAllStatuses = (producto: Product): string[] => {
  const statuses: string[] = [];

  // Revisar todos los estados posibles
  if (Number(producto.stockInfo.quantity) <= 0) {
    statuses.push("agotado");
  }

  if (
    Number(producto.stockInfo.quantity) < Number(producto.stockMin) &&
    Number(producto.stockInfo.quantity) > 0
  ) {
    statuses.push("bajo");
  }

  const daysUntilExpiry = getDaysUntilExpiry(
    producto.expirationDate || undefined,
  );

  if (
    producto.hasExpiration &&
    daysUntilExpiry !== null &&
    daysUntilExpiry < 30
  ) {
    statuses.push("por-caducar");
  }

  if (statuses.length === 0) {
    statuses.push("normal");
  }

  return statuses;
};

export const getStatus = (producto: Product) => {
  const daysUntilExpiry = getDaysUntilExpiry(
    producto.expirationDate || undefined,
  );
  if (Number(producto.stockInfo.quantity) <= 0) return "agotado";
  if (
    producto.hasExpiration &&
    daysUntilExpiry !== null &&
    daysUntilExpiry < 30
  )
    return "por-caducar";
  if (Number(producto.stockInfo.quantity) <= Number(producto.stockMin))
    return "bajo";

  return "normal";
};

export const getDaysUntilExpiry = (dateString?: string) => {
  if (!dateString) return null;
  const today = new Date();
  const expiry = new Date(dateString);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const categoriasConfig = {
  "insumo-medico": {
    label: "Insumo Médico",
    color: "#7DB07D",
    bgColor: "#7DB07D15",
  },
  facial: { label: "Producto Facial", color: "#D4A574", bgColor: "#D4A57415" },
  corporal: {
    label: "Producto Corporal",
    color: "#8B7355",
    bgColor: "#8B735515",
  },
  inyectable: { label: "Inyectable", color: "#E0A75E", bgColor: "#E0A75E15" },
  consumible: { label: "Consumible", color: "#6B6560", bgColor: "#6B656015" },
  equipamiento: {
    label: "Equipamiento",
    color: "#9D6FD8",
    bgColor: "#9D6FD815",
  },
};

export const estadosConfig = {
  normal: { label: "Normal", color: "#7DB07D", bgColor: "#7DB07D15" },
  bajo: { label: "Stock Bajo", color: "#E0A75E", bgColor: "#E0A75E15" },
  agotado: { label: "Agotado", color: "#C67B7B", bgColor: "#C67B7B15" },
  "por-caducar": {
    label: "Por Caducar",
    color: "#C67B7B",
    bgColor: "#C67B7B15",
  },
  caducado: { label: "Caducado", color: "#C67B7B", bgColor: "#C67B7B15" },
};
