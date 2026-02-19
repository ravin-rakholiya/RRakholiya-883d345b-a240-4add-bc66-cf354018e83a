import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { RoleEnum } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

interface RequestUser {
  id: string;
  role: string;
  organizationId: string | null;
}

@Controller('users')
@UseGuards(RolesGuard)
@Roles(RoleEnum.Owner)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(
    @Body() dto: CreateUserDto,
    @Request() req: { user: RequestUser }
  ) {
    return this.usersService.createUserByAdmin(dto, req.user);
  }
}
