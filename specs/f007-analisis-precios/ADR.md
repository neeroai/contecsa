# ADR-007: Use Hybrid Statistical Approach Over Pure ML for Price Anomaly Detection

Version: 1.0 | Date: 2025-12-24 07:40 | Owner: Javier Polo | Status: Accepted

---

## Context

Price anomaly detection (F007) must prevent "Caso Cartagena" (3 invoices +15-20% overcharge undetected for 2 months). Need approach that guarantees 100% detection for >15% deviations with <5% false positives. Choice between statistical methods (Z-score, IQR, rules) vs pure ML (Isolation Forest, Autoencoders).

Budget: No ML infrastructure budget (no GPUs, no MLOps team). Expected usage: ~50 invoices/week, ~200 price validations/month.

Decision needed NOW because detection algorithm is core to feature, determines data requirements and accuracy guarantees.

---

## Decision

**Will:** Use hybrid statistical approach (Z-score + IQR + rules-based + cross-supplier comparison)
**Will NOT:** Use pure ML-only approach (Isolation Forest, Autoencoders, LSTM)

---

## Rationale

Hybrid statistical offers best balance of explainability, reliability, and maintainability:
- **Deterministic guarantees:** Z-score |Z|>3.0 = ALWAYS CRIT (vs ML = probabilistic, can miss outliers)
- **Explainable to users:** "Precio 18% mayor que promedio 90 días" (vs ML = black box "anomaly score 0.85")
- **Minimal training data:** Works with 30 days historical (vs ML = needs 1,000+ samples, bootstrapping problem)
- **No drift:** Statistics unchanging (vs ML = model drift requires retraining every quarter)
- **Fast inference:** <100ms calculation (vs ML = 200-500ms model prediction)
- **Zero infrastructure:** NumPy/Pandas = CPU only (vs ML = GPU for deep learning, MLOps pipeline)
- **2-person team maintainable:** Math formulas in code (vs ML = data scientists, model versioning, A/B testing)

For 2-person team, statistical = minimal complexity, full transparency, regulatory compliance (explainable decisions).

---

## ClaudeCode&OnlyMe Validation

| Question | Answer | Score |
|----------|--------|-------|
| ¿Resuelve problema REAL HOY? | YES - Caso Cartagena proven, need prevention now | 1/1 |
| ¿Solución más SIMPLE? | YES - Math formulas in 50 lines vs ML pipeline (data prep, training, serving, monitoring) | 1/1 |
| ¿2 personas lo mantienen? | YES - Javier + Claude Code, no data scientists needed, no model retraining | 1/1 |
| ¿Vale si NUNCA crecemos? | YES - Works for 10-1000 invoices/week without changes, no scaling issues | 1/1 |
| **TOTAL** | **4/4 = ACCEPT** | **4/4** |

**Veto Threshold:** ANY NO = REJECT ✓ PASSED

---

## Alternatives Considered

### 1. Pure ML (Isolation Forest)
**Why rejected:**
- **Black box:** Can't explain to Gerencia why invoice blocked (compliance issue)
- **Training data:** Needs 1,000+ historical prices (bootstrapping problem: Caso Cartagena happened with <200 samples)
- **False negatives:** ML can miss novel outliers (Caso Cartagena might not have been detected if pattern unseen)
- **Drift:** Requires quarterly retraining (inflation changes distribution, model becomes stale)
- **Complexity:** scikit-learn model versioning, hyperparameter tuning, A/B testing
- Violates ClaudeCode&OnlyMe: Requires data science expertise for 2-person team

### 2. Deep Learning (Autoencoders, LSTM)
**Why rejected:**
- **Overkill:** Price anomaly = simple statistical problem (not image recognition, not NLP)
- **Infrastructure:** Requires GPUs (cost), TensorFlow/PyTorch (complexity), model serving (MLOps)
- **Data requirements:** Needs 10,000+ samples (construction projects = only ~2,000 historical purchases)
- **Latency:** Model inference 200-500ms (vs statistical <100ms)
- **Explainability:** Zero (neural network = ultimate black box)
- Violates ClaudeCode&OnlyMe: NOT simplest solution, NOT maintainable by 2 people

