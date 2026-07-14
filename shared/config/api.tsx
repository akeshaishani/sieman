// Url
export const CLIENT_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

// Workspace and Project IDs
export const WORKSPACE_ID = process.env.NEXT_PUBLIC_WORKSPACE_ID || '';
export const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID || '';

// API Key
export const API_KEY = process.env.NEXT_PUBLIC_BEARER_TOKEN || '';

// API Headers for Analytics (uses Authorization Bearer)
export const API_HEADERS: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
};

// API Endpoints with full URLs
export const API_ENDPOINTS = {
    ANALYTICS: `${CLIENT_BASE_URL}/v1/analytics`,
    COMPANY_DETAILS: `${CLIENT_BASE_URL}/v1/apps/cms/2af68932-2326-4afe-9650-28069cf62ade/records`,
    CATEGORIES : `${CLIENT_BASE_URL}/v1/apps/cms/330d1ea0-ea98-455e-88d4-b01198e83194/records`,
    CUSTOM_ORDER : `${CLIENT_BASE_URL}/v1/apps/cms/edfe4300-8cdc-4f99-ab0c-1b70de57f399/records`,
    PRODUCTS : `${CLIENT_BASE_URL}/v1/apps/cms/ea85e6a2-fecf-4c9f-81c3-57ee6974879b/records`,
    ORDERS : `${CLIENT_BASE_URL}/v1/apps/cms/92a2db49-4150-4314-9235-8ed7e1ea453c/records`,
    OUR_STORY : `${CLIENT_BASE_URL}/v1/apps/cms/07d3f6a3-b6ca-4ac2-b604-4baa38e8c99d/records`,
    CEYLORA_COLLECTION : `${CLIENT_BASE_URL}/v1/apps/cms/82c15b71-3a60-4e1c-8c4f-38adaacda4e9/records`
}