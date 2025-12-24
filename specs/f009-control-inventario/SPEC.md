# SPEC: Control de Inventario

Version: 1.0 | Date: 2025-12-24 09:00 | Owner: Javier Polo | Status: Active

---

## Problem

**Current Workflow:** Sin control digital de inventario (Excel/papel manual) → Desconocimiento de stock real → Compras urgentes innecesarias → Materiales vencidos/dañados en bodega no detectados → Entregas a proyectos no registradas → Pérdidas no contabilizadas → Auditorías físicas vs sistema desactualizadas.

**Impact:** Capital inmovilizado en inventario innecesario. Compras urgentes costosas (pedidos pequeños, precios altos). Materiales vencidos/dañados → pérdidas. No visibilidad de stock → proyectos sin materiales → retrasos.

---

## Objective

**Primary Goal:** Sistema de control de inventario en tiempo real con seguimiento de entradas (recepción), salidas (entregas a proyectos), stock mínimo, alertas de reorden automáticas, y proyección de necesidades basada en consumo histórico para evitar desabastecimientos y optimizar capital de trabajo.

**Success Metrics:**
- Reducción 30% capital inmovilizado en inventario (comprar solo necesario)
- Reducción 80% compras urgentes (proyección proactiva de necesidades)
- Reducción 95% pérdidas por vencimiento/daño (visibilidad stock antiguo)
- Exactitud inventario >95% (físico vs sistema)
- Time to stock query <2s (consulta disponibilidad material)

---

## Scope

| In | Out |
|---|---|
| Registro entradas (recepciones desde F003) | Barcode/RFID scanning (Phase 2) |
| Registro salidas (entregas a proyectos) | Automated inventory counting (drones/sensors) |
| Stock actual en tiempo real | Multi-warehouse inventory (single bodega MVP) |
| Stock mínimo + alertas reorden automáticas | Lot/batch tracking (lote cemento, serie acero) |
| Proyección necesidades (consumo histórico 6 meses) | AI/ML forecasting (Phase 2 - simple heuristic MVP) |
| Valorización inventario (stock × costo unitario) | Expiration tracking (fecha vencimiento) |
| Dashboard inventario (Gerencia, Compras, Almacén) | Transfer between warehouses |
| Integration F003 (recepción material), F005 (alertas) | Integration ERP externo (SAP, Oracle) |

---

## Contracts

### Input (Register Movement)

| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| material_id | uuid | Y | Material catalog ID |
| movement_type | enum | Y | RECEPTION\|DELIVERY\|ADJUSTMENT |
| quantity | decimal | Y | Quantity moved (positive = in, negative = out) |
| unit | string | Y | m³, kg, ton, unit |
| purchase_id | uuid | N | Required if movement_type = RECEPTION |
| project_id | uuid | N | Required if movement_type = DELIVERY |
| performed_by | uuid | Y | User ID (Almacén) |
| notes | string | N | Optional notes (e.g., "Damaged items") |

### Output (Stock Updated)

| Field | Type | Condition | Notes |
|-------|------|-----------|-------|
| inventory_id | uuid | Always | Inventory record ID |
| current_stock | decimal | Always | Updated stock after movement |
| total_value | decimal | Always | current_stock × unit_cost (COP) |
| reorder_triggered | boolean | Always | TRUE if stock < min_stock (alert sent) |
| movement_id | uuid | Always | inventory_movements record ID |

---

## Business Rules

- **Stock Update:** Reception (RECEPTION) → current_stock += quantity | Delivery (DELIVERY) → current_stock -= quantity
- **Stock Minimum:** If current_stock < min_stock → Trigger reorder alert (F005 email to Compras)
- **Reorder Quantity:** Suggested quantity = (max_stock - current_stock) OR (avg_consumption_30d × 1.5)
- **Stock Validation:** Cannot deliver if current_stock < delivery_quantity → Error "Stock insuficiente"
- **Valorización:** total_value = current_stock × unit_cost (recalculated on every movement)
- **Audit Trail:** All movements logged to inventory_movements table (immutable log)
- **Stock Adjustment:** Only Admin/Gerencia can create ADJUSTMENT movements (manual corrections)
- **Projection:** Analyze last 6 months consumption → Predict next 30 days needs → Suggest proactive purchases
- **Rotación Inventario:** rotation_days = (current_stock / avg_consumption_30d) → Alert if >90 days (slow-moving)
- **Last Updated:** updated_at timestamp on every movement (real-time sync)

