import { NextRequest, NextResponse } from "next/server";

const mockData = {
  years: {
    "2020": 150,
    "2021": 200,
    "2022": 180,
    "2023": 220,
  },
  months: {
    "01": 20,
    "02": 15,
    "03": 25,
    "04": 18,
    "05": 22,
    "06": 30,
    "07": 28,
    "08": 19,
    "09": 21,
    "10": 17,
    "11": 23,
    "12": 24,
  },
  days: {
    "01": 2,
    "02": 1,
    "03": 3,
    "04": 0,
    "05": 2,
    "06": 1,
    "07": 4,
    "08": 2,
    "09": 1,
    "10": 3,
    "11": 2,
    "12": 1,
    "13": 3,
    "14": 2,
    "15": 1,
    "16": 0,
    "17": 2,
    "18": 3,
    "19": 1,
    "20": 2,
    "21": 3,
    "22": 1,
    "23": 2,
    "24": 0,
    "25": 3,
    "26": 1,
    "27": 2,
    "28": 3,
    "29": 1,
    "30": 2,
    "31": 3,
  },
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year");
  const month = searchParams.get("month");

  if (year && month) {
    return NextResponse.json(mockData.days);
  } else if (year) {
    return NextResponse.json(mockData.months);
  } else {
    return NextResponse.json(mockData.years);
  }
}
