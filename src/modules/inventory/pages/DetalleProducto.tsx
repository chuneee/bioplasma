import { useEffect, useState } from "react";
import { ProductService } from "../services/product.service";
import { Product } from "../types/product.type";
import { message } from "../../../components/shared/message/message";
import { Calendar, MapPin, Package, Tag } from "lucide-react";
import { formatCurrency, formatDate } from "../../../utils/utils";
import { MovementHistory } from "../components/movement/moventHistory";
import { API_BASE_URL } from "../../../shared/api/axios";

interface DetalleProductoProps {
  productoId: string;
  onBack: () => void;
}

export function DetalleProducto({ productoId, onBack }: DetalleProductoProps) {
  const [producto, setProducto] = useState<Product>({} as Product);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProductoDetails = async () => {
    setLoading(true);
    try {
      const respose = await ProductService.getProductById(productoId);
      setProducto(respose);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar los detalles del producto:", error);
      message.error(
        "No se pudieron cargar los detalles del producto. Por favor, inténtalo de nuevo.",
      );
      onBack();
    }
  };

  useEffect(() => {
    fetchProductoDetails();
  }, [productoId]);

  if (loading) {
    return (
      <div className="p-4">
        <p>Cargando detalles del producto...</p>
      </div>
    );
  }

  const {
    id,
    name,
    description,
    stockInfo,
    isActive,
    costUnit,
    sku,
    category,
    brand,
    location,
    imagePath,
    unit,
    stockMin,
    hasExpiration,
    expirationDate,
    salePrice,
  } = producto || {};

  const ProductHeader = () => {
    return (
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-8 mb-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sección de imagen y badges */}
          <div className="flex w-full lg:w-80  flex-col gap-4">
            {/* Imagen del producto */}
            <div className="relative w-80 h-80 bg-[#FDFBF9] rounded-lg border border-[var(--color-border)] flex items-center justify-center overflow-hidden">
              {imagePath ? (
                <img
                  src={`${API_BASE_URL}/${imagePath}`}
                  alt={name}
                  className="w-full h-full object-contain p-6"
                />
              ) : (
                <Package
                  size={64}
                  className="text-[var(--color-text-secondary)]"
                />
              )}
              {/* Badge de estado */}
              <div
                className={`absolute top-6 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
                  isActive
                    ? "bg-green-50 text-green-600 border border-green-200"
                    : "bg-gray-50 text-gray-400 border border-gray-200"
                }`}
              >
                {isActive ? "Activo" : "Inactivo"}
              </div>
            </div>

            {/* Métricas rápidas */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#FDFBF9] p-4 rounded-lg border border-[var(--color-border)] text-center">
                <small className="text-[var(--color-text-secondary)] uppercase tracking-wide mb-1">
                  Stock Mínimo
                </small>
                <p className="text-[var(--color-text)] font-semibold mt-1">
                  {stockMin}
                </p>
              </div>
              <div className="bg-[#FDFBF9] p-4 rounded-lg border border-[var(--color-border)] text-center">
                <small className="text-[var(--color-text-secondary)] uppercase tracking-wide mb-1">
                  Unidad
                </small>
                <p className="text-[var(--color-text)] font-semibold">{unit}</p>
              </div>
            </div>
          </div>

          {/* Información del producto */}
          <div className="flex-1">
            {/* Header del producto */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3 ">
                <div className="bg-[var(--color-primary)]/15 rounded-full">
                  <span
                    className="px-3 py-1  text-xs font-semibold uppercase tracking-wide"
                    style={{
                      backgroundColor: "var(--color-primary-light)",
                      color: "var(--color-primary)",
                    }}
                  >
                    {category}
                  </span>
                </div>
                <span className="text-[var(--color-border)]">|</span>
                <span className="text-[var(--color-text-secondary)] text-sm font-mono">
                  SKU: {sku}
                </span>
              </div>
              <h2 className="font-['Cormorant_Garamond'] text-[var(--color-text)] mb-2">
                {name}
              </h2>
              <p className="text-[var(--color-text-secondary)] text-lg italic">
                {brand}
              </p>
            </div>

            {/* Grid de detalles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Ubicación */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#FDFBF9] border border-[var(--color-border)] flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-[var(--color-primary]" />
                </div>
                <div>
                  <p className="text-[var(--color-text-secondary)] text-xs uppercase tracking-wide mb-1">
                    Ubicación
                  </p>
                  <p className="text-[var(--color-text)] font-medium">
                    {location}
                  </p>
                </div>
              </div>

              {/* Precio */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#FDFBF9] border border-[var(--color-border)] flex items-center justify-center flex-shrink-0">
                  <Tag size={18} className="text-[var(--color-secondary)]" />
                </div>
                <div>
                  <p className="text-[var(--color-text-secondary)] text-xs uppercase tracking-wide mb-1">
                    Precio de Venta
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-[var(--color-secondary)] text-xl font-bold">
                      {formatCurrency(salePrice ? Number(salePrice) : 0)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Vencimiento (solo si aplica) */}
              {hasExpiration && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FDFBF9] border border-[var(--color-border)] flex items-center justify-center flex-shrink-0">
                    <Calendar size={18} className="text-[var(--color-error)]" />
                  </div>
                  <div>
                    <p className="text-[var(--color-text-secondary)]  uppercase tracking-wide mb-1">
                      Vencimiento
                    </p>
                    <p className="text-[var(--color-text)] ">
                      {expirationDate
                        ? formatDate(expirationDate)
                        : "No definida"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Descripción */}
            <div className="pt-4 border-t border-[var(--color-border)]">
              <p className="text-[var(--color-text-secondary)] text-xs uppercase tracking-wide mb-2">
                Descripción del Producto
              </p>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                {description || "Sin descripción disponible"}
              </p>
            </div>
          </div>

          {/* Panel de inventario */}
          <div className="flex-1 w-full lg:w-72 bg-[#FDFBF9] rounded-lg border border-[var(--color-border)] p-6 flex-col">
            {/* Header del panel */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
              <span className="text-[var(--color-text-secondary)] text-xs uppercase tracking-widest font-semibold">
                Estado de Stock
              </span>
            </div>

            {/* Cantidad actual */}
            <div className="mb-6">
              <div className="flex items-baseline gap-2 mb-3">
                <span
                  style={{ fontSize: 50 }}
                  // className=" text-[var(--color-primary)]"
                >
                  {stockInfo?.quantity || 0}
                </span>
                <span className="text-[var(--color-text-secondary)] font-medium">
                  {unit}
                </span>
              </div>

              {/* Barra de progreso */}
              <div className="w-full bg-[var(--color-border)] h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(((stockInfo?.quantity || 0) / ((stockMin || 1) * 5)) * 100, 100)}%`,
                  }}
                />
              </div>

              {/* Estado del inventario */}
              <p className="text-[var(--color-text-secondary)] text-xs mt-2 italic">
                {(Number(stockInfo?.quantity) || 0) <= (Number(stockMin) || 0)
                  ? "Requiere reabastecimiento"
                  : (Number(stockInfo?.quantity) || 0) === 0
                    ? "Sin stock"
                    : "Normal"}
              </p>
            </div>

            {/* Información financiera */}
            <div className="mt-auto space-y-4 pt-6 border-t border-[var(--color-border)]">
              <div className="flex justify-between items-center">
                <span className="text-[var(--color-text-secondary)] text-xs uppercase tracking-wide">
                  Costo Unitario
                </span>
                <span className="text-[var(--color-text)] font-semibold">
                  {formatCurrency(costUnit || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--color-text-secondary)] text-xs uppercase tracking-wide">
                  Inversión Total
                </span>
                <span className="text-[var(--color-secondary)] font-bold text-lg">
                  {formatCurrency((costUnit || 0) * (stockInfo?.quantity || 0))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 mx-auto">
      <ProductHeader />

      <div className="bg-white rounded-xl border border-[var(--color-border)] mb-6  h-full">
        <MovementHistory productId={id} />
      </div>
    </div>
  );
}
