import crypto from "crypto";
import fs from "fs";
import path from "path";
import { createServerSupabaseClient } from "./supabase/server";

export interface GoogleIdentityProfile {
  sub: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  emailVerified?: boolean;
}

export interface KlyroUserRecord {
  id: string;
  google_id: string;
  name: string;
  email: string;
  avatar_url?: string;
  provider: string;
  created_at: string;
  last_login: string;
}

const LOCAL_STORE_DIR = path.join(process.cwd(), ".klyro-data");
const LOCAL_STORE_FILE = path.join(LOCAL_STORE_DIR, "users.json");

function readLocalUsers(): KlyroUserRecord[] {
  try {
    if (!fs.existsSync(LOCAL_STORE_DIR)) {
      fs.mkdirSync(LOCAL_STORE_DIR, { recursive: true });
    }
    if (!fs.existsSync(LOCAL_STORE_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(LOCAL_STORE_FILE, "utf-8");
    return JSON.parse(raw) as KlyroUserRecord[];
  } catch (err) {
    console.warn("Failed to read local users store:", err);
    return [];
  }
}

function writeLocalUsers(users: KlyroUserRecord[]): void {
  try {
    if (!fs.existsSync(LOCAL_STORE_DIR)) {
      fs.mkdirSync(LOCAL_STORE_DIR, { recursive: true });
    }
    fs.writeFileSync(LOCAL_STORE_FILE, JSON.stringify(users, null, 2), "utf-8");
  } catch (err) {
    console.warn("Failed to write to local users store:", err);
  }
}

/**
 * Verify a Google credential (ID Token or Access Token) using Google's official API
 */
export async function verifyGoogleToken(token: string): Promise<GoogleIdentityProfile> {
  if (!token || typeof token !== "string") {
    throw new Error("Missing Google authentication token.");
  }

  const expectedClientId =
    process.env.GOOGLE_CLIENT_ID ||
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    "";

  // Check if token is a JWT ID token (3 dot-separated base64 segments)
  const isJwt = token.split(".").length === 3;

  if (isJwt) {
    // 1. Verify ID Token via Google's tokeninfo endpoint
    const response = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(token)}`,
      { method: "GET" }
    );

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Google ID token verification failed: ${errBody || response.statusText}`);
    }

    const payload = await response.json();

    if (!payload.sub) {
      throw new Error("Invalid token payload: Google sub identifier missing.");
    }

    // Verify audience matches client ID if configured
    if (expectedClientId && payload.aud && payload.aud !== expectedClientId) {
      console.warn(
        `Token aud (${payload.aud}) does not match configured GOOGLE_CLIENT_ID (${expectedClientId})`
      );
    }

    // Verify issuer
    const validIssuers = ["accounts.google.com", "https://accounts.google.com"];
    if (payload.iss && !validIssuers.includes(payload.iss)) {
      throw new Error(`Invalid token issuer: ${payload.iss}`);
    }

    const email = (payload.email || "").toLowerCase().trim();
    const name = payload.name || payload.given_name || email.split("@")[0] || "Klyro User";
    const firstName =
      payload.given_name ||
      name.split(" ")[0] ||
      email.split("@")[0] ||
      "User";
    const lastName =
      payload.family_name ||
      name.split(" ").slice(1).join(" ") ||
      "";

    return {
      sub: payload.sub,
      email,
      name,
      firstName,
      lastName,
      avatarUrl: payload.picture || undefined,
      emailVerified: payload.email_verified === "true" || payload.email_verified === true,
    };
  } else {
    // 2. Access Token: Fetch verified user info from Google's UserInfo API
    const userinfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!userinfoRes.ok) {
      const errBody = await userinfoRes.text();
      throw new Error(`Google UserInfo request failed: ${errBody || userinfoRes.statusText}`);
    }

    const payload = await userinfoRes.json();

    if (!payload.sub) {
      throw new Error("Google userinfo did not contain a sub identifier.");
    }

    const email = (payload.email || "").toLowerCase().trim();
    const name = payload.name || payload.given_name || email.split("@")[0] || "Klyro User";
    const firstName =
      payload.given_name ||
      name.split(" ")[0] ||
      email.split("@")[0] ||
      "User";
    const lastName =
      payload.family_name ||
      name.split(" ").slice(1).join(" ") ||
      "";

    return {
      sub: payload.sub,
      email,
      name,
      firstName,
      lastName,
      avatarUrl: payload.picture || undefined,
      emailVerified: payload.email_verified === true,
    };
  }
}

