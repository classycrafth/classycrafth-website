"use client";

import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useTransform
} from "framer-motion";

export default function Hero() {

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [6, -6]);
  const rotateY = useTransform(x, [-100, 100], [-6, 6]);

  return (
    <section
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
      }}
      className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-[#0f172a] via-[#0b1a35] to-[#0a0f1f] text-white pt-40 md:pt-44 pb-28 md:pb-36 px-6 overflow-hidden"
    >

      {/* Animated Glow */}
      <motion.div
        animate={{
          x: [0, 40, -40, 0],
          y: [0, -30, 30, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-blue-500/20 blur-[160px] rounded-full"
      />

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-14 lg:gap-20 items-center">

        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
            Premium Uniform Manufacturing
            <span className="block text-gray-400 mt-3">
              For Corporate & Schools
            </span>
          </h1>

          <p className="mt-6 text-gray-400 text-lg leading-relaxed max-w-xl">
            We design and manufacture high-quality corporate and school uniforms
            with precision tailoring, durability, and brand-focused customization
            for institutions across India.
          </p>

          <div className="mt-10 flex gap-6 flex-wrap">

            <Link
              href="#contact"
              className="bg-white text-black px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Request a Quote
            </Link>

            <Link
              href="/products"
              className="border border-white/20 px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-black transition-all duration-300"
            >
              View Collection
            </Link>

          </div>

          <div className="mt-10 flex gap-8 text-sm text-gray-400 flex-wrap">
            <span>✔ In-house Production</span>
            <span>✔ Bulk Specialist</span>
            <span>✔ PAN India Supply</span>
          </div>

        </motion.div>

        {/* RIGHT IMAGE */}
        <motion.div
          style={{ rotateX, rotateY }}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative h-[460px] md:h-[520px] lg:h-[560px] rounded-3xl border border-white/10"
        >

          <div className="absolute inset-0 bg-gradient-to-r from-[#071B3A]/70 to-transparent z-10"></div>

          <Image
  src="/images/hero-clean.png"
  alt="Corporate Uniform Manufacturing"
  fill
  priority
  sizes="(max-width: 768px) 100vw, 50vw"
  className="object-cover rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.7)]"
/>

        </motion.div>

      </div>
    </section>
  );
}