import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import OfferModel from "@/models/offer";

const sampleOffers = [
  {
    title: "Buy 10, Pay for 8",
    description: "Grab tickets for 10 shows and pay only for 8—your two movie nights are on us!",
    discountPercent: 20,
    validFrom: new Date(),
    validTo: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
    couponCode: "MOVIELOVER10",
    isActive: true
  },
  {
    title: "30% Off on Your First Purchase",
    description: "New here? Enjoy a welcome gift with 30% off on your first booking.",
    discountPercent: 30,
    validFrom: new Date(),
    validTo: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    couponCode: "FIRST30",
    isActive: true
  },
  {
    title: "Couple's Delight – 50% Off for Two",
    description: "Date night made better—get 50% off when booking 2 tickets together.",
    discountPercent: 50,
    validFrom: new Date(),
    validTo: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    couponCode: "COUPLE50",
    isActive: true
  },
  {
    title: "Salute to Service – 90% Off for Indian Army Personnel",
    description: "A small tribute for your immense service. (Valid ID required at entry)",
    discountPercent: 90,
    validFrom: new Date(),
    validTo: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    couponCode: "DEFENCE90",
    isActive: true
  },
  {
    title: "Student Discount – Up to 50% Off",
    description: "Student life is tough, movies shouldn't be. Unlock special rates with a valid student ID.",
    discountPercent: 50,
    validFrom: new Date(),
    validTo: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    couponCode: "STUDENT50",
    isActive: true
  }
];

export async function GET() {
  try {
    await connectDB();
    await OfferModel.deleteMany({}); // Clear existing offers
    const offers = await OfferModel.insertMany(sampleOffers);
    return NextResponse.json({ message: "Sample offers created successfully", offers });
  } catch (error) {
    return NextResponse.json({ message: "Error creating sample offers" }, { status: 500 });
  }
}
