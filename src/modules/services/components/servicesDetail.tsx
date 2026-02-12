import { useEffect, useState } from "react";
import { Service } from "../types/service.type";
import {
  AlertCircle,
  CalendarPlus,
  Clock,
  DollarSign,
  Edit,
  Loader,
  Package,
  PackageX,
  TrendingUp,
  X,
} from "lucide-react";
import { calcularCostoInsumos, categoriasConfig } from "../utils/utils";
import { formatCurrency, formatDate } from "../../../utils/utils";
import dayjs from "dayjs";

interface ServicesDetailModalProps {
  service: Service;
  open: boolean;
  onClose: () => void;
}

export const ServicesDetailModal = ({
  service,
  open,
  onClose,
}: ServicesDetailModalProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [serviceData, setServiceData] = useState<Service>({} as Service);

  useEffect(() => {
    if (open) {
      setIsLoading(true);
      // Simulación de carga de datos
      setTimeout(() => {
        setServiceData(service);
        setIsLoading(false);
      }, 500);
    }
  }, [service, open]);

  // Ahora sí puedes hacer el return condicional DESPUÉS de todos los hooks
  if (!open) {
    return null;
  }

  const handleClose = () => {
    setServiceData({} as Service);
    onClose?.();
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="flex items-center justify-center gap-2 text-white">
          <Loader size={40} />
        </div>
      </div>
    );
  }

  if (!serviceData || !serviceData.id) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div
          style={{
            minHeight: 100,
            maxWidth: 500,
          }}
          className="flex justify-center bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-5"
        >
          <div className="flex flex-col items-center gap-2 w-full">
            <div className="border-b border-[var(--color-border)]  w-full flex justify-center text-[var(--color-warning)]">
              <PackageX size={50} style={{ margin: 10 }} />
            </div>
            <p
              className="text-[var(--color-text-secondary)] text-center mt-4"
              style={{ fontSize: "14px" }}
            >
              No se pudo cargar la información del servicio.
            </p>
            <button
              onClick={handleClose}
              className="w-full mt-4 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
            >
              <span className="flex items-center gap-2 justify-center">
                <X size={16} className="inline" />
                Cerrar
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const ServiceDataInfo = () => {
    const {
      id,
      name,
      description,
      shortDescription,
      durationMinutes,
      promoPrice,
      promoEndAt,
      timesPerformed,
      packageItems,
      type,
      category,
      supplies,
      isActive,
      price,
      createdAt,
      updatedAt,
    } = serviceData || {};

    const categoria =
      categoriasConfig[
        category?.toLowerCase() as keyof typeof categoriasConfig
      ] || categoriasConfig["otros"];
    const costoInsumos = calcularCostoInsumos(supplies || []);

    return (
      <div
        key={id}
        className={`bg-white w-full rounded-xl border transition-all hover:shadow-lg ${
          type === "PAQUETE"
            ? "border-[#9D6FD8] border-2"
            : "border-[var(--color-border)]"
        }`}
      >
        {/* Header de la tarjeta */}
        <div className="p-5 border-b border-[var(--color-border)]">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              {type === "PAQUETE" && (
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
                  isActive
                    ? "bg-[var(--color-success)]"
                    : "bg-[var(--color-text-secondary)]"
                }`}
              ></div>
              <div className="relative">
                <button
                  onClick={handleClose}
                  className="realtive top-3 right-3 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </div>
          <h3 className="mb-2" style={{ fontWeight: 600 }}>
            {name}
          </h3>
          <p
            className="text-[var(--color-text-secondary)] line-clamp-2"
            style={{ fontSize: "14px" }}
          >
            {shortDescription}
          </p>
          <section className="mt-3" hidden={!description}>
            <h5>Descripción:</h5>
            <p
              className="text-[var(--color-text-secondary)] line-clamp-2"
              style={{ fontSize: "12px" }}
            >
              {description}
            </p>
          </section>
        </div>
        {/* Cuerpo de la tarjeta */}
        <div className="p-5 space-y-3">
          {/* Paquete - Servicios incluidos */}
          {type === "PAQUETE" && packageItems && (
            <div className="mb-3 p-3 bg-[#9D6FD815] rounded-lg">
              <p className="mb-2" style={{ fontSize: "13px", fontWeight: 600 }}>
                Incluye:
              </p>
              <ul className="space-y-1">
                {packageItems.map((s, idx) => (
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
          <div className="flex items-center gap-4 text-[var(--color-text-secondary)]">
            <span
              className="flex items-center gap-2"
              style={{ fontSize: "14px" }}
            >
              <Clock className="inline" size={16} />
              {durationMinutes} minutos
            </span>
            <span
              className="flex items-center gap-2"
              style={{ fontSize: "14px" }}
            >
              <CalendarPlus className="inline" size={16} />
              {createdAt ? formatDate(createdAt) : "—"}
            </span>
            <span
              className="flex items-center gap-2"
              style={{ fontSize: "14px" }}
            >
              <Edit className="inline" size={16} />
              {updatedAt ? formatDate(updatedAt) : "—"}
            </span>
          </div>
          {type === "PAQUETE" && Number(promoPrice) > 0 ? (
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
                  {formatCurrency(Number(price))}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span
                  className="text-[var(--color-secondary)]"
                  style={{ fontSize: "24px", fontWeight: 700 }}
                >
                  {formatCurrency(Number(promoPrice))}
                </span>
                <span
                  className="text-green-600"
                  style={{ fontSize: "13px", fontWeight: 600 }}
                >
                  Ahorra {formatCurrency(Number(price) - Number(promoPrice))}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-baseline gap-2">
              <DollarSign
                size={16}
                className="text-[var(--color-text-secondary)]"
              />
              {Number(promoPrice) > 0 ? (
                <>
                  <span
                    className="text-[var(--color-text-secondary)] line-through"
                    style={{ fontSize: "14px" }}
                  >
                    {formatCurrency(Number(price))}
                  </span>
                  <span
                    className="text-[var(--color-secondary)]"
                    style={{ fontSize: "20px", fontWeight: 700 }}
                  >
                    {formatCurrency(Number(promoPrice))}
                  </span>
                </>
              ) : (
                <span
                  className="text-[var(--color-secondary)]"
                  style={{ fontSize: "20px", fontWeight: 700 }}
                >
                  {formatCurrency(Number(price))}
                </span>
              )}
            </div>
          )}
          {/* Insumos */}
          {supplies.length > 0 && type !== "PAQUETE" && (
            <div className="pt-3 border-t border-[var(--color-border)]">
              <h5>
                <span className="text-green-600">+ {supplies.length}</span>{" "}
                Insumos
              </h5>
              <ul className="mt-2">
                {supplies.map((s) => (
                  <li key={s.id}>
                    <span
                      className="px-2 py-1 bg-[#F5F2EF] rounded text-[var(--color-text-secondary)]"
                      style={{
                        fontSize: "14px",
                        margin: "2px 2px",
                        display: "inline-block",
                      }}
                    >
                      - {s.product.name}:{" "}
                      <span className="text-green-600">
                        + {s.quantity} {s.product.unit}
                      </span>
                      {" - "}
                      <span className="ml-2 text-[var(--color-secondary)]">
                        {formatCurrency(
                          Number(s.product.costUnit) * Number(s.quantity),
                        )}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2 mt-3 bg-[var(--color-bg)] p-3 rounded">
                <span
                  className="text-[var(--color-text-secondary)]"
                  style={{ fontSize: "13px" }}
                >
                  Costo total de insumos:{" "}
                </span>
                <span
                  className="text-green-600"
                  style={{ fontSize: "13px", fontWeight: 600 }}
                >
                  {formatCurrency(costoInsumos)}
                </span>
              </div>
            </div>
          )}
          {/* Vigencia para paquetes */}
          {type === "PAQUETE" && promoEndAt && (
            <div
              className="flex items-center gap-2 text-[var(--color-warning)]"
              style={{ fontSize: "13px" }}
            >
              <AlertCircle size={14} />
              <span>
                Válido hasta{" "}
                {dayjs(promoEndAt).locale("es").format("DD MMM YYYY")}
              </span>
            </div>
          )}
          {/* Estadística */}
          {Number(timesPerformed) > 0 && (
            <div
              className="flex items-center gap-2 text-[var(--color-text-secondary)]"
              style={{ fontSize: "13px" }}
            >
              <TrendingUp size={14} />
              <span>Realizado {timesPerformed} veces</span>
            </div>
          )}
          <div className="border-t border-[var(--color-border)]">
            <h5>Notas:</h5>
            <p
              className="text-[var(--color-text-secondary)]"
              style={{ fontSize: "13px" }}
            >
              {serviceData.notes || "No hay notas adicionales."}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const Modal = () => {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div style={{ width: 500 }}>
          <ServiceDataInfo />
        </div>
      </div>
    );
  };

  return <Modal />;
};
