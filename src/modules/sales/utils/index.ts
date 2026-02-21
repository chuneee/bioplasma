import { paymentMethods, Sale, SaleStatus } from "../types/sale.type";

export interface ItemSale {
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

type ItemQuotationWithPromo = ItemSale & { promoAplicada?: boolean };

export type MetodoPago =
  | "efectivo"
  | "tarjeta-credito"
  | "tarjeta-debito"
  | "transferencia"
  | "multiple";
export type OrigenVenta = "cotizacion" | "directa";
export type TipoItem = "servicio" | "producto";

export interface ItemVenta {
  id: string;
  tipo: TipoItem;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface PagoMultiple {
  metodo: MetodoPago;
  monto: number;
  referencia?: string;
}

export interface Venta {
  id: string;
  folio: string;
  fecha: string;
  pacienteId?: string;
  pacienteNombre?: string;
  pacienteAvatar?: string;
  items: ItemVenta[];
  subtotal: number;
  descuento: number;
  descuentoPorcentaje?: number;
  total: number;
  metodoPago: MetodoPago;
  pagos?: PagoMultiple[];
  montoRecibido?: number;
  cambio?: number;
  referencia?: string;
  vendedora: string;
  vendedoraId: string;
  origen: OrigenVenta;
  cotizacionFolio?: string;
  notas?: string;
  estado: "completada" | "cancelada";
}

export const ventasMock: Venta[] = [
  {
    id: "1",
    folio: "VTA-2025-0156",
    fecha: "2025-11-27T11:30:00",
    pacienteId: "1",
    pacienteNombre: "María García López",
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
    descuentoPorcentaje: 10,
    total: 3105,
    metodoPago: "tarjeta-credito",
    referencia: "****4532",
    vendedora: "Ana R.",
    vendedoraId: "1",
    origen: "cotizacion",
    cotizacionFolio: "COT-2025-0034",
    estado: "completada",
  },
  {
    id: "2",
    folio: "VTA-2025-0155",
    fecha: "2025-11-27T10:15:00",
    pacienteNombre: "Ana Sofía Martínez",
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
    metodoPago: "transferencia",
    referencia: "SPEI-123456",
    vendedora: "Ana R.",
    vendedoraId: "1",
    origen: "cotizacion",
    cotizacionFolio: "COT-2025-0033",
    estado: "completada",
  },
  {
    id: "3",
    folio: "VTA-2025-0154",
    fecha: "2025-11-27T09:00:00",
    items: [
      {
        id: "1",
        tipo: "producto",
        nombre: "Protector Solar SPF 50",
        cantidad: 2,
        precioUnitario: 120,
        subtotal: 240,
      },
      {
        id: "2",
        tipo: "producto",
        nombre: "Crema Hidratante",
        cantidad: 1,
        precioUnitario: 350,
        subtotal: 350,
      },
    ],
    subtotal: 590,
    descuento: 0,
    total: 590,
    metodoPago: "efectivo",
    montoRecibido: 600,
    cambio: 10,
    vendedora: "Ana R.",
    vendedoraId: "1",
    origen: "directa",
    estado: "completada",
  },
  {
    id: "4",
    folio: "VTA-2025-0153",
    fecha: "2025-11-26T16:45:00",
    pacienteNombre: "Laura Fernández",
    pacienteAvatar: "LF",
    items: [
      {
        id: "1",
        tipo: "servicio",
        nombre: "Rejuvenecimiento con Plasma",
        cantidad: 1,
        precioUnitario: 2500,
        subtotal: 2500,
      },
    ],
    subtotal: 2500,
    descuento: 0,
    total: 2500,
    metodoPago: "multiple",
    pagos: [
      { metodo: "efectivo", monto: 1000 },
      { metodo: "tarjeta-credito", monto: 1500, referencia: "****8899" },
    ],
    vendedora: "Ana R.",
    vendedoraId: "1",
    origen: "directa",
    estado: "completada",
  },
  {
    id: "5",
    folio: "VTA-2025-0152",
    fecha: "2025-11-26T14:20:00",
    pacienteNombre: "Carmen Rodríguez",
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
    ],
    subtotal: 1500,
    descuento: 0,
    total: 1500,
    metodoPago: "tarjeta-debito",
    referencia: "****2341",
    vendedora: "Ana R.",
    vendedoraId: "1",
    origen: "cotizacion",
    cotizacionFolio: "COT-2025-0031",
    estado: "completada",
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

export const getMetodoPagoLabel = (metodo: MetodoPago) => {
  switch (metodo) {
    case "efectivo":
      return "Efectivo";
    case "tarjeta-credito":
      return "Tarjeta Crédito";
    case "tarjeta-debito":
      return "Tarjeta Débito";
    case "transferencia":
      return "Transferencia";
    case "multiple":
      return "Mixto";
  }
};

export const payloadSales = (
  formValues: Partial<Sale>,
  itemsQuotation: ItemQuotationWithPromo[],
  status: SaleStatus = SaleStatus.GUARDADA,
  payMethod: paymentMethods = "efectivo",
  discountValue: number = 0,
) => {
  const items = itemsQuotation.map((item) => ({
    itemId: item.id,
    itemType: item.type,
    discount:
      (item.promoPrice && item.promoAplicada
        ? item.price - item.promoPrice
        : 0) * item.quantity,
    quantity: item.quantity,
  }));

  const descuentoPromo = itemsQuotation.reduce((total, item) => {
    if (item.promoPrice && item.promoAplicada) {
      return total + (item.price - item.promoPrice) * item.quantity;
    }
    return total;
  }, 0);

  console.log("Valor de descuento manual:", discountValue);
  console.log("Valor de descuento por promoción:", descuentoPromo);

  const descuento = discountValue + descuentoPromo;

  console.log("Descuento calculado:", descuento);
  const subtotal = itemsQuotation.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const total = subtotal - descuento;

  const payload = {
    ...formValues,
    items,
    subTotal: subtotal,
    discount: descuento,
    total,
    paymentMethod: payMethod,
    status,
  };

  return payload;
};
