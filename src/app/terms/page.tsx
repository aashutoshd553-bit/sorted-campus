import Link from "next/link";

export const metadata = {
  title: "Terms and Conditions | SORTED",
  description: "Terms and conditions of use for the SORTED campus marketplace platform.",
};

export default function TermsPage() {
  return (
    <main className="site-canvas min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-950">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpg" alt="SORTED" className="h-8 w-auto" />
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/" className="text-slate-600 hover:text-slate-950">
              Home
            </Link>
            <Link href="/browse" className="text-slate-600 hover:text-slate-950">
              Browse
            </Link>
            <Link href="/privacy" className="text-slate-600 hover:text-slate-950">
              Privacy
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="rounded-lg border border-slate-200 bg-white p-8 sm:p-12 shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Terms and Conditions</h1>
          <p className="mt-2 text-xs text-slate-500">Effective Date: October 2026</p>

          <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-700">
            <section>
              <h2 className="text-base font-semibold text-slate-900">1. Acceptance of Terms</h2>
              <p className="mt-2">
                By registering an account, listing an item, or contacting a seller on SORTED, you agree to comply with and be bound by these Terms and Conditions. If you do not agree to these terms, you must not use the platform.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-slate-900">2. Campus Eligibility and Registration</h2>
              <p className="mt-2">
                SORTED is intended for students and members of verified academic institutions. Users must provide accurate identity information and register with a valid email address. Accounts found to be impersonating individuals or misrepresenting student status will be terminated.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-slate-900">3. Marketplace Conduct and Prohibited Items</h2>
              <p className="mt-2">
                Users are solely responsible for the items they list. The following categories are strictly prohibited:
              </p>
              <ul className="mt-1 list-inside list-disc space-y-1">
                <li>Stolen, counterfeit, or illegally obtained property.</li>
                <li>Alcohol, tobacco, prescription drugs, or controlled substances.</li>
                <li>Weapons, hazardous materials, or illegal items under local laws.</li>
                <li>Academic dishonesty tools, including leaked exams or unauthorized assignments.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-slate-900">4. Transactions and Campus Safety Protocol</h2>
              <p className="mt-2">
                SORTED provides discovery and connection tools only. We do not process monetary payments or hold funds in escrow. Users agree to abide by fundamental campus safety standards:
              </p>
              <ul className="mt-1 list-inside list-disc space-y-1">
                <li>Meet in person in monitored, public areas of campus (such as campus libraries, student centers, or dining halls).</li>
                <li>Inspect and verify item condition and functionality before completing payment.</li>
                <li>Never send advance deposits or wire transfers to unverified parties.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-slate-900">5. Limitation of Liability</h2>
              <p className="mt-2">
                SORTED is not a party to transactions between buyers and sellers. We make no warranties regarding the condition, authenticity, or safety of listed items. Users assume full responsibility for their transactions and interactions.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-slate-900">6. Amendments</h2>
              <p className="mt-2">
                We reserve the right to modify these terms at any time. Continued use of the platform following updates constitutes acceptance of the revised terms.
              </p>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-6 mt-4">
        <div className="mx-auto max-w-3xl px-4 text-center text-xs text-slate-400 sm:px-6">
          <Link href="/contact" className="hover:text-slate-600 mr-4">Contact</Link>
          <Link href="/privacy" className="hover:text-slate-600">Privacy Policy</Link>
          <p className="mt-2">Developed by Bhumika Sahu</p>
        </div>
      </footer>
    </main>
  );
}
