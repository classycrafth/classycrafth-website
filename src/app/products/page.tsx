"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

type Product = {
  title: string;
  category: "Uniform" | "Gifts";
  desc: string;
  image: string;
};

export default function ProductsPage() {
  const [filter, setFilter] = useState<"All" | "Uniform" | "Gifts">("All");
  const [selected, setSelected] = useState<Product | null>(null);

  const products: Product[] = [
    {
      title: "Corporate Uniform",
      category: "Uniform",
      desc: "Premium uniforms designed for corporate teams and office environments.",
      image: "/images/corporate.jpg",
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
    filter === "All" ? products : products.filter((p) => p.category === filter);

  return (
    <main className="bg-white text-gray-800">
      <Navbar />

      {/* HERO */}
      <section className="pt-32 pb-12 px-6 bg-gradient-to-b from-gray-50 via-white to-white text-center relative overflow-hidden">

        <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full"></div>

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
              onClick={() => setFilter(cat as "All" | "Uniform" | "Gifts")}
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
          {filtered.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              onClick={() => setSelected(product)}
              className="cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
            >
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
                <h3 className="font-semibold text-lg">{product.title}</h3>

                <p className="text-gray-600 text-sm mt-3 leading-relaxed">
                  {product.desc}
                </p>

                <span className="inline-block mt-5 text-sm font-semibold text-black hover:underline">
                  View Details →
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* MODAL */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-72">
                <Image
                  src={selected.image}
                  alt={selected.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-8">
                <h2 className="text-2xl font-bold">{selected.title}</h2>

                <p className="text-gray-600 mt-4">{selected.desc}</p>

                {/* Only for Uniform */}
                {selected.category === "Uniform" && (
                  <>
                    <div className="mt-6">
                      <h4 className="font-semibold">Fabric Options</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Cotton • Poly Cotton • Polyester Blend
                      </p>
                    </div>

                    <div className="mt-4">
                      <h4 className="font-semibold">Available Sizes</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        S • M • L • XL • XXL • Custom Sizes
                      </p>
                    </div>

                    <div className="mt-4">
                      <h4 className="font-semibold">Color Options</h4>

                      <div className="flex gap-2 mt-2">
                        <span className="w-6 h-6 rounded-full bg-gray-800"></span>
                        <span className="w-6 h-6 rounded-full bg-blue-600"></span>
                        <span className="w-6 h-6 rounded-full bg-green-600"></span>
                        <span className="w-6 h-6 rounded-full bg-red-600"></span>
                      </div>
                    </div>
                  </>
                )}

                <a
                  href={`https://wa.me/919201633665?text=Hello%20ClassyCrafth%2C%20I%20am%20interested%20in%20${encodeURIComponent(selected.title)}.`}
                  target="_blank"
                  className="inline-block mt-8 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
                >
                  Request Quote on WhatsApp
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}