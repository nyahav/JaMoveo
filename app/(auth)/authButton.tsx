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
        className={className}
        onClick={() => router.push(loggedInRoute)}
      >
        {children || loggedInText}
      </Button>
    );
  }
  
  // If user is not logged in, show button that opens sign-in modal
  return (
    <SignInButton mode="modal">
      <Button className={className}>
        {children || loggedOutText}
      </Button>
    </SignInButton>
  );
}