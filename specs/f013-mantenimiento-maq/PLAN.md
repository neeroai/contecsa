# SDD Implementation Plan: Mantenimiento Preventivo de Maquinaria

Version: 1.0 | Date: 2025-12-24 12:05 | Owner: Javier Polo | Status: Active

---

## Reference

**SPEC:** /specs/f013-mantenimiento-maq/SPEC.md
**ADR:** /specs/f013-mantenimiento-maq/ADR.md (Hybrid scheduling decision)
**PRD:** docs/features/r13-mantenimiento-maq.md
**CRITICAL:** 60% reduction fallas + 40% reduction costos + 100% HSE compliance + 100% alertas 7 días antes

---

## Stack Validated

**PostgreSQL:** equipment, maintenance_schedules, maintenance_records tables
- Source: /Users/mercadeo/neero/docs-global/stack/database-guide.md:20-40 (PostgreSQL patterns)
- Use case: Equipment registration, scheduling (hybrid: hours + days), service records, cost tracking

**Google Cloud Storage / AWS S3:** Photo/PDF evidence storage
- Source: /Users/mercadeo/neero/docs-global/stack/common-stack.md:70-75 (object storage)
- Use case: Store maintenance evidence (photos, invoices), same storage as F008 (certificates)
- Retention: 7 years (HSE audit compliance)

**Vercel Cron:** Daily maintenance check
- Source: /Users/mercadeo/neero/docs-global/stack/common-stack.md:80-85 (cron jobs)
- Use case: Daily cron (9 AM COT) → Check upcoming maintenances (7-day window) → Send alerts

**PDF Generation:** jsPDF or Puppeteer
- Source: /Users/mercadeo/neero/docs-global/stack/common-stack.md:90-95 (document generation)
- Use case: Generate audit evidence PDF (equipment details + maintenance records + photos + invoices)

**Notifications (F005):** Email alerts
- Source: /specs/f005-notificaciones/ (internal dependency)
- Use case: Email responsible_user 7 days before maintenance

**Storage Adapter (F008):** Photo/PDF upload
- Source: /specs/f008-certificados/PLAN.md (storage adapter pattern)
- Use case: Reuse IStorageProvider interface (GCS/S3/Vercel Blob)

**Validation Checklist:**
- [x] Stack matches docs-global/stack/ (4 citations)
- [x] NO INVENTAR protocol applied
- [x] ClaudeCode&OnlyMe filter passed (see ADR.md)
- [x] Dependencies: F005 (Notifications), F008 (Storage adapter)
- [x] Limitations: MVP = time-based + manual hour entry (no IoT hour-meter sync), no predictive maintenance (ML, Phase 2)

---

## Implementation Steps (10 steps)

### S001: Create equipment table migration (Drizzle)
**Deliverable:** SQL migration file with equipment schema (id, equipment_type, brand, model, serial_number UNIQUE, purchase_date, warranty_expiry_date, status DEFAULT 'OPERATIONAL', assigned_project, responsible_user, created_at, updated_at)
**Dependencies:** None
**Acceptance:** Table created, foreign keys to projects + users, unique constraint on serial_number, index on status + assigned_project

### S002: Create maintenance_schedules table migration (Drizzle)
**Deliverable:** SQL migration file with schedules schema (id, equipment_id, maintenance_type, frequency_hours, frequency_days, last_maintenance_date, last_maintenance_hours, next_maintenance_date, next_maintenance_hours, is_active DEFAULT TRUE)
**Dependencies:** S001 (equipment table)
**Acceptance:** Table created, foreign key to equipment, check constraint (frequency_hours IS NOT NULL OR frequency_days IS NOT NULL)

### S003: Create maintenance_records table migration (Drizzle)
**Deliverable:** SQL migration file with records schema (id, equipment_id, maintenance_type, performed_date, performed_by, hours_at_service, tasks_performed TEXT[], parts_replaced TEXT[], cost_cop DECIMAL, invoice_pdf_url, photos_urls TEXT[], notes, next_maintenance_scheduled, created_at)
**Dependencies:** S001 (equipment table)
**Acceptance:** Table created, foreign keys to equipment + users, index on equipment_id + performed_date (for audit queries)

### S004: Implement equipment registration endpoint (/api/equipment POST)
**Deliverable:** Endpoint → Validate input (responsible_user required, serial_number unique) → Insert equipment row → Return equipment_id
**Dependencies:** S001 (equipment table)
**Acceptance:** Endpoint works, unique serial_number enforced, responsible_user required, status defaults to OPERATIONAL

### S005: Implement maintenance scheduling endpoint (/api/equipment/[id]/schedule POST)
**Deliverable:** Endpoint → Validate input (at least one frequency required) → Calculate next_maintenance_date (CURRENT_DATE + frequency_days) → Calculate next_maintenance_hours (if frequency_hours specified) → Insert schedule row
**Dependencies:** S002 (schedules table)
**Acceptance:** Hybrid scheduling works (hours OR days OR both), next_maintenance_date calculated correctly

