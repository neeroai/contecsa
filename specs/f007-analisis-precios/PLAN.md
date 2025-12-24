# SDD Implementation Plan: Análisis Precios y Detección Anomalías

Version: 1.0 | Date: 2025-12-24 07:35 | Owner: Javier Polo | Status: Active

---

## Reference

**SPEC:** /specs/f007-analisis-precios/SPEC.md
**ADR:** /specs/f007-analisis-precios/ADR.md (Statistical vs ML-only approach)
**PRD:** docs/features/r07-analisis-precios.md
**CRITICAL:** Prevent Caso Cartagena (3 facturas +15-20% inadvertidas 2 meses)

---

## Stack Validated

**Statistical Libraries:** NumPy + Pandas + SciPy (Python 3.11+)
- Source: /Users/mercadeo/neero/docs-global/stack/common-stack.md:80-85
- Use case: Z-score, IQR, baseline calculation, cross-supplier comparison

**Backend:** Python 3.11+ FastAPI (price_anomaly service)
- Source: contecsa/CLAUDE.md:34-35 ("Python herramienta más poderosa para análisis datos")
- Module: api/services/price_anomaly.py

**Database:** PostgreSQL 15 (price_history table)
- Source: /Users/mercadeo/neero/docs-global/stack/database-guide.md:15-25
- Tables: price_history, price_anomalies, price_anomaly_resolutions

**Charts:** Recharts (price trend visualization)
- Source: /Users/mercadeo/neero/docs-global/stack/common-stack.md:60-65
- Integration: F002 (Dashboard) - ADR: specs/f002-dashboard/ADR.md

**Email:** Gmail API (anomaly alerts)
- Source: /Users/mercadeo/neero/docs-global/stack/common-stack.md:65-70
- Integration: F005 (Notificaciones)

**Validation Checklist:**
- [x] Stack matches docs-global/stack/ (5 citations)
- [x] NO INVENTAR protocol applied
- [x] ClaudeCode&OnlyMe filter passed (see ADR.md)
- [x] Dependencies: F004 (OCR price extraction), F005 (alerts), F002 (dashboard), F006 (historical data from SICOM)
- [x] Limitations: Statistical only (no ML Phase 1), manual override required (no auto-rejection)

---

## Implementation Steps (15 steps)

### S001: Create price_history table migration
**Deliverable:** SQL migration with price_history table (10 fields: id, material_id, proveedor_id, precio_unitario, cantidad, unidad, fecha, proyecto_id, factura_id, created_at)
**Dependencies:** PostgreSQL connection
**Acceptance:** Table created, indexes on material_id + fecha, proveedor_id + material_id, foreign keys enforced

### S002: Create price_anomalies table migration
**Deliverable:** SQL migration for anomaly log (15 fields: id, factura_id, material_id, proveedor_id, precio_factura, baseline_price, deviation_pct, z_score, iqr_result, severity, blocked, alerted, detected_at, resolved_at, resolution)
**Dependencies:** S001 (price_history table)
**Acceptance:** Table created, index on detected_at, factura_id

### S003: Create price_anomaly_resolutions table migration
**Deliverable:** SQL migration for manual review decisions (8 fields: id, anomaly_id, reviewed_by, decision, justification, reviewed_at)
**Dependencies:** S002 (price_anomalies table)
**Acceptance:** Foreign key to price_anomalies, audit trail of manual overrides

### S004: Seed market ranges for material categories
**Deliverable:** SQL seed data with predefined price ranges (Cemento: 25-45K/50kg, Concreto: 180-350K/m³, Acero: 3.5-5.5M/ton, Agregados: 45-85K/m³, +6 more categories)
**Dependencies:** None
**Acceptance:** 10+ material categories seeded with min/max prices

### S005: Implement baseline calculation (30/60/90 day consensus)
**Deliverable:** api/services/price_anomaly/baseline.py with calculate_baseline(material_id, fecha_factura)
**Dependencies:** S001 (price_history table)
**Acceptance:** Returns weighted average of 3 windows, handles insufficient data (NEW_MATERIAL flag)

### S006: Implement Z-score calculation
**Deliverable:** api/services/price_anomaly/statistical.py with calculate_z_score(precio, historical_prices)
**Dependencies:** NumPy, SciPy
**Acceptance:** Returns Z-score, thresholds: |Z|>2.0 = MED, >2.5 = HIGH, >3.0 = CRIT

### S007: Implement IQR outlier detection
**Deliverable:** api/services/price_anomaly/statistical.py with calculate_iqr(precio, historical_prices)
**Dependencies:** NumPy
**Acceptance:** Returns {Q1, Q3, IQR, is_outlier, lower_bound, upper_bound}, deviation thresholds: >10%/20%/30% = MED/HIGH/CRIT

### S008: Implement rules-based detection
**Deliverable:** api/services/price_anomaly/rules.py with apply_rules(precio, baseline, market_range)
**Dependencies:** S004 (market ranges)
**Acceptance:** Checks deviation %, market range, zero/negative price, returns severity

