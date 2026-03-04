"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className="bg-white text-gray-800">
      <Navbar />
      <Hero />
      <About />
      <Process />
      <Testimonials />
      <Contact />

      {/* WhatsApp Floating CTA */}
      <a
        href="https://wa.me/9191516135516?text=Hello%20ClassyCrafth%2C%20I%20am%20interested%20in%20bulk%20uniform%20manufacturing.%20Please%20share%20details."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg font-semibold z-50 animate-pulse hover:scale-110 transition"
      >
        💬 Chat on WhatsApp
      </a>

      <Footer />
    </main>
  );
}