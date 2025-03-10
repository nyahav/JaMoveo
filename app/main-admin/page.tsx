"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from '@/app/hooks/useSocket';
import { useUserContext } from "@/app/context/UserContext"; 

export default function MainAdmin() {
  const [searchQuery, setSearchQuery] = useState("");
  const { userRole, isLoaded } = useUserContext();
  const router = useRouter();
  const socket = useSocket();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  console.log('User role:', userRole);
  // Redirect non-admin users 
  useEffect(() => {
    if (userRole !== "admin") {
      router.push("/");
    }
  }, [userRole, router]);

  useEffect(() => {
    if (!socket) return;

    
    console.log('Admin page socket connected:', socket.id);
    
    // Emit admin connection event
    socket.emit('admin-connected');
    
    // Listen for successful admin status broadcast
    socket.on('admin-status', (data) => {
      console.log('Admin received own status:', data);
    });

    return () => {
      socket?.off('admin-status');
    };
  }, [socket]);
  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/result-admin?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Search any song...</h1>

      <input
        type="text"
        placeholder="Type a song name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="px-4 py-2 mb-4 text-black rounded-lg"
      />

      <button
        onClick={handleSearch}
        className="px-4 py-2 bg-blue-600 rounded-lg text-white font-bold"
      >
        Search
      </button>
    </div>
  );
}
