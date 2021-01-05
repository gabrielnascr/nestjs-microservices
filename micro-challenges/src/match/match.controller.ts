import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { Match } from './interfaces/match.interface';
import { MatchService } from './match.service';

const ackErrors: string[] = ['E11000'];

@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @EventPattern('create-match')
  async create(
    @Payload() match: Match,
    @Ctx() context: RmqContext,
  ): Promise<any> {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    
    try {
      await this.matchService.createMatch(match);
      await channel.ack(message);
    } catch (error) {
      ackErrors.map(async ackError => {
        if (error.message.includes(ackError)) {
          await channel.ack(message);
        }
      });
    }
  }
}
