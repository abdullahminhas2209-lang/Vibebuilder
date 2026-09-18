"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { supabase } from "@/lib/supabase/client";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [statusText, setStatusText] = useState("Authenticating with Google...");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    async function handleAuthRedirect() {
      // Check if URL contains error params from OAuth
      const errorDescription =
        searchParams?.get("error_description") || searchParams?.get("error");
      if (errorDescription) {
        setErrorMsg(errorDescription);
        return;
      }

      try {
        if (supabase) {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) {
            setErrorMsg(error.message);
            return;
          }

          if (session?.user) {
            proceedToDestination();
            return;
          }

          // Listen for onAuthStateChange in case session is being resolved
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, currentSession) => {
              if (currentSession?.user) {
                subscription.unsubscribe();
                proceedToDestination();
              }
            }
          );

          // Fallback timeout to prevent hanging
          timeoutId = setTimeout(() => {
            proceedToDestination();
          }, 2500);
        } else {
          proceedToDestination();
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to finalize authentication";
        setErrorMsg(msg);
      }
    }

    async function proceedToDestination() {
      setStatusText("Finalizing sign in...");

      // Import sanitized return state
      const { getAuthReturnState, sanitizeReturnUrl } = await import("@/lib/auth-return");
      const savedState = getAuthReturnState();
      const redirectParam = searchParams?.get("redirect");

      const destination = sanitizeReturnUrl(redirectParam || savedState?.returnUrl || "/");
      router.push(destination);
    }

    handleAuthRedirect();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [router, searchParams]);

  if (errorMsg) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-ink text-cream">
        <div className="w-full max-w-sm rounded-md border border-slate-line bg-ink-raised p-6 text-center shadow-xl">
          <Logo />
          <h2 className="mt-4 font-serif text-lg text-cream">Authentication Notice</h2>
          <p className="mt-2 text-xs text-rose-300">{errorMsg}</p>
          <button
            type="button"
            onClick={() => router.push("/auth")}
            className="mt-5 inline-flex items-center justify-center rounded-sm bg-amber px-4 py-2 text-xs font-semibold text-[#201404] hover:bg-amber-deep transition-colors cursor-pointer"
          >
            Return to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-ink text-cream">
      <div className="flex flex-col items-center space-y-4">
        <Logo />
        <div className="flex items-center gap-2.5 rounded-sm border border-slate-line bg-ink-raised px-4 py-2.5 shadow-sm">
          <Loader2 className="size-4 animate-spin text-amber" />
          <span className="font-mono text-xs text-fog">{statusText}</span>
        </div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-ink text-cream">
          <Loader2 className="size-6 animate-spin text-amber" />
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
