# ADR-002: Use Recharts Over Tremor for Dashboard Charts

Version: 1.0 | Date: 2025-12-24 06:10 | Owner: Javier Polo | Status: Accepted

---

## Context

Dashboard (F002) requires charting library for visualizations (bar, line, pie charts). Need React-native, responsive, accessible library that integrates with Next.js 15 and supports customization.

Budget: No additional chart library budget (prefer open-source). Expected usage: 5 dashboards × 4-6 charts each = 25-30 charts total.

Decision needed NOW because chart components are foundation for all 5 dashboards (Gerencia, Compras, Contabilidad, Técnico, Almacén).

---

## Decision

**Will:** Use Recharts as charting library
**Will NOT:** Use Tremor, Chart.js, or custom D3.js implementations

---

## Rationale

Recharts offers best balance of simplicity, customization, and React integration:
- Free + open-source (MIT license) vs Tremor (free but limited customization)
- Declarative React API (components, not imperative) vs Chart.js (imperative)
- 25K+ npm weekly downloads, active community
- Built-in responsive design, accessible (ARIA labels)
- Colorblind-safe palette support

For 2-person team, Recharts = minimal learning curve, extensive examples, no vendor lock-in.

---

## ClaudeCode&OnlyMe Validation

| Question | Answer | Score |
|----------|--------|-------|
| ¿Resuelve problema REAL HOY? | YES - Dashboards necesitan charts ahora, KPIs visualizados | 1/1 |
| ¿Solución más SIMPLE? | YES - Declarative API, copiar ejemplos funciona | 1/1 |
| ¿2 personas lo mantienen? | YES - Javier + Claude Code, documentación clara | 1/1 |
| ¿Vale si NUNCA crecemos? | YES - Funciona para 10-100 usuarios sin cambios | 1/1 |
| **TOTAL** | **4/4 = ACCEPT** | **4/4** |

**Veto Threshold:** ANY NO = REJECT ✓ PASSED

---

## Alternatives Considered

### 1. Tremor (Next.js-focused charting library)
**Why rejected:**
- Limited customization (opinionated styles)
- Fewer chart types (no funnel, no timeline)
- Smaller community (2K vs Recharts 25K npm downloads)
- Tight coupling to Tailwind (we use it, but reduces flexibility)

### 2. Chart.js (Popular general-purpose library)
**Why rejected:**
- Imperative API (canvas manipulation) vs React declarative
- Requires react-chartjs-2 wrapper (extra dependency)
- Less React-native feel (feels like jQuery in React)

### 3. Custom D3.js Implementation
**Why rejected:**
- Violates ClaudeCode&OnlyMe: 2 people CAN'T maintain custom D3 code
- D3 learning curve steep, fragile on updates
- Recharts uses D3 internally (get benefits without complexity)

---

## Consequences

**Positive:**
- Zero cost (MIT license)
- Fast implementation (copy-paste examples)
- React-native API fits Next.js patterns
- Responsive by default (mobile tablet+)
- Accessible (ARIA, keyboard nav built-in)

**Negative:**
- Some advanced chart types missing (funnel chart for Compras)
- Limited animation customization (acceptable trade-off)
- Bundle size ~90KB (acceptable for dashboard app)

**Risks:**
- **Recharts abandonment:** Mitigated by large community, frequent updates, can fork if needed
- **Performance with 1000+ data points:** Mitigated by data aggregation (weekly vs daily), lazy loading charts

---

## Related

- SPEC: /specs/f002-dashboard/SPEC.md (Charts section)
- PLAN: /specs/f002-dashboard/PLAN.md (S005: Chart components)
- Recharts Docs: https://recharts.org/en-US/

---

**Decision Maker:** Javier Polo + Claude Code | **Review Date:** 2025-06-24 (6 months)
