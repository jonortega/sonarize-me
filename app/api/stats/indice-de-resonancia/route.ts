import { NextResponse } from "next/server";

export async function GET() {
  // Generar datos mock
  const mockData = {
    normal: Math.floor(Math.random() * 101), // Popularidad media de 0 a 100
    actual: Math.floor(Math.random() * 101), // Popularidad media de 0 a 100
  };

  // Devolver respuesta JSON
  return NextResponse.json(mockData);
}
