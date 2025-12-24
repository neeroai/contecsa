# Test Plan: Seguimiento Avance Físico (EVM)

Version: 1.0 | Date: 2025-12-24 10:05 | Owner: Claude Code | Status: Active

---

## Reference

**SDD Version:** 1.0 | **Feature:** Seguimiento Avance Físico (F014) | **Scope:** Unit + Integration + E2E | **Coverage Target:** 80% (EVM calculations, CPI alerts, progress updates, Curva S)

---

## Test Strategy

**Philosophy:** 80% coverage on EVM services (APU CRUD, progress updates, KPIs calculation, CPI/SPI alerts). **CRITICAL:** Update time <15 min/week, EAC accuracy 85-95%, 20% reduction over-budget projects. Unit tests verify EVM formulas (EV, AC, PV, CPI, SPI, EAC, VAC), weighted average calculation, decrement validation. Integration tests verify full pipeline (update progress → recalculate KPIs → trigger CPI alert). E2E tests verify all 5 user stories (setup APUs, update progress, view Curva S, CPI alert, AI agent query). Performance tests verify dashboard load <2s.

**Critical Paths:**
1. Setup APUs (Gerencia) → Define 10-20 APUs per project → Assign budgets (quantity × unit_price)
2. Update progress (Técnico weekly) → Input % completitud per APU → Recalculate EVM KPIs → Trigger CPI alert if <0.9
3. Daily CPI check (2 AM cron) → Query all projects → If CPI <0.9 → Send email (F005) to Gerencia + CEO
4. View Curva S (Gerencia) → Chart displays 3 líneas (Planificado PV, Ejecutado EV, Gastado AC)

---

## Unit Tests

| Module | Test Cases | Tool | Status |
|--------|-----------|------|--------|
| APU CRUD (apu.ts) | - createAPU() → Creates record with valid data<br>- createAPU() by non-Admin → ERROR "Unauthorized"<br>- updateAPU() → Updates quantity_budgeted, unit_price_cop<br>- getAPUs(project_id) → Returns all APUs for project<br>- deleteAPU() → Soft delete (or hard delete if no progress) | Vitest + PostgreSQL test DB | TODO |
| EVM calculations (SQL view) | - EV = BAC × weighted_avg(pct_complete) → Correct weighted average<br>- AC = SUM(project_spend.amount_cop) → Correct total spent<br>- PV = BAC × (days_elapsed / total_days) → Linear calculation correct<br>- CPI = EV / AC → Handles division by zero (AC = 0)<br>- SPI = EV / PV → Handles division by zero (PV = 0)<br>- EAC = BAC / CPI → Correct projection<br>- VAC = BAC - EAC → Correct variance | Vitest + PostgreSQL test DB | TODO |
| Progress update (evm.ts) | - updateProgress() → Creates progress record<br>- updateProgress() with pct_complete >100 → ERROR "Invalid percentage"<br>- updateProgress() with decrement → WARN "Decreased vs previous week"<br>- getProgress(project_id) → Returns all progress measurements<br>- getEVMSummary(project_id) → Returns KPIs from view | Vitest + PostgreSQL test DB | TODO |
| CPI alert (evm.ts) | - checkCPI() with CPI <0.9 → Trigger alert<br>- checkCPI() with CPI 0.92 → No alert (WARNING only)<br>- checkCPI() with CPI <0.8 → CRITICAL escalation to CEO<br>- Alert includes: project, CPI, EAC, VAC | Vitest | TODO |
| SPI alert (evm.ts) | - checkSPI() with SPI <0.8 → Trigger alert<br>- checkSPI() with SPI 0.85 → No alert<br>- Alert includes: project, SPI, schedule_delay | Vitest | TODO |

---

## Integration Tests

| Component | Test Cases | Tool | Status |
|-----------|-----------|------|--------|
| Progress update pipeline | - Full flow: updateProgress(apu_id, pct_complete) → Recalculate EVM KPIs (view refresh) → Check CPI → Trigger alert if <0.9<br>- Multiple APUs → Weighted average calculation correct<br>- Progress update triggers view refresh automatically | Vitest + PostgreSQL test DB | TODO |
| CPI alert pipeline (F005 integration) | - Full flow: CPI <0.9 → sendImmediateAlert(CPI_CRITICAL) → Email Gerencia + CEO<br>- Email sent <1 min<br>- Email includes: project, CPI, EAC, VAC, Curva S link | Vitest + mocked F005 service | TODO |
| F010 integration (BAC + AC) | - Full flow: project_budgets.total_budget_cop → BAC in EVM view<br>- project_spend.amount_cop → AC in EVM view (auto-sync)<br>- Budget update (F010) → EVM KPIs recalculated | Vitest + PostgreSQL test DB | TODO |
| Decrement validation | - Full flow: Week 1: 60% → Week 2: 55% → WARN "Decreased 5%"<br>- Confirm user didn't make data entry error | Vitest | TODO |
| APU weighted average | - Full flow: 3 APUs (40%, 60%, 80% complete, weights 100M, 200M, 150M) → EV = BAC × ((40×100 + 60×200 + 80×150) / (100+200+150)) / 100<br>- Validate weighted average correct | Vitest | TODO |

