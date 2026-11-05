import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateChangeRequestDto, RejectChangeRequestDto } from './dto/create-change-request.dto';
import { WorkflowService } from './workflow.service';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Get('teams/:teamId/plan-status')
  getStatus(@Param('teamId') teamId: string, @Query('year') year?: number) {
    const yr = year ? Number(year) : 2026;
    return this.workflowService.getPlanStatus(teamId, yr);
  }

  @Post('teams/:teamId/finish-plan')
  finishPlan(@Param('teamId') teamId: string, @Req() req: any, @Query('year') year?: number) {
    const yr = year ? Number(year) : 2026;
    const userEmail = req.user?.email || 'Líder';
    return this.workflowService.finishPlan(teamId, userEmail, yr);
  }

  @Post('teams/:teamId/reopen-plan')
  @Roles(UserRole.ROLE_NACIONAL)
  reopenPlan(@Param('teamId') teamId: string, @Req() req: any, @Query('year') year?: number) {
    const yr = year ? Number(year) : 2026;
    const userEmail = req.user?.email || 'ROLE_NACIONAL';
    return this.workflowService.reopenPlan(teamId, userEmail, yr);
  }

  @Get('change-requests')
  @Roles(UserRole.ROLE_NACIONAL)
  getChangeRequests(
    @Query('status') status?: 'PENDING' | 'APPROVED' | 'REJECTED',
    @Query('teamId') teamId?: string,
  ) {
    return this.workflowService.findAllChangeRequests(status, teamId);
  }

  @Post('change-requests')
  createChangeRequest(@Body() dto: CreateChangeRequestDto, @Req() req: any) {
    const userEmail = req.user?.email || 'Líder';
    return this.workflowService.createChangeRequest(dto, userEmail);
  }

  @Post('change-requests/:id/approve')
  @Roles(UserRole.ROLE_NACIONAL)
  approve(@Param('id') id: string, @Req() req: any) {
    const reviewer = req.user?.email || 'ROLE_NACIONAL';
    return this.workflowService.approveChangeRequest(id, reviewer);
  }

  @Post('change-requests/:id/reject')
  @Roles(UserRole.ROLE_NACIONAL)
  reject(@Param('id') id: string, @Body() dto: RejectChangeRequestDto, @Req() req: any) {
    const reviewer = req.user?.email || 'ROLE_NACIONAL';
    return this.workflowService.rejectChangeRequest(id, dto.rejectionReason, reviewer);
  }
}

