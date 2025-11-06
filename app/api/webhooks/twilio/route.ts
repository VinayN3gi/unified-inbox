import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Direction, Channel, MessageStatus } from "@prisma/client";

const SOCKET_SERVER_URL = process.env.SOCKET_SERVER_URL || "http://localhost:3001";

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

    // Create or update contact
    const contact = await prisma.contact.upsert({
      where: { phone: normalizedPhone },
      update: { whatsapp: isWhatsApp ? normalizedPhone : null },
      create: {
        phone: normalizedPhone,
        whatsapp: isWhatsApp ? normalizedPhone : null,
        name: `Contact ${normalizedPhone.slice(-4)}`,
      },
    });

    // Save new message
    const message = await prisma.message.create({
      data: {
        contactId: contact.id,
        body,
        direction: Direction.INBOUND,
        channel: isWhatsApp ? Channel.WHATSAPP : Channel.SMS,
        status: MessageStatus.DELIVERED,
      },
    });

    // ✅ Emit to Socket.IO server via HTTP
    try {
      const messagePayload = {
        id: message.id,
        contactId: contact.id,
        body: message.body,
        direction: "INBOUND",
        channel: isWhatsApp ? "WHATSAPP" : "SMS",
        incoming: true,
        createdAt: message.createdAt,
      };

      const response = await fetch(`${SOCKET_SERVER_URL}/emit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room: contact.id,
          event: "newMessage",
          data: messagePayload,
        }),
      });

      if (response.ok) {
        console.log(`📡 Realtime: Delivered message to contact ${contact.id}`);
      } else {
        console.error("⚠️ Socket emission failed:", await response.text());
      }
    } catch (socketError) {
      console.error("⚠️ Socket emission error:", socketError);
      // Don't fail the webhook if socket fails
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ Inbound webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}