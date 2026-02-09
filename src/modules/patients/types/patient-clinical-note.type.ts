import { User } from "../../settings/types/user.type";

export type PatientClinicalNote = {
  uuid: string;
  noteType: string;
  content: string;
  createdBy: User;
  createdAt: string;
};
