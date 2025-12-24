# SDD Implementation Plan: Proyección Financiera

Version: 1.0 | Date: 2025-12-24 09:30 | Owner: Javier Polo | Status: Active

---

## Reference

**SPEC:** /specs/f010-proyeccion-financiera/SPEC.md
**ADR:** /specs/f010-proyeccion-financiera/ADR.md (ARIMA over Linear Regression)
**PRD:** docs/features/r10-proyeccion-financiera.md
**CRITICAL:** Forecast accuracy ±15%, 40% reduction over-budget projects

---

## Stack Validated

**Database:** PostgreSQL 15
- Source: /Users/mercadeo/neero/docs-global/stack/database-guide.md:15-25
- Tables: project_budgets (presupuesto inicial), project_spend (gasto acumulado)
- View: project_financial_summary (budget vs real)

**Python ML:** ARIMA (statsmodels)
- Source: /Users/mercadeo/neero/docs-global/stack/common-stack.md:70-75 (Python data science)
- Library: statsmodels.tsa.arima.model.ARIMA
- Use case: Time series forecasting (spend prediction)

**Frontend:** Next.js 15 App Router
- Source: /Users/mercadeo/neero/docs-global/stack/nextjs-react-patterns.md:10-15
- Pages: /financial (dashboard), /financial/forecast (projection)

**Charts:** Recharts
- Source: /Users/mercadeo/neero/docs-global/stack/common-stack.md:60-65
- Integration: F002 (Dashboard) - budget vs real bar chart, forecast line chart
- Use case: Financial charts (budget vs real, forecast with confidence interval)

**Notifications:** Gmail API (F005)
- Source: specs/f005-notificaciones/ADR.md
- Use case: Budget alerts (>110% email to Gerencia)

**Export:** Google Sheets API (F011)
- Source: specs/f011-google-workspace/ADR.md
- Use case: Monthly financial report export

**Validation Checklist:**
- [x] Stack matches docs-global/stack/ (6 citations)
- [x] NO INVENTAR protocol applied
- [x] ClaudeCode&OnlyMe filter passed (see ADR.md)
- [x] Dependencies: F003 (purchases), F005 (alerts), F011 (Sheets export)
- [x] Limitations: MVP = proyectos 12 meses max, gasto total (no sub-partidas)

---

## Implementation Steps (12 steps)

### S001: Create project_budgets table migration
**Deliverable:** SQL migration with project_budgets table (7 fields: id, project_id, project_name, total_budget_cop, budget_start_date, budget_end_date, created_by, created_at)
**Dependencies:** PostgreSQL connection, projects table
**Acceptance:** Table created, index on project_id, foreign key to projects

### S002: Create project_spend table migration
**Deliverable:** SQL migration with project_spend table (7 fields: id, project_id, purchase_id, amount_cop, spend_date, material_category, created_at)
**Dependencies:** S001 (project_budgets table), purchases table
**Acceptance:** Table created, index on project_id + spend_date, foreign keys to projects + purchases

### S003: Create project_financial_summary view
**Deliverable:** SQL view with aggregated financial summary (project_id, project_name, total_budget_cop, total_spent, remaining_budget, pct_consumed)
**Dependencies:** S001-S002 (budgets + spend tables)
**Acceptance:** View created, query <2s with 100 projects

### S004: Implement budget service (CRUD)
**Deliverable:** lib/services/budget.ts with createBudget(budget), updateBudget(id, budget), getBudgetSummary(project_id), getAllBudgets()
**Dependencies:** S001-S003 (tables + view)
**Acceptance:** CRUD operations work, authorization (only Gerencia/Admin can create/edit)

### S005: Implement spend tracking logic (F003 integration)
**Deliverable:** Hook in F003 CERRADO stage: on purchase closed → createSpendRecord(project_id, purchase_id, amount_cop) → update project_spend
**Dependencies:** S002 (project_spend table), F003 implemented
**Acceptance:** F003 CERRADO triggers spend update automatically, total_spent recalculated

### S006: Implement budget alert service
**Deliverable:** lib/services/budget.ts.checkBudgetStatus() with daily job: query all projects → if pct_consumed >110% → calculate overspend → send email (F005)
**Dependencies:** S003 (financial summary view), F005 (Gmail API)
**Acceptance:** Daily cron job, email sent to Gerencia + Jefe Compras with project + overspend amount

### S007: Implement ARIMA forecast engine (Python)
**Deliverable:** api/services/forecast.py with forecast_project_spend(project_id, days_ahead) → Query historical spend (180 days) → Fit ARIMA(5,1,0) → Predict next N days → Calculate 95% CI → Return {projected_spend, confidence_interval, daily_forecast}
**Dependencies:** S002 (project_spend historical data), statsmodels installed
**Acceptance:** Forecast accuracy ±15% (test with 3-month historical), inference time <5s

