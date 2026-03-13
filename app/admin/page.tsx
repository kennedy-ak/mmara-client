/**
 * Admin Dashboard Page
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { adminService } from '@/lib/admin';
import { DocumentStats } from '@/lib/types';
import {
  FileText,
  Database,
  Users,
  Clock,
  Upload,
  RefreshCw,
  Search,
  BarChart3,
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isAdmin } = useAuth();

  const [stats, setStats] = useState<DocumentStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      router.push('/dashboard');
      return;
    }
    fetchStats();
  }, [isAdmin, router]);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getStats();
      setStats(data);
    } catch (error) {
      toast.error('Failed to fetch statistics');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcessPending = async () => {
    try {
      setIsProcessing(true);
      const result = await adminService.processPendingDocuments();
      toast.success(result.message);
      fetchStats();
    } catch (error) {
      toast.error('Failed to process documents');
    } finally {
      setIsProcessing(false);
    }
  };

  const adminActions = [
    {
      title: 'Upload Document',
      description: 'Upload and process legal documents',
      icon: Upload,
      action: () => router.push('/admin/documents'),
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    },
    {
      title: 'Manage Documents',
      description: 'View and manage processed documents',
      icon: FileText,
      action: () => router.push('/admin/documents'),
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
    },
    {
      title: 'Test Retrieval',
      description: 'Test the document retrieval system',
      icon: Search,
      action: () => router.push('/admin/retrieval'),
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    },
    {
      title: 'System Statistics',
      description: 'View detailed system statistics',
      icon: BarChart3,
      action: () => fetchStats(),
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of the MMara system
          </p>
        </div>
        <Button
          onClick={handleProcessPending}
          disabled={isProcessing}
          variant="outline"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isProcessing ? 'animate-spin' : ''}`} />
          Process Pending Documents
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Documents"
          value={stats?.total_documents || 0}
          icon={FileText}
          color="text-blue-500"
          bgColor="bg-blue-50 dark:bg-blue-950/20"
          isLoading={isLoading}
        />
        <StatCard
          title="Total Chunks"
          value={stats?.total_chunks || 0}
          icon={Database}
          color="text-green-500"
          bgColor="bg-green-50 dark:bg-green-950/20"
          isLoading={isLoading}
        />
        <StatCard
          title="Last Updated"
          value={stats?.last_updated ? formatDistanceToNow(new Date(stats.last_updated), { addSuffix: true }) : 'Never'}
          icon={Clock}
          color="text-orange-500"
          bgColor="bg-orange-50 dark:bg-orange-950/20"
          isLoading={isLoading}
        />
        <StatCard
          title="Total Categories"
          value={Object.keys(stats?.by_category || {}).length}
          icon={BarChart3}
          color="text-purple-500"
          bgColor="bg-purple-50 dark:bg-purple-950/20"
          isLoading={isLoading}
        />
      </div>

      {/* Category Breakdown */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>Documents by Category</CardTitle>
            <CardDescription>Number of documents per legal category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.by_category).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="capitalize text-sm">{category.replace('_', ' ')}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${(count / stats.total_documents) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Document Type Breakdown */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>Documents by Type</CardTitle>
            <CardDescription>Number of documents per document type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-5">
              {Object.entries(stats.by_doc_type).map(([docType, count]) => (
                <div key={docType} className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-xs text-muted-foreground capitalize">{docType.replace('_', ' ')}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {adminActions.map((action) => {
          const Icon = action.icon;
          return (
            <Card
              key={action.title}
              className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
              onClick={action.action}
            >
              <CardHeader className="pb-3">
                <div className={`p-2 rounded-lg ${action.bgColor} w-fit mb-2`}>
                  <Icon className={`h-5 w-5 ${action.color}`} />
                </div>
                <CardTitle className="text-base">{action.title}</CardTitle>
                <CardDescription className="text-xs">{action.description}</CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  bgColor: string;
  isLoading: boolean;
}

function StatCard({ title, value, icon: Icon, color, bgColor, isLoading }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${bgColor}`}>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-8 w-16 bg-muted animate-pulse rounded" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  );
}
