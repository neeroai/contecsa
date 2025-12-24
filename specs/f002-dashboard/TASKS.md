# TASKS: Dashboard Ejecutivo

Version: 1.0 | Date: 2025-12-24 06:20 | Owner: Claude Code | Status: Active

---

## DOING

| ID | Task | DoD | Est |
|----|------|-----|-----|
| - | No active tasks yet | - | - |

---

## TODO (Priority Order - From PLAN.md)

| ID | Task | DoD | Est |
|----|------|-----|-----|
| T001 | Create v_dashboard_gerencia view | - SQL view executes <500ms<br>- KPIs (compras activas, gasto mensual, budget %) correct<br>- Top 10 proveedores aggregation | 3h |
| T002 | Create v_dashboard_compras view | - Compras en riesgo >30 días<br>- Compras por etapa aggregation<br>- Promedio tiempo aprobación | 3h |
| T003 | Create v_dashboard_contabilidad view | - Facturas pendientes/bloqueadas/vencidas<br>- Total por pagar by consorcio<br>- Pagos por consorcio | 2h |
| T004 | Create v_dashboard_tecnico view | - Consumo mensual by category<br>- Presupuesto disponible vs gasto<br>- Próximas entregas | 2h |
| T005 | Create v_dashboard_almacen view | - Recepciones pendientes<br>- Entregas parciales<br>- Próximos ingresos (7 días) | 2h |
| T006 | Implement Redis cache layer | - dashboardCache.ts (get/set/invalidate)<br>- 5min TTL enforced<br>- Cache key: role + filters hash | 2h |
| T007 | Create /api/dashboard/gerencia route | - Query v_dashboard_gerencia<br>- Cache with Redis<br>- Return {kpis, charts, tables, alerts}<br>- Role-based filtering | 3h |
| T008 | Create /api/dashboard routes (4 remaining) | - /compras, /contabilidad, /tecnico, /almacen<br>- Same structure as T007<br>- All use cache | 4h |
| T009 | Create KPICard component | - Displays metric + label + trend arrow<br>- Optional sparkline<br>- Styled with shadcn/ui card | 2h |
| T010 | Create BarChart component (Recharts) | - Responsive bar chart<br>- ARIA labels<br>- Colorblind-safe palette | 2h |
| T011 | Create LineChart component (Recharts) | - Responsive line chart<br>- Trend line support<br>- Tooltip on hover | 2h |
| T012 | Create PieChart component (Recharts) | - Responsive pie chart<br>- Legend + percentages<br>- Accessible labels | 2h |
| T013 | Create DataTable component | - shadcn/ui table with sorting<br>- Client-side filtering<br>- Pagination (20 items/page) | 3h |
| T014 | Implement SSE endpoint /api/dashboard/sse/:role | - Server-Sent Events stream<br>- Push events (new_purchase, kpi_update)<br>- Auto-reconnect client-side | 3h |
| T015 | Create Dashboard Gerencia page | - Layout: KPIs + 4 charts + filters<br>- Integrate KPICard, charts components<br>- SSE connection for realtime | 4h |
| T016 | Create Dashboard Compras page | - Compras en riesgo list (DataTable)<br>- Funnel chart (compras por etapa)<br>- Filters (etapa, proveedor, antigüedad) | 4h |
| T017 | Create Dashboard Contabilidad page | - Facturas pendientes list<br>- Pie chart (facturas por estado)<br>- Alert badges (bloqueadas, vencidas) | 3h |
| T018 | Create Dashboard Técnico page | - Consumo by category chart<br>- Budget vs gasto comparison<br>- Filter by proyecto | 3h |
| T019 | Create Dashboard Almacén page | - Recepciones pendientes list<br>- Próximos ingresos calendar<br>- Registrar recepción button | 3h |
| T020 | Implement Filters component | - Date range picker<br>- Consorcio dropdown (multi-select)<br>- Category dropdown<br>- Client-side filtering (no reload) | 3h |
| T021 | Implement Excel export | - exportDashboard.ts with SheetJS<br>- Max 10K rows limit<br>- Upload to Vercel Blob<br>- 24h expiry URL | 3h |
| T022 | Implement CSV export | - Same as T021 but CSV format<br>- Max 50K rows | 1h |
| T023 | Implement PDF export | - Current view snapshot<br>- Print-friendly layout<br>- Charts included | 3h |
| T024 | Add keyboard navigation | - Tab through KPIs/charts/filters<br>- Enter to activate<br>- Esc to close modals | 2h |
| T025 | Add screen reader support | - ARIA labels on charts<br>- Role announcements<br>- Live regions for SSE updates | 2h |
| T026 | Add high contrast mode | - CSS custom properties<br>- WCAG AA contrast ratios<br>- Toggle in settings | 2h |
| T027 | Write unit tests for DB views | - KPI formulas validated<br>- Aggregations correct<br>- Coverage >80% | 2h |
| T028 | Write integration tests for API routes | - Cache hit/miss paths<br>- Role-based filtering<br>- SSE event push | 3h |
| T029 | Write E2E tests for 5 dashboards | - Playwright tests (5 roles)<br>- Load time <2s<br>- Export functionality | 4h |
| T030 | UAT with 15 users (3 per role) | - Schedule sessions<br>- Validate KPIs vs Excel<br>- Collect feedback | 6h |

**Total Estimated Time:** 76 hours (~3-4 weeks)

---

## BLOCKED

| ID | Task | Blocker | Notes |
|----|------|---------|-------|
| - | None yet | - | - |

---

## DONE

| ID | Task | Closed | Commit |
|----|------|--------|--------|
| - | Migration to SDD | 2025-12-24 | TBD |

---

**Dependencies:**
- T006-T008 depend on T001-T005 (views must exist)
- T015-T019 depend on T009-T013 (components must exist)
- T020-T023 depend on T015-T019 (dashboards must exist)
- T024-T026 depend on T015-T019 (accessibility on top of dashboards)
- T027-T029 depend on T001-T026 (implementation complete)
- T030 depends on T029 (E2E tests pass first)
