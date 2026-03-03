export default function Testimonials() {
  return (
    <section className="py-24 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto text-center">

        <h2 className="text-3xl font-bold mb-12">
          What Our Clients Say
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            "Excellent stitching quality and timely delivery.",
            "Highly reliable school uniform production.",
            "Impressive corporate gift branding.",
          ].map((text, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-lg">
              <p className="text-gray-600 text-sm">{text}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}