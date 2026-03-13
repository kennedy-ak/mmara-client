/**
 * Axios API client with authentication interceptors
 */

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_URL}/api/v1`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Get token from localStorage (only runs on client)
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('access_token');
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle errors and token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Handle 401 Unauthorized - try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            if (typeof window !== 'undefined') {
              const refreshToken = localStorage.getItem('refresh_token');
              if (refreshToken) {
                // Use a separate axios instance for refresh to avoid interceptor loop
                const response = await axios.post(
                  `${API_URL}/api/v1/auth/refresh`,
                  null,
                  {
                    params: { refresh_token: refreshToken },
                  }
                );

                const { access_token, refresh_token: newRefreshToken } = response.data;

                // Store new tokens
                localStorage.setItem('access_token', access_token);
                if (newRefreshToken) {
                  localStorage.setItem('refresh_token', newRefreshToken);
                }

                // Update header and retry original request
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${access_token}`;
                }
                return this.client(originalRequest);
              }
            }
          } catch (refreshError) {
            // Refresh failed - clear tokens and redirect to login
            if (typeof window !== 'undefined') {
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              localStorage.removeItem('user');
              // Don't redirect here - let the calling code handle it
              // to avoid redirect loops
            }
            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  public getClient(): AxiosInstance {
    return this.client;
  }

  // Helper method to set auth token (useful after login)
  public setAuthToken(token: string) {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Helper method to clear auth token
  public clearAuthToken() {
    delete this.client.defaults.headers.common['Authorization'];
  }
}

// Singleton instance
const apiClient = new ApiClient();
export default apiClient.getClient();

// Re-export the class for testing purposes
export { ApiClient };