### S009: Implement cross-supplier comparison
**Deliverable:** api/services/price_anomaly/cross_supplier.py with compare_suppliers(material_id, proveedor_id, fecha_factura)
**Dependencies:** S001 (price_history table)
**Acceptance:** Queries top 3 cheapest suppliers, returns deviation % vs each, suggests switching if >20%

### S010: Implement anomaly detection orchestrator
**Deliverable:** api/services/price_anomaly/detector.py with detect_anomaly(factura_id, material_id, proveedor_id, precio, fecha)
**Dependencies:** S005-S009 (all detection modules)
**Acceptance:** Runs baseline → Z-score → IQR → rules → cross-supplier, returns {anomaly_detected, severity, explanation, recommended_action}

### S011: Implement invoice blocking logic
**Deliverable:** api/services/price_anomaly/actions.py with block_invoice(factura_id, anomaly_id, severity)
**Dependencies:** S010 (detector)
**Acceptance:** Sets invoice.blocked = TRUE for HIGH/CRIT, logs to price_anomalies table

### S012: Implement alert email service
**Deliverable:** api/services/price_anomaly/notifications.py with send_alert(anomaly_id, severity, recipients)
**Dependencies:** Gmail API (F005)
**Acceptance:** Sends email <1min with anomaly details, escalation: MED → Compras, HIGH → Compras+Gerencia, CRIT → Compras+Gerencia+CEO

### S013: Create price trend chart component
**Deliverable:** components/dashboard/PriceTrendChart.tsx with Recharts line chart (6 months historical + anomalies highlighted red)
**Dependencies:** Recharts library
**Acceptance:** Interactive chart, tooltip shows baseline vs actual, anomalies flagged with red dots

### S014: Create manual review UI
**Deliverable:** app/admin/anomalies/[id]/page.tsx with approve/reject buttons, justification field, historical chart
**Dependencies:** S013 (price chart), S003 (resolutions table)
**Acceptance:** Jefe Compras/Gerencia can approve override with justification, logs to audit

### S015: Integration testing + Caso Cartagena simulation
**Deliverable:** E2E test simulating 3 invoices +15-20% deviation → HIGH alerts → blocked → manual review
**Dependencies:** S001-S014 (full feature)
**Acceptance:** Detection rate 100% for >15% deviations, false positive rate <5%, UAT with Jefe Compras (10 invoices: 5 normal, 5 anomalous)

---

## Milestones

**M1 - Data Layer + Detection:** [S001-S004] | Target: Week 1 (DB schema + market ranges)
**M2 - Statistical Algorithms:** [S005-S009] | Target: Week 2 (Baseline + Z-score + IQR + Rules + Cross-supplier)
**M3 - Actions + Alerts:** [S010-S012] | Target: Week 3 (Detector + Blocking + Emails)
**M4 - UI + Integration:** [S013-S015] | Target: Week 4 (Charts + Manual review + Caso Cartagena test)

---

## Risk Mitigation

| Risk | Mitigation | Owner |
|------|-----------|-------|
| **False positives >5% (alert fatigue)** | Multi-algorithm consensus (Z-score AND IQR AND rules), 90-day baseline (seasonal variation), cross-supplier comparison (market validation) | Claude Code |
| **Missed anomalies <15% (Caso Cartagena)** | Aggressive thresholds (IQR >10% = MED), rules-based backstop (market ranges), alert escalation to CEO | Claude Code |
| Insufficient historical data (new materials) | Fallback to 3-supplier comparison + manual approval, flag "NEW_MATERIAL" | Claude Code |
| Market-wide price shocks (false positives) | Detect "MARKET_SHIFT" (all suppliers anomalous) → manual review vs external data (DANE), no auto-block | Javier Polo |
| Manual override abuse | Track override rate per user, alert admin if >20%, quarterly audit required | Javier Polo |
| Performance (slow baseline calculation) | Index on material_id + fecha, cache baselines 24h, pre-calculate for common materials | Claude Code |
| OCR price extraction errors | Pre-validation: price >0 and <100M COP, flag "OCR_ERROR" if suspicious, manual review | Claude Code |

---

## Notes

**Critical Constraints:**
- F004 (OCR Facturas) must be implemented to extract prices from invoices
- F005 (Notificaciones) must be implemented for email alerts
- F002 (Dashboard) integration required for price trend charts
- F006 (ETL SICOM) provides historical data for baseline calculation

**Assumptions:**
- Minimum 30 days historical data required for baseline
- Market price ranges manually curated (10+ categories)
- Manual override required for ALL blocked invoices (no auto-rejection)
- Jefe Compras or Gerencia can approve overrides (role-based permissions)

**Blockers:**
- Historical price data from SICOM (F006 ETL must run first)
- Gmail API credentials for alerts (F005 dependency)
- Material catalog with category mapping (for market ranges)

---

**Last updated:** 2025-12-24 07:35 | Maintained by: Javier Polo + Claude Code
