import { useEffect, useState } from "react";
import { Taxes } from "../types/taxes.type";
import { Save, X } from "lucide-react";

interface ImpuestosConfigSectionProps {
  impuestos?: Taxes | undefined;
  onUpdate?: (updatedData: Partial<Taxes>) => void;
}

export const ImpuestosConfigSection = ({
  impuestos,
  onUpdate,
}: ImpuestosConfigSectionProps) => {
  const [impuestosState, setImpuestos] = useState<Taxes | undefined>(undefined);

  useEffect(() => {
    impuestos && setImpuestos(impuestos);
  }, [impuestos]);

  const handleGuardar = () => {
    console.log("Guardando impuestos:", impuestosState);
    onUpdate?.(impuestosState as Partial<Taxes>);
  };

  const handleCancelar = () => {
    setImpuestos(impuestos);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <h3 className="mb-4" style={{ fontWeight: 600, fontSize: "16px" }}>
          Configuración de Impuestos
        </h3>
        <p
          className="text-[var(--color-text-secondary)] mb-6"
          style={{ fontSize: "14px" }}
        >
          Define los impuestos aplicables a los servicios y productos
        </p>

        <div className="space-y-6">
          <div>
            <label
              className="block text-[var(--color-text-secondary)] mb-2"
              style={{ fontSize: "14px" }}
            >
              IVA (%)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={impuestosState?.iva_percentage || 0}
                onChange={(e) =>
                  impuestosState &&
                  setImpuestos({
                    ...impuestosState,
                    iva_percentage: parseFloat(e.target.value),
                  })
                }
                className="w-32 px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
              />
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={impuestosState?.include_iva || false}
                  onChange={(e) =>
                    impuestosState &&
                    setImpuestos({
                      ...impuestosState,
                      include_iva: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-[var(--color-primary)] rounded"
                />
                <span style={{ fontSize: "14px" }}>
                  Incluir IVA en precios mostrados
                </span>
              </label>
            </div>
          </div>

          <div>
            <label
              className="block text-[var(--color-text-secondary)] mb-2"
              style={{ fontSize: "14px" }}
            >
              Retención ISR (%)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={impuestosState?.isr_percentage || 0}
              onChange={(e) =>
                impuestosState &&
                setImpuestos({
                  ...impuestosState,
                  isr_percentage: parseFloat(e.target.value),
                })
              }
              className="w-32 px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
            />
            <p
              className="text-[var(--color-text-secondary)] mt-2"
              style={{ fontSize: "13px" }}
            >
              Aplica solo para ciertos servicios profesionales
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p
            className="text-green-900 mb-2"
            style={{ fontSize: "14px", fontWeight: 500 }}
          >
            Ejemplo de cálculo:
          </p>
          <div
            className="text-green-700 space-y-1"
            style={{ fontSize: "13px" }}
          >
            <p>Precio base: $1,000.00</p>
            <p>
              IVA ({impuestosState?.iva_percentage || 0}%): $
              {((1000 * (impuestosState?.iva_percentage || 0)) / 100).toFixed(
                2,
              )}
            </p>
            <p
              className="pt-1 border-t border-green-300"
              style={{ fontWeight: 600 }}
            >
              Total: $
              {(
                1000 +
                (1000 * (impuestosState?.iva_percentage || 0)) / 100
              ).toFixed(2)}
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
