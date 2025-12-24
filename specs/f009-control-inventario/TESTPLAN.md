# Test Plan: Control de Inventario

Version: 1.0 | Date: 2025-12-24 09:15 | Owner: Claude Code | Status: Active

---

## Reference

**SDD Version:** 1.0 | **Feature:** Control de Inventario (F009) | **Scope:** Unit + Integration + E2E | **Coverage Target:** 80% (stock update, movements, projection, alerts)

---

## Test Strategy

**Philosophy:** 80% coverage on inventory service (stock updates, movements, alerts, projection). **CRITICAL:** Exactitud inventario >95% (physical vs system), prevent negative stock (race conditions), reorder alerts <1 min. Unit tests verify stock update logic, optimistic locking, projection calculation. Integration tests verify full movement pipeline (create movement → update stock → check min → trigger alert). E2E tests verify all 5 user stories (register reception, register delivery, reorder alert, projection, valorization dashboard). Performance tests verify stock query <2s.

**Critical Paths:**
1. Register reception (F003 integration) → Create RECEPTION movement → Update current_stock → Check min_stock → Trigger alert if needed
2. Register delivery → Validate stock available → Create DELIVERY movement → Update current_stock (atomic)
3. Reorder alert trigger → Check all materials <min_stock → Calculate suggested_quantity → Send email (F005) <1 min
4. Projection calculation → Analyze 6-month consumption → Predict next 30 days → Suggest proactive purchase

---

## Unit Tests

| Module | Test Cases | Tool | Status |
|--------|-----------|------|--------|
| Stock update (inventory.ts) | - Register RECEPTION → current_stock += quantity<br>- Register DELIVERY → current_stock -= quantity<br>- Delivery with insufficient stock → ERROR "Stock insuficiente"<br>- Concurrent deliveries (race condition) → Optimistic locking prevents negative stock<br>- Stock adjustment (ADJUSTMENT) → Updates stock + logs justification | Vitest + PostgreSQL test DB | TODO |
| Reorder alert (inventory.ts) | - Stock <min_stock → Trigger reorder alert<br>- Suggested quantity = (max_stock - current_stock)<br>- Suggested quantity = (avg_consumption_30d × 1.5) if no max_stock<br>- Stock >min_stock → No alert triggered | Vitest | TODO |
| Projection (inventory.ts) | - 6-month consumption average → Predict next 30 days<br>- New material (no history) → Projection = N/A<br>- Seasonal variation (6-month window) → Captures seasonality<br>- Zero consumption → Projection = 0 (slow-moving stock) | Vitest | TODO |
| Valorization (inventory.ts) | - total_value = current_stock × unit_cost (computed column)<br>- Sum all materials → Total inventory valorization<br>- Unit cost update → Recalculates total_value | Vitest + PostgreSQL | TODO |
| Rotation days (inventory.ts) | - rotation_days = current_stock / avg_consumption_30d<br>- rotation_days >90 → Slow-moving stock alert<br>- Zero consumption → rotation_days = Infinity (alert) | Vitest | TODO |

---

## Integration Tests

