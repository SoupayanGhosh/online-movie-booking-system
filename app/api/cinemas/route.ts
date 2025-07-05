import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import CinemaModel from "@/models/cinema";

export async function GET() {
  try {
    await connectDB();
    const cinemas = await CinemaModel.find({});
    return NextResponse.json(cinemas);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching cinemas" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    const cinema = await CinemaModel.create(data);
    return NextResponse.json(cinema);
  } catch (error) {
    return NextResponse.json({ message: "Error creating cinema" }, { status: 500 });
  }
}
