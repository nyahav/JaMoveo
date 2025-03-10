"use client";

import { useState, useEffect } from 'react';
import { SongData, SongDetails } from '../types';
import SongList from '@/components/songs/song_list';
import SongDetailsComponent from '@/components/songs/song_details';


export default function SongPage() {
  const [songs, setSongs] = useState<SongData[]>([]);
  const [chosenSong, setChosenSong] = useState<SongDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("sweet child o mine");

  // Fetch songs when search query changes
  useEffect(() => {
    async function fetchSongs() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/songs-search?q=${encodeURIComponent(searchQuery)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch songs');
        }
        const data = await response.json();
        setSongs(data);
      } catch (error) {
        console.error('Error fetching songs:', error);
        setSongs([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSongs();
  }, [searchQuery]);

  // Handle song click to fetch details
  const handleSongClick = async (songUrl: string) => {
    try {
      const encodedUrl = encodeURIComponent(songUrl);
      const response = await fetch(`/api/songs-details/${encodedUrl}`);
      if (!response.ok) {
        throw new Error('Failed to fetch song details');
      }
      const songDetails = await response.json();
      setChosenSong(songDetails);
    } catch (error) {
      console.error('Error fetching song details:', error);
      setChosenSong(null);
    }
  };

  // Handle search input
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('query') as string;
    if (query) {
      setSearchQuery(query);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input 
            type="text" 
            name="query"
            defaultValue={searchQuery}
            placeholder="Search for songs..." 
            className="flex-1 p-2 border rounded" 
          />
          <button 
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Search
          </button>
        </div>
      </form>
      
      <SongList 
        songs={songs} 
        onSongSelect={handleSongClick} 
        isLoading={isLoading}
        searchQuery={searchQuery}
      />
      
      <SongDetailsComponent songDetails={chosenSong} />
    </div>
  );
}