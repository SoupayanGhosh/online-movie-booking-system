import { connectDB } from "@/lib/mongoose";
import Request from "@/models/req";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    const newRequest = await Request.create(body);

    return NextResponse.json(
      {
        message: "Record created successfully",
        data: newRequest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error creating record" }, { status: 500 });
  }
}
