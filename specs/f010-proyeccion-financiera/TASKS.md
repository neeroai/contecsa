# TASKS: Proyección Financiera y Presupuesto

Version: 1.0 | Date: 2025-12-24 09:45 | Owner: Claude Code | Status: Active

---

## DOING

| ID | Task | DoD | Est |
|----|------|-----|-----|
| - | No active tasks yet | - | - |

---

## TODO (Priority Order - From PLAN.md)

| ID | Task | DoD | Est |
|----|------|-----|-----|
| T001 | Create project_budgets table migration (Drizzle) | - SQL migration file with 7 fields (id, project_id, project_name, total_budget_cop, budget_start_date, budget_end_date, created_by, created_at)<br>- Index on project_id (unique)<br>- Foreign key to projects table<br>- Constraint: total_budget_cop >0 | 2h |
| T002 | Create project_spend table migration (Drizzle) | - SQL migration file with 7 fields (id, project_id, purchase_id, amount_cop, spend_date, material_category, created_at)<br>- Index on project_id + spend_date (composite)<br>- Foreign keys to projects, purchases<br>- Constraint: amount_cop >0 | 2h |
| T003 | Create project_financial_summary view (SQL) | - SQL view with aggregated summary: project_id, project_name, total_budget_cop, total_spent (SUM), remaining_budget (budget - spent), pct_consumed ((spent / budget) × 100)<br>- Query <2s with 100 projects<br>- Test: View returns correct aggregations | 2h |
| T004 | Implement budget service CRUD (lib/services/budget.ts) | - createBudget(budget) → Validates input, creates record (authorization: only Admin/Gerencia)<br>- updateBudget(id, budget) → Updates budget, dates (authorization required)<br>- getBudgetSummary(project_id) → Returns financial summary (budget, spent, remaining, pct_consumed, status)<br>- getAllBudgets() → Returns all projects with budget<br>- Type-safe with Drizzle ORM | 4h |
| T005 | Implement spend tracking logic (F003 integration hook) | - Hook in F003 CERRADO stage: on purchase closed → createSpendRecord(project_id, purchase_id, amount_cop, spend_date)<br>- Extract: project_id, amount_cop from F003 purchase<br>- Update project_spend table<br>- Recalculate total_spent (automatic via view)<br>- Test: F003 CERRADO → Spend updated automatically | 3h |
| T006 | Implement budget alert service (checkBudgetStatus) | - checkBudgetStatus() function (called by daily cron)<br>- Query all projects financial_summary → Filter pct_consumed >110%<br>- Calculate overspend_amount = total_spent - (total_budget × 1.1)<br>- Call F005.sendImmediateAlert(BUDGET_EXCEEDED, {project, pct_consumed, overspend})<br>- Recipients: Gerencia + Jefe Compras<br>- If pct_consumed >120% → Escalate to CEO<br>- Log alert sent | 3h |
| T007 | Install Python statsmodels library (ARIMA) | - Add to api/requirements.txt: statsmodels>=0.14.0<br>- Install: `pip install statsmodels`<br>- Verify: `python -c "from statsmodels.tsa.arima.model import ARIMA"`<br>- Docker: Add to Dockerfile (if using containers) | 1h |
| T008 | Implement ARIMA forecast engine (api/services/forecast.py) | - forecast_project_spend(project_id, days_ahead) function<br>- Query historical spend (last 180 days, daily aggregation)<br>- Fill missing dates with 0 spend<br>- Fit ARIMA(5,1,0) model<br>- Forecast next N days (30/60/90)<br>- Calculate 95% CI (1.96 × std_error × sqrt(days))<br>- Return: {projected_spend, confidence_interval, daily_forecast, model="ARIMA"}<br>- Inference time <5s | 6h |
| T009 | Implement linear regression fallback (forecast.py) | - linear_regression_forecast(project_id, days_ahead) function<br>- If <30 days historical → Fallback to simple linear regression<br>- Fit: spend = a + b × day<br>- Predict next N days<br>- Return: {projected_spend, model="LINEAR", accuracy_warning=True}<br>- No confidence interval (insufficient data) | 2h |
| T010 | Implement purchase validation (validatePurchase) | - validatePurchase(project_id, purchase_amount) function<br>- Query getBudgetSummary(project_id)<br>- Check: total_spent + purchase_amount ≤ total_budget × 1.1<br>- Return: {valid: boolean, reason: string, available_budget: decimal}<br>- If exceeds → reason = "Excede presupuesto disponible: faltante $X" | 2h |
| T011 | Create financial dashboard page (app/financial/page.tsx) | - Table with all projects: project_name, total_budget_cop, total_spent, pct_consumed, status (OK/WARNING/CRITICAL)<br>- Bar chart (Recharts): Budget vs Real spend (per project)<br>- Color-coded status: Green (<90%), Yellow (90-110%), Red (>110%)<br>- Filter by project, status<br>- Responsive (mobile + desktop)<br>- Load time <2s (100 projects) | 5h |
| T012 | Create forecast dashboard page (app/financial/forecast/page.tsx) | - Project selector (dropdown)<br>- Line chart (Recharts): Historical spend (last 180 days) + Predicted spend (next 30/60/90 days, dashed line) + Confidence interval (shaded band)<br>- KPIs: projected_spend_30d, CI (min-max), remaining_budget, forecast vs budget comparison<br>- Warning if forecast >remaining budget<br>- Message if <30 days data: "Esperando 30 días de datos históricos"<br>- Load time <2s | 5h |
| T013 | Integrate F011 monthly export (Google Sheets) | - Hook monthly export (1st day of month, Vercel Cron)<br>- Query all projects financial_summary<br>- Format data: project, budget, spent, remaining, pct_consumed<br>- Call F011.exportToSheets(data, "Reporte Financiero Mensual")<br>- Email Gerencia with Sheets link<br>- Log export completed | 3h |
| T014 | Implement daily forecast refresh (Vercel Cron) | - app/api/financial/refresh-forecast/route.ts with GET endpoint<br>- vercel.json cron config: 2 AM COT (7:00 UTC) daily<br>- Query all active projects (budget_end_date >= today)<br>- Call forecast_project_spend(project_id, 30) for each<br>- Cache forecast (Redis, TTL 24h)<br>- Log refresh completed | 3h |
| T015 | Write unit tests for budget CRUD | - Test: createBudget() → Creates record<br>- Test: createBudget() by non-Admin → ERROR "Unauthorized"<br>- Test: updateBudget() → Updates budget<br>- Test: getBudgetSummary() → Returns pct_consumed, status<br>- Test: getAllBudgets() → Returns all projects<br>- Coverage >80% | 3h |
| T016 | Write unit tests for ARIMA forecast | - Test: forecast_project_spend(30 days) → Returns projected_spend + CI<br>- Test: ARIMA order (5,1,0) correct<br>- Test: 95% CI → Width proportional to std_error<br>- Test: Cumulative forecast → daily_forecast sum = projected_spend<br>- Test: <30 days data → Fallback to linear_regression_forecast()<br>- Coverage >80% | 4h |
| T017 | Write unit tests for linear regression fallback | - Test: linear_regression_forecast(30 days) → Returns projected_spend<br>- Test: accuracy_warning = True<br>- Test: Simple trend line (spend = a + b × day)<br>- Coverage >80% | 2h |
| T018 | Write unit tests for budget validation | - Test: validatePurchase() with budget available → valid = True<br>- Test: validatePurchase() exceeds budget +10% → valid = False<br>- Test: validatePurchase() exactly at budget → valid = True<br>- Coverage >80% | 2h |
| T019 | Write unit tests for alert trigger | - Test: checkBudgetStatus() >110% → Trigger alert<br>- Test: checkBudgetStatus() 95% → No alert (WARNING only)<br>- Test: Alert recipients → Gerencia + Jefe Compras<br>- Test: >120% → Escalation to CEO<br>- Coverage >80% | 2h |
| T020 | Write integration test for spend tracking pipeline | - Test: F003 CERRADO → createSpendRecord() → Update total_spent → Recalculate pct_consumed<br>- Test: Purchase with no budget → ERROR<br>- Test: Multiple purchases → total_spent = sum<br>- Coverage >80% | 3h |
| T021 | Write integration test for budget alert pipeline | - Test: Spend update → pct_consumed >110% → sendImmediateAlert(BUDGET_EXCEEDED) → Email sent<br>- Test: Email sent <1 min<br>- Test: Email includes overspend_amount<br>- Coverage >80% | 3h |
| T022 | Write integration test for forecast pipeline | - Test: Query historical (180 days) → Fill missing dates → Fit ARIMA → Forecast 30 days → Calculate CI<br>- Test: Forecast inference time <5s<br>- Test: Outlier removal (IQR filter) → Forecast stable<br>- Coverage >80% | 3h |
| T023 | Write integration test for monthly export | - Test: 1st day of month → Query financial_summary → exportToSheets() → Email Gerencia<br>- Test: Export includes all projects<br>- Test: Sheets link valid <7 days<br>- Coverage >80% | 2h |
| T024 | Write E2E test for US10.1 (budget vs real dashboard) | - Seed DB: Project budget = $100M, spent = $75M<br>- Navigate /financial<br>- Assert: Bar chart displays budget vs real<br>- Assert: pct_consumed = 75% (green)<br>- Assert: Remaining budget = $25M<br>- Test passes | 2h |
| T025 | Write E2E test for US10.2 (>10% alert) | - Seed DB: pct_consumed = 112%<br>- Trigger daily budget check<br>- Assert: Email sent to Gerencia + Jefe Compras<br>- Assert: Subject = "Alerta de Presupuesto"<br>- Assert: Email body includes overspend amount<br>- Assert: Dashboard displays red status (CRITICAL)<br>- Test passes | 3h |
| T026 | Write E2E test for US10.3 (forecast dashboard) | - Seed DB: 180 days historical spend<br>- Navigate /financial/forecast → Select project<br>- Assert: Chart displays historical + predicted (dashed) + CI (shaded band)<br>- Assert: KPIs displayed (projected_spend_30d, CI)<br>- Assert: Warning if forecast >remaining budget<br>- Test passes | 3h |
| T027 | Write E2E test for US10.4 (purchase validation) | - Navigate /purchases → Create new purchase<br>- Before approval: System validates budget<br>- Assert: If budget available → "Presupuesto disponible" (green)<br>- Assert: If exceeds → "Excede presupuesto" (red, block approval)<br>- Test passes | 2h |
| T028 | Write E2E test for US10.5 (export to Sheets) | - Navigate /financial → Click "Exportar a Sheets"<br>- Assert: Google Sheets created with financial data<br>- Assert: Email sent to Gerencia with Sheets link<br>- Assert: Export time <5 min<br>- Test passes | 2h |
| T029 | Write E2E tests for edge cases | - Test: New project (<30 days data) → "Esperando datos" message<br>- Test: >20% over budget → CEO escalation<br>- Test: Budget adjustment mid-project → pct_consumed recalculated<br>- Test: Irregular spend (outlier) → ARIMA detects, CI wider<br>- Test: Zero spend project → pct_consumed = 0%, forecast = N/A<br>- All 5 tests pass | 4h |
| T030 | Backtest ARIMA forecast (accuracy validation) | - Test: 3 projects over 3 months (9 forecasts)<br>- Predict 30 days using 180 days historical<br>- Compare predicted vs actual 30 days<br>- Calculate MAE (Mean Absolute Error)<br>- Target: MAE ±15%<br>- Document results in TESTPLAN.md | 6h |
| T031 | Performance test forecast calculation | - Measure: ARIMA fit + predict 30 days (180 days historical) <5s<br>- Measure: Dashboard load <2s (100 projects)<br>- Measure: Budget alert <1 min (check all projects + send emails)<br>- Optimize if slower | 3h |
| T032 | UAT with Gerencia | - Schedule UAT session with Gerencia (2 users)<br>- Test: 3 projects (setup budget, monitor spend, view forecast)<br>- Test: >10% alert triggered correctly<br>- Test: Purchase validation blocks if exceeds budget<br>- Test: Export to Sheets (monthly report)<br>- Collect feedback (NPS survey)<br>- Sign-off from Gerencia | 5h |
| T033 | 6-month KPI validation (40% reduction over-budget) | - After 6 months usage: Compare # projects over budget vs baseline<br>- Baseline: Historical data (pre-F010)<br>- Target: 40% reduction (e.g., 10 projects → 6 projects)<br>- Document results, adjust forecast model if needed | 4h |
| T034 | Document financial best practices | - Document: Budget setup guidelines (how to define per project)<br>- Document: Forecast interpretation (CI meaning, accuracy expectations)<br>- Document: Budget alert workflow (what to do when >110%)<br>- Document: Seasonal adjustments (when to adjust budget mid-project)<br>- Update README.md | 2h |

