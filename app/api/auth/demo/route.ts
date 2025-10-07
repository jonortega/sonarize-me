import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  void req; // Supress "unused variable" warning from ESLint

  const response = NextResponse.redirect(new URL("/home", req.url));

  // Establecer una cookie que indique que estamos en modo demo
  response.cookies.set("demo_mode", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 día
  });

  console.log("Demo mode activated, redirecting to /home");

  return response;
}
