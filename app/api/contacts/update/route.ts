import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { id, name } = await req.json();

    if (!id || !name.trim()) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    await prisma.contact.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error updating contact:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
