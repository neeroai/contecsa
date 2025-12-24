# ADR-013: Use Hybrid Scheduling (Time-Based + Hour-Based) Over Pure Time-Based Only

Version: 1.0 | Date: 2025-12-24 12:10 | Owner: Javier Polo | Status: Accepted

---

## Context

Equipment maintenance scheduling (F013) requires determining WHEN preventive maintenance is due. Choice between Time-Based Only (e.g., every 90 days), Hour-Based Only (e.g., every 500 hours of use), or Hybrid (both time AND hours, whichever comes first).

Critical requirements:
- Prevent unexpected failures (maintenance before breakdown)
- Flexible scheduling (some equipment = time-based, others = hour-based)
- Manual hour tracking acceptable (no IoT hour-meter sync in MVP)
- 2-person team (no complex predictive algorithms)
- 100% alert coverage (no missed maintenances)

Decision needed NOW because scheduling model determines database schema, alert logic, and maintenance accuracy.

---

## Decision

**Will:** Use Hybrid Scheduling (Time-Based + Hour-Based with manual hour entry)
**Will NOT:** Use Time-Based Only or Hour-Based Only (single dimension)

---

## Rationale

Hybrid Scheduling offers best balance of flexibility (both time and hours), accuracy (whichever comes first prevents over-maintenance), and 2-person maintainability:
- **Flexibility:** Equipment can have EITHER time-based (every 90 days) OR hour-based (every 500 hours) OR BOTH → Alert triggered by WHICHEVER comes first
- **Accuracy:** Excavator used 10h/day (heavy use) → 500 hours reached in 50 days (BEFORE 90-day time-based) → Alert at 50 days (prevents over-maintenance)
- **Fallback:** Generator used sporadically (100h in 90 days) → Time-based 90 days reached BEFORE 500 hours → Alert at 90 days (prevents under-maintenance)
- **Simplicity:** Manual hour entry (technician enters hours_at_service when recording maintenance) → No IoT integration required (Phase 1)
- **Database:** Two columns: frequency_hours (nullable), frequency_days (nullable) → At least ONE must be NOT NULL
- **Alert Logic:** Query: (next_maintenance_date BETWEEN today AND today + 7 days) OR (current_hours >= next_maintenance_hours - 50) → Send alert
- **2-person Maintainable:** No ML, no predictive algorithms, simple comparison logic (vs predictive maintenance = complex)

For construction equipment (variable usage patterns), hybrid scheduling = best fit for 2-person team.

---

## ClaudeCode&OnlyMe Validation

| Question | Answer | Score |
|----------|--------|-------|
| ¿Resuelve problema REAL HOY? | YES - Need prevent failures NOW (60% reduction target), hybrid handles both heavy-use (excavators) and light-use (generators) equipment | 1/1 |
| ¿Solución más SIMPLE? | YES - Manual hour entry + simple comparison (vs IoT hour-meter sync = complex, vs predictive ML = overkill) | 1/1 |
| ¿2 personas lo mantienen? | YES - No IoT infrastructure, no ML models, technician enters hours manually (vs IoT = requires integration team, vs ML = data scientists) | 1/1 |
| ¿Vale si NUNCA crecemos? | YES - 10-50 equipment, manual hour entry sustainable, hybrid scheduling = sufficient (vs IoT = only beneficial for >100 equipment) | 1/1 |
| **TOTAL** | **4/4 = ACCEPT** | **4/4** |

**Veto Threshold:** ANY NO = REJECT ✓ PASSED

---

## Alternatives Considered

### 1. Time-Based Only (Every X Days)
**Why rejected:**
- **Inaccurate for Heavy Use:** Excavator used 10h/day (heavy) → 90-day time-based = 900 hours → Over-maintenance (should be 500 hours)
- **Inaccurate for Light Use:** Generator used 2h/day (light) → 500-hour hour-based = 250 days → Under-maintenance (should be 90 days)
- **No Flexibility:** Cannot handle variable usage patterns (all equipment = same time-based schedule)
- Violates ClaudeCode&OnlyMe: NOT solving problem (inaccurate for heavy/light use equipment)

**Why NOT considered Phase 2:**
- Hybrid scheduling superior in every way (flexibility + accuracy)

### 2. Hour-Based Only (Every X Hours)
**Why rejected:**
- **Requires Hour-Meter Tracking:** Must track equipment hours (manual or IoT) → If hours NOT tracked, no alerts sent
- **Fails for Idle Equipment:** Generator idle for 6 months (0 hours) → No time-based alert → Maintenance missed (oil degrades over time, not just usage)
- **Complex for Light Use:** Mixer used 1h/week → 500 hours = 10 years → Unrealistic (should be time-based 90 days)
- Violates ClaudeCode&OnlyMe: NOT solving problem (fails for idle equipment, requires hour-meter tracking)

**Why NOT considered Phase 2:**
- Hybrid scheduling includes hour-based (no need for pure hour-based only)

