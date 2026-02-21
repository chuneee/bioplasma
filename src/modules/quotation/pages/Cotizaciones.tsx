import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { QuotationTable } from "../components/quotationTable";
import { QuotationFormModal } from "../components/quotationForm";
import { SaleQuoteModal } from "../components/salesQuote";
import { Filters } from "../components/filters";
import { SummaryCards } from "../components/summaryCards";
import { Quotation, QuotationStatus } from "../types/quotation.type";
import { QuotationService } from "../services/quotation.service";
import { message } from "../../../components/shared/message/message";
import { QuotationSummary } from "../types/quotation-sumary.type";
import { QuotationDetail } from "../components/quotationDetail";
import { SaleFromQuote } from "../../sales/types/sale-from-quote.type";
import { SaleService } from "../../sales/services/sale.service";
import { set } from "react-hook-form";

export function Cotizaciones() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todas");
  const [selectedTab, setSelectedTab] = useState("todas");
  const [showNewCotizacionModal, setShowNewCotizacionModal] = useState(false);
  const [showConvertirVentaModal, setShowConvertirVentaModal] = useState(false);
  const [selectedCotizacion, setSelectedCotizacion] =
    useState<Quotation | null>(null);
  const [cotizaciones, setCotizaciones] = useState<Quotation[]>([]);
  const [summary, setSummary] = useState<QuotationSummary>({
    pending: { count: 0, totalValue: 0 },
    closed: { count: 0, totalValue: 0 },
    conversionClosedRate: 0,
    porcentChange: 0,
  });

  const [isCopying, setIsCopying] = useState(false);

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);

  const [showDetail, setShowDetail] = useState(false);

  const fetchCotizaciones = async ({
    year = currentYear,
    month = currentMonth,
  }) => {
    try {
      const response = await QuotationService.getQuotations({
        year,
        month,
      });
      setCotizaciones(response);
    } catch (error) {
      console.error("Error fetching cotizaciones:", error);
      message.error(
        "Hubo un error al cargar las cotizaciones. Por favor, intenta de nuevo.",
      );
    }
  };

  const fetchSummary = async ({ year = currentYear, month = currentMonth }) => {
    try {
      const response = await QuotationService.getSummary({ year, month });
      setSummary(response);
    } catch (error) {
      console.error("Error fetching summary:", error);
      message.error(
        "Hubo un error al cargar el resumen de cotizaciones. Por favor, intenta de nuevo.",
      );
    }
  };

  useEffect(() => {
    fetchCotizaciones({
      year: currentYear,
      month: currentMonth,
    });
    fetchSummary({
      year: currentYear,
      month: currentMonth,
    });
  }, [currentYear, currentMonth]);

  const onFormSubmit = async (data: Partial<Quotation>) => {
    try {
      if (selectedCotizacion && !isCopying) {
        const response = await QuotationService.updateQuotation(
          selectedCotizacion.id,
          data,
        );
        message.success("Cotización actualizada exitosamente");
        setCotizaciones((prev) =>
          prev.map((cot) => (cot.id === response.id ? response : cot)),
        );
        return;
      } else {
        const response = await QuotationService.createQuotation(data);
        message.success("Cotización creada exitosamente");
        setCotizaciones((prev) => [...prev, response]);
      }
    } catch (error) {
      console.error("Error al crear cotización:", error);
      message.error(
        "Hubo un error al crear la cotización. Por favor, intenta de nuevo.",
      );
    } finally {
      setShowNewCotizacionModal(false);
      setSelectedCotizacion(null);
      setIsCopying(false);
    }
  };

  const onConvertirVenta = async (data: Partial<SaleFromQuote>) => {
    try {
      const response = await SaleService.createSaleFromQuote(data);
      setCotizaciones((prev) =>
        prev.map((cot) =>
          cot.id === data.quoteId
            ? { ...cot, status: QuotationStatus.CERRADA }
            : cot,
        ),
      );
      message.success("Cotización convertida a venta exitosamente");
    } catch (error) {
      console.error("Error al convertir cotización a venta:", error);
      message.error(
        "Hubo un error al convertir la cotización a venta. Por favor, intenta de nuevo.",
      );
    } finally {
      setShowConvertirVentaModal(false);
      setSelectedCotizacion(null);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await QuotationService.deleteQuotation(id);
      message.success("Cotización eliminada exitosamente");
      setCotizaciones((prev) => prev.filter((cot) => cot.id !== id));
    } catch (error) {
      console.error("Error al eliminar cotización:", error);
      message.error(
        "Hubo un error al eliminar la cotización. Por favor, intenta de nuevo.",
      );
    }
  };

  const handleStatusChange = async (id: number, status: QuotationStatus) => {
    try {
      const response = await QuotationService.changeQuotationStatus(id, status);
      message.success("Estado de cotización actualizado exitosamente");
      setCotizaciones((prev) =>
        prev.map((cot) => (cot.id === response.id ? response : cot)),
      );

      if (showDetail) {
        setSelectedCotizacion(response);
      }
    } catch (error) {
      console.error("Error al cambiar estado de cotización:", error);
      message.error(
        "Hubo un error al actualizar el estado de la cotización. Por favor, intenta de nuevo.",
      );
    }
  };

  // Filtrar cotizaciones
  const filteredCotizaciones = cotizaciones.filter((cot) => {
    const matchesSearch =
      cot.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cot.patient.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado =
      filterEstado === "todas" || cot.status.toLowerCase() === filterEstado;
    const matchesTab =
      selectedTab === "todas" || cot.status.toLowerCase() === selectedTab;
    return matchesSearch && matchesEstado && matchesTab;
  });

  const handleEdit = (cotizacion: Quotation, copy: boolean = false) => {
    setSelectedCotizacion(cotizacion);
    setShowNewCotizacionModal(true);
    setIsCopying(copy);
  };

  const handleViewDetail = (cotizacion: Quotation) => {
    setSelectedCotizacion(cotizacion);
    setShowDetail(true);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-['Cormorant_Garamond'] text-[var(--color-text)] mb-2">
              Cotizaciones
            </h1>
            <p className="text-[var(--color-text-secondary)]">
              {cotizaciones.length} cotizaciones este mes
            </p>
          </div>
          <button
            onClick={() => setShowNewCotizacionModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[#7A6349] transition-colors"
          >
            <Plus size={20} />
            <span>Nueva Cotización</span>
          </button>
        </div>

        {/* Cards de resumen */}
        <SummaryCards dataSummary={summary} />
      </div>

      {/* Tabs de estado */}
      <div className="mb-6 border-b border-[var(--color-border)] overflow-x-auto">
        <div className="flex gap-6 min-w-max">
          <button
            onClick={() => setSelectedTab("todas")}
            className={`pb-3 transition-colors whitespace-nowrap ${
              selectedTab === "todas"
                ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            }`}
            style={{ fontWeight: selectedTab === "todas" ? 600 : 400 }}
          >
            Todas ({cotizaciones.length})
          </button>
          <button
            onClick={() => setSelectedTab("pendiente")}
            className={`pb-3 transition-colors whitespace-nowrap flex items-center gap-2 ${
              selectedTab === "pendiente"
                ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            }`}
            style={{ fontWeight: selectedTab === "pendiente" ? 600 : 400 }}
          >
            Pendientes
            <span
              className="px-2 py-0.5 bg-amber-100 text-amber-600 rounded-full"
              style={{ fontSize: "12px", fontWeight: 600 }}
            >
              {
                cotizaciones.filter(
                  (c) => c.status === QuotationStatus.PENDIENTE,
                ).length
              }
            </span>
          </button>
          <button
            onClick={() => setSelectedTab("enviada")}
            className={`pb-3 transition-colors whitespace-nowrap ${
              selectedTab === "enviada"
                ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            }`}
            style={{ fontWeight: selectedTab === "enviada" ? 600 : 400 }}
          >
            Enviadas (
            {
              cotizaciones.filter((c) => c.status === QuotationStatus.ENVIADA)
                .length
            }
            )
          </button>
          <button
            onClick={() => setSelectedTab("negociacion")}
            className={`pb-3 transition-colors whitespace-nowrap ${
              selectedTab === "negociacion"
                ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            }`}
            style={{ fontWeight: selectedTab === "negociacion" ? 600 : 400 }}
          >
            En Negociación (
            {
              cotizaciones.filter(
                (c) => c.status === QuotationStatus.NEGOCIACION,
              ).length
            }
            )
          </button>
          <button
            onClick={() => setSelectedTab("cerrada")}
            className={`pb-3 transition-colors whitespace-nowrap flex items-center gap-2 ${
              selectedTab === "cerrada"
                ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            }`}
            style={{ fontWeight: selectedTab === "cerrada" ? 600 : 400 }}
          >
            Cerradas ✓
            <span
              className="px-2 py-0.5 bg-green-100 text-green-600 rounded-full"
              style={{ fontSize: "12px", fontWeight: 600 }}
            >
              {
                cotizaciones.filter((c) => c.status === QuotationStatus.CERRADA)
                  .length
              }
            </span>
          </button>
          <button
            onClick={() => setSelectedTab("vencida")}
            className={`pb-3 transition-colors whitespace-nowrap flex items-center gap-2 ${
              selectedTab === "vencida"
                ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            }`}
            style={{ fontWeight: selectedTab === "vencida" ? 600 : 400 }}
          >
            Vencidas
            <span
              className="px-2 py-0.5 bg-red-100 text-red-600 rounded-full"
              style={{ fontSize: "12px", fontWeight: 600 }}
            >
              {
                cotizaciones.filter((c) => c.status === QuotationStatus.VENCIDA)
                  .length
              }
            </span>
          </button>
        </div>
      </div>

      {/* Barra de controles */}
      <Filters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterEstado={filterEstado}
        setFilterEstado={setFilterEstado}
        currentYear={currentYear}
        setCurrentYear={setCurrentYear}
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
      />

      {/* Tabla de cotizaciones */}
      <QuotationTable
        dataSource={filteredCotizaciones}
        onCheckConvertirVenta={(cotizacion) => {
          setSelectedCotizacion(cotizacion);
          setShowConvertirVentaModal(true);
        }}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewDetail={handleViewDetail}
      />

      {/* Modal: Nueva Cotización */}
      <QuotationFormModal
        open={showNewCotizacionModal}
        onClose={() => {
          setShowNewCotizacionModal(false);
          setSelectedCotizacion(null);
          setIsCopying(false);
        }}
        onSubmit={onFormSubmit}
        cotizacionNumber={
          cotizaciones[cotizaciones.length - 1]?.sequentialNumber || 0
        }
        currentData={selectedCotizacion}
      />

      {/* Modal: Convertir a Venta */}
      <SaleQuoteModal
        open={showConvertirVentaModal}
        dataSource={selectedCotizacion} // Aquí deberías pasar los datos necesarios para convertir la cotización en venta
        onClose={() => setShowConvertirVentaModal(false)}
        onSubmit={onConvertirVenta}
      />

      <QuotationDetail
        open={showDetail}
        dataSource={selectedCotizacion!}
        onClose={() => {
          (setShowDetail(false), setSelectedCotizacion(null));
        }}
        onChangeStatus={handleStatusChange}
      />
    </div>
  );
}
