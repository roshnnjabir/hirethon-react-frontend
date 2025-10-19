import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { organizationsAPI } from '../api/organizations';
import { namespacesAPI } from '../api/namespaces';
// ❌ Removed localStorage imports - use API and React state only
import { hasPermission } from '../utils/helpers';
import { ROLE_PERMISSIONS } from '../utils/constants';

// Initial state
const initialState = {
  organizations: [],
  activeOrg: null,
  activeNamespace: null,
  userRole: null,
  permissions: [],
  isLoading: false,
  error: null,
};

// Action types
const ORG_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ORGANIZATIONS: 'SET_ORGANIZATIONS',
  SET_ACTIVE_ORG: 'SET_ACTIVE_ORG',
  SET_ACTIVE_NAMESPACE: 'SET_ACTIVE_NAMESPACE',
  SET_USER_ROLE: 'SET_USER_ROLE',
  SET_PERMISSIONS: 'SET_PERMISSIONS',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  ADD_ORGANIZATION: 'ADD_ORGANIZATION',
  UPDATE_ORGANIZATION: 'UPDATE_ORGANIZATION',
  REMOVE_ORGANIZATION: 'REMOVE_ORGANIZATION',
};

// Reducer
const orgReducer = (state, action) => {
  switch (action.type) {
    case ORG_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case ORG_ACTIONS.SET_ORGANIZATIONS:
      return {
        ...state,
        organizations: action.payload,
      };

    case ORG_ACTIONS.SET_ACTIVE_ORG:
      return {
        ...state,
        activeOrg: action.payload,
      };

    case ORG_ACTIONS.SET_ACTIVE_NAMESPACE:
      return {
        ...state,
        activeNamespace: action.payload,
      };

    case ORG_ACTIONS.SET_USER_ROLE:
      return {
        ...state,
        userRole: action.payload,
        permissions: ROLE_PERMISSIONS[action.payload] || [],
      };

    case ORG_ACTIONS.SET_PERMISSIONS:
      return {
        ...state,
        permissions: action.payload,
      };

    case ORG_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    case ORG_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case ORG_ACTIONS.ADD_ORGANIZATION:
      return {
        ...state,
        organizations: [...state.organizations, action.payload],
      };

    case ORG_ACTIONS.UPDATE_ORGANIZATION:
      return {
        ...state,
        organizations: state.organizations.map(org =>
          org.id === action.payload.id ? { ...org, ...action.payload } : org
        ),
        activeOrg: state.activeOrg?.id === action.payload.id 
          ? { ...state.activeOrg, ...action.payload } 
          : state.activeOrg,
      };

    case ORG_ACTIONS.REMOVE_ORGANIZATION:
      return {
        ...state,
        organizations: state.organizations.filter(org => org.id !== action.payload),
        activeOrg: state.activeOrg?.id === action.payload ? null : state.activeOrg,
      };

    default:
      return state;
  }
};

// Create context
const OrgContext = createContext();

// Organization provider component
export const OrgProvider = ({ children }) => {
  const [state, dispatch] = useReducer(orgReducer, initialState);

  // Load organizations on mount
  useEffect(() => {
    loadOrganizations();
  }, []);

  // ❌ Removed localStorage-based organization loading
  // Organizations will be fetched from API and managed in React state only

  const loadOrganizations = async () => {
    try {
      dispatch({ type: ORG_ACTIONS.SET_LOADING, payload: true });
      
      const response = await organizationsAPI.getOrganizations();
      
      dispatch({
        type: ORG_ACTIONS.SET_ORGANIZATIONS,
        payload: response.results || response,
      });
    } catch (error) {
      console.error('Failed to load organizations:', error);
      dispatch({
        type: ORG_ACTIONS.SET_ERROR,
        payload: 'Failed to load organizations',
      });
    } finally {
      dispatch({ type: ORG_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const createOrganization = async (orgData) => {
    try {
      dispatch({ type: ORG_ACTIONS.SET_LOADING, payload: true });
      
      const response = await organizationsAPI.createOrganization(orgData);
      
      dispatch({
        type: ORG_ACTIONS.ADD_ORGANIZATION,
        payload: response,
      });
      
      // Set as active organization
      setActiveOrganization(response);
      
      return { success: true, organization: response };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to create organization';
      dispatch({
        type: ORG_ACTIONS.SET_ERROR,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: ORG_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const setActiveOrganization = (organization) => {
    dispatch({
      type: ORG_ACTIONS.SET_ACTIVE_ORG,
      payload: organization,
    });
    
    // ❌ Removed localStorage storage - keep in React state only
    
    // Set user role and permissions
    const userRole = organization.user_role || 'member';
    dispatch({
      type: ORG_ACTIONS.SET_USER_ROLE,
      payload: userRole,
    });
    
    // Clear active namespace when switching orgs
    dispatch({
      type: ORG_ACTIONS.SET_ACTIVE_NAMESPACE,
      payload: null,
    });
  };

  const setActiveNamespace = (namespace) => {
    dispatch({
      type: ORG_ACTIONS.SET_ACTIVE_NAMESPACE,
      payload: namespace,
    });
    
    // ❌ Removed localStorage storage - keep in React state only
  };

  const updateOrganization = async (orgId, orgData) => {
    try {
      const response = await organizationsAPI.updateOrganization(orgId, orgData);
      
      dispatch({
        type: ORG_ACTIONS.UPDATE_ORGANIZATION,
        payload: response,
      });
      
      return { success: true, organization: response };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to update organization';
      dispatch({
        type: ORG_ACTIONS.SET_ERROR,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  const deleteOrganization = async (orgId) => {
    try {
      await organizationsAPI.deleteOrganization(orgId);
      
      dispatch({
        type: ORG_ACTIONS.REMOVE_ORGANIZATION,
        payload: orgId,
      });
      
      // Clear active org if it was deleted
      if (state.activeOrg?.id === orgId) {
        dispatch({
          type: ORG_ACTIONS.SET_ACTIVE_ORG,
          payload: null,
        });
        // ❌ Removed localStorage clearing - keep in React state only
      }
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to delete organization';
      dispatch({
        type: ORG_ACTIONS.SET_ERROR,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  const inviteUser = async (email, role = 'member') => {
    if (!state.activeOrg) {
      return { success: false, error: 'No active organization' };
    }
    
    try {
      const response = await organizationsAPI.inviteUser(state.activeOrg.id, email, role);
      return { success: true, invitation: response };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to send invitation';
      dispatch({
        type: ORG_ACTIONS.SET_ERROR,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  const checkPermission = (permission) => {
    return hasPermission(state.userRole, permission);
  };

  const clearError = () => {
    dispatch({ type: ORG_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    ...state,
    loadOrganizations,
    createOrganization,
    setActiveOrganization,
    setActiveNamespace,
    updateOrganization,
    deleteOrganization,
    inviteUser,
    checkPermission,
    clearError,
  };

  return (
    <OrgContext.Provider value={value}>
      {children}
    </OrgContext.Provider>
  );
};

// Custom hook to use organization context
export const useOrganization = () => {
  const context = useContext(OrgContext);
  if (!context) {
    throw new Error('useOrganization must be used within an OrgProvider');
  }
  return context;
};

export default OrgContext;
