"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";


export default function WaitingRoom() {
  const router = useRouter();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [songSelected, setSongSelected] = useState(false);

  useEffect(() => {
    // Start the Socket.io server (ensures backend runs)
    fetch("/api/socket").catch((err) => console.error("Socket Init Error:", err));

    // Connect the frontend to the WebSocket server
    const newSocket = io({ path: "/api/socket" });
    setSocket(newSocket);

    // Listen for "song-selected" event
    newSocket.on("song-selected", () => {
      setSongSelected(true);
      setTimeout(() => router.push("/live"), 1000);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <h1 className="text-3xl font-bold mb-4">Waiting for the next song</h1>
      <div className="relative flex space-x-4">
       
      </div>
    </div>
  );
}
