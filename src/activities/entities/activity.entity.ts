export class Activity {
  id: string;
  objectiveId: string;
  description: string;
  status: 'Pendiente' | 'En Proceso' | 'Completado';
  stage: string;
  essentialArea: string;
  areaLevel?: string;
  unitBudget: number;
  totalBudget: number;
  frequency: string;
  timesPerYear: number;
  startDate: string;
  endDate: string;
  responsible: string;
  currentSituation?: string;
  shortTermGoal?: string;
  mediumTermGoal?: string;
  longTermGoal?: string;
  createdBy?: string;
  updatedBy?: string;
}
