# Test Plan: Dashboard Ejecutivo

Version: 1.0 | Date: 2025-12-24 06:15 | Owner: Claude Code | Status: Active

---

## Reference

**SDD Version:** 1.0 | **Feature:** Dashboard Ejecutivo (F002) | **Scope:** Unit + Integration + E2E | **Coverage Target:** 80% (DB views, API routes, components)

---

## Test Strategy

**Philosophy:** 80% coverage on DB views (KPI calculations), API routes (cache), and chart components. Unit tests verify KPI formulas. Integration tests verify API → cache → DB flow. E2E tests verify user workflows per role.

**Critical Paths:**
1. DB view query → Redis cache → API response → Dashboard render
2. SSE connection → Event push → Dashboard update
3. Filter change → Re-query → Chart update (no page reload)
4. Export button → File generation → Download

---

## Unit Tests

| Module | Test Cases | Tool | Status |
|--------|-----------|------|--------|
| DB views (v_dashboard_gerencia) | - Compras activas count correct<br>- Gasto mensual SUM matches<br>- Budget % formula accurate<br>- Top 10 proveedores sorted | Vitest + PostgreSQL test DB | TODO |
| lib/cache/dashboardCache | - Cache get/set/delete<br>- 5min TTL expiration<br>- Cache key generation | Vitest + Redis mock | TODO |
| API /api/dashboard/gerencia | - Returns {kpis, charts, tables, alerts}<br>- Cache hit <100ms<br>- Cache miss queries DB<br>- Role-based filtering (authorized consorcios only) | Vitest + MSW | TODO |
| components/KPICard | - Renders metric + label + trend<br>- Handles null values<br>- Formats currency correctly | Vitest + React Testing Library | TODO |

---

## Integration Tests

| Component | Test Cases | Tool | Status |
|-----------|-----------|------|--------|
| /api/dashboard/gerencia (full flow) | - DB view → cache → response<br>- Cache hit path <100ms<br>- Cache miss path <1s<br>- Unauthorized consorcio filtered | Vitest + PostgreSQL test instance | TODO |
| SSE /api/dashboard/sse/gerencia | - Client connects successfully<br>- kpi_update event sent every 5min<br>- new_purchase event triggers<br>- Reconnect on disconnect | Vitest + EventSource mock | TODO |
| Chart rendering | - BarChart renders with Recharts<br>- Data updates trigger re-render<br>- Responsive breakpoints work | Vitest + React Testing Library | TODO |

---

## E2E Tests (Playwright)

**Setup:** `bun test:e2e` | **Roles:** Gerencia, Compras, Contabilidad, Técnico, Almacén

**Happy Paths (5 Dashboards):**

1. **US2.1 - Gerencia Dashboard:**
   - Login as Gerente
   - Assert: Compras activas count displayed
   - Assert: Gasto mensual chart rendered
   - Assert: Top 5 proveedores chart visible
   - Assert: Load time <2s

2. **US2.2 - Compras Dashboard:**
   - Login as Jefe Compras
   - Assert: Compras en riesgo >30 días (red badge)
   - Assert: Compras por etapa funnel chart
   - Assert: Click compra → drill-down detail page
   - Assert: Filters update without reload

3. **US2.3 - Contabilidad Dashboard:**
   - Login as Contabilidad
   - Assert: Facturas pendientes count
   - Assert: Facturas bloqueadas (red alert)
   - Assert: Total por pagar currency
   - Assert: Export Excel button works

4. **US2.4 - Técnico Dashboard:**
   - Login as Técnico
   - Assert: Consumo mensual by category
   - Assert: Presupuesto disponible vs gasto
   - Assert: Filter by proyecto works
   - Assert: Charts responsive (resize window)

5. **US2.5 - Almacén Dashboard:**
   - Login as Almacén
   - Assert: Recepciones pendientes count
   - Assert: Próximos ingresos (7 días) calendar
   - Assert: Registrar recepción button visible
   - Assert: SSE update triggers (simulate new orden)

**Export Tests:**
- Export Gerencia dashboard to Excel → file downloads, <10K rows
- Export Contabilidad to CSV → file valid, all columns present
- Export dashboard to PDF → print-friendly snapshot

**Filter Tests:**
- Change date range → charts update without reload
- Select consorcio filter → data filtered correctly
- Select category filter → KPIs recalculate

---

## Quality Gates CI

| Gate | Command | Target | Status |
|------|---------|--------|--------|
| Format | `bun run format --check` | 100% | TODO |
| Lint | `bun run lint` | 0 errors | TODO |
| Types | `bun run typecheck` | 0 errors | TODO |
| Unit | `bun test --coverage` | 80%+ on lib/ + components/ | TODO |
| Build | `bun run build` | Exit 0 | TODO |
| E2E | `bun test:e2e` | All 5 dashboards pass | TODO |

---

## Manual Testing Checklist

- [ ] 5 role dashboards tested with real users (3 per role = 15 total)
- [ ] KPI calculations validated against Excel source (28 fields)
- [ ] Keyboard navigation (Tab, Enter, Esc)
- [ ] Screen reader (VoiceOver) - ARIA labels announced
- [ ] WCAG 2.1 AA: Color contrast, focus states, high contrast mode
- [ ] Mobile responsive (tablet 768px+, not phone)
- [ ] Performance: Lighthouse score >85, load time <2s
- [ ] SSE realtime: Simulate new compra, verify dashboard updates

---

**Token-efficient format:** 60 lines | 5 E2E scenarios | 80%+ coverage target
