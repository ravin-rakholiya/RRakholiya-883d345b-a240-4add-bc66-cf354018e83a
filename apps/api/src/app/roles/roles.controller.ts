import { Controller, Get, UseGuards } from '@nestjs/common';
import { RoleEnum } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RolesService } from './roles.service';

@Controller('roles')
@UseGuards(RolesGuard)
@Roles(RoleEnum.Owner, RoleEnum.Admin)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }
}
