import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() dto: CreateTaskDto, @Request() req: { user: { id: string; role: string; organizationId: string | null } }) {
    return this.tasksService.create(dto, req.user);
  }

  @Get()
  findAll(@Request() req: { user: { id: string; role: string; organizationId: string | null } }) {
    return this.tasksService.findAll(req.user);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Request() req: { user: { id: string; role: string; organizationId: string | null } }
  ) {
    return this.tasksService.findOne(id, req.user);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @Request() req: { user: { id: string; role: string; organizationId: string | null } }
  ) {
    return this.tasksService.update(id, dto, req.user);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Request() req: { user: { id: string; role: string; organizationId: string | null } }
  ) {
    return this.tasksService.remove(id, req.user);
  }
}