### 3. Time Series Forecasting (Prophet, ARIMA)
**Why rejected:**
- **Use case mismatch:** Time series = predict future prices (vs anomaly = detect outliers in current price)
- **Complexity:** Model selection (ARIMA vs SARIMA vs Prophet), hyperparameters, seasonal decomposition
- **Overfitting:** Construction prices = noisy, irregular (not smooth time series like stock prices)
- **Delay:** Requires historical window for training (vs statistical = instant calculation)

---

## Consequences

**Positive:**
- Zero cost (NumPy/Pandas = free, open-source)
- Deterministic guarantees (|Z|>3.0 = ALWAYS CRIT, prevents Caso Cartagena)
- Explainable (users understand "18% mayor que promedio")
- Fast (<100ms calculation, <1min alert)
- Minimal data (30 days historical sufficient)
- No drift (statistics unchanging, no retraining)
- Transparent code (50 lines math formulas vs 500 lines ML pipeline)
- Regulatory compliant (auditable decisions, explainable to CEO/board)

**Negative:**
- Limited adaptability (can't learn new patterns automatically, must update rules manually)
- Fixed thresholds (10%/20%/30% = hardcoded vs ML = adaptive)
- Seasonal blind spots (90-day baseline helps but not perfect)

**Risks:**
- **Missed novel patterns:** Mitigated by multi-algorithm consensus (Z-score AND IQR AND rules AND cross-supplier) + manual review option + quarterly threshold tuning
- **False positives (market shocks):** Mitigated by MARKET_SHIFT detection (all suppliers anomalous = legitimate market change) + manual override workflow
- **Threshold tuning:** Mitigated by UAT with real data (adjust 10%/20%/30% based on false positive rate)

---

## Implementation Details

**Hybrid Statistical Pipeline:**
```python
def detect_anomaly(precio, material_id, proveedor_id, fecha):
    # Step 1: Baseline (30/60/90 day consensus)
    baseline = calculate_baseline(material_id, fecha)

    # Step 2: Z-score (statistical outlier)
    z_score = (precio - baseline.mean) / baseline.std
    severity_z = classify_z_score(z_score)  # |Z|>2.0/2.5/3.0

    # Step 3: IQR (interquartile range)
    iqr_result = calculate_iqr(material_id, fecha)
    severity_iqr = classify_iqr(precio, iqr_result)  # >10%/20%/30%

    # Step 4: Rules-based (market ranges + deviations)
    market_range = get_market_range(material_id)
    severity_rules = apply_rules(precio, baseline, market_range)

    # Step 5: Cross-supplier comparison
    cheapest_3 = get_cheapest_suppliers(material_id, fecha)
    severity_cross = compare_price(precio, cheapest_3)  # >10%/20%

    # Step 6: Consensus (max severity across algorithms)
    severity = max(severity_z, severity_iqr, severity_rules, severity_cross)

    return {
        'anomaly_detected': severity >= MED,
        'severity': severity,
        'z_score': z_score,
        'explanation': f"Precio {deviation_pct}% mayor que baseline {baseline.value}"
    }
```

**Benefits:**
- Multi-algorithm consensus = robust (no single point of failure)
- Each algorithm catches different anomaly types (Z-score = statistical outliers, IQR = extreme outliers, rules = market violations, cross-supplier = supplier-specific overcharge)
- Explainable at every step (can debug why severity = HIGH)

---

## Related

- SPEC: /specs/f007-analisis-precios/SPEC.md (Detection algorithms section)
- PLAN: /specs/f007-analisis-precios/PLAN.md (S005-S009: Statistical modules)
- Caso Cartagena: docs/meets/contecsa_meet_2025-12-22.txt (3 facturas +15-20%)
- NumPy/Pandas: /Users/mercadeo/neero/docs-global/stack/common-stack.md:80-85

---

**Decision Maker:** Javier Polo + Claude Code | **Review Date:** 2025-06-24 (6 months)
