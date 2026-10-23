import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  BookIcon,
  LaptopIcon,
  BikeIcon,
  HomeIcon,
  CalculatorIcon,
  FlaskIcon,
  SearchIcon,
  ArrowRightIcon,
  MapPinIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  BoxIcon,
} from "@/components/ui/icons";

export const instant = false;

const categories = [
  { icon: BookIcon, name: "Books & Notes", slug: "books-notes", description: "Textbooks, reference guides, course notes" },
  { icon: LaptopIcon, name: "Electronics", slug: "electronics", description: "Monitors, keyboards, audio, chargers" },
  { icon: BikeIcon, name: "Bikes & Travel", slug: "bikes-travel", description: "Campus bicycles, helmets, travel gear" },
  { icon: HomeIcon, name: "Hostel Essentials", slug: "hostel-essentials", description: "Lamps, storage racks, kettles, organizers" },
  { icon: CalculatorIcon, name: "Academic Tools", slug: "academic-tools", description: "Scientific calculators, drafters, geometry sets" },
  { icon: FlaskIcon, name: "Project Kits", slug: "project-kits", description: "Arduino, Raspberry Pi, component kits" },
];

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Query live listings from database
  const { data: dbListings } = await supabase
    .from("listings")
    .select(
      `
      id,
      title,
      price_inr,
      condition,
      city,
      created_at,
      categories(name),
      colleges(name),
      listing_images(storage_path)
    `
    )
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(8);

  const hasDbListings = dbListings && dbListings.length > 0;

  return (
    <main className="site-canvas min-h-screen">
      {/* Top Navigation */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-950">
              <span className="flex size-7 items-center justify-center rounded bg-slate-950 text-xs font-bold text-white">
                S
              </span>
              SORTED
            </Link>

            <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
              <Link className="nav-link" href="/browse">
                Browse Catalog
              </Link>
              <Link className="nav-link" href="/sell">
                Sell an Item
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3 text-sm font-medium">
            {user ? (
              <>
                <Link
                  href="/account"
                  className="rounded-md border border-slate-300 bg-white px-3.5 py-1.5 text-slate-700 hover:bg-slate-50"
                >
                  My Account
                </Link>
                <Link
                  href="/sell"
                  className="rounded-md bg-blue-600 px-3.5 py-1.5 text-white hover:bg-blue-700"
                >
                  Post Listing
                </Link>
              </>
            ) : (
              <>
                <Link className="text-slate-600 hover:text-slate-950 px-2 py-1.5" href="/login">
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="rounded-md bg-blue-600 px-3.5 py-1.5 text-white hover:bg-blue-700"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-slate-200 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-1.5 rounded border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-slate-700">
            <ShieldCheckIcon className="size-3.5 text-slate-700" /> Peer-to-Peer Campus Marketplace
          </span>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Buy and sell second-hand essentials on your campus.
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
            Direct student-to-student marketplace for textbooks, lab equipment, electronics, and hostel supplies. Meet safely in daylight on campus.
          </p>

          {/* Search Bar */}
          <form action="/browse" method="GET" className="mx-auto mt-8 flex max-w-2xl items-center rounded-md border border-slate-300 bg-white p-1.5 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
            <div className="flex flex-1 items-center gap-2 px-3 text-slate-400">
              <SearchIcon className="size-4 shrink-0" />
              <input
                name="q"
                aria-label="Search campus listings"
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                placeholder="Search by item title, course code, or author..."
              />
            </div>
            <button
              type="submit"
              className="rounded bg-slate-950 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
            >
              Search
            </button>
          </form>

          {/* Quick links */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Common Searches:</span>
            <Link className="hover:text-blue-600 hover:underline" href="/browse?q=Calculators">
              Calculators
            </Link>
            <Link className="hover:text-blue-600 hover:underline" href="/browse?q=Engineering+Mathematics">
              Engineering Mathematics
            </Link>
            <Link className="hover:text-blue-600 hover:underline" href="/browse?q=Lab+Coat">
              Lab Coat
            </Link>
            <Link className="hover:text-blue-600 hover:underline" href="/browse?q=Bicycle">
              Bicycle
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-950">Marketplace Categories</h2>
            <p className="mt-1 text-xs text-slate-500">Browse student listings by specific campus need.</p>
          </div>
          <Link href="/browse" className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800">
            View full catalog <ArrowRightIcon className="size-3" />
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.slug}
                href={`/browse?category=${category.slug}`}
                className="group rounded-lg border border-slate-200 bg-white p-5 transition hover:border-slate-400 hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded border border-slate-200 bg-slate-50 text-slate-700 group-hover:border-slate-300">
                    <Icon className="size-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600">
                      {category.name}
                    </h3>
                    <p className="text-xs text-slate-500">{category.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Fresh Listings */}
      <section className="border-t border-slate-200 bg-slate-50/50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-slate-950">Recent Campus Listings</h2>
              <p className="mt-1 text-xs text-slate-500">Items recently posted for sale on campus.</p>
            </div>
            <Link href="/browse" className="text-xs font-semibold text-blue-600 hover:text-blue-800">
              Browse all items
            </Link>
          </div>

          <div className="mt-6">
            {hasDbListings ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {dbListings.map((item) => {
                  const imgPath = item.listing_images?.[0]?.storage_path;
                  let thumb: string | null = null;
                  if (imgPath) {
                    thumb = imgPath.startsWith("http")
                      ? imgPath
                      : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/listing-images/${imgPath}`;
                  }
                  const condLabel =
                    item.condition === "like_new" ? "Like New" : item.condition === "good" ? "Good" : "Fair";
                  const collegeName = Array.isArray(item.colleges)
                    ? item.colleges[0]?.name
                    : (item.colleges as { name?: string } | null)?.name;

                  return (
                    <Link
                      key={item.id}
                      href={`/listings/${item.id}`}
                      className="group flex flex-col rounded-lg border border-slate-200 bg-white overflow-hidden transition hover:border-slate-400"
                    >
                      <div className="relative aspect-[4/3] w-full bg-slate-100">
                        {thumb ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={thumb} alt={item.title} className="size-full object-cover" />
                        ) : (
                          <div className="flex size-full items-center justify-center text-slate-300">
                            <BoxIcon className="size-10" />
                          </div>
                        )}
                        <span className="absolute bottom-2 left-2 rounded bg-white/95 px-2 py-0.5 text-[10px] font-semibold text-slate-800 border border-slate-200">
                          {condLabel}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col p-4">
                        <h3 className="line-clamp-1 text-sm font-semibold text-slate-900 group-hover:text-blue-600">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-base font-bold text-slate-950">
                          {item.price_inr === 0 ? "FREE" : `₹${item.price_inr.toLocaleString("en-IN")}`}
                        </p>
                        <div className="mt-auto border-t border-slate-100 pt-3 text-[11px] text-slate-500">
                          <p className="line-clamp-1 flex items-center gap-1">
                            <MapPinIcon className="size-3 shrink-0" />
                            {collegeName || item.city}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
                <BoxIcon className="mx-auto size-8 text-slate-400" />
                <h3 className="mt-3 text-sm font-semibold text-slate-900">No active listings yet</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Be the first student to list textbooks, electronics, or equipment on your campus.
                </p>
                <div className="mt-4">
                  <Link
                    href="/sell"
                    className="inline-flex rounded-md bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                  >
                    Post an item for sale
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Safety Protocol */}
      <section className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Security &amp; Campus Protocol
              </span>
              <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-950">
                Safe on-campus transactions
              </h2>
              <p className="mt-1 text-xs text-slate-600">
                SORTED is engineered strictly for peer-to-peer handoffs. Follow standard campus safety protocol:
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2 font-semibold text-slate-900 text-xs">
                  <CheckCircleIcon className="size-4 text-emerald-600" />
                  Public campus locations
                </div>
                <p className="mt-2 text-xs text-slate-600">
                  Arrange handovers inside campus libraries, departmental lobbies, or student cafeterias during daylight hours.
                </p>
              </div>

              <div className="rounded border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2 font-semibold text-slate-900 text-xs">
                  <CheckCircleIcon className="size-4 text-emerald-600" />
                  Inspect before payment
                </div>
                <p className="mt-2 text-xs text-slate-600">
                  Test electronics, inspect book condition, and check included cables before transferring any money.
                </p>
              </div>

              <div className="rounded border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2 font-semibold text-slate-900 text-xs">
                  <CheckCircleIcon className="size-4 text-emerald-600" />
                  No advance deposits
                </div>
                <p className="mt-2 text-xs text-slate-600">
                  Never transfer advance holding deposits or token amounts. Pay directly via UPI or cash upon physical receipt.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sell CTA Banner */}
      <section className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-950">Done with your course materials?</h2>
            <p className="mt-1 text-xs text-slate-600">Pass them forward to junior students on your campus in minutes.</p>
          </div>
          <Link
            href="/sell"
            className="rounded-md bg-slate-950 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800"
          >
            Create a listing
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">SORTED</span>
            <span>&bull;</span>
            <span>Campus peer-to-peer marketplace</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/browse" className="hover:text-slate-900">
              Browse
            </Link>
            <Link href="/sell" className="hover:text-slate-900">
              Sell
            </Link>
            <Link href="/account" className="hover:text-slate-900">
              Account
            </Link>
            <Link href="/privacy" className="hover:text-slate-900">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-900">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
