import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are the **Retail Asset Manager** — an embedded AI persona within a Mall Operations Management System.

## Your Identity
- Expert in: cleaning systems, asset preservation, mall operations, workforce deployment
- Tone: Direct, opinionated, operationally grounded. NOT generic or polite-neutral.
- You challenge weak decisions and push back on poor logic.

## Core Knowledge Domains
- Materials science (stone, metal, glass, timber, tile, concrete, carpet)
- Cleaning methodologies and chemical compatibility
- Workforce deployment logic (peak/non-peak/event staffing)
- Tenant operational differences (F&B vs retail vs common areas)
- Hygiene, waste & pest control
- Quality inspection frameworks
- Productivity benchmarks: Manual mopping 150-250 m²/hr, Ride-on scrubber 2000-4000 m²/hr, Toilet turnaround 30-40 min

## Tacit Knowledge (Core Philosophies)
- "Perception of cleanliness matters more than technical cleanliness"
- "Consistency failure = biggest operational problem"
- "Briefed once is not enough"
- "Budget issues usually mean poor diagnosis"
- "Short-term savings destroy long-term asset value"

## Rules
- Always provide actionable, specific advice
- Reference productivity benchmarks when discussing staffing
- Consider surface type compatibility when recommending cleaning methods
- Flag risks to asset value when relevant
- Never give generic answers — be specific to mall operations context`;

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase
      .from("mall_chat_messages")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { message } = body;

    // Save user message
    const { error: saveError } = await supabase
      .from("mall_chat_messages")
      .insert({ user_id: user.id, role: "user", content: message });

    if (saveError) return NextResponse.json({ error: saveError.message }, { status: 500 });

    // Fetch last 20 messages for context
    const { data: history } = await supabase
      .from("mall_chat_messages")
      .select("role, content")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    const messages = (history ?? []).reverse();

    // Get operational context
    const [statsResult, lowStockResult] = await Promise.all([
      fetchDashboardStats(supabase),
      supabase
        .from("mall_inventory")
        .select("name, current_stock, min_stock, unit")
        .filter("current_stock", "lte", "min_stock"),
    ]);

    const operationalContext = `
## Current Operational Data
- Active Staff: ${statsResult.staffCount}
- Zones: ${statsResult.zoneCount}
- Open Inspections: ${statsResult.openInspections}
- Low Stock Items: ${statsResult.lowStockCount}
- Pending Purchase Orders: ${statsResult.pendingOrders}
${
  lowStockResult.data && lowStockResult.data.length > 0
    ? `\n## Low Stock Alert\n${lowStockResult.data
        .map((item) => `- ${item.name}: ${item.current_stock}/${item.min_stock} ${item.unit}`)
        .join("\n")}`
    : ""
}`;

    const prompt = `${SYSTEM_PROMPT}\n\n${operationalContext}\n\n## Conversation\n${messages
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n")}`;

    // Call Google Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Save assistant response
    const { error: assistantSaveError } = await supabase
      .from("mall_chat_messages")
      .insert({ user_id: user.id, role: "assistant", content: text });

    if (assistantSaveError) {
      return NextResponse.json({ error: assistantSaveError.message }, { status: 500 });
    }

    return NextResponse.json({ content: text });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { error } = await supabase
      .from("mall_chat_messages")
      .delete()
      .eq("user_id", user.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchDashboardStats(supabase: any) {
  const [staffResult, zoneResult, inspectionsResult, lowStockResult, pendingOrdersResult] =
    await Promise.all([
      supabase
        .from("mall_staff")
        .select("*", { count: "exact", head: true })
        .eq("status", "active"),
      supabase.from("mall_zones").select("*", { count: "exact", head: true }),
      supabase
        .from("mall_inspections")
        .select("*", { count: "exact", head: true })
        .eq("status", "open"),
      supabase
        .from("mall_inventory")
        .select("*", { count: "exact", head: true })
        .filter("current_stock", "lte", "min_stock"),
      supabase
        .from("mall_purchase_orders")
        .select("*", { count: "exact", head: true })
        .eq("status", "submitted"),
    ]);

  return {
    staffCount: staffResult.count ?? 0,
    zoneCount: zoneResult.count ?? 0,
    openInspections: inspectionsResult.count ?? 0,
    lowStockCount: lowStockResult.count ?? 0,
    pendingOrders: pendingOrdersResult.count ?? 0,
  };
}
