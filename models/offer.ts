import mongoose, { Schema, model, models } from "mongoose";

export interface Offer {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  discountPercent: number;
  validFrom: Date;
  validTo: Date;
  couponCode?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OfferSchema = new Schema<Offer>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  discountPercent: { type: Number, required: true },
  validFrom: { type: Date, required: true },
  validTo: { type: Date, required: true },
  couponCode: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const OfferModel = models.Offer || model<Offer>("Offer", OfferSchema);
export default OfferModel;
