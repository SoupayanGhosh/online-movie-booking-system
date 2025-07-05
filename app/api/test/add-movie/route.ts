import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import MovieModel from "@/models/movie";

export async function GET() {
  try {
    await connectDB();
    
    // Sample movie data
    const testMovie = {
      title: "Test Movie",
      description: "This is a test movie description",
      image: "/placeholder.svg",
      rating: 4.5,
      genre: ["Action", "Adventure"],
      duration: "2h 30m",
      releaseDate: new Date(),
      language: "English",
      director: "Test Director",
      cast: ["Actor 1", "Actor 2"]
    };
    
    // Create the movie
    const movie = await MovieModel.create(testMovie);
    
    return NextResponse.json({
      success: true,
      message: "Test movie added successfully",
      movie
    });
  } catch (error) {
    console.error("Error adding test movie:", error);
    return NextResponse.json({ 
      success: false,
      error: "Error adding test movie",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 