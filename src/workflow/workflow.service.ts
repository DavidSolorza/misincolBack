import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateChangeRequestDto } from './dto/create-change-request.dto';
import { ChangeRequest } from './entities/change-request.entity';
import { PlanStatus } from './entities/plan-status.entity';

@Injectable()
export class WorkflowService {
  private planStatuses: PlanStatus[] = [];
  private changeRequests: ChangeRequest[] = [];

  getPlanStatus(teamId: string, year: number = 2026): PlanStatus {
    let status = this.planStatuses.find((p) => p.teamId === teamId && p.year === year);
    if (!status) {
      status = {
        teamId,
        year,
        status: 'DRAFT',
        isLocked: false,
        updatedAt: new Date().toISOString(),
      };
      this.planStatuses.push(status);
    }
    return status;
  }

  isTeamLocked(teamId: string, year: number = 2026): boolean {
    const status = this.getPlanStatus(teamId, year);
    return status.isLocked;
  }

  finishPlan(teamId: string, userEmail: string, year: number = 2026): PlanStatus {
    const status = this.getPlanStatus(teamId, year);
    status.status = 'FINISHED';
    status.isLocked = true;
    status.lockedAt = new Date().toISOString();
    status.lockedBy = userEmail;
    status.updatedAt = new Date().toISOString();
    return status;
  }

  reopenPlan(teamId: string, userEmail: string, year: number = 2026): PlanStatus {
    const status = this.getPlanStatus(teamId, year);
    status.status = 'DRAFT';
    status.isLocked = false;
    status.updatedAt = new Date().toISOString();
    return status;
  }

  createChangeRequest(dto: CreateChangeRequestDto, userEmail: string): ChangeRequest {
    const newReq: ChangeRequest = {
      id: randomUUID(),
      teamId: dto.teamId,
      entityType: dto.entityType,
      entityId: dto.entityId,
      action: dto.action,
      proposedData: dto.proposedData,
      reason: dto.reason,
      status: 'PENDING',
      requestedBy: userEmail,
      createdAt: new Date().toISOString(),
    };
    this.changeRequests.push(newReq);
    return newReq;
  }

  findAllChangeRequests(status?: 'PENDING' | 'APPROVED' | 'REJECTED', teamId?: string): ChangeRequest[] {
    let list = [...this.changeRequests];
    if (status) list = list.filter((r) => r.status === status);
    if (teamId) list = list.filter((r) => r.teamId === teamId);
    return list;
  }

  approveChangeRequest(id: string, reviewerEmail: string): ChangeRequest {
    const request = this.changeRequests.find((r) => r.id === id);
    if (!request) throw new NotFoundException(`Solicitud ${id} no encontrada`);
    if (request.status !== 'PENDING') {
      throw new BadRequestException(`La solicitud ya fue resuelta como ${request.status}`);
    }
    request.status = 'APPROVED';
    request.resolvedBy = reviewerEmail;
    request.resolvedAt = new Date().toISOString();
    return request;
  }

  rejectChangeRequest(id: string, rejectionReason: string, reviewerEmail: string): ChangeRequest {
    const request = this.changeRequests.find((r) => r.id === id);
    if (!request) throw new NotFoundException(`Solicitud ${id} no encontrada`);
    if (request.status !== 'PENDING') {
      throw new BadRequestException(`La solicitud ya fue resuelta como ${request.status}`);
    }
    request.status = 'REJECTED';
    request.rejectionReason = rejectionReason;
    request.resolvedBy = reviewerEmail;
    request.resolvedAt = new Date().toISOString();
    return request;
  }
}
