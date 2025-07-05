import { NextResponse } from "next/server";
import type { NextRequest } from 'next/server';
import { compare } from "bcryptjs";
import { DatabaseService } from "@/lib/db";
import { csrfMiddleware } from "@/lib/middleware";

async function handler(req: NextRequest) {
  try {
    // 1. Validate request body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error("Invalid request body:", error);
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 }
      );
    }

    const { email, password } = body;

    // 2. Validate required fields
    if (!email || !password) {
      console.error("Missing required fields:", { email: !!email, password: !!password });
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // 3. Get database instance and find user
    let db;
    try {
      db = await DatabaseService.getInstance();
    } catch (error) {
      console.error("Database connection error:", error);
      return NextResponse.json(
        { message: "Database connection error" },
        { status: 500 }
      );
    }

    let user;
    try {
      user = await db.getUserByEmail(email);
    } catch (error) {
      console.error("Error fetching user:", error);
      return NextResponse.json(
        { message: "Error fetching user" },
        { status: 500 }
      );
    }
    
    if (!user) {
      console.error("User not found:", email);
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 4. Verify password
    let isValid;
    try {
      isValid = await compare(password, user.password);
    } catch (error) {
      console.error("Password comparison error:", error);
      return NextResponse.json(
        { message: "Error verifying password" },
        { status: 500 }
      );
    }

    if (!isValid) {
      console.error("Invalid password for user:", email);
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 5. Update last login
    try {
      if (user._id) {
        await db.updateUserLastLogin(user._id.toString());
      }
    } catch (error) {
      console.error("Error updating last login:", error);
      // Don't fail the login if this fails
    }

    // 6. Return user data (excluding sensitive information)
    return NextResponse.json({
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isVerified: user.isVerified
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { 
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export const POST = csrfMiddleware(handler);
