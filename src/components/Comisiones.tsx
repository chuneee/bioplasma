import React, { useState } from 'react';
import {
  Search,
  Plus,
  Percent,
  Clock,
  CheckCircle,
  Settings,
  TrendingUp,
  Download,
  Eye,
  Printer,
  ChevronDown,
  ChevronUp,
  X,
  Calendar,
  DollarSign,
  BarChart3,
  Award,
  Target,
  Users
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

type MetodoPago = 'efectivo' | 'transferencia' | 'deposito' | 'otro';

interface ComisionPendiente {
  id: string;
  fechaVenta: string;
  folioVenta: string;
  paciente: string;
  montoVenta: number;
  comision: number;
  diasPendiente: number;
}

interface Vendedora {
  id: string;
  nombre: string;
  avatar: string;
  cotizaciones: number;
  ventasCerradas: number;
  montoVendido: number;
  comisionGenerada: number;
  comisionPagada: number;
  comisionPendiente: number;
  comisionesPendientes: ComisionPendiente[];
}

interface PagoComision {
  id: string;
  folio: string;
  fecha: string;
  vendedoraId: string;
  vendedora: string;
  numComisiones: number;
  monto: number;
  metodo: MetodoPago;
  concepto: string;
  comisiones: ComisionPendiente[];
}

const vendedorasMock: Vendedora[] = [
  {
    id: '1',
    nombre: 'Ana Rodríguez',
    avatar: 'AR',
    cotizaciones: 24,
    ventasCerradas: 18,
    montoVendido: 45200,
    comisionGenerada: 4520,
    comisionPagada: 3200,
    comisionPendiente: 1320,
    comisionesPendientes: [
      { id: '1', fechaVenta: '2025-11-25', folioVenta: 'VTA-0154', paciente: 'María García', montoVenta: 850, comision: 85, diasPendiente: 2 },
      { id: '2', fechaVenta: '2025-11-26', folioVenta: 'VTA-0155', paciente: 'Laura Méndez', montoVenta: 1200, comision: 120, diasPendiente: 1 },
      { id: '3', fechaVenta: '2025-11-27', folioVenta: 'VTA-0156', paciente: 'Carmen Ruiz', montoVenta: 3105, comision: 310.50, diasPendiente: 0 },
      { id: '4', fechaVenta: '2025-11-27', folioVenta: 'VTA-0157', paciente: 'Patricia Luna', montoVenta: 2800, comision: 280, diasPendiente: 0 },
      { id: '5', fechaVenta: '2025-11-20', folioVenta: 'VTA-0148', paciente: 'Sofía Ramírez', montoVenta: 5245, comision: 524.50, diasPendiente: 7 }
    ]
  },
  {
    id: '2',
    nombre: 'María López',
    avatar: 'ML',
    cotizaciones: 12,
    ventasCerradas: 8,
    montoVendido: 17200,
    comisionGenerada: 1720,
    comisionPagada: 860,
    comisionPendiente: 860,
    comisionesPendientes: [
      { id: '6', fechaVenta: '2025-11-26', folioVenta: 'VTA-0158', paciente: 'Diana Torres', montoVenta: 1500, comision: 150, diasPendiente: 1 },
      { id: '7', fechaVenta: '2025-11-27', folioVenta: 'VTA-0159', paciente: 'Gabriela Pérez', montoVenta: 2400, comision: 240, diasPendiente: 0 },
      { id: '8', fechaVenta: '2025-11-22', folioVenta: 'VTA-0151', paciente: 'Lucía Martínez', montoVenta: 4700, comision: 470, diasPendiente: 5 }
    ]
  }
];

const pagosMock: PagoComision[] = [
  {
    id: '1',
    folio: 'PAG-2025-0034',
    fecha: '2025-11-20',
    vendedoraId: '1',
    vendedora: 'Ana Rodríguez',
    numComisiones: 8,
    monto: 1500,
    metodo: 'transferencia',
    concepto: 'Comisiones semana 46',
    comisiones: []
  },
  {
    id: '2',
    folio: 'PAG-2025-0033',
    fecha: '2025-11-20',
    vendedoraId: '2',
    vendedora: 'María López',
    numComisiones: 5,
    monto: 860,
    metodo: 'transferencia',
    concepto: 'Comisiones semana 46',
    comisiones: []
  },
  {
    id: '3',
    folio: 'PAG-2025-0032',
    fecha: '2025-11-13',
    vendedoraId: '1',
    vendedora: 'Ana Rodríguez',
    numComisiones: 6,
    monto: 1200,
    metodo: 'efectivo',
    concepto: 'Comisiones semana 45',
    comisiones: []
  }
];

const datosGrafica = [
  { mes: 'Jun', generadas: 3800, pagadas: 3800 },
  { mes: 'Jul', generadas: 4200, pagadas: 4200 },
  { mes: 'Ago', generadas: 3900, pagadas: 3700 },
  { mes: 'Sep', generadas: 5100, pagadas: 5100 },
  { mes: 'Oct', generadas: 4800, pagadas: 4600 },
  { mes: 'Nov', generadas: 6240, pagadas: 4060 }
];

export function Comisiones() {
  const [periodo, setPeriodo] = useState('mes');
  const [showPagoModal, setShowPagoModal] = useState(false);
  const [showDetalleVendedora, setShowDetalleVendedora] = useState(false);
  const [selectedVendedora, setSelectedVendedora] = useState<Vendedora | null>(null);
  const [selectedTab, setSelectedTab] = useState('pendientes');
  const [expandedVendedora, setExpandedVendedora] = useState<string | null>(null);
  const [selectedComisiones, setSelectedComisiones] = useState<string[]>([]);
  const [vistaActual, setVistaActual] = useState<'dashboard' | 'historial'>('dashboard');

  // Calcular totales
  const comisionesGeneradas = vendedorasMock.reduce((sum, v) => sum + v.comisionGenerada, 0);
  const comisionesPendientes = vendedorasMock.reduce((sum, v) => sum + v.comisionPendiente, 0);
  const comisionesPagadas = vendedorasMock.reduce((sum, v) => sum + v.comisionPagada, 0);
  const totalCotizaciones = vendedorasMock.reduce((sum, v) => sum + v.cotizaciones, 0);
  const totalVentasCerradas = vendedorasMock.reduce((sum, v) => sum + v.ventasCerradas, 0);
  const totalMontoVendido = vendedorasMock.reduce((sum, v) => sum + v.montoVendido, 0);

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

  const getDiasPendienteColor = (dias: number) => {
    if (dias === 0) return 'text-[var(--color-text)]';
    if (dias <= 2) return 'text-[var(--color-text)]';
    if (dias <= 7) return 'text-amber-600';
    return 'text-red-600';
  };

  const getDiasPendienteText = (dias: number) => {
    if (dias === 0) return 'Hoy';
    if (dias === 1) return 'Ayer';
    return `${dias} días`;
  };

  const toggleComision = (id: string) => {
    if (selectedComisiones.includes(id)) {
      setSelectedComisiones(selectedComisiones.filter(c => c !== id));
    } else {
      setSelectedComisiones([...selectedComisiones, id]);
    }
  };

  const calcularTotalSeleccionado = () => {
    if (!selectedVendedora) return 0;
    return selectedVendedora.comisionesPendientes
      .filter(c => selectedComisiones.includes(c.id))
      .reduce((sum, c) => sum + c.comision, 0);
  };

  const getMetodoPagoLabel = (metodo: MetodoPago) => {
    switch (metodo) {
      case 'efectivo': return 'Efectivo';
      case 'transferencia': return 'Transferencia';
      case 'deposito': return 'Depósito';
      case 'otro': return 'Otro';
    }
  };

  const renderDashboard = () => (
    <div>
      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Comisiones Generadas */}
        <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 rounded-lg bg-[#8B735515] flex items-center justify-center">
              <Percent className="text-[var(--color-primary)]" size={24} />
            </div>
          </div>
          <div className="text-[var(--color-primary)]" style={{ fontSize: '28px', fontWeight: 700 }}>
            {formatCurrency(comisionesGeneradas)}
          </div>
          <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>
            Generadas este mes
          </div>
          <div className="text-[var(--color-text-secondary)] mt-1" style={{ fontSize: '13px' }}>
            De {formatCurrency(totalMontoVendido)} en ventas
          </div>
        </div>

        {/* Comisiones Pendientes */}
        <div className="bg-white rounded-xl border border-amber-200 p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
              <Clock className="text-amber-600" size={24} />
            </div>
          </div>
          <div className="text-amber-600" style={{ fontSize: '28px', fontWeight: 700 }}>
            {formatCurrency(comisionesPendientes)}
          </div>
          <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>
            Pendientes de pago
          </div>
          <div className="text-[var(--color-text-secondary)] mt-1" style={{ fontSize: '13px' }}>
            De {vendedorasMock.length} vendedoras
          </div>
        </div>

        {/* Comisiones Pagadas */}
        <div className="bg-white rounded-xl border border-green-200 p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
          <div className="text-green-600" style={{ fontSize: '28px', fontWeight: 700 }}>
            {formatCurrency(comisionesPagadas)}
          </div>
          <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>
            Pagadas este mes
          </div>
          <div className="text-green-600 mt-1" style={{ fontSize: '13px', fontWeight: 600 }}>
            {pagosMock.length} pagos realizados
          </div>
        </div>

        {/* Tasa de Comisión */}
        <div className="bg-white rounded-xl border border-blue-200 p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Settings className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="text-blue-600" style={{ fontSize: '28px', fontWeight: 700 }}>
            10%
          </div>
          <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>
            Porcentaje actual
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[var(--color-text-secondary)]" style={{ fontSize: '13px' }}>
              Sobre ventas cerradas
            </span>
            <button className="text-blue-600 hover:underline" style={{ fontSize: '13px' }}>
              Configurar
            </button>
          </div>
        </div>
      </div>

      {/* Resumen por Vendedora */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 style={{ fontWeight: 600, fontSize: '18px' }}>Resumen por Vendedora</h3>
          <span className="text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>
            {periodo === 'mes' ? 'Este mes' : periodo}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left pb-3 text-[var(--color-text-secondary)]" style={{ fontSize: '12px', fontWeight: 600 }}>
                  VENDEDORA
                </th>
                <th className="text-center pb-3 text-[var(--color-text-secondary)]" style={{ fontSize: '12px', fontWeight: 600 }}>
                  COTIZACIONES
                </th>
                <th className="text-center pb-3 text-[var(--color-text-secondary)]" style={{ fontSize: '12px', fontWeight: 600 }}>
                  VENTAS CERRADAS
                </th>
                <th className="text-right pb-3 text-[var(--color-text-secondary)]" style={{ fontSize: '12px', fontWeight: 600 }}>
                  MONTO VENDIDO
                </th>
                <th className="text-right pb-3 text-[var(--color-text-secondary)]" style={{ fontSize: '12px', fontWeight: 600 }}>
                  COMISIÓN GENERADA
                </th>
                <th className="text-right pb-3 text-[var(--color-text-secondary)]" style={{ fontSize: '12px', fontWeight: 600 }}>
                  COMISIÓN PAGADA
                </th>
                <th className="text-right pb-3 text-[var(--color-text-secondary)]" style={{ fontSize: '12px', fontWeight: 600 }}>
                  PENDIENTE
                </th>
              </tr>
            </thead>
            <tbody>
              {vendedorasMock.map((vendedora) => (
                <tr 
                  key={vendedora.id}
                  onClick={() => {
                    setSelectedVendedora(vendedora);
                    setShowDetalleVendedora(true);
                  }}
                  className="border-b border-[var(--color-border)] hover:bg-[#F5F2EF] cursor-pointer transition-colors"
                >
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#E8DFF5] flex items-center justify-center" style={{ fontWeight: 600, fontSize: '14px' }}>
                        {vendedora.avatar}
                      </div>
                      <span style={{ fontWeight: 600 }}>{vendedora.nombre}</span>
                    </div>
                  </td>
                  <td className="py-4 text-center">{vendedora.cotizaciones}</td>
                  <td className="py-4 text-center">{vendedora.ventasCerradas}</td>
                  <td className="py-4 text-right" style={{ fontWeight: 600 }}>
                    {formatCurrency(vendedora.montoVendido)}
                  </td>
                  <td className="py-4 text-right" style={{ fontWeight: 600 }}>
                    {formatCurrency(vendedora.comisionGenerada)}
                  </td>
                  <td className="py-4 text-right text-green-600" style={{ fontWeight: 600 }}>
                    {formatCurrency(vendedora.comisionPagada)}
                  </td>
                  <td className="py-4 text-right">
                    <span className="text-amber-600" style={{ fontWeight: 700 }}>
                      {formatCurrency(vendedora.comisionPendiente)}
                    </span>
                  </td>
                </tr>
              ))}
              <tr className="bg-[#F5F2EF]">
                <td className="py-4" style={{ fontWeight: 700 }}>TOTAL</td>
                <td className="py-4 text-center" style={{ fontWeight: 700 }}>{totalCotizaciones}</td>
                <td className="py-4 text-center" style={{ fontWeight: 700 }}>{totalVentasCerradas}</td>
                <td className="py-4 text-right" style={{ fontWeight: 700 }}>
                  {formatCurrency(totalMontoVendido)}
                </td>
                <td className="py-4 text-right" style={{ fontWeight: 700 }}>
                  {formatCurrency(comisionesGeneradas)}
                </td>
                <td className="py-4 text-right text-green-600" style={{ fontWeight: 700 }}>
                  {formatCurrency(comisionesPagadas)}
                </td>
                <td className="py-4 text-right text-amber-600" style={{ fontWeight: 700 }}>
                  {formatCurrency(comisionesPendientes)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Dos columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        {/* Comisiones Pendientes de Pago */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-[var(--color-border)] p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h3 style={{ fontWeight: 600, fontSize: '18px' }}>Comisiones por Pagar</h3>
              <span className="px-2 py-1 bg-amber-100 text-amber-600 rounded-full" style={{ fontSize: '12px', fontWeight: 600 }}>
                {vendedorasMock.reduce((sum, v) => sum + v.comisionesPendientes.length, 0)} pendientes
              </span>
            </div>
            <button className="text-[var(--color-primary)] hover:underline" style={{ fontSize: '14px' }}>
              Ver todas
            </button>
          </div>

          <div className="space-y-4">
            {vendedorasMock.map((vendedora) => (
              <div key={vendedora.id} className="border border-[var(--color-border)] rounded-lg">
                <div 
                  onClick={() => setExpandedVendedora(expandedVendedora === vendedora.id ? null : vendedora.id)}
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#F5F2EF] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#E8DFF5] flex items-center justify-center" style={{ fontWeight: 600, fontSize: '14px' }}>
                      {vendedora.avatar}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{vendedora.nombre}</div>
                      <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '13px' }}>
                        {vendedora.comisionesPendientes.length} comisiones
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-amber-600" style={{ fontWeight: 700, fontSize: '18px' }}>
                        {formatCurrency(vendedora.comisionPendiente)}
                      </div>
                      <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '12px' }}>
                        Total pendiente
                      </div>
                    </div>
                    {expandedVendedora === vendedora.id ? (
                      <ChevronUp size={20} className="text-[var(--color-text-secondary)]" />
                    ) : (
                      <ChevronDown size={20} className="text-[var(--color-text-secondary)]" />
                    )}
                  </div>
                </div>

                {expandedVendedora === vendedora.id && (
                  <div className="border-t border-[var(--color-border)] p-4">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[var(--color-border)]">
                          <th className="text-left pb-2 text-[var(--color-text-secondary)]" style={{ fontSize: '11px' }}>FECHA</th>
                          <th className="text-left pb-2 text-[var(--color-text-secondary)]" style={{ fontSize: '11px' }}>FOLIO</th>
                          <th className="text-left pb-2 text-[var(--color-text-secondary)]" style={{ fontSize: '11px' }}>PACIENTE</th>
                          <th className="text-right pb-2 text-[var(--color-text-secondary)]" style={{ fontSize: '11px' }}>VENTA</th>
                          <th className="text-right pb-2 text-[var(--color-text-secondary)]" style={{ fontSize: '11px' }}>COMISIÓN</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vendedora.comisionesPendientes.map((comision) => (
                          <tr key={comision.id} className="border-b border-[var(--color-border)]">
                            <td className="py-2" style={{ fontSize: '13px' }}>
                              {formatDate(comision.fechaVenta)}
                            </td>
                            <td className="py-2">
                              <span className="font-mono text-[var(--color-primary)]" style={{ fontSize: '12px' }}>
                                {comision.folioVenta}
                              </span>
                            </td>
                            <td className="py-2" style={{ fontSize: '13px' }}>{comision.paciente}</td>
                            <td className="py-2 text-right" style={{ fontSize: '13px', fontWeight: 600 }}>
                              {formatCurrency(comision.montoVenta)}
                            </td>
                            <td className="py-2 text-right text-amber-600" style={{ fontSize: '13px', fontWeight: 600 }}>
                              {formatCurrency(comision.comision)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <button
                      onClick={() => {
                        setSelectedVendedora(vendedora);
                        setShowPagoModal(true);
                      }}
                      className="w-full mt-4 px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[#7A6349] transition-colors"
                    >
                      Pagar Comisiones
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Últimos Pagos */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[var(--color-border)] p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 style={{ fontWeight: 600, fontSize: '18px' }}>Últimos Pagos</h3>
            <button 
              onClick={() => setVistaActual('historial')}
              className="text-[var(--color-primary)] hover:underline" 
              style={{ fontSize: '14px' }}
            >
              Ver historial
            </button>
          </div>

          <div className="space-y-3">
            {pagosMock.map((pago) => (
              <div key={pago.id} className="p-4 bg-[#F5F2EF] rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="text-green-600" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{pago.vendedora}</div>
                    <div className="text-green-600" style={{ fontWeight: 700, fontSize: '16px' }}>
                      {formatCurrency(pago.monto)}
                    </div>
                    <div className="text-[var(--color-text-secondary)] mt-1" style={{ fontSize: '12px' }}>
                      {formatDate(pago.fecha)} • {getMetodoPagoLabel(pago.metodo)}
                    </div>
                    <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '12px' }}>
                      {pago.concepto}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gráfica de Comisiones */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 style={{ fontWeight: 600, fontSize: '18px' }}>Comisiones Generadas vs Pagadas</h3>
          <select className="px-3 py-1.5 border border-[var(--color-border)] rounded-lg" style={{ fontSize: '14px' }}>
            <option>Últimos 6 meses</option>
            <option>Últimos 3 meses</option>
            <option>Este año</option>
          </select>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={datosGrafica}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="mes" stroke="#6B6560" style={{ fontSize: '12px' }} />
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
            <Legend wrapperStyle={{ fontSize: '14px' }} iconType="circle" />
            <Bar dataKey="generadas" fill="#8B7355" name="Generadas" radius={[8, 8, 0, 0]} />
            <Bar dataKey="pagadas" fill="#7DB07D" name="Pagadas" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderHistorial = () => (
    <div>
      <div className="mb-6">
        <h2 className="font-['Cormorant_Garamond'] mb-2">Historial de Pagos</h2>
        <p className="text-[var(--color-text-secondary)]">
          Todos los pagos de comisiones realizados
        </p>
      </div>

      {/* Controles */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" size={20} />
            <input
              type="text"
              placeholder="Buscar por folio o vendedora..."
              className="w-full pl-11 pr-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          <select className="px-4 py-2.5 border border-[var(--color-border)] rounded-lg">
            <option value="">Todas las vendedoras</option>
            {vendedorasMock.map(v => (
              <option key={v.id} value={v.id}>{v.nombre}</option>
            ))}
          </select>

          <button className="flex items-center gap-2 px-4 py-2.5 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF]">
            <Download size={18} />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Tabla de pagos */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F5F2EF] border-b border-[var(--color-border)]">
              <th className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase" style={{ fontSize: '12px', fontWeight: 600 }}>
                Folio Pago
              </th>
              <th className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase" style={{ fontSize: '12px', fontWeight: 600 }}>
                Fecha
              </th>
              <th className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase" style={{ fontSize: '12px', fontWeight: 600 }}>
                Vendedora
              </th>
              <th className="text-center px-6 py-4 text-[var(--color-text-secondary)] uppercase" style={{ fontSize: '12px', fontWeight: 600 }}>
                # Comisiones
              </th>
              <th className="text-right px-6 py-4 text-[var(--color-text-secondary)] uppercase" style={{ fontSize: '12px', fontWeight: 600 }}>
                Monto
              </th>
              <th className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase" style={{ fontSize: '12px', fontWeight: 600 }}>
                Método
              </th>
              <th className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase" style={{ fontSize: '12px', fontWeight: 600 }}>
                Concepto
              </th>
              <th className="text-center px-6 py-4 text-[var(--color-text-secondary)] uppercase" style={{ fontSize: '12px', fontWeight: 600 }}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {pagosMock.map((pago) => (
              <tr key={pago.id} className="border-b border-[var(--color-border)] hover:bg-[#FDFBF9]">
                <td className="px-6 py-4">
                  <span className="font-mono text-[var(--color-primary)]" style={{ fontSize: '13px', fontWeight: 600 }}>
                    {pago.folio}
                  </span>
                </td>
                <td className="px-6 py-4">{formatDate(pago.fecha)}</td>
                <td className="px-6 py-4" style={{ fontWeight: 600 }}>{pago.vendedora}</td>
                <td className="px-6 py-4 text-center">{pago.numComisiones}</td>
                <td className="px-6 py-4 text-right text-green-600" style={{ fontWeight: 700 }}>
                  {formatCurrency(pago.monto)}
                </td>
                <td className="px-6 py-4">{getMetodoPagoLabel(pago.metodo)}</td>
                <td className="px-6 py-4">{pago.concepto}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[#8B7355]/10 rounded-lg">
                      <Eye size={16} />
                    </button>
                    <button className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[#8B7355]/10 rounded-lg">
                      <Printer size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div>
            <h1 className="font-['Cormorant_Garamond'] text-[var(--color-text)] mb-2">Comisiones</h1>
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
                onClick={() => setVistaActual('historial')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  vistaActual === 'historial' ? 'bg-[var(--color-primary)] text-white' : 'bg-[#F5F2EF] text-[var(--color-text-secondary)]'
                }`}
                style={{ fontSize: '14px' }}
              >
                Historial
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {vistaActual === 'dashboard' && (
              <select
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                className="px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] bg-white"
              >
                <option value="mes">Este Mes</option>
                <option value="mes-anterior">Mes Anterior</option>
                <option value="año">Este Año</option>
                <option value="personalizado">Personalizado</option>
              </select>
            )}

            <button
              onClick={() => setShowPagoModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[#7A6349] transition-colors"
            >
              <Plus size={20} />
              <span>Registrar Pago</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      {vistaActual === 'dashboard' ? renderDashboard() : renderHistorial()}

      {/* Modal: Registrar Pago de Comisiones */}
      {showPagoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[var(--color-border)] px-6 py-4 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-['Cormorant_Garamond']">Registrar Pago de Comisiones</h2>
                  <p className="text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>
                    Folio: PAG-2025-0035
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowPagoModal(false);
                    setSelectedVendedora(null);
                    setSelectedComisiones([]);
                  }}
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Vendedora */}
              <div>
                <label className="block mb-2" style={{ fontWeight: 600 }}>
                  Vendedora *
                </label>
                <select 
                  value={selectedVendedora?.id || ''}
                  onChange={(e) => {
                    const v = vendedorasMock.find(ven => ven.id === e.target.value);
                    setSelectedVendedora(v || null);
                    setSelectedComisiones([]);
                  }}
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                >
                  <option value="">Seleccionar vendedora...</option>
                  {vendedorasMock.map(v => (
                    <option key={v.id} value={v.id}>{v.nombre}</option>
                  ))}
                </select>
              </div>

              {selectedVendedora && (
                <>
                  {/* Resumen */}
                  <div className="bg-[#F5F2EF] rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-[#E8DFF5] flex items-center justify-center" style={{ fontWeight: 600 }}>
                        {selectedVendedora.avatar}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{selectedVendedora.nombre}</div>
                        <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '13px' }}>
                          {selectedVendedora.comisionesPendientes.length} comisiones pendientes
                        </div>
                      </div>
                    </div>
                    <div className="text-amber-600" style={{ fontWeight: 700, fontSize: '20px' }}>
                      Total pendiente: {formatCurrency(selectedVendedora.comisionPendiente)}
                    </div>
                  </div>

                  {/* Comisiones a pagar */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label style={{ fontWeight: 600 }}>Comisiones a Pagar</label>
                      <button
                        onClick={() => {
                          if (selectedComisiones.length === selectedVendedora.comisionesPendientes.length) {
                            setSelectedComisiones([]);
                          } else {
                            setSelectedComisiones(selectedVendedora.comisionesPendientes.map(c => c.id));
                          }
                        }}
                        className="text-[var(--color-primary)] hover:underline"
                        style={{ fontSize: '13px' }}
                      >
                        {selectedComisiones.length === selectedVendedora.comisionesPendientes.length ? 'Deseleccionar todas' : 'Seleccionar todas'}
                      </button>
                    </div>

                    <div className="border border-[var(--color-border)] rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-[#F5F2EF] border-b border-[var(--color-border)]">
                            <th className="w-10"></th>
                            <th className="text-left p-2" style={{ fontSize: '11px' }}>FECHA</th>
                            <th className="text-left p-2" style={{ fontSize: '11px' }}>FOLIO</th>
                            <th className="text-right p-2" style={{ fontSize: '11px' }}>COMISIÓN</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedVendedora.comisionesPendientes.map((comision) => (
                            <tr key={comision.id} className="border-b border-[var(--color-border)]">
                              <td className="p-2">
                                <input
                                  type="checkbox"
                                  checked={selectedComisiones.includes(comision.id)}
                                  onChange={() => toggleComision(comision.id)}
                                  className="w-4 h-4"
                                />
                              </td>
                              <td className="p-2" style={{ fontSize: '12px' }}>
                                {formatDate(comision.fechaVenta)}
                              </td>
                              <td className="p-2">
                                <span className="font-mono" style={{ fontSize: '11px' }}>
                                  {comision.folioVenta}
                                </span>
                              </td>
                              <td className="p-2 text-right" style={{ fontSize: '13px', fontWeight: 600 }}>
                                {formatCurrency(comision.comision)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-3 p-3 bg-amber-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span style={{ fontWeight: 600 }}>Total seleccionado:</span>
                        <span className="text-amber-600" style={{ fontSize: '20px', fontWeight: 700 }}>
                          {formatCurrency(calcularTotalSeleccionado())}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Información del pago */}
                  <div className="border-t border-[var(--color-border)] pt-6">
                    <h3 className="mb-4" style={{ fontWeight: 600 }}>Información del Pago</h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block mb-2" style={{ fontWeight: 600 }}>
                          Monto a Pagar *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]">$</span>
                          <input
                            type="number"
                            value={calcularTotalSeleccionado()}
                            className="w-full pl-8 pr-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                            readOnly
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block mb-2" style={{ fontWeight: 600 }}>
                          Método de Pago *
                        </label>
                        <select className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]">
                          <option value="">Seleccionar método...</option>
                          <option value="efectivo">Efectivo</option>
                          <option value="transferencia">Transferencia bancaria</option>
                          <option value="deposito">Depósito</option>
                          <option value="otro">Otro</option>
                        </select>
                      </div>

                      <div>
                        <label className="block mb-2" style={{ fontWeight: 600 }}>
                          Concepto/Descripción
                        </label>
                        <input
                          type="text"
                          defaultValue={`Comisiones semana ${Math.ceil(new Date().getDate() / 7)}`}
                          className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                        />
                      </div>

                      <div>
                        <label className="block mb-2" style={{ fontWeight: 600 }}>
                          Notas
                        </label>
                        <textarea
                          rows={2}
                          className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] resize-none"
                          placeholder="Observaciones adicionales..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Resumen final */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="mb-3 text-blue-900" style={{ fontWeight: 600 }}>Resumen del Pago</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Vendedora:</span>
                        <span style={{ fontWeight: 600 }}>{selectedVendedora.nombre}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Comisiones incluidas:</span>
                        <span style={{ fontWeight: 600 }}>{selectedComisiones.length}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-blue-200">
                        <span style={{ fontWeight: 700 }}>Monto total:</span>
                        <span className="text-blue-600" style={{ fontSize: '18px', fontWeight: 700 }}>
                          {formatCurrency(calcularTotalSeleccionado())}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-[var(--color-border)] px-6 py-4 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowPagoModal(false);
                  setSelectedVendedora(null);
                  setSelectedComisiones([]);
                }}
                className="px-6 py-2.5 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF]"
              >
                Cancelar
              </button>
              <button 
                disabled={!selectedVendedora || selectedComisiones.length === 0}
                className="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[#7A6349] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmar Pago
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drawer: Detalle por Vendedora */}
      {showDetalleVendedora && selectedVendedora && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-end z-50">
          <div className="bg-white w-full md:w-[700px] h-full overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[var(--color-border)] px-6 py-4 z-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-['Cormorant_Garamond']">Detalle de Vendedora</h2>
                <button
                  onClick={() => {
                    setShowDetalleVendedora(false);
                    setSelectedVendedora(null);
                  }}
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Perfil */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#E8DFF5] flex items-center justify-center" style={{ fontWeight: 700, fontSize: '20px' }}>
                    {selectedVendedora.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '18px' }}>{selectedVendedora.nombre}</div>
                    <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>
                      Recepcionista / Vendedora
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowPagoModal(true)}
                  className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[#7A6349]"
                  style={{ fontSize: '14px' }}
                >
                  Registrar Pago
                </button>
              </div>

              {/* Métricas rápidas */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-[#F5F2EF] rounded-lg p-3">
                  <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '12px' }}>Ventas Cerradas</div>
                  <div style={{ fontWeight: 700, fontSize: '18px' }}>{selectedVendedora.ventasCerradas}</div>
                </div>
                <div className="bg-[#F5F2EF] rounded-lg p-3">
                  <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '12px' }}>Monto Vendido</div>
                  <div style={{ fontWeight: 700, fontSize: '18px' }}>{formatCurrency(selectedVendedora.montoVendido)}</div>
                </div>
                <div className="bg-[#F5F2EF] rounded-lg p-3">
                  <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '12px' }}>Tasa Conversión</div>
                  <div style={{ fontWeight: 700, fontSize: '18px' }}>
                    {Math.round((selectedVendedora.ventasCerradas / selectedVendedora.cotizaciones) * 100)}%
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-4 mt-6 border-b border-[var(--color-border)]">
                <button
                  onClick={() => setSelectedTab('pendientes')}
                  className={`pb-3 transition-colors ${
                    selectedTab === 'pendientes'
                      ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                      : 'text-[var(--color-text-secondary)]'
                  }`}
                  style={{ fontWeight: selectedTab === 'pendientes' ? 600 : 400, fontSize: '14px' }}
                >
                  Pendientes ({selectedVendedora.comisionesPendientes.length})
                </button>
                <button
                  onClick={() => setSelectedTab('pagos')}
                  className={`pb-3 transition-colors ${
                    selectedTab === 'pagos'
                      ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                      : 'text-[var(--color-text-secondary)]'
                  }`}
                  style={{ fontWeight: selectedTab === 'pagos' ? 600 : 400, fontSize: '14px' }}
                >
                  Historial de Pagos
                </button>
              </div>
            </div>

            <div className="p-6">
              {selectedTab === 'pendientes' && (
                <div>
                  <div className="bg-amber-50 rounded-lg p-4 mb-4">
                    <div className="text-amber-900" style={{ fontWeight: 600 }}>
                      Total Pendiente: {formatCurrency(selectedVendedora.comisionPendiente)}
                    </div>
                    <div className="text-amber-700" style={{ fontSize: '13px' }}>
                      {selectedVendedora.comisionesPendientes.length} comisiones sin pagar
                    </div>
                  </div>

                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[var(--color-border)]">
                        <th className="text-left pb-3" style={{ fontSize: '12px', fontWeight: 600 }}>FECHA</th>
                        <th className="text-left pb-3" style={{ fontSize: '12px', fontWeight: 600 }}>FOLIO</th>
                        <th className="text-left pb-3" style={{ fontSize: '12px', fontWeight: 600 }}>PACIENTE</th>
                        <th className="text-right pb-3" style={{ fontSize: '12px', fontWeight: 600 }}>COMISIÓN</th>
                        <th className="text-right pb-3" style={{ fontSize: '12px', fontWeight: 600 }}>DÍAS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedVendedora.comisionesPendientes.map((comision) => (
                        <tr key={comision.id} className="border-b border-[var(--color-border)]">
                          <td className="py-3" style={{ fontSize: '13px' }}>{formatDate(comision.fechaVenta)}</td>
                          <td className="py-3">
                            <span className="font-mono text-[var(--color-primary)]" style={{ fontSize: '12px' }}>
                              {comision.folioVenta}
                            </span>
                          </td>
                          <td className="py-3" style={{ fontSize: '13px' }}>{comision.paciente}</td>
                          <td className="py-3 text-right text-amber-600" style={{ fontSize: '14px', fontWeight: 600 }}>
                            {formatCurrency(comision.comision)}
                          </td>
                          <td className={`py-3 text-right ${getDiasPendienteColor(comision.diasPendiente)}`} style={{ fontSize: '13px', fontWeight: 600 }}>
                            {getDiasPendienteText(comision.diasPendiente)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {selectedTab === 'pagos' && (
                <div>
                  <div className="space-y-3">
                    {pagosMock.filter(p => p.vendedoraId === selectedVendedora.id).map((pago) => (
                      <div key={pago.id} className="border border-[var(--color-border)] rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div style={{ fontWeight: 600 }}>{pago.folio}</div>
                            <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '13px' }}>
                              {formatDate(pago.fecha)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-green-600" style={{ fontWeight: 700, fontSize: '18px' }}>
                              {formatCurrency(pago.monto)}
                            </div>
                            <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '12px' }}>
                              {pago.numComisiones} comisiones
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-[var(--color-text-secondary)]" style={{ fontSize: '13px' }}>
                          <span>{getMetodoPagoLabel(pago.metodo)}</span>
                          <span>•</span>
                          <span>{pago.concepto}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
