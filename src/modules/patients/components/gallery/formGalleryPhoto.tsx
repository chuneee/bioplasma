import { useForm } from "react-hook-form";
import { AlertErrorInput } from "../../../../components/ui/alert";
import { PatientPhotos } from "../../types/patient-photo.type";

interface FormGalleryPhotoProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const FormGalleryPhotoModal = ({
  open,
  onClose,
  onSubmit,
}: FormGalleryPhotoProps) => {
  if (!open) return null;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Partial<PatientPhotos>>();

  const onFinish = (data: Partial<PatientPhotos>) => {
    onSubmit?.(data);
    reset();
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
          <h2 className="font-['Cormorant_Garamond']">Nueva Nota</h2>
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
          <div>
            <label className="block mb-2 text-[var(--color-text-secondary)]">
              Fotos *
            </label>
            <input
              {...register("urls", {
                required: "Las fotos son obligatorias",
                setValueAs: (files) => {
                  if (files instanceof FileList) {
                    return Array.from(files);
                  }
                  return [];
                },
              })}
              type="file"
              multiple
              accept="image/*"
              className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] resize-none"
              placeholder="Cualquier otra información relevante..."
            />
            {errors.urls && (
              <AlertErrorInput message={errors.urls.message as string} />
            )}
          </div>
          <div>
            <label className="block mb-2 text-[var(--color-text-secondary)]">
              Descripcion *
            </label>
            <textarea
              {...register("description", {
                required: "La nota es obligatoria",
              })}
              rows={3}
              className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] resize-none"
              placeholder="Cualquier otra información relevante..."
            />
            {errors.description && (
              <AlertErrorInput message={errors.description.message as string} />
            )}
          </div>
          <div>
            <label className="block mb-2 text-[var(--color-text-secondary)]">
              Categoria *
            </label>
            <select
              defaultValue="EVOLUCION"
              {...register("type", {
                required: "La categoría es obligatoria",
              })}
              className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
            >
              <option value="ANTES">Antes</option>
              <option value="DESPUES">Despues</option>
            </select>
            {errors.type && (
              <AlertErrorInput message={errors.type.message as string} />
            )}
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
