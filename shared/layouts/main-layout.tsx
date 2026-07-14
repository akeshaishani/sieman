"use client";

import Header from "@/shared/components/header";
import Footer from "@/shared/components/footer";
import { usePageTracking } from "@/shared/hooks/usePageTracking";

interface SocialLink {
    icon: string;
    platform: string;
    url: string;
}

interface MainLayoutProps {
    children: React.ReactNode;
    email?: string;
    phone?: string;
    description?: string;
    socialLinks?: SocialLink[];
    isLoading?: boolean;
    whitebgheader?: boolean;
}

// Fallback values when API data is not available
const fallbackConfig = {
    socialLinks: [] as SocialLink[],
};

export default function MainLayout({ 
    children, 
    email, 
    phone, 
    description, 
    socialLinks,
    isLoading = false,
    whitebgheader = false
}: MainLayoutProps) {
    usePageTracking();

    return (
        <div className="min-h-screen flex flex-col">
            <Header 
                email={email ?? ""} 
                phone={phone ?? ""} 
                isLoading={isLoading}
                whitebgheader={whitebgheader}
            />
            <main className="flex-grow">{children}</main>
            <Footer 
                description={description ?? ""} 
                socialLinks={socialLinks ?? fallbackConfig.socialLinks} 
            />
        </div>
    );
}
