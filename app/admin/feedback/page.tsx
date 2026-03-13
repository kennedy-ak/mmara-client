/**
 * Admin Feedback Page
 * View and manage user feedback
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { adminService } from '@/lib/admin';
import {
  FeedbackItem,
  FeedbackListResponse,
  FeedbackStats,
  LegalCategory,
  LEGAL_CATEGORIES,
} from '@/lib/types';
import FeedbackDetailDialog from './components/FeedbackDetailDialog';
import {
  MessageSquare,
  Star,
  Flag,
  AlertCircle,
  Download,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

export default function AdminFeedbackPage() {
  const router = useRouter();
  const { isAdmin } = useAuth();

  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 20;

  // Filters
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterMinRating, setFilterMinRating] = useState<string>('all');
  const [filterMaxRating, setFilterMaxRating] = useState<string>('all');
  const [filterFlaggedOnly, setFilterFlaggedOnly] = useState(false);

  // Detail dialog
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Flag dialog
  const [flagDialogOpen, setFlagDialogOpen] = useState(false);
  const [flagFeedbackId, setFlagFeedbackId] = useState<number | null>(null);
  const [flagReason, setFlagReason] = useState('');
  const [isFlagging, setIsFlagging] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      router.push('/dashboard');
      return;
    }
    fetchFeedback();
    fetchStats();
  }, [isAdmin, router]);

  useEffect(() => {
    fetchFeedback();
  }, [currentPage, filterCategory, filterMinRating, filterMaxRating, filterFlaggedOnly]);

  const fetchFeedback = async () => {
    try {
      setIsLoading(true);
      const params: any = {
        page: currentPage,
        page_size: pageSize,
      };

      if (filterCategory !== 'all') params.category = filterCategory;
      if (filterMinRating !== 'all') params.min_rating = parseInt(filterMinRating);
      if (filterMaxRating !== 'all') params.max_rating = parseInt(filterMaxRating);
      if (filterFlaggedOnly) params.flagged_only = true;

      const data = await adminService.listFeedback(params);
      setFeedback(data.items);
      setTotalPages(data.total_pages);
      setTotalItems(data.total);
    } catch (error) {
      toast.error('Failed to fetch feedback');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await adminService.getFeedbackStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      setIsExporting(true);
      const blob = await adminService.exportFeedback({
        format,
        category: filterCategory !== 'all' ? filterCategory : undefined,
        min_rating: filterMinRating !== 'all' ? parseInt(filterMinRating) : undefined,
        max_rating: filterMaxRating !== 'all' ? parseInt(filterMaxRating) : undefined,
        flagged_only: filterFlaggedOnly,
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `feedback_export_${new Date().toISOString().slice(0, 10)}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export feedback');
    } finally {
      setIsExporting(false);
    }
  };

  const handleRowClick = (item: FeedbackItem) => {
    setSelectedFeedback(item);
    setDetailDialogOpen(true);
  };

  const openFlagDialog = (feedbackId: number, currentFlagged: boolean) => {
    setFlagFeedbackId(feedbackId);
    setFlagReason('');
    setFlagDialogOpen(true);
  };

  const handleFlagConfirm = async () => {
    if (!flagFeedbackId) return;

    try {
      setIsFlagging(true);
      const item = feedback.find((f) => f.id === flagFeedbackId);
      const isFlaggingAction = !item?.flagged;

      await adminService.flagFeedback(flagFeedbackId, isFlaggingAction, flagReason || undefined);
      toast.success(isFlaggingAction ? 'Feedback flagged' : 'Feedback unflagged');
      setFlagDialogOpen(false);
      fetchFeedback();
      fetchStats();
    } catch (error) {
      toast.error('Failed to update flag status');
    } finally {
      setIsFlagging(false);
    }
  };

  const getRatingStars = (rating?: number) => {
    if (!rating) return <span className="text-muted-foreground">N/A</span>;

    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm">({rating})</span>
      </div>
    );
  };

  const getRatingBadge = (rating?: number) => {
    if (!rating) return null;

    let variant: 'default' | 'destructive' | 'outline' | 'secondary' = 'default';
    let label = '';

    if (rating <= 2) {
      variant = 'destructive';
      label = 'Poor';
    } else if (rating === 3) {
      variant = 'secondary';
      label = 'Fair';
    } else if (rating === 4) {
      variant = 'outline';
      label = 'Good';
    } else {
      variant = 'default';
      label = 'Excellent';
    }

    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Feedback</h2>
          <p className="text-muted-foreground">
            Review and manage user feedback on AI responses
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={isExporting || totalItems === 0}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('json')}>
                Export as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_feedback}</div>
              <p className="text-xs text-muted-foreground">
                {stats.recent_count} in the last 7 days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.average_rating ? stats.average_rating.toFixed(1) : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">out of 5 stars</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Flagged</CardTitle>
              <Flag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.flagged_count}</div>
              <p className="text-xs text-muted-foreground">requires attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">By Category</CardTitle>
              <Filter className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Criminal:</span>
                  <span className="font-medium">{stats.by_category.criminal || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Traffic:</span>
                  <span className="font-medium">{stats.by_category.road_traffic || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>General:</span>
                  <span className="font-medium">{stats.by_category.general || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Category:</label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {LEGAL_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Min Rating:</label>
              <Select value={filterMinRating} onValueChange={setFilterMinRating}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any</SelectItem>
                  <SelectItem value="1">1★</SelectItem>
                  <SelectItem value="2">2★</SelectItem>
                  <SelectItem value="3">3★</SelectItem>
                  <SelectItem value="4">4★</SelectItem>
                  <SelectItem value="5">5★</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Max Rating:</label>
              <Select value={filterMaxRating} onValueChange={setFilterMaxRating}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any</SelectItem>
                  <SelectItem value="1">1★</SelectItem>
                  <SelectItem value="2">2★</SelectItem>
                  <SelectItem value="3">3★</SelectItem>
                  <SelectItem value="4">4★</SelectItem>
                  <SelectItem value="5">5★</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="flagged-only"
                checked={filterFlaggedOnly}
                onCheckedChange={(checked) => setFilterFlaggedOnly(checked as boolean)}
              />
              <label htmlFor="flagged-only" className="text-sm font-medium cursor-pointer">
                Flagged Only
              </label>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFilterCategory('all');
                setFilterMinRating('all');
                setFilterMaxRating('all');
                setFilterFlaggedOnly(false);
                setCurrentPage(1);
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Table */}
      <Card>
        <CardHeader>
          <CardTitle>Feedback List</CardTitle>
          <CardDescription>
            {totalItems} feedback item{totalItems !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading feedback...</div>
          ) : feedback.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No feedback found</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rating</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Message Preview</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedback.map((item) => (
                    <TableRow
                      key={item.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleRowClick(item)}
                    >
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {getRatingStars(item.satisfaction)}
                          {getRatingBadge(item.satisfaction)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{item.user_name || item.user_email}</div>
                          <div className="text-muted-foreground text-xs">{item.user_email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">
                        {item.category?.replace('_', ' ') || 'N/A'}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {item.message_content || item.feedback || 'N/A'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {item.flagged && (
                            <Badge variant="destructive" className="gap-1">
                              <Flag className="h-3 w-3" />
                              Flagged
                            </Badge>
                          )}
                          {item.admin_response && (
                            <Badge variant="outline" className="gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Responded
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleRowClick(item)}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openFlagDialog(item.id, item.flagged)}
                            >
                              {item.flagged ? (
                                <>
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Unflag
                                </>
                              ) : (
                                <>
                                  <Flag className="mr-2 h-4 w-4" />
                                  Flag for Review
                                </>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      {selectedFeedback && (
        <FeedbackDetailDialog
          feedback={selectedFeedback}
          open={detailDialogOpen}
          onOpenChange={setDetailDialogOpen}
          onUpdated={() => {
            fetchFeedback();
            fetchStats();
          }}
        />
      )}

      {/* Flag Confirmation Dialog */}
      <AlertDialog open={flagDialogOpen} onOpenChange={setFlagDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {feedback.find((f) => f.id === flagFeedbackId)?.flagged
                ? 'Unflag Feedback'
                : 'Flag Feedback for Review'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {feedback.find((f) => f.id === flagFeedbackId)?.flagged
                ? 'Are you sure you want to unflag this feedback?'
                : 'Please provide a reason for flagging this feedback for review.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {!feedback.find((f) => f.id === flagFeedbackId)?.flagged && (
            <div className="py-4">
              <Input
                placeholder="Reason for flagging (optional)"
                value={flagReason}
                onChange={(e) => setFlagReason(e.target.value)}
              />
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleFlagConfirm} disabled={isFlagging}>
              {isFlagging ? 'Saving...' : feedback.find((f) => f.id === flagFeedbackId)?.flagged ? 'Unflag' : 'Flag'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
