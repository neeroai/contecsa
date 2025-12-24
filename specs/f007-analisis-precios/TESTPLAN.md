# Test Plan: Análisis Precios y Detección Anomalías

Version: 1.0 | Date: 2025-12-24 07:45 | Owner: Claude Code | Status: Active

---

## Reference

**SDD Version:** 1.0 | **Feature:** Análisis Precios (F007) | **Scope:** Unit + Integration + E2E | **Coverage Target:** 80% (detection algorithms, false positive rate <5%)

---

## Test Strategy

**Philosophy:** 80% coverage on statistical algorithms (Z-score, IQR, rules, cross-supplier). **CRITICAL:** Caso Cartagena simulation must pass (3 invoices +15-20% → HIGH alerts → blocked). Unit tests verify math accuracy. Integration tests verify full detection pipeline. E2E tests verify alert + blocking + manual review workflow.

**Critical Paths:**
1. Invoice OCR → Extract price → Detect anomaly → Block invoice → Send alert → Manual review
2. Caso Cartagena simulation (3 invoices +15-20% → HIGH severity → blocked before payment)
3. False positive validation (seasonal variation, supplier switch → no false alarm)
4. Manual override workflow (approve justification → log audit)

---

## Unit Tests

| Module | Test Cases | Tool | Status |
|--------|-----------|------|--------|
| Baseline calculation (baseline.py) | - 30/60/90 day consensus = weighted average<br>- Insufficient data (<30 days) → NEW_MATERIAL flag<br>- Handles sparse data (missing dates)<br>- Seasonal window (90d captures seasonality) | Pytest + NumPy | TODO |
| Z-score calculation (statistical.py) | - |Z|=2.0 → MED, |Z|=2.5 → HIGH, |Z|=3.0 → CRIT<br>- Handles zero std dev (all prices same)<br>- Negative deviation (price drop) flagged if <-20% | Pytest + SciPy | TODO |
| IQR outlier detection (statistical.py) | - Deviation >10%/20%/30% → MED/HIGH/CRIT<br>- Calculates Q1, Q3, IQR correctly<br>- Lower/upper bounds for outliers<br>- Handles small sample sizes (<10 data points) | Pytest + NumPy | TODO |
| Rules-based detection (rules.py) | - Market range violations (outside min/max) → HIGH<br>- Zero/negative price → CRITICAL<br>- Deviation +10-15%/15-30%/>30% → MED/HIGH/CRIT | Pytest | TODO |
| Cross-supplier comparison (cross_supplier.py) | - Queries top 3 cheapest suppliers<br>- Deviation >10%/20% vs cheapest → MED/HIGH<br>- Suggests switching supplier if >20% cheaper available | Pytest + PostgreSQL mock | TODO |

---

## Integration Tests

| Component | Test Cases | Tool | Status |
|-----------|-----------|------|--------|
| Full detection pipeline (detector.py) | - Baseline → Z-score → IQR → Rules → Cross-supplier → Consensus severity<br>- Multi-algorithm consensus (max severity across all)<br>- Explanation generated correctly ("Precio 18% mayor que promedio 90 días")<br>- Recommended action: PROCESS vs MANUAL_REVIEW vs BLOCK_INVOICE | Pytest + PostgreSQL test DB | TODO |
| Invoice blocking (actions.py) | - HIGH/CRIT anomalies → invoice.blocked = TRUE<br>- MED anomalies → manual_review = TRUE (no auto-block)<br>- Logs to price_anomalies table with all detection details | Pytest + PostgreSQL test DB | TODO |
| Alert email sending (notifications.py) | - Email sent <1min (performance requirement)<br>- Escalation: MED → Compras, HIGH → Compras+Gerencia, CRIT → Compras+Gerencia+CEO<br>- Email includes anomaly details, price chart link, manual review link | Pytest + Gmail API mock | TODO |
| Manual override workflow | - Jefe Compras approves blocked invoice with justification<br>- Logs to price_anomaly_resolutions table<br>- Audit trail: {user, decision, justification, timestamp}<br>- Override rate tracking (alert if >20% of blocked invoices approved) | Pytest + PostgreSQL test DB | TODO |

---

## E2E Tests (Playwright)

**Setup:** `bun test:e2e` | **Environment:** Staging with seeded price history

**CRITICAL TEST: Caso Cartagena Simulation**

1. **Caso Cartagena Scenario (3 invoices +15-20% overcharge):**
   - **Setup:** Seed price_history with concreto baseline $300K/m³ (30/60/90 day average)
   - **Invoice 1:** Factura concreto $345K/m³ (+15%) from supplier A
     - Assert: severity = HIGH (Z-score >2.5, IQR >15%, rules >15%)
     - Assert: invoice.blocked = TRUE
     - Assert: Email sent to Jefe Compras + Gerencia within 1 minute
     - Assert: Dashboard shows red alert badge
   - **Invoice 2:** Factura concreto $360K/m³ (+20%) from supplier B
     - Assert: severity = HIGH
     - Assert: invoice.blocked = TRUE
     - Assert: Cross-supplier comparison shows supplier C cheaper by 18%
   - **Invoice 3:** Factura concreto $350K/m³ (+17%) from supplier C
     - Assert: severity = HIGH
     - Assert: All 3 invoices blocked (prevents Caso Cartagena repetition)
   - **Metric:** Detection rate = 100% (all 3 >15% deviations caught)

**Happy Paths:**

2. **US7.1 - Normal Price (Within 10%):**
   - Invoice: Concreto $310K/m³ (+3.3% vs baseline $300K)
   - Assert: severity = NONE (Z-score <2.0, deviation <10%)
   - Assert: invoice.blocked = FALSE
   - Assert: No alert sent
   - Assert: Invoice processes normally

