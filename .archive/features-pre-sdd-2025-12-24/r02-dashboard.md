# R2 - Dashboard Ejecutivo

Version: 1.0 | Date: 2025-12-22 22:05 | Priority: P0 | Status: Planned

---

## Overview

Dashboards en tiempo real personalizados por rol (Gerencia, Compras, Contabilidad, Técnico, Almacén) que visualizan KPIs críticos, tendencias y alertas del sistema de compras.

**Key Feature:** Un dashboard por rol, no un dashboard genérico. Cada usuario ve exactamente lo que necesita para su función.

---

## Business Context

**Problem:**
- Reportes estáticos generados manualmente (2 horas)
- Sin visibilidad en tiempo real del estado de compras
- KPIs dispersos en múltiples Excels
- Gerencia depende de reportes semanales (no tiempo real)

**Solution:**
Dashboards role-based que se actualizan en tiempo real, muestran KPIs relevantes por función y permiten drill-down para análisis detallado.

**Impact:**
- Visibilidad inmediata del estado de compras
- Reducción 90% tiempo generación reportes ejecutivos
- Toma de decisiones basada en datos actualizados

---

## User Stories

| ID | Actor | Story | Acceptance Criteria |
|----|-------|-------|---------------------|
| US2.1 | Gerente General | Ver resumen ejecutivo de todas las compras activas | - Total compras activas<br>- Gasto mensual vs presupuesto<br>- Top 5 proveedores<br>- Compras por consorcio (gráfica pie) |
| US2.2 | Jefe Compras | Monitorear compras en riesgo (>30 días abiertas) | - Lista compras >30 días<br>- Alertas rojas para urgentes<br>- Drill-down a detalle de compra |
| US2.3 | Contabilidad | Ver estado de facturas pendientes | - Facturas por pagar<br>- Facturas bloqueadas<br>- Total por consorcio |
| US2.4 | Técnico | Ver consumo de materiales por proyecto | - Consumo por categoría<br>- Comparación vs presupuesto<br>- Tendencia mensual |
| US2.5 | Almacén | Ver estado de entregas pendientes | - Recepciones pendientes<br>- Entregas parciales<br>- Próximos ingresos |

---

## Technical Approach

### Architecture

```
PostgreSQL (source data)
  ↓
API Routes (Next.js)
  ├─→ /api/dashboard/gerencia
  ├─→ /api/dashboard/compras
  ├─→ /api/dashboard/contabilidad
  ├─→ /api/dashboard/tecnico
  └─→ /api/dashboard/almacen
  ↓
Redis Cache (5 min TTL)
  ↓
Frontend Components
  ├─→ Chart Components (Recharts/Tremor)
  ├─→ KPI Cards
  ├─→ Data Tables
  └─→ Alert Badges
```

### Tech Stack

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Charts | Recharts or Tremor | React-native, responsive, accessible |
| Data Grid | shadcn/ui Table | Consistent UI, sortable/filterable |
| Realtime | Server-Sent Events (SSE) | Auto-refresh without polling |
| Cache | Redis (Vercel KV) | Reduce DB load, 5 min TTL |
| Export | SheetJS (xlsx) | Excel export for offline analysis |
| State | React hooks (useState, useQuery) | Simple, no global state needed |

---

## Dashboard Specifications

### 1. Dashboard Gerencia

**KPIs:**
| Metric | Formula | Visualization |
|--------|---------|---------------|
| Compras Activas | COUNT(estado != CERRADO) | Number card |
| Gasto Mensual | SUM(monto WHERE mes = current) | Number card + trend |
| Gasto vs Presupuesto | (gasto_real / presupuesto) * 100 | Progress bar |
| Promedio Días Cierre | AVG(fecha_cierre - fecha_inicio) | Number card |

**Charts:**
- Compras por Consorcio (Pie chart) - % distribución de gasto
- Tendencia Mensual Gasto (Line chart) - Últimos 12 meses
- Top 10 Proveedores (Bar chart) - Por monto total
- Compras por Estado (Stacked bar) - Por etapa del proceso

**Filters:**
- Rango de fechas
- Consorcio específico
- Categoría de material

