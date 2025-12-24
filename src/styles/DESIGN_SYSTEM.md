# Contecsa Design System

Version: 1.0 | Date: 2025-12-24 | Owner: Neero SAS | Status: Active

## Overview

Comprehensive design system for Contecsa's data intelligence platform. Built with Tailwind CSS 4, leveraging CSS variables for theming, semantic color tokens for purchase tracking, and accessibility-first component patterns.

## Design Principles

1. **Status-Driven UI** - Color communicates state at a glance (green/yellow/red)
2. **Accessibility First** - WCAG 2.1 AA compliant with high contrast support
3. **Responsive by Default** - Mobile-first approach across 4 breakpoints
4. **Data Clarity** - Clear hierarchies for dashboard information
5. **Consistency** - Token-based architecture ensures visual coherence

## Architecture

### Token Hierarchy

```
Colors
├── Semantic (HSL variables)
│   ├── Background/Foreground
│   ├── Primary/Secondary
│   └── Border/Input/Ring
├── Status (Named colors)
│   ├── Success (Green)
│   ├── Warning (Amber)
│   ├── Danger (Red)
│   └── Info (Blue)
├── Neutral (Grayscale)
├── Charts (6 colors for data viz)
└── Theme (Light/Dark modes)
```

## Color System

### Semantic Status Colors

Purchase/data intelligence uses a three-tier status system:

| Status | Color | Use Cases | Hex |
|--------|-------|-----------|-----|
| **Success** | Green | Purchase <15 days, Budget <90%, Stock >min | #10b981 |
| **Warning** | Amber | Purchase 16-30 days, Budget 90-110%, Price anomaly 5-10% | #f59e0b |
| **Danger** | Red | Purchase >30 days, Budget >110%, Price anomaly >15% | #ef4444 |
| **Info** | Blue | In-progress, informational alerts | #3b82f6 |

### Color Variants

Each status color provides:
- **Base**: Primary color for text/icons
- **Light**: Background color (low contrast)
- **Dark**: Deep variant (high contrast backgrounds)
- **Foreground**: Text color for maximum contrast

**Example - Success:**
```css
--color-success: #10b981;         /* Base */
--color-success-light: #d1fae5;   /* Background */
--color-success-dark: #047857;    /* Deep variant */
--color-success-fg: #ffffff;      /* Text */
```

### Neutral Grayscale

10-step grayscale for UI elements (50-900):
- **50-100**: Backgrounds, light surfaces
- **200-300**: Borders, dividers
- **400-500**: Secondary text
- **600-700**: Primary text
- **800-900**: Dark backgrounds

### Chart Colors

Six distinct colors for data visualization:
```
--chart-1: #3b82f6;  /* Blue */
--chart-2: #10b981;  /* Green */
--chart-3: #f59e0b;  /* Amber */
--chart-4: #ef4444;  /* Red */
--chart-5: #8b5cf6;  /* Purple */
--chart-6: #ec4899;  /* Pink */
```

## Typography

### Font System

**Primary:** Inter (system fallback to -apple-system, Segoe UI)
**Monospace:** Menlo (Monaco, system monospace)

### Scale

| Level | Size | Line Height | Use Case |
|-------|------|-------------|----------|
| **4xl** | 2.25rem (36px) | 2.5rem | Page titles, hero |
| **3xl** | 1.875rem (30px) | 2.25rem | Section headers |
| **2xl** | 1.5rem (24px) | 2rem | Subsection headers |
| **xl** | 1.25rem (20px) | 1.75rem | Card titles |
| **lg** | 1.125rem (18px) | 1.75rem | Emphasis text |
| **base** | 1rem (16px) | 1.5rem | Body text (default) |
| **sm** | 0.875rem (14px) | 1.25rem | Secondary text, labels |
| **xs** | 0.75rem (12px) | 1rem | Captions, help text |

### Letter Spacing

- **xs/sm**: +0.008-0.01em (small text legibility)
- **base/lg**: 0 (normal readability)
- **xl-4xl**: -0.01 to -0.02em (tighter headlines)

## Spacing System

All spacing derived from 4px base unit:

