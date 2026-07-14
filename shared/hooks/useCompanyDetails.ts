"use client";

import { useState, useEffect, useCallback } from "react";
import { API_ENDPOINTS, API_HEADERS } from "@/shared/config/api";
import { 
    getFromCache, 
    setInCache, 
    getPendingFetch, 
    setPendingFetch, 
    clearPendingFetch 
} from "@/shared/config/cache";

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
    platform: string;
    url: string;
}

export interface CompanyDetails {
    emails: Email[];
    address: string;
    contactNumbers: ContactNumber[];
    socialMedia: SocialMedia[];
    shortDescrption: string;
    companyName: string;
}

interface UseCompanyDetailsReturn {
    companyDetails: CompanyDetails | null;
    isLoading: boolean;
    error: string | null;
}

const CACHE_KEY = "company_details";

export function useCompanyDetails(): UseCompanyDetailsReturn {
    const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(() => getFromCache<CompanyDetails>(CACHE_KEY));
    const [isLoading, setIsLoading] = useState<boolean>(() => !getFromCache<CompanyDetails>(CACHE_KEY));
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async (): Promise<CompanyDetails | null> => {
        try {
            const response = await fetch(API_ENDPOINTS.COMPANY_DETAILS, {
                method: "GET",
                headers: API_HEADERS,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: CompanyDetails = await response.json();
            return data;
        } catch (err) {
            console.error("Error fetching company details:", err);
            throw err;
        }
    }, []);

    useEffect(() => {
        // Check cache first
        const cachedData = getFromCache<CompanyDetails>(CACHE_KEY);
        if (cachedData) {
            setCompanyDetails(cachedData);
            setIsLoading(false);
            return;
        }

        // Check if there's already a fetch in progress
        const pendingFetch = getPendingFetch<CompanyDetails | null>(CACHE_KEY);
        if (pendingFetch) {
            pendingFetch.then((data) => {
                if (data) {
                    setCompanyDetails(data);
                }
                setIsLoading(false);
            });
            return;
        }

        // Fetch from API
        setIsLoading(true);
        const promise = fetchData();
        setPendingFetch(CACHE_KEY, promise);

        promise
            .then((data) => {
                if (data) {
                    setInCache(CACHE_KEY, data);
                    setCompanyDetails(data);
                }
            })
            .catch((err) => {
                setError(err instanceof Error ? err.message : "Unknown error");
            })
            .finally(() => {
                setIsLoading(false);
                clearPendingFetch(CACHE_KEY);
            });
    }, [fetchData]);

    return { companyDetails, isLoading, error };
}
