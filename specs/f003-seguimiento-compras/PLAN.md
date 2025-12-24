# SDD Implementation Plan: Seguimiento Compras (7 Etapas)

Version: 1.0 | Date: 2025-12-24 06:35 | Owner: Javier Polo | Status: Active

---

## Reference

**SPEC:** /specs/f003-seguimiento-compras/SPEC.md
**ADR:** /specs/f003-seguimiento-compras/ADR.md (State machine implementation)
**PRD:** docs/features/r03-seguimiento-compras.md

---

## Stack Validated

**Framework:** Next.js 15 App Router (Server Actions for state transitions)
- Source: /Users/mercadeo/neero/docs-global/stack/nextjs-react-patterns.md:10-25

**State Management:** XState (TypeScript state machine library)
- Source: /Users/mercadeo/neero/docs-global/stack/common-stack.md:55-60
- Decision: See ADR.md (XState over custom state machine)

**Database:** PostgreSQL 15 (compras table + audit log)
- Source: /Users/mercadeo/neero/docs-global/stack/database-guide.md:15-25

**ORM:** Drizzle ORM (type-safe queries)
- Source: /Users/mercadeo/neero/docs-global/stack/database-guide.md:35-40

**Email:** Gmail API (notifications)
- Source: /Users/mercadeo/neero/docs-global/stack/common-stack.md:65-70

**UI Components:** shadcn/ui (form, table, progress bar)
- Source: /Users/mercadeo/neero/docs-global/stack/common-stack.md:35-40

**File Upload:** Vercel Blob (certificate storage)
- Source: /Users/mercadeo/neero/docs-global/stack/common-stack.md:75-80

**Validation Checklist:**
- [x] Stack matches docs-global/stack/ (7 citations)
- [x] NO INVENTAR protocol applied
- [x] ClaudeCode&OnlyMe filter passed (see ADR.md)
- [x] Dependencies: PostgreSQL, Gmail API, Vercel Blob
- [x] Limitations: Sequential approvals only (no parallel)

---

## Implementation Steps (14 steps)

### S001: Create database schema for compras + audit log
**Deliverable:** SQL migration with compras table (22 fields) + compra_estados_log table
**Dependencies:** PostgreSQL connection
**Acceptance:** Tables created, indexes on estado + dias_abierto, foreign keys enforced

### S002: Define XState state machine configuration
**Deliverable:** lib/state-machines/compraMachine.ts with 7 states + transitions
**Dependencies:** XState library installed
**Acceptance:** State machine validates transitions correctly, blocking gates enforced

### S003: Create Drizzle ORM schema + queries
**Deliverable:** lib/db/schema/compras.ts + queries (insert, update, transition, list)
**Dependencies:** S001 (database schema)
**Acceptance:** Type-safe queries, optimistic locking with version field

### S004: Implement state transition API route
**Deliverable:** /api/compras/[id]/transition route with Server Action
**Dependencies:** S002 (state machine), S003 (ORM)
**Acceptance:** Validates transitions, enforces gates, logs to audit table, returns 200/400/409

### S005: Implement blocking gates validation
**Deliverable:** lib/validations/compraGates.ts (4 gates: aprobación, confirmación, certificados, invoice)
**Dependencies:** S002 (state machine)
**Acceptance:** Each gate returns {blocked: boolean, reason: string}, category-specific certificate validation

### S006: Create audit log service
**Deliverable:** lib/services/auditLog.ts with log(compra_id, from, to, user, notas)
**Dependencies:** S003 (ORM)
**Acceptance:** All transitions logged, queryable by compra_id or user_id

### S007: Implement alert detection service
**Deliverable:** lib/services/alertas.ts with detectComprasEnRiesgo() + sendAlertaEmail()
**Dependencies:** Gmail API setup
**Acceptance:** Detects >30 días, >45 días, email sent via Gmail API, runs on cron (daily 8 AM)

