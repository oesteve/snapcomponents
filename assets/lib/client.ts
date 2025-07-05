const { baseUrl, token } = window.__snapComponents || {};

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions {
    headers?: Record<string, string>;
    params?: Record<string, string>;
    data?: unknown;
    isFormData?: boolean;
}

/**
 * REST client for making HTTP requests
 */
export class RestClient {
    private baseUrl: string;
    private token?: string;
    private defaultHeaders: Record<string, string>;

    constructor(
        baseUrl?: string,
        defaultHeaders: Record<string, string> = {},
        token?: string,
    ) {
        this.baseUrl = baseUrl || "";
        this.token = token;
        this.defaultHeaders = {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...defaultHeaders,
        };
    }

    /**
     * Make a GET request
     * @param url - The URL to request
     * @param options - Request options
     * @returns Promise with the response data of type ResponseType
     * @throws {HttpError} If the response status is not 200 (OK)
     */
    async get<ResponseType = unknown>(
        url: string,
        options: RequestOptions = {},
    ): Promise<ResponseType> {
        return this.request<ResponseType>("GET", url, {
            ...options,
            data: null,
        });
    }

    /**
     * Make a POST request
     * @param url - The URL to request
     * @param data - The data to send
     * @param options - Request options
     * @returns Promise with the response data of type ResponseType
     * @throws {HttpError} If the response status is not 200 (OK)
     */
    async post<ResponseType = unknown>(
        url: string,
        data?: unknown,
        options: RequestOptions = {},
    ): Promise<ResponseType> {
        return this.request<ResponseType>("POST", url, { ...options, data });
    }

    /**
     * Make a POST request with FormData
     * @param url - The URL to request
     * @param formData - The FormData object to send
     * @param options - Request options
     * @returns Promise with the response data of type ResponseType
     * @throws {HttpError} If the response status is not 200 (OK)
     */
    async postFormData<ResponseType = unknown>(
        url: string,
        formData: FormData,
        options: RequestOptions = {},
    ): Promise<ResponseType> {
        return this.request<ResponseType>("POST", url, {
            ...options,
            data: formData,
            isFormData: true
        });
    }

    /**
     * Make a PUT request
     * @param url - The URL to request
     * @param data - The data to send
     * @param options - Request options
     * @returns Promise with the response data of type ResponseType
     * @throws {HttpError} If the response status is not 200 (OK)
     */
    async put<ResponseType = unknown>(
        url: string,
        data: unknown,
        options: RequestOptions = {},
    ): Promise<ResponseType> {
        return this.request<ResponseType>("PUT", url, { ...options, data });
    }

    /**
     * Make a DELETE request
     * @param url - The URL to request
     * @param options - Request options
     * @returns Promise with the response data of type ResponseType
     * @throws {HttpError} If the response status is not 200 (OK)
     */
    async delete<ResponseType = unknown>(
        url: string,
        options: RequestOptions = {},
    ): Promise<ResponseType> {
        return this.request<ResponseType>("DELETE", url, {
            ...options,
            data: null,
        });
    }

    /**
     * Make an HTTP request
     * @param method - The HTTP method
     * @param url - The URL to request
     * @param options - Request options
     * @returns Promise with the response data of type ResponseType
     * @throws {HttpError} If the response status is not 200 (OK)
     */
    private async request<ResponseType>(
        method: HttpMethod,
        url: string,
        { headers = {}, params = {}, data, isFormData = false }: RequestOptions,
    ): Promise<ResponseType> {
        // Build the full URL with query parameters
        const queryParams = new URLSearchParams(params).toString();
        const fullUrl = `${this.baseUrl}${url}${queryParams ? `?${queryParams}` : ""}`;

        console.log(this.token);

        // Prepare request options
        const requestOptions: RequestInit = {
            method,
            headers: {
                ...(isFormData ? {} : this.defaultHeaders),
                ...headers,
                ...(this.token
                    ? { Authorization: `Bearer ${this.token}` }
                    : {}),
            },
        };

        // Add body for methods that support it
        if (method !== "GET" && data !== undefined && data !== null) {
            if (isFormData) {
                requestOptions.body = data as FormData;
            } else {
                requestOptions.body = JSON.stringify(data);
            }
        }

        // Make the request
        const response = await fetch(fullUrl, requestOptions);

        // Check if the response status is not 200 (OK)
        if (response.status !== 200) {
            let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;

            // Try to extract more detailed error message from response if possible
            try {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json();
                    if (errorData.message) {
                        errorMessage = errorData.message;
                    }
                }
            } catch {
                // If we can't parse the error response, just use the default error message
            }

            // Import dynamically to avoid circular dependencies
            const { HttpError } = await import("@/lib/error/http-error");
            throw new HttpError(errorMessage, response.status);
        }

        // Parse the response
        let responseData: ResponseType;
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
            responseData = await response.json();
        } else {
            const text = await response.text();
            try {
                responseData = JSON.parse(text) as ResponseType;
            } catch {
                responseData = text as unknown as ResponseType;
            }
        }

        // Return the response data directly
        return responseData;
    }
}

// Create and export a default client instance
const client = new RestClient(baseUrl, {}, token);
export default client;
