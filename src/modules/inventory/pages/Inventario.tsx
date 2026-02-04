import React, { useState } from 'react';
import {
  Search,
  Plus,
  Package,
  AlertTriangle,
  Clock,
  Wallet,
  ArrowUp,
  ArrowDown,
  Edit,
  Eye,
  MoreVertical,
  X,
  Calendar,
  DollarSign,
  TrendingDown,
  Trash2,
  FileText
} from 'lucide-react';

type CategoriaProducto = 'insumo-medico' | 'facial' | 'corporal' | 'inyectable' | 'consumible' | 'equipamiento';
type EstadoStock = 'normal' | 'bajo' | 'agotado' | 'por-caducar';
type TipoMovimiento = 'entrada' | 'salida' | 'ajuste';

interface Producto {
  id: string;
  nombre: string;
  marca?: string;
  sku: string;
  categoria: CategoriaProducto;
  stockActual: number;
  stockMinimo: number;
  unidad: string;
  costoUnitario: number;
  precioVenta?: number;
  caducidad?: string;
  ubicacion?: string;
  imagen?: string;
  estado: EstadoStock;
}

interface Movimiento {
  id: string;
  fecha: string;
  tipo: TipoMovimiento;
  productoId: string;
  cantidad: number;
  stockResultante: number;
  motivo: string;
  usuario: string;
  notas?: string;
}

const categoriasConfig = {
  'insumo-medico': { label: 'Insumo Médico', color: '#7DB07D', bgColor: '#7DB07D15' },
  'facial': { label: 'Producto Facial', color: '#D4A574', bgColor: '#D4A57415' },
  'corporal': { label: 'Producto Corporal', color: '#8B7355', bgColor: '#8B735515' },
  'inyectable': { label: 'Inyectable', color: '#E0A75E', bgColor: '#E0A75E15' },
  'consumible': { label: 'Consumible', color: '#6B6560', bgColor: '#6B656015' },
  'equipamiento': { label: 'Equipamiento', color: '#9D6FD8', bgColor: '#9D6FD815' }
};

const estadosConfig = {
  'normal': { label: 'Normal', color: '#7DB07D', bgColor: '#7DB07D15' },
  'bajo': { label: 'Stock Bajo', color: '#E0A75E', bgColor: '#E0A75E15' },
  'agotado': { label: 'Agotado', color: '#C67B7B', bgColor: '#C67B7B15' },
  'por-caducar': { label: 'Por Caducar', color: '#C67B7B', bgColor: '#C67B7B15' }
};

const productosMock: Producto[] = [
  {
    id: '1',
    nombre: 'Ácido Hialurónico',
    marca: 'Juvederm',
    sku: 'INS-001',
    categoria: 'inyectable',
    stockActual: 25,
    stockMinimo: 10,
    unidad: 'ml',
    costoUnitario: 150,
    precioVenta: 250,
    caducidad: '2026-01-15',
    estado: 'normal'
  },
  {
    id: '2',
    nombre: 'Mascarilla Hidratante',
    marca: 'Neutrogena',
    sku: 'FAC-002',
    categoria: 'facial',
    stockActual: 3,
    stockMinimo: 5,
    unidad: 'sobres',
    costoUnitario: 80,
    caducidad: '2025-12-20',
    estado: 'bajo'
  },
  {
    id: '3',
    nombre: 'Gel Reductivo',
    marca: 'L\'Oréal',
    sku: 'COR-003',
    categoria: 'corporal',
    stockActual: 15,
    stockMinimo: 8,
    unidad: 'frascos',
    costoUnitario: 120,
    precioVenta: 280,
    estado: 'normal'
  },
  {
    id: '4',
    nombre: 'Suero Vitamina C',
    marca: 'SkinCeuticals',
    sku: 'FAC-004',
    categoria: 'facial',
    stockActual: 8,
    stockMinimo: 5,
    unidad: 'ampolletas',
    costoUnitario: 95,
    caducidad: '2025-12-10',
    estado: 'por-caducar'
  },
  {
    id: '5',
    nombre: 'Algodón',
    marca: 'Sanitas',
    sku: 'CON-005',
    categoria: 'consumible',
    stockActual: 200,
    stockMinimo: 50,
    unidad: 'pzas',
    costoUnitario: 2,
    estado: 'normal'
  },
  {
    id: '6',
    nombre: 'Plasma Rico en Plaquetas Kit',
    marca: 'BTI',
    sku: 'INS-006',
    categoria: 'insumo-medico',
    stockActual: 12,
    stockMinimo: 8,
    unidad: 'kits',
    costoUnitario: 450,
    caducidad: '2026-03-20',
    estado: 'normal'
  },
  {
    id: '7',
    nombre: 'Protector Solar SPF 50',
    marca: 'La Roche-Posay',
    sku: 'FAC-007',
    categoria: 'facial',
    stockActual: 0,
    stockMinimo: 10,
    unidad: 'frascos',
    costoUnitario: 45,
    precioVenta: 120,
    estado: 'agotado'
  },
  {
    id: '8',
    nombre: 'Colágeno Inyectable',
    marca: 'Restylane',
    sku: 'INY-008',
    categoria: 'inyectable',
    stockActual: 18,
    stockMinimo: 10,
    unidad: 'ml',
    costoUnitario: 320,
    caducidad: '2026-02-15',
    estado: 'normal'
  },
  {
    id: '9',
    nombre: 'Vendas Frías',
    marca: 'Generic',
    sku: 'COR-009',
    categoria: 'corporal',
    stockActual: 4,
    stockMinimo: 6,
    unidad: 'rollos',
    costoUnitario: 80,
    estado: 'bajo'
  },
  {
    id: '10',
    nombre: 'Anestésico Tópico',
    marca: 'Emla',
    sku: 'INS-010',
    categoria: 'insumo-medico',
    stockActual: 2,
    stockMinimo: 5,
    unidad: 'tubos',
    costoUnitario: 80,
    caducidad: '2025-12-05',
    estado: 'por-caducar'
  }
];

