"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/shared/layouts/main-layout";
import { API_ENDPOINTS, API_HEADERS } from "@/shared/config/api";
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

interface OurStoryImage {
    image: string;
}

interface OurStoryResponse {
    message: string;
    collectionId: string;
    collectionName: string;
    records: OurStoryImage[];
    totalRecords: number;
}

export default function AboutPage() {
    const [companyDetails, setCompanyDetails] = useState<CompanyRecord | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [ourStoryImages, setOurStoryImages] = useState<OurStoryImage[]>([]);
    const [isOurStoryLoading, setIsOurStoryLoading] = useState(true);

    const stats = [
        { number: "300+", label: "Custom Designs" },
        { number: "3K+", label: "Trusted Clients" },
        { number: "99%", label: "Customer Satisfaction Rate" }
    ];

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

        const fetchOurStory = async () => {
            try {
                setIsOurStoryLoading(true);

                console.log("Fetching our story images from:", API_ENDPOINTS.OUR_STORY);

                const response = await fetch(API_ENDPOINTS.OUR_STORY, {
                    method: "GET",
                    headers: API_HEADERS,
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: OurStoryResponse = await response.json();

                console.log("Our story images fetched:", data);

                if (data.records && data.records.length > 0) {
                    setOurStoryImages(data.records);
                }
            } catch (error) {
                console.error("Error fetching our story images:", error);
            } finally {
                setIsOurStoryLoading(false);
            }
        };

        fetchOurStory();
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
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-[400px] sm:min-h-[450px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/about/hero-pattern.jpg')] opacity-10 bg-cover bg-center"></div>
                <div className="relative z-10 text-center px-4 py-20 sm:py-24">
                    <h1 className="font-['Playfair_Display'] text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-5">
                        Our Story
                    </h1>
                    <p className="text-gray-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
                        Three generations. Years of masterful craftsmanship. Precious gemstones. Our family-legacy brings timeless craftsmanship to exceptional, lifetime jewelry that tells
                        <br className="hidden sm:block" />
                        your story.
                    </p>
                </div>
            </div>

            {/* The Moment That Shaped Us */}
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 py-16 sm:py-20 md:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                    {/* Image */}
                    <div className="order-2 lg:order-1">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src="/images/about/20260228-112658.jpg"
                                alt="Our Founder"
                                className="w-full h-[450px] sm:h-[500px] lg:h-[600px] object-cover"
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="order-1 lg:order-2 space-y-6">
                        <div>
                            <p className="text-blue-600 font-semibold text-sm tracking-wider uppercase mb-3">Where It Started</p>
                            <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                The Moment That Shaped Us
                            </h2>
                        </div>

                        <div className="space-y-4 text-gray-700 leading-relaxed">
                            <p className="text-base">
                                Sieman Gems and Jewellers was established in 2025, inspired and anchored by the roots of Mr. Sieman Aluthgedara. Although a new establishment, this legacy holds a history deeply rooted to a couple of generation of almost 7 decades of history.
                            </p>
                            <p className="text-base">
                                Mr. Sieman Aluthgedara (1947, Monaragala, Bibile), the founder of Samarasinghe Holdings Pvt, Ltd, is our inspiration and stepping stones into the industry. His humble journey started from trading, then diversifying to gems trading.
                            </p>
                            <p className="text-base">
                                Mr.Sieman was a prominent gem trader back in his day, and was famously known for his expertise and excellence in gemmology. Starting off in his home town- Bibile, he owned his first mine and later expanded to Elahara and Ratnapura, exploring the opportunities and the gifts of Mother Nature that gifted our tiny island in the form of precious stones.
                            </p>
                            <p className="text-base">
                                Today, in our gifted island, his son Mr. Gihan Kapila carries his fathers legacy for another generation and establishing his fathers dreams and hard work as an establishment to deliver well-crafted, unique, well-rooted gems and jewellery for you to last for generations to come.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Honouring The Past, Designing For Today */}
            <div className="relative overflow-hidden" style={{ backgroundImage: "url('/images/about/Frame.png')" }}>
                <div className="absolute opacity-20 bg-cover bg-center"></div>

                <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Image */}
                        <div className="order-1">
                            <div className="relative rounded-2xl overflow-hidden">
                                <img
                                    src="/images/about/Gemini_Generated_Image_hcc9tyhcc9tyhcc9 1.png"
                                    alt="Precious Gemstones"
                                    className="w-full h-[400px] sm:h-[450px] object-cover"
                                />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="order-2 text-white space-y-6">
                            <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                                Honouring The Past
                                <br />
                                Designing For Today
                            </h2>
                            <p className="text-gray-300 text-sm sm:text-lg leading-relaxed">
                                Our legacy bridges Generations. We honour the traditional skills that shaped our beginnings. While breathlessly crafting timeless yet daring, on-trend pieces for today's individual style.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Our Signature Creations */}
            {!isOurStoryLoading && ourStoryImages.length > 0 && (
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 py-16 sm:py-20 md:py-24">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-5">
                            Our Story
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                        {ourStoryImages.slice(0, 4).map((item, index) => (
                            <div
                                key={index}
                                className="relative group overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-300"
                            >
                                <div className="aspect-square bg-gray-200">
                                    <img
                                        src={item.image}
                                        alt={`Our Story ${index + 1}`}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Numbers Are Telling Our Story */}
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 sm:py-24 md:py-28 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5"></div>

                <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Left Content */}
                        <div className="text-white space-y-6">
                            <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                                Numbers Are Telling
                                <br />
                                Our Story
                            </h2>
                            <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                                Over 50 years of craftsmanship. More than 10,000 custom pieces created. Trusted by families across generations. Our numbers reflect our commitment to excellence.
                            </p>
                        </div>

                        {/* Stats Cards */}
                        <div className="space-y-6">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 sm:p-8 hover:bg-white/10 transition-all"
                                >
                                    <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-2">
                                        {stat.number}
                                    </div>
                                    <div className="text-gray-400 text-base sm:text-lg font-medium">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Last Card */}
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-16 sm:py-20 md:py-24 space-y-16">
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