import { useEffect, useState } from "react";
import { Cotizacion } from "../utils/utils";
import { formatCurrency } from "../../../utils/utils";
import {
  AlertTriangle,
  Banknote,
  Calendar,
  Clock,
  CreditCard,
  Smartphone,
  Sparkles,
  WalletCards,
} from "lucide-react";
import { Quotation } from "../types/quotation.type";
import { set, useForm } from "react-hook-form";
import {
  SaleFromQuote,
  SaleFromQuoteItem,
} from "../../sales/types/sale-from-quote.type";
import { AlertErrorInput } from "../../../components/ui/alert";
import { PaymentMethodService } from "../../settings/services/payment-method.service";
import { paymentMethods } from "../../sales/types/sale.type";
import { PaymentMethod } from "../../settings/types/payment-methods.type";
import { message } from "../../../components/shared/message/message";
import dayjs from "dayjs";
import { AppointmentService } from "../../appointments/services/appointment.service";
import { ClinicService } from "../../settings/services/clinic.service";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale/es";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import React, { forwardRef } from "react";

dayjs.extend(customParseFormat);
dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
registerLocale("es", es);

interface SaleQuoteModalProps {
  open: boolean;
  onClose: () => void;
  dataSource: Quotation | null;
  onSubmit: (data: any) => void;
}

