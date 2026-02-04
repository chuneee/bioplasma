import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Receipt,
  Users,
  Star,
  ArrowUp,
  ShoppingCart,
  Sparkles,
  Package,
  Percent,
  Download,
  ChevronRight,
  BarChart3,
  PieChart,
  Calendar,
  DollarSign,
  Target,
  Award,
  AlertCircle,
  FileText,
  Filter
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartsPie,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

type CategoriaReporte = 'ventas' | 'servicios' | 'pacientes' | 'inventario' | 'finanzas' | 'comisiones';
type VistaActual = 'dashboard' | CategoriaReporte;

interface MetricaCard {
  titulo: string;
  valor: string;
  comparativa: string;
  tendencia: 'up' | 'down' | 'neutral';
  icono: React.ReactNode;
}

const COLORS = ['#8B7355', '#D4A574', '#7DB07D', '#6B9BD1', '#E8B86D', '#9B8BA3'];

const datosVentasPorDia = [
  { dia: 'Lun', ventas: 12, monto: 4800 },
  { dia: 'Mar', ventas: 15, monto: 6200 },
  { dia: 'Mié', ventas: 18, monto: 7400 },
  { dia: 'Jue', ventas: 14, monto: 5600 },
  { dia: 'Vie', ventas: 22, monto: 8900 },
  { dia: 'Sáb', ventas: 25, monto: 10500 }
];

const datosDistribucionTipo = [
  { name: 'Servicios', value: 72, monto: 44928 },
  { name: 'Productos', value: 28, monto: 17472 }
];

const datosServiciosTop = [
  { servicio: 'Limpieza Facial', cantidad: 48, ingresos: 40800, categoria: 'Facial' },
  { servicio: 'Hidratación Intensiva', cantidad: 35, ingresos: 21000, categoria: 'Facial' },
  { servicio: 'Ácido Hialurónico', cantidad: 22, ingresos: 22000, categoria: 'Inyectable' },
  { servicio: 'Botox', cantidad: 18, ingresos: 36000, categoria: 'Inyectable' },
  { servicio: 'Peeling Químico', cantidad: 15, ingresos: 22500, categoria: 'Facial' },
  { servicio: 'Plasma Rico', cantidad: 12, ingresos: 30000, categoria: 'Inyectable' },
  { servicio: 'Radiofrecuencia', cantidad: 10, ingresos: 15000, categoria: 'Corporal' },
  { servicio: 'Masaje Reductivo', cantidad: 8, ingresos: 6400, categoria: 'Corporal' }
];

const datosMetodosPago = [
  { metodo: 'Efectivo', transacciones: 58, monto: 21840 },
  { metodo: 'Tarjeta Crédito', transacciones: 52, monto: 24960 },
  { metodo: 'Tarjeta Débito', transacciones: 28, monto: 9360 },
  { metodo: 'Transferencia', transacciones: 18, monto: 6240 }
];

const datosPacientes = [
  { mes: 'Jun', nuevos: 28, recurrentes: 45 },
  { mes: 'Jul', nuevos: 32, recurrentes: 52 },
  { mes: 'Ago', nuevos: 26, recurrentes: 48 },
  { mes: 'Sep', nuevos: 35, recurrentes: 58 },
  { mes: 'Oct', nuevos: 30, recurrentes: 54 },
  { mes: 'Nov', nuevos: 34, recurrentes: 55 }
];

const datosTopPacientes = [
  { nombre: 'María García López', visitas: 24, gastoTotal: 45600, ultimaVisita: 'Hace 3 días' },
  { nombre: 'Carmen Ruiz', visitas: 18, gastoTotal: 32400, ultimaVisita: 'Hace 1 semana' },
  { nombre: 'Ana López', visitas: 15, gastoTotal: 28500, ultimaVisita: 'Hace 2 días' },
  { nombre: 'Laura Méndez', visitas: 12, gastoTotal: 24800, ultimaVisita: 'Hace 5 días' },
  { nombre: 'Patricia Luna', visitas: 10, gastoTotal: 18900, ultimaVisita: 'Hace 1 semana' }
];

const datosIngresosGastos = [
  { mes: 'Jun', ingresos: 58400, gastos: 28600 },
  { mes: 'Jul', ingresos: 62100, gastos: 30200 },
  { mes: 'Ago', ingresos: 55800, gastos: 27400 },
  { mes: 'Sep', ingresos: 68200, gastos: 32800 },
  { mes: 'Oct', ingresos: 64500, gastos: 31200 },
  { mes: 'Nov', ingresos: 62400, gastos: 28650 }
];

