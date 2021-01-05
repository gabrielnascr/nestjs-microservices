import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChallengeStatus } from './challenge-status.enum';
import { Challenge } from './interfaces/challenge.interface';
import * as momentTimezone from 'moment-timezone';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
  ) {}

  private logger = new Logger(ChallengesService.name);

  async create(challenge: Challenge): Promise<any> {
    try {
      const challengeCreated = new this.challengeModel(challenge);

      challengeCreated.dateHourRequest = new Date();
      challengeCreated.status = ChallengeStatus.PENDING;

      return await challengeCreated.save();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async findAll(): Promise<Challenge[]> {
    try {
      return await this.challengeModel.find().exec();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async findById(_id: string): Promise<Challenge> {
    try {
      return await this.challengeModel.findOne({ _id }).exec();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async findChallengeRealized(idCategory: string): Promise<Challenge[]> {
    try {
      return await this.challengeModel
        .find()
        .where('category')
        .equals(idCategory)
        .where('status')
        .equals(ChallengeStatus.REALIZED)
        .exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async findChallengeRealizedByDate(
    idCategory: string,
    dateRef: string,
  ): Promise<Challenge[]> {
    try {
      const dateRefNew = `${dateRef} 23:59.999`;
      
      return await this.challengeModel
        .find()
        .where('category')
        .equals(idCategory)
        .where('status')
        .equals(ChallengeStatus.REALIZED)
        .lte(
          momentTimezone(dateRefNew)
            .tz('UTC')
            .format('YYYY-MM-DD HH:mm:ss.SSS+00:00'),
        )
        .exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async findByPlayer(idPlayer: any): Promise<Challenge[] | Challenge> {
    try {
      return await this.challengeModel
        .find()
        .where('players')
        .in(idPlayer)
        .exec();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async update(_id: string, challenge: Challenge): Promise<any> {
    try {
      challenge.dateHourResponse = new Date();
      await this.challengeModel
        .findOneAndUpdate({ _id }, { $set: challenge })
        .exec();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }
  async updateChallengeMatch(_id: string, challenge: Challenge): Promise<any> {
    try {
      challenge.status = ChallengeStatus.REALIZED;
      challenge.match = _id;
      console.log(challenge);
      await this.challengeModel
        .findOneAndUpdate({ _id: challenge._id }, { $set: challenge })
        .exec();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async delete(challenge: Challenge): Promise<any> {
    try {
      const _id = challenge._id;

      challenge.status = ChallengeStatus.CANCELED;
      await this.challengeModel.updateOne({ _id }, { $set: challenge }).exec();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }
}
