import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const songsDir = path.join(process.cwd(), "public", "songs");
    const files = fs.readdirSync(songsDir);

    const searchQuery = req.query.search ? String(req.query.search).toLowerCase() : "";

    const songData = files
      .filter((file) => file.endsWith(".json"))
      .map((file) => {
        const filePath = path.join(songsDir, file);
        const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        return {
          name: content.name || file.replace(".json", "").replace(/_/g, " "),
          artist: content.artist || "Unknown Artist",
          image: content.image || null,
        };
      })
      .filter((song) => song.name.toLowerCase().includes(searchQuery));

    res.status(200).json(songData);
  } catch (error) {
    console.error("Error reading songs:", error);
    res.status(500).json({ error: "Failed to load songs" });
  }
}
