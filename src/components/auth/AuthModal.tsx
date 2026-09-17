"use client";

import { useEffect, useState } from "react";
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
import { GoogleIcon } from "@/components/auth/GoogleIcon";
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
  const { signIn, signUp, signInWithGoogle, loginWithGoogleFallback } = useAuth();

  const [tab, setTab] = useState<"signin" | "signup">(defaultTab);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fallback for direct official Gmail entry
  const [showGmailFallback, setShowGmailFallback] = useState(false);
  const [directGmail, setDirectGmail] = useState("");

  // Check for pending prompt in storage
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);

  useEffect(() => {
    if (open && typeof window !== "undefined") {
      const stored =
        sessionStorage.getItem("klyro_pending_prompt") ||
        localStorage.getItem("klyro_pending_prompt");
      if (stored && stored.trim()) {
        setPendingPrompt(stored.trim());
      } else {
        setPendingPrompt(null);
      }
    }
  }, [open]);

  function resetForm() {
    setError(null);
    setSuccess(null);
    setPassword("");
    setShowGmailFallback(false);
  }

  function handleTabSwitch(newTab: "signin" | "signup") {
    setTab(newTab);
    resetForm();
  }

  async function handlePostAuthSuccess() {
    const activePrompt =
      pendingPrompt ||
      (typeof window !== "undefined"
        ? sessionStorage.getItem("klyro_pending_prompt") ||
          localStorage.getItem("klyro_pending_prompt")
        : null);

    onOpenChange(false);

    if (activePrompt && activePrompt.trim()) {
      const cleanPrompt = activePrompt.trim();
      try {
        const uniqueId = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        const words = cleanPrompt
          .replace(/^(build|create|design|make)\s+(a|an|the)?\s*/i, "")
          .split(/\s+/)
          .slice(0, 4)
          .join(" ");
        const derivedName = words
          ? words.charAt(0).toUpperCase() + words.slice(1)
          : "New Klyro Project";

        const { createProject } = await import("@/lib/supabase/db");
        const newProject = await createProject({
          id: uniqueId,
          name: derivedName,
          description: cleanPrompt,
          type: "Web Application",
          status: "active",
        });

        if (typeof window !== "undefined") {
          sessionStorage.removeItem("klyro_pending_prompt");
          localStorage.removeItem("klyro_pending_prompt");
        }

        router.push(`/project/${newProject.id}?prompt=${encodeURIComponent(cleanPrompt)}`);
        return;
      } catch (err) {
        console.error("Auto-create project error:", err);
        const fallbackId = `proj_${Date.now()}`;
        router.push(`/project/${fallbackId}?prompt=${encodeURIComponent(cleanPrompt)}`);
        return;
      }
    }

    router.push("/dashboard");
  }

  async function handleGoogleSignIn() {
    setError(null);
    setSuccess(null);
    setGoogleLoading(true);

    try {
      const res = await signInWithGoogle("project");
      if (res.error) {
        setShowGmailFallback(true);
        setError("Google OAuth provider is not yet enabled in your Supabase dashboard. Enter your official Gmail below to continue directly.");
      } else if (res.url) {
        setSuccess("Redirecting to Google account picker...");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to connect with Google";
      setError(msg);
      setShowGmailFallback(true);
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handleDirectGmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!directGmail.trim() || !directGmail.includes("@")) {
      setError("Please provide a valid Gmail address.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await loginWithGoogleFallback(directGmail.trim());
      setSuccess("Signed in with Google identity! Launching workspace...");
      window.setTimeout(() => {
        handlePostAuthSuccess();
      }, 600);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to sign in with Gmail";
      setError(msg);
    } finally {
      setLoading(false);
    }
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
          setSuccess("Signed in successfully! Launching workspace...");
          window.setTimeout(() => {
            handlePostAuthSuccess();
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
          setSuccess("Account registered successfully! Launching workspace...");
          window.setTimeout(() => {
            handlePostAuthSuccess();
          }, 800);
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
              ? "Sign in to access your AI workspaces and project builds."
              : "Register to start generating full-stack websites and applications."}
          </DialogDescription>
        </DialogHeader>

        {/* Pending prompt notice if arrived with prompt */}
        {pendingPrompt && (
          <div className="mb-2 rounded-sm border border-amber/30 bg-amber/5 p-3 text-xs text-cream">
            <div className="flex items-center gap-2 mb-1">
              <span className="size-1.5 rounded-full bg-amber animate-pulse" />
              <span className="font-mono text-[11px] uppercase tracking-wider text-amber font-semibold">
                Project Ready to Build
              </span>
            </div>
            <p className="font-mono text-fog text-[11px] line-clamp-2 italic">
              "{pendingPrompt}"
            </p>
          </div>
        )}

        {/* Continue with Google */}
        <div className="space-y-2 mt-1">
          <Button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="w-full h-10 rounded-sm bg-ink border border-slate-line hover:bg-ink/80 hover:border-slate-line/80 text-cream text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-2.5 shadow-xs"
          >
            {googleLoading ? (
              <Loader2 className="size-4 animate-spin text-amber" />
            ) : (
              <GoogleIcon className="size-4 shrink-0" />
            )}
            <span>Continue with Google</span>
          </Button>

          {showGmailFallback && (
            <form onSubmit={handleDirectGmailSubmit} className="rounded-sm border border-amber/30 bg-ink p-2.5 space-y-2">
              <div className="flex items-center gap-2 text-xs text-amber font-mono">
                <GoogleIcon className="size-3.5 shrink-0" />
                <span>Enter official Gmail to continue directly</span>
              </div>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="your.email@gmail.com"
                  value={directGmail}
                  onChange={(e) => setDirectGmail(e.target.value)}
                  className="text-xs h-8 bg-ink-raised border-slate-line text-cream placeholder:text-fog-dim focus:border-amber focus:ring-1 focus:ring-amber/20"
                  required
                />
                <Button
                  type="submit"
                  disabled={!directGmail.trim() || loading}
                  className="h-8 px-3 text-xs bg-amber text-[#201404] hover:bg-amber-deep font-medium shrink-0 cursor-pointer shadow-xs"
                >
                  {loading ? <Loader2 className="size-3.5 animate-spin" /> : "Continue"}
                </Button>
              </div>
            </form>
          )}

          <div className="relative my-3 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-line" />
            </div>
            <span className="relative bg-ink-raised px-2 text-[10px] font-mono text-fog uppercase tracking-wider">
              or continue with email
            </span>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex rounded-sm bg-ink p-1 border border-slate-line mb-3">
          <button
            type="button"
            onClick={() => handleTabSwitch("signin")}
            className={`flex-1 rounded-[3px] py-1.5 text-xs font-semibold transition-all cursor-pointer ${
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
            className={`flex-1 rounded-[3px] py-1.5 text-xs font-semibold transition-all cursor-pointer ${
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
          <div className="flex items-start gap-2.5 rounded-sm border border-rose-900/60 bg-rose-950/60 p-2.5 text-xs text-rose-300">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <p className="leading-tight font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2.5 rounded-sm border border-emerald-900/60 bg-emerald-950/60 p-2.5 text-xs text-emerald-300">
            <CheckCircle2 className="size-4 shrink-0" />
            <p className="font-medium">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 mt-1">
          {tab === "signup" && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium text-cream block mb-1">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-fog" />
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Ali"
                    className="pl-9 text-xs h-9 bg-ink border-slate-line text-cream placeholder:text-fog-dim rounded-sm focus:border-amber focus:ring-1 focus:ring-amber/20 caret-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-cream block mb-1">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-fog" />
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Khan"
                    className="pl-9 text-xs h-9 bg-ink border-slate-line text-cream placeholder:text-fog-dim rounded-sm focus:border-amber focus:ring-1 focus:ring-amber/20 caret-white"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-cream block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-fog" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="pl-9 text-xs h-9 bg-ink border-slate-line text-cream placeholder:text-fog-dim rounded-sm focus:border-amber focus:ring-1 focus:ring-amber/20 caret-white"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
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
                className="pl-9 pr-9 text-xs h-9 font-mono bg-ink border-slate-line text-cream placeholder:text-fog-dim rounded-sm focus:border-amber focus:ring-1 focus:ring-amber/20 caret-white"
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
            className="w-full mt-2 h-9 text-xs font-semibold rounded-sm bg-amber text-[#201404] hover:bg-amber-deep shadow-xs gap-1.5 transition-colors cursor-pointer"
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

          <div className="text-center pt-1">
            <p className="text-[11px] text-fog">
              {tab === "signin" ? (
                <>
                  Don&apos;t have an account yet?{" "}
                  <button
                    type="button"
                    onClick={() => handleTabSwitch("signup")}
                    className="font-semibold text-amber hover:underline cursor-pointer"
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
                    className="font-semibold text-amber hover:underline cursor-pointer"
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
