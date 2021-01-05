import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './interfaces/category.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
  ) {}
  async create(category: Category): Promise<Category> {
    try {
      const categoryCreated = new this.categoryModel(category);
      return await categoryCreated.save();
    } catch (err) {
      throw new RpcException(err.message);
    }
  }
  async findAll(): Promise<Category[]> {
    try {
      return await this.categoryModel.find().exec();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }
  async findById(_id: string): Promise<Category> {
    try {
      return await this.categoryModel.findOne({ _id }).exec();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async update(_id: string, category: Category): Promise<any> {
    try {
      await this.categoryModel
        .findOneAndUpdate({ _id }, { $set: category })
        .exec();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async delete(_id: string): Promise<any> {
    try {
      await this.categoryModel.findOneAndDelete({_id}).exec()
    } catch (error) {
      throw new RpcException(error.message)
    }
  }
}
