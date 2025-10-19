# Design System & Theme Guide

## 🎨 **Color Palette**

### Primary Colors
```css
--primary-500: #FFC107    /* Main brand color - Golden Yellow */
--primary-600: #FFB300    /* Hover state */
--primary-700: #FFA000    /* Active/Pressed */
--primary-400: #FFCA28    /* Light accent */
--primary-100: #FFF9E6    /* Subtle backgrounds */
```

### Neutral Colors (Grayscale)
```css
--neutral-50:  #FAFAFA    /* Page background */
--neutral-100: #F5F5F5    /* Card background */
--neutral-200: #E5E5E5    /* Borders */
--neutral-300: #D4D4D4    /* Disabled text */
--neutral-400: #A3A3A3    /* Placeholder */
--neutral-500: #737373    /* Secondary text */
--neutral-600: #525252    /* Body text */
--neutral-700: #404040    /* Headings */
--neutral-800: #262626    /* Dark text */
--neutral-900: #171717    /* Primary text */
```

### Semantic Colors
```css
--success-500: #10B981   /* Green - Success states */
--success-100: #D1FAE5   /* Success background */

--error-500: #EF4444     /* Red - Errors */
--error-100: #FEE2E2     /* Error background */

--warning-500: #F59E0B   /* Orange - Warnings */
--warning-100: #FEF3C7   /* Warning background */

--info-500: #3B82F6      /* Blue - Information */
--info-100: #DBEAFE      /* Info background */
```

---

## 📐 **Typography**

### Font Family
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Type Scale
```css
--text-xs:   0.75rem   /* 12px */
--text-sm:   0.875rem  /* 14px */
--text-base: 1rem      /* 16px */
--text-lg:   1.125rem  /* 18px */
--text-xl:   1.25rem   /* 20px */
--text-2xl:  1.5rem    /* 24px */
--text-3xl:  1.875rem  /* 30px */
--text-4xl:  2.25rem   /* 36px */
```

### Font Weights
```css
--font-normal:  400
--font-medium:  500
--font-semibold: 600
--font-bold:    700
```

---

## 🎯 **Spacing Scale**

```css
--space-1: 0.25rem   /* 4px */
--space-2: 0.5rem    /* 8px */
--space-3: 0.75rem   /* 12px */
--space-4: 1rem      /* 16px */
--space-5: 1.25rem   /* 20px */
--space-6: 1.5rem    /* 24px */
--space-8: 2rem      /* 32px */
--space-10: 2.5rem   /* 40px */
--space-12: 3rem     /* 48px */
--space-16: 4rem     /* 64px */
```

---

## 🔲 **Border Radius**

```css
--radius-sm:  0.375rem  /* 6px - Small elements */
--radius-md:  0.5rem    /* 8px - Buttons, inputs */
--radius-lg:  0.75rem   /* 12px - Cards */
--radius-xl:  1rem      /* 16px - Modals */
--radius-full: 9999px   /* Circular */
```

---

## 🌊 **Shadows**

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

---

## 🎭 **Component Styles**

### Buttons

#### Primary Button
```css
background: #FFC107
color: #FFFFFF
padding: 12px 24px
border-radius: 8px
font-weight: 600
hover: #FFB300
active: #FFA000
```

#### Secondary Button
```css
background: #F5F5F5
color: #171717
border: 1px solid #E5E5E5
hover: #E5E5E5
```

#### Ghost Button
```css
background: transparent
color: #737373
hover: #F5F5F5
```

### Input Fields
```css
background: #FFFFFF
border: 1px solid #E5E5E5
border-radius: 8px
padding: 10px 16px
focus: border #FFC107, ring 2px #FFF9E6
```

### Cards
```css
background: #FFFFFF
border: 1px solid #E5E5E5
border-radius: 12px
padding: 24px
shadow: 0 1px 3px rgba(0, 0, 0, 0.05)
```

---

## 📱 **Simplified Page Structure**

### Core Pages (5 Total)

1. **Dashboard** (`/dashboard`)
   - Overview of all organizations & recent URLs
   - Quick actions
   - Stats cards

2. **URLs** (`/urls`)
   - All URLs in one place
   - Advanced search & filters
   - Bulk operations
   - Create new URL

3. **Analytics** (`/analytics`)
   - Comprehensive analytics dashboard
   - Charts and visualizations
   - Real-time updates

