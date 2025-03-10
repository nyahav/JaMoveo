// Live Page:
// ● Show title with the song name and the author.
// ● Singers should see only the lyrics for the song.
// ● Other players should see both lyrics and chords for the song.
// ● Add a floating toggle button on the bottom to start/stop automatic
// slow scrolling down.
// ● Ensure a large font size and high contrast between background and
// text color, as there is a lot of smoke in the room.
// ● Only the admin can see the "Quit" button. Once clicked, all players,
// including the admin, move back to the main page.

"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useSocket } from "@/app/hooks/useSocket";
import { useUserContext } from "@/app/context/UserContext";
import { toast } from "react-hot-toast";

interface SongLine {
  lyrics: string;
  chords?: string;
}

interface SongData {
  name: string;
  content: SongLine[][];
}

export default function LivePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const songName = searchParams.get('song');
  const { user } = useUser();
  const socket = useSocket();
  const { userRole } = useUserContext();
  const [songData, setSongData] = useState<SongData | null>(null);
  const [autoScroll, setAutoScroll] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVocalist, setIsVocalist] = useState(false);


  useEffect(() => {
    // Get user instrument from API
    fetch(`/api/user?userId=${user?.id}`)
      .then(res => res.json())
      .then(data => {
        setIsVocalist(data.instrument === 'Vocals');
      });

    // Fetch song data
    if (songName) {
      fetch(`/api/songs?search=${encodeURIComponent(songName)}`)
        .then(res => res.json())
        .then(data => {
          if (data[0]) {
            setSongData(data[0]);
          }
        });
    }
  }, [songName, user?.id]);

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

  if (!songData) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Song Title */}
      <h1 className="text-5xl font-bold mb-8 text-center">
        {songData.name}
      </h1>

      {/* Lyrics and Chords */}
      <div
        ref={containerRef}
        className="w-full max-w-4xl mx-auto h-[70vh] overflow-y-auto text-2xl leading-relaxed"
      >
        {songData?.content.map((line, lineIndex) => (
          <div key={lineIndex} className="mb-8">
            {/* Chords line */}
            {!isVocalist && (
              <div className="h-6 mb-1">
                {line.map((part, partIndex) => (
                  <span
                    key={`chord-${partIndex}`}
                    className="inline-block text-orange-500"
                    style={{
                      width: part.lyrics.length * 16, // Approximate width based on lyrics
                      marginRight: '4px',
                      textAlign: part.chords ? 'center' : 'left'
                    }}
                  >
                    {part.chords || ''}
                  </span>
                ))}
              </div>
            )}

            {/* Lyrics line */}
            <div>
              {line.map((part, partIndex) => (
                <span
                  key={`lyric-${partIndex}`}
                  className="inline-block text-yellow-300"
                  style={{ marginRight: '4px' }}
                >
                  {part.lyrics}
                </span>
              ))}
            </div>
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