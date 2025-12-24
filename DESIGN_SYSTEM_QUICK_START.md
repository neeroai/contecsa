# Design System Quick Start Guide

Version: 1.0 | Date: 2025-12-24

Jump straight into using the design system with these copy-paste examples.

---

## Status Badges (Purchase Tracking)

```html
<!-- Success - Green (completed, on track) -->
<span class="badge-success">
  <CheckCircleIcon class="w-4 h-4" />
  Completado
</span>

<!-- Warning - Amber (at risk, needs attention) -->
<span class="badge-warning">
  <AlertCircleIcon class="w-4 h-4" />
  En revisión
</span>

<!-- Danger - Red (critical, overdue) -->
<span class="badge-danger">
  <XCircleIcon class="w-4 h-4" />
  Rechazado
</span>

<!-- Info - Blue (in progress) -->
<span class="badge-info">
  <InfoIcon class="w-4 h-4" />
  En progreso
</span>
```

---

## KPI Cards

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- Total Purchases -->
  <div class="kpi-card">
    <p class="kpi-label">Total Compras</p>
    <p class="kpi-value">245</p>
    <p class="kpi-delta text-success">↑ +12% vs mes anterior</p>
  </div>

  <!-- Budget Used -->
  <div class="kpi-card">
    <p class="kpi-label">Presupuesto Utilizado</p>
    <p class="kpi-value">$124,500</p>
    <p class="kpi-delta text-warning">83% del total</p>
  </div>

  <!-- Average Purchase Age -->
  <div class="kpi-card">
    <p class="kpi-label">Antigüedad Promedio</p>
    <p class="kpi-value">18 días</p>
    <p class="kpi-delta text-info">En rango normal</p>
  </div>
</div>
```

---

## Purchase Age Indicators

```html
<!-- Color-coded by days old -->
<p>
  Compra #001: <span class="text-success font-semibold">8 días</span>
  <span class="text-xs text-neutral-500">✓ En tiempo</span>
</p>

<p>
  Compra #002: <span class="text-warning font-semibold">23 días</span>
  <span class="text-xs text-neutral-500">⚠ Por vencer</span>
</p>

<p>
  Compra #003: <span class="text-danger font-semibold">45 días</span>
  <span class="text-xs text-neutral-500">✗ Vencida</span>
</p>
```

---

## Alert Messages

```html
<!-- Success Alert -->
<div class="alert-success rounded-lg border-l-4">
  <div class="flex gap-3">
    <CheckCircleIcon class="w-5 h-5 flex-shrink-0" />
    <div>
      <h4 class="font-semibold">Compra Registrada</h4>
      <p class="text-sm">Compra #001 agregada correctamente al sistema.</p>
    </div>
  </div>
</div>

<!-- Warning Alert -->
<div class="alert-warning rounded-lg border-l-4">
  <div class="flex gap-3">
    <AlertCircleIcon class="w-5 h-5 flex-shrink-0" />
    <div>
      <h4 class="font-semibold">Presupuesto Bajo</h4>
      <p class="text-sm">Esta compra excede el presupuesto asignado por $5,000.</p>
    </div>
  </div>
</div>

<!-- Danger Alert -->
<div class="alert-danger rounded-lg border-l-4">
  <div class="flex gap-3">
    <XCircleIcon class="w-5 h-5 flex-shrink-0" />
    <div>
      <h4 class="font-semibold">Compra Vencida</h4>
      <p class="text-sm">Compra #045 está vencida por 15 días. Requiere atención inmediata.</p>
    </div>
  </div>
