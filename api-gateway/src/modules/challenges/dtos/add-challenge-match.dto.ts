import { IsNotEmpty } from 'class-validator';
import { Player } from '../../players/interfaces/player.interface';
import { Result } from '../interfaces/match.interface';

export class AddChallengeMatchDto {
  @IsNotEmpty()
  def: Player;

  @IsNotEmpty()
  result: Result[];
}
