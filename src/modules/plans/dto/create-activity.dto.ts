import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { IsStageConsistentWithArea } from '../../../common/validators/is-stage-consistent.validator';

export class CreateActivityDto {
  @IsEnum(['Investigación', 'Encarnación', 'Evangelización', 'Entrenamiento', 'Autocuidado', 'General', 'Auto-cuidado'])
  @IsNotEmpty()
  essentialArea: string;

  @IsString()
  @IsNotEmpty()
  @IsStageConsistentWithArea()
  stage: string;

  @IsString()
  @IsOptional()
  areaLevel?: string;

  @IsNumber()
  @Min(1)
  objectiveNumber: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  responsible: string;

  @IsString()
  @IsOptional()
  frequency?: string;

  @IsNumber()
  @Min(1)
  timesPerYear: number;

  @IsNumber()
  @Min(0)
  unitBudget: number;

  @IsString()
  startDate: string;

  @IsString()
  endDate: string;

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
