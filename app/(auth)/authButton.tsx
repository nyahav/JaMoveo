"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import { useState, useEffect } from "react";

// Props for our AuthButton component
interface AuthButtonProps {
  loggedInText?: string;         // Text to show when logged in
  loggedOutText?: string;        // Text to show when logged out
  loggedInRoute?: string;        // Route to navigate to when logged in
  className?: string;            // Additional CSS classes
  children?: React.ReactNode;    // Children elements (optional)
}

export function AuthButton({
  loggedInText = "Let's go",
  loggedOutText = "Get Started",
  loggedInRoute = "/main-player",
  className = "",
  children
}: AuthButtonProps) {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { user, isLoaded } = useUser();
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render anything on the server to prevent hydration issues
  if (!isMounted) {
    return null;
  }

  if (!isLoaded) {
    return <span>Loading...</span>;
  }

  // If user is logged in, show button that navigates to the provided route
  if (user) {
    return (
      <Button 
        className={`h-16 px-8 text-2xl bg-black border-4  font-bold transition-all duration-300 hover:brightness-90 ${className}`} 
        onClick={() => router.push(loggedInRoute)}
        style={{
          background:
            "linear-gradient(90deg, hsl(192, 82.88%, 56.47%) 0%, hsl(192, 82.88%, 10%) 100%)",
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
      >
        {children || loggedInText}
      </Button>
    );
  }
  
  // If user is not logged in, show sign-in button with gradient
  return (
    <SignInButton mode="modal">
      <Button 
        className={`h-16 px-8 text-2xl bg-black border-4  font-bold transition-all duration-300 hover:brightness-90 ${className}`}
        style={{
          background:
            "linear-gradient(90deg, hsl(192, 82.88%, 56.47%) 0%, hsl(192, 82.88%, 10%) 100%)",
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
      >
        {children || loggedOutText}
      </Button>
    </SignInButton>
  );
  
  
}