"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { GoogleIcon } from "@/components/auth/GoogleIcon";
import { AuthVisualPanel } from "@/components/auth/AuthVisualPanel";
import { useAuth } from "@/context/AuthContext";
import {
  getAuthReturnState,
  saveAuthReturnState,
  sanitizeReturnUrl,
} from "@/lib/auth-return";

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signUp, signInWithGoogle, loginWithGoogleFallback } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Direct Gmail fallback
  const [showGmailFallback, setShowGmailFallback] = useState(false);
  const [directGmail, setDirectGmail] = useState("");

  // Inspect or initialize return state from URL params
  useEffect(() => {
    const promptFromUrl = searchParams?.get("prompt");
    const returnUrlFromUrl = searchParams?.get("returnUrl") || searchParams?.get("redirect");

    if (promptFromUrl && promptFromUrl.trim()) {
      saveAuthReturnState({
        prompt: promptFromUrl.trim(),
        returnUrl: returnUrlFromUrl || "/",
        action: "build",
      });
    }
  }, [searchParams]);

  function handleSuccessfulAuth(targetUrl?: string) {
    const existingState = getAuthReturnState();
    const destination = sanitizeReturnUrl(targetUrl || existingState?.returnUrl || "/");
    router.push(destination);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmitting || isGoogleSubmitting) return;

    setErrorMessage(null);

    const cleanName = fullName.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!cleanEmail) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setIsSubmitting(true);

    try {
      const nameParts = cleanName.split(" ");
      const firstName = nameParts[0] || "User";
      const lastName = nameParts.slice(1).join(" ") || "";

      const res = await signUp({
        firstName,
        lastName,
        email: cleanEmail,
        password,
      });

      if (res.error) {
        setErrorMessage(res.error);
        setIsSubmitting(false);
        return;
      }

      handleSuccessfulAuth();
    } catch {
      setErrorMessage("Unable to create account. Please try again.");
      setIsSubmitting(false);
    }
  }

  async function handleGoogleSignUp() {
    if (isSubmitting || isGoogleSubmitting) return;

    setErrorMessage(null);
    setIsGoogleSubmitting(true);

    try {
      const res = await signInWithGoogle("/auth/callback?redirect=/");
      if (res.error) {
        setShowGmailFallback(true);
        setErrorMessage("Google OAuth provider is not yet enabled in your Supabase dashboard. You can continue instantly with your Google email below.");
        setIsGoogleSubmitting(false);
      } else if (res.url) {
        // Redirecting to provider
      } else {
        handleSuccessfulAuth();
      }
    } catch {
      setShowGmailFallback(true);
      setErrorMessage("Failed to connect to Google. You can sign up using your email below.");
      setIsGoogleSubmitting(false);
    }
  }

  async function handleDirectGmailFallback(e: React.FormEvent) {
    e.preventDefault();
    const cleanEmail = directGmail.trim();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMessage("Please enter a valid Google email address.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await loginWithGoogleFallback(cleanEmail, fullName.trim() || undefined);
      handleSuccessfulAuth();
    } catch {
      setErrorMessage("Failed to authenticate. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-dvh w-full bg-ink flex items-center justify-center p-4 sm:p-6 lg:p-10 font-montserrat antialiased">
      {/* Centered Registration Card Container */}
      <div className="w-full max-w-[1060px] bg-ink-raised rounded-2xl sm:rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border border-slate-line overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left Column: Form */}
        <div className="p-7 sm:p-10 lg:p-12 flex flex-col justify-between">
          <div>
            <div className="mb-6">
              <Logo className="text-cream hover:opacity-90 transition-opacity" />
            </div>

            <h1 className="font-playfair text-3xl sm:text-4xl font-semibold text-cream tracking-tight">
              Create Your Account
            </h1>
            <p className="mt-2 text-sm text-fog font-normal leading-relaxed">
              Start building modern websites and applications with Klyro
            </p>

            {errorMessage && (
              <div
                role="alert"
                className="mt-4 rounded-md border border-rose-900/60 bg-rose-950/60 p-3 text-xs text-rose-300 font-medium leading-normal"
              >
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="signup-name"
                  className="block text-xs font-semibold uppercase tracking-wider text-fog mb-1.5"
                >
                  Full Name
                </label>
                <input
                  id="signup-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full h-11 px-3.5 rounded-md bg-ink border border-slate-line text-cream text-sm placeholder:text-fog-dim transition-colors duration-150 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber/30"
                />
              </div>

              <div>
                <label
                  htmlFor="signup-email"
                  className="block text-xs font-semibold uppercase tracking-wider text-fog mb-1.5"
                >
                  Email
                </label>
                <input
                  id="signup-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full h-11 px-3.5 rounded-md bg-ink border border-slate-line text-cream text-sm placeholder:text-fog-dim transition-colors duration-150 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber/30"
                />
              </div>

              <div>
                <label
                  htmlFor="signup-password"
                  className="block text-xs font-semibold uppercase tracking-wider text-fog mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password (min. 6 chars)"
                    className="w-full h-11 pl-3.5 pr-11 rounded-md bg-ink border border-slate-line text-cream text-sm placeholder:text-fog-dim transition-colors duration-150 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-fog hover:text-cream transition-colors p-1 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isGoogleSubmitting}
                className="w-full h-11 mt-2 rounded-md bg-amber hover:bg-amber-deep text-[#201404] text-sm font-semibold tracking-wide transition-colors duration-150 flex items-center justify-center gap-2 shadow-xs disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin text-[#201404]" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <span>Create Account</span>
                )}
              </button>
            </form>

            <div className="relative my-5 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-line" />
              </div>
              <span className="relative bg-ink-raised px-3 text-xs text-fog-dim uppercase tracking-wider font-medium">
                or
              </span>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={isSubmitting || isGoogleSubmitting}
              className="w-full h-11 rounded-md bg-ink border border-slate-line hover:border-fog-dim text-cream text-sm font-medium transition-colors duration-150 flex items-center justify-center gap-2.5 shadow-xs disabled:opacity-60 cursor-pointer"
            >
              {isGoogleSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin text-amber" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <GoogleIcon className="size-4 shrink-0" />
                  <span>Sign up with Google</span>
                </>
              )}
            </button>

            {showGmailFallback && (
              <form
                onSubmit={handleDirectGmailFallback}
                className="mt-3 p-3 bg-ink rounded-md border border-slate-line space-y-2"
              >
                <span className="block text-xs font-semibold text-amber">
                  Instant Google Email Registration
                </span>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={directGmail}
                    onChange={(e) => setDirectGmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="flex-1 h-9 px-3 rounded bg-ink-raised border border-slate-line text-xs text-cream focus:outline-none focus:border-amber"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-9 px-4 rounded bg-amber text-[#201404] text-xs font-semibold hover:bg-amber-deep transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-line/60 text-center">
            <p className="text-xs text-fog">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-semibold text-amber hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Right Column: Klyro Video Panel */}
        <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center bg-ink/40 border-t lg:border-t-0 lg:border-l border-slate-line">
          <AuthVisualPanel className="h-[280px] sm:h-[360px] lg:h-full min-h-[280px] lg:min-h-[500px]" />
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh w-full bg-ink flex items-center justify-center">
          <Loader2 className="size-6 animate-spin text-amber" />
        </div>
      }
    >
      <SignUpContent />
    </Suspense>
  );
}
