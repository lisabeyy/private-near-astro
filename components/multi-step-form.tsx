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
import { Card, CardContent } from "@/components/ui/card"
import { DatePicker } from "@/components/date-picker"
import { TimePicker } from "@/components/time-picker"
import { LocationAutocomplete } from "@/components/location-autocomplete"
import { ChevronRight, ChevronLeft, Check, User, Calendar, MapPin, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface FormData {
  firstName: string
  surname: string
  birthDateTime: { date: string; time: string }
  location: string
  coordinates?: { lat: number; lng: number }
  gender: string
}

interface MultiStepFormProps {
  form: FormData
  setForm: (form: FormData) => void
  onSubmit: () => void
  onBack: () => void
}

const steps = [
  { id: 1, title: "Your Name", icon: User },
  { id: 2, title: "Date of Birth", icon: Calendar },
  { id: 3, title: "Birth Location", icon: MapPin },
  { id: 4, title: "Gender", icon: Users },
  { id: 5, title: "Review", icon: Check },
]

export function MultiStepForm({ form, setForm, onSubmit, onBack }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!form.firstName.trim()) {
        newErrors.firstName = "First name is required"
      }
      // Last name is optional
    } else if (step === 2) {
      if (!form.birthDateTime.date || !form.birthDateTime.time) {
        newErrors.birthDateTime = "Date and time of birth are required"
      }
    } else if (step === 3) {
      if (!form.location || !form.coordinates) {
        newErrors.location = "Please select your birth location from the suggestions"
      }
    } else if (step === 4) {
      if (!form.gender) {
        newErrors.gender = "Gender is required"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setErrors({})
    } else {
      onBack()
    }
  }

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      onSubmit()
    }
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Not set"
    const date = new Date(dateStr + "T00:00:00")
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6 flex flex-col min-h-0 sm:min-h-0">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => {
          const StepIcon = step.icon
          const isActive = currentStep === step.id
          const isCompleted = currentStep > step.id
          const isLast = index === steps.length - 1

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                    isCompleted
                      ? "bg-white text-black border-white"
                      : isActive
                        ? "bg-white/10 text-white border-white"
                        : "bg-white/5 text-white/40 border-white/20"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5 sm:h-6 sm:w-6" />
                  ) : (
                    <StepIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  )}
                </div>
                <span
                  className={cn(
                    "mt-2 text-xs sm:text-sm font-medium hidden sm:block",
                    isActive ? "text-white" : "text-white/40"
                  )}
                >
                  {step.title}
                </span>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "h-0.5 flex-1 mx-2 sm:mx-4 transition-all duration-300",
                    isCompleted ? "bg-white" : "bg-white/20"
                  )}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Step Content */}
      <Card className="bg-black/40 backdrop-blur-sm border-white/10 flex-1 flex flex-col relative overflow-visible">
        <CardContent className="p-6 sm:p-8 flex-1 flex flex-col relative overflow-visible">
          {/* Step 1: Name */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in flex-1">
              <div className="text-center mb-6">
                <h3 className="text-2xl sm:text-3xl font-bold mb-2">What&apos;s your name?</h3>
                <p className="text-white/60 text-sm sm:text-base">
                  Use the name you go by as your first name
                </p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white/90 text-sm sm:text-base">
                    First Name <span className="text-white/50">(Name you go by)</span>
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Enter your first name"
                    value={form.firstName}
                    onChange={(e) =>
                      setForm({ ...form, firstName: e.target.value })
                    }
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 h-12 sm:h-11 text-base sm:text-sm"
                    autoFocus
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-400">{errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="surname" className="text-white/90 text-sm sm:text-base">
                    Last Name <span className="text-white/50">(Optional - it&apos;s private)</span>
                  </Label>
                  <Input
                    id="surname"
                    type="text"
                    placeholder="Enter your last name (optional)"
                    value={form.surname}
                    onChange={(e) =>
                      setForm({ ...form, surname: e.target.value })
                    }
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 h-12 sm:h-11 text-base sm:text-sm"
                  />
                  {errors.surname && (
                    <p className="text-xs text-red-400">{errors.surname}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Date of Birth */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in flex-1">
              <div className="text-center mb-6">
                <h3 className="text-2xl sm:text-3xl font-bold mb-2">When were you born?</h3>
                <p className="text-white/60 text-sm sm:text-base">
                  Select your date and time of birth for accurate chart calculation
                </p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white/90 text-sm sm:text-base">
                    Date of Birth
                  </Label>
                  <DatePicker
                    value={form.birthDateTime.date}
                    onChange={(date) =>
                      setForm({
                        ...form,
                        birthDateTime: { ...form.birthDateTime, date },
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/90 text-sm sm:text-base">
                    Time of Birth <span className="text-white/50">(24-hour format)</span>
                  </Label>
                  <TimePicker
                    value={form.birthDateTime.time}
                    onChange={(time) =>
                      setForm({
                        ...form,
                        birthDateTime: { ...form.birthDateTime, time },
                      })
                    }
                    required
                  />
                </div>
                {errors.birthDateTime && (
                  <p className="text-xs text-red-400">{errors.birthDateTime}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in flex-1 relative">
              <div className="text-center mb-6">
                <h3 className="text-2xl sm:text-3xl font-bold mb-2">Where were you born?</h3>
                <p className="text-white/60 text-sm sm:text-base">
                  Search and select your birth location for precise coordinates
                </p>
              </div>
              <div className="space-y-4 relative z-50">
                <LocationAutocomplete
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
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 h-12 sm:h-11"
                />
                {form.coordinates && (
                  <p className="text-xs text-white/40">
                    Coordinates: {form.coordinates.lat.toFixed(4)},{" "}
                    {form.coordinates.lng.toFixed(4)}
                  </p>
                )}
                {errors.location && (
                  <p className="text-xs text-red-400">{errors.location}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Gender */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fade-in flex-1">
              <div className="text-center mb-6">
                <h3 className="text-2xl sm:text-3xl font-bold mb-2">How should we address you?</h3>
                <p className="text-white/60 text-sm sm:text-base">
                  We use this to personalize your reading with the correct pronouns
                </p>
              </div>
              <div className="space-y-4">
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
                  <SelectTrigger className="bg-white/5 border-white/20 text-white focus:border-white/40 h-12 sm:h-11 text-base sm:text-sm">
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/20">
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Non-binary">Non-binary</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {form.gender === "Non-binary" && (
                  <div className="bg-white/5 rounded-lg p-3 text-xs sm:text-sm text-white/70">
                    <p>
                      <strong>Note:</strong> We&apos;ll use &quot;they&quot; and &quot;their&quot; pronouns in your reading.
                    </p>
                  </div>
                )}
                {errors.gender && (
                  <p className="text-xs text-red-400">{errors.gender}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Summary */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fade-in flex-1">
              <div className="text-center mb-6">
                <h3 className="text-2xl sm:text-3xl font-bold mb-2">Review Your Information</h3>
                <p className="text-white/60 text-sm sm:text-base">
                  Please verify your details before generating your reading
                </p>
              </div>
              <div className="space-y-4 bg-white/5 rounded-lg p-4 sm:p-6">
                <div className="flex justify-between items-start py-3 border-b border-white/10">
                  <span className="text-white/60 text-sm sm:text-base">Name:</span>
                  <span className="text-white font-medium text-sm sm:text-base text-right">
                    {form.firstName} {form.surname}
                  </span>
                </div>
                <div className="flex justify-between items-start py-3 border-b border-white/10">
                  <span className="text-white/60 text-sm sm:text-base">Date of Birth:</span>
                  <span className="text-white font-medium text-sm sm:text-base text-right">
                    {formatDate(form.birthDateTime.date)} at {form.birthDateTime.time || "Not set"}
                  </span>
                </div>
                <div className="flex justify-between items-start py-3 border-b border-white/10">
                  <span className="text-white/60 text-sm sm:text-base">Birth Location:</span>
                  <span className="text-white font-medium text-sm sm:text-base text-right max-w-[60%]">
                    {form.location || "Not set"}
                  </span>
                </div>
                <div className="flex justify-between items-start py-3">
                  <span className="text-white/60 text-sm sm:text-base">Gender:</span>
                  <span className="text-white font-medium text-sm sm:text-base text-right">
                    {form.gender || "Not set"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-4 mt-auto pt-6 border-t border-white/10 sm:relative pb-4 sm:pb-0 -mx-6 sm:mx-0 px-6 sm:px-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="border-white/20 text-white hover:bg-white/10 h-12 sm:h-11"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              {currentStep === 1 ? "Back" : "Previous"}
            </Button>
            {currentStep < steps.length ? (
              <Button
                type="button"
                onClick={handleNext}
                className="bg-white text-black hover:bg-white/90 h-12 sm:h-11 px-6"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                className="bg-white text-black hover:bg-white/90 h-12 sm:h-11 px-6"
              >
                Generate Prediction
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

