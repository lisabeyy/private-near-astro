"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Shield, Sparkles, Loader2, ArrowRight, Star, Github } from "lucide-react"
import { LocationAutocomplete } from "@/components/location-autocomplete"
import { ConstellationBackground } from "@/components/constellation-background"
import { ConstellationLoader } from "@/components/constellation-loader"
import { LearnMoreModal } from "@/components/learn-more-modal"
import { MarkdownContent } from "@/components/markdown-content"
import { GeneratingAnimation } from "@/components/generating-animation"
import { DateTimePicker } from "@/components/datetime-picker"

interface FormData {
  name: string
  birthDateTime: { date: string; time: string }
  location: string
  coordinates?: { lat: number; lng: number }
  gender: string
}

interface AstroResult {
  text: string
  verified?: boolean
}

export default function Home() {
  const [showForm, setShowForm] = useState(false)
  const [showLearnMore, setShowLearnMore] = useState(false)
  const [form, setForm] = useState<FormData>({
    name: "",
    birthDateTime: { date: "", time: "" },
    location: "",
    coordinates: undefined,
    gender: "",
  })
  const [result, setResult] = useState<AstroResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!form.name) {
      setError("Please enter your name")
      return
    }
    if (!form.birthDateTime.date || !form.birthDateTime.time) {
      setError("Please select your date and time of birth")
      return
    }
    if (!form.location || !form.coordinates) {
      setError("Please select your birth location from the suggestions")
      return
    }
    if (!form.gender) {
      setError("Please select your gender")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch("/api/astro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to generate prediction")
      }

      const data = await res.json()
      setResult({
        text: data.text,
        verified: data.verified ?? true,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <ConstellationBackground animated={!loading} intensity="medium" />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navigation */}
        <nav className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="text-xs sm:text-sm font-medium">Astro 2026</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-white/60">
            <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Your data is never stored</span>
            <span className="sm:hidden">Private</span>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-20 sm:pb-24 max-w-4xl">
          {!showForm && !result && (
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center animate-fade-in">
              <div className="mb-6 sm:mb-8 px-4">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 tracking-tight">
                  Discover Your
                  <br />
                  <span className="text-white/60">2026 Destiny</span>
                </h1>
                <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed mb-4 sm:mb-6">
                  Unlock your free personalized astrology reading and discover what the stars have in store for 2026
                </p>
                <div className="max-w-xl mx-auto bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3 sm:p-4 text-left">
                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                    <Shield className="inline h-3 w-3 sm:h-4 sm:w-4 mr-2 mb-1" />
                    <strong className="text-white">Complete Privacy:</strong> Your birth
                    information is processed in a secure, isolated environment (TEE) and
                    is never stored, logged, or accessible to anyone—not even us. Your
                    data disappears after your reading is generated.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 sm:mt-12 w-full sm:w-auto px-4">
                <Button
                  onClick={() => setShowForm(true)}
                  size="lg"
                  className="bg-white text-black hover:bg-white/90 h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-medium group w-full sm:w-auto"
                >
                  Start Prediction
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  onClick={() => setShowLearnMore(true)}
                  variant="outline"
                  size="lg"
                  className="border-white/20 text-white hover:bg-white/10 h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-medium w-full sm:w-auto"
                >
                  Learn More
                </Button>
              </div>

            </div>
          )}

          {/* Loading Animation - Full Screen */}
          {loading && (
            <GeneratingAnimation name={form.name || "Friend"} />
          )}

          {/* Form */}
          {showForm && !result && !loading && (
            <div className="max-w-2xl mx-auto animate-slide-up px-4">
              <div className="mb-6 sm:mb-8">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowForm(false)}
                  className="mb-4 text-white/60 hover:text-white hover:bg-white/10"
                >
                  ← Back
                </Button>
                <div className="text-center">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-3">Your Birth Information</h2>
                  <p className="text-sm sm:text-base text-white/60">
                    Enter your details to unlock your personalized astrology reading
                  </p>
                </div>
              </div>

              <Card className="bg-black/40 backdrop-blur-sm border-white/10">
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white/90 text-sm sm:text-base">
                        Name
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        required
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 h-10 sm:h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white/90 text-sm sm:text-base">
                        Date & Time of Birth
                      </Label>
                      <DateTimePicker
                        value={form.birthDateTime}
                        onChange={(date, time) =>
                          setForm({
                            ...form,
                            birthDateTime: { date, time },
                          })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-white/90 text-sm sm:text-base">
                        Birth Location
                      </Label>
                      <LocationAutocomplete
                        id="location"
                        value={form.location}
                        onChange={(location, coordinates) => {
                          setForm({
                            ...form,
                            location,
                            coordinates,
                          })
                        }}
                        placeholder="Search and select your birth location..."
                        required
                        hasCoordinates={!!form.coordinates}
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 h-10 sm:h-11"
                      />
                      {form.coordinates ? (
                        <p className="text-xs text-white/40">
                          Coordinates: {form.coordinates.lat.toFixed(4)},{" "}
                          {form.coordinates.lng.toFixed(4)}
                        </p>
                      ) : null}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender" className="text-white/90 text-sm sm:text-base">
                        Gender <span className="text-white/50">(Required)</span>
                      </Label>
                      <Select
                        value={form.gender || undefined}
                        onValueChange={(value) => {
                          setForm({
                            ...form,
                            gender: value,
                          })
                        }}
                        required
                      >
                        <SelectTrigger
                          id="gender"
                          className="bg-white/5 border-white/20 text-white focus:border-white/40 h-10 sm:h-11"
                        >
                          <SelectValue placeholder="Select your gender" />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-white/20">
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Non-binary">Non-binary</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-white text-black hover:bg-white/90 h-11 sm:h-12 text-sm sm:text-base font-medium mt-6 sm:mt-8"
                    >
                      <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-xs sm:text-base">Generate Prediction</span>
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}


          {/* Error Display */}
          {error && (
            <div className="max-w-2xl mx-auto animate-slide-up px-4">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
                  <p className="text-white/70 text-sm sm:text-base">{error}</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Result Display */}
          {result && (
            <div className="max-w-3xl mx-auto animate-slide-up px-4">
              <Card className="bg-black/40 backdrop-blur-sm border-white/10">
                <CardHeader className="pb-4 px-4 sm:px-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <CardTitle className="text-2xl sm:text-3xl font-bold">
                      Your 2026 Astrology Prediction
                    </CardTitle>
                    {result.verified && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-white/60" />
                        <span className="text-white/60 font-medium">
                          TEE Verified
                        </span>
                      </div>
                    )}
                  </div>
                  <CardDescription className="text-white/60 text-sm sm:text-base">
                    Your personalized birth chart interpretation and 2026 forecast
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 pb-6">
                  <div className="astro-reading">
                    <MarkdownContent content={result.text} />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 pt-6 border-t border-white/10 px-4 sm:px-6 pb-6">
                  <div className="bg-white/5 rounded-lg p-3 sm:p-4 space-y-2">
                    <div className="flex items-start gap-2">
                      <Shield className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5 text-white/60 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm font-medium text-white/90 mb-1">
                          Your Privacy is Protected
                        </p>
                        <p className="text-xs text-white/60 leading-relaxed">
                          This reading was processed in a Trusted Execution Environment
                          (TEE)—a secure, isolated zone that even we can&apos;t access. Your
                          birth information was encrypted, processed by AI, and then
                          completely deleted. Nothing was stored, logged, or saved. Not
                          even we can see what you entered after your reading is complete.
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      setResult(null)
                      setShowForm(false)
                      setForm({
                        name: "",
                        birthDateTime: { date: "", time: "" },
                        location: "",
                        coordinates: undefined,
                        gender: "",
                      })
                    }}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 w-full sm:w-auto h-10 sm:h-11 text-sm sm:text-base"
                  >
                    Start New Reading
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* Learn More Modal */}
      <LearnMoreModal open={showLearnMore} onOpenChange={setShowLearnMore} />

      {/* Footer - Fixed at bottom */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 py-4 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs text-white/30">
            <span>Built by</span>
            <div className="flex items-center gap-3">
              <a
                href="https://x.com/lisabeyy"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-white/30 hover:text-white/60 transition-colors"
              >
                <svg
                  className="h-3 w-3"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span>@lisabeyy</span>
              </a>
              <span className="text-white/20">•</span>
              <a
                href="https://github.com/lisabeyy/private-near-astro"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-white/30 hover:text-white/60 transition-colors"
              >
                <Github className="h-3 w-3" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