**Actions:**
- Exportar a Excel
- Enviar por email
- Drill-down a detalle de compra

---

### 2. Dashboard Compras

**KPIs:**
| Metric | Formula | Visualization |
|--------|---------|---------------|
| Compras Abiertas | COUNT(estado IN [REQUISICION, ORDEN, CONFIRMACION]) | Number card |
| Compras en Riesgo | COUNT(días_abierto > 30) | Alert badge (red) |
| Promedio Tiempo Aprobación | AVG(fecha_aprobacion - fecha_requisicion) | Number card |
| Órdenes Sin Confirmar | COUNT(estado = ORDEN AND confirmacion IS NULL) | Alert badge |

**Charts:**
- Compras por Etapa (Funnel chart) - Visualizar cuellos de botella
- Órdenes Pendientes (List view) - Ordenadas por antigüedad
- Proveedores con Retrasos (Bar chart) - Días promedio de retraso
- Tendencia Semanal (Line chart) - Compras nuevas vs cerradas

**Filters:**
- Etapa específica
- Proveedor
- Consorcio
- Antigüedad (>7, >15, >30 días)

**Actions:**
- Ver detalle de compra
- Enviar recordatorio a proveedor
- Marcar como urgente
- Exportar listado

---

### 3. Dashboard Contabilidad

**KPIs:**
| Metric | Formula | Visualization |
|--------|---------|---------------|
| Facturas Pendientes | COUNT(estado = PENDIENTE) | Number card |
| Facturas Bloqueadas | COUNT(estado = BLOQUEADA) | Alert badge (red) |
| Total por Pagar | SUM(monto WHERE pagado = FALSE) | Currency card |
| Facturas Vencidas | COUNT(fecha_vencimiento < TODAY) | Alert badge |

**Charts:**
- Facturas por Estado (Pie chart)
- Pagos por Consorcio (Stacked bar)
- Tendencia Pagos Mensual (Line chart)
- Top Proveedores por Pagar (Bar chart)

**Filters:**
- Estado factura
- Consorcio
- Rango de fechas
- Proveedor

**Actions:**
- Aprobar factura
- Bloquear/desbloquear factura
- Ver detalle factura
- Exportar para contabilidad

---

### 4. Dashboard Técnico

**KPIs:**
| Metric | Formula | Visualization |
|--------|---------|---------------|
| Requisiciones Activas | COUNT(estado = REQUISICION WHERE creador = user) | Number card |
| Materiales por Recibir | COUNT(estado = RECEPCION_PENDIENTE) | Number card |
| Consumo Mensual | SUM(cantidad WHERE proyecto = user_proyecto) | Number card + trend |
| Presupuesto Disponible | presupuesto_total - gasto_real | Currency card |

**Charts:**
- Consumo por Categoría (Pie chart)
- Tendencia Consumo Mensual (Line chart)
- Comparación vs Presupuesto (Bar chart por categoría)
- Próximas Entregas (Timeline view)

**Filters:**
- Proyecto específico
- Categoría de material
- Rango de fechas

**Actions:**
- Crear nueva requisición
- Ver detalle de material
- Exportar reporte de consumo

---

### 5. Dashboard Almacén

**KPIs:**
| Metric | Formula | Visualization |
|--------|---------|---------------|
| Recepciones Pendientes | COUNT(estado = CONFIRMADO, recepcion = NULL) | Number card |
| Entregas Parciales | COUNT(estado_entrega = PARCIAL) | Alert badge |
| Próximos Ingresos (7 días) | COUNT(fecha_entrega_estimada <= TODAY+7) | Number card |
| Promedio Tiempo Recepción | AVG(fecha_recepcion - fecha_confirmacion) | Number card |

**Charts:**
- Recepciones Semanales (Bar chart)
- Entregas por Estado (Pie chart: Total/Parcial/Pendiente)
- Calendario de Próximos Ingresos (Timeline)
- Top Proveedores con Retrasos (Bar chart)

**Filters:**
- Estado entrega
- Proveedor
- Fecha estimada ingreso