**Total Estimated Time:** 90 hours (~3-4 weeks)

---

## BLOCKED

| ID | Task | Blocker | Notes |
|----|------|---------|-------|
| T005 | F003 integration (spend tracking hook) | F003 not fully implemented yet | Can mock F003 CERRADO event for testing |
| T006 | F005 integration (budget alert) | F005 not fully implemented yet | Can mock F005.sendImmediateAlert() for testing |
| T013 | F011 integration (Sheets export) | F011 not fully implemented yet | Can mock F011.exportToSheets() for testing |

---

## DONE

| ID | Task | Closed | Commit |
|----|------|--------|--------|
| - | Migration to SDD | 2025-12-24 | TBD |

---

**Dependencies:**
- T001-T002 independent (table migrations)
- T003 depends on T001-T002 (tables exist)
- T004 depends on T001-T003 (tables + view)
- T005 depends on T002, F003 (spend table + F003 hook) - BLOCKED
- T006 depends on T003, F005 (financial summary + F005 alert) - BLOCKED
- T007 independent (Python library install)
- T008 depends on T002, T007 (spend table + statsmodels)
- T009 depends on T002 (spend table)
- T010 depends on T003 (financial summary)
- T011 depends on T004 (budget service)
- T012 depends on T008-T009 (forecast service)
- T013 depends on T003, F011 (financial summary + F011 export) - BLOCKED
- T014 depends on T008 (forecast service)
- T015-T019 depend on T004-T010 (modules to test)
- T020-T023 depend on T005-T013 (full pipeline)
- T024-T029 depend on T011-T012 (UI + full feature)
- T030-T031 depend on T008 (ARIMA forecast)
- T032-T034 depend on T024-T030 (E2E tests pass + accuracy validated)

**CRITICAL PRIORITY:**
- T030 (Backtest ARIMA accuracy) is CRITICAL success metric - Must achieve ±15% MAE
- T033 (6-month KPI validation) validates 40% reduction over-budget projects target

---

**Last updated:** 2025-12-24 09:45 | Maintained by: Claude Code
