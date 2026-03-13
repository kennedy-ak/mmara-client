/**
 * User Message Component
 */

'use client';

import { LocalMessage } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface UserMessageProps {
  message: LocalMessage;
}

export function UserMessage({ message }: UserMessageProps) {
  return (
    <div className="flex items-start gap-3 justify-end">
      <div className="max-w-[80%] space-y-1">
        <Card className="bg-primary text-primary-foreground px-4 py-3">
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </Card>
        <p className="text-xs text-muted-foreground text-right px-2">
          {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
        </p>
      </div>
      <Avatar className="h-8 w-8 shrink-0">
        <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground">
          <User className="h-4 w-4" />
        </div>
      </Avatar>
    </div>
  );
}
