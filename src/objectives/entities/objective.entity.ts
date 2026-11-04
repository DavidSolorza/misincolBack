export class Pillar {
  id: string;
  name: string;
  totalBudget: number;
}

export class Objective {
  id: string;
  teamId: string;
  pillarId: string; // investigacion | encarnacion | evangelizacion | entrenamiento | autocuidado
  dynamicPosition: number; // 1, 2, 3, 4 autoenumerado
  title: string;
  description: string;
  essentialArea: string;
  level?: string;
  stage?: string;
  mediumTermGoal?: string;
  longTermGoal?: string;
}
