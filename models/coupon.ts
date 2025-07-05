import mongoose, { Schema, model, models } from "mongoose";

export interface Coupon {
  _id?: mongoose.Types.ObjectId;
  code: string;
  discountPercent: number;
  maxDiscountAmount: number;
  minPurchaseAmount: number;
  validFrom: Date;
  validTo: Date;
  isActive: boolean;
  usageLimit: number;
  usedCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<Coupon>({
  code: { type: String, required: true, unique: true },
  discountPercent: { type: Number, required: true },
  maxDiscountAmount: { type: Number, required: true },
  minPurchaseAmount: { type: Number, required: true },
  validFrom: { type: Date, required: true },
  validTo: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  usageLimit: { type: Number, default: 1 },
  usedCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const CouponModel = models.Coupon || model<Coupon>("Coupon", CouponSchema);
export default CouponModel;