3. **US7.2 - Moderate Anomaly (10-15%):**
   - Invoice: Concreto $340K/m³ (+13.3% vs baseline $300K)
   - Assert: severity = MED (IQR >10%, Z-score ~2.2)
   - Assert: invoice.blocked = FALSE (MED = manual review, not auto-block)
   - Assert: Email sent to Jefe Compras (manual review requested)
   - Assert: Dashboard shows yellow flag

4. **US7.3 - Critical Anomaly (>30%):**
   - Invoice: Concreto $400K/m³ (+33% vs baseline $300K)
   - Assert: severity = CRIT (Z-score >3.0, deviation >30%)
   - Assert: invoice.blocked = TRUE
   - Assert: Email sent to Jefe Compras + Gerencia + CEO
   - Assert: Dashboard shows red alert + escalation badge

5. **US7.4 - Manual Override (Approve Blocked Invoice):**
   - Login as Jefe Compras
   - Navigate to /admin/anomalies/[id]
   - View price trend chart (6 months historical + anomaly highlighted)
   - Enter justification: "Proveedor confirmed price increase due to cement shortage Q1 2025"
   - Click "Aprobar Override"
   - Assert: invoice.blocked = FALSE
   - Assert: Resolution logged to price_anomaly_resolutions table
   - Assert: Audit trail complete

**Edge Case Tests:**

6. **New Material (No Historical Data):**
   - Invoice: Material X (first purchase, no price_history)
   - Assert: severity = MED + NEW_MATERIAL flag
   - Assert: Fallback to cross-supplier comparison (if available)
   - Assert: Manual approval required

7. **Seasonal Price Variation (+12% in rainy season):**
   - Invoice: Aggregates $95K/m³ (vs baseline $85K, but within 90-day seasonal range)
   - Assert: severity = NONE (90-day baseline captures seasonality)
   - Assert: No false positive

8. **Supplier Switch (First Purchase from New Supplier):**
   - Invoice: Concreto $320K/m³ from supplier D (first time, vs supplier A baseline $300K)
   - Assert: severity = MED + SUPPLIER_SWITCH flag
   - Assert: Cross-supplier comparison validates (within 10% of market)
   - Assert: Manual review recommended (not auto-block)

9. **Market-Wide Price Shock (All Suppliers +25%):**
   - Invoices: Concreto $375K from suppliers A, B, C (all +25% vs baseline $300K)
   - Assert: MARKET_SHIFT detected (all suppliers anomalous)
   - Assert: severity = HIGH but recommended_action = MANUAL_REVIEW (not auto-block all)
   - Assert: Alert to Gerencia: "Market-wide price increase detected, verify external sources (DANE)"

10. **OCR Error (Extracted Price $999,999,999):**
    - Invoice: Concreto price OCR extracted as $999,999,999
    - Assert: severity = CRITICAL + OCR_ERROR flag
    - Assert: Pre-validation rejects (price >100M COP threshold)
    - Assert: Manual review required (likely OCR failure, not real price)

**Performance Tests:**
- Detection time <1 minute (from invoice OCR to alert sent)
- Alert email delivery <1 minute (Gmail API latency)
- Baseline calculation <100ms (for 90-day window with 1,000 data points)
- Manual review page load <2s (with price trend chart)

---

## Quality Gates CI

| Gate | Command | Target | Status |
|------|---------|--------|--------|
| Format | `bun run format --check` (Python: `black api/`) | 100% | TODO |
| Lint | `bun run lint` (Python: `ruff check api/`) | 0 errors | TODO |
| Types | `bun run typecheck` (Python: `mypy api/`) | 0 errors | TODO |
| Unit | `pytest --cov=api/services/price_anomaly --cov-report=term` | 80%+ on detection modules | TODO |
| Build | `bun run build` | Exit 0 | TODO |
| E2E | `bun test:e2e` (Caso Cartagena + 9 other scenarios) | All 10 tests pass | TODO |

---

## Manual Testing Checklist

- [ ] **CRITICAL:** Caso Cartagena simulation passes (3 invoices +15-20% → HIGH → blocked)
- [ ] Detection rate >95% for deviations >15% (validated with 100 real invoices)
- [ ] False positive rate <5% (validated with 100 real invoices)
- [ ] Detection time <1 minute (from OCR to alert sent)
- [ ] Baseline calculation accurate (compare vs Excel manual calculation)
- [ ] Z-score, IQR, rules thresholds calibrated (adjust 10%/20%/30% based on UAT feedback)
- [ ] Cross-supplier comparison queries top 3 cheapest (validate SQL query results)
- [ ] Invoice blocking enforced (HIGH/CRIT cannot be paid without override)
- [ ] Alert emails delivered reliably (test Gmail API connection)
- [ ] Alert escalation works (MED → Compras, HIGH → +Gerencia, CRIT → +CEO)
- [ ] Price trend chart visualizes 6 months + anomalies highlighted red
- [ ] Manual override workflow complete (approve/reject with justification logged)
- [ ] Audit trail queryable (all detections + resolutions in database)
- [ ] UAT with Jefe Compras + Gerencia (10 invoices: 5 normal, 5 anomalous)
- [ ] Performance targets met (detection <1min, resolution <24h)
- [ ] Integration tested: F004 (OCR) → F007 (detection) → F005 (alerts) → F002 (dashboard)
- [ ] Market ranges seeded (10+ categories with min/max prices)

---

**Token-efficient format:** 70 lines | 10 E2E scenarios | 80%+ coverage target | CRITICAL: Caso Cartagena simulation