### S006: Implement daily maintenance check service (lib/maintenance/check-upcoming.ts)
**Deliverable:** checkUpcomingMaintenances() function → Query: next_maintenance_date BETWEEN CURRENT_DATE AND CURRENT_DATE + 7 days, status = OPERATIONAL, is_active = TRUE → For each: send email (F005) → Return { alerts_sent_count, overdue_count }
**Dependencies:** S002 (schedules table), F005 (Notifications)
**Acceptance:** Query works, email alerts sent (7-day window), overdue maintenances flagged (CRITICAL alert)

### S007: Implement maintenance check cron endpoint (/api/cron/check-maintenances GET)
**Deliverable:** Endpoint → Call checkUpcomingMaintenances() → Return { alerts_sent_count, overdue_count, last_check_at }
**Dependencies:** S006 (check service)
**Acceptance:** Endpoint works, returns summary, logs all alerts sent

### S008: Configure Vercel cron (vercel.json)
**Deliverable:** Cron config: { path: '/api/cron/check-maintenances', schedule: '0 14 * * *' } → Daily at 9 AM COT (14:00 UTC)
**Dependencies:** S007 (cron endpoint)
**Acceptance:** Cron triggers daily (verify in Vercel logs), alerts sent <1 min after trigger

### S009: Implement maintenance record creation endpoint (/api/maintenance-records POST)
**Deliverable:** Endpoint → Upload photos/PDFs to storage (F008 adapter) → Insert record row → Recalculate next_maintenance_date (last + frequency_days) → Update maintenance_schedules → Return record_id
**Dependencies:** S003 (records table), F008 (Storage adapter)
**Acceptance:** Record created, photos/PDFs uploaded, next_maintenance_date recalculated, schedule updated

### S010: Implement audit evidence export endpoint (/api/equipment/audit-export GET)
**Deliverable:** Endpoint → Query maintenance_records (filter by equipment, date range) → Generate PDF (equipment details + records table + embedded photos + invoice links) → Upload to storage → Return signed URL (1h expiry)
**Dependencies:** S001, S003, F008 (Storage)
**Acceptance:** PDF generated (all required fields for HSE), includes photos/invoices, signed URL works (1h expiry)

---

## Milestones

**M1 - Setup + Registration:** [S001-S005] | Target: Week 1 (Tables, equipment registration, scheduling)
**M2 - Alerts + Cron:** [S006-S008] | Target: Week 2 (Daily check, email alerts, Vercel cron)
**M3 - Records + Export:** [S009-S010] | Target: Week 3 (Maintenance records, audit export PDF)

---

## Risk Mitigation

| Risk | Mitigation | Owner |
|------|-----------|-------|
| **Hour-meter not tracked (IoT sync unavailable)** | Fallback to time-based scheduling (frequency_days) only, manual hour entry (optional), Phase 2 = IoT integration | Javier Polo |
| **Alerts missed (cron failure)** | Monitor Vercel cron (alert if 2 consecutive failures), backup manual check (dashboard "Overdue" badge), retry 3x if email fails | Claude Code |
| **Photo upload fails (network error)** | Retry 3x, allow record creation without photos (log warning), don't block maintenance record | Claude Code |
| **Maintenance overdue (not performed)** | Daily CRITICAL alerts (red badge, high priority email), escalate to Gerencia if >14 days overdue | Claude Code |
| **Warranty expired (service out of warranty)** | Flag "Out of warranty" in record, display warning (info only, don't block), track warranty_expiry_date | Claude Code |
| **Equipment without responsible_user (unassigned)** | Block equipment registration (required field), validation error "Responsible user required" | Claude Code |
| **Audit export slow (>100 records with photos)** | Paginate PDF (max 50 records per page), optimize photo embed (thumbnails, not full resolution), <10s generation time | Claude Code |

---

## Notes

**Critical Constraints:**
- F005 (Notifications) integration required (email alerts)
- F008 (Storage adapter) integration required (photo/PDF upload)
- Hybrid scheduling MVP (time-based + manual hour entry, NO IoT hour-meter sync until Phase 2)
- Daily cron MUST be 100% reliable (no missed alerts = critical requirement)

**Assumptions:**
- Hour-meter updated manually (technician enters hours_at_service when recording maintenance)
- Photos optional (nice-to-have for audits, not mandatory)
- Invoice PDFs optional (cost can be recorded without invoice)
- Equipment assigned to project optional (can be unassigned = pool equipment)

**Blockers:**
- F005 (Notifications) must be implemented (S006 - internal dependency)
- F008 (Storage adapter) must be implemented (S009, S010 - internal dependency)

---

**Last updated:** 2025-12-24 12:05 | Maintained by: Javier Polo + Claude Code
