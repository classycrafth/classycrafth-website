"use client";

import Image from "next/image";
import Link from "next/link";

export default function ProductsPreview() {
  const products = [
    { img: "/images/formal-blazers.jpg", title: "Corporate Uniforms" },
    { img: "/images/industrial-uniform.jpg", title: "Industrial Uniforms" },
    { img: "/images/security-uniform.jpg", title: "Security Uniforms" },
    { img: "/images/housekeeping-uniform.jpg", title: "Housekeeping Uniforms" },
  ];

  return (
    <section className="bg-[#0f172a] text-white py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16">
          Our Product Range
        </h2>

        <div className="grid md:grid-cols-4 gap-8">
          {products.map((item, index) => (
            <div
              key={index}
              className="relative group overflow-hidden rounded-2xl border border-white/10"
            >
              <Image
                src={item.img}
                alt={item.title}
                width={400}
                height={500}
                className="object-cover h-[350px] w-full group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/50 flex items-end p-6">
                <h3 className="text-xl font-semibold">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/products"
            className="bg-white text-black px-8 py-3 rounded-xl font-semibold hover:scale-105 transition"
          >
            View Full Collection
          </Link>
        </div>
      </div>
    </section>
  );
}