export function Inventario() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState<string>('todas');
  const [selectedEstado, setSelectedEstado] = useState<string>('todos');
  const [sortBy, setSortBy] = useState('nombre-az');
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [showMovimientoModal, setShowMovimientoModal] = useState(false);
  const [tipoMovimiento, setTipoMovimiento] = useState<TipoMovimiento>('entrada');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState('todos');

  // Calcular estadísticas
  const stockBajo = productosMock.filter(p => p.estado === 'bajo').length;
  const sinStock = productosMock.filter(p => p.estado === 'agotado').length;
  const porCaducar = productosMock.filter(p => p.estado === 'por-caducar').length;
  const valorTotal = productosMock.reduce((total, p) => total + (p.stockActual * p.costoUnitario), 0);

  // Filtrar productos
  const filteredProductos = productosMock.filter(producto => {
    const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         producto.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (producto.marca && producto.marca.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategoria = selectedCategoria === 'todas' || producto.categoria === selectedCategoria;
    const matchesEstado = selectedEstado === 'todos' || producto.estado === selectedEstado;
    const matchesTab = selectedTab === 'todos' || producto.estado === selectedTab;
    return matchesSearch && matchesCategoria && matchesEstado && matchesTab;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getDaysUntilExpiry = (dateString?: string) => {
    if (!dateString) return null;
    const today = new Date();
    const expiry = new Date(dateString);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getRowBackgroundClass = (producto: Producto) => {
    if (producto.estado === 'agotado') return 'bg-red-50';
    if (producto.estado === 'bajo') return 'bg-amber-50';
    return '';
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-['Cormorant_Garamond'] text-[var(--color-text)] mb-2">Inventario</h1>
            <p className="text-[var(--color-text-secondary)]">
              {productosMock.length} productos registrados
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowMovimientoModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors"
            >
              <FileText size={20} />
              <span>Registrar Movimiento</span>
            </button>
            <button
              onClick={() => setShowNewProductModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[#7A6349] transition-colors"
            >
              <Plus size={20} />
              <span>Nuevo Producto</span>
            </button>
          </div>
        </div>

        {/* Cards de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-[#8B735515] flex items-center justify-center">
                <Package className="text-[var(--color-primary)]" size={24} />
              </div>
            </div>
            <div className="text-[var(--color-text)]" style={{ fontSize: '28px', fontWeight: 700 }}>
              {productosMock.length}
            </div>
            <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>
              Productos registrados
            </div>
          </div>

          <div 
            className="bg-white rounded-xl border border-amber-200 p-5 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedTab('bajo')}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="text-amber-600" size={24} />
              </div>
            </div>
            <div className="text-amber-600" style={{ fontSize: '28px', fontWeight: 700 }}>
              {stockBajo}
            </div>
            <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>
              Requieren reposición
            </div>
          </div>

          <div 
            className="bg-white rounded-xl border border-red-200 p-5 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedTab('por-caducar')}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                <Clock className="text-red-600" size={24} />
              </div>
            </div>
            <div className="text-red-600" style={{ fontSize: '28px', fontWeight: 700 }}>
              {porCaducar}
            </div>
            <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>
              Caducan en 30 días
            </div>
          </div>

          <div className="bg-white rounded-xl border border-green-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Wallet className="text-green-600" size={24} />
              </div>
            </div>
            <div className="text-green-600" style={{ fontSize: '28px', fontWeight: 700 }}>
              {formatCurrency(valorTotal)}
            </div>
            <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>
              Valor total en stock
            </div>
          </div>
        </div>
      </div>

      {/* Tabs de estado */}
      <div className="mb-6 border-b border-[var(--color-border)] overflow-x-auto">
        <div className="flex gap-6 min-w-max">
          <button
            onClick={() => setSelectedTab('todos')}
            className={`pb-3 transition-colors whitespace-nowrap ${
              selectedTab === 'todos'
                ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
            }`}
            style={{ fontWeight: selectedTab === 'todos' ? 600 : 400 }}
          >
            Todos ({productosMock.length})
          </button>
          <button
            onClick={() => setSelectedTab('normal')}
            className={`pb-3 transition-colors whitespace-nowrap ${
              selectedTab === 'normal'
                ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
            }`}
            style={{ fontWeight: selectedTab === 'normal' ? 600 : 400 }}
          >
            Stock Normal ({productosMock.filter(p => p.estado === 'normal').length})
          </button>
          <button
            onClick={() => setSelectedTab('bajo')}
            className={`pb-3 transition-colors whitespace-nowrap flex items-center gap-2 ${
              selectedTab === 'bajo'
                ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
            }`}
            style={{ fontWeight: selectedTab === 'bajo' ? 600 : 400 }}
          >
            Stock Bajo
            <span className="px-2 py-0.5 bg-amber-100 text-amber-600 rounded-full" style={{ fontSize: '12px', fontWeight: 600 }}>
              {stockBajo}
            </span>
          </button>
          <button
            onClick={() => setSelectedTab('agotado')}
            className={`pb-3 transition-colors whitespace-nowrap flex items-center gap-2 ${
              selectedTab === 'agotado'
                ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
            }`}
            style={{ fontWeight: selectedTab === 'agotado' ? 600 : 400 }}
          >
            Sin Stock
            <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-full" style={{ fontSize: '12px', fontWeight: 600 }}>
              {sinStock}
            </span>
          </button>
          <button
            onClick={() => setSelectedTab('por-caducar')}
            className={`pb-3 transition-colors whitespace-nowrap flex items-center gap-2 ${
              selectedTab === 'por-caducar'
                ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
            }`}
            style={{ fontWeight: selectedTab === 'por-caducar' ? 600 : 400 }}
          >
            Por Caducar
            <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-full" style={{ fontSize: '12px', fontWeight: 600 }}>
              {porCaducar}
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
              placeholder="Buscar producto, SKU o marca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] transition-colors"
            />
          </div>

          {/* Filtro por Categoría */}
          <select
            value={selectedCategoria}
            onChange={(e) => setSelectedCategoria(e.target.value)}
            className="px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] bg-white"
          >
            <option value="todas">Todas las categorías</option>
            <option value="insumo-medico">Insumos médicos</option>
            <option value="facial">Productos faciales</option>
            <option value="corporal">Productos corporales</option>
            <option value="inyectable">Inyectables</option>
            <option value="consumible">Consumibles</option>
            <option value="equipamiento">Equipamiento</option>
          </select>

          {/* Ordenar por */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] bg-white"
          >
            <option value="nombre-az">Nombre A-Z</option>
            <option value="nombre-za">Nombre Z-A</option>
            <option value="stock-menor">Stock menor</option>
            <option value="stock-mayor">Stock mayor</option>
            <option value="caducar">Próximo a caducar</option>
            <option value="precio-mayor">Precio mayor</option>
            <option value="precio-menor">Precio menor</option>
          </select>
        </div>
      </div>

      {/* Tabla de productos */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F5F2EF] border-b border-[var(--color-border)]">
                <th className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Producto
                </th>
                <th className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                  SKU
                </th>
                <th className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Categoría
                </th>
                <th className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Stock Actual
                </th>
                <th className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Mínimo
                </th>
                <th className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Costo Unit.
                </th>
                <th className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Valor Total
                </th>
                <th className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Caducidad
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
              {filteredProductos.map((producto) => {
                const categoria = categoriasConfig[producto.categoria];
                const estado = estadosConfig[producto.estado];
                const valorTotal = producto.stockActual * producto.costoUnitario;
                const daysUntilExpiry = getDaysUntilExpiry(producto.caducidad);

                return (
                  <tr
                    key={producto.id}
                    className={`border-b border-[var(--color-border)] hover:bg-[#FDFBF9] transition-colors ${getRowBackgroundClass(producto)} ${
                      producto.estado === 'por-caducar' ? 'border-l-4 border-l-red-500' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#F5F2EF] flex items-center justify-center flex-shrink-0">
                          <Package size={20} className="text-[var(--color-text-secondary)]" />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{producto.nombre}</div>
                          {producto.marca && (
                            <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '13px' }}>
                              {producto.marca}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-[var(--color-text-secondary)]" style={{ fontSize: '13px' }}>
                        {producto.sku}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-2 py-1 rounded-full"
                        style={{
                          fontSize: '12px',
                          fontWeight: 500,
                          backgroundColor: categoria.bgColor,
                          color: categoria.color
                        }}
                      >
                        {categoria.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: '18px', fontWeight: 600 }}>
                          {producto.stockActual}
                        </span>
                        <span className="text-[var(--color-text-secondary)]" style={{ fontSize: '13px' }}>
                          {producto.unidad}
                        </span>
                        {producto.stockActual < producto.stockMinimo && producto.stockActual > 0 && (
                          <AlertTriangle size={16} className="text-amber-500" />
                        )}
                        {producto.stockActual === 0 && (
                          <AlertTriangle size={16} className="text-red-500" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[var(--color-text-secondary)]">{producto.stockMinimo}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span style={{ fontWeight: 600 }}>{formatCurrency(producto.costoUnitario)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span style={{ fontWeight: 600 }}>{formatCurrency(valorTotal)}</span>
                    </td>
                    <td className="px-6 py-4">
                      {producto.caducidad ? (
                        <div>
                          <div className={`${
                            daysUntilExpiry && daysUntilExpiry < 30 ? 'text-red-600' : 
                            daysUntilExpiry && daysUntilExpiry < 60 ? 'text-amber-600' : 
                            'text-[var(--color-text)]'
                          }`}>
                            {formatDate(producto.caducidad)}
                          </div>
                          {daysUntilExpiry && daysUntilExpiry < 30 && (
                            <div className="text-red-600 flex items-center gap-1 mt-1" style={{ fontSize: '12px' }}>
                              <Clock size={12} />
                              <span>{daysUntilExpiry} días</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-[var(--color-text-secondary)]">—</span>
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
                        <div className="relative">
                          <button
                            onClick={() => setActiveMenu(activeMenu === producto.id ? null : producto.id)}
                            className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[#8B7355]/10 rounded-lg transition-colors"
                          >
                            <MoreVertical size={16} />
                          </button>
                          {activeMenu === producto.id && (
                            <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-[var(--color-border)] py-1 z-10">
                              <button className="w-full px-4 py-2 text-left hover:bg-[#F5F2EF] flex items-center gap-2">
                                <Edit size={14} />
                                <span>Editar</span>
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

      {/* Modal: Nuevo Producto */}
      {showNewProductModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between z-10">
              <h2 className="font-['Cormorant_Garamond']">Nuevo Producto</h2>
              <button
                onClick={() => setShowNewProductModal(false)}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Sección 1: Información Básica */}
              <div>
                <h3 className="mb-4" style={{ fontWeight: 600 }}>Información Básica</h3>
                <div className="space-y-4">
                  <div className="flex justify-center mb-4">
                    <div className="w-24 h-24 rounded-lg bg-[#F5F2EF] flex items-center justify-center border-2 border-dashed border-[var(--color-border)] cursor-pointer hover:border-[var(--color-primary)] transition-colors">
                      <Plus className="text-[var(--color-text-secondary)]" size={32} />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2" style={{ fontWeight: 600 }}>
                      Nombre del producto *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                      placeholder="Ej: Ácido Hialurónico 1ml"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2" style={{ fontWeight: 600 }}>
                        Marca
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                        placeholder="Ej: Juvederm"
                      />
                    </div>
                    <div>
                      <label className="block mb-2" style={{ fontWeight: 600 }}>
                        SKU / Código
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                        placeholder="INS-001"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2" style={{ fontWeight: 600 }}>
                      Categoría *
                    </label>
                    <select className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]">
                      <option value="">Seleccionar categoría...</option>
                      <option value="insumo-medico">Insumo médico</option>
                      <option value="facial">Producto facial</option>
                      <option value="corporal">Producto corporal</option>
                      <option value="inyectable">Inyectable</option>
                      <option value="consumible">Consumible</option>
                      <option value="equipamiento">Equipamiento</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2" style={{ fontWeight: 600 }}>
                      Descripción
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] resize-none"
                      placeholder="Descripción del producto, especificaciones..."
                    />
                  </div>
                </div>
              </div>

              {/* Sección 2: Stock y Costos */}
              <div className="border-t border-[var(--color-border)] pt-6">
                <h3 className="mb-4" style={{ fontWeight: 600 }}>Stock y Costos</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2" style={{ fontWeight: 600 }}>
                      Stock inicial *
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block mb-2" style={{ fontWeight: 600 }}>
                      Unidad de medida *
                    </label>
                    <select className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]">
                      <option value="">Seleccionar...</option>
                      <option value="pzas">Piezas</option>
                      <option value="ml">Mililitros (ml)</option>
                      <option value="g">Gramos (g)</option>
                      <option value="cajas">Cajas</option>
                      <option value="sobres">Sobres</option>
                      <option value="ampolletas">Ampolletas</option>
                      <option value="frascos">Frascos</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2" style={{ fontWeight: 600 }}>
                      Stock mínimo (alerta) *
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                      placeholder="5"
                    />
                    <p className="text-[var(--color-text-secondary)] mt-1" style={{ fontSize: '13px' }}>
                      Te alertaremos cuando llegue a este número
                    </p>
                  </div>
                  <div>
                    <label className="block mb-2" style={{ fontWeight: 600 }}>
                      Costo unitario *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]">$</span>
                      <input
                        type="number"
                        className="w-full pl-8 pr-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block mb-2" style={{ fontWeight: 600 }}>
                      Precio de venta (si aplica)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]">$</span>
                      <input
                        type="number"
                        className="w-full pl-8 pr-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección 3: Caducidad */}
              <div className="border-t border-[var(--color-border)] pt-6">
                <h3 className="mb-4" style={{ fontWeight: 600 }}>Caducidad</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div style={{ fontWeight: 600 }}>¿Tiene fecha de caducidad?</div>
                      <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>
                        Para productos con vencimiento
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-success)]"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2" style={{ fontWeight: 600 }}>
                        Fecha de caducidad
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                      />
                    </div>
                    <div>
                      <label className="block mb-2" style={{ fontWeight: 600 }}>
                        Alertar X días antes
                      </label>
                      <input
                        type="number"
                        defaultValue={30}
                        className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección 4: Ubicación */}
              <div className="border-t border-[var(--color-border)] pt-6">
                <h3 className="mb-4" style={{ fontWeight: 600 }}>Ubicación (Opcional)</h3>
                <div>
                  <label className="block mb-2" style={{ fontWeight: 600 }}>
                    Ubicación en almacén
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                    placeholder="Ej: Estante A, Nivel 2"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-[var(--color-border)] px-6 py-4 flex gap-3 justify-end">
              <button
                onClick={() => setShowNewProductModal(false)}
                className="px-6 py-2.5 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors"
              >
                Cancelar
              </button>
              <button className="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[#7A6349] transition-colors">
                Guardar Producto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Registrar Movimiento */}
      {showMovimientoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between z-10">
              <h2 className="font-['Cormorant_Garamond']">Registrar Movimiento</h2>
              <button
                onClick={() => setShowMovimientoModal(false)}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Tipo de Movimiento */}
              <div>
                <label className="block mb-3" style={{ fontWeight: 600 }}>
                  Tipo de Movimiento *
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setTipoMovimiento('entrada')}
                    className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                      tipoMovimiento === 'entrada'
                        ? 'border-green-500 bg-green-50'
                        : 'border-[var(--color-border)] hover:border-green-300'
                    }`}
                  >
                    <ArrowUp className={`mx-auto mb-2 ${tipoMovimiento === 'entrada' ? 'text-green-600' : 'text-[var(--color-text-secondary)]'}`} size={24} />
                    <div style={{ fontWeight: 600 }} className={tipoMovimiento === 'entrada' ? 'text-green-600' : ''}>
                      Entrada
                    </div>
                  </button>
                  <button
                    onClick={() => setTipoMovimiento('salida')}
                    className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                      tipoMovimiento === 'salida'
                        ? 'border-red-500 bg-red-50'
                        : 'border-[var(--color-border)] hover:border-red-300'
                    }`}
                  >
                    <ArrowDown className={`mx-auto mb-2 ${tipoMovimiento === 'salida' ? 'text-red-600' : 'text-[var(--color-text-secondary)]'}`} size={24} />
                    <div style={{ fontWeight: 600 }} className={tipoMovimiento === 'salida' ? 'text-red-600' : ''}>
                      Salida
                    </div>
                  </button>
                  <button
                    onClick={() => setTipoMovimiento('ajuste')}
                    className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                      tipoMovimiento === 'ajuste'
                        ? 'border-gray-500 bg-gray-50'
                        : 'border-[var(--color-border)] hover:border-gray-300'
                    }`}
                  >
                    <Edit className={`mx-auto mb-2 ${tipoMovimiento === 'ajuste' ? 'text-gray-600' : 'text-[var(--color-text-secondary)]'}`} size={24} />
                    <div style={{ fontWeight: 600 }} className={tipoMovimiento === 'ajuste' ? 'text-gray-600' : ''}>
                      Ajuste
                    </div>
                  </button>
                </div>
              </div>

              {/* Producto */}
              <div>
                <label className="block mb-2" style={{ fontWeight: 600 }}>
                  Producto *
                </label>
                <select className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]">
                  <option value="">Seleccionar producto...</option>
                  <option value="1">Ácido Hialurónico (INS-001) - Stock: 25 ml</option>
                  <option value="2">Mascarilla Hidratante (FAC-002) - Stock: 3 sobres</option>
                  <option value="3">Gel Reductivo (COR-003) - Stock: 15 frascos</option>
                </select>
              </div>

              {/* Cantidad */}
              <div>
                <label className="block mb-2" style={{ fontWeight: 600 }}>
                  Cantidad *
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    className="flex-1 px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                    placeholder="0"
                  />
                  <div className="px-4 py-2.5 bg-[#F5F2EF] rounded-lg flex items-center text-[var(--color-text-secondary)]">
                    ml
                  </div>
                </div>
                <div className="mt-2 p-3 bg-[#F5F2EF] rounded-lg">
                  <div className="flex items-center justify-between text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>
                    <span>Stock actual: 25</span>
                    <span>→</span>
                    <span style={{ fontWeight: 600 }} className="text-[var(--color-text)]">Nuevo stock: 25</span>
                  </div>
                </div>
              </div>

              {/* Fecha */}
              <div>
                <label className="block mb-2" style={{ fontWeight: 600 }}>
                  Fecha del movimiento
                </label>
                <input
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              {/* Motivo */}
              <div>
                <label className="block mb-2" style={{ fontWeight: 600 }}>
                  Motivo *
                </label>
                <select className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]">
                  {tipoMovimiento === 'entrada' ? (
                    <>
                      <option value="">Seleccionar motivo...</option>
                      <option value="compra">Compra a proveedor</option>
                      <option value="devolucion">Devolución de servicio</option>
                      <option value="ajuste">Ajuste de inventario</option>
                      <option value="otro">Otro</option>
                    </>
                  ) : (
                    <>
                      <option value="">Seleccionar motivo...</option>
                      <option value="servicio">Uso en servicio</option>
                      <option value="danado">Producto dañado/caducado</option>
                      <option value="venta">Venta directa</option>
                      <option value="ajuste">Ajuste de inventario</option>
                      <option value="otro">Otro</option>
                    </>
                  )}
                </select>
              </div>

              {/* Notas */}
              <div>
                <label className="block mb-2" style={{ fontWeight: 600 }}>
                  Notas
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] resize-none"
                  placeholder="Detalles adicionales, número de factura..."
                />
              </div>

              {tipoMovimiento === 'entrada' && (
                <div>
                  <label className="block mb-2" style={{ fontWeight: 600 }}>
                    Costo (para actualizar promedio)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]">$</span>
                    <input
                      type="number"
                      className="w-full pl-8 pr-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-[var(--color-border)] px-6 py-4 flex gap-3 justify-end">
              <button
                onClick={() => setShowMovimientoModal(false)}
                className="px-6 py-2.5 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors"
              >
                Cancelar
              </button>
              <button className="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[#7A6349] transition-colors">
                Registrar Movimiento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
