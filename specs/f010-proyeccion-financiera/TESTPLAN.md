# Test Plan: Proyección Financiera y Presupuesto

Version: 1.0 | Date: 2025-12-24 09:40 | Owner: Claude Code | Status: Active

---

## Reference

**SDD Version:** 1.0 | **Feature:** Proyección Financiera (F010) | **Scope:** Unit + Integration + E2E | **Coverage Target:** 80% (budget service, ARIMA forecast, spend tracking, alerts)

---

## Test Strategy

**Philosophy:** 80% coverage on financial services (budget CRUD, spend tracking, ARIMA forecast, alert triggers). **CRITICAL:** Forecast accuracy ±15% (30-day prediction vs actual), 40% reduction over-budget projects. Unit tests verify ARIMA model fitting, confidence interval calculation, budget validation. Integration tests verify full pipeline (F003 purchase → update spend → check budget → trigger alert). E2E tests verify all 5 user stories (budget setup, spend tracking, >10% alert, forecast dashboard, purchase validation). Performance tests verify forecast inference <5s.

**Critical Paths:**
1. Budget setup (Gerencia) → Create project_budgets record → Validate authorization (only Admin/Gerencia)
2. Purchase closed (F003) → Create project_spend record → Update total_spent → Check pct_consumed → Trigger alert if >110%
3. Daily forecast refresh (2 AM cron) → Query historical spend (180 days) → Fit ARIMA → Predict 30/60/90 days → Store forecast → Cache 24h
4. Purchase validation → Query budget summary → Check: total_spent + purchase_amount ≤ budget × 1.1 → Approve/Reject

---

## Unit Tests

| Module | Test Cases | Tool | Status |
|--------|-----------|------|--------|
| Budget CRUD (budget.ts) | - createBudget() → Creates record with valid data<br>- createBudget() by non-Admin → ERROR "Unauthorized"<br>- updateBudget() → Updates total_budget_cop, dates<br>- getBudgetSummary() → Returns pct_consumed, remaining_budget, status (OK/WARNING/CRITICAL)<br>- getAllBudgets() → Returns all projects with budget | Vitest + PostgreSQL test DB | TODO |
| ARIMA forecast (forecast.py) | - forecast_project_spend(30 days) → Returns projected_spend + CI<br>- ARIMA fit with 180 days data → Order (5,1,0) correct<br>- Confidence interval 95% → CI width proportional to std_error<br>- Cumulative forecast → daily_forecast sum = projected_spend<br>- <30 days data → Falls back to linear_regression_forecast() | Pytest + mocked DB | TODO |
| Linear regression fallback (forecast.py) | - linear_regression_forecast(30 days) → Returns projected_spend (no CI)<br>- <30 days data → accuracy_warning = True<br>- Fallback model → Simple trend line (spend = a + b * day) | Pytest | TODO |
| Budget validation (budget.ts) | - validatePurchase() with budget available → valid = True<br>- validatePurchase() exceeds budget →110% → valid = False, reason = "Excede presupuesto disponible"<br>- validatePurchase() exactly at budget → valid = True | Vitest | TODO |
| Alert trigger (budget.ts) | - checkBudgetStatus() with pct_consumed >110% → Trigger alert<br>- checkBudgetStatus() with pct_consumed 95% → No alert (WARNING only)<br>- Alert recipients → Gerencia + Jefe Compras | Vitest | TODO |

---

## Integration Tests

