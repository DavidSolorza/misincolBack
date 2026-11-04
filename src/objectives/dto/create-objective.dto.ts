import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
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

  @IsEnum(['Investigación', 'Encarnación', 'Evangelización', 'Entrenamiento', 'Autocuidado', 'General'])
  @IsNotEmpty()
  essentialArea: string;

  @IsEnum(['Nivel 1', 'Nivel 2', 'Nivel 3', 'Nivel 4', 'Nivel 5'])
  @IsOptional()
  level?: string;

  @IsString()
  @IsOptional()
  @IsStageConsistentWithArea()
  stage?: string;

  @IsString()
  @IsOptional()
  mediumTermGoal?: string;

  @IsString()
  @IsOptional()
  longTermGoal?: string;
}

export class UpdateObjectiveDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['Investigación', 'Encarnación', 'Evangelización', 'Entrenamiento', 'Autocuidado', 'General'])
  @IsOptional()
  essentialArea?: string;

  @IsEnum(['Nivel 1', 'Nivel 2', 'Nivel 3', 'Nivel 4', 'Nivel 5'])
  @IsOptional()
  level?: string;

  @IsString()
  @IsOptional()
  @IsStageConsistentWithArea()
  stage?: string;

  @IsString()
  @IsOptional()
  mediumTermGoal?: string;

  @IsString()
  @IsOptional()
  longTermGoal?: string;
}

