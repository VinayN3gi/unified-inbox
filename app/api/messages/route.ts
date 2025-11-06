import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const contactId = searchParams.get("contactId");
  if (!contactId) return NextResponse.json([]);

  const messages = await prisma.message.findMany({
    where: { contactId },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(messages);
}
