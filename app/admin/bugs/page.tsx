'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { adminService } from '@/lib/admin';
import { BugReport, BugStats, BUG_SEVERITIES, BUG_STATUSES, BUG_TYPES } from '@/lib/types';
import { Bug, AlertTriangle, CheckCircle, Clock, User, Calendar, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

export default function AdminBugsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [bugs, setBugs] = useState<BugReport[]>([]);
  const [stats, setStats] = useState<BugStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Detail dialog
  const [selectedBug, setSelectedBug] = useState<BugReport | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updateNotes, setUpdateNotes] = useState('');
  const [updateStatus, setUpdateStatus] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/login');
    } else if (user?.role === 'admin') {
      fetchBugs();
      fetchStats();
    }
  }, [user, authLoading, router, page, statusFilter, severityFilter, typeFilter]);

  const fetchBugs = async () => {
    try {
      setLoading(true);
      const params: any = { page, page_size: 20 };
      if (statusFilter !== 'all') params.status = statusFilter;
      if (severityFilter !== 'all') params.severity = severityFilter;
      if (typeFilter !== 'all') params.bug_type = typeFilter;

      const response = await adminService.listBugs(params);
      setBugs(response.items);
      setTotal(response.total);
      setTotalPages(response.total_pages);
    } catch (error) {
      toast.error('Failed to load bug reports');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await adminService.getBugStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleViewBug = (bug: BugReport) => {
    setSelectedBug(bug);
    setUpdateStatus(bug.status);
    setUpdateNotes(bug.resolution_notes || '');
    setDetailOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedBug) return;

    try {
      setUpdating(true);
      await adminService.updateBugStatus(selectedBug.id, {
        status: updateStatus,
        resolution_notes: updateNotes || undefined,
      });

      toast.success('Bug report updated successfully');
      setDetailOpen(false);
      fetchBugs();
      fetchStats();
    } catch (error) {
      toast.error('Failed to update bug report');
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-500 text-white';
      case 'in_progress': return 'bg-purple-500 text-white';
      case 'resolved': return 'bg-green-500 text-white';
      case 'closed': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getBugTypeLabel = (type: string) => {
    const found = BUG_TYPES.find(t => t.value === type);
    return found?.label || type;
  };

  if (authLoading || loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Bug Reports</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}><CardContent className="p-6"><Skeleton className="h-20 w-full" /></CardContent></Card>
          ))}
        </div>
        <Card><CardContent className="p-6"><Skeleton className="h-64 w-full" /></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bug className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Bug Reports</h1>
        </div>
        <Button onClick={fetchBugs} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Bugs</CardTitle>
              <Bug className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_bugs}</div>
              <p className="text-xs text-muted-foreground">{stats.recent_count} new this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Open</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.open_bugs}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <RefreshCw className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.in_progress_bugs}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.resolved_bugs}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Critical</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{stats.critical_bugs}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Label>Status:</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {BUG_STATUSES.map(s => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Label>Severity:</Label>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {BUG_SEVERITIES.map(s => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Label>Type:</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {BUG_TYPES.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="ml-auto text-sm text-muted-foreground">
              {total} total bugs
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bugs Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reporter</TableHead>
                <TableHead>Created</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bugs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No bug reports found
                  </TableCell>
                </TableRow>
              ) : (
                bugs.map((bug) => (
                  <TableRow key={bug.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleViewBug(bug)}>
                    <TableCell className="font-mono">#{bug.id}</TableCell>
                    <TableCell className="font-medium">{bug.title}</TableCell>
                    <TableCell>{getBugTypeLabel(bug.bug_type)}</TableCell>
                    <TableCell>
                      <Badge className={getSeverityColor(bug.severity)}>{bug.severity}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(bug.status)}>{bug.status.replace('_', ' ')}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <User className="h-3 w-3" />
                        {bug.user_name || bug.user_email || 'Unknown'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDistanceToNow(new Date(bug.created_at), { addSuffix: true })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Bug Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedBug && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <Bug className="h-6 w-6 text-primary" />
                  <div>
                    <DialogTitle className="text-xl">#{selectedBug.id} - {selectedBug.title}</DialogTitle>
                    <div className="flex gap-2 mt-2">
                      <Badge className={getSeverityColor(selectedBug.severity)}>{selectedBug.severity}</Badge>
                      <Badge className={getStatusColor(selectedBug.status)}>{selectedBug.status.replace('_', ' ')}</Badge>
                      <Badge variant="outline">{getBugTypeLabel(selectedBug.bug_type)}</Badge>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4">
                {/* Reporter Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Reporter: </span>
                    <span>{selectedBug.user_name || selectedBug.user_email || 'Unknown'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Created: </span>
                    <span>{new Date(selectedBug.created_at).toLocaleString()}</span>
                  </div>
                  {selectedBug.device_info && (
                    <div>
                      <span className="text-muted-foreground">Device: </span>
                      <span>{selectedBug.device_info}</span>
                    </div>
                  )}
                  {selectedBug.app_version && (
                    <div>
                      <span className="text-muted-foreground">App Version: </span>
                      <span>{selectedBug.app_version}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <Label className="text-base font-semibold">Description</Label>
                  <p className="mt-1 text-sm whitespace-pre-wrap">{selectedBug.description}</p>
                </div>

                {/* Steps to Reproduce */}
                {selectedBug.steps_to_reproduce && (
                  <div>
                    <Label className="text-base font-semibold">Steps to Reproduce</Label>
                    <p className="mt-1 text-sm whitespace-pre-wrap">{selectedBug.steps_to_reproduce}</p>
                  </div>
                )}

                {/* Expected vs Actual */}
                {(selectedBug.expected_behavior || selectedBug.actual_behavior) && (
                  <div className="grid grid-cols-2 gap-4">
                    {selectedBug.expected_behavior && (
                      <div>
                        <Label className="text-base font-semibold">Expected Behavior</Label>
                        <p className="mt-1 text-sm whitespace-pre-wrap">{selectedBug.expected_behavior}</p>
                      </div>
                    )}
                    {selectedBug.actual_behavior && (
                      <div>
                        <Label className="text-base font-semibold">Actual Behavior</Label>
                        <p className="mt-1 text-sm whitespace-pre-wrap">{selectedBug.actual_behavior}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Admin Response Section */}
                <div className="border-t pt-4">
                  <Label className="text-base font-semibold">Update Status</Label>
                  <div className="mt-2 space-y-3">
                    <div>
                      <Label>Status</Label>
                      <Select value={updateStatus} onValueChange={setUpdateStatus}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {BUG_STATUSES.map(s => (
                            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Resolution Notes</Label>
                      <Textarea
                        value={updateNotes}
                        onChange={(e) => setUpdateNotes(e.target.value)}
                        placeholder="Add resolution notes or comments..."
                        rows={3}
                      />
                    </div>
                    {selectedBug.resolution_notes && updateStatus === selectedBug.status && (
                      <div>
                        <Label className="text-muted-foreground">Previous Notes:</Label>
                        <p className="text-sm mt-1 whitespace-pre-wrap">{selectedBug.resolution_notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Response History */}
                {selectedBug.admin_responded_at && (
                  <div className="text-sm text-muted-foreground">
                    Last updated: {new Date(selectedBug.admin_responded_at).toLocaleString()}
                    {selectedBug.admin_responded_by_name && ` by ${selectedBug.admin_responded_by_name}`}
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDetailOpen(false)}>Cancel</Button>
                <Button onClick={handleUpdateStatus} disabled={updating}>
                  {updating ? 'Updating...' : 'Update Status'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
