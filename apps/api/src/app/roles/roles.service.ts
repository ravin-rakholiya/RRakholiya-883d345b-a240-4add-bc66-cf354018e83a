import { Injectable } from '@nestjs/common';
import { RoleEnum } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async findByName(name: RoleEnum) {
    return this.prisma.role.findUnique({ where: { name } });
  }

  async findAll() {
    return this.prisma.role.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, description: true },
    });
  }

  async ensureDefaultRoles() {
    const roles: Array<{ name: RoleEnum; description: string }> = [
      { name: RoleEnum.Owner, description: 'Full org access and audit log' },
      { name: RoleEnum.Admin, description: 'CRUD tasks within organization' },
      { name: RoleEnum.Viewer, description: 'Read-only within organization' },
    ];
    for (const r of roles) {
      await this.prisma.role.upsert({
        where: { name: r.name },
        create: r,
        update: { description: r.description },
      });
    }
  }
}
