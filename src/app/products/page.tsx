"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

type Product = {
  title: string;
  category: "Uniform" | "Gifts";
  desc: string;
  image: string;
  href?: string;
};

export default function ProductsPage() {
  const [filter, setFilter] = useState<"All" | "Uniform" | "Gifts">("All");

  const products: Product[] = [
    {
      title: "Corporate Uniform",
      category: "Uniform",
      desc: "Premium uniforms designed for corporate teams and office environments.",
      image: "/images/corporate.jpg",
      href: "/products/corporate-uniform",
    },
    {
      title: "School Uniform",
      category: "Uniform",
      desc: "Comfortable and durable uniforms designed for daily school wear.",
      image: "/images/school.jpg",
    },
    {
      title: "Industrial Uniform",
      category: "Uniform",
      desc: "Heavy-duty uniforms for industrial work environments.",
      image: "/images/industrial.jpg",
    },
    {
      title: "Corporate Gifts",
      category: "Gifts",
      desc: "Custom branded apparel and corporate gifting solutions.",
      image: "/images/gifts.jpg",
    },
  ];

  const filtered =
    filter === "All"
      ? products
      : products.filter((p) => p.category === filter);

  return (
    <main className="bg-white text-gray-800">
      <Navbar />

      {/* HERO */}
      <section className="pt-32 pb-12 px-6 bg-gradient-to-b from-gray-50 via-white to-white text-center relative overflow-hidden">

        <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto relative"
        >
          <h1 className="text-4xl md:text-5xl font-bold">
            Our Product Range
          </h1>

          <p className="mt-6 text-gray-600 text-lg">
            Explore our collection of corporate uniforms, school uniforms,
            industrial apparel, and branded corporate gifts.
          </p>
        </motion.div>

        {/* FILTER */}
        <div className="flex justify-center gap-4 mt-10 flex-wrap relative">

          {["All", "Uniform", "Gifts"].map((cat) => (
            <button
              key={cat}
              onClick={() =>
                setFilter(cat as "All" | "Uniform" | "Gifts")
              }
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                filter === cat
                  ? "bg-black text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}

        </div>
      </section>

      {/* PRODUCTS GRID */}
      <section className="py-14 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-10">

          {filtered.map((product, index) => {
            const cardContent = (
              <>
                <div className="relative h-60 overflow-hidden group">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes="(max-width:768px)100vw,25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                <div className="p-6">

                  <h3 className="font-semibold text-lg">
                    {product.title}
                  </h3>

                  <p className="text-gray-600 text-sm mt-3 leading-relaxed">
                    {product.desc}
                  </p>

                  <span className="inline-block mt-5 text-sm font-semibold text-black">
                    View Details →
                  </span>

                </div>
              </>
            );

            if (product.href) {
              return (
                <Link
                  href={product.href}
                  key={product.title}
                  className="block cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
                >
                  {cardContent}
                </Link>
              );
            }

            return (
              <div
                key={product.title}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
              >
                {cardContent}
              </div>
            );
          })}

        </div>
      </section>

      <Footer />
    </main>
  );
}