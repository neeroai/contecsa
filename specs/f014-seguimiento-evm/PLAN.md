# SDD Implementation Plan: Seguimiento Avance Físico (EVM)

Version: 1.0 | Date: 2025-12-24 09:55 | Owner: Javier Polo | Status: Active

---

## Reference

**SPEC:** /specs/f014-seguimiento-evm/SPEC.md
**ADR:** /specs/f014-seguimiento-evm/ADR.md (EVM Simplified over Full PMBOK)
**PRD:** docs/features/r14-seguimiento-evm.md
**CRITICAL:** <15 min/week update time, 85-95% EAC accuracy, 20% reduction over-budget

---

## Stack Validated

**Database:** PostgreSQL 15
- Source: /Users/mercadeo/neero/docs-global/stack/database-guide.md:15-25
- Tables: project_apus (APUs), project_physical_progress (% completitud semanal)
- View: v_project_evm (auto-calculated KPIs: EV, AC, PV, CPI, SPI, EAC, VAC)

**Frontend:** Next.js 15 App Router
- Source: /Users/mercadeo/neero/docs-global/stack/nextjs-react-patterns.md:10-15
- Pages: /projects/[id]/evm (dashboard), /projects/[id]/progress (form actualización)

**Charts:** Recharts
- Source: /Users/mercadeo/neero/docs-global/stack/common-stack.md:60-65
- Integration: F002 (Dashboard) - Curva S (3 líneas: Planificado, Ejecutado, Gastado)
- Use case: S-Curve visual, EVM KPIs cards

**Integration:** F010 (Proyección Financiera)
- Source: specs/f010-proyeccion-financiera/SPEC.md
- Reutilizar: project_budgets.total_budget_cop (BAC), project_spend (AC)
- Use case: EVM calculation (AC = gasto real acumulado from F010)

**Notifications:** Gmail API (F005)
- Source: specs/f005-notificaciones/ADR.md
- Use case: CPI <0.9 alerts (email to Gerencia + CEO)

**Validation Checklist:**
- [x] Stack matches docs-global/stack/ (5 citations)
- [x] NO INVENTAR protocol applied
- [x] ClaudeCode&OnlyMe filter passed (see ADR.md)
- [x] Dependencies: F010 (budgets/spend), F005 (alerts), F002 (dashboard)
- [x] Limitations: MVP = EVM simplified (no CPM detailed schedule), PV lineal por tiempo

---

## Implementation Steps (11 steps)

### S001: Create project_apus table migration
**Deliverable:** SQL migration with project_apus table (9 fields: id, project_id, apu_code, apu_name, unit, quantity_budgeted, unit_price_cop, total_price_cop, category, created_at)
**Dependencies:** PostgreSQL connection, projects table
**Acceptance:** Table created, index on project_id, foreign key to projects, unique on (project_id, apu_code)

### S002: Create project_physical_progress table migration
**Deliverable:** SQL migration with project_physical_progress table (8 fields: id, project_id, apu_id, measurement_date, quantity_executed, pct_complete, measured_by, notes, created_at)
**Dependencies:** S001 (project_apus table)
**Acceptance:** Table created, index on project_id + measurement_date, foreign keys to projects + apus + users, unique on (project_id, apu_id, measurement_date)

### S003: Create v_project_evm view (auto-calculated KPIs)
**Deliverable:** SQL view with EVM KPIs calculation: EV = BAC × weighted_avg(pct_complete), AC = SUM(project_spend.amount_cop) from F010, PV = BAC × (days_elapsed / total_days), CPI = EV / AC, SPI = EV / PV, EAC = BAC / CPI, VAC = BAC - EAC
**Dependencies:** S001-S002 (APUs + progress tables), F010 (project_budgets, project_spend)
**Acceptance:** View created, KPIs calculated correctly, query <2s with 100 projects

### S004: Implement APU service (CRUD)
**Deliverable:** lib/services/apu.ts with createAPU(apu), updateAPU(id, apu), getAPUs(project_id), deleteAPU(id)
**Dependencies:** S001 (project_apus table)
**Acceptance:** CRUD operations work, authorization (only Admin/Gerencia can create/edit), validation (total_price_cop = quantity_budgeted × unit_price_cop)

### S005: Implement physical progress service (CRUD)
**Deliverable:** lib/services/evm.ts with updateProgress(project_id, apu_id, pct_complete, quantity_executed, measured_by, notes), getProgress(project_id), getEVMSummary(project_id)
**Dependencies:** S002-S003 (progress table + EVM view)
**Acceptance:** Update progress working, recalculates EVM KPIs automatically (via view), validates decrement (warn if pct_complete <previous week)

### S006: Implement CPI alert service (checkCPI)
**Deliverable:** lib/services/evm.ts.checkCPI() with daily job: query all projects → if CPI <0.9 → calculate EAC, VAC → send email (F005)
**Dependencies:** S003 (EVM view), F005 (Gmail API)
**Acceptance:** Daily cron job, email sent to Gerencia + CEO with project + CPI + EAC + VAC, if CPI <0.8 → CRITICAL escalation

