"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isDark = scrolled || pathname !== "/";

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isDark
          ? "bg-black/70 backdrop-blur-md shadow-lg"
          : "bg-black/70 backdrop-blur-md shadow-lg"
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
            className="hover:text-white transition"
          >
            Home
          </Link>

          <Link
            href="/products"
            className="hover:text-white transition"
          >
            Products
          </Link>

          <Link
            href="/#about"
            className="hover:text-white transition"
          >
            About
          </Link>

          <Link
            href="/#contact"
            className="hover:text-white transition"
          >
            Contact
          </Link>

        </nav>

        {/* WHATSAPP */}
        <a
          href="https://wa.me/919201633665"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-black px-5 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          WhatsApp
        </a>

      </div>
    </header>
  );
}