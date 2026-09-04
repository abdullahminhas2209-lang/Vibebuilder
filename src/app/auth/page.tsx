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
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-50 dark:bg-background">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <Logo />
        </div>

        <Card className="p-6 shadow-xl border-border bg-card">
          <div className="text-center mb-5">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3 shadow-inner">
              <Sparkles className="size-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              {tab === "signin" ? "Sign in to Klyro" : "Register a New Account"}
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              {tab === "signin"
                ? "Enter your credentials to access your AI workspaces."
                : "Enter your first name, last name, email, and password to register."}
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex rounded-lg bg-muted p-1 mb-5">
            <button
              type="button"
              onClick={() => handleTabSwitch("signin")}
              className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-all ${
                tab === "signin"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch("signup")}
              className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-all ${
                tab === "signup"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Register / Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50/80 p-3 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <p className="leading-tight font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 flex items-center gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50/80 p-3 text-xs text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300">
              <CheckCircle2 className="size-4 shrink-0" />
              <p className="font-medium">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {tab === "signup" && (
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                    <Input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Ali"
                      className="pl-8 text-xs h-9"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                    <Input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Khan"
                      className="pl-8 text-xs h-9"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-foreground block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-8 text-xs h-9"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-foreground">
                  Password
                </label>
                {tab === "signup" && (
                  <span className="text-[10px] text-muted-foreground">Min. 6 characters</span>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-8 pr-8 text-xs h-9 font-mono"
                  autoComplete={tab === "signin" ? "current-password" : "new-password"}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="size-3.5" />
                  ) : (
                    <Eye className="size-3.5" />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full mt-2 h-9 text-xs font-semibold gap-1.5" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>{tab === "signin" ? "Signing In..." : "Registering Account..."}</span>
                </>
              ) : (
                <span>{tab === "signin" ? "Sign In" : "Register & Start Building"}</span>
              )}
            </Button>
          </form>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          <Link href="/" className="hover:underline">
            ← Back to Homepage
          </Link>
        </p>
      </div>
    </div>
  );
}
