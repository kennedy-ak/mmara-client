/**
 * Admin Retrieval Test Page
 * Test the retrieval system
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { adminService } from '@/lib/admin';
import { RetrievalRequest, RetrievalResult, LegalCategory, LEGAL_CATEGORIES } from '@/lib/types';
import { Search, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminRetrievalPage() {
  const router = useRouter();
  const { isAdmin } = useAuth();

  const [query, setQuery] = useState('');
  const [topK, setTopK] = useState(5);
  const [category, setCategory] = useState<LegalCategory | undefined>(undefined);
  const [alpha, setAlpha] = useState(0.7);
  const [rerank, setRerank] = useState(true);

  const [results, setResults] = useState<RetrievalResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  if (!isAdmin) {
    router.push('/dashboard');
    return null;
  }

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error('Please enter a query');
      return;
    }

    try {
      setIsSearching(true);
      const request: RetrievalRequest = {
        query,
        top_k: topK,
        category,
        alpha,
        rerank,
      };
      const data = await adminService.testRetrieval(request);
      setResults(data);
      toast.success(`Found ${data.length} results`);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Search failed');
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Test Retrieval</h2>
        <p className="text-muted-foreground">
          Test the document retrieval system with custom queries
        </p>
      </div>

      {/* Search Form */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Search Parameters</CardTitle>
            <CardDescription>Configure your retrieval test</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="query">Query</Label>
              <Textarea
                id="query"
                placeholder="Enter your legal question..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="topK">Results (Top K): {topK}</Label>
              <Input
                id="topK"
                type="range"
                min={1}
                max={20}
                value={topK}
                onChange={(e) => setTopK(parseInt(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category (Optional)</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as LegalCategory)}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="undefined">All categories</SelectItem>
                  {LEGAL_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="alpha">Semantic Weight: {alpha}</Label>
              <Input
                id="alpha"
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={alpha}
                onChange={(e) => setAlpha(parseFloat(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                {alpha === 1 ? 'Pure semantic search' : alpha === 0 ? 'Pure keyword search' : `Hybrid (${Math.round(alpha * 100)}% semantic)`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rerank"
                checked={rerank}
                onChange={(e) => setRerank(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="rerank">Enable reranking</Label>
            </div>

            <Button
              onClick={handleSearch}
              disabled={isSearching || !query.trim()}
              className="w-full"
            >
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>
              {results.length} result{results.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSearching ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No results yet. Enter a query and search to see results.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((result, idx) => (
                  <Card key={result.chunk_id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            Result #{idx + 1}
                          </span>
                          <Badge variant="secondary">
                            Score: {result.score.toFixed(3)}
                          </Badge>
                          {result.rerank_score && (
                            <Badge variant="outline">
                              Rerank: {result.rerank_score.toFixed(3)}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm">{result.text}</p>

                      {result.metadata && (
                        <>
                          <Separator />
                          <div className="grid gap-2 text-xs text-muted-foreground">
                            {result.metadata.source_file && (
                              <div>
                                <span className="font-medium">Source:</span> {result.metadata.source_file}
                              </div>
                            )}
                            {result.metadata.doc_type && (
                              <div>
                                <span className="font-medium">Type:</span> {result.metadata.doc_type}
                              </div>
                            )}
                            {result.metadata.category && (
                              <div>
                                <span className="font-medium">Category:</span> {result.metadata.category}
                              </div>
                            )}
                            {result.metadata.section_number && (
                              <div>
                                <span className="font-medium">Section:</span> {result.metadata.section_number}
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'secondary' | 'outline' }) {
  const base = "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium";
  const variants = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    outline: "border border-input bg-background",
  };
  return <span className={`${base} ${variants[variant]}`}>{children}</span>;
}
