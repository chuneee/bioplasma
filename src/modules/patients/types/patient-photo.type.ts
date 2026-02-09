import { User } from "../../settings/types/user.type";

export type PatientPhotos = {
  id: number;
  urls: any[];
  type: string;
  description: string;
  uploadedBy: User;
  createdAt: string;
};