**Actions:**
- Registrar recepción
- Actualizar estado entrega
- Imprimir remisión
- Exportar listado

---

## Data Sources

### Database Queries

All dashboards query PostgreSQL via optimized views:

**View: `v_dashboard_gerencia`**
```sql
-- Aggregate data for Gerencia dashboard
-- Includes: total spend, active purchases, top suppliers, consorcio breakdown
```

**View: `v_dashboard_compras`**
```sql
-- Purchase tracking data
-- Includes: purchases by stage, at-risk purchases, supplier delays
```

**View: `v_dashboard_contabilidad`**
```sql
-- Invoice and payment data
-- Includes: pending invoices, blocked invoices, payment status
```

**View: `v_dashboard_tecnico`**
```sql
-- Material consumption by project
-- Includes: consumption by category, budget tracking, upcoming deliveries
```

**View: `v_dashboard_almacen`**
```sql
-- Warehouse and reception data
-- Includes: pending receptions, partial deliveries, upcoming arrivals
```

---

## Realtime Updates

### Server-Sent Events (SSE)

**Endpoint:** `/api/dashboard/sse/:role`

**Event Types:**
- `new_purchase` - Nueva compra creada
- `state_change` - Cambio de estado en compra existente
- `alert` - Alerta crítica (compra >30 días, factura bloqueada, etc.)
- `kpi_update` - Actualización de KPI (cada 5 min)

**Client Implementation:**
```typescript
const eventSource = new EventSource('/api/dashboard/sse/gerencia');
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Update dashboard state
};
```

---

## Performance Optimization

| Strategy | Implementation | Benefit |
|----------|----------------|---------|
| Database Views | Precomputed aggregations | Faster queries (<500ms) |
| Redis Cache | 5 min TTL for dashboard data | Reduce DB load 80% |
| Lazy Loading | Load charts on scroll | Faster initial load |
| Pagination | 20 items per table page | Reduce data transfer |
| SSE (vs Polling) | Server push updates | 90% less requests |

---

## Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatible
- High contrast mode
- Colorblind-safe chart colors

---

## Export Functionality

**Supported Formats:**
- Excel (.xlsx) - Full data export
- PDF - Dashboard snapshot (print-friendly)
- CSV - Raw data for custom analysis

**Export Scope:**
- Current view (filtered data)
- Full dataset (all data)
- Selected rows only

---

## Testing Strategy

### Performance Tests
- Dashboard load time <2s (95th percentile)
- Chart render time <500ms
- SSE latency <1s

### User Tests
- Test with each role (6 personas)
- Validate KPI calculations correctness
- Ensure filters work as expected
- Export functionality end-to-end

### Accessibility Tests
- Keyboard-only navigation
- Screen reader (NVDA, JAWS)
- Color contrast validation

---

## Success Criteria

**MVP Acceptance:**
- [ ] 5 role-based dashboards implemented
- [ ] All KPIs calculate correctly
- [ ] Charts render correctly (bar, line, pie)
- [ ] Filters work without page reload
- [ ] Export to Excel functional
- [ ] Load time <3s on 3G connection

**Production Ready:**
- [ ] Tested by 3+ users per role
- [ ] Realtime updates (SSE) working
- [ ] Cache hit rate >70%
- [ ] WCAG 2.1 AA compliance verified
- [ ] Mobile responsive (tablet+)
- [ ] User satisfaction NPS >70

---

## Future Enhancements (Post-MVP)

1. **Custom Dashboards** - Users create own KPIs/charts
2. **Scheduled Email Reports** - Daily/weekly dashboard snapshots
3. **Mobile App** - Native iOS/Android dashboards
4. **Alerts Configuration** - Users define custom alert thresholds
5. **Comparison Mode** - Compare periods side-by-side
6. **Forecasting** - AI-powered trend predictions

---

## References

- PRD Feature F03 (Dashboard Ejecutivo)
- Recharts Documentation: https://recharts.org
- Tremor Documentation: https://tremor.so
- shadcn/ui Table: https://ui.shadcn.com/docs/components/table
- Excel analysis: docs/analisis-control-compras.md (28 fields reference)
