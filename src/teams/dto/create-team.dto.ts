import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

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
  leaderPhone?: string;

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

