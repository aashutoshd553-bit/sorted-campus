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
    <main className="site-canvas min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-950">
            <span className="flex size-7 items-center justify-center rounded bg-slate-950 text-xs font-bold text-white">
              S
            </span>
            SORTED
          </Link>

          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/" className="text-slate-600 hover:text-slate-950">
              Cancel
            </Link>
            <Link href="/account" className="text-slate-600 hover:text-slate-950">
              My Account
            </Link>
          </div>
        </div>
      </header>

      {/* Main container */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Post an Item for Sale</h1>
          <p className="mt-1 text-xs text-slate-500">
            List textbooks, electronics, or equipment directly for students in your college community.
          </p>
        </div>

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
