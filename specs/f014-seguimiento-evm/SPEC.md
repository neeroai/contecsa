# SPEC: Seguimiento Avance Físico (EVM)

Version: 1.0 | Date: 2025-12-24 09:50 | Owner: Javier Polo | Status: Active

---

## Problem

**Current Workflow:** Sin sistema formal de medición de avance físico de obra → Solo se rastrea gasto por compra + estado de entregas (SI/NO/PARCIAL) → Sin métricas % avance físico vs % presupuesto ejecutado → Sin proyecciones de consumo futuro basadas en avance real → Sobrecostos detectados DESPUÉS de terminar proyecto (Caso Cartagena: 2 meses después).

**Impact:** Proyectos sobre presupuesto sin detección temprana. Flujo de caja imprevisible (compras urgentes no planeadas). Gerencia sin datos para intervenir a tiempo. Incapacidad de proyectar costo final (EAC).

---

## Objective

**Primary Goal:** Sistema de seguimiento de avance físico de obra (ejecutado vs proyectado) usando metodología EVM Simplificada (Earned Value Management) para detectar tempranamente sobrecostos vía comparación % avance físico vs % gasto presupuesto, con alertas automáticas si CPI <0.9 y proyección de costo final (EAC).

**Success Metrics:**
- Reducción 20% proyectos sobre presupuesto (intervención temprana con alertas CPI)
- Detección temprana sobrecostos (3+ alertas/año con CPI <0.9)
- Actualización avance <15 min/semana (form simple, no overhead insostenible)
- Precisión proyección EAC 85-95% vs costo final real
- 100% proyectos con seguimiento (9 consorcios)

---

## Scope

| In | Out |
|---|------|
| EVM KPIs básicos (EV, AC, PV, CPI, SPI, EAC, VAC) | Integración MS Project / Primavera P6 (Phase 2) |
| Curva S visual (3 líneas: Planificado, Ejecutado, Gastado) | PV basado en cronograma CPM detallado (MVP = PV lineal por tiempo) |
| Form carga avance semanal (% completitud por APU) | Reportes PMBOK completos (páginas de KPIs) |
| Alertas automáticas CPI <0.9 (F005) | Mobile app específica (usar responsive web) |
| Proyección EAC (costo final estimado) | Forecasting ML avanzado (ARIMA, LSTM - F010 handles this) |
| APUs categorías amplias (10-20 por proyecto) | APUs granulares (100+ por proyecto - overhead alto) |
| Sugerencia automática % avance vía compras (Phase 2) | Tracking individual obreros (time tracking) |
| Integración F010 (budgets), F003 (purchases), F002 (dashboard) | Integración ERP externo (SAP, Oracle) |
| Waste factor (15% concreto, 5% acero) | Waste tracking individual (pérdidas detalladas) |

---

## Contracts

### Input (Update Physical Progress)

| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| project_id | uuid | Y | Proyecto activo |
| apu_id | uuid | Y | APU (Análisis Precio Unitario) |
| measurement_date | date | Y | Fecha medición (típicamente Viernes semanal) |
| quantity_executed | decimal | Y | Cantidad ejecutada acumulada (no incremental) |
| pct_complete | decimal | Y | Porcentaje completitud 0-100 |
| measured_by | uuid | Y | User ID (Técnico) |
| notes | string | N | Opcional (e.g., "Retraso por lluvia") |

### Output (EVM Summary)

| Field | Type | Condition | Notes |
|-------|------|-----------|-------|
| project_id | uuid | Always | Proyecto ID |
| project_name | string | Always | Nombre proyecto |
| bac | decimal | Always | Budget At Completion (presupuesto total COP) |
| ev | decimal | Always | Earned Value (presupuesto × % avance físico) |
| ac | decimal | Always | Actual Cost (gasto real acumulado, from F010) |
| pv | decimal | Always | Planned Value (BAC × % tiempo transcurrido) |
| cpi | decimal | Always | Cost Performance Index (EV / AC, >1 = bajo presupuesto) |
| spi | decimal | Always | Schedule Performance Index (EV / PV, >1 = adelantado) |
| eac | decimal | Always | Estimate At Completion (BAC / CPI, costo final proyectado) |
| vac | decimal | Always | Variance At Completion (BAC - EAC, sobrecosto/ahorro) |
| pct_physical_progress | decimal | Always | % avance físico general (weighted avg APUs) |
| cpi_status | enum | Always | OK (≥0.9), WARNING (0.8-0.9), CRITICAL (<0.8) |

---

## Business Rules

- **EV Calculation:** EV = BAC × (Weighted Avg % Completitud APUs) → Weighted by total_price_cop per APU
- **AC Calculation:** AC = Total spent from F010.project_spend (auto-sync)
- **PV Calculation (Simplified):** PV = BAC × (days_elapsed / total_days) → Assumes linear progress (no CPM schedule)
- **CPI Threshold:** CPI <0.9 → Trigger CRITICAL alert (F005 email to Gerencia + CEO) | CPI 0.9-0.95 → WARNING (yellow badge)
- **SPI Threshold:** SPI <0.8 → Trigger WARNING (schedule delay)
- **EAC Projection:** EAC = BAC / CPI → If CPI <1, project will exceed budget
- **VAC Interpretation:** VAC <0 → Projected overspend (red) | VAC >0 → Projected savings (green)
- **Update Frequency:** Weekly (Fridays PM, suggested) → Evaluate sustainability month 1, reduce to biweekly if overhead too high
- **Decrement Validation:** If pct_complete decreased vs previous week → Warn user (likely data entry error)
- **APU Setup:** Gerencia/Admin only can create/edit APUs (authorization required)
- **Waste Factor (Phase 2):** Automatic suggestion pct_complete = min(100, total_purchased / (budgeted × waste_factor)) → 15% concreto, 5% acero, 10% otros
- **BAC Update:** Allow updating BAC mid-project (budget change) → Create audit trail (version history)

