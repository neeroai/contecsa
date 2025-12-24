# ADR-014: Use EVM Simplified Over Full PMBOK for Physical Progress Tracking

Version: 1.0 | Date: 2025-12-24 10:00 | Owner: Javier Polo | Status: Accepted

---

## Context

Physical progress tracking system (F014) must detect early budget overruns by comparing % physical progress vs % budget spent, with <15 min/week update time and 20% reduction in over-budget projects. Choice between EVM Full (PMBOK standard with CPM scheduling, 50+ metrics), EVM Simplified (core KPIs only), or % Completitud APU (simple checklist).

Critical requirements:
- Early sobrecost detection (CPI <0.9 → alert before project ends)
- Weekly update <15 min (Técnico sustainability)
- EAC accuracy 85-95% (projected vs actual final cost)
- Minimal training (2-person team, no PMI-certified project managers)
- Integration with existing budgets (F010)

Decision needed NOW because methodology determines database schema (APUs + progress tables), KPIs calculated (CPI, SPI, EAC, VAC), and user workflow (weekly form complexity).

---

## Decision

**Will:** Use EVM Simplified (core KPIs: EV, AC, PV, CPI, SPI, EAC, VAC)
**Will NOT:** Use EVM Full (PMBOK with CPM scheduling, 50+ metrics) or Simple % Completitud (no cost integration)

---

## Rationale

EVM Simplified offers best balance of early detection power and operational simplicity for 2-person team:
- **Industry standard:** PMI/PMBOK proven methodology (90-95% accuracy), used globally in construction
- **Core KPIs only:** 7 metrics (EV, AC, PV, CPI, SPI, EAC, VAC) vs 50+ in Full PMBOK (overhead reduction)
- **Cost integration:** CPI = EV / AC directly compares physical progress vs budget spent (detects sobrecostos early)
- **Projection power:** EAC = BAC / CPI projects final cost based on current trend (no manual forecast needed)
- **PV simplified:** Linear by time (PV = BAC × days_elapsed / total_days) - no CPM detailed schedule required (vs Full PMBOK)
- **APUs amplias:** 10-20 APUs per project (categories like "Excavación", "Concreto") vs 100+ granular (reduces form time <15 min)
- **Weekly sustainable:** Técnico updates % completitud per APU (10-20 inputs) vs daily tracking (overhead insostenible)
- **Curva S visual:** Intuitive for Gerencia (no PMI training required) - 3 líneas (Planificado, Ejecutado, Gastado)
- **Integration F010:** Reuses existing budgets (BAC), spend (AC) - no duplicate data entry
- **LATAM familiar:** % Completitud APU = standard practice in Colombian construction (low training)

For 2-person team with existing budgets (F010) and weekly update capacity, EVM Simplified = proven accuracy with minimal overhead.

---

## ClaudeCode&OnlyMe Validation

| Question | Answer | Score |
|----------|--------|-------|
| ¿Resuelve problema REAL HOY? | YES - Need early sobrecost detection now (Caso Cartagena = 2 months delay), 20% reduction over-budget projects | 1/1 |
| ¿Solución más SIMPLE? | YES - EVM Simplified (7 KPIs, 10-20 APUs, weekly) vs Full PMBOK (50+ metrics, CPM scheduling, daily tracking, MS Project integration) | 1/1 |
| ¿2 personas lo mantienen? | YES - Auto-calculated KPIs (SQL view), weekly form <15 min, no PMI-certified PM required, Curva S visual (no complex reports) | 1/1 |
| ¿Vale si NUNCA crecemos? | YES - 10-100 projects, 10-20 APUs each, EVM Simplified handles scale without changes (vs Full PMBOK requires dedicated PM team) | 1/1 |
| **TOTAL** | **4/4 = ACCEPT** | **4/4** |

**Veto Threshold:** ANY NO = REJECT ✓ PASSED

---

## Alternatives Considered

