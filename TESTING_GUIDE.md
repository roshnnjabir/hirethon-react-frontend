# 🧪 Frontend Testing Guide

Quick guide to test all the changes and ensure everything works.

---

## 🎯 **Critical Tests** (Must Pass)

### **1. Application Loads** ✅
- [ ] Navigate to `http://localhost:3000`
- [ ] No console errors
- [ ] Dashboard displays

### **2. Create Organization** ✅
- [ ] Click "New Organization" button
- [ ] Modal opens with proper form
- [ ] Fill in name: "Test Org"
- [ ] Submit works
- [ ] Modal closes
- [ ] Organization appears

### **3. Create Namespace** ✅
- [ ] Select an organization
- [ ] Click "New Namespace" button
- [ ] Modal opens
- [ ] Fill in name: "test-namespace"
- [ ] Submit works
- [ ] Namespace appears in list

### **4. Create URL** ✅
- [ ] Click "Create Short URL" button (only shows if namespace exists)
- [ ] Modal opens with full form
- [ ] Fill in:
  - Original URL: `https://example.com`
  - Select namespace
  - Optional: Custom short code
- [ ] Checkboxes work (Private, Generate QR)
- [ ] Submit works
- [ ] URL created successfully

### **5. Edit Organization** ✅
- [ ] Click edit icon next to organization name
- [ ] Modal opens with current name
- [ ] Change name
- [ ] Submit works
- [ ] Name updates

### **6. Edit Namespace** ✅
- [ ] Hover over namespace item
- [ ] Click edit icon
- [ ] Modal opens
- [ ] Change name
- [ ] Submit works

### **7. Delete Namespace** ✅
- [ ] Hover over namespace item
- [ ] Click delete icon
- [ ] Confirm dialog appears
- [ ] Confirm deletion
- [ ] Namespace removed

---

## 🎨 **Visual Tests** (Check Colors)

### **Forms**
- [ ] Input borders are gray by default
- [ ] Input borders turn **golden yellow** (#FFC107) on focus
- [ ] Error messages are **red**
- [ ] Success messages are **green**
- [ ] Required asterisks (*) are **red**

### **Buttons**
- [ ] Primary buttons are **golden yellow**
- [ ] Secondary buttons are **gray**
- [ ] Hover states work (darker shade)
- [ ] Disabled states are faded

### **Status Badges**
- [ ] Success badges are **green**
- [ ] Error badges are **red**
- [ ] Info badges are **blue**
- [ ] Private badges are **blue**

### **Checkboxes**
- [ ] Unchecked: gray border
- [ ] Checked: **golden yellow** background
- [ ] White checkmark visible

---

## 🔧 **Component Tests**

### **Stats Cards**
- [ ] Display correct icons
- [ ] Show proper colors (primary, success, info, neutral)
- [ ] Numbers display correctly

### **Organization Card**
- [ ] Shows organization name
- [ ] Shows slug
- [ ] Edit icon visible
- [ ] "New Namespace" button works

### **Namespace Items**
- [ ] Show namespace name
- [ ] Show URL count
- [ ] Hover shows edit/delete icons
- [ ] Icons properly colored

### **URL Items**
- [ ] Show URL title/short code
- [ ] Show click count
- [ ] Copy button works
- [ ] Open button works
- [ ] Private badge shows if applicable

---

## 📱 **Navigation Tests**

### **Pages Load**
- [ ] `/dashboard` - Dashboard loads
- [ ] `/urls` - URLs page loads
- [ ] `/analytics` - Analytics page loads
- [ ] `/settings` - Settings page loads

### **Data Scoping**
- [ ] Each organization shows its own data
- [ ] Switching organizations updates displayed data
- [ ] No cross-organization data leakage

---

## 🚨 **Error Scenarios**

### **Form Validation**
- [ ] Empty organization name → Error shown
- [ ] Short organization name (< 3 chars) → Error shown
- [ ] Empty namespace name → Error shown
- [ ] Invalid URL format → Error shown
- [ ] Missing namespace selection → Error shown

### **Network Errors**
- [ ] Failed API call shows error toast
- [ ] Loading states display correctly
- [ ] Retry functionality works

---

## 🎯 **Performance Tests**

### **Re-rendering**
- [ ] Typing in forms doesn't re-render entire page
- [ ] List items don't all re-render when one changes
- [ ] Modals open/close smoothly

### **Loading States**
- [ ] Spinners show during API calls
- [ ] Skeleton loaders display while fetching
- [ ] No blank screens

---

## 🐛 **Common Issues to Check**

### **Import Errors**
```bash
# Check browser console for:
- "Failed to resolve import"
- "Does not provide an export named"
- "Cannot find module"
```

### **Color Issues**
```bash
# Check for:
- Gray text on gray background (bad contrast)
- Missing hover states
- Inconsistent colors
```

### **Layout Issues**
```bash
# Check for:
- Overlapping elements
- Cut-off text
- Misaligned items
- Mobile responsiveness
```

---

## ✅ **Acceptance Criteria**

The frontend passes if:

1. ✅ All 7 critical tests pass
2. ✅ All forms submit successfully
3. ✅ All modals open/close properly
4. ✅ Golden yellow color is consistent
5. ✅ No console errors
6. ✅ All pages load without errors
7. ✅ Data is properly scoped to organizations
8. ✅ Edit/delete operations work

---

## 🎉 **Expected Result**

After all tests pass, you should have:

- **Fully functional dashboard** with stats
- **Working CRUD operations** for orgs, namespaces, URLs
- **Modern modal dialogs** (no prompts/confirms)
- **Consistent golden yellow** color theme
- **Proper error handling** with validation
- **Smooth user experience** with loading states

---

## 📝 **Quick Test Script**

Run this test flow in order:

1. Create Organization: "My Test Org"
2. Create Namespace: "test"
3. Create URL: `https://google.com` → `test/google`
4. Edit Organization name to "Updated Org"
5. Edit Namespace name to "updated-test"
6. Create another URL
7. Delete first URL
8. Delete namespace
9. Switch between organizations (if multiple)
10. Check analytics page

If all steps work without errors → **Frontend is READY** ✅

---

## 🆘 **Troubleshooting**

### **Modal doesn't open**
- Check console for import errors
- Verify modal state management

### **Form doesn't submit**
- Check validation errors
- Verify API endpoint is correct
- Check network tab for failed requests

### **Colors look wrong**
- Hard refresh (Ctrl+F5)
- Check Tailwind CSS is processing correctly
- Verify class names match new system

### **Data not showing**
- Check organization is selected
- Verify API returns data
- Check query key matches

---

**Good luck with testing!** 🚀

