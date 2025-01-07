import { NextResponse } from "next/server";

export async function GET() {
  // Datos mock: minutos escuchados por hora del día
  const mockData = {
    "00:00": 15,
    "01:00": 10,
    "02:00": 5,
    "03:00": 0,
    "04:00": 0,
    "05:00": 0,
    "06:00": 20,
    "07:00": 25,
    "08:00": 30,
    "09:00": 35,
    "10:00": 40,
    "11:00": 45,
    "12:00": 50,
    "13:00": 40,
    "14:00": 35,
    "15:00": 30,
    "16:00": 25,
    "17:00": 20,
    "18:00": 15,
    "19:00": 10,
    "20:00": 20,
    "21:00": 30,
    "22:00": 40,
    "23:00": 50,
  };

  return NextResponse.json(mockData);
}