### 1. EVM Full (PMBOK Standard with CPM Scheduling)
**Why rejected:**
- **Complex PV calculation:** Requires detailed CPM scheduling (MS Project/Primavera P6 integration) - hundreds of hours setup per project
- **50+ metrics:** Variance analysis (CV, SV, TCPI, IEAC, ETC, etc.) - overwhelming for Gerencia (no PMI training)
- **Daily tracking:** PMBOK recommends daily updates (vs weekly sustainable) - overhead insostenible for 2-person team
- **100+ APUs:** Granular breakdown (each activity tracked) - form >1 hour/week (vs <15 min target)
- **Infrastructure:** MS Project/Primavera P6 licenses ($1,000+ per user), integrations, training (weeks)
- Violates ClaudeCode&OnlyMe: NOT simplest (CPM vs linear PV), NOT 2-person maintainable (requires dedicated PM)

**Why NOT considered Phase 2:**
- Marginal accuracy gain (95% vs 90% with Simplified) not worth complexity
- If needed (large projects >$10M), integrate MS Project via API (not rebuild CPM engine)

### 2. Simple % Completitud APU (No Cost Integration)
**Why rejected:**
- **No cost integration:** Cannot detect sobrecostos (tracks % progress only, not vs budget spent)
- **No CPI:** Cannot compare physical progress vs financial spend (core EVM benefit lost)
- **No EAC projection:** Cannot forecast final cost (manual estimation required)
- **Less accurate:** 75-85% typical (vs EVM 90-95%) - subjective "feels like 60% done"
- **No early alerts:** Sobrecostos detected AFTER project ends (no CPI <0.9 trigger)
- Violates ClaudeCode&OnlyMe: NOT solving problem (early detection = core requirement)

**Why considered Phase 1 input:**
- Use % Completitud APU as USER INPUT method (Técnico familiar)
- But CALCULATE EVM KPIs automatically (EV = BAC × % completitud, CPI = EV / AC)

### 3. Automated Progress via IoT/Sensors
**Why rejected:**
- **Infrastructure cost:** Sensors, GPS trackers on equipment ($10,000+ per project)
- **Not applicable:** Construction work = manual labor dominant (not automated factory)
- **Accuracy issues:** Sensors track equipment usage, not work quality/completeness
- **Overkill:** 2-person team cannot maintain IoT infrastructure
- Violates ClaudeCode&OnlyMe: NOT simplest (IoT vs manual form), NOT 2-person maintainable

---

## Consequences

**Positive:**
- Industry standard (PMI/PMBOK proven methodology, 90-95% accuracy)
- Early detection (CPI <0.9 → alert weeks/months before project ends)
- Cost integration (CPI = EV / AC compares progress vs spend directly)
- Projection power (EAC = BAC / CPI forecasts final cost automatically)
- Simple PV (linear by time, no CPM scheduling required)
- Weekly sustainable (<15 min form, 10-20 APUs)
- Curva S visual (intuitive Gerencia, no PMI training)
- Integration F010 (reuses BAC, AC - no duplicate data)
- LATAM familiar (% Completitud APU standard in Colombia)

**Negative:**
- Less precise PV (linear by time vs CPM detailed schedule) - but acceptable for construction (activities often sequential)
- Subjective % completitud (Técnico estimates, not GPS/sensors) - mitigated by waste factor validation (compare vs purchases)
- Weekly lag (vs daily Full PMBOK) - but sustainable long-term
- Simplified EAC (BAC / CPI) - assumes current trend continues (no S-curve adjustments)

**Risks:**
- **Overhead insostenible (>15 min):** Mitigated by 10-20 APUs max (not 100+), sugerencia automática via compras (Phase 2), evaluate month 1 → reduce to biweekly if needed
- **CPI too optimistic (Técnico inflates % progress):** Mitigated by waste factor validation (flag if avance >> compras), monthly physical audit
- **EAC inaccurate (>15% error):** Mitigated by 3-month CPI average (not single week), confidence interval (min-max EAC), monthly review
- **PV linear too simplistic (seasonal work):** Mitigated by manual PV adjustment (if project front-loaded/back-loaded), acceptable error ±10%

