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

    // Authorization effect
    useEffect(() => {
        if (isLoaded && userRole !== "admin") {
            router.push("/unauthrized");
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

    const handleSearch = () => {
        if (searchQuery.trim()) {
            router.push(`/result-admin?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    // Loading state
    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    // Authorization check
    if (userRole !== "admin") {
        return null;
    }

    // Main admin UI
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
            <h1 className="text-3xl font-bold mb-4">Search any song...</h1>

            <input
                type="text"
                placeholder="Type a song name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 mb-4 text-black rounded-lg w-64"
            />

            <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 rounded-lg text-white font-bold hover:bg-blue-700 transition"
            >
                Search
            </button>
        </div>
    );
}