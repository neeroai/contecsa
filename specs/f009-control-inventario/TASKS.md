# TASKS: Control de Inventario

Version: 1.0 | Date: 2025-12-24 09:20 | Owner: Claude Code | Status: Active

---

## DOING

| ID | Task | DoD | Est |
|----|------|-----|-----|
| - | No active tasks yet | - | - |

---

## TODO (Priority Order - From PLAN.md)

| ID | Task | DoD | Est |
|----|------|-----|-----|
| T001 | Create inventory table migration (Drizzle) | - SQL migration file with 12 fields (id, material_id, material_name, unit, current_stock, min_stock, max_stock, unit_cost, total_value GENERATED, last_reception_date, last_delivery_date, updated_at, version)<br>- total_value = computed column (current_stock × unit_cost)<br>- version field for optimistic locking<br>- Index on material_id<br>- Foreign key to materials table | 2h |
| T002 | Create inventory_movements table migration (Drizzle) | - SQL migration file with 9 fields (id, material_id, movement_type, quantity, unit, purchase_id, project_id, performed_by, notes, timestamp)<br>- movement_type enum (RECEPTION, DELIVERY, ADJUSTMENT)<br>- Index on material_id + timestamp (composite)<br>- Foreign keys to materials, purchases, projects, users | 2h |
| T003 | Implement inventory service CRUD (lib/services/inventory.ts) | - createMovement(movement) → Validates input, creates movement record<br>- getStock(material_id) → Returns current stock + min/max + total_value<br>- getValorization() → Sum all materials total_value (COP)<br>- getRotationDays(material_id) → current_stock / avg_consumption_30d<br>- Type-safe with Drizzle ORM | 3h |
| T004 | Implement stock update logic with optimistic locking | - updateStock(material_id, quantity, movement_type) function<br>- Transaction: 1) Read stock + version (row lock), 2) Calculate new stock, 3) Validate (prevent negative), 4) Update stock + version + 1, 5) Create movement, 6) Check min_stock, 7) Trigger alert if needed<br>- Atomic (all or nothing)<br>- Version conflict → Retry 3x with backoff | 4h |
| T005 | Implement reorder alert service (checkReorder) | - checkReorder() function (called by daily cron)<br>- Query all materials WHERE current_stock <min_stock<br>- Calculate suggested_quantity = (max_stock - current_stock) OR (avg_consumption_30d × 1.5)<br>- Call F005.sendImmediateAlert(STOCK_LOW, material_id, suggested_quantity)<br>- Log alert sent | 2h |
| T006 | Implement projection engine (calculateProjection) | - calculateProjection(material_id) function<br>- Query movements (last 6 months, movement_type = DELIVERY)<br>- Calculate avg_consumption_6m (total quantity / 6)<br>- Predict next 30 days consumption (avg_consumption_6m / 6)<br>- Calculate suggested_purchase = predicted_30d - current_stock (if <min_stock)<br>- Return {predicted_consumption_30d, suggested_purchase_quantity} | 3h |
| T007 | Create inventory dashboard page (app/inventory/page.tsx) | - Table with columns: material, current_stock, min_stock, max_stock, total_value (COP), rotation_days<br>- Highlight row RED if current_stock <min_stock<br>- Footer: Total valorization (sum all total_value)<br>- Sortable columns (click header → sort asc/desc)<br>- Responsive (mobile + desktop)<br>- Load time <2s (test with 100 materials) | 4h |
| T008 | Create movements log page (app/inventory/movements/page.tsx) | - Table with columns: timestamp, material, movement_type, quantity, purchase/project, performed_by, notes<br>- Filters: material (dropdown), date range (picker), movement_type (dropdown)<br>- Pagination (50 rows/page)<br>- Export to Excel button (download as .xlsx)<br>- Load time <2s (test with 1,000 movements) | 4h |
| T009 | Create projection page (app/inventory/projection/page.tsx) | - Material selector (dropdown)<br>- Chart (Recharts): Line chart with 6-month historical consumption + predicted 30 days (dashed line)<br>- KPIs: avg_consumption_6m, predicted_30d, suggested_purchase_quantity<br>- Message if no data: "No hay suficientes datos históricos"<br>- Responsive (mobile + desktop)<br>- Load time <2s | 3h |
| T010 | Implement F003 integration (recepción material hook) | - Hook in F003 RECEPCION stage completion<br>- Extract: material_id, quantity, unit, purchase_id from F003<br>- Call inventory.createMovement(RECEPTION, material_id, quantity, purchase_id)<br>- Update inventory.current_stock + last_reception_date<br>- Test: F003 recepción → Inventory updated automatically | 2h |
| T011 | Implement F005 integration (reorder alert) | - Hook reorder alert trigger (stock <min_stock)<br>- Call F005.sendImmediateAlert(STOCK_LOW, {material, current_stock, min_stock, suggested_quantity})<br>- Email template: Subject = "Alerta de Reorden - {material}", body = details + link to dashboard<br>- Email sent <1 min<br>- Test: Stock <min_stock → Email received | 2h |
| T012 | Implement stock adjustment UI (Admin only) | - app/inventory/[material_id]/adjust/page.tsx<br>- Form: quantity (number), notes (required, max 500 chars)<br>- Submit → createMovement(ADJUSTMENT, material_id, quantity, notes)<br>- Authorization: Only Admin/Gerencia can access<br>- Audit trail: Log ADJUSTMENT movement with user_id + notes | 3h |
| T013 | Write unit tests for stock update logic | - Test: RECEPTION → current_stock += quantity<br>- Test: DELIVERY → current_stock -= quantity<br>- Test: Insufficient stock → ERROR "Stock insuficiente"<br>- Test: Concurrent deliveries (race condition) → Optimistic locking prevents negative stock<br>- Test: Version conflict → Retry 3x<br>- Coverage >80% | 3h |
| T014 | Write unit tests for reorder alert logic | - Test: Stock <min_stock → Trigger alert<br>- Test: Suggested quantity = (max_stock - current_stock)<br>- Test: Suggested quantity = (avg_consumption_30d × 1.5) if no max_stock<br>- Test: Stock >min_stock → No alert<br>- Coverage >80% | 2h |
| T015 | Write unit tests for projection calculation | - Test: 6-month average → Predict 30 days<br>- Test: No historical data → Projection = N/A<br>- Test: Zero consumption → Projection = 0<br>- Test: Seasonal variation (6-month window captures seasonality)<br>- Coverage >80% | 2h |
| T016 | Write unit tests for valorization | - Test: total_value = current_stock × unit_cost<br>- Test: Sum all materials → Total valorization<br>- Test: Unit cost update → Recalculates total_value<br>- Coverage >80% | 1h |
| T017 | Write integration test for movement pipeline | - Test: Full flow: createMovement(RECEPTION) → update stock → check min → trigger alert<br>- Test: Atomic transaction (movement + stock = all or nothing)<br>- Test: Stock update fails → Rollback movement<br>- Test: Alert fails → Stock still updated (non-blocking)<br>- Coverage >80% | 3h |
| T018 | Write integration test for F003 integration | - Test: F003 RECEPCION → createMovement(RECEPTION, purchase_id)<br>- Test: Reception updates current_stock + last_reception_date<br>- Test: Invalid material_id → ERROR<br>- Coverage >80% | 2h |
| T019 | Write integration test for F005 integration | - Test: Stock <min_stock → sendImmediateAlert(STOCK_LOW)<br>- Test: Email sent <1 min<br>- Test: Email includes material, current_stock, min_stock, suggested_quantity<br>- Test: Alert delivery failure → Retry 3x<br>- Coverage >80% | 2h |
| T020 | Write integration test for concurrent movements | - Test: 2 deliveries same time → Optimistic locking: 1 succeeds, 1 retries<br>- Test: 10 concurrent movements → All succeed, stock accurate<br>- Test: Version conflict → Retry 3x with backoff (1s, 5s, 15s)<br>- Coverage >80% | 3h |
| T021 | Write E2E test for US9.1 (register reception from F003) | - F003 triggers RECEPCION<br>- Assert: Movement created (RECEPTION)<br>- Assert: current_stock updated<br>- Assert: last_reception_date updated<br>- Assert: total_value recalculated<br>- Test passes | 2h |
| T022 | Write E2E test for US9.2 (register delivery to project) | - Navigate /inventory → Select material → "Registrar Entrega"<br>- Fill form: quantity, project, notes → Submit<br>- Assert: current_stock reduced<br>- Assert: Movement created (DELIVERY, project_id)<br>- Assert: last_delivery_date updated<br>- Test passes | 2h |
| T023 | Write E2E test for US9.3 (reorder alert) | - Seed DB: current_stock = 2, min_stock = 5<br>- Trigger daily reorder check<br>- Assert: Email sent to Compras<br>- Assert: Subject = "Alerta de Reorden"<br>- Assert: Email body includes suggested_quantity<br>- Assert: Email sent <1 min<br>- Test passes | 2h |
| T024 | Write E2E test for US9.4 (projection dashboard) | - Navigate /inventory/projection → Select material<br>- Assert: Chart displays 6-month history + predicted 30 days<br>- Assert: Suggested purchase quantity shown<br>- Assert: Page load <2s<br>- Test passes | 2h |
| T025 | Write E2E test for US9.5 (valorization dashboard) | - Navigate /inventory<br>- Assert: Table displays all materials with total_value<br>- Assert: Footer shows total valorization (sum)<br>- Assert: Sortable columns work<br>- Assert: Page load <2s<br>- Test passes | 2h |
| T026 | Write E2E test for edge cases | - Test: Insufficient stock → Delivery blocked<br>- Test: Concurrent deliveries → Optimistic locking prevents negative stock<br>- Test: Stock adjustment (Admin only) → Movement created<br>- Test: No historical data → Projection = N/A<br>- Test: Delivery correction within 24h → Reverse + new movement<br>- All 5 tests pass | 3h |
| T027 | Performance test inventory dashboard | - Seed DB: 100 materials with 1,000 movements each<br>- Measure: Dashboard load time <2s<br>- Measure: Movements log load time <2s<br>- Measure: Projection calculation <1s<br>- Optimize if slower | 2h |
| T028 | UAT with Almacén + Compras | - Schedule UAT session with 2 users (Almacén + Compras)<br>- Test: 10 movements (5 receptions, 5 deliveries)<br>- Test: Reorder alert triggered correctly<br>- Test: Projection dashboard (select material, view chart)<br>- Test: Valorization dashboard (view total, sort columns)<br>- Collect feedback (NPS survey)<br>- Sign-off from both users | 4h |
| T029 | Accuracy validation (physical count vs system) | - After 1 month usage: Perform physical count (all materials)<br>- Compare physical count vs system current_stock<br>- Measure accuracy: |physical - system| / physical × 100<br>- Target: >95% accuracy<br>- Document discrepancies, create ADJUSTMENT movements if needed | 3h |
| T030 | Document inventory best practices | - Document: Monthly physical count (sample 10%), quarterly full audit<br>- Document: Stock adjustment workflow (when/how to use ADJUSTMENT)<br>- Document: Min/max stock configuration (how to define per material)<br>- Document: Reorder alert troubleshooting<br>- Update README.md | 2h |

