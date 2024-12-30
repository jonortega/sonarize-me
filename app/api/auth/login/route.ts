import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import querystring from "querystring";
import { SPOTIFY_SCOPES } from "@/utils/constants";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI!;
const SCOPES = SPOTIFY_SCOPES;

// For CSRF protection
function generateRandomState(length = 16): string {
  return crypto.randomBytes(length).toString("hex");
}

export async function GET(req: NextRequest) {
  void req; // Supress "unused variable" warning from ESLint

  const state = generateRandomState(); // ! CRSF protection

  const response = NextResponse.redirect(
    `https://accounts.spotify.com/authorize?${querystring.stringify({
      response_type: "code",
      client_id: CLIENT_ID,
      scope: SCOPES,
      redirect_uri: REDIRECT_URI,
      state: state,
      show_dialog: true,
    })}`
  );

  // Store the state in a cookie
  response.cookies.set("spotify_auth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // "false" in development
    path: "/",
    maxAge: 300, // 5 mins
  });

  console.log(`Stored spotify_auth_state cookie: ${state}`);

  console.log("Redirecting to Spotify auth page...");

  return response;
}
