import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q") || searchParams.get("query")

    if (!query || query.length < 2) {
      return NextResponse.json(
        { error: "Query is required and must be at least 2 characters" },
        { status: 400 }
      )
    }

    // Check if Google Maps API key is available
    const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

    if (googleMapsApiKey) {
      // Use Google Maps Places API (better results, higher rate limits)
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
            query
          )}&types=(cities)&key=${googleMapsApiKey}`
        )

        if (!response.ok) {
          throw new Error(`Google Maps API error: ${response.statusText}`)
        }

        const data = await response.json()

        if (data.status === "OK" && data.predictions) {
          // Fetch place details to get coordinates
          const locations = await Promise.all(
            data.predictions.slice(0, 5).map(async (prediction: any) => {
              try {
                const detailsResponse = await fetch(
                  `https://maps.googleapis.com/maps/api/place/details/json?place_id=${prediction.place_id}&fields=geometry,name,formatted_address&key=${googleMapsApiKey}`
                )
                const detailsData = await detailsResponse.json()

                if (detailsData.status === "OK" && detailsData.result) {
                  return {
                    display_name: detailsData.result.formatted_address || prediction.description,
                    lat: detailsData.result.geometry?.location?.lat?.toString() || "",
                    lon: detailsData.result.geometry?.location?.lng?.toString() || "",
                    place_id: prediction.place_id,
                  }
                }
                return {
                  display_name: prediction.description,
                  lat: "",
                  lon: "",
                  place_id: prediction.place_id,
                }
              } catch (err) {
                return {
                  display_name: prediction.description,
                  lat: "",
                  lon: "",
                  place_id: prediction.place_id,
                }
              }
            })
          )

          return NextResponse.json({ locations })
        }

        // If Google Maps fails, fall through to Nominatim
      } catch (googleError) {
        console.error("Google Maps API error:", googleError)
        // Fall through to Nominatim
      }
    }

    // Use OpenStreetMap Nominatim API (free, no API key needed)
    // Note: Nominatim has strict rate limits (1 request per second)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&limit=5&addressdetails=1`,
      {
        headers: {
          "User-Agent": "PrivateAstrologyApp/1.0", // Required by Nominatim
          "Accept-Language": "en",
          "Referer": request.headers.get("referer") || "https://localhost:3000",
        },
        // Add a small delay to respect rate limits
        next: { revalidate: 0 },
      }
    )

    if (!response.ok) {
      console.error(`Nominatim API error: ${response.status} ${response.statusText}`)
      return NextResponse.json(
        { 
          error: "Failed to fetch locations. Please try again in a moment.",
          details: response.status === 429 ? "Rate limit exceeded. Consider using Google Maps API key for better performance." : "Service temporarily unavailable"
        },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Transform the data to match our interface
    const locations = data.map((item: any) => ({
      display_name: item.display_name,
      lat: item.lat,
      lon: item.lon,
      place_id: item.place_id || item.osm_id?.toString() || "",
    }))

    return NextResponse.json({ locations })
  } catch (error) {
    console.error("Error fetching locations:", error)
    return NextResponse.json(
      { 
        error: "Failed to fetch locations",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

