import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RoleEnum } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { OrganizationsService, UserContext } from '../organizations/organizations.service';
import { RegisterDto } from '../auth/dto/register.dto';
import { CreateUserDto } from './dto/create-user.dto';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly organizationsService: OrganizationsService,
  ) {}

  async findByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email: email.toLowerCase(), deletedAt: null },
      include: { role: true },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      include: { role: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async createUser(dto: RegisterDto) {
    const role = await this.prisma.role.findUnique({
      where: { name: RoleEnum.Viewer },
    });
    if (!role) throw new Error('Default Viewer role not found. Run seed.');
    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    return this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        roleId: role.id,
      },
      include: { role: true },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: { select: { name: true } },
        organization: { select: { id: true, name: true } },
        isActive: true,
        createdAt: true,
      },
    });
  }

  async createUserByAdmin(dto: CreateUserDto, creator: UserContext) {
    if (creator.role !== RoleEnum.Owner) {
      throw new ForbiddenException('Only Owner can create users');
    }

    const allowedOrgIds = await this.organizationsService.getAllowedOrganizationIds(creator);
    if (!allowedOrgIds.includes(dto.organizationId)) {
      throw new ForbiddenException('Cannot create user in organization outside your scope');
    }

    const existing = await this.prisma.user.findFirst({
      where: { email: dto.email.toLowerCase(), deletedAt: null },
    });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const role = await this.prisma.role.findUnique({
      where: { id: dto.roleId },
    });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const org = await this.prisma.organization.findUnique({
      where: { id: dto.organizationId },
    });
    if (!org) {
      throw new NotFoundException('Organization not found');
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    return this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        roleId: dto.roleId,
        organizationId: dto.organizationId,
      },
      include: {
        role: true,
        organization: { select: { id: true, name: true } },
      },
    });
  }
}
