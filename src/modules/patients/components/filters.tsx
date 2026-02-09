import { Grid3x3, List, Search } from "lucide-react";
import { useEffect, useState } from "react";

interface FiltersProps {
  onSearchChange: (value: string) => void;
  onFilterEstadoChange: (value: string) => void;
  onSortByChange: (value: string) => void;
  onViewModeChange: (value: "table" | "grid") => void;
  onDateFilterChange: (value: string) => void;
}

export const Filters = ({
  onSearchChange,
  onFilterEstadoChange,
  onSortByChange,
  onViewModeChange,
  onDateFilterChange,
}: FiltersProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [filterTratamiento, setFilterTratamiento] = useState("cualquier");
  const [sortBy, setSortBy] = useState("nombre-az");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Efectos para propagar los cambios a los padres
  useEffect(() => {
    onSearchChange(searchTerm);
  }, [searchTerm, onSearchChange]);

  useEffect(() => {
    onFilterEstadoChange(filterEstado);
  }, [filterEstado, onFilterEstadoChange]);

  useEffect(() => {
    onSortByChange(sortBy);
  }, [sortBy, onSortByChange]);

  useEffect(() => {
    onViewModeChange(viewMode);
  }, [viewMode, onViewModeChange]);

  useEffect(() => {
    onDateFilterChange(filterTratamiento);
  }, [filterTratamiento, onDateFilterChange]);

  return (
    <div className="bg-white rounded-xl border border-[var(--color-border)] p-4 mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        {/* Buscador */}
        <div className="relative flex-1 min-w-[320px]">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar por nombre, teléfono o correo..."
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
          <option value="todos">Todos</option>
          <option value="activo">Activos</option>
          <option value="inactivo">Inactivos</option>
        </select>

        {/* Filtro por Último Tratamiento */}
        <select
          value={filterTratamiento}
          onChange={(e) => setFilterTratamiento(e.target.value)}
          className="px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] bg-white"
        >
          <option value="cualquier">Cualquier fecha</option>
          <option value="semana">Última semana</option>
          <option value="mes">Último mes</option>
          <option value="tres-meses">Últimos 3 meses</option>
          <option value="seis-meses">Más de 6 meses</option>
        </select>

        {/* Ordenar por */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] bg-white"
        >
          <option value="nombre-az">Nombre A-Z</option>
          <option value="nombre-za">Nombre Z-A</option>
          <option value="recientes">Más recientes</option>
          <option value="antiguos">Más antiguos</option>
          <option value="ultima-visita">Última visita</option>
        </select>

        {/* Vista toggle */}
        <div className="flex gap-2 border border-[var(--color-border)] rounded-lg p-1">
          <button
            onClick={() => setViewMode("table")}
            className={`p-2 rounded transition-colors ${
              viewMode === "table"
                ? "bg-[var(--color-primary)] text-white"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            }`}
          >
            <List size={18} />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded transition-colors ${
              viewMode === "grid"
                ? "bg-[var(--color-primary)] text-white"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            }`}
          >
            <Grid3x3 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
