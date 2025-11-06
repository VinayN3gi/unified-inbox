import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Direction, Channel, MessageStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const from = form.get("From") as string;
    const body = form.get("Body") as string;

    if (!from || !body) {
      return NextResponse.json({ error: "Invalid Twilio payload" }, { status: 400 });
    }

    const isWhatsApp = from.startsWith("whatsapp:");
    const normalizedPhone = from.replace("whatsapp:", "");

    const contact = await prisma.contact.upsert({
      where: { phone: normalizedPhone },
      update: { whatsapp: isWhatsApp ? normalizedPhone : null },
      create: {
        phone: normalizedPhone,
        whatsapp: isWhatsApp ? normalizedPhone : null,
        name: `Contact ${normalizedPhone.slice(-4)}`,
      },
    });

    await prisma.message.create({
      data: {
        contactId: contact.id,
        body,
        direction: Direction.INBOUND,
        channel: isWhatsApp ? Channel.WHATSAPP : Channel.SMS,
        status: MessageStatus.DELIVERED,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ Inbound webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
