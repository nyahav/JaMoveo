"use client";

import { useState, useEffect } from 'react';
import { SongData, SongDetails } from '../types';
import SongList from '@/components/songs/song_list';
import SongDetailsComponent from '@/components/songs/song_details';
import { useRouter } from "next/navigation";
import { useSocket } from '@/app/hooks/useSocket';
import { useUserContext } from "@/app/context/UserContext";


export default function SongPage() {
  const [songs, setSongs] = useState<SongData[]>([]);
  const [chosenSong, setChosenSong] = useState<SongDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [inputValue, setInputValue] = useState("sweet child o mine");
  const [searchQuery, setSearchQuery] = useState("sweet child o mine");

  const { userRole, isLoaded } = useUserContext();
  const router = useRouter();
  const socket = useSocket();

  useEffect(() => {
    if (isLoaded && userRole !== "admin") {
      router.push("/unauthorized");
    }
  }, [isLoaded, userRole, router]);

  // Socket connection effect
useEffect(() => {
  if (!socket || userRole !== "admin") return;

  console.log('Admin page socket connected:', socket.id);
  socket.emit('admin-connected');

  socket.on('admin-status', (data) => {
      console.log('Admin received own status:', data);
  });

  return () => {
      socket?.off('admin-status');
  };
}, [socket, userRole]);

  // Fetch songs only when searchQuery changes (on form submit)
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
      console.log('Fetching song details for:', encodedUrl);
      
      const response = await fetch(`/api/song-details?url=${encodedUrl}`);
  
      console.log('Response:', response);
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
    setSearchQuery(inputValue); // Only update searchQuery on submit
  };

//  Conditional rendering
if (!isLoaded) {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-xl">Loading...</div>
    </div>
  );
}


  return (
    <div className="min-h-screen p-8">
      <h1 className="text-5xl font-bold mb-8">Hey band leader, ready to rock on?</h1>
      <h1 className="text-3xl font-bold mb-4">Search any song or artist...</h1>
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            name="query"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)} // Update input value only
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