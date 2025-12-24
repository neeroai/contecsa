# Design Token Reference

Version: 1.0 | Date: 2025-12-24 | Owner: Neero SAS | Status: Active

Quick reference for all design tokens available in Contecsa's design system.

## CSS Variables - Complete List

### Colors: Semantic Status

```css
/* Success - Green */
--color-success: #10b981;
--color-success-light: #d1fae5;
--color-success-dark: #047857;
--color-success-fg: #ffffff;

/* Warning - Amber */
--color-warning: #f59e0b;
--color-warning-light: #fef3c7;
--color-warning-dark: #d97706;
--color-warning-fg: #ffffff;

/* Danger - Red */
--color-danger: #ef4444;
--color-danger-light: #fee2e2;
--color-danger-dark: #dc2626;
--color-danger-fg: #ffffff;

/* Info - Blue */
--color-info: #3b82f6;
--color-info-light: #dbeafe;
--color-info-dark: #1d4ed8;
--color-info-fg: #ffffff;
```

### Colors: Neutral Grayscale

```css
--color-neutral-50: #f9fafb;    /* Lightest (near white) */
--color-neutral-100: #f3f4f6;
--color-neutral-200: #e5e7eb;   /* Light borders */
--color-neutral-300: #d1d5db;   /* Standard borders */
--color-neutral-400: #9ca3af;   /* Disabled text */
--color-neutral-500: #6b7280;   /* Secondary text */
--color-neutral-600: #4b5563;
--color-neutral-700: #374151;   /* Primary text */
--color-neutral-800: #1f2937;
--color-neutral-900: #111827;   /* Darkest */
```

### Colors: Chart Palette

```css
--chart-1: #3b82f6;   /* Blue */
--chart-2: #10b981;   /* Green */
--chart-3: #f59e0b;   /* Amber */
--chart-4: #ef4444;   /* Red */
--chart-5: #8b5cf6;   /* Purple */
--chart-6: #ec4899;   /* Pink */
```

### Colors: Base Semantic (HSL)

```css
/* Light mode (default) */
--background: 0 0% 100%;           /* White */
--foreground: 222.2 84% 4.9%;      /* Near black */
--primary: 221.2 83.2% 53.3%;      /* Blue brand */
--primary-foreground: 210 40% 98%; /* White on blue */
--secondary: 210 40% 96.1%;        /* Light gray */
--secondary-foreground: 222.2 47.4% 11.2%;
--muted: 210 40% 96.1%;            /* Disabled state */
--muted-foreground: 215.4 16.3% 46.9%;
--border: 214.3 31.8% 91.4%;       /* Border color */
--input: 214.3 31.8% 91.4%;        /* Input background */

/* Dark mode overrides */
.dark {
  --background: 222.2 84% 4.9%;         /* Dark gray */
  --foreground: 210 40% 98%;            /* Light gray */
  --primary: 217.2 91.2% 59.8%;         /* Lighter blue */
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;       /* Dark gray */
  --secondary-foreground: 210 40% 98%; /* Light text */
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --border: 217.2 32.6% 17.5%;          /* Lighter border */
  --input: 217.2 32.6% 17.5%;           /* Dark input bg */
}
```

### Spacing

```css
--spacing-xs: 0.25rem;   /* 4px */
--spacing-sm: 0.5rem;    /* 8px */
--spacing-md: 1rem;      /* 16px */
--spacing-lg: 1.5rem;    /* 24px */
--spacing-xl: 2rem;      /* 32px */
--spacing-2xl: 3rem;     /* 48px */
```

**Tailwind Scale Mapping:**
```
m-1 = 4px      m-4 = 16px     m-12 = 48px
m-2 = 8px      m-5 = 20px     m-16 = 64px
m-3 = 12px     m-6 = 24px     m-20 = 80px
```

### Border Radius

```css
--radius-xs: 0.25rem;   /* 4px */
--radius-sm: 0.375rem;  /* 6px */
--radius-md: 0.5rem;    /* 8px */
--radius-lg: 0.75rem;   /* 12px */
```

