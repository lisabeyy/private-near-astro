"use client"

import { useState, useRef, useEffect } from "react"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  value: string
  onChange: (date: string) => void
  id?: string
  required?: boolean
  className?: string
}

export function DatePicker({
  value,
  onChange,
  id,
  required = false,
  className,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  const today = new Date()
  const currentYear = today.getFullYear()
  const minYear = 1900
  const maxYear = currentYear

  // Initialize from existing value
  useEffect(() => {
    if (value) {
      const date = new Date(value + "T00:00:00")
      setSelectedYear(date.getFullYear())
      setSelectedMonth(date.getMonth())
      setSelectedDay(date.getDate())
    }
  }, [value])

  // Format date for display
  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return ""
    const date = new Date(dateStr + "T00:00:00")
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // Handle year selection
  const handleYearSelect = (year: number) => {
    setSelectedYear(year)
    if (selectedMonth !== null) {
      const maxDay = getDaysInMonth(year, selectedMonth)
      if (selectedDay && selectedDay > maxDay) {
        setSelectedDay(null)
      }
    }
  }

  // Handle month selection
  const handleMonthSelect = (month: number) => {
    setSelectedMonth(month)
    if (selectedYear !== null) {
      const maxDay = getDaysInMonth(selectedYear, month)
      if (selectedDay && selectedDay > maxDay) {
        setSelectedDay(null)
      }
    }
  }

  // Handle day selection
  const handleDaySelect = (day: number) => {
    setSelectedDay(day)
  }

  // Build date string
  const buildDateString = () => {
    if (selectedYear && selectedMonth !== null && selectedDay) {
      const month = selectedMonth + 1 // JavaScript months are 0-indexed
      const dateStr = `${selectedYear}-${String(month).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`
      return dateStr
    }
    return ""
  }

  // Apply selection
  const handleApply = () => {
    const dateStr = buildDateString()
    if (dateStr) {
      onChange(dateStr)
      setIsOpen(false)
    }
  }

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Generate year options
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i)

  // Month names
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  // Get days for selected month/year
  const getAvailableDays = () => {
    if (selectedYear && selectedMonth !== null) {
      const daysInMonth = getDaysInMonth(selectedYear, selectedMonth)
      return Array.from({ length: daysInMonth }, (_, i) => i + 1)
    }
    return []
  }

  const displayValue = value ? formatDisplayDate(value) : "Select date"

  return (
    <div className={cn("space-y-2 relative z-[100]", className)}>
      <div className="relative" ref={popoverRef}>
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full justify-start text-left font-normal bg-white/5 border-white/20 text-white hover:bg-white/10 h-10 sm:h-11 touch-manipulation px-3",
            !value && "text-white/40"
          )}
        >
          <Calendar className="mr-2 h-4 w-4" />
          <span className="flex-1 text-left">{displayValue}</span>
        </Button>

        {isOpen && (
          <>
            {/* Mobile backdrop */}
            <div
              className="fixed inset-0 bg-black/50 z-[100] sm:hidden"
              onClick={() => setIsOpen(false)}
            />
            <div className="fixed sm:absolute inset-x-4 sm:inset-x-auto top-1/2 sm:top-auto sm:mt-2 left-0 sm:left-auto -translate-y-1/2 sm:translate-y-0 z-[101] w-auto sm:w-[420px] max-w-[calc(100vw-2rem)] sm:max-w-none bg-black/95 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg p-4 sm:p-4 max-h-[90vh] overflow-y-auto">
              {/* Step 1: Year Selection */}
              {selectedYear === null && (
                <div className="space-y-4">
                  <Label className="text-white/90 text-sm font-semibold">
                    Select Year
                  </Label>
                  <div className="max-h-[50vh] sm:max-h-60 overflow-y-auto">
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-2">
                      {years.map((year) => (
                        <button
                          key={year}
                          type="button"
                          onClick={() => handleYearSelect(year)}
                          className="h-12 sm:h-10 rounded text-sm text-white/80 hover:bg-white/10 hover:text-white active:bg-white/20 transition-colors touch-manipulation"
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Month Selection */}
              {selectedYear !== null && selectedMonth === null && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-white/90 text-sm font-semibold">
                      Select Month
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedYear(null)}
                      className="text-white/60 hover:text-white h-8"
                    >
                      ← Back
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {months.map((month, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleMonthSelect(index)}
                        className="h-12 sm:h-12 rounded text-sm text-white/80 hover:bg-white/10 hover:text-white active:bg-white/20 transition-colors touch-manipulation"
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Day Selection */}
              {selectedYear !== null && selectedMonth !== null && selectedDay === null && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-white/90 text-sm font-semibold">
                      Select Day
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedMonth(null)}
                      className="text-white/60 hover:text-white h-8"
                    >
                      ← Back
                    </Button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 sm:gap-1">
                    {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                      <div
                        key={i}
                        className="text-center text-xs text-white/60 py-2"
                      >
                        {day}
                      </div>
                    ))}
                    {getAvailableDays().map((day) => {
                      const isToday =
                        selectedYear === currentYear &&
                        selectedMonth === today.getMonth() &&
                        day === today.getDate()
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleDaySelect(day)}
                          className={cn(
                            "h-10 sm:h-10 rounded text-sm transition-colors touch-manipulation",
                            isToday
                              ? "bg-white/20 text-white font-semibold"
                              : "text-white/80 hover:bg-white/10 hover:text-white active:bg-white/20"
                          )}
                        >
                          {day}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Step 4: Confirm */}
              {selectedYear !== null &&
                selectedMonth !== null &&
                selectedDay !== null && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-white/90 text-sm font-semibold">
                        Selected Date
                      </Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedDay(null)}
                        className="text-white/60 hover:text-white h-8"
                      >
                        ← Back
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-white/5 rounded-lg p-4 text-center">
                        <p className="text-white/70 text-sm mb-1">
                          {months[selectedMonth]} {selectedDay}, {selectedYear}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-white/10">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        className="flex-1 border-white/20 text-white hover:bg-white/10 h-12 sm:h-10 touch-manipulation"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={handleApply}
                        className="flex-1 bg-white text-black hover:bg-white/90 h-12 sm:h-10 touch-manipulation"
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

