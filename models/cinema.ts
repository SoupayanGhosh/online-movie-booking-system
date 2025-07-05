import mongoose, { Schema, model, models } from "mongoose";

export interface Cinema {
  _id?: mongoose.Types.ObjectId;
  name: string;
  location: string;
  screens: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CinemaSchema = new Schema<Cinema>({
  name: { type: String, required: true },
  location: { type: String, required: true },
  screens: { type: Number, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const CinemaModel = models.Cinema || model<Cinema>("Cinema", CinemaSchema);
export default CinemaModel;
