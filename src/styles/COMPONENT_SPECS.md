# Component Design Specifications

Version: 1.0 | Date: 2025-12-24 | Owner: Neero SAS | Status: Active

## Purchase Status Badge

**Purpose:** Quick visual indicator of purchase stage/health

**States:**
- Success (green): Completed or healthy
- Warning (amber): At risk or near deadline
- Danger (red): Critical or overdue
- Info (blue): In progress or informational

**Anatomy:**
```
[icon] Label
```

**Specification:**
```
Height: 24px
Padding: 6px 12px (horizontal) / 4px (vertical)
Border Radius: full (9999px)
Font: 12px (xs), medium weight
Gap between icon and text: 4px
Icon size: 16x16px
```

**HTML:**
```html
<span class="badge-success">
  <svg class="w-4 h-4" />
  Completado
</span>
```

**Variants:**

| Variant | Background | Text | Border | Icon Color |
|---------|-----------|------|--------|-----------|
| Success | #d1fae5 | #047857 | None | #047857 |
| Warning | #fef3c7 | #d97706 | None | #d97706 |
| Danger | #fee2e2 | #dc2626 | None | #dc2626 |
| Info | #dbeafe | #1d4ed8 | None | #1d4ed8 |

**Accessibility:**
- Icon required (don't rely on color alone)
- Alternative text for screen readers: `aria-label="Estado: Completado"`

---

## KPI Card

**Purpose:** Display key metric with trend

**Anatomy:**
```
┌─────────────────────────────┐
│ Label (12px gray)           │
│ 1,234.56 (36px bold)        │
│ ↑ +12% vs mes anterior (sm) │
└─────────────────────────────┘
```

**Specification:**
```
Width: Variable (grid item)
Min-height: 120px
Padding: 24px (md)
Border: 1px solid #e5e7eb
Border Radius: 12px (lg)
Background: white
Shadow: 0 1px 3px rgba(0,0,0,0.1)
Transition: shadow 300ms on hover
```

**HTML:**
```html
<div class="kpi-card">
  <p class="kpi-label">Total Compras</p>
  <p class="kpi-value">1,234</p>
  <p class="kpi-delta text-success">↑ +12% vs mes anterior</p>
</div>
```

**Color Variants:**

| Delta | Text Color | Usage |
|-------|-----------|-------|
| Positive | #10b981 (success) | Increase is good |
| Negative | #ef4444 (danger) | Decrease is good |
| Neutral | #6b7280 (gray-500) | No change |

**Responsive:**
- Mobile (sm): 100% width, single column
- Tablet (md): 2 columns, gap 16px
- Desktop (lg): 3 columns, gap 24px
- Wide (xl): 4 columns, gap 24px

---

## Purchase Status Timeline

**Purpose:** Show purchase lifecycle progress (7 stages)

**Stages:**
1. Requisición (Requisition)
2. Aprobación (Approval)
3. Orden (Order)
4. Confirmación (Confirmation)
5. Recepción (Receipt)
6. Certificados (Certificates)
7. Pago (Payment)

**Anatomy:**
```
Requisición    Aprobación    Orden    Confirmación    Recepción    Certificados    Pago
     ✓              ✓          ✓             ✓              →             ○            ○
     │──────────────│──────────│─────────────│──────────────│──────────────│──────────│
     Completado    Completado  Completado   Completado     En Progreso    Pendiente  Pendiente
```

**States per stage:**
- ✓ **Complete** (green): #10b981
- → **In Progress** (blue): #3b82f6
- ○ **Pending** (gray): #d1d5db
- ✗ **Failed** (red): #ef4444

**Specification:**
```
Height: 64px (compact) or 100px (detailed)
Stage width: Flexible (equal or proportional)
Circle diameter: 32px
Line thickness: 2px
Font: 12px, medium weight (labels)
Font: 10px, regular (status text)
Gap between stage and label: 8px
```

**Mobile Responsive:**
- sm: Vertical timeline (stack stages)
- md+: Horizontal timeline (stages in row)
- Collapse labels on very small screens

---

## Price Anomaly Alert

**Purpose:** Flag purchases with unusual pricing

**Variant Types:**
- Medium Risk: 5-10% variance
- High Risk: 10-15% variance
- Critical: >15% variance

**Anatomy:**
```
┌─────────────────────────────────────────┐
│ ⚠ Variación de Precio Detectada         │
│ Precio actual $1,500 vs promedio $1,350 │
│ Diferencia: +11% (HIGH RISK)            │
└─────────────────────────────────────────┘
```

**Specification:**
```
Border: 2px solid (color-based)
Border Radius: 8px (md)
Padding: 16px (md)
Icon size: 20x20px (left)
Title: 16px, bold
Message: 14px, regular
Gap between icon and title: 12px
Gap between title and message: 8px
```

**Color Schemes:**

| Risk Level | Border | Background | Text | Icon |
|-----------|--------|-----------|------|------|
| Medium | #f59e0b | #fef3c7 | #d97706 | #d97706 |
| High | #f59e0b | #fef3c7 | #d97706 | #d97706 |
| Critical | #ef4444 | #fee2e2 | #dc2626 | #dc2626 |

**Actions:**
- Dismiss button (X, top-right)
- Optional "Review" button for details

---

## Data Table - Purchase List

**Purpose:** Tabular display of purchases with status

**Columns (minimum):**
- Compra # (Purchase ID)
- Proveedor (Supplier)
- Concepto (Item)
- Monto (Amount)
- Estado (Status)
- Antigüedad (Age in days)
- Acción (Action)

**Specification:**
```
Header height: 44px
Row height: 48px
Header padding: 12px 16px
Cell padding: 16px
Font: 14px regular (cells), 12px bold (header)
Header background: #f3f4f6 (neutral-100)
Header text color: #6b7280 (neutral-500, uppercase)
Borders: 1px solid #e5e7eb (bottom only)
```

**Row Styles:**
```
Default background: white
Hover background: #f9fafb (neutral-50)
Transition: background-color 150ms
```

**Status Column Values:**
- Badge component (see Purchase Status Badge)
- Colors: success/warning/danger/info based on age or completion

**Age Column Highlighting:**
- < 15 days: text-success (#10b981)
- 15-30 days: text-warning (#f59e0b)
- > 30 days: text-danger (#ef4444)

**Responsive Behavior:**
- **sm:** Stacked card layout (one purchase per "card")
- **md:** Horizontal scroll with sticky first column
- **lg+:** Full table

**Sticky Header:**
```css
thead {
  position: sticky;
  top: 0;
  z-index: 10;
  background: white;
}
```

---

## Budget Gauge / Progress Bar

**Purpose:** Visual representation of budget consumption

**Types:**
1. **Simple bar:** Percentage-based progress
2. **Gauge:** Circular progress (alternative)

**Specification (Bar):**
```
Height: 8px
Border Radius: full (4px)
Background: #e5e7eb (neutral-200)
Track fill: Dynamic (based on %)
Padding: 0
Width: 100% of container
```

**Fill Colors by Budget %:**
| % Used | Color | Hex |
|--------|-------|-----|
| 0-89% | Green | #10b981 |
| 90-110% | Amber | #f59e0b |
| 110%+ | Red | #ef4444 |

**Label Positioning:**
```
Above bar:  "Presupuesto" (label)
Below bar:  "$12,450 / $15,000 (83%)"
            [████████░░] → "Budget Health: Good"
```

**Animation:**
- Fill animates on load: 600ms ease-out
- Smooth transitions when updating

---

## Notification Toast

**Purpose:** Alert user to important events (background messages)

**Types:**
- Success: Action completed
- Warning: Caution required
- Danger: Error or problem
- Info: Informational message

**Anatomy:**
```
[icon] Title                    [X]
       Secondary message
```

**Specification:**
```
Width: 320px (fixed) or 90vw (mobile)
Min-height: 60px
Padding: 16px (md)
Border Radius: 8px (md)
Border-left: 4px solid (status color)
Shadow: shadow-lg (elevation)
Position: Bottom-right (or bottom-center on mobile)
Z-index: 9999
```

**Spacing:**
- Icon to title: 12px
- Title to message: 4px
- Close button: 12px from right edge
- Between toasts: 8px gap (stacked)

**Auto-dismiss:**
- Success/Info: 4 seconds
- Warning: 6 seconds
- Danger: 8 seconds (or manual)

**Animations:**
- Entrance: slide-in-from-bottom 300ms
- Exit: fade-out 300ms

---

## Form Input

**Purpose:** Purchase data entry fields

**States:**
- Default: Idle state
- Focused: Active with border highlight
- Filled: Contains value
- Disabled: Non-interactive
- Error: Validation failed
- Success: Validation passed

**Specification:**
```
Height: 40px
Padding: 0 12px (horizontal), 8px (vertical)
Border: 1px solid #e5e7eb (default)
Border Radius: 6px (sm)
Font: 14px (base)
Background: white
```

**State Styles:**

| State | Border | Ring | Background | Text Color |
|-------|--------|------|-----------|-----------|
| Default | #e5e7eb | None | white | #374151 |
| Focused | #221.2 83.2% | 3px hsl(var(--primary)) | white | #374151 |
| Filled | #d1d5db | None | white | #111827 |
| Disabled | #e5e7eb | None | #f3f4f6 | #9ca3af |
| Error | #ef4444 | 3px #ef4444/30% | white | #dc2626 |
| Success | #10b981 | 3px #10b981/30% | white | #047857 |

**Label:**
```
Font: 14px, medium
Color: #374151 (neutral-700)
Margin-bottom: 4px
Required indicator: * (red)
```

**Validation Message:**
```
Font: 12px, regular
Color: status-color (error/success)
Margin-top: 4px
```

---

## Role-Based Dashboard Layout

**Purpose:** Different layouts for 5 user roles

**Roles:**
1. **Gerencia (Management):** Executive KPIs
2. **Compras (Purchasing):** Transactions focus
3. **Contabilidad (Accounting):** Financial view
4. **Técnico (Technical):** Resource consumption
5. **Almacén (Warehouse):** Inventory focus

**Common Structure:**
```
Header (Navigation, User Menu)
Sidebar (Role-based menu)
Main Content
├── Dashboard Grid
├── Tables/Lists
└── Details Panel
```

**Responsive Sidebar:**
- lg+: Persistent left sidebar (240px width)
- md: Collapsible on toggle
- sm: Hidden, menu icon (hamburger)

**Grid Layout:**
- **sm:** 1 column (full width)
- **md:** 2 columns
- **lg:** 3 columns (default)
- **xl:** 4 columns

**Navigation Active State:**
```
Active link:
  Background: rgba(primary, 0.1)
  Border-left: 4px solid primary
  Color: primary
  Font-weight: semibold
```

---

## Dark Mode Adaptations

All components automatically adjust for dark mode via CSS variables.

**Example: KPI Card in Dark Mode**
```css
.dark .kpi-card {
  --background: 222.2 84% 4.9%;  /* Dark background */
  --foreground: 210 40% 98%;      /* Light text */
  border-color: var(--neutral-700); /* Lighter border */
  box-shadow: var(--shadow-sm);    /* Adjusted shadow */
}
```

**Status Colors Brighten:**
- Success: #10b981 → #34d399
- Warning: #f59e0b → #fbbf24
- Danger: #ef4444 → #f87171
- Info: #3b82f6 → #60a5fa

---

## Testing Specifications

### Visual Regression
- Screenshot each component at: sm, md, lg, xl breakpoints
- Compare light mode vs dark mode
- Test with high contrast mode enabled

### Interaction
- Tab navigation (all elements focusable)
- Click/tap interactions (buttons, links)
- Keyboard shortcuts (Escape to close, Enter to confirm)
- Touch-friendly sizes (min 44px tap target)

### Accessibility
- Color contrast ≥4.5:1 (AA)
- Focus visible on all controls
- Screen reader labels (`aria-label`, `aria-describedby`)
- Error messages associated with fields (`aria-invalid="true"`)

### Performance
- No layout shift on interaction
- CSS animations <300ms
- Smooth 60fps transitions

---

## Component Implementation Checklist

**Before marking component complete:**
- [ ] All states documented (default, hover, focus, disabled, etc.)
- [ ] Color tokens used (no hardcoded hex values)
- [ ] Responsive behavior tested (4 breakpoints)
- [ ] Dark mode verified
- [ ] Accessibility validated (keyboard, screen reader, contrast)
- [ ] TypeScript types defined
- [ ] Storybook story created (optional)
- [ ] Unit tests written (optional)
