import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const contacts = await prisma.contact.findMany({
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  const formatted = contacts.map((c) => ({
    id: c.id,
    name: c.name || "Unnamed Contact",
    phone: c.phone,
    email: c.email,
    channel: c.messages[0]?.channel || "SMS",
    lastMessage: c.messages[0]?.body || null,
  }));

  return NextResponse.json(formatted);
}