</div>
```

---

## Data Tables

```html
<div class="overflow-x-auto">
  <table class="w-full">
    <thead>
      <tr>
        <th class="table-header">ID Compra</th>
        <th class="table-header">Proveedor</th>
        <th class="table-header">Monto</th>
        <th class="table-header">Antigüedad</th>
        <th class="table-header">Estado</th>
      </tr>
    </thead>
    <tbody>
      <tr class="table-row-hover">
        <td class="table-cell">#001</td>
        <td class="table-cell">Proveedor A</td>
        <td class="table-cell">$2,500</td>
        <td class="table-cell">
          <span class="text-success">8 días</span>
        </td>
        <td class="table-cell">
          <span class="badge-success">
            <CheckIcon class="w-3 h-3 inline" />
            Completado
          </span>
        </td>
      </tr>

      <tr class="table-row-hover">
        <td class="table-cell">#002</td>
        <td class="table-cell">Proveedor B</td>
        <td class="table-cell">$5,000</td>
        <td class="table-cell">
          <span class="text-warning">23 días</span>
        </td>
        <td class="table-cell">
          <span class="badge-warning">
            <AlertIcon class="w-3 h-3 inline" />
            Pendiente
          </span>
        </td>
      </tr>

      <tr class="table-row-hover">
        <td class="table-cell">#003</td>
        <td class="table-cell">Proveedor C</td>
        <td class="table-cell">$1,200</td>
        <td class="table-cell">
          <span class="text-danger">45 días</span>
        </td>
        <td class="table-cell">
          <span class="badge-danger">
            <XIcon class="w-3 h-3 inline" />
            Vencido
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## Budget Progress Bar

```html
<!-- Good - Under 90% -->
<div class="mb-4">
  <div class="flex justify-between mb-1">
    <label class="text-sm font-medium">Presupuesto Usado</label>
    <span class="text-sm font-semibold text-success">83%</span>
  </div>
  <div class="w-full bg-neutral-200 rounded-full h-2">
    <div class="bg-success h-full rounded-full transition-all" style="width: 83%"></div>
  </div>
  <p class="text-xs text-neutral-500 mt-1">$12,450 de $15,000</p>
</div>

<!-- Warning - 90-110% -->
<div class="mb-4">
  <div class="flex justify-between mb-1">
    <label class="text-sm font-medium">Presupuesto Usado</label>
    <span class="text-sm font-semibold text-warning">102%</span>
  </div>
  <div class="w-full bg-neutral-200 rounded-full h-2">
    <div class="bg-warning h-full rounded-full transition-all" style="width: 102%"></div>
  </div>
  <p class="text-xs text-neutral-500 mt-1">$15,300 de $15,000</p>
</div>

<!-- Critical - Over 110% -->
<div>
  <div class="flex justify-between mb-1">
    <label class="text-sm font-medium">Presupuesto Usado</label>
    <span class="text-sm font-semibold text-danger">125%</span>
  </div>
  <div class="w-full bg-neutral-200 rounded-full h-2">
    <div class="bg-danger h-full rounded-full transition-all" style="width: 100%"></div>
  </div>
  <p class="text-xs text-neutral-500 mt-1">$18,750 de $15,000 (Excedido por $3,750)</p>
</div>
```

---

## Price Anomaly Alert

