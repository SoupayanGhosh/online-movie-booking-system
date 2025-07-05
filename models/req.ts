import mongoose, { Schema, model, models } from "mongoose";

const RequestSchema = new Schema(
  {
    name: String,
    to: String,
    quantity: Number,
    description: String,
    externalUrl: String,
    unlockTime: String,
    targetBalance: Number,
    timestamp: String,
  },
  { timestamps: true }
);

const RequestModel = models.Request || model("Request", RequestSchema);

export default RequestModel;
