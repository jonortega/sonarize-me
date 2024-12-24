import { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "nookies";
import crypto from "crypto";
import querystring from "querystring";
import { SPOTIFY_SCOPES } from "@/utils/constants";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI!;
const SCOPES = SPOTIFY_SCOPES;

function generateRandomState(length = 16): string {
  return crypto.randomBytes(length).toString("hex");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Step 1: Generate a state parameter for CSRF protection
  const state = generateRandomState(); // ! CRSF protection

  // Step 2: Store the state securely (e.g., HttpOnly cookie)
  setCookie({ res }, "spotify_auth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Set to false in development
    path: "/",
    maxAge: 300, // 5 minutes
  });

  // Step 3: Build the Spotify authorization URL
  const authorizeUrl = `https://accounts.spotify.com/authorize?${querystring.stringify({
    response_type: "code",
    client_id: CLIENT_ID,
    scope: SCOPES,
    redirect_uri: REDIRECT_URI,
    state: state,
  })}`;

  // Step 4: Redirect the user to Spotify's authorization page
  res.redirect(authorizeUrl);
}
