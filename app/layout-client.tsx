"use client";
import Image from "next/image";
import { ClerkProvider } from "@clerk/nextjs";
// import { ThemeProvider } from "@/components/providers/theme-provider";
import { UserProvider } from "./context/UserContext";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function RootLayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <UserProvider>
        <div style={styles.layout}>
          
          <Navbar />

          <div style={styles.topWave}>
            <Image
              src="/layered-waves-top.svg"
              alt="Top wave"
              fill
              style={{
                objectFit: "cover",
                opacity: "0.5",
                WebkitMaskImage: "linear-gradient(to bottom, rgba(0, 0, 0, 1) 80%, rgba(0, 0, 0, 0) 100%)",
                maskImage:"linear-gradient(to bottom, rgba(0, 0, 0, 1) 80%, rgba(0, 0, 0, 0) 100%)",
                objectPosition: "top",
              }}
              priority={false}
            />
          </div>

          <main style={styles.mainContent}>
            <Toaster />
            {children}
          </main>

          <Footer />
        </div>
      </UserProvider>
    </ClerkProvider>
  );
}

// Inline styles
const styles = {
  layout: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh", 
  } as React.CSSProperties,

  mainContent: {
    flexGrow: 1, 
  } as React.CSSProperties,

  topWave: {
    position: "absolute",
    top: "0px",
    left: "0px",
    width: "100%",
    height: "20vh", 
    overflow: "hidden",
    zIndex: -1,
  } as React.CSSProperties,
};

