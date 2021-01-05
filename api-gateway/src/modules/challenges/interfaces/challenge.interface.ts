import { Player } from '../../players/interfaces/player.interface';
import { ChallengeStatus } from '../challenge-status.enum';
import { Match } from './match.interface';

export interface Challenge {
  dateHourChallenge: Date;
  dateTimeRequest: Date;
  dateHourResponse: Date;
  status: ChallengeStatus;
  requester: string;
  category: string;
  players: Array<Player>;
  match: Match;
}
