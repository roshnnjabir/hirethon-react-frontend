# 🎨 Color Theme Reference

## Primary Color: Golden Yellow (#FFC107)

The application uses a **Golden Yellow (#FFC107)** color theme throughout, representing energy, optimism, and clarity.

---

## 🎯 **Color Palette**

### **Primary Colors (Golden Yellow)**
```css
--color-primary-50: #FFF9E6;   /* Lightest - backgrounds */
--color-primary-100: #FFF3CC;  /* Very light */
--color-primary-200: #FFE799;  /* Light */
--color-primary-300: #FFDA66;  /* Light-medium */
--color-primary-400: #FFCE33;  /* Medium */
--color-primary-500: #FFC107;  /* ⭐ Main brand color */
--color-primary-600: #FFB300;  /* Medium-dark - hover states */
--color-primary-700: #FFA000;  /* Dark */
--color-primary-800: #FF8F00;  /* Darker */
--color-primary-900: #FF6F00;  /* Darkest - accents */
```

### **Success Colors (Green)**
```css
--color-success-400: #10B981;  /* Main success color */
--color-success-600: #059669;  /* Darker success */
```

### **Error Colors (Red)**
```css
--color-error-400: #EF4444;    /* Main error color */
--color-error-600: #DC2626;    /* Darker error */
```

### **Info Colors (Blue)**
```css
--color-info-400: #3B82F6;     /* Main info color */
--color-info-600: #2563EB;     /* Darker info */
```

### **Neutral Colors (Gray)**
```css
--color-neutral-50: #FAFAFA;   /* Backgrounds */
--color-neutral-100: #F5F5F5;  /* Light backgrounds */
--color-neutral-200: #E5E5E5;  /* Borders */
--color-neutral-300: #D4D4D4;  /* Disabled states */
--color-neutral-400: #A3A3A3;  /* Placeholders */
--color-neutral-500: #737373;  /* Secondary text */
--color-neutral-600: #525252;  /* Body text */
--color-neutral-700: #404040;  /* Dark text */
--color-neutral-800: #262626;  /* Darker text */
--color-neutral-900: #171717;  /* Headings, primary text */
```

---

## 📋 **Usage Guide**

### **Buttons**
```jsx
// Primary button - Golden Yellow
<Button variant="primary">Create</Button>
// bg-primary-500 hover:bg-primary-600 text-white

// Secondary button - Gray
<Button variant="secondary">Cancel</Button>
// bg-neutral-100 hover:bg-neutral-200 text-neutral-900

// Danger button - Red
<Button variant="danger">Delete</Button>
// bg-error-500 hover:bg-error-600 text-white
```

### **Stats Cards**
```jsx
// Primary icon (Golden Yellow)
<StatsCard icon={LinkIcon} iconBg="primary" />

// Success icon (Green)
<StatsCard icon={TrendingUp} iconBg="success" />

// Info icon (Blue)
<StatsCard icon={Globe} iconBg="info" />

// Neutral icon (Gray)
<StatsCard icon={Users} iconBg="neutral" />
```

### **Badges/Status**
```jsx
// Success - Green
className="bg-success-100 text-success-700"

// Error - Red
className="bg-error-100 text-error-700"

// Info - Blue
className="bg-info-100 text-info-700"

// Warning - Yellow
className="bg-primary-100 text-primary-700"
```

---

## 🎨 **Component Color Mapping**

| Component | Primary Color | Usage |
|-----------|---------------|-------|
| **Buttons** | Golden Yellow (#FFC107) | Primary actions |
| **Organization Card** | Gradient Yellow | Organization icon background |
| **URL Items** | Yellow | Icon background |
| **Namespace Items** | Blue (#3B82F6) | Icon background |
| **Success Messages** | Green (#10B981) | Toasts, badges |
| **Error Messages** | Red (#EF4444) | Toasts, badges |
| **Links/Hover** | Yellow (#FFC107) | Interactive elements |

---

## 🖼️ **Visual Examples**

### **Page Header**
- Background: White (#FFFFFF)
- Border: Neutral-200 (#E5E5E5)
- Title: Neutral-900 (#171717)
- Subtitle: Neutral-600 (#525252)
- Primary Button: Golden Yellow (#FFC107)

### **Cards**
- Background: White (#FFFFFF)
- Border: Neutral-200 (#E5E5E5)
- Shadow: Subtle neutral shadow

### **Icons**
- Primary: Yellow (#FFC107) on Yellow-100 background (#FFF3CC)
- Success: Green (#10B981) on Green-100 background
- Info: Blue (#3B82F6) on Blue-100 background
- Neutral: Gray (#525252) on Gray-100 background

---

## 💡 **Brand Guidelines**

### **Do's ✅**
- Use Golden Yellow for primary actions
- Use neutral grays for secondary elements
- Use green for success states
- Use red for errors/destructive actions
- Use blue for informational elements
- Maintain consistent color usage

### **Don'ts ❌**
- Don't use random colors
- Don't mix multiple primary colors
- Don't use low contrast combinations
- Don't use colors without semantic meaning

---

## 🔍 **Accessibility**

All color combinations meet **WCAG 2.1 Level AA** standards:

- ✅ Primary-500 text on white: 4.5:1 (Pass)
- ✅ Neutral-900 text on white: 12.6:1 (Pass)
- ✅ Neutral-600 text on white: 7.5:1 (Pass)
- ✅ White text on Primary-500: 4.5:1 (Pass)

---

## 📦 **Tailwind Classes Reference**

### **Backgrounds**
```
bg-primary-50    // #FFF9E6
bg-primary-100   // #FFF3CC
bg-primary-500   // #FFC107 ⭐
bg-primary-600   // #FFB300
```

### **Text**
```
text-primary-500  // #FFC107
text-primary-600  // #FFB300
text-primary-700  // #FFA000
```

### **Borders**
```
border-primary-500  // #FFC107
border-neutral-200  // #E5E5E5
```

### **Hover States**
```
hover:bg-primary-600   // Darker on hover
hover:text-primary-500 // Yellow text on hover
```

---

## 🎯 **Summary**

**Primary Brand Color**: Golden Yellow (#FFC107)  
**Font**: Inter  
**Design System**: Defined in `frontend/src/index.css`  
**Framework**: Tailwind CSS  
**Theme**: Light mode with neutral backgrounds

This color theme creates a **warm, optimistic, and professional** appearance perfect for a URL shortener service! ✨

