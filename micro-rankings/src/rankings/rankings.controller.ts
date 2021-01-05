/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { Match } from './interfaces/match.interface';
import { RankingResponse } from './interfaces/ranking-response.interface';
import { RankingsService } from './rankings.service';

const ackErrors: string[] = ['E11000'];

@Controller()
export class RankingsController {
  constructor(private readonly rankingsService: RankingsService) {}
  private readonly logger = new Logger(RankingsController.name);

  @EventPattern('process-match')
  async processMatch(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<any> {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      this.logger.log(`data: ${JSON.stringify(data)}`);

      const idMatch = data.idMatch;
      const match: Match = data.match;

      await this.rankingsService.processMatch(idMatch, match);
      await channel.ack(message);
    } catch (error) {
      ackErrors.map(async ackError => {
        if (error.message.includes(ackError)) {
          await channel.ack(message);
        }
      });
    }
  }

  @EventPattern('find-rankings')
  async find(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<RankingResponse[] | RankingResponse> {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      const idCategory = data.idCategory;
      const dateRef = data.dateRef;

      return await this.rankingsService.find(idCategory, dateRef);
    } finally {
      await channel.ack(message);
    }
  }
}
