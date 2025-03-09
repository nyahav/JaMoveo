"use client";

import { ModeToggle } from "./dark-mode";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
// @ts-ignore
import { BoomBox, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="p-3">
      <Navbar />
      <HeroSection />
    </div>
  );
}

function Navbar() {
  return (
    <div className="flex m-5 mx-8 items-center justify-between flex-wrap">
      <AppLogo />
      <div className="flex gap-4 items-center flex-wrap justify-center md:justify-start">
      <Link href="/" className="hover:underline">
          Home
        </Link>
        <Link href="/about" className="hover:underline">
          About
        </Link>
      </div>
      <div className="flex gap-4 items-center flex-wrap justify-end">
        <ModeToggle />
        <Button className="whitespace-nowrap h-11 px-3">Get Started</Button>
        <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
      </div>
    </div>
  );
}

function AppLogo() {
  return (
    <div className="flex items-center justify-between space-x-2 mt-1">
      <div className="flex gap-2 items-center">
        <div className="w-11 h-11 bg-primary rounded-md flex items-center justify-center">
          {/* #<LayoutDashboard className="text-primary-foreground" /> */}
          <BoomBox  className="text-primary-foreground"/>
        </div>
        <h1 className={"text-[20px] flex gap-1 max-md:hidden"}>
          <span className="font-bold">JaMoveo</span>
        </h1>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4 mt-20 md:mt-36">
      <h1 className="text-4xl md:text-5xl font-bold mb-4"
      style={{
        background: "linear-gradient(90deg, hsl(192.3913043478261, 82.88%, 56.47%) 0%, hsl(192.3913043478261, 82.88%, 10%) 100%)",
        WebkitBackgroundClip: "text", 
        color: "transparent",
      }}
      >
        JaMoveo – Jam at the Speed of Sound!
      </h1>
      <p className="text-lg  mb-8 mx-0 md:mx-44">
        Join the ultimate smart rehearsal experience with JaMoveo! <br /> 
         A web app that lets every musician connect, view chords and lyrics in real-time,<br /> 
          and take jam sessions to the next level.<br /> 
           It’s time to make music like never before!<br/> 
      </p>
      <Button className="h-12">Let's get Jamming</Button>
    </div>
  );
}
