import { Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll(@Req() req: any, @Query('target') target?: string) {
    const filter = target || (req.user?.role === UserRole.ROLE_NACIONAL ? undefined : req.user?.email);
    return this.notificationsService.findAll(filter);
  }

  @Post('trigger-audit')
  @Roles(UserRole.ROLE_NACIONAL)
  triggerAudit() {
    return this.notificationsService.runAudit();
  }
}
