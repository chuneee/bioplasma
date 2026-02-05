// components/layouts/Sidebar.tsx
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
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import bioPlasmaLogo from "figma:asset/175af98dc3b4599e36e3eb47be9bf1f4fb2a405b.png";
import { AuthUser } from "../../modules/auth/types/auth.type";
import { canAccess, ViewType, UserRole } from "../../config/routes.config";

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
  authUser: AuthUser;
  onLogout: () => void;
}

interface MenuItem {
  id: ViewType;
  label: string;
  icon: React.ComponentType<any>;
}

const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  { id: "pacientes", label: "Pacientes", icon: Users },
  { id: "agenda", label: "Agenda", icon: Calendar },
  { id: "servicios", label: "Servicios", icon: Sparkles },
  { id: "inventario", label: "Inventario", icon: Package },
  { id: "cotizaciones", label: "Cotizaciones", icon: FileText },
  { id: "ventas", label: "Ventas", icon: ShoppingCart },
  { id: "finanzas", label: "Finanzas", icon: Wallet },
  { id: "comisiones", label: "Comisiones", icon: Percent },
  { id: "reportes", label: "Reportes", icon: BarChart3 },
];

const secondaryItems: MenuItem[] = [
  {
    id: "configuracion",
    label: "Configuración",
    icon: Settings,
  },
];

export function Sidebar({
  isCollapsed,
  onToggleCollapse,
  currentView,
  onNavigate,
  authUser,
  onLogout,
}: SidebarProps) {
  // Filtrar items basado en permisos del usuario
  const visibleMenuItems = menuItems.filter((item) =>
    canAccess(authUser?.role as UserRole, item.id)
  );

  const visibleSecondaryItems = secondaryItems.filter((item) =>
    canAccess(authUser?.role as UserRole, item.id)
  );

  const renderMenuItem = (item: MenuItem) => {
    const Icon = item.icon;
    const isActive = currentView === item.id;

    return (
      <li key={item.id}>
        <button
          onClick={() => onNavigate(item.id)}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative ${
            isActive
              ? "bg-[#8B7355]/15 text-[var(--color-primary)]"
              : "text-[var(--color-text-secondary)] hover:bg-[#F5F2EF] hover:text-[var(--color-text)]"
          }`}
          aria-label={item.label}
          aria-current={isActive ? "page" : undefined}
        >
          {isActive && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] bg-[var(--color-primary)] rounded-r"></div>
          )}
          <Icon size={20} strokeWidth={1.5} className="flex-shrink-0" />
          {!isCollapsed && <span className="text-[15px]">{item.label}</span>}
        </button>
      </li>
    );
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white border-r border-[var(--color-border)] flex flex-col transition-all duration-300 ease-in-out z-30 ${
        isCollapsed ? "w-[72px]" : "w-[260px]"
      }`}
      role="navigation"
      aria-label="Navegación principal"
    >
      {/* Header del Sidebar */}
      <div className="h-20 flex items-center justify-center border-b border-[var(--color-border)] px-4 relative">
        {isCollapsed ? (
          <div className="w-12 h-12 flex items-center justify-center">
            <img
              src={bioPlasmaLogo}
              alt="Bio Plasma"
              className="w-10 h-10 object-contain"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center w-full px-2">
            <img
              src={bioPlasmaLogo}
              alt="Bio Plasma"
              className="w-[165px] h-auto object-contain"
            />
          </div>
        )}

        {/* Toggle button */}
        <button
          onClick={onToggleCollapse}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border border-[var(--color-border)] shadow-sm flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all"
          aria-label={isCollapsed ? "Expandir menú" : "Colapsar menú"}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Menú Principal */}
      <nav className="flex-1 overflow-y-auto py-6 px-3">
        <ul className="space-y-1">{visibleMenuItems.map(renderMenuItem)}</ul>

        {/* Separador */}
        {visibleSecondaryItems.length > 0 && (
          <div className="my-6 border-t border-[var(--color-border)]"></div>
        )}

        {/* Menú Secundario */}
        {visibleSecondaryItems.length > 0 && (
          <ul className="space-y-1">{visibleSecondaryItems.map(renderMenuItem)}</ul>
        )}
      </nav>

      {/* Footer del Sidebar - Usuario */}
      <div className="border-t border-[var(--color-border)] p-4">
        <div
          className={`flex items-center gap-3 mb-3 ${isCollapsed ? "justify-center" : ""}`}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B7355] to-[#D4A574] flex items-center justify-center text-white flex-shrink-0">
            <span style={{ fontSize: "14px", fontWeight: 600 }}>
              {authUser?.username
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p
                className="truncate"
                style={{ fontSize: "14px", fontWeight: 500 }}
              >
                {authUser?.username}
              </p>
              <p
                className="text-[var(--color-text-secondary)] truncate"
                style={{ fontSize: "12px" }}
              >
                {authUser?.role}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[var(--color-error)] hover:bg-red-50 transition-all ${
            isCollapsed ? "justify-center" : ""
          }`}
          aria-label="Cerrar sesión"
        >
          <LogOut size={18} strokeWidth={1.5} />
          {!isCollapsed && (
            <span style={{ fontSize: "14px" }}>Cerrar sesión</span>
          )}
        </button>
      </div>
    </aside>
  );
}