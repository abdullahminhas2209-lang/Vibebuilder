"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  initials: string;
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
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getInitials(first: string, last: string): string {
  const f = first ? first.trim().charAt(0).toUpperCase() : "";
  const l = last ? last.trim().charAt(0).toUpperCase() : "";
  return f + l || "U";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  function mapUserToProfile(u: SupabaseUser): UserProfile {
    const meta = u.user_metadata || {};
    const firstName = meta.first_name || meta.firstName || u.email?.split("@")[0] || "User";
    const lastName = meta.last_name || meta.lastName || "";
    const fullName = meta.full_name || `${firstName} ${lastName}`.trim();
    const initials = getInitials(firstName, lastName);

    return {
      id: u.id,
      email: u.email || "",
      firstName,
      lastName,
      fullName,
      initials,
    };
  }

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      // Check local storage mock session
      const stored = typeof window !== "undefined" ? localStorage.getItem("vibebuilder_user") : null;
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

    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setProfile(mapUserToProfile(session.user));
      }
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          setProfile(mapUserToProfile(session.user));
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
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
        localStorage.setItem("vibebuilder_user", JSON.stringify(mockProfile));
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
        localStorage.setItem("vibebuilder_user", JSON.stringify(mockProfile));
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

  async function signOut() {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("vibebuilder_user");
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
