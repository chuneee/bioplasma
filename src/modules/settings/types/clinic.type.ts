export interface Clinic {
  id: string;
  logo_url?: string;
  trade_name: string;
  company_name: string;
  rfc: string;
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClinicCredentials extends Partial<Clinic> {
  trade_name: string;
  company_name: string;
  rfc: string;
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  website?: string;
  facebook?: string;
  instagram?: string;
}
