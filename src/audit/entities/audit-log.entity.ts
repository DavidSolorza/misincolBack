export interface AuditLog {
  id: string;
  teamId: string;
  teamName: string;
  userId?: string;
  userName: string;
  userRole?: string;
  actionType: string;
  title: string;
  detail: string;
  fieldModified?: string;
  previousValue?: string;
  newValue?: string;
  phaseId?: string;
  timestamp: string; // ISO 8601
}

