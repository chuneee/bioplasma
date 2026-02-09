import { CheckCircle, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../../shared/api/axios";
import { PatientConsent } from "../../types/patientp-consent.type";
import { formatDate } from "../../../../utils/utils";

interface PatientConsentProps {
  consentList: PatientConsent[] | [];
  onEdit?: () => void;
}

export const PaientConsents = ({
  consentList,
  onEdit,
}: PatientConsentProps) => {
  const [consents, setConsents] = useState<PatientConsent[]>([]);

  useEffect(() => {
    setConsents(consentList || []);
  }, [consentList]);

  const ConsetCard = ({ consent }: { consent: PatientConsent }) => {
    const { uuid, signedAt, title } = consent;

    return (
      <div
        key={uuid}
        className="bg-[#FDFBF9] rounded-lg border border-[var(--color-border)] p-4"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="mb-1" style={{ fontWeight: 600 }}>
              {title}
            </h4>
            <p
              className="text-[var(--color-text-secondary)] mb-2"
              style={{ fontSize: "14px" }}
            >
              Fecha de firma: {formatDate(consent.signedAt)}
            </p>
            <span
              className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full"
              style={{ fontSize: "13px", fontWeight: 500 }}
            >
              <CheckCircle size={14} />
              Firmado
            </span>
          </div>
          <button
            onClick={() =>
              window.open(
                `${API_BASE_URL}/${consent.path}`,
                "_blank",
                "noopener,noreferrer",
              )
            }
            className="px-4 py-2 border border-[var(--color-border)] rounded-lg hover:bg-white transition-colors"
          >
            Ver documento
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 style={{ fontWeight: 600 }}>Consentimientos</h3>
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[#7A6349] transition-colors"
        >
          <Plus size={18} />
          <span>Nuevo Consentimiento</span>
        </button>
      </div>
      <div className="space-y-4 h-80 overflow-y-auto pr-2">
        {consents.length > 0 ? (
          consents.map((consent) => (
            <ConsetCard key={consent.uuid} consent={consent} />
          ))
        ) : (
          <p className="text-[var(--color-text-secondary)]">
            No se han registrado consentimientos para este paciente.
          </p>
        )}
      </div>
    </div>
  );
};
