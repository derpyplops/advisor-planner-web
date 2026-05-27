import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const EXTRACT_PROMPT = (text: string) => `You are a financial advisor assistant. Extract client profile information from these meeting notes or transcript.

INPUT:
${text}

Return ONLY valid JSON (no markdown) in this exact format:
{
  "name": "full name of the client or null",
  "age": 50,
  "familyInfo": "brief summary of family situation or null",
  "clientRequest": "what the client wants to achieve or null"
}

If a field cannot be determined, use null for strings and null for age.`;

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data ?? []);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { transcript, transcriptionId } = await request.json();
    if (!transcript) return NextResponse.json({ error: "transcript is required" }, { status: 400 });

    // Extract profile with AI
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(EXTRACT_PROMPT(transcript));
    const text = result.response.text().replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    let profile: { name?: string; age?: number; familyInfo?: string; clientRequest?: string } = {};
    try {
      profile = JSON.parse(text);
    } catch {
      // proceed with empty profile if parsing fails
    }

    const { data, error } = await supabase
      .from("leads")
      .insert({
        user_id: user.id,
        name: profile.name ?? null,
        age: profile.age ?? null,
        family_info: profile.familyInfo ?? null,
        client_request: profile.clientRequest ?? null,
        transcription_id: transcriptionId ?? null,
      })
      .select("*")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
