import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const userSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  instrument: z.string().optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { userId: String(userId) }
    });

    if (!user) {
      console.log(`User ${userId} not found`);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = userSchema.parse(body);

    const newUser = await prisma.user.create({
      data: validatedData
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
export async function PUT(request: Request) {
    try {
      const body = await request.json();
      const { userId, instrument } = body;
  
      const updatedUser = await prisma.user.update({
        where: { userId: String(userId) },
        data: { instrument }
      });
  
      return NextResponse.json(updatedUser);
    } catch (error) {
      console.error("Update error:", error);
      return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
  }