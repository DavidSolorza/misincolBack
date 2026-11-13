import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EmitNotificationDto } from './domain/notification.types';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getNotifications(@Query('email') email?: string, @Query('teamId') teamId?: string) {
    return this.notificationsService.getNotifications({ email, teamId });
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Post('mark-all-read')
  markAllAsRead(@Body('email') email?: string, @Body('teamId') teamId?: string) {
    return this.notificationsService.markAllAsRead({ email, teamId });
  }

  @Post('emit')
  emitNotification(@Body() dto: EmitNotificationDto) {
    return this.notificationsService.emitNotification(dto);
  }

  @Post('team-created')
  notifyTeamCreated(@Body() dto: {
    teamName: string; ethnicity: string; location: string; leader: string;
    leaderEmail: string; accessPin: string; totalBudget: number;
    membersWithAccounts?: Array<{ fullName: string; email: string; roleInTeam?: string }>;
  }) {
    return this.notificationsService.notifyTeamCreated(dto);
  }

  @Post('team-deleted')
  notifyTeamDeleted(@Body() dto: { teamName: string; leaderName: string; deletedBy: string }) {
    return this.notificationsService.notifyTeamDeleted(dto);
  }

  @Post('trigger-audit')
  triggerAudit() {
    return this.notificationsService.runAudit();
  }

  @Get('mail-status')
  getMailStatus() {
    return this.notificationsService.getMailStatus();
  }

  @Post('test-mail')
  testMail(@Body('to') to: string) {
    const targetEmail = to || 'director@misincol.org';
    return this.notificationsService.sendTestEmail(targetEmail);
  }
}
