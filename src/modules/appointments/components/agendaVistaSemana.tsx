import { useEffect, useRef, useState } from "react";
import {
  estadosConfig,
  getCitaPosition,
  getFilteredCitas,
  getWeekDays,
  isToday,
} from "../utils/utils";
import { Appointment } from "../types/appoiment.type";
import dayjs from "dayjs";

interface AgendaVistaSemanaProps {
  dataSource: Appointment[];
  date?: Date;
  onSelect?: (cita: Appointment) => void;
  searchTerm?: string;
}

export const AgendaVistaSemana = ({
  dataSource,
  date,
  onSelect,
  searchTerm = "",
}: AgendaVistaSemanaProps) => {
  const [caledarData, setCalendarData] = useState<Appointment[]>([]);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const hours = Array.from({ length: 25 }, (_, i) => i + 8);
  const [filterEstado, setFilterEstado] = useState<string[]>(["todas"]);

  useEffect(() => {
    setCalendarData(dataSource);
    setCurrentDate(date || new Date());
  }, [dataSource, date]);

  const handleSelect = (cita: Appointment) => {
    if (onSelect) {
      onSelect(cita);
    }
  };

  const weekDays = getWeekDays(currentDate);

  // Función para remover acentos
  const removeAccents = (str: string) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  // Si hay búsqueda, filtrar todas las citas (sin importar fecha)
  const searchResults =
    searchTerm.trim() !== ""
      ? caledarData.filter((cita) => {
          const searchNormalized = removeAccents(
            searchTerm.trim().toLowerCase(),
          );

          const nombreNormalizado = removeAccents(
            (cita.patient?.fullName || "").toLowerCase(),
          );
          const emailNormalizado = removeAccents(
            (cita.patient?.email || "").toLowerCase(),
          );
          const servicioNormalizado = removeAccents(
            (cita.service?.name || "").toLowerCase(),
          );
          const telefono = cita.patient?.principalPhoneNumber || "";

          return (
            nombreNormalizado.includes(searchNormalized) ||
            emailNormalizado.includes(searchNormalized) ||
            telefono.includes(searchTerm.trim()) ||
            servicioNormalizado.includes(searchNormalized)
          );
        })
      : [];

  // Si hay búsqueda activa, mostrar vista de lista
  if (searchTerm.trim() !== "") {
    return (
      <div className="flex-1 bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
        <div className="p-4">
          <h3 className="font-semibold mb-4">
            Resultados de búsqueda: {searchResults.length} cita(s)
          </h3>
          <div className="space-y-2">
            {searchResults.map((cita) => {
              const estado = estadosConfig[cita.status];
              return (
                <div
                  key={cita.id}
                  onClick={() => handleSelect(cita)}
                  className="p-4 border border-[var(--color-border)] rounded-lg cursor-pointer hover:bg-[#F5F2EF] transition-colors"
                  style={{
                    borderLeft: `4px solid ${estado.color}`,
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">
                        {cita.patient?.fullName}
                      </div>
                      <div className="text-sm text-[var(--color-text-secondary)]">
                        {cita.service?.name}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {new Date(cita.date).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                      <div className="text-sm text-[var(--color-text-secondary)]">
                        {cita.start_time}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span
                      className="inline-block px-2 py-1 rounded-full text-xs"
                      style={{
                        backgroundColor: estado.bgColor,
                        color: estado.color,
                      }}
                    >
                      {estado.label}
                    </span>
                  </div>
                </div>
              );
            })}
            {searchResults.length === 0 && (
              <div className="text-center py-8 text-[var(--color-text-secondary)]">
                No se encontraron citas que coincidan con "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Vista normal de calendario (sin búsqueda)
  return (
    <div className="flex-1 bg-white rounded-xl border border-[var(--color-border)] overflow-hidden flex flex-col">
      <div className="flex-1 overflow-auto" ref={calendarRef}>
        <div className="min-w-[800px]">
          {/* Header de días */}
          <div className="sticky top-0 bg-white border-b border-[var(--color-border)] z-10">
            <div className="flex">
              <div className="w-16 flex-shrink-0"></div>
              {weekDays.map((day, idx) => (
                <div
                  key={idx}
                  className={`flex-1 text-center py-4 border-l border-[var(--color-border)] ${
                    isToday(day) ? "bg-[var(--color-primary)] text-white" : ""
                  }`}
                >
                  <div
                    className="uppercase"
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"][idx]}
                  </div>
                  <div
                    className={`mt-1 ${isToday(day) ? "text-white" : "text-[var(--color-text)]"}`}
                    style={{
                      fontSize: "24px",
                      fontWeight: 600,
                    }}
                  >
                    {day.getDate()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grid de tiempo */}
          <div className="relative">
            {/* Líneas de hora */}
            {hours.map((hour) => (
              <div
                key={hour}
                className="flex border-b border-[var(--color-border)]"
                style={{ height: "80px" }}
              >
                <div className="w-16 flex-shrink-0 text-right pr-2 pt-1">
                  <span
                    className="text-[var(--color-text-secondary)]"
                    style={{ fontSize: "13px" }}
                  >
                    {hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`}
                  </span>
                </div>
                {weekDays.map((_, idx) => (
                  <div
                    key={idx}
                    className="flex-1 border-l border-[var(--color-border)] relative"
                  ></div>
                ))}
              </div>
            ))}

            {/* Bloques de citas */}
            {weekDays.map((day, dayIdx) => {
              const citasDelDia = getFilteredCitas(
                day,
                dataSource,
                searchTerm,
                filterEstado,
              );
              return citasDelDia.map((cita) => {
                const { top, height } = getCitaPosition(
                  cita.start_time,
                  cita.duration,
                );
                const left = `calc((100% - 64px) / 7 * ${dayIdx} + 64px)`;
                const width = `calc((100% - 64px) / 7)`;
                const estado = estadosConfig[cita.status];
                return (
                  <div
                    key={cita.id}
                    onClick={() => handleSelect(cita)}
                    className="absolute cursor-pointer hover:shadow-lg transition-shadow z-20 p-2"
                    style={{
                      top: `${top}px`,
                      left,
                      width,
                      height: `${height}px`, // Remover el Math.max para que use la altura real
                      backgroundColor: estado.bgColor,
                      borderLeft: `4px solid ${estado.color}`,
                      borderRadius: "6px",
                      paddingLeft: "8px",
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
                      {dayjs(`1970-01-01 ${cita.start_time}`).format("hh:mm A")}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                      className="truncate mt-1"
                    >
                      {cita.patient.fullName}
                    </div>
                    <div
                      style={{ fontSize: "10px" }}
                      className="text-[var(--color-text-secondary)] truncate"
                    >
                      {cita.service.name}
                    </div>
                  </div>
                );
              });
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
