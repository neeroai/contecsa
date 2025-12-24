# SPEC: Proyección Financiera y Presupuesto

Version: 1.0 | Date: 2025-12-24 09:25 | Owner: Javier Polo | Status: Active

---

## Problem

**Current Workflow:** Sin visibilidad de gasto real vs presupuesto en tiempo real → Proyectos terminan sobre presupuesto sin detección temprana → Flujo de caja imprevisible (compras urgentes no planeadas) → Gerencia sin herramienta para decisiones financieras (¿aprobar nueva compra?) → Negociación con clientes difícil (sin datos reales para cambios de alcance).

**Impact:** Proyectos sobre presupuesto (sin alertas tempranas). Flujo de caja imprevisible (sorpresas de gasto). Decisiones financieras sin datos (aprobar/rechazar compras a ciegas). Conflictos con clientes (cambios de alcance sin justificación).

---

## Objective

**Primary Goal:** Sistema de proyección financiera de gastos en materiales por proyecto con presupuesto inicial, gasto real acumulado en tiempo real, proyección ML de gasto restante (ARIMA), alertas automáticas si >10% sobre presupuesto, y forecast 30/60/90 días para optimizar flujo de caja y prevenir sobrecostos.

**Success Metrics:**
- Reducción 40% proyectos sobre presupuesto (detección temprana, ajuste a tiempo)
- Reducción 60% sorpresas de flujo de caja (proyección confiable 30 días)
- Time to forecast <5s (ARIMA model inference)
- Forecast accuracy ±15% (predicted vs actual 30 días)
- 100% compras validadas vs presupuesto disponible antes de aprobar

---

## Scope

| In | Out |
|---|------|
| Presupuesto inicial por proyecto (setup by Gerencia) | Presupuesto multi-año (MVP = proyectos 12 meses max) |
| Gasto real acumulado en tiempo real (F003 purchases) | Gasto por sub-partida (MVP = gasto total proyecto) |
| Proyección ML (ARIMA time series) próximos 30/60/90 días | AI/ML avanzado (Deep Learning, LSTM - Phase 2) |
| Alertas automáticas si >10% sobre presupuesto (F005) | Alertas configurables por usuario (MVP = 10% fijo) |
| Dashboard presupuesto vs real (Gerencia, Compras) | Dashboard por material (MVP = vista proyecto) |
| Validación compra vs presupuesto disponible | Recomendación de ajuste presupuesto (Phase 2) |
| Exportar reporte financiero a Google Sheets (mensual) | Integración ERP externo (SAP, Oracle) |
| Forecast confianza 95% (intervalo min-max) | Forecast por fase de proyecto (MVP = global) |

---

## Contracts

### Input (Setup Budget)

| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| project_id | uuid | Y | Proyecto existente |
| total_budget_cop | decimal | Y | Presupuesto total (COP) |
| budget_start_date | date | Y | Fecha inicio proyecto |
| budget_end_date | date | Y | Fecha fin proyecto |
| created_by | uuid | Y | User ID (Gerencia/Admin) |

### Output (Financial Summary)

| Field | Type | Condition | Notes |
|-------|------|-----------|-------|
| project_id | uuid | Always | Proyecto ID |
| project_name | string | Always | Nombre proyecto |
| total_budget_cop | decimal | Always | Presupuesto inicial (COP) |
| total_spent | decimal | Always | Gasto acumulado (COP) |
| remaining_budget | decimal | Always | Presupuesto restante (COP) |
| pct_consumed | decimal | Always | Porcentaje consumido (0-100+) |
| budget_status | enum | Always | OK \| WARNING (>90%) \| CRITICAL (>110%) |
| forecast_30d | decimal | If enough data | Proyección gasto próximos 30 días (COP) |
| forecast_confidence_interval | object | If enough data | { lower: decimal, upper: decimal } |

---

## Business Rules

- **Budget Setup:** Only Gerencia/Admin can create/edit project budgets (authorization required)
- **Spend Tracking:** Each purchase (F003 CERRADO) → Add to project_spend automatically
- **Budget Status:** pct_consumed <90% = OK | 90-110% = WARNING (yellow) | >110% = CRITICAL (red)
- **Alert Trigger:** If pct_consumed >110% → Send immediate alert (F005) to Gerencia + Jefe Compras
- **Forecast Requirement:** Minimum 30 days historical data (otherwise "Insufficient data")
- **Forecast Model:** ARIMA(5,1,0) time series (if <30 days → Linear regression fallback)
- **Confidence Interval:** 95% confidence (1.96 × std_error)
- **Purchase Validation:** Before approving purchase → Validate: total_spent + purchase_amount ≤ total_budget × 1.1 (allow 10% overspend)
- **Export Schedule:** Monthly export to Google Sheets (via F011) on 1st day of month
- **Forecast Refresh:** Daily recalculation at 2 AM (Vercel Cron) for all active projects
- **Multi-Project Aggregation:** Gerencia can view total spent across all projects (portfolio view)

