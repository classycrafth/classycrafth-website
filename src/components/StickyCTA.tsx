"use client";

export default function StickyCTA() {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-blue-900 text-white py-3 px-6 flex justify-between items-center z-50 shadow-2xl">
      <span className="text-sm md:text-base font-medium">
        Need Bulk Uniforms? Get Instant Quote
      </span>

      <a
        href="https://wa.me/9191516135516?text=Hello, I want bulk uniform quotation."
        target="_blank"
        className="bg-white text-blue-900 px-4 py-2 rounded-lg text-sm font-semibold hover:scale-105 transition"
      >
        WhatsApp Now
      </a>
    </div>
  );
}