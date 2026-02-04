import React, { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  MessageCircle,
  FileText,
  X,
  Edit2,
  Check,
  XCircle,
  MoreVertical,
  DollarSign,
  AlertCircle,
} from "lucide-react";

type ViewMode = "week" | "day" | "month";
type EstadoCita =
  | "confirmada"
  | "pendiente"
  | "en-curso"
  | "completada"
  | "cancelada"
  | "no-asistio";

interface Cita {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  pacienteAvatar: string;
  pacienteTelefono: string;
  servicio: string;
  fecha: string; // YYYY-MM-DD
  horaInicio: string; // HH:MM
  horaFin: string; // HH:MM
  duracion: number; // minutos
  precio: number;
  estado: EstadoCita;
  notas: string;
  historial: { accion: string; fecha: string }[];
}

const estadosConfig = {
  confirmada: {
    label: "Confirmada",
    color: "#7DB07D",
    bgColor: "#7DB07D15",
  },
  pendiente: {
    label: "Pendiente",
    color: "#E0A75E",
    bgColor: "#E0A75E15",
  },
  "en-curso": {
    label: "En Curso",
    color: "#8B7355",
    bgColor: "#8B735515",
  },
  completada: {
    label: "Completada",
    color: "#6B6560",
    bgColor: "#6B656015",
  },
  cancelada: {
    label: "Cancelada",
    color: "#C67B7B",
    bgColor: "#C67B7B15",
  },
  "no-asistio": {
    label: "No asistió",
    color: "#C67B7B",
    bgColor: "#C67B7B15",
  },
};

const citasMock: Cita[] = [
  {
    id: "1",
    pacienteId: "1",
    pacienteNombre: "María García López",
    pacienteAvatar: "MG",
    pacienteTelefono: "(662) 123-4567",
    servicio: "Limpieza Facial Profunda",
    fecha: "2025-11-27",
    horaInicio: "09:00",
    horaFin: "09:45",
    duracion: 45,
    precio: 800,
    estado: "confirmada",
    notas: "Primera vez con este tratamiento. Piel sensible.",
    historial: [
      { accion: "Creada", fecha: "2025-11-20 10:30" },
      { accion: "Confirmada", fecha: "2025-11-25 15:00" },
    ],
  },
  {
    id: "2",
    pacienteId: "2",
    pacienteNombre: "Ana Sofía Martínez",
    pacienteAvatar: "AM",
    pacienteTelefono: "(662) 234-5678",
    servicio: "Rejuvenecimiento con Plasma",
    fecha: "2025-11-27",
    horaInicio: "10:00",
    horaFin: "11:00",
    duracion: 60,
    precio: 2500,
    estado: "confirmada",
    notas: "Tratamiento mensual de seguimiento.",
    historial: [
      { accion: "Creada", fecha: "2025-11-18 14:20" },
      { accion: "Confirmada", fecha: "2025-11-26 09:15" },
    ],
  },
  {
    id: "3",
    pacienteId: "3",
    pacienteNombre: "Laura Fernández Cruz",
    pacienteAvatar: "LF",
    pacienteTelefono: "(662) 345-6789",
    servicio: "Hidratación Facial",
    fecha: "2025-11-27",
    horaInicio: "11:30",
    horaFin: "12:15",
    duracion: 45,
    precio: 900,
    estado: "pendiente",
    notas: "Llamar para confirmar un día antes.",
    historial: [
      { accion: "Creada", fecha: "2025-11-24 11:00" },
    ],
  },
  {
    id: "4",
    pacienteId: "4",
    pacienteNombre: "Carmen Rodríguez",
    pacienteAvatar: "CR",
    pacienteTelefono: "(662) 456-7890",
    servicio: "Microdermoabrasión",
    fecha: "2025-11-27",
    horaInicio: "14:00",
    horaFin: "14:45",
    duracion: 45,
    precio: 800,
    estado: "confirmada",
    notas: "",
    historial: [
      { accion: "Creada", fecha: "2025-11-22 16:45" },
      { accion: "Confirmada", fecha: "2025-11-26 10:30" },
    ],
  },
  {
    id: "5",
    pacienteId: "5",
    pacienteNombre: "Patricia Sánchez",
    pacienteAvatar: "PS",
    pacienteTelefono: "(662) 567-8901",
    servicio: "Peeling Químico",
    fecha: "2025-11-27",
    horaInicio: "16:00",
    horaFin: "17:00",
    duracion: 60,
    precio: 1500,
    estado: "pendiente",
    notas: "Paciente preguntó sobre cuidados post-tratamiento.",
    historial: [
      { accion: "Creada", fecha: "2025-11-26 18:00" },
    ],
  },
  {
    id: "6",
    pacienteId: "6",
    pacienteNombre: "Gabriela Morales",
    pacienteAvatar: "GM",
    pacienteTelefono: "(662) 789-0123",
    servicio: "Limpieza Facial",
    fecha: "2025-11-28",
    horaInicio: "09:00",
    horaFin: "09:45",
    duracion: 45,
    precio: 650,
    estado: "confirmada",
    notas: "",
    historial: [
      { accion: "Creada", fecha: "2025-11-23 12:30" },
      { accion: "Confirmada", fecha: "2025-11-27 08:00" },
    ],
  },
];

