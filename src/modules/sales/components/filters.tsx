import { Search } from "lucide-react";

interface FiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterTipo: string;
  setFilterTipo: (tipo: string) => void;
  filterMetodo: string;
  setFilterMetodo: (metodo: string) => void;
}

export const Filters = ({
  searchTerm,
  setSearchTerm,
  filterTipo,
  setFilterTipo,
  filterMetodo,
  setFilterMetodo,
}: FiltersProps) => {
  return (
    <div className="bg-white rounded-xl border border-[var(--color-border)] p-4 mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[300px]">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar por folio, paciente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] transition-colors"
          />
        </div>

        <select
          value={filterTipo}
          onChange={(e) => setFilterTipo(e.target.value)}
          className="px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] bg-white"
        >
          <option value="">Todos los tipos</option>
          <option value="COTIZACION">Desde cotización</option>
          <option value="DIRECTA">Venta directa</option>
        </select>

        <select
          value={filterMetodo}
          onChange={(e) => setFilterMetodo(e.target.value)}
          className="px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] bg-white"
        >
          <option value="">Todos los pagos</option>
          <option value="efectivo">Efectivo</option>
          <option value="tarjeta-credito">Tarjeta crédito</option>
          <option value="tarjeta-debito">Tarjeta débito</option>
          <option value="transferencia">Transferencia</option>
          <option value="multiple">Múltiple</option>
        </select>
      </div>
    </div>
  );
};
