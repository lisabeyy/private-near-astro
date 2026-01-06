"use client"

import { useEffect } from "react"

export function GoogleMapsLoader() {
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) return

    // Check if script is already loaded
    if ((window as any).google?.maps?.places) {
      return
    }

    // Check if script tag already exists
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com"]'
    )
    if (existingScript) {
      return
    }

    // Load Google Maps script
    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.defer = true
    document.head.appendChild(script)
  }, [])

  return null
}

