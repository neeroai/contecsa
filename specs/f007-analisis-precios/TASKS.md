# TASKS: Análisis Precios y Detección Anomalías

Version: 1.0 | Date: 2025-12-24 07:50 | Owner: Claude Code | Status: Active

---

## DOING

| ID | Task | DoD | Est |
|----|------|-----|-----|
| - | No active tasks yet | - | - |

---

## TODO (Priority Order - From PLAN.md)

| ID | Task | DoD | Est |
|----|------|-----|-----|
| T001 | Create price_history table migration | - SQL migration file with 10 fields<br>- Indexes on material_id + fecha, proveedor_id + material_id<br>- Foreign keys to materiales, proveedores, facturas | 2h |
| T002 | Create price_anomalies table migration | - 15 fields (factura_id, material_id, precio_factura, baseline_price, deviation_pct, z_score, iqr_result, severity, blocked, alerted, detected_at, resolved_at, resolution)<br>- Index on detected_at, factura_id | 2h |
| T003 | Create price_anomaly_resolutions table migration | - 8 fields (anomaly_id, reviewed_by, decision, justification, reviewed_at)<br>- Foreign key to price_anomalies<br>- Audit trail of manual overrides | 1h |
| T004 | Seed market ranges for 10+ material categories | - SQL seed data<br>- Cemento: 25-45K/50kg, Concreto: 180-350K/m³, Acero: 3.5-5.5M/ton, Agregados: 45-85K/m³<br>- +6 more categories | 2h |
| T005 | Implement baseline calculation (30/60/90 day consensus) | - api/services/price_anomaly/baseline.py<br>- Function: calculate_baseline(material_id, fecha_factura)<br>- Returns weighted average of 3 windows<br>- Handles insufficient data (NEW_MATERIAL flag) | 4h |
| T006 | Implement Z-score calculation | - api/services/price_anomaly/statistical.py<br>- Function: calculate_z_score(precio, historical_prices)<br>- Returns Z-score, thresholds: \|Z\|>2.0/2.5/3.0 = MED/HIGH/CRIT<br>- Handles zero std dev (all prices same) | 2h |
| T007 | Implement IQR outlier detection | - api/services/price_anomaly/statistical.py<br>- Function: calculate_iqr(precio, historical_prices)<br>- Returns {Q1, Q3, IQR, is_outlier, lower_bound, upper_bound}<br>- Deviation thresholds: >10%/20%/30% = MED/HIGH/CRIT | 3h |
| T008 | Implement rules-based detection | - api/services/price_anomaly/rules.py<br>- Function: apply_rules(precio, baseline, market_range)<br>- Checks deviation %, market range, zero/negative price<br>- Returns severity (MED/HIGH/CRIT) | 2h |
| T009 | Implement cross-supplier comparison | - api/services/price_anomaly/cross_supplier.py<br>- Function: compare_suppliers(material_id, proveedor_id, fecha_factura)<br>- Queries top 3 cheapest suppliers<br>- Returns deviation % vs each, suggests switching if >20% | 3h |
| T010 | Implement anomaly detection orchestrator | - api/services/price_anomaly/detector.py<br>- Function: detect_anomaly(factura_id, material_id, proveedor_id, precio, fecha)<br>- Runs baseline → Z-score → IQR → rules → cross-supplier<br>- Returns {anomaly_detected, severity, explanation, recommended_action} | 4h |
| T011 | Implement invoice blocking logic | - api/services/price_anomaly/actions.py<br>- Function: block_invoice(factura_id, anomaly_id, severity)<br>- Sets invoice.blocked = TRUE for HIGH/CRIT<br>- Logs to price_anomalies table | 2h |
| T012 | Implement alert email service | - api/services/price_anomaly/notifications.py<br>- Function: send_alert(anomaly_id, severity, recipients)<br>- Sends email <1min with anomaly details<br>- Escalation: MED → Compras, HIGH → Compras+Gerencia, CRIT → +CEO | 3h |
| T013 | Create email templates for anomaly alerts | - lib/email-templates/price-anomaly/alert-med.tsx<br>- lib/email-templates/price-anomaly/alert-high.tsx<br>- lib/email-templates/price-anomaly/alert-crit.tsx<br>- Include: material, supplier, precio, baseline, deviation %, chart link | 2h |
| T014 | Create price trend chart component (Recharts) | - components/dashboard/PriceTrendChart.tsx<br>- Line chart: 6 months historical + anomalies highlighted red<br>- Interactive tooltip (baseline vs actual)<br>- Responsive design | 4h |
| T015 | Create anomaly list page for admin | - app/admin/anomalies/page.tsx<br>- DataTable with sortable columns<br>- Filters: severity, material, supplier, date range<br>- Color-coded: MED = yellow, HIGH = orange, CRIT = red | 3h |
| T016 | Create anomaly detail page with manual review | - app/admin/anomalies/[id]/page.tsx<br>- Shows: factura details, price comparison, historical chart<br>- Approve/Reject buttons<br>- Justification field (required for approval)<br>- Logs to price_anomaly_resolutions table | 4h |
| T017 | Integrate with F004 (OCR Facturas) | - Hook: When invoice OCR completes → extract price → trigger detect_anomaly()<br>- Pass: factura_id, material_id, proveedor_id, precio_unitario, fecha_factura | 2h |
| T018 | Integrate with F005 (Notificaciones) | - Use Gmail API service from F005<br>- Call send_alert() when anomaly detected<br>- Email templates from T013 | 2h |
| T019 | Integrate with F002 (Dashboard) | - Add anomaly widget to dashboard<br>- Show: count of MED/HIGH/CRIT anomalies (last 30 days)<br>- Click → navigate to /admin/anomalies filtered | 3h |
| T020 | Create dashboard widget for price alerts | - components/dashboard/PriceAnomaliesWidget.tsx<br>- Badge: red if CRIT, orange if HIGH, yellow if MED<br>- Top 5 anomalies by severity | 2h |
| T021 | Write unit tests for baseline calculation | - Test: 30/60/90 day consensus = weighted average<br>- Test: Insufficient data (<30 days) → NEW_MATERIAL flag<br>- Test: Handles sparse data (missing dates)<br>- Coverage >80% | 2h |
| T022 | Write unit tests for Z-score calculation | - Test: \|Z\|=2.0/2.5/3.0 → MED/HIGH/CRIT<br>- Test: Handles zero std dev<br>- Test: Negative deviation flagged if <-20%<br>- Coverage >80% | 2h |
| T023 | Write unit tests for IQR outlier detection | - Test: Deviation >10%/20%/30% → MED/HIGH/CRIT<br>- Test: Calculates Q1, Q3, IQR correctly<br>- Test: Handles small sample sizes<br>- Coverage >80% | 2h |
| T024 | Write unit tests for rules-based detection | - Test: Market range violations → HIGH<br>- Test: Zero/negative price → CRITICAL<br>- Test: Deviation +10-15%/15-30%/>30% → MED/HIGH/CRIT<br>- Coverage >80% | 2h |
| T025 | Write unit tests for cross-supplier comparison | - Test: Queries top 3 cheapest suppliers<br>- Test: Deviation >10%/20% → MED/HIGH<br>- Test: Suggests switching supplier<br>- Coverage >80% | 2h |
| T026 | Write integration tests for full detection pipeline | - Test: Baseline → Z-score → IQR → Rules → Cross-supplier → Consensus<br>- Test: Multi-algorithm consensus (max severity)<br>- Test: Explanation generated correctly<br>- Coverage >80% | 3h |
| T027 | Write integration tests for invoice blocking | - Test: HIGH/CRIT anomalies → invoice.blocked = TRUE<br>- Test: MED anomalies → manual_review = TRUE (no auto-block)<br>- Test: Logs to price_anomalies table<br>- Coverage >80% | 2h |
| T028 | Write integration tests for alert email sending | - Test: Email sent <1min<br>- Test: Escalation: MED → Compras, HIGH → +Gerencia, CRIT → +CEO<br>- Test: Email includes anomaly details, chart link<br>- Coverage >80% | 2h |
| T029 | Write E2E test: Caso Cartagena simulation | - **CRITICAL TEST**<br>- Seed price_history: concreto baseline $300K/m³<br>- Submit 3 invoices: $345K (+15%), $360K (+20%), $350K (+17%)<br>- Assert: All 3 detected as HIGH, all blocked, emails sent within 1min<br>- Metric: Detection rate = 100% | 4h |
| T030 | Write E2E tests for normal/moderate/critical scenarios | - Normal price (within 10%) → no alert<br>- Moderate anomaly (10-15%) → MED, manual review<br>- Critical anomaly (>30%) → CRIT, blocked, CEO alerted<br>- All scenarios pass | 4h |
| T031 | Write E2E tests for edge cases | - New material (no historical data) → NEW_MATERIAL flag<br>- Seasonal variation (+12%) → no false positive<br>- Supplier switch → SUPPLIER_SWITCH flag<br>- Market-wide shock → MARKET_SHIFT detected<br>- OCR error ($999M) → OCR_ERROR flag | 4h |
| T032 | Performance test detection pipeline | - Measure: Baseline calculation with 1,000 data points → <100ms<br>- Measure: Full detection pipeline → <1min (from OCR to alert sent)<br>- Optimize if >1min | 2h |
| T033 | UAT with Jefe Compras + Gerencia | - Schedule UAT session<br>- Test with 10 real invoices (5 normal, 5 anomalous)<br>- Validate false positive rate <5%<br>- Collect feedback + sign-off | 4h |
| T034 | Calibrate thresholds based on UAT feedback | - Adjust 10%/20%/30% thresholds if false positive rate >5%<br>- Tune Z-score thresholds (2.0/2.5/3.0) based on real data distribution<br>- Document final thresholds in ADR.md | 2h |

