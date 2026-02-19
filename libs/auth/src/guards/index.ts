// Guards are implemented in the API app (apps/api) because they depend on
// NestJS Request context and dependency injection. This lib exports types
// and constants used by those guards. See apps/api/src/app/auth/guards.

export { hasMinimumRole, ROLE_HIERARCHY } from '../constants';