| Component | Test Cases | Tool | Status |
|-----------|-----------|------|--------|
| Spend tracking pipeline (F003 integration) | - Full flow: F003 CERRADO → createSpendRecord(project_id, amount_cop) → Update total_spent → Recalculate pct_consumed<br>- Purchase with no budget → ERROR "Proyecto sin presupuesto"<br>- Multiple purchases same project → total_spent = sum all purchases | Vitest + PostgreSQL test DB + mocked F003 | TODO |
| Budget alert pipeline (F005 integration) | - Full flow: Spend update → pct_consumed >110% → sendImmediateAlert(BUDGET_EXCEEDED) → Email Gerencia + Jefe Compras<br>- Email sent <1 min<br>- Email includes: project, pct_consumed, total_spent, budget_cop, overspend_amount | Vitest + mocked F005 service | TODO |
| Forecast calculation pipeline | - Full flow: Query historical spend (180 days) → Fill missing dates (0 spend) → Fit ARIMA(5,1,0) → Forecast 30 days → Calculate 95% CI → Return forecast<br>- Forecast inference time <5s<br>- Outlier removal (optional IQR filter) → Forecast more stable | Pytest + PostgreSQL test DB | TODO |
| Monthly export pipeline (F011 integration) | - Full flow: 1st day of month → Query all projects financial_summary → Export to Google Sheets → Email Gerencia with Sheets link<br>- Export includes: project, budget, spent, remaining, pct_consumed<br>- Sheets link valid <7 days | Vitest + mocked F011 service | TODO |
| Purchase validation pipeline | - Full flow: Before approving purchase → validatePurchase(project_id, amount) → Check budget available → Approve/Reject<br>- Validation prevents approving if exceeds budget +10%<br>- Validation UI displays reason ("Excede presupuesto disponible") | Vitest | TODO |

---

## E2E Tests (Playwright)

**Setup:** `bun test:e2e` | **Environment:** Staging with test data

**Happy Paths:**

1. **US10.1 - Gerencia views budget vs real spend:**
   - Seed DB: Project with budget = $100M, spent = $75M
   - Navigate to /financial
   - Assert: Bar chart displays budget ($100M) vs real ($75M)
   - Assert: pct_consumed = 75% (green status)
   - Assert: Remaining budget = $25M
   - Assert: Page load <2s

2. **US10.2 - Gerencia receives >10% alert:**
   - Seed DB: Project with budget = $100M, spent = $112M (pct_consumed = 112%)
   - Trigger daily budget check (cron job)
   - Assert: Email sent to Gerencia + Jefe Compras
   - Assert: Subject = "Alerta de Presupuesto - Proyecto PAVICONSTRUJC"
   - Assert: Email body includes:
     - pct_consumed = 112%
     - Overspend = $12M
     - Desglose de sobrecosto por material (top 3)
     - Link to financial dashboard
   - Assert: Email sent <1 min
   - Assert: Dashboard displays red status (CRITICAL)

3. **US10.3 - Gerencia views forecast (next 30 days):**
   - Seed DB: Project with 180 days historical spend
   - Navigate to /financial/forecast
   - Select project (e.g., "PAVICONSTRUJC")
   - Assert: Line chart displays:
     - Historical spend (last 180 days)
     - Predicted spend (next 30 days, dashed line)
     - Confidence interval (shaded band)
   - Assert: KPIs displayed: projected_spend_30d, CI (min-max)
   - Assert: Comparison vs remaining budget (if forecast >remaining → red warning)
   - Assert: Page load <2s

4. **US10.4 - Compras validates purchase vs budget:**
   - Navigate to /purchases (F003)
   - Create new purchase: project = "PAVICONSTRUJC", amount = $5M
   - Before approval: System validates budget
   - Assert: If budget available → "Presupuesto disponible: $25M" (green)
   - Assert: If exceeds budget → "Excede presupuesto disponible: faltante $2M" (red, block approval)
   - Assert: Purchase approval blocked if exceeds budget +10%

5. **US10.5 - Gerencia exports financial report to Sheets:**
   - Navigate to /financial
   - Click "Exportar a Sheets"
   - Assert: Export initiated (loading indicator)
   - Assert: Google Sheets created with:
     - All projects (budget, spent, remaining, pct_consumed)
     - Gasto por material (top 10)
     - Comparación vs presupuesto (chart)
   - Assert: Email sent to Gerencia with Sheets link
   - Assert: Export time <5 min

**Edge Case Tests:**

6. **New project (no historical data for forecast):**
   - Seed DB: Project with 15 days spend data (<30 days)
   - Navigate to /financial/forecast
   - Select project
   - Assert: Message "Esperando 30 días de datos históricos"
   - Assert: Fallback linear regression forecast shown (with accuracy warning)
   - Assert: No confidence interval (insufficient data)

