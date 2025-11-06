import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TwilioClient } from "@/lib/twilio";
import { Direction, Channel, MessageStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { contactId, body } = await req.json();

    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
    });

    if (!contact || !contact.phone) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    // Decide channel automatically (WhatsApp if contact.whatsapp exists)
    const channel = contact.whatsapp ? Channel.WHATSAPP : Channel.SMS;

    const message = await TwilioClient.sendMessage({
      to: contact.whatsapp || contact.phone,
      body,
      channel,
    });

    await prisma.message.create({
      data: {
        contactId,
        body,
        direction: Direction.OUTBOUND,
        channel,
        status: MessageStatus.SENT,
      },
    });

    return NextResponse.json({ success: true, sid: message.sid });
  } catch (error: any) {
    console.error("Send Message Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
