"use client"

import { useState, useRef, useEffect } from "react"
import { Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react"
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
import { cn } from "@/lib/utils"

interface DateTimePickerProps {
  value: { date: string; time: string }
  onChange: (date: string, time: string) => void
  id?: string
  required?: boolean
  className?: string
}

export function DateTimePicker({
  value,
  onChange,
  id,
  required = false,
  className,
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(value.date || "")
  const [selectedTime, setSelectedTime] = useState(value.time || "")
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
    if (value.date) {
      const date = new Date(value.date + "T00:00:00")
      setSelectedYear(date.getFullYear())
      setSelectedMonth(date.getMonth())
      setSelectedDay(date.getDate())
    }
  }, [value.date])

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

  // Handle time change
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value
    setSelectedTime(time)
  }

  // Apply selection
  const handleApply = () => {
    const dateStr = buildDateString()
    if (dateStr && selectedTime) {
      setSelectedDate(dateStr)
      onChange(dateStr, selectedTime)
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

  const displayValue =
    selectedDate && selectedTime
      ? `${formatDisplayDate(selectedDate)} at ${selectedTime}`
      : "Select date and time"

  return (
    <div className={cn("space-y-2", className)}>
      <div className="relative" ref={popoverRef}>
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full justify-start text-left font-normal bg-white/5 border-white/20 text-white hover:bg-white/10 h-10 sm:h-11",
            !selectedDate && !selectedTime && "text-white/40"
          )}
        >
          <Calendar className="mr-2 h-4 w-4" />
          <span className="flex-1 text-left">{displayValue}</span>
          <Clock className="ml-2 h-4 w-4" />
        </Button>

        {isOpen && (
          <div className="absolute z-50 mt-2 w-full sm:w-[420px] bg-black/95 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg p-4">
            {/* Step 1: Year Selection */}
            {selectedYear === null && (
              <div className="space-y-4">
                <Label className="text-white/90 text-sm font-semibold">
                  Select Year
                </Label>
                <div className="max-h-60 overflow-y-auto">
                  <div className="grid grid-cols-4 gap-2">
                    {years.map((year) => (
                      <button
                        key={year}
                        type="button"
                        onClick={() => handleYearSelect(year)}
                        className="h-10 rounded text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
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
                <div className="grid grid-cols-3 gap-2">
                  {months.map((month, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleMonthSelect(index)}
                      className="h-12 rounded text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
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
                <div className="grid grid-cols-7 gap-1">
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
                          "h-8 sm:h-10 rounded text-sm transition-colors",
                          isToday
                            ? "bg-white/20 text-white font-semibold"
                            : "text-white/80 hover:bg-white/10 hover:text-white"
                        )}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Step 4: Time Selection */}
            {selectedYear !== null &&
              selectedMonth !== null &&
              selectedDay !== null && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-white/90 text-sm font-semibold">
                      Select Time (24-hour format)
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
                    <div>
                      <Label className="text-white/70 text-xs mb-2 block">
                        Selected Date: {months[selectedMonth]} {selectedDay}, {selectedYear}
                      </Label>
                      <Input
                        type="time"
                        value={selectedTime}
                        onChange={handleTimeChange}
                        className="bg-white/5 border-white/20 text-white focus:border-white/40"
                        step="60"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-white/10">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                      className="flex-1 border-white/20 text-white hover:bg-white/10"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleApply}
                      disabled={!selectedTime}
                      className="flex-1 bg-white text-black hover:bg-white/90 disabled:opacity-50"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  )
}
