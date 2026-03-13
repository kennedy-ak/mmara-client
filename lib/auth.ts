/**
 * Authentication service
 */

import apiClient from './api-client';
import {
  User,
  UserCreate,
  UserLogin,
  Token,
  PasswordResetRequest,
  PasswordResetConfirm,
  PasswordResetResponse,
  ChangePasswordRequest,
} from './types';

const AUTH_BASE = '/auth';

// Token management helpers
export const setTokens = (tokens: Token) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('access_token', tokens.access_token);
  localStorage.setItem('refresh_token', tokens.refresh_token);
  // Calculate expiry time
  const expiresAt = Date.now() + tokens.expires_in * 1000;
  localStorage.setItem('token_expires_at', expiresAt.toString());
};

export const clearTokens = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('token_expires_at');
  localStorage.removeItem('user');
};

export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
};

export const isTokenExpired = (): boolean => {
  if (typeof window === 'undefined') return true;
  const expiresAt = localStorage.getItem('token_expires_at');
  if (!expiresAt) return true;
  return Date.now() > parseInt(expiresAt, 10);
};

export const setUser = (user: User) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

// API calls
export const authService = {
  /**
   * Register a new user
   */
  async register(data: UserCreate): Promise<User> {
    const response = await apiClient.post<User>(`${AUTH_BASE}/register`, data);
    return response.data;
  },

  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<{ user: User; tokens: Token }> {
    // Using form-data style login (OAuth2PasswordRequestForm compatible)
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);

    const response = await apiClient.post<Token>(
      `${AUTH_BASE}/login`,
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    // Store tokens BEFORE calling /me so the interceptor can attach the Bearer header
    setTokens(response.data);

    // After login, get user info
    const userResponse = await apiClient.get<User>(`${AUTH_BASE}/me`);

    return {
      user: userResponse.data,
      tokens: response.data,
    };
  },

  /**
   * Login with JSON body
   */
  async loginJson(data: UserLogin): Promise<{ user: User; tokens: Token }> {
    const response = await apiClient.post<Token>(`${AUTH_BASE}/login/json`, data);

    // Store tokens BEFORE calling /me so the interceptor can attach the Bearer header
    setTokens(response.data);

    // After login, get user info
    const userResponse = await apiClient.get<User>(`${AUTH_BASE}/me`);

    return {
      user: userResponse.data,
      tokens: response.data,
    };
  },

  /**
   * Get current user info
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>(`${AUTH_BASE}/me`);
    return response.data;
  },

  /**
   * Logout (client-side)
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post(`${AUTH_BASE}/logout`);
    } catch {
      // Ignore logout errors
    }
    clearTokens();
  },

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<Token> {
    const response = await apiClient.post<Token>(
      `${AUTH_BASE}/refresh`,
      null,
      {
        params: { refresh_token: refreshToken },
      }
    );
    return response.data;
  },

  /**
   * Request password reset
   */
  async requestPasswordReset(data: PasswordResetRequest): Promise<PasswordResetResponse> {
    const response = await apiClient.post<PasswordResetResponse>(
      `${AUTH_BASE}/password-reset/request`,
      data
    );
    return response.data;
  },

  /**
   * Confirm password reset with token
   */
  async confirmPasswordReset(data: PasswordResetConfirm): Promise<PasswordResetResponse> {
    const response = await apiClient.post<PasswordResetResponse>(
      `${AUTH_BASE}/password-reset/confirm`,
      data
    );
    return response.data;
  },

  /**
   * Change password (authenticated)
   */
  async changePassword(data: ChangePasswordRequest): Promise<PasswordResetResponse> {
    const response = await apiClient.post<PasswordResetResponse>(
      `${AUTH_BASE}/change-password`,
      data
    );
    return response.data;
  },
};
