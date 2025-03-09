import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Define the schema for validation using zod
const userSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  instrument: z.string().optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`Received request with method: ${req.method}`);

  if (req.method === "GET") {
    const { userId } = req.query;

    // Log the userId being passed in the query
    console.log("GET request received, userId:", userId);

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    try {
      // Log the attempt to fetch the user from the database
      console.log(`Attempting to fetch user with userId: ${String(userId)}`);

      const user = await prisma.user.findUnique({
        where: { userId: String(userId) },
      });

      if (!user) {
        console.log(`User with userId: ${userId} not found.`);
        return res.status(404).json({ error: "User not found" });
      }

      console.log("User data fetched successfully:", user);
      return res.status(200).json(user);
    } catch (error) {
      console.error("Error while fetching user:", error);
      return res.status(500).json({ error: "Database error" });
    }
  }

  if (req.method === "POST") {
    try {
      // Log incoming request body
      console.log("POST request received, body:", req.body);

      // Validate incoming data with zod
      const validatedData = userSchema.parse(req.body);

      // Log validated data
      console.log("Validated data:", validatedData);

      const newUser = await prisma.user.create({
        data: {
          userId: validatedData.userId,
          instrument: validatedData.instrument,
        },
      });

      console.log("New user created:", newUser);
      return res.status(201).json(newUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log("Validation error:", error.errors);
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error while creating user:", error);
      return res.status(500).json({ error: "Database error" });
    }
  }

  // If the method is not GET or POST
  return res.status(405).json({ error: "Method not allowed" });
}
