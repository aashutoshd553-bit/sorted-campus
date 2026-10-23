import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const instant = false;

const categories = [
  { icon: "📚", name: "Books & Notes", slug: "books-notes", count: "1,240+ listings" },
  { icon: "💻", name: "Electronics", slug: "electronics", count: "860+ listings" },
  { icon: "🚲", name: "Bikes & Travel", slug: "bikes-travel", count: "310+ listings" },
  { icon: "🛏️", name: "Hostel Essentials", slug: "hostel-essentials", count: "720+ listings" },
  { icon: "🧮", name: "Academic Tools", slug: "academic-tools", count: "480+ listings" },
  { icon: "🧪", name: "Project Kits", slug: "project-kits", count: "260+ listings" },
];

const fallbackListings = [
  { id: "demo-1", image: "📐", tint: "from-sky-100 to-blue-50", title: "Casio fx-991ES Plus", price: "₹850", condition: "Like New", college: "IIT Delhi", posted: "Today" },
  { id: "demo-2", image: "💡", tint: "from-amber-100 to-yellow-50", title: "Study lamp with USB port", price: "₹450", condition: "Good", college: "DU North Campus", posted: "Today" },
  { id: "demo-3", image: "⌨️", tint: "from-violet-100 to-indigo-50", title: "Logitech wireless keyboard", price: "₹1,100", condition: "Good", college: "NSUT", posted: "Yesterday" },
  { id: "demo-4", image: "📘", tint: "from-blue-100 to-cyan-50", title: "Engineering Mathematics set", price: "₹600", condition: "Fair", college: "DTU", posted: "Yesterday" },
];

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 fill-none stroke-current stroke-2">
      <circle cx="11" cy="11" r="6" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-none stroke-current stroke-2">
      <path d="M5 12h13M14 6l6 6-6 6" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-none stroke-current stroke-2">
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

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
    <main className="site-canvas relative">
      <div className="orb orb-one" />
      <div className="orb orb-two" />

      {/* Header */}
      <header className="relative z-10 px-4 pt-4 sm:px-8">
        <div className="glass mx-auto flex h-16 max-w-7xl items-center justify-between rounded-2xl px-4 sm:px-5">
          <Link href="/" className="flex items-center gap-2.5 text-xl font-extrabold tracking-[-.06em] text-slate-950">
            <span className="grid size-8 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-sm text-white shadow-lg shadow-blue-500/25">
              S
            </span>
            SORTED
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <Link className="nav-link" href="/browse">
              Browse
            </Link>
            <a className="nav-link" href="#how-it-works">
              How it works
            </a>
          </nav>

          <div className="flex items-center gap-3 text-sm font-semibold">
            {user ? (
              <>
                <Link
                  href="/account"
                  className="rounded-xl border border-slate-200 bg-white/70 px-4 py-2 text-slate-700 transition hover:bg-white hover:text-blue-600"
                >
                  My Account
                </Link>
                <Link
                  href="/sell"
                  className="rounded-xl bg-slate-950 px-4 py-2.5 text-white shadow-lg shadow-slate-900/15 transition hover:bg-blue-700"
                >
                  Sell an item
                </Link>
              </>
            ) : (
              <>
                <Link className="hidden text-slate-600 hover:text-blue-600 sm:block" href="/login">
                  Log in
                </Link>
                <Link
                  href="/sell"
                  className="rounded-xl bg-slate-950 px-4 py-2.5 text-white shadow-lg shadow-slate-900/15 transition hover:bg-blue-700"
                >
                  Sell an item
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="grid-noise relative z-0 px-5 pb-18 pt-18 sm:px-8 sm:pb-26 sm:pt-25">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.08fr_.92fr]">
          <div className="max-w-2xl">
            <p className="glass-soft mb-6 inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-bold text-blue-700">
              <span className="size-2 rounded-full bg-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,.13)]" /> Your campus marketplace
            </p>
            <h1 className="text-4xl font-bold tracking-[-.065em] text-slate-950 sm:text-6xl sm:leading-[1.04]">
              The smarter way to <span className="text-blue-600">buy &amp; sell</span> on campus.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Find useful things from people around your college. When you&apos;re done with something, pass it forward.
            </p>

            {/* Interactive Search Box */}
            <form action="/browse" method="GET" className="glass mt-9 rounded-2xl p-2.5 sm:flex">
              <label className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5 text-slate-400">
                <SearchIcon />
                <input
                  name="q"
                  aria-label="Search listings"
                  className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  placeholder="What are you looking for?"
                />
              </label>
              <button
                type="submit"
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-700 sm:mt-0 sm:w-auto"
              >
                Search <ArrowIcon />
              </button>
            </form>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
              <span>Popular now:</span>
              <Link className="font-semibold text-slate-700 hover:text-blue-600" href="/browse?q=Calculators">
                Calculators
              </Link>
              <Link className="font-semibold text-slate-700 hover:text-blue-600" href="/browse?q=Textbooks">
                Textbooks
              </Link>
              <Link className="font-semibold text-slate-700 hover:text-blue-600" href="/browse?q=Cycles">
                Cycles
              </Link>
            </div>
          </div>

          <div className="relative mx-auto hidden w-full max-w-md lg:block">
            <div className="glass relative rounded-[2rem] p-4">
              <div className="flex items-center justify-between rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 px-5 py-4 text-white shadow-xl shadow-blue-700/20">
                <div>
                  <p className="text-xs font-medium text-blue-100">Discover around you</p>
                  <p className="mt-1 text-lg font-bold">Campus picks</p>
                </div>
                <Link href="/browse" className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                  Explore
                </Link>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <Link href="/browse?category=books-notes" className="glass-soft rounded-2xl p-5 hover:bg-white/60">
                  <span className="text-4xl">📚</span>
                  <p className="mt-8 text-sm font-bold text-slate-800">Academic books</p>
                  <p className="mt-1 text-xs text-slate-500">Make learning affordable</p>
                </Link>
                <Link href="/browse?category=electronics" className="glass-soft rounded-2xl p-5 hover:bg-white/60">
                  <span className="text-4xl">🎧</span>
                  <p className="mt-8 text-sm font-bold text-slate-800">Tech essentials</p>
                  <p className="mt-1 text-xs text-slate-500">Ready for a new home</p>
                </Link>
              </div>
            </div>
            <div className="glass absolute -bottom-6 -left-12 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm shadow-xl">
              <span className="grid size-9 place-items-center rounded-xl bg-blue-100 text-blue-600">
                <PinIcon />
              </span>
              <div>
                <p className="font-bold text-slate-800">Your campus first</p>
                <p className="text-xs text-slate-500">Browse near your college</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="browse" className="relative z-10 mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-bold text-blue-600">Browse by category</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Everything for student life
            </h2>
          </div>
          <Link href="/browse" className="hidden items-center gap-1 text-sm font-bold text-blue-600 sm:flex">
            View all <ArrowIcon />
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/browse?category=${category.slug}`}
              className="glass-soft lift rounded-2xl p-4 transition"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-white/70 text-2xl shadow-sm">
                {category.icon}
              </span>
              <p className="mt-5 text-sm font-bold text-slate-800">{category.name}</p>
              <p className="mt-1 text-xs text-slate-500">{category.count}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Fresh listings */}
      <section className="relative z-10 mx-4 rounded-[2rem] border border-white/80 bg-white/30 py-16 shadow-[0_20px_60px_rgba(42,93,153,.07)] backdrop-blur-sm sm:mx-8">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-bold text-blue-600">Fresh on SORTED</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Recently listed near you
              </h2>
            </div>
            <Link href="/browse" className="hidden text-sm font-bold text-blue-600 sm:block">
              See all listings →
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {hasDbListings
              ? dbListings.map((item) => {
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
                      className="glass lift overflow-hidden rounded-2xl"
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                        {thumb ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={thumb} alt={item.title} className="size-full object-cover" />
                        ) : (
                          <div className="grid size-full place-items-center bg-gradient-to-br from-blue-50 to-indigo-50 text-5xl">
                            📦
                          </div>
                        )}
                        <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                          {condLabel}
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="line-clamp-1 text-sm font-bold text-slate-800">{item.title}</h3>
                        <p className="mt-2 text-xl font-bold tracking-tight text-slate-950">
                          {item.price_inr === 0 ? "FREE" : `₹${item.price_inr.toLocaleString("en-IN")}`}
                        </p>
                        <p className="mt-3 border-t border-slate-200/60 pt-3 text-xs font-semibold text-slate-500">
                          {collegeName || item.city}
                        </p>
                      </div>
                    </Link>
                  );
                })
              : fallbackListings.map((item) => (
                  <article key={item.title} className="glass lift overflow-hidden rounded-2xl">
                    <div className={`grid h-44 place-items-center bg-gradient-to-br ${item.tint} text-6xl`}>
                      {item.image}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-bold leading-5 text-slate-800">{item.title}</h3>
                      </div>
                      <p className="mt-3 text-xl font-bold tracking-tight text-slate-950">{item.price}</p>
                      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                        <span className="rounded-full bg-blue-50 px-2 py-1 font-medium text-blue-700">
                          {item.condition}
                        </span>
                        <span>{item.posted}</span>
                      </div>
                      <p className="mt-3 border-t border-slate-200/60 pt-3 text-xs font-semibold text-slate-500">
                        {item.college}
                      </p>
                    </div>
                  </article>
                ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="relative z-10 mx-auto max-w-7xl px-5 py-18 sm:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-7 py-12 text-white shadow-2xl shadow-blue-950/20 sm:px-12">
          <div className="absolute -right-24 -top-24 size-80 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="relative max-w-xl">
            <p className="text-sm font-bold text-blue-300">Simple by design</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">A better home for useful things.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              SORTED keeps buying and selling focused on the students around you.
            </p>
          </div>
          <div className="relative mt-10 grid gap-6 sm:grid-cols-3">
            {[
              ["01", "Find what you need", "Search listings from your campus and nearby colleges."],
              ["02", "Connect safely", "Get in touch with the seller and decide what works for you."],
              ["03", "Keep it moving", "Sell what you are done with and help another student."],
            ].map(([number, title, text]) => (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5" key={number}>
                <p className="text-xs font-bold tracking-wider text-blue-300">{number}</p>
                <h3 className="mt-4 font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section id="sell" className="relative z-10 mx-auto max-w-7xl px-5 pb-10 sm:px-8">
        <div className="glass flex flex-col items-start justify-between gap-6 rounded-2xl px-6 py-8 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-950">Have something worth passing on?</h2>
            <p className="mt-2 text-sm text-slate-600">List it in a few minutes and reach students nearby.</p>
          </div>
          <Link
            href="/sell"
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-700"
          >
            Create a listing
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <Link href="/" className="font-extrabold tracking-[-.04em] text-slate-800">
          SORTED
        </Link>
        <p>Made for student communities.</p>
        <div className="flex gap-5">
          <Link href="/browse" className="hover:text-blue-600">
            Browse
          </Link>
          <Link href="/sell" className="hover:text-blue-600">
            Sell
          </Link>
          <Link href="/account" className="hover:text-blue-600">
            Account
          </Link>
        </div>
      </footer>
    </main>
  );
}
