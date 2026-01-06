import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q")

    if (!query || query.length < 2) {
      return NextResponse.json(
        { error: "Query is required and must be at least 2 characters" },
        { status: 400 }
      )
    }

    // Use OpenStreetMap Nominatim API (free, no API key needed)
    // We proxy through Next.js API to avoid CORS issues and rate limiting
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&limit=5&addressdetails=1`,
      {
        headers: {
          "User-Agent": "PrivateAstrologyApp/1.0 (contact@example.com)", // Required by Nominatim
          "Accept-Language": "en",
        },
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch locations" },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Transform the data to match our interface
    const locations = data.map((item: any) => ({
      display_name: item.display_name,
      lat: item.lat,
      lon: item.lon,
      place_id: item.place_id,
    }))

    return NextResponse.json({ locations })
  } catch (error) {
    console.error("Error fetching locations:", error)
    return NextResponse.json(
      { error: "Failed to fetch locations" },
      { status: 500 }
    )
  }
}