```html
<!-- Medium Risk (5-10% variance) -->
<div class="alert-warning rounded-lg">
  <div class="flex gap-3">
    <AlertCircleIcon class="w-5 h-5 flex-shrink-0 mt-0.5" />
    <div>
      <h4 class="font-semibold">Variación de Precio Detectada</h4>
      <p class="text-sm mt-1">
        Precio actual <strong>$1,500</strong> vs promedio <strong>$1,350</strong>
      </p>
      <p class="text-xs mt-2 text-amber-700">
        Diferencia: <strong>+11%</strong> (MEDIUM RISK)
      </p>
    </div>
  </div>
</div>

<!-- High Risk (10-15% variance) -->
<div class="alert-warning rounded-lg">
  <div class="flex gap-3">
    <AlertCircleIcon class="w-5 h-5 flex-shrink-0 mt-0.5" />
    <div>
      <h4 class="font-semibold">Variación de Precio Detectada</h4>
      <p class="text-sm mt-1">
        Precio actual <strong>$1,600</strong> vs promedio <strong>$1,350</strong>
      </p>
      <p class="text-xs mt-2 text-amber-700">
        Diferencia: <strong>+18.5%</strong> (HIGH RISK)
      </p>
      <button class="text-xs font-semibold mt-3 underline">Review Pricing →</button>
    </div>
  </div>
</div>

<!-- Critical Risk (>15% variance) -->
<div class="alert-danger rounded-lg">
  <div class="flex gap-3">
    <XCircleIcon class="w-5 h-5 flex-shrink-0 mt-0.5" />
    <div>
      <h4 class="font-semibold">Anomalía de Precio Crítica</h4>
      <p class="text-sm mt-1">
        Precio actual <strong>$1,750</strong> vs promedio <strong>$1,350</strong>
      </p>
      <p class="text-xs mt-2 text-red-700">
        Diferencia: <strong>+29.6%</strong> (CRITICAL - REQUIERE REVISIÓN)
      </p>
      <div class="flex gap-2 mt-3">
        <button class="text-xs font-semibold underline">Review Now</button>
        <button class="text-xs font-semibold underline">Contact Supplier</button>
      </div>
    </div>
  </div>
</div>
```

---

## Purchase Timeline

```html
<div class="flex items-center gap-4 overflow-x-auto pb-4">
  <!-- Stage 1 - Completed -->
  <div class="flex flex-col items-center flex-shrink-0">
    <div class="w-8 h-8 rounded-full bg-success flex items-center justify-center mb-2">
      <CheckIcon class="w-5 h-5 text-white" />
    </div>
    <span class="text-xs font-medium whitespace-nowrap">Requisición</span>
    <span class="text-xs text-neutral-500">Completado</span>
  </div>

  <!-- Connector Line -->
  <div class="h-0.5 w-8 bg-success flex-shrink-0 mt-2"></div>

  <!-- Stage 2 - Completed -->
  <div class="flex flex-col items-center flex-shrink-0">
    <div class="w-8 h-8 rounded-full bg-success flex items-center justify-center mb-2">
      <CheckIcon class="w-5 h-5 text-white" />
    </div>
    <span class="text-xs font-medium whitespace-nowrap">Aprobación</span>
    <span class="text-xs text-neutral-500">Completado</span>
  </div>

  <!-- Connector Line -->
  <div class="h-0.5 w-8 bg-info flex-shrink-0 mt-2"></div>

  <!-- Stage 3 - In Progress -->
  <div class="flex flex-col items-center flex-shrink-0">
    <div class="w-8 h-8 rounded-full bg-info flex items-center justify-center mb-2">
      <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
    </div>
    <span class="text-xs font-medium whitespace-nowrap">Orden</span>
    <span class="text-xs text-info">En progreso</span>
  </div>

  <!-- Connector Line -->
  <div class="h-0.5 w-8 bg-neutral-300 flex-shrink-0 mt-2"></div>

  <!-- Stage 4 - Pending -->
  <div class="flex flex-col items-center flex-shrink-0">
    <div class="w-8 h-8 rounded-full border-2 border-neutral-300 flex items-center justify-center mb-2">
      <span class="text-xs text-neutral-400">4</span>
    </div>
    <span class="text-xs font-medium whitespace-nowrap">Confirmación</span>
    <span class="text-xs text-neutral-500">Pendiente</span>
  </div>

  <!-- ... more stages ... -->
</div>
```

---

## Responsive Dashboard Grid

