# TASKS: Mantenimiento Preventivo de Maquinaria

Version: 1.0 | Date: 2025-12-24 12:20 | Owner: Claude Code | Status: Active

---

## DOING

| ID | Task | DoD | Est |
|----|------|-----|-----|
| - | No active tasks yet | - | - |

---

## TODO (Priority Order - From PLAN.md)

| ID | Task | DoD | Est |
|----|------|-----|-----|
| T001 | Create equipment table migration (Drizzle) | - SQL migration file with 10 fields (id, equipment_type, brand, model, serial_number UNIQUE, purchase_date, warranty_expiry_date, status DEFAULT 'OPERATIONAL', assigned_project, responsible_user, created_at, updated_at)<br>- Foreign keys to projects + users<br>- Unique constraint on serial_number<br>- Index on status + assigned_project (for dashboard queries)<br>- Enum: status IN (OPERATIONAL, MAINTENANCE, OUT_OF_SERVICE) | 2h |
| T002 | Create maintenance_schedules table migration (Drizzle) | - SQL migration file with 10 fields (id, equipment_id, maintenance_type, frequency_hours, frequency_days, last_maintenance_date, last_maintenance_hours, next_maintenance_date, next_maintenance_hours, is_active DEFAULT TRUE)<br>- Foreign key to equipment<br>- Check constraint: frequency_hours IS NOT NULL OR frequency_days IS NOT NULL (at least one required)<br>- Index on equipment_id + next_maintenance_date (for alert queries)<br>- Enum: maintenance_type IN (PREVENTIVE, CORRECTIVE, INSPECTION) | 2h |
| T003 | Create maintenance_records table migration (Drizzle) | - SQL migration file with 12 fields (id, equipment_id, maintenance_type, performed_date, performed_by, hours_at_service, tasks_performed TEXT[], parts_replaced TEXT[], cost_cop DECIMAL, invoice_pdf_url, photos_urls TEXT[], notes, next_maintenance_scheduled, created_at)<br>- Foreign keys to equipment + users<br>- Index on equipment_id + performed_date (for audit queries)<br>- Array fields: tasks_performed, parts_replaced, photos_urls | 2h |
| T004 | Implement equipment registration endpoint (/api/equipment POST) | - Input validation: responsible_user required, serial_number required, equipment_type required<br>- Insert equipment row (status = OPERATIONAL default)<br>- Return: { equipment_id, status, created_at }<br>- Error handling: Duplicate serial_number → ERROR "Serial already exists"<br>- Error handling: No responsible_user → ERROR "Responsible user required"<br>- Test: POST /api/equipment → Equipment created, serial_number unique enforced | 3h |
| T005 | Implement maintenance scheduling endpoint (/api/equipment/[id]/schedule POST) | - Input validation: At least one frequency (hours OR days) required<br>- Calculate next_maintenance_date: last_maintenance_date + frequency_days (if frequency_days specified)<br>- Calculate next_maintenance_hours: last_maintenance_hours + frequency_hours (if frequency_hours specified)<br>- Insert schedule row (is_active = TRUE default)<br>- Return: { schedule_id, next_maintenance_date, next_maintenance_hours }<br>- Error handling: No frequency → ERROR "At least one frequency required"<br>- Test: POST /api/equipment/[id]/schedule → Schedule created, next_maintenance_date calculated | 4h |
| T006 | Implement daily maintenance check service (lib/maintenance/check-upcoming.ts) | - Function: checkUpcomingMaintenances() → Returns { alerts_sent_count, overdue_count }<br>- Query: next_maintenance_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'<br>- Filter: status = OPERATIONAL, is_active = TRUE<br>- For each upcoming maintenance: Send email alert (F005 integration)<br>- Overdue maintenances (next_maintenance_date < CURRENT_DATE): Send CRITICAL alert<br>- Consolidate alerts: If both time + hours due → Single email (prevent spam)<br>- Test: checkUpcomingMaintenances() → Alerts sent (7-day window), overdue flagged | 5h |
| T007 | Implement maintenance check cron endpoint (/api/cron/check-maintenances GET) | - Endpoint: Call checkUpcomingMaintenances()<br>- Return: { alerts_sent_count, overdue_count, last_check_at }<br>- Error handling: Catch all errors, log, continue processing (don't stop on single failure)<br>- Logging: Log all alerts sent (equipment_id, maintenance_type, responsible_email)<br>- Test: GET /api/cron/check-maintenances → Summary returned, alerts sent | 3h |
| T008 | Configure Vercel cron (vercel.json) | - Cron config: { path: '/api/cron/check-maintenances', schedule: '0 14 * * *' } → Daily at 9 AM COT (14:00 UTC)<br>- Deploy to Vercel<br>- Test: Cron triggers daily (verify in Vercel logs), alerts sent <1 min after trigger | 1h |
| T009 | Implement maintenance record creation endpoint (/api/maintenance-records POST) | - Input validation: performed_date required, tasks_performed required (non-empty array)<br>- Upload photos to storage (F008 adapter): photos_urls → Array of GCS/S3 URLs<br>- Upload invoice PDF to storage (F008 adapter): invoice_pdf_url → GCS/S3 URL<br>- Insert record row<br>- Recalculate next_maintenance_date: performed_date + frequency_days (if frequency_days specified)<br>- Recalculate next_maintenance_hours: hours_at_service + frequency_hours (if frequency_hours specified)<br>- Update maintenance_schedules: last_maintenance_date, last_maintenance_hours, next_maintenance_date, next_maintenance_hours<br>- Return: { record_id, next_maintenance_scheduled }<br>- Error handling: Photo upload fails → Allow record creation without photos + log error<br>- Test: POST /api/maintenance-records → Record created, photos/PDFs uploaded, schedule updated | 6h |
| T010 | Implement audit evidence export endpoint (/api/equipment/audit-export GET) | - Input: equipment_id (optional), from_date (optional), to_date (optional)<br>- Query maintenance_records: Filter by equipment + date range<br>- Generate PDF: Equipment details + records table (date, tasks, parts, cost, photos, invoices) + total cost summary<br>- Upload PDF to storage (F008 adapter)<br>- Generate signed URL (1h expiry)<br>- Return: { pdf_url, equipment_count, record_count }<br>- Error handling: No records → Return empty PDF with message "No records found"<br>- Performance: PDF generation <10s (50 records with photos)<br>- Test: GET /api/equipment/audit-export → PDF generated, signed URL works (1h expiry) | 6h |
| T011 | Create equipment registration page (/equipment/new) | - Page: /equipment/new (Jefe Maquinaria, Admin roles only)<br>- Form fields: equipment_type (select), brand (input), model (input), serial_number (input), purchase_date (date picker), warranty_expiry_date (date picker), assigned_project (select dropdown), responsible_user (select dropdown, required)<br>- Submit → POST /api/equipment<br>- Success → Navigate to /equipment/[id] (detail page)<br>- Error messages: Duplicate serial_number, No responsible_user<br>- Responsive (mobile + desktop)<br>- Test: Fill form → Submit → Equipment created, navigate to detail page | 5h |
| T012 | Create maintenance scheduling page (/equipment/[id]/schedule) | - Page: /equipment/[id]/schedule (Jefe Maquinaria, Admin roles only)<br>- Form fields: maintenance_type (select: PREVENTIVE, CORRECTIVE, INSPECTION), frequency_hours (number input, optional), frequency_days (number input, optional), is_active (checkbox)<br>- Validation: At least one frequency required (client-side + server-side)<br>- Submit → POST /api/equipment/[id]/schedule<br>- Success → Navigate to /equipment/[id] (shows updated schedule)<br>- Error messages: No frequency<br>- Test: Fill form (hybrid: hours + days) → Submit → Schedule created, both next_maintenance_date + next_maintenance_hours calculated | 4h |
| T013 | Create maintenance record page (/equipment/[id]/record-maintenance) | - Page: /equipment/[id]/record-maintenance (Técnico, Jefe Maquinaria roles)<br>- Form fields: performed_date (date picker), hours_at_service (number input, optional), tasks_performed (textarea, multi-line), parts_replaced (textarea, optional), cost_cop (number input, optional), notes (textarea, optional)<br>- File upload: Photos (multiple JPG/PNG, drag-and-drop), Invoice PDF (single PDF)<br>- Submit → POST /api/maintenance-records<br>- Success → Navigate to /equipment/[id] (shows updated next_maintenance_date)<br>- Error messages: Photo upload failed (warning, not blocking)<br>- Test: Fill form + upload 2 photos + invoice PDF → Submit → Record created, photos/PDF uploaded, schedule updated | 6h |
| T014 | Create equipment dashboard (/equipment/dashboard) | - Page: /equipment/dashboard (Gerencia, Admin roles)<br>- Widget 1: Equipment by status (pie chart: OPERATIONAL, MAINTENANCE, OUT_OF_SERVICE)<br>- Widget 2: Costs per month (bar chart: last 12 months, grouped by project)<br>- Widget 3: Upcoming maintenances (calendar: next 30 days, color-coded by urgency)<br>- Filter: By project (select dropdown)<br>- Responsive (mobile + desktop)<br>- Test: Navigate to dashboard → All 3 widgets displayed, data correct (matches DB) | 6h |
| T015 | Create audit export page (/equipment/audit-export) | - Page: /equipment/audit-export (HSE, Gerencia, Admin roles)<br>- Form fields: equipment_id (select dropdown, optional), from_date (date picker, optional), to_date (date picker, optional)<br>- Submit → GET /api/equipment/audit-export<br>- Success → Download PDF (signed URL opens in new tab)<br>- Loading indicator (PDF generation may take 5-10s)<br>- Test: Fill form (equipment + date range) → Submit → PDF downloaded, includes all records + photos + invoices | 4h |
| T016 | Write unit tests for equipment registration | - Test: registerEquipment() → Validates responsible_user required<br>- Test: registerEquipment() → Enforces serial_number unique<br>- Test: registerEquipment() → Sets status = OPERATIONAL (default)<br>- Test: registerEquipment() with duplicate serial_number → ERROR<br>- Coverage >80% | 2h |
| T017 | Write unit tests for maintenance scheduling | - Test: createSchedule() → Validates at least one frequency (hours OR days)<br>- Test: createSchedule() → Calculates next_maintenance_date correctly<br>- Test: createSchedule() → Calculates next_maintenance_hours correctly<br>- Test: createSchedule() with no frequency → ERROR<br>- Test: createSchedule() with both frequencies → Calculates both<br>- Coverage >80% | 3h |
| T018 | Write unit tests for alert service | - Test: checkUpcomingMaintenances() → Queries 7-day window<br>- Test: checkUpcomingMaintenances() → Filters status = OPERATIONAL only<br>- Test: checkUpcomingMaintenances() → Sends email alert (mocked F005)<br>- Test: checkUpcomingMaintenances() with overdue → Sends CRITICAL alert<br>- Test: checkUpcomingMaintenances() with hybrid schedule → Consolidates alerts<br>- Coverage >80% | 3h |
| T019 | Write unit tests for maintenance record | - Test: recordMaintenance() → Uploads photos/PDFs (mocked F008)<br>- Test: recordMaintenance() → Recalculates next_maintenance_date<br>- Test: recordMaintenance() → Recalculates next_maintenance_hours<br>- Test: recordMaintenance() → Updates maintenance_schedules<br>- Test: recordMaintenance() with photo upload failure → Allows record creation + logs error<br>- Coverage >80% | 3h |
| T020 | Write unit tests for audit export | - Test: exportAuditEvidence() → Queries maintenance_records (filtered)<br>- Test: exportAuditEvidence() → Generates PDF (equipment + records + photos + invoices)<br>- Test: exportAuditEvidence() → Uploads PDF to storage (mocked F008)<br>- Test: exportAuditEvidence() → Returns signed URL (1h expiry)<br>- Test: exportAuditEvidence() with no records → Returns empty PDF<br>- Coverage >80% | 3h |
| T021 | Write integration test for equipment registration pipeline | - Test: Full flow: Validate input → Insert equipment → Return equipment_id<br>- Test: Error handling: Duplicate serial_number → ERROR<br>- Test: Error handling: No responsible_user → ERROR<br>- Coverage >80% | 2h |
| T022 | Write integration test for scheduling pipeline | - Test: Full flow: Validate frequency → Calculate next_maintenance_date → Insert schedule<br>- Test: Hybrid scheduling: Both frequency_hours + frequency_days → Calculates both<br>- Test: Error handling: No frequency → ERROR<br>- Coverage >80% | 2h |
| T023 | Write integration test for alert pipeline | - Test: Full flow: Daily cron → Query upcoming → Send alerts → Return summary<br>- Test: 7-day window: Alerts sent only for next_maintenance_date BETWEEN today AND today + 7<br>- Test: Overdue maintenances: CRITICAL alerts sent<br>- Test: Email sent <1 min after cron trigger<br>- Coverage >80% | 3h |
| T024 | Write integration test for maintenance record pipeline | - Test: Full flow: Upload photos → Insert record → Recalculate next_maintenance_date → Update schedule<br>- Test: Hybrid scheduling: Recalculates both next_maintenance_date + next_maintenance_hours<br>- Test: Photo upload failure: Record created without photos + error logged<br>- Coverage >80% | 3h |
| T025 | Write integration test for audit export pipeline | - Test: Full flow: Query records → Generate PDF → Upload to storage → Return signed URL<br>- Test: PDF generation <10s (50 records with photos)<br>- Test: Signed URL expiry: URL works <1h, 403 Forbidden after 1h<br>- Coverage >80% | 3h |
| T026 | Write E2E test for US13.1 (equipment registration) | - Navigate /equipment/new<br>- Fill form: equipment_type, brand, model, serial_number, responsible_user<br>- Submit → Assert: Equipment registered<br>- Test passes | 2h |
| T027 | Write E2E test for US13.2 (alert email) | - Seed DB: Equipment with next_maintenance_date = CURRENT_DATE + 5 days<br>- Trigger cron → Assert: Email sent to responsible_user<br>- Test passes | 2h |
| T028 | Write E2E test for US13.3 (maintenance record) | - Navigate /equipment/[id]/record-maintenance<br>- Fill form + upload photos + invoice PDF<br>- Submit → Assert: Record created, photos/PDF uploaded, schedule updated<br>- Test passes | 3h |
| T029 | Write E2E test for US13.4 (dashboard) | - Seed DB: 10 equipment<br>- Navigate /equipment/dashboard<br>- Assert: 3 widgets displayed (pie chart, bar chart, calendar)<br>- Test passes | 2h |
| T030 | Write E2E test for US13.5 (audit export) | - Seed DB: Equipment with 10 maintenance records<br>- Navigate /equipment/audit-export<br>- Fill form + submit → Assert: PDF downloaded, includes all records + photos<br>- Test passes | 3h |
| T031 | Write E2E tests for edge cases | - Test: Maintenance overdue → CRITICAL alert sent<br>- Test: Equipment without responsible_user → Validation error<br>- Test: Duplicate serial_number → Error<br>- Test: Hybrid scheduling → Alert consolidation<br>- Test: Photo upload fails → Record created without photos<br>- All 5 tests pass | 4h |
| T032 | Performance test alert/audit | - Measure: Alert latency <1 min (cron trigger to email sent)<br>- Measure: Audit PDF generation <10s (50 records with photos)<br>- Measure: Dashboard load time <2s (10 equipment)<br>- Optimize if slower | 3h |
| T033 | Manual testing checklist | - CRITICAL: 100% alertas enviadas 7 días antes<br>- CRITICAL: Maintenance costs tracked per project<br>- CRITICAL: Audit evidence includes all HSE fields<br>- Equipment registration works (responsible_user required, serial_number unique)<br>- Maintenance scheduling works (hybrid: hours OR days OR both)<br>- Daily cron job works (9 AM COT, every day)<br>- Email alerts work (F005 integration, 7-day window)<br>- Maintenance record creation works (recalculate next_maintenance_date)<br>- Photo/PDF upload works (F008 storage adapter)<br>- Dashboard works (equipment status, costs, upcoming maintenances)<br>- Audit export works (PDF with all records, photos, invoices)<br>- Overdue maintenances flagged (CRITICAL alerts, red badge)<br>- Hybrid scheduling works (whichever comes first = triggers alert)<br>- Error handling graceful<br>- All 14 checks pass | 4h |
| T034 | UAT with Jefe Maquinaria + Técnico (pilot) | - Schedule UAT session with 2 users (Jefe Maquinaria + Técnico)<br>- Test: Register 10 test equipment (different types: EXCAVATOR, MIXER, CRANE, etc.)<br>- Test: Schedule maintenances (hybrid: time + hours)<br>- Test: Receive alert emails (7 days before)<br>- Test: Record 10 maintenance services (with photos + invoices)<br>- Test: View dashboard (equipment status, costs)<br>- Test: Export audit evidence (PDF with all records)<br>- Collect feedback (NPS survey)<br>- Measure: Alert accuracy (100% sent 7 days before)<br>- Sign-off from both users | 6h |

**Total Estimated Time:** 90 hours (~4 weeks)

---

## BLOCKED

| ID | Task | Blocker | Notes |
|----|------|---------|-------|
| T006 | Alert service (F005) | F005 (Notifications) not fully implemented yet | Can mock F005.sendEmail() for testing |
| T009 | Maintenance record (F008) | F008 (Storage adapter) not fully implemented yet | Can mock storage.uploadFile() for testing |
| T010 | Audit export (F008) | F008 (Storage adapter) not fully implemented yet | Can mock storage.uploadFile() for testing |

---

## DONE

| ID | Task | Closed | Commit |
|----|------|--------|--------|
| - | Migration to SDD | 2025-12-24 | TBD |

---

**Dependencies:**
- T001-T003 independent (table migrations)
- T004 depends on T001 (equipment registration requires equipment table)
- T005 depends on T001, T002 (scheduling requires equipment + schedules tables)
- T006 depends on T002, F005 (alert service requires schedules table + F005 integration)
- T007 depends on T006 (cron endpoint calls alert service)
- T008 depends on T007 (Vercel cron requires endpoint)
- T009 depends on T003, F008 (maintenance record requires records table + F008 storage)
- T010 depends on T001, T003, F008 (audit export requires equipment + records tables + F008 storage)
- T011 depends on T004 (registration page calls registration endpoint)
- T012 depends on T005 (scheduling page calls scheduling endpoint)
- T013 depends on T009 (record page calls record endpoint)
- T014 depends on T001, T003 (dashboard queries equipment + records tables)
- T015 depends on T010 (audit export page calls export endpoint)
- T016-T020 depend on T004-T010 (unit tests require modules implemented)
- T021-T025 depend on T004-T010 (integration tests require full pipeline)
- T026-T031 depend on T011-T015 (E2E tests require full UI)
- T032-T034 depend on T026-T031 (performance + UAT require E2E tests pass)

**CRITICAL PRIORITY:**
- T006-T008 (alert system) is CRITICAL - 100% alertas 7 días antes required
- T009 (maintenance record) is CRITICAL - Recalculate next_maintenance_date correctly
- T010 (audit export) is CRITICAL - PDF must include all HSE compliance fields

---

**Last updated:** 2025-12-24 12:20 | Maintained by: Claude Code
