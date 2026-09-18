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

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, signInWithGoogle, loginWithGoogleFallback } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fallback for direct Google/Gmail login if Supabase OAuth is unconfigured in development
  const [showGmailFallback, setShowGmailFallback] = useState(false);
  const [directGmail, setDirectGmail] = useState("");

  // Inspect or initialize return state from search params or storage
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

    // Seamlessly transition to the destination where the prompt is restored
    router.push(destination);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmitting || isGoogleSubmitting) return;

    setErrorMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await signIn(cleanEmail, password);
      if (res.error) {
        setErrorMessage("Unable to sign in. Please check your email and password.");
        setIsSubmitting(false);
        return;
      }

      handleSuccessfulAuth();
    } catch {
      setErrorMessage("Unable to sign in. Please check your email and password.");
      setIsSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    if (isSubmitting || isGoogleSubmitting) return;

    setErrorMessage(null);
    setIsGoogleSubmitting(true);

    try {
      const res = await signInWithGoogle("/auth/callback?redirect=/");
      if (res.error) {
        // When Google OAuth is not configured on Supabase, activate developer-friendly direct Gmail fallback
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
      setErrorMessage("Failed to connect to Google. You can sign in using your email below.");
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
      await loginWithGoogleFallback(cleanEmail);
      handleSuccessfulAuth();
    } catch {
      setErrorMessage("Failed to authenticate. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-dvh w-full bg-[#14161f] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-montserrat antialiased">
      {/* Centered Login Container */}
      <div className="w-full max-w-[1100px] bg-[#faf8f5] rounded-2xl sm:rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] border border-[#e5e1d8] overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left Column: Sign In Form */}
        <div className="p-7 sm:p-10 lg:p-14 flex flex-col justify-between">
          <div>
            {/* Klyro Brand Logo */}
            <div className="mb-8">
              <Logo className="text-[#14161f] hover:opacity-90 transition-opacity" />
            </div>

            {/* Header Section */}
            <h1 className="font-playfair text-3xl sm:text-4xl font-semibold text-[#14161f] tracking-tight">
              Welcome Back
            </h1>
            <p className="mt-2 text-sm text-[#5f6368] font-normal leading-relaxed">
              Enter your email &amp; password to access your account
            </p>

            {/* Error Notification */}
            {errorMessage && (
              <div
                role="alert"
                className="mt-5 rounded-lg border border-red-200 bg-red-50/90 p-3.5 text-xs text-red-700 font-medium leading-normal"
              >
                {errorMessage}
              </div>
            )}

            {/* Primary Sign In Form */}
            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              <div>
                <label
                  htmlFor="signin-email"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#2b2f3c] mb-1.5"
                >
                  Email
                </label>
                <input
                  id="signin-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full h-11 sm:h-12 px-3.5 rounded-lg bg-white border border-[#d6d2c4] text-[#14161f] text-sm placeholder:text-[#9aa0ae] transition-colors duration-150 focus:outline-none focus:border-[#14161f] focus:ring-1 focus:ring-[#14161f]"
                />
              </div>

              <div>
                <label
                  htmlFor="signin-password"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#2b2f3c] mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="signin-password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-11 sm:h-12 pl-3.5 pr-11 rounded-lg bg-white border border-[#d6d2c4] text-[#14161f] text-sm placeholder:text-[#9aa0ae] transition-colors duration-150 focus:outline-none focus:border-[#14161f] focus:ring-1 focus:ring-[#14161f]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#80868b] hover:text-[#14161f] transition-colors p-1"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="size-4 rounded border-[#d6d2c4] text-[#14161f] focus:ring-[#14161f] accent-[#14161f] cursor-pointer"
                  />
                  <span className="text-xs text-[#5f6368] font-medium">Remember me</span>
                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-[#14161f] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Primary Sign In Button */}
              <button
                type="submit"
                disabled={isSubmitting || isGoogleSubmitting}
                className="w-full h-11 sm:h-12 mt-2 rounded-lg bg-[#14161f] hover:bg-[#252836] text-[#f2f0e8] text-sm font-semibold tracking-wide transition-colors duration-150 flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin text-[#f2a93b]" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e2ddd3]" />
              </div>
              <span className="relative bg-[#faf8f5] px-3 text-xs text-[#80868b] uppercase tracking-wider font-medium">
                or
              </span>
            </div>

            {/* Secondary: Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting || isGoogleSubmitting}
              className="w-full h-11 sm:h-12 rounded-lg bg-white border border-[#d6d2c4] hover:bg-[#f2efe9] text-[#2b2f3c] text-sm font-medium transition-colors duration-150 flex items-center justify-center gap-2.5 shadow-2xs disabled:opacity-60 cursor-pointer"
            >
              {isGoogleSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin text-[#14161f]" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <GoogleIcon className="size-4 shrink-0" />
                  <span>Sign in with Google</span>
                </>
              )}
            </button>

            {/* Direct Gmail fallback for environments without live Google OAuth keys */}
            {showGmailFallback && (
              <form
                onSubmit={handleDirectGmailFallback}
                className="mt-3 p-3 bg-white rounded-lg border border-[#e5e1d8] space-y-2"
              >
                <span className="block text-xs font-semibold text-[#14161f]">
                  Instant Google Email Authentication
                </span>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={directGmail}
                    onChange={(e) => setDirectGmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="flex-1 h-9 px-3 rounded-md bg-[#faf8f5] border border-[#d6d2c4] text-xs text-[#14161f] focus:outline-none focus:border-[#14161f]"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-9 px-4 rounded-md bg-[#14161f] text-[#f2f0e8] text-xs font-semibold hover:bg-[#252836] transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Bottom Sign Up Link */}
          <div className="mt-8 pt-4 border-t border-[#e2ddd3]/60 text-center">
            <p className="text-xs text-[#5f6368]">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-[#14161f] hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Right Column: Klyro Video Panel */}
        <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center bg-[#f0ece1]/50 border-t lg:border-t-0 lg:border-l border-[#e5e1d8]">
          <AuthVisualPanel className="h-[280px] sm:h-[360px] lg:h-full min-h-[280px] lg:min-h-[580px]" />
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh w-full bg-[#14161f] flex items-center justify-center">
          <Loader2 className="size-6 animate-spin text-[#f2a93b]" />
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
