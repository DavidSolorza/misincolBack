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

