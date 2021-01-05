import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

@Schema({ timestamps: true, collection: 'rankings' })
export class Ranking extends Document {
  @Prop({ type: SchemaTypes.ObjectId })
  challenge: string;

  @Prop({ type: SchemaTypes.ObjectId })
  player: string;

  @Prop({ type: SchemaTypes.ObjectId })
  match: string;

  @Prop({ type: SchemaTypes.ObjectId })
  category: string;

  @Prop()
  event: string;

  @Prop()
  operation: string;

  @Prop()
  points: number;
}

export const RankingSchema = SchemaFactory.createForClass(Ranking);
