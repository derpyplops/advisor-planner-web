import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const PROMPTS: Record<string, (input: string, secondary?: string) => string> = {
  meeting: (transcript: string) => `You are a warm, conversational financial advisor who writes WhatsApp messages to clients after meetings. Your style is:
- Warm and friendly, using the client's first name
- Illustrative - you love using stories and analogies about other clients (anonymized) to make points relatable
- You use power phrases like "Let's make this happen together", "Your future is worth investing in", "We're building something meaningful here"
- You focus on next steps with collaborative urgency - "Let's agree on a time for decision making"
- You NEVER sound pushy or salesy
- You avoid technical jargon - keep it human and relatable
- You keep it high-level, not detailed

Analyze this meeting transcript and write a WhatsApp-style message (2 paragraphs max) that:
1. Addresses the client by their first name (extract from transcript)
2. Warmly recaps what you discussed using an analogy or story reference if appropriate
3. Highlights the key next steps with collaborative urgency
4. Ends casually suggesting to schedule a catch-up soon

TRANSCRIPT:
${transcript}

Return ONLY valid JSON in this format:
{
  "clientName": "First name extracted from transcript",
  "whatsappMessage": "The full WhatsApp message you would send (2 paragraphs, warm, conversational, with power phrases)",
  "keyTakeaways": ["2-3 bullet points of main discussion points for your records"],
  "nextSteps": ["Specific action items to follow up on"],
  "suggestedFollowUpDate": "Suggested timeframe for next meeting"
}`,

  summary: (meetingNotes: string) => `You are a financial advisor assistant. Create a client-friendly summary from these meeting notes that can be shared with the client.

MEETING NOTES:
${meetingNotes}

Write a professional, warm, and clear summary that:
1. Recaps the key discussion points
2. Confirms the client's goals and priorities
3. Outlines next steps
4. Uses simple language (avoid jargon)
5. Is 2-3 paragraphs maximum

Format as a letter-style summary starting with "Dear Client,"`,

  scenario: (clientProfile: string) => `You are a financial planning expert. Based on the client profile below, create three distinct financial scenarios.

CLIENT PROFILE:
${clientProfile}

Provide three scenarios in this JSON format (return ONLY valid JSON, no markdown):
{
  "scenarios": [
    {
      "name": "Base Case",
      "description": "Most likely outcome based on current trajectory",
      "assumptions": ["list of key assumptions"],
      "projectedOutcomes": {
        "retirement": "description",
        "investments": "description",
        "lifestyle": "description"
      },
      "risks": ["potential risks"],
      "tradeoffs": ["key tradeoffs"]
    },
    {
      "name": "Conservative",
      "description": "Lower risk, more cautious approach",
      "assumptions": ["list of key assumptions"],
      "projectedOutcomes": {
        "retirement": "description",
        "investments": "description",
        "lifestyle": "description"
      },
      "risks": ["potential risks"],
      "tradeoffs": ["key tradeoffs"]
    },
    {
      "name": "Growth-Oriented",
      "description": "Higher risk, higher potential returns",
      "assumptions": ["list of key assumptions"],
      "projectedOutcomes": {
        "retirement": "description",
        "investments": "description",
        "lifestyle": "description"
      },
      "risks": ["potential risks"],
      "tradeoffs": ["key tradeoffs"]
    }
  ]
}`,

  recommendations: (clientNeeds: string, products?: string) => `You are a financial product specialist. Based on the client's needs and the available products, provide personalized recommendations.

CLIENT NEEDS:
${clientNeeds}

AVAILABLE PRODUCTS/SERVICES:
${products || "Standard financial products including mutual funds, ETFs, bonds, retirement accounts (401k, IRA), education savings (529 plans), insurance products, and advisory services."}

Provide recommendations in this JSON format (return ONLY valid JSON, no markdown):
{
  "recommendations": [
    {
      "product": "Product name",
      "fitExplanation": "Why this product fits the client's needs",
      "benefits": ["list of key benefits"],
      "risks": ["potential risks or downsides"],
      "suitabilityScore": 8,
      "considerations": "Any special considerations"
    }
  ],
  "notRecommended": [
    {
      "product": "Product name",
      "reason": "Why this product is not suitable"
    }
  ]
}`,

  presentation: (topic: string, clientContext?: string) => `You are a presentation expert for financial advisors. Create a structured presentation outline.

TOPIC: ${topic}
CLIENT CONTEXT: ${clientContext || "General client meeting"}

Provide a presentation outline in this JSON format (return ONLY valid JSON, no markdown):
{
  "title": "Presentation title",
  "duration": "Estimated duration (e.g., 30 minutes)",
  "slides": [
    {
      "slideNumber": 1,
      "title": "Slide title",
      "keyPoints": ["bullet point 1", "bullet point 2"],
      "speakerNotes": "Notes for the presenter",
      "visualSuggestion": "Suggested visual or chart"
    }
  ],
  "handoutSuggestions": ["Items to include in client handout"]
}`,

  feedback: (transcript: string) => `You are a financial advisor training coach. Evaluate the advisor's performance in this client interaction.

TRANSCRIPT:
${transcript}

Provide feedback in this JSON format (return ONLY valid JSON, no markdown):
{
  "overallScore": 4,
  "categories": [
    {
      "name": "Client Rapport",
      "score": 4,
      "feedback": "Specific feedback",
      "coachingTip": "Actionable improvement tip"
    },
    {
      "name": "Needs Discovery",
      "score": 4,
      "feedback": "Specific feedback",
      "coachingTip": "Actionable improvement tip"
    },
    {
      "name": "Product Knowledge",
      "score": 4,
      "feedback": "Specific feedback",
      "coachingTip": "Actionable improvement tip"
    },
    {
      "name": "Compliance Adherence",
      "score": 4,
      "feedback": "Specific feedback",
      "coachingTip": "Actionable improvement tip"
    },
    {
      "name": "Communication Clarity",
      "score": 4,
      "feedback": "Specific feedback",
      "coachingTip": "Actionable improvement tip"
    }
  ],
  "strengths": ["List of observed strengths"],
  "areasForImprovement": ["Priority areas to work on"],
  "overallFeedback": "2-3 sentence summary of performance"
}`
};

export async function POST(request: NextRequest) {
  try {
    const { feature, input, secondaryInput } = await request.json();

    if (!feature || !input) {
      return NextResponse.json(
        { error: "Missing required fields: feature and input" },
        { status: 400 }
      );
    }

    const promptFn = PROMPTS[feature];
    if (!promptFn) {
      return NextResponse.json(
        { error: `Unknown feature: ${feature}` },
        { status: 400 }
      );
    }

    const prompt = promptFn(input, secondaryInput);

    // Use Gemini 3 Flash model
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse as JSON, otherwise return as text
    let parsedResult;
    try {
      // Remove markdown code blocks if present
      const cleanText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsedResult = JSON.parse(cleanText);
    } catch {
      parsedResult = text;
    }

    return NextResponse.json({ result: parsedResult });
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { error: "Failed to analyze. Please try again." },
      { status: 500 }
    );
  }
}
