/**
 * Message List Component
 * Renders a list of chat messages
 */

'use client';

import { LocalMessage } from '@/lib/types';
import { UserMessage } from './UserMessage';
import { AssistantMessage } from './AssistantMessage';

interface MessageListProps {
  messages: LocalMessage[];
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="space-y-6">
      {messages.map((message, index) => {
        if (message.role === 'user') {
          return <UserMessage key={message.id || index} message={message} />;
        } else {
          return (
            <AssistantMessage
              key={message.id || index}
              message={message}
            />
          );
        }
      })}
    </div>
  );
}
