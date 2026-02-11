import { useNavigate, useLocation } from "react-router-dom";
import { useCallback, useMemo } from "react";
import { pathToView, ROUTE_CONFIG, ViewType } from "../config/routes.config";

export function useNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  // Obtener la vista actual
  const currentView = useMemo(() => {
    return pathToView(location.pathname);
  }, [location.pathname]);

  // Navegar a una vista específica
  const navigateTo = useCallback(
    (view: ViewType) => {
      const route = ROUTE_CONFIG[view];
      if (route) {
        navigate(route.path);
      }
    },
    [navigate],
  );

  // Navegar atrás
  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Verificar si una ruta está activa
  const isActive = useCallback(
    (view: ViewType) => {
      return currentView === view;
    },
    [currentView],
  );

  // Navegar a un paciente específico
  const navigateToPaciente = useCallback(
    (pacienteId: string) => {
      navigate(`/pacientes/${pacienteId}`);
    },
    [navigate],
  );
  const navigateToProducto = useCallback(
    (productoId: string) => {
      navigate(`/inventario/${productoId}`);
    },
    [navigate],
  );

  return {
    currentView,
    navigateTo,
    goBack,
    isActive,
    navigateToPaciente,
    navigateToProducto,
    location,
    navigate,
  };
}
