import { IsEnum, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateChangeRequestDto {
  @IsString()
  @IsNotEmpty()
  teamId: string;

  @IsEnum(['OBJECTIVE', 'ACTIVITY'], { message: 'entityType debe ser OBJECTIVE o ACTIVITY' })
  @IsNotEmpty()
  entityType: 'OBJECTIVE' | 'ACTIVITY';

  @IsString()
  @IsOptional()
  entityId?: string;

  @IsEnum(['CREATE', 'UPDATE', 'DELETE'], { message: 'action debe ser CREATE, UPDATE o DELETE' })
  @IsNotEmpty()
  action: 'CREATE' | 'UPDATE' | 'DELETE';

  @IsObject()
  @IsNotEmpty()
  proposedData: Record<string, any>;

  @IsString()
  @IsNotEmpty({ message: 'Debe justificar el motivo del cambio solicitado' })
  reason: string;
}

export class RejectChangeRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'El motivo de rechazo es obligatorio' })
  rejectionReason: string;
}
