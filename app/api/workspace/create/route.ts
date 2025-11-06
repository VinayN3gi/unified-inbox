import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";;
import { prisma } from "@/lib/prisma"; 

export async function POST(req: Request) {
  try {
    const { name, password, userId } = await req.json();

    const existing = await prisma.team.findUnique({ where: { name } });
    if (existing) {
      return NextResponse.json({ error: "Workspace name already exists" }, { status: 400 });
    }

    const hash = await bcrypt.hash(password, 10);
    const team = await prisma.team.create({
      data: {
        name,
        passwordHash: hash,
        users: userId
          ? { connect: { id: userId } }
          : undefined,
      },
    });

    const res = NextResponse.json({ message: "Workspace created", team });
    res.cookies.set("workspace_id", team.id, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 7 });
    return res;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
