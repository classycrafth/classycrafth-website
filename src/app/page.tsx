"use client";

import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import ProductsPreview from "@/components/ProductsPreview";
import WhyChooseUs from "@/components/WhyChooseUs";
import About from "@/components/About";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import FinalCTA from "@/components/FinalCTA";

export default function Home() {
  return (
    <div className="bg-[#0f172a] text-white overflow-x-hidden">

      <Hero />
      <Stats />
      <ProductsPreview />
      <WhyChooseUs />
      <About />
      <Process />
      <Testimonials />
      <Contact />
      <FinalCTA />

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/9191516135516"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full shadow-2xl font-semibold z-50 transition-all duration-300 hover:scale-105"
      >
        WhatsApp
      </a>

    </div>
  );
}