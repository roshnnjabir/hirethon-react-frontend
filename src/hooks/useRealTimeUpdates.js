import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Hook for real-time data updates using polling
 * @param {string[]} queryKeys - Array of query keys to invalidate
 * @param {number} interval - Polling interval in milliseconds (default: 30000 = 30 seconds)
 * @param {boolean} enabled - Whether polling is enabled (default: true)
 */
const useRealTimeUpdates = (queryKeys = [], interval = 30000, enabled = true) => {
  const queryClient = useQueryClient();
  const intervalRef = useRef(null);
  const isVisibleRef = useRef(true);

  // Handle visibility change to pause/resume updates when tab is inactive
  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Invalidate queries to trigger refetch
  const invalidateQueries = useCallback(() => {
    if (!isVisibleRef.current) return; // Don't update when tab is hidden
    
    queryKeys.forEach(queryKey => {
      queryClient.invalidateQueries({ queryKey: Array.isArray(queryKey) ? queryKey : [queryKey] });
    });
  }, [queryClient, queryKeys]);

  // Setup polling
  useEffect(() => {
    if (!enabled || queryKeys.length === 0) {
      return;
    }

    // Initial invalidation
    invalidateQueries();

    // Setup interval
    intervalRef.current = setInterval(() => {
      invalidateQueries();
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, interval, invalidateQueries, queryKeys]);

  // Manual refresh function
  const refresh = useCallback(() => {
    invalidateQueries();
  }, [invalidateQueries]);

  return { refresh };
};

export default useRealTimeUpdates;

