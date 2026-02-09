import { useForm } from "react-hook-form";
import { PatientMedicalInfo } from "../../types/patient-medical-info.type";
import { useEffect } from "react";

interface FormMedicalInfoModalProps {
  medicalInfo?: PatientMedicalInfo;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const FormMedicalInfoModal = ({
  open,
  onClose,
  onSubmit,
  medicalInfo,
}: FormMedicalInfoModalProps) => {
  if (!open) return null;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Partial<PatientMedicalInfo>>();

  useEffect(() => {
    medicalInfo &&
      reset({
        allergies: medicalInfo.allergies,
        medicalConditions: medicalInfo.medicalConditions,
        medications: medicalInfo.medications,
        notes: medicalInfo.notes,
      });
  }, [medicalInfo, reset]);

  const onFinish = (data: Partial<PatientMedicalInfo>) => {
    onSubmit?.(data);
  };

  const handleClose = () => {
    onClose?.();
    reset();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit(onFinish)}
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between">
          <h2 className="font-['Cormorant_Garamond']">
            Editar Informacion Medica
          </h2>
          <button
            onClick={handleClose}
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Sección 1: Información Personal */}
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-[var(--color-text-secondary)]">
                Alergias conocidas
              </label>
              <textarea
                {...register("allergies")}
                rows={3}
                className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] resize-none"
                placeholder="Describe cualquier alergia conocida..."
              />
            </div>
            <div>
              <label className="block mb-2 text-[var(--color-text-secondary)]">
                Condiciones médicas relevantes
              </label>
              <textarea
                {...register("medicalConditions")}
                rows={3}
                className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] resize-none"
                placeholder="Diabetes, hipertensión, etc..."
              />
            </div>
            <div>
              <label className="block mb-2 text-[var(--color-text-secondary)]">
                Medicamentos actuales
              </label>
              <textarea
                {...register("medications")}
                rows={3}
                className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] resize-none"
                placeholder="Lista de medicamentos que toma actualmente..."
              />
            </div>
            <div>
              <label className="block mb-2 text-[var(--color-text-secondary)]">
                Notas adicionales
              </label>
              <textarea
                {...register("notes")}
                rows={3}
                className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] resize-none"
                placeholder="Cualquier otra información relevante..."
              />
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
          <button
            type="submit"
            className="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[#7A6349] transition-colors"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};
