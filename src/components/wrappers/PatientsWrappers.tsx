// components/wrappers/PatientsWrappers.tsx
import { useParams, Navigate } from "react-router-dom";
import { useNavigation } from "../../hooks/useNavigation";
import { Pacientes } from "../../modules/patients/pages/Pacientes";
import { ExpedientePaciente } from "../../modules/patients/components/ExpedientePaciente";

// Wrapper para la página de lista de pacientes
export function PacientesPageWrapper() {
  const { navigateToPaciente } = useNavigation();

  return <Pacientes onNavigateToExpediente={navigateToPaciente} />;
}

// Wrapper para el expediente de paciente individual
export function ExpedientePacientePageWrapper() {
  const { id } = useParams<{ id: string }>();
  const { goBack } = useNavigation();

  // Si no hay ID, redirigir a la lista de pacientes
  if (!id) {
    return <Navigate to="/pacientes" replace />;
  }

  return <ExpedientePaciente pacienteId={id} onBack={goBack} />;
}
