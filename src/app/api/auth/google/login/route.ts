import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const clientId =
    process.env.GOOGLE_CLIENT_ID ||
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    "";

  if (!clientId) {
    return NextResponse.json(
      { error: "Google Client ID is not configured in server environment." },
      { status: 500 }
    );
  }

  const searchParams = req.nextUrl.searchParams;
  const returnUrl = searchParams.get("returnUrl") || "/";

  const origin = req.nextUrl.origin;
  const redirectUri = `${origin}/api/auth/callback/google`;

  const statePayload = Buffer.from(JSON.stringify({ returnUrl })).toString("base64url");

  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleAuthUrl.searchParams.set("client_id", clientId);
  googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
  googleAuthUrl.searchParams.set("response_type", "code");
  googleAuthUrl.searchParams.set("scope", "openid email profile");
  googleAuthUrl.searchParams.set("prompt", "select_account");
  googleAuthUrl.searchParams.set("access_type", "offline");
  googleAuthUrl.searchParams.set("state", statePayload);

  return NextResponse.redirect(googleAuthUrl.toString());
}
