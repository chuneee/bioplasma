import { useEffect, useState } from "react";
import { Cotizacion } from "../utils/utils";
import { formatCurrency } from "../../../utils/utils";
import { AlertTriangle, Banknote, CreditCard, Smartphone } from "lucide-react";

interface SaleQuoteModalProps {
  open: boolean;
  onClose: () => void;
  dataSource: Cotizacion;
  onSubmit: (data: any) => void;
}

export const SaleQuoteModal = ({
  open,
  dataSource,
  onClose,
  onSubmit,
}: SaleQuoteModalProps) => {
  if (!open) return null;
  const [selectedCotizacion, setSelectedCotizacion] =
    useState<Cotizacion>(dataSource);
  const [metodoPago, setMetodoPago] = useState<
    "efectivo" | "tarjeta-credito" | "transferencia" | "multiple"
  >();

  const [montoRecibido, setMontoRecibido] = useState<number>(0);

  useEffect(() => {
    setSelectedCotizacion(dataSource);
  }, [dataSource]);

  const handleClose = () => {
    setSelectedCotizacion({} as Cotizacion);
    setMetodoPago(undefined);
    setMontoRecibido(0);
    onClose();
  };

  const onFinish = (values: any) => {
    onSubmit(values);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-[var(--color-border)] px-6 py-4 z-10">
          <h2 className="font-['Cormorant_Garamond']">Convertir a Venta</h2>
          <p
            className="text-[var(--color-text-secondary)]"
            style={{ fontSize: "14px" }}
          >
            {selectedCotizacion.folio} → {selectedCotizacion.pacienteNombre}
          </p>
        </div>

        <div className="p-6 space-y-5">
          {/* Resumen de cotización */}
          <div className="bg-[#F5F2EF] rounded-lg p-4">
            <div className="flex justify-between mb-3">
              <span className="text-[var(--color-text-secondary)]">Items:</span>
              <span style={{ fontWeight: 600 }}>
                {selectedCotizacion.items.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ fontSize: "18px", fontWeight: 700 }}>
                Total a cobrar:
              </span>
              <span
                className="text-[var(--color-secondary)]"
                style={{ fontSize: "24px", fontWeight: 700 }}
              >
                {formatCurrency(selectedCotizacion.total)}
              </span>
            </div>
          </div>

          {/* Método de pago */}
          <div>
            <label className="block mb-3" style={{ fontWeight: 600 }}>
              Método de Pago *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMetodoPago("efectivo")}
                className={`p-4 border-2 rounded-lg transition-all ${
                  metodoPago === "efectivo"
                    ? "border-[var(--color-primary)] bg-[#8B735515]"
                    : "border-[var(--color-border)] hover:border-[var(--color-primary)]"
                }`}
              >
                <Banknote
                  className={`mx-auto mb-2 ${metodoPago === "efectivo" ? "text-[var(--color-primary)]" : "text-[var(--color-text-secondary)]"}`}
                  size={24}
                />
                <div style={{ fontWeight: 600, fontSize: "14px" }}>
                  Efectivo
                </div>
              </button>
              <button
                onClick={() => setMetodoPago("tarjeta-credito")}
                className={`p-4 border-2 rounded-lg transition-all ${
                  metodoPago === "tarjeta-credito"
                    ? "border-[var(--color-primary)] bg-[#8B735515]"
                    : "border-[var(--color-border)] hover:border-[var(--color-primary)]"
                }`}
              >
                <CreditCard
                  className={`mx-auto mb-2 ${metodoPago === "tarjeta-credito" ? "text-[var(--color-primary)]" : "text-[var(--color-text-secondary)]"}`}
                  size={24}
                />
                <div style={{ fontWeight: 600, fontSize: "14px" }}>Tarjeta</div>
              </button>
              <button
                onClick={() => setMetodoPago("transferencia")}
                className={`p-4 border-2 rounded-lg transition-all ${
                  metodoPago === "transferencia"
                    ? "border-[var(--color-primary)] bg-[#8B735515]"
                    : "border-[var(--color-border)] hover:border-[var(--color-primary)]"
                }`}
              >
                <Smartphone
                  className={`mx-auto mb-2 ${metodoPago === "transferencia" ? "text-[var(--color-primary)]" : "text-[var(--color-text-secondary)]"}`}
                  size={24}
                />
                <div style={{ fontWeight: 600, fontSize: "14px" }}>
                  Transferencia
                </div>
              </button>
              <button
                onClick={() => setMetodoPago("multiple")}
                className={`p-4 border-2 rounded-lg transition-all ${
                  metodoPago === "multiple"
                    ? "border-[var(--color-primary)] bg-[#8B735515]"
                    : "border-[var(--color-border)] hover:border-[var(--color-primary)]"
                }`}
              >
                <div className="mb-2 text-center" style={{ fontSize: "24px" }}>
                  💳💵
                </div>
                <div style={{ fontWeight: 600, fontSize: "14px" }}>
                  Múltiple
                </div>
              </button>
            </div>
          </div>

          {/* Monto recibido */}
          {metodoPago === "efectivo" && (
            <div>
              <label className="block mb-2" style={{ fontWeight: 600 }}>
                Monto recibido *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]">
                  $
                </span>
                <input
                  type="number"
                  value={montoRecibido || ""}
                  onChange={(e) => setMontoRecibido(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                  placeholder="0.00"
                />
              </div>
              {montoRecibido > selectedCotizacion.total && (
                <div className="mt-2 p-3 bg-green-50 rounded-lg">
                  <div className="flex justify-between">
                    <span
                      className="text-green-600"
                      style={{ fontWeight: 600 }}
                    >
                      Cambio:
                    </span>
                    <span
                      className="text-green-600"
                      style={{ fontSize: "18px", fontWeight: 700 }}
                    >
                      {formatCurrency(montoRecibido - selectedCotizacion.total)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Referencia */}
          {metodoPago && metodoPago !== "efectivo" && (
            <div>
              <label className="block mb-2" style={{ fontWeight: 600 }}>
                Referencia
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                placeholder="Últimos 4 dígitos, # de transferencia..."
              />
            </div>
          )}

          {/* Agendar cita */}
          <div className="flex items-center justify-between">
            <div>
              <div style={{ fontWeight: 600 }}>
                ¿Agendar cita para los servicios?
              </div>
              <div
                className="text-[var(--color-text-secondary)]"
                style={{ fontSize: "14px" }}
              >
                Programar tratamientos incluidos
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-success)]"></div>
            </label>
          </div>

          {/* Notas */}
          <div>
            <label className="block mb-2" style={{ fontWeight: 600 }}>
              Notas de la venta
            </label>
            <textarea
              rows={2}
              className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] resize-none"
              placeholder="Observaciones adicionales..."
            />
          </div>

          {/* Preview comisión */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle
                className="text-blue-600 flex-shrink-0 mt-0.5"
                size={16}
              />
              <div className="flex-1">
                <div
                  className="text-blue-900"
                  style={{ fontWeight: 600, fontSize: "14px" }}
                >
                  Comisión a generar
                </div>
                <div className="text-blue-800" style={{ fontSize: "13px" }}>
                  {formatCurrency(selectedCotizacion.total * 0.1)} para{" "}
                  {selectedCotizacion.vendedora}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-[var(--color-border)] px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={handleClose}
            className="px-6 py-2.5 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors"
          >
            Cancelar
          </button>
          <button className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Confirmar Venta
          </button>
        </div>
      </div>
    </div>
  );
};
