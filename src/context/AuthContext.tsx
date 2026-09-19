"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

declare global {
  interface Window {
    google?: {
      accounts?: {
        oauth2?: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            prompt?: string;
            callback: (response: { access_token?: string; error?: string; [key: string]: unknown }) => void;
            error_callback?: (err: unknown) => void;
          }) => {
            requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
          };
          initCodeClient?: (config: unknown) => unknown;
        };
        id?: {
          initialize: (config: unknown) => void;
          prompt: (notification?: unknown) => void;
        };
      };
    };
  }
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  initials: string;
  avatarUrl?: string;
  provider?: string;
  googleId?: string;
}

interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: SupabaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (data: SignUpData) => Promise<{ error?: string; message?: string }>;
  signInWithGoogle: (redirectPath?: string) => Promise<{ error?: string; user?: UserProfile; url?: string }>;
  loginWithGoogleFallback: (email: string, name?: string) => Promise<void>;
  setSessionUser: (profile: UserProfile) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getInitials(first: string, last: string): string {
  const f = first ? first.trim().charAt(0).toUpperCase() : "";
  const l = last ? last.trim().charAt(0).toUpperCase() : "";
  return f + l || "U";
}

const USER_STORAGE_KEY = "klyro_user";
const LEGACY_USER_STORAGE_KEY = "vibebuilder_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored =
          localStorage.getItem(USER_STORAGE_KEY) ||
          localStorage.getItem(LEGACY_USER_STORAGE_KEY);
        if (stored) return JSON.parse(stored);

        // Check cookie hint
        const match = document.cookie.match(/(^|;)\s*klyro_user_hint=([^;]+)/);
        if (match && match[2]) {
          const parsed = JSON.parse(decodeURIComponent(match[2]));
          if (parsed && parsed.email) return parsed;
        }
      } catch {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState<boolean>(() => {
    return isSupabaseConfigured && Boolean(supabase);
  });

  function mapUserToProfile(u: SupabaseUser): UserProfile {
    const meta = u.user_metadata || {};
    const firstName =
      meta.given_name ||
      meta.first_name ||
      meta.firstName ||
      meta.name?.split(" ")[0] ||
      u.email?.split("@")[0] ||
      "User";
    const lastName =
      meta.family_name ||
      meta.last_name ||
      meta.lastName ||
      meta.name?.split(" ").slice(1).join(" ") ||
      "";
    const fullName = meta.full_name || meta.name || `${firstName} ${lastName}`.trim();
    const initials = getInitials(firstName, lastName);
    const avatarUrl = meta.avatar_url || meta.picture || "";
    const provider = u.app_metadata?.provider || (meta.iss?.includes("google") ? "google" : "email");

    return {
      id: u.id,
      email: u.email || "",
      firstName,
      lastName,
      fullName,
      initials,
      avatarUrl,
      provider,
    };
  }

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      // Check local storage mock session (support modern and legacy keys)
      const stored =
        typeof window !== "undefined"
          ? localStorage.getItem(USER_STORAGE_KEY) ||
            localStorage.getItem(LEGACY_USER_STORAGE_KEY)
          : null;
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setProfile(parsed);
        } catch {
          // ignore
        }
      }
      setLoading(false);
      return;
    }

    let isMounted = true;

    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted) {
        if (session?.user) {
          setUser(session.user);
          setProfile(mapUserToProfile(session.user));
        } else {
          // If no Supabase user, check local storage Klyro user / cookie hint
          const stored =
            typeof window !== "undefined"
              ? localStorage.getItem(USER_STORAGE_KEY) ||
                localStorage.getItem(LEGACY_USER_STORAGE_KEY)
              : null;
          if (stored) {
            try {
              setProfile(JSON.parse(stored));
            } catch {
              // ignore
            }
          }
        }
        setLoading(false);
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (isMounted) {
          if (session?.user) {
            setUser(session.user);
            setProfile(mapUserToProfile(session.user));
          } else {
            setUser(null);
            setProfile(null);
          }
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function signIn(email: string, password: string) {
    if (!isSupabaseConfigured || !supabase) {
      // Local fallback sign in
      const mockProfile: UserProfile = {
        id: "local_user",
        email,
        firstName: email.split("@")[0] || "User",
        lastName: "",
        fullName: email.split("@")[0] || "User",
        initials: (email.charAt(0) || "U").toUpperCase(),
      };
      setProfile(mockProfile);
      if (typeof window !== "undefined") {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mockProfile));
      }
      return {};
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }

    if (data.user) {
      setUser(data.user);
      setProfile(mapUserToProfile(data.user));
    }

    return {};
  }

  async function signUp({ firstName, lastName, email, password }: SignUpData) {
    const fullName = `${firstName} ${lastName}`.trim();

    if (!isSupabaseConfigured || !supabase) {
      // Local fallback register
      const mockProfile: UserProfile = {
        id: `user_${Date.now()}`,
        email,
        firstName,
        lastName,
        fullName,
        initials: getInitials(firstName, lastName),
      };
      setProfile(mockProfile);
      if (typeof window !== "undefined") {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mockProfile));
      }
      return { message: "Account created successfully!" };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          full_name: fullName,
        },
      },
    });

    if (error) {
      return { error: error.message };
    }

    if (data.user) {
      setUser(data.user);
      setProfile(mapUserToProfile(data.user));
    }

    return { message: "Account created! You can now access your dashboard." };
  }

  function setSessionUser(userProfile: UserProfile) {
    setProfile(userProfile);
    if (typeof window !== "undefined") {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userProfile));
      localStorage.setItem(LEGACY_USER_STORAGE_KEY, JSON.stringify(userProfile));
    }
  }

  async function signInWithGoogle(redirectPath: string = "/"): Promise<{ error?: string; user?: UserProfile; url?: string }> {
    try {
      // 1. Fetch configured Google Client ID from backend
      let clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
      if (!clientId) {
        try {
          const cfgRes = await fetch("/api/auth/google/config");
          if (cfgRes.ok) {
            const cfg = await cfgRes.json();
            clientId = cfg.clientId || "";
          }
        } catch {
          // ignore
        }
      }

      if (!clientId) {
        return {
          error: "Google Client ID is not configured. Please set GOOGLE_CLIENT_ID in your environment variables.",
        };
      }

      // 2. Official Google Identity Services Popup (Account Chooser)
      if (typeof window !== "undefined" && window.google?.accounts?.oauth2?.initTokenClient) {
        return new Promise((resolve) => {
          let hasResolved = false;

          try {
            const tokenClient = window.google!.accounts!.oauth2!.initTokenClient({
              client_id: clientId,
              scope: "openid email profile",
              prompt: "select_account",
              error_callback: (err: unknown) => {
                if (hasResolved) return;
                hasResolved = true;
                console.error("GIS error callback:", err);
                resolve({ error: "Google authentication was cancelled or encountered an error." });
              },
              callback: async (tokenResponse: { access_token?: string; error?: string }) => {
                if (hasResolved) return;
                hasResolved = true;

                if (tokenResponse.error) {
                  resolve({ error: `Google authentication failed: ${tokenResponse.error}` });
                  return;
                }

                if (!tokenResponse.access_token) {
                  resolve({ error: "No access token received from Google." });
                  return;
                }

                try {
                  // Verify credential with server endpoint
                  const verifyRes = await fetch("/api/auth/google/verify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      token: tokenResponse.access_token,
                      returnUrl: redirectPath,
                    }),
                  });

                  const data = await verifyRes.json();

                  if (!verifyRes.ok || !data.success || !data.user) {
                    resolve({
                      error: data.error || "Failed to verify Google identity on server.",
                    });
                    return;
                  }

                  const userProfile: UserProfile = {
                    id: data.user.id,
                    googleId: data.user.googleId,
                    email: data.user.email,
                    firstName: data.user.firstName || data.user.name?.split(" ")[0] || "User",
                    lastName: data.user.lastName || data.user.name?.split(" ").slice(1).join(" ") || "",
                    fullName: data.user.fullName || data.user.name,
                    initials: getInitials(data.user.firstName || "", data.user.lastName || ""),
                    avatarUrl: data.user.avatarUrl,
                    provider: "google",
                  };

                  setSessionUser(userProfile);
                  resolve({ user: userProfile });
                } catch (err: unknown) {
                  const msg = err instanceof Error ? err.message : "Error verifying Google token";
                  resolve({ error: msg });
                }
              },
            });

            tokenClient.requestAccessToken({ prompt: "select_account" });
          } catch (initErr: unknown) {
            console.warn("GIS tokenClient error, redirecting:", initErr);
            const loginUrl = `/api/auth/google/login?returnUrl=${encodeURIComponent(redirectPath)}`;
            window.location.href = loginUrl;
            resolve({ url: loginUrl });
          }
        });
      }

      // 3. Fallback to Google OAuth 2.0 redirect flow
      if (typeof window !== "undefined") {
        const loginUrl = `/api/auth/google/login?returnUrl=${encodeURIComponent(redirectPath)}`;
        window.location.href = loginUrl;
        return { url: loginUrl };
      }

      return { error: "Google authentication service is unavailable." };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to initiate Google sign in.";
      return { error: message };
    }
  }

  async function loginWithGoogleFallback(email: string, name?: string) {
    const cleanEmail = email.trim();
    const emailPrefix = cleanEmail.split("@")[0] || "User";
    const fullName = name && name.trim() ? name.trim() : emailPrefix;
    const parts = fullName.split(" ");
    const firstName = parts[0] || emailPrefix;
    const lastName = parts.slice(1).join(" ") || "";

    const mockProfile: UserProfile = {
      id: `google_${Date.now()}`,
      email: cleanEmail,
      firstName,
      lastName,
      fullName,
      initials: getInitials(firstName, lastName),
      provider: "google",
    };

    setProfile(mockProfile);
    if (typeof window !== "undefined") {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mockProfile));
    }
  }

  async function signOut() {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(LEGACY_USER_STORAGE_KEY);
      sessionStorage.removeItem("klyro_pending_prompt");
      localStorage.removeItem("klyro_pending_prompt");
      document.cookie = "klyro_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      document.cookie = "klyro_user_hint=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        loginWithGoogleFallback,
        setSessionUser,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
