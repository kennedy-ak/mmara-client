/**
 * Hook to sync localStorage tokens to cookies for middleware
 */

'use client';

import { useEffect } from 'react';

export function useAuthSync() {
  useEffect(() => {
    // Sync localStorage tokens to cookies on mount
    const syncTokens = () => {
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        document.cookie = `access_token=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
      } else {
        document.cookie = 'access_token=; path=/; max-age=0';
      }
    };

    syncTokens();

    // Listen for storage changes (in case of multiple tabs)
    window.addEventListener('storage', syncTokens);

    return () => {
      window.removeEventListener('storage', syncTokens);
    };
  }, []);
}
