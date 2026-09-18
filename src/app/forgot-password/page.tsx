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

      // Simulate or confirm link delivery
      setIsSubmitted(true);
    } catch {
      setErrorMessage("Unable to send recovery link. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-dvh w-full bg-[#14161f] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-montserrat antialiased">
      <div className="w-full max-w-[1100px] bg-[#faf8f5] rounded-2xl sm:rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] border border-[#e5e1d8] overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left Column */}
        <div className="p-7 sm:p-10 lg:p-14 flex flex-col justify-between">
          <div>
            <div className="mb-8">
              <Logo className="text-[#14161f] hover:opacity-90 transition-opacity" />
            </div>

            <h1 className="font-playfair text-3xl sm:text-4xl font-semibold text-[#14161f] tracking-tight">
              Reset Password
            </h1>
            <p className="mt-2 text-sm text-[#5f6368] font-normal leading-relaxed">
              Enter your email address to receive password recovery instructions
            </p>

            {errorMessage && (
              <div
                role="alert"
                className="mt-5 rounded-lg border border-red-200 bg-red-50/90 p-3.5 text-xs text-red-700 font-medium leading-normal"
              >
                {errorMessage}
              </div>
            )}

            {isSubmitted ? (
              <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50/80 p-5 space-y-3">
                <div className="flex items-center gap-2.5 text-emerald-800 font-semibold text-sm">
                  <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
                  <span>Recovery Instructions Sent</span>
                </div>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  We have dispatched a password reset link to{" "}
                  <strong className="font-semibold text-emerald-950">{email}</strong>. Please check your inbox and spam folder.
                </p>
                <div className="pt-2">
                  <Link
                    href="/signin"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#14161f] hover:underline"
                  >
                    <ArrowLeft className="size-3.5" />
                    <span>Return to Sign In</span>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                <div>
                  <label
                    htmlFor="reset-email"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#2b2f3c] mb-1.5"
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
                    className="w-full h-11 sm:h-12 px-3.5 rounded-lg bg-white border border-[#d6d2c4] text-[#14161f] text-sm placeholder:text-[#9aa0ae] transition-colors duration-150 focus:outline-none focus:border-[#14161f] focus:ring-1 focus:ring-[#14161f]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 sm:h-12 mt-2 rounded-lg bg-[#14161f] hover:bg-[#252836] text-[#f2f0e8] text-sm font-semibold tracking-wide transition-colors duration-150 flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin text-[#f2a93b]" />
                      <span>Sending Instructions...</span>
                    </>
                  ) : (
                    <span>Send Recovery Link</span>
                  )}
                </button>
              </form>
            )}
          </div>

          <div className="mt-8 pt-4 border-t border-[#e2ddd3]/60 text-center">
            <Link
              href="/signin"
              className="inline-flex items-center gap-1.5 text-xs text-[#5f6368] hover:text-[#14161f] font-medium transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Sign In</span>
            </Link>
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

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh w-full bg-[#14161f] flex items-center justify-center">
          <Loader2 className="size-6 animate-spin text-[#f2a93b]" />
        </div>
      }
    >
      <ForgotPasswordContent />
    </Suspense>
  );
}
