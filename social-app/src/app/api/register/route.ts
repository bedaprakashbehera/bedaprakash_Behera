import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, username, name, password } = body ?? {};
  if (!email || !username || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
  if (existing) {
    return NextResponse.json({ error: "Email or username already in use" }, { status: 409 });
  }
  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { email, username, name, hashedPassword: hashed },
  });
  return NextResponse.json({ ok: true });
}
