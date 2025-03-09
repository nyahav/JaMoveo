"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { useSocket } from '@/app/hooks/useSocket';

interface UserData {
  name: string;
  instrument: string;
}

interface InstrumentOption {
  name: string;
  image?: string;
}

const instrumentOptions: InstrumentOption[] = [
  { name: "Guitar" },
  { name: "Bass" },
  { name: "Vocals" },
  { name: "Drums" },
  { name: "Sax" },
  { name: "Keyboard" },
];

export default function MainPage() {
  const { user } = useUser();
  const router = useRouter();
  const socket = useSocket();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  //const [socket, setSocket] = useState<Socket | null>(null);
  const [adminConnected, setAdminConnected] = useState(false);
  const [songSelected, setSongSelected] = useState(false);

  useEffect(() => {
    if (!socket) return;
    socket.on("admin-connected", () => {
        setAdminConnected(true);
      });

    socket.on('song-selected', () => {
      console.log('Song was selected!');
    });

    return () => {
      socket.off('song-selected');
    };
  }, [socket]);

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      console.log("Checking user:", user.id);

      fetch(`/api/user?userId=${user.id}`)
        .then(async (res) => {
          if (!res.ok) {
            const errorData = await res.text();
            console.error("Error response:", errorData);

            if (res.status === 404) {
              console.log("User not found, creating user...");
              return fetch("/api/user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id }),
              }).then((postRes) => postRes.json());
            }

            throw new Error(errorData || "Failed to fetch");
          }

          return res.json();
        })
        .then((data) => {
          console.log("Received user data:", data);
          setUserData(data);
        })
        .catch((error) => {
          console.error("Error fetching or creating user:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user?.id, router]);

  const handleSelectInstrument = (instrument: string) => {
    if (user?.id) {
      // First check if user exists
      fetch(`/api/user?userId=${user.id}`)
        .then(async (res) => {
          if (res.status === 404) {
            // User doesn't exist, create new user with instrument
            return fetch("/api/user", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId: user.id,
                name: user.firstName || "User",
                instrument: instrument,
              }),
            });
          } else {
            // User exists, update instrument
            return fetch("/api/user", {
              method: "PUT", // Use PUT for updates
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId: user.id,
                instrument: instrument,
              }),
            });
          }
        })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to update instrument');
          }
          return res.json();
        })
        .then((data) => {
          console.log("Updated user data:", data);
          setUserData((prevData) => ({
            ...prevData!,
            instrument: instrument,
          }));
        })
        .catch((error) => {
          console.error("Error updating instrument:", error);
        });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>No user data found</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4 mt-20 md:mt-36">
      {/* Check if the user has selected an instrument */}
      {userData.instrument ? (
        <div>
          <h1>Welcome!</h1>
          <p>Your Instrument: {userData.instrument}</p>
        </div>
      ) : (
        <div>
          <h1>Welcome!</h1>
          <p>Please select your instrument:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {instrumentOptions.map((instrument) => (
              <div
                key={instrument.name}
                className="card p-4 border rounded-lg shadow-md hover:scale-105 transform transition duration-200"
                onClick={() => handleSelectInstrument(instrument.name)}
              >
                <img
                  src={instrument.image}
                  alt={instrument.name}
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
                <h3 className="text-lg font-semibold">{instrument.name}</h3>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Waiting Room with Admin connection and Song Selection */}
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
        <h1 className="text-3xl font-bold mb-4">
          {adminConnected
            ? "Waiting for the next song..."
            : "Waiting for admin to connect..."}
        </h1>

        {/* Admin Connection Indicator */}
        <div className="flex items-center space-x-2">
          <span
            className={`px-4 py-2 rounded-lg font-bold ${
              adminConnected ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {adminConnected ? "Admin Connected ✅" : "Waiting for Admin ❌"}
          </span>
        </div>

        {/* If song selected */}
        {songSelected && (
          <div className="mt-4 text-xl font-semibold">
            Song Selected! Redirecting to Live...
          </div>
        )}
      </div>
    </div>
  );
}
