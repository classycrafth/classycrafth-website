import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://classycrafth.com"),

  title: {
    default: "ClassyCrafth | Corporate & School Uniform Manufacturer India",
    template: "%s | ClassyCrafth",
  },

  description:
    "Premium corporate uniform manufacturer, school uniform supplier, and corporate gift supplier in India. Bulk production, custom branding, quality assurance and timely delivery.",

  keywords: [
    "Corporate Uniform Manufacturer India",
    "School Uniform Manufacturer India",
    "Corporate Gifts Supplier",
    "Bulk Uniform Supplier India",
    "Custom Corporate Uniforms",
    "Industrial Uniform Manufacturer",
    "Security Uniform Supplier",
  ],

  authors: [{ name: "ClassyCrafth" }],
  creator: "ClassyCrafth",
  publisher: "ClassyCrafth",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "ClassyCrafth | Premium Uniform Manufacturer",
    description:
      "Bulk corporate and school uniform manufacturing with strict quality control and custom branding solutions across India.",
    url: "https://classycrafth.com",
    siteName: "ClassyCrafth",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/images/hero-clean.png",
        width: 1200,
        height: 630,
        alt: "ClassyCrafth Uniform Manufacturing",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "ClassyCrafth | Premium Uniform Manufacturer",
    description:
      "Corporate & School Uniform Manufacturing with PAN India Supply.",
    images: ["/images/hero-clean.png"],
  },

  icons: {
    icon: "/favicon.ico",
  },

  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-b from-white via-gray-50 to-white text-gray-800 antialiased">

        {/* Global Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="pt-28">
          {children}
        </main>

        {/* Global Footer */}
        <Footer />

      </body>
    </html>
  );
}