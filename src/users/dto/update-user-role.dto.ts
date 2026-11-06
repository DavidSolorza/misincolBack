import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '../../common/enums/user-role.enum';

export class UpdateUserRoleDto {
  @IsNotEmpty({ message: 'El rol del usuario es obligatorio.' })
  @IsEnum(UserRole, {
    message: `El rol debe ser válido: ${Object.values(UserRole).join(', ')}`,
  })
  role: UserRole;
}
