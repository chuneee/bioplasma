import { Appointment } from "../types/appoiment.type";

export type ViewMode = "week" | "day" | "month";
export type EstadoCita =
  | "confirmada"
  | "pendiente"
  | "en-curso"
  | "completada"
  | "cancelada"
  | "no-asistio";

export const getWeekDays = (date: Date) => {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay() + 1); // Lunes

  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    return day;
  });
};

export const isToday = (date: Date) => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const getFilteredCitas = (
  date: Date,
  data: Appointment[],
  searchTerm: string,
  filterEstado: string[],
) => {
  const dateStr = date.toISOString().split("T")[0];

  // Función para remover acentos
  const removeAccents = (str: string) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  return data.filter((cita) => {
    // Normalizar la fecha de la cita para comparar solo YYYY-MM-DD
    const citaDateStr = cita.date.split("T")[0];
    const matchesDate = citaDateStr === dateStr;

    // Búsqueda mejorada con normalización de acentos
    const searchNormalized = removeAccents(searchTerm.trim().toLowerCase());

    const nombreNormalizado = removeAccents(
      (cita.patient?.fullName || "").toLowerCase(),
    );
    const emailNormalizado = removeAccents(
      (cita.patient?.email || "").toLowerCase(),
    );
    const servicioNormalizado = removeAccents(
      (cita.service?.name || "").toLowerCase(),
    );
    const telefono = cita.patient?.principalPhoneNumber || "";

    const matchesSearch =
      searchTerm === "" ||
      nombreNormalizado.includes(searchNormalized) ||
      emailNormalizado.includes(searchNormalized) ||
      telefono.includes(searchTerm.trim()) ||
      servicioNormalizado.includes(searchNormalized);

    const matchesEstado =
      filterEstado.includes("todas") || filterEstado.includes(cita.status);

    return matchesDate && matchesSearch && matchesEstado;
  });
};
export const getCitaPosition = (horaInicio: string, duracion: number) => {
  const [hours, minutes] = horaInicio.split(":").map(Number);
  const startMinutes = (hours - 8) * 60 + minutes;
  const top = (startMinutes / 60) * 80; // 80px por hora
  const height = (duracion / 60) * 80;
  return { top, height };
};

export const estadosConfig = {
  CONFIRMADO: {
    label: "Confirmada",
    color: "#7DB07D",
    bgColor: "#7DB07D15",
  },
  PENDIENTE: {
    label: "Pendiente",
    color: "#E0A75E",
    bgColor: "#E0A75E15",
  },
  EN_CURSO: {
    label: "En Curso",
    color: "#8B7355",
    bgColor: "#8B735515",
  },
  CANCELADO: {
    label: "Cancelada",
    color: "#6B6560",
    bgColor: "#6B656015",
  },
  COMPLETADO: {
    label: "Completada",
    color: "#C67B7B",
    bgColor: "#C67B7B15",
  },
  "NO PRESENTE": {
    label: "No asistió",
    color: "#C67B7B",
    bgColor: "#C67B7B15",
  },
};
