"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    async function checkAuth() {
      if (pathname !== "/auth") {
        const user = await getCurrentUser();
        if (!user) window.location.href = "/auth";
      }
    }
    checkAuth();
  }, [pathname]);

  return <>{children}</>;
} 