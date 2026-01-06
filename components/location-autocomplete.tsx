"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { MapPin, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Location {
  display_name: string
  lat: string
  lon: string
  place_id: number
}

interface LocationAutocompleteProps {
  value: string
  onChange: (location: string, coordinates?: { lat: number; lng: number }) => void
  placeholder?: string
  required?: boolean
  id?: string
  className?: string
  hasCoordinates?: boolean
}

export function LocationAutocomplete({
  value,
  onChange,
  placeholder = "Search for a location...",
  required = false,
  id,
  className,
  hasCoordinates = false,
}: LocationAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Location[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [hasValidSelection, setHasValidSelection] = useState(hasCoordinates)

  // Update hasValidSelection when hasCoordinates prop changes
  useEffect(() => {
    setHasValidSelection(hasCoordinates)
  }, [hasCoordinates])
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()
  const isSelectingRef = useRef(false)

  const searchLocations = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([])
      return
    }

    setIsLoading(true)

    try {
      // Check if Google Maps is available
      const googleMapsAvailable =
        typeof window !== "undefined" &&
        process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY &&
        (window as any).google?.maps?.places

      if (googleMapsAvailable) {
        // Use Google Maps Places API
        const service = new (window as any).google.maps.places.AutocompleteService()
        service.getPlacePredictions(
          {
            input: query,
            types: ["(cities)"],
          },
          (predictions: any[], status: string) => {
            if (status === "OK" && predictions) {
              setSuggestions(
                predictions.map((p) => ({
                  display_name: p.description,
                  place_id: p.place_id,
                  lat: "",
                  lon: "",
                }))
              )
            } else {
              setSuggestions([])
            }
            setIsLoading(false)
          }
        )
      } else {
        // Use our Next.js API route to proxy Nominatim requests (avoids CORS and rate limiting)
        const response = await fetch(`/api/location?q=${encodeURIComponent(query)}`)

        if (response.ok) {
          const data = await response.json()
          setSuggestions(data.locations || [])
        } else {
          setSuggestions([])
        }
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Error fetching locations:", error)
      setSuggestions([])
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value

    // If user is typing after a valid selection, clear coordinates
    if (hasValidSelection && query !== value) {
      setHasValidSelection(false)
      onChange(query, undefined)
    } else {
      // Just update the text value while typing
      onChange(query)
    }

    // Debounce search
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      if (query.length >= 2) {
        searchLocations(query)
      } else {
        setSuggestions([])
      }
    }, 300)

    setShowSuggestions(true)
    setSelectedIndex(-1)
  }

  const handleSelectLocation = async (location: Location) => {
    isSelectingRef.current = true
    let coordinates: { lat: number; lng: number } | undefined

    const googleMapsAvailable =
      typeof window !== "undefined" &&
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY &&
      (window as any).google?.maps?.places

    if (googleMapsAvailable && location.place_id) {
      // Get details from Google Places API
      const service = new (window as any).google.maps.places.PlacesService(
        document.createElement("div")
      )
      service.getDetails(
        { placeId: location.place_id, fields: ["geometry", "formatted_address"] },
        (place: any, status: string) => {
          if (status === "OK" && place && place.geometry) {
            coordinates = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            }
            onChange(place.formatted_address || location.display_name, coordinates)
            setHasValidSelection(true)
          } else {
            onChange("", undefined)
            setHasValidSelection(false)
          }
          isSelectingRef.current = false
          setShowSuggestions(false)
          setSuggestions([])
        }
      )
    } else {
      // OpenStreetMap already has coordinates
      if (location.lat && location.lon) {
        coordinates = {
          lat: parseFloat(location.lat),
          lng: parseFloat(location.lon),
        }
        onChange(location.display_name, coordinates)
        setHasValidSelection(true)
        isSelectingRef.current = false
        setShowSuggestions(false)
        setSuggestions([])
      } else {
        // If no coordinates, don't set selection
        onChange("", undefined)
        setHasValidSelection(false)
        isSelectingRef.current = false
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault()
      handleSelectLocation(suggestions[selectedIndex])
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
    }
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        // Only close if we're not currently selecting
        if (!isSelectingRef.current) {
          setShowSuggestions(false)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
        <Input
          ref={inputRef}
          id={id}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => value.length >= 2 && setShowSuggestions(true)}
          onBlur={(e) => {
            // If user clicks away without selecting from list, clear if no coordinates
            // But don't clear if we're currently selecting a suggestion
            setTimeout(() => {
              if (!isSelectingRef.current && !hasValidSelection && value) {
                onChange("", undefined)
              }
            }, 200)
          }}
          placeholder={placeholder}
          required={required}
          className={cn("pl-10", className)}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-white/40" />
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 mt-1 w-full rounded-md border border-white/20 bg-black/95 backdrop-blur-sm shadow-lg"
          onMouseDown={(e) => {
            // Prevent input blur when clicking on suggestions
            e.preventDefault()
          }}
        >
          <div className="max-h-60 overflow-auto p-1">
            {suggestions.map((location, index) => (
              <button
                key={location.place_id}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault()
                  isSelectingRef.current = true
                  handleSelectLocation(location)
                }}
                className={cn(
                  "w-full rounded-sm px-3 py-2 text-left text-sm transition-colors text-white hover:bg-white/10",
                  selectedIndex === index && "bg-white/10"
                )}
              >
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-white/60" />
                  <span className="flex-1">{location.display_name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

