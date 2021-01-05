/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { BadRequestException, Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { ChallengesService } from './challenges.service';
import { Challenge } from './interfaces/challenge.interface';

const ackErrors: string[] = ['E11000'];

interface Data {
  id?: string;
  challenge?: Challenge;
  idPlayer?: string;
  idMatch?: string;
}

@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}
  private logger = new Logger(ChallengesController.name);

  @EventPattern('create-challenge')
  async create(
    @Payload() challenge: Challenge,
    @Ctx() context: RmqContext,
  ): Promise<any> {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    try {
      await this.challengesService.create(challenge);
      await channel.ack(message);
    } catch (error) {
      this.logger.error(error);
      ackErrors.map(async ackError => {
        if (error.message.includes(ackError)) {
          await channel.ack(message);
        }
      });
    }
  }

  @MessagePattern('find-challenge')
  async find(@Payload() data: Data, @Ctx() context: RmqContext): Promise<any> {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    const id = data.id;
    const idPlayer = data.idPlayer;

    try {
      if (idPlayer) {
        return await this.challengesService.findByPlayer(idPlayer);
      } else if (id) {
        return await this.challengesService.findById(id);
      } else {
        return await this.challengesService.findAll();
      }
    } finally {
      await channel.ack(message);
    }
  }

  @EventPattern('update-challenge')
  async update(
    @Payload() data: Data,
    @Ctx() context: RmqContext,
  ): Promise<any> {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    const id = data.id;
    const challenge: Challenge = data.challenge;

    try {
      await this.challengesService.update(id, challenge);
    } catch (error) {
      this.logger.error(error);
      ackErrors.map(async ackError => {
        if (error.message.includes(ackError)) {
          await channel.ack(message);
        }
      });
    }
  }

  @EventPattern('update-challenge-match')
  async updateChallengeMatch(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<any> {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    const idMatch = data.idMatch;
    const challenge: Challenge = data.challenge;

    try {
      await this.challengesService.updateChallengeMatch(idMatch, challenge);
      await channel.ack(message);
    } catch (error) {
      ackErrors.map(async ackError => {
        if (error.message.includes(ackError)) {
          await channel.ack(message);
        }
      });
    }
  }

  @EventPattern('delete-challenge')
  async delete(
    @Payload() challenge: Challenge,
    @Ctx() context: RmqContext,
  ): Promise<any> {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      await this.challengesService.delete(challenge);
    } finally {
      await channel.ack(message);
    }
  }

  @MessagePattern('find-challenge-realized')
  async findChallengeRealized(@Payload() data: any, @Ctx() context: RmqContext):Promise<Challenge[] | Challenge> {
    const channel = context.getChannelRef()
    const message = context.getMessage()
  
    try {
      const idCategory = data.idCategory
      const dateRef = data.dateRef

      if(dateRef) {
        return await this.challengesService.findChallengeRealizedByDate(idCategory, dateRef)
      } else {
        return await this.challengesService.findChallengeRealized(idCategory)
      }
    } finally {
      await channel.ack((message))
    }
  }
}
