"use client";

export default function Contact() {
  return (
    <section className="bg-white text-gray-800 py-28 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-blue-900 mb-4">
            Contact Us
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Let’s discuss your bulk uniform or corporate gift requirements.
            We ensure quality, customization, and timely delivery.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">

          {/* Contact Info */}
          <div className="bg-gray-50 p-10 rounded-3xl shadow-md">
            <h3 className="text-2xl font-semibold text-blue-900 mb-6">
              Get in Touch
            </h3>

            <div className="space-y-4 text-gray-700">
              <p>
                <strong>Email:</strong> info@classycrafth.com
              </p>
              <p>
                <strong>Phone:</strong> +91 91516135516
              </p>
              <p>
                <strong>Location:</strong> India
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-blue-900 text-white p-10 rounded-3xl shadow-lg flex flex-col justify-center">
            <h3 className="text-2xl font-semibold mb-6">
              Need a Bulk Quote?
            </h3>

            <p className="text-gray-200 mb-8">
              Click below to chat directly on WhatsApp and get faster
              response for your bulk order requirements.
            </p>

            <a
              href="https://wa.me/9191516135516"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-blue-900 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition duration-300 text-center"
            >
              Chat on WhatsApp
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}