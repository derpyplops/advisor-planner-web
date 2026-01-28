# Advisor Planner - Financial Advisory Training Platform

A web application for financial advisors to analyze client meetings, generate summaries, and receive AI-powered feedback using Google Gemini 3 Flash.

## Features

1. **Meeting Analysis** - Analyze client meeting transcripts and generate WhatsApp-ready messages
2. **Client Summary** - Generate client-friendly summaries from meeting notes
3. **Scenario Planning** - Create three financial scenarios (Base, Conservative, Growth-Oriented)
4. **Product Recommendations** - Get AI-powered product recommendations with fit analysis
5. **Presentation Outline** - Generate structured presentation outlines
6. **Training Feedback** - Receive performance scores and coaching tips

## Tech Stack

- **Framework:** Next.js 15
- **Styling:** Tailwind CSS
- **AI:** Google Gemini 3 Flash (gemini-3-flash-preview)
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or pnpm package manager
- Google Gemini API key

### Installation

1. Clone or extract the project:
```bash
cd advisor-planner-web
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Add your Gemini API key to `.env.local`:
```
GEMINI_API_KEY=your_api_key_here
```

5. Start the development server:
```bash
npm run dev
```

6. Open http://localhost:3001 in your browser

## Project Structure

```
advisor-planner-web/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts    # Gemini API endpoint
│   ├── globals.css         # Tailwind styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main dashboard & features
├── lib/
│   └── prompts.ts          # AI prompt templates
├── public/
│   └── logo.png            # App logo
├── .env.example            # Environment template
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## API Routes

### POST /api/analyze

Analyzes input using Gemini AI.

**Request Body:**
```json
{
  "feature": "meeting|summary|scenario|recommendations|presentation|feedback",
  "input": "Your input text",
  "secondaryInput": "Optional secondary input"
}
```

**Response:**
```json
{
  "result": { /* AI-generated analysis */ }
}
```

## Customizing Prompts

All AI prompts are defined in `app/api/analyze/route.ts`. The meeting analysis prompt is customized for:
- Warm, conversational tone
- WhatsApp-ready format
- Power phrases and storytelling
- Collaborative urgency
- No pushy sales language

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Your Google Gemini API key |

## Getting a Gemini API Key

1. Go to https://aistudio.google.com/
2. Sign in with your Google account
3. Click "Get API Key"
4. Create a new API key
5. Copy and paste into your `.env.local` file

## Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## License

Private - For internal use only.
