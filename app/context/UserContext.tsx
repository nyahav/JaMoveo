"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

interface UserContextType {
  userRole: "admin" | "user";
  isLoaded: boolean;
}

const UserContext = createContext<UserContextType>({
  userRole: "user",
  isLoaded: false,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded: clerkLoaded } = useUser();
  const [userRole, setUserRole] = useState<"admin" | "user">("user");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function checkAndSetUserRole() {
      if (user?.id) {
        // Check if user exists in database
        const res = await fetch(`/api/user?userId=${user.id}`);
        
        if (res.status === 404) {
          // Create new user if not found
          const isAdmin = user.id.toLowerCase().includes('admin');
          const createRes = await fetch('/api/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.id,
              role: isAdmin ? 'admin' : 'user'
            })
          });
          const newUser = await createRes.json();
          setUserRole(newUser.role as "admin" | "user");
        } else {
          const userData = await res.json();
          setUserRole(userData.role as "admin" | "user");
        }
      }
      setIsLoaded(true);
    }

    if (clerkLoaded) {
      checkAndSetUserRole();
    }
  }, [user?.id, clerkLoaded]);

  return (
    <UserContext.Provider value={{ userRole, isLoaded }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);