**Tailwind Classes:**
```
rounded-xs = 4px
rounded-sm = 6px
rounded-md = 8px (default)
rounded-lg = 12px
rounded-full = 9999px
```

### Shadows

```css
--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
```

**Elevation Guide:**
- **xs/sm:** Subtle hover states, focus rings
- **md:** Cards, popovers
- **lg:** Dropdowns, tooltips
- **xl:** Modals, overlays

### Typography

```css
--font-inter: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
--font-mono: 'Menlo', 'Monaco', monospace;
```

### Animation

```css
--duration-fast: 150ms;      /* Hover, toggles */
--duration-normal: 300ms;    /* Default transitions */
--duration-slow: 500ms;      /* Attention-grabbing */
```

### Focus/Interaction

```css
--focus-outline: 3px solid var(--primary);
--focus-outline-offset: 2px;
```

---

## Tailwind Utility Classes

### Color Utilities

**Status Colors:**
```html
<!-- Success -->
<div class="bg-success text-success-foreground">      <!-- #10b981 text -->
<div class="bg-success-light text-success-dark">      <!-- Light background, dark text -->
<div class="border-success">                          <!-- Green border -->

<!-- Warning -->
<div class="bg-warning text-warning-foreground">
<div class="bg-warning-light text-warning-dark">
<div class="border-warning">

<!-- Danger -->
<div class="bg-danger text-danger-foreground">
<div class="bg-danger-light text-danger-dark">
<div class="border-danger">

<!-- Info -->
<div class="bg-info text-info-foreground">
<div class="bg-info-light text-info-dark">
<div class="border-info">
```

**Neutral Grayscale:**
```html
<div class="text-neutral-500">              <!-- Secondary text -->
<div class="text-neutral-700">              <!-- Primary text -->
<div class="bg-neutral-50">                 <!-- Near-white background -->
<div class="bg-neutral-100">                <!-- Light background -->
<div class="border-neutral-200">            <!-- Light border -->
<div class="border-neutral-300">            <!-- Standard border -->
```

**Base Semantic:**
```html
<div class="bg-background text-foreground">          <!-- Page background -->
<div class="bg-card text-card-foreground">          <!-- Card background -->
<div class="bg-muted text-muted-foreground">        <!-- Disabled state -->
<div class="border-border">                         <!-- Default border -->
```

### Spacing Utilities

```html
<!-- Padding -->
<div class="p-4">                           <!-- 16px all sides -->
<div class="px-6 py-4">                     <!-- 24px H, 16px V -->
<div class="p-4 md:p-6 lg:p-8">             <!-- Responsive -->

<!-- Margin -->
<div class="m-4">                           <!-- 16px all sides -->
<div class="mb-8">                          <!-- 32px bottom margin -->
<div class="mt-6 mb-6">                     <!-- 24px top & bottom -->

<!-- Gap (flex/grid) -->
<div class="flex gap-4">                    <!-- 16px gap -->
<div class="grid gap-6">                    <!-- 24px gap -->
<div class="grid gap-4 md:gap-6 lg:gap-8">  <!-- Responsive gap -->
```

### Border Radius

```html
<div class="rounded-xs">                    <!-- 4px -->
<div class="rounded-sm">                    <!-- 6px -->
<div class="rounded-md">                    <!-- 8px (default) -->
<div class="rounded-lg">                    <!-- 12px (cards) -->
<div class="rounded-full">                  <!-- 9999px (badges) -->
```

### Shadows

```html
<div class="shadow-xs">                     <!-- Subtle -->
<div class="shadow-sm">                     <!-- Raised (default hover) -->
<div class="shadow-md">                     <!-- Floating card -->
<div class="shadow-lg">                     <!-- Dropdown/Modal -->
<div class="shadow-xl">                     <!-- Large overlay -->
```

### Typography

