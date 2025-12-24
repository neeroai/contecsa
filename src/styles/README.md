# Design System Documentation

Version: 1.0 | Date: 2025-12-24 | Owner: Neero SAS | Status: Active

This directory contains all design system documentation, tokens, and global styles for Contecsa.

## Files Overview

### 1. `globals.css` (Main Styles)
**Purpose:** Global styles, CSS variables, and component base classes

**Contents:**
- CSS variables for all tokens (colors, spacing, shadows, animations)
- Light mode and dark mode definitions
- High contrast mode support
- Base typography styles
- Component layer utilities (badges, cards, alerts, tables)
- Focus/interaction states
- WCAG compliance setup

**Usage:**
```html
<!-- Automatically imported in layout.tsx -->
```

### 2. `DESIGN_SYSTEM.md` (System Overview)
**Purpose:** Comprehensive design system guide

**Sections:**
- Design principles
- Token architecture
- Color system (semantic, status, neutral, chart)
- Typography scale
- Spacing system
- Responsive breakpoints
- Border radius scale
- Shadows (elevation system)
- Transitions & animations
- Component patterns with examples
- Dark mode implementation
- Accessibility features (WCAG 2.1 AA)
- Browser support
- Testing guidelines

**When to read:** Understanding overall system structure, design decisions, or accessibility requirements

### 3. `COMPONENT_SPECS.md` (UI Components)
**Purpose:** Detailed specifications for each component type

**Components Documented:**
- Purchase Status Badge (4 variants)
- KPI Card (with metrics)
- Purchase Status Timeline (7-stage workflow)
- Price Anomaly Alert (3 risk levels)
- Data Table - Purchase List
- Budget Gauge/Progress Bar
- Notification Toast
- Form Input (6 states)
- Role-Based Dashboard Layout

**Each component includes:**
- Purpose and use cases
- Visual anatomy (ASCII diagrams)
- HTML structure
- CSS specifications
- State variants
- Color schemes
- Responsive behavior
- Accessibility notes

**When to read:** Building UI components, checking specifications, or designing layouts

### 4. `TOKEN_REFERENCE.md` (Quick Reference)
**Purpose:** Developer cheat sheet with all tokens and utilities

**Sections:**
- CSS variables (complete list)
- Tailwind utility classes (with examples)
- Component classes (ready to copy-paste)
- Responsive utilities
- Color usage guidelines
- Dark mode implementation
- Quick copy-paste templates
- Accessibility quick reference

**When to read:** Building components, quick lookups, copying templates

---

## Quick Start

### Using Status Colors

**In HTML:**
```html
<!-- Purchase status badge -->
<span class="badge-success">Completado</span>
<span class="badge-warning">En revisión</span>
<span class="badge-danger">Vencido</span>

<!-- Alert boxes -->
<div class="alert-success">Operación exitosa</div>
<div class="alert-warning">Requiere atención</div>
```

**In CSS/Tailwind:**
```html
<!-- Text colors -->
<p class="text-success">Texto en verde</p>
<p class="text-warning">Texto en ámbar</p>
<p class="text-danger">Texto en rojo</p>

<!-- Background colors -->
<div class="bg-success-light text-success-dark">...</div>
```

### Building Responsive Layouts

```html
<!-- 1 col (mobile) → 2 cols (tablet) → 3 cols (desktop) → 4 cols (wide) -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
  <div class="kpi-card">...</div>
  <div class="kpi-card">...</div>
  <div class="kpi-card">...</div>
</div>
```

### Purchase Age Indicator

```html
<!-- Automatically color-coded based on days -->
<span class="text-success">8 días</span>      <!-- < 15 days (green) -->
<span class="text-warning">23 días</span>     <!-- 15-30 days (amber) -->
<span class="text-danger">45 días</span>      <!-- > 30 days (red) -->
```

### Budget Visualization

```html
<!-- Color-coded progress bar based on consumption % -->
<div class="bg-neutral-200 rounded-full h-2">
  <div class="bg-success h-full rounded-full w-5/6"></div>  <!-- 83% = green -->
</div>
```

