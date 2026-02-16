import { Calendar, X, Clock } from "lucide-react";
import { Appointment } from "../types/appoiment.type";
import { set, useForm } from "react-hook-form";
import { useEffect, useState, useRef, useMemo } from "react";
import { Patient } from "../../patients/types/patient.type";
import { Service } from "../../services/types/service.type";
import { PatientService } from "../../patients/services/patient.service";
import { formatCurrency } from "../../../utils/utils";
import { AlertErrorInput } from "../../../components/ui/alert";
import { ClinicService } from "../../settings/services/clinic.service";
import { ClinicBusinessHour } from "../../settings/types/clinic_business_hour.type";
import { ServicesService } from "../../services/services/services.service";
import { message } from "../../../components/shared/message/message";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale/es";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

// Extender dayjs con plugins
dayjs.extend(customParseFormat);
dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

// Registrar el locale español
registerLocale("es", es);

interface CitasFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: Partial<Appointment>) => void;
  currentData?: Partial<Appointment>;
  existingAppointments?: Appointment[];
}

export const CitasFormModal = ({
  open,
  onClose,
  onSubmit,
  currentData,
  existingAppointments = [],
}: CitasFormModalProps) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [clinicBusinessHours, setClinicBusinessHours] = useState<
    ClinicBusinessHour[]
  >([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<Partial<Appointment>>();

  const fetchData = async () => {
    try {
      const [patientsData, servicesData, clinicBusinessHours] =
        await Promise.all([
          PatientService.getPatients(),
          ServicesService.getServicios(),
          ClinicService.getClinicBusinessHours(),
        ]);

      setPatients(patientsData.filter((patient: Patient) => patient.isActive));
      setServices(servicesData.filter((service: Service) => service.isActive));
      setClinicBusinessHours(clinicBusinessHours);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (currentData) {
      reset({
        notes: currentData.notes || "",
        duration: currentData.duration || 30,
        status: currentData.status || "PENDIENTE",
        date: currentData.date || "",
        start_time: currentData.start_time || "",
      });

      if (currentData.service?.id) {
        setValue("service", currentData.service.id as any);
        const service = services.find((s) => s.id === currentData.service?.id);
        setSelectedService(service || null);
      }
      if (currentData.patient?.uuid) {
        setValue("patient", currentData.patient.uuid as any);
      }

      setSelectedDate(
        currentData.date
          ? dayjs(currentData.date, "YYYY-MM-DD").toDate()
          : null,
      );
      setSelectedTime(
        currentData.start_time
          ? dayjs(currentData.start_time, "HH:mm").toDate()
          : null,
      );
      const patient = patients.find(
        (p) => p.uuid === currentData.patient?.uuid,
      ) as Patient;
      setSelectedPatient(patient || null);
      setSearchTerm(patient ? patient.fullName : "");
    } else {
      setSelectedDate(null);
      setSelectedTime(null);
      setSelectedPatient(null);
      setSearchTerm("");
      setSelectedService(null);
    }
  }, [currentData, patients]);

  const handleOnClose = () => {
    onClose();
    reset();
    setSearchTerm("");
    setSelectedPatient(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedService(null);
  };

  // Función para validar si hay conflicto de horarios
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
      if (currentData?.id && apt.id === currentData.id) continue;

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

  const onFinish = (data: Partial<Appointment>) => {
    // Validar conflictos de horario antes de enviar
    const { hasConflict, conflictingAppointment } = checkTimeConflict(data);

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
    onSubmit?.(data);
    handleOnClose();
  };

  // Filtrar pacientes según el término de búsqueda
  const filteredPatients = searchTerm
    ? patients.filter(
        (patient) =>
          patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.principalPhoneNumber.includes(searchTerm),
      )
    : patients;

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setSearchTerm(patient.fullName);
    setShowDropdown(false);
    setValue("patient", patient.uuid as any);
  };

  // Verificar si una fecha está disponible según el horario de la clínica
  const isDateAvailable = (date: Date): boolean => {
    if (!date) return false;
    const dayOfWeek = dayjs(date).day();

    const businessHour = clinicBusinessHours.find(
      (bh) => bh.day_of_week === dayOfWeek,
    );

    return businessHour ? !businessHour.is_closed : false;
  };

  // Obtener nombre del día de la semana
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

  // Calcular min y max time basado en la fecha seleccionada
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

  // Validar que la fecha seleccionada esté disponible
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

  // Manejar cambio de hora
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

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const serviceId = e.target.value;
    const service = services.find((s) => s.id === serviceId) || null;
    setSelectedService(service);
    setValue("service", serviceId as any);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit(onFinish)}
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 z-10 bg-white border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between">
          <h2 className="font-['Cormorant_Garamond']">Nueva Cita</h2>
          <button
            type="button"
            onClick={handleOnClose}
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Paciente */}
          <div ref={dropdownRef} className="">
            <label className="block mb-2" style={{ fontWeight: 600 }}>
              Paciente *
            </label>
            <div className="stack relative ">
              <input
                type="text"
                autoComplete={"off"}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(true);
                  if (!e.target.value) {
                    setSelectedPatient(null);
                    setValue("patient", undefined); // Limpiar el UUID también
                  }
                }}
                onFocus={() => setShowDropdown(true)}
                className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                placeholder="Buscar paciente..."
              />

              {/* Campo oculto para el UUID del paciente */}
              <input
                type="hidden"
                {...register("patient", {
                  required: "El paciente es requerido.",
                })}
              />

              {/* Dropdown de resultados */}
              {showDropdown && filteredPatients.length > 0 && (
                <div className="absolute w-full mt-1 bg-white border border-[var(--color-border)] rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
                  {filteredPatients.map((patient) => (
                    <div
                      key={patient.uuid}
                      onClick={() => handlePatientSelect(patient)}
                      className="px-4 py-3 hover:bg-[#F5F2EF] cursor-pointer border-b border-[var(--color-border)] last:border-b-0"
                    >
                      <div className="font-medium text-[var(--color-text)]">
                        {patient.fullName}
                      </div>
                      <div className="text-sm text-[var(--color-text-secondary)] mt-1">
                        {patient.email} • {patient.principalPhoneNumber}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {errors.patient && (
              <AlertErrorInput
                message={errors.patient.message || "El paciente es requerido."}
              />
            )}

            {/* Mensaje cuando no hay resultados */}
            {showDropdown && searchTerm && filteredPatients.length === 0 && (
              <div className="absolute w-full mt-1 bg-white border border-[var(--color-border)] rounded-lg shadow-lg p-4 text-center text-[var(--color-text-secondary)]">
                No se encontraron pacientes
              </div>
            )}

            {/* <button
              type="button"
              className="mt-2 text-[var(--color-primary)] hover:underline"
              style={{ fontSize: "14px" }}
            >
              + Crear nuevo paciente
            </button> */}
          </div>

          {/* Servicio */}
          <div>
            <label className="block mb-2" style={{ fontWeight: 600 }}>
              Servicio *
            </label>
            <select
              {...register("service", {
                required: "El servicio es requerido.",
              })}
              onChange={handleServiceChange}
              className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
            >
              <option value="">Selecciona un servicio</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} -{" "}
                  {Number(service.promoPrice) > 0
                    ? formatCurrency(Number(service.promoPrice))
                    : formatCurrency(Number(service.price))}{" "}
                </option>
              ))}
            </select>
            <div
              hidden={!selectedService}
              className="mt-2 text-[var(--color-secondary)]"
              style={{ fontSize: "14px" }}
            >
              <Clock size={16} className="inline mb-1" /> Duración:{" "}
              {selectedService?.durationMinutes} min
            </div>
            {errors.service && (
              <AlertErrorInput
                message={errors.service.message || "El servicio es requerido."}
              />
            )}
          </div>

          {/* Fecha y Hora */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2" style={{ fontWeight: 600 }}>
                Fecha *
              </label>
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
                className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
              />
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
                className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
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

          {/* Duración */}
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
              <option value="90">1 hora 30 minutos</option>
              <option value="120">2 horas</option>
            </select>
          </div>
          {errors.duration && (
            <AlertErrorInput
              message={errors.duration.message || "La duración es requerida."}
            />
          )}

          {/* Notas */}
          <div>
            <label className="block mb-2" style={{ fontWeight: 600 }}>
              Notas
            </label>
            <textarea
              {...register("notes")}
              rows={3}
              className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] resize-none"
              placeholder="Instrucciones especiales, preparación previa..."
            />
          </div>

          {/* Estado inicial */}
          <div>
            <label className="block mb-2" style={{ fontWeight: 600 }}>
              Estado Inicial
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  {...register("status", {
                    required: "El estado es requerido.",
                  })}
                  type="radio"
                  name="estado"
                  value="PENDIENTE"
                  defaultChecked
                />
                <span>Pendiente por confirmar</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  {...register("status", {
                    required: "El estado es requerido.",
                  })}
                  type="radio"
                  name="estado"
                  value="CONFIRMADO"
                />
                <span>Confirmada</span>
              </label>
            </div>
            {errors.status && (
              <AlertErrorInput
                message={errors.status.message || "El estado es requerido."}
              />
            )}
          </div>

          {/* Preview */}
          <div className="bg-[#FDFBF9] rounded-lg border border-[var(--color-border)] p-4">
            <h4 className="mb-3" style={{ fontWeight: 600 }}>
              Resumen
            </h4>
            <div
              className="space-y-2 text-[var(--color-text-secondary)]"
              style={{ fontSize: "14px" }}
            >
              <div>
                Paciente:{" "}
                <span className="text-[var(--color-text]">
                  {selectedPatient?.fullName || "-"}
                </span>
              </div>
              <div>
                Servicio:{" "}
                <span className="text-[var(--color-text)]">
                  {selectedService?.name || "-"} -{" "}
                  {selectedService?.promoPrice &&
                  Number(selectedService.promoPrice) > 0
                    ? formatCurrency(Number(selectedService.promoPrice))
                    : selectedService
                      ? formatCurrency(Number(selectedService.price))
                      : "-"}
                </span>
              </div>
              <div>
                Fecha:{" "}
                <span className="text-[var(--color-text)]">
                  {selectedDate
                    ? dayjs(selectedDate).format("DD/MM/YYYY")
                    : "-"}
                </span>
              </div>
              <div>
                Hora:{" "}
                <span className="text-[var(--color-text)]">
                  {watch("start_time") || "-"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
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
            Agendar Cita
          </button>
        </div>
      </form>
    </div>
  );
};
