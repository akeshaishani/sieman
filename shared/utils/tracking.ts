import { API_HEADERS, API_ENDPOINTS, WORKSPACE_ID, PROJECT_ID } from "@/shared/config/api";

interface IPDetails {
    ip: string;
    city: string;
    country_name: string;
    country_code: string;
    timezone: string;
}

interface AnalyticsData {
    sessionId: string;
    workspaceId: string;
    projectId: string;
    paidVisitor: boolean;
    repeatVisitor: boolean;
    operatingSystem: string;
    browser: string;
    trafficSource: string;
    campaign: string;
    page: string;
    countryCode: string;
    country: string;
    city: string;
    socialTraffic: boolean;
    socialTrafficSource: string;
    loggedInUser: boolean;
    timeZone: string;
    ipAddress: string;
}

// Generate or retrieve session ID
function getSessionId(): string {
    if (typeof window === 'undefined') return '';

    const SESSION_KEY = 'analytics_session_id';
    let sessionId = sessionStorage.getItem(SESSION_KEY);

    if (!sessionId) {
        sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
        sessionStorage.setItem(SESSION_KEY, sessionId);
    }

    return sessionId;
}

// Check if repeat visitor
function isRepeatVisitor(): boolean {
    if (typeof window === 'undefined') return false;

    const VISITOR_KEY = 'has_visited';
    const hasVisited = localStorage.getItem(VISITOR_KEY);

    if (!hasVisited) {
        localStorage.setItem(VISITOR_KEY, 'true');
        return false;
    }

    return true;
}

// Detect operating system
function getOperatingSystem(): string {
    if (typeof window === 'undefined') return 'Unknown';

    const userAgent = window.navigator.userAgent;

    if (userAgent.indexOf('Win') !== -1) return 'Windows';
    if (userAgent.indexOf('Mac') !== -1) return 'MacOS';
    if (userAgent.indexOf('Linux') !== -1) return 'Linux';
    if (userAgent.indexOf('Android') !== -1) return 'Android';
    if (userAgent.indexOf('iOS') !== -1 || userAgent.indexOf('iPhone') !== -1 || userAgent.indexOf('iPad') !== -1) return 'iOS';

    return 'Unknown';
}

// Detect browser
function getBrowser(): string {
    if (typeof window === 'undefined') return 'Unknown';

    const userAgent = window.navigator.userAgent;

    if (userAgent.indexOf('Chrome') !== -1 && userAgent.indexOf('Edg') === -1) return 'Chrome';
    if (userAgent.indexOf('Safari') !== -1 && userAgent.indexOf('Chrome') === -1) return 'Safari';
    if (userAgent.indexOf('Firefox') !== -1) return 'Firefox';
    if (userAgent.indexOf('Edg') !== -1) return 'Edge';
    if (userAgent.indexOf('MSIE') !== -1 || userAgent.indexOf('Trident') !== -1) return 'IE';

    return 'Unknown';
}

// Detect traffic source
function getTrafficSource(): string {
    if (typeof window === 'undefined') return 'Direct';

    const referrer = document.referrer;

    if (!referrer || referrer === '') return 'Direct';

    try {
        const referrerUrl = new URL(referrer);
        const currentUrl = new URL(window.location.href);

        if (referrerUrl.hostname === currentUrl.hostname) {
            return 'Direct';
        }

        // Check for social media
        const socialDomains = ['facebook.com', 'twitter.com', 'linkedin.com', 'instagram.com', 'youtube.com', 'tiktok.com'];
        if (socialDomains.some(domain => referrerUrl.hostname.includes(domain))) {
            return 'Social';
        }

        // Check for search engines
        const searchEngines = ['google', 'bing', 'yahoo', 'duckduckgo', 'baidu'];
        if (searchEngines.some(engine => referrerUrl.hostname.includes(engine))) {
            return 'Search';
        }

        return 'Referral';
    } catch {
        return 'Direct';
    }
}

// Detect social traffic source
function getSocialTrafficSource(): string {
    if (typeof window === 'undefined') return '';

    const referrer = document.referrer;
    if (!referrer) return '';

    try {
        const referrerUrl = new URL(referrer);

        if (referrerUrl.hostname.includes('facebook.com')) return 'Facebook';
        if (referrerUrl.hostname.includes('twitter.com') || referrerUrl.hostname.includes('t.co')) return 'Twitter';
        if (referrerUrl.hostname.includes('linkedin.com')) return 'LinkedIn';
        if (referrerUrl.hostname.includes('instagram.com')) return 'Instagram';
        if (referrerUrl.hostname.includes('youtube.com')) return 'YouTube';
        if (referrerUrl.hostname.includes('tiktok.com')) return 'TikTok';

        return '';
    } catch {
        return '';
    }
}

// Get campaign from URL parameters
function getCampaign(): string {
    if (typeof window === 'undefined') return '';

    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('utm_campaign') || urlParams.get('campaign') || '';
}

// Fetch IP details
async function fetchIPDetails(): Promise<IPDetails | null> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch('https://ipapi.co/json/', {
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return {
            ip: data.ip || '',
            city: data.city || '',
            country_name: data.country_name || '',
            country_code: data.country_code || '',
            timezone: data.timezone || ''
        };
    } catch (error) {
        // Silently fail and return null - analytics should not break the page
        return null;
    }
}

// Send analytics data
export async function trackPageView(currentPage: string): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
        const ipDetails = await fetchIPDetails();

        const trafficSource = getTrafficSource();
        const socialSource = getSocialTrafficSource();

        const analyticsData: AnalyticsData = {
            sessionId: getSessionId(),
            workspaceId: WORKSPACE_ID,
            projectId: PROJECT_ID,
            paidVisitor: false,
            repeatVisitor: isRepeatVisitor(),
            operatingSystem: getOperatingSystem(),
            browser: getBrowser(),
            trafficSource,
            campaign: getCampaign(),
            page: currentPage,
            countryCode: ipDetails?.country_code || '',
            country: ipDetails?.country_name || '',
            city: ipDetails?.city || '',
            socialTraffic: trafficSource === 'Social',
            socialTrafficSource: socialSource,
            loggedInUser: false,
            timeZone: ipDetails?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
            ipAddress: ipDetails?.ip || ''
        };

        await fetch(API_ENDPOINTS.ANALYTICS, {
            method: 'POST',
            headers: API_HEADERS,
            body: JSON.stringify(analyticsData)
        });
    } catch (error) {
        console.error('Error tracking page view:', error);
    }
}
