"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { AuthVisualPanel } from "@/components/auth/AuthVisualPanel";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

function ForgotPasswordContent() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage("Please enter your account email address.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/signin`,
        });
        if (error) {
          setErrorMessage(error.message);
          setIsSubmitting(false);
          return;
        }
      }

      setIsSubmitted(true);
    } catch {
      setErrorMessage("Unable to send recovery link. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="h-dvh max-h-dvh w-full bg-ink text-cream grid grid-cols-1 lg:grid-cols-2 overflow-hidden font-montserrat antialiased">
      {/* Left Column: Form */}
      <div className="h-full flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 max-w-lg w-full mx-auto overflow-y-auto">
        <div>
          <Logo className="text-cream hover:opacity-90 transition-opacity" />
        </div>

        <div className="my-auto py-4">
          <h1 className="font-playfair text-3xl sm:text-4xl font-semibold text-cream tracking-tight">
            Reset Password
          </h1>
          <p className="mt-2 text-sm text-fog font-normal leading-relaxed">
            Enter your email address to receive password recovery instructions
          </p>

          {errorMessage && (
            <div
              role="alert"
              className="mt-4 rounded-md border border-rose-900/60 bg-rose-950/60 p-3 text-xs text-rose-300 font-medium leading-normal"
            >
              {errorMessage}
            </div>
          )}

          {isSubmitted ? (
            <div className="mt-6 rounded-md border border-emerald-900/60 bg-emerald-950/60 p-4 space-y-3">
              <div className="flex items-center gap-2.5 text-emerald-300 font-semibold text-sm">
                <CheckCircle2 className="size-5 text-emerald-400 shrink-0" />
                <span>Recovery Instructions Sent</span>
              </div>
              <p className="text-xs text-emerald-200 leading-relaxed">
                We have dispatched a password reset link to{" "}
                <strong className="font-semibold text-white">{email}</strong>. Please check your inbox and spam folder.
              </p>
              <div className="pt-2">
                <Link
                  href="/signin"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber hover:underline"
                >
                  <ArrowLeft className="size-3.5" />
                  <span>Return to Sign In</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="reset-email"
                  className="block text-xs font-semibold uppercase tracking-wider text-fog mb-1.5"
                >
                  Email Address
                </label>
                <input
                  id="reset-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full h-11 px-3.5 rounded-md bg-ink-raised border border-slate-line text-cream text-sm placeholder:text-fog-dim transition-colors duration-150 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber/30"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 mt-2 rounded-md bg-amber hover:bg-amber-deep text-[#201404] text-sm font-semibold tracking-wide transition-colors duration-150 flex items-center justify-center gap-2 shadow-xs disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin text-[#201404]" />
                    <span>Sending Instructions...</span>
                  </>
                ) : (
                  <span>Send Recovery Link</span>
                )}
              </button>
            </form>
          )}
        </div>

        <div className="pt-2 text-center">
          <Link
            href="/signin"
            className="inline-flex items-center gap-1.5 text-xs text-fog hover:text-cream font-medium transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>

      {/* Right Column: Full-Height Klyro Video Panel */}
      <div className="hidden lg:block h-full w-full relative overflow-hidden border-l border-slate-line bg-[#10121a]">
        <AuthVisualPanel className="h-full w-full" />
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="h-dvh w-full bg-ink flex items-center justify-center">
          <Loader2 className="size-6 animate-spin text-amber" />
        </div>
      }
    >
      <ForgotPasswordContent />
    </Suspense>
  );
}