| Token | Value | px | Usage |
|-------|-------|-----|-------|
| **xs** | var(--spacing-xs) | 4px | Micro spacing (between icon+text) |
| **sm** | var(--spacing-sm) | 8px | Small gaps |
| **md** | var(--spacing-md) | 16px | Default spacing |
| **lg** | var(--spacing-lg) | 24px | Section spacing |
| **xl** | var(--spacing-xl) | 32px | Large sections |
| **2xl** | var(--spacing-2xl) | 48px | Major layout blocks |

**Tailwind scale:** 1→32px (each unit = spacing increment)

## Breakpoints

Mobile-first responsive design:

| Name | Width | Device | Use |
|------|-------|--------|-----|
| **sm** | 375px | Mobile | iPhone SE, small phones |
| **md** | 768px | Tablet | iPad, landscape phones |
| **lg** | 1024px | Desktop | Standard monitors |
| **xl** | 1440px | Wide | Large monitors, 4K |

**Usage:**
```html
<!-- Mobile by default, tablet adjustments -->
<div class="p-4 md:p-6 lg:p-8 xl:p-10">
  Grid: md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
</div>
```

## Border Radius

Consistent corner rounding:

| Token | Value | Use |
|-------|-------|-----|
| **xs** | 4px | Small buttons, tiny components |
| **sm** | 6px | Input fields |
| **md** | 8px | Cards, modals (default) |
| **lg** | 12px | Large cards, dialog boxes |
| **full** | 9999px | Badges, circular buttons |

## Shadows

Elevation system with 5 levels:

| Token | Value | Elevation |
|-------|-------|-----------|
| **xs** | 0 1px 2px 0 rgba(0,0,0,0.05) | Subtle |
| **sm** | 0 1px 3px 0 rgba(0,0,0,0.1) | Raised |
| **md** | 0 4px 6px -1px rgba(0,0,0,0.1) | Floating |
| **lg** | 0 10px 15px -3px rgba(0,0,0,0.1) | Modal |
| **xl** | 0 20px 25px -5px rgba(0,0,0,0.1) | Dropdown |

## Transitions & Animations

**Durations:**
```css
--duration-fast: 150ms;    /* Hover states, toggles */
--duration-normal: 300ms;  /* Default transitions */
--duration-slow: 500ms;    /* Attention-grabbing */
```

**Built-in animations:**
- `fade-in` / `fade-out` - Opacity changes
- `slide-in-from-top` / `slide-in-from-bottom` - Entrance animations
- `accordion-down` / `accordion-up` - Accordion expand/collapse

## Component Patterns

### Status Badges

**HTML:**
```html
<!-- Success badge -->
<span class="badge-success">
  <CheckIcon class="w-4 h-4" />
  Completado
</span>

<!-- Warning badge -->
<span class="badge-warning">
  <AlertIcon class="w-4 h-4" />
  En revisión
</span>
```

**Styling:** Badge classes handle color, size, and layout. Add icons as children.

### KPI Cards

**Structure:**
```html
<div class="kpi-card">
  <p class="kpi-label">Total Compras</p>
  <p class="kpi-value">1,234</p>
  <p class="kpi-delta text-success">+12% vs mes anterior</p>
</div>
```

**Features:**
- Subtle shadow + border
- Hover elevation (transition)
- Responsive padding (p-6)
- Four-part hierarchy (label, value, delta, trend)

### Alert Messages

**Success Alert:**
```html
<div class="alert-success">
  <h4 class="font-semibold">Éxito</h4>
  <p>Compra registrada correctamente.</p>
</div>
```

**Warning Alert:**
```html
<div class="alert-warning">
  <h4 class="font-semibold">Atención</h4>
  <p>Esta compra excede el presupuesto asignado.</p>
</div>
```

All alerts include colored border + background + text. Icons optional.

### Tables

**Markup:**
```html
<table>
  <thead>
    <tr>
      <th class="table-header">Concepto</th>
      <th class="table-header">Monto</th>
      <th class="table-header">Estado</th>
    </tr>
  </thead>
  <tbody>
    <tr class="table-row-hover">
      <td class="table-cell">Compra #001</td>
      <td class="table-cell">$1,500</td>
      <td class="table-cell">
        <span class="badge-success">Completado</span>
      </td>
    </tr>
  </tbody>
</table>
```

