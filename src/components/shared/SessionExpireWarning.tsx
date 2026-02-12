import { useAuth } from "../../modules/auth/hooks/useAuth";
import { AlertTriangle, CheckCheck, X } from "lucide-react";
import { useEffect } from "react";

export const SessionExpireWarning = () => {
  const { showSessionWarning, continueSession, endSession } = useAuth();

  useEffect(() => {
    if (showSessionWarning) {
      // Desactivar scroll
      document.body.style.overflow = "hidden";
    } else {
      // Reactivar scroll
      document.body.style.overflow = "unset";
    }

    // Cleanup: asegurar que se reactive el scroll al desmontar
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showSessionWarning]);

  if (!showSessionWarning) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 text-center">
        <h3 className="font-['Cormorant_Garamond'] text-2xl font-bold text-[var(--color-primary)] flex items-center justify-center">
          <AlertTriangle
            size={30}
            className="inline-block mr-2 text-[var(--color-secondary)]"
          />
          Sesión a punto de expirar
        </h3>
        <p className="mt-4 text-[var(--color-text-secondary)]">
          Tu sesión está por expirar por inactividad. ¿Deseas continuar?
        </p>

        <div className="mt-4 flex justify-center gap-4">
          <button
            style={{
              cursor: "pointer",
            }}
            type="button"
            className="w-full bg-[var(--color-secondary)] p-2 rounded text-white"
            onClick={endSession}
          >
            <span className="flex items-center justify-center">
              <X className="inline-block mr-2" />
              Cerrar sesión
            </span>
          </button>
          <button
            style={{
              cursor: "pointer",
            }}
            type="button"
            className="w-full bg-[var(--color-primary)] p-2 rounded text-white"
            onClick={continueSession}
          >
            <span className="flex items-center justify-center">
              <CheckCheck className="inline-block mr-2" />
              Continuar sesión
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
