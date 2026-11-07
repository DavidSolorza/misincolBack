import { Team } from '../entities/team.entity';
import { TEAMS_ANDINA_DATA } from './initial-teams-andina.data';
import { TEAMS_CARIBE_DATA } from './initial-teams-caribe.data';

export const INITIAL_TEAMS_DATA: Team[] = [
  ...TEAMS_ANDINA_DATA,
  ...TEAMS_CARIBE_DATA,
];
