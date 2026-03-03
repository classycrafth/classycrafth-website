"use client";

import { motion } from "framer-motion";

export default function Stats() {
  const stats = [
    { number: "10+", label: "Years Experience" },
    { number: "500+", label: "Corporate Clients" },
    { number: "1L+", label: "Uniforms Delivered" },
    { number: "25+", label: "Cities Served" },
  ];

  return (
    <section className="bg-[#0b1324] text-white py-20 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10 text-center">
        {stats.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <h3 className="text-4xl font-bold">{item.number}</h3>
            <p className="text-gray-400 mt-2">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}