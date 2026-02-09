import api from "../../../shared/api/axios";
import { PatientClinicalNote } from "../types/patient-clinical-note.type";
import { PatientPhotos } from "../types/patient-photo.type";
import { Patient } from "../types/patient.type";
import { PatientConsent } from "../types/patientp-consent.type";

export class PatientService {
  static async getPatients(): Promise<Patient[]> {
    try {
      const { data } = await api.get("patients");
      return data.data as Patient[];
    } catch (error) {
      console.error("Error fetching patients:", error);
      throw error;
    }
  }

  static async getPatientById(id: string): Promise<Patient> {
    try {
      const { data } = await api.get(`patients/${id}`);
      return data.data as Patient;
    } catch (error) {
      console.error(`Error fetching patient with ID ${id}:`, error);
      throw error;
    }
  }

  static async changePatientStatus(id: string): Promise<void> {
    try {
      const { data } = await api.delete(`patients/${id}`);
      return data;
    } catch (error) {
      console.error(`Error changing status for patient with ID ${id}:`, error);
      throw error;
    }
  }

  static async createPatient(
    patientData: Partial<Omit<Patient, "uuid" | "createdAt" | "updatedAt">>,
  ): Promise<Patient> {
    try {
      const { data } = await api.post("patients", patientData);
      return data.data as Patient;
    } catch (error) {
      console.error("Error creating patient:", error);
      throw error;
    }
  }

  static async updatePatient(
    id: string,
    patientData: Partial<Omit<Patient, "uuid" | "createdAt" | "updatedAt">>,
  ): Promise<Patient> {
    try {
      const { data } = await api.patch(`patients/${id}`, patientData);
      return data.data as Patient;
    } catch (error) {
      console.error("Error creating patient:", error);
      throw error;
    }
  }

  static async updatePatientMedicalInfo(
    id: string,
    medicalInfoData: Partial<
      Omit<Patient["medicalInfo"], "createdAt" | "updatedAt">
    >,
  ): Promise<Patient> {
    try {
      const { data } = await api.patch(
        `patients/${id}/update-medical-info`,
        medicalInfoData,
      );
      return data.data as Patient;
    } catch (error) {
      console.error("Error updating patient's medical info:", error);
      throw error;
    }
  }

  static async getPatientConsents(id: string): Promise<PatientConsent[]> {
    try {
      const { data } = await api.get(`patients/consents/${id}`);
      return data.data as PatientConsent[];
    } catch (error) {
      console.error(
        `Error fetching consents for patient with ID ${id}:`,
        error,
      );
      throw error;
    }
  }

  static async createPatientConsent(
    id: string,
    consentData: Partial<
      Omit<PatientConsent, "uuid" | "createdAt" | "updatedAt">
    >,
  ): Promise<PatientConsent> {
    const formData = new FormData();
    const { title, signedAt, path } = consentData;

    formData.append("title", title || "");
    formData.append("signedAt", signedAt || "");
    if (path[0] instanceof File) {
      formData.append("consent", path[0]);
    }

    try {
      const { data } = await api.post(`patients/consents/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data.data as PatientConsent;
    } catch (error) {
      console.error(`Error creating consent for patient with ID ${id}:`, error);
      throw error;
    }
  }

  static async getPatientClinicalNotes(
    id: string,
  ): Promise<PatientClinicalNote[]> {
    try {
      const { data } = await api.get(`patients/clinical-notes/${id}`);
      return data.data as PatientClinicalNote[];
    } catch (error) {
      console.error(
        `Error fetching clinical notes for patient with ID ${id}:`,
        error,
      );
      throw error;
    }
  }

  static async createPatientClinicalNote(
    id: string,
    noteData: Partial<
      Omit<PatientClinicalNote, "uuid" | "createdAt" | "updatedAt">
    >,
  ): Promise<PatientClinicalNote> {
    try {
      const { data } = await api.post(
        `patients/clinical-notes/${id}`,
        noteData,
      );
      return data.data as PatientClinicalNote;
    } catch (error) {
      console.error(
        `Error creating clinical note for patient with ID ${id}:`,
        error,
      );
      throw error;
    }
  }

  static async getPatientPhotos(id: string): Promise<PatientPhotos[]> {
    try {
      const { data } = await api.get(`patients/gallery/${id}`);
      return data.data as PatientPhotos[];
    } catch (error) {
      console.error(`Error fetching photos for patient with ID ${id}:`, error);
      throw error;
    }
  }

  static async uploadPatientPhoto(
    id: string,
    photoData: Partial<Omit<PatientPhotos, "uuid" | "createdAt" | "updatedAt">>,
  ): Promise<PatientPhotos> {
    const formData = new FormData();
    const { description, type, urls } = photoData;

    if (description) formData.append("description", description);
    if (type) formData.append("type", type);

    if (urls) {
      Array.from(urls).forEach((file) => {
        formData.append("photos", file);
      });
    }

    try {
      const { data } = await api.post(`patients/upload-photo/${id}`, formData);
      return data.data as PatientPhotos;
    } catch (error) {
      console.error(`Error uploading photo for patient with ID ${id}:`, error);
      throw error;
    }
  }
}
