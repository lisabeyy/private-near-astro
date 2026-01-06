"use client"

import { useEffect, useRef, useState } from "react"
import { Sparkles, Star } from "lucide-react"

interface GeneratingAnimationProps {
  name: string
}

export function GeneratingAnimation({ name }: GeneratingAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [step, setStep] = useState(0)
  const steps = [
    "Reading the stars...",
    "Calculating planetary positions...",
    "Analyzing your birth chart...",
    "Unveiling your destiny...",
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create many stars
    const stars: Array<{
      x: number
      y: number
      size: number
      opacity: number
      twinkleSpeed: number
    }> = []

    // Adjust star size based on screen size (smaller on mobile)
    const isMobile = window.innerWidth < 640
    const maxStarSize = isMobile ? 1.2 : 2
    const minStarSize = isMobile ? 0.3 : 0.5

    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * (maxStarSize - minStarSize) + minStarSize,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
      })
    }

    // Create constellation connections
    const connections: Array<[number, number]> = []
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const dx = stars[i].x - stars[j].x
        const dy = stars[i].y - stars[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < 150 && Math.random() > 0.98) {
          connections.push([i, j])
        }
      }
    }

    let time = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections with pulsing effect
      connections.forEach(([i, j]) => {
        const pulse = Math.sin(time * 0.02) * 0.3 + 0.7
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * pulse})`
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.moveTo(stars[i].x, stars[i].y)
        ctx.lineTo(stars[j].x, stars[j].y)
        ctx.stroke()
      })

      // Draw stars with twinkling
      stars.forEach((star, index) => {
        star.opacity += Math.sin(time * star.twinkleSpeed + index) * 0.1
        star.opacity = Math.max(0.2, Math.min(1, star.opacity))

        // Glow effect - smaller on mobile
        const isMobile = canvas.width < 640
        const glowMultiplier = isMobile ? 3 : 5
        const gradient = ctx.createRadialGradient(
          star.x,
          star.y,
          0,
          star.x,
          star.y,
          star.size * glowMultiplier
        )
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity * 0.5})`)
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)")
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size * glowMultiplier, 0, Math.PI * 2)
        ctx.fill()

        // Star
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()
      })

      time += 1
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  // Rotate through steps
  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % steps.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [steps.length])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, #0a0a0a 0%, #000000 100%)" }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center space-y-8 px-4">
        {/* Animated constellation icon */}
        <div className="flex items-center justify-center">
          <Sparkles className="h-12 w-12 text-white animate-pulse" />
        </div>

        {/* Name display */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            {name}
          </h2>
          <div className="flex items-center justify-center gap-2 text-white/60">
            <Star className="h-4 w-4" />
            <span className="text-sm">Your reading is being prepared</span>
          </div>
        </div>

        {/* Step indicator */}
        <div className="text-center space-y-4">
          <p className="text-xl sm:text-2xl font-medium text-white/90 animate-fade-in">
            {steps[step]}
          </p>
          <div className="flex items-center justify-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-500 ${index === step
                  ? "w-8 bg-white"
                  : "w-1.5 bg-white/30"
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Spinning loader */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-2 border-white/20 rounded-full" />
          <div className="absolute inset-0 border-2 border-transparent border-t-white rounded-full animate-spin" />
        </div>
      </div>
    </div>
  )
}

