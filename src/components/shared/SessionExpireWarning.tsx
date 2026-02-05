import { useAuth } from "../../modules/auth/hooks/useAuth";

export const SessionExpireWarning = () => {
  const { showSessionWarning, continueSession, endSession } = useAuth();

  if (!showSessionWarning) return null;

  return (
    <div
      style={{
        position: "fixed" as const,
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "24px",
          borderRadius: "8px",
          width: "380px",
          textAlign: "center" as const,
        }}
      >
        <h3>Sesión a punto de expirar</h3>
        <p>Tu sesión está por expirar por inactividad. ¿Deseas continuar?</p>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
            marginTop: "24px",
          }}
        >
          <button
            onClick={endSession}
            style={{ backgroundColor: "#e5e7eb", padding: "8px 14px" }}
          >
            Cerrar sesión
          </button>
          <button
            onClick={continueSession}
            style={{
              backgroundColor: "#2563eb",
              color: "#fff",
              padding: "8px 14px",
            }}
          >
            Continuar sesión
          </button>
        </div>
      </div>
    </div>
  );
};
