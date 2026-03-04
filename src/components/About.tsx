"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <section
      id="about"
      className="bg-white text-gray-800 py-24 px-6"
    >
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            About ClassyCrafth
          </h2>

          <p className="mt-6 text-gray-600 leading-relaxed text-lg">
            ClassyCrafth is a trusted manufacturer of corporate uniforms,
            school uniforms, and branded apparel solutions across India.
            Our focus is on premium fabric quality, precise tailoring,
            and scalable bulk production for institutions and organizations.
          </p>

          <p className="mt-4 text-gray-600 leading-relaxed">
            From design consultation to final delivery, our production
            process ensures durability, consistency, and brand alignment
            for every client.
          </p>
        </motion.div>

        {/* Trust Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-10 mt-16 text-center"
        >

          <div>
            <h3 className="text-4xl font-bold text-black">500+</h3>
            <p className="text-gray-500 mt-2">Corporate Clients</p>
          </div>

          <div>
            <h3 className="text-4xl font-bold text-black">2M+</h3>
            <p className="text-gray-500 mt-2">Uniforms Manufactured</p>
          </div>

          <div>
            <h3 className="text-4xl font-bold text-black">15+</h3>
            <p className="text-gray-500 mt-2">Years Experience</p>
          </div>

          <div>
            <h3 className="text-4xl font-bold text-black">PAN India</h3>
            <p className="text-gray-500 mt-2">Supply Network</p>
          </div>

        </motion.div>

      </div>
    </section>
  );
}