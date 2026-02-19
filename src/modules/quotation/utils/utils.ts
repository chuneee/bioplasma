import { Quotation, QuotationStatus } from "../types/quotation.type";

export type EstadoCotizacion =
  | "pendiente"
  | "enviada"
  | "negociacion"
  | "cerrada"
  | "vencida"
  | "rechazada";

export interface ItemQuotation {
  id: string;
  type: "SERVICIO" | "PRODUCTO";
  name: string;
  description?: string;
  promoEndAt?: string | null;
  promoPrice?: number;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface ItemCotizacion {
  id: string;
  tipo: "servicio" | "producto";
  nombre: string;
  descripcion?: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Cotizacion {
  id: string;
  folio: string;
  fecha: string;
  pacienteId: string;
  pacienteNombre: string;
  pacienteTelefono: string;
  pacienteAvatar: string;
  items: ItemCotizacion[];
  subtotal: number;
  descuento: number;
  total: number;
  vendedora: string;
  vendedoraId: string;
  vigencia?: string;
  estado: EstadoCotizacion;
  notasPaciente?: string;
  notasInternas?: string;
}

export const estadosConfig = {
  borrador: { label: "Borrador", color: "#8b8b8bff", bgColor: "#E0A75E15" },
  pendiente: { label: "Pendiente", color: "#E0A75E", bgColor: "#E0A75E15" },
  enviada: { label: "Enviada", color: "#5B9FD8", bgColor: "#5B9FD815" },
  negociacion: {
    label: "En Negociación",
    color: "#9D6FD8",
    bgColor: "#9D6FD815",
  },
  cerrada: { label: "Cerrada", color: "#7DB07D", bgColor: "#7DB07D15" },
  vencida: { label: "Vencida", color: "#6B6560", bgColor: "#6B656015" },
  rechazada: { label: "Rechazada", color: "#C67B7B", bgColor: "#C67B7B15" },
};

export const cotizacionesMock: Cotizacion[] = [
  {
    id: "1",
    folio: "COT-2025-0034",
    fecha: "2025-11-27T10:30:00",
    pacienteId: "1",
    pacienteNombre: "María García López",
    pacienteTelefono: "(662) 123-4567",
    pacienteAvatar: "MG",
    items: [
      {
        id: "1",
        tipo: "servicio",
        nombre: "Limpieza Facial Profunda",
        cantidad: 1,
        precioUnitario: 850,
        subtotal: 850,
      },
      {
        id: "2",
        tipo: "servicio",
        nombre: "Hidratación Intensiva",
        descripcion: "Incluye mascarilla",
        cantidad: 1,
        precioUnitario: 600,
        subtotal: 600,
      },
      {
        id: "3",
        tipo: "producto",
        nombre: "Ácido Hialurónico 1ml",
        cantidad: 2,
        precioUnitario: 1000,
        subtotal: 2000,
      },
    ],
    subtotal: 3450,
    descuento: 345,
    total: 3105,
    vendedora: "Ana R.",
    vendedoraId: "1",
    vigencia: "2025-12-04",
    estado: "negociacion",
    notasPaciente: "Tratamiento recomendado para mejorar textura de piel",
    notasInternas: "Cliente interesada, llamar el viernes",
  },
  {
    id: "2",
    folio: "COT-2025-0033",
    fecha: "2025-11-26T14:20:00",
    pacienteId: "2",
    pacienteNombre: "Ana Sofía Martínez",
    pacienteTelefono: "(662) 234-5678",
    pacienteAvatar: "AM",
    items: [
      {
        id: "1",
        tipo: "servicio",
        nombre: "Paquete Novia Radiante",
        cantidad: 1,
        precioUnitario: 2800,
        subtotal: 2800,
      },
    ],
    subtotal: 2800,
    descuento: 0,
    total: 2800,
    vendedora: "Ana R.",
    vendedoraId: "1",
    vigencia: "2025-12-10",
    estado: "enviada",
    notasPaciente: "Paquete especial para boda en enero",
  },
  {
    id: "3",
    folio: "COT-2025-0032",
    fecha: "2025-11-25T09:15:00",
    pacienteId: "3",
    pacienteNombre: "Laura Fernández Cruz",
    pacienteTelefono: "(662) 345-6789",
    pacienteAvatar: "LF",
    items: [
      {
        id: "1",
        tipo: "servicio",
        nombre: "Rejuvenecimiento con Plasma",
        cantidad: 3,
        precioUnitario: 2500,
        subtotal: 7500,
      },
      {
        id: "2",
        tipo: "servicio",
        nombre: "Masaje Facial",
        cantidad: 3,
        precioUnitario: 400,
        subtotal: 1200,
      },
    ],
    subtotal: 8700,
    descuento: 870,
    total: 7830,
    vendedora: "Ana R.",
    vendedoraId: "1",
    vigencia: "2025-12-15",
    estado: "pendiente",
    notasPaciente: "Paquete de 3 sesiones con descuento del 10%",
  },
  {
    id: "4",
    folio: "COT-2025-0031",
    fecha: "2025-11-24T16:00:00",
    pacienteId: "4",
    pacienteNombre: "Carmen Rodríguez",
    pacienteTelefono: "(662) 456-7890",
    pacienteAvatar: "CR",
    items: [
      {
        id: "1",
        tipo: "servicio",
        nombre: "Peeling Químico",
        cantidad: 1,
        precioUnitario: 1500,
        subtotal: 1500,
      },
      {
        id: "2",
        tipo: "producto",
        nombre: "Protector Solar SPF 50",
        cantidad: 1,
        precioUnitario: 120,
        subtotal: 120,
      },
    ],
    subtotal: 1620,
    descuento: 0,
    total: 1620,
    vendedora: "Ana R.",
    vendedoraId: "1",
    estado: "cerrada",
  },
  {
    id: "5",
    folio: "COT-2025-0030",
    fecha: "2025-11-20T11:00:00",
    pacienteId: "5",
    pacienteNombre: "Patricia Sánchez",
    pacienteTelefono: "(662) 567-8901",
    pacienteAvatar: "PS",
    items: [
      {
        id: "1",
        tipo: "servicio",
        nombre: "Limpieza Facial",
        cantidad: 1,
        precioUnitario: 650,
        subtotal: 650,
      },
    ],
    subtotal: 650,
    descuento: 0,
    total: 650,
    vendedora: "Ana R.",
    vendedoraId: "1",
    vigencia: "2025-11-27",
    estado: "vencida",
  },
];

export const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
};

export const getDaysUntilExpiry = (dateString?: string) => {
  if (!dateString) return null;
  const today = new Date();
  const expiry = new Date(dateString);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const calcularSubtotal = (items: any[]) => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

export const calcularDescuento = (
  items: ItemQuotation[],
  descuentoTipo: "porcentaje" | "monto",
  descuentoValor: number,
) => {
  const subtotal = calcularSubtotal(items);
  if (descuentoTipo === "porcentaje") {
    return (subtotal * descuentoValor) / 100;
  }
  return descuentoValor;
};

export const calcularTotal = (
  items: ItemQuotation[],
  descuentoTipo: "porcentaje" | "monto",
  descuentoValor: number,
) => {
  return (
    calcularSubtotal(items) -
    calcularDescuento(items, descuentoTipo, descuentoValor)
  );
};

export const payloadQuotation = (
  formValues: Partial<Quotation>,
  itemsQuotation: ItemQuotation[],
  status: QuotationStatus = QuotationStatus.BORRADOR,

  discountValue: number = 0,
) => {
  const items = itemsQuotation.map((item) => ({
    itemId: item.id,
    itemType: item.type,
    discount:
      (item.promoPrice ? item.price - item.promoPrice : 0) * item.quantity,
    quantity: item.quantity,
  }));

  const descuento =
    itemsQuotation.reduce((total, item) => {
      if (item.promoPrice) {
        return total + (item.price - item.promoPrice) * item.quantity;
      }
      return total;
    }, 0) + discountValue;
  const subtotal = calcularSubtotal(itemsQuotation);

  const total = calcularTotal(itemsQuotation, "monto", descuento);

  const payload = {
    ...formValues,
    items,
    subTotal: subtotal,
    discount: descuento,
    total,
    status,
  };

  return payload;
};
