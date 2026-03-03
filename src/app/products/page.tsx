import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function ProductsPage() {
  const corporateProducts = [
    { name: "Corporate Shirts", image: "/images/corporate-shirts.jpg" },
    { name: "Office Trousers", image: "/images/office-trousers.jpg" },
    { name: "Formal Blazers", image: "/images/formal-blazers.jpg" },
    { name: "Industrial Uniforms", image: "/images/industrial-uniform.jpg" },
    { name: "Security Uniforms", image: "/images/security-uniform.jpg" },
    { name: "Housekeeping Uniforms", image: "/images/housekeeping-uniform.jpg" },
  ];

  return (
    <main className="bg-white text-gray-800">
      <Navbar />

      {/* HEADER */}
      <section className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white pt-40 pb-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">
          Product Catalog
        </h1>
        <p className="mt-4 text-gray-200">
          Corporate Uniforms | School Uniforms | Corporate Gifts
        </p>
      </section>

      {/* CORPORATE UNIFORMS */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-10">
            Corporate Uniform Collection
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {corporateProducts.map((product, index) => (
              <a
  key={index}
  href={`https://wa.me/9191516135516?text=Hello, I would like to request a quotation for ${product.name}. Please share bulk pricing and customization details.`}
  target="_blank"
  rel="noopener noreferrer"
  className="group relative overflow-hidden rounded-2xl cursor-pointer"
>
  {/* IMAGE */}
  <div className="relative h-72 w-full">
    <Image
      src={product.image}
      alt={product.name}
      fill
      className="object-cover transition duration-500 group-hover:scale-110"
    />

    {/* DARK OVERLAY */}
    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition duration-500"></div>

    {/* TEXT OVER IMAGE */}
    <div className="absolute bottom-6 left-6 text-white">
      <h3 className="text-xl font-semibold tracking-wide">
        {product.name}
      </h3>
      <p className="text-sm text-gray-300 mt-1 opacity-0 group-hover:opacity-100 transition duration-500">
        Request Bulk Quotation →
      </p>
    </div>
  </div>
</a>
            ))}
          </div>
        </div>
      </section>

      {/* SCHOOL UNIFORMS */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-10">
            School Uniform Collection
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              "School Shirts",
              "Trousers & Skirts",
              "Blazers & Sweaters",
              "Sports Uniforms",
              "Winter Uniforms",
              "House T-Shirts",
            ].map((item, index) => (
              <a
                key={index}
                href={`https://wa.me/9191516135516?text=Hello, I am interested in ${item} bulk order. Please share details.`}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white h-64 rounded-2xl flex flex-col items-center justify-center shadow-md hover:shadow-2xl transition duration-300 cursor-pointer border border-gray-100 hover:-translate-y-1 block"
              >
                <span className="text-gray-700 font-medium group-hover:text-blue-900 transition">
                  {item}
                </span>
                <span className="mt-3 text-sm text-gray-400 group-hover:text-blue-700 transition">
                  Durable & Comfortable Fabric
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CORPORATE GIFTS */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-10">
            Corporate Gift Collection
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              "Custom T-Shirts",
              "Bags & Backpacks",
              "Caps",
              "Diaries",
              "Gift Sets",
              "Promotional Kits",
            ].map((item, index) => (
              <a
                key={index}
                href={`https://wa.me/9191516135516?text=Hello, I am interested in ${item} bulk order. Please share customization details.`}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white h-64 rounded-2xl flex flex-col items-center justify-center shadow-md hover:shadow-2xl transition duration-300 cursor-pointer border border-gray-100 hover:-translate-y-1 block"
              >
                <span className="text-gray-700 font-medium group-hover:text-blue-900 transition">
                  {item}
                </span>
                <span className="mt-3 text-sm text-gray-400 group-hover:text-blue-700 transition">
                  Custom Branding Available
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}