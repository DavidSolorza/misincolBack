import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { IsStageConsistentWithArea } from '../../common/validators/is-stage-consistent.validator';

export class CreateObjectiveDto {
  @IsString()
  @IsNotEmpty()
  teamId: string;

  @IsString()
  @IsNotEmpty()
  pillarId: string;

  @IsString()
  @IsNotEmpty({ message: 'El título del objetivo es obligatorio' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción del objetivo es obligatoria' })
  description: string;

  @IsEnum(['Investigación', 'Encarnación', 'Evangelización', 'Entrenamiento', 'Autocuidado', 'Auto-cuidado'])
  @IsNotEmpty()
  essentialArea: string;

  @IsString()
  @IsNotEmpty({ message: 'La etapa asociada al pilar es obligatoria' })
  @IsStageConsistentWithArea()
  stage: string;

  @IsString()
  @IsOptional()
  level?: string;

  @IsString()
  @IsOptional()
  shortTermGoal?: string;

  @IsString()
  @IsOptional()
  mediumTermGoal?: string;

  @IsString()
  @IsOptional()
  longTermGoal?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  totalBudget?: number;
}

export class UpdateObjectiveDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['Investigación', 'Encarnación', 'Evangelización', 'Entrenamiento', 'Autocuidado', 'General', 'Auto-cuidado'])
  @IsOptional()
  essentialArea?: string;

  @IsString()
  @IsOptional()
  @IsStageConsistentWithArea()
  stage?: string;

  @IsString()
  @IsOptional()
  level?: string;

  @IsString()
  @IsOptional()
  mediumTermGoal?: string;

  @IsString()
  @IsOptional()
  longTermGoal?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  totalBudget?: number;
}
