"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: (
        <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: "Near you",
      href: "/browse?near=true",
      icon: (
        <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      name: "Subscription plans",
      href: "/plans",
      icon: (
        <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      name: "Placed orders",
      href: "/account#orders",
      icon: (
        <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    {
      name: "Wishlist",
      href: "/account#wishlist",
      icon: (
        <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      name: "Profile",
      href: "/account#profile",
      icon: (
        <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      name: "Customer support",
      href: "/contact",
      icon: (
        <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      name: "Account",
      href: "/account",
      icon: (
        <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  return (
    <aside
      className={`relative flex flex-col border-r border-slate-200 bg-white transition-all duration-200 z-30 ${
        collapsed ? "w-16" : "w-64"
      } shrink-0 min-h-screen`}
    >
      {/* Top Header / Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-100">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpg" alt="SORTED" className="h-8 w-auto object-contain" />
          </Link>
        )}
        {collapsed && (
          <Link href="/" className="mx-auto">
            <span className="flex size-8 items-center justify-center rounded bg-slate-950 font-bold text-white text-xs">
              S
            </span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg
            className={`size-4 transition-transform ${collapsed ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Role Picker Card (like Unstop 'Viewing as Student') */}
      {!collapsed ? (
        <div className="p-3">
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5">
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">You're viewing as</p>
            <div className="mt-1 flex items-center justify-between text-xs font-semibold text-slate-900">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500"></span>
                Student
              </span>
              <span className="text-[10px] text-slate-400">Campus</span>
            </div>
          </div>

          {/* Post an Item CTA Button */}
          <Link
            href="/sell"
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-blue-600 bg-blue-50 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition"
          >
            <span className="text-base leading-none font-bold">+</span> Post Listing
          </Link>
        </div>
      ) : (
        <div className="p-2 flex flex-col items-center gap-2">
          <Link
            href="/sell"
            className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-lg"
            title="Post Listing"
          >
            +
          </Link>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-xs font-medium transition ${
                isActive
                  ? "bg-blue-50 text-blue-700 font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
              } ${collapsed ? "justify-center px-2" : ""}`}
              title={collapsed ? item.name : undefined}
            >
              <span className={isActive ? "text-blue-600" : "text-slate-400"}>{item.icon}</span>
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer Info inside sidebar */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-100 text-[11px] text-slate-400">
          <p className="font-medium text-slate-600">SORTED Campus</p>
          <p className="text-[10px] text-slate-400 mt-0.5">By Bhumika Sahu</p>
        </div>
      )}
    </aside>
  );
}
