import dayjs from "dayjs";
import { Calendar, Search } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface FiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterEstado: string;
  setFilterEstado: (estado: string) => void;
  currentYear: number;
  setCurrentYear: (year: number) => void;
  currentMonth: number;
  setCurrentMonth: (month: number) => void;
}

export const Filters = ({
  searchTerm,
  setSearchTerm,
  filterEstado,
  setFilterEstado,
  currentYear,
  setCurrentYear,
  currentMonth,
  setCurrentMonth,
}: FiltersProps) => {
  return (
    <div className="bg-white rounded-xl border border-[var(--color-border)] p-4 mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        {/* Buscador */}
        <div className="relative flex-1 min-w-[300px]">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar por paciente o folio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] transition-colors"
          />
        </div>

        {/* Filtro por Estado */}
        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          className="px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] bg-white"
        >
          <option value="todas">Todos los estados</option>
          <option value="pendiente">Pendientes</option>
          <option value="enviada">Enviadas</option>
          <option value="negociacion">En negociación</option>
          <option value="cerrada">Cerradas</option>
          <option value="vencida">Vencidas</option>
          <option value="rechazada">Rechazadas</option>
        </select>
        {/* Filtro por Año */}
        <div className="px-4 flex gap-2 items-center border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] bg-white">
          <span>
            <Calendar
              size={20}
              className="relative text-[var(--color-text-secondary)] mr-2"
            />
          </span>
          <DatePicker
            locale={"es"}
            selected={new Date(currentYear, currentMonth - 1)}
            onChange={(date: Date | null) => {
              if (date) {
                const Fecha = dayjs(date);
                setCurrentYear(Fecha.year());
                setCurrentMonth(Fecha.month() + 1);
              }
            }}
            dateFormat="yyyy-MMMM"
            showMonthYearPicker
            className=" py-2.5  outline-none transition-colors bg-transparent"
          />
        </div>
      </div>
    </div>
  );
};
