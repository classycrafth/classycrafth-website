"use client";

import { motion } from "framer-motion";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Rajiv Sharma",
      role: "HR Manager – TechCorp",
      text: "ClassyCrafth delivered excellent corporate uniforms with great fabric quality and perfect stitching. Their team handled our bulk order professionally.",
    },
    {
      name: "Anita Verma",
      role: "School Administrator – Sunrise School",
      text: "We partnered with ClassyCrafth for our school uniforms and the results were outstanding. The students love the comfort and durability.",
    },
    {
      name: "Vikram Mehta",
      role: "Operations Head – Metro Logistics",
      text: "Reliable supplier for industrial uniforms. Timely delivery and consistent quality for large production orders.",
    },
  ];

  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            What Our Clients Say
          </h2>

          <p className="mt-6 text-gray-600 text-lg">
            Organizations across India trust ClassyCrafth for reliable
            uniform manufacturing and bulk production quality.
          </p>
        </motion.div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-10 mt-16">

          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-2xl p-8 shadow-sm hover:shadow-lg transition"
            >

              {/* Stars */}
              <div className="text-yellow-500 text-lg mb-4">
                ★★★★★
              </div>

              {/* Review */}
              <p className="text-gray-600 leading-relaxed">
                {item.text}
              </p>

              {/* Client */}
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900">
                  {item.name}
                </h4>
                <p className="text-sm text-gray-500">
                  {item.role}
                </p>
              </div>

            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}