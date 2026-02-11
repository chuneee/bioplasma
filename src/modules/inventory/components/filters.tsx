import { Search } from "lucide-react";
import { useEffect, useState } from "react";

interface ProductFiltersProps {
  onSearch(value: string): void;
  onSelectedCategoria(value: string): void;
  onSelectedEstado(value: string): void;
  onSortBy(value: string): void;
}

export const ProductFilters = ({
  onSearch,
  onSelectedCategoria,
  onSelectedEstado,
  onSortBy,
}: ProductFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState<string>("todas");
  const [sortBy, setSortBy] = useState("nombre-az");

  useEffect(() => {
    onSearch(searchTerm);
  }, [searchTerm, onSearch]);

  useEffect(() => {
    onSelectedCategoria(selectedCategoria);
  }, [selectedCategoria, onSelectedCategoria]);

  useEffect(() => {
    onSortBy(sortBy);
  }, [sortBy, onSortBy]);

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
            placeholder="Buscar producto, SKU o marca..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] transition-colors"
          />
        </div>

        {/* Filtro por Categoría */}
        <select
          value={selectedCategoria}
          onChange={(e) => setSelectedCategoria(e.target.value)}
          className="px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] bg-white"
        >
          <option value="todas">Todas las categorías</option>
          <option value="insumo-medico">Insumos médicos</option>
          <option value="facial">Productos faciales</option>
          <option value="corporal">Productos corporales</option>
          <option value="inyectable">Inyectables</option>
          <option value="consumible">Consumibles</option>
          <option value="equipamiento">Equipamiento</option>
        </select>

        {/* Ordenar por */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] bg-white"
        >
          <option value="nombre-az">Nombre A-Z</option>
          <option value="nombre-za">Nombre Z-A</option>
          <option value="stock-menor">Stock menor</option>
          <option value="stock-mayor">Stock mayor</option>
          <option value="caducar">Próximo a caducar</option>
          <option value="precio-mayor">Precio mayor</option>
          <option value="precio-menor">Precio menor</option>
        </select>
      </div>
    </div>
  );
};
