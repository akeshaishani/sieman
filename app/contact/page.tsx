"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/shared/layouts/main-layout";
import { API_ENDPOINTS, API_HEADERS } from "@/shared/config/api";
import { FaPhone, FaLocationDot } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { IoCheckmarkCircle } from "react-icons/io5";
import Image from "next/image";

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

export default function ContactPage() {
    const [companyDetails, setCompanyDetails] = useState<CompanyRecord | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCompanyDetails = async () => {
            try {
                setIsLoading(true);

                const response = await fetch(API_ENDPOINTS.COMPANY_DETAILS, {
                    method: "GET",
                    headers: API_HEADERS,
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: ApiResponse = await response.json();

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
    const email = primaryEmail?.emailAddress;
    const primaryPhone = companyDetails?.contactNumbers?.find(c => c.type === "primary");
    const phone = primaryPhone?.number;

    const features = [
        { text: "Design with expert guidance" },
        { text: "Get made to but a theme" },
        { text: "Delivered safety and security" },
        { text: "Personalize design and consultation" }
    ];

    return (
        <MainLayout
            email={email}
            phone={phone}
            description={companyDetails?.shortDescrption}
            socialLinks={companyDetails?.socialMedia}
            isLoading={isLoading}
            whitebgheader={true}
        >
            <div className="pt-24 pb-16 bg-white">
                <div className="container max-w-[1440px] mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                        {/* Left - Single Product Image */}
                        <div className="rounded-3xl p-8">
                            <Image
                                src="/images/contact/contact.png"
                                alt="Wooden rings collection"
                                width={600}
                                height={600}
                                className="w-full h-auto"
                            />
                        </div>

                        {/* Right - Contact Info */}
                        <div className="pt-8">
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                                Connect with us to Create<br />your unique piece
                            </h1>

                            {/* Features */}
                            <div className="grid grid-cols-2 gap-x-8 gap-y-6 mb-12">
                                {features.map((feature, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <IoCheckmarkCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-gray-900">{feature.text}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Let's Connect Section */}
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                                    Let's Connect
                                </h2>

                                {isLoading ? (
                                    <div className="space-y-4">
                                        <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {/* Phone */}
                                        {phone && (
                                            <a
                                                href={`tel:${phone.replace(/\s/g, "")}`}
                                                className="flex items-center gap-3 text-gray-900 hover:text-blue-600 transition-colors"
                                            >
                                                <FaPhone className="w-5 h-5 text-blue-600" />
                                                <span className="text-base">{formatLKPhone(phone)}</span>
                                            </a>
                                        )}

                                        {/* Email */}
                                        {email && (
                                            <a
                                                href={`mailto:${email}`}
                                                className="flex items-center gap-3 text-gray-900 hover:text-blue-600 transition-colors"
                                            >
                                                <MdEmail className="w-5 h-5 text-blue-600" />
                                                <span className="text-base">{email}</span>
                                            </a>
                                        )}

                                        {/* Address */}
                                        {companyDetails?.address && (
                                            <div className="flex items-start gap-3 text-gray-900">
                                                <FaLocationDot className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                                <div className="text-base">
                                                    {(() => {
                                                        const parts = companyDetails.address.split(',');
                                                        if (parts.length <= 2) {
                                                            return <div>{companyDetails.address}</div>;
                                                        }
                                                        const firstLine = `${parts[0]}, ${parts[1]}`;
                                                        const remainingLines = parts.slice(2);
                                                        return (
                                                            <>
                                                                <div>{firstLine}</div>
                                                                {remainingLines.map((part, index) => (
                                                                    <div key={index}>{part.trim()}</div>
                                                                ))}
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}