/**
 * Chat Interface Component
 * Main chat component with message display and input
 */

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageList } from './MessageList';
import { CategorySelector } from './CategorySelector';
import { ChatInput } from './ChatInput';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { chatService } from '@/lib/chat';
import { LocalMessage, LegalCategory } from '@/lib/types';
import { Loader2, StopCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ChatInterfaceProps {
  sessionId?: string;
  initialMessages?: LocalMessage[];
  category?: string;
}

export function ChatInterface({
  sessionId: initialSessionId,
  initialMessages = [],
  category: initialCategory,
}: ChatInterfaceProps) {
  const { user } = useAuth();

  const [sessionId, setSessionId] = useState(initialSessionId);
  const [messages, setMessages] = useState<LocalMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<LegalCategory | undefined>(
    initialCategory as LegalCategory
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [error, setError] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, streamingMessage]);

  // Focus textarea on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    setInput('');
    setError('');
    setIsLoading(true);

    // Add user message
    const userMessage: LocalMessage = {
      role: 'user',
      content: trimmedInput,
      timestamp: new Date().toISOString(),
      id: `user-${Date.now()}`,
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await chatService.sendMessage({
        message: trimmedInput,
        session_id: sessionId,
        category: selectedCategory,
      });

      // Update session ID if new session was created
      if (!sessionId && response.session_id) {
        setSessionId(response.session_id);
      }

      // Add assistant message
      const assistantMessage: LocalMessage = {
        role: 'assistant',
        content: response.response,
        timestamp: response.timestamp,
        id: response.message_id,
        citations: response.citations,
        confidence: response.confidence,
        urgency: response.urgency,
        is_emergency: response.is_emergency,
        disclaimer: response.disclaimer,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Update category if detected
      if (response.category && !selectedCategory) {
        setSelectedCategory(response.category as LegalCategory);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Failed to send message';
      setError(errorMsg);
      toast.error(errorMsg);

      // Remove user message on error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = () => {
    setSessionId(undefined);
    setMessages([]);
    setStreamingMessage('');
    setError('');
    setSelectedCategory(undefined);
    textareaRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">
            {sessionId ? 'Continue Chat' : 'New Conversation'}
          </h2>
          {selectedCategory && (
            <span className="text-sm text-muted-foreground capitalize">
              • {selectedCategory.replace('_', ' ')} Law
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!sessionId && (
            <CategorySelector
              value={selectedCategory}
              onChange={setSelectedCategory}
            />
          )}
          <Button variant="outline" size="sm" onClick={handleNewChat}>
            New Chat
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-6 py-4">
          {messages.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
              <div className="p-4 rounded-full bg-primary/10">
                <div className="text-4xl">⚖️</div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Start a conversation</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Ask me anything about Ghanaian law. I can help with questions about criminal law,
                  road traffic regulations, and other legal matters.
                </p>
              </div>
              {!selectedCategory && (
                <div className="pt-4">
                  <p className="text-sm text-muted-foreground mb-2">Select a category to get started:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['criminal', 'road_traffic', 'general'].map((cat) => (
                      <Button
                        key={cat}
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCategory(cat as LegalCategory)}
                        className="capitalize"
                      >
                        {cat.replace('_', ' ')}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <MessageList messages={messages} />
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary-foreground">AI</span>
                  </div>
                  <Card className="px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Thinking...
                    </div>
                  </Card>
                </div>
              )}
              {error && (
                <Card className="border-destructive bg-destructive/10">
                  <div className="flex items-center gap-2 text-sm text-destructive p-4">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                </Card>
              )}
              <div ref={scrollRef} />
            </>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="pt-4 border-t">
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={handleSendMessage}
          onKeyDown={handleKeyDown}
          isLoading={isLoading}
          placeholder={
            selectedCategory
              ? `Ask about ${selectedCategory.replace('_', ' ')} law...`
              : 'Ask a legal question...'
          }
          ref={textareaRef}
        />
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
