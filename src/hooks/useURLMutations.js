import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import toast from 'react-hot-toast';

/**
 * Custom hook for URL CRUD operations with optimistic updates
 */
export const useURLMutations = (organizationId) => {
  const queryClient = useQueryClient();

  // Create URL with optimistic update
  const createURL = useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/urls/', data);
      return response.data;
    },
    onMutate: async (newURL) => {
      await queryClient.cancelQueries(['urls', organizationId]);
      await queryClient.cancelQueries(['recent-urls', organizationId]);
      
      const previousUrls = queryClient.getQueryData(['urls', organizationId]);
      const previousRecentUrls = queryClient.getQueryData(['recent-urls', organizationId]);

      // Get namespace name from namespaces cache
      const namespaces = queryClient.getQueryData(['namespaces', organizationId]) || [];
      const namespace = namespaces.find(ns => ns.id === newURL.namespace);
      const namespaceName = namespace?.name || 'loading...';

      // Create optimistic URL
      const optimisticURL = {
        id: `temp-${Date.now()}`,
        original_url: newURL.original_url,
        short_code: newURL.short_code || 'generating...',
        title: newURL.title || '',
        description: newURL.description || '',
        namespace: newURL.namespace,
        namespace_name: namespaceName,
        is_private: newURL.is_private || false,
        click_count: 0,
        created_at: new Date().toISOString(),
        _optimistic: true,
      };

      // Update URLs list
      queryClient.setQueryData(['urls', organizationId], (old) => {
        if (!old) return { results: [optimisticURL], count: 1 };
        return {
          ...old,
          results: [optimisticURL, ...(old.results || old)],
          count: (old.count || old.length || 0) + 1,
        };
      });

      // Update recent URLs
      queryClient.setQueryData(['recent-urls', organizationId], (old) => {
        const results = old?.results || old || [];
        return [optimisticURL, ...results].slice(0, 5);
      });

      return { previousUrls, previousRecentUrls };
    },
    onSuccess: (newURL) => {
      // Replace optimistic with real data
      queryClient.setQueryData(['urls', organizationId], (old) => {
        if (!old) return { results: [newURL], count: 1 };
        const results = (old.results || old).filter(url => !url._optimistic);
        return {
          ...old,
          results: [newURL, ...results],
          count: results.length + 1,
        };
      });

      queryClient.setQueryData(['recent-urls', organizationId], (old) => {
        const results = (old?.results || old || []).filter(url => !url._optimistic);
        return [newURL, ...results].slice(0, 5);
      });

      toast.success(`Short URL created: ${newURL.short_code}`);
    },
    onError: (error, newURL, context) => {
      // Rollback
      if (context?.previousUrls) {
        queryClient.setQueryData(['urls', organizationId], context.previousUrls);
      }
      if (context?.previousRecentUrls) {
        queryClient.setQueryData(['recent-urls', organizationId], context.previousRecentUrls);
      }
      
      const errorMsg = error.response?.data?.short_code?.[0] || 
                       error.response?.data?.original_url?.[0] || 
                       error.response?.data?.error || 
                       'Failed to create URL';
      toast.error(errorMsg);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['urls', organizationId]);
      queryClient.invalidateQueries(['recent-urls', organizationId]);
    },
  });

  // Update URL with optimistic update
  const updateURL = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.patch(`/urls/${id}/`, data);
      return response.data;
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries(['urls', organizationId]);
      const previousUrls = queryClient.getQueryData(['urls', organizationId]);

      // Optimistically update
      queryClient.setQueryData(['urls', organizationId], (old) => {
        if (!old) return old;
        const results = (old.results || old).map(url => 
          url.id === id ? { ...url, ...data, _optimistic: true } : url
        );
        return old.results ? { ...old, results } : results;
      });

      return { previousUrls };
    },
    onSuccess: (updatedURL) => {
      // Replace with real data
      queryClient.setQueryData(['urls', organizationId], (old) => {
        if (!old) return { results: [updatedURL], count: 1 };
        const results = (old.results || old).map(url => 
          url.id === updatedURL.id ? updatedURL : url
        );
        return old.results ? { ...old, results } : results;
      });
      toast.success('URL updated successfully!');
    },
    onError: (error, variables, context) => {
      if (context?.previousUrls) {
        queryClient.setQueryData(['urls', organizationId], context.previousUrls);
      }
      const errorMsg = error.response?.data?.error || 'Failed to update URL';
      toast.error(errorMsg);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['urls', organizationId]);
      queryClient.invalidateQueries(['recent-urls', organizationId]);
    },
  });

  // Delete URL with optimistic update
  const deleteURL = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/urls/${id}/`);
      return id;
    },
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries(['urls', organizationId]);
      await queryClient.cancelQueries(['recent-urls', organizationId]);
      
      const previousUrls = queryClient.getQueryData(['urls', organizationId]);
      const previousRecentUrls = queryClient.getQueryData(['recent-urls', organizationId]);

      // Optimistically remove
      queryClient.setQueryData(['urls', organizationId], (old) => {
        if (!old) return old;
        const results = (old.results || old).filter(url => url.id !== deletedId);
        return old.results ? { ...old, results, count: (old.count || 0) - 1 } : results;
      });

      queryClient.setQueryData(['recent-urls', organizationId], (old) => {
        const results = (old?.results || old || []).filter(url => url.id !== deletedId);
        return results;
      });

      return { previousUrls, previousRecentUrls };
    },
    onSuccess: () => {
      toast.success('URL deleted successfully!');
    },
    onError: (error, deletedId, context) => {
      if (context?.previousUrls) {
        queryClient.setQueryData(['urls', organizationId], context.previousUrls);
      }
      if (context?.previousRecentUrls) {
        queryClient.setQueryData(['recent-urls', organizationId], context.previousRecentUrls);
      }
      const errorMsg = error.response?.data?.error || 'Failed to delete URL';
      toast.error(errorMsg);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['urls', organizationId]);
      queryClient.invalidateQueries(['recent-urls', organizationId]);
    },
  });

  return {
    createURL,
    updateURL,
    deleteURL,
  };
};
