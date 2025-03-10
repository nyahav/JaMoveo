import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

// Create a context with a default value
const UserContext = createContext<any>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoaded } = useUser();
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null); // To hold the role (e.g., admin)

  useEffect(() => {
    if (isLoaded && user) {
      setUserId(user.id);
      // Assuming 'role' is stored in publicMetadata
      setUserRole(typeof user.publicMetadata?.role === 'string' ? user.publicMetadata.role : null); 
      console.log('User ID:', user.id);
      console.log('User role:', userRole);
    }
  }, [isLoaded, user]);

  return (
    <UserContext.Provider value={{ userId, user, isLoaded, userRole }}>
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
