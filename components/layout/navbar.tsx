//import { ModeToggle } from "@/app/dark-mode";
import { MdElectricBolt } from "react-icons/md";
import { useEffect, useState } from 'react';

// @ts-ignore
import { BoomBox, LayoutDashboard } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { AuthButton } from "@/app/(auth)/authButton";
import { useUserContext } from "@/app/context/UserContext";
import MusicNotesHoverEffect from "@/components/ui/effects/musicNotesHoverEffects";


export default function Navbar() {
  const [isMounted, setIsMounted] = useState(false);
  const { user, isLoaded } = useUser();
  const { userRole } = useUserContext();

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
      <div className="flex gap-6 items-center flex-wrap justify-center md:justify-start my-4">
        <Link
          href="/"
          className="text-gray-800 font-semibold text-xl hover:text-blue-600 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 hover:after:w-full after:transition-all after:duration-300"
        >
          Home
        </Link>
        <Link
          href="/about"
          className="text-gray-800 font-semibold text-xl hover:text-blue-600 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 hover:after:w-full after:transition-all after:duration-300"
        >
          About
        </Link>
        {/* Admin Link - Only shown to admin users */}
        {userRole === 'admin' && (
          <Link
            href="/main-admin"
            className="text-gray-800 font-semibold text-xl hover:text-blue-600 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 hover:after:w-full after:transition-all after:duration-300"
          >
            Create Session
          </Link>
        )}
      </div>
      <div className="flex gap-4 items-center flex-wrap justify-end">
        {/* <ModeToggle /> */}

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
          <div className="w-15 h-15 bg-primary rounded-xl flex items-center justify-center">
            <img src="/favicon.ico" alt="App Icon" className="w-15 h-15" />
          </div>
          <h1 className="text-[20px] flex gap-1 max-md:hidden">
            <Link href="/" className="hover:underline">
              <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
                JaMoveo
              </span>
            </Link>
          </h1>
        </div>
      </div>
    </MusicNotesHoverEffect>
  );
}

