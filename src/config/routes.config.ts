// config/routes.config.ts

import { Roles } from "../modules/auth/enums/role.enum";

export type ViewType =
  | "dashboard"
  | "pacientes"
  | "agenda"
  | "servicios"
  | "inventario"
  | "cotizaciones"
  | "ventas"
  | "finanzas"
  | "comisiones"
  | "reportes"
  | "configuracion";

export type UserRole = Roles;

// Configuración de rutas
export const ROUTE_CONFIG: Record<
  ViewType,
  {
    path: string;
    label: string;
    allowedRoles: UserRole[];
  }
> = {
  dashboard: {
    path: "/dashboard",
    label: "Dashboard",
    allowedRoles: [Roles.ADMINNISTRADOR, Roles.RECEPCIONISTA],
  },
  pacientes: {
    path: "/pacientes",
    label: "Pacientes",
    allowedRoles: [Roles.ADMINNISTRADOR, Roles.RECEPCIONISTA],
  },
  agenda: {
    path: "/agenda",
    label: "Agenda y Citas",
    allowedRoles: [Roles.ADMINNISTRADOR, Roles.RECEPCIONISTA],
  },
  servicios: {
    path: "/servicios",
    label: "Servicios",
    allowedRoles: [Roles.ADMINNISTRADOR],
  },
  inventario: {
    path: "/inventario",
    label: "Inventario",
    allowedRoles: [Roles.ADMINNISTRADOR],
  },
  cotizaciones: {
    path: "/cotizaciones",
    label: "Cotizaciones",
    allowedRoles: [Roles.ADMINNISTRADOR, Roles.RECEPCIONISTA],
  },
  ventas: {
    path: "/ventas",
    label: "Ventas",
    allowedRoles: [Roles.ADMINNISTRADOR, Roles.RECEPCIONISTA],
  },
  finanzas: {
    path: "/finanzas",
    label: "Finanzas",
    allowedRoles: [Roles.ADMINNISTRADOR],
  },
  comisiones: {
    path: "/comisiones",
    label: "Comisiones",
    allowedRoles: [Roles.ADMINNISTRADOR],
  },
  reportes: {
    path: "/reportes",
    label: "Reportes",
    allowedRoles: [Roles.ADMINNISTRADOR],
  },
  configuracion: {
    path: "/configuracion",
    label: "Configuración",
    allowedRoles: [Roles.ADMINNISTRADOR],
  },
};

// Verificar si un rol tiene acceso a una vista
export function canAccess(role: UserRole | undefined, view: ViewType): boolean {
  if (!role) return false;
  return ROUTE_CONFIG[view].allowedRoles.includes(role);
}

// Obtener la vista desde el path
export function pathToView(pathname: string): ViewType {
  // Para rutas dinámicas como /pacientes/:id, extraer la base
  const basePath = pathname.split("/")[1];
  const fullPath = `/${basePath}`;

  const entry = Object.entries(ROUTE_CONFIG).find(
    ([_, config]) => config.path === fullPath,
  );

  return (entry?.[0] as ViewType) || "dashboard";
}
