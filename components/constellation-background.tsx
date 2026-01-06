"use client"

import { useEffect, useRef } from "react"

interface Star {
  x: number
  y: number
  size: number
  opacity: number
  twinkleSpeed: number
}

interface ConstellationBackgroundProps {
  animated?: boolean
  intensity?: "low" | "medium" | "high"
}

export function ConstellationBackground({
  animated = true,
  intensity = "medium",
}: ConstellationBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const starsRef = useRef<Star[]>([])

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

    // Star count based on intensity
    const starCounts = { low: 50, medium: 150, high: 300 }
    const starCount = starCounts[intensity]

    // Initialize stars
    starsRef.current = Array.from({ length: starCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.8 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.01,
    }))

    // Create constellation connections
    const connections: Array<[number, number]> = []
    const maxDistance = 150

    for (let i = 0; i < starsRef.current.length; i++) {
      for (let j = i + 1; j < starsRef.current.length; j++) {
        const dx = starsRef.current[i].x - starsRef.current[j].x
        const dy = starsRef.current[i].y - starsRef.current[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < maxDistance && Math.random() > 0.95) {
          connections.push([i, j])
        }
      }
    }

    let time = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
      ctx.lineWidth = 0.5
      connections.forEach(([i, j]) => {
        const star1 = starsRef.current[i]
        const star2 = starsRef.current[j]
        ctx.beginPath()
        ctx.moveTo(star1.x, star1.y)
        ctx.lineTo(star2.x, star2.y)
        ctx.stroke()
      })

      // Draw stars
      starsRef.current.forEach((star) => {
        if (animated) {
          star.opacity += Math.sin(time * star.twinkleSpeed) * 0.1
          star.opacity = Math.max(0.2, Math.min(1, star.opacity))
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()

        // Add glow effect
        const gradient = ctx.createRadialGradient(
          star.x,
          star.y,
          0,
          star.x,
          star.y,
          star.size * 3
        )
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity * 0.3})`)
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)")
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2)
        ctx.fill()
      })

      if (animated) {
        time += 0.5
        animationFrameRef.current = requestAnimationFrame(animate)
      }
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [animated, intensity])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ background: "radial-gradient(ellipse at top, #0a0a0a 0%, #000000 100%)" }}
    />
  )
}