export function Reportes() {
  const [vistaActual, setVistaActual] = useState<VistaActual>('dashboard');
  const [periodo, setPeriodo] = useState('mes');
  const [selectedTab, setSelectedTab] = useState('resumen');
  const [mostrarMonto, setMostrarMonto] = useState(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Categorías reorganizadas por secciones
  const categoriasAdministrativas = [
    {
      id: 'finanzas' as CategoriaReporte,
      titulo: 'Finanzas',
      descripcion: 'Ingresos, gastos, utilidad, flujo de efectivo',
      icono: <Wallet size={32} />,
      color: 'green',
      reportes: [
        'Estado de resultados',
        'Ingresos vs gastos',
        'Gastos por categoría',
        'Flujo de efectivo'
      ]
    },
    {
      id: 'ventas' as CategoriaReporte,
      titulo: 'Ventas',
      descripcion: 'Análisis de ventas, ticket promedio, métodos de pago',
      icono: <ShoppingCart size={32} />,
      color: 'green',
      reportes: [
        'Ventas por período',
        'Ventas por servicio',
        'Ventas por método de pago',
        'Ticket promedio'
      ]
    },
    {
      id: 'comisiones' as CategoriaReporte,
      titulo: 'Comisiones',
      descripcion: 'Rendimiento de vendedoras, comisiones generadas y pagadas',
      icono: <Percent size={32} />,
      color: 'secondary',
      reportes: [
        'Comisiones por vendedora',
        'Rendimiento de ventas',
        'Histórico de pagos'
      ]
    },
    {
      id: 'inventario' as CategoriaReporte,
      titulo: 'Inventario',
      descripcion: 'Movimientos, productos más usados, valor del inventario',
      icono: <Package size={32} />,
      color: 'amber',
      reportes: [
        'Movimientos de inventario',
        'Productos más utilizados',
        'Valor del inventario',
        'Productos por caducar'
      ]
    }
  ];

  const categoriasServiciosPacientes = [
    {
      id: 'pacientes' as CategoriaReporte,
      titulo: 'Pacientes',
      descripcion: 'Nuevos vs recurrentes, frecuencia de visitas, retención',
      icono: <Users size={32} />,
      color: 'blue',
      reportes: [
        'Pacientes nuevos vs recurrentes',
        'Frecuencia de visitas',
        'Pacientes más frecuentes',
        'Tasa de retención'
      ]
    },
    {
      id: 'servicios' as CategoriaReporte,
      titulo: 'Servicios',
      descripcion: 'Tratamientos más solicitados, frecuencia, ingresos por servicio',
      icono: <Sparkles size={32} />,
      color: 'primary',
      reportes: [
        'Servicios más vendidos',
        'Ingresos por servicio',
        'Servicios por categoría',
        'Paquetes vendidos'
      ]
    }
  ];

  // Todas las categorías combinadas para mantener compatibilidad
  const categorias = [...categoriasAdministrativas, ...categoriasServiciosPacientes];

  const getColorClass = (color: string) => {
    switch (color) {
      case 'green': return 'bg-green-100 text-green-600 border-green-200';
      case 'primary': return 'bg-[#8B735515] text-[var(--color-primary)] border-[#8B735530]';
      case 'blue': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'amber': return 'bg-amber-100 text-amber-600 border-amber-200';
      case 'secondary': return 'bg-[#D4A57415] text-[var(--color-secondary)] border-[#D4A57430]';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const renderDashboard = () => (
    <div>
      {/* Métricas Clave */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {/* Ingresos Totales */}
        <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Wallet className="text-green-600" size={20} />
            </div>
            <TrendingUp size={16} className="text-green-600" />
          </div>
          <div className="text-green-600" style={{ fontSize: '24px', fontWeight: 700 }}>
            $62,400
          </div>
          <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '12px' }}>
            Ingresos totales
          </div>
          <div className="text-green-600 mt-1" style={{ fontSize: '11px', fontWeight: 600 }}>
            +18% vs anterior
          </div>
        </div>

        {/* Total Ventas */}
        <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#8B735515] flex items-center justify-center">
              <Receipt className="text-[var(--color-primary)]" size={20} />
            </div>
          </div>
          <div className="text-[var(--color-primary)]" style={{ fontSize: '24px', fontWeight: 700 }}>
            156
          </div>
          <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '12px' }}>
            Total ventas
          </div>
          <div className="text-[var(--color-text-secondary)] mt-1" style={{ fontSize: '11px' }}>
            +12 ventas
          </div>
        </div>

        {/* Pacientes Atendidos */}
        <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="text-blue-600" size={20} />
            </div>
          </div>
          <div className="text-blue-600" style={{ fontSize: '24px', fontWeight: 700 }}>
            89
          </div>
          <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '12px' }}>
            Pacientes atendidos
          </div>
          <div className="text-[var(--color-text-secondary)] mt-1" style={{ fontSize: '11px' }}>
            34 nuevos, 55 recurrentes
          </div>
        </div>

        {/* Servicio Top */}
        <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#D4A57415] flex items-center justify-center">
              <Star className="text-[var(--color-secondary)]" size={20} />
            </div>
          </div>
          <div className="text-[var(--color-secondary)]" style={{ fontSize: '16px', fontWeight: 700 }}>
            Limpieza Facial
          </div>
          <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '12px' }}>
            Servicio top
          </div>
          <div className="text-[var(--color-text-secondary)] mt-1" style={{ fontSize: '11px' }}>
            48 realizados
          </div>
        </div>

        {/* Utilidad Neta */}
        <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp className="text-green-600" size={20} />
            </div>
          </div>
          <div className="text-green-600" style={{ fontSize: '24px', fontWeight: 700 }}>
            $33,750
          </div>
          <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '12px' }}>
            Utilidad neta
          </div>
          <div className="text-[var(--color-text-secondary)] mt-1" style={{ fontSize: '11px' }}>
            Margen: 54%
          </div>
        </div>
      </div>

      {/* Categorías de Reportes */}
      <div className="mb-6">
        <h3 className="mb-6" style={{ fontWeight: 600, fontSize: '18px' }}>Categorías de Reportes</h3>
        
        {/* Sección: Gestión Administrativa */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
              <BarChart3 className="text-white" size={20} />
            </div>
            <div>
              <h4 className="font-['Cormorant_Garamond'] text-[var(--color-primary)]" style={{ fontSize: '20px', fontWeight: 600 }}>
                Gestión Administrativa
              </h4>
              <p className="text-[var(--color-text-secondary)]" style={{ fontSize: '13px' }}>
                Control financiero, ventas y operaciones del negocio
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categoriasAdministrativas.map((categoria) => (
              <div
                key={categoria.id}
                className="bg-white rounded-xl border-2 border-[var(--color-border)] p-6 hover:border-[var(--color-primary)] transition-all cursor-pointer group"
                onClick={() => setVistaActual(categoria.id)}
              >
                <div className={`w-16 h-16 rounded-xl ${getColorClass(categoria.color)} flex items-center justify-center mb-4`}>
                  {categoria.icono}
                </div>
                <h4 className="mb-2" style={{ fontWeight: 600, fontSize: '18px' }}>{categoria.titulo}</h4>
                <p className="text-[var(--color-text-secondary)] mb-4" style={{ fontSize: '14px' }}>
                  {categoria.descripcion}
                </p>
                <div className="space-y-1 mb-4">
                  {categoria.reportes.map((reporte, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[var(--color-text-secondary)]" style={{ fontSize: '13px' }}>
                      <div className="w-1 h-1 rounded-full bg-[var(--color-text-secondary)]" />
                      <span>{reporte}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full flex items-center justify-between px-4 py-2 border border-[var(--color-border)] rounded-lg group-hover:bg-[var(--color-primary)] group-hover:text-white group-hover:border-[var(--color-primary)] transition-all">
                  <span style={{ fontWeight: 600, fontSize: '14px' }}>Ver Reportes</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Divisor */}
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent mb-8" />

        {/* Sección: Servicios y Pacientes */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#7DB07D] flex items-center justify-center">
              <Sparkles className="text-white" size={20} />
            </div>
            <div>
              <h4 className="font-['Cormorant_Garamond'] text-[#7DB07D]" style={{ fontSize: '20px', fontWeight: 600 }}>
                Servicios y Pacientes
              </h4>
              <p className="text-[var(--color-text-secondary)]" style={{ fontSize: '13px' }}>
                Análisis de tratamientos, pacientes y atención clínica
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoriasServiciosPacientes.map((categoria) => (
              <div
                key={categoria.id}
                className="bg-white rounded-xl border-2 border-[var(--color-border)] p-6 hover:border-[var(--color-primary)] transition-all cursor-pointer group"
                onClick={() => setVistaActual(categoria.id)}
              >
                <div className={`w-16 h-16 rounded-xl ${getColorClass(categoria.color)} flex items-center justify-center mb-4`}>
                  {categoria.icono}
                </div>
                <h4 className="mb-2" style={{ fontWeight: 600, fontSize: '18px' }}>{categoria.titulo}</h4>
                <p className="text-[var(--color-text-secondary)] mb-4" style={{ fontSize: '14px' }}>
                  {categoria.descripcion}
                </p>
                <div className="space-y-1 mb-4">
                  {categoria.reportes.map((reporte, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[var(--color-text-secondary)]" style={{ fontSize: '13px' }}>
                      <div className="w-1 h-1 rounded-full bg-[var(--color-text-secondary)]" />
                      <span>{reporte}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full flex items-center justify-between px-4 py-2 border border-[var(--color-border)] rounded-lg group-hover:bg-[var(--color-primary)] group-hover:text-white group-hover:border-[var(--color-primary)] transition-all">
                  <span style={{ fontWeight: 600, fontSize: '14px' }}>Ver Reportes</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reportes Frecuentes */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 style={{ fontWeight: 600, fontSize: '18px' }}>Acceso Rápido</h3>
          <button className="text-[var(--color-primary)] hover:underline" style={{ fontSize: '14px' }}>
            Personalizar
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="px-4 py-2 bg-[#F5F2EF] rounded-lg hover:bg-[#8B7355] hover:text-white transition-colors">
            Ventas del Mes
          </button>
          <button className="px-4 py-2 bg-[#F5F2EF] rounded-lg hover:bg-[#8B7355] hover:text-white transition-colors">
            Servicios Top 10
          </button>
          <button className="px-4 py-2 bg-[#F5F2EF] rounded-lg hover:bg-[#8B7355] hover:text-white transition-colors">
            Estado de Resultados
          </button>
          <button className="px-4 py-2 bg-[#F5F2EF] rounded-lg hover:bg-[#8B7355] hover:text-white transition-colors">
            Pacientes Nuevos
          </button>
          <button className="px-4 py-2 border-2 border-dashed border-[var(--color-border)] rounded-lg text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors">
            + Agregar favorito
          </button>
        </div>
      </div>
    </div>
  );

  const renderReportesVentas = () => (
    <div>
      <div className="mb-6">
        <button
          onClick={() => setVistaActual('dashboard')}
          className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] mb-4"
        >
          <ChevronRight size={16} className="rotate-180" />
          <span>Reportes</span>
        </button>
        <h2 className="font-['Cormorant_Garamond']">Reportes de Ventas</h2>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-[var(--color-border)] overflow-x-auto">
        <div className="flex gap-6 min-w-max">
          {['resumen', 'periodo', 'servicio', 'metodo', 'vendedora'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`pb-3 transition-colors whitespace-nowrap capitalize ${
                selectedTab === tab
                  ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
              }`}
              style={{ fontWeight: selectedTab === tab ? 600 : 400 }}
            >
              {tab === 'resumen' ? 'Resumen General' : 
               tab === 'periodo' ? 'Por Período' :
               tab === 'servicio' ? 'Por Servicio/Producto' :
               tab === 'metodo' ? 'Por Método de Pago' :
               'Por Vendedora'}
            </button>
          ))}
        </div>
      </div>

      {selectedTab === 'resumen' && (
        <div className="space-y-6">
          {/* Métricas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-[var(--color-border)] p-4">
              <div className="text-[var(--color-text-secondary)] mb-1" style={{ fontSize: '12px' }}>Ventas Totales</div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>156</div>
            </div>
            <div className="bg-white rounded-xl border border-[var(--color-border)] p-4">
              <div className="text-[var(--color-text-secondary)] mb-1" style={{ fontSize: '12px' }}>Ingresos</div>
              <div className="text-green-600" style={{ fontSize: '28px', fontWeight: 700 }}>$62,400</div>
            </div>
            <div className="bg-white rounded-xl border border-[var(--color-border)] p-4">
              <div className="text-[var(--color-text-secondary)] mb-1" style={{ fontSize: '12px' }}>Ticket Promedio</div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>$400</div>
            </div>
            <div className="bg-white rounded-xl border border-[var(--color-border)] p-4">
              <div className="text-[var(--color-text-secondary)] mb-1" style={{ fontSize: '12px' }}>Descuentos</div>
              <div className="text-red-600" style={{ fontSize: '28px', fontWeight: 700 }}>$3,200</div>
              <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '11px' }}>5% del total</div>
            </div>
          </div>

          {/* Gráfica de Ventas */}
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 style={{ fontWeight: 600, fontSize: '18px' }}>Ventas por Día</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setMostrarMonto(!mostrarMonto)}
                  className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] hover:bg-[#F5F2EF]"
                  style={{ fontSize: '13px' }}
                >
                  {mostrarMonto ? 'Ver Cantidad' : 'Ver Monto'}
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={datosVentasPorDia}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="dia" stroke="#6B6560" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6B6560" style={{ fontSize: '12px' }} />
                <Tooltip 
                  formatter={(value) => mostrarMonto ? formatCurrency(Number(value)) : value}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E5E7EB', 
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
                <Bar 
                  dataKey={mostrarMonto ? 'monto' : 'ventas'} 
                  fill="#8B7355" 
                  radius={[8, 8, 0, 0]}
                  name={mostrarMonto ? 'Monto' : 'Ventas'}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Distribución por Tipo */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
              <h3 className="mb-6" style={{ fontWeight: 600, fontSize: '18px' }}>Distribución por Tipo</h3>
              <ResponsiveContainer width="100%" height={250}>
                <RechartsPie>
                  <Pie
                    data={datosDistribucionTipo}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name} ${entry.value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {datosDistribucionTipo.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [formatCurrency(props.payload.monto), name]} />
                </RechartsPie>
              </ResponsiveContainer>
            </div>

            {/* Ventas Destacadas */}
            <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
              <h3 className="mb-4" style={{ fontWeight: 600, fontSize: '18px' }}>Ventas Destacadas</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[#F5F2EF] rounded-lg">
                  <div>
                    <div style={{ fontWeight: 600 }}>15 Nov - VTA-0142</div>
                    <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '13px' }}>Ana López</div>
                  </div>
                  <div className="text-green-600" style={{ fontWeight: 700, fontSize: '18px' }}>
                    $8,500
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#F5F2EF] rounded-lg">
                  <div>
                    <div style={{ fontWeight: 600 }}>12 Nov - VTA-0138</div>
                    <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '13px' }}>Carmen Ruiz</div>
                  </div>
                  <div className="text-green-600" style={{ fontWeight: 700, fontSize: '18px' }}>
                    $6,200
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#F5F2EF] rounded-lg">
                  <div>
                    <div style={{ fontWeight: 600 }}>08 Nov - VTA-0135</div>
                    <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '13px' }}>María García</div>
                  </div>
                  <div className="text-green-600" style={{ fontWeight: 700, fontSize: '18px' }}>
                    $5,800
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'servicio' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
            <h3 className="mb-6" style={{ fontWeight: 600, fontSize: '18px' }}>Ranking de Servicios/Productos</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    <th className="text-center pb-3 text-[var(--color-text-secondary)]" style={{ fontSize: '12px', fontWeight: 600 }}>#</th>
                    <th className="text-left pb-3 text-[var(--color-text-secondary)]" style={{ fontSize: '12px', fontWeight: 600 }}>SERVICIO/PRODUCTO</th>
                    <th className="text-left pb-3 text-[var(--color-text-secondary)]" style={{ fontSize: '12px', fontWeight: 600 }}>CATEGORÍA</th>
                    <th className="text-center pb-3 text-[var(--color-text-secondary)]" style={{ fontSize: '12px', fontWeight: 600 }}>CANTIDAD</th>
                    <th className="text-right pb-3 text-[var(--color-text-secondary)]" style={{ fontSize: '12px', fontWeight: 600 }}>INGRESOS</th>
                    <th className="text-right pb-3 text-[var(--color-text-secondary)]" style={{ fontSize: '12px', fontWeight: 600 }}>% DEL TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {datosServiciosTop.map((servicio, index) => {
                    const porcentaje = (servicio.ingresos / 62400 * 100).toFixed(1);
                    return (
                      <tr key={index} className="border-b border-[var(--color-border)]">
                        <td className="py-3 text-center">
                          <span className="w-6 h-6 rounded-full bg-[#F5F2EF] inline-flex items-center justify-center" style={{ fontSize: '12px', fontWeight: 600 }}>
                            {index + 1}
                          </span>
                        </td>
                        <td className="py-3" style={{ fontWeight: 600 }}>{servicio.servicio}</td>
                        <td className="py-3">
                          <span className="px-2 py-1 bg-[#F5F2EF] rounded-full" style={{ fontSize: '12px' }}>
                            {servicio.categoria}
                          </span>
                        </td>
                        <td className="py-3 text-center">{servicio.cantidad}</td>
                        <td className="py-3 text-right text-green-600" style={{ fontWeight: 700 }}>
                          {formatCurrency(servicio.ingresos)}
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-[var(--color-primary)]" 
                                style={{ width: `${porcentaje}%` }}
                              />
                            </div>
                            <span style={{ fontWeight: 600 }}>{porcentaje}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Gráfica de barras */}
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
            <h3 className="mb-6" style={{ fontWeight: 600, fontSize: '18px' }}>Top 8 por Ingresos</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={datosServiciosTop} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" stroke="#6B6560" style={{ fontSize: '12px' }} />
                <YAxis dataKey="servicio" type="category" width={150} stroke="#6B6560" style={{ fontSize: '11px' }} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="ingresos" fill="#8B7355" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {selectedTab === 'metodo' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
              <h3 className="mb-6" style={{ fontWeight: 600, fontSize: '18px' }}>Distribución por Método</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPie>
                  <Pie
                    data={datosMetodosPago}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.metodo}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="monto"
                  >
                    {datosMetodosPago.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </RechartsPie>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
              <h3 className="mb-6" style={{ fontWeight: 600, fontSize: '18px' }}>Detalle por Método</h3>
              <div className="space-y-3">
                {datosMetodosPago.map((metodo, index) => {
                  const porcentaje = (metodo.monto / 62400 * 100).toFixed(0);
                  const promedio = metodo.monto / metodo.transacciones;
                  return (
                    <div key={index} className="p-4 bg-[#F5F2EF] rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span style={{ fontWeight: 600 }}>{metodo.metodo}</span>
                        </div>
                        <span className="text-[var(--color-primary)]" style={{ fontWeight: 700 }}>
                          {porcentaje}%
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <div>
                          <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '11px' }}>Transacciones</div>
                          <div style={{ fontWeight: 600, fontSize: '14px' }}>{metodo.transacciones}</div>
                        </div>
                        <div>
                          <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '11px' }}>Total</div>
                          <div className="text-green-600" style={{ fontWeight: 700, fontSize: '14px' }}>
                            {formatCurrency(metodo.monto)}
                          </div>
                        </div>
                        <div>
                          <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '11px' }}>Promedio</div>
                          <div style={{ fontWeight: 600, fontSize: '14px' }}>{formatCurrency(promedio)}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderReportesPacientes = () => (
    <div>
      <div className="mb-6">
        <button
          onClick={() => setVistaActual('dashboard')}
          className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] mb-4"
        >
          <ChevronRight size={16} className="rotate-180" />
          <span>Reportes</span>
        </button>
        <h2 className="font-['Cormorant_Garamond']">Reportes de Pacientes</h2>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-[var(--color-border)] overflow-x-auto">
        <div className="flex gap-6 min-w-max">
          {['nuevos', 'top', 'retencion'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`pb-3 transition-colors whitespace-nowrap capitalize ${
                selectedTab === tab
                  ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
              }`}
              style={{ fontWeight: selectedTab === tab ? 600 : 400 }}
            >
              {tab === 'nuevos' ? 'Nuevos vs Recurrentes' : 
               tab === 'top' ? 'Top Pacientes' :
               'Retención'}
            </button>
          ))}
        </div>
      </div>

      {selectedTab === 'nuevos' && (
        <div className="space-y-6">
          {/* Métricas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-blue-200 p-4">
              <div className="text-[var(--color-text-secondary)] mb-1" style={{ fontSize: '12px' }}>Nuevos</div>
              <div className="text-blue-600" style={{ fontSize: '28px', fontWeight: 700 }}>34</div>
              <div className="text-blue-600" style={{ fontSize: '12px' }}>38%</div>
            </div>
            <div className="bg-white rounded-xl border border-green-200 p-4">
              <div className="text-[var(--color-text-secondary)] mb-1" style={{ fontSize: '12px' }}>Recurrentes</div>
              <div className="text-green-600" style={{ fontSize: '28px', fontWeight: 700 }}>55</div>
              <div className="text-green-600" style={{ fontSize: '12px' }}>62%</div>
            </div>
            <div className="bg-white rounded-xl border border-[var(--color-border)] p-4">
              <div className="text-[var(--color-text-secondary)] mb-1" style={{ fontSize: '12px' }}>Total Atendidos</div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>89</div>
            </div>
            <div className="bg-white rounded-xl border border-[var(--color-border)] p-4">
              <div className="text-[var(--color-text-secondary)] mb-1" style={{ fontSize: '12px' }}>Tasa Retención</div>
              <div className="text-green-600" style={{ fontSize: '28px', fontWeight: 700 }}>78%</div>
            </div>
          </div>

          {/* Gráfica de tendencia */}
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
            <h3 className="mb-6" style={{ fontWeight: 600, fontSize: '18px' }}>Evolución de Pacientes</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={datosPacientes}>
                <defs>
                  <linearGradient id="colorNuevos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6B9BD1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6B9BD1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRecurrentes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7DB07D" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#7DB07D" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="mes" stroke="#6B6560" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6B6560" style={{ fontSize: '12px' }} />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="nuevos" 
                  stroke="#6B9BD1" 
                  fillOpacity={1} 
                  fill="url(#colorNuevos)" 
                  name="Nuevos"
                />
                <Area 
                  type="monotone" 
                  dataKey="recurrentes" 
                  stroke="#7DB07D" 
                  fillOpacity={1} 
                  fill="url(#colorRecurrentes)" 
                  name="Recurrentes"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {selectedTab === 'top' && (
        <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
          <h3 className="mb-6" style={{ fontWeight: 600, fontSize: '18px' }}>Top Pacientes</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-center pb-3 text-[var(--color-text-secondary)]" style={{ fontSize: '12px', fontWeight: 600 }}>#</th>
                  <th className="text-left pb-3 text-[var(--color-text-secondary)]" style={{ fontSize: '12px', fontWeight: 600 }}>PACIENTE</th>
                  <th className="text-center pb-3 text-[var(--color-text-secondary)]" style={{ fontSize: '12px', fontWeight: 600 }}>VISITAS</th>
                  <th className="text-right pb-3 text-[var(--color-text-secondary)]" style={{ fontSize: '12px', fontWeight: 600 }}>GASTO TOTAL</th>
                  <th className="text-left pb-3 text-[var(--color-text-secondary)]" style={{ fontSize: '12px', fontWeight: 600 }}>ÚLTIMA VISITA</th>
                </tr>
              </thead>
              <tbody>
                {datosTopPacientes.map((paciente, index) => (
                  <tr key={index} className="border-b border-[var(--color-border)] hover:bg-[#FDFBF9]">
                    <td className="py-4 text-center">
                      <span className="w-8 h-8 rounded-full bg-[#F5F2EF] inline-flex items-center justify-center" style={{ fontWeight: 700 }}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="py-4" style={{ fontWeight: 600 }}>{paciente.nombre}</td>
                    <td className="py-4 text-center">
                      <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full" style={{ fontSize: '13px', fontWeight: 600 }}>
                        {paciente.visitas}
                      </span>
                    </td>
                    <td className="py-4 text-right text-green-600" style={{ fontWeight: 700, fontSize: '16px' }}>
                      {formatCurrency(paciente.gastoTotal)}
                    </td>
                    <td className="py-4 text-[var(--color-text-secondary)]" style={{ fontSize: '13px' }}>
                      {paciente.ultimaVisita}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Target className="text-blue-600" size={20} />
              </div>
              <div>
                <div className="text-blue-900" style={{ fontWeight: 600 }}>Insight</div>
                <div className="text-blue-800" style={{ fontSize: '14px' }}>
                  Tus top 10 pacientes representan el 35% de los ingresos totales. Mantén una comunicación personalizada con ellos.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'retencion' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-green-200 p-4">
              <div className="text-[var(--color-text-secondary)] mb-1" style={{ fontSize: '12px' }}>Tasa de Retención</div>
              <div className="text-green-600" style={{ fontSize: '32px', fontWeight: 700 }}>78%</div>
            </div>
            <div className="bg-white rounded-xl border border-red-200 p-4">
              <div className="text-[var(--color-text-secondary)] mb-1" style={{ fontSize: '12px' }}>Pacientes Perdidos</div>
              <div className="text-red-600" style={{ fontSize: '32px', fontWeight: 700 }}>12</div>
              <div className="text-red-600" style={{ fontSize: '12px' }}>Este mes</div>
            </div>
            <div className="bg-white rounded-xl border border-[var(--color-border)] p-4">
              <div className="text-[var(--color-text-secondary)] mb-1" style={{ fontSize: '12px' }}>Tiempo Promedio</div>
              <div style={{ fontSize: '32px', fontWeight: 700 }}>28</div>
              <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '12px' }}>días entre visitas</div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="text-amber-600" size={20} />
              <h3 style={{ fontWeight: 600, fontSize: '18px' }}>Pacientes en Riesgo</h3>
              <span className="px-2 py-1 bg-amber-100 text-amber-600 rounded-full" style={{ fontSize: '12px' }}>
                8 pacientes
              </span>
            </div>
            <p className="text-[var(--color-text-secondary)] mb-4" style={{ fontSize: '14px' }}>
              Pacientes sin visita en más de 60 días
            </p>
            <div className="space-y-2">
              {['Patricia Luna', 'Sofía Ramírez', 'Diana Torres', 'Gabriela Pérez'].map((nombre, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                  <div>
                    <div style={{ fontWeight: 600 }}>{nombre}</div>
                    <div className="text-amber-700" style={{ fontSize: '13px' }}>
                      Última visita: hace {65 + index * 5} días
                    </div>
                  </div>
                  <button className="px-3 py-1.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[#7A6349]" style={{ fontSize: '13px' }}>
                    Enviar recordatorio
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderReportesFinanzas = () => (
    <div>
      <div className="mb-6">
        <button
          onClick={() => setVistaActual('dashboard')}
          className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] mb-4"
        >
          <ChevronRight size={16} className="rotate-180" />
          <span>Reportes</span>
        </button>
        <h2 className="font-['Cormorant_Garamond']">Reportes Financieros</h2>
      </div>

      {/* Gráfica de Ingresos vs Gastos */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6 mb-6">
        <h3 className="mb-6" style={{ fontWeight: 600, fontSize: '18px' }}>Ingresos vs Gastos</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={datosIngresosGastos}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="mes" stroke="#6B6560" style={{ fontSize: '12px' }} />
            <YAxis stroke="#6B6560" style={{ fontSize: '12px' }} />
            <Tooltip 
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #E5E7EB', 
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar dataKey="ingresos" fill="#7DB07D" radius={[8, 8, 0, 0]} name="Ingresos" />
            <Bar dataKey="gastos" fill="#E88686" radius={[8, 8, 0, 0]} name="Gastos" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Estado de Resultados */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <h3 className="mb-6" style={{ fontWeight: 600, fontSize: '18px' }}>Estado de Resultados - Noviembre 2025</h3>
        <div className="space-y-4">
          {/* Ingresos */}
          <div>
            <div className="flex justify-between py-3 border-b border-[var(--color-border)]">
              <span style={{ fontWeight: 700, fontSize: '16px' }}>Ingresos</span>
              <span className="text-green-600" style={{ fontWeight: 700, fontSize: '16px' }}>
                {formatCurrency(62400)}
              </span>
            </div>
            <div className="pl-4 space-y-2 mt-2">
              <div className="flex justify-between py-2">
                <span className="text-[var(--color-text-secondary)]">Servicios</span>
                <span>{formatCurrency(44928)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[var(--color-text-secondary)]">Productos</span>
                <span>{formatCurrency(17472)}</span>
              </div>
            </div>
          </div>

          {/* Gastos */}
          <div>
            <div className="flex justify-between py-3 border-b border-[var(--color-border)]">
              <span style={{ fontWeight: 700, fontSize: '16px' }}>Gastos Operativos</span>
              <span className="text-red-600" style={{ fontWeight: 700, fontSize: '16px' }}>
                {formatCurrency(28650)}
              </span>
            </div>
            <div className="pl-4 space-y-2 mt-2">
              <div className="flex justify-between py-2">
                <span className="text-[var(--color-text-secondary)]">Nómina</span>
                <span>{formatCurrency(15000)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[var(--color-text-secondary)]">Insumos</span>
                <span>{formatCurrency(8500)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[var(--color-text-secondary)]">Renta y servicios</span>
                <span>{formatCurrency(3800)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[var(--color-text-secondary)]">Marketing</span>
                <span>{formatCurrency(1350)}</span>
              </div>
            </div>
          </div>

          {/* Utilidad */}
          <div className="pt-4 border-t-2 border-[var(--color-border)]">
            <div className="flex justify-between py-3 bg-green-50 px-4 rounded-lg">
              <span style={{ fontWeight: 700, fontSize: '18px' }}>Utilidad Neta</span>
              <span className="text-green-600" style={{ fontWeight: 700, fontSize: '24px' }}>
                {formatCurrency(33750)}
              </span>
            </div>
            <div className="flex justify-between px-4 py-2">
              <span className="text-[var(--color-text-secondary)]">Margen de Utilidad</span>
              <span className="text-green-600" style={{ fontWeight: 600 }}>54%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div>
            <h1 className="font-['Cormorant_Garamond'] text-[var(--color-text)] mb-2">Reportes</h1>
            <p className="text-[var(--color-text-secondary)]">
              Analiza el rendimiento de tu clínica
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {vistaActual === 'dashboard' && (
              <select
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                className="px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] bg-white"
              >
                <option value="hoy">Hoy</option>
                <option value="semana">Esta Semana</option>
                <option value="mes">Este Mes</option>
                <option value="trimestre">Este Trimestre</option>
                <option value="año">Este Año</option>
                <option value="personalizado">Personalizado</option>
              </select>
            )}

            <button className="flex items-center gap-2 px-4 py-2.5 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors">
              <Download size={20} />
              <span>Exportar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contenido dinámico */}
      {vistaActual === 'dashboard' && renderDashboard()}
      {vistaActual === 'ventas' && renderReportesVentas()}
      {vistaActual === 'pacientes' && renderReportesPacientes()}
      {vistaActual === 'finanzas' && renderReportesFinanzas()}
      
      {(vistaActual === 'servicios' || vistaActual === 'inventario' || vistaActual === 'comisiones') && (
        <div>
          <button
            onClick={() => setVistaActual('dashboard')}
            className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] mb-6"
          >
            <ChevronRight size={16} className="rotate-180" />
            <span>Reportes</span>
          </button>
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-[#F5F2EF] flex items-center justify-center mx-auto mb-4">
              <FileText className="text-[var(--color-primary)]" size={40} />
            </div>
            <h3 className="mb-2" style={{ fontWeight: 600, fontSize: '20px' }}>
              Reportes de {categorias.find(c => c.id === vistaActual)?.titulo}
            </h3>
            <p className="text-[var(--color-text-secondary)] max-w-md mx-auto">
              Vista detallada de reportes en desarrollo. Aquí podrás analizar métricas específicas de {categorias.find(c => c.id === vistaActual)?.titulo.toLowerCase()}.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
