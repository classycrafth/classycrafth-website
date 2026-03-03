import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="bg-gradient-to-r from-[#0f172a] to-[#0b1a35] text-white py-24 px-6 text-center">
      <h2 className="text-4xl font-bold mb-6">
        Ready to Upgrade Your Uniform Standards?
      </h2>

      <p className="text-gray-400 max-w-2xl mx-auto mb-10">
        Partner with us for premium quality uniforms tailored to your brand.
        Bulk production, strict quality control, and reliable delivery.
      </p>

      <Link
        href="#contact"
        className="bg-white text-black px-10 py-4 rounded-xl font-semibold hover:scale-105 transition"
      >
        Request a Custom Quote
      </Link>
    </section>
  );
}