# SPEC: Análisis Precios y Detección Anomalías

Version: 1.0 | Date: 2025-12-24 07:30 | Owner: Javier Polo | Status: Active

---

## Problem

**Caso Cartagena (Q1 2025):** 3 facturas de concreto con sobrecobro +15-20% vs histórico pasaron inadvertidas durante 2 meses. Impacto financiero significativo. Causa raíz: Proceso manual Excel + ausencia de Liced Vega + sin validación automática de precios. Precios de construcción varían 5-15% mensual (inflación, mercado), sin herramienta de detección → sobrecobros no detectados.

---

## Objective

**Primary Goal:** Sistema de detección automática de anomalías en precios de materiales de construcción mediante análisis estadístico histórico (Z-score, IQR, cross-supplier comparison) que bloquea facturas con desviaciones >10% y alerta inmediato a Jefe Compras + Gerencia.

**Success Metrics (CRITICAL - Prevent Caso Cartagena):**
- 100% detection rate for deviations >15% (Caso Cartagena threshold)
- <5% false positive rate (minimize manual review burden)
- Detection time <1 minute (from invoice OCR to alert sent)
- Prevent 1+ Caso Cartagena per year (ROI >500% vs $5M/año dev cost)
- Resolution time <24 hours (from detection to decision: approve override or reject)
- NPS usuarios >80 (Compras, Gerencia, Contabilidad)

---

## Scope

| In | Out |
|---|---|
| Statistical anomaly detection (Z-score, IQR, rules-based) | Pure machine learning (Isolation Forest) - Phase 2 |
| Baseline calculation (30/60/90 day historical windows) | External market data integration (DANE) - Phase 2 |
| Cross-supplier comparison (cheapest 3 alternatives) | Supplier scoring/ranking - Phase 2 |
| Automatic invoice blocking on HIGH/CRIT anomalies | Predictive price alerts - Phase 2 |
| Email + dashboard alerts (Gmail API + F002 integration) | WhatsApp notifications - Phase 2 |
| Price trend charts (6 months, anomalies highlighted) | AI-powered justification analysis - Phase 2 |
| Manual review workflow (approve override / reject) | Automatic rejection (all require human approval) |

---

## Contracts

### Input

| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| factura_id | uuid | Y | Invoice ID from F004 (OCR) |
| material_id | uuid | Y | Material catalog ID |
| proveedor_id | uuid | Y | Supplier ID |
| precio_unitario | decimal | Y | Price per unit from invoice (COP) |
| cantidad | decimal | Y | Quantity |
| unidad | string | Y | Unit (m³, ton, kg, etc.) |
| fecha_factura | date | Y | Invoice date |
| proyecto_id | uuid | Y | Project/consorcio ID |

### Output

| Field | Type | Condition | Notes |
|-------|------|-----------|-------|
| anomaly_detected | boolean | Always | TRUE if price outside normal range |
| severity | enum | On Anomaly | MED\|HIGH\|CRIT - determines action (alert, block, escalate) |
| anomaly_score | decimal | On Anomaly | 0-100 score (higher = more anomalous) |
| baseline_price | decimal | Always | Calculated baseline from historical data (30/60/90d consensus) |
| deviation_percent | decimal | Always | % deviation from baseline (positive = higher, negative = lower) |
| z_score | decimal | Always | Statistical Z-score (|Z|>2.0 = MED, >2.5 = HIGH, >3.0 = CRIT) |
| iqr_result | object | Always | {Q1, Q3, IQR, is_outlier, lower_bound, upper_bound} |
| market_range | object | Always | {min_price, max_price, material_category} from predefined ranges |
| cross_supplier | object[] | On Success | Top 3 cheapest suppliers {proveedor, precio_promedio, deviation_pct} |
| recommended_action | string | Always | PROCESS\|MANUAL_REVIEW\|BLOCK_INVOICE |
| alert_sent | boolean | Always | TRUE if alert email sent to recipients |
| blocked | boolean | Always | TRUE if invoice blocked for payment |
| explanation | string | On Anomaly | Human-readable reason (e.g., "Precio 18% mayor que promedio 90 días, fuera de rango mercado") |

---

## Business Rules

- **Baseline Calculation:** Consensus of 3 windows (30d, 60d, 90d) weighted average → robust to seasonal variation
- **Z-Score Thresholds:** |Z|>2.0 = MED (manual review), |Z|>2.5 = HIGH (block + alert), |Z|>3.0 = CRIT (block + escalate CEO)
- **IQR Thresholds:** Deviation >10% = MED, >20% = HIGH, >30% = CRIT
- **Rules-Based:** Deviation +10-15% = MED, +15-30% = HIGH, >30% = CRIT, outside market range = HIGH, zero/negative price = CRITICAL
- **Cross-Supplier:** Price >10% vs cheapest = MED, >20% = HIGH (suggest switching supplier)
- **Invoice Blocking:** HIGH or CRIT anomalies → block payment, require manual approval override
- **Alert Escalation:** MED → Jefe Compras, HIGH → Jefe Compras + Gerencia, CRIT → Jefe Compras + Gerencia + CEO
- **Alert Timing:** <1 minute from detection to email sent (prevent delays like Caso Cartagena)
- **Historical Data:** Minimum 30 days historical data required → if insufficient, flag "NEW_MATERIAL" and require 3-supplier comparison
- **Market Ranges:** Predefined by category (Cemento: 25-45K/50kg, Concreto: 180-350K/m³, Acero: 3.5-5.5M/ton, Agregados: 45-85K/m³)
- **Manual Override:** Jefe Compras or Gerencia can approve blocked invoice with required justification (logged to audit)

