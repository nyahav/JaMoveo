import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

// Create a context with a default value
const UserContext = createContext<any>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoaded } = useUser();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      setUserId(user.id); 
    }
  }, [isLoaded, user]);

  return (
    <UserContext.Provider value={{ userId, user, isLoaded }}>
      {children}
    </UserContext.Provider>
  );
};

// Create a custom hook to use the UserContext
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
