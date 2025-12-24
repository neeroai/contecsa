# SPEC: Dashboard Ejecutivo Role-Based

Version: 1.0 | Date: 2025-12-24 06:00 | Owner: Javier Polo | Status: Active

---

## Problem

Reportes estáticos generados manualmente (2 horas). Sin visibilidad en tiempo real del estado de compras. KPIs dispersos en múltiples Excels. Gerencia depende de reportes semanales, no tiempo real.

---

## Objective

**Primary Goal:** Dashboards role-based (Gerencia, Compras, Contabilidad, Técnico, Almacén) que se actualizan en tiempo real, muestran KPIs relevantes por función y permiten drill-down para análisis detallado.

**Success Metrics:**
- Visibilidad inmediata estado de compras (tiempo real <5s refresh)
- Reducción 90% tiempo generación reportes ejecutivos (2h → 10min)
- Load time <2s (95th percentile)
- Cache hit rate >70%
- NPS usuarios >70 (5 roles)

---

## Scope

| In | Out |
|---|---|
| 5 dashboards role-based (Gerencia, Compras, Contabilidad, Técnico, Almacén) | Custom dashboards (user-defined KPIs) - Phase 2 |
| KPI cards, charts (bar/line/pie), data tables | Mobile app (native iOS/Android) - Phase 2 |
| Realtime updates (SSE) every 5min | Scheduled email reports - Phase 2 |
| Excel/CSV/PDF export | Comparison mode (periods side-by-side) - Phase 2 |
| Filters (date range, consorcio, category) | AI-powered forecasting - Phase 2 |
| Redis cache (5min TTL) | Custom alert thresholds - Phase 2 |

---

## Contracts

### Input

| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| user_role | enum | Y | gerencia\|compras\|contabilidad\|tecnico\|almacen |
| date_range | object | N | {start_date, end_date} - defaults to current month |
| consorcio_filter | string[] | N | Array of consorcio IDs - defaults to all authorized |
| category_filter | string[] | N | Material categories - defaults to all |
| export_format | enum | N | excel\|csv\|pdf - for export functionality |

### Output

| Field | Type | Condition | Notes |
|-------|------|-----------|-------|
| kpis | object{} | Always | Role-specific KPIs (e.g., compras_activas, gasto_mensual) |
| charts | object[] | Always | Array of chart data {type, data, config} |
| tables | object[] | On Success | Tabular data for lists (compras en riesgo, facturas pendientes) |
| alerts | object[] | Always | Critical alerts (compras >30 días, facturas bloqueadas) |
| cache_metadata | object | Always | {cached_at, ttl_remaining} for debugging |
| export_url | string | On export request | Downloadable file URL (24h expiry) |

---

## Business Rules

- **Role-based data:** User sees ONLY authorized consorcios → WHERE consorcio_id IN (user.authorized_consorcios)
- **Cache 5min TTL:** Dashboard data cached in Redis → reduce DB load, auto-refresh every 5min
- **SSE realtime updates:** Server push events (new_purchase, state_change, alert, kpi_update) → no polling
- **DB views optimized:** Precomputed aggregations (v_dashboard_gerencia, etc.) → queries <500ms
- **Alert thresholds:** Compras >30 días = red alert, Facturas bloqueadas = red alert, Budget >90% = yellow alert
- **Export limits:** Excel max 10K rows, CSV max 50K rows, PDF current view only
- **Lazy loading charts:** Charts load on scroll → faster initial page load
- **Pagination 20 items:** Tables paginate at 20 items/page → reduce data transfer

---

## Edge Cases

| Scenario | Handling | Notes |
|----------|----------|-------|
| No data for role | Show empty state with "No hay datos aún" | E.g., new Técnico with no requisiciones |
| SSE connection dropped | Auto-reconnect within 5s, show "Reconectando..." indicator | Network issues, server restart |
| Cache miss (Redis down) | Fallback to direct DB query, log error, slower response | Redis outage scenario |
| Export >10K rows | Truncate + warning "Exportados primeros 10,000 registros" | Prevent memory overflow |
| Invalid date range | Return 400 + "Rango de fechas inválido" | start_date > end_date |
| Unauthorized consorcio | Filter out + log security warning | User tries to access forbidden data |
| Chart data too large | Aggregate data (e.g., weekly instead of daily) + note | >1000 data points |

---

## Observability

**Logs:**
- `dashboard_loaded` (info) - Role, load_time_ms, cache_hit
- `sse_connected` (info) - User connected to SSE stream
- `sse_event_sent` (info) - Event type (new_purchase, alert, kpi_update)
- `export_requested` (info) - Format, row_count, user_role
- `cache_miss` (warn) - Dashboard data not in cache, direct DB query
- `unauthorized_access` (error) - User tried to access forbidden consorcio

**Metrics:**
- `dashboard_load_time_p95` - 95th percentile load time, alert if >3s
- `cache_hit_rate` - Percentage cached, alert if <60%
- `sse_connection_count` - Active SSE connections, monitor capacity
- `db_query_time_p95` - DB view query time, alert if >1s
- `export_count_by_format` - Track Excel vs CSV vs PDF usage

**Traces:**
- `dashboard_render` (span) - Full dashboard lifecycle: query → cache → render
- `chart_generation` (span) - Individual chart render time

---

## Definition of Done

- [ ] Code review approved
- [ ] All 5 role dashboards implemented (Gerencia, Compras, Contabilidad, Técnico, Almacén)
- [ ] All KPIs calculate correctly (validated against Excel source)
- [ ] Charts render (bar, line, pie via Recharts or Tremor)
- [ ] Filters work without page reload (client-side filtering)
- [ ] Realtime SSE updates working (5min KPI refresh)
- [ ] Cache hit rate >70% in production
- [ ] Load time <2s (95th percentile)
- [ ] Export to Excel/CSV/PDF functional
- [ ] WCAG 2.1 AA compliance (keyboard nav, screen reader, high contrast)
- [ ] Mobile responsive (tablet 768px+)
- [ ] Tested with 3+ users per role (15 total UAT)
- [ ] Observability logs + metrics implemented
- [ ] Deployed to staging
- [ ] Smoke test passed (all 5 dashboards load)

---

**Related:** F001 (Agente IA) chart integration, F003 (Seguimiento Compras) status data | **Dependencies:** PostgreSQL views (v_dashboard_*), Redis cache

**Original PRD:** docs/features/r02-dashboard.md