### S008: Implement linear regression fallback (insufficient data)
**Deliverable:** api/services/forecast.py with linear_regression_forecast(project_id, days_ahead) → If <30 days historical → Fit linear model → Predict next N days
**Dependencies:** S007 (forecast.py), NumPy installed
**Acceptance:** Fallback works if <30 days data, returns simplified forecast (no CI)

### S009: Implement purchase validation (before approve)
**Deliverable:** lib/services/budget.ts.validatePurchase(project_id, purchase_amount) → Check: total_spent + purchase_amount ≤ total_budget × 1.1 → Return {valid: boolean, reason: string}
**Dependencies:** S003 (financial summary)
**Acceptance:** Validation prevents approving purchase if exceeds budget +10%

### S010: Create financial dashboard page
**Deliverable:** app/financial/page.tsx with budget vs real bar chart (Recharts), table with all projects (pct_consumed, status), filters by project
**Dependencies:** S004 (budget service), Recharts
**Acceptance:** Responsive dashboard, <2s load time, color-coded status (green/yellow/red)

### S011: Create forecast dashboard page
**Deliverable:** app/financial/forecast/page.tsx with project selector, forecast line chart (Recharts) with historical spend + predicted 30/60/90 days + confidence interval (shaded band)
**Dependencies:** S007 (ARIMA forecast), Recharts
**Acceptance:** Chart displays CI band, forecast updates daily, <2s load time

### S012: Integration with F011 (monthly export to Sheets)
**Deliverable:** Hook monthly export (1st day of month): Query all projects financial summary → Export to Google Sheets (via F011) → Email Gerencia with Sheets link
**Dependencies:** F011 implemented, S003 (financial summary view)
**Acceptance:** Monthly export working, Sheets link sent <5 min

---

## Milestones

**M1 - Data Layer:** [S001-S003] | Target: Week 1 (Tables + view + spend tracking)
**M2 - Business Logic:** [S004-S009] | Target: Week 2 (Budget CRUD + alerts + forecast + validation)
**M3 - UI + Integration:** [S010-S012] | Target: Week 3 (Dashboards + F003/F005/F011 integration)

---

## Risk Mitigation

| Risk | Mitigation | Owner |
|------|-----------|-------|
| **Forecast inaccurate (>15% error)** | Use 6-month historical window (captures seasonality), ARIMA (not simple linear), validate with 3-month backtest, fall back to linear if <30 days | Claude Code |
| **Insufficient historical data (new projects)** | Linear regression fallback, show "Esperando 30 días datos" message, manual forecast by Gerencia | Javier Polo |
| Irregular spend (seasonal variation) | ARIMA model (order 5,1,0) handles seasonality, 6-month window, confidence interval communicates uncertainty | Claude Code |
| Projects >20% over budget (critical) | Escalation to CEO (F005), flag for audit, require justification before next purchase | Javier Polo |
| Forecast too optimistic (underpredicts) | Show confidence interval upper bound, warn if upper >budget, err on conservative side (1.1x buffer) | Claude Code |
| Multi-project purchase allocation | Manual split in MVP (user allocates %), Phase 2: auto-split by project size | Javier Polo |
| Slow forecast calculation (>5s) | Cache forecast (TTL 24h), recalculate only if new spend, optimize ARIMA fit (parallel processing) | Claude Code |

---

## Notes

**Critical Constraints:**
- F003 (Purchase Tracking) must be implemented for spend tracking integration
- F005 (Notificaciones) must be implemented for budget alerts
- F011 (Google Workspace) must be implemented for Sheets export
- Minimum 30 days historical data for ARIMA forecast (linear regression fallback if <30)
- MVP = proyectos 12 meses max (multi-year in Phase 2)
- MVP = gasto total proyecto (no sub-partidas, Phase 2 enhancement)

**Assumptions:**
- Purchases have defined amount_cop (from F003 orders)
- Projects have defined budget (initial setup required)
- Spend patterns relatively stable (ARIMA valid for 6-month window)
- Budget adjustments rare (MVP = single budget version, Phase 2 = versioning)
- Gerencia performs monthly financial review (validate forecast accuracy)

**Blockers:**
- F003 CERRADO stage implemented (S005 - internal dependency)
- F005 Gmail API service implemented (S006 - internal dependency)
- F011 Google Sheets API service implemented (S012 - internal dependency)
- Python statsmodels library installed (S007 - external dependency)

---

**Last updated:** 2025-12-24 09:30 | Maintained by: Javier Polo + Claude Code
