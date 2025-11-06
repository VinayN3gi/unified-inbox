import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Direction, Channel, MessageStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const from = data.get("From") as string;
    const body = data.get("Body") as string;

    if (!from || !body)
      return NextResponse.json({ error: "Invalid Twilio payload" }, { status: 400 });

    const normalizedPhone = from.replace("whatsapp:", "");

    // Find or create contact
    const contact = await prisma.contact.upsert({
      where: { phone: normalizedPhone },
      update: {},
      create: { phone: normalizedPhone },
    });

    // Save inbound message
    await prisma.message.create({
      data: {
        contactId: contact.id,
        body,
        direction: Direction.INBOUND,
        channel: Channel.SMS,
        status: MessageStatus.DELIVERED,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ Inbound Webhook Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