```html
<!-- Font sizes -->
<h1 class="text-4xl">                       <!-- 36px -->
<h2 class="text-3xl">                       <!-- 30px -->
<h3 class="text-2xl">                       <!-- 24px -->
<h4 class="text-xl">                        <!-- 20px -->
<p class="text-base">                       <!-- 16px (default) -->
<small class="text-sm">                     <!-- 14px -->
<span class="text-xs">                      <!-- 12px -->

<!-- Font weights -->
<p class="font-semibold">                   <!-- 600 (body emphasis) -->
<p class="font-bold">                       <!-- 700 (headings) -->

<!-- Tracking (letter spacing) -->
<h1 class="tracking-tight">                 <!-- Tighter headlines -->
<p class="tracking-normal">                 <!-- Default paragraph -->
```

### Transitions & Animations

```html
<!-- Transition -->
<div class="transition-colors duration-normal">     <!-- 300ms color change -->
<div class="transition-all duration-fast">         <!-- 150ms all properties -->
<div class="transition-shadow duration-slow">      <!-- 500ms shadow -->

<!-- Animations -->
<div class="animate-fade-in">                      <!-- Fade in on load -->
<div class="animate-slide-in-from-bottom">        <!-- Slide up entrance -->
```

---

## Component Class Utilities

Quick-grab component classes:

```html
<!-- Badge (status indicator) -->
<span class="badge-success">Completado</span>
<span class="badge-warning">En revisión</span>
<span class="badge-danger">Vencido</span>
<span class="badge-info">En progreso</span>

<!-- KPI Card -->
<div class="kpi-card">
  <p class="kpi-label">Total Compras</p>
  <p class="kpi-value">1,234</p>
  <p class="kpi-delta text-success">↑ +12%</p>
</div>

<!-- Alert Messages -->
<div class="alert-success">
  <h4 class="font-semibold">Éxito</h4>
  <p>Operación completada correctamente.</p>
</div>
<div class="alert-warning">...</div>
<div class="alert-danger">...</div>
<div class="alert-info">...</div>

<!-- Table Elements -->
<th class="table-header">Concepto</th>
<td class="table-cell">Valor</td>
<tr class="table-row-hover">...</tr>

<!-- Form Helpers -->
<button class="btn-reset">Custom button</button>
<div class="skeleton w-12 h-12">Loading...</div>
```

---

## Responsive Breakpoint Utilities

```html
<!-- Mobile-first approach -->
<div class="text-sm md:text-base lg:text-lg">      <!-- Size increases at breakpoints -->

<!-- Visibility -->
<div class="hidden md:block">                      <!-- Show on tablet+ -->
<div class="md:hidden">                            <!-- Hide on tablet+ -->

<!-- Display -->
<div class="grid md:grid-cols-2 lg:grid-cols-3">   <!-- Grid columns -->
<div class="flex flex-col md:flex-row">            <!-- Direction change -->

<!-- Padding/Margin -->
<div class="p-4 md:p-6 lg:p-8">                   <!-- Scale up spacing -->

<!-- Width -->
<div class="w-full md:w-1/2 lg:w-1/3">             <!-- Responsive width -->
```

---

## Color Usage Guide

### Purchase Age (Days)

```html
<!-- < 15 days (on track) -->
<span class="text-success">8 days</span>          <!-- Green -->

<!-- 15-30 days (at risk) -->
<span class="text-warning">23 days</span>         <!-- Amber -->

<!-- > 30 days (overdue) -->
<span class="text-danger">45 days</span>          <!-- Red -->
```

### Budget Usage (%)

```html
<!-- 0-89% (good) -->
<div class="bg-success">83% used</div>             <!-- Green bar -->

<!-- 90-110% (caution) -->
<div class="bg-warning">102% used</div>            <!-- Amber bar -->

<!-- 110%+ (critical) -->
<div class="bg-danger">125% used</div>             <!-- Red bar -->
```

### Stock Level

