"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

const PUBLIC_PAGES = ["/login", "/signup", "/"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      const isPublic = PUBLIC_PAGES.includes(pathname || "");
      if (isPublic) {
        setChecking(false);
        return;
      }

      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
      } else {
        setChecking(false);
      }
    };
    check();
  }, [router, pathname]);

  if (checking) {
    return (
      <main className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="bg-blue-900 p-4 rounded-2xl mb-4">
          <span className="text-4xl font-bold text-white">B</span>
        </div>
        <p className="text-gray-500 text-sm">Loading BidWell...</p>
      </main>
    );
  }

  return <>{children}</>;
}
