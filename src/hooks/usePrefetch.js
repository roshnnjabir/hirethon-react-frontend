import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import api from '../api/axios';

/**
 * Hook for prefetching data to improve perceived performance
 * Loads data before user navigates to reduce waiting time
 */
const usePrefetch = () => {
  const queryClient = useQueryClient();

  /**
   * Prefetch URLs for a specific organization/namespace
   */
  const prefetchURLs = useCallback(
    (namespaceId) => {
      return queryClient.prefetchQuery({
        queryKey: ['urls', namespaceId],
        queryFn: async () => {
          const response = await api.get('/shorturls/urls/', {
            params: { namespace: namespaceId }
          });
          return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
    },
    [queryClient]
  );

  /**
   * Prefetch analytics for a URL
   */
  const prefetchAnalytics = useCallback(
    (urlId) => {
      return queryClient.prefetchQuery({
        queryKey: ['analytics', urlId],
        queryFn: async () => {
          const response = await api.get(`/shorturls/urls/${urlId}/analytics/`);
          return response.data;
        },
        staleTime: 30 * 1000, // 30 seconds (analytics updates frequently)
      });
    },
    [queryClient]
  );

  /**
   * Prefetch organizations
   */
  const prefetchOrganizations = useCallback(() => {
    return queryClient.prefetchQuery({
      queryKey: ['organizations'],
      queryFn: async () => {
        const response = await api.get('/organizations/');
        return response.data;
      },
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  }, [queryClient]);

  /**
   * Prefetch namespaces for an organization
   */
  const prefetchNamespaces = useCallback(
    (orgId) => {
      return queryClient.prefetchQuery({
        queryKey: ['namespaces', orgId],
        queryFn: async () => {
          const response = await api.get('/namespaces/', {
            params: { organization: orgId }
          });
          return response.data;
        },
        staleTime: 10 * 60 * 1000, // 10 minutes
      });
    },
    [queryClient]
  );

  /**
   * Prefetch on hover (for links)
   */
  const prefetchOnHover = useCallback(
    (queryKey, queryFn) => {
      return () => {
        queryClient.prefetchQuery({
          queryKey,
          queryFn,
          staleTime: 5 * 60 * 1000,
        });
      };
    },
    [queryClient]
  );

  return {
    prefetchURLs,
    prefetchAnalytics,
    prefetchOrganizations,
    prefetchNamespaces,
    prefetchOnHover,
  };
};

export default usePrefetch;