---

## Edge Cases

| Scenario | Handling | Notes |
|----------|----------|-------|
| New project (no historical progress) | Display "Esperando primera medición" → EV = 0, CPI/SPI = N/A | Cannot calculate until first measurement |
| 100% avance físico but AC <BAC | CPI >1 → Project under budget (green badge), VAC >0 (savings) | Success case |
| CPI <0.8 (CRITICAL sobrecosto) | Escalate alert to CEO + Gerencia → Flag project for audit → Block new purchases until review | Critical intervention |
| SPI >1.2 (too fast) | Warn: "Avance acelerado" → May indicate low quality (rushing) | Investigate quality |
| Decrement pct_complete (week N <week N-1) | Warn: "Porcentaje disminuyó vs semana anterior" → Confirm user didn't make error | Data validation |
| BAC updated mid-project | Create new budget_version → Show "Presupuesto ajustado" badge → Historical comparisons use original BAC | Audit trail |
| APU 100% complete but purchases still pending | Flag: "APU completo pero compras pendientes" → Possible error or rework | Investigate |
| Project extended (deadline changed) | Recalculate PV with new total_days → SPI recalculated | Manual budget update |
| Zero physical progress but AC >0 | CPI → 0 (division by zero) → Display "Gasto sin avance" warning | Mobilization costs |
| Multiple APUs same category | Group by category for summary view → Drill down to APU detail | Dashboard hierarchy |

---

## Observability

**Logs:**
- `physical_progress_updated` (info) - Project, APU, pct_complete, measured_by, date
- `evm_calculated` (info) - Project, CPI, SPI, EAC, VAC, cpi_status
- `cpi_alert_triggered` (warn) - Project, CPI (<0.9), EAC, VAC, alert_sent
- `spi_alert_triggered` (warn) - Project, SPI (<0.8), schedule_delay
- `decrement_warning` (warn) - Project, APU, previous_pct, new_pct (decrement detected)
- `bac_updated` (info) - Project, previous_bac, new_bac, reason, updated_by

**Metrics:**
- `projects_with_evm_tracking_count` - Projects with at least 1 progress measurement (target 100%)
- `cpi_alerts_triggered_count` - CRITICAL alerts sent (CPI <0.9, target 3+ per year)
- `evm_update_time_p50` - Median time to complete weekly form (target <15 min)
- `eac_accuracy_pct` - (EAC vs actual final cost) / actual × 100 (target 85-95%)
- `projects_over_budget_count` - Projects with CPI <1 (target <20% reduction)
- `avg_cpi_portfolio` - Average CPI across all active projects (target ≥0.95)
- `avg_spi_portfolio` - Average SPI across all active projects (target ≥0.9)

**Traces:**
- `physical_progress_pipeline` (span) - Full flow: Update progress → Recalculate EVM KPIs → Check CPI → Trigger alert if needed
- `evm_calculation` (span) - Full flow: Query APUs + progress + budget + spend → Calculate EV/AC/PV/CPI/SPI/EAC/VAC

---

## Definition of Done

- [ ] Code review approved
- [ ] project_apus + project_physical_progress tables created (PostgreSQL)
- [ ] v_project_evm view created (auto-calculates KPIs)
- [ ] APU setup (create/edit by Admin/Gerencia) working
- [ ] Form actualización avance semanal (% completitud por APU) working
- [ ] EVM KPIs calculated correctly (EV, AC, PV, CPI, SPI, EAC, VAC)
- [ ] Curva S chart (Recharts) displays 3 líneas (Planificado, Ejecutado, Gastado)
- [ ] CPI alerts (<0.9) trigger (email to Gerencia + CEO via F005)
- [ ] SPI alerts (<0.8) trigger (schedule delay warning)
- [ ] Dashboard EVM (Gerencia) displays KPIs + Curva S + APUs tabla
- [ ] Integration with F010 (AC from project_spend, BAC from project_budgets)
- [ ] Decrement validation (warn if pct_complete decreased)
- [ ] **CRITICAL:** Actualización avance <15 min/semana (test with Técnico)
- [ ] **CRITICAL:** Precisión EAC 85-95% (validate with 3 completed projects)
- [ ] Quality gates pass (format, lint, types, tests 80%+, build)
- [ ] Deployed to staging
- [ ] UAT with Gerencia + Técnico (1 proyecto piloto: PAVICONSTRUJC, 4 semanas seguimiento)

---

**Related:** F010 (Proyección Financiera - budgets/spend), F003 (Seguimiento Compras - purchases), F002 (Dashboard - Curva S visual), F005 (Notificaciones - CPI alerts) | **Dependencies:** PostgreSQL EVM tables, F010 budgets/spend integration, F005 alerts, Recharts Curva S

**Original PRD:** docs/features/r14-seguimiento-evm.md
