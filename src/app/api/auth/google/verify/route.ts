import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  verifyGoogleToken,
  findOrCreateGoogleUser,
  createSessionToken,
} from "@/lib/auth-google";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = body.token || body.id_token || body.access_token || body.credential;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Missing Google authentication credential." },
        { status: 400 }
      );
    }

    // 1. Verify credential cryptographically with Google
    const profile = await verifyGoogleToken(token);

    // 2. Find or create user in Klyro database (strictly using Google sub identifier)
    const { user, isNew } = await findOrCreateGoogleUser(profile);

    // 3. Create authenticated Klyro session
    const sessionToken = createSessionToken(user);
    const cookieStore = await cookies();

    cookieStore.set("klyro_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    const firstName = user.name.split(" ")[0] || "User";
    const lastName = user.name.split(" ").slice(1).join(" ") || "";

    return NextResponse.json({
      success: true,
      isNew,
      user: {
        id: user.id,
        googleId: user.google_id,
        name: user.name,
        fullName: user.name,
        firstName,
        lastName,
        email: user.email,
        avatarUrl: user.avatar_url,
        provider: "google",
        createdAt: user.created_at,
        lastLogin: user.last_login,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Google authentication failed";
    console.error("Google verify error:", err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 401 }
    );
  }
}
