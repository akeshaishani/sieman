"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/shared/layouts/main-layout";
import { API_ENDPOINTS, API_HEADERS } from "@/shared/config/api";
import { IoArrowForward } from "react-icons/io5";
import { useCategories } from "@/shared/hooks/useCategories";
import Link from "next/link";
import { FaPhone } from "react-icons/fa6";

interface Email {
  type: string;
  emailAddress: string;
  id: string;
}

interface ContactNumber {
  type: string;
  number: string;
  id: string;
}

interface SocialMedia {
  icon: string;
  id: string;
  platform: string;
  url: string;
}

interface CompanyRecord {
  emails: Email[];
  address: string;
  contactNumbers: ContactNumber[];
  companyName: string;
  id: string;
  socialMedia: SocialMedia[];
  shortDescrption: string;
}

interface ApiResponse {
  message: string;
  collectionId: string;
  collectionName: string;
  records: CompanyRecord[];
  totalRecords: number;
}

export default function HomePage() {
  const [companyDetails, setCompanyDetails] = useState<CompanyRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { categories, isLoading: categoriesLoading } = useCategories();

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        setIsLoading(true);

        console.log("Fetching company details from:", API_ENDPOINTS.COMPANY_DETAILS);

        const response = await fetch(API_ENDPOINTS.COMPANY_DETAILS, {
          method: "GET",
          headers: API_HEADERS,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();

        console.log("Company details fetched:", data);

        // Extract first record from the records array
        if (data.records && data.records.length > 0) {
          setCompanyDetails(data.records[0]);
        }
      } catch (error) {
        console.error("Error fetching company details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyDetails();
  }, []);

  function formatLKPhone(phone: string): string {
    const cleaned = phone.replace(/[^\d+]/g, "");
    const match = cleaned.match(/^\+94(\d{2})(\d{3})(\d{4})$/);
    if (match) {
      return `0${match[1]} ${match[2]} ${match[3]}`;
    }
    return phone;
  }

  // Extract primary email and phone number
  const primaryEmail = companyDetails?.emails?.find(e => e.type === "primary");
  const email = primaryEmail?.emailAddress || undefined;
  const primaryPhone = companyDetails?.contactNumbers?.find(c => c.type === "primary");
  const phone = primaryPhone?.number;

  return (
    <MainLayout
      email={email}
      phone={phone}
      description={companyDetails?.shortDescrption}
      socialLinks={companyDetails?.socialMedia}
      isLoading={isLoading}
    >
      <div className="bg-cover min-h-[450px] sm:min-h-[550px] md:min-h-[650px] lg:min-h-[750px] bg-center bg-no-repeat text-white" style={{ backgroundImage: "url('/images/home/hero.jpg')" }}>
        <div className="w-full min-h-[450px] sm:min-h-[550px] md:min-h-[650px] flex flex-col lg:flex-row justify-center lg:justify-between items-center max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-12 sm:py-16 md:py-20 gap-8 lg:gap-12">
          <div className="max-w-2xl text-center lg:text-left w-full">
            <h1 className="font-['Playfair_Display'] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mt-8 sm:mt-0">
              <span className="block">Timeless beauty and</span>
              <span className="block text-blue-100 mt-2">Elegance crafted<br />
                Just for you</span>
            </h1>
            <p className="mt-6 sm:mt-7 md:mt-8 text-gray-100 text-base sm:text-lg leading-relaxed max-w-lg font-light">
              Sieman’s craftsmanship and Sri Lanka’s gem heritage, a blend that writes your story- capturing your emotions, style and elegance.
            </p>
            <div className="mt-8 sm:mt-10 md:mt-12 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Link href="/custom-order" className="px-6 py-3 sm:px-8 sm:py-4 rounded-lg text-sm sm:text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all shadow-xl hover:shadow-2xl hover:scale-105 transform text-center">
                Start Your Custom Order
              </Link>
              <Link href="/collection" className="px-6 py-3 sm:px-8 sm:py-4 rounded-lg text-sm sm:text-base font-semibold bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/20 transition-all text-center">
                View Collection
              </Link>
            </div>
          </div>
          <div className="flex-shrink-0 w-full lg:w-auto flex justify-center">
            <img
              src="/images/home/ring.svg"
              className="max-h-[200px] sm:max-h-[280px] md:max-h-[350px] lg:max-h-[450px] xl:max-h-[560px] w-auto"
              alt="Hero Image"
            />
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-12 sm:py-16 md:py-20 space-y-16 sm:space-y-20 md:space-y-24">

        {/* Categories */}
        <div>
          <div className="text-center mb-12">
            <p className="text-blue-600 font-semibold text-sm tracking-wider uppercase mb-3">Explore</p>
            <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Categories</h2>
            <p className="text-gray-600 text-base max-w-2xl mx-auto">Browse our exquisite collection of handcrafted jewelry</p>
          </div>
          <div className="grid grid-cols-1 max-[1024px]:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {categoriesLoading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="relative min-h-[280px] xs:min-h-[320px] sm:min-h-[350px] md:min-h-[400px] bg-gray-200 rounded-lg overflow-hidden animate-pulse">
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6">
                    <div className="h-5 sm:h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-3 sm:h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : categories.length > 0 ? (
              // Render categories from API
              categories.map((category) => {
                // Find thumbnail image
                const thumbnail = category.images?.find(img => img.type === "thumbNail");
                const imageUrl = thumbnail?.url || '';

                return (
                  <Link
                    key={category.id}
                    href={`/collection`}
                    className="relative min-h-[280px] xs:min-h-[320px] sm:min-h-[350px] md:min-h-[400px] bg-gray-200 bg-cover bg-center rounded-lg overflow-hidden group cursor-pointer block hover:shadow-xl transition-shadow duration-300"
                    style={{ backgroundImage: `url('${imageUrl}')` }}
                  >
                    {/* Dark gradient overlay at bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                    {/* Text content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 text-white">
                      <h3 className="text-lg sm:text-xl font-medium mb-1 sm:mb-2">{category.name}</h3>
                      <div className="flex items-center gap-2 text-xs sm:text-sm group-hover:gap-3 transition-all">
                        <span>{category.navigationTitle || "Show More"}</span>
                        <IoArrowForward className="w-3 h-3 sm:w-4 sm:h-4" />
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              // Fallback if no categories
              <div className="col-span-full text-center py-12 text-gray-500">
                No categories available
              </div>
            )}
          </div>
        </div>

        {/* Images */}
        <div>
          <div className="text-center mb-14">
            <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-gray-900 mb-5">Ceylora Collection</h2>
            <p className="text-base sm:text-lg max-w-2xl mx-auto text-gray-600 leading-relaxed">Lifelong collection crafted by the tree of life and the precious minerals of Ceylon.</p>
            <div>
              <Link href="/collection/ceylora-collection">
                <button className="mt-4 sm:mt-6 md:mt-8 px-5 sm:px-6 py-2.5 sm:py-3 border border-white rounded-lg text-xs sm:text-sm bg-blue-600 text-white font-semibold hover:cursor-pointer transition-colors">
                  See Collection
                </button>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8 max-w-[1100px] mx-auto">
            <img src="/images/home/model/1771219590519-DSC03740-1.avif" alt="Jewelry Collection" className="w-full h-[400px] sm:h-[450px] lg:h-[500px] rounded-xl object-cover hover:scale-105 transition-transform duration-300 shadow-md" />
            <img src="/images/home/model/1771219562499-DSC03700-1.avif" alt="Jewelry Collection" className="w-full h-[400px] sm:h-[450px] lg:h-[500px] rounded-xl object-cover hover:scale-105 transition-transform duration-300 shadow-md" />
            <img src="/images/home/model/1771219547024-DSC03674-1.avif" alt="Jewelry Collection" className="w-full h-[400px] sm:h-[450px] lg:h-[500px] rounded-xl object-cover hover:scale-105 transition-transform duration-300 shadow-md" />
          </div>

          <p className="text-base sm:text-lg italic font-bold max-w-2xl mx-auto text-gray-600 leading-relaxed text-center mt-14">Sri Lanka’s craftmanship-an artistry that dates to the 6th century BCE, is one of Sri Lanka’s true treasures. Materials sourced by Sri Lanka’s renowned tree of life- coconut trees, precious gems extracted through our own mines, mother nature’s beautiful creations come together to present to you “Ceylora”</p>
          <p className="text-base sm:text-lg italic font-bold max-w-2xl mx-auto text-gray-600 leading-relaxed text-center mt-4">Ceylora is a collection that tells a story about Sri Lanka’s unique craftsmanship using coconut shells, infusing it with the sophistication and elegance of the precious minerals of mother nature to bring out the aura, preciousness and elegance of our gemstones and creations. Be a part of Sieman’s eco-friendly and sustainable line, being one with the minerals and land, by joining the Ceylora family</p>
        </div>
      </div>

      {/* info */}
      <div className="bg-[#06112D]">
        <div className="text-white flex max-w-[1200px] mx-auto py-10 max-[1200px]:px-4 items-center gap-10 lg:gap-20 flex-col lg:flex-row">
          <div className="max-w-2xl text-center lg:text-left w-full">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold leading-tight">
              <span>We’re Island-wide trusted</span>
              <br />
              for rare Sri Lankan
              <br />
              Sapphires
            </h1>
            <p className="mt-3 sm:mt-4 md:mt-6 text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed">
              We specialize in sourcing and dealing with the finest quality sapphires in Sri Lanka, offering a selection of natural blue, pink, yellow and White sapphires that have true beauty, rarity and lasting value.
            </p>
            <Link href="/collection">
              <button className="mt-4 sm:mt-6 md:mt-8 px-5 sm:px-6 py-2.5 sm:py-3 border border-white rounded-lg text-xs sm:text-sm bg-white text-black font-semibold hover:cursor-pointer transition-colors">
                See Collection
              </button>
            </Link>
          </div>
          <div>
            <img src="/images/home/model/info.png" alt="Sapphire Image" className="w-full max-w-sm h-[500px] object-cover" />
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-16 sm:py-20 md:py-24 space-y-16">
        {/* Grid info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-12 max-w-[1100px] mx-auto">
          {/* Card 1 */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3 p-6 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="w-12 h-12 flex items-center justify-center bg-blue-50 rounded-lg mb-1">
              <img src="images/home/icons/artistry.svg" alt="Artistry Icon" className="w-7 h-7 object-contain" />
            </div>
            <h3 className="font-bold text-base text-gray-900">Unmatched Artistry</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Every creation is carefully shaped by master craftsmen, honouring time-tested techniques.
            </p>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3 p-6 rounded-xl hover:bg-gray-50 transition-colors md:border-l md:border-r md:border-gray-200">
            <div className="w-12 h-12 flex items-center justify-center bg-blue-50 rounded-lg mb-1">
              <img src="images/home/icons/lifetime.svg" alt="Lifetime Icon" className="w-7 h-7 object-contain" />
            </div>
            <h3 className="font-bold text-base text-gray-900">Lifetime Assurance</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Our jewellery is backed by a lifetime promise, reflecting our confidence in lasting beauty.
            </p>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3 p-6 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="w-12 h-12 flex items-center justify-center bg-blue-50 rounded-lg mb-1">
              <img src="images/home/icons/authenticity.svg" alt="Authenticity Icon" className="w-7 h-7 object-contain" />
            </div>
            <h3 className="font-bold text-base text-gray-900">Guaranteed Authenticity</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Each piece is accompanied by official certification, ensuring genuine quality and materials.
            </p>
          </div>
        </div>

        {/* Last Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12 lg:p-16 min-[960px]:flex items-center gap-8 justify-between relative overflow-hidden shadow-lg">
          <div className="space-y-5 z-10 max-w-xl max-[960px]:mx-auto max-[960px]:text-center">
            <p className="text-blue-600 font-medium text-sm tracking-wide uppercase">Custom Design</p>
            <h2 className="font-bold text-3xl md:text-4xl text-gray-900 leading-tight">Craft the jewelry you've always dreamt of</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              We transform your vision into timeless jewelry pieces. Our master craftsmen bring your dreams to life with precision and artistry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2 max-[960px]:justify-center">
              <Link href="/custom-order" className="px-6 py-2.5 rounded-md text-sm bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-md text-center">
                Place a custom order
              </Link>
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="flex items-center justify-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  <FaPhone className="w-4 h-4" />
                  <span>{formatLKPhone(phone)}</span>
                </a>
              )}
            </div>
          </div>

          <img src="/images/home/woman.png" alt="Custom Jewelry" className="max-[960px]:hidden absolute object-cover right-20 bottom-[-60px] opacity-90" />
          <img src="/images/home/quote.png" alt="Quote" className="max-[960px]:hidden absolute h-40 object-cover right-[180px] top-8 -rotate-12 opacity-80" />
        </div>
      </div>
    </MainLayout>
  );
}