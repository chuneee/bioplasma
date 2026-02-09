import { useForm } from "react-hook-form";
import { PatientConsent } from "../../types/patientp-consent.type";
import { AlertErrorInput } from "../../../../components/ui/alert";
import dayjs from "dayjs";

interface ConsentFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const ConsentFormModal = ({
  open,
  onClose,
  onSubmit,
}: ConsentFormModalProps) => {
  if (!open) return null;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Partial<PatientConsent>>();
  const onFinish = (data: Partial<PatientConsent>) => {
    onSubmit?.(data);
    // console.log("Datos del formulario de consentimiento:", data);
  };

  const handleClose = () => {
    onClose?.();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit(onFinish)}
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between">
          <h2 className="font-['Cormorant_Garamond']">
            Registrar Nuevo Consentimiento
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
                Titulo del Consentimiento *
              </label>
              <input
                {...register("title", {
                  required: "El título del consentimiento es obligatorio",
                })}
                type="text"
                className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] resize-none"
                placeholder="Consentimiento para tratamiento X, Consentimiento para uso de datos, etc..."
              />
              {errors.title && (
                <AlertErrorInput message={errors.title.message as string} />
              )}
            </div>
            <div>
              <label className="block mb-2 text-[var(--color-text-secondary)]">
                Fecha de firma *
              </label>
              <input
                {...register("signedAt", {
                  required: "La fecha de firma es obligatoria",
                  validate: (value) => {
                    const selectedDate = dayjs(value);
                    const today = dayjs();
                    if (selectedDate.isAfter(today, "day")) {
                      return "La fecha de firma no puede ser futura";
                    }
                    return true;
                  },
                })}
                type="date"
                className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] resize-none"
                placeholder="Diabetes, hipertensión, etc..."
              />
              {errors.signedAt && (
                <AlertErrorInput message={errors.signedAt.message as string} />
              )}
            </div>
            <div>
              <label className="block mb-2 text-[var(--color-text-secondary)]">
                Agregar Documento *
              </label>
              <input
                {...register("path", {
                  required: "El documento es obligatorio",
                })}
                type="file"
                accept="pdf"
                className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] resize-none"
              />
              {errors.path && (
                <AlertErrorInput message={errors.path.message as string} />
              )}
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
