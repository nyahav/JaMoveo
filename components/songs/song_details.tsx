// /app/components/SongDetails.tsx
"use client";

import { SongDetails as SongDetailsType } from '../../app/types';

interface SongDetailsProps {
  songDetails: SongDetailsType | null;
}

export default function SongDetails({ songDetails }: SongDetailsProps) {
  if (!songDetails) {
    return null;
  }

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold">{songDetails.title}</h2>
      <p className="text-xl mb-4">By: {songDetails.artist}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Lyrics:</h3>
          <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded">{songDetails.lyrics}</pre>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Chords:</h3>
          <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded">{songDetails.chords}</pre>
        </div>
      </div>
    </div>
  );
}