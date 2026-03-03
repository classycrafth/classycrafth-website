export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-gray-800 pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold mb-6 text-center">
          About Us
        </h1>

        <p className="text-lg leading-relaxed text-center mb-10">
          Classy Crafth is dedicated to delivering high-quality handcrafted
          products with elegance, precision, and creativity.
        </p>

        <div className="grid md:grid-cols-2 gap-10 mt-10">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p>
              Our mission is to create premium handcrafted products that
              combine beauty with functionality while maintaining the highest
              quality standards.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
            <p>
              We aim to become a trusted brand known for innovation,
              craftsmanship, and customer satisfaction.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}