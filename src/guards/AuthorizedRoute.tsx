// components/guards/AuthorizedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../modules/auth/hooks/useAuth";
import { canAccess, UserRole, ViewType } from "../config/routes.config";

interface AuthorizedRouteProps {
  view: ViewType;
}

export function AuthorizedRoute({ view }: AuthorizedRouteProps) {
  const { authUser } = useAuth();

  const hasAccess = canAccess(authUser?.role as UserRole, view);

  if (!hasAccess) {
    console.warn(
      `Usuario ${authUser?.username} sin acceso a la vista: ${view}`,
    );
    // Redirigir al dashboard si no tiene permisos
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
