import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import MovieModel from "@/models/movie";

export async function GET() {
  try {
    await connectDB();
    const movies = await MovieModel.find({}).sort({ releaseDate: 'desc' });
    return NextResponse.json(movies);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching movies" }, { status: 500 });
  }
}
