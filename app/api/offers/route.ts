import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import OfferModel from "@/models/offer";

export async function GET() {
  try {
    await connectDB();
    const offers = await OfferModel.find({ isActive: true, validTo: { $gte: new Date() } });
    return NextResponse.json(offers);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching offers" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    const offer = await OfferModel.create(data);
    return NextResponse.json(offer);
  } catch (error) {
    return NextResponse.json({ message: "Error creating offer" }, { status: 500 });
  }
}