**Total Estimated Time:** 70 hours (~2-3 weeks)

---

## BLOCKED

| ID | Task | Blocker | Notes |
|----|------|---------|-------|
| T010 | F003 integration (recepción material hook) | F003 not fully implemented yet | Can mock F003 RECEPCION event for testing |
| T011 | F005 integration (reorder alert) | F005 not fully implemented yet | Can mock F005.sendImmediateAlert() for testing |

---

## DONE

| ID | Task | Closed | Commit |
|----|------|--------|--------|
| - | Migration to SDD | 2025-12-24 | TBD |

---

**Dependencies:**
- T001-T002 independent (table migrations)
- T003 depends on T001-T002 (tables exist)
- T004 depends on T003 (CRUD functions)
- T005-T006 depend on T003-T004 (stock update + queries)
- T007-T009 depend on T003 (service layer)
- T010 depends on F003 (RECEPCION stage) - BLOCKED
- T011 depends on F005 (sendImmediateAlert) - BLOCKED
- T012 depends on T004 (stock update logic)
- T013-T016 depend on T003-T006 (modules to test)
- T017-T020 depend on T004-T011 (full pipeline)
- T021-T026 depend on T007-T012 (UI + full feature)
- T027-T030 depend on T021-T026 (E2E tests pass first)

**CRITICAL PRIORITY:**
- T029 (Accuracy validation) is CRITICAL success metric - Must achieve >95% accuracy (physical vs system)
- T004 (Stock update with optimistic locking) prevents negative stock race conditions - CRITICAL for data integrity

---

**Last updated:** 2025-12-24 09:20 | Maintained by: Claude Code
