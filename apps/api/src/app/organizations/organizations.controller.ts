import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { RoleEnum } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';

interface RequestUser {
  id: string;
  role: string;
  organizationId: string | null;
}

@Controller('organizations')
@UseGuards(RolesGuard)
@Roles(RoleEnum.Owner, RoleEnum.Admin)
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get()
  async findAll(@Request() req: { user: RequestUser }) {
    const allowedOrgIds = await this.organizationsService.getAllowedOrganizationIds(req.user);
    return this.organizationsService.findAll(allowedOrgIds);
  }

  @Post()
  @Roles(RoleEnum.Owner)
  async create(
    @Body() dto: CreateOrganizationDto,
    @Request() req: { user: RequestUser }
  ) {
    const allowedOrgIds = await this.organizationsService.getAllowedOrganizationIds(req.user);
    return this.organizationsService.create(dto, req.user.id, req.user.role, allowedOrgIds);
  }
}
