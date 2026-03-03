export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-800 pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto text-center">

        <h1 className="text-5xl font-bold text-blue-900 mb-6">
          About Us
        </h1>

        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Classy Crafth is dedicated to delivering high-quality handcrafted
          products with elegance, precision, and creativity.
        </p>

      </div>

      {/* Mission & Vision Section */}
      <div className="max-w-6xl mx-auto mt-20 grid md:grid-cols-2 gap-12 px-6">

        <div className="bg-white p-10 rounded-2xl shadow-lg hover:shadow-xl transition">
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Our mission is to create premium handcrafted products that
            combine beauty with functionality while maintaining the highest
            quality standards.
          </p>
        </div>

        <div className="bg-white p-10 rounded-2xl shadow-lg hover:shadow-xl transition">
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">
            Our Vision
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We aim to become a trusted brand known for innovation,
            craftsmanship, and customer satisfaction.
          </p>
        </div>

      </div>
    </main>
  );
}