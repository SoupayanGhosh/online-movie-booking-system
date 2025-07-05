import { connectDB } from "@/lib/mongoose";
import RequestModel from "@/models/req";
import { NextResponse } from "next/server";

// POST create record
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const newRequest = await RequestModel.create(body);

    return NextResponse.json(
      { message: "Record created successfully", data: newRequest },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error creating record" }, { status: 500 });
  }
}

// GET all records
export async function GET() {
  try {
    await connectDB();

    const requests = await RequestModel.find();

    return NextResponse.json(requests, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error fetching records" }, { status: 500 });
  }
}
