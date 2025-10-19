# 🚨 DATA SCOPING ISSUE - CRITICAL BUG

## Problem Summary

**Users are seeing data from ALL organizations they belong to, not just the active organization!**

---

## Root Cause

### Backend ✅ (Correct)
The backend correctly filters data by user membership:

```python
# ShortURLViewSet.get_queryset()
return ShortURL.objects.filter(
    namespace__organization__members__user=self.request.user
).select_related('namespace', 'created_by').distinct()

# NamespaceViewSet.get_queryset()
return Namespace.objects.filter(
    organization__members__user=self.request.user
).select_related('organization').distinct()
```

**This is correct!** Users should only see data from organizations they're members of.

### Frontend ❌ (WRONG)
The frontend fetches data WITHOUT filtering by active organization:

```jsx
// DashboardHome.jsx - Line 42
const { data: namespaces = [] } = useQuery({
  queryKey: ['namespaces', currentOrg?.id],
  queryFn: async () => {
    if (!currentOrg?.id) return [];
    // ❌ BUG: Not filtering by organization!
    const response = await api.get('/namespaces/');
    return response.data.results || response.data;
  },
});

// DashboardHome.jsx - Line 53
const { data: recentUrls = [] } = useQuery({
  queryKey: ['recent-urls', currentOrg?.id],
  queryFn: async () => {
    if (!currentOrg?.id) return [];
    // ❌ BUG: Not filtering by organization/namespace!
    const response = await api.get('/urls/?limit=5&ordering=-created_at');
    return response.data.results || response.data;
  },
});
```

---

## What's Happening

### Scenario:
1. User is member of **Org A** and **Org B**
2. User creates namespace "workspace" in **Org A**
3. User creates namespace "team" in **Org B**
4. User creates URLs in both organizations

### Expected Behavior:
- When viewing **Org A**: See only "workspace" namespace and its URLs
- When viewing **Org B**: See only "team" namespace and its URLs

### Actual Behavior:
- When viewing **Org A**: See "workspace" AND "team" namespaces + ALL URLs from both orgs! ❌
- When viewing **Org B**: See "workspace" AND "team" namespaces + ALL URLs from both orgs! ❌

**The data is NOT scoped to the active organization!**

---

## The Fix

### Backend Changes Needed

The backend APIs need to accept `organization` query parameter:

```python
# namespaces/views.py - NamespaceViewSet
def get_queryset(self):
    """Get namespaces for organizations where user is a member"""
    queryset = Namespace.objects.filter(
        organization__members__user=self.request.user
    ).select_related('organization').distinct()
    
    # Filter by organization if provided
    organization_id = self.request.query_params.get('organization')
    if organization_id:
        queryset = queryset.filter(organization_id=organization_id)
    
    return queryset

# shorturls/views.py - ShortURLViewSet
def get_queryset(self):
    """Get URLs for namespaces where user has access"""
    queryset = ShortURL.objects.filter(
        namespace__organization__members__user=self.request.user
    ).select_related('namespace', 'created_by').distinct()
    
    # Filter by organization if provided
    organization_id = self.request.query_params.get('organization')
    if organization_id:
        queryset = queryset.filter(namespace__organization_id=organization_id)
    
    # Filter by namespace if provided
    namespace_id = self.request.query_params.get('namespace')
    if namespace_id:
        queryset = queryset.filter(namespace_id=namespace_id)
    
    return queryset
```

### Frontend Changes Needed

All API calls must pass the active organization:

```jsx
// DashboardHome.jsx - CORRECTED
const { data: namespaces = [] } = useQuery({
  queryKey: ['namespaces', currentOrg?.id],
  queryFn: async () => {
    if (!currentOrg?.id) return [];
    // ✅ FIX: Filter by organization
    const response = await api.get('/namespaces/', {
      params: { organization: currentOrg.id }
    });
    return response.data.results || response.data;
  },
});

const { data: recentUrls = [] } = useQuery({
  queryKey: ['recent-urls', currentOrg?.id],
  queryFn: async () => {
    if (!currentOrg?.id) return [];
    // ✅ FIX: Filter by organization
    const response = await api.get('/urls/', {
      params: { 
        organization: currentOrg.id,
        limit: 5,
        ordering: '-created_at'
      }
    });
    return response.data.results || response.data;
  },
});
```

---

## Files to Fix

### Backend
- [ ] `backend/hirethon_template/namespaces/views.py` - Add organization filtering
- [ ] `backend/hirethon_template/shorturls/views.py` - Add organization/namespace filtering

### Frontend
- [ ] `frontend/src/pages/dashboard/DashboardHome.jsx` - Add organization filter
- [ ] `frontend/src/pages/dashboard/OrganizationDetail.jsx` - Add organization filter
- [ ] `frontend/src/pages/dashboard/NamespaceList.jsx` - Add organization filter
- [ ] `frontend/src/pages/dashboard/NamespaceDetail.jsx` - Add namespace filter
- [ ] `frontend/src/pages/urls/URLsPage.jsx` - Add organization/namespace filter
- [ ] `frontend/src/pages/analytics/AnalyticsPage.jsx` - Add organization filter
- [ ] `frontend/src/api/namespaces.js` - Update API client
- [ ] `frontend/src/api/shorturls.js` - Update API client

---

## Security Impact

**SEVERITY: HIGH** 🚨

While users can only see data from organizations they're members of (backend correctly enforces this), the frontend UX issue creates:

1. **Confusion**: Users don't understand which data belongs to which org
2. **Data leakage**: If a user is in multiple orgs, they see all data mixed together
3. **Wrong context**: Actions might be performed on wrong organization's data
4. **Privacy concern**: Users might inadvertently share URLs from wrong org

**This MUST be fixed before production!**

---

## Testing Checklist

After fix, verify:

- [ ] Create 2 organizations (Org A, Org B)
- [ ] Create namespace in Org A
- [ ] Create namespace in Org B
- [ ] Create URL in Org A
- [ ] Create URL in Org B
- [ ] Switch to Org A → See ONLY Org A's namespaces and URLs
- [ ] Switch to Org B → See ONLY Org B's namespaces and URLs
- [ ] Analytics show only data for active org
- [ ] Search/filters respect organization boundary

---

## Next Steps

1. ✅ Identify the issue (DONE)
2. ⏳ Fix backend API query parameter support
3. ⏳ Fix all frontend API calls
4. ⏳ Test data isolation
5. ⏳ Document the fix

