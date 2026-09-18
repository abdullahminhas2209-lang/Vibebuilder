"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function AuthRedirectHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = searchParams?.toString();
    const destination = params ? `/signin?${params}` : "/signin";
    router.replace(destination);
  }, [router, searchParams]);

  return (
    <div className="min-h-dvh w-full bg-[#14161f] flex items-center justify-center text-cream">
      <Loader2 className="size-6 animate-spin text-[#f2a93b]" />
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh w-full bg-[#14161f] flex items-center justify-center text-cream">
          <Loader2 className="size-6 animate-spin text-[#f2a93b]" />
        </div>
      }
    >
      <AuthRedirectHandler />
    </Suspense>
  );
}
