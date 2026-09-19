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
  const { signIn, signInWithGoogle } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Inspect or initialize return state from search params or storage
  useEffect(() => {
    const errorParam = searchParams?.get("error");
    if (errorParam) {
      setErrorMessage(decodeURIComponent(errorParam));
    }

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
      const existingState = getAuthReturnState();
      const returnUrl = sanitizeReturnUrl(
        searchParams?.get("returnUrl") || searchParams?.get("redirect") || existingState?.returnUrl || "/"
      );

      const res = await signInWithGoogle(returnUrl);
      if (res.error) {
        setErrorMessage(res.error);
        setIsGoogleSubmitting(false);
      } else if (res.url) {
        // Redirect initiated
      } else {
        handleSuccessfulAuth(returnUrl);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to connect to Google.";
      setErrorMessage(msg);
      setIsGoogleSubmitting(false);
    }
  }

  return (
    <div className="min-h-dvh w-full bg-ink flex items-center justify-center p-4 sm:p-6 lg:p-10 font-montserrat antialiased">
      {/* Centered Login Card Container */}
      <div className="w-full max-w-[1060px] bg-ink-raised rounded-2xl sm:rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border border-slate-line overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left Column: Sign In Form */}
        <div className="p-7 sm:p-10 lg:p-12 flex flex-col justify-between">
          <div>
            {/* Klyro Brand Logo */}
            <div className="mb-6">
              <Logo className="text-cream hover:opacity-90 transition-opacity" />
            </div>

            {/* Header Section */}
            <h1 className="font-playfair text-3xl sm:text-4xl font-semibold text-cream tracking-tight">
              Welcome Back
            </h1>
            <p className="mt-2 text-sm text-fog font-normal leading-relaxed">
              Enter your email &amp; password to access your account
            </p>

            {/* Error Notification */}
            {errorMessage && (
              <div
                role="alert"
                className="mt-4 rounded-md border border-rose-900/60 bg-rose-950/60 p-3 text-xs text-rose-300 font-medium leading-normal"
              >
                {errorMessage}
              </div>
            )}

            {/* Primary Sign In Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="signin-email"
                  className="block text-xs font-semibold uppercase tracking-wider text-fog mb-1.5"
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
                  className="w-full h-11 px-3.5 rounded-md bg-ink border border-slate-line text-cream text-sm placeholder:text-fog-dim transition-colors duration-150 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber/30"
                />
              </div>

              <div>
                <label
                  htmlFor="signin-password"
                  className="block text-xs font-semibold uppercase tracking-wider text-fog mb-1.5"
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

              {/* Remember me & Forgot Password */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="size-4 rounded border-slate-line bg-ink text-amber focus:ring-amber/30 accent-[#f2a93b] cursor-pointer"
                  />
                  <span className="text-xs text-fog font-medium">Remember me</span>
                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-fog hover:text-cream transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Primary Sign In Button */}
              <button
                type="submit"
                disabled={isSubmitting || isGoogleSubmitting}
                className="w-full h-11 mt-2 rounded-md bg-amber hover:bg-amber-deep text-[#201404] text-sm font-semibold tracking-wide transition-colors duration-150 flex items-center justify-center gap-2 shadow-xs disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin text-[#201404]" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-5 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-line" />
              </div>
              <span className="relative bg-ink-raised px-3 text-xs text-fog-dim uppercase tracking-wider font-medium">
                or
              </span>
            </div>

            {/* Secondary: Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
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
                  <span>Sign in with Google</span>
                </>
              )}
            </button>
          </div>

          {/* Bottom Sign Up Link */}
          <div className="mt-6 pt-4 border-t border-slate-line/60 text-center">
            <p className="text-xs text-fog">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-amber hover:underline"
              >
                Sign up
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

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh w-full bg-ink flex items-center justify-center">
          <Loader2 className="size-6 animate-spin text-amber" />
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
