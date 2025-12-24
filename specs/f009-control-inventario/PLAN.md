# SDD Implementation Plan: Control de Inventario

Version: 1.0 | Date: 2025-12-24 09:05 | Owner: Javier Polo | Status: Active

---

## Reference

**SPEC:** /specs/f009-control-inventario/SPEC.md
**ADR:** /specs/f009-control-inventario/ADR.md (PostgreSQL over NoSQL for inventory)
**PRD:** docs/features/r09-control-inventario.md
**CRITICAL:** >95% inventory accuracy, 30% capital reduction, 80% emergency purchase reduction

---

## Stack Validated

**Database:** PostgreSQL 15
- Source: /Users/mercadeo/neero/docs-global/stack/database-guide.md:15-25
- Tables: inventory (current stock), inventory_movements (audit trail)
- Use case: ACID transactions, optimistic locking (prevent negative stock)

**Frontend:** Next.js 15 App Router
- Source: /Users/mercadeo/neero/docs-global/stack/nextjs-react-patterns.md:10-15
- Pages: /inventory (dashboard), /inventory/movements (log), /inventory/projection (forecast)

**Charts:** Recharts
- Source: /Users/mercadeo/neero/docs-global/stack/common-stack.md:60-65
- Integration: F002 (Dashboard) - inventory valorization chart
- Use case: Stock trend, consumption graph, rotation days

**Notifications:** Gmail API (F005)
- Source: specs/f005-notificaciones/ADR.md
- Use case: Stock reorder alerts (email to Compras)

**Validation Checklist:**
- [x] Stack matches docs-global/stack/ (4 citations)
- [x] NO INVENTAR protocol applied
- [x] ClaudeCode&OnlyMe filter passed (see ADR.md)
- [x] Dependencies: F003 (recepción material), F005 (stock alerts)
- [x] Limitations: Single warehouse (MVP), no lot/batch tracking

---

## Implementation Steps (10 steps)

### S001: Create inventory table migration
**Deliverable:** SQL migration with inventory table (12 fields: id, material_id, material_name, unit, current_stock, min_stock, max_stock, unit_cost, total_value GENERATED, last_reception_date, last_delivery_date, updated_at)
**Dependencies:** PostgreSQL connection, materials table
**Acceptance:** Table created, index on material_id, total_value computed column

### S002: Create inventory_movements table migration
**Deliverable:** SQL migration with inventory_movements table (9 fields: id, material_id, movement_type, quantity, unit, purchase_id, project_id, performed_by, notes, timestamp)
**Dependencies:** S001 (inventory table)
**Acceptance:** Table created, index on material_id + timestamp, foreign keys to purchases + projects

### S003: Implement inventory service (CRUD)
**Deliverable:** lib/services/inventory.ts with createMovement(movement), getStock(material_id), getValorization(), getRotationDays(material_id)
**Dependencies:** S001-S002 (tables)
**Acceptance:** CRUD operations work, optimistic locking prevents negative stock

### S004: Implement stock update logic
**Deliverable:** lib/services/inventory.ts.updateStock() with transaction: create movement → update current_stock → check min_stock → trigger alert
**Dependencies:** S003 (inventory service)
**Acceptance:** Atomic transaction (all or nothing), stock updated correctly, alerts triggered if <min_stock

### S005: Implement reorder alert service
**Deliverable:** lib/services/inventory.ts.checkReorder() with daily job: query all materials → if stock <min_stock → calculate suggested_quantity → send email (F005)
**Dependencies:** S004 (stock update), F005 (Gmail API)
**Acceptance:** Daily cron job, email sent to Compras with material + suggested quantity

### S006: Implement projection engine (simple heuristic)
**Deliverable:** lib/services/inventory.ts.calculateProjection(material_id) with 6-month consumption average → predict next 30 days
**Dependencies:** S002 (movements table historical data)
**Acceptance:** Returns predicted_consumption_30d, suggested_purchase_quantity

### S007: Create inventory dashboard page
**Deliverable:** app/inventory/page.tsx with table: material, current_stock, min_stock, total_value, rotation_days
**Dependencies:** S003 (inventory service), Recharts
**Acceptance:** Responsive table, sortable columns, total valorization footer, <2s load time

### S008: Create movements log page
**Deliverable:** app/inventory/movements/page.tsx with filterable log (by material, date range, movement type)
**Dependencies:** S002 (movements table)
**Acceptance:** Pagination (50 rows/page), filters work, export to Excel

### S009: Integration with F003 (recepción material)
**Deliverable:** Hook in F003 RECEPCION stage: on material received → createMovement(RECEPTION) → update inventory.current_stock
**Dependencies:** F003 implemented
**Acceptance:** F003 recepción triggers inventory update automatically

### S010: Integration with F005 (stock alerts)
**Deliverable:** Hook reorder alert → Call F005.sendImmediateAlert(STOCK_LOW)
**Dependencies:** F005 implemented
**Acceptance:** Stock <min_stock → Email sent to Compras <1 min

---

## Milestones

**M1 - Data Layer:** [S001-S002] | Target: Week 1 (Tables + audit trail)
**M2 - Business Logic:** [S003-S006] | Target: Week 2 (CRUD + stock update + alerts + projection)
**M3 - UI + Integration:** [S007-S010] | Target: Week 3 (Dashboard + movements + F003/F005 integration)

---

## Risk Mitigation

| Risk | Mitigation | Owner |
|------|-----------|-------|
| **Negative stock (race condition)** | Optimistic locking (version field), transaction isolation, retry on conflict | Claude Code |
| **Inaccurate inventory (>5% error)** | Daily physical count (sample 10%), monthly full audit, correction via ADJUSTMENT | Javier Polo |
| Low adoption (Almacén prefers Excel) | Simple UX (1-click register movement), mobile-friendly, training session | Javier Polo |
| Projection inaccurate (seasonal variation) | Use 6-month window (captures seasonality), Phase 2: seasonal adjustment factors | Claude Code |
| Capital not reduced (still over-purchasing) | Monitor valorization monthly, alert if >baseline +10%, review min_stock settings | Javier Polo |

---

## Notes

**Critical Constraints:**
- F003 (Purchase Tracking) must be implemented for recepción material integration
- F005 (Notificaciones) must be implemented for stock alerts
- Single warehouse only (MVP) - multi-warehouse in Phase 2
- No lot/batch tracking (MVP) - cannot track specific cement batch or steel series

**Assumptions:**
- Materials have defined unit_cost (from F003 purchase orders)
- Almacén performs physical counts monthly (validate accuracy)
- min_stock values defined per material (initial setup required)
- Consumption patterns relatively stable (6-month average valid for 30-day projection)

**Blockers:**
- F003 recepción stage implemented (S009 - internal dependency)
- F005 Gmail API service implemented (S010 - internal dependency)
- Materials catalog with unit_cost (initial data seed)

---

**Last updated:** 2025-12-24 09:05 | Maintained by: Javier Polo + Claude Code
