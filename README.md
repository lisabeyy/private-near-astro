# Private 2026 Astrology Prediction App

A privacy-preserving astrology prediction web application that generates personalized birth chart interpretations and 2026 forecasts using NEAR AI Cloud's private inference API with DeepSeek V3.1 model running in a Trusted Execution Environment (TEE).

## ✨ Features

- **🔒 Privacy-First**: All AI computations run in a hardware-isolated TEE
- **🪐 Comprehensive Readings**: Detailed birth chart interpretation and 2026 forecast
- **🛡️ No Data Storage**: User data is never stored or logged
- **✨ Beautiful UI**: Modern interface built with Next.js, Tailwind CSS, and shadcn/ui
- **🔐 TEE Verification**: Cryptographic proof that computation ran in a secure TEE

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm (or npm/yarn)
- A NEAR AI Cloud API key ([Get one here](https://cloud.near.ai))

### Installation

1. **Install dependencies:**

```bash
pnpm install
```

2. **Set up environment variables:**

Copy `env.example` to `.env.local` and add your API key:

```bash
cp env.example .env.local
```

Edit `.env.local`:
```
NEARAI_API_KEY=your_actual_api_key_here
```

3. **Run the development server:**

```bash
pnpm dev
```

4. **Open your browser:**

Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **AI**: NEAR AI Cloud API with DeepSeek V3.1 model
- **Language**: TypeScript

## 🔒 Privacy & Security

This application uses NEAR AI Cloud's private inference API, which ensures:

- **Hardware Isolation**: All computations run in a Trusted Execution Environment (TEE)
- **Encrypted Processing**: Data is encrypted and isolated from cloud providers and model owners
- **No Data Storage**: User inputs are never stored or logged
- **Verifiable Execution**: Cryptographic attestation proves computation ran in a TEE

## 📝 Usage

1. Enter your birth information:
   - Name
   - Date of birth
   - Time of birth
   - Birth location (city, country)
   - Gender (optional)

2. Click "Generate Prediction"

3. Receive your personalized:
   - Birth chart interpretation
   - 2026 astrological forecast

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add your `NEARAI_API_KEY` in Vercel's environment variables
4. Deploy!

The app will be live and ready to use.

## 🧠 How It Works

1. User submits birth information through the form
2. Next.js API route receives the data
3. API calls TEE endpoint (NEAR AI Cloud or local private-ml-sdk)
4. AI model processes the request inside a Trusted Execution Environment
5. AI generates the astrology reading
6. Result is returned to the user (no data is stored)
7. Cryptographic attestation verifies the computation ran in a TEE

## 📚 API Reference

### POST `/api/astro`

Generates an astrology prediction.

**Request Body:**
```json
{
  "name": "John Doe",
  "dob": "1990-01-15",
  "birthTime": "14:30",
  "location": "New York, USA",
  "gender": "Male"
}
```

**Response:**
```json
{
  "text": "Your detailed astrology reading...",
  "verified": true
}
```

## 🔧 Configuration

The app supports two TEE options:

### Option 1: NEAR AI Cloud (Recommended - Default)
- Base URL: `https://cloud-api.near.ai/v1`
- Model: `deepseek-ai/DeepSeek-V3.1`
- Set `NEARAI_API_KEY` in `.env.local`

### Option 2: Local TEE (Self-Hosted)
If you have TEE hardware and want to use `private-ml-sdk`:
- Set `TEE_API_URL` (e.g., `http://localhost:8000/v1`)
- Set `TEE_API_TOKEN` (your local TEE auth token)
- Optionally set `TEE_MODEL` (defaults to DeepSeek if not set)

See [TEE_SETUP.md](./TEE_SETUP.md) for detailed comparison and setup instructions.

## 📄 License

This project is open source and available for personal use.

## 🙏 Acknowledgments

- Built with [NEAR AI Cloud](https://cloud.near.ai) for private AI inference
- Uses [DeepSeek V3.1](https://www.deepseek.com) model
- UI components from [shadcn/ui](https://ui.shadcn.com)

---

**Note**: Make sure to keep your `.env.local` file secure and never commit it to version control.

