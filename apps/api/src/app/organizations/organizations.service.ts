import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RoleEnum } from '@prisma/client';
import { CreateOrganizationDto } from './dto/create-organization.dto';

export interface UserContext {
  id: string;
  role: string;
  organizationId: string | null;
}

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Returns org IDs the user may access. Parent Owners: parent + children. Child Owners, Admins, Viewers: their org only. */
  async getAllowedOrganizationIds(user: UserContext): Promise<string[]> {
    if (!user.organizationId) return [];
    const org = await this.prisma.organization.findUnique({
      where: { id: user.organizationId },
      include: { children: { select: { id: true } } },
    });
    if (!org) return [];
    // Parent Owner: parent + all child org IDs
    if (user.role === RoleEnum.Owner && !org.parentId) {
      return [org.id, ...org.children.map((c) => c.id)];
    }
    // Child Owner, Admin, Viewer: only their org
    return [user.organizationId];
  }

  private slugify(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  /** Returns orgs the user may access. Parent Owner: parent + children. Child Owner, Admin: their org only. */
  async findAll(allowedOrgIds: string[] = []) {
    const where = allowedOrgIds.length > 0 ? { id: { in: allowedOrgIds } } : {};
    return this.prisma.organization.findMany({
      where,
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        parentId: true,
      },
    });
  }

  async create(dto: CreateOrganizationDto, userId: string, userRole: string, allowedOrgIds: string[] = []) {
    if (userRole !== RoleEnum.Owner) {
      throw new ForbiddenException('Only Owner can create organizations');
    }

    if (dto.parentId && allowedOrgIds.length > 0 && !allowedOrgIds.includes(dto.parentId)) {
      throw new ForbiddenException('Cannot create child of organization outside your scope');
    }

    let baseSlug = this.slugify(dto.name);
    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const existing = await this.prisma.organization.findUnique({
        where: { slug },
      });
      if (!existing) break;
      slug = `${baseSlug}-${counter++}`;
    }

    if (dto.parentId) {
      const parent = await this.prisma.organization.findUnique({
        where: { id: dto.parentId },
      });
      if (!parent) {
        throw new NotFoundException('Parent organization not found');
      }
      // 2-level hierarchy: children cannot have children (parent must be root)
      if (parent.parentId) {
        throw new ConflictException(
          '2-level hierarchy: cannot create child of a child organization'
        );
      }
    }

    return this.prisma.organization.create({
      data: {
        name: dto.name,
        slug,
        parentId: dto.parentId ?? null,
      },
    });
  }
}
