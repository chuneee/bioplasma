import React, { useState } from 'react';
import {
  Search,
  Plus,
  TrendingUp,
  TrendingDown,
  Wallet,
  CashRegister,
  ArrowUpCircle,
  ArrowDownCircle,
  Calendar,
  DollarSign,
  Eye,
  Edit2,
  Trash2,
  Download,
  CreditCard,
  Banknote,
  Smartphone,
  X,
  Upload,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Building,
  Zap,
  Users,
  Megaphone,
  Wrench,
  MoreHorizontal,
  Syringe
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type TipoIngreso = 'venta-servicio' | 'venta-producto' | 'otro';
type TipoGasto = 'insumos' | 'nomina' | 'renta' | 'servicios' | 'marketing' | 'mantenimiento' | 'otros';
type MetodoPago = 'efectivo' | 'tarjeta-credito' | 'tarjeta-debito' | 'transferencia';

interface Ingreso {
  id: string;
  folio: string;
  fecha: string;
  concepto: string;
  descripcion?: string;
  paciente?: string;
  tipo: TipoIngreso;
  metodoPago: MetodoPago;
  monto: number;
  referencia?: string;
}

interface Gasto {
  id: string;
  folio: string;
  fecha: string;
  concepto: string;
  proveedor?: string;
  categoria: TipoGasto;
  metodoPago: MetodoPago;
  monto: number;
  recurrente?: boolean;
}

const categoriasGasto = {
  insumos: { label: 'Insumos Médicos', color: '#7DB07D', icon: Syringe },
  nomina: { label: 'Nómina', color: '#5B9FD8', icon: Users },
  renta: { label: 'Renta', color: '#8B7355', icon: Building },
  servicios: { label: 'Servicios', color: '#E0A75E', icon: Zap },
  marketing: { label: 'Marketing', color: '#9D6FD8', icon: Megaphone },
  mantenimiento: { label: 'Mantenimiento', color: '#6B6560', icon: Wrench },
  otros: { label: 'Otros', color: '#C67B7B', icon: MoreHorizontal }
};

const ingresosMock: Ingreso[] = [
  {
    id: '1',
    folio: 'ING-2025-0234',
    fecha: '2025-11-27T11:30:00',
    concepto: 'Venta - María García',
    descripcion: 'Limpieza Facial + Hidratación',
    paciente: 'María García López',
    tipo: 'venta-servicio',
    metodoPago: 'efectivo',
    monto: 1450
  },
  {
    id: '2',
    folio: 'ING-2025-0233',
    fecha: '2025-11-27T10:15:00',
    concepto: 'Venta - Ana Martínez',
    descripcion: 'Paquete Novia Radiante',
    paciente: 'Ana Sofía Martínez',
    tipo: 'venta-servicio',
    metodoPago: 'tarjeta-credito',
    monto: 2800
  },
  {
    id: '3',
    folio: 'ING-2025-0232',
    fecha: '2025-11-27T09:45:00',
    concepto: 'Venta producto - Protector Solar',
    paciente: 'Laura Fernández',
    tipo: 'venta-producto',
    metodoPago: 'efectivo',
    monto: 120
  },
  {
    id: '4',
    folio: 'ING-2025-0231',
    fecha: '2025-11-26T16:20:00',
    concepto: 'Venta - Carmen Rodríguez',
    descripcion: 'Peeling Químico',
    paciente: 'Carmen Rodríguez',
    tipo: 'venta-servicio',
    metodoPago: 'transferencia',
    monto: 1500
  },
  {
    id: '5',
    folio: 'ING-2025-0230',
    fecha: '2025-11-26T14:00:00',
    concepto: 'Venta - Patricia Sánchez',
    descripcion: 'Rejuvenecimiento con Plasma',
    paciente: 'Patricia Sánchez',
    tipo: 'venta-servicio',
    metodoPago: 'tarjeta-debito',
    monto: 2500
  }
];

const gastosMock: Gasto[] = [
  {
    id: '1',
    folio: 'GAS-2025-0089',
    fecha: '2025-11-27T09:00:00',
    concepto: 'Compra de insumos',
    proveedor: 'Distribuidora Médica SA',
    categoria: 'insumos',
    metodoPago: 'transferencia',
    monto: 3200
  },
  {
    id: '2',
    folio: 'GAS-2025-0088',
    fecha: '2025-11-26T15:30:00',
    concepto: 'Pago de luz',
    proveedor: 'CFE',
    categoria: 'servicios',
    metodoPago: 'transferencia',
    monto: 850,
    recurrente: true
  },
  {
    id: '3',
    folio: 'GAS-2025-0087',
    fecha: '2025-11-25T10:00:00',
    concepto: 'Nómina quincena',
    categoria: 'nomina',
    metodoPago: 'transferencia',
    monto: 8000,
    recurrente: true
  },
  {
    id: '4',
    folio: 'GAS-2025-0086',
    fecha: '2025-11-24T11:00:00',
    concepto: 'Material publicitario',
    proveedor: 'Imprenta Digital',
    categoria: 'marketing',
    metodoPago: 'tarjeta-credito',
    monto: 1200
  }
];

// Datos para gráfica de ingresos vs gastos
const datosGrafica = [
  { fecha: '21 Nov', ingresos: 8500, gastos: 2100 },
  { fecha: '22 Nov', ingresos: 12400, gastos: 3500 },
  { fecha: '23 Nov', ingresos: 9800, gastos: 1800 },
  { fecha: '24 Nov', ingresos: 11200, gastos: 4200 },
  { fecha: '25 Nov', ingresos: 9850, gastos: 8000 },
  { fecha: '26 Nov', ingresos: 12400, gastos: 1850 },
  { fecha: '27 Nov', ingresos: 13950, gastos: 2350 }
];

// Datos para gráfica de distribución de gastos
const datosDistribucionGastos = [
  { categoria: 'Insumos', valor: 12400, color: '#7DB07D' },
  { categoria: 'Nómina', valor: 8000, color: '#5B9FD8' },
  { categoria: 'Renta', valor: 4500, color: '#8B7355' },
  { categoria: 'Servicios', valor: 2100, color: '#E0A75E' },
  { categoria: 'Otros', valor: 1650, color: '#C67B7B' }
];

export function Finanzas() {
  const [vistaActual, setVistaActual] = useState<'dashboard' | 'ingresos' | 'gastos'>('dashboard');
  const [periodo, setPeriodo] = useState('mes');
  const [showIngresoModal, setShowIngresoModal] = useState(false);
  const [showGastoModal, setShowGastoModal] = useState(false);
  const [showCorteModal, setShowCorteModal] = useState(false);
  const [tipoIngreso, setTipoIngreso] = useState<TipoIngreso>('venta-servicio');
  const [categoriaGasto, setCategoriaGasto] = useState<TipoGasto>('insumos');
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('efectivo');
  const [efectivoContado, setEfectivoContado] = useState(0);
  const [vistaGrafica, setVistaGrafica] = useState('semanal');

  // Calcular métricas
  const totalIngresos = 62400;
  const totalGastos = 28650;
  const utilidadNeta = totalIngresos - totalGastos;
  const margen = Math.round((utilidadNeta / totalIngresos) * 100);
  const cajaActual = 12450;

  const efectivoEsperado = 5600;
  const diferenciaCaja = efectivoContado - efectivoEsperado;

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
      case 'tarjeta-credito': return <CreditCard size={16} />;
      case 'tarjeta-debito': return <CreditCard size={16} />;
      case 'transferencia': return <Smartphone size={16} />;
    }
  };

  const renderDashboard = () => (
    <div>
      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Ingresos */}
        <div className="bg-white rounded-xl border border-green-200 p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <ArrowUpCircle className="text-green-600" size={24} />
            </div>
          </div>
          <div className="text-green-600" style={{ fontSize: '28px', fontWeight: 700 }}>
            {formatCurrency(totalIngresos)}
          </div>
          <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>
            Ingresos
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp size={14} className="text-green-600" />
            <span className="text-green-600" style={{ fontSize: '13px', fontWeight: 600 }}>
              +12% vs período anterior
            </span>
          </div>
        </div>

        {/* Gastos */}
        <div className="bg-white rounded-xl border border-red-200 p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
              <ArrowDownCircle className="text-red-600" size={24} />
            </div>
          </div>
          <div className="text-red-600" style={{ fontSize: '28px', fontWeight: 700 }}>
            {formatCurrency(totalGastos)}
          </div>
          <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>
            Gastos
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingDown size={14} className="text-green-600" />
            <span className="text-green-600" style={{ fontSize: '13px', fontWeight: 600 }}>
              -5% vs período anterior
            </span>
          </div>
        </div>

        {/* Utilidad Neta */}
        <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 rounded-lg bg-[#8B735515] flex items-center justify-center">
              <Wallet className="text-[var(--color-primary)]" size={24} />
            </div>
          </div>
          <div className="text-[var(--color-primary)]" style={{ fontSize: '28px', fontWeight: 700 }}>
            {formatCurrency(utilidadNeta)}
          </div>
          <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>
            Utilidad neta
          </div>
          <div className="text-[var(--color-text)]" style={{ fontSize: '13px', fontWeight: 600 }}>
            Margen: {margen}%
          </div>
        </div>

        {/* Caja Actual */}
        <div className="bg-white rounded-xl border border-blue-200 p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <DollarSign className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="text-blue-600" style={{ fontSize: '28px', fontWeight: 700 }}>
            {formatCurrency(cajaActual)}
          </div>
          <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>
            Efectivo en caja
          </div>
          <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '13px' }}>
            Último corte: Hoy 6:00 PM
          </div>
        </div>
      </div>

      {/* Gráfica de Ingresos vs Gastos */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 style={{ fontWeight: 600, fontSize: '18px' }}>Ingresos vs Gastos</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setVistaGrafica('diario')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                vistaGrafica === 'diario' ? 'bg-[var(--color-primary)] text-white' : 'bg-[#F5F2EF] text-[var(--color-text-secondary)]'
              }`}
              style={{ fontSize: '14px' }}
            >
              Diario
            </button>
            <button
              onClick={() => setVistaGrafica('semanal')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                vistaGrafica === 'semanal' ? 'bg-[var(--color-primary)] text-white' : 'bg-[#F5F2EF] text-[var(--color-text-secondary)]'
              }`}
              style={{ fontSize: '14px' }}
            >
              Semanal
            </button>
            <button
              onClick={() => setVistaGrafica('mensual')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                vistaGrafica === 'mensual' ? 'bg-[var(--color-primary)] text-white' : 'bg-[#F5F2EF] text-[var(--color-text-secondary)]'
              }`}
              style={{ fontSize: '14px' }}
            >
              Mensual
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={datosGrafica}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="fecha" stroke="#6B6560" style={{ fontSize: '12px' }} />
            <YAxis stroke="#6B6560" style={{ fontSize: '12px' }} />
            <Tooltip 
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #E5E7EB', 
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '14px' }}
              iconType="circle"
            />
            <Bar dataKey="ingresos" fill="#7DB07D" name="Ingresos" radius={[8, 8, 0, 0]} />
            <Bar dataKey="gastos" fill="#C67B7B" name="Gastos" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 pt-4 border-t border-[var(--color-border)] text-center text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>
          Promedio diario: Ingresos {formatCurrency(2080)} | Gastos {formatCurrency(955)} | Utilidad {formatCurrency(1125)}
        </div>
      </div>

      {/* Dos columnas: Ingresos y Gastos recientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Últimos Ingresos */}
        <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontWeight: 600, fontSize: '18px' }}>Últimos Ingresos</h3>
            <button 
              onClick={() => setVistaActual('ingresos')}
              className="text-[var(--color-primary)] hover:underline flex items-center gap-1"
              style={{ fontSize: '14px' }}
            >
              Ver todos
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="space-y-3">
            {ingresosMock.slice(0, 5).map((ingreso) => (
              <div key={ingreso.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#F5F2EF] transition-colors">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <ArrowUpCircle className="text-green-600" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div style={{ fontWeight: 600, fontSize: '14px' }} className="truncate">
                    {ingreso.concepto}
                  </div>
                  <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '13px' }}>
                    {ingreso.descripcion || ingreso.paciente}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[var(--color-text-secondary)]" style={{ fontSize: '12px' }}>
                      Hoy, {formatTime(ingreso.fecha)}
                    </span>
                    <span className="text-[var(--color-text-secondary)]">
                      {getMetodoPagoIcon(ingreso.metodoPago)}
                    </span>
                  </div>
                </div>
                <div className="text-green-600" style={{ fontWeight: 700, fontSize: '16px' }}>
                  +{formatCurrency(ingreso.monto)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Últimos Gastos */}
        <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontWeight: 600, fontSize: '18px' }}>Últimos Gastos</h3>
            <button 
              onClick={() => setVistaActual('gastos')}
              className="text-[var(--color-primary)] hover:underline flex items-center gap-1"
              style={{ fontSize: '14px' }}
            >
              Ver todos
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="space-y-3">
            {gastosMock.slice(0, 5).map((gasto) => {
              const categoria = categoriasGasto[gasto.categoria];
              const IconoCategoria = categoria.icon;
              
              return (
                <div key={gasto.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#F5F2EF] transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                    <ArrowDownCircle className="text-red-600" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div style={{ fontWeight: 600, fontSize: '14px' }} className="truncate">
                      {gasto.concepto}
                    </div>
                    <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '13px' }}>
                      {gasto.proveedor ? `Proveedor: ${gasto.proveedor}` : categoria.label}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[var(--color-text-secondary)]" style={{ fontSize: '12px' }}>
                        {formatDate(gasto.fecha)}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded-full"
                        style={{
                          fontSize: '11px',
                          fontWeight: 500,
                          backgroundColor: `${categoria.color}15`,
                          color: categoria.color
                        }}
                      >
                        {categoria.label}
                      </span>
                    </div>
                  </div>
                  <div className="text-red-600" style={{ fontWeight: 700, fontSize: '16px' }}>
                    -{formatCurrency(gasto.monto)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Distribución de Gastos */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <h3 className="mb-6" style={{ fontWeight: 600, fontSize: '18px' }}>Gastos por Categoría</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={datosDistribucionGastos}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="valor"
                >
                  {datosDistribucionGastos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col justify-center space-y-3">
            {datosDistribucionGastos.map((item, index) => {
              const porcentaje = Math.round((item.valor / totalGastos) * 100);
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span style={{ fontSize: '14px' }}>{item.categoria}</span>
                  </div>
                  <div className="text-right">
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>
                      {formatCurrency(item.valor)}
                    </div>
                    <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '12px' }}>
                      {porcentaje}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderIngresos = () => (
    <div>
      <div className="mb-6">
        <h2 className="font-['Cormorant_Garamond'] mb-2">Ingresos</h2>
        <p className="text-[var(--color-text-secondary)]">
          {formatCurrency(totalIngresos)} este mes ({ingresosMock.length} registros)
        </p>
      </div>

      {/* Barra de controles */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" size={20} />
            <input
              type="text"
              placeholder="Buscar por concepto, paciente..."
              className="w-full pl-11 pr-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          <select className="px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] bg-white">
            <option value="">Todos los tipos</option>
            <option value="venta-servicio">Venta de servicios</option>
            <option value="venta-producto">Venta de productos</option>
            <option value="otro">Otro ingreso</option>
          </select>

          <button className="flex items-center gap-2 px-4 py-2.5 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF]">
            <Download size={18} />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Tabla de ingresos */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F5F2EF] border-b border-[var(--color-border)]">
                <th className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Fecha
                </th>
                <th className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Folio
                </th>
                <th className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Concepto
                </th>
                <th className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Paciente
                </th>
                <th className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Método Pago
                </th>
                <th className="text-right px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Monto
                </th>
                <th className="text-center px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {ingresosMock.map((ingreso) => (
                <tr key={ingreso.id} className="border-b border-[var(--color-border)] hover:bg-[#FDFBF9]">
                  <td className="px-6 py-4">
                    <div>
                      <div style={{ fontWeight: 600 }}>{formatDate(ingreso.fecha)}</div>
                      <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '13px' }}>
                        {formatTime(ingreso.fecha)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-[var(--color-primary)] hover:underline cursor-pointer" style={{ fontSize: '13px', fontWeight: 600 }}>
                      {ingreso.folio}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div style={{ fontWeight: 600 }}>{ingreso.concepto}</div>
                      {ingreso.descripcion && (
                        <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '13px' }}>
                          {ingreso.descripcion}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {ingreso.paciente || <span className="text-[var(--color-text-secondary)]">—</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getMetodoPagoIcon(ingreso.metodoPago)}
                      <span className="capitalize">{ingreso.metodoPago.replace('-', ' ')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-green-600" style={{ fontWeight: 700, fontSize: '16px' }}>
                      {formatCurrency(ingreso.monto)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[#8B7355]/10 rounded-lg">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[#8B7355]/10 rounded-lg">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-[#F5F2EF] border-t border-[var(--color-border)]">
          <div className="flex justify-between items-center">
            <span style={{ fontWeight: 600 }}>Total:</span>
            <span className="text-green-600" style={{ fontSize: '20px', fontWeight: 700 }}>
              {formatCurrency(totalIngresos)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGastos = () => (
    <div>
      <div className="mb-6">
        <h2 className="font-['Cormorant_Garamond'] mb-2">Gastos</h2>
        <p className="text-[var(--color-text-secondary)]">
          {formatCurrency(totalGastos)} este mes ({gastosMock.length} registros)
        </p>
      </div>

      {/* Barra de controles */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" size={20} />
            <input
              type="text"
              placeholder="Buscar por concepto, proveedor..."
              className="w-full pl-11 pr-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          <select className="px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] bg-white">
            <option value="">Todas las categorías</option>
            {Object.entries(categoriasGasto).map(([key, value]) => (
              <option key={key} value={key}>{value.label}</option>
            ))}
          </select>

          <button className="flex items-center gap-2 px-4 py-2.5 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF]">
            <Download size={18} />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Tabla de gastos */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F5F2EF] border-b border-[var(--color-border)]">
                <th className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Fecha
                </th>
                <th className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Folio
                </th>
                <th className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Concepto
                </th>
                <th className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Proveedor
                </th>
                <th className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Categoría
                </th>
                <th className="text-right px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Monto
                </th>
                <th className="text-center px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {gastosMock.map((gasto) => {
                const categoria = categoriasGasto[gasto.categoria];
                return (
                  <tr key={gasto.id} className="border-b border-[var(--color-border)] hover:bg-[#FDFBF9]">
                    <td className="px-6 py-4">
                      <div style={{ fontWeight: 600 }}>{formatDate(gasto.fecha)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-[var(--color-primary)] hover:underline cursor-pointer" style={{ fontSize: '13px', fontWeight: 600 }}>
                        {gasto.folio}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div style={{ fontWeight: 600 }}>{gasto.concepto}</div>
                    </td>
                    <td className="px-6 py-4">
                      {gasto.proveedor || <span className="text-[var(--color-text-secondary)]">—</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="inline-flex px-3 py-1 rounded-full"
                        style={{
                          fontSize: '12px',
                          fontWeight: 500,
                          backgroundColor: `${categoria.color}15`,
                          color: categoria.color
                        }}
                      >
                        {categoria.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-red-600" style={{ fontWeight: 700, fontSize: '16px' }}>
                        {formatCurrency(gasto.monto)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[#8B7355]/10 rounded-lg">
                          <Eye size={16} />
                        </button>
                        <button className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[#8B7355]/10 rounded-lg">
                          <Edit2 size={16} />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-[#F5F2EF] border-t border-[var(--color-border)]">
          <div className="flex justify-between items-center">
            <span style={{ fontWeight: 600 }}>Total:</span>
            <span className="text-red-600" style={{ fontSize: '20px', fontWeight: 700 }}>
              {formatCurrency(totalGastos)}
            </span>
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
            <h1 className="font-['Cormorant_Garamond'] text-[var(--color-text)] mb-2">Finanzas</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setVistaActual('dashboard')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  vistaActual === 'dashboard' ? 'bg-[var(--color-primary)] text-white' : 'bg-[#F5F2EF] text-[var(--color-text-secondary)]'
                }`}
                style={{ fontSize: '14px' }}
              >
                Dashboard
              </button>
              <button
                onClick={() => setVistaActual('ingresos')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  vistaActual === 'ingresos' ? 'bg-[var(--color-primary)] text-white' : 'bg-[#F5F2EF] text-[var(--color-text-secondary)]'
                }`}
                style={{ fontSize: '14px' }}
              >
                Ingresos
              </button>
              <button
                onClick={() => setVistaActual('gastos')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  vistaActual === 'gastos' ? 'bg-[var(--color-primary)] text-white' : 'bg-[#F5F2EF] text-[var(--color-text-secondary)]'
                }`}
                style={{ fontSize: '14px' }}
              >
                Gastos
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {vistaActual === 'dashboard' && (
              <>
                <select
                  value={periodo}
                  onChange={(e) => setPeriodo(e.target.value)}
                  className="px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] bg-white"
                >
                  <option value="hoy">Hoy</option>
                  <option value="semana">Esta Semana</option>
                  <option value="mes">Este Mes</option>
                  <option value="año">Este Año</option>
                  <option value="personalizado">Personalizado</option>
                </select>

                <button
                  onClick={() => setShowCorteModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors"
                >
                  <DollarSign size={20} />
                  <span>Corte de Caja</span>
                </button>
              </>
            )}

            <button
              onClick={() => setShowGastoModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors"
            >
              <Plus size={20} />
              <span>Registrar Gasto</span>
            </button>

            <button
              onClick={() => setShowIngresoModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[#7A6349] transition-colors"
            >
              <Plus size={20} />
              <span>Registrar Ingreso</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contenido según vista */}
      {vistaActual === 'dashboard' && renderDashboard()}
      {vistaActual === 'ingresos' && renderIngresos()}
      {vistaActual === 'gastos' && renderGastos()}

      {/* Modal: Registrar Ingreso */}
      {showIngresoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="font-['Cormorant_Garamond']">Registrar Ingreso</h2>
                <p className="text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>
                  Folio: ING-2025-0235
                </p>
              </div>
              <button
                onClick={() => setShowIngresoModal(false)}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Tipo de Ingreso */}
              <div>
                <label className="block mb-3" style={{ fontWeight: 600 }}>
                  Tipo de Ingreso *
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 border-2 border-[var(--color-border)] rounded-lg cursor-pointer hover:border-[var(--color-primary)] transition-all">
                    <input type="radio" name="tipoIngreso" value="venta-servicio" className="w-4 h-4" />
                    <span>Venta de servicios</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border-2 border-[var(--color-border)] rounded-lg cursor-pointer hover:border-[var(--color-primary)] transition-all">
                    <input type="radio" name="tipoIngreso" value="venta-producto" className="w-4 h-4" />
                    <span>Venta de productos</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border-2 border-[var(--color-border)] rounded-lg cursor-pointer hover:border-[var(--color-primary)] transition-all">
                    <input type="radio" name="tipoIngreso" value="otro" className="w-4 h-4" />
                    <span>Otro ingreso</span>
                  </label>
                </div>
              </div>

              {/* Concepto */}
              <div>
                <label className="block mb-2" style={{ fontWeight: 600 }}>
                  Concepto/Descripción *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                  placeholder="Describe el ingreso..."
                />
              </div>

              {/* Paciente */}
              <div>
                <label className="block mb-2" style={{ fontWeight: 600 }}>
                  Paciente (opcional)
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                  placeholder="Buscar paciente..."
                />
              </div>

              {/* Monto */}
              <div>
                <label className="block mb-2" style={{ fontWeight: 600 }}>
                  Monto *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" style={{ fontSize: '20px' }}>$</span>
                  <input
                    type="number"
                    className="w-full pl-10 pr-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                    placeholder="0.00"
                    style={{ fontSize: '18px', fontWeight: 600 }}
                  />
                </div>
              </div>

              {/* Método de pago */}
              <div>
                <label className="block mb-3" style={{ fontWeight: 600 }}>
                  Método de Pago *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setMetodoPago('efectivo')}
                    className={`p-3 border-2 rounded-lg transition-all ${
                      metodoPago === 'efectivo' ? 'border-[var(--color-primary)] bg-[#8B735515]' : 'border-[var(--color-border)]'
                    }`}
                  >
                    <Banknote className="mx-auto mb-1" size={20} />
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>Efectivo</div>
                  </button>
                  <button
                    onClick={() => setMetodoPago('tarjeta-credito')}
                    className={`p-3 border-2 rounded-lg transition-all ${
                      metodoPago === 'tarjeta-credito' ? 'border-[var(--color-primary)] bg-[#8B735515]' : 'border-[var(--color-border)]'
                    }`}
                  >
                    <CreditCard className="mx-auto mb-1" size={20} />
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>Tarjeta</div>
                  </button>
                  <button
                    onClick={() => setMetodoPago('tarjeta-debito')}
                    className={`p-3 border-2 rounded-lg transition-all ${
                      metodoPago === 'tarjeta-debito' ? 'border-[var(--color-primary)] bg-[#8B735515]' : 'border-[var(--color-border)]'
                    }`}
                  >
                    <CreditCard className="mx-auto mb-1" size={20} />
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>Débito</div>
                  </button>
                  <button
                    onClick={() => setMetodoPago('transferencia')}
                    className={`p-3 border-2 rounded-lg transition-all ${
                      metodoPago === 'transferencia' ? 'border-[var(--color-primary)] bg-[#8B735515]' : 'border-[var(--color-border)]'
                    }`}
                  >
                    <Smartphone className="mx-auto mb-1" size={20} />
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>Transfer.</div>
                  </button>
                </div>
              </div>

              {/* Notas */}
              <div>
                <label className="block mb-2" style={{ fontWeight: 600 }}>
                  Notas
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] resize-none"
                  placeholder="Notas adicionales..."
                />
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-[var(--color-border)] px-6 py-4 flex gap-3 justify-end">
              <button
                onClick={() => setShowIngresoModal(false)}
                className="px-6 py-2.5 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors"
              >
                Cancelar
              </button>
              <button className="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[#7A6349] transition-colors">
                Registrar Ingreso
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Registrar Gasto */}
      {showGastoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="font-['Cormorant_Garamond']">Registrar Gasto</h2>
                <p className="text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>
                  Folio: GAS-2025-0090
                </p>
              </div>
              <button
                onClick={() => setShowGastoModal(false)}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Categoría */}
              <div>
                <label className="block mb-3" style={{ fontWeight: 600 }}>
                  Categoría *
                </label>
                <select className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]">
                  <option value="">Seleccionar categoría...</option>
                  {Object.entries(categoriasGasto).map(([key, value]) => (
                    <option key={key} value={key}>{value.label}</option>
                  ))}
                </select>
              </div>

              {/* Concepto */}
              <div>
                <label className="block mb-2" style={{ fontWeight: 600 }}>
                  Concepto/Descripción *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                  placeholder="Describe el gasto..."
                />
              </div>

              {/* Proveedor */}
              <div>
                <label className="block mb-2" style={{ fontWeight: 600 }}>
                  Proveedor (opcional)
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                  placeholder="Nombre del proveedor..."
                />
              </div>

              {/* Monto */}
              <div>
                <label className="block mb-2" style={{ fontWeight: 600 }}>
                  Monto *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" style={{ fontSize: '20px' }}>$</span>
                  <input
                    type="number"
                    className="w-full pl-10 pr-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                    placeholder="0.00"
                    style={{ fontSize: '18px', fontWeight: 600 }}
                  />
                </div>
              </div>

              {/* Método de pago */}
              <div>
                <label className="block mb-3" style={{ fontWeight: 600 }}>
                  Método de Pago *
                </label>
                <select className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]">
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta-credito">Tarjeta de crédito</option>
                  <option value="tarjeta-debito">Tarjeta de débito</option>
                  <option value="transferencia">Transferencia bancaria</option>
                </select>
              </div>

              {/* Gasto recurrente */}
              <div className="flex items-center justify-between">
                <div>
                  <div style={{ fontWeight: 600 }}>¿Es gasto recurrente?</div>
                  <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>
                    Para pagos mensuales automáticos
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-success)]"></div>
                </label>
              </div>

              {/* Notas */}
              <div>
                <label className="block mb-2" style={{ fontWeight: 600 }}>
                  Notas
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] resize-none"
                  placeholder="Notas adicionales..."
                />
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-[var(--color-border)] px-6 py-4 flex gap-3 justify-end">
              <button
                onClick={() => setShowGastoModal(false)}
                className="px-6 py-2.5 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors"
              >
                Cancelar
              </button>
              <button className="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[#7A6349] transition-colors">
                Registrar Gasto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Corte de Caja */}
      {showCorteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="font-['Cormorant_Garamond']">Corte de Caja</h2>
                <p className="text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>
                  Jueves, 27 de Noviembre 2025
                </p>
              </div>
              <button
                onClick={() => setShowCorteModal(false)}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Resumen del día */}
              <div className="bg-[#F5F2EF] rounded-lg p-5">
                <h3 className="mb-4" style={{ fontWeight: 600 }}>Resumen del Día</h3>
                
                <table className="w-full mb-4">
                  <thead>
                    <tr className="border-b border-[var(--color-border)]">
                      <th className="text-left pb-2">Método</th>
                      <th className="text-center pb-2">Cantidad</th>
                      <th className="text-right pb-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border)]">
                      <td className="py-2">Efectivo</td>
                      <td className="py-2 text-center">8</td>
                      <td className="py-2 text-right" style={{ fontWeight: 600 }}>{formatCurrency(6450)}</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border)]">
                      <td className="py-2">Tarjeta crédito</td>
                      <td className="py-2 text-center">3</td>
                      <td className="py-2 text-right" style={{ fontWeight: 600 }}>{formatCurrency(4200)}</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border)]">
                      <td className="py-2">Tarjeta débito</td>
                      <td className="py-2 text-center">2</td>
                      <td className="py-2 text-right" style={{ fontWeight: 600 }}>{formatCurrency(1800)}</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border)]">
                      <td className="py-2">Transferencia</td>
                      <td className="py-2 text-center">1</td>
                      <td className="py-2 text-right" style={{ fontWeight: 600 }}>{formatCurrency(1500)}</td>
                    </tr>
                    <tr>
                      <td className="py-2" style={{ fontWeight: 700 }}>TOTAL</td>
                      <td className="py-2 text-center" style={{ fontWeight: 700 }}>14</td>
                      <td className="py-2 text-right text-green-600" style={{ fontWeight: 700, fontSize: '18px' }}>
                        {formatCurrency(13950)}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="space-y-2 pt-4 border-t border-[var(--color-border)]">
                  <div className="flex justify-between">
                    <span>Efectivo recibido:</span>
                    <span style={{ fontWeight: 600 }}>{formatCurrency(6450)}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Gastos en efectivo:</span>
                    <span style={{ fontWeight: 600 }}>-{formatCurrency(850)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[var(--color-border)]">
                    <span style={{ fontWeight: 700 }}>Efectivo esperado en caja:</span>
                    <span className="text-[var(--color-primary)]" style={{ fontWeight: 700, fontSize: '20px' }}>
                      {formatCurrency(efectivoEsperado)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Conteo de caja */}
              <div>
                <label className="block mb-3" style={{ fontWeight: 600, fontSize: '16px' }}>
                  Efectivo contado en caja *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" style={{ fontSize: '24px' }}>$</span>
                  <input
                    type="number"
                    value={efectivoContado || ''}
                    onChange={(e) => setEfectivoContado(Number(e.target.value))}
                    className="w-full pl-12 pr-4 py-4 border-2 border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                    placeholder="0.00"
                    style={{ fontSize: '24px', fontWeight: 700 }}
                  />
                </div>

                {efectivoContado > 0 && (
                  <div className={`mt-3 p-4 rounded-lg ${
                    diferenciaCaja === 0 ? 'bg-green-50' :
                    diferenciaCaja > 0 ? 'bg-amber-50' :
                    'bg-red-50'
                  }`}>
                    <div className="flex items-center gap-2">
                      {diferenciaCaja === 0 ? (
                        <>
                          <CheckCircle className="text-green-600" size={20} />
                          <span className="text-green-600" style={{ fontWeight: 600 }}>
                            ✓ Caja cuadrada
                          </span>
                        </>
                      ) : diferenciaCaja > 0 ? (
                        <>
                          <AlertTriangle className="text-amber-600" size={20} />
                          <span className="text-amber-600" style={{ fontWeight: 600 }}>
                            +{formatCurrency(diferenciaCaja)} de más
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="text-red-600" size={20} />
                          <span className="text-red-600" style={{ fontWeight: 600 }}>
                            {formatCurrency(diferenciaCaja)} faltante
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Notas */}
              <div>
                <label className="block mb-2" style={{ fontWeight: 600 }}>
                  Notas del corte
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] resize-none"
                  placeholder="Observaciones, justificación de diferencias..."
                />
              </div>

              {/* Resumen final */}
              <div className="bg-blue-50 rounded-lg p-5">
                <h3 className="mb-3 text-blue-900" style={{ fontWeight: 600 }}>Resumen Final</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Ingresos totales del día:</span>
                    <span className="text-green-600" style={{ fontWeight: 600 }}>{formatCurrency(13950)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gastos totales del día:</span>
                    <span className="text-red-600" style={{ fontWeight: 600 }}>{formatCurrency(2350)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-blue-200">
                    <span style={{ fontWeight: 700 }}>Utilidad del día:</span>
                    <span className="text-[var(--color-primary)]" style={{ fontWeight: 700, fontSize: '18px' }}>
                      {formatCurrency(11600)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-blue-200">
                    <span>Efectivo en caja al cierre:</span>
                    <span style={{ fontWeight: 600 }}>{formatCurrency(efectivoContado || 0)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-[var(--color-border)] px-6 py-4 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowCorteModal(false);
                  setEfectivoContado(0);
                }}
                className="px-6 py-2.5 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors"
              >
                Cancelar
              </button>
              <button className="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[#7A6349] transition-colors">
                Confirmar Corte de Caja
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
