"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed w-full bg-white/90 backdrop-blur-md shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LOGO (Clickable) */}
        <Link href="/" className="text-xl font-bold text-blue-900">
          ClassyCrafth
        </Link>

        {/* NAV LINKS */}
        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-700">
          <Link href="/products" className="hover:text-blue-900 transition">
            Products
          </Link>
          <Link href="#contact" className="hover:text-blue-900 transition">
            Contact
          </Link>
        </nav>

        {/* CTA BUTTON */}
        <Link
          href="#contact"
          className="bg-blue-900 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition"
        >
          Get Quote
        </Link>

      </div>
    </header>
  );
}