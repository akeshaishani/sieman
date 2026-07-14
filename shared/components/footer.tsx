import Link from "next/link";
import Image from "next/image";

interface SocialLink {
    icon: string;
    platform: string;
    url: string;
}

interface FooterProps {
    description: string;
    socialLinks: SocialLink[];
}

export default function Footer({ description, socialLinks }: FooterProps) {
    const companyLinks = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Collection", href: "/collection" },
        { name: "Contact", href: "/contact" },
    ];

    const categoryLinks = [
        { name: "Pendant", href: "/collection" },
        { name: "Earrings", href: "/collection" },
        { name: "Rings", href: "/collection" },
        { name: "Bracelets", href: "/collection" },
    ];

    return (
        <footer className="bg-[#06112D] text-white">
            {/* Main Footer Content */}
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo & Description */}
                    <div className="md:col-span-2">
                        <Link href="/">
                            <Image
                                src="/images/logo/logo.svg"
                                alt="Sieman"
                                width={120}
                                height={40}
                                className="h-8 w-auto"
                            />
                        </Link>
                        <p className="mt-4 text-sm text-gray-400 leading-relaxed max-w-xs">
                            {description}
                        </p>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-500 mb-4">Company</h3>
                        <ul className="space-y-2">
                            {companyLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-300 hover:text-white transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories Links */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-500 mb-4">Categories</h3>
                        <ul className="space-y-2">
                            {categoryLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-300 hover:text-white transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800 bg-[#171C31]">
                <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-500">
                        © {new Date().getFullYear()} SIEMAN All rights reserved | Powered by <a href="https://fitwin.co" target="_blank" rel="noopener noreferrer" className="hover:text-white text-blue-400 transition-colors">Fitwin Technologies</a>
                    </p>
                    <div className="flex items-center gap-4">
                        {socialLinks.map((social) => (
                            <a
                                key={social.platform}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={social.platform}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <Image
                                    src={social.icon}
                                    alt={social.platform}
                                    width={20}
                                    height={20}
                                    className="w-5 h-5"
                                />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
