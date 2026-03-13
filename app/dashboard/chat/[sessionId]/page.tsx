/**
 * Chat Session Page
 * Displays conversation history for a specific session
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { chatService } from '@/lib/chat';
import { ChatHistoryResponse, LocalMessage } from '@/lib/types';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ChatSessionPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [session, setSession] = useState<ChatHistoryResponse | null>(null);
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const sessionId = params.sessionId as string;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchSession = async () => {
      try {
        setIsLoading(true);
        const sessionData = await chatService.getSession(sessionId);
        setSession(sessionData);

        // Convert messages to LocalMessage format
        const localMessages: LocalMessage[] = sessionData.messages.map((msg, idx) => ({
          ...msg,
          id: `${sessionId}-${idx}`,
        }));
        setMessages(localMessages);
      } catch (err: any) {
        const errorMsg = err.response?.data?.detail || 'Failed to load chat session';
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, [sessionId, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
          <h3 className="text-lg font-semibold">Failed to load chat</h3>
          <p className="text-muted-foreground">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-primary hover:underline"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <ChatInterface
      sessionId={sessionId}
      initialMessages={messages}
      category={session?.category}
    />
  );
}