---

## Design Token Map

### Colors Available

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `success` | #10b981 | #34d399 | Green status |
| `warning` | #f59e0b | #fbbf24 | Amber status |
| `danger` | #ef4444 | #f87171 | Red status |
| `info` | #3b82f6 | #60a5fa | Blue info |
| `neutral-50` to `900` | Grayscale scale | Inverted | UI elements |
| `chart-1` to `6` | 6 distinct colors | Adjusted | Data viz |

### Spacing Values

```
1 = 4px    4 = 16px   12 = 48px
2 = 8px    5 = 20px   16 = 64px
3 = 12px   6 = 24px   20 = 80px
```

### Responsive Breakpoints

```
sm:  375px   (mobile)
md:  768px   (tablet)
lg:  1024px  (desktop)
xl:  1440px  (wide screens)
```

---

## Component Layer Classes

All components use predefined classes. No hardcoded styles needed:

```html
<!-- Badges -->
<span class="badge-success">✓ Completado</span>
<span class="badge-warning">⚠ En revisión</span>
<span class="badge-danger">✗ Rechazado</span>
<span class="badge-info">ℹ En progreso</span>

<!-- Cards -->
<div class="kpi-card">
  <p class="kpi-label">Etiqueta</p>
  <p class="kpi-value">1,234</p>
  <p class="kpi-delta text-success">↑ +12%</p>
</div>

<!-- Alerts -->
<div class="alert-success">Mensaje de éxito</div>
<div class="alert-warning">Advertencia</div>
<div class="alert-danger">Error crítico</div>
<div class="alert-info">Información</div>

<!-- Tables -->
<th class="table-header">Encabezado</th>
<tr class="table-row-hover">
  <td class="table-cell">Datos</td>
</tr>

<!-- Utilities -->
<button class="btn-reset">Custom button</button>
<div class="skeleton w-12 h-12">Loading...</div>
```

---

## Accessibility Built-In

### Focus States
```html
<!-- All interactive elements get automatic focus outline -->
<button>Click me</button>
<!-- Focus: 3px solid blue outline with 2px offset -->
```

### Color Contrast
- All color pairs meet WCAG AA (4.5:1 minimum)
- Tested with WebAIM Contrast Checker
- High contrast mode support included

### High Contrast Mode
```css
/* Automatically activates for users with prefers-contrast: more */
@media (prefers-contrast: more) {
  --color-success: #008000;   /* Pure green */
  --color-warning: #ff8c00;   /* Pure orange */
  --color-danger: #ff0000;    /* Pure red */
}
```

### Screen Reader Support
```html
<!-- Icons require text labels -->
<button>
  <svg aria-hidden="true" />  <!-- Hidden from screen readers -->
  <span>Delete</span>         <!-- Text read aloud -->
</button>

<!-- Form errors -->
<input aria-invalid="true" aria-describedby="error-msg" />
<div id="error-msg">Password required</div>
```

---

## Dark Mode

Automatically included via CSS variables:

```html
<!-- Add .dark class to <html> element -->
<html class="dark">
  ...
</html>
```

Or with next-themes:
```typescript
import { ThemeProvider } from 'next-themes'

export function RootLayout() {
  return (
    <ThemeProvider attribute="class">
      {children}
    </ThemeProvider>
  )
}
```

**What happens:**
- Background colors invert automatically
- Text colors adjust for readability
- Status colors brighten for contrast
- Shadows remain visible

---

## Customization

### Adding a New Status Color

**1. Define CSS variables in `globals.css`:**
```css
:root {
  --color-custom: #abc123;
  --color-custom-light: #def456;
  --color-custom-dark: #012789;
  --color-custom-fg: #ffffff;
}

.dark {
  --color-custom: #xyz789;
  /* etc */
}
```

