import type { ApiError } from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
const DEFAULT_TIMEOUT = 300000;

export class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string = API_BASE_URL, timeout: number = DEFAULT_TIMEOUT) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  private async fetchWithTimeout(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request timeout");
      }
      throw error;
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;

      try {
        const errorData: ApiError = await response.json();
        errorMessage = errorData.detail || errorData.message || errorData.error || errorMessage;
      } catch {
      }

      throw new Error(errorMessage);
    }

    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      return response.json();
    } else if (contentType?.includes("text/plain")) {
      return response.text() as T;
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await this.fetchWithTimeout(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return this.handleResponse<T>(response);
  }

  async post<T, D = unknown>(endpoint: string, data?: D, isPlainText = false): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = isPlainText
      ? { "Content-Type": "text/plain" }
      : { "Content-Type": "application/json" };

    const response = await this.fetchWithTimeout(url, {
      method: "POST",
      headers,
      body: isPlainText ? (data as string) : JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  async put<T, D = unknown>(endpoint: string, data: D): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await this.fetchWithTimeout(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await this.fetchWithTimeout(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return this.handleResponse<T>(response);
  }
}

export const apiClient = new ApiClient();
