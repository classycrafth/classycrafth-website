export default function WhyChooseUs() {
  const points = [
    "In-house Manufacturing Facility",
    "Premium Fabric Selection",
    "Strict Quality Control",
    "Bulk Order Specialists",
    "On-Time PAN India Delivery",
    "Custom Branding & Embroidery",
  ];

  return (
    <section className="bg-[#0b1324] text-white py-24 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-12">Why Choose ClassyCrafth</h2>

        <div className="grid md:grid-cols-2 gap-8 text-left">
          {points.map((item, index) => (
            <div
              key={index}
              className="p-6 border border-white/10 rounded-xl"
            >
              ✔ {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}