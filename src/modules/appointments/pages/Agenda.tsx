import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { CitaDetalle } from "../components/citaDetalle";
import { CitasFormModal } from "../components/citasForm";
import { CalendarioAgenda } from "../components/calendarioAgenda";
import { Appointment } from "../types/appoiment.type";
import { AppointmentService } from "../services/appointment.service";
import { message } from "../../../components/shared/message/message";
import { set } from "react-hook-form";
import { ReagendarModal } from "../components/reagendar";

export function Agenda() {
  const [selectedCita, setSelectedCita] = useState<Appointment>(
    {} as Appointment,
  );
  const [showNewCitaModal, setShowNewCitaModal] = useState(false);
  const [showCitaDetalle, setShowCitaDetalle] = useState(false);
  const [citas, setCitas] = useState<Appointment[]>([]);
  const [recheduleModalOpen, setRecheduleModalOpen] = useState(false);

  const handleSelectCita = (cita: Appointment) => {
    setSelectedCita(cita);
    setShowCitaDetalle(true);
  };

  const initialData = async () => {
    try {
      const appointments = await AppointmentService.getAppointments();
      setCitas(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    initialData();
  }, []);

  const onSubmitCita = async (data: Partial<Appointment>) => {
    try {
      if (selectedCita && selectedCita.id) {
        console.log("Datos a actualizar:", data);
        const response = await AppointmentService.updateAppointment(
          selectedCita.id,
          data,
        );

        setCitas((prev) =>
          prev.map((cita) =>
            cita.id === selectedCita.id ? { ...cita, ...response } : cita,
          ),
        );
        message.success("Cita actualizada exitosamente");
      } else {
        const response = await AppointmentService.createAppointment(data);
        console.log("Cita creada:", response);
        message.success("Cita creada exitosamente");
        setCitas((prev) => [...prev, response]);
      }
      setShowNewCitaModal(false);
      setSelectedCita({} as Appointment);
    } catch (error) {
      console.error("Error al crear la cita:", error);
      message.error("Error al crear la cita");
    }
  };

  const onChangeStatus = async (status: string, id: string) => {
    try {
      const response = await AppointmentService.changeAppointmentStatus(
        status as any,
        id,
      );

      setCitas((prev) =>
        prev.map((cita) =>
          cita.id === id ? { ...cita, status: status as any } : cita,
        ),
      );
      setSelectedCita((prev) => ({ ...prev, status: status as any }));
      message.success("Estado de la cita actualizado");
    } catch (error) {
      console.error("Error al actualizar el estado de la cita:", error);
      message.error("Error al actualizar el estado de la cita");
    }
  };

  const handleEditCita = () => {
    setShowCitaDetalle(false);
    setShowNewCitaModal(true);
  };

  const handelRecheduleSubmit = async (values: Partial<Appointment>) => {
    try {
      const response = await AppointmentService.recheduleAppointment(
        selectedCita.id,
        values,
      );

      setCitas((prev) =>
        prev.map((cita) =>
          cita.id === selectedCita.id ? { ...cita, ...response } : cita,
        ),
      );
      message.success("Cita reagendada exitosamente");
    } catch (error) {
      console.error("Error al reagendar la cita:", error);
      message.error("Error al reagendar la cita");
    } finally {
      setRecheduleModalOpen(false);
      setSelectedCita({} as Appointment);
    }
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

        <CalendarioAgenda dataSource={citas} onSelectCita={handleSelectCita} />
      </div>

      <CitaDetalle
        cita={selectedCita}
        onClose={() => {
          setSelectedCita({} as Appointment);
          setShowCitaDetalle(false);
        }}
        open={showCitaDetalle}
        onChangeStatus={onChangeStatus}
        onEdit={handleEditCita}
        onRechedule={() => {
          setShowCitaDetalle(false);
          setRecheduleModalOpen(true);
        }}
      />

      <CitasFormModal
        onSubmit={onSubmitCita}
        open={showNewCitaModal}
        onClose={() => {
          setSelectedCita({} as Appointment);
          setShowNewCitaModal(false);
        }}
        currentData={selectedCita.id ? selectedCita : undefined}
        existingAppointments={citas}
      />

      <ReagendarModal
        currentAppointment={selectedCita}
        open={recheduleModalOpen}
        onClose={() => {
          (setRecheduleModalOpen(false), setSelectedCita({} as Appointment));
        }}
        onSubmit={handelRecheduleSubmit}
        existingAppointments={citas}
      />
    </div>
  );
}