4. **Settings** (`/settings`)
   - Profile settings
   - Organization management
   - Team members

5. **Auth Pages** (`/login`, `/register`)
   - Minimal, centered design
   - Same color theme

### Removed Complexity
- ❌ No separate namespace pages
- ❌ No deep nested routes
- ❌ No organization-specific routes
- ✅ Everything accessible from sidebar
- ✅ Use modals for creation/editing
- ✅ Inline actions where possible

---

## 🎬 **Animation & Transitions**

### Timing
```css
--duration-fast: 150ms
--duration-base: 200ms
--duration-slow: 300ms
--easing: cubic-bezier(0.4, 0, 0.2, 1)
```

### Page Transitions
- Fade in: 200ms
- Slide up: 300ms for modals
- Scale: 150ms for buttons

### Micro-interactions
- Hover: 150ms
- Active: 100ms
- Focus: 0ms (instant ring)

---

## 🧩 **Layout Principles**

### 1. **Consistent Spacing**
- Use 8px grid system
- Padding: 16px, 24px, 32px
- Margins: 16px, 24px, 40px

### 2. **Visual Hierarchy**
```
h1: 36px / Bold / #171717
h2: 24px / SemiBold / #262626
h3: 20px / SemiBold / #404040
body: 16px / Normal / #525252
caption: 14px / Normal / #737373
```

### 3. **Maximum Widths**
- Content: 1280px
- Forms: 600px
- Modals: 800px

### 4. **Responsive Breakpoints**
```css
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
```

---

## ✨ **UX Principles**

### 1. **Low Entry, High Surface**
- ✅ One-click actions
- ✅ Inline editing
- ✅ Smart defaults
- ✅ Keyboard shortcuts
- ✅ Progressive disclosure

### 2. **Seamless Navigation**
- ✅ Persistent sidebar
- ✅ Breadcrumbs for context
- ✅ Back button behavior
- ✅ Cmd/Ctrl+K search
- ✅ No unnecessary clicks

### 3. **Feedback & States**
- ✅ Loading skeletons
- ✅ Optimistic updates
- ✅ Toast notifications
- ✅ Empty states with actions
- ✅ Error recovery options

### 4. **Performance**
- ✅ < 1s page load
- ✅ < 100ms interactions
- ✅ Lazy loading
- ✅ Optimized images
- ✅ Code splitting

---

## 🎨 **Component Library**

### Atoms
- Button (Primary, Secondary, Ghost, Danger)
- Input (Text, Email, Password, Search, Number, Date)
- Checkbox, Radio, Toggle
- Badge, Tag, Chip
- Avatar, Icon
- Spinner, Skeleton

### Molecules
- FormField (Label + Input + Error)
- SearchBar
- Dropdown
- Modal
- Toast
- Card
- Table Row

### Organisms
- Navbar
- Sidebar
- StatsCard
- URLCard
- BulkActions
- SearchFilter
- Pagination
- Chart Components

---

## 📊 **Data Visualization Colors**

### Chart Colors (in order)
1. `#FFC107` - Primary (Yellow)
2. `#3B82F6` - Blue
3. `#10B981` - Green
4. `#F59E0B` - Orange
5. `#EF4444` - Red
6. `#8B5CF6` - Purple
7. `#EC4899` - Pink
8. `#6B7280` - Gray

### Usage
- Use primary (#FFC107) for main metric
- Use blue (#3B82F6) for comparisons
- Use green (#10B981) for positive trends
- Use red (#EF4444) for negative trends

---

## 🚀 **Quick Reference**

### Do's ✅
- Use consistent 8px spacing
- Apply hover states (150ms)
- Show loading states
- Provide empty states
- Use toast for feedback
- Keep actions visible
- Use icons with labels
- Maintain contrast ratios

### Don'ts ❌
- Mix different radii
- Use inconsistent spacing
- Hide important actions
- Use too many colors
- Overuse animations
- Create deep navigation
- Use small touch targets
- Skip error states

---

## 🎯 **Accessibility**

### Contrast Ratios
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- Interactive elements: 3:1 minimum

### Focus States
- All interactive elements must have visible focus
- Use 2px ring with primary color
- Never remove :focus styles

### Keyboard Navigation
- Tab through all interactive elements
- Enter to activate
- Escape to close modals
- Arrow keys in lists

---

**This design system ensures a consistent, professional, and delightful user experience throughout the application.** 🎨✨

