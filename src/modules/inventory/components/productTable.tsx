import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Clock,
  Edit,
  Eye,
  MoreVertical,
  Package,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { formatCurrency, formatDate } from "../../../utils/utils";
import { Product } from "../types/product.type";
import { API_BASE_URL } from "../../../shared/api/axios";
import {
  categoriasConfig,
  estadosConfig,
  getDaysUntilExpiry,
  getStatus,
} from "../utils/utils";
import { usePermissions } from "../../auth/hooks/usePermissions";

interface ProductTableProps {
  productosList: Product[];
  onEditProduct?: (id: string) => void;
  onDeleteProduct?: (id: string) => void;
  onNavigateTo: (id: string) => void;
}

export const ProductTable = ({
  productosList,
  onEditProduct,
  onDeleteProduct,
  onNavigateTo,
}: ProductTableProps) => {
  const [productos, setProductos] = useState<Product[]>([]);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const { hasPermission } = usePermissions();

  useEffect(() => {
    productosList && setProductos(productosList || []);
  }, [productosList]);

  const getRowBackgroundClass = (producto: Product) => {
    if (producto.stockInfo.quantity <= 0) return "bg-red-50";
    if (Number(producto.stockInfo.quantity) <= Number(producto.stockMin))
      return "bg-amber-50";
    return "";
  };

  const handleEditClick = (id: string) => {
    onEditProduct?.(id);
  };

  const handleDeleteClick = (id: string) => {
    onDeleteProduct?.(id);
  };

  const ActionsButtons = () => {
    return (
      <>
        <button
          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
          title="Agregar stock"
        >
          <ArrowUp size={16} />
        </button>
        <button
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Registrar uso"
        >
          <ArrowDown size={16} />
        </button>
        <button
          className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[#8B7355]/10 rounded-lg transition-colors"
          title="Ver movimientos"
        >
          <Eye size={16} />
        </button>
      </>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden h-screen">
      <div className="overflow-x-auto h-full">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F5F2EF] border-b border-[var(--color-border)]">
              <th
                className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide"
                style={{ fontSize: "12px", fontWeight: 600 }}
              >
                Producto
              </th>
              <th
                className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide"
                style={{ fontSize: "12px", fontWeight: 600 }}
              >
                SKU
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
                Stock Actual
              </th>
              <th
                className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide"
                style={{ fontSize: "12px", fontWeight: 600 }}
              >
                Mínimo
              </th>
              <th
                className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide"
                style={{ fontSize: "12px", fontWeight: 600 }}
              >
                Costo Unit.
              </th>
              <th
                className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide"
                style={{ fontSize: "12px", fontWeight: 600 }}
              >
                Valor Total
              </th>
              <th
                className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide"
                style={{ fontSize: "12px", fontWeight: 600 }}
              >
                Caducidad
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
                Pago a Proveedor
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
            {productos.map((producto) => {
              const categoria = categoriasConfig[producto.category];
              const status = getStatus(producto);
              const estado = estadosConfig[status];
              const valorTotal =
                producto.stockInfo.quantity * producto.costUnit;
              const daysUntilExpiry = getDaysUntilExpiry(
                producto.expirationDate || undefined,
              );

              const imageUrl = producto.imagePath
                ? `${API_BASE_URL}/${producto.imagePath}`
                : null;

              return (
                <tr
                  key={producto.id}
                  onClick={() => {
                    onNavigateTo(producto.id);
                  }}
                  className={`border-b border-[var(--color-border)] hover:bg-[#FDFBF9] transition-colors ${getRowBackgroundClass(producto)} ${
                    ["agotado", "por-caducar"].includes(status)
                      ? "border-l-4 border-l-red-500"
                      : ""
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#F5F2EF] flex items-center justify-center flex-shrink-0">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={producto.name}
                            className="w-full h-full object-cover rounded-lg border border-[var(--color-border)]"
                          />
                        ) : (
                          <Package
                            size={20}
                            className="text-[var(--color-text-secondary)]"
                          />
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{producto.name}</div>
                        {producto.brand && (
                          <div
                            className="text-[var(--color-text-secondary)]"
                            style={{ fontSize: "13px" }}
                          >
                            {producto.brand}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="font-mono text-[var(--color-text-secondary)]"
                      style={{ fontSize: "13px" }}
                    >
                      {producto.sku}
                    </span>
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
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: "18px", fontWeight: 600 }}>
                        {producto.stockInfo.quantity}
                      </span>
                      <span
                        className="text-[var(--color-text-secondary)]"
                        style={{ fontSize: "13px" }}
                      >
                        {producto.unit}
                      </span>
                      {Number(producto.stockInfo.quantity) <=
                        Number(producto.stockMin) &&
                        Number(producto.stockInfo.quantity) > 0 && (
                          <AlertTriangle size={16} className="text-amber-500" />
                        )}
                      {Number(producto.stockInfo.quantity) <= 0 && (
                        <AlertTriangle size={16} className="text-red-500" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[var(--color-text-secondary)]">
                      {producto.stockMin}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span style={{ fontWeight: 600 }}>
                      {formatCurrency(producto.costUnit)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span style={{ fontWeight: 600 }}>
                      {formatCurrency(valorTotal)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {producto.hasExpiration ? (
                      <div>
                        <div
                          className={`${
                            daysUntilExpiry && daysUntilExpiry < 30
                              ? "text-red-600"
                              : daysUntilExpiry && daysUntilExpiry < 60
                                ? "text-amber-600"
                                : "text-[var(--color-text)]"
                          }`}
                        >
                          {formatDate(producto.expirationDate || "")}
                        </div>
                        {daysUntilExpiry && daysUntilExpiry < 30 && (
                          <div
                            className="text-red-600 flex items-center gap-1 mt-1"
                            style={{ fontSize: "12px" }}
                          >
                            <Clock size={12} />
                            <span>{daysUntilExpiry} días</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-[var(--color-text-secondary)]">
                        —
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className="inline-flex px-3 py-1 rounded-full"
                      style={{
                        fontSize: "12px",
                        fontWeight: 500,
                        backgroundColor: estado?.bgColor || "transparent",
                        color: estado?.color || "inherit",
                      }}
                    >
                      {estado?.label || "Desconocido"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className="inline-flex px-3 py-1 rounded-full"
                      style={{
                        fontSize: "12px",
                        fontWeight: 500,

                        color:
                          producto.stockInfo.paymentStatus === "PAGADO"
                            ? "#7DB07D"
                            : "#E0A75E",
                      }}
                    >
                      {producto.stockInfo.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenu(
                              activeMenu === producto.id ? null : producto.id,
                            );
                          }}
                          className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[#8B7355]/10 rounded-lg transition-colors"
                        >
                          <MoreVertical size={16} />
                        </button>
                        {activeMenu === producto.id && (
                          <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-[var(--color-border)] py-1 z-50">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick(producto.id);
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-[#F5F2EF] flex items-center gap-2"
                            >
                              <Edit size={14} />
                              <span>Editar</span>
                            </button>

                            {hasPermission("product.delete") && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteClick(producto.id);
                                }}
                                className="w-full px-4 py-2 text-left hover:bg-[#F5F2EF] flex items-center gap-2 text-[var(--color-error)]"
                              >
                                <Trash2 size={14} />
                                <span>Eliminar</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
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
