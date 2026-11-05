export class PlanStatus {
  teamId: string;
  year: number;
  status: 'DRAFT' | 'FINISHED';
  isLocked: boolean;
  lockedAt?: string;
  lockedBy?: string;
  updatedAt: string;
}