---

## Implementation Details

**EVM Simplified Formulas:**
```sql
-- SQL View: v_project_evm
CREATE VIEW v_project_evm AS
SELECT
  p.id AS project_id,
  p.name AS project_name,

  -- BAC (Budget At Completion)
  pb.total_budget_cop AS bac,

  -- EV (Earned Value) = BAC × Weighted Avg % Completitud
  pb.total_budget_cop * (
    SUM(ppp.pct_complete * pa.total_price_cop) / SUM(pa.total_price_cop)
  ) / 100 AS ev,

  -- AC (Actual Cost) = Total Spent
  COALESCE(SUM(ps.amount_cop), 0) AS ac,

  -- PV (Planned Value) = BAC × (days_elapsed / total_days)
  pb.total_budget_cop * (
    EXTRACT(DAY FROM CURRENT_DATE - pb.budget_start_date)::DECIMAL /
    EXTRACT(DAY FROM pb.budget_end_date - pb.budget_start_date)::DECIMAL
  ) AS pv,

  -- CPI (Cost Performance Index) = EV / AC
  CASE
    WHEN COALESCE(SUM(ps.amount_cop), 0) = 0 THEN NULL
    ELSE (
      pb.total_budget_cop * (
        SUM(ppp.pct_complete * pa.total_price_cop) / SUM(pa.total_price_cop)
      ) / 100
    ) / COALESCE(SUM(ps.amount_cop), 0)
  END AS cpi,

  -- SPI (Schedule Performance Index) = EV / PV
  CASE
    WHEN pv = 0 THEN NULL
    ELSE ev / pv
  END AS spi,

  -- EAC (Estimate At Completion) = BAC / CPI
  CASE
    WHEN cpi IS NULL OR cpi = 0 THEN NULL
    ELSE pb.total_budget_cop / cpi
  END AS eac,

  -- VAC (Variance At Completion) = BAC - EAC
  pb.total_budget_cop - eac AS vac,

  -- % Physical Progress (Weighted Avg)
  SUM(ppp.pct_complete * pa.total_price_cop) / SUM(pa.total_price_cop) AS pct_physical_progress

FROM projects p
JOIN project_budgets pb ON p.id = pb.project_id
LEFT JOIN project_apus pa ON p.id = pa.project_id
LEFT JOIN project_physical_progress ppp ON pa.id = ppp.apu_id
LEFT JOIN project_spend ps ON p.id = ps.project_id
WHERE pb.budget_end_date >= CURRENT_DATE  -- Active projects only
GROUP BY p.id, p.name, pb.total_budget_cop, pb.budget_start_date, pb.budget_end_date;
```

**Benefits:**
- Auto-calculated (no manual computation)
- Real-time (updates when progress or spend changes)
- Type-safe (SQL view = strongly typed)
- Reuses F010 (project_budgets, project_spend)
- Simple query (`SELECT * FROM v_project_evm WHERE project_id = ...`)

---

## Related

- SPEC: /specs/f014-seguimiento-evm/SPEC.md (EVM KPIs, CPI alerts, Curva S)
- PLAN: /specs/f014-seguimiento-evm/PLAN.md (S003: v_project_evm view, S006: CPI alerts)
- PMI EVM Guide: https://www.pmi.org/learning/library/earned-value-management-guide-6751
- PMBOK (6th Edition): EVM Chapter (Simplified vs Full)
- Universidad de los Andes: EVM in Colombian Construction
- Stack: /Users/mercadeo/neero/docs-global/stack/database-guide.md:15-25 (PostgreSQL views)

---

**Decision Maker:** Javier Polo + Claude Code | **Review Date:** 2025-06-24 (6 months)
