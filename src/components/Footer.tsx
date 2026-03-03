export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-14 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">

        {/* Company Info */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">
            ClassyCrafth
          </h3>
          <p className="text-sm leading-relaxed">
            Premium Corporate & School Uniform Manufacturer.
            Bulk production, custom branding, and trusted supply
            partner across India.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#products" className="hover:text-white">Products</a></li>
            <li><a href="#contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-white font-semibold mb-4">Contact</h4>
          <p className="text-sm">Email: info@classycrafth.com</p>
          <p className="text-sm">Phone: +91 91516135516</p>
          <p className="text-sm">India</p>
        </div>

      </div>

      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} ClassyCrafth. All rights reserved.
      </div>
    </footer>
  );
}