7. **Project exceeded budget >20% (critical escalation):**
   - Seed DB: Project with budget = $100M, spent = $125M (pct_consumed = 125%)
   - Trigger daily budget check
   - Assert: Email sent to CEO + Gerencia (escalation)
   - Assert: Subject = "[CRÍTICO] Proyecto 25% sobre presupuesto"
   - Assert: Email body includes: "Requiere auditoría"
   - Assert: Dashboard displays CRITICAL flag (red + icon)

8. **Budget adjustment mid-project:**
   - Navigate to /financial (as Gerencia)
   - Select project (e.g., "PAVICONSTRUJC")
   - Click "Editar Presupuesto"
   - Update: total_budget_cop = $120M (from $100M)
   - Submit
   - Assert: Budget updated, pct_consumed recalculated
   - Assert: Historical comparisons use original budget (audit trail)

9. **Irregular spend (large one-time purchase):**
   - Seed DB: Project with regular spend $1M/day, one spike $50M (outlier)
   - Run forecast calculation
   - Assert: ARIMA model detects outlier (IQR filter)
   - Assert: Forecast excludes outlier (or dampens effect)
   - Assert: Confidence interval wider (communicates uncertainty)

10. **Zero spend project (no purchases):**
    - Seed DB: Project with budget = $100M, spent = $0
    - Navigate to /financial
    - Assert: Table displays project with pct_consumed = 0%
    - Assert: Status = OK (green)
    - Assert: Message "Sin gasto registrado"
    - Assert: Forecast = N/A (no historical data)

**Performance Tests:**
- Forecast calculation <5s (ARIMA fit + predict 30 days, 180 days historical)
- Dashboard load <2s (query 100 projects financial summary)
- Budget alert <1 min (check all projects + send emails)
- Export to Sheets <5 min (query all projects + create Sheets + email)
- Purchase validation <500ms (query budget summary + validate)

**Accuracy Validation (CRITICAL):**
- Backtest ARIMA forecast: Predict 30 days using 180 days historical → Compare with actual 30 days → Calculate MAE (Mean Absolute Error)
- Target: MAE ±15% (predicted vs actual)
- Test with 3 projects over 3 months (9 forecasts total)

---

## Quality Gates CI

| Gate | Command | Target | Status |
|------|---------|--------|--------|
| Format | `bun run format --check` | 100% | TODO |
| Lint | `bun run lint` | 0 errors | TODO |
| Types | `bun run typecheck` | 0 errors | TODO |
| Unit | `bun run test` (lib/services/budget.test.ts, api/services/forecast.test.py) | 80%+ | TODO |
| Build | `bun run build` | Exit 0 | TODO |
| E2E | `bun test:e2e` (10 scenarios) | All 10 tests pass | TODO |

---

## Manual Testing Checklist

- [ ] **CRITICAL:** Forecast accuracy ±15% (backtest with 3-month historical data)
- [ ] **CRITICAL:** 40% reduction over-budget projects (vs baseline after 6 months)
- [ ] F003 integration working (purchase closed updates spend automatically)
- [ ] F005 integration working (>110% alert emails sent correctly)
- [ ] F011 integration working (monthly export to Sheets)
- [ ] Budget setup restricted to Admin/Gerencia only
- [ ] Spend tracking accurate (total_spent = sum all purchases)
- [ ] Budget status calculated correctly (OK/WARNING/CRITICAL based on pct_consumed)
- [ ] ARIMA forecast with 95% CI (confidence interval width proportional to uncertainty)
- [ ] Linear regression fallback (<30 days data)
- [ ] Purchase validation prevents approving if exceeds budget +10%
- [ ] Dashboard responsive (mobile + desktop, <2s load time)
- [ ] Forecast dashboard charts render correctly (Recharts line chart + CI band)
- [ ] Budget alerts <1 min (>110% → email sent)
- [ ] Critical escalation (>120% → CEO email)
- [ ] Export to Sheets working (all projects, monthly schedule)
- [ ] Error handling graceful (new project → "Esperando datos", insufficient data → fallback)
- [ ] UAT with Gerencia (3 projects: setup budget, monitor spend, view forecast)

---

**Token-efficient format:** 65 lines | 10 E2E scenarios | 80%+ coverage target | CRITICAL: ±15% forecast accuracy + 40% reduction over-budget projects
