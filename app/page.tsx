"use client";

import { ModeToggle } from "./dark-mode";
import { useEffect, useState } from 'react';
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
import { useRouter } from "next/navigation"; // Changed from next/router to next/navigation
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import HomePage from "../app/(pages)/home"; 
import { AuthButton } from "./(auth)/authButton";
import MusicNotesHoverEffect from "@/components/ui/effects/musicNotesHoverEffects";

export default function Home() {
  return (
    <div className="p-3">
      <Navbar />
      <HomePage />
      
    </div>
  );
}

function Navbar() {
  const [isMounted, setIsMounted] = useState(false);
  const { user, isLoaded } = useUser();
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render anything on the server to prevent hydration issues
  if (!isMounted) {
    return null;
  }

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
        
        <AuthButton 
          loggedInText="Let's go"
          loggedOutText="Get Started"
          className="whitespace-nowrap h-11 px-3"
        />
        
        {isLoaded && user && <UserButton />}
      </div>
    </div>
  );
}

function AppLogo() {
  return (
    <MusicNotesHoverEffect>
    <div className="flex items-center justify-between space-x-2 mt-1">
      <div className="flex gap-2 items-center">
        <div className="w-11 h-11 bg-primary rounded-md flex items-center justify-center">
          <BoomBox className="text-primary-foreground" />
        </div>
        <h1 className="text-[20px] flex gap-1 max-md:hidden">
          
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
              JaMoveo
            </span>
          
        </h1>
      </div>
    </div>
    </MusicNotesHoverEffect>
  );
}

