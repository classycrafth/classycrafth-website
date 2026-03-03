export default function Process() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto text-center">

        <h2 className="text-3xl font-bold mb-12">
          Our Manufacturing Process
        </h2>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            "Requirement Analysis",
            "Fabric Sourcing",
            "Production & Stitching",
            "Quality Check & Dispatch",
          ].map((step, index) => (
            <div key={index} className="p-6 bg-gray-50 rounded-2xl shadow-sm">
              <h3 className="text-lg font-bold text-blue-900 mb-3">
                0{index + 1}. {step}
              </h3>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}