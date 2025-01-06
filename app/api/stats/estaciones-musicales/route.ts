import { NextResponse } from "next/server";

export async function GET() {
  // Datos mock para las estaciones musicales
  const mockData = {
    estaciones: {
      invierno: {
        track: "Let It Snow",
        artist: "Dean Martin",
        genre: "Jazz",
      },
      primavera: {
        track: "Here Comes the Sun",
        artist: "The Beatles",
        genre: "Rock",
      },
      verano: {
        track: "Summertime Sadness",
        artist: "Lana Del Rey",
        genre: "Pop",
      },
      otoño: {
        track: "Autumn Leaves",
        artist: "Nat King Cole",
        genre: "Blues",
      },
    },
  };

  return NextResponse.json(mockData);
}
