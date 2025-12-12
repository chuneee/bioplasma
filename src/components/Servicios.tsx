import React, { useState } from 'react';
import {
  Search,
  Plus,
  Clock,
  DollarSign,
  Grid3x3,
  List,
  MoreVertical,
  Edit2,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  X,
  Package,
  Star,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

type CategoriaServicio = 'facial' | 'corporal' | 'inyectable' | 'laser' | 'paquete';

interface Servicio {
  id: string;
  nombre: string;
  categoria: CategoriaServicio;
  descripcion: string;
  descripcionCorta: string;
  duracion: number; // minutos
  precio: number;
  precioPromo?: number;
  insumos: { nombre: string; cantidad: string; costo: number }[];
  estado: 'activo' | 'inactivo';
  notasInternas?: string;
  vecesRealizado?: number;
  esPaquete?: boolean;
  serviciosIncluidos?: string[];
  ahorro?: number;
  vigencia?: string;
}

const categoriasConfig = {
  facial: { label: 'Facial', color: '#7DB07D', bgColor: '#7DB07D15' },
  corporal: { label: 'Corporal', color: '#8B7355', bgColor: '#8B735515' },
  inyectable: { label: 'Inyectable', color: '#D4A574', bgColor: '#D4A57415' },
  laser: { label: 'Láser', color: '#E0A75E', bgColor: '#E0A75E15' },
  paquete: { label: 'Paquete', color: '#9D6FD8', bgColor: '#9D6FD815' }
};

const serviciosMock: Servicio[] = [
  {
    id: '1',
    nombre: 'Limpieza Facial Profunda',
    categoria: 'facial',
    descripcion: 'Limpieza facial completa que incluye extracción de comedones, exfoliación y mascarilla hidratante. Ideal para piel grasa o con impurezas.',
    descripcionCorta: 'Limpieza completa con extracción y mascarilla',
    duracion: 45,
    precio: 850,
    insumos: [
      { nombre: 'Ácido glicólico', cantidad: '10 ml', costo: 50 },
      { nombre: 'Mascarilla hidratante', cantidad: '1 sobre', costo: 80 },
      { nombre: 'Algodón', cantidad: '5 piezas', costo: 10 }
    ],
    estado: 'activo',
    vecesRealizado: 156
  },
  {
    id: '2',
    nombre: 'Rejuvenecimiento con Plasma',
    categoria: 'inyectable',
    descripcion: 'Tratamiento con Plasma Rico en Plaquetas para estimular la regeneración celular y mejorar la textura de la piel.',
    descripcionCorta: 'PRP para regeneración celular',
    duracion: 60,
    precio: 2500,
    insumos: [
      { nombre: 'Kit PRP', cantidad: '1 kit', costo: 450 },
      { nombre: 'Anestésico tópico', cantidad: '5 ml', costo: 80 }
    ],
    estado: 'activo',
    vecesRealizado: 89
  },
  {
    id: '3',
    nombre: 'Hidratación Facial Intensiva',
    categoria: 'facial',
    descripcion: 'Tratamiento de hidratación profunda con ácido hialurónico para piel deshidratada o con signos de envejecimiento.',
    descripcionCorta: 'Hidratación profunda con ácido hialurónico',
    duracion: 45,
    precio: 900,
    precioPromo: 750,
    insumos: [
      { nombre: 'Ácido hialurónico', cantidad: '15 ml', costo: 180 },
      { nombre: 'Mascarilla nutritiva', cantidad: '1 sobre', costo: 90 }
    ],
    estado: 'activo',
    vecesRealizado: 124
  },
  {
    id: '4',
    nombre: 'Microdermoabrasión',
    categoria: 'facial',
    descripcion: 'Exfoliación mecánica profunda que remueve células muertas y estimula la renovación celular.',
    descripcionCorta: 'Exfoliación profunda para renovación celular',
    duracion: 45,
    precio: 800,
    insumos: [
      { nombre: 'Puntas de diamante', cantidad: '1 uso', costo: 120 }
    ],
    estado: 'activo',
    vecesRealizado: 98
  },
  {
    id: '5',
    nombre: 'Peeling Químico Superficial',
    categoria: 'facial',
    descripcion: 'Peeling con ácido glicólico al 30% para mejorar textura, manchas y luminosidad de la piel.',
    descripcionCorta: 'Peeling con ácido glicólico 30%',
    duracion: 60,
    precio: 1500,
    insumos: [
      { nombre: 'Ácido glicólico 30%', cantidad: '10 ml', costo: 150 },
      { nombre: 'Neutralizante', cantidad: '10 ml', costo: 50 },
      { nombre: 'Protector solar SPF 50', cantidad: '1 sobre', costo: 45 }
    ],
    estado: 'activo',
    vecesRealizado: 67
  },
  {
    id: '6',
    nombre: 'Masaje Reductivo Corporal',
    categoria: 'corporal',
    descripcion: 'Masaje especializado para reducir medidas y mejorar la apariencia de celulitis.',
    descripcionCorta: 'Masaje para reducción de medidas',
    duracion: 90,
    precio: 1200,
    insumos: [
      { nombre: 'Gel reductivo', cantidad: '50 ml', costo: 120 },
      { nombre: 'Vendas frías', cantidad: '2 rollos', costo: 80 }
    ],
    estado: 'activo',
    vecesRealizado: 45
  },
  {
    id: '7',
    nombre: 'Depilación Láser Axilas',
    categoria: 'laser',
    descripcion: 'Depilación permanente con láser de diodo en zona de axilas.',
    descripcionCorta: 'Depilación permanente axilas',
    duracion: 15,
    precio: 450,
    insumos: [],
    estado: 'activo',
    vecesRealizado: 203
  },
  {
    id: '8',
    nombre: 'Tratamiento Anti-edad Completo',
    categoria: 'facial',
    descripcion: 'Tratamiento premium que combina tecnologías avanzadas para resultados visibles anti-envejecimiento.',
    descripcionCorta: 'Tratamiento premium anti-edad',
    duracion: 90,
    precio: 3200,
    insumos: [
      { nombre: 'Suero anti-edad', cantidad: '1 ampolleta', costo: 280 },
      { nombre: 'Colágeno inyectable', cantidad: '2 ml', costo: 450 }
    ],
    estado: 'activo',
    vecesRealizado: 34
  },
  {
    id: '9',
    nombre: 'Paquete Novia Radiante',
    categoria: 'paquete',
    descripcion: 'Paquete completo de preparación para novias. Incluye 4 sesiones de tratamientos faciales.',
    descripcionCorta: 'Paquete premium para novias',
    duracion: 240,
    precio: 2800,
    esPaquete: true,
    serviciosIncluidos: [
      'Limpieza Facial Profunda',
      'Hidratación Intensiva',
      'Peeling Químico',
      'Tratamiento Iluminador'
    ],
    ahorro: 600,
    insumos: [],
    estado: 'activo',
    vecesRealizado: 12,
    vigencia: '31 Dic 2025'
  },
  {
    id: '10',
    nombre: 'Radiofrecuencia Facial',
    categoria: 'laser',
    descripcion: 'Tratamiento con radiofrecuencia para tensar la piel y estimular producción de colágeno.',
    descripcionCorta: 'Tensado facial con radiofrecuencia',
    duracion: 45,
    precio: 1800,
    insumos: [],
    estado: 'inactivo',
    vecesRealizado: 56
  }
];

export function Servicios() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState<string>('todos');
  const [filterEstado, setFilterEstado] = useState('activos');
  const [sortBy, setSortBy] = useState('nombre-az');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [showNewServiceModal, setShowNewServiceModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Contar servicios por categoría
  const countByCategoria = (cat: string) => {
    if (cat === 'todos') return serviciosMock.length;
    return serviciosMock.filter(s => s.categoria === cat).length;
  };

  // Filtrar servicios
  const filteredServicios = serviciosMock.filter(servicio => {
    const matchesSearch = servicio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         servicio.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = selectedCategoria === 'todos' || servicio.categoria === selectedCategoria;
    const matchesEstado = filterEstado === 'todos' || 
                         (filterEstado === 'activos' && servicio.estado === 'activo') ||
                         (filterEstado === 'inactivos' && servicio.estado === 'inactivo');
    return matchesSearch && matchesCategoria && matchesEstado;
  });

  const serviciosActivos = serviciosMock.filter(s => s.estado === 'activo').length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const calcularCostoInsumos = (insumos: { nombre: string; cantidad: string; costo: number }[]) => {
    return insumos.reduce((total, insumo) => total + insumo.costo, 0);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="font-['Cormorant_Garamond'] text-[var(--color-text)] mb-2">Servicios</h1>
            <p className="text-[var(--color-text-secondary)]">
              {serviciosActivos} servicios activos
            </p>
          </div>
          <button
            onClick={() => setShowNewServiceModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[#7A6349] transition-colors"
          >
            <Plus size={20} />
            <span>Nuevo Servicio</span>
          </button>
        </div>
      </div>

      {/* Tabs de categorías */}
      <div className="mb-6 border-b border-[var(--color-border)] overflow-x-auto">
        <div className="flex gap-6 min-w-max">
          <button
            onClick={() => setSelectedCategoria('todos')}
            className={`pb-3 transition-colors whitespace-nowrap ${
              selectedCategoria === 'todos'
                ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
            }`}
            style={{ fontWeight: selectedCategoria === 'todos' ? 600 : 400 }}
          >
            Todos ({countByCategoria('todos')})
          </button>
          <button
            onClick={() => setSelectedCategoria('facial')}
            className={`pb-3 transition-colors whitespace-nowrap ${
              selectedCategoria === 'facial'
                ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
            }`}
            style={{ fontWeight: selectedCategoria === 'facial' ? 600 : 400 }}
          >
            Faciales ({countByCategoria('facial')})
          </button>
          <button
            onClick={() => setSelectedCategoria('corporal')}
            className={`pb-3 transition-colors whitespace-nowrap ${
              selectedCategoria === 'corporal'
                ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
            }`}
            style={{ fontWeight: selectedCategoria === 'corporal' ? 600 : 400 }}
          >
            Corporales ({countByCategoria('corporal')})
          </button>
          <button
            onClick={() => setSelectedCategoria('inyectable')}
            className={`pb-3 transition-colors whitespace-nowrap ${
              selectedCategoria === 'inyectable'
                ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
            }`}
            style={{ fontWeight: selectedCategoria === 'inyectable' ? 600 : 400 }}
          >
            Inyectables ({countByCategoria('inyectable')})
          </button>
          <button
            onClick={() => setSelectedCategoria('laser')}
            className={`pb-3 transition-colors whitespace-nowrap ${
              selectedCategoria === 'laser'
                ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
            }`}
            style={{ fontWeight: selectedCategoria === 'laser' ? 600 : 400 }}
          >
            Láser ({countByCategoria('laser')})
          </button>
          <button
            onClick={() => setSelectedCategoria('paquete')}
            className={`pb-3 transition-colors whitespace-nowrap ${
              selectedCategoria === 'paquete'
                ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
            }`}
            style={{ fontWeight: selectedCategoria === 'paquete' ? 600 : 400 }}
          >
            Paquetes ({countByCategoria('paquete')})
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
              placeholder="Buscar servicio..."
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
            <option value="todos">Todos</option>
            <option value="activos">Activos</option>
            <option value="inactivos">Inactivos</option>
          </select>

          {/* Ordenar por */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] bg-white"
          >
            <option value="nombre-az">Nombre A-Z</option>
            <option value="nombre-za">Nombre Z-A</option>
            <option value="precio-mayor">Precio mayor</option>
            <option value="precio-menor">Precio menor</option>
            <option value="populares">Más populares</option>
          </select>

          {/* Vista toggle */}
          <div className="flex gap-2 border border-[var(--color-border)] rounded-lg p-1">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'cards'
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
              }`}
            >
              <Grid3x3 size={18} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'table'
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
              }`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Vista de Tarjetas */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServicios.map((servicio) => {
            const categoria = categoriasConfig[servicio.categoria];
            const costoInsumos = calcularCostoInsumos(servicio.insumos);
            const margen = servicio.precio - costoInsumos;

            return (
              <div
                key={servicio.id}
                className={`bg-white rounded-xl border transition-all hover:shadow-lg ${
                  servicio.esPaquete
                    ? 'border-[#9D6FD8] border-2'
                    : 'border-[var(--color-border)]'
                }`}
              >
                {/* Header de la tarjeta */}
                <div className="p-5 border-b border-[var(--color-border)]">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {servicio.esPaquete && (
                        <Package size={18} className="text-[#9D6FD8]" />
                      )}
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
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        servicio.estado === 'activo' ? 'bg-[var(--color-success)]' : 'bg-[var(--color-text-secondary)]'
                      }`}></div>
                      <div className="relative">
                        <button
                          onClick={() => setActiveMenu(activeMenu === servicio.id ? null : servicio.id)}
                          className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
                        >
                          <MoreVertical size={18} />
                        </button>
                        {activeMenu === servicio.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-[var(--color-border)] py-1 z-10">
                            <button className="w-full px-4 py-2 text-left hover:bg-[#F5F2EF] flex items-center gap-2">
                              <Edit2 size={16} />
                              <span>Editar</span>
                            </button>
                            <button className="w-full px-4 py-2 text-left hover:bg-[#F5F2EF] flex items-center gap-2">
                              <Copy size={16} />
                              <span>Duplicar</span>
                            </button>
                            <button className="w-full px-4 py-2 text-left hover:bg-[#F5F2EF] flex items-center gap-2">
                              {servicio.estado === 'activo' ? <EyeOff size={16} /> : <Eye size={16} />}
                              <span>{servicio.estado === 'activo' ? 'Desactivar' : 'Activar'}</span>
                            </button>
                            <button className="w-full px-4 py-2 text-left hover:bg-[#F5F2EF] flex items-center gap-2 text-[var(--color-error)]">
                              <Trash2 size={16} />
                              <span>Eliminar</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <h3 className="mb-2" style={{ fontWeight: 600 }}>{servicio.nombre}</h3>
                  <p className="text-[var(--color-text-secondary)] line-clamp-2" style={{ fontSize: '14px' }}>
                    {servicio.descripcionCorta}
                  </p>
                </div>

                {/* Cuerpo de la tarjeta */}
                <div className="p-5 space-y-3">
                  {/* Paquete - Servicios incluidos */}
                  {servicio.esPaquete && servicio.serviciosIncluidos && (
                    <div className="mb-3 p-3 bg-[#9D6FD815] rounded-lg">
                      <p className="mb-2" style={{ fontSize: '13px', fontWeight: 600 }}>Incluye:</p>
                      <ul className="space-y-1">
                        {servicio.serviciosIncluidos.map((s, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-[var(--color-text-secondary)]" style={{ fontSize: '13px' }}>
                            <span className="text-[#9D6FD8] mt-0.5">✓</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Información clave */}
                  <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                    <Clock size={16} />
                    <span style={{ fontSize: '14px' }}>{servicio.duracion} minutos</span>
                  </div>

                  {servicio.esPaquete && servicio.ahorro ? (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign size={16} className="text-[var(--color-text-secondary)]" />
                        <span className="text-[var(--color-text-secondary)] line-through" style={{ fontSize: '14px' }}>
                          {formatCurrency(servicio.precio + servicio.ahorro)}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-[var(--color-secondary)]" style={{ fontSize: '24px', fontWeight: 700 }}>
                          {formatCurrency(servicio.precio)}
                        </span>
                        <span className="text-green-600" style={{ fontSize: '13px', fontWeight: 600 }}>
                          Ahorra {formatCurrency(servicio.ahorro)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <DollarSign size={16} className="text-[var(--color-text-secondary)]" />
                      {servicio.precioPromo ? (
                        <>
                          <span className="text-[var(--color-text-secondary)] line-through" style={{ fontSize: '14px' }}>
                            {formatCurrency(servicio.precio)}
                          </span>
                          <span className="text-[var(--color-secondary)]" style={{ fontSize: '20px', fontWeight: 700 }}>
                            {formatCurrency(servicio.precioPromo)}
                          </span>
                        </>
                      ) : (
                        <span className="text-[var(--color-secondary)]" style={{ fontSize: '20px', fontWeight: 700 }}>
                          {formatCurrency(servicio.precio)}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Insumos */}
                  {servicio.insumos.length > 0 && !servicio.esPaquete && (
                    <div className="pt-3 border-t border-[var(--color-border)]">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-[#F5F2EF] rounded text-[var(--color-text-secondary)]" style={{ fontSize: '12px' }}>
                          {servicio.insumos.length} insumos
                        </span>
                        <span className="text-[var(--color-text-secondary)]" style={{ fontSize: '12px' }}>
                          Costo: {formatCurrency(costoInsumos)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Vigencia para paquetes */}
                  {servicio.esPaquete && servicio.vigencia && (
                    <div className="flex items-center gap-2 text-[var(--color-warning)]" style={{ fontSize: '13px' }}>
                      <AlertCircle size={14} />
                      <span>Válido hasta {servicio.vigencia}</span>
                    </div>
                  )}

                  {/* Estadística */}
                  {servicio.vecesRealizado && (
                    <div className="flex items-center gap-2 text-[var(--color-text-secondary)]" style={{ fontSize: '13px' }}>
                      <TrendingUp size={14} />
                      <span>Realizado {servicio.vecesRealizado} veces</span>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-[var(--color-border)]">
                  <button className="w-full py-2 border border-[var(--color-primary)] text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary)] hover:text-white transition-colors">
                    Ver detalles
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Vista de Tabla */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F5F2EF] border-b border-[var(--color-border)]">
                  <th className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                    Servicio
                  </th>
                  <th className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                    Categoría
                  </th>
                  <th className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                    Duración
                  </th>
                  <th className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                    Precio
                  </th>
                  <th className="text-center px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                    Insumos
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
                {filteredServicios.map((servicio) => {
                  const categoria = categoriasConfig[servicio.categoria];
                  return (
                    <tr
                      key={servicio.id}
                      className="border-b border-[var(--color-border)] hover:bg-[#FDFBF9] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div style={{ fontWeight: 600 }}>{servicio.nombre}</div>
                          <div className="text-[var(--color-text-secondary)] line-clamp-1" style={{ fontSize: '13px' }}>
                            {servicio.descripcionCorta}
                          </div>
                        </div>
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
                        <span>{servicio.duracion} min</span>
                      </td>
                      <td className="px-6 py-4">
                        {servicio.precioPromo ? (
                          <div>
                            <div className="text-[var(--color-text-secondary)] line-through" style={{ fontSize: '13px' }}>
                              {formatCurrency(servicio.precio)}
                            </div>
                            <div style={{ fontWeight: 600 }}>
                              {formatCurrency(servicio.precioPromo)}
                            </div>
                          </div>
                        ) : (
                          <span style={{ fontWeight: 600 }}>{formatCurrency(servicio.precio)}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {servicio.insumos.length > 0 ? (
                          <span>{servicio.insumos.length}</span>
                        ) : (
                          <span className="text-[var(--color-text-secondary)]">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-white ${
                            servicio.estado === 'activo' ? 'bg-[var(--color-success)]' : 'bg-[var(--color-text-secondary)]'
                          }`}
                          style={{ fontSize: '12px', fontWeight: 500 }}
                        >
                          {servicio.estado === 'activo' ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[#8B7355]/10 rounded-lg transition-colors">
                            <Edit2 size={16} />
                          </button>
                          <button className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[#8B7355]/10 rounded-lg transition-colors">
                            <Copy size={16} />
                          </button>
                          <button className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-error)] hover:bg-red-50 rounded-lg transition-colors">
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
        </div>
      )}

      {/* Modal: Nuevo Servicio */}
      {showNewServiceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between z-10">
              <h2 className="font-['Cormorant_Garamond']">Nuevo Servicio</h2>
              <button
                onClick={() => setShowNewServiceModal(false)}
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
                  <div>
                    <label className="block mb-2" style={{ fontWeight: 600 }}>
                      Nombre del servicio *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                      placeholder="Ej: Limpieza Facial Profunda"
                    />
                  </div>

                  <div>
                    <label className="block mb-2" style={{ fontWeight: 600 }}>
                      Categoría *
                    </label>
                    <select className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]">
                      <option value="">Seleccionar categoría...</option>
                      <option value="facial">Facial</option>
                      <option value="corporal">Corporal</option>
                      <option value="inyectable">Inyectable</option>
                      <option value="laser">Láser</option>
                      <option value="otro">Otro</option>
                    </select>
                    <button className="mt-2 text-[var(--color-primary)] hover:underline" style={{ fontSize: '14px' }}>
                      + Crear nueva categoría
                    </button>
                  </div>

                  <div>
                    <label className="block mb-2" style={{ fontWeight: 600 }}>
                      Descripción
                    </label>
                    <textarea
                      rows={4}
                      maxLength={500}
                      className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] resize-none"
                      placeholder="Describe el servicio, beneficios y qué incluye..."
                    />
                    <div className="text-right text-[var(--color-text-secondary)] mt-1" style={{ fontSize: '12px' }}>
                      0 / 500 caracteres
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2" style={{ fontWeight: 600 }}>
                      Descripción corta (para listados)
                    </label>
                    <input
                      type="text"
                      maxLength={100}
                      className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                      placeholder="Descripción breve"
                    />
                    <div className="text-right text-[var(--color-text-secondary)] mt-1" style={{ fontSize: '12px' }}>
                      0 / 100 caracteres
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección 2: Tiempo y Precio */}
              <div className="border-t border-[var(--color-border)] pt-6">
                <h3 className="mb-4" style={{ fontWeight: 600 }}>Tiempo y Precio</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2" style={{ fontWeight: 600 }}>
                      Duración estimada *
                    </label>
                    <select className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]">
                      <option value="15">15 minutos</option>
                      <option value="30">30 minutos</option>
                      <option value="45">45 minutos</option>
                      <option value="60">1 hora</option>
                      <option value="90">1.5 horas</option>
                      <option value="120">2 horas</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2" style={{ fontWeight: 600 }}>
                      Precio regular *
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
                      Precio promocional (opcional)
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

              {/* Sección 3: Insumos */}
              <div className="border-t border-[var(--color-border)] pt-6">
                <h3 className="mb-4" style={{ fontWeight: 600 }}>Insumos Asociados</h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <select className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]">
                        <option value="">Seleccionar producto...</option>
                        <option value="acido">Ácido glicólico</option>
                        <option value="mascarilla">Mascarilla hidratante</option>
                        <option value="algodon">Algodón</option>
                      </select>
                    </div>
                    <div className="w-32">
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                        placeholder="Cantidad"
                      />
                    </div>
                    <button className="px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[#7A6349] transition-colors">
                      Agregar
                    </button>
                  </div>

                  <div className="bg-[#F5F2EF] rounded-lg p-4">
                    <p className="text-[var(--color-text-secondary)] text-center" style={{ fontSize: '14px' }}>
                      No hay insumos agregados
                    </p>
                  </div>
                </div>
              </div>

              {/* Sección 4: Configuración */}
              <div className="border-t border-[var(--color-border)] pt-6">
                <h3 className="mb-4" style={{ fontWeight: 600 }}>Configuración</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div style={{ fontWeight: 600 }} className="mb-1">Estado</div>
                      <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>
                        ¿Este servicio está disponible?
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-success)]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div style={{ fontWeight: 600 }} className="mb-1">Disponible para agendar online</div>
                      <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>
                        Los pacientes pueden agendar este servicio
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-success)]"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block mb-2" style={{ fontWeight: 600 }}>
                      Notas internas
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] resize-none"
                      placeholder="Notas para el personal, preparación necesaria..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-[var(--color-border)] px-6 py-4 flex gap-3 justify-end">
              <button
                onClick={() => setShowNewServiceModal(false)}
                className="px-6 py-2.5 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors"
              >
                Cancelar
              </button>
              <button className="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[#7A6349] transition-colors">
                Guardar Servicio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
