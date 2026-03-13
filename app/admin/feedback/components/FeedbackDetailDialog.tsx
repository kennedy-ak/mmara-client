/**
 * Feedback Detail Dialog Component
 * Shows full feedback details with conversation history and admin actions
 */

'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { adminService } from '@/lib/admin';
import { FeedbackItem, FeedbackDetailResponse } from '@/lib/types';
import {
  Star,
  User,
  Bot,
  Flag,
  CheckCircle2,
  Send,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface FeedbackDetailDialogProps {
  feedback: FeedbackItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated?: () => void;
}

export default function FeedbackDetailDialog({
  feedback,
  open,
  onOpenChange,
  onUpdated,
}: FeedbackDetailDialogProps) {
  const [detail, setDetail] = useState<FeedbackDetailResponse | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  useEffect(() => {
    if (open && feedback) {
      fetchDetail();
      // Pre-fill response if exists
      if (feedback.admin_response) {
        setResponseMessage(feedback.admin_response);
      } else {
        setResponseMessage('');
      }
    }
  }, [open, feedback]);

  const fetchDetail = async () => {
    try {
      setIsLoadingDetail(true);
      const data = await adminService.getFeedbackDetail(feedback.id);
      setDetail(data);
    } catch (error) {
      toast.error('Failed to load feedback details');
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleSendResponse = async () => {
    if (!responseMessage.trim()) {
      toast.error('Please enter a response message');
      return;
    }

    try {
      setIsResponding(true);
      await adminService.respondToFeedback(feedback.id, responseMessage);
      toast.success('Response sent successfully');
      onUpdated?.();
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to send response');
    } finally {
      setIsResponding(false);
    }
  };

  const handleFlagToggle = async () => {
    try {
      await adminService.flagFeedback(
        feedback.id,
        !feedback.flagged,
        !feedback.flagged ? 'Flagged for review' : undefined
      );
      toast.success(feedback.flagged ? 'Feedback unflagged' : 'Feedback flagged');
      onUpdated?.();
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update flag status');
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating <= 2) return 'text-red-500';
    if (rating === 3) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Feedback Details
          </DialogTitle>
          <DialogDescription>
            Full context and user feedback for review
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-1">
          {isLoadingDetail ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading details...
            </div>
          ) : detail ? (
            <div className="space-y-4">
              {/* User Info Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">User Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{detail.user_name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{detail.user_email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Session ID:</span>
                    <span className="font-mono text-xs">{detail.session_id || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span>{formatDistanceToNow(new Date(detail.created_at), { addSuffix: true })}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Rating & Feedback Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">User Rating & Feedback</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {detail.satisfaction ? (
                    <div className="flex items-center gap-3">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < detail.satisfaction!
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            } ${getRatingColor(detail.satisfaction!)}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {detail.satisfaction} out of 5
                      </span>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No rating provided</p>
                  )}

                  {detail.feedback && (
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm italic">&ldquo;{detail.feedback}&rdquo;</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {detail.category && (
                      <Badge variant="outline">
                        Category: {detail.category.replace('_', ' ')}
                      </Badge>
                    )}
                    {detail.urgency && (
                      <Badge
                        variant={detail.urgency === 'high' ? 'destructive' : 'secondary'}
                      >
                        Urgency: {detail.urgency}
                      </Badge>
                    )}
                    {detail.is_emergency && (
                      <Badge variant="destructive">Emergency</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Conversation Card */}
              {(detail.message_content || detail.response_content || detail.conversation_history) && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Conversation Context</CardTitle>
                    <CardDescription className="text-xs">
                      {detail.retrieval_count ?? 0} documents retrieved &bull;{' '}
                      {detail.response_time_ms
                        ? `${(detail.response_time_ms / 1000).toFixed(1)}s response time`
                        : 'N/A'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {detail.message_content && (
                      <div className="flex gap-3">
                        <div className="mt-1">
                          <User className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium mb-1">User Query:</p>
                          <p className="text-sm bg-muted/50 p-3 rounded-lg">{detail.message_content}</p>
                        </div>
                      </div>
                    )}

                    {detail.response_content && (
                      <div className="flex gap-3">
                        <div className="mt-1">
                          <Bot className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium mb-1">AI Response:</p>
                          <ScrollArea className="h-48 w-full rounded-md border bg-muted/50 p-3">
                            <p className="text-sm whitespace-pre-wrap">{detail.response_content}</p>
                          </ScrollArea>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Admin Response Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    Admin Actions
                    {feedback.admin_response && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Existing Admin Response */}
                  {feedback.admin_response && (
                    <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 p-3 rounded-lg">
                      <div className="flex items-start gap-2 mb-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-green-900 dark:text-green-100">
                            Response Sent
                          </p>
                          {feedback.admin_responded_at && (
                            <p className="text-xs text-green-700 dark:text-green-300">
                              {formatDistanceToNow(new Date(feedback.admin_responded_at), {
                                addSuffix: true,
                              })}
                              {feedback.admin_responded_by_name &&
                                ` by ${feedback.admin_responded_by_name}`}
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-green-900 dark:text-green-100 pl-6">
                        {feedback.admin_response}
                      </p>
                    </div>
                  )}

                  {/* New Response Form */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {feedback.admin_response ? 'Update Response:' : 'Send Response:'}
                    </label>
                    <Textarea
                      placeholder="Enter your response to the user's feedback..."
                      value={responseMessage}
                      onChange={(e) => setResponseMessage(e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={handleSendResponse}
                        disabled={!responseMessage.trim() || isResponding}
                        size="sm"
                      >
                        {isResponding ? (
                          'Sending...'
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            {feedback.admin_response ? 'Update Response' : 'Send Response'}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Flag Action */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {feedback.flagged ? (
                        <>
                          <Flag className="h-4 w-4 text-red-500 fill-red-500" />
                          <span className="text-sm">
                            This feedback is flagged
                            {feedback.flagged_reason && `: ${feedback.flagged_reason}`}
                          </span>
                        </>
                      ) : (
                        <>
                          <Flag className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Not flagged for review
                          </span>
                        </>
                      )}
                    </div>
                    <Button
                      variant={feedback.flagged ? 'outline' : 'destructive'}
                      size="sm"
                      onClick={handleFlagToggle}
                    >
                      {feedback.flagged ? 'Unflag' : 'Flag for Review'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Failed to load feedback details
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
