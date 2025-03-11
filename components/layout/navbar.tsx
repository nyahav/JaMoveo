


//"@ts-expect-error"
import { useEffect, useState } from 'react';
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { AuthButton } from "@/app/(auth)/authButton";
import { useUserContext } from "@/app/context/UserContext";
import MusicNotesHoverEffect from "@/components/ui/effects/musicNotesHoverEffects";
import Image from "next/image";

export default function Navbar() {
  const [isMounted, setIsMounted] = useState(false);
  const { user, isLoaded } = useUser();
  const { userRole } = useUserContext();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    show?: boolean;  // Optional prop, defaults to true
  }
  
  const NavLink = ({ href, children, show = true }: NavLinkProps) => {
    const linkClasses =
      "text-gray-800 font-semibold hover:text-blue-600 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 hover:after:w-full after:transition-all after:duration-300 text-sm md:text-xl";
  
    // If show is false, return null and hide the link
    if (!show) return null;
  
    return (
      <Link href={href} className={linkClasses}>
        {children}
      </Link>
    );
  };
  

  
  return (
    <div className="flex m-5 mx-8 items-center justify-between flex-wrap">
      <AppLogo />
      <div className="flex gap-6 items-center flex-wrap justify-center md:justify-start my-4">
      <NavLink href="/">Home</NavLink>
      <NavLink href="/about">About</NavLink>
      {/* Admin Link - Only shown to admin users */}
      <NavLink href="/main-admin" show={userRole === 'admin'}>
        Create Session
      </NavLink>
      </div>
      <div className="flex gap-4 items-center flex-wrap justify-end">
        {/* <ModeToggle /> */}

        <AuthButton 
          loggedInText="Let's go"
          loggedOutText="Get Started"
          className="whitespace-nowrap h-11 px-3 text-sm md:text-base"
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
          <div className="w-12 h-12 md:w-15 md:h-15 bg-primary rounded-xl flex items-center justify-center">
            <Image src="/favicon.ico" alt="App Icon" className="w-12 h-12 md:w-15 md:h-15" />
          </div>
          <h1 className="text-[16px] flex gap-1 max-md:hidden md:text-[20px]">
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
