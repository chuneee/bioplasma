import {
  CalendarIcon,
  Check,
  Clock,
  Edit2,
  FileText,
  MessageCircle,
  Phone,
  X,
} from "lucide-react";
import { estadosConfig } from "../utils/utils";
import { useEffect, useState } from "react";
import { formatCurrency } from "../../../utils/utils";
import { Appointment, AppointmentStatus } from "../types/appoiment.type";
import dayjs from "dayjs";
import { useNavigation } from "../../../hooks/useNavigation";

interface CitaDetalleProps {
  open: boolean;
  cita: Appointment | null;
  onClose: () => void;
  onChangeStatus?: (status: AppointmentStatus, id: string) => void;
  onEdit?: () => void;
  onRechedule?: () => void;
}

export const CitaDetalle = ({
  open,
  cita,
  onClose,
  onChangeStatus,
  onEdit,
  onRechedule,
}: CitaDetalleProps) => {
  const [selectedCita, setSelectedCita] = useState<Appointment | null>(null);
  const { navigateToPaciente } = useNavigation();
  useEffect(() => {
    if (cita) {
      setSelectedCita(cita);
    }
  }, [cita]);

  const handleOnClose = () => {
    onClose();
  };

  const handleChangeStatus = (status: AppointmentStatus) => {
    if (onChangeStatus && selectedCita) {
      onChangeStatus(status, selectedCita.id);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    }
  };

  const handleRechedule = () => {
    if (onRechedule) {
      onRechedule();
    }
  };

  // Retornar null DESPUÉS de los hooks
  if (!open || !selectedCita) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={handleOnClose}
      ></div>
      <div className="fixed right-0 top-0 bottom-0 w-full md:w-[450px] bg-white shadow-2xl z-50 overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-['Cormorant_Garamond']">Detalle de Cita</h2>
            <span
              className="inline-block px-3 py-1 rounded-full mt-2"
              style={{
                fontSize: "12px",
                fontWeight: 500,
                backgroundColor:
                  estadosConfig[selectedCita.status]?.bgColor || "transparent",
                color: estadosConfig[selectedCita.status]?.color || "inherit",
              }}
            >
              {estadosConfig[selectedCita.status]?.label}
            </span>
          </div>
          <button
            onClick={handleOnClose}
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Información de la cita */}
          <div>
            <h3 className="mb-3" style={{ fontWeight: 600 }}>
              Información de la Cita
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CalendarIcon
                  size={20}
                  className="text-[var(--color-text-secondary)] flex-shrink-0 mt-0.5"
                />
                <div>
                  <div style={{ fontWeight: 600 }}>
                    {
                      [
                        "Domingo",
                        "Lunes",
                        "Martes",
                        "Miércoles",
                        "Jueves",
                        "Viernes",
                        "Sábado",
                      ][dayjs(selectedCita.date).day()]
                    }
                    , {dayjs(selectedCita.date).date()} de{" "}
                    {
                      [
                        "Enero",
                        "Febrero",
                        "Marzo",
                        "Abril",
                        "Mayo",
                        "Junio",
                        "Julio",
                        "Agosto",
                        "Septiembre",
                        "Octubre",
                        "Noviembre",
                        "Diciembre",
                      ][dayjs(selectedCita.date).month()]
                    }{" "}
                    {dayjs(selectedCita.date).year()}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock
                  size={20}
                  className="text-[var(--color-text-secondary)] flex-shrink-0 mt-0.5"
                />
                <div>
                  <div style={{ fontWeight: 600 }}>
                    {dayjs(selectedCita.start_time, "HH:mm").format("hh:mm A")}{" "}
                    -{" "}
                    {dayjs(selectedCita.start_time, "HH:mm")
                      .add(selectedCita.duration, "minute")
                      .format("hh:mm A")}
                  </div>
                  <div
                    className="text-[var(--color-text-secondary)]"
                    style={{ fontSize: "14px" }}
                  >
                    Duración: {selectedCita.duration} minutos
                  </div>
                </div>
              </div>
              {selectedCita.service && (
                <div className="flex items-start gap-3">
                  <FileText
                    size={20}
                    className="text-[var(--color-text-secondary)] flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <div style={{ fontWeight: 600 }}>
                      {selectedCita.service.name}
                    </div>
                    <div
                      className="text-[var(--color-secondary)]"
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                      }}
                    >
                      {formatCurrency(selectedCita.service.price)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Paciente */}
          {selectedCita.patient && (
            <div className="border-t border-[var(--color-border)] pt-6">
              <h3 className="mb-3" style={{ fontWeight: 600 }}>
                Paciente
              </h3>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-full bg-[#E8DFF5] flex items-center justify-center"
                  style={{ fontWeight: 600 }}
                >
                  {selectedCita.patient.fullName
                    .split(" ")
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
                <div className="flex-1">
                  <div style={{ fontWeight: 600 }}>
                    {selectedCita.patient.fullName}
                  </div>
                  <div
                    className="text-[var(--color-text-secondary)]"
                    style={{ fontSize: "14px" }}
                  >
                    {selectedCita.patient.principalPhoneNumber}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    window.open(
                      `https://wa.me/${selectedCita.patient.principalPhoneNumber.replace(/\D/g, "")}`,
                      "_blank",
                    )
                  }
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                >
                  <MessageCircle size={16} />
                  <span style={{ fontSize: "14px" }}>WhatsApp</span>
                </button>
              </div>
              <button
                type="button"
                onClick={() => navigateToPaciente(selectedCita.patient.uuid)}
                className="w-full mt-2 text-[var(--color-primary)] hover:underline"
                style={{ fontSize: "14px" }}
              >
                Ver expediente completo →
              </button>
            </div>
          )}

          {/* Notas */}
          <div className="border-t border-[var(--color-border)] pt-6">
            <h3 className="mb-3" style={{ fontWeight: 600 }}>
              Notas de la Cita
            </h3>
            {selectedCita.notes ? (
              <p className="text-[var(--color-text-secondary)]">
                {selectedCita.notes}
              </p>
            ) : (
              <p className="text-[var(--color-text-secondary)] italic">
                Sin notas
              </p>
            )}
          </div>
          {/* Historial */}
          {selectedCita.history && selectedCita.history.length > 0 && (
            <div className="border-t border-[var(--color-border)] pt-6">
              <h3 className="mb-3" style={{ fontWeight: 600 }}>
                Historial de Estados
              </h3>
              <div className="space-y-2">
                {selectedCita.history.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] mt-2"></div>
                    <div className="flex-1">
                      <div style={{ fontWeight: 600 }}>{item.status}</div>
                      <div
                        className="text-[var(--color-text-secondary)]"
                        style={{ fontSize: "13px" }}
                      >
                        {
                          [
                            "Domingo",
                            "Lunes",
                            "Martes",
                            "Miércoles",
                            "Jueves",
                            "Viernes",
                            "Sábado",
                          ][dayjs(item.date).day()]
                        }
                        , {dayjs(item.date).date()} de{" "}
                        {
                          [
                            "Enero",
                            "Febrero",
                            "Marzo",
                            "Abril",
                            "Mayo",
                            "Junio",
                            "Julio",
                            "Agosto",
                            "Septiembre",
                            "Octubre",
                            "Noviembre",
                            "Diciembre",
                          ][dayjs(item.date).month()]
                        }{" "}
                        {dayjs(item.date).year()}
                        {" a las "}
                        {dayjs(item.date).format("hh:mm A")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer de acciones */}
        <div className="sticky bottom-0 bg-white border-t border-[var(--color-border)] p-6 space-y-3">
          {selectedCita.status === "PENDIENTE" && (
            <button
              type="button"
              onClick={() => handleChangeStatus("CONFIRMADO")}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-success)] text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Check size={18} />
              <span>Confirmar Cita</span>
            </button>
          )}
          {selectedCita.status === "CONFIRMADO" && (
            <button
              type="button"
              onClick={() => handleChangeStatus("COMPLETADO")}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-success)] text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Check size={18} />
              <span>Marcar Completada</span>
            </button>
          )}
          <div className="flex gap-3">
            {["CANCELADO", "PENDIENTE", "CONFIRMADO"].includes(
              selectedCita.status,
            ) && (
              <button
                type="button"
                onClick={handleRechedule}
                className="flex-1 px-4 py-2.5 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors"
              >
                <span>Reagendar</span>
              </button>
            )}

            {!["CANCELADO", "COMPLETADO"].includes(selectedCita.status) ? (
              <button
                type="button"
                onClick={handleEdit}
                className="flex-1 px-4 py-2.5 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors"
              >
                <Edit2 size={16} className="inline mr-2" />
                <span>Editar</span>
              </button>
            ) : null}
          </div>
          {!["CANCELADO", "COMPLETADO"].includes(selectedCita.status) && (
            <button
              type="button"
              onClick={() => handleChangeStatus("CANCELADO")}
              className="w-full px-4 py-2.5 text-[var(--color-error)] hover:bg-red-50 rounded-lg transition-colors"
            >
              Cancelar Cita
            </button>
          )}
        </div>
      </div>
    </>
  );
};
