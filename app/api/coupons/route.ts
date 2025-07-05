import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import CouponModel from "@/models/coupon";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { code, amount } = await req.json();
    const coupon = await CouponModel.findOne({ code, isActive: true, validFrom: { $lte: new Date() }, validTo: { $gte: new Date() }, usageLimit: { $gt: "$usedCount" } });
    if (!coupon) {
      return NextResponse.json({ message: "Invalid or expired coupon" }, { status: 400 });
    }
    if (amount < coupon.minPurchaseAmount) {
      return NextResponse.json({ message: `Minimum purchase amount is ${coupon.minPurchaseAmount}` }, { status: 400 });
    }
    let discount = (amount * coupon.discountPercent) / 100;
    if (discount > coupon.maxDiscountAmount) {
      discount = coupon.maxDiscountAmount;
    }
    coupon.usedCount += 1;
    await coupon.save();
    return NextResponse.json({ discount, coupon });
  } catch (error) {
    return NextResponse.json({ message: "Error applying coupon" }, { status: 500 });
  }
}
