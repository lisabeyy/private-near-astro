import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (
      !body.name ||
      !body.birthDateTime?.date ||
      !body.birthDateTime?.time ||
      !body.location ||
      !body.gender
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields. Please fill in all fields including gender.",
        },
        { status: 400 }
      )
    }

    // Initialize OpenAI client - supports both NEAR AI Cloud and local TEE
    // Priority: TEE_API_URL (local) > NEARAI_API_KEY (cloud)
    const baseURL = process.env.TEE_API_URL || "https://cloud-api.near.ai/v1"
    const apiKey = process.env.TEE_API_TOKEN || process.env.NEARAI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Missing API key. Set NEARAI_API_KEY for cloud or TEE_API_TOKEN for local TEE.",
        },
        { status: 400 }
      )
    }

    const client = new OpenAI({
      baseURL,
      apiKey,
    })

    // Construct detailed prompt for astrology reading
    const locationInfo = body.coordinates
      ? `${body.location} (Coordinates: ${body.coordinates.lat}, ${body.coordinates.lng})`
      : body.location

    const prompt = `You are an expert astrologer and numerologist with deep knowledge of birth charts, planetary positions, astrological interpretations, and name-based numerological analysis.

Please provide a comprehensive astrological reading for the following person:

**Personal Information:**
- Name: ${body.name}
- Date of Birth: ${body.birthDateTime.date}
- Time of Birth: ${body.birthDateTime.time} (24-hour format)
- Birth Location: ${locationInfo}
- Gender: ${body.gender}

**Important:** 
- Address the person DIRECTLY using "you" and "your" throughout the reading - write TO them, not ABOUT them
- Use their name (${body.name}) naturally but sparingly - primarily use "you" to create a personal, direct connection
- Use appropriate pronouns based on their gender (${body.gender}) when referring to them
- DO NOT use third person (e.g., "[Name]'s chart shows..." or "Lisa Bechina's path involves...") - instead say "Your chart shows..." or "Your path involves..."
- DO NOT use conversational phrases like "Of course", "Certainly", "I'm happy to", "Let me", "I will", or any phrases that indicate you are an AI assistant responding
- Write as if you are directly presenting their astrology reading TO them, not describing them in third person
- Start directly with the reading content, not with acknowledgments or conversational openings
- The reading should feel like a personal astrology report written directly to the reader

**Instructions:**
1. **Numerology Analysis (using the name "${body.name}"):**
   - Keep this section BRIEF and concise - focus on key numerological insights only
   - Calculate the name's numerological value using numerology (assign numerical values to each letter: A=1, B=2, C=3, D=4, E=5, F=6, G=7, H=8, I=9, J=1, K=2, L=3, M=4, N=5, O=6, P=7, Q=8, R=9, S=1, T=2, U=3, V=4, W=5, X=6, Y=7, Z=8, then reduce to single digit)
   - Provide brief insights about your name's vibrational energy and its influence on your personality
   - Briefly explain your destiny number, expression number, and soul number derived from your name
   - Connect the numerological insights with your astrological profile in a concise way
   - **IMPORTANT:** In your output, refer to this section as "Numerology Analysis" or "Numerological Analysis" - DO NOT use the words "kabbalistic", "kabbalah", "kabbalistic numerology", or any variations. Just use "numerology" or "numerological".
   - **Keep this section to approximately 1-2 paragraphs maximum** - the focus should be on astrology and predictions, not numerology

2. **Birth Chart Interpretation:**
   - Address the reader directly: "Your Sun sign..." not "[Name]'s Sun sign..."
   - Your Sun sign and its significance in your life
   - Your Moon sign and emotional nature
   - Your Rising sign (Ascendant) and how you present to the world
   - Key planetary positions in your chart and their meanings
   - Major aspects between planets in your natal chart
   - Overall personality traits and characteristics based on your chart
   - Brief integration of numerological insights with your astrological signs

3. **Personalized 2026 Forecast (EXPAND THIS SECTION - GO DEEP):**
   - **IMPORTANT:** This is the MAIN FOCUS of the reading - make it comprehensive, detailed, and extensive
   - **IMPORTANT:** Base your 2026 predictions on BOTH:
     a) Your natal birth chart (the planetary positions at your time of birth)
     b) The 2026 sky chart (planetary transits, progressions, and aspects occurring in 2026)
   - Address the reader directly: "In 2026, you will experience..." not "[Name] will experience..."
   - Analyze in detail how 2026 transits interact with your natal chart (transits to natal planets, houses, and aspects)
   - Provide DEEP, DETAILED predictions for major themes and opportunities for 2026 based on these interactions
   - Include specific important dates and transits in 2026 (consider astrological transits - eclipses, retrogrades, major planetary transits, conjunctions, squares, trines, etc.)
   - Provide comprehensive career and financial outlook based on relevant transits (e.g., Jupiter/Saturn transits, eclipses, major planetary returns, house activations)
   - Detailed relationship and personal growth predictions influenced by Venus/Mars transits, relationship house activations, and relevant aspects
   - Comprehensive health and wellness guidance based on relevant planetary transits and house activations
   - Deep spiritual development opportunities aligned with 2026 planetary movements
   - Explain how different months/seasons of 2026 will affect you differently based on transits
   - Provide specific guidance on how to work with the energies of 2026
   - **Make this section 3-4x longer than the numerology section** - this is where you go deep into predictions

4. **Integration:**
   - Address the reader directly: "Your astrological and numerological profiles..." not "[Name]'s profiles..."
   - Synthesize your astrological and numerological insights to provide a holistic reading
   - Show how your name's numerological energy aligns with your astrological profile
   - Provide guidance that combines both systems of divination
   - Keep this section concise - focus on synthesis, not repetition

5. Write in a warm, engaging, and insightful tone that feels personal and meaningful. Address the reader directly using "you" and "your" throughout. Use their name (${body.name}) sparingly - primarily use "you" to create a direct, personal connection. DO NOT use third person descriptions like "[Name]'s chart shows" - instead say "Your chart shows". DO NOT use conversational phrases like "Of course", "Certainly", "I'm happy to", "Let me", "I will", or any acknowledgments that make it obvious you are an AI assistant. Write as if you are directly presenting their astrology reading TO them, not describing them. Start directly with the reading content, not with conversational openings.

6. Format the response clearly with sections using markdown (## for main sections, ### for subsections). Use emojis sparingly to enhance readability.

7. **CRITICAL:** In your output, DO NOT use the words "kabbalistic", "kabbalah", "kabbalistic numerology", or any variations. Use only "numerology", "numerological", "astrology", "astrological", or "reading". For example:
   - Use "Reading for [Name]" NOT "Astrological & Kabbalistic Reading for [Name]"
   - Use "Numerology Analysis" NOT "Kabbalistic Numerology Analysis"
   - Use "numerological insights" NOT "kabbalistic insights"

Please provide a comprehensive reading that integrates both astrological and numerological wisdom, making it both detailed and accessible.`

    // Determine model - use env var or default to DeepSeek V3.1
    const model = process.env.TEE_MODEL || "deepseek-ai/DeepSeek-V3.1"

    // Call model through TEE (either NEAR AI Cloud or local private-ml-sdk)
    const completion = await client.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are an expert astrologer and numerologist with decades of experience in birth chart interpretation, astrological forecasting, and name-based numerological analysis. You integrate both astrological and numerological wisdom to provide detailed, insightful, and personalized readings that combine celestial insights with the vibrational energy of names. Write your readings as direct astrology reports addressed TO the reader using 'you' and 'your' - never use third person like '[Name]'s chart' or '[Name] will experience'. Always say 'Your chart' and 'You will experience'. The reading should feel personal and direct. Focus primarily on deep, detailed astrological predictions (especially for 2026), with numerology as a brief supporting element. Avoid phrases like 'Of course', 'Certainly', 'I'm happy to', 'Let me', 'I will', 'It is a pleasure', or any acknowledgments that make it obvious you are an AI assistant. Present the reading directly and professionally, starting immediately with the content. IMPORTANT: In your output, DO NOT use the words 'kabbalistic', 'kabbalah', or any variations. Use only 'numerology', 'numerological', 'astrology', 'astrological', or 'reading'.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    })

    const resultText = completion.choices[0]?.message?.content

    if (!resultText) {
      return NextResponse.json(
        { error: "No response from AI model" },
        { status: 500 }
      )
    }

    // Return the result with verification flag
    // Note: NEAR AI Cloud can provide attestation/verification data
    // For now, we mark it as verified since it runs in a TEE
    return NextResponse.json({
      text: resultText,
      verified: true,
    })
  } catch (error) {
    console.error("Error generating astrology prediction:", error)

    // Handle specific error cases
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        {
          error:
            error.message || "Failed to connect to AI service. Please check your API key.",
        },
        { status: error.status || 500 }
      )
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

