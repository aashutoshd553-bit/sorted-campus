import Link from "next/link";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SearchIcon, MapPinIcon, BoxIcon, PlusIcon } from "@/components/ui/icons";

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

  // Fetch categories and colleges for filters
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
    <main className="site-canvas min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-950">
            <span className="flex size-7 items-center justify-center rounded bg-slate-950 text-xs font-bold text-white">
              S
            </span>
            SORTED
          </Link>

          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/" className="text-slate-600 hover:text-slate-950">
              Home
            </Link>
            {user ? (
              <Link href="/account" className="text-slate-600 hover:text-slate-950">
                My Account
              </Link>
            ) : (
              <Link href="/login" className="text-slate-600 hover:text-slate-950">
                Log in
              </Link>
            )}
            <Link
              href="/sell"
              className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Post Listing
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search and Filters Header */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-950">
                Campus Marketplace Catalog
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                Find textbooks, lab gear, and accessories available on campus.
              </p>
            </div>

            <form action="/browse" method="GET" className="flex w-full max-w-md items-center gap-2">
              <div className="flex flex-1 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-400 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                <SearchIcon className="size-4 shrink-0" />
                <input
                  name="q"
                  defaultValue={q || ""}
                  placeholder="Filter by keyword..."
                  className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
              <button
                type="submit"
                className="rounded-md bg-slate-950 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
              >
                Search
              </button>
            </form>
          </div>

          {/* Category Filter Badges */}
          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 text-xs font-medium">
            <span className="text-slate-500">Categories:</span>
            <Link
              href="/browse"
              className={`rounded px-2.5 py-1 transition ${
                !category
                  ? "bg-slate-900 text-white font-semibold"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              All
            </Link>
            {categories?.map((cat) => (
              <Link
                key={cat.id}
                href={`/browse?category=${cat.slug}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                className={`rounded px-2.5 py-1 transition ${
                  category === cat.slug || category === cat.id
                    ? "bg-slate-900 text-white font-semibold"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Listings Display */}
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between text-xs text-slate-500">
            <span>
              Total results: <strong>{listings?.length || 0}</strong> active items
            </span>
            {q && (
              <span>
                Search filter: &ldquo;{q}&rdquo;{" "}
                <Link href="/browse" className="text-blue-600 hover:underline">
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
                    className="group flex flex-col rounded-lg border border-slate-200 bg-white overflow-hidden transition hover:border-slate-400"
                  >
                    <div className="relative aspect-[4/3] w-full bg-slate-100">
                      {thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={thumb}
                          alt={item.title}
                          className="size-full object-cover"
                        />
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
                      <p className="text-[11px] font-semibold text-blue-600">
                        {categoryName || "General"}
                      </p>
                      <h3 className="mt-1 line-clamp-1 text-sm font-semibold text-slate-900 group-hover:text-blue-600">
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
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center">
              <BoxIcon className="mx-auto size-10 text-slate-400" />
              <h2 className="mt-3 text-sm font-semibold text-slate-900">No items match this search</h2>
              <p className="mt-1 text-xs text-slate-500">
                Try searching with another keyword or post an item in this category.
              </p>
              <div className="mt-4">
                <Link
                  href="/sell"
                  className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  <PlusIcon className="size-3.5" /> Post an item
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
