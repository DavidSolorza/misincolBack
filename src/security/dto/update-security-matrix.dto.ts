import { IsNotEmpty, IsObject } from 'class-validator';
import { SecurityMatrix } from '../entities/security-matrix.entity';

export class UpdateSecurityMatrixDto {
  @IsObject()
  @IsNotEmpty()
  matrix: SecurityMatrix;
}
