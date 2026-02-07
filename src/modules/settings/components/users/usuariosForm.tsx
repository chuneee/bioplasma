import { useForm } from "react-hook-form";

import { useEffect } from "react";
import { User, UserCredentials } from "../../types/user.type";
import dayjs from "dayjs";
import {
  Alert,
  AlertDescription,
  AlertErrorInput,
  AlertMessage,
  AlertTitle,
} from "../../../../components/ui/alert";

interface UsuarioFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UserCredentials) => void;
  currentUser?: User | null;
}

export const UsuarioFormModal = ({
  open,
  onClose,
  onSubmit,
  currentUser,
}: UsuarioFormModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserCredentials>();

  useEffect(() => {
    if (currentUser) {
      reset({
        username: currentUser.username,
        email: currentUser.email,
        password: "",
        dateOfBirth: dayjs(currentUser.dateOfBirth).format("YYYY-MM-DD"),
        role: currentUser.role.name,
      });
    } else {
      reset({
        username: "",
        email: "",
        password: "",
        dateOfBirth: "",
        role: "recepcionista",
      });
    }
  }, [currentUser, reset]);

  const handleClose = () => {
    reset();
    onClose?.();
  };

  return (
    <div>
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleSubmit(
              (data) => {
                onSubmit(data as UserCredentials);
                handleClose();
              },
              (errors) => {
                console.log("❌ ERRORES", errors);
              },
            )}
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between">
              <h2 className="font-['Cormorant_Garamond']">Nuevo Usuario</h2>
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
                  <div>
                    <label className="block mb-2 text-[var(--color-text-secondary)]">
                      Nombre completo *
                    </label>
                    <input
                      {...register("username", {
                        required: "El nombre completo es obligatorio",
                        minLength: {
                          value: 3,
                          message: "Mínimo 3 caracteres",
                        },
                      })}
                      type="text"
                      className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                      placeholder="Nombre completo del usuario"
                    />
                    {errors.username && (
                      <AlertErrorInput
                        message={errors.username.message as string}
                      />
                    )}
                  </div>
                  <div>
                    <label className="block mb-2 text-[var(--color-text-secondary)]">
                      Correo electrónico *
                    </label>
                    <input
                      {...register("email", {
                        required: "El correo electrónico es obligatorio",
                        pattern: {
                          value:
                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: "Formato de correo inválido",
                        },
                      })}
                      type="email"
                      className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                      placeholder="correo@ejemplo.com"
                    />
                    {errors.email && (
                      <AlertErrorInput
                        message={errors.email.message as string}
                      />
                    )}
                  </div>
                  <div>
                    <label className="block mb-2 text-[var(--color-text-secondary)]">
                      Contraseña *
                    </label>
                    <input
                      {...register(
                        "password",
                        currentUser
                          ? {}
                          : {
                              required: "La contraseña es obligatoria",
                              minLength: {
                                value: 8,
                                message: "Mínimo 8 caracteres",
                              },
                            },
                      )}
                      type="password"
                      className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                      placeholder="Ingrese una contraseña segura"
                    />
                    {errors.password && (
                      <AlertErrorInput
                        message={errors.password.message as string}
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
                        Rol de usuario *
                      </label>
                      <select
                        {...register("role", {
                          required: "El rol de usuario es obligatorio",
                        })}
                        defaultValue="recepcionista"
                        className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                      >
                        <option value="administrador">Administrador</option>
                        <option value="recepcionista">Recepcionista</option>
                      </select>
                      {errors.role && (
                        <AlertErrorInput
                          message={errors.role.message as string}
                        />
                      )}
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
              <button
                type="submit"
                className="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[#7A6349] transition-colors"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