**Features:**
- Header: Muted background, uppercase labels
- Cells: Standard padding + border-bottom
- Hover: Subtle background shift
- Status: Badge integration

## Dark Mode

All colors adapt automatically via CSS variables:

```css
/* Light mode (default) */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --color-success: #10b981;
}

/* Dark mode */
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --color-success: #34d399; /* Brighter for contrast */
}
```

**Activation:**
```html
<!-- Add .dark class to <html> element -->
<html class="dark">
```

## Accessibility Features

### High Contrast Mode

Automatic enhancement for users with `prefers-contrast: more`:
```css
@media (prefers-contrast: more) {
  --color-success: #008000;   /* Pure green */
  --color-warning: #ff8c00;   /* Pure orange */
  --color-danger: #ff0000;    /* Pure red */
  --color-info: #0000ff;      /* Pure blue */
}
```

### Focus Visible

All interactive elements receive visible focus outline:
```css
*:focus-visible {
  outline: 3px solid var(--primary);
  outline-offset: 2px;
}
```

### WCAG Compliance

- **Color Contrast:**
  - Text on colored backgrounds: ≥4.5:1 (AA standard)
  - Large text: ≥3:1
  - UI components: ≥3:1

- **Typography:**
  - Base font size: 16px
  - Line height: 1.5 (readable)
  - Max content width: ~75ch

- **Keyboard Navigation:**
  - All controls focusable via Tab
  - Custom focus indicators
  - No focus traps

## Usage Examples

### Button with Status Color

```typescript
// TypeScript component
interface PurchaseStatusButtonProps {
  status: 'success' | 'warning' | 'danger' | 'info';
  label: string;
}

export function PurchaseStatusButton({
  status,
  label,
}: PurchaseStatusButtonProps) {
  const colors = {
    success: 'bg-success text-success-foreground',
    warning: 'bg-warning text-warning-foreground',
    danger: 'bg-danger text-danger-foreground',
    info: 'bg-info text-info-foreground',
  };

  return (
    <button className={`px-4 py-2 rounded-md font-medium ${colors[status]}`}>
      {label}
    </button>
  );
}
```

### Responsive Grid

```html
<!-- Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols, Wide: 4 cols -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  <div class="kpi-card">...</div>
  <div class="kpi-card">...</div>
  <div class="kpi-card">...</div>
</div>
```

### Status-Based Styling

```html
<!-- Dynamic status class based on purchase age -->
<div class="kpi-card" data-status="warning">
  <p class="kpi-label">Antiguedad Compra</p>
  <p class="kpi-value">22 días</p>
  <p class="kpi-delta text-warning">Vence en 8 días</p>
</div>
```

## Extending the Design System

### Adding New Colors

**In globals.css:**
```css
:root {
  --color-custom: #abc123;
  --color-custom-light: #def456;
  --color-custom-dark: #012789;
  --color-custom-fg: #ffffff;
}
```

**In tailwind.config.ts:**
```typescript
custom: {
  DEFAULT: 'var(--color-custom)',
  light: 'var(--color-custom-light)',
  dark: 'var(--color-custom-dark)',
  foreground: 'var(--color-custom-fg)',
}
```

### Creating Component Variants

```css
/* In globals.css @layer components */
.btn-primary {
  @apply px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium transition-colors duration-normal hover:bg-primary/90;
}

.btn-outline {
  @apply px-4 py-2 rounded-md border-2 border-primary text-primary transition-colors duration-normal hover:bg-primary/10;
}
```

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- iOS Safari: Latest 2 versions

## Testing Design System

### Color Contrast
Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### Responsive
Test at breakpoints: 375px, 768px, 1024px, 1440px

### Accessibility
- Navigate with keyboard only (no mouse)
- Use screen reader (VoiceOver, NVDA)
- Enable High Contrast mode in OS settings

## References

- [Tailwind CSS 4 Docs](https://tailwindcss.com/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Color Contrast Accessibility](https://www.a11y-101.com/design/color-contrast)
- [CSS Variables Best Practices](https://www.smashingmagazine.com/2018/05/css-custom-properties-strategy-guide/)
