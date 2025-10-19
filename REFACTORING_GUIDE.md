# 🚀 Frontend Refactoring Guide

## 📖 Overview

This document explains the comprehensive frontend refactoring completed to improve componentization, reusability, and performance.

---

## 🎯 **Quick Reference**

### **Component Index**

| Component | Purpose | Location | Memoized |
|-----------|---------|----------|----------|
| `PageHeader` | Page title & actions | `components/common/` | ✅ |
| `SectionCard` | Generic card wrapper | `components/common/` | ✅ |
| `StatsCard` | Stats display | `components/dashboard/` | ✅ |
| `OrganizationCard` | Org display & edit | `components/dashboard/` | ✅ |
| `NamespaceItem` | Namespace list item | `components/dashboard/` | ✅ |
| `URLItem` | URL list item | `components/dashboard/` | ✅ |
| `CreateOrgModal` | Create organization | `components/modals/` | - |
| `EditOrgModal` | Edit organization | `components/modals/` | - |
| `CreateNamespaceModal` | Create namespace | `components/modals/` | - |
| `EditNamespaceModal` | Edit namespace | `components/modals/` | - |
| `CreateURLModal` | Create URL | `components/modals/` | - |

### **Custom Hooks Index**

| Hook | Purpose | Location |
|------|---------|----------|
| `useOrganizationMutations` | Org CRUD | `hooks/` |
| `useNamespaceMutations` | Namespace CRUD | `hooks/` |
| `useURLMutations` | URL CRUD | `hooks/` |

---

## 📚 **Component Usage Examples**

### **1. PageHeader**
```jsx
import PageHeader from '../../components/common/PageHeader';

<PageHeader
  title="Dashboard"
  subtitle="Manage your URLs and organizations"
  actions={
    <>
      <Button>Action 1</Button>
      <Button>Action 2</Button>
    </>
  }
/>
```

### **2. StatsCard**
```jsx
import StatsCard from '../../components/dashboard/StatsCard';
import { Users } from 'lucide-react';

<StatsCard
  title="Team Members"
  value="15"
  icon={Users}
  iconBg="primary"
  change={5}
  changeType="positive"
/>
```

### **3. OrganizationCard**
```jsx
import OrganizationCard from '../../components/dashboard/OrganizationCard';

<OrganizationCard
  organization={currentOrg}
  onEdit={() => setShowEditModal(true)}
  onCreateNamespace={() => setShowCreateNamespace(true)}
/>
```

### **4. NamespaceItem**
```jsx
import NamespaceItem from '../../components/dashboard/NamespaceItem';

{namespaces.map(ns => (
  <NamespaceItem
    key={ns.id}
    namespace={ns}
    onEdit={handleEdit}
    onDelete={handleDelete}
    onClick={handleClick}
  />
))}
```

### **5. URLItem**
```jsx
import URLItem from '../../components/dashboard/URLItem';

{urls.map(url => (
  <URLItem
    key={url.id}
    url={url}
    onClick={handleClick}
    onEdit={handleEdit}
    onDelete={handleDelete}
    showNamespace={true}
  />
))}
```

### **6. Modals**
```jsx
import CreateOrgModal from '../../components/modals/CreateOrgModal';

const [showModal, setShowModal] = useState(false);

<CreateOrgModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onSubmit={handleCreate}
  isLoading={mutation.isPending}
/>
```

---

## 🔧 **Custom Hooks Usage**

### **useOrganizationMutations**
```jsx
import { useOrganizationMutations } from '../../hooks/useOrganizationMutations';

const { createOrg, updateOrg, deleteOrg } = useOrganizationMutations();

// Create
createOrg.mutate({ name, slug });

// Update
updateOrg.mutate({ id, data: { name, slug } });

// Delete
deleteOrg.mutate(id);
```

### **useNamespaceMutations**
```jsx
import { useNamespaceMutations } from '../../hooks/useNamespaceMutations';

const orgId = activeOrg?.id;
const { createNamespace, updateNamespace, deleteNamespace } = useNamespaceMutations(orgId);

// Create
createNamespace.mutate({ name });

// Update
updateNamespace.mutate({ id, data: { name } });

// Delete
deleteNamespace.mutate(id);
```

### **useURLMutations**
```jsx
import { useURLMutations } from '../../hooks/useURLMutations';

const orgId = activeOrg?.id;
const { createURL, updateURL, deleteURL } = useURLMutations(orgId);

// Create
createURL.mutate({
  original_url,
  short_code,
  namespace,
  title,
  is_private,
});

// Update
updateURL.mutate({ id, data: { title, description } });

// Delete
deleteURL.mutate(id);
```

---

## ⚡ **Performance Patterns**

### **1. Memoization**
All list item components are wrapped in `React.memo()` with custom comparison:

```jsx
const NamespaceItem = memo(({ namespace, onEdit, onDelete }) => {
  // ... component logic
}, (prevProps, nextProps) => {
  return (
    prevProps.namespace?.id === nextProps.namespace?.id &&
    prevProps.namespace?.name === nextProps.namespace?.name
  );
});
```

### **2. useCallback for Event Handlers**
```jsx
const handleCreate = useCallback((data) => {
  createMutation.mutate(data, {
    onSuccess: () => setShowModal(false)
  });
}, [createMutation]);
```

### **3. useMemo for Computed Values**
```jsx
const hasNamespaces = useMemo(
  () => namespaces.length > 0,
  [namespaces]
);

const headerActions = useMemo(() => (
  <>
    <Button>Action 1</Button>
    <Button>Action 2</Button>
  </>
), [dependency]);
```

---

## 🎨 **Design Patterns**

