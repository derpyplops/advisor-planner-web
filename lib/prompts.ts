// AI Prompts for Financial Advisor Training

export const PROMPTS = {
  meetingStructure: (transcript: string) => `You are a financial advisor assistant. Analyze the following client meeting transcript and extract structured notes.

TRANSCRIPT:
${transcript}

Please provide a structured analysis in the following JSON format:
{
  "clientGoals": ["list of identified client goals"],
  "financialFacts": ["list of financial facts mentioned (income, assets, debts, etc.)"],
  "riskTolerance": "low/moderate/high with explanation",
  "concerns": ["list of client concerns or worries"],
  "complianceFlags": ["any compliance or regulatory items to note"],
  "actionItems": ["recommended follow-up actions"],
  "summary": "brief 2-3 sentence summary of the meeting"
}`,

  clientSummary: (meetingNotes: string) => `You are a financial advisor assistant. Create a client-friendly summary from these meeting notes that can be shared with the client.

MEETING NOTES:
${meetingNotes}

Write a professional, warm, and clear summary that:
1. Recaps the key discussion points
2. Confirms the client's goals and priorities
3. Outlines next steps
4. Uses simple language (avoid jargon)
5. Is 2-3 paragraphs maximum

Format as a letter-style summary starting with "Dear [Client],"`,

  scenarioPlanning: (clientProfile: string) => `You are a financial planning expert. Based on the client profile below, create three distinct financial scenarios.

CLIENT PROFILE:
${clientProfile}

Provide three scenarios in this JSON format:
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

  productRecommendations: (clientNeeds: string, products: string) => `You are a financial product specialist. Based on the client's needs and the available products, provide personalized recommendations.

CLIENT NEEDS:
${clientNeeds}

AVAILABLE PRODUCTS/SERVICES:
${products}

Provide recommendations in this JSON format:
{
  "recommendations": [
    {
      "product": "Product name",
      "fitExplanation": "Why this product fits the client's needs",
      "benefits": ["list of key benefits"],
      "risks": ["potential risks or downsides"],
      "suitabilityScore": 1-10,
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

  presentationOutline: (topic: string, clientContext: string) => `You are a presentation expert for financial advisors. Create a structured presentation outline.

TOPIC: ${topic}
CLIENT CONTEXT: ${clientContext}

Provide a presentation outline in this JSON format:
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

  trainingFeedback: (transcript: string) => `You are a financial advisor training coach. Evaluate the advisor's performance in this client interaction.

TRANSCRIPT:
${transcript}

Provide feedback in this JSON format:
{
  "overallScore": 1-5,
  "categories": [
    {
      "name": "Client Rapport",
      "score": 1-5,
      "feedback": "Specific feedback",
      "coachingTip": "Actionable improvement tip"
    },
    {
      "name": "Needs Discovery",
      "score": 1-5,
      "feedback": "Specific feedback",
      "coachingTip": "Actionable improvement tip"
    },
    {
      "name": "Product Knowledge",
      "score": 1-5,
      "feedback": "Specific feedback",
      "coachingTip": "Actionable improvement tip"
    },
    {
      "name": "Compliance Adherence",
      "score": 1-5,
      "feedback": "Specific feedback",
      "coachingTip": "Actionable improvement tip"
    },
    {
      "name": "Communication Clarity",
      "score": 1-5,
      "feedback": "Specific feedback",
      "coachingTip": "Actionable improvement tip"
    }
  ],
  "strengths": ["List of observed strengths"],
  "areasForImprovement": ["Priority areas to work on"],
  "overallFeedback": "2-3 sentence summary of performance"
}`
};
