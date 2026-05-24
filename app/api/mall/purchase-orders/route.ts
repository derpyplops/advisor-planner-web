import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase
      .from("mall_purchase_orders")
      .select("*")
      .order("created_at", { ascending: false });

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
    const { vendor_id, notes, items } = body;

    const order_number = `PO-${Date.now().toString(36).toUpperCase()}`;
    const total_amount = items.reduce(
      (sum: number, item: { quantity: number; unit_price: number }) =>
        sum + item.quantity * item.unit_price,
      0
    );

    const { data: order, error: orderError } = await supabase
      .from("mall_purchase_orders")
      .insert({ vendor_id, order_number, total_amount, notes })
      .select()
      .single();

    if (orderError) return NextResponse.json({ error: orderError.message }, { status: 500 });

    const orderItems = items.map(
      (item: { inventory_id: string; quantity: number; unit_price: number }) => ({
        purchase_order_id: order.id,
        inventory_id: item.inventory_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.quantity * item.unit_price,
      })
    );

    const { error: itemsError } = await supabase
      .from("mall_purchase_order_items")
      .insert(orderItems);

    if (itemsError) return NextResponse.json({ error: itemsError.message }, { status: 500 });

    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
