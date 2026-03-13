/**
 * Main Dashboard Page
 * Shows chat interface for new conversations
 */

'use client';

import { useSearchParams } from 'next/navigation';
import { ChatInterface } from '@/components/chat/ChatInterface';

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') as string | undefined;

  return <ChatInterface category={category} />;
}
