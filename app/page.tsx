"use client"

import { useState, useEffect } from "react"
import { useAstroStore } from "@/store/astro-store"
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
import { HeroStars } from "@/components/hero-stars"
import { MultiStepForm } from "@/components/multi-step-form"

interface FormData {
  firstName: string
  surname: string
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
  const { result, setResult, setFormData, clearStore } = useAstroStore()
  const [showForm, setShowForm] = useState(false)
  const [showLearnMore, setShowLearnMore] = useState(false)
  const [form, setForm] = useState<FormData>({
    firstName: "",
    surname: "",
    birthDateTime: { date: "", time: "" },
    location: "",
    coordinates: undefined,
    gender: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Prevent body scroll on mobile when form is open
  useEffect(() => {
    if (showForm || loading) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [showForm, loading])

  const handleSubmit = async () => {
    // Combine firstName and surname for API (surname is optional)
    const name = form.surname.trim()
      ? `${form.firstName} ${form.surname}`.trim()
      : form.firstName.trim()

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch("/api/astro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          name, // Send combined name to API
        }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to generate prediction")
      }

      const data = await res.json()
      const astroResult = {
        text: data.text,
        verified: data.verified ?? true,
      }
      setResult(astroResult)
      setFormData(form)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden" data-form-open={showForm || loading}>
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
        <main className="flex-1 container mx-auto px-1 sm:px-6 py-8 sm:py-12 pb-20 sm:pb-24 max-w-4xl relative">
          {!showForm && !result && <HeroStars />}
          {!showForm && !result && (
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center animate-fade-in relative z-10">
              <div className="mb-6 sm:mb-8 px-4">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 tracking-tight">
                  Discover Your
                  <br />
                  <span className="text-white/60">2026 Destiny</span>
                </h1>
                <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed mb-4 sm:mb-6">
                  Unlock your free personalized astrology reading </p>
                <div className="max-w-xl mx-auto bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3 sm:p-4 text-left">
                  <p className="text-sm text-white/70 leading-relaxed">
                    <Shield className="inline h-3 w-3 sm:h-4 sm:w-4 mr-2 mb-1" />
                    <strong className="text-white">Complete Privacy:</strong> Your birth
                    information is processed securely and is never stored, logged, or accessible to anyone—not even us. Your
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
            <GeneratingAnimation name={form.firstName || "Friend"} />
          )}

          {/* Multi-Step Form */}
          {showForm && !result && !loading && (
            <div className="fixed inset-0 sm:relative sm:inset-auto bg-black z-50 sm:z-10 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto px-4 sm:px-4 py-4 sm:py-8">
                <div className="max-w-3xl mx-auto">
                  {error && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-3 sm:p-4">
                      <p className="text-red-400 text-sm sm:text-base">{error}</p>
                    </div>
                  )}

                  <MultiStepForm
                    form={form}
                    setForm={setForm}
                    onSubmit={handleSubmit}
                    onBack={() => setShowForm(false)}
                  />
                </div>
              </div>
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
                          Your birth information was encrypted, processed by AI, and then
                          completely deleted. Nothing was stored, logged, or saved. Not
                          even we can see what you entered after your reading is complete.
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      clearStore()
                      setShowForm(false)
                      setForm({
                        firstName: "",
                        surname: "",
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
