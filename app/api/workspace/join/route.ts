import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, password, userId } = await req.json();

    
    const team = await prisma.team.findUnique({ where: { name } });
    if (!team) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    const isValid = await bcrypt.compare(password, team.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

 
    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: { teamId: team.id },
      });
    }

    
    const res = NextResponse.json({
      message: "Joined workspace",
      team,
    });

    res.cookies.set("workspace_id", team.id, {
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, 
    });

    return res;
  } catch (error) {
    console.error("Join workspace error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
