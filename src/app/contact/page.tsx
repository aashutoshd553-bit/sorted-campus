import Link from "next/link";
import { MailIcon, MapPinIcon } from "@/components/ui/icons";

export const metadata = {
  title: "Contact Us | SORTED",
  description: "Get in touch with the SORTED campus marketplace team.",
};

export default function ContactPage() {
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
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Contact Us</h1>
          <p className="mt-2 text-sm text-slate-500">
            Have a question, a report, or feedback about SORTED? Reach out using the form below or via direct email.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {/* Info Panel */}
          <div className="space-y-6 sm:col-span-1">
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <MailIcon className="size-3.5" />
                Email
              </div>
              <p className="mt-2 text-sm text-slate-700">support@sorted.campus</p>
              <p className="mt-1 text-xs text-slate-500">We respond within 1 business day.</p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <MapPinIcon className="size-3.5" />
                Platform
              </div>
              <p className="mt-2 text-sm text-slate-700">India</p>
              <p className="mt-1 text-xs text-slate-500">
                Campus-to-campus peer marketplace for Indian college students.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="sm:col-span-2">
            <div className="rounded-lg border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <form
                action={`mailto:support@sorted.campus`}
                method="get"
                encType="text/plain"
                className="space-y-5"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Full Name
                    <input
                      name="name"
                      required
                      type="text"
                      autoComplete="name"
                      className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      placeholder="Your name"
                    />
                  </label>

                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Email Address
                    <input
                      name="email"
                      required
                      type="email"
                      autoComplete="email"
                      className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      placeholder="you@college.edu"
                    />
                  </label>
                </div>

                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Subject
                  <select
                    name="subject"
                    className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="report">Report a Listing</option>
                    <option value="account">Account Issue</option>
                    <option value="feedback">Platform Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </label>

                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Message
                  <textarea
                    name="body"
                    required
                    rows={5}
                    className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 resize-none"
                    placeholder="Describe your question or issue in detail..."
                  />
                </label>

                <button
                  type="submit"
                  className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Send Message
                </button>

                <p className="text-center text-xs text-slate-400">
                  This will open your default email client to send the message.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-6 mt-4">
        <div className="mx-auto max-w-3xl px-4 text-center text-xs text-slate-400 sm:px-6">
          <Link href="/privacy" className="hover:text-slate-600 mr-4">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-slate-600">Terms of Service</Link>
          <p className="mt-2">Developed by Bhumika Sahu</p>
        </div>
      </footer>
    </main>
  );
}
