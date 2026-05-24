import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { base64, filename, contentType } = body;

    const buffer = Buffer.from(base64, "base64");
    const filePath = `${user.id}/${Date.now()}-${filename}`;

    const { error: uploadError } = await supabase.storage
      .from("mall-photos")
      .upload(filePath, buffer, {
        contentType,
        upsert: false,
      });

    if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

    const { data: urlData } = supabase.storage
      .from("mall-photos")
      .getPublicUrl(filePath);

    return NextResponse.json({ url: urlData.publicUrl }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
