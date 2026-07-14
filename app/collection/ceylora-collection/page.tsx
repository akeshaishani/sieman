"use client";

import React, { useEffect, useState } from "react";
import MainLayout from "@/shared/layouts/main-layout";
import { API_ENDPOINTS, API_HEADERS } from "@/shared/config/api";
import { FiMinus, FiPlus, FiChevronLeft, FiChevronRight } from "react-icons/fi";
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

interface CompanyApiResponse {
    message: string;
    collectionId: string;
    collectionName: string;
    records: CompanyRecord[];
    totalRecords: number;
}

// Category interfaces
interface CategoryImage {
    type: string;
    url: string;
    id: string;
}

interface Category {
    name: string;
    productsPage: string;
    images: CategoryImage[];
    featuredCategory: boolean;
    homePage: boolean;
    navigationTitle: string;
    id: string;
}

interface CategoriesApiResponse {
    message: string;
    collectionId: string;
    collectionName: string;
    records: Category[];
    totalRecords: number;
}

// Product interfaces
interface ProductImage {
    imageUrl: string;
}

interface Product {
    id: string;
    images: ProductImage[];
    stock: string;
    productName: string;
    categoryId: string;
    price: string;
    itemCode: string;
    description: string;
}

interface ProductsApiResponse {
    message: string;
    collectionId: string;
    collectionName: string;
    records: Product[];
    totalRecords: number;
}

// Ceylora Collection interfaces
interface CeyloraCollectionImage {
    image: string;
}

interface CeyloraCollectionApiResponse {
    message: string;
    collectionId: string;
    collectionName: string;
    records: CeyloraCollectionImage[];
    totalRecords: number;
}

