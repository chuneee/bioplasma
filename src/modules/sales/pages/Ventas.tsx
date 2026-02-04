import React, { useState } from 'react';
import {
  Search,
  Plus,
  Receipt,
  Calendar,
  Calculator,
  PieChart,
  Eye,
  Printer,
  MessageCircle,
  MoreVertical,
  X,
  Sparkles,
  Package,
  CreditCard,
  Banknote,
  Smartphone,
  ChevronRight,
  Minus,
  Download,
  Edit2,
  XCircle,
  RotateCcw
} from 'lucide-react';

type MetodoPago = 'efectivo' | 'tarjeta-credito' | 'tarjeta-debito' | 'transferencia' | 'multiple';
type OrigenVenta = 'cotizacion' | 'directa';
type TipoItem = 'servicio' | 'producto';

interface ItemVenta {
  id: string;
  tipo: TipoItem;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

interface PagoMultiple {
  metodo: MetodoPago;
  monto: number;
  referencia?: string;
}

interface Venta {
  id: string;
  folio: string;
  fecha: string;
  pacienteId?: string;
  pacienteNombre?: string;
  pacienteAvatar?: string;
  items: ItemVenta[];
  subtotal: number;
  descuento: number;
  descuentoPorcentaje?: number;
  total: number;
  metodoPago: MetodoPago;
  pagos?: PagoMultiple[];
  montoRecibido?: number;
  cambio?: number;
  referencia?: string;
  vendedora: string;
  vendedoraId: string;
  origen: OrigenVenta;
  cotizacionFolio?: string;
  notas?: string;
  estado: 'completada' | 'cancelada';
}

const ventasMock: Venta[] = [
  {
    id: '1',
    folio: 'VTA-2025-0156',
    fecha: '2025-11-27T11:30:00',
    pacienteId: '1',
    pacienteNombre: 'María García López',
    pacienteAvatar: 'MG',
    items: [
      { id: '1', tipo: 'servicio', nombre: 'Limpieza Facial Profunda', cantidad: 1, precioUnitario: 850, subtotal: 850 },
      { id: '2', tipo: 'servicio', nombre: 'Hidratación Intensiva', cantidad: 1, precioUnitario: 600, subtotal: 600 },
      { id: '3', tipo: 'producto', nombre: 'Ácido Hialurónico 1ml', cantidad: 2, precioUnitario: 1000, subtotal: 2000 }
    ],
    subtotal: 3450,
    descuento: 345,
    descuentoPorcentaje: 10,
    total: 3105,
    metodoPago: 'tarjeta-credito',
    referencia: '****4532',
    vendedora: 'Ana R.',
    vendedoraId: '1',
    origen: 'cotizacion',
    cotizacionFolio: 'COT-2025-0034',
    estado: 'completada'
  },
  {
    id: '2',
    folio: 'VTA-2025-0155',
    fecha: '2025-11-27T10:15:00',
    pacienteNombre: 'Ana Sofía Martínez',
    pacienteAvatar: 'AM',
    items: [
      { id: '1', tipo: 'servicio', nombre: 'Paquete Novia Radiante', cantidad: 1, precioUnitario: 2800, subtotal: 2800 }
    ],
    subtotal: 2800,
    descuento: 0,
    total: 2800,
    metodoPago: 'transferencia',
    referencia: 'SPEI-123456',
    vendedora: 'Ana R.',
    vendedoraId: '1',
    origen: 'cotizacion',
    cotizacionFolio: 'COT-2025-0033',
    estado: 'completada'
  },
  {
    id: '3',
    folio: 'VTA-2025-0154',
    fecha: '2025-11-27T09:00:00',
    items: [
      { id: '1', tipo: 'producto', nombre: 'Protector Solar SPF 50', cantidad: 2, precioUnitario: 120, subtotal: 240 },
      { id: '2', tipo: 'producto', nombre: 'Crema Hidratante', cantidad: 1, precioUnitario: 350, subtotal: 350 }
    ],
    subtotal: 590,
    descuento: 0,
    total: 590,
    metodoPago: 'efectivo',
    montoRecibido: 600,
    cambio: 10,
    vendedora: 'Ana R.',
    vendedoraId: '1',
    origen: 'directa',
    estado: 'completada'
  },
  {
    id: '4',
    folio: 'VTA-2025-0153',
    fecha: '2025-11-26T16:45:00',
    pacienteNombre: 'Laura Fernández',
    pacienteAvatar: 'LF',
    items: [
      { id: '1', tipo: 'servicio', nombre: 'Rejuvenecimiento con Plasma', cantidad: 1, precioUnitario: 2500, subtotal: 2500 }
    ],
    subtotal: 2500,
    descuento: 0,
    total: 2500,
    metodoPago: 'multiple',
    pagos: [
      { metodo: 'efectivo', monto: 1000 },
      { metodo: 'tarjeta-credito', monto: 1500, referencia: '****8899' }
    ],
    vendedora: 'Ana R.',
    vendedoraId: '1',
    origen: 'directa',
    estado: 'completada'
  },
  {
    id: '5',
    folio: 'VTA-2025-0152',
    fecha: '2025-11-26T14:20:00',
    pacienteNombre: 'Carmen Rodríguez',
    pacienteAvatar: 'CR',
    items: [
      { id: '1', tipo: 'servicio', nombre: 'Peeling Químico', cantidad: 1, precioUnitario: 1500, subtotal: 1500 }
    ],
    subtotal: 1500,
    descuento: 0,
    total: 1500,
    metodoPago: 'tarjeta-debito',
    referencia: '****2341',
    vendedora: 'Ana R.',
    vendedoraId: '1',
    origen: 'cotizacion',
    cotizacionFolio: 'COT-2025-0031',
    estado: 'completada'
  }
];

export function Ventas() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showVentaRapidaModal, setShowVentaRapidaModal] = useState(false);
  const [showDetalleVenta, setShowDetalleVenta] = useState(false);
  const [selectedVenta, setSelectedVenta] = useState<Venta | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState('mes');

  // Estado para nueva venta
  const [itemsVenta, setItemsVenta] = useState<ItemVenta[]>([]);
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('efectivo');
  const [montoRecibido, setMontoRecibido] = useState(0);
  const [descuentoActivo, setDescuentoActivo] = useState(false);
  const [descuentoValor, setDescuentoValor] = useState(0);
  const [descuentoTipo, setDescuentoTipo] = useState<'porcentaje' | 'monto'>('porcentaje');

  // Calcular métricas
  const ventasHoy = ventasMock.filter(v => {
    const hoy = new Date().toDateString();
    const fechaVenta = new Date(v.fecha).toDateString();
    return hoy === fechaVenta && v.estado === 'completada';
  });
  
  const totalHoy = ventasHoy.reduce((sum, v) => sum + v.total, 0);
  const totalMes = ventasMock.filter(v => v.estado === 'completada').reduce((sum, v) => sum + v.total, 0);
  const ticketPromedio = Math.round(totalMes / ventasMock.filter(v => v.estado === 'completada').length);

  const totalServicios = ventasMock.reduce((sum, v) => {
    const servicios = v.items.filter(i => i.tipo === 'servicio');
    return sum + servicios.reduce((s, i) => s + i.subtotal, 0);
  }, 0);

  const totalProductos = ventasMock.reduce((sum, v) => {
    const productos = v.items.filter(i => i.tipo === 'producto');
    return sum + productos.reduce((s, i) => s + i.subtotal, 0);
  }, 0);

  const porcentajeServicios = Math.round((totalServicios / totalMes) * 100);
  const porcentajeProductos = Math.round((totalProductos / totalMes) * 100);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  const getMetodoPagoIcon = (metodo: MetodoPago) => {
    switch (metodo) {
      case 'efectivo': return <Banknote size={16} />;
      case 'tarjeta-credito':
      case 'tarjeta-debito': return <CreditCard size={16} />;
      case 'transferencia': return <Smartphone size={16} />;
      case 'multiple': return <span style={{ fontSize: '14px' }}>💳💵</span>;
    }
  };

  const getMetodoPagoLabel = (metodo: MetodoPago) => {
    switch (metodo) {
      case 'efectivo': return 'Efectivo';
      case 'tarjeta-credito': return 'Tarjeta Crédito';
      case 'tarjeta-debito': return 'Tarjeta Débito';
      case 'transferencia': return 'Transferencia';
      case 'multiple': return 'Mixto';
    }
  };

  const calcularSubtotalVenta = () => {
    return itemsVenta.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const calcularDescuentoVenta = () => {
    if (!descuentoActivo) return 0;
    const subtotal = calcularSubtotalVenta();
    if (descuentoTipo === 'porcentaje') {
      return (subtotal * descuentoValor) / 100;
    }
    return descuentoValor;
  };

  const calcularTotalVenta = () => {
    return calcularSubtotalVenta() - calcularDescuentoVenta();
  };

  const calcularCambio = () => {
    if (metodoPago === 'efectivo' && montoRecibido > 0) {
      return montoRecibido - calcularTotalVenta();
    }
    return 0;
  };

  const agregarItemVenta = (item: ItemVenta) => {
    setItemsVenta([...itemsVenta, item]);
  };

  const eliminarItemVenta = (id: string) => {
    setItemsVenta(itemsVenta.filter(i => i.id !== id));
  };

  const actualizarCantidadItem = (id: string, cantidad: number) => {
    if (cantidad < 1) return;
    setItemsVenta(itemsVenta.map(item => {
      if (item.id === id) {
        return {
          ...item,
          cantidad,
          subtotal: item.precioUnitario * cantidad
        };
      }
      return item;
    }));
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-['Cormorant_Garamond'] text-[var(--color-text)] mb-2">Ventas</h1>
            <p className="text-[var(--color-text-secondary)]">
              {ventasMock.filter(v => v.estado === 'completada').length} ventas este mes
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

        {/* Cards de métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Ventas de Hoy */}
          <div className="bg-white rounded-xl border border-green-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Receipt className="text-green-600" size={24} />
              </div>
            </div>
            <div className="text-green-600" style={{ fontSize: '28px', fontWeight: 700 }}>
              {formatCurrency(totalHoy)}
            </div>
            <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>
              Ingresos hoy
            </div>
            <div className="text-green-600 mt-1" style={{ fontSize: '13px', fontWeight: 600 }}>
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
            <div className="text-[var(--color-primary)]" style={{ fontSize: '28px', fontWeight: 700 }}>
              {formatCurrency(totalMes)}
            </div>
            <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>
              Ingresos del mes
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[var(--color-text-secondary)]" style={{ fontSize: '13px' }}>
                {ventasMock.filter(v => v.estado === 'completada').length} ventas
              </span>
              <span className="text-green-600" style={{ fontSize: '13px', fontWeight: 600 }}>
                +18% vs mes anterior
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
            <div className="text-blue-600" style={{ fontSize: '28px', fontWeight: 700 }}>
              {formatCurrency(ticketPromedio)}
            </div>
            <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>
              Ticket promedio
            </div>
            <div className="text-[var(--color-text-secondary)] mt-1" style={{ fontSize: '13px' }}>
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
                  <span style={{ fontSize: '13px' }}>Servicios</span>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{porcentajeServicios}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[var(--color-secondary)] h-2 rounded-full" style={{ width: `${porcentajeServicios}%` }} />
                </div>
                <span className="text-[var(--color-text-secondary)]" style={{ fontSize: '12px' }}>
                  {formatCurrency(totalServicios)}
                </span>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span style={{ fontSize: '13px' }}>Productos</span>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{porcentajeProductos}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[var(--color-primary)] h-2 rounded-full" style={{ width: `${porcentajeProductos}%` }} />
                </div>
                <span className="text-[var(--color-text-secondary)]" style={{ fontSize: '12px' }}>
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
            onClick={() => setSelectedTab('hoy')}
            className={`pb-3 transition-colors whitespace-nowrap ${
              selectedTab === 'hoy'
                ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
            }`}
            style={{ fontWeight: selectedTab === 'hoy' ? 600 : 400 }}
          >
            Hoy ({ventasHoy.length})
          </button>
          <button
            onClick={() => setSelectedTab('semana')}
            className={`pb-3 transition-colors whitespace-nowrap ${
              selectedTab === 'semana'
                ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
            }`}
            style={{ fontWeight: selectedTab === 'semana' ? 600 : 400 }}
          >
            Esta Semana (28)
          </button>
          <button
            onClick={() => setSelectedTab('mes')}
            className={`pb-3 transition-colors whitespace-nowrap ${
              selectedTab === 'mes'
                ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
            }`}
            style={{ fontWeight: selectedTab === 'mes' ? 600 : 400 }}
          >
            Este Mes ({ventasMock.filter(v => v.estado === 'completada').length})
          </button>
          <button
            onClick={() => setSelectedTab('todo')}
            className={`pb-3 transition-colors whitespace-nowrap ${
              selectedTab === 'todo'
                ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
            }`}
            style={{ fontWeight: selectedTab === 'todo' ? 600 : 400 }}
          >
            Todo
          </button>
        </div>
      </div>

      {/* Barra de controles */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" size={20} />
            <input
              type="text"
              placeholder="Buscar por folio, paciente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] transition-colors"
            />
          </div>

          <select className="px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] bg-white">
            <option value="">Todos los tipos</option>
            <option value="cotizacion">Desde cotización</option>
            <option value="directa">Venta directa</option>
          </select>

          <select className="px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] bg-white">
            <option value="">Todos los pagos</option>
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta-credito">Tarjeta crédito</option>
            <option value="tarjeta-debito">Tarjeta débito</option>
            <option value="transferencia">Transferencia</option>
            <option value="multiple">Múltiple</option>
          </select>
        </div>
      </div>

      {/* Tabla de ventas */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F5F2EF] border-b border-[var(--color-border)]">
                <th className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Folio
                </th>
                <th className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Fecha/Hora
                </th>
                <th className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Paciente
                </th>
                <th className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Items
                </th>
                <th className="text-right px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Subtotal
                </th>
                <th className="text-right px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Descuento
                </th>
                <th className="text-right px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Total
                </th>
                <th className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Método Pago
                </th>
                <th className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Origen
                </th>
                <th className="text-center px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {ventasMock.map((venta) => {
                const itemsResumen = venta.items.length === 1 
                  ? venta.items[0].nombre
                  : `${venta.items[0].nombre}${venta.items.length > 2 ? ` + ${venta.items.length - 1} más` : `, ${venta.items[1]?.nombre || ''}`}`;

                return (
                  <tr
                    key={venta.id}
                    className={`border-b border-[var(--color-border)] hover:bg-[#FDFBF9] transition-colors ${
                      venta.estado === 'cancelada' ? 'bg-gray-50 opacity-60' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <span 
                        onClick={() => {
                          setSelectedVenta(venta);
                          setShowDetalleVenta(true);
                        }}
                        className="font-mono text-[var(--color-primary)] hover:underline cursor-pointer" 
                        style={{ fontSize: '13px', fontWeight: 600 }}
                      >
                        {venta.folio}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div style={{ fontWeight: 600 }}>{formatDate(venta.fecha)}</div>
                        <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '13px' }}>
                          {formatTime(venta.fecha)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {venta.pacienteNombre ? (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#E8DFF5] flex items-center justify-center flex-shrink-0" style={{ fontWeight: 600, fontSize: '14px' }}>
                            {venta.pacienteAvatar}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600 }}>{venta.pacienteNombre}</div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-[var(--color-text-secondary)]">Venta general</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="truncate max-w-[200px]">{itemsResumen}</span>
                        <span className="px-2 py-0.5 bg-[#F5F2EF] rounded-full text-[var(--color-text-secondary)]" style={{ fontSize: '12px' }}>
                          ({venta.items.length})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={venta.descuento > 0 ? 'text-[var(--color-text-secondary)]' : ''}>
                        {formatCurrency(venta.subtotal)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {venta.descuento > 0 ? (
                        <div className="text-red-600">
                          <div>-{formatCurrency(venta.descuento)}</div>
                          {venta.descuentoPorcentaje && (
                            <div style={{ fontSize: '12px' }}>({venta.descuentoPorcentaje}%)</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-[var(--color-text-secondary)]">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-green-600" style={{ fontWeight: 700, fontSize: '16px' }}>
                        {formatCurrency(venta.total)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getMetodoPagoIcon(venta.metodoPago)}
                        <span>{getMetodoPagoLabel(venta.metodoPago)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {venta.origen === 'cotizacion' ? (
                        <span className="inline-flex px-3 py-1 rounded-full bg-blue-100 text-blue-600" style={{ fontSize: '12px', fontWeight: 500 }}>
                          Cotización
                        </span>
                      ) : (
                        <span className="inline-flex px-3 py-1 rounded-full bg-[#8B735515] text-[var(--color-primary)]" style={{ fontSize: '12px', fontWeight: 500 }}>
                          Directa
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => {
                            setSelectedVenta(venta);
                            setShowDetalleVenta(true);
                          }}
                          className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[#8B7355]/10 rounded-lg transition-colors"
                          title="Ver detalle"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[#8B7355]/10 rounded-lg transition-colors"
                          title="Imprimir ticket"
                        >
                          <Printer size={16} />
                        </button>
                        <button 
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Enviar por WhatsApp"
                        >
                          <MessageCircle size={16} />
                        </button>
                        <div className="relative">
                          <button
                            onClick={() => setActiveMenu(activeMenu === venta.id ? null : venta.id)}
                            className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[#8B7355]/10 rounded-lg transition-colors"
                          >
                            <MoreVertical size={16} />
                          </button>
                          {activeMenu === venta.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-[var(--color-border)] py-1 z-10">
                              <button className="w-full px-4 py-2 text-left hover:bg-[#F5F2EF] flex items-center gap-2 text-red-600">
                                <XCircle size={14} />
                                <span>Cancelar venta</span>
                              </button>
                              <button className="w-full px-4 py-2 text-left hover:bg-[#F5F2EF] flex items-center gap-2">
                                <RotateCcw size={14} />
                                <span>Hacer devolución</span>
                              </button>
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

        {/* Footer */}
        <div className="px-6 py-4 bg-[#F5F2EF] border-t border-[var(--color-border)]">
          <div className="flex justify-between items-center">
            <span className="text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>
              Mostrando {ventasMock.filter(v => v.estado === 'completada').length} de {ventasMock.filter(v => v.estado === 'completada').length} ventas
            </span>
            <div>
              <span style={{ fontWeight: 600 }}>Total del período: </span>
              <span className="text-green-600" style={{ fontSize: '20px', fontWeight: 700 }}>
                {formatCurrency(totalMes)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Venta Rápida */}
      {showVentaRapidaModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="font-['Cormorant_Garamond']">Nueva Venta</h2>
                <p className="text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>
                  Folio: VTA-2025-0157 • {new Date().toLocaleString('es-MX')}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowVentaRapidaModal(false);
                  setItemsVenta([]);
                  setDescuentoActivo(false);
                  setMetodoPago('efectivo');
                  setMontoRecibido(0);
                }}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 p-6">
              {/* Columna Izquierda - Formulario */}
              <div className="lg:col-span-3 space-y-6">
                {/* Paciente */}
                <div>
                  <h3 className="mb-4" style={{ fontWeight: 600 }}>Paciente</h3>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                    placeholder="Buscar paciente por nombre o teléfono..."
                  />
                  <button className="mt-2 text-[var(--color-primary)] hover:underline" style={{ fontSize: '14px' }}>
                    + Nuevo paciente
                  </button>
                  <label className="flex items-center gap-2 mt-3">
                    <input type="checkbox" className="w-4 h-4" />
                    <span style={{ fontSize: '14px' }}>Venta sin paciente (público general)</span>
                  </label>
                </div>

                {/* Agregar Items */}
                <div className="border-t border-[var(--color-border)] pt-6">
                  <h3 className="mb-4" style={{ fontWeight: 600 }}>Agregar Items</h3>
                  
                  <div className="flex gap-2 border-b border-[var(--color-border)] mb-4">
                    <button className="px-4 py-2 border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]" style={{ fontWeight: 600 }}>
                      Servicios
                    </button>
                    <button className="px-4 py-2 text-[var(--color-text-secondary)]">
                      Productos
                    </button>
                  </div>

                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] mb-4"
                    placeholder="Buscar servicio o producto..."
                  />

                  {/* Lista de items */}
                  {itemsVenta.length > 0 ? (
                    <div className="space-y-2">
                      {itemsVenta.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 bg-[#F5F2EF] rounded-lg">
                          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                            {item.tipo === 'servicio' ? <Sparkles size={16} className="text-[var(--color-secondary)]" /> : <Package size={16} className="text-[var(--color-primary)]" />}
                          </div>
                          <div className="flex-1">
                            <div style={{ fontWeight: 600, fontSize: '14px' }}>{item.nombre}</div>
                            <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '12px' }}>
                              {formatCurrency(item.precioUnitario)} c/u
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => actualizarCantidadItem(item.id, item.cantidad - 1)}
                              className="p-1 hover:bg-white rounded"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-8 text-center" style={{ fontWeight: 600 }}>{item.cantidad}</span>
                            <button 
                              onClick={() => actualizarCantidadItem(item.id, item.cantidad + 1)}
                              className="p-1 hover:bg-white rounded"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <div className="w-24 text-right" style={{ fontWeight: 600 }}>
                            {formatCurrency(item.subtotal)}
                          </div>
                          <button onClick={() => eliminarItemVenta(item.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-[var(--color-text-secondary)] bg-[#F5F2EF] rounded-lg">
                      No hay items agregados
                    </div>
                  )}
                </div>

                {/* Descuento */}
                <div className="border-t border-[var(--color-border)] pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 style={{ fontWeight: 600 }}>Descuento</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={descuentoActivo}
                        onChange={(e) => setDescuentoActivo(e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-success)]"></div>
                    </label>
                  </div>

                  {descuentoActivo && (
                    <div className="grid grid-cols-2 gap-3">
                      <select 
                        value={descuentoTipo}
                        onChange={(e) => setDescuentoTipo(e.target.value as 'porcentaje' | 'monto')}
                        className="px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                      >
                        <option value="porcentaje">Porcentaje</option>
                        <option value="monto">Monto fijo</option>
                      </select>
                      <input
                        type="number"
                        value={descuentoValor || ''}
                        onChange={(e) => setDescuentoValor(Number(e.target.value))}
                        className="px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                        placeholder={descuentoTipo === 'porcentaje' ? '0%' : '$0'}
                      />
                    </div>
                  )}
                </div>

                {/* Pago */}
                <div className="border-t border-[var(--color-border)] pt-6">
                  <h3 className="mb-4" style={{ fontWeight: 600 }}>Método de Pago</h3>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button
                      onClick={() => setMetodoPago('efectivo')}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        metodoPago === 'efectivo' ? 'border-[var(--color-primary)] bg-[#8B735515]' : 'border-[var(--color-border)]'
                      }`}
                    >
                      <Banknote className={`mx-auto mb-2 ${metodoPago === 'efectivo' ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]'}`} size={24} />
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>Efectivo</div>
                    </button>
                    <button
                      onClick={() => setMetodoPago('tarjeta-credito')}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        metodoPago === 'tarjeta-credito' ? 'border-[var(--color-primary)] bg-[#8B735515]' : 'border-[var(--color-border)]'
                      }`}
                    >
                      <CreditCard className={`mx-auto mb-2 ${metodoPago === 'tarjeta-credito' ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]'}`} size={24} />
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>Tarjeta</div>
                    </button>
                    <button
                      onClick={() => setMetodoPago('transferencia')}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        metodoPago === 'transferencia' ? 'border-[var(--color-primary)] bg-[#8B735515]' : 'border-[var(--color-border)]'
                      }`}
                    >
                      <Smartphone className={`mx-auto mb-2 ${metodoPago === 'transferencia' ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]'}`} size={24} />
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>Transfer.</div>
                    </button>
                    <button
                      onClick={() => setMetodoPago('multiple')}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        metodoPago === 'multiple' ? 'border-[var(--color-primary)] bg-[#8B735515]' : 'border-[var(--color-border)]'
                      }`}
                    >
                      <div className="mb-2 text-center" style={{ fontSize: '24px' }}>💳💵</div>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>Múltiple</div>
                    </button>
                  </div>

                  {metodoPago === 'efectivo' && (
                    <div>
                      <label className="block mb-2" style={{ fontWeight: 600 }}>
                        Monto recibido
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]">$</span>
                        <input
                          type="number"
                          value={montoRecibido || ''}
                          onChange={(e) => setMontoRecibido(Number(e.target.value))}
                          className="w-full pl-8 pr-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                          placeholder="0.00"
                        />
                      </div>
                      {montoRecibido > calcularTotalVenta() && (
                        <div className="mt-2 p-3 bg-green-50 rounded-lg">
                          <div className="flex justify-between">
                            <span className="text-green-600" style={{ fontWeight: 600 }}>Cambio:</span>
                            <span className="text-green-600" style={{ fontSize: '18px', fontWeight: 700 }}>
                              {formatCurrency(calcularCambio())}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Columna Derecha - Preview de Ticket */}
              <div className="lg:col-span-2">
                <div className="sticky top-24 bg-white border-2 border-[var(--color-border)] rounded-xl p-6">
                  <div className="text-center mb-6 pb-4 border-b border-[var(--color-border)]">
                    <div className="text-[var(--color-primary)] mb-2" style={{ fontSize: '24px', fontWeight: 700 }}>
                      Bio Plasma
                    </div>
                    <div className="text-[var(--color-text-secondary)] mb-1" style={{ fontSize: '16px', fontWeight: 600 }}>
                      TICKET DE VENTA
                    </div>
                    <div className="font-mono text-[var(--color-text-secondary)]" style={{ fontSize: '12px' }}>
                      VTA-2025-0157
                    </div>
                    <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '12px' }}>
                      {new Date().toLocaleString('es-MX')}
                    </div>
                  </div>

                  {itemsVenta.length > 0 ? (
                    <>
                      <table className="w-full mb-4">
                        <thead>
                          <tr className="border-b border-[var(--color-border)]">
                            <th className="text-left pb-2 text-[var(--color-text-secondary)]" style={{ fontSize: '12px' }}>Concepto</th>
                            <th className="text-center pb-2 text-[var(--color-text-secondary)]" style={{ fontSize: '12px' }}>Cant.</th>
                            <th className="text-right pb-2 text-[var(--color-text-secondary)]" style={{ fontSize: '12px' }}>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {itemsVenta.map((item) => (
                            <tr key={item.id} className="border-b border-[var(--color-border)]">
                              <td className="py-2" style={{ fontSize: '13px' }}>{item.nombre}</td>
                              <td className="py-2 text-center" style={{ fontSize: '13px' }}>{item.cantidad}</td>
                              <td className="py-2 text-right" style={{ fontSize: '13px', fontWeight: 600 }}>
                                {formatCurrency(item.subtotal)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div className="space-y-2 mb-6">
                        <div className="flex justify-between">
                          <span className="text-[var(--color-text-secondary)]">Subtotal:</span>
                          <span style={{ fontWeight: 600 }}>{formatCurrency(calcularSubtotalVenta())}</span>
                        </div>
                        {descuentoActivo && calcularDescuentoVenta() > 0 && (
                          <div className="flex justify-between text-red-600">
                            <span>Descuento:</span>
                            <span>-{formatCurrency(calcularDescuentoVenta())}</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t border-[var(--color-border)]">
                          <span style={{ fontSize: '18px', fontWeight: 700 }}>TOTAL:</span>
                          <span className="text-[var(--color-secondary)]" style={{ fontSize: '20px', fontWeight: 700 }}>
                            {formatCurrency(calcularTotalVenta())}
                          </span>
                        </div>
                      </div>

                      {metodoPago && (
                        <div className="mb-6 p-3 bg-[#F5F2EF] rounded-lg">
                          <div className="flex justify-between mb-1">
                            <span className="text-[var(--color-text-secondary)]" style={{ fontSize: '13px' }}>Pago:</span>
                            <span style={{ fontWeight: 600 }}>{getMetodoPagoLabel(metodoPago)}</span>
                          </div>
                          {metodoPago === 'efectivo' && montoRecibido > 0 && (
                            <>
                              <div className="flex justify-between">
                                <span className="text-[var(--color-text-secondary)]" style={{ fontSize: '13px' }}>Recibido:</span>
                                <span>{formatCurrency(montoRecibido)}</span>
                              </div>
                              {calcularCambio() > 0 && (
                                <div className="flex justify-between">
                                  <span className="text-green-600" style={{ fontSize: '13px', fontWeight: 600 }}>Cambio:</span>
                                  <span className="text-green-600" style={{ fontWeight: 600 }}>{formatCurrency(calcularCambio())}</span>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8 text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>
                      Agrega items para ver el ticket
                    </div>
                  )}

                  <div className="text-center text-[var(--color-text-secondary)] pt-4 border-t border-[var(--color-border)]" style={{ fontSize: '11px' }}>
                    ¡Gracias por tu visita!
                    <br />
                    Bio Plasma • Hermosillo, Sonora
                    <br />
                    (662) 000-0000 • contacto@bioplasma.com
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-[var(--color-border)] px-6 py-4 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowVentaRapidaModal(false);
                  setItemsVenta([]);
                  setDescuentoActivo(false);
                  setMetodoPago('efectivo');
                  setMontoRecibido(0);
                }}
                className="px-6 py-2.5 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors"
              >
                Cancelar
              </button>
              <button className="px-6 py-2.5 border border-[var(--color-primary)] text-[var(--color-primary)] rounded-lg hover:bg-[#8B7355]/10 transition-colors">
                Guardar e Imprimir
              </button>
              <button className="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[#7A6349] transition-colors">
                Completar Venta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drawer: Detalle de Venta */}
      {showDetalleVenta && selectedVenta && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-end z-50">
          <div className="bg-white w-full md:w-[500px] h-full overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[var(--color-border)] px-6 py-4 z-10">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-['Cormorant_Garamond']">Detalle de Venta</h2>
                <button
                  onClick={() => {
                    setShowDetalleVenta(false);
                    setSelectedVenta(null);
                  }}
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <p className="text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>
                Ventas {'>'} {selectedVenta.folio}
              </p>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors">
                  <Printer size={16} />
                  <span style={{ fontSize: '14px' }}>Imprimir</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors">
                  <MessageCircle size={16} />
                  <span style={{ fontSize: '14px' }}>WhatsApp</span>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Información de la venta */}
              <div className="bg-[#F5F2EF] rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '12px' }}>Folio</div>
                    <div style={{ fontWeight: 600 }}>{selectedVenta.folio}</div>
                  </div>
                  <div>
                    <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '12px' }}>Fecha</div>
                    <div style={{ fontWeight: 600 }}>{formatDate(selectedVenta.fecha)}</div>
                  </div>
                  <div>
                    <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '12px' }}>Hora</div>
                    <div style={{ fontWeight: 600 }}>{formatTime(selectedVenta.fecha)}</div>
                  </div>
                  <div>
                    <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '12px' }}>Origen</div>
                    <div>
                      {selectedVenta.origen === 'cotizacion' ? (
                        <span className="text-blue-600 hover:underline cursor-pointer" style={{ fontWeight: 600 }}>
                          {selectedVenta.cotizacionFolio}
                        </span>
                      ) : (
                        <span style={{ fontWeight: 600 }}>Venta directa</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Paciente */}
              <div className="border-t border-[var(--color-border)] pt-6">
                <h3 className="mb-3" style={{ fontWeight: 600 }}>Paciente</h3>
                {selectedVenta.pacienteNombre ? (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#E8DFF5] flex items-center justify-center" style={{ fontWeight: 600 }}>
                      {selectedVenta.pacienteAvatar}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{selectedVenta.pacienteNombre}</div>
                      <button className="text-[var(--color-primary)] hover:underline" style={{ fontSize: '13px' }}>
                        Ver expediente <ChevronRight size={12} className="inline" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-[var(--color-text-secondary)]">Venta sin paciente asignado</div>
                )}
              </div>

              {/* Items vendidos */}
              <div className="border-t border-[var(--color-border)] pt-6">
                <h3 className="mb-3" style={{ fontWeight: 600 }}>Items Vendidos</h3>
                <div className="space-y-2 mb-4">
                  {selectedVenta.items.map((item, index) => (
                    <div key={item.id} className="flex items-start gap-3 p-3 bg-[#F5F2EF] rounded-lg">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                        {item.tipo === 'servicio' ? <Sparkles size={16} className="text-[var(--color-secondary)]" /> : <Package size={16} className="text-[var(--color-primary)]" />}
                      </div>
                      <div className="flex-1">
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>{item.nombre}</div>
                        <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '12px' }}>
                          {item.cantidad} × {formatCurrency(item.precioUnitario)}
                        </div>
                      </div>
                      <div style={{ fontWeight: 600 }}>{formatCurrency(item.subtotal)}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 p-4 bg-white border border-[var(--color-border)] rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-secondary)]">Subtotal:</span>
                    <span style={{ fontWeight: 600 }}>{formatCurrency(selectedVenta.subtotal)}</span>
                  </div>
                  {selectedVenta.descuento > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Descuento {selectedVenta.descuentoPorcentaje ? `(${selectedVenta.descuentoPorcentaje}%)` : ''}:</span>
                      <span>-{formatCurrency(selectedVenta.descuento)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-[var(--color-border)]">
                    <span style={{ fontSize: '18px', fontWeight: 700 }}>TOTAL:</span>
                    <span className="text-green-600" style={{ fontSize: '20px', fontWeight: 700 }}>
                      {formatCurrency(selectedVenta.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Información del pago */}
              <div className="border-t border-[var(--color-border)] pt-6">
                <h3 className="mb-3" style={{ fontWeight: 600 }}>Información del Pago</h3>
                <div className="bg-[#F5F2EF] rounded-lg p-4">
                  {selectedVenta.metodoPago === 'multiple' && selectedVenta.pagos ? (
                    <div className="space-y-2">
                      {selectedVenta.pagos.map((pago, index) => (
                        <div key={index} className="flex justify-between">
                          <div className="flex items-center gap-2">
                            {getMetodoPagoIcon(pago.metodo)}
                            <span>{getMetodoPagoLabel(pago.metodo)}</span>
                            {pago.referencia && (
                              <span className="text-[var(--color-text-secondary)]" style={{ fontSize: '12px' }}>
                                {pago.referencia}
                              </span>
                            )}
                          </div>
                          <span style={{ fontWeight: 600 }}>{formatCurrency(pago.monto)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between pt-2 border-t border-[var(--color-border)]">
                        <span style={{ fontWeight: 700 }}>Total:</span>
                        <span style={{ fontWeight: 700 }}>{formatCurrency(selectedVenta.total)}</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getMetodoPagoIcon(selectedVenta.metodoPago)}
                          <span style={{ fontWeight: 600 }}>{getMetodoPagoLabel(selectedVenta.metodoPago)}</span>
                        </div>
                        <span style={{ fontWeight: 700 }}>{formatCurrency(selectedVenta.total)}</span>
                      </div>
                      {selectedVenta.referencia && (
                        <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '13px' }}>
                          Referencia: {selectedVenta.referencia}
                        </div>
                      )}
                      {selectedVenta.metodoPago === 'efectivo' && selectedVenta.montoRecibido && (
                        <div className="mt-2 pt-2 border-t border-[var(--color-border)]">
                          <div className="flex justify-between text-[var(--color-text-secondary)]" style={{ fontSize: '13px' }}>
                            <span>Monto recibido:</span>
                            <span>{formatCurrency(selectedVenta.montoRecibido)}</span>
                          </div>
                          {selectedVenta.cambio && selectedVenta.cambio > 0 && (
                            <div className="flex justify-between text-green-600" style={{ fontSize: '13px', fontWeight: 600 }}>
                              <span>Cambio entregado:</span>
                              <span>{formatCurrency(selectedVenta.cambio)}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Vendedora y comisión */}
              <div className="border-t border-[var(--color-border)] pt-6">
                <h3 className="mb-3" style={{ fontWeight: 600 }}>Vendedora</h3>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span style={{ fontWeight: 600 }}>{selectedVenta.vendedora}</span>
                    <div className="text-right">
                      <div className="text-blue-600" style={{ fontSize: '12px' }}>Comisión generada</div>
                      <div className="text-blue-600" style={{ fontWeight: 700 }}>
                        {formatCurrency(selectedVenta.total * 0.1)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
