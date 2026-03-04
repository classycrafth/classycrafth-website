"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function Contact() {
  const [qtyCalc, setQtyCalc] = useState<number>(100);
  const pricePerUnit = 450;
  const estimate = qtyCalc * pricePerUnit;

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const form = e.currentTarget;

    const name = form.name.value;
    const company = form.company.value;
    const phone = form.phone.value;
    const qty = form.qty.value;
    const message = form.message.value;

    const text = `
Hello ClassyCrafth

Name: ${name}
Company: ${company}
Phone: ${phone}
Quantity: ${qty}

Requirement:
${message}
`;

    /* WHATSAPP */
    const whatsappURL =
      "https://wa.me/919201633665?text=" + encodeURIComponent(text);

    window.open(whatsappURL, "_blank");

    /* EMAIL */
    const emailSubject = "New Bulk Uniform Inquiry - ClassyCrafth";

    const emailBody = encodeURIComponent(text);

    window.location.href = `mailto:nrenterprises2349@gmail.com?subject=${emailSubject}&body=${emailBody}`;

    form.reset();
  };

  return (
    <section id="contact" className="bg-gray-50 py-24 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">

        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-10"
        >
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
              <p>📞 +91 92016 33665</p>
              <p>📧 nrenterprises2349@gmail.com</p>
              <p>📍 PAN India Manufacturing & Delivery</p>
            </div>
          </div>

          {/* QUOTE CALCULATOR */}
          <div className="bg-white rounded-2xl p-8 shadow-md">
            <h3 className="text-2xl font-semibold">
              Quick Quote Estimate
            </h3>

            <p className="text-gray-600 mt-3">
              Enter approximate quantity to estimate manufacturing cost.
            </p>

            <input
              type="number"
              value={qtyCalc}
              onChange={(e) => setQtyCalc(Number(e.target.value))}
              className="mt-6 w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-black"
            />

            <div className="mt-6 text-xl font-semibold">
              Estimated Cost: ₹{estimate.toLocaleString()}
            </div>

            <p className="text-sm text-gray-500 mt-2">
              Final pricing may vary depending on fabric and customization.
            </p>
          </div>
        </motion.div>

        {/* FORM */}
        <motion.form
          onSubmit={handleSubmit}
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
            required
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
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-black"
          />

          <input
            name="qty"
            type="number"
            placeholder="Estimated Quantity"
            required
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