const baseUrl = '';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestOptions<T = unknown> {
  headers?: Record<string, string>;
  params?: Record<string, string>;
  data?: T;
}

/**
 * REST client for making HTTP requests
 */
export class RestClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string, defaultHeaders: Record<string, string> = {}) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...defaultHeaders
    };
  }

  /**
   * Make a GET request
   * @param url - The URL to request
   * @param options - Request options
   * @returns Promise with the response data of type ResponseType
   */
  async get<ResponseType = unknown>(url: string, options: RequestOptions = {}): Promise<ResponseType> {
    return this.request<null, ResponseType>('GET', url, { ...options, data: null });
  }

  /**
   * Make a POST request
   * @param url - The URL to request
   * @param data - The data to send
   * @param options - Request options
   * @returns Promise with the response data of type ResponseType
   */
  async post<RequestType = unknown, ResponseType = unknown>(
    url: string,
    data?: RequestType,
    options: RequestOptions = {}
  ): Promise<ResponseType> {
    return this.request<RequestType, ResponseType>('POST', url, { ...options, data });
  }

  /**
   * Make a PUT request
   * @param url - The URL to request
   * @param data - The data to send
   * @param options - Request options
   * @returns Promise with the response data of type ResponseType
   */
  async put<RequestType = unknown, ResponseType = unknown>(
    url: string,
    data?: RequestType,
    options: RequestOptions = {}
  ): Promise<ResponseType> {
    return this.request<RequestType, ResponseType>('PUT', url, { ...options, data });
  }

  /**
   * Make a DELETE request
   * @param url - The URL to request
   * @param options - Request options
   * @returns Promise with the response data of type ResponseType
   */
  async delete<ResponseType = unknown>(url: string, options: RequestOptions = {}): Promise<ResponseType> {
    return this.request<null, ResponseType>('DELETE', url, { ...options, data: null });
  }

  /**
   * Make an HTTP request
   * @param method - The HTTP method
   * @param url - The URL to request
   * @param options - Request options
   * @returns Promise with the response data of type ResponseType
   */
  private async request<RequestType, ResponseType>(
    method: HttpMethod,
    url: string,
    { headers = {}, params = {}, data }: RequestOptions<RequestType>
  ): Promise<ResponseType> {
    // Build the full URL with query parameters
    const queryParams = new URLSearchParams(params).toString();
    const fullUrl = `${this.baseUrl}${url}${queryParams ? `?${queryParams}` : ''}`;

    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers: {
        ...this.defaultHeaders,
        ...headers
      }
    };

    // Add body for methods that support it
    if (method !== 'GET' && data !== undefined && data !== null) {
      requestOptions.body = JSON.stringify(data);
    }

    // Make the request
    const response = await fetch(fullUrl, requestOptions);

    // Parse the response
    let responseData: ResponseType;
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
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
const client = new RestClient(baseUrl);
export default client;
