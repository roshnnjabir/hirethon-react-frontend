import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useOrganization } from './useOrganization';

/**
 * Custom hook for organization CRUD operations with optimistic updates
 */
export const useOrganizationMutations = () => {
  const queryClient = useQueryClient();
  const { setActiveOrganization } = useOrganization();

  // Create organization with optimistic update
  const createOrg = useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/organizations/', data);
      return response.data;
    },
    onMutate: async (newOrg) => {
      await queryClient.cancelQueries(['organizations']);
      const previousOrgs = queryClient.getQueryData(['organizations']);

      // Optimistically add new org
      queryClient.setQueryData(['organizations'], (old) => {
        const optimisticOrg = {
          id: `temp-${Date.now()}`,
          name: newOrg.name,
          slug: newOrg.slug,
          created_at: new Date().toISOString(),
          member_count: 1,
          _optimistic: true,
        };
        return old ? [...old, optimisticOrg] : [optimisticOrg];
      });

      return { previousOrgs };
    },
    onSuccess: (newOrg) => {
      // Replace optimistic with real data
      queryClient.setQueryData(['organizations'], (old) => {
        if (!old) return [newOrg];
        return [...old.filter(org => !org._optimistic), newOrg];
      });
      setActiveOrganization(newOrg);
      toast.success('Organization created successfully!');
    },
    onError: (error, newOrg, context) => {
      if (context?.previousOrgs) {
        queryClient.setQueryData(['organizations'], context.previousOrgs);
      }
      const errorMsg = error.response?.data?.name?.[0] || 
                       error.response?.data?.error || 
                       'Failed to create organization';
      toast.error(errorMsg);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['organizations']);
    },
  });

  // Update organization with optimistic update
  const updateOrg = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.patch(`/organizations/${id}/`, data);
      return response.data;
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries(['organizations']);
      const previousOrgs = queryClient.getQueryData(['organizations']);

      // Optimistically update
      queryClient.setQueryData(['organizations'], (old) => {
        if (!old) return old;
        return old.map(org => 
          org.id === id ? { ...org, ...data, _optimistic: true } : org
        );
      });

      return { previousOrgs };
    },
    onSuccess: (updatedOrg) => {
      // Replace with real data
      queryClient.setQueryData(['organizations'], (old) => {
        if (!old) return [updatedOrg];
        return old.map(org => org.id === updatedOrg.id ? updatedOrg : org);
      });
      setActiveOrganization(updatedOrg);
      toast.success('Organization updated successfully!');
    },
    onError: (error, variables, context) => {
      if (context?.previousOrgs) {
        queryClient.setQueryData(['organizations'], context.previousOrgs);
      }
      const errorMsg = error.response?.data?.name?.[0] || 
                       error.response?.data?.error || 
                       'Failed to update organization';
      toast.error(errorMsg);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['organizations']);
    },
  });

  // Delete organization with optimistic update
  const deleteOrg = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/organizations/${id}/`);
      return id;
    },
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries(['organizations']);
      const previousOrgs = queryClient.getQueryData(['organizations']);

      // Optimistically remove
      queryClient.setQueryData(['organizations'], (old) => {
        if (!old) return old;
        return old.filter(org => org.id !== deletedId);
      });

      return { previousOrgs };
    },
    onSuccess: () => {
      toast.success('Organization deleted successfully!');
    },
    onError: (error, deletedId, context) => {
      if (context?.previousOrgs) {
        queryClient.setQueryData(['organizations'], context.previousOrgs);
      }
      const errorMsg = error.response?.data?.error || 'Failed to delete organization';
      toast.error(errorMsg);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['organizations']);
    },
  });

  return {
    createOrg,
    updateOrg,
    deleteOrg,
  };
};