---

## Edge Cases

| Scenario | Handling | Notes |
|----------|----------|-------|
| Negative stock (overselling) | Prevent delivery if current_stock < quantity → Error "Stock insuficiente, actual: {current_stock}" | Hard constraint |
| New material (no inventory record) | Create inventory record with current_stock = 0, min_stock = 0 → First reception initializes | Auto-create on first movement |
| Stock adjustment (physical count) | Only Admin/Gerencia can create ADJUSTMENT movement → Requires justification (notes mandatory) | Audit trail |
| Delivery to wrong project | Allow correction within 24h (reverse movement + new movement) → Log both for audit | Manual correction |
| Material damaged/lost | ADJUSTMENT movement with negative quantity → notes = "Dañado/perdido: {reason}" | Track losses |
| Concurrent movements (race condition) | Optimistic locking (version field) → If conflict, retry with latest stock | Prevent negative stock race |
| No historical data (new material) | Projection = N/A → Suggest manual min_stock definition → Alert if stock < min_stock | Cannot project without history |
| Seasonal consumption variation | Projection uses 6-month window (captures seasonality) → Adjust min_stock by season (e.g., aggregados higher in rainy season) | Phase 2 enhancement |
| Multi-project delivery (split quantity) | Allow single delivery movement with multiple project allocations → Log in delivery_allocations table (Phase 2) | MVP: 1 delivery = 1 project |

---

## Observability

**Logs:**
- `inventory_movement_created` (info) - Movement type, material, quantity, project/purchase, user
- `stock_updated` (info) - Material, previous_stock, new_stock, total_value
- `reorder_alert_triggered` (warn) - Material, current_stock, min_stock, suggested_quantity, email sent
- `stock_insufficient` (error) - Delivery blocked, material, requested_quantity, current_stock
- `projection_calculated` (info) - Material, consumption_6m, predicted_30d, suggested_purchase
- `slow_moving_stock_detected` (warn) - Material, rotation_days >90, suggest clearance/discount

**Metrics:**
- `inventory_movements_total` - Count by movement_type (RECEPTION, DELIVERY, ADJUSTMENT)
- `inventory_value_total_cop` - Total valorization (sum all materials)
- `stock_below_min_count` - Materials currently below min_stock (target <5)
- `reorder_alerts_triggered_count` - Automatic alerts sent (per day)
- `stock_insufficient_errors_count` - Delivery attempts blocked (target <5/month)
- `inventory_accuracy_pct` - Physical count vs system (target >95%)
- `rotation_days_p50` - Median inventory rotation (target <60 days)

**Traces:**
- `inventory_movement` (span) - Full flow: create movement → update stock → check min → send alert
- `projection_calculation` (span) - Analyze 6 months → predict 30 days → suggest purchase

---

## Definition of Done

- [ ] Code review approved
- [ ] inventory + inventory_movements tables created (PostgreSQL)
- [ ] Register reception (RECEPTION) updates stock correctly
- [ ] Register delivery (DELIVERY) validates stock, prevents negative
- [ ] Stock minimum alerts trigger (email to Compras via F005)
- [ ] Reorder quantity suggested (based on max_stock or avg_consumption)
- [ ] Projection calculates next 30 days needs (6-month historical)
- [ ] Valorización calculated (current_stock × unit_cost)
- [ ] Stock query <2s (dashboard performance)
- [ ] Audit trail (all movements logged, immutable)
- [ ] Dashboard inventario (Gerencia, Compras, Almacén roles)
- [ ] Integration with F003 (recepción material updates inventory)
- [ ] Integration with F005 (stock alerts email)
- [ ] **CRITICAL:** Exactitud inventario >95% (physical count vs system after 1 month)
- [ ] **CRITICAL:** Reducción 30% capital inmovilizado (vs baseline Excel)
- [ ] Quality gates pass (format, lint, types, tests 80%+, build)
- [ ] Deployed to staging
- [ ] UAT with Almacén + Compras (10 movements: 5 in, 5 out)

---

**Related:** F003 (Purchase Tracking - recepción material), F005 (Notificaciones - stock alerts), F010 (Proyección Financiera - capital inmovilizado) | **Dependencies:** PostgreSQL inventory tables, F003 purchases integration, F005 Gmail API

**Original PRD:** docs/features/r09-control-inventario.md
