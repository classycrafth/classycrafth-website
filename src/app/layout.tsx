import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ClassyCrafth | Corporate & School Uniform Manufacturer India",
  description:
    "Premium corporate uniform manufacturer, school uniform supplier, and corporate gift supplier in India. Bulk production, custom branding, quality assurance and timely delivery.",
  keywords: [
    "Corporate Uniform Manufacturer",
    "School Uniform Manufacturer",
    "Corporate Gifts Supplier",
    "Bulk Uniform Supplier India",
    "Custom Corporate Uniforms",
    "School Dress Manufacturer"
  ],
  openGraph: {
    title: "ClassyCrafth | Premium Uniform Manufacturer",
    description:
      "Bulk corporate and school uniform manufacturing with quality control and custom branding solutions.",
    url: "https://classycrafth.com",
    siteName: "ClassyCrafth",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "ClassyCrafth",
    image: "https://classycrafth.com/logo.png",
    url: "https://classycrafth.com",
    telephone: "+91-91516135516",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN"
    },
    areaServed: "India",
    sameAs: [
      "https://wa.me/9191516135516"
    ]
  };

  return (
    <html lang="en" className="scroll-smooth">
      <body className="scroll-smooth">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        {children}
      </body>
    </html>
  );
}