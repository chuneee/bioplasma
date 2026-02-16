import { useForm } from "react-hook-form";
import { Patient } from "../types/patient.type";
import { AlertErrorInput } from "../../../components/ui/alert";
import { useEffect } from "react";
import { Percent, Pointer } from "lucide-react";

interface PatientFormModalProps {
  onClose?: () => void;
  open: boolean;
  onSubmit?: (data: Partial<Patient>) => void;
  currentPatient?: Patient | null;
}

export const PatientFormModal = ({
  onClose,
  open,
  onSubmit,
  currentPatient,
}: PatientFormModalProps) => {
  if (!open) return null;
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Partial<Patient>>();

  const handleClose = () => {
    onClose?.();
    reset();
  };

  const handleFormSubmit = (data: Partial<Patient>) => {
    onSubmit?.(data);
  };

  useEffect(() => {
    if (currentPatient) {
      reset({
        fullName: currentPatient.fullName,
        email: currentPatient.email,
        principalPhoneNumber: currentPatient.principalPhoneNumber,
        dateOfBirth: currentPatient.dateOfBirth,
        gender: currentPatient.gender,
        secondaryPhoneNumber: currentPatient.secondaryPhoneNumber,
        address: currentPatient.address,
        neighborhood: currentPatient.neighborhood,
        city: currentPatient.city,
        zipCode: currentPatient.zipCode,
        isRecurrent: currentPatient.isRecurrent,
        porcentDiscount: currentPatient.porcentDiscount,
        medicalInfo: {
          allergies: currentPatient.medicalInfo?.allergies || "",
          medicalConditions:
            currentPatient.medicalInfo?.medicalConditions || "",
          medications: currentPatient.medicalInfo?.medications || "",
          notes: currentPatient.medicalInfo?.notes || "",
        },
      });
    } else {
      reset();
    }
  }, [currentPatient]);

  const isRecurrent = watch("isRecurrent");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between">
          <h2 className="font-['Cormorant_Garamond']">
            {currentPatient ? "Editar Paciente" : "Nuevo Paciente"}
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
          <div>
            <h3 className="mb-4" style={{ fontWeight: 600 }}>
              Información Personal
            </h3>
            <div className="space-y-4">
              {/* <div className="flex justify-center mb-4">
                <input className="w-24 h-24 rounded-full bg-[#F5F2EF] flex items-center justify-center border-2 border-dashed border-[var(--color-border)] cursor-pointer hover:border-[var(--color-primary)] transition-colors">
                  <Plus
                    className="text-[var(--color-text-secondary)]"
                    size={32}
                  />
                </input>
              </div> */}
              <div>
                <label className="block mb-2 text-[var(--color-text-secondary)]">
                  Nombre completo *
                </label>
                <input
                  {...register("fullName", {
                    required: "El nombre completo es obligatorio",
                    minLength: {
                      value: 3,
                      message: "Mínimo 3 caracteres",
                    },
                  })}
                  type="text"
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                  placeholder="Nombre completo del paciente"
                />
                {errors.fullName && (
                  <AlertErrorInput
                    message={errors.fullName.message as string}
                  />
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-[var(--color-text-secondary)]">
                    Fecha de nacimiento *
                  </label>
                  <input
                    {...register("dateOfBirth", {
                      required: "La fecha de nacimiento es obligatoria",
                    })}
                    type="date"
                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                  />
                  {errors.dateOfBirth && (
                    <AlertErrorInput
                      message={errors.dateOfBirth.message as string}
                    />
                  )}
                </div>
                <div>
                  <label className="block mb-2 text-[var(--color-text-secondary)]">
                    Género
                  </label>
                  <select
                    {...register("gender", {
                      required: "El género es obligatorio",
                    })}
                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                  >
                    <option>Femenino</option>
                    <option>Masculino</option>
                    <option>Otro</option>
                  </select>
                </div>
                {errors.gender && (
                  <AlertErrorInput message={errors.gender.message as string} />
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-[var(--color-text-secondary)]">
                    Teléfono principal *
                  </label>
                  <input
                    {...register("principalPhoneNumber", {
                      required: "El teléfono principal es obligatorio",
                    })}
                    type="tel"
                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                    placeholder="(662) 000-0000"
                  />
                  {errors.principalPhoneNumber && (
                    <AlertErrorInput
                      message={errors.principalPhoneNumber.message as string}
                    />
                  )}
                </div>
                <div>
                  <label className="block mb-2 text-[var(--color-text-secondary)]">
                    Teléfono secundario
                  </label>
                  <input
                    {...register("secondaryPhoneNumber")}
                    type="tel"
                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                    placeholder="(662) 000-0000"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 text-[var(--color-text-secondary)]">
                  Correo electrónico
                </label>
                <input
                  {...register("email", {
                    required: "El correo electrónico es obligatorio",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Correo electrónico no válido",
                    },
                  })}
                  type="email"
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                  placeholder="correo@ejemplo.com"
                />
                {errors.email && (
                  <AlertErrorInput message={errors.email.message as string} />
                )}
              </div>
              <div className="flex  flex-col gap-2 sm:flex-row sm:items-center sm:justify-between ">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div style={{ fontWeight: 600 }}>
                      ¿Es cliente recurrente?
                    </div>
                    <div
                      className="text-[var(--color-text-secondary)]"
                      style={{ fontSize: "14px" }}
                      hidden={!isRecurrent}
                    >
                      Descuentos especial.
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      {...register("isRecurrent")}
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked={false}
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-success)]"></div>
                  </label>
                </div>
                <div className="relative" hidden={!isRecurrent}>
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary]">
                    %
                  </span>
                  <input
                    {...register("porcentDiscount")}
                    type="number"
                    min={0}
                    max={100}
                    defaultValue={0}
                    className=" pl-8 pr-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sección 2: Dirección */}
          <div>
            <h3 className="mb-4" style={{ fontWeight: 600 }}>
              Dirección
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-[var(--color-text-secondary)]">
                  Calle y número *
                </label>
                <input
                  {...register("address", {
                    required: "La calle y número es obligatorio",
                  })}
                  type="text"
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                  placeholder="Calle Principal #123"
                />
                {errors.address && (
                  <AlertErrorInput message={errors.address.message as string} />
                )}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block mb-2 text-[var(--color-text-secondary)]">
                    Colonia *
                  </label>
                  <input
                    {...register("neighborhood", {
                      required: "La colonia es obligatoria",
                    })}
                    type="text"
                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                    placeholder="Colonia"
                  />
                  {errors.neighborhood && (
                    <AlertErrorInput
                      message={errors.neighborhood.message as string}
                    />
                  )}
                </div>
                <div>
                  <label className="block mb-2 text-[var(--color-text-secondary)]">
                    Ciudad *
                  </label>
                  <input
                    {...register("city", {
                      required: "La ciudad es obligatoria",
                    })}
                    type="text"
                    defaultValue="Hermosillo"
                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                  />
                  {errors.city && (
                    <AlertErrorInput message={errors.city.message as string} />
                  )}
                </div>
                <div>
                  <label className="block mb-2 text-[var(--color-text-secondary)]">
                    Código postal *
                  </label>
                  <input
                    {...register("zipCode", {
                      required: "El código postal es obligatorio",
                      pattern: {
                        value: /^\d{5}$/,
                        message: "Código postal no válido",
                      },
                    })}
                    type="text"
                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                    placeholder="83000"
                  />
                  {errors.zipCode && (
                    <AlertErrorInput
                      message={errors.zipCode.message as string}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sección 3: Información Médica */}
          <div>
            <h3 className="mb-4" style={{ fontWeight: 600 }}>
              Información Médica
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-[var(--color-text-secondary)]">
                  Alergias conocidas
                </label>
                <textarea
                  {...register("medicalInfo.allergies")}
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
                  {...register("medicalInfo.medicalConditions")}
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
                  {...register("medicalInfo.medications")}
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
                  {...register("medicalInfo.notes")}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] resize-none"
                  placeholder="Cualquier otra información relevante..."
                />
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
          <button
            type="submit"
            className="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[#7A6349] transition-colors"
          >
            Guardar Paciente
          </button>
        </div>
      </form>
    </div>
  );
};
