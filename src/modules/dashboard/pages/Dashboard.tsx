import React from "react";
import {
  Calendar,
  Wallet,
  UserPlus,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Package,
  Cake,
  Plus,
  ArrowUpRight,
  TrendingUp,
  User,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";

interface DashboardProps {}

export function Dashboard({}: DashboardProps) {
  const { authUser } = useAuth();

  const greetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 19) return "Buenas tardes";
    return "Buenas noches";
  };

  const todayDate = () => {
    const now = new Date();
    const days = [
      "domingo",
      "lunes",
      "martes",
      "miércoles",
      "jueves",
      "viernes",
      "sábado",
    ];
    const months = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];
    return `${days[now.getDay()]} ${now.getDate()} de ${months[now.getMonth()]}`;
  };

  const appointments = [
    {
      time: "9:00 AM",
      patient: "María García López",
      service: "Limpieza facial profunda",
      duration: "45 min",
      status: "confirmed",
    },
    {
      time: "10:00 AM",
      patient: "Laura Méndez Silva",
      service: "Aplicación de plasma rico",
      duration: "60 min",
      status: "pending",
    },
    {
      time: "11:30 AM",
      patient: "Patricia Ruiz",
      service: "Tratamiento de rejuvenecimiento",
      duration: "90 min",
      status: "confirmed",
    },
    {
      time: "2:00 PM",
      patient: "Andrea Soto Ramírez",
      service: "Limpieza básica + hidratación",
      duration: "45 min",
      status: "in-progress",
    },
    {
      time: "3:30 PM",
      patient: "Carmen Villegas",
      service: "Microdermoabrasión",
      duration: "50 min",
      status: "pending",
    },
  ];

  const notifications = [
    {
      type: "warning",
      icon: Package,
      text: "Stock bajo: Ácido hialurónico (3 unidades)",
      color: "var(--color-warning)",
    },
    {
      type: "info",
      icon: Calendar,
      text: "Cita sin confirmar: Laura Méndez 11:00 AM",
      color: "var(--color-info)",
    },
    {
      type: "success",
      icon: Cake,
      text: "Cumpleaños mañana: Patricia Ruiz",
      color: "var(--color-success)",
    },
  ];

  const recentActivity = [
    {
      type: "sale",
      icon: ShoppingBag,
      text: "Venta completada - Paquete Facial Premium - $3,200",
      time: "hace 15 min",
      color: "var(--color-success)",
    },
    {
      type: "appointment",
      icon: Calendar,
      text: "Nueva cita agendada - Andrea Soto - 29 Nov 10:00 AM",
      time: "hace 1 hora",
      color: "var(--color-info)",
    },
    {
      type: "patient",
      icon: User,
      text: "Paciente registrado - Carmen Villegas",
      time: "hace 2 horas",
      color: "var(--color-primary)",
    },
    {
      type: "sale",
      icon: ShoppingBag,
      text: "Venta completada - Tratamiento rejuvenecimiento - $2,800",
      time: "hace 3 horas",
      color: "var(--color-success)",
    },
    {
      type: "appointment",
      icon: Calendar,
      text: "Cita completada - María García - Limpieza facial",
      time: "hace 4 horas",
      color: "var(--color-info)",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Sección 1: Saludo */}
      <div className="bg-gradient-to-r from-[#8B7355]/5 via-[#D4A574]/5 to-transparent rounded-xl p-6 border border-[var(--color-border)]">
        <h2 className="mb-1">
          {greetingTime()}, {authUser?.username} 👋
        </h2>
        <p className="text-[var(--color-text-secondary)]">
          Aquí está el resumen de hoy, {todayDate()}
        </p>
      </div>
      {/* Sección 2: Métricas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 - Citas de Hoy */}
        <div className="bg-white rounded-xl p-6 border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-[#8B7355]/15 flex items-center justify-center">
              <Calendar
                size={24}
                strokeWidth={1.5}
                className="text-[var(--color-primary)]"
              />
            </div>
            <ArrowUpRight
              size={20}
              strokeWidth={1.5}
              className="text-[var(--color-text-secondary)]"
            />
          </div>
          <h3 className="mb-1">8</h3>
          <p className="text-[var(--color-text-secondary)] mb-2">
            Citas programadas
          </p>
          <p
            className="text-[var(--color-primary)]"
            style={{ fontSize: "14px" }}
          >
            2 confirmadas, 6 pendientes
          </p>
        </div>

        {/* Card 2 - Ingresos del Día */}
        <div className="bg-white rounded-xl p-6 border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-[#7DB07D]/15 flex items-center justify-center">
              <Wallet
                size={24}
                strokeWidth={1.5}
                className="text-[var(--color-success)]"
              />
            </div>
            <div
              className="flex items-center gap-1 text-[var(--color-success)]"
              style={{ fontSize: "14px" }}
            >
              <TrendingUp size={16} strokeWidth={2} />
              <span>+15%</span>
            </div>
          </div>
          <h3 className="mb-1">$12,450</h3>
          <p className="text-[var(--color-text-secondary)] mb-2">
            Ingresos de hoy
          </p>
          <p
            className="text-[var(--color-success)]"
            style={{ fontSize: "14px" }}
          >
            +15% vs ayer
          </p>
        </div>

        {/* Card 3 - Pacientes Nuevos */}
        <div className="bg-white rounded-xl p-6 border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-[#7BA3B0]/15 flex items-center justify-center">
              <UserPlus
                size={24}
                strokeWidth={1.5}
                className="text-[var(--color-info)]"
              />
            </div>
            <ArrowUpRight
              size={20}
              strokeWidth={1.5}
              className="text-[var(--color-text-secondary)]"
            />
          </div>
          <h3 className="mb-1">23</h3>
          <p className="text-[var(--color-text-secondary)] mb-2">
            Pacientes nuevos
          </p>
          <p className="text-[var(--color-info)]" style={{ fontSize: "14px" }}>
            este mes
          </p>
        </div>

        {/* Card 4 - Cotizaciones Pendientes */}
        <div className="bg-white rounded-xl p-6 border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-[#E0A75E]/15 flex items-center justify-center">
              <FileText
                size={24}
                strokeWidth={1.5}
                className="text-[var(--color-warning)]"
              />
            </div>
            <ArrowUpRight
              size={20}
              strokeWidth={1.5}
              className="text-[var(--color-text-secondary)]"
            />
          </div>
          <h3 className="mb-1">5</h3>
          <p className="text-[var(--color-text-secondary)] mb-2">Por cerrar</p>
          <p
            className="text-[var(--color-warning)]"
            style={{ fontSize: "14px" }}
          >
            Valor: $34,200
          </p>
        </div>
      </div>

      {/* Sección 3: Dos Columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda - Citas de Hoy */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[var(--color-border)] shadow-sm">
          <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between">
            <h4>Citas de hoy</h4>
            <button className="flex items-center gap-2 text-[var(--color-primary)] hover:underline transition-all">
              <span style={{ fontSize: "14px" }}>Ver agenda completa</span>
              <ArrowRight size={16} strokeWidth={1.5} />
            </button>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {appointments.map((apt, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-lg hover:bg-[var(--color-bg)] transition-all border border-transparent hover:border-[var(--color-border)]"
                >
                  <div className="text-center min-w-[70px]">
                    <p
                      className="text-[var(--color-primary)]"
                      style={{ fontSize: "16px", fontWeight: 600 }}
                    >
                      {apt.time}
                    </p>
                    <p
                      className="text-[var(--color-text-secondary)]"
                      style={{ fontSize: "12px" }}
                    >
                      {apt.duration}
                    </p>
                  </div>

                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B7355] to-[#D4A574] flex items-center justify-center text-white flex-shrink-0">
                    <span style={{ fontSize: "14px", fontWeight: 600 }}>
                      {apt.patient
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      style={{ fontSize: "15px", fontWeight: 500 }}
                      className="truncate"
                    >
                      {apt.patient}
                    </p>
                    <p
                      className="text-[var(--color-text-secondary)] truncate"
                      style={{ fontSize: "14px" }}
                    >
                      {apt.service}
                    </p>
                  </div>

                  <div>
                    {apt.status === "confirmed" && (
                      <span
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#7DB07D]/15 text-[var(--color-success)]"
                        style={{ fontSize: "13px" }}
                      >
                        <CheckCircle size={14} strokeWidth={2} />
                        Confirmada
                      </span>
                    )}
                    {apt.status === "pending" && (
                      <span
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#E0A75E]/15 text-[var(--color-warning)]"
                        style={{ fontSize: "13px" }}
                      >
                        <Clock size={14} strokeWidth={2} />
                        Pendiente
                      </span>
                    )}
                    {apt.status === "in-progress" && (
                      <span
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#7BA3B0]/15 text-[var(--color-info)]"
                        style={{ fontSize: "13px" }}
                      >
                        <Clock size={14} strokeWidth={2} />
                        En curso
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Columna Derecha - Notificaciones y Acciones Rápidas */}
        <div className="space-y-6">
          {/* Card - Alertas y Notificaciones */}
          <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-sm">
            <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h5>Notificaciones</h5>
                <span
                  className="w-6 h-6 rounded-full bg-[var(--color-error)] text-white flex items-center justify-center"
                  style={{ fontSize: "12px", fontWeight: 600 }}
                >
                  {notifications.length}
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {notifications.map((notif, index) => {
                  const Icon = notif.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-[var(--color-bg)] transition-all"
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${notif.color}15` }}
                      >
                        <Icon
                          size={16}
                          strokeWidth={1.5}
                          style={{ color: notif.color }}
                        />
                      </div>
                      <p
                        className="text-[var(--color-text)]"
                        style={{ fontSize: "14px", lineHeight: "1.5" }}
                      >
                        {notif.text}
                      </p>
                    </div>
                  );
                })}
              </div>
              <button
                className="mt-4 w-full text-center text-[var(--color-primary)] hover:underline transition-all"
                style={{ fontSize: "14px" }}
              >
                Ver todas
              </button>
            </div>
          </div>

          {/* Card - Acciones Rápidas */}
          <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-sm">
            <div className="p-6 border-b border-[var(--color-border)]">
              <h5>Acciones rápidas</h5>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-3">
                <button className="flex flex-col items-center gap-2 p-4 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all group">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/15 group-hover:bg-[var(--color-primary)]/25 flex items-center justify-center transition-all">
                    <Plus
                      size={20}
                      strokeWidth={1.5}
                      className="text-[var(--color-primary)]"
                    />
                  </div>
                  <span
                    className="text-[var(--color-text)]"
                    style={{ fontSize: "13px", fontWeight: 500 }}
                  >
                    Nueva cita
                  </span>
                </button>

                <button className="flex flex-col items-center gap-2 p-4 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all group">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/15 group-hover:bg-[var(--color-primary)]/25 flex items-center justify-center transition-all">
                    <UserPlus
                      size={20}
                      strokeWidth={1.5}
                      className="text-[var(--color-primary)]"
                    />
                  </div>
                  <span
                    className="text-[var(--color-text)]"
                    style={{ fontSize: "13px", fontWeight: 500 }}
                  >
                    Nuevo paciente
                  </span>
                </button>

                <button className="flex flex-col items-center gap-2 p-4 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all group">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/15 group-hover:bg-[var(--color-primary)]/25 flex items-center justify-center transition-all">
                    <FileText
                      size={20}
                      strokeWidth={1.5}
                      className="text-[var(--color-primary)]"
                    />
                  </div>
                  <span
                    className="text-[var(--color-text)]"
                    style={{ fontSize: "13px", fontWeight: 500 }}
                  >
                    Nueva cotización
                  </span>
                </button>

                <button className="flex flex-col items-center gap-2 p-4 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all group">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/15 group-hover:bg-[var(--color-primary)]/25 flex items-center justify-center transition-all">
                    <ShoppingBag
                      size={20}
                      strokeWidth={1.5}
                      className="text-[var(--color-primary)]"
                    />
                  </div>
                  <span
                    className="text-[var(--color-text)]"
                    style={{ fontSize: "13px", fontWeight: 500 }}
                  >
                    Registrar venta
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección 4: Actividad Reciente */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-sm">
        <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between">
          <h4>Última actividad</h4>
          <div className="flex items-center gap-2">
            <select
              className="px-3 py-2 border border-[var(--color-border)] rounded-lg text-[var(--color-text-secondary)] focus:border-[var(--color-primary)] focus:outline-none transition-all"
              style={{ fontSize: "14px" }}
            >
              <option>Todos</option>
              <option>Ventas</option>
              <option>Citas</option>
              <option>Pacientes</option>
            </select>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivity.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div
                  key={index}
                  className="flex items-start gap-4 pb-4 border-b border-[var(--color-border)] last:border-0 last:pb-0"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                    style={{ backgroundColor: `${activity.color}15` }}
                  >
                    <Icon
                      size={18}
                      strokeWidth={1.5}
                      style={{ color: activity.color }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[var(--color-text)]"
                      style={{ fontSize: "15px" }}
                    >
                      {activity.text}
                    </p>
                    <p
                      className="text-[var(--color-text-secondary)] mt-1"
                      style={{ fontSize: "13px" }}
                    >
                      {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <button className="mt-6 w-full text-center text-[var(--color-primary)] hover:underline transition-all flex items-center justify-center gap-2">
            <span style={{ fontSize: "14px" }}>Ver historial completo</span>
            <ArrowRight size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
