import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { RoleEnum } from '@prisma/client';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  const createMockContext = (user: { role?: string }): ExecutionContext =>
    ({
      switchToHttp: () => ({ getRequest: () => ({ user }) }),
      getHandler: () => ({}),
      getClass: () => ({}),
    }) as unknown as ExecutionContext;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  it('should allow when no roles are required', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    expect(guard.canActivate(createMockContext({ role: 'Viewer' }))).toBe(true);
  });

  it('should allow when user has required role', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([RoleEnum.Owner]);
    expect(guard.canActivate(createMockContext({ role: RoleEnum.Owner }))).toBe(true);
  });

  it('should throw ForbiddenException when user lacks role', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([RoleEnum.Owner]);
    expect(() =>
      guard.canActivate(createMockContext({ role: 'Viewer' }))
    ).toThrow(ForbiddenException);
  });
});
