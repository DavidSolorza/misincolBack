import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateFieldReportDto {
  @IsString()
  @IsNotEmpty()
  teamId: string;

  @IsNumber()
  @Min(2000)
  year: number;

  @IsNumber()
  @Min(0)
  firstTimeContacts: number;

  @IsNumber()
  @Min(0)
  interestedPeople: number;

  @IsNumber()
  @Min(0)
  heardGospel: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  seekingGodPeople?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  gospelResponseOpportunities?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  believersCount?: number;

  @IsNumber()
  @Min(0)
  baptizedCount: number;

  @IsNumber()
  @Min(0)
  activeBibleStudies: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  personalMentorships?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  newGroupsMeetingInYear?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  churchPerspectiveGroups?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  finalChurchesCount?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  churchGenerations?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  ministerialTrainingCount?: number;
}

export class UpdateFieldReportDto extends CreateFieldReportDto {}