```html
<!-- Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols, Wide: 4 cols -->
<div class="container mx-auto px-4 py-6">
  <h1 class="text-4xl font-bold mb-8">Dashboard de Compras</h1>

  <!-- KPI Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
    <div class="kpi-card">
      <p class="kpi-label">Compras Totales</p>
      <p class="kpi-value">245</p>
      <p class="kpi-delta text-success">↑ +12%</p>
    </div>
    <div class="kpi-card">
      <p class="kpi-label">Completadas</p>
      <p class="kpi-value">198</p>
      <p class="kpi-delta text-success">✓ 81%</p>
    </div>
    <div class="kpi-card">
      <p class="kpi-label">En Proceso</p>
      <p class="kpi-value">35</p>
      <p class="kpi-delta text-info">→ 14%</p>
    </div>
    <div class="kpi-card">
      <p class="kpi-label">Vencidas</p>
      <p class="kpi-value">12</p>
      <p class="kpi-delta text-danger">✗ 5%</p>
    </div>
  </div>

  <!-- Content Sections -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Main Section -->
    <div class="lg:col-span-2">
      <div class="bg-card rounded-lg border border-border p-6">
        <h2 class="text-2xl font-bold mb-4">Compras Recientes</h2>
        <!-- Table goes here -->
      </div>
    </div>

    <!-- Sidebar -->
    <div class="lg:col-span-1">
      <div class="bg-card rounded-lg border border-border p-6">
        <h3 class="text-xl font-bold mb-4">Alertas</h3>
        <!-- Alerts go here -->
      </div>
    </div>
  </div>
</div>
```

---

## Form Input

```html
<!-- Default -->
<div class="mb-4">
  <label htmlFor="supplier" class="block text-sm font-medium mb-2">
    Proveedor
    <span class="text-danger">*</span>
  </label>
  <input
    id="supplier"
    type="text"
    placeholder="Nombre del proveedor"
    class="w-full px-3 py-2 border border-border rounded-sm bg-background text-foreground
           placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary"
  />
</div>

<!-- With Error -->
<div class="mb-4">
  <label htmlFor="amount" class="block text-sm font-medium mb-2">
    Monto
    <span class="text-danger">*</span>
  </label>
  <input
    id="amount"
    type="number"
    aria-invalid="true"
    aria-describedby="amount-error"
    class="w-full px-3 py-2 border-2 border-danger rounded-sm bg-background text-foreground
           placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-danger/30"
  />
  <p id="amount-error" class="text-xs text-danger mt-1">El monto es obligatorio</p>
</div>

<!-- Disabled -->
<div>
  <label htmlFor="status" class="block text-sm font-medium mb-2">
    Estado
  </label>
  <input
    id="status"
    type="text"
    disabled
    value="Completado"
    class="w-full px-3 py-2 border border-border rounded-sm bg-neutral-100 text-neutral-500
           cursor-not-allowed"
  />
</div>
```

---

## Dark Mode

Enable automatically:

```tsx
// app/layout.tsx
import { ThemeProvider } from 'next-themes'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

All colors automatically adapt to dark mode without code changes.

---

## Common Color Classes

```html
<!-- Text colors -->
<p class="text-success">Success text (green)</p>
<p class="text-warning">Warning text (amber)</p>
<p class="text-danger">Danger text (red)</p>
<p class="text-info">Info text (blue)</p>

<!-- Background colors -->
<div class="bg-success-light">Light success background</div>
<div class="bg-warning-light">Light warning background</div>
<div class="bg-danger-light">Light danger background</div>
<div class="bg-info-light">Light info background</div>

<!-- Border colors -->
<div class="border border-success">Green border</div>
<div class="border border-warning">Amber border</div>
<div class="border border-danger">Red border</div>
<div class="border border-info">Blue border</div>
```

---

## Support

For detailed documentation, see:
- `src/styles/README.md` - Overview
- `src/styles/DESIGN_SYSTEM.md` - Complete guide
- `src/styles/TOKEN_REFERENCE.md` - All tokens
- `src/styles/COMPONENT_SPECS.md` - Component details
- `src/styles/COLOR_PALETTE.md` - Color reference
- `DESIGN_SYSTEM_IMPLEMENTATION.md` - Implementation details

Ready to build beautiful, accessible UI with consistency and confidence!
