import { CreditCard, DollarSign, Percent, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { PaymentMethod } from "../types/payment-methods.type";

interface MetodosPagoprops {
  paymentMethods: PaymentMethod | undefined;
  onUpdate: (updatedData: Partial<PaymentMethod>) => void;
}

export const MetodospagosConfigSection = ({
  paymentMethods,
  onUpdate,
}: MetodosPagoprops) => {
  const [metodosPago, setMetodosPago] = useState<PaymentMethod | undefined>(
    paymentMethods,
  );

  useEffect(() => {
    paymentMethods && setMetodosPago(paymentMethods);
  }, [paymentMethods]);

  const handleGuardar = () => {
    onUpdate?.(metodosPago as Partial<PaymentMethod>);
  };

  const handleCancelar = () => {
    setMetodosPago(paymentMethods);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <h3 className="mb-4" style={{ fontWeight: 600, fontSize: "16px" }}>
          Métodos de Pago Aceptados
        </h3>
        <p
          className="text-[var(--color-text-secondary)] mb-6"
          style={{ fontSize: "14px" }}
        >
          Selecciona los métodos de pago que acepta la clínica
        </p>

        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 border border-[var(--color-border)] rounded-lg cursor-pointer hover:bg-[var(--color-bg)] transition-all">
            <div className="flex items-center gap-3">
              <DollarSign size={20} className="text-green-600" />
              <div>
                <p style={{ fontWeight: 500, fontSize: "14px" }}>Efectivo</p>
                <p
                  className="text-[var(--color-text-secondary)]"
                  style={{ fontSize: "12px" }}
                >
                  Pago en efectivo en el momento
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={metodosPago?.cash_payment}
              onChange={(e) =>
                metodosPago &&
                setMetodosPago({
                  ...metodosPago,
                  cash_payment: e.target.checked,
                })
              }
              className="w-5 h-5 text-[var(--color-primary)] rounded"
            />
          </label>

          <label className="flex items-center justify-between p-4 border border-[var(--color-border)] rounded-lg cursor-pointer hover:bg-[var(--color-bg)] transition-all">
            <div className="flex items-center gap-3">
              <CreditCard size={20} className="text-blue-600" />
              <div>
                <p style={{ fontWeight: 500, fontSize: "14px" }}>
                  Tarjeta de Débito
                </p>
                <p
                  className="text-[var(--color-text-secondary)]"
                  style={{ fontSize: "12px" }}
                >
                  Pagos con tarjeta de débito
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={metodosPago?.debit_card}
              onChange={(e) =>
                metodosPago &&
                setMetodosPago({
                  ...metodosPago,
                  debit_card: e.target.checked,
                })
              }
              className="w-5 h-5 text-[var(--color-primary)] rounded"
            />
          </label>

          <label className="flex items-center justify-between p-4 border border-[var(--color-border)] rounded-lg cursor-pointer hover:bg-[var(--color-bg)] transition-all">
            <div className="flex items-center gap-3">
              <CreditCard size={20} className="text-purple-600" />
              <div>
                <p style={{ fontWeight: 500, fontSize: "14px" }}>
                  Tarjeta de Crédito
                </p>
                <p
                  className="text-[var(--color-text-secondary)]"
                  style={{ fontSize: "12px" }}
                >
                  Pagos con tarjeta de crédito
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={metodosPago?.credit_card}
              onChange={(e) =>
                metodosPago &&
                setMetodosPago({
                  ...metodosPago,
                  credit_card: e.target.checked,
                })
              }
              className="w-5 h-5 text-[var(--color-primary)] rounded"
            />
          </label>

          <label className="flex items-center justify-between p-4 border border-[var(--color-border)] rounded-lg cursor-pointer hover:bg-[var(--color-bg)] transition-all">
            <div className="flex items-center gap-3">
              <DollarSign size={20} className="text-[var(--color-primary)]" />
              <div>
                <p style={{ fontWeight: 500, fontSize: "14px" }}>
                  Transferencia Bancaria
                </p>
                <p
                  className="text-[var(--color-text-secondary)]"
                  style={{ fontSize: "12px" }}
                >
                  Transferencias electrónicas
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={metodosPago?.bank_transfer}
              onChange={(e) =>
                metodosPago &&
                setMetodosPago({
                  ...metodosPago,
                  bank_transfer: e.target.checked,
                })
              }
              className="w-5 h-5 text-[var(--color-primary)] rounded"
            />
          </label>
        </div>
      </div>

      {/* Comisión por tarjeta */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <h3 className="mb-4" style={{ fontWeight: 600, fontSize: "16px" }}>
          Comisión por Tarjeta
        </h3>
        <p
          className="text-[var(--color-text-secondary)] mb-4"
          style={{ fontSize: "14px" }}
        >
          Porcentaje de comisión bancaria en pagos con tarjeta
        </p>
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-xs">
            <label
              className="block text-[var(--color-text-secondary)] mb-2"
              style={{ fontSize: "14px" }}
            >
              Porcentaje de comisión
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={metodosPago?.card_commission || 0}
                onChange={(e) =>
                  metodosPago &&
                  setMetodosPago({
                    ...metodosPago,
                    card_commission: parseFloat(e.target.value),
                  })
                }
                className="w-full px-4 py-2.5 pr-10 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
              />
              <Percent
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"
              />
            </div>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex-1">
            <p className="text-blue-900" style={{ fontSize: "13px" }}>
              <strong>Ejemplo:</strong> Con una comisión del{" "}
              {metodosPago?.card_commission || 0}%, una venta de $1,000 generará
              una comisión de $
              {((1000 * (metodosPago?.card_commission || 0)) / 100).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <button
          onClick={handleGuardar}
          className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-2"
        >
          <Save size={18} />
          <span style={{ fontSize: "14px", fontWeight: 600 }}>
            Guardar Cambios
          </span>
        </button>
        <button
          onClick={handleCancelar}
          className="px-6 py-3 bg-[var(--color-error)] text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-2"
        >
          <X size={18} />
          <span style={{ fontSize: "14px", fontWeight: 600 }}>Cancelar</span>
        </button>
      </div>
    </div>
  );
};
