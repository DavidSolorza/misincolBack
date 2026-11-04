export class TeamMember {
  id: string;
  teamId: string;
  fullName: string;
  contactInfo: string;
  roleInTeam: string;
}

export class Team {
  id: string;
  name: string;
  location: string;
  population: number;
  evangelicaCongregations: number;
  evangelicalsCount: number;
  leader?: string;
  leaderPhone?: string;
  members: TeamMember[] = [];
}
