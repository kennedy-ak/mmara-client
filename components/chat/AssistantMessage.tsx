/**
 * Assistant Message Component
 */

'use client';

import { useState } from 'react';
import { LocalMessage, Citation } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  AlertTriangle,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Star,
  StarOff,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AssistantMessageProps {
  message: LocalMessage;
}

export function AssistantMessage({ message }: AssistantMessageProps) {
  const [citationsExpanded, setCitationsExpanded] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<number | null>(null);

  const urgencyLevel = message.urgency;
  const isEmergency = message.is_emergency;

  const handleFeedback = (rating: number) => {
    setFeedbackGiven(rating);
    // In a real app, send this to the server
    console.log('Feedback:', rating, 'for message:', message.id);
  };

  return (
    <div className="flex items-start gap-3">
      <Avatar className="h-8 w-8 shrink-0">
        <div className="flex h-full w-full items-center justify-center bg-muted">
          <span className="text-xs font-bold">AI</span>
        </div>
      </Avatar>

      <div className="max-w-[80%] space-y-3">
        {/* Emergency Alert */}
        {isEmergency && (
          <Card className="border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20">
            <div className="flex items-start gap-2 p-3">
              <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900 dark:text-red-100">
                  Urgent Situation Detected
                </p>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  This appears to be an urgent legal matter. Please consider contacting a lawyer
                  immediately for professional assistance.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Main Response */}
        <Card className="px-4 py-3">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          </div>

          {/* Urgency Badge */}
          {urgencyLevel && urgencyLevel !== 'low' && (
            <div className="mt-3">
              <Badge
                variant={
                  urgencyLevel === 'high' || urgencyLevel === 'critical'
                    ? 'destructive'
                    : 'secondary'
                }
                className="capitalize"
              >
                Urgency: {urgencyLevel}
              </Badge>
            </div>
          )}

          {/* Confidence Score */}
          {message.confidence !== undefined && (
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <span>Confidence:</span>
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    message.confidence > 0.7
                      ? 'bg-green-500'
                      : message.confidence > 0.4
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${message.confidence * 100}%` }}
                />
              </div>
              <span>{Math.round(message.confidence * 100)}%</span>
            </div>
          )}

          {/* Citations */}
          {message.citations && message.citations.length > 0 && (
            <div className="mt-4 pt-3 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCitationsExpanded(!citationsExpanded)}
                className="text-xs"
              >
                {citationsExpanded ? (
                  <ChevronUp className="mr-1 h-3 w-3" />
                ) : (
                  <ChevronDown className="mr-1 h-3 w-3" />
                )}
                {message.citations.length} Source{message.citations.length > 1 ? 's' : ''} Cited
              </Button>

              {citationsExpanded && (
                <div className="mt-3 space-y-2">
                  {message.citations.map((citation, idx) => (
                    <CitationCard key={idx} citation={citation} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Feedback */}
          <div className="mt-4 pt-3 border-t flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Was this helpful?</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleFeedback(rating)}
                  className="p-1 hover:bg-muted rounded transition-colors"
                >
                  {feedbackGiven && feedbackGiven >= rating ? (
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ) : (
                    <StarOff className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          {message.disclaimer && (
            <div className="mt-3 pt-3 border-t">
              <p className="text-xs text-muted-foreground italic">{message.disclaimer}</p>
            </div>
          )}
        </Card>

        {/* Timestamp */}
        <p className="text-xs text-muted-foreground px-2">
          {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
}

function CitationCard({ citation }: { citation: Citation }) {
  return (
    <Card className="p-3 bg-muted/50">
      <div className="flex items-start gap-2">
        <BookOpen className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">
            {citation.act}
            {citation.section && ` §${citation.section}`}
            {citation.subsection && `(${citation.subsection})`}
          </p>
          {citation.text && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {citation.text}
            </p>
          )}
          {citation.source_file && (
            <p className="text-xs text-muted-foreground mt-1 italic">
              Source: {citation.source_file}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
