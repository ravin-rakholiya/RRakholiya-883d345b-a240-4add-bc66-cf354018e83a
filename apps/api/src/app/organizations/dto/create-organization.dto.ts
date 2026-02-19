import { IsString, IsOptional, IsUUID, MaxLength } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @MaxLength(200)
  name!: string;

  @IsOptional()
  @IsUUID()
  parentId?: string;
}
