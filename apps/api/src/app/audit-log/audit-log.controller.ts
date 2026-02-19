import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { RoleEnum } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuditLogService } from './audit-log.service';
import { OrganizationsService } from '../organizations/organizations.service';

interface RequestUser {
  id: string;
  role: string;
  organizationId: string | null;
}

@Controller('audit-log')
@UseGuards(RolesGuard)
@Roles(RoleEnum.Owner, RoleEnum.Admin)
export class AuditLogController {
  constructor(
    private readonly auditLogService: AuditLogService,
    private readonly organizationsService: OrganizationsService,
  ) {}

  @Get()
  async findAll(@Request() req: { user: RequestUser }) {
    const allowedOrgIds = await this.organizationsService.getAllowedOrganizationIds(req.user);
    return this.auditLogService.findAll(allowedOrgIds);
  }
}
