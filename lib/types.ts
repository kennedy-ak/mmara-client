/**
 * TypeScript types matching backend Pydantic models
 */

// ==================== User Types ====================
export interface User {
  id: number;
  email: string;
  full_name?: string;
  phone?: string;
  role: 'user' | 'admin';
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface UserCreate {
  email: string;
  password: string;
  full_name?: string;
  phone?: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface Token {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  new_password: string;
}

export interface PasswordResetResponse {
  message: string;
  success: boolean;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

// ==================== Chat Types ====================
export interface Citation {
  act: string;
  section?: string;
  subsection?: string;
  text: string;
  source_file?: string;
}

export interface ChatRequest {
  message: string;
  session_id?: string;
  category?: 'criminal' | 'road_traffic' | 'general';
}

export interface ChatResponse {
  response: string;
  session_id: string;
  message_id: string;
  citations: Citation[];
  confidence: number;
  category: string;
  urgency: string;
  is_emergency: boolean;
  disclaimer: string;
  timestamp: string;
  response_time_ms?: number;
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface ChatHistoryResponse {
  session_id: string;
  title?: string;
  category?: string;
  messages: Message[];
  message_count: number;
  created_at: string;
  updated_at: string;
}

export interface SessionsListResponse {
  sessions: ChatHistoryResponse[];
  total: number;
}

export interface ChatFeedback {
  message_id: string;
  rating: number;
  comment?: string;
  helpful: boolean;
}

export interface StreamingChunk {
  type: 'chunk' | 'citation' | 'done' | 'error' | 'metadata';
  data: {
    delta?: string;
    done?: boolean;
    citation?: Citation;
    message?: string;
    session_id?: string;
    message_id?: string;
    category?: string;
    urgency?: string;
    confidence?: number;
    is_emergency?: boolean;
    disclaimer?: string;
  };
}

// ==================== Document Types ====================
export interface DocumentInfo {
  id: number;
  filename: string;
  category: string;
  doc_type: string;
  status: string;
  chunk_count: number;
  uploaded_at: string;
  processed_at?: string;
}

export interface DocumentStats {
  total_documents: number;
  total_chunks: number;
  by_category: Record<string, number>;
  by_doc_type: Record<string, number>;
  last_updated: number;
}

export interface RetrievalResult {
  chunk_id: string;
  text: string;
  metadata: Record<string, any>;
  score: number;
  rerank_score?: number;
}

export interface RetrievalRequest {
  query: string;
  top_k?: number;
  category?: string;
  alpha?: number;
  rerank?: boolean;
}

export interface ReindexRequest {
  categories?: string[];
  force: boolean;
}

// ==================== API Response Types ====================
export interface ApiError {
  detail: string;
  status?: number;
}

export interface PaginationParams {
  skip?: number;
  limit?: number;
}

// ==================== Local Types ====================
export interface ChatSession {
  id: string;
  title: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

export interface LocalMessage extends Message {
  id?: string;
  pending?: boolean;
  citations?: Citation[];
  confidence?: number;
  urgency?: string;
  is_emergency?: boolean;
  disclaimer?: string;
}

export enum LegalCategory {
  CRIMINAL = 'criminal',
  ROAD_TRAFFIC = 'road_traffic',
  GENERAL = 'general',
}

export const LEGAL_CATEGORIES = [
  { value: LegalCategory.CRIMINAL, label: 'Criminal Law', description: 'Arrest, bail, detention, search and seizure' },
  { value: LegalCategory.ROAD_TRAFFIC, label: 'Road Traffic', description: 'Traffic stops, accidents, licensing' },
  { value: LegalCategory.GENERAL, label: 'General Legal', description: 'Other legal matters' },
] as const;

export const DOC_TYPES = [
  { value: 'act', label: 'Act' },
  { value: 'amendment', label: 'Amendment' },
  { value: 'regulation', label: 'Regulation' },
  { value: 'legislative_instrument', label: 'Legislative Instrument' },
  { value: 'other', label: 'Other' },
] as const;

export type DocType = typeof DOC_TYPES[number]['value'];

// ==================== Feedback Types ====================
export interface FeedbackItem {
  id: number;
  user_id: number;
  user_email: string;
  user_name?: string;
  session_id?: string;
  message_id?: string;
  query_type: string;
  category?: string;
  satisfaction?: number;  // 1-5 rating
  feedback?: string;  // User comment
  message_content?: string;  // Original user query
  response_content?: string;  // AI response
  flagged: boolean;
  flagged_reason?: string;
  admin_response?: string;
  admin_responded_at?: string;
  admin_responded_by?: number;
  admin_responded_by_name?: string;
  created_at: string;
}

export interface FeedbackListResponse {
  items: FeedbackItem[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface FeedbackDetailResponse extends FeedbackItem {
  urgency?: string;
  conversation_history?: Message[];
  response_time_ms?: number;
  retrieval_count?: number;
  is_emergency?: boolean;
}

export interface FeedbackStats {
  total_feedback: number;
  average_rating: number | null;
  rating_distribution: Record<number, number>;
  flagged_count: number;
  by_category: Record<string, number>;
  recent_count: number;
}