---

## Edge Cases

| Scenario | Handling | Notes |
|----------|----------|-------|
| New material (no historical data) | Flag "NEW_MATERIAL" + require 3-supplier comparison + manual approval | First purchase of material type |
| Seasonal price variation | Use 90-day baseline (captures seasonality) + no alert if within ±15% | E.g., aggregates higher in rainy season |
| Supplier switch (first purchase from new supplier) | Extra validation: compare vs 3 existing suppliers + manual review if >10% deviation | Prevent supplier-specific anomalies |
| Price drop (negative deviation) | Alert if <-20% (potential quality issue, fraudulent invoice, clerical error) | Unusually low prices also suspicious |
| Zero or negative price | CRITICAL severity → block invoice → alert admin → likely data error | Invalid invoice data |
| Insufficient historical data (<30 days) | Fallback to cross-supplier comparison only + manual approval required | New system or rare material |
| All suppliers have similar anomaly | Alert "MARKET_SHIFT" → manual review → may be legitimate market change (inflation spike) | Prevents false positives during market shocks |
| Invoice OCR error (wrong price extracted) | Pre-validation: price must be >0 and <100M COP → if outside, flag "OCR_ERROR" → manual review | Prevent garbage data |
| Manual override abuse (too many approvals) | Track override rate per user → alert admin if >20% override rate → audit required | Compliance monitoring |
| Delayed invoice (fecha_factura >90 days ago) | Use historical window ending at fecha_factura (not today) → prevent stale price comparison | Historical invoice validation |

---

## Observability

**Logs:**
- `anomaly_detected` (warn) - Material, supplier, precio, baseline, deviation_pct, severity
- `invoice_blocked` (error) - Factura ID, reason, recipients notified
- `manual_override` (warn) - User, factura_id, justification, previous severity
- `alert_sent` (info) - Recipients, severity, material, supplier
- `baseline_calculated` (info) - Material, 30d/60d/90d prices, consensus baseline
- `cross_supplier_compared` (info) - Material, top 3 suppliers, price differences
- `caso_cartagena_prevented` (critical) - Deviation >15%, blocked before payment (KEY SUCCESS METRIC)

**Metrics:**
- `anomalies_detected_count` - Total anomalies by severity (MED/HIGH/CRIT)
- `detection_rate_pct` - % of >15% deviations detected (target: 100%)
- `false_positive_rate_pct` - % of alerts that were false alarms (target: <5%)
- `detection_time_ms` - Time from invoice OCR to alert sent (target: <60,000ms)
- `resolution_time_hours` - Time from detection to manual decision (target: <24h)
- `caso_cartagena_prevented_count` - >15% deviations blocked (ROI calculation)
- `manual_override_rate_pct` - % of blocked invoices approved (compliance monitoring)
- `price_deviation_p50_p95` - 50th/95th percentile price deviations (market volatility indicator)

**Traces:**
- `price_anomaly_detection` (span) - Full detection pipeline: baseline calc → Z-score → IQR → rules → cross-supplier → decision
- `historical_query` (span) - Database query for price history (performance monitoring)
- `alert_notification` (span) - Email sending latency

---

## Definition of Done

- [ ] Code review approved
- [ ] Statistical detection implemented (Z-score, IQR, rules-based)
- [ ] Baseline calculation (30/60/90 day consensus) works correctly
- [ ] Cross-supplier comparison queries top 3 cheapest
- [ ] Market ranges predefined for 10+ material categories
- [ ] Invoice blocking enforced for HIGH/CRIT anomalies
- [ ] Alert emails sent <1 minute (Gmail API integration with F005)
- [ ] Dashboard widget shows anomalies (integration with F002)
- [ ] Price trend charts visualize 6-month history + anomalies (Recharts)
- [ ] Manual review workflow (approve override / reject) functional
- [ ] Audit log records all detections + manual overrides
- [ ] **CRITICAL:** Caso Cartagena simulation passes (3 invoices +15-20% → HIGH alerts → blocked)
- [ ] False positive rate <5% (validated with 100 real invoices)
- [ ] Detection rate >95% for deviations >15%
- [ ] Performance targets met (detection <1min, resolution <24h)
- [ ] Quality gates pass (format, lint, types, tests 80%+, build)
- [ ] Deployed to staging
- [ ] UAT with Jefe Compras + Gerencia (10 invoices: 5 normal, 5 anomalous)
- [ ] Smoke test passed (detect Caso Cartagena scenario)

---

**Related:** F004 (OCR extracts price), F005 (Email alerts), F002 (Dashboard charts), F006 (Historical data from SICOM) | **Dependencies:** PostgreSQL price_history table, NumPy/Pandas/SciPy, Gmail API

**Original PRD:** docs/features/r07-analisis-precios.md
