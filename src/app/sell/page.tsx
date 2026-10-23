import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SellForm } from "./sell-form";

export const instant = false;

export default async function SellPage() {
  await connection();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/sell");
  }

  // Fetch categories
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("sort_order");

  // Fetch colleges
  const { data: colleges } = await supabase
    .from("colleges")
    .select("id, name, city")
    .order("name");

  // Fetch user profile for default location
  const { data: profile } = await supabase
    .from("profiles")
    .select("city, college_id")
    .eq("id", user.id)
    .single();

  return (
    <main className="site-canvas min-h-screen pb-16">
      {/* Navbar */}
      <header className="px-4 pt-4 sm:px-8">
        <div className="glass mx-auto flex h-16 max-w-4xl items-center justify-between rounded-2xl px-5">
          <Link href="/" className="flex items-center gap-2.5 text-xl font-extrabold tracking-[-.06em] text-slate-950">
            <span className="grid size-8 place-items-center rounded-xl bg-blue-600 text-sm text-white shadow-lg shadow-blue-500/25">
              S
            </span>
            SORTED
          </Link>

          <div className="flex items-center gap-4 text-sm font-semibold">
            <Link href="/" className="text-slate-600 hover:text-blue-600">
              Cancel
            </Link>
            <Link
              href="/account"
              className="rounded-xl border border-slate-200 bg-white/80 px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:bg-white hover:text-blue-600"
            >
              My Account
            </Link>
          </div>
        </div>
      </header>

      {/* Main form container */}
      <div className="mx-auto mt-8 max-w-4xl px-4 sm:px-8">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Campus Marketplace</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-950">Sell an Item</h1>
          <p className="mt-1 text-sm text-slate-600">
            List textbooks, electronics, or campus essentials for nearby students.
          </p>
        </div>

        {(!categories || categories.length === 0) && (
          <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-800">
            <strong>Note for setup:</strong> Categories list is currently being populated. If you haven&apos;t run the seed migration in Supabase SQL editor, run <code>supabase/migrations/202610230002_seed_data.sql</code> once.
          </div>
        )}

        <SellForm
          categories={categories || []}
          colleges={colleges || []}
          defaultCity={profile?.city || ""}
          defaultCollegeId={profile?.college_id || null}
        />
      </div>
    </main>
  );
}
