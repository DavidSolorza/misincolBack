import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class TeamMemberAccountDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del integrante es obligatorio' })
  fullName: string;

  @IsEmail({}, { message: 'El correo electrónico debe ser válido' })
  @IsNotEmpty({ message: 'El correo del integrante es obligatorio' })
  email: string;

  @IsString()
  @IsOptional()
  roleInTeam?: string;
}

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del equipo misionero es obligatorio' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'La ubicación territorial es obligatoria' })
  location: string;

  @IsNumber()
  @Min(0)
  population: number;

  @IsNumber()
  @Min(0)
  evangelicaCongregations: number;

  @IsNumber()
  @Min(0)
  evangelicalsCount: number;

  @IsString()
  @IsOptional()
  leader?: string;

  @IsString()
  @IsOptional()
  leaderEmail?: string;

  @IsString()
  @IsOptional()
  leaderPhone?: string;

  @IsString()
  @IsOptional()
  accessPin?: string;

  @IsString()
  @IsOptional()
  ethnicity?: string;

  @IsString()
  @IsOptional()
  region?: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsString()
  @IsOptional()
  currentPhaseId?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  totalBudget?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  executedBudget?: number;

  @IsString()
  @IsOptional()
  themeColor?: string;

  @IsString()
  @IsOptional()
  healthStatus?: 'Optimo' | 'Atención' | 'Crítico';

  @IsArray()
  @IsOptional()
  members?: string[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TeamMemberAccountDto)
  membersWithAccounts?: TeamMemberAccountDto[];
}

export class AddTeamMemberDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  contactInfo: string;

  @IsString()
  @IsNotEmpty()
  roleInTeam: string;
}
