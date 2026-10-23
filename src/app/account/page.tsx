import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/(auth)/actions";
import { ProfileForm } from "./profile-form";

export const instant = false;

export default async function AccountPage() {
  await connection();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user profile with college name
  const { data: profile } = await supabase
    .from("profiles")
    .select("*, colleges(id, name, city)")
    .eq("id", user.id)
    .single();

  // Fetch active colleges
  const { data: colleges } = await supabase
    .from("colleges")
    .select("id, name, city")
    .order("name");

  // Fetch listings by this user
  const { data: myListings } = await supabase
    .from("listings")
    .select("id, title, price_inr, condition, status, created_at, categories(name), listing_images(storage_path)")
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false });

  const listingCount = myListings?.length || 0;
  const fullName = profile?.full_name || user.user_metadata?.full_name || "Student";
  const userInitials = fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="site-canvas min-h-screen pb-16">
      {/* Navbar */}
      <header className="px-4 pt-4 sm:px-8">
        <div className="glass mx-auto flex h-16 max-w-5xl items-center justify-between rounded-2xl px-5">
          <Link href="/" className="flex items-center gap-2.5 text-xl font-extrabold tracking-[-.06em] text-slate-950">
            <span className="grid size-8 place-items-center rounded-xl bg-blue-600 text-sm text-white shadow-lg shadow-blue-500/25">
              S
            </span>
            SORTED
          </Link>

          <div className="flex items-center gap-4 text-sm font-semibold">
            <Link href="/browse" className="text-slate-600 hover:text-blue-600">
              Browse
            </Link>
            <Link href="/sell" className="text-slate-600 hover:text-blue-600">
              + Sell Item
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-xl border border-slate-200 bg-white/80 px-3.5 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50 hover:border-red-200"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto mt-8 max-w-5xl px-4 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column: User Card */}
          <div className="space-y-6 lg:col-span-1">
            <div className="glass rounded-3xl p-6 text-center">
              <div className="mx-auto grid size-20 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-2xl font-black text-white shadow-xl shadow-blue-500/20">
                {userInitials}
              </div>
              <h2 className="mt-4 text-xl font-bold text-slate-900">{fullName}</h2>
              <p className="text-xs text-slate-500">{user.email}</p>

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                  Campus Member
                </span>
                {profile?.city && (
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    📍 {profile.city}
                  </span>
                )}
              </div>

              <div className="mt-6 border-t border-slate-200/60 pt-4 text-left">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Your College</p>
                <p className="mt-1 text-sm font-medium text-slate-800">
                  {profile?.colleges?.name || "Not selected yet"}
                </p>
              </div>

              <div className="mt-4 border-t border-slate-200/60 pt-4 text-left">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Listings</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{listingCount}</p>
              </div>
            </div>

            {/* Quick Action: Sell */}
            <div className="glass-soft rounded-3xl border border-blue-200/60 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 p-6">
              <span className="text-3xl">📦</span>
              <h3 className="mt-3 text-base font-bold text-slate-900">Have something to sell?</h3>
              <p className="mt-1 text-xs text-slate-600">
                Turn your textbooks, tech, or hostel items into cash within your campus.
              </p>
              <Link
                href="/sell"
                className="mt-4 inline-block w-full rounded-xl bg-blue-600 px-4 py-2.5 text-center text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-700"
              >
                + Post a listing now
              </Link>
            </div>
          </div>

          {/* Right Column: Edit Profile & Activity */}
          <div className="space-y-6 lg:col-span-2">
            {/* Edit Profile Card */}
            <div className="glass rounded-3xl p-6 sm:p-8" id="profile">
              <div className="mb-6 border-b border-slate-200/60 pb-4">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Account Details</p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">Profile Settings</h1>
                <p className="mt-1 text-xs text-slate-500">
                  Update your display name, location, and campus details.
                </p>
              </div>

              <ProfileForm
                initialFullName={fullName}
                initialCity={profile?.city || null}
                initialCollegeId={profile?.college_id || null}
                colleges={colleges || []}
              />
            </div>

            {/* My Listings Card */}
            <div className="glass rounded-3xl p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-950">My Listings ({listingCount})</h2>
                  <p className="text-xs text-slate-500">Items you have listed on SORTED.</p>
                </div>
                <Link
                  href="/sell"
                  className="rounded-xl bg-slate-950 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-600"
                >
                  + Add Item
                </Link>
              </div>

              {myListings && myListings.length > 0 ? (
                <div className="mt-4 divide-y divide-slate-100">
                  {myListings.map((item) => {
                    const imgPath = item.listing_images?.[0]?.storage_path;
                    let thumb: string | null = null;
                    if (imgPath) {
                      thumb = imgPath.startsWith("http")
                        ? imgPath
                        : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/listing-images/${imgPath}`;
                    }

                    return (
                      <div key={item.id} className="flex items-center justify-between gap-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                            {thumb ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={thumb} alt={item.title} className="size-full object-cover" />
                            ) : (
                              <div className="grid size-full place-items-center text-xl">📦</div>
                            )}
                          </div>
                          <div>
                            <Link
                              href={`/listings/${item.id}`}
                              className="font-bold text-slate-900 hover:text-blue-600"
                            >
                              {item.title}
                            </Link>
                            <p className="text-xs font-semibold text-blue-600">
                              {item.price_inr === 0 ? "FREE" : `₹${item.price_inr.toLocaleString("en-IN")}`}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                              item.status === "sold"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {item.status === "sold" ? "Sold" : "Active"}
                          </span>
                          <Link
                            href={`/listings/${item.id}`}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            Manage
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-white/40 p-8 text-center">
                  <p className="text-3xl">🛍️</p>
                  <p className="mt-2 text-sm font-semibold text-slate-700">No active listings yet</p>
                  <p className="mt-1 text-xs text-slate-500">
                    When you list items for sale, they will show up here.
                  </p>
                  <Link
                    href="/sell"
                    className="mt-4 inline-block rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-700"
                  >
                    Post your first item
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
