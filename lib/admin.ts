/**
 * Admin service for document management and system administration
 */

import apiClient from './api-client';
import {
  DocumentInfo,
  DocumentStats,
  RetrievalRequest,
  RetrievalResult,
  ReindexRequest,
  DocType,
  FeedbackItem,
  FeedbackListResponse,
  FeedbackDetailResponse,
  FeedbackStats,
} from './types';

const ADMIN_BASE = '/admin';

export const adminService = {
  // ==================== Document Management ====================

  /**
   * Upload a document
   */
  async uploadDocument(
    file: File,
    category: string,
    docType: DocType
  ): Promise<DocumentInfo> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    formData.append('doc_type', docType);

    const response = await apiClient.post<DocumentInfo>(
      `${ADMIN_BASE}/documents`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  /**
   * List all documents
   */
  async listDocuments(skip = 0, limit = 50): Promise<DocumentInfo[]> {
    const response = await apiClient.get<DocumentInfo[]>(
      `${ADMIN_BASE}/documents`,
      {
        params: { skip, limit },
      }
    );
    return response.data;
  },

  /**
   * Delete a document
   */
  async deleteDocument(documentId: number): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(
      `${ADMIN_BASE}/documents/${documentId}`
    );
    return response.data;
  },

  /**
   * Process pending documents
   */
  async processPendingDocuments(): Promise<{
    message: string;
    processed: number;
    total: number;
  }> {
    const response = await apiClient.post<{
      message: string;
      processed: number;
      total: number;
    }>(`${ADMIN_BASE}/process-pending`);
    return response.data;
  },

  // ==================== Reindexing ====================

  /**
   * Trigger reindexing of documents
   */
  async reindex(request: ReindexRequest): Promise<{
    message: string;
    categories: string[] | null;
  }> {
    const response = await apiClient.post<{
      message: string;
      categories: string[] | null;
    }>(`${ADMIN_BASE}/reindex`, request);
    return response.data;
  },

  // ==================== Retrieval Testing ====================

  /**
   * Test retrieval with a custom query
   */
  async testRetrieval(request: RetrievalRequest): Promise<RetrievalResult[]> {
    const response = await apiClient.post<RetrievalResult[]>(
      `${ADMIN_BASE}/retrieve`,
      request
    );
    return response.data;
  },

  // ==================== Statistics ====================

  /**
   * Get document statistics
   */
  async getStats(): Promise<DocumentStats> {
    const response = await apiClient.get<DocumentStats>(`${ADMIN_BASE}/stats`);
    return response.data;
  },

  // ==================== Feedback Management ====================

  /**
   * List feedback with pagination and filters
   */
  async listFeedback(params: {
    page?: number;
    page_size?: number;
    category?: string;
    min_rating?: number;
    max_rating?: number;
    flagged_only?: boolean;
  } = {}): Promise<FeedbackListResponse> {
    const response = await apiClient.get<FeedbackListResponse>(
      `${ADMIN_BASE}/feedback`,
      { params }
    );
    return response.data;
  },

  /**
   * Get feedback detail with conversation
   */
  async getFeedbackDetail(feedbackId: number): Promise<FeedbackDetailResponse> {
    const response = await apiClient.get<FeedbackDetailResponse>(
      `${ADMIN_BASE}/feedback/${feedbackId}`
    );
    return response.data;
  },

  /**
   * Flag/unflag feedback
   */
  async flagFeedback(
    feedbackId: number,
    flagged: boolean,
    reason?: string
  ): Promise<FeedbackItem> {
    const response = await apiClient.post<FeedbackItem>(
      `${ADMIN_BASE}/feedback/${feedbackId}/flag`,
      { flagged, reason }
    );
    return response.data;
  },

  /**
   * Respond to user feedback
   */
  async respondToFeedback(feedbackId: number, message: string): Promise<void> {
    await apiClient.post(`${ADMIN_BASE}/feedback/${feedbackId}/respond`, { message });
  },

  /**
   * Get feedback statistics
   */
  async getFeedbackStats(): Promise<FeedbackStats> {
    const response = await apiClient.get<FeedbackStats>(`${ADMIN_BASE}/feedback/stats`);
    return response.data;
  },

  /**
   * Export feedback
   */
  async exportFeedback(params: {
    format?: 'csv' | 'json';
    date_from?: string;
    date_to?: string;
    category?: string;
    min_rating?: number;
    max_rating?: number;
    flagged_only?: boolean;
  } = {}): Promise<Blob> {
    const response = await apiClient.get(`${ADMIN_BASE}/feedback/export`, {
      params,
      responseType: 'blob',
    });
    return response.data;
  },
};
