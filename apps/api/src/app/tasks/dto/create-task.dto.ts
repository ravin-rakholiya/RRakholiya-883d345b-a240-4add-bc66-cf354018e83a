import { IsString, IsOptional, IsInt, Min, MaxLength, IsEnum, IsUUID } from 'class-validator';
import { TaskCategory } from '@prisma/client';

export class CreateTaskDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  priority?: number;

  @IsOptional()
  @IsEnum(TaskCategory)
  category?: TaskCategory;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  assignedToId?: string;

  /** Optional. Parent Owners may specify child org; otherwise uses user's org. */
  @IsOptional()
  @IsUUID()
  organizationId?: string;
}
