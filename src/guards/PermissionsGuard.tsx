// src/components/guards/PermissionGuard.tsx

import { usePermissions } from "../modules/auth/hooks/usePermissions";

interface PermissionGuardProps {
  children: React.ReactNode;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  role?: string;
  roles?: string[];
  fallback?: React.ReactNode;
}

export const PermissionGuard = ({
  children,
  permission,
  permissions,
  requireAll = false,
  role,
  roles,
  fallback = null,
}: PermissionGuardProps) => {
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
  } = usePermissions();

  let hasAccess = true;

  // Verificar permiso único
  if (permission && !hasPermission(permission)) {
    hasAccess = false;
  }

  // Verificar múltiples permisos
  if (permissions && permissions.length > 0) {
    if (requireAll) {
      hasAccess = hasAllPermissions(permissions);
    } else {
      hasAccess = hasAnyPermission(permissions);
    }
  }

  // Verificar rol único
  if (role && !hasRole(role)) {
    hasAccess = false;
  }

  // Verificar múltiples roles
  if (roles && roles.length > 0 && !hasAnyRole(roles)) {
    hasAccess = false;
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};
