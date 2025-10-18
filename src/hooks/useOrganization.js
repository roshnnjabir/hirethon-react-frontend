import { useOrganization as useOrgContext } from '../contexts/OrgContext';

// Re-export the useOrganization hook from OrgContext for convenience
export const useOrganization = useOrgContext;

// Additional organization-related hooks can be added here
export const useOrganizationActions = () => {
  const { 
    createOrganization, 
    setActiveOrganization, 
    setActiveNamespace,
    updateOrganization, 
    deleteOrganization, 
    inviteUser,
    loadOrganizations,
    clearError 
  } = useOrganization();
  
  return {
    createOrganization,
    setActiveOrganization,
    setActiveNamespace,
    updateOrganization,
    deleteOrganization,
    inviteUser,
    loadOrganizations,
    clearError,
  };
};

export const useOrganizationState = () => {
  const { 
    organizations, 
    activeOrg, 
    activeNamespace, 
    userRole, 
    permissions, 
    isLoading, 
    error 
  } = useOrganization();
  
  return {
    organizations,
    activeOrg,
    activeNamespace,
    userRole,
    permissions,
    isLoading,
    error,
  };
};

export const usePermissions = () => {
  const { checkPermission, permissions, userRole } = useOrganization();
  
  return {
    checkPermission,
    permissions,
    userRole,
    hasPermission: checkPermission,
  };
};
