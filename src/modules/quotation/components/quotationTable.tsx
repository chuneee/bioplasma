import { useEffect, useState } from "react";
import { estadosConfig, formatTime, getDaysUntilExpiry } from "../utils/utils";
import { formatCurrency, formatDate } from "../../../utils/utils";
import {
  CheckCircle,
  Copy,
  Download,
  Edit2,
  Eye,
  MessageCircle,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { Quotation, QuotationStatus } from "../types/quotation.type";
import { usePermissions } from "../../../modules/auth/hooks/usePermissions";
import { PaginationTable } from "../../patients/components/paginationTable";

interface QuotationTableProps {
  dataSource: Quotation[];
  onCheckConvertirVenta: (cotizacion: Quotation) => void;
  onEdit: (cotizacion: Quotation, copy: boolean) => void;
  onDelete: (cotizacionId: number) => void;
  onViewDetail: (cotizacion: Quotation) => void;
}

export const QuotationTable = ({
  dataSource,
  onCheckConvertirVenta,
  onEdit,
  onDelete,
  onViewDetail,
}: QuotationTableProps) => {
  const [cotizaciones, setCotizaciones] = useState<Quotation[]>([]);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  const { hasPermission } = usePermissions();

  useEffect(() => {
    setCotizaciones(dataSource);
    setCurrentPage(1);
  }, [dataSource]);

  const paginatedCotizaciones = cotizaciones.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleConvertirVenta = (cotizacion: Quotation) => {
    onCheckConvertirVenta(cotizacion);
  };

  const handleEdit = (cotizacion: Quotation, copy: boolean = false) => {
    onEdit(cotizacion, copy);
  };

  const handleDelete = (cotizacionId: number) => {
    onDelete(cotizacionId);
  };

  const handleViewDetail = (cotizacion: Quotation) => {
    onViewDetail(cotizacion);
  };

  const handleClickOutsideMenu = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest(".relative")) {
      setActiveMenu(null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutsideMenu);
    return () => {
      document.removeEventListener("click", handleClickOutsideMenu);
    };
  }, []);

  return (
    <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
      <div className="overflow-x-auto h-screen">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F5F2EF] border-b border-[var(--color-border)]">
              <th
                className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide"
                style={{ fontSize: "12px", fontWeight: 600 }}
              >
                Folio
              </th>
              <th
                className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide"
                style={{ fontSize: "12px", fontWeight: 600 }}
              >
                Fecha
              </th>
              <th
                className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide"
                style={{ fontSize: "12px", fontWeight: 600 }}
              >
                Paciente
              </th>
              <th
                className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide"
                style={{ fontSize: "12px", fontWeight: 600 }}
              >
                Servicios/Productos
              </th>
              <th
                className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide"
                style={{ fontSize: "12px", fontWeight: 600 }}
              >
                Total
              </th>
              <th
                className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide"
                style={{ fontSize: "12px", fontWeight: 600 }}
              >
                Vendedora
              </th>
              <th
                className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide"
                style={{ fontSize: "12px", fontWeight: 600 }}
              >
                Vigencia
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
            {paginatedCotizaciones.map((cotizacion) => {
              const estado =
                estadosConfig[
                  cotizacion.status.toLowerCase() as keyof typeof estadosConfig
                ] || {};
              const daysUntilExpiry = getDaysUntilExpiry(
                cotizacion.expirationDate,
              );
              const isExpiringSoon =
                daysUntilExpiry !== null &&
                daysUntilExpiry < 3 &&
                daysUntilExpiry > 0;

              return (
                <tr
                  key={cotizacion.id}
                  className={`border-b border-[var(--color-border)] hover:bg-[#FDFBF9] transition-colors ${
                    isExpiringSoon ? "border-l-4 border-l-amber-500" : ""
                  } ${cotizacion.status === QuotationStatus.VENCIDA ? "bg-gray-50" : ""}`}
                >
                  <td className="px-6 py-4">
                    <span
                      className="font-mono text-[var(--color-primary)] hover:underline cursor-pointer"
                      style={{ fontSize: "13px", fontWeight: 600 }}
                    >
                      {cotizacion.folio}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div style={{ fontWeight: 600 }}>
                        {formatDate(cotizacion.createdAt)}
                      </div>
                      <div
                        className="text-[var(--color-text-secondary)]"
                        style={{ fontSize: "13px" }}
                      >
                        {formatTime(cotizacion.createdAt)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full bg-[#E8DFF5] flex items-center justify-center flex-shrink-0"
                        style={{ fontWeight: 600, fontSize: "14px" }}
                      >
                        {cotizacion.patient.fullName
                          .split(" ")
                          .slice(0, 2)
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>
                          {cotizacion.patient.fullName}
                        </div>
                        <div
                          className="text-[var(--color-text-secondary)]"
                          style={{ fontSize: "13px" }}
                        >
                          {cotizacion.patient.principalPhoneNumber}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className="text-[var(--color-text-secondary)]"
                      style={{ fontSize: "14px" }}
                    >
                      {(() => {
                        const items = cotizacion.items || [];
                        return items.length === 1
                          ? items[0]?.service?.name ||
                              items[0]?.product?.name ||
                              ""
                          : `${items[0]?.service?.name || items[0]?.product?.name || ""}, ${items[1]?.service?.name || items[1]?.product?.name || ""}${items.length > 2 ? ` + ${items.length - 2} más` : ""}`;
                      })()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      {cotizacion.discount > 0 && (
                        <div
                          className="text-[var(--color-text-secondary)] line-through"
                          style={{ fontSize: "13px" }}
                        >
                          {formatCurrency(cotizacion.subTotal)}
                        </div>
                      )}
                      <div style={{ fontWeight: 600, fontSize: "16px" }}>
                        {formatCurrency(cotizacion.total)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span>{cotizacion.seller.username}</span>
                  </td>
                  <td className="px-6 py-4">
                    {cotizacion.expirationDate ? (
                      <div>
                        {daysUntilExpiry !== null && daysUntilExpiry >= 0 ? (
                          <div
                            className={`${daysUntilExpiry < 3 ? "text-amber-600" : "text-[var(--color-text)]"}`}
                          >
                            Vence en {daysUntilExpiry} días
                          </div>
                        ) : (
                          <div className="text-red-600">
                            Vencida hace {Math.abs(daysUntilExpiry || 0)} días
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-[var(--color-text-secondary)]">
                        Sin vigencia
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className="inline-flex px-3 py-1 rounded-full"
                      style={{
                        fontSize: "12px",
                        fontWeight: 500,
                        backgroundColor: estado.bgColor,
                        color: estado.color,
                      }}
                    >
                      {estado.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleViewDetail(cotizacion)}
                        className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[#8B7355]/10 rounded-lg transition-colors"
                        title="Ver detalle"
                      >
                        <Eye size={16} />
                      </button>
                      {![
                        QuotationStatus.RECHAZADA,
                        QuotationStatus.CERRADA,
                        QuotationStatus.VENCIDA,
                      ].includes(cotizacion.status) && (
                        <button
                          onClick={() => handleConvertirVenta(cotizacion)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Convertir a venta"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      <button
                        onClick={() =>
                          window.open(
                            `https://wa.me/${cotizacion.patient.principalPhoneNumber.replace(/\D/g, "")}`,
                            "_blank",
                          )
                        }
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Enviar por WhatsApp"
                      >
                        <MessageCircle size={16} />
                      </button>
                      <div className="relative">
                        <button
                          onClick={() =>
                            setActiveMenu(
                              activeMenu === cotizacion.id
                                ? null
                                : cotizacion.id,
                            )
                          }
                          className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[#8B7355]/10 rounded-lg transition-colors"
                        >
                          <MoreVertical size={16} />
                        </button>
                        {activeMenu === cotizacion.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-[var(--color-border)] py-1 z-10">
                            <button
                              type="button"
                              onClick={() => handleEdit(cotizacion)}
                              className="w-full px-4 py-2 text-left hover:bg-[#F5F2EF] flex items-center gap-2"
                            >
                              <Edit2 size={14} />
                              <span>Editar</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEdit(cotizacion, true)}
                              className="w-full px-4 py-2 text-left hover:bg-[#F5F2EF] flex items-center gap-2"
                            >
                              <Copy size={14} />
                              <span>Duplicar</span>
                            </button>
                            <button
                              type="button"
                              className="w-full px-4 py-2 text-left hover:bg-[#F5F2EF] flex items-center gap-2"
                            >
                              <Download size={14} />
                              <span>Descargar PDF</span>
                            </button>
                            {hasPermission("quotation.delete") && (
                              <button
                                onClick={() => handleDelete(cotizacion.id)}
                                type="button"
                                className="w-full px-4 py-2 text-left hover:bg-[#F5F2EF] flex items-center gap-2 text-[var(--color-error)]"
                              >
                                <Trash2 size={14} />
                                <span> Eliminar</span>
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

      <PaginationTable
        onChangePage={handlePageChange}
        onItemPerPageChange={handleItemsPerPageChange}
        totalItems={cotizaciones.length}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
};
