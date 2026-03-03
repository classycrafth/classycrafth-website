"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navLink = (href: string, label: string) => {
    const isActive = pathname === href;

    return (
      <Link
        href={href}
        className={`relative transition duration-300 ${
          isActive
            ? "text-blue-900 font-semibold"
            : "text-gray-700 hover:text-blue-900"
        }`}
      >
        {label}

        {/* Active underline */}
        {isActive && (
          <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-blue-900 rounded"></span>
        )}
      </Link>
    );
  };

  return (
    <header className="fixed w-full bg-white/80 backdrop-blur-lg border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LOGO */}
        <Link
          href="/"
          className="text-xl font-bold tracking-wide text-blue-900"
        >
          ClassyCrafth
        </Link>

        {/* NAV LINKS */}
        <nav className="hidden md:flex gap-10 text-sm font-medium">
          {navLink("/products", "Products")}
          {navLink("/about", "About Us")}
          {navLink("/contact", "Contact")}
        </nav>

        {/* CTA BUTTON */}
        <Link
          href="/contact"
          className="bg-blue-900 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:scale-105 hover:shadow-lg transition duration-300"
        >
          Get Quote
        </Link>

      </div>
    </header>
  );
}