import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { GoogleMapsLoader } from "@/components/google-maps-loader"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Private 2026 Astrology Prediction",
  description: "Get your personalized astrology birth chart and 2026 forecast, processed privately in a TEE",
  icons: {
    icon: "/icon.svg",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GoogleMapsLoader />
        {children}
      </body>
    </html>
  )
}

