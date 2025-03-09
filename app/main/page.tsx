"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function MainPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4 mt-20 md:mt-36">
        main
    </div>
  );
}