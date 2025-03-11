"use client";

import { SongDetails as SongDetailsType } from '../../app/types';

interface SongDetailsProps {
  songDetails: SongDetailsType | null;
}

export default function SongDetails({ songDetails }: SongDetailsProps) {
  if (!songDetails || !songDetails.content) {
    return null;
  }

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold">{songDetails.name}</h2>
      <p className="text-xl mb-4">By: {songDetails.artist}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Lyrics:</h3>
          {Array.isArray(songDetails.content) && songDetails.content.map((section, index) => (
            <pre key={index} className="whitespace-pre-wrap bg-gray-50 p-4 rounded">
              {Array.isArray(section) && section.map((part, partIndex) => (
                part?.lyrics ? <div key={partIndex}>{part.lyrics}</div> : null
              ))}
            </pre>
          ))}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Chords:</h3>
          {Array.isArray(songDetails.content) && songDetails.content.map((section, index) => (
            <pre key={index} className="whitespace-pre-wrap bg-gray-50 p-4 rounded">
              {Array.isArray(section) && section.map((part, partIndex) => (
                part?.chords ? <div key={partIndex}>{part.chords}</div> : null
              ))}
            </pre>
          ))}
        </div>
      </div>
    </div>
  );
}