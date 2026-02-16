import { useForm } from "react-hook-form";
import { Appointment } from "../types/appoiment.type";
import { Calendar, Clock, X } from "lucide-react";
import DatePicker from "react-datepicker";
import { AlertErrorInput } from "../../../components/ui/alert";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { ClinicBusinessHour } from "../../settings/types/clinic_business_hour.type";
import { ClinicService } from "../../settings/services/clinic.service";
import { message } from "../../../components/shared/message/message";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { estadosConfig } from "../utils/utils";

// Extender dayjs con plugins
dayjs.extend(customParseFormat);
dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

interface ReagendarModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: Partial<Appointment>) => void;
  currentAppointment: Appointment;
  existingAppointments: Appointment[];
}

export const ReagendarModal = ({
  open,
  onClose,
  onSubmit,
  currentAppointment,
  existingAppointments,
}: ReagendarModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<Partial<Appointment>>({
    defaultValues: {
      date: currentAppointment.date,
      start_time: currentAppointment.start_time,
      duration: currentAppointment.duration,
    },
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [clinicBusinessHours, setClinicBusinessHours] = useState<
    ClinicBusinessHour[]
  >([]);

  const fetchData = async () => {
    try {
      const response = await ClinicService.getClinicBusinessHours();

      setClinicBusinessHours(response);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error(
        "Error al cargar los horarios de la clínica. Por favor, intenta nuevamente.",
      );
    }
  };

  useEffect(() => {
    fetchData();
    if (currentAppointment) {
      reset({
        duration: currentAppointment.duration || 30,
        date: currentAppointment.date || "",
        start_time: currentAppointment.start_time || "",
      });

      setSelectedDate(
        currentAppointment.date
          ? dayjs(currentAppointment.date, "YYYY-MM-DD").toDate()
          : null,
      );
      setSelectedTime(
        currentAppointment.start_time
          ? dayjs(currentAppointment.start_time, "HH:mm").toDate()
          : null,
      );
    } else {
      reset({
        duration: 30,
        date: "",
        start_time: "",
      });
      setSelectedDate(null);
      setSelectedTime(null);
    }
  }, [currentAppointment]);

  const handleOnClose = () => {
    onClose();
    reset({});
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const checkTimeConflict = (
    data: Partial<Appointment>,
  ): {
    hasConflict: boolean;
    conflictingAppointment?: Appointment;
  } => {
    if (!data.date || !data.start_time || !data.duration) {
      return { hasConflict: false };
    }

    const newStart = dayjs(
      `${data.date} ${data.start_time}`,
      "YYYY-MM-DD HH:mm",
    );
    const newEnd = newStart.add(data.duration, "minute");

    // Buscar conflictos en las citas existentes
    for (const apt of existingAppointments) {
      // Ignorar la cita actual si estamos editando
      if (currentAppointment?.id && apt.id === currentAppointment.id) continue;

      // Ignorar citas canceladas
      if (apt.status === "CANCELADO") continue;

      // Solo verificar citas del mismo día
      if (apt.date !== data.date) continue;

      const aptStart = dayjs(
        `${apt.date} ${apt.start_time}`,
        "YYYY-MM-DD HH:mm",
      );
      const aptEnd = aptStart.add(apt.duration, "minute");

      const overlaps =
        (newStart.isSameOrAfter(aptStart) && newStart.isBefore(aptEnd)) || // Comienza durante
        (newEnd.isAfter(aptStart) && newEnd.isSameOrBefore(aptEnd)) || // Termina durante
        (newStart.isBefore(aptStart) && newEnd.isAfter(aptEnd)); // Envuelve

      if (overlaps) {
        return { hasConflict: true, conflictingAppointment: apt };
      }
    }

    return { hasConflict: false };
  };

  const onFinish = (values: Partial<Appointment>) => {
    console.log("Datos a enviar para reagendar:", values);
    // Validar conflictos de horario antes de enviar
    const { hasConflict, conflictingAppointment } = checkTimeConflict(values);

    if (hasConflict && conflictingAppointment) {
      const conflictTime = dayjs(
        `${conflictingAppointment.date} ${conflictingAppointment.start_time}`,
        "YYYY-MM-DD HH:mm",
      );
      const conflictEndTime = conflictTime.add(
        conflictingAppointment.duration,
        "minute",
      );

      message.warning(
        `Ya existe una cita reservada para el ${conflictTime.format("DD/MM/YYYY")} ` +
          `de ${conflictTime.format("HH:mm")} a ${conflictEndTime.format("HH:mm")} ` +
          `con ${conflictingAppointment.patient?.fullName || "otro paciente"}. ` +
          `Por favor, selecciona otro horario.`,
      );
      return;
    }

    onSubmit(values);
    handleOnClose();
  };

  const isDateAvailable = (date: Date): boolean => {
    if (!date) return false;
    const dayOfWeek = dayjs(date).day();

    const businessHour = clinicBusinessHours.find(
      (bh) => bh.day_of_week === dayOfWeek,
    );

    return businessHour ? !businessHour.is_closed : false;
  };

  const getDayName = (dayOfWeek: number): string => {
    const days = [
      "domingo",
      "lunes",
      "martes",
      "miércoles",
      "jueves",
      "viernes",
      "sábado",
    ];
    return days[dayOfWeek];
  };

  const handleDateChange = (dateValue: Date | null) => {
    if (!dateValue) {
      setSelectedDate(null);
      setValue("date", "");
      return;
    }

    if (!isDateAvailable(dateValue)) {
      const dayOfWeek = dayjs(dateValue).day();
      const dayName = getDayName(dayOfWeek);

      message.info(
        `La clínica está cerrada los ${dayName}s. Por favor, selecciona otra fecha.`,
      );
      setSelectedDate(null);
      setValue("date", "");
      return;
    }

    setSelectedDate(dateValue);
    setSelectedTime(null); // Reset time when date changes
    setValue("start_time", "");
    const dateString = dayjs(dateValue).format("YYYY-MM-DD");
    setValue("date", dateString);
  };

  const { minTime, maxTime } = useMemo(() => {
    if (!selectedDate || clinicBusinessHours.length === 0) {
      return { minTime: undefined, maxTime: undefined };
    }

    const dayOfWeek = dayjs(selectedDate).day();
    const businessHour = clinicBusinessHours.find(
      (bh) => bh.day_of_week === dayOfWeek,
    );

    if (!businessHour || businessHour.is_closed) {
      return { minTime: undefined, maxTime: undefined };
    }

    const [openHour, openMinute] = businessHour.open_time
      .split(":")
      .map(Number);
    const [closeHour, closeMinute] = businessHour.close_time
      .split(":")
      .map(Number);

    return {
      minTime: dayjs(selectedDate).hour(openHour).minute(openMinute).toDate(),
      maxTime: dayjs(selectedDate).hour(closeHour).minute(closeMinute).toDate(),
    };
  }, [selectedDate, clinicBusinessHours]);

  const handleTimeChange = (time: Date | null) => {
    if (!time) {
      setSelectedTime(null);
      setValue("start_time", "");
      return;
    }

    setSelectedTime(time);
    const timeString = dayjs(time).format("HH:mm");
    setValue("start_time", timeString);
  };

  const estado = estadosConfig[currentAppointment.status];

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit(onFinish)}
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 space-y-5">
          <div className="sticky top-0 z-10 bg-white border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between">
            <h2 className="font-['Cormorant_Garamond']">Reagendar Cita</h2>
            <button
              type="button"
              onClick={handleOnClose}
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <div
            key={currentAppointment.id}
            className="p-4 border border-[var(--color-border)] rounded-lg cursor-pointer hover:bg-[#F5F2EF] transition-colors"
            style={{
              borderLeft: `4px solid ${estado.color}`,
            }}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold">
                  {currentAppointment.patient?.fullName}
                </div>
                <div className="text-sm text-[var(--color-text-secondary)]">
                  {currentAppointment.service?.name}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">
                  {dayjs(currentAppointment.date)
                    .locale("es")
                    .format("dddd, DD/MMM/YYYY")}
                </div>
                <div className="flex items-center gap-2 justify-end text-sm text-[var(--color-text-secondary)]">
                  <span className="inline-flex items-center gap-1">
                    <Clock size={16} />
                  </span>
                  {dayjs(
                    `${currentAppointment.date} ${currentAppointment.start_time}`,
                    "YYYY-MM-DD HH:mm",
                  ).format("HH:mm")}
                </div>
              </div>
            </div>
            <div className="mt-2">
              <span
                className="inline-block px-2 py-1 rounded-full text-xs"
                style={{
                  backgroundColor: estado.bgColor,
                  color: estado.color,
                }}
              >
                {estado.label}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2" style={{ fontWeight: 600 }}>
                Fecha *
              </label>
              <div className="relative z-10">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]">
                  <Calendar size={16} />
                </span>
                <DatePicker
                  locale="es"
                  selected={selectedDate}
                  onChange={(date: Date | null) => handleDateChange(date)}
                  filterDate={(date) => {
                    const day = dayjs(date).day();
                    const businessHour = clinicBusinessHours.find(
                      (bh) => bh.day_of_week === day,
                    );
                    return businessHour ? !businessHour.is_closed : false;
                  }}
                  minDate={new Date()}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Selecciona una fecha"
                  className="w-full px-4 py-2.5 pl-8 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>
              <input
                type="hidden"
                {...register("date", {
                  required: "La fecha es requerida.",
                })}
              />
              {errors.date && (
                <AlertErrorInput
                  message={errors.date.message || "La fecha es requerida."}
                />
              )}
            </div>
            <div>
              <label className="block mb-2" style={{ fontWeight: 600 }}>
                Hora de Inicio *
              </label>
              <div className="relative z-10">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]">
                  <Clock size={16} />
                </span>
                <DatePicker
                  locale="es"
                  selected={selectedTime}
                  onChange={(time: Date | null) => handleTimeChange(time)}
                  showTimeSelect
                  showTimeSelectOnly
                  minTime={minTime}
                  maxTime={maxTime}
                  timeIntervals={30}
                  dateFormat="HH:mm"
                  timeFormat="HH:mm"
                  placeholderText={
                    !selectedDate
                      ? "Primero selecciona una fecha"
                      : !minTime || !maxTime
                        ? "No hay horarios disponibles"
                        : "Selecciona una hora"
                  }
                  disabled={!selectedDate || !minTime || !maxTime}
                  className="w-full px-4 py-2.5 pl-8 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <input
                type="hidden"
                {...register("start_time", {
                  required: "La hora de inicio es requerida.",
                })}
              />
              {errors.start_time && (
                <AlertErrorInput
                  message={
                    errors.start_time.message ||
                    "La hora de inicio es requerida."
                  }
                />
              )}
            </div>
          </div>
          <div>
            <label className="block mb-2" style={{ fontWeight: 600 }}>
              Duración
            </label>
            <select
              {...register("duration", {
                required: "La duración es requerida.",
              })}
              className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
            >
              <option value="30">30 minutos</option>
              <option value="45">45 minutos</option>
              <option value="60">1 hora</option>
              <option value="90">1.5 horas</option>
              <option value="120">2 horas</option>
            </select>
          </div>
          {errors.duration && (
            <AlertErrorInput
              message={errors.duration.message || "La duración es requerida."}
            />
          )}
        </div>
        <div className="sticky bottom-0 bg-white border-t border-[var(--color-border)] px-6 py-4 flex gap-3 justify-end">
          <button
            type="button"
            onClick={handleOnClose}
            className="px-6 py-2.5 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[#7A6349] transition-colors"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};
