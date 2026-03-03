import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";

export const metadata: Metadata = {
  metadataBase: new URL("https://classycrafth.com"),
  title: {
    default: "ClassyCrafth | Corporate & School Uniform Manufacturer India",
    template: "%s | ClassyCrafth",
  },
  description:
    "Premium corporate uniform manufacturer, school uniform supplier, and corporate gift supplier in India.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-b from-white via-gray-50 to-white text-gray-800 antialiased">

        <Navbar />

        <main className="pb-24">
          {children}
        </main>

        <Footer />
        <StickyCTA />

      </body>
    </html>
  );
}