---

## E2E Tests (Playwright)

**Setup:** `bun test:e2e` | **Environment:** Staging with test data

**Happy Paths:**

1. **US14.1 - Gerencia views physical progress vs financial (Curva S):**
   - Seed DB: Project PAVICONSTRUJC with BAC = $500M, 50% time elapsed, 40% physical progress, AC = $220M
   - Navigate to /projects/PAVICONSTRUJC/evm
   - Assert: Curva S chart displays 3 líneas:
     - PV (Planificado) = $250M (green dashed line)
     - EV (Ejecutado) = $200M (blue solid line)
     - AC (Gastado) = $220M (red solid line)
   - Assert: KPI cards display:
     - % Avance Físico = 40%
     - CPI = 0.91 (yellow badge, WARNING)
     - SPI = 0.80 (yellow badge, schedule delay)
     - EAC = $549M (projected final cost)
     - VAC = -$49M (sobrecosto proyectado, red)
   - Assert: Tabla APUs displays top 5 with mayor desviación
   - Assert: Page load <2s

2. **US14.2 - Gerencia receives CPI <0.9 alert:**
   - Seed DB: Project with CPI = 0.88 (<0.9)
   - Trigger daily CPI check (cron job)
   - Assert: Email sent to Gerencia + CEO
   - Assert: Subject = "Alerta Crítica - Proyecto sobre presupuesto (CPI 0.88)"
   - Assert: Email body includes:
     - CPI = 0.88 (12% sobrecosto)
     - EAC = $568M (projected final cost)
     - VAC = -$68M (sobrecosto proyectado)
     - Link to Curva S dashboard
   - Assert: Email sent <1 min
   - Assert: Dashboard displays red badge (CRITICAL)

3. **US14.3 - Técnico updates weekly physical progress:**
   - Navigate to /projects/PAVICONSTRUJC/progress (as Técnico)
   - Form displays: 15 APUs (lista con checkboxes)
   - Input % completitud for each APU (e.g., "Excavación manual" = 70%, "Concreto 3000 PSI" = 50%)
   - Optional notes: "Retraso en concreto por lluvia"
   - Submit form
   - Assert: Progress saved (pct_complete updated for each APU)
   - Assert: EVM KPIs recalculated automatically
   - Assert: Form completion time <15 min (timer)
   - Assert: Decrement validation: If APU decreased → WARN "% disminuyó vs semana anterior"

4. **US14.4 - Gerencia views projected final cost (EAC):**
   - Navigate to /projects/PAVICONSTRUJC/evm
   - KPI card displays:
     - EAC = $549M (projected final cost based on CPI 0.91)
     - VAC = -$49M (sobrecosto proyectado)
     - Forecast próximos 3 meses (chart with trend line)
   - Assert: Comparison vs BAC ($500M original budget) displayed
   - Assert: Alert if EAC >BAC: "Proyección: $49M sobre presupuesto"

5. **US14.5 - AI Agent answers "¿CPI de PAVICONSTRUJC?":**
   - User queries AI Agent (F001): "¿CPI de PAVICONSTRUJC?"
   - Assert: Agent responds:
     - "CPI = 0.91 (Cost Performance Index)"
     - "Significado: El proyecto está gastando 9% más de lo previsto por cada unidad de trabajo completada"
     - "Tendencia últimos 3 meses: 0.93 → 0.92 → 0.91 (empeorando)"
     - "EAC proyectado: $549M (sobre presupuesto)"
   - Assert: Response includes link to Curva S dashboard

**Edge Case Tests:**

6. **New project (no progress yet):**
   - Seed DB: Project with APUs defined but no progress measurements
   - Navigate to /projects/NEW_PROJECT/evm
   - Assert: Message "Esperando primera medición de avance"
   - Assert: EV = 0, CPI/SPI = N/A (no division by zero error)
   - Assert: Curva S displays PV only (Planificado line)

