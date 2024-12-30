import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import querystring from "querystring";

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI!;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code"); // Authorization code
    const state = searchParams.get("state"); // Previously generated state

    console.log(`Obtained authorization code: ${code}`);

    if (!code || !state) {
      return NextResponse.redirect(new URL("/?error=missing_params", req.url));
    }

    const storedState = req.cookies.get("spotify_auth_state")?.value;

    if (!storedState || state !== storedState) {
      return NextResponse.redirect(new URL("/?error=state_mismatch", req.url));
    }

    console.log("Exchangin authorization code for access_token...");

    // Exchange the authorization code for an access_token
    const tokenResponse = await axios.post(
      SPOTIFY_TOKEN_URL,
      querystring.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
        },
      }
    );

    console.log(`Obtained access_token: ${tokenResponse.data}`);

    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    const response = NextResponse.redirect(new URL("/home", req.url));

    // ! httpOnly: Agains XSS ; secure: Agains MITM
    response.cookies.set("access_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: expires_in, // 1 hour
    });

    response.cookies.set("refresh_token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    response.cookies.delete("spotify_auth_state"); // For security

    console.log("Securely stored access_token and refresh_token in cookies");

    return response;
  } catch (error: unknown) {
    console.error("Error exchanging authorization code:", error);

    return NextResponse.redirect(new URL("/?error=token_exchange_failed", req.url));
  }
}
