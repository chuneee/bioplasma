import { useEffect, useState } from "react";
import {
  Plus,
  Receipt,
  Calendar,
  Calculator,
  PieChart,
  Download,
} from "lucide-react";
import { SaleTable } from "../components/salesTable";
import { SaleForm } from "../components/saleForm";
import { SaleDetail } from "../components/saleDetail";
import { Filters } from "../components/filters";
import { formatCurrency } from "../../../utils/utils";
import { Venta, ventasMock } from "../utils";
import { Sale, SaleStatus } from "../types/sale.type";
import { SaleService } from "../services/sale.service";
import { message } from "../../../components/shared/message/message";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";

dayjs.extend(weekOfYear);

export function Ventas() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState("");
  const [filterMetodo, setFilterMetodo] = useState("");

  const [showVentaRapidaModal, setShowVentaRapidaModal] = useState(false);
  const [showDetalleVenta, setShowDetalleVenta] = useState(false);
  const [selectedVenta, setSelectedVenta] = useState<Sale | null>(null);
  const [selectedTab, setSelectedTab] = useState("mes");

  const [ventas, setVentas] = useState<Sale[]>([]);
  const [ventasFiltradas, setVentasFiltradas] = useState<Sale[]>([]);

  const fetchVentas = async () => {
    try {
      const data = await SaleService.getSales();
      setVentas(data);
      setVentasFiltradas(data);
    } catch (error) {
      console.error("Error fetching sales:", error);
      message.error(
        "Ocurrió un error al cargar las ventas. Por favor, intenta de nuevo.",
      );
    }
  };

  useEffect(() => {
    fetchVentas();
  }, []);

  const onFormSubmit = async (data: Partial<Sale>) => {
    try {
      const response = await SaleService.createSale(data);

      setVentas((prev) => [...prev, response]);
      setVentasFiltradas((prev) => [...prev, response]);
      message.success("Venta creada exitosamente");
    } catch (error) {
      console.error("Error al crear la venta:", error);
      message.error(
        "Ocurrió un error al crear la venta. Por favor, intenta de nuevo.",
      );
    } finally {
      setShowVentaRapidaModal(false);
    }
  };

  const onChangeStatus = async (id: number, status: SaleStatus) => {
    try {
      const updated = await new SaleService().changeStatus(id, status);
      setVentas((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
      setVentasFiltradas((prev) =>
        prev.map((v) => (v.id === updated.id ? updated : v)),
      );
      message.success("Estado de venta actualizado");
    } catch (error) {
      console.error("Error al actualizar estado de venta:", error);
      message.error(
        "Ocurrió un error al actualizar el estado de la venta. Por favor, intenta de nuevo.",
      );
    }
  };

  const getVentasPorPeriodo = (
    selectedTab: "hoy" | "semana" | "mes" | "todo",
  ) => {
    setSelectedTab(selectedTab);
    const now = dayjs();
    let filtered: Sale[] = ventas;
    if (selectedTab === "hoy") {
      filtered = ventas.filter((v) => {
        const fechaVenta = dayjs(v.createdAt).format("YYYY-MM-DD");
        const hoy = dayjs().format("YYYY-MM-DD");
        return fechaVenta === hoy;
      });
    }
    if (selectedTab === "semana") {
      const startOfWeek = dayjs(now).startOf("week").toDate();
      startOfWeek.setDate(now.date() - now.day());
      startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
      filtered = ventas.filter((v) => {
        const fechaVenta = new Date(v.createdAt);
        return fechaVenta >= startOfWeek && fechaVenta <= endOfWeek;
      });
    }
    if (selectedTab === "mes") {
      filtered = ventas.filter((v) => {
        const fechaVenta = dayjs(v.createdAt);
        return (
          fechaVenta.month() === now.month() && fechaVenta.year() === now.year()
        );
      });
    }
    // "todo"
    return setVentasFiltradas(filtered);
  };

  const filteredVentas = ventasFiltradas.filter((cot) => {
    const matchesSearch =
      cot.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cot.customerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTipo =
      !filterTipo ||
      filterTipo === "todas" ||
      cot.origin.toLowerCase() === filterTipo.toLowerCase();

    const matchesMetodo =
      !filterMetodo ||
      filterMetodo === "todas" ||
      cot.paymentMethod.toLowerCase() === filterMetodo.toLowerCase();

    return matchesSearch && matchesTipo && matchesMetodo;
  });

  // CALCULO DE METRICAS
  const ventasHoy = ventas.filter((v) => {
    const hoy = dayjs().format("YYYY-MM-DD");
    const fechaVenta = dayjs(v.createdAt).format("YYYY-MM-DD");
    return hoy === fechaVenta && v.status === SaleStatus.CONCRETADA;
  });

  const ventasSemana = ventas.filter((v) => {
    const fechaVenta = dayjs(v.createdAt);
    const now = dayjs();
    return (
      fechaVenta.week() === now.week() &&
      fechaVenta.year() === now.year() &&
      v.status === SaleStatus.CONCRETADA
    );
  }).length;
  const ventasMes = ventas.filter((v) => {
    const fechaVenta = dayjs(v.createdAt);
    const now = dayjs();
    return (
      fechaVenta.month() === now.month() &&
      fechaVenta.year() === now.year() &&
      v.status === SaleStatus.CONCRETADA
    );
  });

  const totalHoy = ventasHoy.reduce((sum, v) => sum + Number(v.total), 0);
  const totalMes = ventasMes
    .filter((v) => v.status === SaleStatus.CONCRETADA)
    .reduce((sum, v) => sum + Number(v.total), 0);
  const ticketPromedio = Math.round(totalMes / (ventasMes.length || 1));

  const totalServicios = ventasMes
    .filter((v) => v.status === SaleStatus.CONCRETADA)
    .reduce((sum, v) => {
      const servicios = v.items.filter((i) => i.itemType === "SERVICIO");
      return sum + servicios.reduce((s, i) => s + Number(i.total), 0);
    }, 0);

  const totalProductos = ventasMes
    .filter((v) => v.status === SaleStatus.CONCRETADA)
    .reduce((sum, v) => {
      const productos = v.items.filter((i) => i.itemType === "PRODUCTO");
      return sum + productos.reduce((s, i) => s + Number(i.total), 0);
    }, 0);

  const totalItems = totalServicios + totalProductos; // ventas

  const porcentajeServicios =
    totalMes > 0 ? Math.round((totalServicios * 100) / totalItems) : 0;
  const porcentajeProductos =
    totalMes > 0 ? Math.round((totalProductos * 100) / totalItems) : 0;

  // Comparación con mes anterior
  const mesAnterior = dayjs().subtract(1, "month");
  const ventasMesAnterior = ventas.filter((v) => {
    const fechaVenta = dayjs(v.createdAt);
    return (
      fechaVenta.month() === mesAnterior.month() &&
      fechaVenta.year() === mesAnterior.year() &&
      v.status === SaleStatus.CONCRETADA
    );
  });

  const totalMesAnterior = ventasMesAnterior.reduce(
    (sum, v) => sum + Number(v.total),
    0,
  );

  const crecimientoMensual = totalMesAnterior
    ? Math.round(((totalMes - totalMesAnterior) * 100) / totalMesAnterior)
    : 0;

  const Header = () => {
    return (
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-['Cormorant_Garamond'] text-[var(--color-text)] mb-2">
            Ventas
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            {ventasMock.filter((v) => v.estado === "completada").length} ventas
            este mes
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors">
            <Download size={20} />
            <span>Exportar</span>
          </button>
          <button
            onClick={() => setShowVentaRapidaModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[#7A6349] transition-colors"
          >
            <Plus size={20} />
            <span>Venta Rápida</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Header />

        {/* Cards de métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Ventas de Hoy */}
          <div className="bg-white rounded-xl border border-green-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Receipt className="text-green-600" size={24} />
              </div>
            </div>
            <div
              className="text-green-600"
              style={{ fontSize: "28px", fontWeight: 700 }}
            >
              {formatCurrency(totalHoy)}
            </div>
            <div
              className="text-[var(--color-text-secondary)]"
              style={{ fontSize: "14px" }}
            >
              Ingresos hoy
            </div>
            <div
              className="text-green-600 mt-1"
              style={{ fontSize: "13px", fontWeight: 600 }}
            >
              {ventasHoy.length} ventas realizadas
            </div>
          </div>

          {/* Ventas del Mes */}
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-[#8B735515] flex items-center justify-center">
                <Calendar className="text-[var(--color-primary)]" size={24} />
              </div>
            </div>
            <div
              className="text-[var(--color-primary)]"
              style={{ fontSize: "28px", fontWeight: 700 }}
            >
              {formatCurrency(totalMes)}
            </div>
            <div
              className="text-[var(--color-text-secondary)]"
              style={{ fontSize: "14px" }}
            >
              Ingresos del mes
            </div>
            <div className="flex items-center justify-between mt-1">
              <span
                className="text-[var(--color-text-secondary)]"
                style={{ fontSize: "13px" }}
              >
                {ventasMes.length} ventas
              </span>
              <span
                className="text-green-600"
                style={{ fontSize: "13px", fontWeight: 600 }}
              >
                {crecimientoMensual}% vs mes anterior
              </span>
            </div>
          </div>

          {/* Ticket Promedio */}
          <div className="bg-white rounded-xl border border-blue-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Calculator className="text-blue-600" size={24} />
              </div>
            </div>
            <div
              className="text-blue-600"
              style={{ fontSize: "28px", fontWeight: 700 }}
            >
              {formatCurrency(ticketPromedio)}
            </div>
            <div
              className="text-[var(--color-text-secondary)]"
              style={{ fontSize: "14px" }}
            >
              Ticket promedio
            </div>
            <div
              className="text-[var(--color-text-secondary)] mt-1"
              style={{ fontSize: "13px" }}
            >
              Este mes
            </div>
          </div>

          {/* Servicios vs Productos */}
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-[#D4A57415] flex items-center justify-center">
                <PieChart className="text-[var(--color-secondary)]" size={24} />
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span style={{ fontSize: "13px" }}>Servicios</span>
                  <span style={{ fontSize: "13px", fontWeight: 600 }}>
                    {porcentajeServicios}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[var(--color-secondary)] h-2 rounded-full"
                    style={{ width: `${porcentajeServicios}%` }}
                  />
                </div>
                <span
                  className="text-[var(--color-text-secondary)]"
                  style={{ fontSize: "12px" }}
                >
                  {formatCurrency(totalServicios)}
                </span>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span style={{ fontSize: "13px" }}>Productos</span>
                  <span style={{ fontSize: "13px", fontWeight: 600 }}>
                    {porcentajeProductos}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[var(--color-primary)] h-2 rounded-full"
                    style={{ width: `${porcentajeProductos}%` }}
                  />
                </div>
                <span
                  className="text-[var(--color-text-secondary)]"
                  style={{ fontSize: "12px" }}
                >
                  {formatCurrency(totalProductos)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs de período */}
      <div className="mb-6 border-b border-[var(--color-border)] overflow-x-auto">
        <div className="flex gap-6 min-w-max">
          <button
            onClick={() => getVentasPorPeriodo("hoy")}
            className={`pb-3 transition-colors whitespace-nowrap ${
              selectedTab === "hoy"
                ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            }`}
            style={{ fontWeight: selectedTab === "hoy" ? 600 : 400 }}
          >
            Hoy ({ventasHoy.length})
          </button>
          <button
            onClick={() => getVentasPorPeriodo("semana")}
            className={`pb-3 transition-colors whitespace-nowrap ${
              selectedTab === "semana"
                ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            }`}
            style={{ fontWeight: selectedTab === "semana" ? 600 : 400 }}
          >
            Esta Semana ({ventasSemana})
          </button>
          <button
            onClick={() => getVentasPorPeriodo("mes")}
            className={`pb-3 transition-colors whitespace-nowrap ${
              selectedTab === "mes"
                ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            }`}
            style={{ fontWeight: selectedTab === "mes" ? 600 : 400 }}
          >
            Este Mes ({ventasMes.length})
          </button>
          <button
            onClick={() => getVentasPorPeriodo("todo")}
            className={`pb-3 transition-colors whitespace-nowrap ${
              selectedTab === "todo"
                ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            }`}
            style={{ fontWeight: selectedTab === "todo" ? 600 : 400 }}
          >
            Todo
          </button>
        </div>
      </div>

      {/* Barra de controles */}
      <Filters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterTipo={filterTipo}
        setFilterTipo={setFilterTipo}
        filterMetodo={filterMetodo}
        setFilterMetodo={setFilterMetodo}
      />

      {/* Tabla de ventas */}
      <SaleTable
        dataSource={filteredVentas}
        onViewDetails={(venta) => {
          setSelectedVenta(venta);
          setShowDetalleVenta(true);
        }}
        onChangeStatus={onChangeStatus}
      />

      {/* Modal: Venta Rápida */}
      <SaleForm
        open={showVentaRapidaModal}
        onClose={() => setShowVentaRapidaModal(false)}
        onSubmit={onFormSubmit}
      />

      {/* Drawer: Detalle de Venta */}
      <SaleDetail
        open={showDetalleVenta}
        onClose={() => setShowDetalleVenta(false)}
        dataSource={selectedVenta}
        onChangeStatus={onChangeStatus}
      />
    </div>
  );
}
