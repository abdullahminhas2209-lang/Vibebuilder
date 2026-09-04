"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2, Lock, Mail, Sparkles, User } from "lucide-react";

import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

export default function AuthPage() {
  const router = useRouter();
  const { signIn, signUp } = useAuth();

  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function handleTabSwitch(newTab: "signin" | "signup") {
    setTab(newTab);
    setError(null);
    setSuccess(null);
    setPassword("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (tab === "signin") {
        if (!email.trim() || !password) {
          setError("Please enter both email and password.");
          setLoading(false);
          return;
        }

        const res = await signIn(email.trim(), password);
        if (res.error) {
          setError(res.error);
        } else {
          setSuccess("Signed in successfully! Redirecting...");
          window.setTimeout(() => {
            router.push("/dashboard");
          }, 600);
        }
      } else {
        if (!firstName.trim() || !lastName.trim()) {
          setError("Please enter both first and last name.");
          setLoading(false);
          return;
        }
        if (!email.trim()) {
          setError("Please provide a valid email address.");
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError("Password must be at least 6 characters long.");
          setLoading(false);
          return;
        }

        const res = await signUp({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          password,
        });

        if (res.error) {
          setError(res.error);
        } else {
          setSuccess("Account created successfully! Redirecting...");
          window.setTimeout(() => {
            router.push("/dashboard");
          }, 800);
        }
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#0B0F19] text-slate-100">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <Logo />
        </div>

        <Card className="p-6 sm:p-7 shadow-2xl border-slate-800 bg-[#0F172A] rounded-3xl text-slate-100 ring-1 ring-white/10">
          <div className="text-center mb-5">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 mb-3 shadow-inner">
              <Sparkles className="size-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              {tab === "signin" ? "Sign in to Klyro" : "Register a New Account"}
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              {tab === "signin"
                ? "Enter your credentials to access your AI workspaces."
                : "Enter your first name, last name, email, and password to register."}
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex rounded-xl bg-slate-950/80 p-1 border border-slate-800 mb-5">
            <button
              type="button"
              onClick={() => handleTabSwitch("signin")}
              className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
                tab === "signin"
                  ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch("signup")}
              className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
                tab === "signup"
                  ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Register / Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-rose-900/60 bg-rose-950/60 p-3 text-xs text-rose-300">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <p className="leading-tight font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-emerald-900/60 bg-emerald-950/60 p-3 text-xs text-emerald-300">
              <CheckCircle2 className="size-4 shrink-0" />
              <p className="font-medium">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {tab === "signup" && (
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-medium text-slate-200 block mb-1.5">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Ali"
                      className="pl-9 text-xs h-10 bg-slate-950 border-slate-700/80 text-white placeholder:text-slate-500 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 caret-white"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-200 block mb-1.5">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Khan"
                      className="pl-9 text-xs h-10 bg-slate-950 border-slate-700/80 text-white placeholder:text-slate-500 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 caret-white"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-slate-200 block mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-9 text-xs h-10 bg-slate-950 border-slate-700/80 text-white placeholder:text-slate-500 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 caret-white"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-200">
                  Password
                </label>
                {tab === "signup" && (
                  <span className="text-[10px] text-slate-400">Min. 6 characters</span>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-9 pr-9 text-xs h-10 font-mono bg-slate-950 border-slate-700/80 text-white placeholder:text-slate-500 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 caret-white"
                  autoComplete={tab === "signin" ? "current-password" : "new-password"}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-3 h-10 text-xs font-semibold rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-blue-500 gap-1.5 transition-all hover:scale-[1.01]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>{tab === "signin" ? "Signing In..." : "Registering Account..."}</span>
                </>
              ) : (
                <span>{tab === "signin" ? "Sign In" : "Register & Start Building"}</span>
              )}
            </Button>
          </form>
        </Card>

        <p className="text-center text-xs text-slate-400">
          <Link href="/" className="hover:text-white hover:underline transition-colors">
            ← Back to Homepage
          </Link>
        </p>
      </div>
    </div>
  );
}
