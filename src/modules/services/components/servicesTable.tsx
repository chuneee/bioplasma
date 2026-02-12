import { useEffect, useState } from "react";
import { categoriasConfig, CategoriaServicio } from "../utils/utils";
import { formatCurrency } from "../../../utils/utils";
import { Copy, Edit2, Trash2 } from "lucide-react";
import { Service } from "../types/service.type";
import { usePermissions } from "../../auth/hooks/usePermissions";

interface ServicesTableProps {
  serviciosList: Service[];
  onEdit?: (serviceId: string, isCopy?: boolean) => void;
  onDelete?: (serviceId: string) => void;
  onDisable?: (serviceId: string) => void;
  onShowDetails?: (serviceId: string) => void;
}

export const ServicesTable = ({
  serviciosList,
  onEdit,
  onDelete,
  onDisable,
  onShowDetails,
}: ServicesTableProps) => {
  const [servicios, setServicios] = useState<Service[]>([]);
  useEffect(() => {
    setServicios(serviciosList);
  }, [serviciosList]);

  const { hasPermission } = usePermissions();

  const handleEdit = (serviceId: string, isCopy: boolean = false) => {
    onEdit?.(serviceId, isCopy);
  };

  const handleDelete = (serviceId: string) => {
    onDelete?.(serviceId);
  };

  const handleDisable = (serviceId: string) => {
    onDisable?.(serviceId);
  };

  const handleShowDetails = (serviceId: string) => {
    onShowDetails?.(serviceId);
  };

  return (
    <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F5F2EF] border-b border-[var(--color-border)]">
              <th
                className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide"
                style={{ fontSize: "12px", fontWeight: 600 }}
              >
                Servicio
              </th>
              <th
                className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide"
                style={{ fontSize: "12px", fontWeight: 600 }}
              >
                Categoría
              </th>
              <th
                className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide"
                style={{ fontSize: "12px", fontWeight: 600 }}
              >
                Duración
              </th>
              <th
                className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide"
                style={{ fontSize: "12px", fontWeight: 600 }}
              >
                Precio
              </th>
              <th
                className="text-center px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide"
                style={{ fontSize: "12px", fontWeight: 600 }}
              >
                Insumos
              </th>
              <th
                className="text-center px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide"
                style={{ fontSize: "12px", fontWeight: 600 }}
              >
                Estado
              </th>
              <th
                className="text-center px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide"
                style={{ fontSize: "12px", fontWeight: 600 }}
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {servicios.map((servicio) => {
              const categoria =
                categoriasConfig[
                  servicio.category.toLowerCase() as CategoriaServicio
                ];
              return (
                <tr
                  onClick={() => handleShowDetails(servicio.id)}
                  key={servicio.id}
                  className="border-b border-[var(--color-border)] hover:bg-[#FDFBF9] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <div style={{ fontWeight: 600 }}>{servicio.name}</div>
                      <div
                        className="text-[var(--color-text-secondary)] line-clamp-1"
                        style={{ fontSize: "13px" }}
                      >
                        {servicio.shortDescription}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="px-2 py-1 rounded-full"
                      style={{
                        fontSize: "12px",
                        fontWeight: 500,
                        backgroundColor: categoria.bgColor,
                        color: categoria.color,
                      }}
                    >
                      {categoria.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span>{servicio.durationMinutes} min</span>
                  </td>
                  <td className="px-6 py-4">
                    {Number(servicio.promoPrice) > 0 ? (
                      <div>
                        <div
                          className="text-[var(--color-text-secondary)] line-through"
                          style={{ fontSize: "13px" }}
                        >
                          {formatCurrency(Number(servicio.price))}
                        </div>
                        <div style={{ fontWeight: 600 }}>
                          {formatCurrency(Number(servicio.promoPrice))}
                        </div>
                      </div>
                    ) : (
                      <span style={{ fontWeight: 600 }}>
                        {formatCurrency(Number(servicio.price))}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {servicio.supplies.length > 0 ? (
                      <span>{servicio.supplies.length}</span>
                    ) : (
                      <span className="text-[var(--color-text-secondary)]">
                        —
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-white ${
                        servicio.isActive
                          ? "bg-[var(--color-success)]"
                          : "bg-[var(--color-text-secondary)]"
                      }`}
                      style={{ fontSize: "12px", fontWeight: 500 }}
                    >
                      {servicio.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(servicio.id);
                        }}
                        className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[#8B7355]/10 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(servicio.id, true);
                        }}
                        className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[#8B7355]/10 rounded-lg transition-colors"
                      >
                        <Copy size={16} />
                      </button>
                      {hasPermission("services.delete") && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(servicio.id);
                          }}
                          className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-error)] hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
