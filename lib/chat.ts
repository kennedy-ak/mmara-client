/**
 * Chat service for RAG-powered legal assistance
 */

import apiClient from './api-client';
import {
  ChatRequest,
  ChatResponse,
  ChatFeedback,
  SessionsListResponse,
  ChatHistoryResponse,
  StreamingChunk,
} from './types';

const CHAT_BASE = '/chat';

// WebSocket connection for streaming
let ws: WebSocket | null = null;
let wsMessageHandlers: ((chunk: StreamingChunk) => void)[] = [];
let wsCloseHandlers: (() => void)[] = [];
let wsErrorHandlers: ((error: Event) => void)[] = [];

export const chatService = {
  /**
   * Send a message and get a response (non-streaming)
   */
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const response = await apiClient.post<ChatResponse>(`${CHAT_BASE}/message`, request);
    return response.data;
  },

  /**
   * Get all chat sessions for current user
   */
  async getSessions(limit = 10, offset = 0): Promise<SessionsListResponse> {
    const response = await apiClient.get<SessionsListResponse>(`${CHAT_BASE}/history`, {
      params: { limit, offset },
    });
    return response.data;
  },

  /**
   * Get a specific session's history
   */
  async getSession(sessionId: string): Promise<ChatHistoryResponse> {
    const response = await apiClient.get<ChatHistoryResponse>(
      `${CHAT_BASE}/history/${sessionId}`
    );
    return response.data;
  },

  /**
   * Delete a specific session
   */
  async deleteSession(sessionId: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(
      `${CHAT_BASE}/history/${sessionId}`
    );
    return response.data;
  },

  /**
   * Delete all sessions
   */
  async deleteAllSessions(): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`${CHAT_BASE}/history`);
    return response.data;
  },

  /**
   * Submit feedback on a response
   */
  async submitFeedback(feedback: ChatFeedback): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      `${CHAT_BASE}/feedback`,
      feedback
    );
    return response.data;
  },

  // ==================== WebSocket Streaming ====================

  /**
   * Connect to WebSocket for streaming responses
   */
  connectWebSocket(token: string) {
    if (ws && ws.readyState === WebSocket.OPEN) {
      return ws;
    }

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';
    ws = new WebSocket(`${wsUrl}/api/v1${CHAT_BASE}/stream`);

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const chunk: StreamingChunk = JSON.parse(event.data);
        wsMessageHandlers.forEach((handler) => handler(chunk));
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      wsCloseHandlers.forEach((handler) => handler());
      ws = null;
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      wsErrorHandlers.forEach((handler) => handler(error));
    };

    return ws;
  },

  /**
   * Send a message via WebSocket for streaming response
   */
  sendWebSocketMessage(message: string, sessionId?: string, category?: string) {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected');
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No access token available');
    }

    ws.send(
      JSON.stringify({
        token,
        message,
        session_id: sessionId,
        category,
      })
    );
  },

  /**
   * Register a handler for incoming WebSocket messages
   */
  onWebSocketMessage(handler: (chunk: StreamingChunk) => void) {
    wsMessageHandlers.push(handler);
    return () => {
      wsMessageHandlers = wsMessageHandlers.filter((h) => h !== handler);
    };
  },

  /**
   * Register a handler for WebSocket close events
   */
  onWebSocketClose(handler: () => void) {
    wsCloseHandlers.push(handler);
    return () => {
      wsCloseHandlers = wsCloseHandlers.filter((h) => h !== handler);
    };
  },

  /**
   * Register a handler for WebSocket errors
   */
  onWebSocketError(handler: (error: Event) => void) {
    wsErrorHandlers.push(handler);
    return () => {
      wsErrorHandlers = wsErrorHandlers.filter((h) => h !== handler);
    };
  },

  /**
   * Close the WebSocket connection
   */
  closeWebSocket() {
    if (ws) {
      ws.close();
      ws = null;
    }
  },

  /**
   * Check if WebSocket is connected
   */
  isWebSocketConnected(): boolean {
    return ws !== null && ws.readyState === WebSocket.OPEN;
  },
};
