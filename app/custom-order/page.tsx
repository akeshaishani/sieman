"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/shared/layouts/main-layout";
import { API_ENDPOINTS, API_HEADERS } from "@/shared/config/api";
import { FiUpload } from "react-icons/fi";
import { IoCheckmarkCircle } from "react-icons/io5";
import Image from "next/image";
import Link from "next/link";

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

export default function CustomOrderPage() {
    const [companyDetails, setCompanyDetails] = useState<CompanyRecord | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [sketchImage, setSketchImage] = useState<string | null>(null);
    const [gemStone, setGemStone] = useState("");
    const [metalOption, setMetalOption] = useState("");
    const [goldCarrot, setGoldCarrot] = useState("");
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [note, setNote] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);

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

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSketchImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        setShowOrderModal(true);
    };

    const handleCancel = () => {
        setSketchImage(null);
        setGemStone("");
        setMetalOption("");
        setGoldCarrot("");
    };

    const handlePlaceOrder = async () => {
        setIsSubmitting(true);
        
        try {
            const orderData = {
                gemStone: gemStone,
                note: note,
                goldCarat: goldCarrot ? parseInt(goldCarrot.replace('k', '')) : 0,
                metalOption: metalOption,
                sketch: "",
                custormerDetails: {
                    firstName: firstName,
                    lastName: lastName,
                    phoneNumber: phoneNumber,
                    email: customerEmail
                }
            };

            const response = await fetch(API_ENDPOINTS.CUSTOM_ORDER, {
                method: "POST",
                headers: API_HEADERS,
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Order placed successfully
            setShowOrderModal(false);
            setOrderPlaced(true);
        } catch (error) {
            console.error("Error placing order:", error);
            alert("Failed to place order. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Extract primary email and phone number
    const primaryEmail = companyDetails?.emails?.find(e => e.type === "primary");
    const email = primaryEmail?.emailAddress;
    const primaryPhone = companyDetails?.contactNumbers?.find(c => c.type === "primary");
    const phone = primaryPhone?.number;

    const gemStones = ["Blue Sapphire", "Yellow Sapphire", "Pink Sapphire"];
    const metalOptions = ["Yellow Gold", "White gold", "Silver"];
    const goldCarrots = ["18k", "22k", "24k"];

    return (
        <MainLayout
            email={email}
            phone={phone}
            description={companyDetails?.shortDescrption}
            socialLinks={companyDetails?.socialMedia}
            isLoading={isLoading}
            whitebgheader={true}
        >
            {orderPlaced ? (
                <div className="pt-24 pb-16 bg-white min-h-screen flex items-center justify-center">
                    <div className="text-center max-w-md mx-auto px-6">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <IoCheckmarkCircle className="w-12 h-12 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            Thank You!
                        </h1>
                        <p className="text-gray-600 mb-8">
                            Your custom order has been placed successfully. We will review your request and get back to you soon.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/"
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-center"
                            >
                                Back to Home
                            </Link>
                            <button
                                onClick={() => {
                                    setOrderPlaced(false);
                                    setSketchImage(null);
                                    setGemStone("");
                                    setMetalOption("");
                                    setGoldCarrot("");
                                    setNote("");
                                    setFirstName("");
                                    setLastName("");
                                    setCustomerEmail("");
                                    setPhoneNumber("");
                                }}
                                className="px-6 py-3 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                Place Another Order
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
            <div className="pt-24 pb-16 bg-white max-w-[1480px] mx-auto">
                <div className="container max-w-3xl px-6">
                    {/* Header */}
                    <div className="mb-12">
                        <h1 className="text-3xl font-bold text-gray-900 mb-3">
                            Place Custom order
                        </h1>
                        <p className="text-sm text-gray-600">
                            Bring your vision to life with a custom jewelry piece designed just for you. Share your ideas, choose your gemstones and metals.
                        </p>
                    </div>

                    {/* Add you sketch */}
                    <div className="mb-10">
                        <h2 className="text-base font-semibold text-gray-900 mb-4">
                            Add you sketch
                        </h2>
                        <div className="flex gap-4">
                            <label className="w-28 h-28 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-600 transition-colors">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                <FiUpload className="w-6 h-6 text-gray-400 mb-1" />
                                <span className="text-xs text-gray-500">Upload Sketch</span>
                            </label>
                            {sketchImage && (
                                <div className="w-28 h-28 border border-gray-200 rounded-lg overflow-hidden">
                                    <Image
                                        src={sketchImage}
                                        alt="Sketch preview"
                                        width={112}
                                        height={112}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Gem Stone */}
                    <div className="mb-10">
                        <h2 className="text-base font-semibold text-gray-900 mb-4">
                            Gem Stone
                        </h2>
                        <div className="space-y-3">
                            {gemStones.map((stone) => (
                                <label
                                    key={stone}
                                    className="flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-600 transition-colors"
                                >
                                    <span className="text-sm text-gray-900">{stone}</span>
                                    <input
                                        type="radio"
                                        name="gemStone"
                                        value={stone}
                                        checked={gemStone === stone}
                                        onChange={(e) => setGemStone(e.target.value)}
                                        className="w-5 h-5 text-blue-600 focus:ring-blue-600"
                                    />
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Metal Options */}
                    <div className="mb-10">
                        <h2 className="text-base font-semibold text-gray-900 mb-4">
                            Metal Options
                        </h2>
                        <div className="space-y-3">
                            {metalOptions.map((metal) => (
                                <label
                                    key={metal}
                                    className="flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-600 transition-colors"
                                >
                                    <span className="text-sm text-gray-900">{metal}</span>
                                    <input
                                        type="radio"
                                        name="metalOption"
                                        value={metal}
                                        checked={metalOption === metal}
                                        onChange={(e) => setMetalOption(e.target.value)}
                                        className="w-5 h-5 text-blue-600 focus:ring-blue-600"
                                    />
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Gold Carrots */}
                    <div className="mb-10">
                        <h2 className="text-base font-semibold text-gray-900 mb-4">
                            Gold Karat
                        </h2>
                        <div className="space-y-3">
                            {goldCarrots.map((carrot) => (
                                <label
                                    key={carrot}
                                    className="flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-600 transition-colors"
                                >
                                    <span className="text-sm text-gray-900">{carrot}</span>
                                    <input
                                        type="radio"
                                        name="goldCarrot"
                                        value={carrot}
                                        checked={goldCarrot === carrot}
                                        onChange={(e) => setGoldCarrot(e.target.value)}
                                        className="w-5 h-5 text-blue-600 focus:ring-blue-600"
                                    />
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Note */}
                    <div className="mb-12">
                        <h2 className="text-base font-semibold text-gray-900 mb-4">
                            Add a note (optional)
                        </h2>
                        <textarea
                            value={note}
                            onChange={(e) => {
                                if (e.target.value.length <= 300) {
                                    setNote(e.target.value);
                                }
                            }}
                            placeholder="Add any special requests or details..."
                            rows={4}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
                        />
                        <div className="text-xs text-gray-500 mt-1 text-right">
                            {note.length}/300
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={handleCancel}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </div>
            )}

            {/* Order Details Modal */}
            {showOrderModal && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                            Add Order Details
                        </h2>

                        <div className="space-y-6">
                            {/* First Name and Last Name */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        First name
                                    </label>
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        placeholder="First name"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Last name
                                    </label>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        placeholder="Last name"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={customerEmail}
                                    onChange={(e) => setCustomerEmail(e.target.value)}
                                    placeholder="you@company.com"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                />
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone number
                                </label>
                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="+94 (555) 000-0000"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                />
                            </div>

                            {/* Place Order Button */}
                            <button
                                onClick={handlePlaceOrder}
                                disabled={!firstName || !lastName || !customerEmail || !phoneNumber || isSubmitting}
                                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "Placing Order..." : "Place the order"}
                            </button>

                            {/* Close Modal Button */}
                            <button
                                onClick={() => setShowOrderModal(false)}
                                className="w-full px-6 py-3 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}