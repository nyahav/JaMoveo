"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSocket } from '@/app/hooks/useSocket';

interface Song {
  name: string;
  artist: string;
  image?: string;
}

export default function ResultAdmin() {
  const socket = useSocket();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [songs, setSongs] = useState<Song[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/songs?search=${encodeURIComponent(searchQuery)}`)
      .then((res) => res.json())
      .then((data) => setSongs(data))
      .catch((err) => console.error("Error loading songs:", err));
  }, [searchQuery]);

  const handleSongSelect = (selectedSong: Song) => {
    if (socket) {
      
      socket.emit('song-selected', selectedSong);
      console.log('Song selection emitted:', selectedSong.name);
      
      // Navigate to live page
      router.push(`/live?song=${encodeURIComponent(selectedSong.name)}`);
    } else {
      console.error('Socket connection not available');
    }
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
