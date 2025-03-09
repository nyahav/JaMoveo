"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AuthButton } from "../(auth)/authButton";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4 mt-20 md:mt-36">
      <h1
        className="text-4xl md:text-5xl font-bold mb-4"
        style={{
          background:
            "linear-gradient(90deg, hsl(192.3913043478261, 82.88%, 56.47%) 0%, hsl(192.3913043478261, 82.88%, 10%) 100%)",
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
      >
        JaMoveo – Jam at the Speed of Sound!
      </h1>
      <p className="text-lg mb-8 mx-0 md:mx-44">
        Join the ultimate smart rehearsal experience with JaMoveo! <br />
        A web app that lets every musician connect, view chords and lyrics in real-time,<br />
        and take jam sessions to the next level.<br />
        It's time to make music like never before!<br />
      </p>
      <AuthButton 
        className="h-12" 
        loggedOutText="Let's get Jamming"
      />
    </div>
  );
}