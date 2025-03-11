import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { clerkClient } from "@clerk/clerk-sdk-node";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Create the user in Clerk using clerkClient
    const user = await clerkClient.users.createUser({
      username,
      password,
    });

    // Create the user in the database with the 'admin' role
    const newUser = await prisma.user.create({
      data: {
        userId: user.id,
        role: "admin",
      },
    });

    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}