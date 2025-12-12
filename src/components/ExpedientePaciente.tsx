import React, { useState } from 'react';
import {
  ChevronRight,
  Calendar,
  FileText,
  Edit2,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  DollarSign,
  Image as ImageIcon,
  Plus,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface ExpedientePacienteProps {
  pacienteId: string;
  onBack: () => void;
}

interface Tratamiento {
  id: string;
  fecha: string;
  hora: string;
  servicio: string;
  productos: string[];
  precio: number;
  atendio: string;
  notas: string;
  fotos: number;
}

const pacienteData = {
  id: '1',
  nombre: 'María García López',
  edad: 32,
  telefono: '(662) 123-4567',
  telefonoSecundario: '(662) 987-6543',
  correo: 'maria.garcia@email.com',
  direccion: 'Calle Principal #123, Col. Centro, Hermosillo, Son. 83000',
  estado: 'activo',
  avatar: 'MG',
  colorAvatar: '#E8DFF5',
  primeraVisita: '2024-03-15',
  ultimaVisita: '2025-11-20',
  totalTratamientos: 18,
  inversionTotal: 45600
};

const tratamientosMock: Tratamiento[] = [
  {
    id: '1',
    fecha: '2025-11-20',
    hora: '10:30 AM',
    servicio: 'Limpieza Facial Profunda + Hidratación',
    productos: ['Ácido Hialurónico', 'Vitamina C', 'Plasma Rico en Plaquetas'],
    precio: 1200,
    atendio: 'Dra. Mayra',
    notas: 'Paciente tolera muy bien el tratamiento. Se observa mejora en textura de la piel. Programar siguiente sesión en 3 semanas.',
    fotos: 4
  },
  {
    id: '2',
    fecha: '2025-10-28',
    hora: '2:00 PM',
    servicio: 'Rejuvenecimiento con Plasma',
    productos: ['Plasma Rico en Plaquetas', 'Colágeno'],
    precio: 2500,
    atendio: 'Dra. Mayra',
    notas: 'Excelente respuesta al tratamiento. Paciente muy satisfecha con los resultados. Sin complicaciones.',
    fotos: 6
  },
  {
    id: '3',
    fecha: '2025-10-05',
    hora: '11:00 AM',
    servicio: 'Microdermoabrasión',
    productos: ['Exfoliante Enzimático', 'Mascarilla Calmante'],
    precio: 800,
    atendio: 'Dra. Mayra',
    notas: 'Tratamiento de mantenimiento. Piel en excelente estado. Paciente reporta sentirse muy cómoda.',
    fotos: 2
  },
  {
    id: '4',
    fecha: '2025-09-12',
    hora: '3:30 PM',
    servicio: 'Peeling Químico Superficial',
    productos: ['Ácido Glicólico 30%', 'Neutralizante', 'Protector Solar SPF 50'],
    precio: 1500,
    atendio: 'Dra. Mayra',
    notas: 'Primera sesión de peeling. Paciente tolera bien el procedimiento. Se dan instrucciones de cuidado post-tratamiento.',
    fotos: 5
  },
  {
    id: '5',
    fecha: '2025-08-20',
    hora: '9:00 AM',
    servicio: 'Hidratación Facial Profunda',
    productos: ['Ácido Hialurónico', 'Mascarilla Nutritiva'],
    precio: 900,
    atendio: 'Dra. Mayra',
    notas: 'Piel deshidratada por exposición solar. Se recomienda tratamiento intensivo de hidratación.',
    fotos: 3
  }
];

export function ExpedientePaciente({ pacienteId, onBack }: ExpedientePacienteProps) {
  const [activeTab, setActiveTab] = useState<'historial' | 'galeria' | 'notas' | 'consentimientos' | 'medica'>('historial');
  const [expandedTratamiento, setExpandedTratamiento] = useState<string | null>(null);

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

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-[var(--color-text-secondary)]">
        <button onClick={onBack} className="hover:text-[var(--color-primary)] transition-colors">
          Pacientes
        </button>
        <ChevronRight size={16} />
        <span className="text-[var(--color-text)]">{pacienteData.nombre}</span>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-3 mb-6 justify-end">
        <button className="flex items-center gap-2 px-4 py-2.5 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors">
          <Calendar size={18} />
          <span>Agendar Cita</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors">
          <FileText size={18} />
          <span>Nueva Nota</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors">
          <Edit2 size={18} />
          <span>Editar Paciente</span>
        </button>
      </div>

      {/* Card de Información Principal */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Avatar y estado */}
          <div className="flex-shrink-0 relative">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{ backgroundColor: pacienteData.colorAvatar, fontSize: '32px', fontWeight: 600, color: '#6B6560' }}
            >
              {pacienteData.avatar}
            </div>
            <span className="absolute bottom-0 right-0 w-6 h-6 bg-[var(--color-success)] border-2 border-white rounded-full"></span>
          </div>

          {/* Información central */}
          <div className="flex-1">
            <h1 className="font-['Cormorant_Garamond'] mb-2">{pacienteData.nombre}</h1>
            <p className="text-[var(--color-text-secondary)] mb-4">{pacienteData.edad} años</p>
            
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-[var(--color-text-secondary)]" />
                <span>{pacienteData.telefono}</span>
                <button
                  onClick={() => window.open(`https://wa.me/${pacienteData.telefono.replace(/\D/g, '')}`, '_blank')}
                  className="text-green-600 hover:text-green-700 transition-colors"
                >
                  <MessageCircle size={16} />
                </button>
              </div>
              {pacienteData.telefonoSecundario && (
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-[var(--color-text-secondary)]" />
                  <span className="text-[var(--color-text-secondary)]">{pacienteData.telefonoSecundario}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-[var(--color-text-secondary)]" />
                <a href={`mailto:${pacienteData.correo}`} className="text-[var(--color-primary)] hover:underline">
                  {pacienteData.correo}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-[var(--color-text-secondary)]" />
                <span className="text-[var(--color-text-secondary)]">{pacienteData.direccion}</span>
              </div>
            </div>
          </div>

          {/* Métricas rápidas */}
          <div className="lg:w-80 bg-[#FDFBF9] rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-secondary)]">Primera visita:</span>
              <span style={{ fontWeight: 600 }}>{formatDate(pacienteData.primeraVisita)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-secondary)]">Última visita:</span>
              <span style={{ fontWeight: 600 }}>{formatDate(pacienteData.ultimaVisita)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-secondary)]">Total tratamientos:</span>
              <span className="text-[var(--color-primary)]" style={{ fontWeight: 600 }}>{pacienteData.totalTratamientos}</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
              <span className="text-[var(--color-text-secondary)]">Inversión total:</span>
              <span className="text-[var(--color-secondary)]" style={{ fontWeight: 700, fontSize: '18px' }}>
                {formatCurrency(pacienteData.inversionTotal)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs de navegación */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] mb-6">
        <div className="flex border-b border-[var(--color-border)] overflow-x-auto">
          <button
            onClick={() => setActiveTab('historial')}
            className={`px-6 py-4 transition-colors whitespace-nowrap ${
              activeTab === 'historial'
                ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
            }`}
            style={{ fontWeight: activeTab === 'historial' ? 600 : 400 }}
          >
            Historial de Tratamientos
          </button>
          <button
            onClick={() => setActiveTab('galeria')}
            className={`px-6 py-4 transition-colors whitespace-nowrap ${
              activeTab === 'galeria'
                ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
            }`}
            style={{ fontWeight: activeTab === 'galeria' ? 600 : 400 }}
          >
            Galería de Fotos
          </button>
          <button
            onClick={() => setActiveTab('notas')}
            className={`px-6 py-4 transition-colors whitespace-nowrap ${
              activeTab === 'notas'
                ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
            }`}
            style={{ fontWeight: activeTab === 'notas' ? 600 : 400 }}
          >
            Notas Clínicas
          </button>
          <button
            onClick={() => setActiveTab('consentimientos')}
            className={`px-6 py-4 transition-colors whitespace-nowrap ${
              activeTab === 'consentimientos'
                ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
            }`}
            style={{ fontWeight: activeTab === 'consentimientos' ? 600 : 400 }}
          >
            Consentimientos
          </button>
          <button
            onClick={() => setActiveTab('medica')}
            className={`px-6 py-4 transition-colors whitespace-nowrap ${
              activeTab === 'medica'
                ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
            }`}
            style={{ fontWeight: activeTab === 'medica' ? 600 : 400 }}
          >
            Información Médica
          </button>
        </div>

        {/* Contenido del Tab: Historial de Tratamientos */}
        {activeTab === 'historial' && (
          <div className="p-6">
            {/* Timeline de tratamientos */}
            <div className="relative">
              {/* Línea vertical del timeline */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[var(--color-border)]"></div>

              <div className="space-y-6">
                {tratamientosMock.map((tratamiento, index) => (
                  <div key={tratamiento.id} className="relative pl-12">
                    {/* Punto del timeline */}
                    <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-[var(--color-primary)] border-4 border-white shadow-md flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>

                    {/* Card del tratamiento */}
                    <div className="bg-[#FDFBF9] rounded-lg border border-[var(--color-border)] p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 bg-[var(--color-primary)] text-white rounded-full" style={{ fontSize: '13px', fontWeight: 600 }}>
                              {formatDate(tratamiento.fecha)}
                            </span>
                            <div className="flex items-center gap-1 text-[var(--color-text-secondary)]">
                              <Clock size={14} />
                              <span style={{ fontSize: '14px' }}>{tratamiento.hora}</span>
                            </div>
                          </div>
                          <h3 className="mb-1" style={{ fontWeight: 600 }}>{tratamiento.servicio}</h3>
                          <p className="text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>
                            Atendió: {tratamiento.atendio}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-[var(--color-secondary)] mb-1" style={{ fontWeight: 700, fontSize: '20px' }}>
                            {formatCurrency(tratamiento.precio)}
                          </div>
                          {tratamiento.fotos > 0 && (
                            <div className="flex items-center gap-1 text-[var(--color-text-secondary)] justify-end">
                              <ImageIcon size={14} />
                              <span style={{ fontSize: '13px' }}>{tratamiento.fotos} fotos</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Productos utilizados */}
                      <div className="mb-3">
                        <p className="text-[var(--color-text-secondary)] mb-2" style={{ fontSize: '13px', fontWeight: 600 }}>
                          Productos utilizados:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {tratamiento.productos.map((producto, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-white border border-[var(--color-border)] rounded-full text-[var(--color-text-secondary)]"
                              style={{ fontSize: '13px' }}
                            >
                              {producto}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Notas del tratamiento */}
                      <div className="mb-4">
                        <p className="text-[var(--color-text-secondary)] mb-1" style={{ fontSize: '13px', fontWeight: 600 }}>
                          Notas del tratamiento:
                        </p>
                        <p
                          className={`text-[var(--color-text-secondary)] ${
                            expandedTratamiento === tratamiento.id ? '' : 'line-clamp-2'
                          }`}
                          style={{ fontSize: '14px' }}
                        >
                          {tratamiento.notas}
                        </p>
                        {tratamiento.notas.length > 100 && (
                          <button
                            onClick={() => setExpandedTratamiento(expandedTratamiento === tratamiento.id ? null : tratamiento.id)}
                            className="text-[var(--color-primary)] hover:underline mt-1"
                            style={{ fontSize: '13px' }}
                          >
                            {expandedTratamiento === tratamiento.id ? 'Ver menos' : 'Ver más'}
                          </button>
                        )}
                      </div>

                      {/* Botón ver detalle */}
                      <button className="w-full py-2 border border-[var(--color-primary)] text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary)] hover:text-white transition-colors">
                        Ver detalle completo
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Galería de Fotos */}
        {activeTab === 'galeria' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 style={{ fontWeight: 600 }}>Galería de Fotos</h3>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[#7A6349] transition-colors">
                <Plus size={18} />
                <span>Subir Fotos</span>
              </button>
            </div>
            <div className="text-center py-16 text-[var(--color-text-secondary)]">
              <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
              <p>No hay fotos registradas para este paciente</p>
              <button className="mt-4 px-4 py-2 text-[var(--color-primary)] hover:underline">
                Subir primera foto
              </button>
            </div>
          </div>
        )}

        {/* Tab: Notas Clínicas */}
        {activeTab === 'notas' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 style={{ fontWeight: 600 }}>Notas Clínicas</h3>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[#7A6349] transition-colors">
                <Plus size={18} />
                <span>Nueva Nota</span>
              </button>
            </div>
            <div className="text-center py-16 text-[var(--color-text-secondary)]">
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <p>No hay notas clínicas registradas</p>
              <button className="mt-4 px-4 py-2 text-[var(--color-primary)] hover:underline">
                Crear primera nota
              </button>
            </div>
          </div>
        )}

        {/* Tab: Consentimientos */}
        {activeTab === 'consentimientos' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 style={{ fontWeight: 600 }}>Consentimientos</h3>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[#7A6349] transition-colors">
                <Plus size={18} />
                <span>Nuevo Consentimiento</span>
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-[#FDFBF9] rounded-lg border border-[var(--color-border)] p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="mb-1" style={{ fontWeight: 600 }}>Consentimiento Informado - Tratamiento con Plasma</h4>
                    <p className="text-[var(--color-text-secondary)] mb-2" style={{ fontSize: '14px' }}>
                      Fecha de firma: {formatDate('2024-03-15')}
                    </p>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full" style={{ fontSize: '13px', fontWeight: 500 }}>
                      <CheckCircle size={14} />
                      Firmado
                    </span>
                  </div>
                  <button className="px-4 py-2 border border-[var(--color-border)] rounded-lg hover:bg-white transition-colors">
                    Ver documento
                  </button>
                </div>
              </div>
              <div className="bg-[#FDFBF9] rounded-lg border border-[var(--color-border)] p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="mb-1" style={{ fontWeight: 600 }}>Consentimiento Informado - Peeling Químico</h4>
                    <p className="text-[var(--color-text-secondary)] mb-2" style={{ fontSize: '14px' }}>
                      Fecha de firma: {formatDate('2025-09-10')}
                    </p>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full" style={{ fontSize: '13px', fontWeight: 500 }}>
                      <CheckCircle size={14} />
                      Firmado
                    </span>
                  </div>
                  <button className="px-4 py-2 border border-[var(--color-border)] rounded-lg hover:bg-white transition-colors">
                    Ver documento
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Información Médica */}
        {activeTab === 'medica' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 style={{ fontWeight: 600 }}>Información Médica</h3>
              <button className="flex items-center gap-2 px-4 py-2.5 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors">
                <Edit2 size={18} />
                <span>Editar Información</span>
              </button>
            </div>

            <div className="space-y-4">
              {/* Card: Alergias */}
              <div className="bg-red-50 rounded-lg border border-red-200 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={20} />
                  <div className="flex-1">
                    <h4 className="text-red-900 mb-2" style={{ fontWeight: 600 }}>Alergias</h4>
                    <ul className="space-y-1 text-red-800">
                      <li>• Penicilina</li>
                      <li>• Polen de árboles</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Card: Condiciones Médicas */}
              <div className="bg-[#FDFBF9] rounded-lg border border-[var(--color-border)] p-4">
                <h4 className="mb-3" style={{ fontWeight: 600 }}>Condiciones Médicas</h4>
                <p className="text-[var(--color-text-secondary)]">No reporta condiciones médicas relevantes</p>
              </div>

              {/* Card: Medicamentos Actuales */}
              <div className="bg-[#FDFBF9] rounded-lg border border-[var(--color-border)] p-4">
                <h4 className="mb-3" style={{ fontWeight: 600 }}>Medicamentos Actuales</h4>
                <ul className="space-y-1 text-[var(--color-text-secondary)]">
                  <li>• Anticonceptivos orales</li>
                  <li>• Multivitamínico diario</li>
                </ul>
              </div>

              {/* Card: Antecedentes */}
              <div className="bg-[#FDFBF9] rounded-lg border border-[var(--color-border)] p-4">
                <h4 className="mb-3" style={{ fontWeight: 600 }}>Antecedentes y Notas Adicionales</h4>
                <p className="text-[var(--color-text-secondary)]">
                  Paciente muy responsable con sus citas. Sigue las indicaciones post-tratamiento al pie de la letra. 
                  Excelente candidata para tratamientos avanzados.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
