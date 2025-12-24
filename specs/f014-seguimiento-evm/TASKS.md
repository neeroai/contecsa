# TASKS: Seguimiento Avance Físico (EVM)

Version: 1.0 | Date: 2025-12-24 10:10 | Owner: Claude Code | Status: Active

---

## DOING

| ID | Task | DoD | Est |
|----|------|-----|-----|
| - | No active tasks yet | - | - |

---

## TODO (Priority Order - From PLAN.md)

| ID | Task | DoD | Est |
|----|------|-----|-----|
| T001 | Create project_apus table migration (Drizzle) | - SQL migration file with 9 fields (id, project_id, apu_code, apu_name, unit, quantity_budgeted, unit_price_cop, total_price_cop, category, created_at)<br>- Index on project_id<br>- Foreign key to projects<br>- Unique constraint on (project_id, apu_code)<br>- Computed column: total_price_cop = quantity_budgeted × unit_price_cop | 2h |
| T002 | Create project_physical_progress table migration (Drizzle) | - SQL migration file with 8 fields (id, project_id, apu_id, measurement_date, quantity_executed, pct_complete, measured_by, notes, created_at)<br>- Index on project_id + measurement_date (composite)<br>- Foreign keys to projects, apus, users<br>- Unique constraint on (project_id, apu_id, measurement_date) - prevents duplicate measurements<br>- Constraint: pct_complete BETWEEN 0 AND 100 | 2h |
| T003 | Create v_project_evm SQL view (auto-calculated KPIs) | - SQL view with EVM KPIs: EV = BAC × weighted_avg(pct_complete), AC = SUM(project_spend), PV = BAC × (days_elapsed / total_days), CPI = EV / AC, SPI = EV / PV, EAC = BAC / CPI, VAC = BAC - EAC<br>- Weighted average calculation correct (by total_price_cop)<br>- Handle division by zero (AC = 0, PV = 0)<br>- Query performance <2s (100 projects)<br>- Test: Validate formulas with sample data | 4h |
| T004 | Implement APU service CRUD (lib/services/apu.ts) | - createAPU(apu) → Validates input, creates record (authorization: only Admin/Gerencia)<br>- updateAPU(id, apu) → Updates quantity_budgeted, unit_price_cop, recalculates total_price_cop<br>- getAPUs(project_id) → Returns all APUs for project<br>- deleteAPU(id) → Soft delete (if has progress) or hard delete<br>- Type-safe with Drizzle ORM | 3h |
| T005 | Implement physical progress service (lib/services/evm.ts) | - updateProgress(project_id, apu_id, pct_complete, quantity_executed, measured_by, notes) function<br>- Validates: pct_complete 0-100, decrement warning (if <previous week)<br>- Creates progress record<br>- Triggers EVM KPI recalculation (automatic via view)<br>- Returns: updated progress + recalculated KPIs | 3h |
| T006 | Implement getEVMSummary service (lib/services/evm.ts) | - getEVMSummary(project_id) function<br>- Query v_project_evm view<br>- Returns: {project_id, project_name, bac, ev, ac, pv, cpi, spi, eac, vac, pct_physical_progress, cpi_status}<br>- cpi_status = OK (≥0.9), WARNING (0.8-0.9), CRITICAL (<0.8) | 2h |
| T007 | Implement CPI alert service (checkCPI) | - checkCPI() function (called by daily cron)<br>- Query all projects v_project_evm → Filter CPI <0.9<br>- Calculate: EAC, VAC, % sobrecosto<br>- Call F005.sendImmediateAlert(CPI_CRITICAL, {project, cpi, eac, vac})<br>- Recipients: Gerencia + CEO (if CPI <0.8, escalation)<br>- Log alert sent | 3h |
| T008 | Implement SPI alert service (checkSPI) | - checkSPI() function (called by daily cron)<br>- Query all projects v_project_evm → Filter SPI <0.8<br>- Calculate schedule_delay = (1 - SPI) × 100<br>- Call F005.sendImmediateAlert(SPI_WARNING, {project, spi, schedule_delay})<br>- Recipients: Gerencia<br>- Log alert sent | 2h |
| T009 | Create APU setup page (app/projects/[id]/apus/page.tsx) | - Table displays all APUs: apu_code, apu_name, quantity_budgeted, unit, unit_price_cop, total_price_cop<br>- Create APU button → Form (apu_code, apu_name, unit, quantity, unit_price, category)<br>- Edit APU button → Pre-filled form, update<br>- Delete APU → Confirm dialog (warn if has progress)<br>- Authorization: Only Admin/Gerencia can access<br>- Responsive (mobile + desktop)<br>- Load time <2s | 5h |
| T010 | Create progress update form (app/projects/[id]/progress/page.tsx) | - Form displays: List of APUs (20 max) with current % completitud<br>- Input: % completitud per APU (0-100, number input or slider)<br>- Optional: notes (textarea, max 500 chars)<br>- Decrement validation: If pct_complete <previous week → WARN "Decreased X%"<br>- Submit → updateProgress() for each APU<br>- Timer: Display elapsed time (target <15 min)<br>- Responsive (mobile + desktop) | 5h |
| T011 | Create EVM dashboard page (app/projects/[id]/evm/page.tsx) | - Curva S chart (Recharts): Line chart with 3 líneas (PV green dashed, EV blue solid, AC red solid)<br>- X-axis: Weeks elapsed, Y-axis: COP (millions)<br>- KPI cards (shadcn/ui): CPI (color-coded), SPI, EAC, VAC, % avance físico<br>- Tabla APUs: Top 5 with mayor desviación (pct_complete vs pct_spent)<br>- Color coding: CPI green (≥0.9), yellow (0.8-0.9), red (<0.8)<br>- Load time <2s<br>- Responsive (mobile + desktop) | 6h |
| T012 | Integrate F010 budgets + spend (BAC + AC) | - Hook: project_budgets.total_budget_cop → BAC in v_project_evm view<br>- Hook: project_spend.amount_cop → AC in v_project_evm view (auto-sync)<br>- Test: Budget update (F010) → EVM KPIs recalculated<br>- Test: Purchase closed (F003) → AC updated → CPI recalculated | 2h |
| T013 | Integrate F005 CPI/SPI alerts | - Hook: CPI <0.9 → sendImmediateAlert(CPI_CRITICAL) via F005<br>- Hook: SPI <0.8 → sendImmediateAlert(SPI_WARNING) via F005<br>- Test: Alert email sent <1 min<br>- Test: Email includes project, CPI, EAC, VAC, Curva S link | 2h |
| T014 | Implement daily cron jobs (CPI/SPI checks) | - app/api/evm/check-cpi/route.ts with GET endpoint<br>- app/api/evm/check-spi/route.ts with GET endpoint<br>- vercel.json cron config: 2 AM COT (7:00 UTC) daily<br>- Call checkCPI() + checkSPI()<br>- Log execution completed | 2h |
| T015 | Write unit tests for APU CRUD | - Test: createAPU() → Creates record<br>- Test: createAPU() by non-Admin → ERROR "Unauthorized"<br>- Test: updateAPU() → Updates quantity, unit_price, recalculates total_price<br>- Test: getAPUs(project_id) → Returns all APUs<br>- Test: deleteAPU() → Soft delete if has progress<br>- Coverage >80% | 3h |
| T016 | Write unit tests for EVM calculations (SQL view) | - Test: EV = BAC × weighted_avg(pct_complete) → Correct calculation<br>- Test: AC = SUM(project_spend) → Correct total<br>- Test: PV = BAC × (days_elapsed / total_days) → Linear calculation<br>- Test: CPI = EV / AC → Handles AC = 0 (returns NULL)<br>- Test: SPI = EV / PV → Handles PV = 0 (returns NULL)<br>- Test: EAC = BAC / CPI → Correct projection<br>- Test: VAC = BAC - EAC → Correct variance<br>- Coverage >80% | 4h |
| T017 | Write unit tests for progress update | - Test: updateProgress() → Creates progress record<br>- Test: updateProgress() with pct_complete >100 → ERROR "Invalid percentage"<br>- Test: updateProgress() with decrement → WARN "Decreased vs previous week"<br>- Test: getEVMSummary(project_id) → Returns KPIs from view<br>- Coverage >80% | 3h |
| T018 | Write unit tests for CPI/SPI alerts | - Test: checkCPI() with CPI <0.9 → Trigger alert<br>- Test: checkCPI() with CPI 0.92 → No alert<br>- Test: checkCPI() with CPI <0.8 → CRITICAL escalation to CEO<br>- Test: checkSPI() with SPI <0.8 → Trigger alert<br>- Coverage >80% | 2h |
| T019 | Write integration test for progress update pipeline | - Test: updateProgress() → Recalculate EVM KPIs (view refresh) → Check CPI → Trigger alert if <0.9<br>- Test: Multiple APUs → Weighted average calculation correct<br>- Test: Progress update triggers view refresh automatically<br>- Coverage >80% | 3h |
| T020 | Write integration test for CPI alert pipeline | - Test: CPI <0.9 → sendImmediateAlert(CPI_CRITICAL) → Email sent<br>- Test: Email sent <1 min<br>- Test: Email includes project, CPI, EAC, VAC<br>- Coverage >80% | 3h |
| T021 | Write integration test for F010 integration | - Test: project_budgets.total_budget_cop → BAC in EVM view<br>- Test: project_spend.amount_cop → AC in EVM view (auto-sync)<br>- Test: Budget update → EVM KPIs recalculated<br>- Coverage >80% | 2h |
| T022 | Write E2E test for US14.1 (Curva S dashboard) | - Seed DB: Project with BAC, 50% time, 40% progress, AC<br>- Navigate /projects/[id]/evm<br>- Assert: Curva S displays 3 líneas (PV, EV, AC)<br>- Assert: KPI cards display CPI, SPI, EAC, VAC<br>- Assert: Tabla APUs displays top 5<br>- Test passes | 3h |
| T023 | Write E2E test for US14.2 (CPI <0.9 alert) | - Seed DB: Project with CPI = 0.88<br>- Trigger daily CPI check<br>- Assert: Email sent to Gerencia + CEO<br>- Assert: Subject = "Alerta Crítica - Proyecto sobre presupuesto"<br>- Assert: Dashboard displays red badge (CRITICAL)<br>- Test passes | 3h |
| T024 | Write E2E test for US14.3 (update weekly progress) | - Navigate /projects/[id]/progress (as Técnico)<br>- Input % completitud for 15 APUs<br>- Optional notes<br>- Submit form<br>- Assert: Progress saved, EVM KPIs recalculated<br>- Assert: Form completion time <15 min (timer)<br>- Test passes | 3h |
| T025 | Write E2E test for US14.4 (projected final cost EAC) | - Navigate /projects/[id]/evm<br>- Assert: KPI card displays EAC, VAC<br>- Assert: Comparison vs BAC displayed<br>- Assert: Alert if EAC >BAC<br>- Test passes | 2h |
| T026 | Write E2E test for US14.5 (AI Agent query "CPI PAVICONSTRUJC") | - User queries AI Agent (F001): "¿CPI de PAVICONSTRUJC?"<br>- Assert: Agent responds with CPI, meaning, trend, EAC<br>- Assert: Response includes link to Curva S dashboard<br>- Test passes | 2h |
| T027 | Write E2E tests for edge cases | - Test: New project (no progress) → "Esperando primera medición"<br>- Test: CPI <0.8 → CEO escalation<br>- Test: Decrement validation → WARN "Decreased vs previous"<br>- Test: BAC update mid-project → Audit trail<br>- Test: 100% progress, AC <BAC → CPI >1 (success)<br>- All 5 tests pass | 4h |
| T028 | EAC accuracy validation (3 completed projects) | - Test: 3 projects that have completed<br>- At 50% progress: Record EAC prediction<br>- At 100% completion: Record actual final cost<br>- Calculate error %: |EAC - actual| / actual × 100<br>- Target: MAE <15% (85-95% accuracy)<br>- Document results in TESTPLAN.md | 6h |
| T029 | Performance test EVM dashboard | - Measure: Curva S dashboard load <2s (project with 20 APUs, 52 weeks progress)<br>- Measure: EVM KPIs calculation <500ms (recalculate on progress update)<br>- Measure: CPI alert <1 min (check all 9 projects + send emails)<br>- Optimize if slower | 3h |
| T030 | UAT with Gerencia + Técnico (pilot project PAVICONSTRUJC) | - Schedule UAT session with 2 users (Gerencia + Técnico)<br>- Test: Gerencia sets up 15 APUs for PAVICONSTRUJC<br>- Test: Técnico updates weekly progress (4 weeks, Fridays PM)<br>- Test: Gerencia views Curva S, monitors CPI<br>- Test: CPI alert triggered (if <0.9 during pilot)<br>- Collect feedback (NPS survey)<br>- Measure: Update time <15 min/week<br>- Sign-off from both users | 8h |
| T031 | 6-month KPI validation (20% reduction over-budget) | - After 6 months usage: Compare # projects over budget (CPI <1) vs baseline<br>- Baseline: Historical data (pre-F014)<br>- Target: 20% reduction (e.g., 5 projects → 4 projects)<br>- Document results, adjust CPI threshold if needed | 4h |
| T032 | Document EVM best practices | - Document: APU setup guidelines (10-20 categories amplias, not 100+ granular)<br>- Document: Weekly update workflow (Fridays PM, <15 min)<br>- Document: EVM interpretation (CPI >1 = good, <0.9 = alert, <0.8 = critical)<br>- Document: Waste factor reference (15% concreto, 5% acero, 10% otros)<br>- Document: BAC adjustment workflow (when to update budget mid-project)<br>- Update README.md | 2h |

