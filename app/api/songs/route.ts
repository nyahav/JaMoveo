import { NextResponse } from 'next/server';
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  try {
    // Get search query from URL
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('search')?.toLowerCase() || '';

    // Read songs directory
    const songsDir = path.join(process.cwd(), "public", "songs");
    const files = fs.readdirSync(songsDir);

    // Process song files
    const songData = files
      .filter((file) => file.endsWith(".json"))
      .map((file) => {
        const filePath = path.join(songsDir, file);
        const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        return {
          name: file.replace(".json", "").replace(/_/g, " "),
          content: content
        };
      })
      .filter((song) => song.name.toLowerCase().includes(searchQuery));

    return NextResponse.json(songData);
  } catch (error) {
    console.error("Error reading songs:", error);
    return NextResponse.json(
      { error: "Failed to load songs" },
      { status: 500 }
    );
  }
}