export function Agenda() {
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCita, setSelectedCita] = useState<Cita | null>(
    null,
  );
  const [showNewCitaModal, setShowNewCitaModal] =
    useState(false);
  const [filterEstado, setFilterEstado] = useState<string[]>([
    "todas",
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const calendarRef = useRef<HTMLDivElement>(null);

  // Horas del día (8:00 AM - 8:00 PM)
  const hours = Array.from({ length: 25 }, (_, i) => i + 8);

  // Obtener días de la semana actual
  const getWeekDays = (date: Date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay() + 1); // Lunes

    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      return day;
    });
  };

  const weekDays = getWeekDays(currentDate);

  const formatDate = (date: Date) => {
    const months = [
      "Enero",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Noviembre",
      "Dic",
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatWeekRange = (days: Date[]) => {
    const months = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];
    const start = days[0];
    const end = days[6];
    return `${start.getDate()} ${months[start.getMonth()]} - ${end.getDate()} ${months[end.getMonth()]} ${end.getFullYear()}`;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (viewMode === "week") {
      newDate.setDate(
        currentDate.getDate() + (direction === "next" ? 7 : -7),
      );
    } else if (viewMode === "day") {
      newDate.setDate(
        currentDate.getDate() + (direction === "next" ? 1 : -1),
      );
    } else {
      newDate.setMonth(
        currentDate.getMonth() +
          (direction === "next" ? 1 : -1),
      );
    }
    setCurrentDate(newDate);
  };

  // Filtrar citas según fecha y búsqueda
  const getFilteredCitas = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return citasMock.filter((cita) => {
      const matchesDate = cita.fecha === dateStr;
      const matchesSearch =
        searchTerm === "" ||
        cita.pacienteNombre
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesEstado =
        filterEstado.includes("todas") ||
        filterEstado.includes(cita.estado);
      return matchesDate && matchesSearch && matchesEstado;
    });
  };

  // Calcular posición y altura del bloque de cita
  const getCitaPosition = (
    horaInicio: string,
    duracion: number,
  ) => {
    const [hours, minutes] = horaInicio.split(":").map(Number);
    const startMinutes = (hours - 8) * 60 + minutes;
    const top = (startMinutes / 60) * 80; // 80px por hora
    const height = (duracion / 60) * 80;
    return { top, height };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  return (
    <div className="p-8 h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-['Cormorant_Garamond'] text-[var(--color-text)] mb-2">
              Agenda
            </h1>
            <p className="text-[var(--color-text-secondary)]">
              Gestión de citas y calendario
            </p>
          </div>
          <button
            onClick={() => setShowNewCitaModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[#7A6349] transition-colors"
          >
            <Plus size={20} />
            <span>Nueva Cita</span>
          </button>
        </div>

        {/* Navegación de fecha */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <button
            onClick={goToToday}
            className="px-4 py-2 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors"
          >
            Hoy
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateDate("prev")}
              className="p-2 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <div
              className="px-4 py-2 min-w-[250px] text-center"
              style={{ fontWeight: 600 }}
            >
              {viewMode === "week"
                ? formatWeekRange(weekDays)
                : formatDate(currentDate)}
            </div>
            <button
              onClick={() => navigateDate("next")}
              className="p-2 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Controles */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Selector de vista */}
          <div className="flex gap-1 border border-[var(--color-border)] rounded-lg p-1">
            <button
              onClick={() => setViewMode("day")}
              className={`px-4 py-2 rounded transition-colors ${
                viewMode === "day"
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
              }`}
            >
              Día
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={`px-4 py-2 rounded transition-colors ${
                viewMode === "week"
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => setViewMode("month")}
              className={`px-4 py-2 rounded transition-colors ${
                viewMode === "month"
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
              }`}
            >
              Mes
            </button>
          </div>

          {/* Buscador */}
          <div className="relative flex-1 min-w-[250px]">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar paciente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Vista de Semana */}
      {viewMode === "week" && (
        <div className="flex-1 bg-white rounded-xl border border-[var(--color-border)] overflow-hidden flex flex-col">
          <div
            className="flex-1 overflow-auto"
            ref={calendarRef}
          >
            <div className="min-w-[800px]">
              {/* Header de días */}
              <div className="sticky top-0 bg-white border-b border-[var(--color-border)] z-10">
                <div className="flex">
                  <div className="w-16 flex-shrink-0"></div>
                  {weekDays.map((day, idx) => (
                    <div
                      key={idx}
                      className={`flex-1 text-center py-4 border-l border-[var(--color-border)] ${
                        isToday(day)
                          ? "bg-[var(--color-primary)] text-white"
                          : ""
                      }`}
                    >
                      <div
                        className="uppercase"
                        style={{
                          fontSize: "12px",
                          fontWeight: 600,
                        }}
                      >
                        {
                          [
                            "Lun",
                            "Mar",
                            "Mié",
                            "Jue",
                            "Vie",
                            "Sáb",
                            "Dom",
                          ][idx]
                        }
                      </div>
                      <div
                        className={`mt-1 ${isToday(day) ? "text-white" : "text-[var(--color-text)]"}`}
                        style={{
                          fontSize: "24px",
                          fontWeight: 600,
                        }}
                      >
                        {day.getDate()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grid de tiempo */}
              <div className="relative">
                {/* Líneas de hora */}
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="flex border-b border-[var(--color-border)]"
                    style={{ height: "80px" }}
                  >
                    <div className="w-16 flex-shrink-0 text-right pr-2 pt-1">
                      <span
                        className="text-[var(--color-text-secondary)]"
                        style={{ fontSize: "13px" }}
                      >
                        {hour > 12
                          ? `${hour - 12}:00 PM`
                          : `${hour}:00 AM`}
                      </span>
                    </div>
                    {weekDays.map((_, idx) => (
                      <div
                        key={idx}
                        className="flex-1 border-l border-[var(--color-border)] relative"
                      ></div>
                    ))}
                  </div>
                ))}

                {/* Bloques de citas */}
                {weekDays.map((day, dayIdx) => {
                  const citas = getFilteredCitas(day);
                  return citas.map((cita) => {
                    const { top, height } = getCitaPosition(
                      cita.horaInicio,
                      cita.duracion,
                    );
                    const left = `calc((100% - 64px) / 7 * ${dayIdx} + 64px)`;
                    const width = `calc((100% - 64px) / 7)`;
                    const estado = estadosConfig[cita.estado];

                    return (
                      <div
                        key={cita.id}
                        onClick={() => setSelectedCita(cita)}
                        className="absolute cursor-pointer hover:shadow-lg transition-shadow z-20 p-2"
                        style={{
                          top: `${top}px`,
                          left,
                          width,
                          height: `${Math.max(height, 70)}px`,
                          backgroundColor: estado.bgColor,
                          borderLeft: `4px solid ${estado.color}`,
                          borderRadius: "6px",
                          paddingLeft: "8px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "12px",
                            fontWeight: 600,
                            color: estado.color,
                          }}
                        >
                          {cita.horaInicio}
                        </div>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                          }}
                          className="truncate mt-1"
                        >
                          {cita.pacienteNombre}
                        </div>
                        <div
                          style={{ fontSize: "12px" }}
                          className="text-[var(--color-text-secondary)] truncate"
                        >
                          {cita.servicio}
                        </div>
                      </div>
                    );
                  });
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vista de Día */}
      {viewMode === "day" && (
        <div className="flex-1 bg-white rounded-xl border border-[var(--color-border)] overflow-hidden flex">
          {/* Calendario */}
          <div className="flex-1 overflow-auto">
            <div className="min-w-[400px]">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-[var(--color-border)] z-10 py-4 text-center">
                <div
                  className="uppercase text-[var(--color-text-secondary)] mb-1"
                  style={{ fontSize: "12px", fontWeight: 600 }}
                >
                  {
                    [
                      "Domingo",
                      "Lunes",
                      "Martes",
                      "Miércoles",
                      "Jueves",
                      "Viernes",
                      "Sábado",
                    ][currentDate.getDay()]
                  }
                </div>
                <div
                  style={{ fontSize: "28px", fontWeight: 600 }}
                >
                  {currentDate.getDate()}
                </div>
              </div>

              {/* Grid de tiempo */}
              <div className="relative">
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="flex border-b border-[var(--color-border)]"
                    style={{ height: "80px" }}
                  >
                    <div className="w-20 flex-shrink-0 text-right pr-3 pt-1">
                      <span
                        className="text-[var(--color-text-secondary)]"
                        style={{ fontSize: "13px" }}
                      >
                        {hour > 12
                          ? `${hour - 12}:00 PM`
                          : `${hour}:00 AM`}
                      </span>
                    </div>
                    <div className="flex-1 border-l border-[var(--color-border)]"></div>
                  </div>
                ))}

                {/* Bloques de citas */}
                {getFilteredCitas(currentDate).map((cita) => {
                  const { top, height } = getCitaPosition(
                    cita.horaInicio,
                    cita.duracion,
                  );
                  const estado = estadosConfig[cita.estado];

                  return (
                    <div
                      key={cita.id}
                      onClick={() => setSelectedCita(cita)}
                      className="absolute cursor-pointer hover:shadow-lg transition-shadow z-20 p-3"
                      style={{
                        top: `${top}px`,
                        left: "80px",
                        right: "16px",
                        height: `${Math.max(height, 60)}px`,
                        backgroundColor: estado.bgColor,
                        borderLeft: `4px solid ${estado.color}`,
                        borderRadius: "6px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: estado.color,
                        }}
                      >
                        {cita.horaInicio} - {cita.horaFin}
                      </div>
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: 600,
                        }}
                        className="mt-1"
                      >
                        {cita.pacienteNombre}
                      </div>
                      <div
                        style={{ fontSize: "14px" }}
                        className="text-[var(--color-text-secondary)]"
                      >
                        {cita.servicio}
                      </div>
                      {cita.notas && (
                        <div
                          style={{ fontSize: "13px" }}
                          className="text-[var(--color-text-secondary)] mt-1 line-clamp-2"
                        >
                          {cita.notas}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar de citas del día */}
          <div className="w-80 border-l border-[var(--color-border)] bg-[#FDFBF9] overflow-auto">
            <div className="p-4 border-b border-[var(--color-border)] bg-white">
              <h3 style={{ fontWeight: 600 }}>Citas del día</h3>
              <p
                className="text-[var(--color-text-secondary)]"
                style={{ fontSize: "14px" }}
              >
                {getFilteredCitas(currentDate).length} citas
                programadas
              </p>
            </div>
            <div className="p-4 space-y-3">
              {getFilteredCitas(currentDate).map((cita) => {
                const estado = estadosConfig[cita.estado];
                return (
                  <div
                    key={cita.id}
                    onClick={() => setSelectedCita(cita)}
                    className="bg-white rounded-lg border border-[var(--color-border)] p-3 cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                        }}
                      >
                        {cita.horaInicio} - {cita.horaFin}
                      </span>
                      <span
                        className="px-2 py-1 rounded-full"
                        style={{
                          fontSize: "11px",
                          fontWeight: 500,
                          backgroundColor: estado.bgColor,
                          color: estado.color,
                        }}
                      >
                        {estado.label}
                      </span>
                    </div>
                    <div
                      style={{ fontWeight: 600 }}
                      className="mb-1"
                    >
                      {cita.pacienteNombre}
                    </div>
                    <div
                      className="text-[var(--color-text-secondary)]"
                      style={{ fontSize: "13px" }}
                    >
                      {cita.servicio}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Vista de Mes */}
      {viewMode === "month" && (
        <div className="flex-1 bg-white rounded-xl border border-[var(--color-border)] p-4">
          <p className="text-center text-[var(--color-text-secondary)] py-20">
            Vista de mes - En desarrollo
          </p>
        </div>
      )}

      {/* Drawer: Detalle de Cita */}
      {selectedCita && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setSelectedCita(null)}
          ></div>
          <div className="fixed right-0 top-0 bottom-0 w-full md:w-[450px] bg-white shadow-2xl z-50 overflow-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="font-['Cormorant_Garamond']">
                  Detalle de Cita
                </h2>
                <span
                  className="inline-block px-3 py-1 rounded-full mt-2"
                  style={{
                    fontSize: "12px",
                    fontWeight: 500,
                    backgroundColor:
                      estadosConfig[selectedCita.estado]
                        .bgColor,
                    color:
                      estadosConfig[selectedCita.estado].color,
                  }}
                >
                  {estadosConfig[selectedCita.estado].label}
                </span>
              </div>
              <button
                onClick={() => setSelectedCita(null)}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Información de la cita */}
              <div>
                <h3
                  className="mb-3"
                  style={{ fontWeight: 600 }}
                >
                  Información de la Cita
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CalendarIcon
                      size={20}
                      className="text-[var(--color-text-secondary)] flex-shrink-0 mt-0.5"
                    />
                    <div>
                      <div style={{ fontWeight: 600 }}>
                        {
                          [
                            "Domingo",
                            "Lunes",
                            "Martes",
                            "Miércoles",
                            "Jueves",
                            "Viernes",
                            "Sábado",
                          ][
                            new Date(
                              selectedCita.fecha,
                            ).getDay()
                          ]
                        }
                        ,{" "}
                        {new Date(selectedCita.fecha).getDate()}{" "}
                        de{" "}
                        {
                          [
                            "Enero",
                            "Febrero",
                            "Marzo",
                            "Abril",
                            "Mayo",
                            "Junio",
                            "Julio",
                            "Agosto",
                            "Septiembre",
                            "Octubre",
                            "Noviembre",
                            "Diciembre",
                          ][
                            new Date(
                              selectedCita.fecha,
                            ).getMonth()
                          ]
                        }{" "}
                        {new Date(
                          selectedCita.fecha,
                        ).getFullYear()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock
                      size={20}
                      className="text-[var(--color-text-secondary)] flex-shrink-0 mt-0.5"
                    />
                    <div>
                      <div style={{ fontWeight: 600 }}>
                        {selectedCita.horaInicio} -{" "}
                        {selectedCita.horaFin}
                      </div>
                      <div
                        className="text-[var(--color-text-secondary)]"
                        style={{ fontSize: "14px" }}
                      >
                        Duración: {selectedCita.duracion}{" "}
                        minutos
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileText
                      size={20}
                      className="text-[var(--color-text-secondary)] flex-shrink-0 mt-0.5"
                    />
                    <div>
                      <div style={{ fontWeight: 600 }}>
                        {selectedCita.servicio}
                      </div>
                      <div
                        className="text-[var(--color-secondary)]"
                        style={{
                          fontSize: "14px",
                          fontWeight: 600,
                        }}
                      >
                        {formatCurrency(selectedCita.precio)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Paciente */}
              <div className="border-t border-[var(--color-border)] pt-6">
                <h3
                  className="mb-3"
                  style={{ fontWeight: 600 }}
                >
                  Paciente
                </h3>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-full bg-[#E8DFF5] flex items-center justify-center"
                    style={{ fontWeight: 600 }}
                  >
                    {selectedCita.pacienteAvatar}
                  </div>
                  <div className="flex-1">
                    <div style={{ fontWeight: 600 }}>
                      {selectedCita.pacienteNombre}
                    </div>
                    <div
                      className="text-[var(--color-text-secondary)]"
                      style={{ fontSize: "14px" }}
                    >
                      {selectedCita.pacienteTelefono}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors">
                    <Phone size={16} />
                    <span style={{ fontSize: "14px" }}>
                      Llamar
                    </span>
                  </button>
                  <button
                    onClick={() =>
                      window.open(
                        `https://wa.me/${selectedCita.pacienteTelefono.replace(/\D/g, "")}`,
                        "_blank",
                      )
                    }
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    <MessageCircle size={16} />
                    <span style={{ fontSize: "14px" }}>
                      WhatsApp
                    </span>
                  </button>
                </div>
                <button
                  className="w-full mt-2 text-[var(--color-primary)] hover:underline"
                  style={{ fontSize: "14px" }}
                >
                  Ver expediente completo →
                </button>
              </div>

              {/* Notas */}
              <div className="border-t border-[var(--color-border)] pt-6">
                <h3
                  className="mb-3"
                  style={{ fontWeight: 600 }}
                >
                  Notas de la Cita
                </h3>
                {selectedCita.notas ? (
                  <p className="text-[var(--color-text-secondary)]">
                    {selectedCita.notas}
                  </p>
                ) : (
                  <p className="text-[var(--color-text-secondary)] italic">
                    Sin notas
                  </p>
                )}
              </div>

              {/* Historial */}
              <div className="border-t border-[var(--color-border)] pt-6">
                <h3
                  className="mb-3"
                  style={{ fontWeight: 600 }}
                >
                  Historial de Estados
                </h3>
                <div className="space-y-2">
                  {selectedCita.historial.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3"
                    >
                      <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] mt-2"></div>
                      <div className="flex-1">
                        <div style={{ fontWeight: 600 }}>
                          {item.accion}
                        </div>
                        <div
                          className="text-[var(--color-text-secondary)]"
                          style={{ fontSize: "13px" }}
                        >
                          {item.fecha}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer de acciones */}
            <div className="sticky bottom-0 bg-white border-t border-[var(--color-border)] p-6 space-y-3">
              {selectedCita.estado === "pendiente" && (
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-success)] text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Check size={18} />
                  <span>Confirmar Cita</span>
                </button>
              )}
              {selectedCita.estado === "confirmada" && (
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-success)] text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Check size={18} />
                  <span>Marcar Completada</span>
                </button>
              )}
              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2.5 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors">
                  <span>Reagendar</span>
                </button>
                <button className="flex-1 px-4 py-2.5 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors">
                  <Edit2 size={16} className="inline mr-2" />
                  <span>Editar</span>
                </button>
              </div>
              <button className="w-full px-4 py-2.5 text-[var(--color-error)] hover:bg-red-50 rounded-lg transition-colors">
                Cancelar Cita
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modal: Nueva Cita */}
      {showNewCitaModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between">
              <h2 className="font-['Cormorant_Garamond']">
                Nueva Cita
              </h2>
              <button
                onClick={() => setShowNewCitaModal(false)}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Paciente */}
              <div>
                <label
                  className="block mb-2"
                  style={{ fontWeight: 600 }}
                >
                  Paciente *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                  placeholder="Buscar paciente..."
                />
                <button
                  className="mt-2 text-[var(--color-primary)] hover:underline"
                  style={{ fontSize: "14px" }}
                >
                  + Crear nuevo paciente
                </button>
              </div>

              {/* Servicio */}
              <div>
                <label
                  className="block mb-2"
                  style={{ fontWeight: 600 }}
                >
                  Servicio *
                </label>
                <select className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]">
                  <option value="">
                    Seleccionar servicio...
                  </option>
                  <option value="limpieza">
                    Limpieza Facial Profunda - $800
                  </option>
                  <option value="plasma">
                    Rejuvenecimiento con Plasma - $2,500
                  </option>
                  <option value="hidratacion">
                    Hidratación Facial - $900
                  </option>
                  <option value="microdermo">
                    Microdermoabrasión - $800
                  </option>
                  <option value="peeling">
                    Peeling Químico - $1,500
                  </option>
                </select>
              </div>

              {/* Fecha y Hora */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="block mb-2"
                    style={{ fontWeight: 600 }}
                  >
                    Fecha *
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
                <div>
                  <label
                    className="block mb-2"
                    style={{ fontWeight: 600 }}
                  >
                    Hora de Inicio *
                  </label>
                  <input
                    type="time"
                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
              </div>

              {/* Duración */}
              <div>
                <label
                  className="block mb-2"
                  style={{ fontWeight: 600 }}
                >
                  Duración
                </label>
                <select className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]">
                  <option value="30">30 minutos</option>
                  <option value="45">45 minutos</option>
                  <option value="60">1 hora</option>
                  <option value="90">1.5 horas</option>
                  <option value="120">2 horas</option>
                </select>
              </div>

              {/* Notas */}
              <div>
                <label
                  className="block mb-2"
                  style={{ fontWeight: 600 }}
                >
                  Notas
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] resize-none"
                  placeholder="Instrucciones especiales, preparación previa..."
                />
              </div>

              {/* Estado inicial */}
              <div>
                <label
                  className="block mb-2"
                  style={{ fontWeight: 600 }}
                >
                  Estado Inicial
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="estado"
                      value="pendiente"
                      defaultChecked
                    />
                    <span>Pendiente por confirmar</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="estado"
                      value="confirmada"
                    />
                    <span>Confirmada</span>
                  </label>
                </div>
              </div>

              {/* Preview */}
              <div className="bg-[#FDFBF9] rounded-lg border border-[var(--color-border)] p-4">
                <h4
                  className="mb-3"
                  style={{ fontWeight: 600 }}
                >
                  Resumen
                </h4>
                <div
                  className="space-y-2 text-[var(--color-text-secondary)]"
                  style={{ fontSize: "14px" }}
                >
                  <div>
                    Paciente:{" "}
                    <span className="text-[var(--color-text)]">
                      -
                    </span>
                  </div>
                  <div>
                    Servicio:{" "}
                    <span className="text-[var(--color-text)]">
                      -
                    </span>
                  </div>
                  <div>
                    Fecha:{" "}
                    <span className="text-[var(--color-text)]">
                      -
                    </span>
                  </div>
                  <div>
                    Hora:{" "}
                    <span className="text-[var(--color-text)]">
                      -
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-[var(--color-border)] px-6 py-4 flex gap-3 justify-end">
              <button
                onClick={() => setShowNewCitaModal(false)}
                className="px-6 py-2.5 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors"
              >
                Cancelar
              </button>
              <button className="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[#7A6349] transition-colors">
                Agendar Cita
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}