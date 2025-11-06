import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(
  req: Request,
  { params }: { params: { contactId: string } }
) {
  const cookie = req.headers.get("cookie") || "";
  const token = cookie.split("session_token=")[1]?.split(";")[0];
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    jwt.verify(token, JWT_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  try {
    const notes = await prisma.note.findMany({
      where: { contactId: params.contactId },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(notes);
  } catch (error: any) {
    console.error("Error fetching notes:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
