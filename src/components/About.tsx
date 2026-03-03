import Image from "next/image";

export default function About() {
  return (
    <section className="py-24 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">

        <div>
          <h2 className="text-3xl font-bold mb-6">
            About ClassyCrafth
          </h2>

          <p className="text-gray-600 leading-relaxed mb-6">
            We specialize in bulk corporate uniforms, school uniforms,
            and customized corporate gifts with strict quality control
            and brand-focused production.
          </p>

          <div className="grid grid-cols-2 gap-6 mt-8">
            <div>
              <h3 className="text-xl font-bold text-blue-900">5000+</h3>
              <p className="text-sm text-gray-500">Units Monthly Capacity</p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-blue-900">Pan India</h3>
              <p className="text-sm text-gray-500">Bulk Supply Network</p>
            </div>
          </div>
        </div>

        <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-xl">
          <Image
            src="/images/factory.jpg"
            alt="Indian Uniform Manufacturing Factory"
            fill
            className="object-cover"
          />
        </div>

      </div>
    </section>
  );
}