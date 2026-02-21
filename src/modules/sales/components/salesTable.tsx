import {
  Banknote,
  CreditCard,
  Eye,
  MessageCircle,
  MoreVertical,
  Printer,
  RotateCcw,
  Smartphone,
  XCircle,
} from "lucide-react";
import { formatCurrency, formatDate } from "../../../utils/utils";
import {
  formatTime,
  getMetodoPagoLabel,
  MetodoPago,
  ventasMock,
} from "../utils";
import { useEffect, useState } from "react";
import { Sale, SaleOrigin, SaleStatus } from "../types/sale.type";
import { PaginationTable } from "../../patients/components/paginationTable";

interface SaleTableProps {
  dataSource: Sale[];
  onViewDetails?: (v: Sale) => void;
  onChangeStatus?: (id: number, status: SaleStatus) => void;
}

export const SaleTable = ({
  dataSource,
  onViewDetails,
  onChangeStatus,
}: SaleTableProps) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [ventas, setVentas] = useState<Sale[]>(dataSource);

  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setVentas(dataSource);
  }, [dataSource]);

  const getMetodoPagoIcon = (metodo: MetodoPago) => {
    switch (metodo) {
      case "efectivo":
        return <Banknote size={16} />;
      case "tarjeta-credito":
      case "tarjeta-debito":
        return <CreditCard size={16} />;
      case "transferencia":
        return <Smartphone size={16} />;
      case "multiple":
        return <span style={{ fontSize: "14px" }}>💳💵</span>;
    }
  };

  const handelSelectVenta = (venta: Sale) => {
    if (onViewDetails) {
      onViewDetails(venta);
    }
  };

  const handleStatusChange = (id: number, status: SaleStatus) => {
    if (onChangeStatus) {
      onChangeStatus(id, status);
    }
  };

  const getStyleStatus = (status: SaleStatus) => {
    switch (status) {
      case SaleStatus.GUARDADA:
        return "bg-gray-50 hover:bg-[var(--color-bg)] transition-colors";
      case SaleStatus.CANCELADA:
        return " opacity-50 hover:bg-red-50 transition-colors";
      case SaleStatus.DEVOLUCION:
        return "bg-amber-50 hover:bg-[var(--color-bg)] transition-colors";
      default:
        return "";
    }
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedVentas = ventas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

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
                Fecha/Hora
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
                Items
              </th>
              <th
                className="text-right px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide"
                style={{ fontSize: "12px", fontWeight: 600 }}
              >
                Subtotal
              </th>
              <th
                className="text-right px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide"
                style={{ fontSize: "12px", fontWeight: 600 }}
              >
                Descuento
              </th>
              <th
                className="text-right px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide"
                style={{ fontSize: "12px", fontWeight: 600 }}
              >
                Total
              </th>
              <th
                className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide"
                style={{ fontSize: "12px", fontWeight: 600 }}
              >
                Método Pago
              </th>
              <th
                className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide"
                style={{ fontSize: "12px", fontWeight: 600 }}
              >
                Origen
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
            {paginatedVentas.map((venta) => {
              const itemsResumen =
                venta.items.length === 1
                  ? venta.items[0]?.product?.name ||
                    venta.items[0]?.service?.name ||
                    ""
                  : `${venta.items[0]?.product?.name || venta.items[0]?.service?.name}${venta.items.length > 2 ? ` + ${venta.items.length - 1} más` : `, ${venta.items[1]?.product?.name || venta.items[1]?.service?.name || ""}`}`;

              return (
                <tr
                  key={venta.id}
                  className={`border-b border-[var(--color-border)] hover:bg-[#FDFBF9] transition-colors ${getStyleStatus(
                    venta.status,
                  )}`}
                >
                  <td className="px-6 py-4">
                    <span
                      onClick={() => {
                        handelSelectVenta(venta);
                      }}
                      className="font-mono text-[var(--color-primary)] hover:underline cursor-pointer"
                      style={{ fontSize: "13px", fontWeight: 600 }}
                    >
                      {venta.folio}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div style={{ fontWeight: 600 }}>
                        {formatDate(venta.createdAt)}
                      </div>
                      <div
                        className="text-[var(--color-text-secondary)]"
                        style={{ fontSize: "13px" }}
                      >
                        {formatTime(venta.createdAt)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {venta.customerName ? (
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full bg-[#E8DFF5] flex items-center justify-center flex-shrink-0"
                          style={{ fontWeight: 600, fontSize: "14px" }}
                        >
                          {venta.customerName
                            .split(" ")
                            .slice(0, 2)
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>
                            {venta.customerName}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-[var(--color-text-secondary)]">
                        Venta general
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="truncate max-w-[200px]">
                        {itemsResumen}
                      </span>
                      <span
                        className="px-2 py-0.5 bg-[#F5F2EF] rounded-full text-[var(--color-text-secondary)]"
                        style={{ fontSize: "12px" }}
                      >
                        ({venta.items.length})
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={
                        venta.discount > 0
                          ? "text-[var(--color-text-secondary)]"
                          : ""
                      }
                    >
                      {formatCurrency(venta.subTotal)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {venta.discount > 0 ? (
                      <div className="text-red-600">
                        <div>-{formatCurrency(venta.discount)}</div>
                        {venta.discount && (
                          <div style={{ fontSize: "12px" }}>
                            ({venta.discount}%)
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-[var(--color-text-secondary)]">
                        —
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className="text-green-600"
                      style={{ fontWeight: 700, fontSize: "16px" }}
                    >
                      {formatCurrency(venta.total)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getMetodoPagoIcon(venta.paymentMethod)}
                      <span>{getMetodoPagoLabel(venta.paymentMethod)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {venta.origin === SaleOrigin.COTIZACION ? (
                      <span
                        className="inline-flex px-3 py-1 rounded-full bg-blue-100 text-blue-600"
                        style={{ fontSize: "12px", fontWeight: 500 }}
                      >
                        Cotización
                      </span>
                    ) : (
                      <span
                        className="inline-flex px-3 py-1 rounded-full bg-[#8B735515] text-[var(--color-primary)]"
                        style={{ fontSize: "12px", fontWeight: 500 }}
                      >
                        Directa
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          handelSelectVenta(venta);
                        }}
                        className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[#8B7355]/10 rounded-lg transition-colors"
                        title="Ver detalle"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        type="button"
                        className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[#8B7355]/10 rounded-lg transition-colors"
                        title="Imprimir ticket"
                      >
                        <Printer size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (venta.patient) {
                            window.open(
                              `https://wa.me/${venta.patient.principalPhoneNumber.replace(/\D/g, "")}`,
                              "_blank",
                            );
                          }
                        }}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Enviar por WhatsApp"
                      >
                        <MessageCircle size={16} />
                      </button>
                      {[SaleStatus.GUARDADA, SaleStatus.CONCRETADA].includes(
                        venta.status,
                      ) && (
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveMenu(
                                activeMenu === String(venta.id)
                                  ? null
                                  : String(venta.id),
                              )
                            }
                            className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[#8B7355]/10 rounded-lg transition-colors"
                          >
                            <MoreVertical size={16} />
                          </button>
                          {activeMenu === String(venta.id) && (
                            <div className="absolute opacity-100 bg-white right-0 top-full mt-1 w-48 rounded-lg shadow-lg border border-[var(--color-border)] py-1 z-10">
                              <button
                                hidden={venta.status === SaleStatus.CONCRETADA}
                                type="button"
                                onClick={() =>
                                  handleStatusChange(
                                    venta.id,
                                    SaleStatus.CANCELADA,
                                  )
                                }
                                className="w-full px-4 py-2 text-left hover:bg-[#F5F2EF] flex items-center gap-2 text-red-600"
                              >
                                <XCircle size={14} />
                                <span>Cancelar venta</span>
                              </button>
                              {/* <button
                                hidden={venta.status !== SaleStatus.CONCRETADA}
                                type="button"
                                onClick={() =>
                                  handleStatusChange(
                                    venta.id,
                                    SaleStatus.DEVOLUCION,
                                  )
                                }
                                className="w-full px-4 py-2 text-left hover:bg-[#F5F2EF] flex items-center gap-2"
                              >
                                <RotateCcw size={14} />
                                <span> Devolución</span>
                              </button> */}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-[#F5F2EF] border-t border-[var(--color-border)]">
        <div className="flex justify-between items-center">
          <div>
            <span style={{ fontWeight: 600 }}>Total del período: </span>
            <span
              className="text-green-600"
              style={{ fontSize: "20px", fontWeight: 700 }}
            >
              {formatCurrency(
                ventas
                  .filter((v) => v.status === SaleStatus.CONCRETADA)
                  .reduce((acc, v) => acc + Number(v.total), 0),
              )}
            </span>
          </div>
        </div>
      </div>

      <PaginationTable
        onChangePage={handlePageChange}
        onItemPerPageChange={handleItemsPerPageChange}
        totalItems={ventas.length}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
};
