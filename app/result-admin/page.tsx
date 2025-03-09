// Results Page - Admin:
// ● The page should contain a list of search results with relevant data
// (song name, artist, and image if available). Once a song is selected, the
// screen should move to the Live page for the admin as well.
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";

interface Song {
  name: string;
  artist: string;
  image?: string;
}

export default function ResultAdmin() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [songs, setSongs] = useState<Song[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch song data from API
    fetch(`/api/songs?search=${encodeURIComponent(searchQuery)}`)
      .then((res) => res.json())
      .then((data) => setSongs(data))
      .catch((err) => console.error("Error loading songs:", err));

    // Initialize Socket.io
    fetch("/api/socket").catch((err) => console.error("Socket Init Error:", err));
    const newSocket = io({ path: "/api/socket" });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [searchQuery]);

  // Handle song selection
  const handleSongSelect = (selectedSong: Song) => {
    if (socket) {
      socket.emit("song-selected", selectedSong);
      console.log("Song selected:", selectedSong);
    }
    router.push(`/live-admin?song=${encodeURIComponent(selectedSong.name)}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Search Results</h1>

      <ul className="w-full max-w-md bg-gray-800 rounded-lg p-4">
        {songs.length > 0 ? (
          songs.map((song, index) => (
            <li
              key={index}
              className="flex items-center p-2 border-b border-gray-700 cursor-pointer hover:bg-gray-700"
              onClick={() => handleSongSelect(song)}
            >
              {song.image && (
                <img src={song.image} alt={song.name} className="w-12 h-12 mr-4 rounded-lg" />
              )}
              <div>
                <p className="text-lg font-bold">{song.name}</p>
                <p className="text-sm text-gray-400">{song.artist}</p>
              </div>
            </li>
          ))
        ) : (
          <p>No results found.</p>
        )}
      </ul>
    </div>
  );
}
