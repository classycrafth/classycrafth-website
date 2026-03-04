"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function Contact() {
  const [qty, setQty] = useState<number>(100);
  const pricePerUnit = 450;
  const estimate = qty * pricePerUnit;

  return (
    <section id="contact" className="bg-gray-50 py-24 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">

        {/* LEFT SIDE */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-10"
        >
          {/* Contact Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Request a Bulk Quote
            </h2>

            <p className="mt-6 text-gray-600 text-lg leading-relaxed">
              Looking for high-quality corporate or school uniforms?
              Share your requirements and our team will get back to you
              with the best manufacturing solution.
            </p>

            <div className="mt-8 space-y-4 text-gray-600">
              <p>📞 +91 91516 135516</p>
              <p>📧 contact@classycrafth.com</p>
              <p>📍 PAN India Manufacturing & Delivery</p>
            </div>
          </div>

          {/* Quote Calculator */}
          <div className="bg-white rounded-2xl p-8 shadow-md">
            <h3 className="text-2xl font-semibold">Quick Quote Estimate</h3>

            <p className="text-gray-600 mt-3">
              Enter approximate quantity to estimate manufacturing cost.
            </p>

            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="mt-6 w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-black"
              placeholder="Quantity"
            />

            <div className="mt-6 text-xl font-semibold">
              Estimated Cost: ₹{estimate.toLocaleString()}
            </div>

            <p className="text-sm text-gray-500 mt-2">
              Final pricing may vary depending on fabric and customization.
            </p>
          </div>
        </motion.div>

        {/* CONTACT FORM */}
        <motion.form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;

            const name = (form.elements.namedItem("name") as HTMLInputElement).value;
            const company = (form.elements.namedItem("company") as HTMLInputElement).value;
            const phone = (form.elements.namedItem("phone") as HTMLInputElement).value;
            const qty = (form.elements.namedItem("qty") as HTMLInputElement).value;
            const msg = (form.elements.namedItem("message") as HTMLTextAreaElement).value;

            const text =
              `Hello ClassyCrafth,%0A` +
              `Name: ${encodeURIComponent(name)}%0A` +
              `Company: ${encodeURIComponent(company)}%0A` +
              `Phone: ${encodeURIComponent(phone)}%0A` +
              `Quantity: ${encodeURIComponent(qty)}%0A` +
              `Requirement: ${encodeURIComponent(msg)}`;

            window.open(
              `https://wa.me/9191516135516?text=${text}`,
              "_blank"
            );
          }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-10 shadow-md space-y-6"
        >
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-black"
          />

          <input
            name="company"
            type="text"
            placeholder="Company / Organization"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-black"
          />

          <input
            name="phone"
            type="tel"
            placeholder="Phone Number"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-black"
          />

          <input
            name="qty"
            type="number"
            placeholder="Estimated Quantity"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-black"
          />

          <textarea
            name="message"
            rows={4}
            placeholder="Tell us about your uniform requirement"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-black"
          ></textarea>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Submit Requirement
          </button>
        </motion.form>

      </div>
    </section>
  );
}