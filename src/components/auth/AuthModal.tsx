"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "signin" | "signup";
}

export function AuthModal({
  open,
  onOpenChange,
  defaultTab = "signin",
}: AuthModalProps) {
  const router = useRouter();
  const { signIn, signUp } = useAuth();

  const [tab, setTab] = useState<"signin" | "signup">(defaultTab);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function resetForm() {
    setError(null);
    setSuccess(null);
    setPassword("");
  }

  function handleTabSwitch(newTab: "signin" | "signup") {
    setTab(newTab);
    resetForm();
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
            onOpenChange(false);
            router.push("/dashboard");
          }, 800);
        }
      } else {
        // Sign Up / Register
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
          setSuccess("Account registered successfully! Redirecting to dashboard...");
          window.setTimeout(() => {
            onOpenChange(false);
            router.push("/dashboard");
          }, 1000);
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6 sm:p-7 overflow-hidden bg-ink-raised border-slate-line text-cream shadow-2xl rounded-md">
        <DialogHeader className="text-center sm:text-center mb-2">
          <div className="mx-auto flex size-12 items-center justify-center rounded-sm bg-amber/15 text-amber border border-amber/30 mb-2 shadow-inner">
            <ShieldCheck className="size-6" />
          </div>
          <DialogTitle className="font-serif font-normal text-xl tracking-tight text-cream">
            {tab === "signin" ? "Welcome back to Klyro" : "Create your Klyro account"}
          </DialogTitle>
          <DialogDescription className="text-xs text-fog mt-1">
            {tab === "signin"
              ? "Sign in with your email and password to access your workspaces."
              : "Register with your details to start generating full-stack websites."}
          </DialogDescription>
        </DialogHeader>

        {/* Tab Toggle */}
        <div className="flex rounded-sm bg-ink p-1 border border-slate-line mb-4">
          <button
            type="button"
            onClick={() => handleTabSwitch("signin")}
            className={`flex-1 rounded-[3px] py-2 text-xs font-semibold transition-all cursor-pointer ${
              tab === "signin"
                ? "bg-amber text-[#201404] shadow-xs"
                : "text-fog hover:text-cream"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch("signup")}
            className={`flex-1 rounded-[3px] py-2 text-xs font-semibold transition-all cursor-pointer ${
              tab === "signup"
                ? "bg-amber text-[#201404] shadow-xs"
                : "text-fog hover:text-cream"
            }`}
          >
            Register / Sign Up
          </button>
        </div>

        {/* Error / Success Alerts */}
        {error && (
          <div className="flex items-start gap-2.5 rounded-sm border border-rose-900/60 bg-rose-950/60 p-3 text-xs text-rose-300">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <p className="leading-tight font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2.5 rounded-sm border border-emerald-900/60 bg-emerald-950/60 p-3 text-xs text-emerald-300">
            <CheckCircle2 className="size-4 shrink-0" />
            <p className="font-medium">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 mt-2">
          {tab === "signup" && (
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-xs font-medium text-cream block mb-1.5">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-fog" />
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Ali"
                    className="pl-9 text-xs h-10 bg-ink border-slate-line text-cream placeholder:text-fog-dim rounded-sm focus:border-amber focus:ring-2 focus:ring-amber/20 caret-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-cream block mb-1.5">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-fog" />
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Khan"
                    className="pl-9 text-xs h-10 bg-ink border-slate-line text-cream placeholder:text-fog-dim rounded-sm focus:border-amber focus:ring-2 focus:ring-amber/20 caret-white"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-cream block mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-fog" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="pl-9 text-xs h-10 bg-ink border-slate-line text-cream placeholder:text-fog-dim rounded-sm focus:border-amber focus:ring-2 focus:ring-amber/20 caret-white"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-cream">
                Password
              </label>
              {tab === "signup" && (
                <span className="text-[10px] text-fog-dim">Min. 6 characters</span>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-fog" />
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-9 pr-9 text-xs h-10 font-mono bg-ink border-slate-line text-cream placeholder:text-fog-dim rounded-sm focus:border-amber focus:ring-2 focus:ring-amber/20 caret-white"
                autoComplete={tab === "signin" ? "current-password" : "new-password"}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-fog hover:text-cream"
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
            className="w-full mt-3 h-10 text-xs font-semibold rounded-sm bg-amber text-[#201404] hover:bg-amber-deep shadow-xs gap-1.5 transition-colors cursor-pointer"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>{tab === "signin" ? "Signing In..." : "Registering Account..."}</span>
              </>
            ) : (
              <span>{tab === "signin" ? "Sign In" : "Register & Create Account"}</span>
            )}
          </Button>

          <div className="text-center pt-2">
            <p className="text-[11px] text-slate-400">
              {tab === "signin" ? (
                <>
                  Don&apos;t have an account yet?{" "}
                  <button
                    type="button"
                    onClick={() => handleTabSwitch("signup")}
                    className="font-semibold text-indigo-400 hover:text-indigo-300 hover:underline"
                  >
                    Register here
                  </button>
                </>
              ) : (
                <>
                  Already registered?{" "}
                  <button
                    type="button"
                    onClick={() => handleTabSwitch("signin")}
                    className="font-semibold text-indigo-400 hover:text-indigo-300 hover:underline"
                  >
                    Sign in here
                  </button>
                </>
              )}
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
