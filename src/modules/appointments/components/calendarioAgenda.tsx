import { useEffect, useState, useMemo, useCallback } from "react";
import { getWeekDays, ViewMode } from "../utils/utils";
import { AgendaVistaDia } from "./agendaVistaDia";
import { AgendaVistaSemana } from "./agendaVistaSemana";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { AgendaVistaMes } from "./agendaVistaMes";
import { Appointment } from "../types/appoiment.type";

interface CalendarioAgendaProps {
  dataSource: Appointment[];
  onSelectCita?: (cita: Appointment) => void;
}

export const CalendarioAgenda = ({
  dataSource,
  onSelectCita,
}: CalendarioAgendaProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>(dataSource);

  useEffect(() => {
    setAppointments(dataSource);
  }, [dataSource]);

  const handleSelectCita = useCallback(
    (cita: Appointment) => {
      if (onSelectCita) {
        onSelectCita(cita);
      }
    },
    [onSelectCita],
  );

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const navigateDate = useCallback(
    (direction: "prev" | "next") => {
      setCurrentDate((prevDate) => {
        const newDate = new Date(prevDate);
        if (viewMode === "week") {
          newDate.setDate(prevDate.getDate() + (direction === "next" ? 7 : -7));
        } else if (viewMode === "day") {
          newDate.setDate(prevDate.getDate() + (direction === "next" ? 1 : -1));
        } else {
          newDate.setMonth(
            prevDate.getMonth() + (direction === "next" ? 1 : -1),
          );
        }
        return newDate;
      });
    },
    [viewMode],
  );

  const formatWeekRange = useCallback((days: Date[]) => {
    const months = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];
    const start = days[0];
    const end = days[6];
    return `${start.getDate()} ${months[start.getMonth()]} - ${end.getDate()} ${months[end.getMonth()]} ${end.getFullYear()}`;
  }, []);

  const formatDate = useCallback((date: Date) => {
    const months = [
      "Enero",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Noviembre",
      "Dic",
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  }, []);

  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);

  const ControlesAgenda = useMemo(() => {
    return (
      <>
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <button
            onClick={goToToday}
            className="px-4 py-2 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors"
          >
            Hoy
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateDate("prev")}
              className="p-2 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <div
              className="px-4 py-2 min-w-[250px] text-center"
              style={{ fontWeight: 600 }}
            >
              {viewMode === "week"
                ? formatWeekRange(weekDays)
                : formatDate(currentDate)}
            </div>
            <button
              onClick={() => navigateDate("next")}
              className="p-2 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Controles */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Selector de vista */}
          <div className="flex gap-1 border border-[var(--color-border)] rounded-lg p-1">
            <button
              onClick={() => setViewMode("day")}
              className={`px-4 py-2 rounded transition-colors ${
                viewMode === "day"
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
              }`}
            >
              Día
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={`px-4 py-2 rounded transition-colors ${
                viewMode === "week"
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
              }`}
            >
              Semana
            </button>
            {/* <button
              onClick={() => setViewMode("month")}
              className={`px-4 py-2 rounded transition-colors ${
                viewMode === "month"
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
              }`}
            >
              Mes
            </button> */}
          </div>

          {/* Buscador */}
          <div className="relative flex-1 min-w-[250px]">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar paciente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] transition-colors"
            />
          </div>
        </div>
      </>
    );
  }, [
    viewMode,
    weekDays,
    currentDate,
    searchTerm,
    goToToday,
    navigateDate,
    formatWeekRange,
    formatDate,
  ]);

  return (
    <div className="flex-1 flex flex-col gap-3">
      {ControlesAgenda}

      {viewMode === "day" && (
        <AgendaVistaDia
          dataSource={appointments}
          date={currentDate}
          onSelect={handleSelectCita}
          searchTerm={searchTerm}
        />
      )}
      {viewMode === "week" && (
        <AgendaVistaSemana
          dataSource={appointments}
          date={currentDate}
          onSelect={handleSelectCita}
          searchTerm={searchTerm}
        />
      )}
      {viewMode === "month" && <AgendaVistaMes />}
    </div>
  );
};
