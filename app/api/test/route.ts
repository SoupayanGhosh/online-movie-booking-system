import { NextResponse } from "next/server";
import { DatabaseService } from "@/lib/db";

export async function GET() {
  try {
    const db = await DatabaseService.getInstance();
    
    // Try to get users to test the connection
    const users = await db.getUsers();
    
    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      data: {
        userCount: users.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("Database connection test failed:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Database connection failed",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