| Component | Test Cases | Tool | Status |
|-----------|-----------|------|--------|
| Movement pipeline (inventory.ts) | - Full flow: createMovement(RECEPTION) → update current_stock → check min_stock → trigger alert (if needed)<br>- Atomic transaction: Movement created + stock updated (all or nothing)<br>- Movement created but stock update fails → Rollback movement<br>- Stock update succeeds, alert fails → Stock still updated (non-blocking) | Vitest + PostgreSQL test DB | TODO |
| F003 integration (recepción material) | - F003 RECEPCION stage → Trigger createMovement(RECEPTION, purchase_id)<br>- Reception creates movement → Updates inventory.current_stock<br>- Reception with invalid material_id → ERROR<br>- Reception updates last_reception_date | Vitest + mocked F003 event | TODO |
| F005 integration (reorder alert) | - Stock <min_stock → Trigger sendImmediateAlert(STOCK_LOW)<br>- Email sent to Compras <1 min<br>- Email includes: material, current_stock, min_stock, suggested_quantity, link to inventory dashboard<br>- Alert delivery failure → Retry 3x, log error | Vitest + mocked F005 service | TODO |
| Concurrent movement handling | - 2 deliveries same time (race condition) → Optimistic locking: 1 succeeds, 1 retries with updated stock<br>- 10 concurrent movements → All succeed, stock accurate<br>- Version conflict → Retry 3x with exponential backoff (1s, 5s, 15s) | Vitest + parallel execution | TODO |
| Stock adjustment (manual correction) | - Admin creates ADJUSTMENT movement → Stock updated, notes mandatory<br>- Non-admin attempts ADJUSTMENT → ERROR "Unauthorized"<br>- Adjustment with no notes → ERROR "Notes required for adjustment" | Vitest + role-based auth | TODO |

---

## E2E Tests (Playwright)

**Setup:** `bun test:e2e` | **Environment:** Staging with test data

**Happy Paths:**

1. **US9.1 - Almacén registers material reception (from F003):**
   - F003 triggers RECEPCION (purchase completed)
   - Assert: Inventory movement created (movement_type = RECEPTION)
   - Assert: current_stock updated (previous + quantity)
   - Assert: last_reception_date updated
   - Assert: total_value recalculated (current_stock × unit_cost)
   - Assert: Movement log shows purchase_id, user_id, timestamp

2. **US9.2 - Almacén registers material delivery to project:**
   - Navigate to /inventory
   - Select material (e.g., "Concreto 3000 PSI")
   - Click "Registrar Entrega"
   - Fill form: quantity = 5 m³, project = "PAVICONSTRUJC", notes = "Entrega parcial"
   - Submit
   - Assert: current_stock reduced (previous - 5)
   - Assert: Movement created (DELIVERY, project_id)
   - Assert: last_delivery_date updated
   - Assert: total_value recalculated

3. **US9.3 - Compras receives reorder alert (stock <min_stock):**
   - Seed DB: Material with current_stock = 2, min_stock = 5
   - Trigger daily reorder check (cron job)
   - Assert: Email sent to Compras (liced@contecsa.com)
   - Assert: Subject = "Alerta de Reorden - Concreto 3000 PSI"
   - Assert: Email body includes:
     - Current stock: 2 m³
     - Minimum stock: 5 m³
     - Suggested purchase quantity: 8 m³ (max_stock 10 - current_stock 2)
     - Link to inventory dashboard
   - Assert: Email sent <1 min from trigger

4. **US9.4 - Técnico views inventory projection (next 30 days):**
   - Navigate to /inventory/projection
   - Select material (e.g., "Acero corrugado")
   - Assert: Chart displays:
     - 6-month consumption history (line chart)
     - Predicted next 30 days consumption
     - Suggested purchase quantity (if stock will fall <min_stock)
   - Assert: Prediction accuracy (based on 6-month average)
   - Assert: Page load <2s

5. **US9.5 - Gerencia views inventory valorization dashboard:**
   - Navigate to /inventory
   - Assert: Table displays all materials with:
     - Material name
     - Current stock
     - Min stock (highlight if stock <min_stock in red)
     - Total value (COP)
     - Rotation days
   - Assert: Footer shows total inventory valorization (sum all materials)
   - Assert: Sortable columns (click column header → sort asc/desc)
   - Assert: Page load <2s

**Edge Case Tests:**

6. **Delivery with insufficient stock:**
   - Seed DB: Material with current_stock = 2 m³
   - Attempt delivery: quantity = 5 m³
   - Assert: Error message "Stock insuficiente, actual: 2 m³"
   - Assert: Delivery blocked (not created)
   - Assert: Stock unchanged (still 2 m³)

