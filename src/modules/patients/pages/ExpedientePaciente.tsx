import { useEffect, useState } from "react";
import {
  ChevronRight,
  Calendar,
  FileText,
  Edit2,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { Patient } from "../types/patient.type";
import { PatientService } from "../services/patient.service";
import { message } from "../../../components/shared/message/message";
import dayjs from "dayjs";
import { PatientGaleryPhotos } from "../components/gallery/galeryPhotos";
import { PatientHistory } from "../components/treatments/patientHistory";
import { PatientClinicNotes } from "../components/clinical-note/clinicNotes";
import { PatientMedicalInfo } from "../components/medicalInfo/medicalInfo";
import { PatientConsent } from "../types/patientp-consent.type";
import { PatientClinicalNote } from "../types/patient-clinical-note.type";
import { PatientPhotos } from "../types/patient-photo.type";
import { FormMedicalInfoModal } from "../components/medicalInfo/formMedicalInfo";
import { PatientMedicalInfo as PatientMedicalInfoType } from "../types/patient-medical-info.type";
import { ConsentFormModal } from "../components/consent/consentForm";
import { FormClinicalNoteModal } from "../components/clinical-note/formClinicalNote";
import { FormGalleryPhotoModal } from "../components/gallery/formGalleryPhoto";
import { PaientConsents } from "../components/consent/consents";
import { PatientFormModal } from "../components/patientFormModal";
import { formatCurrency, formatDate } from "../../../utils/utils";

interface ExpedientePacienteProps {
  pacienteId: string;
  onBack: () => void;
}

export function ExpedientePaciente({
  pacienteId,
  onBack,
}: ExpedientePacienteProps) {
  const [activeTab, setActiveTab] = useState<
    "historial" | "galeria" | "notas" | "consentimientos" | "medica"
  >("historial");

  const [isLoading, setIsLoading] = useState(true);

  // Patient data states
  const [pacienteData, setPacienteData] = useState<Patient>({} as Patient);
  const [patientConsents, setPatientConsents] = useState<PatientConsent[]>([]);
  const [patientClinicalNotes, setPatientClinicalNotes] = useState<
    PatientClinicalNote[]
  >([]);
  const [patientPhotos, setPatientPhotos] = useState<PatientPhotos[]>([]);

  // Modals state
  const [openMedicalInfoModal, setOpenMedicalInfoModal] = useState(false);
  const [openConsentModal, setOpenConsentModal] = useState(false);
  const [openClinicalNoteModal, setOpenClinicalNoteModal] = useState(false);
  const [openGalleryPhotoModal, setOpenGalleryPhotoModal] = useState(false);
  const [openPatientModal, setOpenPatientModal] = useState(false);
  const [currendPatient, setCurrentPatient] = useState<Patient | null>(null);

  const handleOpenPatientModal = () => {
    setCurrentPatient(pacienteData);
    setOpenPatientModal(true);
  };

  const handleClosePatientModal = () => {
    setCurrentPatient(null);
    setOpenPatientModal(false);
  };

  const fetchInitData = async () => {
    try {
      setIsLoading(true);
      const [
        patientResponse,
        consentsResponse,
        clinicalNotesResponse,
        photosResponse,
      ] = await Promise.all([
        PatientService.getPatientById(pacienteId),
        PatientService.getPatientConsents(pacienteId),
        PatientService.getPatientClinicalNotes(pacienteId),
        PatientService.getPatientPhotos(pacienteId),
      ]);
      setPacienteData(patientResponse);
      setPatientConsents(consentsResponse);
      setPatientClinicalNotes(clinicalNotesResponse);
      setPatientPhotos(photosResponse);
    } catch (error) {
      console.error("Error al obtener datos del paciente:", error);
      message.error(
        "No se pudo cargar la información del paciente. Intenta nuevamente.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitData();
  }, [pacienteId]);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  // Handlers para actualizar datos del paciente desde los modales
  const handleMedicalInfoSubmit = async (
    values: Partial<PatientMedicalInfoType>,
  ) => {
    try {
      const respose = await PatientService.updatePatientMedicalInfo(
        pacienteId,
        values,
      );
      setPacienteData((prev) => ({
        ...prev,
        medicalInfo: {
          ...prev.medicalInfo,
          ...values,
        } as PatientMedicalInfoType,
      }));
      setOpenMedicalInfoModal(false);
      message.success("Información médica actualizada correctamente.");
    } catch (error) {
      console.error("Error al actualizar información médica:", error);
      message.error(
        "No se pudo actualizar la información médica. Intenta nuevamente.",
      );
    }
  };

  const handleConsentSubmit = async (values: Partial<PatientConsent>) => {
    try {
      const respose = await PatientService.createPatientConsent(
        pacienteId,
        values,
      );
      setPatientConsents((prev) => [...prev, respose]);
      setOpenConsentModal(false);
      message.success("El consentimiento se creó correctamente.");
    } catch (error) {
      console.error("Error al actualizar información médica:", error);
      message.error(
        "No se pudo actualizar la información médica. Intenta nuevamente.",
      );
    }
  };

  const handlelinicalNoteSubmit = async (
    values: Partial<PatientClinicalNote>,
  ) => {
    try {
      const respose = await PatientService.createPatientClinicalNote(
        pacienteId,
        values,
      );
      setPatientClinicalNotes((prev) => [...prev, respose]);
      setOpenClinicalNoteModal(false);
      message.success("La nota clínica se creó correctamente.");
    } catch (error) {
      console.error("Error al actualizar información médica:", error);
      message.error(
        "No se pudo actualizar la información médica. Intenta nuevamente.",
      );
    }
  };

  const handleUploadPhoto = async (data: Partial<PatientPhotos>) => {
    try {
      const response = await PatientService.uploadPatientPhoto(
        pacienteId,
        data,
      );
      setPatientPhotos((prev) => [response, ...prev]);
      message.success("Foto subida correctamente.");
    } catch (error) {
      console.error("Error al subir la foto:", error);
      message.error("No se pudo subir la foto. Intenta nuevamente.");
    } finally {
      setOpenGalleryPhotoModal(false);
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
        setPacienteData((prev) => ({ ...prev, ...newPatient }) as Patient);
      }
    } catch (error) {
      console.error("Error al crear paciente:", error);
      message.error(
        "No se pudo crear el paciente. Intenta nuevamente más tarde.",
      );
    } finally {
      setOpenPatientModal(false);
      setCurrentPatient(null);
    }
  };

  // Handler para cambio de tab que previene el scroll
  const handleTabChange = (
    tab: "historial" | "galeria" | "notas" | "consentimientos" | "medica",
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    setActiveTab(tab);
  };

  // Componente para mostrar cada consentimiento

  const ActiionsButtons = () => {
    return (
      <div className="flex gap-3 mb-6 justify-end">
        <button className="flex items-center gap-2 px-4 py-2.5 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors">
          <Calendar size={18} />
          <span>Agendar Cita</span>
        </button>
        <button
          onClick={() => setOpenClinicalNoteModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors"
        >
          <FileText size={18} />
          <span>Nueva Nota</span>
        </button>
        <button
          onClick={handleOpenPatientModal}
          className="flex items-center gap-2 px-4 py-2.5 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors"
        >
          <Edit2 size={18} />
          <span>Editar Paciente</span>
        </button>
      </div>
    );
  };

  const {
    fullName,
    isActive,
    dateOfBirth,
    email,
    principalPhoneNumber,
    secondaryPhoneNumber,
    address,
    city,
    zipCode,
    createdAt,
    updatedAt,
  } = pacienteData;
  const CardPatientInfo = () => {
    return (
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Avatar y estado */}
          <div className="flex-shrink-0 relative">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: isActive ? "#D1E7DD" : "#F8D7DA",
                fontSize: "32px",
                fontWeight: 600,
                color: "#6B6560",
              }}
            >
              {fullName
                .split(" ")
                .slice(0, 2)
                .map((n) => n[0])
                .join("")}
            </div>
            <span className="absolute bottom-0 right-0 w-6 h-6 bg-[var(--color-success)] border-2 border-white rounded-full"></span>
          </div>

          {/* Información central */}
          <div className="flex-1">
            <h1 className="font-['Cormorant_Garamond'] mb-2">
              {pacienteData.fullName}
            </h1>
            <p className="text-[var(--color-text-secondary)] mb-4">
              {dayjs().diff(dayjs(dateOfBirth), "year")} años
            </p>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Phone
                  size={16}
                  className="text-[var(--color-text-secondary)]"
                />
                <span>{pacienteData.principalPhoneNumber}</span>
                <button
                  onClick={() =>
                    window.open(
                      `https://wa.me/${principalPhoneNumber.replace(/\D/g, "")}`,
                      "_blank",
                    )
                  }
                  className="text-green-600 hover:text-green-700 transition-colors"
                >
                  <MessageCircle size={16} />
                </button>
              </div>
              {secondaryPhoneNumber && (
                <div className="flex items-center gap-3">
                  <Phone
                    size={16}
                    className="text-[var(--color-text-secondary)]"
                  />
                  <span className="text-[var(--color-text-secondary)]">
                    {secondaryPhoneNumber}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Mail
                  size={16}
                  className="text-[var(--color-text-secondary)]"
                />
                <a
                  href={`mailto:${email}`}
                  className="text-[var(--color-primary)] hover:underline"
                >
                  {email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin
                  size={16}
                  className="text-[var(--color-text-secondary)]"
                />
                <span className="text-[var(--color-text-secondary)]">
                  {address}, {city}. #{zipCode}
                </span>
              </div>
            </div>
          </div>

          {/* Métricas rápidas */}
          <div className="lg:w-80 bg-[#FDFBF9] rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-secondary)]">
                Primera visita:
              </span>
              <span style={{ fontWeight: 600 }}>{formatDate(createdAt)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-secondary)]">
                Última visita:
              </span>
              <span style={{ fontWeight: 600 }}>{formatDate(updatedAt)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-secondary)]">
                Total tratamientos:
              </span>
              <span
                className="text-[var(--color-primary)]"
                style={{ fontWeight: 600 }}
              >
                {0}
              </span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
              <span className="text-[var(--color-text-secondary)]">
                Inversión total:
              </span>
              <span
                className="text-[var(--color-secondary)]"
                style={{ fontWeight: 700, fontSize: "18px" }}
              >
                {formatCurrency(0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-[var(--color-text-secondary)]">
        <button
          onClick={onBack}
          className="hover:text-[var(--color-primary)] transition-colors"
        >
          Pacientes
        </button>
        <ChevronRight size={16} />
        <span className="text-[var(--color-text)]">{fullName}</span>
      </div>

      {/* Botones de acción */}
      <ActiionsButtons />

      {/* Card de Información Principal */}
      <CardPatientInfo />

      {/* Tabs de navegación */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] mb-6 h-full">
        <div className="flex border-b border-[var(--color-border)] overflow-x-auto">
          <button
            onClick={(e) => handleTabChange("historial", e)}
            className={`px-6 py-4 transition-colors whitespace-nowrap ${
              activeTab === "historial"
                ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            }`}
            style={{ fontWeight: activeTab === "historial" ? 600 : 400 }}
          >
            Historial de Tratamientos
          </button>
          <button
            onClick={(e) => handleTabChange("galeria", e)}
            className={`px-6 py-4 transition-colors whitespace-nowrap ${
              activeTab === "galeria"
                ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            }`}
            style={{ fontWeight: activeTab === "galeria" ? 600 : 400 }}
          >
            Galería de Fotos
          </button>
          <button
            onClick={(e) => handleTabChange("notas", e)}
            className={`px-6 py-4 transition-colors whitespace-nowrap ${
              activeTab === "notas"
                ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            }`}
            style={{ fontWeight: activeTab === "notas" ? 600 : 400 }}
          >
            Notas Clínicas
          </button>
          <button
            onClick={(e) => handleTabChange("consentimientos", e)}
            className={`px-6 py-4 transition-colors whitespace-nowrap ${
              activeTab === "consentimientos"
                ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            }`}
            style={{ fontWeight: activeTab === "consentimientos" ? 600 : 400 }}
          >
            Consentimientos
          </button>
          <button
            onClick={(e) => handleTabChange("medica", e)}
            className={`px-6 py-4 transition-colors whitespace-nowrap ${
              activeTab === "medica"
                ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            }`}
            style={{ fontWeight: activeTab === "medica" ? 600 : 400 }}
          >
            Información Médica
          </button>
        </div>

        {/* Contenido del Tab: Historial de Tratamientos */}
        {activeTab === "historial" && <PatientHistory />}

        {/* Tab: Galería de Fotos */}
        {activeTab === "galeria" && (
          <PatientGaleryPhotos
            photosList={patientPhotos}
            onAddPhoto={() => setOpenGalleryPhotoModal(true)}
          />
        )}

        {/* Tab: Notas Clínicas */}
        {activeTab === "notas" && (
          <PatientClinicNotes
            clinicalNotesList={patientClinicalNotes}
            onEdit={() => setOpenClinicalNoteModal(true)}
          />
        )}

        {/* Tab: Consentimientos */}
        {activeTab === "consentimientos" && (
          <PaientConsents
            consentList={patientConsents}
            onEdit={() => setOpenConsentModal(true)}
          />
        )}

        {/* Tab: Información Médica */}
        {activeTab === "medica" && (
          <PatientMedicalInfo
            medicalInfo={pacienteData.medicalInfo}
            onEdit={() => setOpenMedicalInfoModal(true)}
          />
        )}
      </div>

      <FormMedicalInfoModal
        open={openMedicalInfoModal}
        onClose={() => setOpenMedicalInfoModal(false)}
        medicalInfo={pacienteData.medicalInfo}
        onSubmit={handleMedicalInfoSubmit}
      />

      <ConsentFormModal
        open={openConsentModal}
        onClose={() => setOpenConsentModal(false)}
        onSubmit={handleConsentSubmit}
      />

      <FormClinicalNoteModal
        open={openClinicalNoteModal}
        onClose={() => setOpenClinicalNoteModal(false)}
        onSubmit={handlelinicalNoteSubmit}
      />

      <FormGalleryPhotoModal
        open={openGalleryPhotoModal}
        onClose={() => setOpenGalleryPhotoModal(false)}
        onSubmit={handleUploadPhoto}
      />

      <PatientFormModal
        open={openPatientModal}
        onClose={handleClosePatientModal}
        currentPatient={currendPatient}
        onSubmit={onFormSubmit}
      />
    </div>
  );
}
