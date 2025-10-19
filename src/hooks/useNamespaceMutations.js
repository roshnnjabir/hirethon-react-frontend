import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import toast from 'react-hot-toast';

/**
 * Custom hook for namespace CRUD operations with optimistic updates
 */
export const useNamespaceMutations = (organizationId) => {
  const queryClient = useQueryClient();

  // Create namespace with optimistic update
  const createNamespace = useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/namespaces/', {
        ...data,
        organization: organizationId,
      });
      return response.data;
    },
    // Optimistic update - add namespace immediately
    onMutate: async (newNamespace) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(['namespaces', organizationId]);

      // Snapshot the previous value
      const previousNamespaces = queryClient.getQueryData(['namespaces', organizationId]);

      // Optimistically update to the new value
      queryClient.setQueryData(['namespaces', organizationId], (old) => {
        const optimisticNamespace = {
          id: `temp-${Date.now()}`, // Temporary ID
          name: newNamespace.name,
          organization: organizationId,
          url_count: 0,
          created_at: new Date().toISOString(),
          _optimistic: true, // Flag to identify optimistic data
        };
        
        return old ? [...old, optimisticNamespace] : [optimisticNamespace];
      });

      // Return context with previous data for rollback
      return { previousNamespaces };
    },
    onSuccess: (data) => {
      // Replace optimistic data with real data from server
      queryClient.setQueryData(['namespaces', organizationId], (old) => {
        if (!old) return [data];
        // Remove optimistic item and add real one
        return [...old.filter(ns => !ns._optimistic), data];
      });
      toast.success('Namespace created successfully!');
    },
    onError: (error, newNamespace, context) => {
      // Rollback on error
      if (context?.previousNamespaces) {
        queryClient.setQueryData(['namespaces', organizationId], context.previousNamespaces);
      }
      const errorMsg = error.response?.data?.name?.[0] || 
                       error.response?.data?.error || 
                       'Failed to create namespace';
      toast.error(errorMsg);
    },
    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries(['namespaces', organizationId]);
    },
  });

  // Update namespace with optimistic update
  const updateNamespace = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.patch(`/namespaces/${id}/`, data);
      return response.data;
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries(['namespaces', organizationId]);
      const previousNamespaces = queryClient.getQueryData(['namespaces', organizationId]);

      // Optimistically update
      queryClient.setQueryData(['namespaces', organizationId], (old) => {
        if (!old) return old;
        return old.map(ns => 
          ns.id === id ? { ...ns, ...data, _optimistic: true } : ns
        );
      });

      return { previousNamespaces };
    },
    onSuccess: (updatedNamespace) => {
      // Replace with real data
      queryClient.setQueryData(['namespaces', organizationId], (old) => {
        if (!old) return [updatedNamespace];
        return old.map(ns => 
          ns.id === updatedNamespace.id ? updatedNamespace : ns
        );
      });
      toast.success('Namespace updated successfully!');
    },
    onError: (error, variables, context) => {
      if (context?.previousNamespaces) {
        queryClient.setQueryData(['namespaces', organizationId], context.previousNamespaces);
      }
      const errorMsg = error.response?.data?.name?.[0] || 
                       error.response?.data?.error || 
                       'Failed to update namespace';
      toast.error(errorMsg);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['namespaces', organizationId]);
    },
  });

  // Delete namespace with optimistic update
  const deleteNamespace = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/namespaces/${id}/`);
      return id;
    },
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries(['namespaces', organizationId]);
      const previousNamespaces = queryClient.getQueryData(['namespaces', organizationId]);

      // Optimistically remove
      queryClient.setQueryData(['namespaces', organizationId], (old) => {
        if (!old) return old;
        return old.filter(ns => ns.id !== deletedId);
      });

      return { previousNamespaces };
    },
    onSuccess: () => {
      toast.success('Namespace deleted successfully!');
    },
    onError: (error, deletedId, context) => {
      if (context?.previousNamespaces) {
        queryClient.setQueryData(['namespaces', organizationId], context.previousNamespaces);
      }
      const errorMsg = error.response?.data?.error || 'Failed to delete namespace';
      toast.error(errorMsg);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['namespaces', organizationId]);
    },
  });

  return {
    createNamespace,
    updateNamespace,
    deleteNamespace,
  };
};