### S007: Implement SPI alert service (checkSPI)
**Deliverable:** lib/services/evm.ts.checkSPI() with daily job: query all projects → if SPI <0.8 → calculate schedule_delay → send email (F005)
**Dependencies:** S003 (EVM view), F005 (Gmail API)
**Acceptance:** Daily cron job, email sent to Gerencia with schedule delay warning

### S008: Create APU setup page (Admin/Gerencia)
**Deliverable:** app/projects/[id]/apus/page.tsx with APU table (apu_code, apu_name, quantity_budgeted, unit_price_cop, total_price_cop), create/edit APU form
**Dependencies:** S004 (APU service)
**Acceptance:** Responsive table, create/edit form works, authorization (only Admin/Gerencia), validation (total_price correct)

### S009: Create progress update form (Técnico)
**Deliverable:** app/projects/[id]/progress/page.tsx with form: lista APUs (radio/checklist), input % completitud (0-100), optional notes, submit → update progress
**Dependencies:** S005 (progress service)
**Acceptance:** Form <15 min to complete (10-20 APUs), decrement validation warns user, saves successfully

### S010: Create EVM dashboard page (Gerencia)
**Deliverable:** app/projects/[id]/evm/page.tsx with Curva S chart (Recharts) - 3 líneas (Planificado PV, Ejecutado EV, Gastado AC), KPI cards (CPI, SPI, EAC, VAC, % avance físico), APUs tabla con mayor desviación (top 5)
**Dependencies:** S003 (EVM view), Recharts
**Acceptance:** Curva S displays correctly, KPIs color-coded (CPI green/yellow/red), <2s load time, responsive (mobile + desktop)

### S011: Integration with F010 + F005 (budgets + alerts)
**Deliverable:** Hook F010.project_budgets (BAC), F010.project_spend (AC) → EVM calculation automatic, Hook CPI <0.9 → sendImmediateAlert(CPI_CRITICAL) via F005
**Dependencies:** F010 implemented, F005 implemented, S003 (EVM view)
**Acceptance:** AC synced from F010 automatically, BAC from F010 budgets, CPI alerts trigger <1 min

---

## Milestones

**M1 - Data Layer:** [S001-S003] | Target: Week 1 (APUs + progress tables + EVM view)
**M2 - Business Logic:** [S004-S007] | Target: Week 2 (APU CRUD + progress CRUD + CPI/SPI alerts)
**M3 - UI + Integration:** [S008-S011] | Target: Week 3 (APU setup + progress form + dashboard + F010/F005 integration)

---

## Risk Mitigation

| Risk | Mitigation | Owner |
|------|-----------|-------|
| **Overhead semanal insostenible (>15 min)** | Form simplificado (10-20 APUs max, no 100+), sugerencia automática vía compras (Phase 2), evaluar month 1 → reducir a quincenal si necesario | Javier Polo |
| **Resistencia usuario (Técnico no quiere medir)** | Capacitación ("por qué importa EVM"), form simple <15 min, sugerencia automática reduce carga, gamificación (badge proyectos verde CPI >1) | Javier Polo |
| **Cálculo EVM incorrecto (bugs)** | Testing exhaustivo (unit tests KPIs), validar con datos reales (3 proyectos completados), peer review fórmulas | Claude Code |
| **Presupuestos cambian mid-project** | Permitir actualizar BAC con audit trail (version history), show "Presupuesto ajustado" badge, historical comparisons use original BAC | Claude Code |
| **Datos históricos inexistentes** | Empezar con proyectos nuevos (no retroalimentar), primeros 2-3 meses = baseline (no esperar accuracy 85%), ajustar waste factors con data real | Javier Polo |
| **CPI demasiado optimista (avance inflado)** | Validación cruzada: comparar % compras vs % avance (flag if avance >> compras), auditoría física mensual | Javier Polo |
| **EAC inaccurate (>15% error)** | Use 3-month CPI average (not single week), confidence interval (min-max EAC based on CPI ±0.1), monthly review | Claude Code |

---

## Notes

**Critical Constraints:**
- F010 (Proyección Financiera) must be implemented for BAC + AC integration
- F005 (Notificaciones) must be implemented for CPI/SPI alerts
- MVP = EVM simplified (no CPM detailed schedule, PV = linear by time)
- MVP = 10-20 APUs per project (categorías amplias, no granular 100+)
- Update frequency = weekly (Fridays PM) → Evaluate sustainability month 1
- Pilot project = PAVICONSTRUJC (consorcio más grande, 41.8% compras)

**Assumptions:**
- Proyectos have defined BAC (budget total from F010)
- Proyectos have defined start/end dates (for PV calculation)
- Técnico performs weekly measurements (Fridays PM, ~15 min)
- Waste factors = industry average (15% concreto, 5% acero, 10% otros) until real data available
- BAC adjustments rare (MVP = single version, Phase 2 = versioning)

**Blockers:**
- F010 project_budgets + project_spend tables implemented (S003 - internal dependency)
- F005 Gmail API service implemented (S006-S007 - internal dependency)
- APUs definition for pilot project (PAVICONSTRUJC) - user data entry required before testing

---

**Last updated:** 2025-12-24 09:55 | Maintained by: Javier Polo + Claude Code
