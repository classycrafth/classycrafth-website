"use client";

import { motion } from "framer-motion";

export default function Process() {
  const steps = [
    {
      title: "Consultation",
      desc: "Understanding your uniform requirements, branding needs, and order scale."
    },
    {
      title: "Design",
      desc: "Creating modern uniform concepts aligned with your brand identity."
    },
    {
      title: "Sampling",
      desc: "Developing sample uniforms for approval before full production."
    },
    {
      title: "Production",
      desc: "Large-scale manufacturing with strict quality control."
    },
    {
      title: "Delivery",
      desc: "Reliable PAN-India delivery for institutions and organizations."
    }
  ];

  return (
    <section className="bg-gray-50 py-24 px-6">
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
            Our Manufacturing Process
          </h2>

          <p className="mt-6 text-gray-600 text-lg">
            Our streamlined production process ensures consistent quality,
            timely delivery, and scalable manufacturing for bulk uniform orders.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-5 gap-10 mt-16">

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >

              {/* Circle Number */}
              <div className="w-14 h-14 mx-auto rounded-full bg-black text-white flex items-center justify-center font-semibold text-lg">
                {index + 1}
              </div>

              {/* Title */}
              <h3 className="mt-6 font-semibold text-lg">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-gray-500 text-sm mt-3 leading-relaxed">
                {step.desc}
              </p>

            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}