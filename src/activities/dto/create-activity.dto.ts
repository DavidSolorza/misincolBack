import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { IsStageConsistentWithArea } from '../../common/validators/is-stage-consistent.validator';

export class CreateActivityDto {
  @IsString()
  @IsNotEmpty()
  objectiveId: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción de la actividad es obligatoria' })
  description: string;

  @IsEnum(['Pendiente', 'En Proceso', 'Completado'])
  @IsOptional()
  status?: 'Pendiente' | 'En Proceso' | 'Completado';

  @IsEnum(['Investigación', 'Encarnación', 'Evangelización', 'Entrenamiento', 'Autocuidado', 'General'])
  @IsNotEmpty()
  essentialArea: string;

  @IsString()
  @IsNotEmpty()
  @IsStageConsistentWithArea()
  stage: string;

  @IsEnum(['Nivel 1', 'Nivel 2', 'Nivel 3', 'Nivel 4', 'Nivel 5'])
  @IsOptional()
  areaLevel?: string;

  @IsNumber()
  @Min(0)
  unitBudget: number;

  @IsNumber()
  @Min(1)
  timesPerYear: number;

  @IsString()
  @IsOptional()
  frequency?: string;

  @IsString()
  startDate: string;

  @IsString()
  endDate: string;

  @IsString()
  @IsNotEmpty({ message: 'El responsable de la actividad es obligatorio' })
  responsible: string;

  @IsString()
  @IsOptional()
  currentSituation?: string;

  @IsString()
  @IsOptional()
  shortTermGoal?: string;

  @IsString()
  @IsOptional()
  mediumTermGoal?: string;

  @IsString()
  @IsOptional()
  longTermGoal?: string;
}

export class UpdateActivityDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['Pendiente', 'En Proceso', 'Completado'])
  @IsOptional()
  status?: 'Pendiente' | 'En Proceso' | 'Completado';

  @IsEnum(['Investigación', 'Encarnación', 'Evangelización', 'Entrenamiento', 'Autocuidado', 'General'])
  @IsOptional()
  essentialArea?: string;

  @IsString()
  @IsOptional()
  @IsStageConsistentWithArea()
  stage?: string;

  @IsEnum(['Nivel 1', 'Nivel 2', 'Nivel 3', 'Nivel 4', 'Nivel 5'])
  @IsOptional()
  areaLevel?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  unitBudget?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  timesPerYear?: number;

  @IsString()
  @IsOptional()
  frequency?: string;

  @IsString()
  @IsOptional()
  startDate?: string;

  @IsString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  responsible?: string;

  @IsString()
  @IsOptional()
  currentSituation?: string;

  @IsString()
  @IsOptional()
  shortTermGoal?: string;

  @IsString()
  @IsOptional()
  mediumTermGoal?: string;

  @IsString()
  @IsOptional()
  longTermGoal?: string;
}

