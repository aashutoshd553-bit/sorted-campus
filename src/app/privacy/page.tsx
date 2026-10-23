import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | SORTED",
  description: "Privacy policy for the SORTED campus marketplace platform.",
};

export default function PrivacyPage() {
  return (
    <main className="site-canvas min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-950">
            <span className="flex size-7 items-center justify-center rounded bg-slate-950 text-xs font-bold text-white">
              S
            </span>
            SORTED
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/" className="text-slate-600 hover:text-slate-950">
              Home
            </Link>
            <Link href="/browse" className="text-slate-600 hover:text-slate-950">
              Browse
            </Link>
            <Link href="/terms" className="text-slate-600 hover:text-slate-950">
              Terms
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="rounded-lg border border-slate-200 bg-white p-8 sm:p-12 shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Privacy Policy</h1>
          <p className="mt-2 text-xs text-slate-500">Effective Date: October 2026</p>

          <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-700">
            <section>
              <h2 className="text-base font-semibold text-slate-900">1. Overview</h2>
              <p className="mt-2">
                SORTED operates a peer-to-peer college campus marketplace designed to facilitate direct transactions between students. We collect only the information necessary to authenticate users, facilitate on-campus communication, and display active marketplace listings.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-slate-900">2. Information We Collect</h2>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>
                  <strong>Account Information:</strong> Full name, institutional college email address, and encrypted credentials managed via Supabase Authentication.
                </li>
                <li>
                  <strong>Profile Details:</strong> Selected college affiliation, campus location or city, and verification status.
                </li>
                <li>
                  <strong>Listings Information:</strong> Item title, description, category, price, condition, campus location, and uploaded item photographs.
                </li>
                <li>
                  <strong>Technical Data:</strong> Essential session cookies used strictly for user login persistence and security verification.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-slate-900">3. How Information Is Used</h2>
              <p className="mt-2">
                We use collected information solely to:
              </p>
              <ul className="mt-1 list-inside list-disc space-y-1">
                <li>Authenticate student accounts and protect campus communities against fraud.</li>
                <li>Publish and manage marketplace listings on student campus feeds.</li>
                <li>Allow verified buyers to connect with sellers for on-campus item collection.</li>
                <li>Comply with applicable legal requirements and enforce platform terms.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-slate-900">4. Data Sharing and Protection</h2>
              <p className="mt-2">
                We do not sell personal data to advertisers or third parties. Information is stored in encrypted databases protected by database-level Row Level Security policies. Only active listing details and seller display names are public to students within the platform.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-slate-900">5. User Rights and Data Deletion</h2>
              <p className="mt-2">
                Users retain the right to edit their profile information, mark items as sold, delete listings at any time, or request full account termination through their Account Dashboard.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-slate-900">6. Contact</h2>
              <p className="mt-2">
                For questions regarding this policy or data management practices, contact the SORTED administration team via institutional support channels.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
