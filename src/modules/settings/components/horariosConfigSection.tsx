import { AlertCircle, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { ClinicBusinessHour } from "../types/clinic_business_hour.type";
import { usePermissions } from "../../auth/hooks/usePermissions";

interface ClinicBusinessHourProps {
  bussinessHours?: ClinicBusinessHour[];
  onSave?: (hours: ClinicBusinessHour[]) => void;
}

export const HorariosConfigSection = ({
  bussinessHours,
  onSave,
}: ClinicBusinessHourProps) => {
  const [horarios, setHorarios] = useState<ClinicBusinessHour[]>([]);

  const { hasPermission } = usePermissions();

  const canEdit = hasPermission("notifications.config.update");

  useEffect(() => {
    if (bussinessHours) setHorarios(bussinessHours);
  }, [bussinessHours]);

  const handleUpdateHorario = (
    id: string,
    field: keyof ClinicBusinessHour,
    value: any,
  ) => {
    const nuevosHorarios = [...horarios];
    const index = nuevosHorarios.findIndex((h) => h.id === id);
    if (index !== -1) {
      nuevosHorarios[index] = { ...nuevosHorarios[index], [field]: value };
      setHorarios(nuevosHorarios);
    }
  };

  const handleGuardar = () => {
    console.log("Guardando horarios:", horarios);
    onSave?.(horarios);
  };

  const handleCancelar = () => {
    bussinessHours ? setHorarios(bussinessHours) : null;
  };

  const HorarioItem = ({
    horario,
    index,
  }: {
    horario: ClinicBusinessHour;
    index: number;
  }) => {
    return (
      <div
        key={index}
        className="flex flex-col md:flex-row md:items-center gap-4 p-4 border border-[var(--color-border)] rounded-lg"
      >
        <div className="flex items-center gap-3 md:w-40">
          <input
            type="checkbox"
            disabled={!canEdit}
            checked={!horario.is_closed}
            onChange={(e) =>
              handleUpdateHorario(horario.id, "is_closed", !e.target.checked)
            }
            className="w-4 h-4 text-[var(--color-primary)] rounded"
          />
          <span style={{ fontWeight: 500, fontSize: "14px" }}>
            {dayjs()
              .day(horario.day_of_week)
              .locale("es")
              .format("dddd")
              .slice(0, 1)
              .toUpperCase()}

            {dayjs()
              .day(horario.day_of_week)
              .locale("es")
              .format("dddd")
              .slice(1)}
          </span>
        </div>

        {!horario.is_closed ? (
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2">
              <label
                className="text-[var(--color-text-secondary)]"
                style={{ fontSize: "13px" }}
              >
                De:
              </label>
              <input
                type="time"
                value={horario.open_time}
                disabled={!canEdit}
                onChange={(e) =>
                  handleUpdateHorario(horario.id, "open_time", e.target.value)
                }
                className="px-3 py-1.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
            <span className="text-[var(--color-text-secondary)]">—</span>
            <div className="flex items-center gap-2">
              <label
                className="text-[var(--color-text-secondary)]"
                style={{ fontSize: "13px" }}
              >
                A:
              </label>
              <input
                type="time"
                value={horario.close_time}
                disabled={!canEdit}
                onChange={(e) =>
                  handleUpdateHorario(horario.id, "close_time", e.target.value)
                }
                className="px-3 py-1.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
          </div>
        ) : (
          <span
            className="text-[var(--color-text-secondary)]"
            style={{ fontSize: "14px" }}
          >
            Cerrado
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <h3 className="mb-4" style={{ fontWeight: 600, fontSize: "16px" }}>
          Horario de Atención
        </h3>
        <p
          className="text-[var(--color-text-secondary)] mb-6"
          style={{ fontSize: "14px" }}
        >
          Configura los días y horarios en los que la clínica atiende
        </p>

        <div className="space-y-3">
          {horarios.map((horario, index) => (
            <HorarioItem key={index} horario={horario} index={index} />
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex gap-3">
            <AlertCircle
              size={20}
              className="text-blue-600 flex-shrink-0 mt-0.5"
            />
            <div>
              <p
                className="text-blue-900"
                style={{ fontSize: "14px", fontWeight: 500 }}
              >
                Importante
              </p>
              <p className="text-blue-700 mt-1" style={{ fontSize: "13px" }}>
                Los horarios configurados aquí se usarán para agendar citas y
                definir disponibilidad en el calendario.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4" hidden={!canEdit}>
        <button
          onClick={handleGuardar}
          disabled={!canEdit}
          className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-2"
        >
          <Save size={18} />
          <span style={{ fontSize: "14px", fontWeight: 600 }}>
            Guardar Cambios
          </span>
        </button>
        <button
          onClick={handleCancelar}
          disabled={!canEdit}
          className="px-6 py-3 bg-[var(--color-error)] text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-2"
        >
          <X size={18} />
          <span style={{ fontSize: "14px", fontWeight: 600 }}>Cancelar</span>
        </button>
      </div>
    </div>
  );
};
