import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { Player } from './interfaces/player.interface';
import { PlayersService } from './players.service';

const ackErrors: string[] = ['E11000'];

interface Data {
  id: string;
  player?: Player;
  filename?: string
}

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) { }

  @EventPattern('create-player')
  async create(@Payload() player: Player, @Ctx() context: RmqContext): Promise<any> {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      await this.playersService.create(player);
      await channel.ack(message);
    } catch (error) {
      ackErrors.map(async ackError => {
        if (error.message.includes(ackError)) {
          await channel.ack(message);
        }
      });
    }
  }

  @MessagePattern('find-players')
  async find(@Payload() id: string, @Ctx() context: RmqContext): Promise<any> {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      if (id) {
        return await this.playersService.findOne(id);
      } else {
        return await this.playersService.find();
      }
    } finally {
      await channel.ack(message);
    }
  }

  @EventPattern('update-player')
  async update(@Payload() data: Data, @Ctx() context: RmqContext): Promise<any> {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      const _id: string = data.id;
      const player: Player = data.player;

      console.log(data)
      await this.playersService.update(_id, player);
      await channel.ack(message);
    } catch (error) {
      ackErrors.map(async ackError => {
        if (error.message.includes(ackError)) {
          await channel.ack(message);
        }
      });
    }
  }

  @EventPattern('delete-player')
  async delete(@Payload() id: string, @Ctx() context: RmqContext): Promise<any> {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      return await this.playersService.delete(id);
    } finally {
      await channel.ack(message);
    }
  }

  @MessagePattern('upload-avatar')
  async uploadFile(@Payload() data: Data, @Ctx() context: RmqContext): Promise<any> {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    const id = data.id
    const file = data.filename

    try {
      return await this.playersService.upload(id, file)
    } finally {
      await channel.ack(message)
    }
  }
}


 