### 3. Predictive Maintenance (ML-Based)
**Why rejected:**
- **Complexity:** Requires historical failure data, sensor data (vibration, temperature), ML model training, prediction algorithms
- **Data Requirements:** Need >1 year historical data (not available in MVP), IoT sensors (not in MVP)
- **Team Size:** Requires data scientists (vs 2-person team = no ML expertise)
- **Accuracy Uncertainty:** Predictive models = black box (hard to audit for HSE), hybrid = explainable (simple comparison)
- Violates ClaudeCode&OnlyMe: NOT simplest (ML vs simple comparison), NOT 2-person maintainable (requires data scientists)

**Why considered for Phase 2:**
- If client has >100 equipment + 1 year historical data + budget for ML team → Consider predictive maintenance
- MVP = hybrid scheduling, Phase 2 = add predictive layer on top

### 4. IoT Hour-Meter Sync (Automatic Hour Tracking)
**Why rejected:**
- **Infrastructure:** Requires IoT sensors (GPS + hour-meter), cellular/wifi connectivity, IoT platform (AWS IoT, Google IoT Core)
- **Cost:** IoT sensors = $100-300 per equipment (vs manual entry = $0), cellular data = $10/month per sensor
- **Complexity:** Integration with equipment (OBD-II, CAN bus), real-time sync, battery management
- **2-person Team:** Requires IoT integration team (vs manual entry = technician enters hours)
- Violates ClaudeCode&OnlyMe: NOT simplest (IoT vs manual entry), NOT 2-person maintainable (requires IoT team)

**Why considered for Phase 2:**
- If client has >50 equipment + budget for IoT sensors → Add automatic hour tracking
- MVP = manual hour entry, Phase 2 = IoT sync

---

## Consequences

**Positive:**
- Flexibility (equipment can have time OR hours OR both)
- Accuracy (whichever comes first = prevents over/under-maintenance)
- Simplicity (manual hour entry = no IoT)
- Fallback (time-based works even if hours NOT tracked)
- 2-person maintainable (no ML, no IoT)
- Explainable (simple comparison logic for HSE audits)

**Negative:**
- Manual hour entry required (technician must enter hours_at_service) (mitigated: optional field, time-based fallback if not entered)
- No real-time tracking (hours updated only when maintenance recorded) (mitigated: acceptable for MVP, Phase 2 = IoT)

**Risks:**
- **Hour-meter not updated:** Mitigated by time-based fallback (frequency_days works even if hours NOT tracked), log warning if hours_at_service = NULL
- **Technician forgets to enter hours:** Mitigated by UI reminder (red badge if hours_at_service missing in last 3 records), dashboard shows "Hour-meter not tracked" warning
- **Duplicate alerts (both time and hours due):** Mitigated by consolidating alerts (single email with both maintenance types), prevent spam

---

## Implementation Details

**Database Schema:**
```sql
CREATE TABLE maintenance_schedules (
  id UUID PRIMARY KEY,
  equipment_id UUID REFERENCES equipment(id) NOT NULL,
  maintenance_type VARCHAR(100) NOT NULL,
  frequency_hours INT,              -- Nullable (e.g., every 500 hours)
  frequency_days INT,                -- Nullable (e.g., every 90 days)
  last_maintenance_date DATE,
  last_maintenance_hours INT,
  next_maintenance_date DATE,        -- Calculated: last_maintenance_date + frequency_days
  next_maintenance_hours INT,        -- Calculated: last_maintenance_hours + frequency_hours
  is_active BOOLEAN DEFAULT TRUE,
  CONSTRAINT at_least_one_frequency CHECK (
    frequency_hours IS NOT NULL OR frequency_days IS NOT NULL
  )
);
```

**Alert Logic:**
```sql
-- Find equipment needing maintenance in next 7 days (time-based OR hour-based)
SELECT
  e.id,
  e.equipment_type,
  ms.maintenance_type,
  ms.next_maintenance_date,
  ms.next_maintenance_hours,
  u.email as responsible_email
FROM equipment e
JOIN maintenance_schedules ms ON e.id = ms.equipment_id
JOIN users u ON e.responsible_user = u.id
WHERE
  ms.is_active = TRUE
  AND e.status = 'OPERATIONAL'
  AND (
    -- Time-based alert (7 days before)
    (ms.next_maintenance_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days')
    OR
    -- Hour-based alert (50 hours before = ~5-7 days for typical equipment)
    (e.current_hours >= ms.next_maintenance_hours - 50)
  );
```

**Benefits:**
- Single query handles both time-based AND hour-based
- Whichever condition is TRUE first = triggers alert
- If both TRUE = single alert (consolidated)

---

## Related

- SPEC: /specs/f013-mantenimiento-maq/SPEC.md (Hybrid scheduling contracts)
- PLAN: /specs/f013-mantenimiento-maq/PLAN.md (S002: Maintenance schedules table)
- Stack: /Users/mercadeo/neero/docs-global/stack/database-guide.md:20-40 (PostgreSQL check constraints)

---

**Decision Maker:** Javier Polo + Claude Code | **Review Date:** 2025-06-24 (6 months)
