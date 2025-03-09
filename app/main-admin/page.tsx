"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MainAdmin() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/result-admin?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Search any song...</h1>

      <input
        type="text"
        placeholder="Type a song name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="px-4 py-2 mb-4 text-black rounded-lg"
      />

      <button
        onClick={handleSearch}
        className="px-4 py-2 bg-blue-600 rounded-lg text-white font-bold"
      >
        Search
      </button>
    </div>
  );
}
