import { useEffect, useState } from "react";
import { Search, Grid3x3, List, Plus } from "lucide-react";
import { PatientService } from "../services/patient.service";
import { message } from "../../../components/shared/message/message";
import { Patient } from "../types/patient.type";
import { PatientTable } from "../components/patientTables";
import { PatientGrid } from "../components/patientGrid";
import { set } from "react-hook-form";
import { PatientFormModal } from "../components/patientFormModal";
import { Filters } from "../components/filters";
import dayjs from "dayjs";

interface Paciente {
  id: string;
  nombre: string;
  edad: number;
  telefono: string;
  correo: string;
  ultimaVisita: string;
  tratamientos: number;
  estado: "activo" | "inactivo";
  avatar?: string;
  iniciales: string;
  colorAvatar: string;
}

interface PacientesProps {
  onNavigateToExpediente: (pacienteId: string) => void;
}

export function Pacientes({ onNavigateToExpediente }: PacientesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [filterTratamiento, setFilterTratamiento] = useState("cualquier");
  const [sortBy, setSortBy] = useState("nombre-az");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);

  const [pacientesData, setPacientes] = useState<Patient[] | any[]>([]);

  const [currendPatient, setCurrentPatient] = useState<Patient | null>(null);

  // Función para inicializar los datos de pacientes
  const initialData = async () => {
    try {
      const response = await PatientService.getPatients();
      setPacientes(response || []);
    } catch (error) {
      console.error("Error al obtener pacientes:", error);
      message.error(
        "No se pudieron cargar los pacientes. Intenta nuevamente más tarde.",
      );
    }
  };

  useEffect(() => {
    initialData();
  }, []);

  // Metodos para manejar el estado del paciente

  const ChangeStatusPatient = async (id: string) => {
    try {
      await PatientService.changePatientStatus(id);
      message.success("El estado del paciente ha sido actualizado.");
      setPacientes((prevPatients) =>
        prevPatients.map((patient) =>
          patient.uuid === id
            ? { ...patient, isActive: !patient.isActive }
            : patient,
        ),
      );
    } catch (error) {
      console.error("Error al cambiar el estado del paciente:", error);
      message.error(
        "No se pudo actualizar el estado del paciente. Intenta nuevamente.",
      );
    }
  };

  const onFormSubmit = async (data: Partial<Patient>) => {
    try {
      if (currendPatient) {
        const newPatient = await PatientService.updatePatient(
          currendPatient.uuid,
          data,
        );
        message.success("Paciente actualizado exitosamente.");
        setPacientes((prevPatients) =>
          prevPatients.map((patient) =>
            patient.uuid === currendPatient.uuid ? newPatient : patient,
          ),
        );
      } else {
        const newPatient = await PatientService.createPatient(data);
        message.success("Paciente creado exitosamente.");
        setPacientes((prevPatients) => [...prevPatients, newPatient]);
      }
    } catch (error) {
      console.error("Error al crear paciente:", error);
      message.error(
        "No se pudo crear el paciente. Intenta nuevamente más tarde.",
      );
    } finally {
      setShowNewPatientModal(false);
      setCurrentPatient(null);
    }
  };

  const handleEditPatient = (id: string) => {
    const patientToEdit = pacientesData.find((p: Patient) => p.uuid === id);
    if (patientToEdit) {
      setCurrentPatient(patientToEdit);
      setShowNewPatientModal(true);
    } else {
      message.error("Paciente no encontrado.");
    }
  };

  // Filtrar y ordenar pacientes
  const filteredPacientes = pacientesData
    .filter((p) => {
      const matchesSearch =
        p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.principalPhoneNumber.includes(searchTerm) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesEstado =
        filterEstado === "todos" || p.isActive === (filterEstado === "activo");
      const matchesDates =
        filterTratamiento === "cualquier" ||
        (p.createdAt && new Date(p.createdAt) >= new Date(filterTratamiento)) ||
        filterTratamiento === "semana" ||
        (filterTratamiento === "mes" &&
          p.createdAt &&
          new Date(p.createdAt) >=
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) ||
        (filterTratamiento === "tres-meses" &&
          p.createdAt &&
          new Date(p.createdAt) >=
            new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)) ||
        (filterTratamiento === "seis-meses" &&
          p.createdAt &&
          new Date(p.createdAt) >=
            new Date(Date.now() - 180 * 24 * 60 * 60 * 1000));

      return matchesSearch && matchesEstado && matchesDates;
    })
    .sort((a, b) => {
      if (sortBy === "nombre-az") {
        return a.fullName.localeCompare(b.fullName);
      } else if (sortBy === "nombre-za") {
        return b.fullName.localeCompare(a.fullName);
      } else if (sortBy === "recientes") {
        return dayjs(b.createdAt).diff(dayjs(a.createdAt));
      } else if (sortBy === "antiguos") {
        return dayjs(a.createdAt).diff(dayjs(b.createdAt));
      } else if (sortBy === "ultima-visita") {
        return dayjs(b.createdAt).diff(dayjs(a.createdAt));
      }
      return 0;
    });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="font-['Cormorant_Garamond'] text-[var(--color-text)] mb-2">
              Pacientes
            </h1>
            <p className="text-[var(--color-text-secondary)]">
              {pacientesData.length} pacientes registrados
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
      <Filters
        onSearchChange={setSearchTerm}
        onFilterEstadoChange={setFilterEstado}
        onSortByChange={setSortBy}
        onViewModeChange={setViewMode}
        onDateFilterChange={setFilterTratamiento}
      />

      {/* Vista de Tabla */}
      {viewMode === "table" && (
        <PatientTable
          patientsList={filteredPacientes}
          onChangeStatus={ChangeStatusPatient}
          onNavigateToExpediente={onNavigateToExpediente}
          onEditPatient={handleEditPatient}
        />
      )}

      {/* Vista de Grid */}
      {viewMode === "grid" && (
        <PatientGrid
          patientsList={filteredPacientes}
          onNavigateToExpediente={onNavigateToExpediente}
        />
      )}

      {/* Modal Nuevo Paciente */}
      <PatientFormModal
        onSubmit={onFormSubmit}
        open={showNewPatientModal}
        onClose={() => {
          (setShowNewPatientModal(false), setCurrentPatient(null));
        }}
        currentPatient={currendPatient}
      />
    </div>
  );
}
