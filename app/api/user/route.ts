import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema validation
const userSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  instrument: z.string().optional(),
  role: z.enum(["admin", "user"]).default("user"),
}).refine(data => data.userId !== undefined, {
  message: "User ID is required",
  path: ["userId"],
});

const updateUserSchema = z.object({
  instrument: z.string().min(1, "Instrument is required"),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { userId },
      select: {
        userId: true,
        role: true,
        instrument: true
      }
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

    if (!validatedData.userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    
    const newUser = await prisma.user.create({
      data: { userId: validatedData.userId, instrument: validatedData.instrument, role: validatedData.role },
      select: {
        userId: true,
        role: true,
        instrument: true
      }
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Creation error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const body = await request.json();
    // Log the received data for debugging
    console.log('Received update data:', body);

    // Validate the instrument
    const { instrument } = updateUserSchema.parse(body);

    // Check if user exists first
    const existingUser = await prisma.user.findUnique({
      where: { userId }
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { userId },
      data: { instrument },
      select: {
        userId: true,
        role: true,
        instrument: true
      }
    });

    console.log('Updated user:', updatedUser);
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Update error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: "Validation error", 
        details: error.errors 
      }, { status: 400 });
    }
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Database error" 
    }, { status: 500 });
  }
}