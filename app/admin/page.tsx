import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: setting } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "product_details")
    .single();

  const productDetails = setting?.value ?? "";

  async function saveProductDetails(formData: FormData) {
    "use server";
    const supabase = await createClient();
    const value = formData.get("product_details") as string;

    await supabase
      .from("settings")
      .update({ value, updated_at: new Date().toISOString() })
      .eq("key", "product_details");

    revalidatePath("/admin");
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Product Details</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">
        This text will be used by the AI to inform product recommendations.
      </p>

      <form action={saveProductDetails} className="space-y-4">
        <div>
          <label htmlFor="product_details" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Product Details
          </label>
          <textarea
            id="product_details"
            name="product_details"
            defaultValue={productDetails}
            rows={20}
            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-y font-mono text-sm"
            placeholder="Enter product details, features, pricing, or any other information relevant to recommendations..."
          />
        </div>

        <button
          type="submit"
          className="bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-8 rounded-xl transition-colors"
        >
          Save
        </button>
      </form>
    </div>
  );
}
