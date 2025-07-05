import { NextResponse } from "next/server";
import { generateCsrfToken } from "@/lib/csrf";

export async function GET(request: Request) {
  try {
    const token = generateCsrfToken();
    const response = NextResponse.json({ token });
    response.headers.set('Set-Cookie', `csrfToken=${token}; Path=/; SameSite=Lax`);
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate CSRF token" },
      { status: 500 }
    );
  }
}
