// app/layout-client.tsx
"use client";

import { ClerkProvider} from '@clerk/nextjs'
//import { ThemeProvider } from "@/components/providers/theme-provider";
import { UserProvider } from "./context/UserContext";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/navbar";


export default function RootLayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <UserProvider>
        <Navbar />
        <Toaster />
           
          {children}
        
      </UserProvider>
    </ClerkProvider>
  );
}