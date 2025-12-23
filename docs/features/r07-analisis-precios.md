# R7 - Análisis Precios y Detección Anomalías

Version: 1.1 | Date: 2025-12-23 11:30 | Priority: P1 CRITICAL | Status: Planned

## Overview

Detección automática anomalías precios materiales construcción mediante análisis estadístico histórico. Previene sobrecobros, fraudes, errores facturación.

**Origen:** Caso Cartagena - 3 facturas sobrecobro +15-20% pasaron inadvertidas 2 meses.

## Caso Cartagena (Business Case)

| Aspecto | Detalle |
|---------|---------|
| **Qué** | 3 facturas concreto sobrecobro +15-20% vs histórico (Q1 2025) |
| **Por qué** | Proceso manual Excel + ausencia Liced Vega + sin validación precios automática |
| **Impacto** | $X millones COP sobrepago, 2 meses sin detectar, dependencia conocimiento tácito Liced |
| **Solución** | Sistema R7: base datos precios + algoritmos estadísticos + alertas automáticas >10% desviación |
| **ROI** | Prevenir 1 caso/año = $X millones saved (>500% ROI vs costo desarrollo $5M/año) |

## Business Context

| Elemento | Descripción |
|----------|-------------|
| **Problem** | Precios construcción varían 5-15% mensual (inflación, mercado). Sin herramienta → sobrecobros no detectados |
| **Solution** | BD histórica precios + algoritmos outlier (Z-score, IQR, rules) + alertas >10% desviación + bloqueo factura |
| **Impact** | Prevención sobrecobros, -95% tiempo validación (15min→1seg), negociación informada, compliance auditoría |

## User Stories

| ID | Actor | Story | Acceptance |
|----|-------|-------|------------|
| US7.1 | Compras | Alerta inmediata precio >10% vs histórico | Email <1min, dashboard flag, factura bloqueada |
| US7.2 | Gerencia | Gráfica tendencia precios (6 meses) | Línea temporal, anomalías rojas, vs inflación |
| US7.3 | Compras | Comparar vs 3 proveedores alternativos | Tabla precios, resaltar >10% vs más barato, sugerir alternativa |
| US7.4 | Contabilidad | Validar factura bloqueada | Ver razón bloqueo + histórico + aprobar/rechazar |
| US7.5 | Gerencia | Consultar AI "¿Por qué subió X?" | Sistema explica inflación, escasez, mercado |

## Tech Approach

**Flow:** Invoice (R4) → Extract price → Query historical (PostgreSQL) → Baseline (30/60/90d) + Z-score + IQR + Rules + Cross-supplier → NORMAL (process) | ANOMALY (block + alert R5)

| Component | Tech | Rationale |
|-----------|------|-----------|
| Price DB | PostgreSQL | 5+ años, ACID, fast queries |
| Statistical | NumPy, Pandas, SciPy | Z-score, IQR, baselines |
| Visualization | Recharts/Tremor | Interactive charts, anomaly highlights |
| Alerts | Gmail API (R5) + Dashboard (R2) | Immediate notification |
| ML | scikit-learn Isolation Forest | Unsupervised, improve over time |

## Detection Algorithms

**Implementation:** `/api/services/price_anomaly.py`

| Method | Threshold | Severity | Market Range (COP) |
|--------|-----------|----------|-------------------|
| **Baseline** | Consensus 30/60/90d windows | N/A | N/A |
| **Z-Score** | \|Z\|>2.0/2.5/3.0 | MED/HIGH/CRIT | N/A |
| **IQR** | >10%/20%/30% deviation | MED/HIGH/CRIT | N/A |
| **Rules** | +10-15%/15-30%/>30% vs baseline | MED/HIGH/CRIT | CEMENTO: 25-45K/50kg |
|  | Outside market range | HIGH | CONCRETO: 180-350K/m³ |
|  | Zero/negative price | CRITICAL | ACERO: 3.5-5.5M/ton |
| **Cross-Supplier** | >10%/20% vs cheapest 3 | MED/HIGH | AGREGADOS: 45-85K/m³ |

## Database

**Tables:** `price_history`, `price_anomalies`, `price_anomaly_resolutions` (see `/migrations/schema.sql`) | **Indexes:** material_id, supplier_id, invoice_date

## Manual Review

**Flow:** Block invoice → Alert (Jefe Compras, Gerencia) → Review historical + supplier comparison → Contact supplier → Decision (APPROVE_OVERRIDE or REJECT) → Log + notify

## Integration Points

| System | Integration | Purpose |
|--------|-------------|---------|
| R4 OCR | Extract price from invoice | Data source for detection |
| R5 Notifications | Send alerts | Email/dashboard when anomaly |
| R2 Dashboard | Price trend charts | Visualization for review |
| PostgreSQL | Historical queries | Baseline calculation |
| Python Backend | Statistical analysis | Core detection algorithms |

## Success Criteria

**MVP:** 100% detection >15%, <5% false positives, <1min detection time, review workflow, price charts
**Production:** Prevent 1+ Caso/year (ROI >500%), <24h resolution, NPS >80, 99.5% uptime

## Testing

**Cases:** Caso Cartagena sim (+20% → HIGH), seasonal variation (+5%/90d → no anomaly), new supplier (extra validation)
**UAT:** 10 real invoices (5 normal, 5 anomalous) with Compras, Gerencia, Contabilidad

## Future Enhancements

ML Isolation Forest, external market data (DANE), supplier scoring, AI justification analysis, predictive alerts

## References

**Caso:** docs/meets/contecsa_meet_2025-12-22.txt | **Code:** /api/services/price_anomaly.py | **Schema:** /migrations/schema.sql | **Integration:** R2, R4, R5

---

**CRITICAL:** Highest priority P1. Real financial risk demonstrated. Deploy ASAP after MVP core.
