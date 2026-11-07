import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class QueryAuditDto {
  @IsString()
  @IsOptional()
  teamId?: string;

  @IsString()
  @IsOptional()
  actionType?: string;

  @IsString()
  @IsOptional()
  userName?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}

