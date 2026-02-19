import { SetMetadata } from '@nestjs/common';
import type { RoleName } from '@turbo-vets/data';
import { ROLES_KEY } from '../constants';

export const Roles = (...roles: RoleName[]) => SetMetadata(ROLES_KEY, roles);
