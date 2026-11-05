import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../common/enums/user-role.enum';

export class CreateUserDto {
  @IsEmail({}, { message: 'Debe ingresar un correo electrónico válido' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre completo es obligatorio' })
  fullName: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener mínimo 6 caracteres' })
  @IsNotEmpty()
  password: string;

  @IsEnum(UserRole, { message: 'El rol debe ser ROLE_NACIONAL o ROLE_LIDER' })
  @IsNotEmpty()
  role: UserRole;

  @IsString()
  @IsOptional()
  teamId?: string;
}
