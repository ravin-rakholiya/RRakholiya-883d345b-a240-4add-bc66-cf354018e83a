import type { RoleName } from '@turbo-vets/data';

/** Role hierarchy: Owner > Admin > Viewer. Index = strength (higher = more privileged). */
export const ROLE_HIERARCHY: Record<RoleName, number> = {
  Owner: 2,
  Admin: 1,
  Viewer: 0,
};

export const ROLES_KEY = 'roles';
export const PERMISSIONS_KEY = 'permissions';
export const IS_PUBLIC_KEY = 'isPublic';

/** Returns true if userRole has at least the privilege of requiredRole. */
export function hasMinimumRole(userRole: RoleName, requiredRole: RoleName): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}
