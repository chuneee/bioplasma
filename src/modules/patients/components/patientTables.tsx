import {
  Calendar,
  Edit2,
  Eye,
  Info,
  MessageCircle,
  MoreVertical,
  UserPlus,
  UserX,
} from "lucide-react";
import { Patient } from "../types/patient.type";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { PaginationTable } from "./paginationTable";
import { formatDate } from "../../../utils/utils";
import { usePermissions } from "../../auth/hooks/usePermissions";

interface PatientTableProps {
  patientsList: Patient[] | [];
  onNavigateToExpediente: (id: string) => void;
  onChangeStatus: (id: string) => void;
  onEditPatient: (id: string) => void;
}

export const PatientTable = ({
  patientsList,
  onNavigateToExpediente,
  onChangeStatus,
  onEditPatient,
}: PatientTableProps) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredPacientes, setFilteredPacientes] = useState<Patient[]>([]);

  const { hasPermission } = usePermissions();

  useEffect(() => {
    setFilteredPacientes(patientsList);
    setCurrentPage(1); // Reset to first page when list changes
  }, [patientsList]);

  // Calcular los pacientes a mostrar en la página actual
  const paginatedPacientes = filteredPacientes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const isOldVisit = (dateString: string) => {
    const visitDate = dayjs(dateString);
    const threeMonthsAgo = dayjs().subtract(3, "month");
    return visitDate.isBefore(threeMonthsAgo);
  };

  const handleChangeStatus = (id: string) => {
    onChangeStatus?.(id);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const Table = () => {
    return (
      <table className="w-full">
        <thead>
          <tr className="bg-[#F5F2EF] border-b border-[var(--color-border)]">
            <th
              className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide"
              style={{ fontSize: "12px", fontWeight: 600 }}
            >
              Paciente
            </th>
            <th
              className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide"
              style={{ fontSize: "12px", fontWeight: 600 }}
            >
              Teléfono
            </th>
            <th
              className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide"
              style={{ fontSize: "12px", fontWeight: 600 }}
            >
              Correo
            </th>
            <th
              className="text-left px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide"
              style={{ fontSize: "12px", fontWeight: 600 }}
            >
              Última Visita
            </th>
            <th
              className="text-center px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide"
              style={{ fontSize: "12px", fontWeight: 600 }}
            >
              Tratamientos
            </th>
            <th
              className="text-center px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide"
              style={{ fontSize: "12px", fontWeight: 600 }}
            >
              Estado
            </th>
            <th
              className="text-center px-6 py-4 text-[var(--color-text-secondary)] uppercase tracking-wide"
              style={{ fontSize: "12px", fontWeight: 600 }}
            >
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedPacientes.map((paciente) => (
            <tr
              key={paciente.uuid}
              onClick={() => onNavigateToExpediente(paciente.uuid)}
              className="border-b border-[var(--color-border)] hover:bg-[#FDFBF9] transition-colors cursor-pointer"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: paciente.isActive
                        ? "#D1E7DD"
                        : "#F8D7DA",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#6B6560",
                    }}
                  >
                    {paciente.fullName
                      .split(" ")
                      .slice(0, 2)
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{paciente.fullName}</div>
                    <div
                      className="text-[var(--color-text-secondary)]"
                      style={{ fontSize: "14px" }}
                    >
                      ({dayjs().diff(dayjs(paciente.dateOfBirth), "year")} años)
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <span>{paciente.principalPhoneNumber}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(
                        `https://wa.me/${paciente.principalPhoneNumber.replace(/\D/g, "")}`,
                        "_blank",
                      );
                    }}
                    className="text-green-600 hover:text-green-700 transition-colors"
                  >
                    <MessageCircle size={16} />
                  </button>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-[var(--color-text-secondary)]">
                  {paciente.email}
                </span>
              </td>
              <td className="px-6 py-4">
                <span
                  className={
                    isOldVisit(paciente.dateOfBirth)
                      ? "text-[var(--color-warning)]"
                      : ""
                  }
                >
                  {formatDate(paciente.dateOfBirth)}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                <span
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#8B7355]/10 text-[var(--color-primary)]"
                  style={{ fontWeight: 600 }}
                >
                  {0}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-white ${
                    paciente.isActive
                      ? "bg-[var(--color-success)]"
                      : "bg-[var(--color-text-secondary)]"
                  }`}
                  style={{ fontSize: "12px", fontWeight: 500 }}
                >
                  {paciente.isActive ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td className="px-6 py-4">
                <div
                  className="flex items-center justify-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => onNavigateToExpediente(paciente.uuid)}
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
                      onClick={() =>
                        setActiveMenu(
                          activeMenu === paciente.uuid ? null : paciente.uuid,
                        )
                      }
                      className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[#8B7355]/10 rounded-lg transition-colors"
                    >
                      <MoreVertical size={18} />
                    </button>
                    {activeMenu === paciente.uuid && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-[var(--color-border)] py-1 z-10">
                        <button
                          onClick={() => onEditPatient(paciente.uuid)}
                          className="w-full px-4 py-2 text-left hover:bg-[#F5F2EF] flex items-center gap-2"
                        >
                          <Edit2 size={16} />
                          <span>Editar</span>
                        </button>
                        {hasPermission("patients.delete") && (
                          <button
                            onClick={() => handleChangeStatus(paciente.uuid)}
                            className="w-full px-4 py-2 text-left hover:bg-[#F5F2EF] flex items-center gap-2"
                          >
                            {paciente.isActive ? (
                              <UserX size={16} />
                            ) : (
                              <UserPlus size={16} />
                            )}{" "}
                            <span>
                              {paciente.isActive ? "Desactivar" : "Activar"}
                            </span>
                          </button>
                        )}

                        {/* <button className="w-full px-4 py-2 text-left hover:bg-[#F5F2EF] flex items-center gap-2 text-[var(--color-error)]">
                          <Trash2 size={16} />
                          <span>Eliminar</span>
                        </button> */}
                      </div>
                    )}
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
      <div className="overflow-x-auto h-80 max-h-[90vh]">
        {filteredPacientes.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center text-[var(--color-text-secondary)]">
            <Info />
            No se encontraron pacientes.
          </div>
        ) : (
          <Table />
        )}
      </div>

      {/* Paginación */}
      <PaginationTable
        onChangePage={handlePageChange}
        onItemPerPageChange={handleItemsPerPageChange}
        totalItems={filteredPacientes.length}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
};
