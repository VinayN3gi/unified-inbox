import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: Request) {
  const token = req.headers
    .get("cookie")
    ?.split("session_token=")[1]
    ?.split(";")[0];

  if (!token)
    return NextResponse.json({ authenticated: false }, { status: 401 });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return NextResponse.json({ authenticated: true, user: payload });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
