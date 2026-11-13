import { Controller, Get, Put, Post, Body } from '@nestjs/common';
import { SecurityService } from './security.service';
import { UpdateSecurityMatrixDto } from './dto/update-security-matrix.dto';

@Controller('security')
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Get('matrix')
  getMatrix() {
    return {
      matrix: this.securityService.getMatrix(),
      roles: this.securityService.getRoles(),
    };
  }

  @Put('matrix')
  async updateMatrix(@Body() dto: UpdateSecurityMatrixDto) {
    const matrix = await this.securityService.updateMatrix(dto.matrix);
    return {
      success: true,
      matrix,
    };
  }

  @Post('users/sync')
  async syncUsers(@Body('users') users: any[]) {
    const res = await this.securityService.syncUsers(users);
    return {
      success: true,
      savedCount: res.savedCount,
    };
  }
}
