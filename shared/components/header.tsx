"use client";

import Link from "next/link";
import Image from "next/image";
import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { useState, useEffect } from "react";

// Format Sri Lankan phone number for display: +94765949695 -> 076 594 9695
function formatLKPhone(phone: string): string {
    const cleaned = phone.replace(/[^\d+]/g, "");
    const match = cleaned.match(/^\+94(\d{2})(\d{3})(\d{4})$/);
    if (match) {
        return `0${match[1]} ${match[2]} ${match[3]}`;
    }
    return phone;
}

interface HeaderProps {
    email?: string;
    phone?: string;
    isLoading?: boolean;
    whitebgheader?: boolean;
}

export default function Header({ email, phone, isLoading, whitebgheader }: HeaderProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "About Us", href: "/about" },
        { name: "Collection", href: "/collection" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <header className={`py-3 px-6 fixed w-full z-50 transition-all duration-300 ${
            whitebgheader
                ? "bg-white border-b border-gray-300 text-black"
                : isScrolled
                ? "bg-white border-b border-gray-300 text-black"
                : "text-white"
            }`}>
            <div className="container max-w-[1440px] mx-auto flex items-center justify-between">
                {/* Logo and Navigation */}
                <div className="flex items-center gap-10">
                    <Link href="/">
                        <Image
                            src="/images/logo/logo.svg"
                            alt="Sieman"
                            width={100}
                            height={32}
                            className="h-8 w-auto"
                        />
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium hover:text-blue-600 transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Contact Info and Mobile Menu Button */}
                <div className="flex items-center gap-2 sm:gap-4">
                    {isLoading ? (
                        <>
                            <div className={`h-4 w-32 rounded animate-pulse ${isScrolled ? "bg-gray-300" : "bg-gray-700"}`}></div>
                            <div className={`h-4 w-28 rounded animate-pulse ${isScrolled ? "bg-gray-300" : "bg-gray-700"}`}></div>
                        </>
                    ) : (
                        <>
                            {email && (
                                <a
                                    href={`mailto:${email}`}
                                    className="flex items-center gap-2 text-sm hover:text-blue-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                                    title={email}
                                >
                                    <MdEmail className="w-5 h-5" />
                                    <span className="hidden lg:inline">{email}</span>
                                </a>
                            )}
                            {phone && (
                                <a
                                    href={`tel:${phone.replace(/\s/g, "")}`}
                                    className="flex items-center gap-2 text-sm font-medium hover:text-blue-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                                    title={formatLKPhone(phone)}
                                >
                                    <FaPhone className="w-4 h-4" />
                                    <span className="hidden sm:inline">{formatLKPhone(phone)}</span>
                                </a>
                            )}
                        </>
                    )}
                    
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <HiX className="w-6 h-6" />
                        ) : (
                            <HiMenuAlt3 className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-300 shadow-lg">
                    <nav className="container max-w-[1440px] mx-auto px-6 py-4">
                        <div className="flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors py-2 border-b border-gray-100 last:border-0"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            
                            {/* Mobile Contact Info */}
                            <div className="flex flex-col gap-3 pt-2 border-t border-gray-200">
                                {phone && (
                                    <a
                                        href={`tel:${phone.replace(/\s/g, "")}`}
                                        className="flex items-center gap-2 text-sm text-gray-900 hover:text-blue-600 transition-colors"
                                    >
                                        <FaPhone className="w-4 h-4" />
                                        <span>{formatLKPhone(phone)}</span>
                                    </a>
                                )}
                                {email && (
                                    <a
                                        href={`mailto:${email}`}
                                        className="flex items-center gap-2 text-sm text-gray-900 hover:text-blue-600 transition-colors"
                                    >
                                        <MdEmail className="w-4 h-4" />
                                        <span>{email}</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}