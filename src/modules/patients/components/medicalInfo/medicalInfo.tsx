import { AlertCircle, Edit2 } from "lucide-react";
import { PatientMedicalInfo as PatientMedicalInfoType } from "../../types/patient-medical-info.type";
import { useEffect, useState } from "react";

interface PatientMedicalInfoProps {
  medicalInfo: PatientMedicalInfoType;
  onEdit: () => void;
}

export const PatientMedicalInfo = ({
  medicalInfo,
  onEdit,
}: PatientMedicalInfoProps) => {
  const [medicalInfoData, setMedicalInfoData] =
    useState<PatientMedicalInfoType | null>(null);

  useEffect(() => {
    setMedicalInfoData(medicalInfo);
  }, [medicalInfo]);

  const { allergies, medicalConditions, medications, notes } =
    medicalInfoData || {};

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 style={{ fontWeight: 600 }}>Información Médica</h3>
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-4 py-2.5 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors"
        >
          <Edit2 size={18} />
          <span>Editar Información</span>
        </button>
      </div>

      <div className="space-y-4">
        {/* Card: Alergias */}
        <div className="bg-red-50 rounded-lg border border-red-200 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle
              className="text-red-600 flex-shrink-0 mt-1"
              size={20}
            />
            <div className="flex-1">
              <h4 className="text-red-900 mb-2" style={{ fontWeight: 600 }}>
                Alergias
              </h4>
              <div hidden={allergies == null || allergies === ""}>
                {allergies?.split(",").map((alergia, index) => (
                  <p key={index} className="text-red-800">
                    • {alergia.trim()}
                  </p>
                ))}
              </div>

              <p
                hidden={
                  allergies !== null &&
                  allergies !== undefined &&
                  allergies !== ""
                }
                className="text-[var(--color-text-secondary)]"
              >
                No reporta alergias relevantes
              </p>
            </div>
          </div>
        </div>

        {/* Card: Condiciones Médicas */}
        <div className="bg-[#FDFBF9] rounded-lg border border-[var(--color-border)] p-4">
          <h4 className="mb-3" style={{ fontWeight: 600 }}>
            Condiciones Médicas
          </h4>
          <div hidden={medicalConditions == null || medicalConditions === ""}>
            {medicalConditions?.split(",").map((condicion, index) => (
              <p key={index} className="text-[var(--color-text-secondary)]">
                • {condicion.trim()}
              </p>
            ))}
          </div>
          <p
            hidden={
              medicalConditions !== null &&
              medicalConditions !== undefined &&
              medicalConditions !== ""
            }
            className="text-[var(--color-text-secondary)]"
          >
            No reporta condiciones médicas relevantes
          </p>
        </div>

        {/* Card: Medicamentos Actuales */}
        <div className="bg-[#FDFBF9] rounded-lg border border-[var(--color-border)] p-4">
          <h4 className="mb-3" style={{ fontWeight: 600 }}>
            Medicamentos Actuales
          </h4>
          <div hidden={medications == null || medications === ""}>
            {medications?.split(",").map((medicamento, index) => (
              <p key={index} className="text-[var(--color-text-secondary)]">
                • {medicamento.trim()}
              </p>
            ))}
          </div>
          <p
            hidden={
              medications !== null &&
              medications !== undefined &&
              medications !== ""
            }
            className="text-[var(--color-text-secondary)]"
          >
            No reporta uso de medicamentos relevantes
          </p>
        </div>

        {/* Card: Antecedentes */}
        <div className="bg-[#FDFBF9] rounded-lg border border-[var(--color-border)] p-4">
          <h4 className="mb-3" style={{ fontWeight: 600 }}>
            Antecedentes y Notas Adicionales
          </h4>
          <p
            hidden={notes === " "}
            className="text-[var(--color-text-secondary)]"
          >
            {notes}
          </p>
          <p
            hidden={notes === " "}
            className="text-[var(--color-text-secondary)]"
          >
            No se reportan antecedentes o notas adicionales relevantes
          </p>
        </div>
      </div>
    </div>
  );
};
