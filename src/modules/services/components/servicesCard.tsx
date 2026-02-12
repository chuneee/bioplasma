import { useEffect, useState } from "react";
import {
  calcularCostoInsumos,
  categoriasConfig,
  CategoriaServicio,
} from "../utils/utils";
import {
  AlertCircle,
  Clock,
  Copy,
  DollarSign,
  Edit2,
  Eye,
  EyeOff,
  MoreVertical,
  Package,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { formatCurrency } from "../../../utils/utils";
import { Service } from "../types/service.type";
import dayjs from "dayjs";
import { usePermissions } from "../../auth/hooks/usePermissions";

interface ServicesCardProps {
  serviciosList: Service[];
  onEdit?: (serviceId: string, isCopy?: boolean) => void;
  onDelete?: (serviceId: string) => void;
  onDisable?: (serviceId: string) => void;
  onShowDetails?: (serviceId: string) => void;
}

export const ServicesCard = ({
  serviciosList,
  onEdit,
  onDelete,
  onDisable,
  onShowDetails,
}: ServicesCardProps) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [servicios, setServicios] = useState<Service[]>([]);
  const { hasPermission } = usePermissions();

  useEffect(() => {
    setServicios(serviciosList);
  }, [serviciosList]);

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {servicios.map((servicio) => {
        const categoria =
          categoriasConfig[
            servicio.category.toLowerCase() as CategoriaServicio
          ];
        const costoInsumos = calcularCostoInsumos(servicio.supplies);

        return (
          <div
            key={servicio.id}
            className={`bg-white rounded-xl border transition-all hover:shadow-lg ${
              servicio.type === "PAQUETE"
                ? "border-[#9D6FD8] border-2"
                : "border-[var(--color-border)]"
            }`}
          >
            {/* Header de la tarjeta */}
            <div className="p-5 border-b border-[var(--color-border)]">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {servicio.type === "PAQUETE" && (
                    <Package size={18} className="text-[#9D6FD8]" />
                  )}
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
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      servicio.isActive
                        ? "bg-[var(--color-success)]"
                        : "bg-[var(--color-text-secondary)]"
                    }`}
                  ></div>
                  <div className="relative">
                    <button
                      onClick={() =>
                        setActiveMenu(
                          activeMenu === servicio.id ? null : servicio.id,
                        )
                      }
                      className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
                    >
                      <MoreVertical size={18} />
                    </button>
                    {activeMenu === servicio.id && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-[var(--color-border)] py-1 z-10">
                        <button
                          onClick={() => handleEdit(servicio.id)}
                          className="w-full px-4 py-2 text-left hover:bg-[#F5F2EF] flex items-center gap-2"
                        >
                          <Edit2 size={16} />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => handleEdit(servicio.id, true)}
                          className="w-full px-4 py-2 text-left hover:bg-[#F5F2EF] flex items-center gap-2"
                        >
                          <Copy size={16} />
                          <span>Duplicar</span>
                        </button>
                        <button
                          onClick={() => handleDisable(servicio.id)}
                          className="w-full px-4 py-2 text-left hover:bg-[#F5F2EF] flex items-center gap-2"
                        >
                          {servicio.isActive ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                          <span>
                            {servicio.isActive ? "Desactivar" : "Activar"}
                          </span>
                        </button>
                        {hasPermission("services.delete") && (
                          <button
                            onClick={() => handleDelete(servicio.id)}
                            className="w-full px-4 py-2 text-left hover:bg-[#F5F2EF] flex items-center gap-2 text-[var(--color-error)]"
                          >
                            <Trash2 size={16} />
                            <span>Eliminar</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <h3 className="mb-2" style={{ fontWeight: 600 }}>
                {servicio.name}
              </h3>
              <p
                className="text-[var(--color-text-secondary)] line-clamp-2"
                style={{ fontSize: "14px" }}
              >
                {servicio.shortDescription}
              </p>
            </div>
            {/* Cuerpo de la tarjeta */}
            <div className="p-5 space-y-3">
              {/* Paquete - Servicios incluidos */}
              {servicio.type === "PAQUETE" && servicio.packageItems && (
                <div className="mb-3 p-3 bg-[#9D6FD815] rounded-lg">
                  <p
                    className="mb-2"
                    style={{ fontSize: "13px", fontWeight: 600 }}
                  >
                    Incluye:
                  </p>
                  <ul className="space-y-1">
                    {servicio.packageItems.map((s, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-[var(--color-text-secondary)]"
                        style={{ fontSize: "13px" }}
                      >
                        <span className="text-[#9D6FD8] mt-0.5">✓</span>
                        <span>{s.service.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Información clave */}
              <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                <Clock size={16} />
                <span style={{ fontSize: "14px" }}>
                  {servicio.durationMinutes} minutos
                </span>
              </div>
              {servicio.type === "PAQUETE" &&
              Number(servicio.promoPrice) > 0 ? (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign
                      size={16}
                      className="text-[var(--color-text-secondary)]"
                    />
                    <span
                      className="text-[var(--color-text-secondary)] line-through"
                      style={{ fontSize: "14px" }}
                    >
                      {formatCurrency(Number(servicio.price))}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span
                      className="text-[var(--color-secondary)]"
                      style={{ fontSize: "24px", fontWeight: 700 }}
                    >
                      {formatCurrency(Number(servicio.promoPrice))}
                    </span>
                    <span
                      className="text-green-600"
                      style={{ fontSize: "13px", fontWeight: 600 }}
                    >
                      Ahorra{" "}
                      {formatCurrency(
                        Number(servicio.price) - Number(servicio.promoPrice),
                      )}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-baseline gap-2">
                  <DollarSign
                    size={16}
                    className="text-[var(--color-text-secondary)]"
                  />
                  {Number(servicio.promoPrice) > 0 ? (
                    <>
                      <span
                        className="text-[var(--color-text-secondary)] line-through"
                        style={{ fontSize: "14px" }}
                      >
                        {formatCurrency(Number(servicio.price))}
                      </span>
                      <span
                        className="text-[var(--color-secondary)]"
                        style={{ fontSize: "20px", fontWeight: 700 }}
                      >
                        {formatCurrency(Number(servicio.promoPrice))}
                      </span>
                    </>
                  ) : (
                    <span
                      className="text-[var(--color-secondary)]"
                      style={{ fontSize: "20px", fontWeight: 700 }}
                    >
                      {formatCurrency(Number(servicio.price))}
                    </span>
                  )}
                </div>
              )}
              {/* Insumos */}
              {servicio.supplies.length > 0 && servicio.type !== "PAQUETE" && (
                <div className="pt-3 border-t border-[var(--color-border)]">
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-1 bg-[#F5F2EF] rounded text-[var(--color-text-secondary)]"
                      style={{ fontSize: "12px" }}
                    >
                      {servicio.supplies.length} insumos
                    </span>
                    <span
                      className="text-[var(--color-text-secondary)]"
                      style={{ fontSize: "12px" }}
                    >
                      Costo: {formatCurrency(costoInsumos)}
                    </span>
                  </div>
                </div>
              )}
              {/* Vigencia para paquetes */}
              {servicio.type === "PAQUETE" && servicio.promoEndAt && (
                <div
                  className="flex items-center gap-2 text-[var(--color-warning)]"
                  style={{ fontSize: "13px" }}
                >
                  <AlertCircle size={14} />
                  <span>
                    Válido hasta{" "}
                    {dayjs(servicio.promoEndAt)
                      .locale("es")
                      .format("DD MMM YYYY")}
                  </span>
                </div>
              )}
              {/* Estadística */}
              {Number(servicio.timesPerformed) > 0 && (
                <div
                  className="flex items-center gap-2 text-[var(--color-text-secondary)]"
                  style={{ fontSize: "13px" }}
                >
                  <TrendingUp size={14} />
                  <span>Realizado {servicio.timesPerformed} veces</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-[var(--color-border)]">
              <button
                onClick={() => handleShowDetails(servicio.id)}
                className="w-full py-2 border border-[var(--color-primary)] text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary)] hover:text-white transition-colors"
              >
                Ver detalles
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