### **1. Composition Pattern**
Components compose together naturally:

```jsx
<PageHeader title="Dashboard" actions={<Button>Action</Button>} />

<SectionCard title="Stats">
  <StatsCard title="Users" value="100" />
</SectionCard>
```

### **2. Render Props Pattern**
```jsx
<VirtualList
  items={urls}
  renderItem={(url) => <URLItem url={url} />}
/>
```

### **3. Custom Hooks Pattern**
Extract business logic into reusable hooks:

```jsx
const { createURL, isPending } = useURLMutations(orgId);
```

---

## 🔍 **Before vs After**

### **Creating an Organization**

**Before (❌ Old Way)**:
```jsx
const handleCreateOrg = () => {
  const name = prompt('Enter organization name:');
  if (name) {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    
    const createOrgMutation = useMutation({
      mutationFn: async (data) => {
        const response = await api.post('/organizations/', data);
        return response.data;
      },
      onSuccess: (newOrg) => {
        queryClient.invalidateQueries(['organizations']);
        setCurrentOrg(newOrg);
        toast.success('Organization created successfully!');
      },
      onError: (error) => {
        toast.error('Failed to create organization');
      },
    });
    
    createOrgMutation.mutate({ name, slug });
  }
};
```

**After (✅ New Way)**:
```jsx
import { useOrganizationMutations } from '../../hooks/useOrganizationMutations';
import CreateOrgModal from '../../components/modals/CreateOrgModal';

const { createOrg } = useOrganizationMutations();
const [showModal, setShowModal] = useState(false);

const handleCreate = useCallback((data) => {
  createOrg.mutate(data, {
    onSuccess: () => setShowModal(false)
  });
}, [createOrg]);

<Button onClick={() => setShowModal(true)}>Create Org</Button>

<CreateOrgModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onSubmit={handleCreate}
  isLoading={createOrg.isPending}
/>
```

**Benefits**:
- ✅ Modern modal UI instead of prompt
- ✅ Form validation
- ✅ Loading states
- ✅ Better error handling
- ✅ Reusable mutation logic
- ✅ Less code in component
- ✅ Better UX

---

## 📦 **Import Examples**

### **Complete Page Setup**
```jsx
import React, { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

// Hooks
import { useAuth } from '../../hooks/useAuth';
import { useOrganization } from '../../hooks/useOrganization';
import { useOrganizationMutations } from '../../hooks/useOrganizationMutations';
import { useNamespaceMutations } from '../../hooks/useNamespaceMutations';

// Components
import PageHeader from '../../components/common/PageHeader';
import StatsCard from '../../components/dashboard/StatsCard';
import OrganizationCard from '../../components/dashboard/OrganizationCard';
import NamespaceItem from '../../components/dashboard/NamespaceItem';
import CreateOrgModal from '../../components/modals/CreateOrgModal';
import Button from '../../components/common/Button';

// Icons
import { Plus, Building2 } from 'lucide-react';
```

---

## 🚨 **Common Pitfalls to Avoid**

### **1. Don't Create Inline Functions in Renders**
❌ **Bad**:
```jsx
<Button onClick={() => handleClick(item.id)}>Click</Button>
```

✅ **Good**:
```jsx
const handleClick = useCallback(() => {
  doSomething(item.id);
}, [item.id]);

<Button onClick={handleClick}>Click</Button>
```

### **2. Don't Skip Memoization Dependencies**
❌ **Bad**:
```jsx
const value = useMemo(() => expensiveCalc(data), []); // Missing 'data'
```

✅ **Good**:
```jsx
const value = useMemo(() => expensiveCalc(data), [data]);
```

### **3. Don't Use Prompts/Confirms**
❌ **Bad**:
```jsx
const name = prompt('Enter name:');
const confirmed = confirm('Are you sure?');
```

✅ **Good**:
```jsx
<Modal isOpen={showModal} onClose={closeModal}>
  <Form onSubmit={handleSubmit} />
</Modal>

<ConfirmDialog
  isOpen={showConfirm}
  onConfirm={handleConfirm}
  title="Are you sure?"
/>
```

---

## 🎓 **Learning Resources**

### **React Performance**
- React.memo(): https://react.dev/reference/react/memo
- useCallback(): https://react.dev/reference/react/useCallback
- useMemo(): https://react.dev/reference/react/useMemo

### **Custom Hooks**
- Creating Custom Hooks: https://react.dev/learn/reusing-logic-with-custom-hooks

### **Component Patterns**
- Composition: https://react.dev/learn/passing-props-to-a-component
- Render Props: https://react.dev/learn/sharing-state-between-components

---

## ✅ **Checklist for New Features**

When adding a new feature, follow this checklist:

- [ ] Create reusable components (not inline)
- [ ] Use custom hooks for business logic
- [ ] Memoize list components with `React.memo()`
- [ ] Use `useCallback` for event handlers
- [ ] Use `useMemo` for computed values
- [ ] Use modals instead of prompts/confirms
- [ ] Add proper loading states
- [ ] Add proper error handling
- [ ] Add form validation
- [ ] Test on different screen sizes
- [ ] Check accessibility (keyboard navigation)
- [ ] Update documentation

---

## 🎉 **Summary**

The refactored codebase now follows **modern React best practices**:

✅ **Component Reusability** - Build once, use everywhere  
✅ **Performance Optimized** - Memoization prevents unnecessary renders  
✅ **Clean Code** - Separation of concerns  
✅ **Modern UX** - No more prompts/confirms  
✅ **Maintainable** - Easy to understand and extend  
✅ **Scalable** - Ready for growth  

**You're now working with production-quality code!** 🚀

