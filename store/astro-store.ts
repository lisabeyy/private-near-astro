import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AstroResult {
  text: string
  verified?: boolean
}

interface FormData {
  firstName: string
  surname: string
  birthDateTime: { date: string; time: string }
  location: string
  coordinates?: { lat: number; lng: number }
  gender: string
}

interface AstroStore {
  result: AstroResult | null
  formData: FormData | null
  setResult: (result: AstroResult | null) => void
  setFormData: (formData: FormData | null) => void
  clearStore: () => void
}

export const useAstroStore = create<AstroStore>()(
  persist(
    (set) => ({
      result: null,
      formData: null,
      setResult: (result) => set({ result }),
      setFormData: (formData) => set({ formData }),
      clearStore: () => set({ result: null, formData: null }),
    }),
    {
      name: "astro-store", // localStorage key
    }
  )
)

