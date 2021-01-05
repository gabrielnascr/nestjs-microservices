import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player } from './interfaces/player.interface';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  async create(player: Player): Promise<Player> {
    try {
      const playerCreated = new this.playerModel(player)
      return await playerCreated.save()
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async find(): Promise<Player[]> {
    try {
      return await this.playerModel.find().exec()
    } catch (error) {
      throw new RpcException(error.message)
    }
  }
  async findOne(_id: string): Promise<Player> {
    try {
      return await this.playerModel.findOne({_id}).exec()
    } catch (error) {
      throw new RpcException(error.message)
    } 
  }
  async update(_id: string, player: Player): Promise<any> {
    try {
      await this.playerModel.findOneAndUpdate({_id}, {$set: player}).exec()
    } catch(error) {
      throw new RpcException(error.message)
    }
  }

  async delete(_id: string): Promise<any> {
    try {
      await this.playerModel.findOneAndRemove({_id}).exec()
    } catch (error) {
      throw new RpcException(error.message)
    }
  }
  async upload(_id: string, file: string): Promise<any> {
    try {
      await this.playerModel.updateOne({ _id }, { $set:{ avatar: file }})
    } catch (error) {
      throw new RpcException(error.message)
    }
  }
}
