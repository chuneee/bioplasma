import React, { useState } from 'react';
import {
  Search,
  Filter,
  Grid3x3,
  List,
  Plus,
  Eye,
  Calendar,
  MoreVertical,
  Phone,
  Mail,
  MessageCircle,
  Edit2,
  UserX,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface Paciente {
  id: string;
  nombre: string;
  edad: number;
  telefono: string;
  correo: string;
  ultimaVisita: string;
  tratamientos: number;
  estado: 'activo' | 'inactivo';
  avatar?: string;
  iniciales: string;
  colorAvatar: string;
}

interface PacientesProps {
  onNavigateToExpediente: (pacienteId: string) => void;
}

// Datos mock
const pacientesMock: Paciente[] = [
  {
    id: '1',
    nombre: 'María García López',
    edad: 32,
    telefono: '(662) 123-4567',
    correo: 'maria.garcia@email.com',
    ultimaVisita: '2025-11-20',
    tratamientos: 18,
    estado: 'activo',
    iniciales: 'MG',
    colorAvatar: '#E8DFF5'
  },
  {
    id: '2',
    nombre: 'Ana Sofía Martínez',
    edad: 28,
    telefono: '(662) 234-5678',
    correo: 'ana.martinez@email.com',
    ultimaVisita: '2025-11-15',
    tratamientos: 12,
    estado: 'activo',
    iniciales: 'AM',
    colorAvatar: '#FCE7F3'
  },
  {
    id: '3',
    nombre: 'Laura Fernández Cruz',
    edad: 45,
    telefono: '(662) 345-6789',
    correo: 'laura.fernandez@email.com',
    ultimaVisita: '2025-11-10',
    tratamientos: 24,
    estado: 'activo',
    iniciales: 'LF',
    colorAvatar: '#DBEAFE'
  },
  {
    id: '4',
    nombre: 'Carmen Rodríguez',
    edad: 38,
    telefono: '(662) 456-7890',
    correo: 'carmen.rodriguez@email.com',
    ultimaVisita: '2025-10-28',
    tratamientos: 15,
    estado: 'activo',
    iniciales: 'CR',
    colorAvatar: '#FEF3C7'
  },
  {
    id: '5',
    nombre: 'Patricia Sánchez',
    edad: 41,
    telefono: '(662) 567-8901',
    correo: 'patricia.sanchez@email.com',
    ultimaVisita: '2025-09-15',
    tratamientos: 9,
    estado: 'activo',
    iniciales: 'PS',
    colorAvatar: '#D1FAE5'
  },
  {
    id: '6',
    nombre: 'Rosa María Torres',
    edad: 50,
    telefono: '(662) 678-9012',
    correo: 'rosa.torres@email.com',
    ultimaVisita: '2025-05-20',
    tratamientos: 6,
    estado: 'inactivo',
    iniciales: 'RT',
    colorAvatar: '#FEE2E2'
  },
  {
    id: '7',
    nombre: 'Gabriela Morales',
    edad: 29,
    telefono: '(662) 789-0123',
    correo: 'gabriela.morales@email.com',
    ultimaVisita: '2025-11-18',
    tratamientos: 8,
    estado: 'activo',
    iniciales: 'GM',
    colorAvatar: '#E0E7FF'
  },
  {
    id: '8',
    nombre: 'Daniela Ruiz Vega',
    edad: 35,
    telefono: '(662) 890-1234',
    correo: 'daniela.ruiz@email.com',
    ultimaVisita: '2025-11-05',
    tratamientos: 20,
    estado: 'activo',
    iniciales: 'DR',
    colorAvatar: '#FECACA'
  }
];

export function Pacientes({ onNavigateToExpediente }: PacientesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [filterTratamiento, setFilterTratamiento] = useState('cualquier');
  const [sortBy, setSortBy] = useState('nombre-az');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Filtrar y ordenar pacientes
  const filteredPacientes = pacientesMock.filter(p => {
    const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.telefono.includes(searchTerm) ||
                         p.correo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = filterEstado === 'todos' || p.estado === filterEstado;
    return matchesSearch && matchesEstado;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const isOldVisit = (dateString: string) => {
    const visitDate = new Date(dateString);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return visitDate < threeMonthsAgo;
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="font-['Cormorant_Garamond'] text-[var(--color-text)] mb-2">Pacientes</h1>
            <p className="text-[var(--color-text-secondary)]">
              {filteredPacientes.length} pacientes registrados
            </p>
          </div>
          <button
            onClick={() => setShowNewPatientModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[#7A6349] transition-colors"
          >
            <Plus size={20} />
            <span>Nuevo Paciente</span>
          </button>
        </div>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Buscador */}
          <div className="relative flex-1 min-w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre, teléfono o correo..."
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
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
          </select>

          {/* Filtro por Último Tratamiento */}
          <select
            value={filterTratamiento}
            onChange={(e) => setFilterTratamiento(e.target.value)}
            className="px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] bg-white"
          >
            <option value="cualquier">Cualquier fecha</option>
            <option value="semana">Última semana</option>
            <option value="mes">Último mes</option>
            <option value="tres-meses">Últimos 3 meses</option>
            <option value="seis-meses">Más de 6 meses</option>
          </select>

          {/* Ordenar por */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] bg-white"
          >
            <option value="nombre-az">Nombre A-Z</option>
            <option value="nombre-za">Nombre Z-A</option>
            <option value="recientes">Más recientes</option>
            <option value="antiguos">Más antiguos</option>
            <option value="ultima-visita">Última visita</option>
          </select>

          {/* Vista toggle */}
          <div className="flex gap-2 border border-[var(--color-border)] rounded-lg p-1">
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
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid'
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
              }`}
            >
              <Grid3x3 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Vista de Tabla */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F5F2EF] border-b border-[var(--color-border)]">
                  <th className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                    Paciente
                  </th>
                  <th className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                    Teléfono
                  </th>
                  <th className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                    Correo
                  </th>
                  <th className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                    Última Visita
                  </th>
                  <th className="text-center px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide" style={{ fontSize: '12px', fontWeight: 600 }}>
                    Tratamientos
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
                {filteredPacientes.map((paciente) => (
                  <tr
                    key={paciente.id}
                    onClick={() => onNavigateToExpediente(paciente.id)}
                    className="border-b border-[var(--color-border)] hover:bg-[#FDFBF9] transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: paciente.colorAvatar, fontSize: '14px', fontWeight: 600, color: '#6B6560' }}
                        >
                          {paciente.iniciales}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{paciente.nombre}</div>
                          <div className="text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>
                            ({paciente.edad} años)
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span>{paciente.telefono}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`https://wa.me/${paciente.telefono.replace(/\D/g, '')}`, '_blank');
                          }}
                          className="text-green-600 hover:text-green-700 transition-colors"
                        >
                          <MessageCircle size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[var(--color-text-secondary)]">{paciente.correo}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={isOldVisit(paciente.ultimaVisita) ? 'text-[var(--color-warning)]' : ''}>
                        {formatDate(paciente.ultimaVisita)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#8B7355]/10 text-[var(--color-primary)]" style={{ fontWeight: 600 }}>
                        {paciente.tratamientos}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-white ${
                          paciente.estado === 'activo' ? 'bg-[var(--color-success)]' : 'bg-[var(--color-text-secondary)]'
                        }`}
                        style={{ fontSize: '12px', fontWeight: 500 }}
                      >
                        {paciente.estado === 'activo' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onNavigateToExpediente(paciente.id)}
                          className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[#8B7355]/10 rounded-lg transition-colors"
                          title="Ver expediente"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[#8B7355]/10 rounded-lg transition-colors"
                          title="Agendar cita"
                        >
                          <Calendar size={18} />
                        </button>
                        <div className="relative">
                          <button
                            onClick={() => setActiveMenu(activeMenu === paciente.id ? null : paciente.id)}
                            className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[#8B7355]/10 rounded-lg transition-colors"
                          >
                            <MoreVertical size={18} />
                          </button>
                          {activeMenu === paciente.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-[var(--color-border)] py-1 z-10">
                              <button className="w-full px-4 py-2 text-left hover:bg-[#F5F2EF] flex items-center gap-2">
                                <Edit2 size={16} />
                                <span>Editar</span>
                              </button>
                              <button className="w-full px-4 py-2 text-left hover:bg-[#F5F2EF] flex items-center gap-2">
                                <UserX size={16} />
                                <span>Desactivar</span>
                              </button>
                              <button className="w-full px-4 py-2 text-left hover:bg-[#F5F2EF] flex items-center gap-2 text-[var(--color-error)]">
                                <Trash2 size={16} />
                                <span>Eliminar</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--color-border)]">
            <div className="text-[var(--color-text-secondary)]">
              Mostrando 1-{Math.min(itemsPerPage, filteredPacientes.length)} de {filteredPacientes.length} pacientes
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[var(--color-text-secondary)]">Mostrar:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="px-3 py-1 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                >
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors">
                  <ChevronLeft size={18} />
                </button>
                <button className="px-3 py-1 bg-[var(--color-primary)] text-white rounded-lg">1</button>
                <button className="px-3 py-1 hover:bg-[#F5F2EF] rounded-lg transition-colors">2</button>
                <button className="px-3 py-1 hover:bg-[#F5F2EF] rounded-lg transition-colors">3</button>
                <span className="px-2">...</span>
                <button className="px-3 py-1 hover:bg-[#F5F2EF] rounded-lg transition-colors">7</button>
                <button className="p-2 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vista de Grid */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPacientes.map((paciente) => (
            <div
              key={paciente.id}
              onClick={() => onNavigateToExpediente(paciente.id)}
              className="bg-white rounded-xl border border-[var(--color-border)] p-6 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex flex-col items-center text-center mb-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
                  style={{ backgroundColor: paciente.colorAvatar, fontSize: '20px', fontWeight: 600, color: '#6B6560' }}
                >
                  {paciente.iniciales}
                </div>
                <h3 className="mb-1" style={{ fontWeight: 600 }}>{paciente.nombre}</h3>
                <p className="text-[var(--color-text-secondary)] mb-2" style={{ fontSize: '14px' }}>
                  {paciente.edad} años • {paciente.telefono}
                </p>
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-white ${
                    paciente.estado === 'activo' ? 'bg-[var(--color-success)]' : 'bg-[var(--color-text-secondary)]'
                  }`}
                  style={{ fontSize: '12px', fontWeight: 500 }}
                >
                  {paciente.estado === 'activo' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div className="text-center mb-4 text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>
                Última visita: {formatDate(paciente.ultimaVisita)}
              </div>
              <div className="border-t border-[var(--color-border)] pt-4 flex items-center justify-between">
                <span className="text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>
                  {paciente.tratamientos} tratamientos
                </span>
                <button className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[#7A6349] transition-colors">
                  Ver expediente
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Nuevo Paciente */}
      {showNewPatientModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between">
              <h2 className="font-['Cormorant_Garamond']">Nuevo Paciente</h2>
              <button
                onClick={() => setShowNewPatientModal(false)}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Sección 1: Información Personal */}
              <div>
                <h3 className="mb-4" style={{ fontWeight: 600 }}>Información Personal</h3>
                <div className="space-y-4">
                  <div className="flex justify-center mb-4">
                    <div className="w-24 h-24 rounded-full bg-[#F5F2EF] flex items-center justify-center border-2 border-dashed border-[var(--color-border)] cursor-pointer hover:border-[var(--color-primary)] transition-colors">
                      <Plus className="text-[var(--color-text-secondary)]" size={32} />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 text-[var(--color-text-secondary)]">Nombre completo *</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                      placeholder="Nombre completo del paciente"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-[var(--color-text-secondary)]">Fecha de nacimiento *</label>
                      <input
                        type="date"
                        className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-[var(--color-text-secondary)]">Género</label>
                      <select className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]">
                        <option>Femenino</option>
                        <option>Masculino</option>
                        <option>Otro</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-[var(--color-text-secondary)]">Teléfono principal *</label>
                      <input
                        type="tel"
                        className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                        placeholder="(662) 000-0000"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-[var(--color-text-secondary)]">Teléfono secundario</label>
                      <input
                        type="tel"
                        className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                        placeholder="(662) 000-0000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 text-[var(--color-text-secondary)]">Correo electrónico</label>
                    <input
                      type="email"
                      className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                </div>
              </div>

              {/* Sección 2: Dirección */}
              <div>
                <h3 className="mb-4" style={{ fontWeight: 600 }}>Dirección</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-[var(--color-text-secondary)]">Calle y número</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                      placeholder="Calle Principal #123"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block mb-2 text-[var(--color-text-secondary)]">Colonia</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                        placeholder="Colonia"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-[var(--color-text-secondary)]">Ciudad</label>
                      <input
                        type="text"
                        defaultValue="Hermosillo"
                        className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-[var(--color-text-secondary)]">Código postal</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                        placeholder="83000"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección 3: Información Médica */}
              <div>
                <h3 className="mb-4" style={{ fontWeight: 600 }}>Información Médica</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-[var(--color-text-secondary)]">Alergias conocidas</label>
                    <textarea
                      rows={3}
                      className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] resize-none"
                      placeholder="Describe cualquier alergia conocida..."
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-[var(--color-text-secondary)]">Condiciones médicas relevantes</label>
                    <textarea
                      rows={3}
                      className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] resize-none"
                      placeholder="Diabetes, hipertensión, etc..."
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-[var(--color-text-secondary)]">Medicamentos actuales</label>
                    <textarea
                      rows={3}
                      className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] resize-none"
                      placeholder="Lista de medicamentos que toma actualmente..."
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-[var(--color-text-secondary)]">Notas adicionales</label>
                    <textarea
                      rows={3}
                      className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] resize-none"
                      placeholder="Cualquier otra información relevante..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-[var(--color-border)] px-6 py-4 flex gap-3 justify-end">
              <button
                onClick={() => setShowNewPatientModal(false)}
                className="px-6 py-2.5 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors"
              >
                Cancelar
              </button>
              <button className="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[#7A6349] transition-colors">
                Guardar Paciente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
