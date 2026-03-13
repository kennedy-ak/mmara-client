/**
 * Chat Input Component
 */

'use client';

import { forwardRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
  placeholder?: string;
}

export const ChatInput = forwardRef<HTMLTextAreaElement, ChatInputProps>(
  ({ value, onChange, onSend, onKeyDown, isLoading, placeholder }, ref) => {
    // Auto-resize textarea
    useEffect(() => {
      const textarea = ref as React.RefObject<HTMLTextAreaElement>;
      if (textarea.current) {
        textarea.current.style.height = 'auto';
        textarea.current.style.height = `${Math.min(textarea.current.scrollHeight, 200)}px`;
      }
    }, [value, ref]);

    return (
      <div className="flex items-end gap-2">
        <Textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          className="min-h-[60px] max-h-[200px] resize-none"
          rows={1}
        />
        <Button
          onClick={onSend}
          disabled={!value.trim() || isLoading}
          size="icon"
          className="h-[60px] w-[60px] shrink-0"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    );
  }
);

ChatInput.displayName = 'ChatInput';
