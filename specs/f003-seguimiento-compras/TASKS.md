# TASKS: Seguimiento Compras (7 Etapas)

Version: 1.0 | Date: 2025-12-24 06:50 | Owner: Claude Code | Status: Active

---

## DOING

| ID | Task | DoD | Est |
|----|------|-----|-----|
| - | No active tasks yet | - | - |

---

## TODO (Priority Order - From PLAN.md)

| ID | Task | DoD | Est |
|----|------|-----|-----|
| T001 | Create compras table migration | - SQL migration file with 22 fields<br>- Indexes on estado, dias_abierto, proyecto_id<br>- Foreign keys to proyectos, proveedores, users | 2h |
| T002 | Create compra_estados_log table migration | - Audit log table with 7 fields<br>- Foreign key to compras<br>- Index on compra_id + timestamp | 1h |
| T003 | Define XState compraMachine configuration | - 7 states (REQUISICION → CERRADO)<br>- 14 valid transitions<br>- Guards for blocking gates<br>- Actions for audit + notifications | 4h |
| T004 | Create Drizzle ORM schema for compras | - Type-safe schema matching DB<br>- Queries: insert, update, findById, list<br>- Optimistic locking with version field | 3h |
| T005 | Create Drizzle ORM schema for audit log | - Type-safe schema<br>- Queries: log, findByCompraId, findByUserId | 2h |
| T006 | Implement state transition API route | - POST /api/compras/[id]/transition<br>- Validates transition via XState<br>- Enforces blocking gates<br>- Logs to audit table<br>- Returns 200/400/409 | 4h |
| T007 | Implement aprobación blocking gate | - Validates approval notes provided<br>- Returns {blocked: true, reason} if invalid | 1h |
| T008 | Implement confirmación blocking gate | - Validates supplier confirmation evidence uploaded<br>- Admin bypass option with justification | 2h |
| T009 | Implement certificados blocking gate | - Category-specific validation (Concreto, Acero, Eléctricos, Químicos)<br>- Checklist of required certificates<br>- Returns list of missing certificates | 3h |
| T010 | Implement invoice validation blocking gate | - Validates monto_final ≤ monto_estimado +5%<br>- Escalation to Gerencia if exceeded<br>- Returns deviation percentage | 2h |
| T011 | Create audit log service | - Function: log(compra_id, from, to, user, notas)<br>- Automatically called on all transitions<br>- Queryable by compra_id or user_id | 2h |
| T012 | Implement alert detection service | - detectComprasEnRiesgo() query (>30 días, >45 días)<br>- Returns list with {id, dias_abierto, proyecto, proveedor} | 2h |
| T013 | Implement alert email sending | - sendAlertaEmail(recipients, compras)<br>- Gmail API integration<br>- Email template in Spanish<br>- Includes dashboard link | 3h |
| T014 | Create daily cron job for alerts | - Runs 8 AM daily<br>- Detects >30 días (Jefe Compras + Gerencia)<br>- Detects >45 días (+ CEO, 2× daily) | 2h |
| T015 | Create purchase list page | - app/compras/page.tsx<br>- DataTable with sortable columns<br>- Filters: estado, proyecto, proveedor, días<br>- Color-coded status (green/yellow/red)<br>- Pagination 20 items | 4h |
| T016 | Create purchase detail page | - app/compras/[id]/page.tsx<br>- 7-stage progress bar visualization<br>- Timeline of all transitions<br>- Action buttons (context-aware) | 4h |
| T017 | Implement 7-stage progress bar component | - components/compras/ProgressBar.tsx<br>- Shows current stage highlighted<br>- Completed stages ✓<br>- Pending stages grayed out | 3h |
| T018 | Implement timeline component | - components/compras/Timeline.tsx<br>- Vertical timeline with all transitions<br>- Shows {estado, fecha, user, notas}<br>- Expandable details | 3h |
| T019 | Create requisición form | - components/compras/RequisicionForm.tsx<br>- Required fields: proyecto, proveedor, categoria, descripcion, monto<br>- Adjuntar cotizaciones (optional)<br>- Validation with Zod | 4h |
| T020 | Create aprobación action component | - components/compras/AprobarAction.tsx<br>- Approve/Reject buttons<br>- Required: notas field<br>- Triggers transition API | 2h |
| T021 | Create orden creation form | - components/compras/CrearOrdenForm.tsx<br>- Select proveedor from catalog<br>- Confirm monto<br>- Generate documento ODC/ODS (PDF) | 4h |
| T022 | Create confirmación registration form | - components/compras/ConfirmarOrdenForm.tsx<br>- Upload evidence (email/PDF)<br>- Date picker for fecha_confirmacion | 2h |
| T023 | Create recepción registration form | - components/compras/RegistrarRecepcionForm.tsx<br>- Enter num_entrada (warehouse entry number)<br>- Estado: Total/Parcial/Pendiente<br>- Date picker for fecha_recepcion | 3h |
| T024 | Implement certificate upload component | - components/compras/CertificateUpload.tsx<br>- Multi-file upload (PDF/images)<br>- Vercel Blob integration<br>- Validate <10MB per file<br>- Checklist of required certificates | 4h |
| T025 | Create pago approval form | - components/compras/AprobarPagoForm.tsx<br>- Enter monto_final<br>- Validate ≤ monto_estimado +5%<br>- Approve/Block buttons | 3h |
| T026 | Create dashboard widget for at-risk purchases | - components/dashboard/ComprasEnRiesgo.tsx<br>- Top 10 by dias_abierto<br>- Red badge if >0 compras >30 días<br>- Click → navigates to /compras filtered | 3h |
| T027 | Implement optimistic locking middleware | - Detect version field conflicts<br>- Return 409 with user-friendly message<br>- UI: show "Compra modificada, refresca y reintenta" | 2h |
| T028 | Create email notification templates | - lib/email-templates/compras/alerta.tsx (>30 días)<br>- lib/email-templates/compras/confirmacion.tsx (orden creada)<br>- lib/email-templates/compras/recordatorio.tsx (acción pendiente)<br>- All in Spanish | 3h |
| T029 | Write unit tests for state machine | - Test all 14 valid transitions<br>- Test invalid transitions rejected<br>- Test guards enforce blocking gates<br>- Coverage >80% | 4h |
| T030 | Write integration tests for API routes | - Test /api/compras/[id]/transition (valid/invalid/blocked)<br>- Test full workflow REQUISICION → CERRADO<br>- Test optimistic locking conflict<br>- Coverage >80% | 4h |
| T031 | Write E2E tests for user workflows | - Playwright tests for all 7 user stories (US3.1-US3.7)<br>- Test blocking gates (4 gates)<br>- Test alert detection + email<br>- Test concurrent edit | 6h |
| T032 | UAT with Liced Vega (super user) | - Schedule UAT session<br>- Full workflow walkthrough<br>- Validate against Excel 28-field process<br>- Collect feedback + sign-off | 4h |

**Total Estimated Time:** 86 hours (~3-4 weeks)

---

## BLOCKED

| ID | Task | Blocker | Notes |
|----|------|---------|-------|
| - | None yet | - | - |

---

## DONE

| ID | Task | Closed | Commit |
|----|------|--------|--------|
| - | Migration to SDD | 2025-12-24 | TBD |

---

**Dependencies:**
- T003-T006 depend on T001-T002 (DB schema must exist)
- T007-T010 depend on T003 (XState machine must exist)
- T011-T014 depend on T005 (audit log schema must exist)
- T015-T018 depend on T004 (ORM queries must exist)
- T019-T025 depend on T006 (transition API must exist)
- T024 depends on Vercel Blob setup
- T013-T014 depend on Gmail API credentials
- T029-T031 depend on T001-T028 (implementation complete)
- T032 depends on T031 (E2E tests pass first)
