import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TwilioClient } from "@/lib/twilio";
import { Direction, Channel, MessageStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { contactId, teamId, userId, body, mediaUrl } = await req.json();

    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
    });

    if (!contact?.phone) {
      return NextResponse.json(
        { error: "Contact not found or missing phone number" },
        { status: 404 }
      );
    }

    // Send via Twilio
    const messageResponse = await TwilioClient.sendMessage({
      to: contact.phone,
      body,
      mediaUrl,
      channel: "SMS",
    });

    // Save to database
    const newMessage = await prisma.message.create({
      data: {
        contactId,
        teamId,
        userId,
        body,
        mediaUrl,
        direction: Direction.OUTBOUND,
        channel: Channel.SMS,
        status: MessageStatus.SENT,
      },
    });

    return NextResponse.json({
      success: true,
      messageSid: messageResponse.sid,
      message: newMessage,
    });
  } catch (error: any) {
    console.error("❌ Send SMS Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
