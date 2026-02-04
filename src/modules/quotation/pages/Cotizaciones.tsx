import React, { useState } from 'react';
import {
  Search,
  Plus,
  FileText,
  TrendingUp,
  CheckCircle,
  Percent,
  Eye,
  Send,
  MoreVertical,
  X,
  Calendar,
  Clock,
  User,
  Phone,
  MessageCircle,
  Download,
  Edit2,
  Copy,
  AlertTriangle,
  Trash2,
  CreditCard,
  Banknote,
  Smartphone,
  Minus
} from 'lucide-react';

type EstadoCotizacion = 'pendiente' | 'enviada' | 'negociacion' | 'cerrada' | 'vencida' | 'rechazada';

interface ItemCotizacion {
  id: string;
  tipo: 'servicio' | 'producto';
  nombre: string;
  descripcion?: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

interface Cotizacion {
  id: string;
  folio: string;
  fecha: string;
  pacienteId: string;
  pacienteNombre: string;
  pacienteTelefono: string;
  pacienteAvatar: string;
  items: ItemCotizacion[];
  subtotal: number;
  descuento: number;
  total: number;
  vendedora: string;
  vendedoraId: string;
  vigencia?: string;
  estado: EstadoCotizacion;
  notasPaciente?: string;
  notasInternas?: string;
}

const estadosConfig = {
  pendiente: { label: 'Pendiente', color: '#E0A75E', bgColor: '#E0A75E15' },
  enviada: { label: 'Enviada', color: '#5B9FD8', bgColor: '#5B9FD815' },
  negociacion: { label: 'En Negociación', color: '#9D6FD8', bgColor: '#9D6FD815' },
  cerrada: { label: 'Cerrada', color: '#7DB07D', bgColor: '#7DB07D15' },
  vencida: { label: 'Vencida', color: '#6B6560', bgColor: '#6B656015' },
  rechazada: { label: 'Rechazada', color: '#C67B7B', bgColor: '#C67B7B15' }
};

const cotizacionesMock: Cotizacion[] = [
  {
    id: '1',
    folio: 'COT-2025-0034',
    fecha: '2025-11-27T10:30:00',
    pacienteId: '1',
    pacienteNombre: 'María García López',
    pacienteTelefono: '(662) 123-4567',
    pacienteAvatar: 'MG',
    items: [
      { id: '1', tipo: 'servicio', nombre: 'Limpieza Facial Profunda', cantidad: 1, precioUnitario: 850, subtotal: 850 },
      { id: '2', tipo: 'servicio', nombre: 'Hidratación Intensiva', descripcion: 'Incluye mascarilla', cantidad: 1, precioUnitario: 600, subtotal: 600 },
      { id: '3', tipo: 'producto', nombre: 'Ácido Hialurónico 1ml', cantidad: 2, precioUnitario: 1000, subtotal: 2000 }
    ],
    subtotal: 3450,
    descuento: 345,
    total: 3105,
    vendedora: 'Ana R.',
    vendedoraId: '1',
    vigencia: '2025-12-04',
    estado: 'negociacion',
    notasPaciente: 'Tratamiento recomendado para mejorar textura de piel',
    notasInternas: 'Cliente interesada, llamar el viernes'
  },
  {
    id: '2',
    folio: 'COT-2025-0033',
    fecha: '2025-11-26T14:20:00',
    pacienteId: '2',
    pacienteNombre: 'Ana Sofía Martínez',
    pacienteTelefono: '(662) 234-5678',
    pacienteAvatar: 'AM',
    items: [
      { id: '1', tipo: 'servicio', nombre: 'Paquete Novia Radiante', cantidad: 1, precioUnitario: 2800, subtotal: 2800 }
    ],
    subtotal: 2800,
    descuento: 0,
    total: 2800,
    vendedora: 'Ana R.',
    vendedoraId: '1',
    vigencia: '2025-12-10',
    estado: 'enviada',
    notasPaciente: 'Paquete especial para boda en enero'
  },
  {
    id: '3',
    folio: 'COT-2025-0032',
    fecha: '2025-11-25T09:15:00',
    pacienteId: '3',
    pacienteNombre: 'Laura Fernández Cruz',
    pacienteTelefono: '(662) 345-6789',
    pacienteAvatar: 'LF',
    items: [
      { id: '1', tipo: 'servicio', nombre: 'Rejuvenecimiento con Plasma', cantidad: 3, precioUnitario: 2500, subtotal: 7500 },
      { id: '2', tipo: 'servicio', nombre: 'Masaje Facial', cantidad: 3, precioUnitario: 400, subtotal: 1200 }
    ],
    subtotal: 8700,
    descuento: 870,
    total: 7830,
    vendedora: 'Ana R.',
    vendedoraId: '1',
    vigencia: '2025-12-15',
    estado: 'pendiente',
    notasPaciente: 'Paquete de 3 sesiones con descuento del 10%'
  },
  {
    id: '4',
    folio: 'COT-2025-0031',
    fecha: '2025-11-24T16:00:00',
    pacienteId: '4',
    pacienteNombre: 'Carmen Rodríguez',
    pacienteTelefono: '(662) 456-7890',
    pacienteAvatar: 'CR',
    items: [
      { id: '1', tipo: 'servicio', nombre: 'Peeling Químico', cantidad: 1, precioUnitario: 1500, subtotal: 1500 },
      { id: '2', tipo: 'producto', nombre: 'Protector Solar SPF 50', cantidad: 1, precioUnitario: 120, subtotal: 120 }
    ],
    subtotal: 1620,
    descuento: 0,
    total: 1620,
    vendedora: 'Ana R.',
    vendedoraId: '1',
    estado: 'cerrada'
  },
  {
    id: '5',
    folio: 'COT-2025-0030',
    fecha: '2025-11-20T11:00:00',
    pacienteId: '5',
    pacienteNombre: 'Patricia Sánchez',
    pacienteTelefono: '(662) 567-8901',
    pacienteAvatar: 'PS',
    items: [
      { id: '1', tipo: 'servicio', nombre: 'Limpieza Facial', cantidad: 1, precioUnitario: 650, subtotal: 650 }
    ],
    subtotal: 650,
    descuento: 0,
    total: 650,
    vendedora: 'Ana R.',
    vendedoraId: '1',
    vigencia: '2025-11-27',
    estado: 'vencida'
  }
];

export function Cotizaciones() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('todas');
  const [selectedTab, setSelectedTab] = useState('todas');
  const [showNewCotizacionModal, setShowNewCotizacionModal] = useState(false);
  const [showConvertirVentaModal, setShowConvertirVentaModal] = useState(false);
  const [selectedCotizacion, setSelectedCotizacion] = useState<Cotizacion | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Items para nueva cotización
  const [selectedItems, setSelectedItems] = useState<ItemCotizacion[]>([]);
  const [descuentoTipo, setDescuentoTipo] = useState<'porcentaje' | 'monto'>('porcentaje');
  const [descuentoValor, setDescuentoValor] = useState(0);

