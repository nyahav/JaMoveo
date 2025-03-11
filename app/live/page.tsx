"use client";

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import { useSocket } from "@/app/hooks/useSocket";
import { useUserContext } from "@/app/context/UserContext";
import { toast } from "react-hot-toast";

interface SongLine {
  lyrics: string;
  chords?: string;
}

interface SongData {
  name: string;
  artist: string;
  content: SongLine[][];
}

// Create a separate component that uses useSearchParams
function LivePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const songName = searchParams.get('song');

  const socket = useSocket();
  const { userRole } = useUserContext();
  const [songData, setSongData] = useState<SongData | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [autoScroll, setAutoScroll] = useState(false);
  const [isVocalist, setIsVocalist] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [errorMessage, setErrorMessage] = useState<string>("");
  /* eslint-enable @typescript-eslint/no-unused-vars */

  // Player data functionality
  useEffect(() => {
    if (!socket || userRole === 'admin') return;

    const handleSongData = (data: SongData) => {
      console.log('Player received song data:', data);
      if (data?.name && data?.artist && Array.isArray(data?.content)) {
        setSongData({
          name: data.name,
          artist: data.artist,
          content: data.content
        });
        setIsLoading(false);
      }
    };

    // Initial request for song data
    console.log('Player requesting current song data');
    socket.emit('request-song-data');

    // Listen for song updates
    socket.on('song-selected', handleSongData);
    console.log('Player listening for song updates...');

    return () => {
      socket.off('song-selected', handleSongData);
    };
  }, [socket, userRole]);

  // Parse song data for admin
  useEffect(() => {
    if (!songName || userRole !== 'admin') return;
    if (!socket) {
      console.warn("Socket not available yet, waiting...");
      return;
    }
  
    try {
      if (songName.includes('{')) {
        
        const parsedSongDetails = JSON.parse(decodeURIComponent(songName));
  
        const artist = parsedSongDetails.artist;
        const title = parsedSongDetails.name || parsedSongDetails.title;
        const lyricsAndChords = parsedSongDetails.lyricsAndChords;
  
        const cleanArtist = artist?.split('-')[0].trim() || 'Unknown Artist';
        const cleanTitle = title?.split('אקורדים לשיר')[1]?.split('של')[0].trim() || title || 'Untitled';
  
        const formattedContent = Array.isArray(lyricsAndChords)
          ? lyricsAndChords.map(item => [{ lyrics: item.lyrics || '', chords: item.chords || '' }])
          : [];
  
        const formattedSongData = {
          name: cleanTitle,
          artist: cleanArtist,
          content: formattedContent
        };
  
        console.log('Formatted song data to be emitted:', formattedSongData);
  
        setSongData(formattedSongData);
     
        setIsLoading(false);

        const handleSongDataRequest = () => {
          console.log('Admin received song data request');
          socket.emit('song-selected', formattedSongData);
        };
      
        socket.on('request-song-data', handleSongDataRequest);

        if (socket) {
          console.log('Live Admin emitting selected song:', formattedSongData);
          socket.emit('song-selected', formattedSongData);
        }
      } 
    } catch (error) {
      console.error('Error parsing song details:', error);
      setErrorMessage(`Error parsing song data: ${(error as Error).message}`);
    }
  }, [songName, userRole, socket]);

  // Auto scroll functionality
  useEffect(() => {
    let scrollInterval: NodeJS.Timeout;

    if (autoScroll && containerRef.current) {
      scrollInterval = setInterval(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop += 1;
        }
      }, 100);
    }

    return () => clearInterval(scrollInterval);
  }, [autoScroll]);

  // Handle quit session
  const handleQuit = () => {
    if (socket) {
      socket.emit('quit-session');
      router.push('/main-admin');
    }
  };

  // Listen for quit event
  useEffect(() => {
    if (!socket) return;

    socket.on('session-ended', () => {
      toast.success('The session has been ended by the admin');
      setTimeout(() => {
        router.push(userRole === 'admin' ? '/main-admin' : '/main-player');
      }, 2000);
    });

    return () => {
      socket.off('session-ended');
    };
  }, [socket, router, userRole]);

  // Toggle vocalist mode
  const toggleVocalistMode = () => {
    setIsVocalist(!isVocalist);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-6 flex items-center justify-center flex-col">
        <div className="text-2xl mb-4">Waiting for song data...</div>
        <div className="text-gray-400">Please wait while the admin starts the session</div>
      </div>
    );
  }

  // Missing data state
  if (!songData?.content || !Array.isArray(songData.content)) {
    return (
      <div className="min-h-screen bg-black text-white p-6 flex items-center justify-center flex-col">
        <div className="text-2xl mb-4">Error loading song</div>
        <div className="text-red-500">
          Unable to load song data. Please try rejoining the session.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Title and Artist */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-2">{songData.name || 'Loading...'}</h1>
        <h2 className="text-3xl text-gray-400">{songData.artist || ''}</h2>
      </div>

      {/* Lyrics and Chords */}
      <div
        ref={containerRef}
        className="w-full max-w-4xl mx-auto h-[70vh] overflow-y-auto text-2xl leading-relaxed"
      >
        {songData.content.map((line, lineIndex) => (
          <div key={lineIndex} className="mb-8">
            {/* Chords line */}
            {!isVocalist && line[0]?.chords && (
              <div className="h-6 mb-1">
                <span
                  className="inline-block text-orange-500"
                  style={{
                    marginRight: '4px',
                    textAlign: 'left'
                  }}
                >
                  {line[0].chords}
                </span>
              </div>
            )}

            {/* Lyrics line */}
            {line[0]?.lyrics && (
              <div>
                <span
                  className="inline-block text-yellow-300"
                  style={{ marginRight: '4px' }}
                >
                  {line[0].lyrics}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Button Container */}
      <div className="fixed bottom-20 left-8 right-8 flex justify-between px-4 pb-24">
        {/* Auto Scroll Toggle Button */}
        <button
          onClick={() => setAutoScroll((prev) => !prev)}
          className="p-4 bg-blue-600 rounded-full text-white text-xl shadow-lg hover:bg-blue-700 transition"
        >
          {autoScroll ? "Stop Scroll" : "Auto Scroll"}
        </button>

        {/* Vocalist Mode Toggle Button */}
        <button
          onClick={toggleVocalistMode}
          className="p-4 bg-purple-600 rounded-full text-white text-xl shadow-lg hover:bg-purple-700 transition"
        >
          {isVocalist ? "Show Chords" : "Vocalist Mode"}
        </button>

        {/* Admin Quit Button */}
        {userRole === "admin" && (
          <button
            onClick={handleQuit}
            className="p-4 bg-red-600 rounded-full text-white text-xl shadow-lg hover:bg-red-700 transition"
          >
            Quit Session
          </button>
        )}
      </div>
    </div>
  );
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-black text-white p-6 flex items-center justify-center flex-col">
      <div className="text-2xl mb-4">Loading...</div>
    </div>
  );
}

// Main LivePage component that wraps the content in Suspense
export default function LivePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LivePageContent />
    </Suspense>
  );
}