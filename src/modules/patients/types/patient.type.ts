import { PatientMedicalInfo } from "./patient-medical-info.type";

export type Patient = {
  uuid: string;
  photoUrl: string;
  fullName: string;
  dateOfBirth: string;
  gender: "Masculino" | "Femenino" | "Otro";
  principalPhoneNumber: string;
  secondaryPhoneNumber: string;
  email: string;
  isActive: boolean;
  address: string;
  neighborhood: string;
  city: string;
  zipCode: string;
  createdAt: string;
  updatedAt: string;
  medicalInfo: PatientMedicalInfo;
};