  // Método de pago
  const [metodoPago, setMetodoPago] = useState<string>('');
  const [montoRecibido, setMontoRecibido] = useState(0);

  // Calcular estadísticas
  const cotizacionesActivas = cotizacionesMock.filter(c => 
    c.estado === 'pendiente' || c.estado === 'enviada' || c.estado === 'negociacion'
  ).length;
  
  const valorPipeline = cotizacionesMock
    .filter(c => c.estado === 'pendiente' || c.estado === 'enviada' || c.estado === 'negociacion')
    .reduce((sum, c) => sum + c.total, 0);
  
  const cerradasMes = cotizacionesMock.filter(c => c.estado === 'cerrada').length;
  const totalCerradas = cotizacionesMock.filter(c => c.estado === 'cerrada').reduce((sum, c) => sum + c.total, 0);
  
  const tasaConversion = Math.round((cerradasMes / cotizacionesMock.length) * 100);

  // Filtrar cotizaciones
  const filteredCotizaciones = cotizacionesMock.filter(cot => {
    const matchesSearch = cot.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cot.pacienteNombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = filterEstado === 'todas' || cot.estado === filterEstado;
    const matchesTab = selectedTab === 'todas' || cot.estado === selectedTab;
    return matchesSearch && matchesEstado && matchesTab;
  });

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

