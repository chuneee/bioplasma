/**
 * Utilidades para trabajar con permisos de forma dinámica
 */

// Generador de nombres de permisos siguiendo convenciones
export const createPermission = (resource: string, action: string): string => {
  return `${resource}.${action}`;
};

// Parsear un permiso
export const parsePermission = (
  permission: string,
): { resource: string; action: string } | null => {
  const parts = permission.split(".");
  if (parts.length !== 2) return null;

  return {
    resource: parts[0],
    action: parts[1],
  };
};

// Verificar si un usuario tiene un permiso con wildcard
export const matchPermission = (
  userPermissions: string[],
  requiredPermission: string,
): boolean => {
  // Verificación exacta
  if (userPermissions.includes(requiredPermission)) {
    return true;
  }

  // Verificación con wildcards
  const parsed = parsePermission(requiredPermission);
  if (!parsed) return false;

  const { resource, action } = parsed;

  // Verificar permiso de wildcard para el recurso
  if (userPermissions.includes(`${resource}.*`)) {
    return true;
  }

  // Verificar permiso global
  if (userPermissions.includes("*.*")) {
    return true;
  }

  return false;
};

// Verificar múltiples permisos con wildcards
export const matchAnyPermission = (
  userPermissions: string[],
  requiredPermissions: string[],
): boolean => {
  return requiredPermissions.some((permission) =>
    matchPermission(userPermissions, permission),
  );
};

export const matchAllPermissions = (
  userPermissions: string[],
  requiredPermissions: string[],
): boolean => {
  return requiredPermissions.every((permission) =>
    matchPermission(userPermissions, permission),
  );
};

// Ejemplos de permisos comunes (solo como referencia, no obligatorios)
export const PERMISSION_EXAMPLES = {
  // Pacientes
  PATIENTS_VIEW: "pacientes.ver",
  PATIENTS_CREATE: "pacientes.crear",
  PATIENTS_EDIT: "pacientes.editar",
  PATIENTS_DELETE: "pacientes.eliminar",
  PATIENTS_ALL: "pacientes.*",

  // Citas
  APPOINTMENTS_VIEW: "citas.ver",
  APPOINTMENTS_CREATE: "citas.crear",
  APPOINTMENTS_EDIT: "citas.editar",
  APPOINTMENTS_DELETE: "citas.eliminar",

  // Finanzas
  FINANCE_VIEW: "finanzas.ver",
  FINANCE_EDIT: "finanzas.editar",

  // Reportes
  REPORTS_VIEW: "reportes.ver",
  REPORTS_EXPORT: "reportes.exportar",

  // Admin
  ADMIN_ALL: "*.*",
};