---

## Edge Cases

| Scenario | Handling | Notes |
|----------|----------|-------|
| New project (no historical data) | Forecast = N/A → Show message "Esperando 30 días de datos históricos" | Cannot forecast without history |
| Project finished early (budget_end_date passed) | Mark budget as "Cerrado" → No more spend updates, final report generated | Archive forecast |
| Project extended (budget_end_date updated) | Recalculate forecast with new end date → Extend historical window | Manual budget update |
| Budget exceeded >20% | CRITICAL alert to CEO + Gerencia → Flag project for audit | Escalation |
| Negative remaining budget | Display as negative (don't clamp to 0) → Red flag in dashboard | Show overspend |
| Irregular spend (seasonal) | ARIMA (6-month window) captures seasonality → Accurate forecast | Time series handles seasonality |
| Zero spend project | Display "Sin gasto registrado" → pct_consumed = 0%, forecast = N/A | No data to project |
| Purchase spans multiple projects | Allocate purchase amount proportionally (manual split) → Sum to project_spend | Manual allocation (Phase 2: auto-split) |
| Budget adjustment (mid-project) | Create new budget_version → Historical comparisons use original budget | Audit trail |
| Forecast too low (overly optimistic) | Show confidence interval (upper bound) → Warn if upper >budget | Communicate uncertainty |

---

## Observability

**Logs:**
- `budget_created` (info) - Project, budget_cop, created_by, start_date, end_date
- `spend_updated` (info) - Project, purchase_id, amount_cop, total_spent, pct_consumed
- `budget_alert_triggered` (warn) - Project, pct_consumed (>110%), total_spent, budget_cop, alert_sent
- `forecast_calculated` (info) - Project, forecast_30d, confidence_interval, model (ARIMA/linear)
- `forecast_insufficient_data` (warn) - Project, days_historical (<30), min_required
- `budget_exceeded_20pct` (error) - Project, pct_consumed, escalation to CEO

**Metrics:**
- `projects_over_budget_count` - Projects with pct_consumed >110% (target <10%)
- `forecast_accuracy_mae` - Mean Absolute Error (predicted vs actual 30 días, target ±15%)
- `budget_alerts_triggered_count` - Alerts sent (per day)
- `forecast_calculation_time_p95` - 95th percentile forecast time (target <5s)
- `projects_with_forecast_count` - Projects with sufficient data for forecast
- `total_portfolio_spend_cop` - Sum all projects total_spent (executive KPI)

**Traces:**
- `financial_summary` (span) - Full flow: Query budgets + spend → Calculate summary → Trigger alert if needed
- `forecast_pipeline` (span) - Full flow: Query historical → Fit ARIMA → Predict → Calculate CI

---

## Definition of Done

- [ ] Code review approved
- [ ] project_budgets + project_spend tables created (PostgreSQL)
- [ ] Budget setup (create/edit by Gerencia) working
- [ ] Spend tracking (F003 purchases update project_spend automatically)
- [ ] Budget status calculated (OK/WARNING/CRITICAL based on pct_consumed)
- [ ] Budget alerts (>110%) trigger (email to Gerencia + Jefe Compras via F005)
- [ ] Forecast ARIMA model implemented (Python, 30/60/90 días)
- [ ] Forecast confidence interval calculated (95%, min-max)
- [ ] Dashboard presupuesto vs real (Recharts bar chart)
- [ ] Dashboard forecast (Recharts line chart with confidence band)
- [ ] Purchase validation (check vs presupuesto disponible before approve)
- [ ] Export to Google Sheets (mensual, via F011)
- [ ] **CRITICAL:** Forecast accuracy ±15% (test with 3-month historical data)
- [ ] **CRITICAL:** 40% reduction proyectos sobre presupuesto (vs baseline)
- [ ] Quality gates pass (format, lint, types, tests 80%+, build)
- [ ] Deployed to staging
- [ ] UAT with Gerencia (3 proyectos: setup budget, monitor spend, view forecast)

---

**Related:** F003 (Purchase Tracking - spend updates), F005 (Notificaciones - budget alerts), F002 (Dashboard - financial charts), F011 (Google Sheets - export) | **Dependencies:** PostgreSQL financial tables, Python ARIMA model, F003 purchases integration, F005 alerts

**Original PRD:** docs/features/r10-proyeccion-financiera.md
