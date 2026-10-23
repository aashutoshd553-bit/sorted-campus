import Link from "next/link";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const instant = false;

interface BrowsePageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    college?: string;
    condition?: string;
  }>;
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  await connection();
  const { q, category, college, condition } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch categories and colleges for filter chips
  const [{ data: categories }, { data: colleges }] = await Promise.all([
    supabase.from("categories").select("id, name, slug").eq("is_active", true).order("sort_order"),
    supabase.from("colleges").select("id, name, city").order("name"),
  ]);

  // Build query for listings
  let query = supabase
    .from("listings")
    .select(
      `
      id,
      title,
      price_inr,
      condition,
      city,
      created_at,
      status,
      category_id,
      college_id,
      categories(name, slug),
      colleges(name),
      listing_images(storage_path)
    `
    )
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (q && q.trim()) {
    query = query.or(`title.ilike.%${q.trim()}%,description.ilike.%${q.trim()}%`);
  }

  if (category) {
    // Check if category is a UUID or slug
    const matchedCategory = categories?.find((c) => c.slug === category || c.id === category);
    if (matchedCategory) {
      query = query.eq("category_id", matchedCategory.id);
    }
  }

  if (college) {
    query = query.eq("college_id", college);
  }

  if (condition) {
    query = query.eq("condition", condition);
  }

  const { data: listings } = await query;

  return (
    <main className="site-canvas min-h-screen pb-16">
      {/* Header */}
      <header className="px-4 pt-4 sm:px-8">
        <div className="glass mx-auto flex h-16 max-w-7xl items-center justify-between rounded-2xl px-5">
          <Link href="/" className="flex items-center gap-2.5 text-xl font-extrabold tracking-[-.06em] text-slate-950">
            <span className="grid size-8 place-items-center rounded-xl bg-blue-600 text-sm text-white shadow-lg shadow-blue-500/25">
              S
            </span>
            SORTED
          </Link>

          <div className="flex items-center gap-4 text-sm font-semibold">
            {user ? (
              <Link href="/account" className="text-slate-600 hover:text-blue-600">
                My Account
              </Link>
            ) : (
              <Link href="/login" className="text-slate-600 hover:text-blue-600">
                Log in
              </Link>
            )}
            <Link
              href="/sell"
              className="rounded-xl bg-slate-950 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-600"
            >
              Sell an item
            </Link>
          </div>
        </div>
      </header>

      {/* Main Browse Container */}
      <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-8">
        {/* Search & Filter Header */}
        <div className="glass rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Marketplace Discovery
              </p>
              <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                Browse Campus Listings
              </h1>
            </div>

            {/* Search form */}
            <form action="/browse" method="GET" className="flex w-full max-w-md items-center gap-2">
              <input
                name="q"
                defaultValue={q || ""}
                placeholder="Search calculators, books, cycles..."
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700"
              >
                Search
              </button>
            </form>
          </div>

          {/* Filter Chips */}
          <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-slate-200/60 pt-4 text-xs font-semibold">
            <span className="text-slate-400">Categories:</span>
            <Link
              href="/browse"
              className={`rounded-full px-3 py-1 transition ${
                !category
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              All
            </Link>
            {categories?.map((cat) => (
              <Link
                key={cat.id}
                href={`/browse?category=${cat.slug}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                className={`rounded-full px-3 py-1 transition ${
                  category === cat.slug || category === cat.id
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Listings Grid */}
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing <strong>{listings?.length || 0}</strong> items available
            </span>
            {q && (
              <span>
                Results for &ldquo;<strong>{q}</strong>&rdquo;{" "}
                <Link href="/browse" className="text-blue-600 underline">
                  Clear
                </Link>
              </span>
            )}
          </div>

          {listings && listings.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {listings.map((item) => {
                const imgPath = item.listing_images?.[0]?.storage_path;
                let thumb: string | null = null;
                if (imgPath) {
                  thumb = imgPath.startsWith("http")
                    ? imgPath
                    : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/listing-images/${imgPath}`;
                }

                const condLabel =
                  item.condition === "like_new"
                    ? "Like New"
                    : item.condition === "good"
                    ? "Good"
                    : "Fair";

                const categoryName = Array.isArray(item.categories)
                  ? item.categories[0]?.name
                  : (item.categories as { name?: string } | null)?.name;
                const collegeName = Array.isArray(item.colleges)
                  ? item.colleges[0]?.name
                  : (item.colleges as { name?: string } | null)?.name;

                return (
                  <Link
                    key={item.id}
                    href={`/listings/${item.id}`}
                    className="glass lift group flex flex-col overflow-hidden rounded-3xl"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                      {thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={thumb}
                          alt={item.title}
                          className="size-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="grid size-full place-items-center bg-gradient-to-br from-blue-50 to-indigo-50 text-5xl">
                          📦
                        </div>
                      )}

                      <span className="absolute bottom-2.5 left-2.5 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-bold text-slate-700 shadow-sm backdrop-blur-sm">
                        {condLabel}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-4">
                      <p className="text-[11px] font-semibold text-blue-600">
                        {categoryName || "General"}
                      </p>
                      <h3 className="mt-1 line-clamp-1 text-sm font-bold text-slate-900 group-hover:text-blue-600">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-lg font-black text-slate-950">
                        {item.price_inr === 0 ? "FREE" : `₹${item.price_inr.toLocaleString("en-IN")}`}
                      </p>

                      <div className="mt-auto border-t border-slate-200/60 pt-3 text-[11px] font-medium text-slate-500">
                        <p className="line-clamp-1">
                          {collegeName ? `🎓 ${collegeName}` : `📍 ${item.city}`}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="glass rounded-3xl p-12 text-center">
              <span className="text-5xl">🔍</span>
              <h2 className="mt-4 text-lg font-bold text-slate-900">No listings found</h2>
              <p className="mt-1 text-xs text-slate-500">
                Try searching with another keyword or be the first to list an item in this category!
              </p>
              <div className="mt-6">
                <Link
                  href="/sell"
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-700"
                >
                  + Sell an item now
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
