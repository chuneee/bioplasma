import { Grid3x3, List, Search } from "lucide-react";

interface FiltrosServiciosProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterEstado: string;
  setFilterEstado: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  viewMode: "cards" | "table";
  setViewMode: (value: "cards" | "table") => void;
}

export const FiltrosServicios = ({
  searchTerm,
  setSearchTerm,
  filterEstado,
  setFilterEstado,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
}: FiltrosServiciosProps) => {
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
            placeholder="Buscar servicio..."
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
          <option value="activos">Activos</option>
          <option value="inactivos">Inactivos</option>
        </select>

        {/* Ordenar por */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] bg-white"
        >
          <option value="nombre-az">Nombre A-Z</option>
          <option value="nombre-za">Nombre Z-A</option>
          <option value="precio-mayor">Precio mayor</option>
          <option value="precio-menor">Precio menor</option>
          <option value="populares">Más populares</option>
        </select>

        {/* Vista toggle */}
        <div className="flex gap-2 border border-[var(--color-border)] rounded-lg p-1">
          <button
            onClick={() => setViewMode("cards")}
            className={`p-2 rounded transition-colors ${
              viewMode === "cards"
                ? "bg-[var(--color-primary)] text-white"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            }`}
          >
            <Grid3x3 size={18} />
          </button>
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
        </div>
      </div>
    </div>
  );
};
