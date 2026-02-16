import { useEffect, useRef, useState } from "react";
import {
  estadosConfig,
  getCitaPosition,
  getFilteredCitas,
  getWeekDays,
} from "../utils/utils";
import { Appointment } from "../types/appoiment.type";
import dayjs from "dayjs";

interface AgendaVistaDiaProps {
  dataSource: Appointment[];
  date?: Date;
  onSelect?: (cita: Appointment) => void;
  searchTerm?: string;
}

export const AgendaVistaDia = ({
  dataSource,
  date,
  onSelect,
  searchTerm = "",
}: AgendaVistaDiaProps) => {
  const calendarRef = useRef<HTMLDivElement>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const weekDays = getWeekDays(currentDate);
  const hours = Array.from({ length: 25 }, (_, i) => i + 8);
  const [filterEstado, setFilterEstado] = useState<string[]>(["todas"]);
  const [caledarData, setCalendarData] = useState(dataSource);

  useEffect(() => {
    setCalendarData(dataSource);
    setCurrentDate(date || new Date());
  }, [dataSource, date]);

  const handleSelect = (cita: Appointment) => {
    if (onSelect) {
      onSelect(cita);
    }
  };

  return (
    <div className="flex-1 bg-white rounded-xl border border-[var(--color-border)] overflow-hidden flex">
      {/* Calendario */}
      <div className="flex-1 overflow-auto">
        <div className="min-w-[400px]">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-[var(--color-border)] z-10 py-4 text-center">
            <div
              className="uppercase text-[var(--color-text-secondary)] mb-1"
              style={{ fontSize: "12px", fontWeight: 600 }}
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
                ][currentDate.getDay()]
              }
            </div>
            <div style={{ fontSize: "28px", fontWeight: 600 }}>
              {currentDate.getDate()}
            </div>
          </div>

          {/* Grid de tiempo */}
          <div className="relative">
            {hours.map((hour) => (
              <div
                key={hour}
                className="flex border-b border-[var(--color-border)]"
                style={{ height: "80px" }}
              >
                <div className="w-20 flex-shrink-0 text-right pr-3 pt-1">
                  <span
                    className="text-[var(--color-text-secondary)]"
                    style={{ fontSize: "13px" }}
                  >
                    {hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`}
                  </span>
                </div>
                <div className="flex-1 border-l border-[var(--color-border)]"></div>
              </div>
            ))}

            {/* Bloques de citas */}
            {getFilteredCitas(
              currentDate,
              caledarData,
              searchTerm,
              filterEstado,
            ).map((cita) => {
              const { top, height } = getCitaPosition(
                cita.start_time,
                cita.duration,
              );
              const estado = estadosConfig[cita.status];

              return (
                <div
                  key={cita.id}
                  onClick={() => handleSelect(cita)}
                  className="absolute cursor-pointer hover:shadow-lg transition-shadow z-20 p-3"
                  style={{
                    top: `${top}px`,
                    left: "80px",
                    right: "16px",
                    height: `${height}px`,
                    backgroundColor: estado.bgColor,
                    borderLeft: `4px solid ${estado.color}`,
                    borderRadius: "6px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      color: estado.color,
                    }}
                  >
                    {dayjs(`1970-01-01 ${cita.start_time}`).format("hh:mm A")} -{" "}
                    {dayjs(`1970-01-01 ${cita.start_time}`)
                      .add(cita.duration, "minute")
                      .format("hh:mm A")}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                    className="mt-1"
                  >
                    {cita.patient.fullName}
                  </div>
                  <div
                    style={{ fontSize: "10px" }}
                    className="text-[var(--color-text-secondary)]"
                  >
                    {cita.service.name}
                  </div>
                  {cita.notes && (
                    <div
                      style={{ fontSize: "10px" }}
                      className="text-[var(--color-text-secondary)] mt-1 line-clamp-2"
                    >
                      {cita.notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sidebar de citas del día */}
      <div className="w-80 border-l border-[var(--color-border)] bg-[#FDFBF9] overflow-auto">
        <div className="p-4 border-b border-[var(--color-border)] bg-white">
          <h3 style={{ fontWeight: 600 }}>Citas del día</h3>
          <p
            className="text-[var(--color-text-secondary)]"
            style={{ fontSize: "14px" }}
          >
            {
              getFilteredCitas(
                currentDate,
                caledarData,
                searchTerm,
                filterEstado,
              ).length
            }{" "}
            citas programadas
          </p>
        </div>
        <div className="p-4 space-y-3">
          {getFilteredCitas(
            currentDate,
            caledarData,
            searchTerm,
            filterEstado,
          ).map((cita) => {
            const estado = estadosConfig[cita.status];
            return (
              <div
                key={cita.id}
                onClick={() => handleSelect(cita)}
                className="bg-white rounded-lg border border-[var(--color-border)] p-3 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    {dayjs(`1970-01-01 ${cita.start_time}`).format("hh:mm A")} -{" "}
                    {dayjs(`1970-01-01 ${cita.start_time}`)
                      .add(cita.duration, "minute")
                      .format("hh:mm A")}
                  </span>
                  <span
                    className="px-2 py-1 rounded-full"
                    style={{
                      fontSize: "11px",
                      fontWeight: 500,
                      backgroundColor: estado.bgColor,
                      color: estado.color,
                    }}
                  >
                    {estado.label}
                  </span>
                </div>
                <div style={{ fontWeight: 600 }} className="mb-1">
                  {cita.patient.fullName}
                </div>
                <div
                  className="text-[var(--color-text-secondary)]"
                  style={{ fontSize: "13px" }}
                >
                  {cita.service.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
