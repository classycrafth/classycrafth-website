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
        {isActive && (
          <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-blue-900 rounded"></span>
        )}
      </Link>
    );
  };

  return (
    <header className="fixed top-0 w-full h-20 bg-white/90 backdrop-blur-md shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">

        <Link
          href="/"
          className="text-xl font-bold tracking-wide text-blue-900"
        >
          ClassyCrafth
        </Link>

        <nav className="hidden md:flex gap-10 text-sm font-medium">
          {navLink("/products", "Products")}
          {navLink("/about", "About Us")}
          {navLink("/contact", "Contact")}
        </nav>

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