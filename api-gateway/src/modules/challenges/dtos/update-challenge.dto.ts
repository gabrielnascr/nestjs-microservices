import { IsString } from 'class-validator';
import { ChallengeStatus } from '../challenge-status.enum';

export class UpdateChallengeDto {
  @IsString()
  status: ChallengeStatus;
}