export default function CollectionPage() {
    const CEYLORA_CATEGORY_ID = "09515c46-6574-4036-acad-da8e5260d90c";

    const [companyDetails, setCompanyDetails] = useState<CompanyRecord | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [productsLoading, setProductsLoading] = useState(true);
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showThankYou, setShowThankYou] = useState(false);
    const [ceyloraImages, setCeyloraImages] = useState<CeyloraCollectionImage[]>([]);
    const [ceyloraImagesLoading, setCeyloraImagesLoading] = useState(true);

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

                const data: CompanyApiResponse = await response.json();

                if (data.records && data.records.length > 0) {
                    setCompanyDetails(data.records[0]);
                }
            } catch (error) {
                console.error("Error fetching company details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchCategories = async () => {
            try {
                setCategoriesLoading(true);

                const response = await fetch(API_ENDPOINTS.CATEGORIES, {
                    method: "GET",
                    headers: API_HEADERS,
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: CategoriesApiResponse = await response.json();

                if (data.records && data.records.length > 0) {
                    setCategories(data.records);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setCategoriesLoading(false);
            }
        };

        const fetchProducts = async () => {
            try {
                setProductsLoading(true);

                const response = await fetch(API_ENDPOINTS.PRODUCTS, {
                    method: "GET",
                    headers: API_HEADERS,
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: ProductsApiResponse = await response.json();

                if (data.records && data.records.length > 0) {
                    // Filter products to only show Ceylora collection
                    const ceyloraProducts = data.records.filter(
                        product => product.categoryId === CEYLORA_CATEGORY_ID
                    );
                    setProducts(ceyloraProducts);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setProductsLoading(false);
            }
        };

        const fetchCeyloraImages = async () => {
            try {
                setCeyloraImagesLoading(true);

                const response = await fetch(API_ENDPOINTS.CEYLORA_COLLECTION, {
                    method: "GET",
                    headers: API_HEADERS,
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: CeyloraCollectionApiResponse = await response.json();

                if (data.records && data.records.length > 0) {
                    setCeyloraImages(data.records);
                }
            } catch (error) {
                console.error("Error fetching Ceylora images:", error);
            } finally {
                setCeyloraImagesLoading(false);
            }
        };

        fetchCompanyDetails();
        fetchCategories();
        fetchProducts();
        fetchCeyloraImages();
    }, []);

    // Extract primary email and phone number
    const primaryEmail = companyDetails?.emails?.find(e => e.type === "primary");
    const email = primaryEmail?.emailAddress;
    const primaryPhone = companyDetails?.contactNumbers?.find(c => c.type === "primary");
    const phone = primaryPhone?.number;

    // Get products by category ID
    const getProductsByCategory = (categoryId: string): Product[] => {
        return products.filter(product => product.categoryId === categoryId);
    };

    // Format price with proper comma separation and Rs prefix
    const formatPrice = (price: string): string => {
        if (!price || price.trim() === "") return "";

        // Remove any existing "Rs" and extra spaces
        let cleanPrice = price.replace(/Rs\.?\s*/gi, "").trim();

        // Remove any existing commas
        cleanPrice = cleanPrice.replace(/,/g, "");

        // Parse the number
        const numPrice = parseFloat(cleanPrice);

        if (isNaN(numPrice)) return price; // Return original if can't parse

        // Format with commas for Indian numbering system
        const formatted = numPrice.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        return `Rs ${formatted}`;
    };

    const updateQuantity = (productId: string, delta: number) => {
        setQuantities(prev => {
            const current = prev[productId] || 1;
            const newQty = Math.max(1, current + delta);
            return { ...prev, [productId]: newQty };
        });
    };

    const handleProductClick = (product: Product) => {
        setSelectedProduct(product);
        setCurrentImageIndex(0);
        setShowOrderModal(true);
    };

    const nextImage = () => {
        if (selectedProduct && selectedProduct.images.length > 0) {
            setCurrentImageIndex((prev) =>
                prev === selectedProduct.images.length - 1 ? 0 : prev + 1
            );
        }
    };

    const prevImage = () => {
        if (selectedProduct && selectedProduct.images.length > 0) {
            setCurrentImageIndex((prev) =>
                prev === 0 ? selectedProduct.images.length - 1 : prev - 1
            );
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedProduct) return;

        setIsSubmitting(true);

        try {
            const orderData = {
                productName: selectedProduct.productName,
                price: selectedProduct.price || "",
                itemCode: selectedProduct.itemCode || "",
                qty: quantities[selectedProduct.id] || 1,
                custormerDetails: {
                    firstName: firstName,
                    lastName: lastName,
                    phoneNumber: phoneNumber,
                    email: customerEmail
                }
            };

            const response = await fetch(API_ENDPOINTS.ORDERS, {
                method: "POST",
                headers: API_HEADERS,
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Reset form
            setShowOrderModal(false);
            setSelectedProduct(null);
            setFirstName("");
            setLastName("");
            setCustomerEmail("");
            setPhoneNumber("");
            setQuantities({});
            setCurrentImageIndex(0);

            // Show thank you popup
            setShowThankYou(true);
        } catch (error) {
            console.error("Error placing order:", error);
            alert("Failed to place order. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const ProductCard = ({ product }: { product: Product }) => {
        const [currentSlide, setCurrentSlide] = React.useState(0);
        const hasMultipleImages = product.images && product.images.length > 1;
        const hasPrice = product.price && product.price.trim() !== "";

        // Auto-slide effect
        React.useEffect(() => {
            if (!hasMultipleImages) return;

            const interval = setInterval(() => {
                setCurrentSlide((prev) =>
                    prev === product.images.length - 1 ? 0 : prev + 1
                );
            }, 3000); // Change slide every 3 seconds

            return () => clearInterval(interval);
        }, [hasMultipleImages, product.images.length]);

        const currentImage = product.images && product.images.length > 0
            ? product.images[currentSlide]?.imageUrl
            : "/images/placeholder.jpg";

        return (
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="p-5">
                    {/* Image Container */}
                    <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden relative mb-4">
                        <img
                            src={currentImage}
                            alt={product.productName}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Product Title */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{product.productName}</h3>

                    {/* Description */}
                    {product.description && product.description.trim() !== "" && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{product.description}</p>
                    )}

                    {/* Price and Button */}
                    <div className="flex items-center justify-between gap-3 mt-4">
                        {hasPrice && (
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Price</p>
                                <p className="text-xl font-bold text-gray-900">{formatPrice(product.price)}</p>
                            </div>
                        )}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleProductClick(product);
                            }}
                            className={`${hasPrice ? 'px-6' : 'w-full'
                                } py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold text-sm`}
                        >
                            Order now
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const ProductSection = ({ title, categoryProducts }: { title: string; categoryProducts: Product[] }) => {
        const sliderRef = React.useRef<HTMLDivElement>(null);
        const [canScrollLeft, setCanScrollLeft] = React.useState(false);
        const [canScrollRight, setCanScrollRight] = React.useState(false);

        const checkScrollButtons = React.useCallback(() => {
            if (sliderRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
                setCanScrollLeft(scrollLeft > 0);
                setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
            }
        }, []);

        React.useEffect(() => {
            checkScrollButtons();
            window.addEventListener('resize', checkScrollButtons);
            return () => window.removeEventListener('resize', checkScrollButtons);
        }, [checkScrollButtons, categoryProducts]);

        const scrollLeft = () => {
            if (sliderRef.current) {
                sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
            }
        };

        const scrollRight = () => {
            if (sliderRef.current) {
                sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
            }
        };

        if (categoryProducts.length === 0) return null;

        return (
            <div className="mb-16">
                <h2 className="text-xl font-bold text-gray-900 mb-6">{title}</h2>
                <div className="relative">
                    {/* Left Arrow Button */}
                    {canScrollLeft && (
                        <button
                            onClick={scrollLeft}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-all hover:scale-110"
                        >
                            <FiChevronLeft className="w-5 h-5 text-gray-700" />
                        </button>
                    )}

                    {/* Slider Container */}
                    <div
                        ref={sliderRef}
                        onScroll={checkScrollButtons}
                        className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {categoryProducts.map((product) => (
                            <div key={product.id} className="flex-shrink-0 w-[220px] sm:w-[260px] md:w-[280px] lg:w-[300px]">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>

                    {/* Right Arrow Button */}
                    {canScrollRight && (
                        <button
                            onClick={scrollRight}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-all hover:scale-110"
                        >
                            <FiChevronRight className="w-5 h-5 text-gray-700" />
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <MainLayout
            email={email}
            phone={phone}
            description={companyDetails?.shortDescrption}
            socialLinks={companyDetails?.socialMedia}
            isLoading={isLoading}
            whitebgheader={true}
        >
            {/* Hero Section */}
            <div
                className="bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/images/about/Hero.png')" }}
            >
                <div className="py-20 sm:py-28 md:py-36">
                    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 text-center">
                        <h1 className="font-['Playfair_Display'] text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
                            Ceylora Collection
                        </h1>
                        <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
                            Lifelong collection crafted by the tree of life and the precious minerals of Ceylon.
                        </p>
                    </div>
                </div>
            </div>

            {/* Images */}
            <div className="max-[1024px]:px-4 max-[900px]:my-10 my-20">
                {ceyloraImagesLoading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-500">Loading images...</p>
                    </div>
                ) : ceyloraImages.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8 max-w-[1100px] mx-auto">
                        {ceyloraImages.map((item, index) => (
                            <img 
                                key={index}
                                src={item.image} 
                                alt={`Ceylora Collection ${index + 1}`} 
                                className="w-full h-[350px] rounded-xl object-cover hover:scale-105 transition-transform duration-300 shadow-md" 
                            />
                        ))}
                    </div>
                ) : null}

                <p className="text-base sm:text-lg italic font-bold max-w-2xl mx-auto text-gray-600 leading-relaxed text-center mt-14">Sri Lanka’s craftmanship-an artistry that dates to the 6th century BCE, is one of Sri Lanka’s true treasures. Materials sourced by Sri Lanka’s renowned tree of life- coconut trees, precious gems extracted through our own mines, mother nature’s beautiful creations come together to present to you “Ceylora”</p>
                <p className="text-base sm:text-lg italic font-bold max-w-2xl mx-auto text-gray-600 leading-relaxed text-center mt-4">Ceylora is a collection that tells a story about Sri Lanka’s unique craftsmanship using coconut shells, infusing it with the sophistication and elegance of the precious minerals of mother nature to bring out the aura, preciousness and elegance of our gemstones and creations. Be a part of Sieman’s eco-friendly and sustainable line, being one with the minerals and land, by joining the Ceylora family</p>
            </div>

            {/* Collection Content */}
            <div className="bg-gray-50">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-12 sm:py-16">

                    {/* Loading State */}
                    {(categoriesLoading || productsLoading) && (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-500">Loading collection...</p>
                        </div>
                    )}

                    {/* Dynamic Categories with Products */}
                    {!categoriesLoading && !productsLoading && categories.map((category) => (
                        <ProductSection
                            key={category.id}
                            title={category.name}
                            categoryProducts={getProductsByCategory(category.id)}
                        />
                    ))}

                    {/* No products message */}
                    {!categoriesLoading && !productsLoading && products.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No products available at the moment.</p>
                        </div>
                    )}

                </div>
            </div>

            {/* Order Details Modal */}
            {
                showOrderModal && selectedProduct && (
                    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="grid md:grid-cols-2 gap-0">
                                {/* Left - Product Images Slider */}
                                <div className="bg-gray-50 p-8 flex flex-col">
                                    {/* Main Image */}
                                    <div className="relative flex-1 flex items-center justify-center min-h-[300px]">
                                        {selectedProduct.images && selectedProduct.images.length > 0 ? (
                                            <>
                                                <img
                                                    src={selectedProduct.images[currentImageIndex]?.imageUrl}
                                                    alt={selectedProduct.productName}
                                                    className="max-w-full max-h-[300px] object-contain"
                                                />

                                                {/* Navigation Arrows */}
                                                {selectedProduct.images.length > 1 && (
                                                    <>
                                                        <button
                                                            onClick={prevImage}
                                                            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                                                        >
                                                            <FiChevronLeft className="w-5 h-5 text-gray-700" />
                                                        </button>
                                                        <button
                                                            onClick={nextImage}
                                                            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                                                        >
                                                            <FiChevronRight className="w-5 h-5 text-gray-700" />
                                                        </button>
                                                    </>
                                                )}
                                            </>
                                        ) : (
                                            <div className="w-full h-[300px] bg-gray-200 flex items-center justify-center rounded-lg">
                                                <span className="text-gray-400">No image available</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Thumbnail Images */}
                                    {selectedProduct.images && selectedProduct.images.length > 1 && (
                                        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                                            {selectedProduct.images.map((image, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setCurrentImageIndex(index)}
                                                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${currentImageIndex === index
                                                        ? 'border-blue-600'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <img
                                                        src={image.imageUrl}
                                                        alt={`${selectedProduct.productName} ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    <div className="mt-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedProduct.productName}</h3>
                                        {selectedProduct.price && (
                                            <p className="text-lg font-semibold text-blue-600 mb-4">{selectedProduct.price}</p>
                                        )}

                                        {/* Quantity Selector */}
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm font-medium text-gray-700">Quantity:</span>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => updateQuantity(selectedProduct.id, -1)}
                                                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                                                >
                                                    <FiMinus className="w-4 h-4 text-gray-600" />
                                                </button>
                                                <span className="w-10 text-center text-base font-medium">
                                                    {quantities[selectedProduct.id] || 1}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(selectedProduct.id, 1)}
                                                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                                                >
                                                    <FiPlus className="w-4 h-4 text-gray-600" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right - Order Form */}
                                <div className="p-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                        Place Your Order
                                    </h2>

                                    <div className="space-y-5">
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
                                            onClick={() => {
                                                setShowOrderModal(false);
                                                setSelectedProduct(null);
                                            }}
                                            className="w-full px-6 py-3 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Thank You Modal */}
            {
                showThankYou && (
                    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
                            {/* Success Icon */}
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <h2 className="font-['Playfair_Display'] text-2xl font-bold text-gray-900 mb-3">
                                Thank You!
                            </h2>

                            <p className="text-gray-600 mb-6">
                                Your order has been placed successfully. We will contact you shortly to confirm your order details.
                            </p>

                            <button
                                onClick={() => setShowThankYou(false)}
                                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                )
            }
        </MainLayout >
    );
}