  const getDaysUntilExpiry = (dateString?: string) => {
    if (!dateString) return null;
    const today = new Date();
    const expiry = new Date(dateString);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calcularSubtotal = () => {
    return selectedItems.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const calcularDescuento = () => {
    const subtotal = calcularSubtotal();
    if (descuentoTipo === 'porcentaje') {
      return (subtotal * descuentoValor) / 100;
    }
    return descuentoValor;
  };

  const calcularTotal = () => {
    return calcularSubtotal() - calcularDescuento();
  };

  const agregarItem = (item: ItemCotizacion) => {
    setSelectedItems([...selectedItems, item]);
  };

  const eliminarItem = (id: string) => {
    setSelectedItems(selectedItems.filter(i => i.id !== id));
  };

  const actualizarCantidad = (id: string, cantidad: number) => {
    setSelectedItems(selectedItems.map(item => {
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
            <h1 className="font-['Cormorant_Garamond'] text-[var(--color-text)] mb-2">Cotizaciones</h1>
            <p className="text-[var(--color-text-secondary)]">
              {cotizacionesMock.length} cotizaciones este mes
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-[#8B735515] flex items-center justify-center">
                <FileText className="text-[var(--color-primary)]" size={24} />
              </div>
            </div>
            <div className="text-[var(--color-text)]" style={{ fontSize: '28px', fontWeight: 700 }}>
              {cotizacionesActivas}
            </div>
            <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>
              Pendientes de cierre
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <TrendingUp className="text-blue-600" size={24} />
              </div>
            </div>
            <div className="text-blue-600" style={{ fontSize: '28px', fontWeight: 700 }}>
              {formatCurrency(valorPipeline)}
            </div>
            <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>
              Valor total pendiente
            </div>
          </div>

          <div className="bg-white rounded-xl border border-green-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
            <div className="text-green-600" style={{ fontSize: '28px', fontWeight: 700 }}>
              {cerradasMes}
            </div>
            <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>
              Convertidas a venta
            </div>
            <div className="text-green-600 mt-1" style={{ fontSize: '13px', fontWeight: 600 }}>
              {formatCurrency(totalCerradas)} facturados
            </div>
          </div>

          <div className="bg-white rounded-xl border border-green-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Percent className="text-green-600" size={24} />
              </div>
            </div>
            <div className="text-green-600" style={{ fontSize: '28px', fontWeight: 700 }}>
              {tasaConversion}%
            </div>
            <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>
              Cotización → Venta
            </div>
            <div className="text-green-600 mt-1" style={{ fontSize: '13px', fontWeight: 600 }}>
              +5% vs mes anterior
            </div>
          </div>
        </div>
      </div>

      {/* Tabs de estado */}
      <div className="mb-6 border-b border-[var(--color-border)] overflow-x-auto">
        <div className="flex gap-6 min-w-max">
          <button
            onClick={() => setSelectedTab('todas')}
            className={`pb-3 transition-colors whitespace-nowrap ${
              selectedTab === 'todas'
                ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
            }`}
            style={{ fontWeight: selectedTab === 'todas' ? 600 : 400 }}
          >
            Todas ({cotizacionesMock.length})
          </button>
          <button
            onClick={() => setSelectedTab('pendiente')}
            className={`pb-3 transition-colors whitespace-nowrap flex items-center gap-2 ${
              selectedTab === 'pendiente'
                ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
            }`}
            style={{ fontWeight: selectedTab === 'pendiente' ? 600 : 400 }}
          >
            Pendientes
            <span className="px-2 py-0.5 bg-amber-100 text-amber-600 rounded-full" style={{ fontSize: '12px', fontWeight: 600 }}>
              {cotizacionesMock.filter(c => c.estado === 'pendiente').length}
            </span>
          </button>
          <button
            onClick={() => setSelectedTab('enviada')}
            className={`pb-3 transition-colors whitespace-nowrap ${
              selectedTab === 'enviada'
                ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
            }`}
            style={{ fontWeight: selectedTab === 'enviada' ? 600 : 400 }}
          >
            Enviadas ({cotizacionesMock.filter(c => c.estado === 'enviada').length})
          </button>
          <button
            onClick={() => setSelectedTab('negociacion')}
            className={`pb-3 transition-colors whitespace-nowrap ${
              selectedTab === 'negociacion'
                ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
            }`}
            style={{ fontWeight: selectedTab === 'negociacion' ? 600 : 400 }}
          >
            En Negociación ({cotizacionesMock.filter(c => c.estado === 'negociacion').length})
          </button>
          <button
            onClick={() => setSelectedTab('cerrada')}
            className={`pb-3 transition-colors whitespace-nowrap flex items-center gap-2 ${
              selectedTab === 'cerrada'
                ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
            }`}
            style={{ fontWeight: selectedTab === 'cerrada' ? 600 : 400 }}
          >
            Cerradas ✓
            <span className="px-2 py-0.5 bg-green-100 text-green-600 rounded-full" style={{ fontSize: '12px', fontWeight: 600 }}>
              {cotizacionesMock.filter(c => c.estado === 'cerrada').length}
            </span>
          </button>
          <button
            onClick={() => setSelectedTab('vencida')}
            className={`pb-3 transition-colors whitespace-nowrap flex items-center gap-2 ${
              selectedTab === 'vencida'
                ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
            }`}
            style={{ fontWeight: selectedTab === 'vencida' ? 600 : 400 }}
          >
            Vencidas
            <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-full" style={{ fontSize: '12px', fontWeight: 600 }}>
              {cotizacionesMock.filter(c => c.estado === 'vencida').length}
            </span>
          </button>
        </div>
      </div>

      {/* Barra de controles */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Buscador */}
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" size={20} />
            <input
              type="text"
              placeholder="Buscar por paciente o folio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] transition-colors"
            />
          </div>

          {/* Filtro por Estado */}
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] bg-white"
          >
            <option value="todas">Todos los estados</option>
            <option value="pendiente">Pendientes</option>
            <option value="enviada">Enviadas</option>
            <option value="negociacion">En negociación</option>
            <option value="cerrada">Cerradas</option>
            <option value="vencida">Vencidas</option>
            <option value="rechazada">Rechazadas</option>
          </select>
        </div>
      </div>

      {/* Tabla de cotizaciones */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F5F2EF] border-b border-[var(--color-border)]">
                <th className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Folio
                </th>
                <th className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Fecha
                </th>
                <th className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Paciente
                </th>
                <th className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Servicios/Productos
                </th>
                <th className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Total
                </th>
                <th className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Vendedora
                </th>
                <th className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Vigencia
                </th>
                <th className="text-center px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Estado
                </th>
                <th className="text-center px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCotizaciones.map((cotizacion) => {
                const estado = estadosConfig[cotizacion.estado];
                const daysUntilExpiry = getDaysUntilExpiry(cotizacion.vigencia);
                const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry < 3 && daysUntilExpiry > 0;

                return (
                  <tr
                    key={cotizacion.id}
                    className={`border-b border-[var(--color-border)] hover:bg-[#FDFBF9] transition-colors ${
                      isExpiringSoon ? 'border-l-4 border-l-amber-500' : ''
                    } ${cotizacion.estado === 'vencida' ? 'bg-gray-50' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-[var(--color-primary)] hover:underline cursor-pointer" style={{ fontSize: '13px', fontWeight: 600 }}>
                        {cotizacion.folio}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div style={{ fontWeight: 600 }}>{formatDate(cotizacion.fecha)}</div>
                        <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '13px' }}>
                          {formatTime(cotizacion.fecha)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#E8DFF5] flex items-center justify-center flex-shrink-0" style={{ fontWeight: 600, fontSize: '14px' }}>
                          {cotizacion.pacienteAvatar}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{cotizacion.pacienteNombre}</div>
                          <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '13px' }}>
                            {cotizacion.pacienteTelefono}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>
                        {cotizacion.items.length === 1 
                          ? cotizacion.items[0].nombre
                          : `${cotizacion.items[0].nombre}, ${cotizacion.items[1]?.nombre || ''}${cotizacion.items.length > 2 ? ` + ${cotizacion.items.length - 2} más` : ''}`
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        {cotizacion.descuento > 0 && (
                          <div className="text-[var(--color-text-secondary)] line-through" style={{ fontSize: '13px' }}>
                            {formatCurrency(cotizacion.subtotal)}
                          </div>
                        )}
                        <div style={{ fontWeight: 600, fontSize: '16px' }}>
                          {formatCurrency(cotizacion.total)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span>{cotizacion.vendedora}</span>
                    </td>
                    <td className="px-6 py-4">
                      {cotizacion.vigencia ? (
                        <div>
                          {daysUntilExpiry !== null && daysUntilExpiry >= 0 ? (
                            <div className={`${daysUntilExpiry < 3 ? 'text-amber-600' : 'text-[var(--color-text)]'}`}>
                              Vence en {daysUntilExpiry} días
                            </div>
                          ) : (
                            <div className="text-red-600">
                              Vencida hace {Math.abs(daysUntilExpiry || 0)} días
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-[var(--color-text-secondary)]">Sin vigencia</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className="inline-flex px-3 py-1 rounded-full"
                        style={{
                          fontSize: '12px',
                          fontWeight: 500,
                          backgroundColor: estado.bgColor,
                          color: estado.color
                        }}
                      >
                        {estado.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[#8B7355]/10 rounded-lg transition-colors"
                          title="Ver detalle"
                        >
                          <Eye size={16} />
                        </button>
                        {cotizacion.estado !== 'cerrada' && cotizacion.estado !== 'vencida' && (
                          <button 
                            onClick={() => {
                              setSelectedCotizacion(cotizacion);
                              setShowConvertirVentaModal(true);
                            }}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Convertir a venta"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                        <button 
                          onClick={() => window.open(`https://wa.me/${cotizacion.pacienteTelefono.replace(/\D/g, '')}`, '_blank')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Enviar por WhatsApp"
                        >
                          <MessageCircle size={16} />
                        </button>
                        <div className="relative">
                          <button
                            onClick={() => setActiveMenu(activeMenu === cotizacion.id ? null : cotizacion.id)}
                            className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[#8B7355]/10 rounded-lg transition-colors"
                          >
                            <MoreVertical size={16} />
                          </button>
                          {activeMenu === cotizacion.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-[var(--color-border)] py-1 z-10">
                              <button className="w-full px-4 py-2 text-left hover:bg-[#F5F2EF] flex items-center gap-2">
                                <Edit2 size={14} />
                                <span>Editar</span>
                              </button>
                              <button className="w-full px-4 py-2 text-left hover:bg-[#F5F2EF] flex items-center gap-2">
                                <Copy size={14} />
                                <span>Duplicar</span>
                              </button>
                              <button className="w-full px-4 py-2 text-left hover:bg-[#F5F2EF] flex items-center gap-2">
                                <Download size={14} />
                                <span>Descargar PDF</span>
                              </button>
                              <button className="w-full px-4 py-2 text-left hover:bg-[#F5F2EF] flex items-center gap-2 text-[var(--color-error)]">
                                <Trash2 size={14} />
                                <span>Eliminar</span>
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
      </div>

      {/* Modal: Nueva Cotización */}
      {showNewCotizacionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="font-['Cormorant_Garamond']">Nueva Cotización</h2>
                <p className="text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>
                  Folio: COT-2025-0035
                </p>
              </div>
              <button
                onClick={() => setShowNewCotizacionModal(false)}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 p-6">
              {/* Columna Izquierda - Formulario */}
              <div className="lg:col-span-3 space-y-6">
                {/* Información General */}
                <div>
                  <h3 className="mb-4" style={{ fontWeight: 600 }}>Información General</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2" style={{ fontWeight: 600 }}>
                        Paciente *
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                        placeholder="Buscar paciente..."
                      />
                      <button className="mt-2 text-[var(--color-primary)] hover:underline" style={{ fontSize: '14px' }}>
                        + Nuevo paciente
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2" style={{ fontWeight: 600 }}>
                          Vendedora asignada *
                        </label>
                        <select className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]">
                          <option value="1">Ana Rodríguez</option>
                          <option value="2">María López</option>
                        </select>
                      </div>
                      <div>
                        <label className="block mb-2" style={{ fontWeight: 600 }}>
                          Vigencia
                        </label>
                        <select className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]">
                          <option value="7">7 días</option>
                          <option value="15">15 días</option>
                          <option value="30">30 días</option>
                          <option value="">Sin vigencia</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Agregar Items */}
                <div className="border-t border-[var(--color-border)] pt-6">
                  <h3 className="mb-4" style={{ fontWeight: 600 }}>Agregar Items</h3>
                  <div className="space-y-4">
                    <div className="flex gap-2 border-b border-[var(--color-border)]">
                      <button className="px-4 py-2 border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]" style={{ fontWeight: 600 }}>
                        Servicios
                      </button>
                      <button className="px-4 py-2 text-[var(--color-text-secondary)]">
                        Productos
                      </button>
                    </div>

                    <div>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                        placeholder="Buscar servicio o producto..."
                      />
                    </div>

                    {/* Lista de items agregados */}
                    {selectedItems.length > 0 ? (
                      <div className="space-y-2">
                        {selectedItems.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 p-3 bg-[#F5F2EF] rounded-lg">
                            <div className="flex-1">
                              <div style={{ fontWeight: 600 }}>{item.nombre}</div>
                              {item.descripcion && (
                                <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '13px' }}>
                                  {item.descripcion}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <button className="p-1 hover:bg-white rounded">
                                <Minus size={16} />
                              </button>
                              <span className="w-8 text-center" style={{ fontWeight: 600 }}>{item.cantidad}</span>
                              <button className="p-1 hover:bg-white rounded">
                                <Plus size={16} />
                              </button>
                            </div>
                            <div className="w-24 text-right" style={{ fontWeight: 600 }}>
                              {formatCurrency(item.subtotal)}
                            </div>
                            <button onClick={() => eliminarItem(item.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
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
                </div>

                {/* Descuentos y Notas */}
                <div className="border-t border-[var(--color-border)] pt-6">
                  <h3 className="mb-4" style={{ fontWeight: 600 }}>Descuentos y Notas</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div style={{ fontWeight: 600 }}>Aplicar descuento</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-success)]"></div>
                      </label>
                    </div>

                    <div>
                      <label className="block mb-2" style={{ fontWeight: 600 }}>
                        Notas para el paciente
                      </label>
                      <textarea
                        rows={3}
                        className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] resize-none"
                        placeholder="Condiciones, recomendaciones, instrucciones..."
                      />
                    </div>

                    <div>
                      <label className="block mb-2" style={{ fontWeight: 600 }}>
                        Notas internas
                      </label>
                      <textarea
                        rows={2}
                        className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] resize-none"
                        placeholder="Notas solo visibles para el personal..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna Derecha - Preview */}
              <div className="lg:col-span-2">
                <div className="sticky top-24 bg-white border border-[var(--color-border)] rounded-xl p-6 shadow-lg">
                  <div className="text-center mb-6">
                    <div className="text-[var(--color-primary)] mb-2" style={{ fontSize: '24px', fontWeight: 700 }}>
                      Bio Plasma
                    </div>
                    <div className="text-[var(--color-text-secondary)] mb-1" style={{ fontSize: '20px', fontWeight: 600 }}>
                      COTIZACIÓN
                    </div>
                    <div className="font-mono text-[var(--color-text-secondary)]" style={{ fontSize: '13px' }}>
                      COT-2025-0035
                    </div>
                    <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '13px' }}>
                      27 Nov 2025
                    </div>
                  </div>

                  <div className="mb-6 pb-6 border-b border-[var(--color-border)]">
                    <div className="text-[var(--color-text-secondary)] mb-1" style={{ fontSize: '12px', fontWeight: 600 }}>
                      PARA:
                    </div>
                    <div style={{ fontWeight: 600 }}>-</div>
                    <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>-</div>
                  </div>

                  {selectedItems.length > 0 ? (
                    <>
                      <table className="w-full mb-6">
                        <thead>
                          <tr className="border-b border-[var(--color-border)]">
                            <th className="text-left pb-2 text-[var(--color-text-secondary)]" style={{ fontSize: '12px' }}>Concepto</th>
                            <th className="text-center pb-2 text-[var(--color-text-secondary)]" style={{ fontSize: '12px' }}>Cant.</th>
                            <th className="text-right pb-2 text-[var(--color-text-secondary)]" style={{ fontSize: '12px' }}>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedItems.map((item) => (
                            <tr key={item.id} className="border-b border-[var(--color-border)]">
                              <td className="py-2" style={{ fontSize: '14px' }}>{item.nombre}</td>
                              <td className="py-2 text-center" style={{ fontSize: '14px' }}>{item.cantidad}</td>
                              <td className="py-2 text-right" style={{ fontSize: '14px' }}>{formatCurrency(item.subtotal)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div className="space-y-2 mb-6">
                        <div className="flex justify-between">
                          <span className="text-[var(--color-text-secondary)]">Subtotal:</span>
                          <span style={{ fontWeight: 600 }}>{formatCurrency(calcularSubtotal())}</span>
                        </div>
                        {calcularDescuento() > 0 && (
                          <div className="flex justify-between text-red-600">
                            <span>Descuento:</span>
                            <span>-{formatCurrency(calcularDescuento())}</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t border-[var(--color-border)]">
                          <span style={{ fontSize: '18px', fontWeight: 700 }}>TOTAL:</span>
                          <span className="text-[var(--color-secondary)]" style={{ fontSize: '20px', fontWeight: 700 }}>
                            {formatCurrency(calcularTotal())}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>
                      Agrega items para ver el preview
                    </div>
                  )}

                  <div className="text-center text-[var(--color-text-secondary)] pt-6 border-t border-[var(--color-border)]" style={{ fontSize: '12px' }}>
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
                onClick={() => setShowNewCotizacionModal(false)}
                className="px-6 py-2.5 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors"
              >
                Cancelar
              </button>
              <button className="px-6 py-2.5 border border-[var(--color-primary)] text-[var(--color-primary)] rounded-lg hover:bg-[#8B7355]/10 transition-colors">
                Guardar Borrador
              </button>
              <button className="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[#7A6349] transition-colors">
                Guardar y Enviar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Convertir a Venta */}
      {showConvertirVentaModal && selectedCotizacion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[var(--color-border)] px-6 py-4 z-10">
              <h2 className="font-['Cormorant_Garamond']">Convertir a Venta</h2>
              <p className="text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>
                {selectedCotizacion.folio} → {selectedCotizacion.pacienteNombre}
              </p>
            </div>

            <div className="p-6 space-y-5">
              {/* Resumen de cotización */}
              <div className="bg-[#F5F2EF] rounded-lg p-4">
                <div className="flex justify-between mb-3">
                  <span className="text-[var(--color-text-secondary)]">Items:</span>
                  <span style={{ fontWeight: 600 }}>{selectedCotizacion.items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ fontSize: '18px', fontWeight: 700 }}>Total a cobrar:</span>
                  <span className="text-[var(--color-secondary)]" style={{ fontSize: '24px', fontWeight: 700 }}>
                    {formatCurrency(selectedCotizacion.total)}
                  </span>
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
                    className={`p-4 border-2 rounded-lg transition-all ${
                      metodoPago === 'efectivo'
                        ? 'border-[var(--color-primary)] bg-[#8B735515]'
                        : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'
                    }`}
                  >
                    <Banknote className={`mx-auto mb-2 ${metodoPago === 'efectivo' ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]'}`} size={24} />
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>Efectivo</div>
                  </button>
                  <button
                    onClick={() => setMetodoPago('tarjeta-credito')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      metodoPago === 'tarjeta-credito'
                        ? 'border-[var(--color-primary)] bg-[#8B735515]'
                        : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'
                    }`}
                  >
                    <CreditCard className={`mx-auto mb-2 ${metodoPago === 'tarjeta-credito' ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]'}`} size={24} />
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>Tarjeta</div>
                  </button>
                  <button
                    onClick={() => setMetodoPago('transferencia')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      metodoPago === 'transferencia'
                        ? 'border-[var(--color-primary)] bg-[#8B735515]'
                        : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'
                    }`}
                  >
                    <Smartphone className={`mx-auto mb-2 ${metodoPago === 'transferencia' ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]'}`} size={24} />
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>Transferencia</div>
                  </button>
                  <button
                    onClick={() => setMetodoPago('multiple')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      metodoPago === 'multiple'
                        ? 'border-[var(--color-primary)] bg-[#8B735515]'
                        : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'
                    }`}
                  >
                    <div className="mb-2 text-center" style={{ fontSize: '24px' }}>💳💵</div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>Múltiple</div>
                  </button>
                </div>
              </div>

              {/* Monto recibido */}
              {metodoPago === 'efectivo' && (
                <div>
                  <label className="block mb-2" style={{ fontWeight: 600 }}>
                    Monto recibido *
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
                  {montoRecibido > selectedCotizacion.total && (
                    <div className="mt-2 p-3 bg-green-50 rounded-lg">
                      <div className="flex justify-between">
                        <span className="text-green-600" style={{ fontWeight: 600 }}>Cambio:</span>
                        <span className="text-green-600" style={{ fontSize: '18px', fontWeight: 700 }}>
                          {formatCurrency(montoRecibido - selectedCotizacion.total)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Referencia */}
              {metodoPago && metodoPago !== 'efectivo' && (
                <div>
                  <label className="block mb-2" style={{ fontWeight: 600 }}>
                    Referencia
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                    placeholder="Últimos 4 dígitos, # de transferencia..."
                  />
                </div>
              )}

              {/* Agendar cita */}
              <div className="flex items-center justify-between">
                <div>
                  <div style={{ fontWeight: 600 }}>¿Agendar cita para los servicios?</div>
                  <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>
                    Programar tratamientos incluidos
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
                  Notas de la venta
                </label>
                <textarea
                  rows={2}
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] resize-none"
                  placeholder="Observaciones adicionales..."
                />
              </div>

              {/* Preview comisión */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="text-blue-600 flex-shrink-0 mt-0.5" size={16} />
                  <div className="flex-1">
                    <div className="text-blue-900" style={{ fontWeight: 600, fontSize: '14px' }}>
                      Comisión a generar
                    </div>
                    <div className="text-blue-800" style={{ fontSize: '13px' }}>
                      {formatCurrency(selectedCotizacion.total * 0.1)} para {selectedCotizacion.vendedora}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-[var(--color-border)] px-6 py-4 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowConvertirVentaModal(false);
                  setSelectedCotizacion(null);
                  setMetodoPago('');
                  setMontoRecibido(0);
                }}
                className="px-6 py-2.5 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors"
              >
                Cancelar
              </button>
              <button className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Confirmar Venta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