### S008: Create purchase list page with filters
**Deliverable:** app/compras/page.tsx with DataTable, filters (estado, proyecto, proveedor, días)
**Dependencies:** S003 (ORM queries)
**Acceptance:** List loads <1s for 100 purchases, sortable by días_abierto, color-coded status

### S009: Create purchase detail page with progress bar
**Deliverable:** app/compras/[id]/page.tsx with 7-stage progress bar + timeline + actions
**Dependencies:** S004 (transition API)
**Acceptance:** Progress bar shows current stage, timeline displays all transitions, actions trigger state changes

### S010: Implement certificate upload component
**Deliverable:** components/compras/CertificateUpload.tsx with Vercel Blob integration
**Dependencies:** Vercel Blob setup
**Acceptance:** Upload PDF/images, validate file size <10MB, store URL in database

### S011: Create email notification templates
**Deliverable:** lib/email-templates/compras/ (alertas, confirmaciones, recordatorios)
**Dependencies:** Gmail API
**Acceptance:** Templates in Spanish, formatted, include compra details + action links

### S012: Implement dashboard widget for at-risk purchases
**Deliverable:** components/dashboard/ComprasEnRiesgo.tsx (top 10 by días_abierto)
**Dependencies:** S007 (alert detection)
**Acceptance:** Widget shows red badge if >0 compras >30 días, click → drills to list

### S013: Add optimistic locking + conflict resolution
**Deliverable:** Middleware for concurrent state change detection
**Dependencies:** S003 (ORM with version field)
**Acceptance:** Returns 409 on conflict, UI shows "Compra modificada, refresca y reintenta"

### S014: Integration testing + UAT with Liced Vega
**Deliverable:** E2E tests for full workflow + UAT session with super user
**Dependencies:** S001-S013 (full feature)
**Acceptance:** All 7 stages tested, blocking gates verified, alerts delivered, UAT sign-off

---

## Milestones

**M1 - Data Layer + State Machine:** [S001-S004] | Target: Week 1 (DB + XState + API)
**M2 - Validation + Alerts:** [S005-S007] | Target: Week 2 (Gates + Audit + Emails)
**M3 - UI + Integration:** [S008-S012] | Target: Week 3 (Pages + Widgets + Uploads)
**M4 - Testing + UAT:** [S013-S014] | Target: Week 4 (Conflicts + E2E + UAT)

---

## Risk Mitigation

| Risk | Mitigation | Owner |
|------|-----------|-------|
| State machine bugs (invalid transitions) | Extensive unit tests on XState config, all 21 valid transitions tested | Claude Code |
| Concurrent state changes | Optimistic locking with version field, retry logic on UI | Claude Code |
| Alert emails not delivered | Retry logic (3 attempts), fallback to in-app notifications, log failures | Javier Polo |
| Certificate upload fails | Validate before upload, show progress bar, retry on network error | Claude Code |
| Performance degradation (>100 purchases) | Paginate at 20 items, index dias_abierto, cache list queries 1min | Claude Code |
| Blocking gate false positives | Admin bypass option with required justification, logged to audit | Javier Polo |
| User confusion on workflow | Progress bar + timeline visualization, next action suggestion, help tooltips | Claude Code |

---

## Notes

**Critical Constraints:**
- F005 (Notificaciones) must be implemented for email alerts
- F008 (Certificados) integration required for certificate validation
- Gmail API credentials required before S007

**Assumptions:**
- Sequential approvals only (Gerente → Compras → Almacén → Contabilidad)
- Supplier confirmation manual (email/PDF upload by Compras)
- Certificate requirements fixed per category (no dynamic rules)
- Average 50 active purchases at any time

**Blockers:**
- Gmail API access (OAuth 2.0 setup required)
- Vercel Blob storage setup for certificate uploads
- Database schema must match Excel 28 fields (mapping required)

---

**Last updated:** 2025-12-24 06:35 | Maintained by: Javier Polo + Claude Code
