import * as mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, unique: true },
    phoneNumber: { type: String },
    category: {type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    ranking: { type: String },
    rankPosition: { type: String },
    avatar: { type: String },
  },
  { timestamps: true, collection: 'players' },
);
