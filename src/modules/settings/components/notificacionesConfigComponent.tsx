import { Mail, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NotificationSettings } from "../types/notification-settings.type";

interface NotificacionesConfigSectionProps {
  notificationSettings?: NotificationSettings | undefined; // Define un tipo adecuado para tus settings
  onUpdate?: (updatedData: Partial<NotificationSettings>) => void; // Define un tipo adecuado para tus settings
}

export const NotificacionesConfigSection = ({
  notificationSettings,
  onUpdate,
}: NotificacionesConfigSectionProps) => {
  const [notificaciones, setNotificaciones] = useState<
    NotificationSettings | undefined
  >(undefined);

  useEffect(() => {
    notificationSettings && setNotificaciones(notificationSettings);
  }, [notificationSettings]);

  const handleGuardar = () => {
    onUpdate?.(notificaciones as Partial<NotificationSettings>);
  };

  const handleCancelar = () => {
    setNotificaciones(notificationSettings);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <h3 className="mb-4" style={{ fontWeight: 600, fontSize: "16px" }}>
          Recordatorios de Citas
        </h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 border border-[var(--color-border)] rounded-lg cursor-pointer hover:bg-[var(--color-bg)] transition-all">
            <div>
              <p style={{ fontWeight: 500, fontSize: "14px" }}>
                Activar recordatorios automáticos
              </p>
              <p
                className="text-[var(--color-text-secondary)]"
                style={{ fontSize: "13px" }}
              >
                Enviar recordatorios antes de las citas
              </p>
            </div>
            <input
              type="checkbox"
              checked={notificaciones?.automatic_reminders}
              onChange={(e) =>
                notificaciones &&
                setNotificaciones({
                  ...notificaciones,
                  automatic_reminders: e.target.checked,
                })
              }
              className="w-5 h-5 text-[var(--color-primary)] rounded"
            />
          </label>

          {notificaciones?.automatic_reminders && (
            <div className="ml-4 pl-4 border-l-2 border-[var(--color-border)]">
              <label
                className="block text-[var(--color-text-secondary)] mb-2"
                style={{ fontSize: "14px" }}
              >
                Enviar recordatorio con anticipación
              </label>
              <select
                value={notificaciones?.reminder_time_hours}
                onChange={(e) =>
                  setNotificaciones({
                    ...notificaciones,
                    reminder_time_hours: parseInt(e.target.value),
                  })
                }
                className="px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
              >
                <option value={1}>1 hora antes</option>
                <option value={2}>2 horas antes</option>
                <option value={4}>4 horas antes</option>
                <option value={24}>24 horas antes</option>
                <option value={48}>48 horas antes</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <h3 className="mb-4" style={{ fontWeight: 600, fontSize: "16px" }}>
          Canales de Notificación
        </h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-4 border border-[var(--color-border)] rounded-lg cursor-pointer hover:bg-[var(--color-bg)] transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <span style={{ fontSize: "18px" }}>📱</span>
              </div>
              <div>
                <p style={{ fontWeight: 500, fontSize: "14px" }}>WhatsApp</p>
                <p
                  className="text-[var(--color-text-secondary)]"
                  style={{ fontSize: "12px" }}
                >
                  Mensajes vía WhatsApp Business
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={notificaciones?.whatsapp_notifications}
              onChange={(e) =>
                notificaciones &&
                setNotificaciones({
                  ...notificaciones,
                  whatsapp_notifications: e.target.checked,
                })
              }
              className="w-5 h-5 text-[var(--color-primary)] rounded"
            />
          </label>

          <label className="flex items-center justify-between p-4 border border-[var(--color-border)] rounded-lg cursor-pointer hover:bg-[var(--color-bg)] transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Mail size={20} className="text-blue-600" />
              </div>
              <div>
                <p style={{ fontWeight: 500, fontSize: "14px" }}>Email</p>
                <p
                  className="text-[var(--color-text-secondary)]"
                  style={{ fontSize: "12px" }}
                >
                  Correo electrónico
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={notificaciones?.email_notifications}
              onChange={(e) =>
                notificaciones &&
                setNotificaciones({
                  ...notificaciones,
                  email_notifications: e.target.checked,
                })
              }
              className="w-5 h-5 text-[var(--color-primary)] rounded"
            />
          </label>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <h3 className="mb-4" style={{ fontWeight: 600, fontSize: "16px" }}>
          Otras Notificaciones
        </h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-4 border border-[var(--color-border)] rounded-lg cursor-pointer hover:bg-[var(--color-bg)] transition-all">
            <div>
              <p style={{ fontWeight: 500, fontSize: "14px" }}>
                Confirmación de citas
              </p>
              <p
                className="text-[var(--color-text-secondary)]"
                style={{ fontSize: "13px" }}
              >
                Enviar confirmación al agendar una cita
              </p>
            </div>
            <input
              type="checkbox"
              checked={notificaciones?.appointment_confirmation}
              onChange={(e) =>
                notificaciones &&
                setNotificaciones({
                  ...notificaciones,
                  appointment_confirmation: e.target.checked,
                })
              }
              className="w-5 h-5 text-[var(--color-primary)] rounded"
            />
          </label>

          <label className="flex items-center justify-between p-4 border border-[var(--color-border)] rounded-lg cursor-pointer hover:bg-[var(--color-bg)] transition-all">
            <div>
              <p style={{ fontWeight: 500, fontSize: "14px" }}>
                Cumpleaños de pacientes
              </p>
              <p
                className="text-[var(--color-text-secondary)]"
                style={{ fontSize: "13px" }}
              >
                Felicitar a pacientes en su cumpleaños
              </p>
            </div>
            <input
              type="checkbox"
              checked={notificaciones?.patient_birthday}
              onChange={(e) =>
                notificaciones &&
                setNotificaciones({
                  ...notificaciones,
                  patient_birthday: e.target.checked,
                })
              }
              className="w-5 h-5 text-[var(--color-primary)] rounded"
            />
          </label>

          <label className="flex items-center justify-between p-4 border border-[var(--color-border)] rounded-lg cursor-pointer hover:bg-[var(--color-bg)] transition-all">
            <div>
              <p style={{ fontWeight: 500, fontSize: "14px" }}>Promociones</p>
              <p
                className="text-[var(--color-text-secondary)]"
                style={{ fontSize: "13px" }}
              >
                Enviar notificaciones de ofertas y promociones
              </p>
            </div>
            <input
              type="checkbox"
              checked={notificaciones?.promotions}
              onChange={(e) =>
                notificaciones &&
                setNotificaciones({
                  ...notificaciones,
                  promotions: e.target.checked,
                })
              }
              className="w-5 h-5 text-[var(--color-primary)] rounded"
            />
          </label>
        </div>
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
