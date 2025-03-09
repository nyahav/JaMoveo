"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface UserData {
    name: string;
    instrument: string;
}
interface InstrumentOption {
    name: string;
    image: string;
}
const instrumentOptions: InstrumentOption[] = [
    { name: "Guitar", image: "/images/guitar.jpg" },
    { name: "Bass", image: "/images/bass.jpg" },
    { name: "Vocals", image: "/images/vocals.jpg" },
    { name: "Drums", image: "/images/drums.jpg" },
    { name: "Sax", image: "/images/sax.jpg" },
    { name: "Keyboard", image: "/images/keyboard.jpg" },
];

export default function MainPage() {
    const { user } = useUser();
    const router = useRouter();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
          setLoading(true);
          fetch(`/api/user?userId=${user.id}`)
            .then(async (res) => {
              if (!res.ok) {
                const errorData = await res.text(); // Use .text() to see the raw response
                console.error("Error response:", errorData);
                throw new Error(errorData || 'Failed to fetch');
              }
              return res.json();
            })
            .then((data) => {
              console.log("Received data:", data); // Debug log
              setUserData(data);
            })
            .catch((error) => {
              console.error("Error fetching user data:", error);
            })
            .finally(() => {
              setLoading(false);
            });
        }
      }, [user?.id]);
      
    
      const handleSelectInstrument = (instrument: string) => {
        if (user?.id) {
          fetch(`/api/user`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: user.id,
              instrument: instrument,
            }),
          })
            .then((res) => res.json())
            .then(() => {
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
          {userData.instrument ? (
            <div>
              <h1>Welcome, {userData.name}</h1>
              <p>Your Instrument: {userData.instrument}</p>
            </div>
          ) : (
            <div>
              <h1>Welcome, {userData.name}</h1>
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
        </div>
      );
    }