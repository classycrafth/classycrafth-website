export default function Contact() {
  return (
    <section id="contact" className="bg-blue-900 text-white py-20 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">
          Contact us for quotation & samples
        </h2>

        <form className="space-y-4">
          <input
            type="text"
            placeholder="Company Name"
            className="w-full p-3 rounded-lg text-black"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg text-black"
          />
          <textarea
            placeholder="Requirement Details"
            className="w-full p-3 rounded-lg text-black"
          />
          <button className="bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold">
            Submit Inquiry
          </button>
        </form>
      </div>
    </section>
  );
}