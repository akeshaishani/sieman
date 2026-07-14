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

interface Image {
    type: string;
    url: string;
    id: string;
}

interface Category {
    name: string;
    productsPage: string;
    images: Image[];
    featuredCategory: boolean;
    homePage: boolean;
    navigationTitle: string;
    id: string;
}

interface ApiResponse {
    message: string;
    collectionId: string;
    collectionName: string;
    records: Category[];
    totalRecords: number;
}

interface UseCategoriesReturn {
    categories: Category[];
    isLoading: boolean;
    error: string | null;
}

const CACHE_KEY = "categories";

export function useCategories(): UseCategoriesReturn {
    const [categories, setCategories] = useState<Category[]>(() => getFromCache<Category[]>(CACHE_KEY) || []);
    const [isLoading, setIsLoading] = useState<boolean>(() => !getFromCache<Category[]>(CACHE_KEY));
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async (): Promise<Category[]> => {
        try {
            const response = await fetch(API_ENDPOINTS.CATEGORIES, {
                method: "GET",
                headers: API_HEADERS,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: ApiResponse = await response.json();
            
            // Filter and return only categories where homePage is true
            return data.records?.filter(category => category.homePage === true) || [];
        } catch (err) {
            console.error("Error fetching categories:", err);
            throw err;
        }
    }, []);

    useEffect(() => {
        // Check cache first
        const cachedData = getFromCache<Category[]>(CACHE_KEY);
        if (cachedData) {
            setCategories(cachedData);
            setIsLoading(false);
            return;
        }

        // Check if there's already a fetch in progress
        const pendingFetch = getPendingFetch<Category[]>(CACHE_KEY);
        if (pendingFetch) {
            pendingFetch.then((data) => {
                setCategories(data);
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
                setInCache(CACHE_KEY, data);
                setCategories(data);
            })
            .catch((err) => {
                setError(err instanceof Error ? err.message : "Unknown error");
            })
            .finally(() => {
                setIsLoading(false);
                clearPendingFetch(CACHE_KEY);
            });
    }, [fetchData]);

    return { categories, isLoading, error };
}
