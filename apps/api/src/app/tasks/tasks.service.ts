import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { RoleEnum, TaskCategory } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

interface RequestUser {
  id: string;
  role: string;
  organizationId: string | null;
}

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
    private readonly organizationsService: OrganizationsService,
  ) {}

  private canManageAllTasks(role: string): boolean {
    return role === RoleEnum.Owner || role === RoleEnum.Admin;
  }

  private canAssignTasks(role: string): boolean {
    return role === RoleEnum.Owner || role === RoleEnum.Admin;
  }

  private isViewer(role: string): boolean {
    return role === RoleEnum.Viewer;
  }

  async create(dto: CreateTaskDto, user: RequestUser) {
    if (this.isViewer(user.role)) {
      throw new ForbiddenException('Viewer cannot create tasks');
    }
    const allowedOrgIds = await this.organizationsService.getAllowedOrganizationIds(user);
    if (allowedOrgIds.length === 0) {
      throw new ForbiddenException('Cannot create task: no organization scope');
    }
    let orgId = dto.organizationId ?? user.organizationId ?? undefined;
    if (orgId && !allowedOrgIds.includes(orgId)) {
      throw new ForbiddenException('Cannot create task in organization outside scope');
    }
    if (!orgId) {
      orgId = allowedOrgIds[0];
    }
    const assignedToId = this.canAssignTasks(user.role) ? dto.assignedToId : user.id;
    const task = await this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        priority: dto.priority ?? 0,
        category: dto.category ?? TaskCategory.Other,
        sortOrder: dto.sortOrder ?? 0,
        createdById: user.id,
        assignedToId: assignedToId ?? user.id,
        organizationId: orgId,
      },
      include: {
        createdBy: { select: { id: true, email: true, firstName: true, lastName: true } },
        assignedTo: { select: { id: true, email: true, firstName: true, lastName: true } },
      },
    });
    await this.auditLogService.log({
      userId: user.id,
      organizationId: user.organizationId,
      action: 'CREATE',
      resource: 'task',
      resourceId: task.id,
      details: { title: task.title },
    });
    return task;
  }

  async findAll(user: RequestUser) {
    const allowedOrgIds = await this.organizationsService.getAllowedOrganizationIds(user);
    const where: { deletedAt: null; organizationId?: { in: string[] } } = {
      deletedAt: null,
    };
    if (allowedOrgIds.length === 0) {
      return [];
    }
    where.organizationId = { in: allowedOrgIds };
    return this.prisma.task.findMany({
      where,
      include: {
        createdBy: { select: { id: true, email: true, firstName: true, lastName: true } },
        assignedTo: { select: { id: true, email: true, firstName: true, lastName: true } },
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(id: string, user: RequestUser) {
    const task = await this.prisma.task.findFirst({
      where: { id, deletedAt: null },
      include: {
        createdBy: { select: { id: true, email: true, firstName: true, lastName: true } },
        assignedTo: { select: { id: true, email: true, firstName: true, lastName: true } },
      },
    });
    if (!task) throw new NotFoundException('Task not found');
    const allowedOrgIds = await this.organizationsService.getAllowedOrganizationIds(user);
    const taskOrgId = task.organizationId;
    if (taskOrgId) {
      if (allowedOrgIds.length === 0 || !allowedOrgIds.includes(taskOrgId)) {
        throw new ForbiddenException('Access denied: task is outside your organization scope');
      }
    } else {
      // Task with no org: deny if user has org scope (org-scoped model)
      if (allowedOrgIds.length > 0) {
        throw new ForbiddenException('Access denied: task has no organization scope');
      }
    }
    return task;
  }

  async update(id: string, dto: UpdateTaskDto, user: RequestUser) {
    if (this.isViewer(user.role)) {
      throw new ForbiddenException('Viewer cannot update tasks');
    }
    await this.findOne(id, user);
    const data: Record<string, unknown> = { ...dto };
    if (dto.assignedToId !== undefined && !this.canAssignTasks(user.role)) {
      delete data.assignedToId;
    }
    const task = await this.prisma.task.update({
      where: { id },
      data,
      include: {
        createdBy: { select: { id: true, email: true, firstName: true, lastName: true } },
        assignedTo: { select: { id: true, email: true, firstName: true, lastName: true } },
      },
    });
    await this.auditLogService.log({
      userId: user.id,
      organizationId: user.organizationId,
      action: 'UPDATE',
      resource: 'task',
      resourceId: id,
      details: { title: task.title, ...data },
    });
    return task;
  }

  async remove(id: string, user: RequestUser) {
    if (this.isViewer(user.role)) {
      throw new ForbiddenException('Viewer cannot delete tasks');
    }
    const task = await this.findOne(id, user);
    await this.auditLogService.log({
      userId: user.id,
      organizationId: user.organizationId,
      action: 'DELETE',
      resource: 'task',
      resourceId: id,
      details: { title: task.title },
    });
    return this.prisma.task.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
