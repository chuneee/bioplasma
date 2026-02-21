import { useState } from "react";
import { formatTime, getMetodoPagoLabel, MetodoPago, Venta } from "../utils";
import {
  Banknote,
  ChevronRight,
  CreditCard,
  MessageCircle,
  Package,
  Printer,
  Smartphone,
  Sparkles,
  X,
} from "lucide-react";
import { formatCurrency, formatDate } from "../../../utils/utils";
import { Sale, SaleOrigin, SaleStatus } from "../types/sale.type";

interface SaleDetailProps {
  open: boolean;
  onClose: () => void;
  dataSource: Sale | null;
  onChangeStatus?: (id: number, status: SaleStatus) => void;
}

export const SaleDetail = ({
  open,
  onClose,
  dataSource,
  onChangeStatus,
}: SaleDetailProps) => {
  if (!open || !dataSource) return null;
  const [selectedVenta, setSelectedVenta] = useState<Sale | null>(dataSource);

  const handleOnClose = () => {
    onClose();
    setSelectedVenta(null);
  };

  const getMetodoPagoIcon = (metodo: MetodoPago) => {
    switch (metodo) {
      case "efectivo":
        return <Banknote size={16} />;
      case "tarjeta-credito":
      case "tarjeta-debito":
        return <CreditCard size={16} />;
      case "transferencia":
        return <Smartphone size={16} />;
      case "multiple":
        return <span style={{ fontSize: "14px" }}>💳💵</span>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-end z-50">
      <div className="bg-white w-full md:w-[500px] h-full overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-[var(--color-border)] px-6 py-4 z-10">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-['Cormorant_Garamond']">Detalle de Venta</h2>
            <button
              onClick={handleOnClose}
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <p
            className="text-[var(--color-text-secondary)]"
            style={{ fontSize: "14px" }}
          >
            Ventas {">"} {selectedVenta?.folio}
          </p>
          <div className="flex gap-2 mt-4">
            <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors">
              <Printer size={16} />
              <span style={{ fontSize: "14px" }}>Imprimir</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors">
              <MessageCircle size={16} />
              <span style={{ fontSize: "14px" }}>WhatsApp</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Información de la venta */}
          <div className="bg-[#F5F2EF] rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div
                  className="text-[var(--color-text-secondary)]"
                  style={{ fontSize: "12px" }}
                >
                  Folio
                </div>
                <div style={{ fontWeight: 600 }}>{selectedVenta?.folio}</div>
              </div>
              <div>
                <div
                  className="text-[var(--color-text-secondary)]"
                  style={{ fontSize: "12px" }}
                >
                  Fecha
                </div>
                <div style={{ fontWeight: 600 }}>
                  {formatDate(selectedVenta?.createdAt || "")}
                </div>
              </div>
              <div>
                <div
                  className="text-[var(--color-text-secondary)]"
                  style={{ fontSize: "12px" }}
                >
                  Hora
                </div>
                <div style={{ fontWeight: 600 }}>
                  {formatTime(selectedVenta?.createdAt || "")}
                </div>
              </div>
              <div>
                <div
                  className="text-[var(--color-text-secondary)]"
                  style={{ fontSize: "12px" }}
                >
                  Origen
                </div>
                <div>
                  {selectedVenta?.origin === SaleOrigin.COTIZACION ? (
                    <span
                      className="text-blue-600 hover:underline cursor-pointer"
                      style={{ fontWeight: 600 }}
                    >
                      {selectedVenta?.folio}
                    </span>
                  ) : (
                    <span style={{ fontWeight: 600 }}>Venta directa</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Paciente */}
          <div className="border-t border-[var(--color-border)] pt-6">
            <h3 className="mb-3" style={{ fontWeight: 600 }}>
              Paciente
            </h3>
            {selectedVenta?.customerName ? (
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full bg-[#E8DFF5] flex items-center justify-center"
                  style={{ fontWeight: 600 }}
                >
                  {selectedVenta.customerName.split(" ").map((n) => n[0])}
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>
                    {selectedVenta.customerName}
                  </div>
                  <button
                    className="text-[var(--color-primary)] hover:underline"
                    style={{ fontSize: "13px" }}
                  >
                    Ver expediente <ChevronRight size={12} className="inline" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-[var(--color-text-secondary)]">
                Venta sin paciente asignado
              </div>
            )}
          </div>

          {/* Items vendidos */}
          <div className="border-t border-[var(--color-border)] pt-6">
            <h3 className="mb-3" style={{ fontWeight: 600 }}>
              Items Vendidos
            </h3>
            <div className="space-y-2 mb-4">
              {selectedVenta?.items.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-3 bg-[#F5F2EF] rounded-lg"
                >
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                    {item.itemType === "SERVICIO" ? (
                      <Sparkles
                        size={16}
                        className="text-[var(--color-secondary)]"
                      />
                    ) : (
                      <Package
                        size={16}
                        className="text-[var(--color-primary)]"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div style={{ fontWeight: 600, fontSize: "14px" }}>
                      {item.service?.name ||
                        item.product?.name ||
                        item.description}
                    </div>
                    <div
                      className="text-[var(--color-text-secondary)]"
                      style={{ fontSize: "12px" }}
                    >
                      {item.quantity} × {formatCurrency(item.unitPrice)}
                    </div>
                  </div>
                  <div style={{ fontWeight: 600 }}>
                    {formatCurrency(item.total)}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 p-4 bg-white border border-[var(--color-border)] rounded-lg">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">
                  Subtotal:
                </span>
                <span style={{ fontWeight: 600 }}>
                  {formatCurrency(selectedVenta?.subTotal || 0)}
                </span>
              </div>
              {selectedVenta?.discount ||
                (0 > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>
                      Descuento{" "}
                      {selectedVenta?.discount
                        ? `(${selectedVenta.discount}%)`
                        : ""}
                      :
                    </span>
                    <span>-{formatCurrency(selectedVenta?.discount || 0)}</span>
                  </div>
                ))}
              <div className="flex justify-between pt-2 border-t border-[var(--color-border)]">
                <span style={{ fontSize: "18px", fontWeight: 700 }}>
                  TOTAL:
                </span>
                <span
                  className="text-green-600"
                  style={{ fontSize: "20px", fontWeight: 700 }}
                >
                  {formatCurrency(selectedVenta?.total || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Información del pago */}
          <div className="border-t border-[var(--color-border)] pt-6">
            <h3 className="mb-3" style={{ fontWeight: 600 }}>
              Información del Pago
            </h3>
          </div>

          {/* Vendedora y comisión */}
          <div className="border-t border-[var(--color-border)] pt-6">
            <h3 className="mb-3" style={{ fontWeight: 600 }}>
              Vendedora
            </h3>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span style={{ fontWeight: 600 }}>
                  {selectedVenta?.seller.username}
                </span>
                <div className="text-right">
                  <div className="text-blue-600" style={{ fontSize: "12px" }}>
                    Comisión generada
                  </div>
                  <div className="text-blue-600" style={{ fontWeight: 700 }}>
                    {formatCurrency((selectedVenta?.total || 0) * 0.1)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
