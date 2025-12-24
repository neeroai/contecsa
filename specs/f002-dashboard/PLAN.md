# SDD Implementation Plan: Dashboard Ejecutivo

Version: 1.0 | Date: 2025-12-24 06:05 | Owner: Javier Polo | Status: Active

---

## Reference

**SPEC:** /specs/f002-dashboard/SPEC.md
**ADR:** /specs/f002-dashboard/ADR.md (Recharts vs Tremor decision)
**PRD:** docs/features/r02-dashboard.md

---

## Stack Validated

**Framework:** Next.js 15 App Router (Server Components)
- Source: /Users/mercadeo/neero/docs-global/stack/nextjs-react-patterns.md:10-25

**Charts:** Recharts (React charting library)
- Source: /Users/mercadeo/neero/docs-global/stack/common-stack.md:60-65
- Decision: See ADR.md (Recharts over Tremor for simplicity)

**Data Tables:** shadcn/ui Table component
- Source: /Users/mercadeo/neero/docs-global/stack/common-stack.md:35-40

**Realtime:** Server-Sent Events (SSE)
- Source: /Users/mercadeo/neero/docs-global/stack/nextjs-react-patterns.md:85-90

**Cache:** Redis (Vercel KV) with 5min TTL
- Source: /Users/mercadeo/neero/docs-global/stack/database-guide.md:89-95

**Database Views:** PostgreSQL materialized views (v_dashboard_gerencia, etc.)
- Source: /Users/mercadeo/neero/docs-global/stack/database-guide.md:45-50

**Export:** SheetJS (xlsx) for Excel export
- Source: /Users/mercadeo/neero/docs-global/stack/common-stack.md:70-75

**Validation Checklist:**
- [x] Stack matches docs-global/stack/ (6 citations)
- [x] NO INVENTAR protocol applied
- [x] ClaudeCode&OnlyMe filter passed (see ADR.md)
- [x] Dependencies: PostgreSQL views, Redis cache
- [x] Limitations: Desktop-first (mobile Phase 2)

---

## Implementation Steps (12 steps)

### S001: Create database views for 5 roles
**Deliverable:** SQL views (v_dashboard_gerencia, v_dashboard_compras, v_dashboard_contabilidad, v_dashboard_tecnico, v_dashboard_almacen)
**Dependencies:** PostgreSQL schema (compras, ordenes, facturas tables)
**Acceptance:** Views execute <500ms, aggregate KPIs correctly

### S002: Create API routes for each dashboard
**Deliverable:** /api/dashboard/gerencia, /compras, /contabilidad, /tecnico, /almacen
**Dependencies:** S001 (views), Redis setup
**Acceptance:** Routes return JSON with kpis + charts + tables, cache 5min TTL

### S003: Implement Redis caching layer
**Deliverable:** lib/cache/dashboardCache.ts with get/set/invalidate
**Dependencies:** S002 (API routes)
**Acceptance:** Cache hit rate >70%, TTL 5min enforced

### S004: Create KPI Card component
**Deliverable:** components/dashboard/KPICard.tsx
**Dependencies:** shadcn/ui card component
**Acceptance:** Displays metric, label, trend arrow, sparkline (optional)

### S005: Create Chart components (Bar, Line, Pie)
**Deliverable:** components/dashboard/BarChart.tsx, LineChart.tsx, PieChart.tsx using Recharts
**Dependencies:** Recharts library
**Acceptance:** Responsive, accessible (ARIA labels), colorblind-safe palette

### S006: Create DataTable component
**Deliverable:** components/dashboard/DataTable.tsx with sorting/filtering/pagination
**Dependencies:** shadcn/ui table
**Acceptance:** 20 items/page, sortable columns, client-side filtering

### S007: Implement SSE endpoint for realtime updates
**Deliverable:** /api/dashboard/sse/:role with Server-Sent Events
**Dependencies:** S002 (API routes)
**Acceptance:** Pushes events (new_purchase, state_change, kpi_update) every 5min

### S008: Create Dashboard layouts for 5 roles
**Deliverable:** app/dashboard/gerencia/page.tsx (+ 4 other roles)
**Dependencies:** S004, S005, S006 (components)
**Acceptance:** Role-specific layouts match SPEC.md requirements

### S009: Implement filters (date, consorcio, category)
**Deliverable:** components/dashboard/Filters.tsx with dropdown + date picker
**Dependencies:** S008 (dashboard pages)
**Acceptance:** Filters work without page reload, update charts + tables

### S010: Implement Excel/CSV/PDF export
**Deliverable:** lib/export/exportDashboard.ts with SheetJS + PDF library
**Dependencies:** S008 (dashboard data)
**Acceptance:** Excel <10K rows, CSV <50K rows, PDF current view, 24h expiry

### S011: Add accessibility features
**Deliverable:** Keyboard navigation, screen reader support, high contrast mode
**Dependencies:** S005, S008 (charts + pages)
**Acceptance:** WCAG 2.1 AA compliance (axe DevTools scan passes)

### S012: Integration testing + UAT
**Deliverable:** E2E tests for all 5 dashboards + user acceptance testing
**Dependencies:** S001-S011 (full feature)
**Acceptance:** All KPIs validated against Excel, 15 users (3 per role) UAT passed

---

## Milestones

**M1 - Data Layer:** [S001-S003] | Target: Week 1 (DB views + API + cache)
**M2 - UI Components:** [S004-S006] | Target: Week 2 (KPIs + charts + tables)
**M3 - Dashboards + Features:** [S007-S010] | Target: Week 3 (SSE + layouts + export)
**M4 - Polish + Testing:** [S011-S012] | Target: Week 4 (accessibility + UAT)

---

## Risk Mitigation

| Risk | Mitigation | Owner |
|------|-----------|-------|
| DB view queries >1s | Optimize with indexes, materialized views, monitor query performance | Claude Code |
| Redis cache misses >30% | Investigate cache eviction, increase memory, adjust TTL | Javier Polo |
| Chart rendering slow (>500ms) | Lazy load charts on scroll, reduce data points (aggregate) | Claude Code |
| SSE connection unstable | Auto-reconnect logic, fallback to polling if SSE fails | Claude Code |
| Excel export OOM (>10K rows) | Hard limit 10K rows, warn user, suggest CSV for larger exports | Claude Code |

---

## Notes

**Critical Constraints:**
- F003 (Seguimiento Compras) must be implemented to provide status data for dashboards
- Charts reused from F001 (Agente IA) for consistency

**Assumptions:**
- Users primarily desktop (mobile tablet+ only, no phone)
- 5min cache TTL acceptable (not realtime trading, construction pace)
- 10 concurrent users max (no load balancing yet)

**Blockers:**
- PostgreSQL schema must include all 28 purchase tracking fields
- Need UAT with 15 users (3 per role: Gerencia, Compras, Contabilidad, Técnico, Almacén)

---

**Last updated:** 2025-12-24 06:05 | Maintained by: Javier Polo + Claude Code
