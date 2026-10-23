import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/(auth)/actions";
import { ProfileForm } from "./profile-form";
import { BoxIcon, MapPinIcon, PlusIcon } from "@/components/ui/icons";

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
    <main className="site-canvas min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-950">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpg" alt="SORTED" className="h-8 w-auto" />
          </Link>

          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/browse" className="text-slate-600 hover:text-slate-950">
              Browse
            </Link>
            <Link href="/sell" className="text-slate-600 hover:text-slate-950">
              Post Listing
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column: User Card */}
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-lg bg-slate-950 text-xl font-bold text-white">
                {userInitials}
              </div>
              <h2 className="mt-3 text-lg font-bold text-slate-900">{fullName}</h2>
              <p className="text-xs text-slate-500">{user.email}</p>

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700">
                  Campus Member
                </span>
                {profile?.city && (
                  <span className="flex items-center gap-1 rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700">
                    <MapPinIcon className="size-3" /> {profile.city}
                  </span>
                )}
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4 text-left">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">College Affiliation</p>
                <p className="mt-1 text-sm font-medium text-slate-800">
                  {profile?.colleges?.name || "Not specified"}
                </p>
              </div>

              <div className="mt-4 border-t border-slate-100 pt-4 text-left">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Listings</p>
                <p className="mt-1 text-xl font-bold text-slate-900">{listingCount}</p>
              </div>
            </div>

            {/* Quick Action: Sell */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900">Have items to pass on?</h3>
              <p className="mt-1 text-xs text-slate-600">
                Post textbooks, calculators, or hostel gear to sell on campus.
              </p>
              <Link
                href="/sell"
                className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-center text-xs font-semibold text-white hover:bg-blue-700"
              >
                <PlusIcon className="size-3.5" /> Post new listing
              </Link>
            </div>
          </div>

          {/* Right Column: Edit Profile & Activity */}
          <div className="space-y-6 lg:col-span-2">
            {/* Edit Profile Card */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 sm:p-8 shadow-sm" id="profile">
              <div className="mb-6 border-b border-slate-100 pb-4">
                <h1 className="text-lg font-bold tracking-tight text-slate-950">Profile Settings</h1>
                <p className="mt-1 text-xs text-slate-500">
                  Update your contact name, location, and campus details.
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
            <div className="rounded-lg border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-950">My Listings ({listingCount})</h2>
                  <p className="mt-0.5 text-xs text-slate-500">Active items posted under your account.</p>
                </div>
                <Link
                  href="/sell"
                  className="rounded-md bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  Post Item
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
                      <div key={item.id} className="flex items-center justify-between gap-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="size-12 shrink-0 overflow-hidden rounded border border-slate-200 bg-slate-100">
                            {thumb ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={thumb} alt={item.title} className="size-full object-cover" />
                            ) : (
                              <div className="flex size-full items-center justify-center text-slate-400">
                                <BoxIcon className="size-6" />
                              </div>
                            )}
                          </div>
                          <div>
                            <Link
                              href={`/listings/${item.id}`}
                              className="text-sm font-semibold text-slate-900 hover:text-blue-600"
                            >
                              {item.title}
                            </Link>
                            <p className="text-xs font-bold text-slate-950">
                              {item.price_inr === 0 ? "FREE" : `₹${item.price_inr.toLocaleString("en-IN")}`}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded px-2 py-0.5 text-[11px] font-semibold ${
                              item.status === "sold"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {item.status === "sold" ? "Sold" : "Active"}
                          </span>
                          <Link
                            href={`/listings/${item.id}`}
                            className="rounded border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            Manage
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-6 rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
                  <BoxIcon className="mx-auto size-8 text-slate-400" />
                  <p className="mt-2 text-xs font-semibold text-slate-700">No active listings</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Your listed items will appear here once published.
                  </p>
                  <Link
                    href="/sell"
                    className="mt-4 inline-flex rounded-md bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                  >
                    Post an item
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-6 mt-8">
        <div className="mx-auto max-w-5xl px-4 text-center text-xs text-slate-400 sm:px-6">
          <Link href="/contact" className="hover:text-slate-600 mr-4">Contact</Link>
          <Link href="/privacy" className="hover:text-slate-600 mr-4">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-slate-600">Terms of Service</Link>
          <p className="mt-2">Developed by Bhumika Sahu</p>
        </div>
      </footer>
    </main>
  );
}
