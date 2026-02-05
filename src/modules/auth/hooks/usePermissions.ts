import { useAuth } from "./useAuth";
import type { PermissionCheck } from "../types/permission.type";

export const usePermissions = (): PermissionCheck => {
  const { authUser } = useAuth();

  const hasPermission = (permission: string): boolean => {
    if (!authUser) return false;
    return authUser.permissions?.includes(permission) ?? false;
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!authUser || !permissions.length) return false;
    return permissions.some((permission) => hasPermission(permission));
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!authUser || !permissions.length) return false;
    return permissions.every((permission) => hasPermission(permission));
  };

  const hasRole = (role: string): boolean => {
    if (!authUser) return false;
    return authUser.role === role;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    if (!authUser || !roles.length) return false;
    return roles.includes(authUser.role);
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
  };
};
