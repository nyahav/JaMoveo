"use client";

import type { Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import {
  Lato,
  Montserrat,
  Open_Sans,
  Playfair,
  Poppins,
  Raleway,
  Roboto,
} from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/navbar";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-poppins",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const lato = Lato({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-lato",
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
});

const playfairDisplay = Playfair({
  subsets: ["latin"],
  variable: "--font-playfair",
});

// export const metadata: Metadata = {
//   title: "JaMoveo App", 
//   description: "gather in a rehearsal rooms from time to time and play songs together", 
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
 
  return (
    <html lang="en" suppressHydrationWarning>
      <ClerkProvider >
      <body
        className={`${poppins.variable}
         ${roboto.variable} ${openSans.variable} 
         ${montserrat.variable} ${raleway.variable} 
         ${lato.variable} ${playfairDisplay.variable} 
          antialiased relative`}
      >
       <Navbar />
        <Toaster />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
         
          {children}
          
        </ThemeProvider>
      </body>
      </ClerkProvider>
    </html>
  );
}