7. **Concurrent deliveries (race condition):**
   - Seed DB: Material with current_stock = 10 m³
   - Simulate 2 concurrent deliveries (quantity = 6 m³ each)
   - Assert: First delivery succeeds (stock → 4 m³)
   - Assert: Second delivery fails (stock 4 <6 → ERROR "Stock insuficiente")
   - Assert: Optimistic locking prevents negative stock

8. **Stock adjustment (manual correction by Admin):**
   - Navigate to /inventory (as Admin)
   - Select material
   - Click "Ajustar Stock"
   - Fill form: quantity = -3 (damaged items), notes = "Concreto dañado por lluvia"
   - Submit
   - Assert: Movement created (ADJUSTMENT, quantity = -3)
   - Assert: current_stock reduced by 3
   - Assert: Notes logged for audit
   - Assert: Non-admin cannot access "Ajustar Stock" button

9. **Projection with no historical data (new material):**
   - Navigate to /inventory/projection
   - Select new material (no movements in last 6 months)
   - Assert: Message "No hay suficientes datos históricos para proyectar"
   - Assert: Suggestion: "Define stock mínimo manualmente"

10. **Delivery to wrong project (correction within 24h):**
    - Register delivery to wrong project (Project A instead of Project B)
    - Within 24h: Navigate to movement log
    - Click "Corregir"
    - Assert: Reverse movement created (DELIVERY, quantity = -5, project A)
    - Assert: New delivery created (DELIVERY, quantity = 5, project B)
    - Assert: Both movements logged for audit trail

**Performance Tests:**
- Stock query (dashboard) <2s (10 materials with 1,000 movements each)
- Movement creation <500ms (create movement + update stock + check min)
- Projection calculation <1s (analyze 6 months, predict 30 days)
- Reorder alert <1 min (check all materials + send email)
- Concurrent movements (10 parallel) <3s (all succeed, no race conditions)

---

## Quality Gates CI

| Gate | Command | Target | Status |
|------|---------|--------|--------|
| Format | `bun run format --check` | 100% | TODO |
| Lint | `bun run lint` | 0 errors | TODO |
| Types | `bun run typecheck` | 0 errors | TODO |
| Unit | `bun run test` (lib/services/inventory.test.ts) | 80%+ | TODO |
| Build | `bun run build` | Exit 0 | TODO |
| E2E | `bun test:e2e` (10 scenarios) | All 10 tests pass | TODO |

---

## Manual Testing Checklist

- [ ] **CRITICAL:** Exactitud inventario >95% (physical count vs system after 1 month usage)
- [ ] **CRITICAL:** Negative stock prevented (concurrent deliveries tested, optimistic locking works)
- [ ] **CRITICAL:** Reorder alerts <1 min (stock <min_stock → email sent)
- [ ] F003 integration working (recepción material updates inventory automatically)
- [ ] F005 integration working (reorder alert emails sent correctly)
- [ ] Stock updates atomic (movement created + stock updated = all or nothing)
- [ ] Valorization accurate (total_value = current_stock × unit_cost, sum correct)
- [ ] Projection accurate (6-month average predicts next 30 days within ±20%)
- [ ] Rotation days calculated correctly (current_stock / avg_consumption_30d)
- [ ] Slow-moving stock detected (rotation_days >90 → alert)
- [ ] Dashboard responsive (mobile + desktop, <2s load time)
- [ ] Movements log paginated (50 rows/page, filters work)
- [ ] Excel export working (download movements log as .xlsx)
- [ ] Stock adjustment restricted to Admin/Gerencia only
- [ ] Audit trail complete (all movements logged, immutable)
- [ ] Error handling graceful (insufficient stock → clear message, retry on version conflict)
- [ ] UAT with Almacén + Compras (10 movements: 5 receptions, 5 deliveries)

---

**Token-efficient format:** 60 lines | 10 E2E scenarios | 80%+ coverage target | CRITICAL: >95% accuracy + negative stock prevention + <1 min alerts
