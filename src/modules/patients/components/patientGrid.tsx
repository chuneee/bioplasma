import { useEffect, useState } from "react";
import { Patient } from "../types/patient.type";
import dayjs from "dayjs";

interface PatientTableProps {
  patientsList: Patient[] | [];
  onNavigateToExpediente: (id: string) => void;
}

export const PatientGrid = ({
  patientsList,
  onNavigateToExpediente,
}: PatientTableProps) => {
  const [filteredPacientes, setFilteredPacientes] = useState<Patient[]>([]);

  useEffect(() => {
    setFilteredPacientes(patientsList);
  }, [patientsList]);

  const formatDate = (dateString: string) => {
    const date = dayjs(dateString);
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
    return `${date.date()} ${months[date.month()]} ${date.year()}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredPacientes.map((paciente) => (
        <div
          key={paciente.uuid}
          onClick={() => onNavigateToExpediente(paciente.uuid)}
          className="bg-white rounded-xl border border-[var(--color-border)] p-6 hover:shadow-lg transition-all cursor-pointer"
        >
          <div className="flex flex-col items-center text-center mb-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
              style={{
                backgroundColor: paciente.isActive ? "#D1E7DD" : "#F8D7DA",
                fontSize: "20px",
                fontWeight: 600,
                color: "#6B6560",
              }}
            >
              {paciente.fullName
                .split(" ")
                .splice(0, 2)
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </div>
            <h3 className="mb-1" style={{ fontWeight: 600 }}>
              {paciente.fullName}
            </h3>
            <p
              className="text-[var(--color-text-secondary)] mb-2"
              style={{ fontSize: "14px" }}
            >
              {dayjs().diff(dayjs(paciente.dateOfBirth), "year")} años •{" "}
              {paciente.principalPhoneNumber}
            </p>
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
          </div>
          <div
            className="text-center mb-4 text-[var(--color-text-secondary)]"
            style={{ fontSize: "14px" }}
          >
            Última visita: {formatDate(paciente.dateOfBirth)}
          </div>
          <div className="border-t border-[var(--color-border)] pt-4 flex items-center justify-between">
            <span
              className="text-[var(--color-text-secondary)]"
              style={{ fontSize: "14px" }}
            >
              {0} tratamientos
            </span>
            <button className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[#7A6349] transition-colors">
              Ver expediente
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
