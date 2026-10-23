import Link from "next/link";

export const metadata = {
  title: "Subscription Plans | SORTED",
  description: "Affordable student subscription plans for high-volume campus selling.",
};

export default function PlansPage() {
  const plans = [
    {
      name: "Free Student",
      price: "₹0",
      period: "forever",
      description: "For casual students wanting to sell semester textbooks or room gear.",
      features: [
        "Up to 5 active listings",
        "Direct student chat & campus meetups",
        "Standard search placement",
        "Campus verification badge",
      ],
      cta: "Current Plan",
      current: true,
    },
    {
      name: "Campus Pro",
      price: "₹49",
      period: "/ month",
      description: "For active seniors, hostel organizers, and batch sellers.",
      features: [
        "Unlimited active listings",
        "Featured placement on homepage",
        "Priority notifications for buyers",
        "Analytics on views & saves",
        "Direct WhatsApp contact button",
      ],
      cta: "Upgrade to Pro",
      current: false,
    },
    {
      name: "Semester Pass",
      price: "₹199",
      period: "/ 6 months",
      description: "Complete coverage throughout semester exam and hostel move-out season.",
      features: [
        "All Campus Pro features",
        "Bulk listing upload",
        "Highlighted 'Verified Senior' tag",
        "Zero platform commissions",
        "Dedicated student support",
      ],
      cta: "Get Semester Pass",
      current: false,
    },
  ];

  return (
    <main className="flex-1 p-6 sm:p-10 max-w-6xl mx-auto w-full">
      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">Upgrade & Scale</span>
        <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">Student Subscription Plans</h1>
        <p className="mt-1 text-sm text-slate-500">
          Zero commissions on peer sales. Choose a plan to unlock more listings and campus visibility.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-xl border p-6 flex flex-col justify-between bg-white ${
              plan.current ? "border-slate-300 ring-1 ring-slate-200" : "border-blue-600 shadow-sm"
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-950">{plan.name}</h3>
                {plan.current && (
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                    Active
                  </span>
                )}
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-slate-950">{plan.price}</span>
                <span className="text-xs text-slate-500">{plan.period}</span>
              </div>
              <p className="mt-2 text-xs text-slate-500">{plan.description}</p>

              <ul className="mt-6 space-y-2.5 border-t border-slate-100 pt-6 text-xs text-slate-600">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <svg className="size-4 shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              {plan.current ? (
                <button
                  disabled
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 text-xs font-semibold text-slate-400 cursor-not-allowed"
                >
                  Current Plan
                </button>
              ) : (
                <Link
                  href="/contact?subject=subscription"
                  className="block text-center w-full rounded-lg bg-blue-600 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 transition"
                >
                  {plan.cta}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
