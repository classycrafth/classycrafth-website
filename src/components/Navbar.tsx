"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isDark = scrolled || pathname !== "/";

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isDark
          ? "bg-black/70 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link
          href="/"
          className="text-xl md:text-2xl font-bold tracking-tight text-white"
        >
          ClassyCrafth
        </Link>

        {/* MENU */}
        <nav className="hidden md:flex gap-10 text-sm font-medium text-gray-300">

          <Link
            href="/"
            className="hover:text-white transition-colors duration-300"
          >
            Home
          </Link>

          <Link
            href="/products"
            className="hover:text-white transition-colors duration-300"
          >
            Products
          </Link>

          <Link
            href="/#about"
            className="hover:text-white transition-colors duration-300"
          >
            About
          </Link>

          <Link
            href="/#contact"
            className="hover:text-white transition-colors duration-300"
          >
            Contact
          </Link>

        </nav>

        {/* CTA */}
        <a
          href="https://wa.me/9191516135516"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-black px-5 py-2 rounded-lg text-sm font-semibold hover:scale-105 transition"
        >
          WhatsApp
        </a>

      </div>
    </header>
  );
}