import { NextRequest, NextResponse } from "next/server";
// import { setCookie } from "cookies-next";
import { parseCookies, setCookie } from "nookies";
import axios from "axios";

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI!;

export async function GET(req: NextRequest) {
  // Step 1: Extract code and state from query parameters
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  // Step 2: Verify the state parameter
  const cookies = parseCookies({ req });
  const storedState = cookies.spotify_auth_state;
  if (!state || state !== storedState) {
    return NextResponse.redirect(
      "/?error=state_mismatch" // Redirect to the app with an error
    );
  }

  // Step 3: Exchange authorization code for an access token
  try {
    const response = await axios.post(
      SPOTIFY_TOKEN_URL,
      new URLSearchParams({
        grant_type: "authorization_code",
        code: code ?? "",
        redirect_uri: REDIRECT_URI,
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Basic " + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
        },
      }
    );

    const { access_token, refresh_token, expires_in } = response.data;

    // ! httpOnly: Against XSS ; secure: Against MITM
    // Step 4: Store the tokens securely
    setCookie({ res: NextResponse }, "access_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    setCookie({ res: NextResponse }, "refresh_token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    setCookie({ res: NextResponse }, "expires_in", expires_in, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    // Redirect user to the dashboard or wherever you want
    return NextResponse.redirect("/dashboard");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error exchanging authorization code:", error.message);
      return NextResponse.redirect(
        "/?error=token_exchange_failed" // Redirect to the app with an error
      );
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
}
