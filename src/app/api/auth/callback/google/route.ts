import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  verifyGoogleToken,
  findOrCreateGoogleUser,
  createSessionToken,
} from "@/lib/auth-google";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const stateRaw = searchParams.get("state");

  let returnUrl = "/";
  if (stateRaw) {
    try {
      const decoded = JSON.parse(Buffer.from(stateRaw, "base64url").toString("utf-8"));
      if (decoded.returnUrl) returnUrl = decoded.returnUrl;
    } catch {
      // ignore
    }
  }

  if (error) {
    return NextResponse.redirect(
      new URL(`/signin?error=${encodeURIComponent(error)}`, req.nextUrl.origin)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/signin?error=Missing authorization code from Google", req.nextUrl.origin)
    );
  }

  const clientId =
    process.env.GOOGLE_CLIENT_ID ||
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    "";
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
  const origin = req.nextUrl.origin;
  const redirectUri = `${origin}/api/auth/callback/google`;

  try {
    // Exchange authorization code for tokens
    const tokenParams = new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    });

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: tokenParams.toString(),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error("Token exchange failed:", errText);
      return NextResponse.redirect(
        new URL(
          `/signin?error=${encodeURIComponent("Google token exchange failed. Please try again.")}`,
          req.nextUrl.origin
        )
      );
    }

    const tokenData = await tokenRes.json();
    const tokenToVerify = tokenData.id_token || tokenData.access_token;

    // Verify Google user identity (strictly extracting sub)
    const profile = await verifyGoogleToken(tokenToVerify);

    // Find or create user in Klyro database
    const { user } = await findOrCreateGoogleUser(profile);

    // Create session
    const sessionToken = createSessionToken(user);
    const cookieStore = await cookies();

    cookieStore.set("klyro_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    // Also set a client-readable session hint cookie for smooth hydration
    const clientUserPayload = {
      id: user.id,
      googleId: user.google_id,
      name: user.name,
      fullName: user.name,
      email: user.email,
      avatarUrl: user.avatar_url,
      provider: "google",
    };

    const res = NextResponse.redirect(new URL(returnUrl, req.nextUrl.origin));
    res.cookies.set("klyro_user_hint", encodeURIComponent(JSON.stringify(clientUserPayload)), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return res;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Authentication failed";
    console.error("Callback error:", err);
    return NextResponse.redirect(
      new URL(`/signin?error=${encodeURIComponent(msg)}`, req.nextUrl.origin)
    );
  }
}