export const SaleQuoteModal = ({
  open,
  dataSource,
  onClose,
  onSubmit,
}: SaleQuoteModalProps) => {
  if (!open) return null;
  const [selectedCotizacion, setSelectedCotizacion] =
    useState<Quotation | null>(dataSource);

  const [paymentMethodsConfig, setPaymentMethodsConfig] =
    useState<PaymentMethod>({} as PaymentMethod);

  const [metodoPago, setMetodoPago] = useState<paymentMethods>();

  const [applyAppointment, setApplyAppointment] = useState<boolean>(false);
  const [items, setItems] = useState<SaleFromQuoteItem[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<Partial<SaleFromQuote>>();

  // Debes guardar appointmentsData y clinicBusinessHoursData en el estado
  const [appointmentsData, setAppointmentsData] = useState<any[]>([]);
  const [clinicBusinessHoursData, setClinicBusinessHoursData] = useState<any[]>(
    [],
  );

  const initializeData = async () => {
    try {
      const [paymentMethodsData, appointments, clinicBusinessHours] =
        await Promise.all([
          PaymentMethodService.getPaymentMethods(),
          AppointmentService.getAppointments(),
          ClinicService.getClinicBusinessHours(),
        ]);
      setPaymentMethodsConfig(paymentMethodsData);
      setAppointmentsData(appointments);
      setClinicBusinessHoursData(clinicBusinessHours);
    } catch (error) {
      console.error("Error initializing sale form data:", error);
      message.error("Error al cargar datos para la venta. Intenta nuevamente.");
    }
  };

  const [montoRecibido, setMontoRecibido] = useState<number>(0);

  useEffect(() => {
    initializeData();
    setSelectedCotizacion(dataSource);

    if (dataSource?.items) {
      const mappedItems = dataSource.items
        .filter((item) => item.itemType === "SERVICIO")
        .map((item) => ({
          serviceId: item.service.id.toString(),
          date: dayjs().format("YYYY-MM-DD"), // Fecha actual en formato YYYY-MM-DD
          time: "", // Hora por defecto
          duration: 0, // Duración del servicio
        }));
      setItems(mappedItems);
    }
  }, [dataSource]);

  const handleClose = () => {
    setSelectedCotizacion({} as Quotation);
    setMetodoPago(undefined);
    setMontoRecibido(0);
    reset();
    setItems([]);
    setApplyAppointment(false);
    onClose();
  };

  const onFinish = (values: Partial<SaleFromQuote>) => {
    const payload: Partial<SaleFromQuote> = {
      quoteId: selectedCotizacion?.id,
      paymentMethod: values.paymentMethod,
      applyAppointment: values.applyAppointment || false,
    };

    if (applyAppointment && items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        if (!items[i].date || !items[i].time || !items[i].duration) {
          message.error(
            `Completa fecha, hora y duración para el servicio: ${selectedCotizacion?.items[i].service.name}`,
          );
          return;
        }
      }
      payload.items = items;
    }

    console.log("Payload para convertir a venta:", payload);

    onSubmit(payload);

    // handleClose();
  };

  const calcularComision = () => {
    if (!selectedCotizacion) return 0;

    if (
      ["tarjeta-credito", "tarjeta-debito"].includes(metodoPago || "") &&
      paymentMethodsConfig.card_commission > 0
    ) {
      return (
        Number(
          Number(selectedCotizacion.total) *
            Number(paymentMethodsConfig.card_commission),
        ) / 100
      );
    }
    return 0;
  };

  const onSelectMetodoPago = (metodo: any) => {
    setMetodoPago(metodo);
    setValue("paymentMethod", metodo);
  };

  const PaymentMethodButton = ({
    metodo,
    label,
    icon,
    selected = false,
  }: {
    metodo: paymentMethods;
    label: string;
    icon: React.ElementType;
    selected?: boolean;
  }) => {
    // if (!selected) return null;
    const IconComponent = icon;
    const isSelected = metodoPago === metodo;

    return (
      <button
        disabled={!selected}
        type="button"
        onClick={() => onSelectMetodoPago(metodo)}
        style={{
          cursor: selected ? "pointer" : "not-allowed",
        }}
        className={`p-4 border-2 rounded-lg transition-all ${!selected ? "opacity-50" : ""} ${
          isSelected
            ? "border-[var(--color-primary)] bg-[#8B735515]"
            : "border-[var(--color-border)]"
        }`}
      >
        <IconComponent
          className={`mx-auto mb-2 ${isSelected ? "text-[var(--color-primary)]" : "text-[var(--color-text-secondary)]"}`}
          size={24}
        />
        <div style={{ fontWeight: 600, fontSize: "14px" }}>{label}</div>
      </button>
    );
  };

  // Función para obtener horas disponibles según la fecha seleccionada

  // Nueva función para verificar disponibilidad de fecha
  const isDateAvailable = (date: Date) => {
    const dayOfWeek = dayjs(date).day();
    const businessHour = clinicBusinessHoursData.find(
      (bh) => bh.day_of_week === dayOfWeek,
    );
    return businessHour ? !businessHour.is_closed : false;
  };

  // Calcular min y max time basado en la fecha seleccionada y horario de clínica
  const getMinMaxTime = (date: Date | null) => {
    if (!date || clinicBusinessHoursData.length === 0)
      return { minTime: undefined, maxTime: undefined };
    const dayOfWeek = dayjs(date).day();
    const businessHour = clinicBusinessHoursData.find(
      (bh) => bh.day_of_week === dayOfWeek,
    );
    if (!businessHour || businessHour.is_closed)
      return { minTime: undefined, maxTime: undefined };
    const [openHour, openMinute] = businessHour.open_time
      .split(":")
      .map(Number);
    const [closeHour, closeMinute] = businessHour.close_time
      .split(":")
      .map(Number);
    return {
      minTime: dayjs(date).hour(openHour).minute(openMinute).toDate(),
      maxTime: dayjs(date).hour(closeHour).minute(closeMinute).toDate(),
    };
  };

  // Verifica si hay conflicto de horario con otras citas
  const checkTimeConflict = (date: string, time: string, duration: number) => {
    if (!date || !time || !duration) return false;
    const newStart = dayjs(`${date} ${time}`, "YYYY-MM-DD HH:mm");
    const newEnd = newStart.add(duration, "minute");
    for (const apt of appointmentsData) {
      if (apt.status === "CANCELADO" || apt.date !== date) continue;
      const aptStart = dayjs(`${apt.date} ${apt.time}`, "YYYY-MM-DD HH:mm");
      const aptEnd = aptStart.add(apt.duration, "minute");
      const overlaps =
        (newStart.isSameOrAfter(aptStart) && newStart.isBefore(aptEnd)) ||
        (newEnd.isAfter(aptStart) && newEnd.isSameOrBefore(aptEnd)) ||
        (newStart.isBefore(aptStart) && newEnd.isAfter(aptEnd));
      if (overlaps) return true;
    }
    return false;
  };

  const AppointmentServices = ({
    item,
    index,
  }: {
    item: SaleFromQuoteItem;
    index: number;
  }) => {
    const selectedDate = item.date
      ? dayjs(item.date).toDate()
      : dayjs().toDate();
    const { minTime, maxTime } = getMinMaxTime(selectedDate);

    return (
      <div key={index} className="flex items-center gap-3 mb-2">
        <div>
          <Sparkles />
        </div>
        <div>
          <div
            style={{ fontWeight: 600, fontSize: "14px" }}
            className="flex gap-2 items-center mb-1"
          >
            {selectedCotizacion?.items[index].service.name}
            <div className="flex gap-1 items-center">
              <Clock size={14} className="text-[var(--color-text-secondary)]" />
              <span
                className="text-[var(--color-text-secondary)]"
                style={{ fontSize: "12px" }}
              >
                {item.duration || 30} min
              </span>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            {/* Fecha */}
            <DatePicker
              locale="es"
              selected={selectedDate}
              onChange={(date: Date | null) => {
                if (!date) return;
                const newItems = [...items];
                newItems[index].date = dayjs(date).format("YYYY-MM-DD");
                newItems[index].time = "";
                setValue(`items.${index}.date`, newItems[index].date);
                setValue(`items.${index}.time`, "");
                setItems(newItems);
              }}
              filterDate={isDateAvailable}
              minDate={new Date()}
              dateFormat="yyyy-MM-dd"
              customInput={<CustomDateButton value={item.date} />}
              placeholderText="Selecciona fecha"
            />
            {/* Hora */}
            <DatePicker
              locale="es"
              selected={
                item.time && selectedDate
                  ? dayjs(
                      `${item.date} ${item.time}`,
                      "YYYY-MM-DD HH:mm",
                    ).toDate()
                  : null
              }
              onChange={(time: Date | null) => {
                if (!time) return;
                const timeString = dayjs(time).format("HH:mm");
                const duration = item.duration || 30;
                if (checkTimeConflict(item.date, timeString, duration)) {
                  message.warning(
                    "Ya existe una cita en ese horario. Elige otra hora.",
                  );
                  return;
                }
                const newItems = [...items];
                newItems[index].time = timeString;
                setItems(newItems);
                setValue(`items.${index}.time`, timeString);
              }}
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
                    ? "No hay horarios"
                    : "Selecciona hora"
              }
              disabled={!selectedDate || !minTime || !maxTime}
              customInput={
                <CustomTimeButton
                  value={item.time}
                  disabled={!selectedDate || !minTime || !maxTime}
                />
              }
            />
            {/* Duración */}
            <select
              {...register(`items.${index}.duration`, {
                required: "Duración requerida",
              })}
              value={item.duration || 30}
              onChange={(e) => {
                const newItems = [...items];
                newItems[index].duration = Number(e.target.value);
                setItems(newItems);
              }}
              className="border rounded "
              style={{
                fontSize: 12,
                padding: "8px 6px",
              }}
            >
              <option value={30}>30 min</option>
              <option value={45}>45 min</option>
              <option value={60}>1 hora</option>
              <option value={90}>1h 30min</option>
              <option value={120}>2 horas</option>
            </select>
            {errors.items && errors.items[index]?.duration && (
              <AlertErrorInput
                type="error"
                message={
                  errors.items[index]?.duration?.message || "Duración requerida"
                }
              />
            )}
          </div>
          <div
            className="text-[var(--color-text-secondary)]"
            style={{ fontSize: "13px" }}
          >
            Fecha: {item.date || "-"} | Hora: {item.time || "Por definir"} |
            Duración: {item.duration || 30} min
          </div>
        </div>
      </div>
    );
  };

  const AppointmentSection = ({ show } = { show: false }) => {
    if (!show) return null;

    return (
      <div className="ml-4">
        {items.length > 0 &&
          items.map((item, index) => {
            return (
              <AppointmentServices key={index} item={item} index={index} />
            );
          })}
      </div>
    );
  };

  const CustomDateButton = forwardRef<HTMLButtonElement, any>(
    ({ value, onClick }, ref) => (
      <button
        type="button"
        ref={ref}
        onClick={onClick}
        className="border rounded px-2 w-full"
        style={{
          textAlign: "left",
          color: value ? "inherit" : "var(--color-text-secondary)",
          width: "150px",
          fontSize: "12px",
          padding: "6px 8px",
        }}
      >
        <div className="flex items-center gap-1">
          <Calendar size={12} />
          <span>
            {value ? dayjs(value).format("DD/MM/YYYY") : "Selecciona fecha"}
          </span>
        </div>
      </button>
    ),
  );

  const CustomTimeButton = React.forwardRef<HTMLButtonElement, any>(
    ({ value, onClick, disabled }, ref) => (
      <button
        type="button"
        ref={ref}
        onClick={onClick}
        disabled={disabled}
        className="border rounded px-2 py-1 w-full text-left"
        style={{
          color: disabled ? "var(--color-text-secondary)" : "inherit",
          fontSize: "12px",
          padding: "6px 8px",
          width: "100px",
        }}
      >
        <div className="flex gap-1 items-center ">
          <Clock size={14} />
          <span>{value || "00:00"}</span>
        </div>
      </button>
    ),
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit(onFinish)}
        className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-[var(--color-border)] px-6 py-4 z-10">
          <h2 className="font-['Cormorant_Garamond']">Convertir a Venta</h2>
          <p
            className="text-[var(--color-text-secondary)]"
            style={{ fontSize: "14px" }}
          >
            {selectedCotizacion?.folio} →{" "}
            {selectedCotizacion?.patient?.fullName} -{" "}
          </p>
        </div>

        <div className="p-6 space-y-5">
          {/* Resumen de cotización */}
          <div className="bg-[#F5F2EF] rounded-lg p-4">
            <div className="flex justify-between mb-3">
              <span className="text-[var(--color-text-secondary)]">Items:</span>
              <span style={{ fontWeight: 600 }}>
                {selectedCotizacion?.items.length || 0}
              </span>
            </div>
            <div className="flex justify-between mb-3 text-[var(--color-success)]">
              <span>Comision por tarjeta</span>
              <span style={{ fontWeight: 600 }} className="">
                +{calcularComision().toFixed(2) || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ fontSize: "18px", fontWeight: 700 }}>
                Total a cobrar:
              </span>
              <span
                className="text-[var(--color-secondary)]"
                style={{ fontSize: "24px", fontWeight: 700 }}
              >
                {formatCurrency(
                  (Number(selectedCotizacion?.total) || 0) + calcularComision(),
                )}
              </span>
            </div>
          </div>

          {/* Método de pago */}
          <div>
            <label className="block mb-3" style={{ fontWeight: 600 }}>
              Método de Pago *
            </label>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <PaymentMethodButton
                metodo="efectivo"
                label="Efectivo"
                icon={Banknote}
                selected={paymentMethodsConfig.cash_payment}
              />
              <PaymentMethodButton
                metodo="tarjeta-credito"
                label="Tarjeta de crédito"
                icon={CreditCard}
                selected={paymentMethodsConfig.credit_card}
              />
              <PaymentMethodButton
                metodo="tarjeta-debito"
                label="Tarjeta de débito"
                icon={WalletCards}
                selected={paymentMethodsConfig.debit_card}
              />
              <PaymentMethodButton
                metodo="transferencia"
                label="Transfer."
                icon={Smartphone}
                selected={paymentMethodsConfig.bank_transfer}
              />
            </div>
            <input
              type="hidden"
              {...register("paymentMethod", { required: true })}
              value={metodoPago}
            />

            {errors.paymentMethod && (
              <AlertErrorInput
                type="error"
                message="Selecciona un método de pago"
              />
            )}
          </div>

          {/* Monto recibido */}
          {/* {metodoPago === "efectivo" && (
            <div>
              <label className="block mb-2" style={{ fontWeight: 600 }}>
                Monto recibido *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]">
                  $
                </span>
                <input
                  type="number"
                  value={montoRecibido || ""}
                  onChange={(e) => setMontoRecibido(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                  placeholder="0.00"
                />
              </div>
              {montoRecibido > (selectedCotizacion?.total || 0) && (
                <div className="mt-2 p-3 bg-green-50 rounded-lg">
                  <div className="flex justify-between">
                    <span
                      className="text-green-600"
                      style={{ fontWeight: 600 }}
                    >
                      Cambio:
                    </span>
                    <span
                      className="text-green-600"
                      style={{ fontSize: "18px", fontWeight: 700 }}
                    >
                      {formatCurrency(
                        montoRecibido - (selectedCotizacion?.total || 0),
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )} */}

          {/* Referencia */}
          {/* {metodoPago && metodoPago !== "efectivo" && (
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
          )} */}

          {/* Agendar cita */}
          <div
            className="flex items-center justify-between"
            hidden={items.length === 0}
          >
            <div>
              <div style={{ fontWeight: 600 }}>
                ¿Agendar cita para los servicios?
              </div>
              <div
                className="text-[var(--color-text-secondary)]"
                style={{ fontSize: "14px" }}
              >
                Programar tratamientos incluidos
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                {...register("applyAppointment")}
                type="checkbox"
                checked={applyAppointment}
                onChange={(e) => {
                  setApplyAppointment(e.target.checked);
                  setValue("applyAppointment", e.target.checked);
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-success)]"></div>
            </label>
          </div>
          <AppointmentSection show={applyAppointment} />

          {/* Notas */}
          {/* <div>
            <label className="block mb-2" style={{ fontWeight: 600 }}>
              Notas de la venta
            </label>
            <textarea
              rows={2}
              className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] resize-none"
              placeholder="Observaciones adicionales..."
            />
          </div> */}

          {/* Preview comisión */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle
                className="text-blue-600 flex-shrink-0 mt-0.5"
                size={16}
              />
              <div className="flex-1">
                <div
                  className="text-blue-900"
                  style={{ fontWeight: 600, fontSize: "14px" }}
                >
                  Comisión a generar
                </div>
                <div className="text-blue-800" style={{ fontSize: "13px" }}>
                  {formatCurrency((selectedCotizacion?.total || 0) * 0.1)} para{" "}
                  {selectedCotizacion?.seller?.username}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-[var(--color-border)] px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={handleClose}
            className="px-6 py-2.5 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Confirmar Venta
          </button>
        </div>
      </form>
    </div>
  );
};
