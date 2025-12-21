/**
 * HTTP Client - Generic fetch wrapper with Clerk authentication
 */

export class HttpClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    /**
     * Generic fetch wrapper with error handling and auth
     * Note: Auth token should be passed from client components using useAuth()
     */
    async request<T>(
        endpoint: string,
        options?: RequestInit & { token?: string | null }
    ): Promise<T> {
        try {
            const { token, ...fetchOptions } = options || {};

            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                ...fetchOptions,
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                    ...fetchOptions?.headers,
                },
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({
                    detail: 'Unknown error'
                }));
                throw new Error(
                    error.detail || `HTTP ${response.status}: ${response.statusText}`
                );
            }

            return await response.json();
        } catch (error) {
            console.error('HTTP Error:', error);
            throw error;
        }
    }

    /**
     * GET request
     */
    async get<T>(endpoint: string, token?: string | null): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET', token });
    }

    /**
     * POST request
     */
    async post<T>(endpoint: string, data?: any, token?: string | null): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
            token
        });
    }

    /**
     * PUT request
     */
    async put<T>(endpoint: string, data?: any, token?: string | null): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
            token
        });
    }

    /**
     * DELETE request
     */
    async delete<T>(endpoint: string, token?: string | null): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE', token });
    }
}

// Create and export singleton instance
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
export const httpClient = new HttpClient(API_BASE_URL);