```html
<!-- Above minimum -->
<span class="badge-success">24 units</span>        <!-- Green badge -->

<!-- Near minimum -->
<span class="badge-warning">5 units</span>         <!-- Amber badge -->

<!-- Below minimum -->
<span class="badge-danger">1 unit</span>           <!-- Red badge -->
```

### Price Anomaly (% variance)

```html
<!-- 0-5% variance (expected) -->
Normal price variation                              <!-- No badge -->

<!-- 5-10% variance (medium risk) -->
<div class="alert-warning">
  Price 8% higher than average
</div>

<!-- 10-15% variance (high risk) -->
<div class="alert-warning">
  Price 12% higher than average
</div>

<!-- >15% variance (critical) -->
<div class="alert-danger">
  Price 22% higher than average - REVIEW NEEDED
</div>
```

---

## Dark Mode Usage

```html
<!-- Automatic color switching -->
<div class="bg-background text-foreground">
  <!-- Adapts to light/dark automatically -->
  Light mode: white bg, dark text
  Dark mode: dark bg, light text
</div>

<!-- Status colors brighten in dark mode -->
<span class="text-success">Text</span>
<!-- Light: #10b981 (green) -->
<!-- Dark: #34d399 (brighter green) -->

<!-- Shadows adjust in dark mode -->
<div class="shadow-md">
<!-- Light: 4px 6px -1px rgba(0,0,0,0.1) -->
<!-- Dark: Same shadow (visible on dark bg) -->
</div>
```

---

## Quick Copy-Paste Templates

### Status Badge
```html
<span class="badge-success">
  <svg class="w-4 h-4" />
  Completado
</span>
```

### KPI Card
```html
<div class="kpi-card">
  <p class="kpi-label">Métrica</p>
  <p class="kpi-value">12,345</p>
  <p class="kpi-delta text-success">↑ +5%</p>
</div>
```

### Alert Box
```html
<div class="alert-success">
  <h4 class="font-semibold">Título</h4>
  <p>Mensaje descriptivo.</p>
</div>
```

### Responsive Grid
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div class="kpi-card">Card 1</div>
  <div class="kpi-card">Card 2</div>
  <div class="kpi-card">Card 3</div>
</div>
```

### Table Row
```html
<tr class="table-row-hover">
  <td class="table-cell">Data</td>
  <td class="table-cell">$1,500</td>
  <td class="table-cell">
    <span class="badge-success">Completado</span>
  </td>
</tr>
```

---

## Accessibility Quick Reference

```html
<!-- Focus visible on all controls -->
<button class="...">
  <!-- Automatically gets 3px blue outline on focus -->
</button>

<!-- Form labels -->
<label htmlFor="email" class="text-sm font-medium">
  Email Address
  <span class="text-danger">*</span>
</label>
<input id="email" type="email" />

<!-- Alert associations -->
<div class="alert-danger" role="alert">
  <h4 class="font-semibold">Error</h4>
  <p id="password-error">Password must be 8+ characters</p>
</div>
<input
  type="password"
  aria-invalid="true"
  aria-describedby="password-error"
/>

<!-- Screen reader only text -->
<span class="sr-only">Status: Pending</span>

<!-- Icon with text label -->
<button>
  <svg class="w-5 h-5" aria-hidden="true" />
  <span>Delete</span>
</button>
```

---

## Performance Considerations

- Use CSS variables instead of hardcoded colors (theme switching)
- Prefer Tailwind utilities over custom CSS (consistency + smaller bundle)
- Batch animations (300ms max duration)
- Avoid layout shifts (define fixed dimensions when possible)
- Use `will-change` sparingly for animated elements

---

## Browser DevTools Tips

**Inspect CSS variables:**
```javascript
// In browser console
getComputedStyle(document.documentElement).getPropertyValue('--color-success')
// Returns: " #10b981" or "34d399" (dark mode)
```

**Test dark mode:**
```javascript
document.documentElement.classList.toggle('dark')
```

**Check contrast ratio:**
Use Chrome DevTools → Elements → Styles → Color picker "Contrast ratio"
