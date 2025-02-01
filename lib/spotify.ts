export async function renovarAccessToken(refresh_token: string) {
  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
  const auth_header = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${auth_header}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refresh_token,
      }),
    });

    if (!response.ok) {
      console.error("Error al renovar el token:", await response.text());
      return null;
    }

    const data = await response.json();
    console.log("Access token renovado con éxito");
    console.log("Nuevos tokens:\n", data);

    return {
      ...data,
      refresh_token: data.refresh_token || refresh_token, // Mantén el refresh_token actual si no hay uno nuevo
    };
  } catch (error) {
    console.error("Error durante la renovación del access token:", error);
    return null;
  }
}
