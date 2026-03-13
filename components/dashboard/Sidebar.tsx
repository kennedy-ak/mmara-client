/**
 * Dashboard Sidebar Component
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  MessageSquare,
  Plus,
  Trash2,
  Search,
  X,
  Home,
  Info,
} from 'lucide-react';
import { chatService } from '@/lib/chat';
import { ChatSession } from '@/lib/types';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const response = await chatService.getSessions(20);
      const chatSessions: ChatSession[] = response.sessions.map((s) => ({
        id: s.session_id,
        title: s.title || `Chat ${new Date(s.created_at).toLocaleDateString()}`,
        category: s.category,
        createdAt: s.created_at,
        updatedAt: s.updated_at,
        messageCount: s.message_count,
      }));
      setSessions(chatSessions);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSessions();
    }
  }, [isOpen]);

  const handleNewChat = () => {
    router.push('/dashboard');
    setIsMobileOpen(false);
  };

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await chatService.deleteSession(sessionId);
      setSessions(sessions.filter((s) => s.id !== sessionId));
      toast.success('Chat deleted');

      // If we deleted the current session, redirect to dashboard
      const currentSessionId = pathname.split('/').pop();
      if (currentSessionId === sessionId) {
        router.push('/dashboard');
      }
    } catch (error) {
      toast.error('Failed to delete chat');
    }
  };

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* New Chat Button */}
      <div className="p-4">
        <Button onClick={handleNewChat} className="w-full" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>

      {/* Search */}
      <div className="px-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* Sessions List */}
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 py-2">
          {isLoading ? (
            <div className="px-4 py-2 text-sm text-muted-foreground">
              Loading chats...
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="px-4 py-2 text-sm text-muted-foreground">
              {searchQuery ? 'No chats found' : 'No chat history yet'}
            </div>
          ) : (
            filteredSessions.map((session) => (
              <Link
                key={session.id}
                href={`/dashboard/chat/${session.id}`}
                onClick={() => setIsMobileOpen(false)}
                className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors ${
                  pathname.includes(session.id) ? 'bg-accent' : ''
                }`}
              >
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span className="flex-1 truncate">{session.title}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100"
                  onClick={(e) => handleDeleteSession(session.id, e)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </Link>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Bottom Links */}
      <div className="border-t p-4 space-y-1">
        <Link
          href="/dashboard"
          onClick={() => setIsMobileOpen(false)}
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-accent transition-colors ${
            pathname === '/dashboard' ? 'bg-accent' : ''
          }`}
        >
          <Home className="h-4 w-4" />
          <span>Home</span>
        </Link>
        <Link
          href="/about"
          onClick={() => setIsMobileOpen(false)}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-accent transition-colors"
        >
          <Info className="h-4 w-4" />
          <span>About</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-20 w-64 border-r bg-background transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-30"
            onClick={() => setIsMobileOpen(true)}
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
