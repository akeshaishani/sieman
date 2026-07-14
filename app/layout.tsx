import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sieman Jems & Jewellery - Premium Sapphires & Fine Jewelry in Sri Lanka",
  description:
    "Discover exquisite handcrafted jewelry and finest quality Sri Lankan sapphires. Sieman offers custom-designed rings, earrings, pendants, and bracelets with authentic gemstones.",
  keywords: [
    "Sieman Jewellery",
    "Sieman Gems",
    "Sri Lanka Sapphire",
    "Ceylon Sapphire",
    "Blue Sapphire Sri Lanka",
    "Yellow Sapphire",
    "Pink Sapphire",
    "White Sapphire",
    "Padparadscha Sapphire",
    "Natural Gemstones Sri Lanka",
    "Certified Gemstones",
    "Fine Jewelry Sri Lanka",
    "Custom Jewelry Design",
    "Handcrafted Jewelry",
    "Luxury Jewelry",
    "Sapphire Rings",
    "Sapphire Earrings",
    "Sapphire Pendants",
    "Sapphire Bracelets",
    "Sapphire Necklace",
    "Engagement Rings Sri Lanka",
    "Wedding Rings",
    "Diamond Jewelry",
    "Gold Jewelry",
    "Platinum Jewelry",
    "Sterling Silver Jewelry",
    "Gemstone Jewelry",
    "Precious Stones",
    "Semi-Precious Stones",
    "Ruby Jewelry",
    "Emerald Jewelry",
    "Birthstone Jewelry",
    "Custom Ring Design",
    "Bespoke Jewelry",
    "Jewelry Designer Sri Lanka",
    "Certified Sapphires",
    "Natural Sapphires",
    "Unheated Sapphires",
    "Treated Sapphires",
    "Gemstone Certification",
    "GIA Certified Gems",
    "IGI Certified Gems",
    "Jewelry Store Sri Lanka",
    "Online Jewelry Store",
    "Buy Sapphires Online",
    "Sapphire Dealers Sri Lanka",
    "Gem Suppliers",
    "Wholesale Gemstones",
    "Retail Jewelry",
    "Luxury Gems",
    "High-End Jewelry",
    "Designer Jewelry",
    "Artisan Jewelry",
    "Bridal Jewelry",
    "Anniversary Gifts",
    "Jewelry Gifts",
    "Men's Jewelry",
    "Women's Jewelry",
    "Unisex Jewelry",
    "Fashion Jewelry",
    "Statement Jewelry",
    "Minimalist Jewelry",
    "Vintage Jewelry",
    "Contemporary Jewelry",
    "Traditional Jewelry",
    "Ethnic Jewelry",
    "Sri Lankan Craftsmanship",
    "Jewelry Appraisal",
    "Gem Cutting",
    "Gem Polishing",
    "Jewelry Repair",
    "Ring Resizing",
    "Jewelry Cleaning",
    "Gem Testing",
    "Ratnapura Gems",
    "Colombo Jewelry",
    "Sri Lanka Jewelry Export",
    "International Shipping Jewelry",
    "Secure Jewelry Delivery",
    "Jewelry Investment",
    "Collectible Gems",
    "Rare Gemstones",
    "Ethical Sourcing",
    "Conflict-Free Gems",
    "Sustainable Jewelry",
    "Eco-Friendly Jewelry",
    "Fair Trade Gemstones",
    "Custom Order Jewelry",
    "Personalized Jewelry",
    "Engraved Jewelry",
    "Jewelry Consultation",
    "Virtual Jewelry Tour",
    "Jewelry Collection",
    "Sieman",
  ],
  authors: [{ name: "Sieman Jems & Jewellery", url: "https://sieman.lk" }],
  creator: "Sieman Jems & Jewellery",
  publisher: "Sieman Jems & Jewellery",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://sieman.lk"),
  openGraph: {
    title: "Sieman Jems & Jewellery - Premium Sri Lankan Sapphires",
    description:
      "Discover exquisite handcrafted jewelry and finest quality Sri Lankan sapphires. Custom designs, certified gemstones, and luxury jewelry.",
    url: "https://sieman.lk",
    siteName: "Sieman Jems & Jewellery",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/images/og-homepage.jpg",
        width: 1200,
        height: 630,
        alt: "Sieman Jems & Jewellery - Premium Sri Lankan Sapphires",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@siemanjewellery",
    creator: "@siemanjewellery",
    title: "Sieman Jems & Jewellery - Sri Lankan Sapphires",
    description:
      "Exquisite handcrafted jewelry and finest quality Sri Lankan sapphires. Custom designs and certified gemstones.",
    images: [
      {
        url: "/images/og-homepage.jpg",
        alt: "Sieman Jems & Jewellery - Premium Sapphires",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://sieman.lk",
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* 🟢 Favicon & Mobile Theme Color */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* 🟢 Improved JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "JewelryStore",
              name: "Sieman Jems & Jewellery",
              alternateName: "Sieman",
              url: "https://sieman.lk",
              logo: "https://sieman.lk/images/logo/logo.svg",
              image: "https://sieman.lk/images/og-homepage.jpg",
              description:
                "Premium Sri Lankan sapphires and exquisite handcrafted jewelry. Specializing in blue, yellow, pink, and white sapphires with custom jewelry design services.",
              address: {
                "@type": "PostalAddress",
                addressCountry: "LK",
                addressLocality: "Sri Lanka",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: "7.8731",
                longitude: "80.7718",
              },
              priceRange: "$$$",
              currenciesAccepted: "USD, LKR",
              paymentAccepted: "Credit Card, Debit Card, Bank Transfer, PayPal",
              openingHours: "Mo-Sa 09:00-18:00",
              telephone: "+94-XX-XXX-XXXX",
              email: "info@sieman.lk",
              sameAs: [
                "https://facebook.com/siemanjewellery",
                "https://instagram.com/siemanjewellery",
                "https://twitter.com/siemanjewellery",
              ],
              areaServed: {
                "@type": "Country",
                name: "Worldwide",
              },
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Jewelry & Gemstones",
                itemListElement: [
                  {
                    "@type": "OfferCatalog",
                    name: "Sapphires",
                    itemListElement: [
                      {
                        "@type": "Offer",
                        itemOffered: {
                          "@type": "Product",
                          name: "Blue Sapphire",
                          description: "Premium quality Ceylon blue sapphires",
                        },
                      },
                      {
                        "@type": "Offer",
                        itemOffered: {
                          "@type": "Product",
                          name: "Yellow Sapphire",
                          description: "Natural yellow sapphires from Sri Lanka",
                        },
                      },
                      {
                        "@type": "Offer",
                        itemOffered: {
                          "@type": "Product",
                          name: "Pink Sapphire",
                          description: "Elegant pink sapphires",
                        },
                      },
                    ],
                  },
                  {
                    "@type": "OfferCatalog",
                    name: "Jewelry",
                    itemListElement: [
                      {
                        "@type": "Offer",
                        itemOffered: {
                          "@type": "Product",
                          name: "Rings",
                          description: "Custom designed sapphire rings",
                        },
                      },
                      {
                        "@type": "Offer",
                        itemOffered: {
                          "@type": "Product",
                          name: "Earrings",
                          description: "Handcrafted gemstone earrings",
                        },
                      },
                      {
                        "@type": "Offer",
                        itemOffered: {
                          "@type": "Product",
                          name: "Pendants",
                          description: "Elegant gemstone pendants",
                        },
                      },
                      {
                        "@type": "Offer",
                        itemOffered: {
                          "@type": "Product",
                          name: "Bracelets",
                          description: "Luxury gemstone bracelets",
                        },
                      },
                    ],
                  },
                ],
              },
              knowsAbout: [
                "Ceylon Sapphires",
                "Gemstone Certification",
                "Custom Jewelry Design",
                "Fine Jewelry",
                "Precious Gemstones",
              ],
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                reviewCount: "150",
              },
            }),
          }}
        />

        {/* Google Tag Manager - gtag.js */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-17ER9TSMQN"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-17ER9TSMQN');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
