// src/config/navigation.config.tsx
import {
  LayoutDashboard,
  Users,
  Calendar,
  Sparkles,
  Package,
  FileText,
  ShoppingCart,
  Wallet,
  Percent,
  BarChart3,
  Settings,
} from "lucide-react";
import { ROUTE_CONFIG, type UserRole, type ViewType } from "./routes.config";

type NavSection = "main" | "secondary";

export type NavItem = {
  view: ViewType;
  path: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  roles: UserRole[];
  section: NavSection;
};

export const NAV_ITEMS: NavItem[] = [
  {
    view: "dashboard",
    path: ROUTE_CONFIG.dashboard.path,
    label: ROUTE_CONFIG.dashboard.label,
    roles: ROUTE_CONFIG.dashboard.allowedRoles || [],
    icon: LayoutDashboard,
    section: "main",
  },
  {
    view: "pacientes",
    path: ROUTE_CONFIG.pacientes.path,
    label: ROUTE_CONFIG.pacientes.label,
    roles: ROUTE_CONFIG.pacientes.allowedRoles || [],
    icon: Users,
    section: "main",
  },
  {
    view: "agenda",
    path: ROUTE_CONFIG.agenda.path,
    label: ROUTE_CONFIG.agenda.label,
    roles: ROUTE_CONFIG.agenda.allowedRoles || [],
    icon: Calendar,
    section: "main",
  },
  {
    view: "servicios",
    path: ROUTE_CONFIG.servicios.path,
    label: ROUTE_CONFIG.servicios.label,
    roles: ROUTE_CONFIG.servicios.allowedRoles || [],
    icon: Sparkles,
    section: "main",
  },
  {
    view: "inventario",
    path: ROUTE_CONFIG.inventario.path,
    label: ROUTE_CONFIG.inventario.label,
    roles: ROUTE_CONFIG.inventario.allowedRoles || [],
    icon: Package,
    section: "main",
  },
  {
    view: "cotizaciones",
    path: ROUTE_CONFIG.cotizaciones.path,
    label: ROUTE_CONFIG.cotizaciones.label,
    roles: ROUTE_CONFIG.cotizaciones.allowedRoles || [],
    icon: FileText,
    section: "main",
  },
  {
    view: "ventas",
    path: ROUTE_CONFIG.ventas.path,
    label: ROUTE_CONFIG.ventas.label,
    roles: ROUTE_CONFIG.ventas.allowedRoles || [],
    icon: ShoppingCart,
    section: "main",
  },
  {
    view: "finanzas",
    path: ROUTE_CONFIG.finanzas.path,
    label: ROUTE_CONFIG.finanzas.label,
    roles: ROUTE_CONFIG.finanzas.allowedRoles || [],
    icon: Wallet,
    section: "main",
  },
  {
    view: "comisiones",
    path: ROUTE_CONFIG.comisiones.path,
    label: ROUTE_CONFIG.comisiones.label,
    roles: ROUTE_CONFIG.comisiones.allowedRoles || [],
    icon: Percent,
    section: "main",
  },
  {
    view: "reportes",
    path: ROUTE_CONFIG.reportes.path,
    label: ROUTE_CONFIG.reportes.label,
    roles: ROUTE_CONFIG.reportes.allowedRoles || [],
    icon: BarChart3,
    section: "main",
  },
  {
    view: "configuracion",
    path: ROUTE_CONFIG.configuracion.path,
    label: ROUTE_CONFIG.configuracion.label,
    roles: ROUTE_CONFIG.configuracion.allowedRoles || [],
    icon: Settings,
    section: "secondary",
  },
];

export const getNavForRole = (role: UserRole | undefined) => {
  const byRole = (n: NavItem) => (role ? n.roles.includes(role) : false);
  return {
    main: NAV_ITEMS.filter((n) => n.section === "main" && byRole(n)),
    secondary: NAV_ITEMS.filter((n) => n.section === "secondary" && byRole(n)),
  };
};
