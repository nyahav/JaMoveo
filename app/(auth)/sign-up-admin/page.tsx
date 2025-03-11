"use client"

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

const SignUpPage = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  // Handle form submission
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    // Make API call to create the admin user
    const response = await fetch("/api/create-admin", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.success) {
      // Redirect to dashboard or desired page
      console.log("Admin created:", data.user);
      router.push("/");
    } else {
      alert("Error creating admin");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div className="mb-6">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <button
        type="submit"
        className="w-full p-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
      >
        Sign Up
      </button>
    </form>
  );
}

export default SignUpPage;