**Total Estimated Time:** 87 hours (~3-4 weeks)

---

## BLOCKED

| ID | Task | Blocker | Notes |
|----|------|---------|-------|
| T017 | Integrate with F004 (OCR Facturas) | F004 not implemented yet | Can mock OCR data for testing |
| T018 | Integrate with F005 (Notificaciones) | F005 Gmail API not set up yet | Can use console log fallback |

---

## DONE

| ID | Task | Closed | Commit |
|----|------|--------|--------|
| - | Migration to SDD | 2025-12-24 | TBD |

---

**Dependencies:**
- T001-T004 independent (can run in parallel)
- T005-T009 depend on T001 (price_history table must exist)
- T010 depends on T005-T009 (all detection modules)
- T011-T012 depend on T010 (detector module)
- T013 depends on T012 (email service)
- T014-T016 depend on T002 (price_anomalies table)
- T017 depends on F004 (OCR Facturas) - BLOCKED
- T018 depends on F005 (Notificaciones) - BLOCKED
- T019-T020 depend on T010 (detector module)
- T021-T028 depend on T005-T012 (modules to test)
- T029-T031 depend on T010-T016 (full feature)
- T032-T034 depend on T029-T031 (E2E tests pass first)

**CRITICAL PRIORITY:**
- T029 (Caso Cartagena simulation) is CRITICAL success metric - Must pass 100% detection rate for >15% deviations