7. **CPI <0.8 (CRITICAL sobrecosto):**
   - Seed DB: Project with CPI = 0.75 (<0.8)
   - Trigger daily CPI check
   - Assert: Email sent to CEO + Gerencia (escalation)
   - Assert: Subject = "[CRÍTICO] Proyecto 25% sobre presupuesto"
   - Assert: Email body includes: "Requiere auditoría inmediata"
   - Assert: Dashboard displays CRITICAL flag (red + icon)
   - Assert: New purchases blocked until review (optional integration with F003)

8. **Decrement validation (data entry error):**
   - Week 1: APU "Excavación" = 70%
   - Week 2: User enters 65% (decrement)
   - Assert: Form displays warning: "Porcentaje disminuyó 5% vs semana anterior. ¿Confirmar?"
   - Assert: User can confirm (if rework) or correct (if error)

9. **BAC update mid-project:**
   - Navigate to /projects/PAVICONSTRUJC/apus (as Gerencia)
   - Click "Editar Presupuesto"
   - Update: BAC = $550M (from $500M, budget increase)
   - Submit
   - Assert: EVM KPIs recalculated with new BAC
   - Assert: Badge displays "Presupuesto ajustado" (audit trail)
   - Assert: Historical comparisons use original BAC ($500M)

10. **100% progress but AC <BAC (under budget):**
    - Seed DB: Project with 100% physical progress, AC = $450M, BAC = $500M
    - Navigate to /projects/SUCCESS_PROJECT/evm
    - Assert: CPI = 1.11 (green badge, under budget)
    - Assert: VAC = +$50M (savings, green)
    - Assert: Dashboard displays success message: "Proyecto completado bajo presupuesto"

**Performance Tests:**
- Curva S dashboard load <2s (project with 20 APUs, 52 weeks progress)
- EVM KPIs calculation <500ms (recalculate on progress update)
- Weekly form <15 min to complete (20 APUs, timed with real Técnico)
- CPI alert <1 min (check all 9 projects + send emails)

**Accuracy Validation (CRITICAL):**
- EAC accuracy validation: Test with 3 completed projects → Compare EAC (predicted at 50% progress) vs actual final cost → Calculate error %
- Target: MAE (Mean Absolute Error) <15% (85-95% accuracy range)

---

## Quality Gates CI

| Gate | Command | Target | Status |
|------|---------|--------|--------|
| Format | `bun run format --check` | 100% | TODO |
| Lint | `bun run lint` | 0 errors | TODO |
| Types | `bun run typecheck` | 0 errors | TODO |
| Unit | `bun run test` (lib/services/evm.test.ts, lib/services/apu.test.ts) | 80%+ | TODO |
| Build | `bun run build` | Exit 0 | TODO |
| E2E | `bun test:e2e` (10 scenarios) | All 10 tests pass | TODO |

---

## Manual Testing Checklist

- [ ] **CRITICAL:** Update time <15 min/week (test with Técnico, 20 APUs form)
- [ ] **CRITICAL:** EAC accuracy 85-95% (validate with 3 completed projects)
- [ ] **CRITICAL:** 20% reduction over-budget projects (vs baseline after 6 months)
- [ ] F010 integration working (BAC from project_budgets, AC from project_spend auto-sync)
- [ ] F005 integration working (CPI <0.9 alerts email sent correctly)
- [ ] APU setup restricted to Admin/Gerencia only
- [ ] EVM KPIs calculated correctly (EV, AC, PV, CPI, SPI, EAC, VAC)
- [ ] Weighted average calculation correct (multi-APU projects)
- [ ] Curva S chart renders correctly (Recharts, 3 líneas)
- [ ] CPI alerts <1 min (check all projects + send emails)
- [ ] SPI alerts working (schedule delay warning)
- [ ] Decrement validation warns user (pct_complete decreased)
- [ ] BAC update mid-project works (audit trail)
- [ ] Dashboard responsive (mobile + desktop, <2s load)
- [ ] Error handling graceful (no progress → EV = 0, CPI = N/A, no division by zero)
- [ ] UAT with Gerencia + Técnico (pilot project PAVICONSTRUJC, 4 weeks tracking)

---

**Token-efficient format:** 60 lines | 10 E2E scenarios | 80%+ coverage target | CRITICAL: <15 min/week update + 85-95% EAC accuracy + 20% reduction over-budget
