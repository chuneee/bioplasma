// components/wrappers/DashboardLayoutWrapper.tsx
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../../modules/auth/hooks/useAuth";
import { pathToView, ROUTE_CONFIG, ViewType } from "../../config/routes.config";
import { DashboardLayout } from "../layouts/DashboardLayout";

export function DashboardLayoutWrapper() {
  const { logout, authUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll al top en cada cambio de ruta
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Obtener la vista actual
  const currentView = pathToView(location.pathname);

  // Obtener el título de la página
  const pageTitle = ROUTE_CONFIG[currentView]?.label || "Dashboard";

  // Función para navegar entre vistas
  const handleNavigate = (view: string) => {
    const v = view as ViewType;
    const route = ROUTE_CONFIG[v];

    if (route) {
      navigate(route.path);
    }
  };

  // Función para logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <DashboardLayout
      currentView={currentView}
      onNavigate={handleNavigate}
      pageTitle={pageTitle}
      onLogout={handleLogout}
      authUser={authUser!}
    >
      <Outlet />
    </DashboardLayout>
  );
}