/**
 * Check Klyro database for existing account or create new user
 * Strictly uses Google's stable "sub" identifier as the Google user ID.
 */
export async function findOrCreateGoogleUser(
  profile: GoogleIdentityProfile
): Promise<{ user: KlyroUserRecord; isNew: boolean }> {
  const googleId = profile.sub;
  const email = profile.email;
  const name = profile.name;
  const avatarUrl = profile.avatarUrl;
  const now = new Date().toISOString();

  const supabase = createServerSupabaseClient();

  if (supabase) {
    try {
      // 1. Check if user with this google_id already exists in Supabase
      const { data: existingByGoogleId, error: queryErr } = await supabase
        .from("klyro_users")
        .select("*")
        .eq("google_id", googleId)
        .maybeSingle();

      if (!queryErr && existingByGoogleId) {
        // User exists: log in and update last_login
        const updatedFields: Record<string, unknown> = {
          last_login: now,
        };
        if (name && name !== existingByGoogleId.name) updatedFields.name = name;
        if (avatarUrl && avatarUrl !== existingByGoogleId.avatar_url) updatedFields.avatar_url = avatarUrl;

        const { data: updatedUser } = await supabase
          .from("klyro_users")
          .update(updatedFields)
          .eq("id", existingByGoogleId.id)
          .select()
          .single();

        return {
          user: updatedUser || { ...existingByGoogleId, ...updatedFields },
          isNew: false,
        };
      }

      // Check if user exists with matching email to link Google account
      if (email) {
        const { data: existingByEmail } = await supabase
          .from("klyro_users")
          .select("*")
          .eq("email", email)
          .maybeSingle();

        if (existingByEmail) {
          const updatedFields = {
            google_id: googleId,
            last_login: now,
            avatar_url: avatarUrl || existingByEmail.avatar_url,
          };
          const { data: linkedUser } = await supabase
            .from("klyro_users")
            .update(updatedFields)
            .eq("id", existingByEmail.id)
            .select()
            .single();

          return {
            user: linkedUser || { ...existingByEmail, ...updatedFields },
            isNew: false,
          };
        }
      }

      // User does not exist: create new Klyro user
      const newUserId = `usr_${crypto.randomBytes(8).toString("hex")}`;
      const newUser: KlyroUserRecord = {
        id: newUserId,
        google_id: googleId,
        name,
        email,
        avatar_url: avatarUrl,
        provider: "google",
        created_at: now,
        last_login: now,
      };

      const { data: insertedUser, error: insertErr } = await supabase
        .from("klyro_users")
        .insert(newUser)
        .select()
        .single();

      if (!insertErr && insertedUser) {
        return { user: insertedUser, isNew: true };
      }

      console.warn("Supabase insert user returned error, falling back to local store:", insertErr?.message);
    } catch (err) {
      console.warn("Supabase database interaction failed, falling back to local persistence:", err);
    }
  }

  // Persistent Local Store Fallback
  const localUsers = readLocalUsers();
  const existingLocal = localUsers.find(
    (u) => u.google_id === googleId || (email && u.email === email)
  );

  if (existingLocal) {
    existingLocal.last_login = now;
    if (googleId) existingLocal.google_id = googleId;
    if (name) existingLocal.name = name;
    if (avatarUrl) existingLocal.avatar_url = avatarUrl;
    writeLocalUsers(localUsers);
    return { user: existingLocal, isNew: false };
  }

  const newLocalUser: KlyroUserRecord = {
    id: `usr_${crypto.randomBytes(8).toString("hex")}`,
    google_id: googleId,
    name,
    email,
    avatar_url: avatarUrl,
    provider: "google",
    created_at: now,
    last_login: now,
  };

  localUsers.push(newLocalUser);
  writeLocalUsers(localUsers);
  return { user: newLocalUser, isNew: true };
}

/**
 * Generate signed session payload for Klyro auth session
 */
export function createSessionToken(user: KlyroUserRecord): string {
  const secret = process.env.NEXTAUTH_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "klyro_session_secret_key_default";
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({
      userId: user.id,
      googleId: user.google_id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatar_url,
      provider: "google",
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days
    })
  ).toString("base64url");

  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${header}.${payload}`)
    .digest("base64url");

  return `${header}.${payload}.${signature}`;
}