**Total Estimated Time:** 85 hours (~3-4 weeks)

---

## BLOCKED

| ID | Task | Blocker | Notes |
|----|------|---------|-------|
| T012 | F010 integration (BAC + AC) | F010 not fully implemented yet | Can mock F010 tables for testing |
| T013 | F005 integration (CPI/SPI alerts) | F005 not fully implemented yet | Can mock F005.sendImmediateAlert() for testing |

---

## DONE

| ID | Task | Closed | Commit |
|----|------|--------|--------|
| - | Migration to SDD | 2025-12-24 | TBD |

---

**Dependencies:**
- T001-T002 independent (table migrations)
- T003 depends on T001-T002 + F010 (APUs + progress tables + F010 budgets/spend)
- T004 depends on T001 (APUs table)
- T005-T006 depend on T002-T003 (progress table + EVM view)
- T007-T008 depend on T003, F005 (EVM view + F005 alerts) - BLOCKED
- T009 depends on T004 (APU service)
- T010 depends on T005 (progress service)
- T011 depends on T006 (EVM summary service)
- T012 depends on T003, F010 (EVM view + F010 tables) - BLOCKED
- T013 depends on T007-T008, F005 (alert services + F005) - BLOCKED
- T014 depends on T007-T008 (CPI/SPI check functions)
- T015-T018 depend on T004-T008 (modules to test)
- T019-T021 depend on T005-T013 (full pipeline)
- T022-T027 depend on T009-T011 (UI + full feature)
- T028-T029 depend on T011 (EVM dashboard + accuracy validation)
- T030-T032 depend on T022-T029 (E2E tests pass + accuracy validated)

**CRITICAL PRIORITY:**
- T028 (EAC accuracy validation) is CRITICAL success metric - Must achieve 85-95% accuracy
- T030 (UAT <15 min/week update) validates sustainability target
- T031 (6-month KPI) validates 20% reduction over-budget projects

---

**Last updated:** 2025-12-24 10:10 | Maintained by: Claude Code
