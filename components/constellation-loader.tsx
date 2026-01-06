"use client"

import { useEffect, useRef } from "react"

export function ConstellationLoader() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Responsive canvas size
    const isMobile = window.innerWidth < 640
    const size = isMobile ? 300 : 400
    canvas.width = size
    canvas.height = size

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const scale = size / 400 // Scale factor for responsive sizing

    // Create constellation pattern (scaled based on canvas size)
    const points = [
      { x: centerX, y: centerY - 80 * scale, size: 3 },
      { x: centerX - 60 * scale, y: centerY - 40 * scale, size: 2 },
      { x: centerX + 60 * scale, y: centerY - 40 * scale, size: 2 },
      { x: centerX - 100 * scale, y: centerY + 20 * scale, size: 2.5 },
      { x: centerX + 100 * scale, y: centerY + 20 * scale, size: 2.5 },
      { x: centerX - 40 * scale, y: centerY + 60 * scale, size: 2 },
      { x: centerX + 40 * scale, y: centerY + 60 * scale, size: 2 },
      { x: centerX, y: centerY + 100 * scale, size: 3 },
    ]

    const connections = [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 4],
      [3, 5],
      [4, 6],
      [5, 7],
      [6, 7],
    ]

    let time = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
      ctx.lineWidth = 1
      connections.forEach(([i, j]) => {
        const opacity = 0.2 + Math.sin(time * 0.05 + i) * 0.3
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
        ctx.beginPath()
        ctx.moveTo(points[i].x, points[i].y)
        ctx.lineTo(points[j].x, points[j].y)
        ctx.stroke()
      })

      // Draw stars
      points.forEach((point, index) => {
        const opacity = 0.5 + Math.sin(time * 0.1 + index) * 0.5
        const size = point.size + Math.sin(time * 0.15 + index) * 0.5

        // Glow
        const gradient = ctx.createRadialGradient(
          point.x,
          point.y,
          0,
          point.x,
          point.y,
          size * 4
        )
        gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.4})`)
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)")
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(point.x, point.y, size * 4, 0, Math.PI * 2)
        ctx.fill()

        // Star
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
        ctx.beginPath()
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2)
        ctx.fill()
      })

      time += 1
      requestAnimationFrame(animate)
    }

    animate()
  }, [])

  return (
    <div className="flex items-center justify-center py-8 sm:py-12">
      <canvas ref={canvasRef} className="opacity-60 w-full max-w-[300px] sm:max-w-[400px] h-auto" />
    </div>
  )
}

