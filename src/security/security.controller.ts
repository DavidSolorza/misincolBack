import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { SecurityService } from './security.service';
import { UpdateSecurityMatrixDto } from './dto/update-security-matrix.dto';

@Controller('security')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Get('matrix')
  @Roles(UserRole.ROLE_NACIONAL, UserRole.ROLE_LIDER, UserRole.ROLE_USUARIO)
  getMatrix() {
    return {
      matrix: this.securityService.getMatrix(),
      roles: this.securityService.getRoles(),
    };
  }

  @Put('matrix')
  @Roles(UserRole.ROLE_NACIONAL)
  updateMatrix(@Body() dto: UpdateSecurityMatrixDto) {
    return {
      success: true,
      matrix: this.securityService.updateMatrix(dto.matrix),
    };
  }
}

