export class ChangeRequest {
  id: string;
  teamId: string;
  entityType: 'OBJECTIVE' | 'ACTIVITY';
  entityId?: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  proposedData: Record<string, any>;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedBy: string;
  resolvedBy?: string;
  createdAt: string;
  resolvedAt?: string;
  rejectionReason?: string;
}

