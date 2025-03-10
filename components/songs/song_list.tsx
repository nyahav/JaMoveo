// /app/components/SongList.tsx
"use client";

import { SongData } from '../../app/types';

interface SongListProps {
  songs: SongData[];
  onSongSelect: (url: string) => void;
  isLoading: boolean;
  searchQuery: string;
}

export default function SongList({ songs, onSongSelect, isLoading, searchQuery }: SongListProps) {
  if (isLoading) {
    return (
      <div className="my-6">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Results for "{searchQuery}"</h1>
      {songs.length > 0 ? (
        <ul className="space-y-4">
          {songs.map((song, index) => (
            <li key={index} className="hover:bg-gray-100 p-2 rounded">
              <button
                onClick={() => onSongSelect(song.url)}
                className="text-blue-600 hover:text-blue-800 text-left w-full"
              >
                {song.title} by {song.artist}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No songs found</p>
      )}
    </div>
  );
}