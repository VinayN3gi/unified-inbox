import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const token = cookie.split("session_token=")[1]?.split(";")[0];
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let decoded: any;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  const { contactId, content } = await req.json();

  if (!contactId || !content.trim()) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  try {
    const note = await prisma.note.create({
      data: {
        contactId,
        userId: decoded.id, // from session token
        content,
      },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    return NextResponse.json(note);
  } catch (error: any) {
    console.error("Error saving note:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
