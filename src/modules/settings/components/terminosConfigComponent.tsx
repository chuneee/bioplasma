import { useEffect, useState } from "react";
import { TermsAndPolicies } from "../types/terms-and-policies.type";
import { Save, X } from "lucide-react";

interface TerminosConfigSectionProps {
  termsAndPolicies?: TermsAndPolicies | undefined;
  onUpdate?: (updatedData: Partial<TermsAndPolicies>) => void;
}

export const TerminosConfigSection = ({
  termsAndPolicies,
  onUpdate,
}: TerminosConfigSectionProps) => {
  const [terms, setTerms] = useState<TermsAndPolicies | undefined>(undefined);

  useEffect(() => {
    termsAndPolicies && setTerms(termsAndPolicies);
  }, [termsAndPolicies]);

  const handleGuardar = () => {
    onUpdate?.(terms as Partial<TermsAndPolicies>);
  };

  const handleCancelar = () => {
    setTerms(termsAndPolicies);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <h3 className="mb-4" style={{ fontWeight: 600, fontSize: "16px" }}>
          Términos y Condiciones
        </h3>
        <p
          className="text-[var(--color-text-secondary)] mb-4"
          style={{ fontSize: "14px" }}
        >
          Define los términos que aparecerán en cotizaciones y documentos
        </p>
        <textarea
          rows={8}
          className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
          placeholder="Ejemplo: Los servicios prestados son responsabilidad de la clínica Bio Plasma. Los resultados pueden variar según cada paciente..."
          value={terms?.terms_of_service || ""}
          onChange={(value) =>
            terms &&
            setTerms({
              ...terms,
              terms_of_service: value.target.value,
            })
          }
        />
      </div>

      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <h3 className="mb-4" style={{ fontWeight: 600, fontSize: "16px" }}>
          Política de Privacidad
        </h3>
        <p
          className="text-[var(--color-text-secondary)] mb-4"
          style={{ fontSize: "14px" }}
        >
          Información sobre el manejo de datos personales
        </p>
        <textarea
          rows={8}
          className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
          placeholder="Ejemplo: En Bio Plasma respetamos tu privacidad. Los datos personales son utilizados únicamente para..."
          value={terms?.privacy_policy || ""}
          onChange={(value) =>
            terms &&
            setTerms({
              ...terms,
              privacy_policy: value.target.value,
            })
          }
        />
      </div>

      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <h3 className="mb-4" style={{ fontWeight: 600, fontSize: "16px" }}>
          Consentimiento Informado
        </h3>
        <p
          className="text-[var(--color-text-secondary)] mb-4"
          style={{ fontSize: "14px" }}
        >
          Texto del consentimiento para tratamientos
        </p>
        <textarea
          rows={8}
          className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
          placeholder="Ejemplo: Yo _____________ acepto recibir el tratamiento de _____________ habiendo sido informado(a) de..."
          value={terms?.informed_consent || ""}
          onChange={(value) =>
            terms &&
            setTerms({
              ...terms,
              informed_consent: value.target.value,
            })
          }
        />
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
