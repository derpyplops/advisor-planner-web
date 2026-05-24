import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [
      staffResult,
      zoneResult,
      inspectionsResult,
      lowStockResult,
      pendingOrdersResult,
      recentInspectionsResult,
    ] = await Promise.all([
      supabase
        .from("mall_staff")
        .select("*", { count: "exact", head: true })
        .eq("status", "active"),
      supabase
        .from("mall_zones")
        .select("*", { count: "exact", head: true }),
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
      supabase
        .from("mall_inspections")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

    return NextResponse.json({
      staffCount: staffResult.count ?? 0,
      zoneCount: zoneResult.count ?? 0,
      openInspections: inspectionsResult.count ?? 0,
      lowStockCount: lowStockResult.count ?? 0,
      pendingOrders: pendingOrdersResult.count ?? 0,
      scheduledToday: 0,
      recentInspections: recentInspectionsResult.data ?? [],
    });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