**2. Add Tailwind utilities in `tailwind.config.ts`:**
```typescript
custom: {
  DEFAULT: 'var(--color-custom)',
  light: 'var(--color-custom-light)',
  dark: 'var(--color-custom-dark)',
  foreground: 'var(--color-custom-fg)',
}
```

**3. Create component class in `globals.css`:**
```css
@layer components {
  .badge-custom {
    @apply inline-flex items-center gap-1 px-3 py-1 rounded-full
           bg-custom-light text-custom-dark text-xs font-medium;
  }
}
```

### Creating New Component Class

```css
/* In globals.css @layer components */
.card-elevated {
  @apply rounded-lg border border-border bg-card p-6
         shadow-md transition-shadow duration-normal
         hover:shadow-lg;
}
```

---

## Testing the Design System

### Visual Regression Testing
1. Screenshot components at 4 breakpoints (sm, md, lg, xl)
2. Compare light vs dark mode
3. Enable high contrast mode in OS settings

### Accessibility Testing
1. Navigate with Tab key only (no mouse)
2. Use screen reader (VoiceOver on Mac, NVDA on Windows)
3. Check color contrast with [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
4. Verify focus visible on all controls

### Performance
- CSS variables use minimal overhead
- Tailwind utilities are optimized
- Animations limited to 300ms max
- No layout shifts on interaction

---

## File Structure

```
src/
├── styles/
│   ├── globals.css                 # Global styles, CSS variables
│   ├── DESIGN_SYSTEM.md            # Complete system guide
│   ├── COMPONENT_SPECS.md          # Component specifications
│   ├── TOKEN_REFERENCE.md          # Developer cheat sheet
│   └── README.md                   # This file
├── components/
│   └── ui/                         # shadcn/ui components
├── app/
│   ├── layout.tsx                  # Imports globals.css
│   └── page.tsx                    # Uses design tokens
└── lib/
    └── ...
```

---

## Common Patterns

### Status-Driven Badge
```html
<span class="badge-success">Completado</span>
<span class="badge-warning">En revisión</span>
<span class="badge-danger">Rechazado</span>
<span class="badge-info">En progreso</span>
```

### KPI Card Grid
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div class="kpi-card">
    <p class="kpi-label">Métrica 1</p>
    <p class="kpi-value">1,234</p>
    <p class="kpi-delta text-success">↑ +5%</p>
  </div>
  <!-- More cards... -->
</div>
```

### Alert with Icon
```html
<div class="alert-warning rounded-lg border-2 border-warning p-4">
  <div class="flex gap-3">
    <AlertIcon class="w-5 h-5 flex-shrink-0" />
    <div>
      <h4 class="font-semibold">Atención</h4>
      <p class="text-sm">Descripción del problema.</p>
    </div>
  </div>
</div>
```

### Responsive Table
```html
<div class="overflow-x-auto">
  <table class="w-full">
    <thead>
      <tr>
        <th class="table-header">Concepto</th>
        <th class="table-header">Monto</th>
        <th class="table-header">Estado</th>
      </tr>
    </thead>
    <tbody>
      <tr class="table-row-hover">
        <td class="table-cell">Item</td>
        <td class="table-cell">$1,500</td>
        <td class="table-cell">
          <span class="badge-success">Completado</span>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## Useful Links

- **Design System:** `/src/styles/DESIGN_SYSTEM.md`
- **Component Specs:** `/src/styles/COMPONENT_SPECS.md`
- **Token Reference:** `/src/styles/TOKEN_REFERENCE.md`
- **Tailwind Config:** `/tailwind.config.ts`
- **Globals CSS:** `/src/styles/globals.css`

---

## Questions?

Refer to:
1. **TOKEN_REFERENCE.md** - For quick lookups and copy-paste code
2. **COMPONENT_SPECS.md** - For component structure and variants
3. **DESIGN_SYSTEM.md** - For system principles and detailed explanations

Or check source files directly:
- `/tailwind.config.ts` - Tailwind configuration
- `/src/styles/globals.css` - CSS variables and component classes
