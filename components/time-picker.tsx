"use client"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface TimePickerProps {
  value: string
  onChange: (time: string) => void
  id?: string
  required?: boolean
  className?: string
}

export function TimePicker({
  value,
  onChange,
  id,
  required = false,
  className,
}: TimePickerProps) {
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value
    onChange(time)
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Input
        id={id}
        type="time"
        value={value}
        onChange={handleTimeChange}
        className="bg-white/5 border-white/20 text-white focus:border-white/40 h-12 sm:h-11 text-base sm:text-sm placeholder:text-white/40"
        step="60"
        required={required}
        placeholder="HH:MM"
      />
      <p className="text-xs text-white/50">
        Select time in 24-hour format (e.g., 14:30 for 2:30 PM)
      </p>
    </div>
  )
}
