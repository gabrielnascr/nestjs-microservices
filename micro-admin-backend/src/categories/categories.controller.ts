import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Category } from './interfaces/category.interface';
import { CategoriesService } from './categories.service';

const ackErrors: string[] = ['E11000'];

interface Data {
  id: string;
  category: Category;
}

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  private logger = new Logger(CategoriesController.name);

  @EventPattern('create-category')
  async create(
    @Payload() category: Category,
    @Ctx() context: RmqContext,
  ): Promise<any> {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      await this.categoriesService.create(category);
      await channel.ack(message);
    } catch (error) {
      ackErrors.map(async ackError => {
        if (error.message.includes(ackError)) {
          await channel.ack(message);
        }
      });
    }
  }

  @MessagePattern('find-category')
  async findCategory(
    @Payload() _id: string,
    @Ctx() context: RmqContext,
  ): Promise<any> {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      if (_id) {
        return await this.categoriesService.findById(_id);
      } else {
        return await this.categoriesService.findAll();
      }
    } finally {
      await channel.ack(message);
    }
  }

  @EventPattern('update-category')
  async update(
    @Payload() data: Data,
    @Ctx() context: RmqContext,
  ): Promise<any> {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      const _id: string = data.id;
      const category: Category = data.category;

      await this.categoriesService.update(_id, category);
      await channel.ack(message);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      ackErrors.map(async ackError => {
        if (error.message.includes(ackError)) {
          await channel.ack(message);
        }
      });
    }
  }

  @MessagePattern('delete-category')
  async delete(@Payload() id: string, @Ctx() context: RmqContext): Promise<any> {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      await this.categoriesService.delete(id)
    } finally {
      await channel.ack(message);
    }
  }
}
