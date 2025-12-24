# Test Plan: Mantenimiento Preventivo de Maquinaria

Version: 1.0 | Date: 2025-12-24 12:15 | Owner: Claude Code | Status: Active

---

## Reference

**SDD Version:** 1.0 | **Feature:** Mantenimiento Preventivo de Maquinaria (F013) | **Scope:** Unit + Integration + E2E | **Coverage Target:** 80% (Equipment registration, hybrid scheduling, alerts, service records, audit export)

---

## Test Strategy

**Philosophy:** 80% coverage on equipment registration, hybrid scheduling (time + hours), alert service (7-day window), maintenance records, audit export PDF. **CRITICAL:** 100% alertas enviadas 7 días antes, 60% reducción fallas, 100% HSE compliance. Unit tests verify equipment validation (responsible_user required, serial_number unique), scheduling logic (frequency_hours OR frequency_days), next_maintenance_date calculation, alert query (7-day window). Integration tests verify full pipeline (register equipment → schedule maintenance → daily cron → send alerts → record service → recalculate schedule → export audit PDF). E2E tests verify all 5 user stories (equipment registration, alert email, service record, dashboard, audit export). Performance tests verify alert latency <1 min, audit PDF generation <10s.

**Critical Paths:**
1. Equipment registration → Validate input (responsible_user required, serial_number unique) → Insert equipment → Return equipment_id
2. Maintenance scheduling → Validate frequency (hours OR days) → Calculate next_maintenance_date (last + frequency_days) → Calculate next_maintenance_hours (last + frequency_hours) → Insert schedule
3. Daily cron → Query upcoming maintenances (next_maintenance_date BETWEEN today AND today + 7 days) → Send email alerts (F005) → Return summary
4. Maintenance record → Upload photos/PDFs (F008) → Insert record → Recalculate next_maintenance_date → Update schedule
5. Audit export → Query maintenance_records (filter by equipment, date range) → Generate PDF → Upload to storage → Return signed URL

---

## Unit Tests

| Module | Test Cases | Tool | Status |
|--------|-----------|------|--------|
| Equipment registration (equipment.ts) | - registerEquipment() → Validates responsible_user required<br>- registerEquipment() → Enforces serial_number unique (constraint)<br>- registerEquipment() → Sets status = OPERATIONAL (default)<br>- registerEquipment() with duplicate serial_number → ERROR "Serial already exists" | Vitest + PostgreSQL test DB | TODO |
| Maintenance scheduling (schedule.ts) | - createSchedule() → Validates at least one frequency (hours OR days)<br>- createSchedule() → Calculates next_maintenance_date (CURRENT_DATE + frequency_days)<br>- createSchedule() → Calculates next_maintenance_hours (current_hours + frequency_hours)<br>- createSchedule() with no frequency → ERROR "At least one frequency required"<br>- createSchedule() with both frequencies → Calculates both next_maintenance_date AND next_maintenance_hours | Vitest + PostgreSQL test DB | TODO |
| Alert service (check-upcoming.ts) | - checkUpcomingMaintenances() → Queries 7-day window (next_maintenance_date BETWEEN today AND today + 7)<br>- checkUpcomingMaintenances() → Filters status = OPERATIONAL only (skips OUT_OF_SERVICE)<br>- checkUpcomingMaintenances() → Sends email alert (mocked F005)<br>- checkUpcomingMaintenances() with overdue maintenance → Sends CRITICAL alert<br>- checkUpcomingMaintenances() with hybrid schedule → Consolidates alerts (single email if both time + hours due) | Vitest + PostgreSQL test DB + mocked F005 | TODO |
| Maintenance record (record.ts) | - recordMaintenance() → Uploads photos/PDFs (mocked F008)<br>- recordMaintenance() → Recalculates next_maintenance_date (last + frequency_days)<br>- recordMaintenance() → Recalculates next_maintenance_hours (last + frequency_hours)<br>- recordMaintenance() → Updates maintenance_schedules table<br>- recordMaintenance() with photo upload failure → Allows record creation without photos + logs error | Vitest + PostgreSQL test DB + mocked F008 | TODO |
| Audit export (export.ts) | - exportAuditEvidence() → Queries maintenance_records (filtered by equipment, date range)<br>- exportAuditEvidence() → Generates PDF (equipment details + records table + photos + invoices)<br>- exportAuditEvidence() → Uploads PDF to storage (mocked F008)<br>- exportAuditEvidence() → Returns signed URL (1h expiry)<br>- exportAuditEvidence() with no records → Returns empty PDF with message "No records found" | Vitest + PostgreSQL test DB + mocked F008 | TODO |

---

## Integration Tests

| Component | Test Cases | Tool | Status |
|-----------|-----------|------|--------|
| Equipment registration pipeline | - Full flow: Validate input → Insert equipment → Return equipment_id<br>- Error handling: Duplicate serial_number → ERROR<br>- Error handling: No responsible_user → ERROR | Vitest + PostgreSQL test DB | TODO |
| Maintenance scheduling pipeline | - Full flow: Validate frequency → Calculate next_maintenance_date → Insert schedule<br>- Hybrid scheduling: Both frequency_hours + frequency_days → Calculates both<br>- Error handling: No frequency → ERROR | Vitest + PostgreSQL test DB | TODO |
| Alert pipeline | - Full flow: Daily cron → Query upcoming maintenances → Send email alerts → Return summary<br>- 7-day window: Alerts sent only for next_maintenance_date BETWEEN today AND today + 7<br>- Overdue maintenances: CRITICAL alerts sent (daily until performed)<br>- Email sent <1 min after cron trigger | Vitest + mocked F005 + PostgreSQL test DB | TODO |
| Maintenance record pipeline | - Full flow: Upload photos → Insert record → Recalculate next_maintenance_date → Update schedule<br>- Hybrid scheduling: Recalculates both next_maintenance_date AND next_maintenance_hours<br>- Photo upload failure: Record created without photos + error logged | Vitest + mocked F008 + PostgreSQL test DB | TODO |
| Audit export pipeline | - Full flow: Query records → Generate PDF → Upload to storage → Return signed URL<br>- PDF generation <10s (50 records with photos)<br>- Signed URL expiry: URL works <1h, 403 Forbidden after 1h | Vitest + mocked F008 + PostgreSQL test DB | TODO |

---

## E2E Tests (Playwright)

**Setup:** `bun test:e2e` | **Environment:** Staging with test data

**Happy Paths:**

1. **US13.1 - Jefe Maquinaria registers new equipment:**
   - Navigate to /equipment/new (as Jefe Maquinaria)
   - Fill form: equipment_type = EXCAVATOR, brand = Caterpillar, model = CAT 320D, serial_number = ABC123, purchase_date = 2023-01-15, warranty_expiry_date = 2026-01-15, responsible_user = Técnico
   - Submit form
   - Assert: Equipment registered (equipment_id returned)
   - Assert: Status = OPERATIONAL (default)
   - Assert: Navigate to /equipment/[id] (detail page)

2. **US13.2 - Jefe Maquinaria receives alert 7 days before maintenance:**
   - Seed DB: Equipment with next_maintenance_date = CURRENT_DATE + 5 days (within 7-day window)
   - Trigger cron job: GET /api/cron/check-maintenances
   - Assert: Email sent to responsible_user (Jefe Maquinaria)
   - Assert: Subject = "Mantenimiento Próximo: EXCAVATOR CAT 320D"
   - Assert: Body includes: equipment details, maintenance_type, next_maintenance_date, link to /equipment/[id]
   - Assert: Email sent <1 min after cron trigger

3. **US13.3 - Técnico records maintenance performed:**
   - Seed DB: Equipment with overdue maintenance (next_maintenance_date = CURRENT_DATE - 2 days)
   - Navigate to /equipment/[id] (as Técnico)
   - Click "Registrar Mantenimiento" button
   - Fill form: performed_date = CURRENT_DATE, tasks_performed = ["Oil change", "Filter replacement"], parts_replaced = ["Oil filter"], cost_cop = 150000, hours_at_service = 550
   - Upload photos (2 JPG files) + invoice PDF
   - Submit form
   - Assert: Maintenance record created (record_id returned)
   - Assert: Photos + PDF uploaded to storage
   - Assert: next_maintenance_date recalculated (CURRENT_DATE + 90 days)
   - Assert: next_maintenance_hours recalculated (550 + 500 = 1050)
   - Assert: Navigate to /equipment/[id] (shows updated next_maintenance_date)

4. **US13.4 - Gerencia views equipment dashboard:**
   - Seed DB: 10 equipment (5 OPERATIONAL, 3 MAINTENANCE, 2 OUT_OF_SERVICE)
   - Navigate to /equipment/dashboard (as Gerencia)
   - Assert: Dashboard shows 3 widgets: Equipment by status (pie chart), Costs per month (bar chart), Upcoming maintenances (calendar)
   - Assert: Pie chart: 5 OPERATIONAL (50%), 3 MAINTENANCE (30%), 2 OUT_OF_SERVICE (20%)
   - Assert: Bar chart: Monthly costs (Jan: $500K, Feb: $700K, Mar: $600K)
   - Assert: Calendar: 5 upcoming maintenances (next 30 days)

5. **US13.5 - HSE exports audit evidence:**
   - Seed DB: Equipment with 10 maintenance records (photos + invoices)
   - Navigate to /equipment/audit-export (as HSE or Gerencia)
   - Fill form: equipment_id = [equipment], from_date = 2024-01-01, to_date = 2024-12-31
   - Click "Exportar PDF"
   - Assert: PDF generated (includes equipment details + 10 records + photos + invoices)
   - Assert: PDF downloaded (signed URL works, 1h expiry)
   - Assert: PDF includes all required fields for HSE audit (equipment, dates, tasks, costs, evidence)

**Edge Case Tests:**

6. **Maintenance overdue (not performed):**
   - Seed DB: Equipment with next_maintenance_date = CURRENT_DATE - 10 days (overdue)
   - Trigger cron job: GET /api/cron/check-maintenances
   - Assert: CRITICAL alert sent to responsible_user (red badge, high priority email)
   - Assert: Dashboard shows OVERDUE badge (red) for equipment
   - Assert: Email subject = "URGENTE: Mantenimiento Atrasado - EXCAVATOR"

7. **Equipment without responsible_user:**
   - Navigate to /equipment/new
   - Fill form: equipment_type = MIXER, brand = Volvo, model = V100, serial_number = XYZ789, responsible_user = NULL (not selected)
   - Submit form
   - Assert: Validation error "Responsible user required"
   - Assert: Equipment NOT registered

8. **Duplicate serial_number:**
   - Seed DB: Equipment with serial_number = "ABC123"
   - Navigate to /equipment/new
   - Fill form: equipment_type = CRANE, serial_number = "ABC123" (duplicate)
   - Submit form
   - Assert: Error "Serial number already exists"
   - Assert: Equipment NOT registered

9. **Hybrid scheduling (both time + hours):**
   - Seed DB: Equipment with frequency_hours = 500, frequency_days = 90, current_hours = 480, last_maintenance_date = CURRENT_DATE - 85 days
   - Trigger cron job: GET /api/cron/check-maintenances
   - Assert: Alert sent (time-based due in 5 days = within 7-day window)
   - Assert: Email includes BOTH maintenance types (time + hours)

10. **Photo upload fails (network error):**
    - Navigate to /equipment/[id] → "Registrar Mantenimiento"
    - Fill form: performed_date, tasks_performed, cost_cop
    - Upload photos (simulate network failure during upload)
    - Submit form
    - Assert: Maintenance record created (without photos)
    - Assert: Error logged "Photo upload failed"
    - Assert: Success message "Mantenimiento registrado (fotos pendientes)"

**Performance Tests:**
- Alert latency <1 min (cron trigger to email sent)
- Audit PDF generation <10s (50 records with photos)
- Dashboard load time <2s (10 equipment)
- Equipment registration <1s (form submit to confirmation)

---

## Quality Gates CI

| Gate | Command | Target | Status |
|------|---------|--------|--------|
| Format | `bun run format --check` | 100% | TODO |
| Lint | `bun run lint` | 0 errors | TODO |
| Types | `bun run typecheck` | 0 errors | TODO |
| Unit | `bun run test` (lib/maintenance/*.test.ts) | 80%+ | TODO |
| Build | `bun run build` | Exit 0 | TODO |
| E2E | `bun test:e2e` (10 scenarios) | All 10 tests pass | TODO |

---

## Manual Testing Checklist

- [ ] **CRITICAL:** 100% alertas enviadas 7 días antes (no missed alerts)
- [ ] **CRITICAL:** Maintenance costs tracked per project (dashboard shows totals)
- [ ] **CRITICAL:** Audit evidence includes all required fields (HSE compliance)
- [ ] Equipment registration works (responsible_user required, serial_number unique)
- [ ] Maintenance scheduling works (hybrid: hours OR days OR both)
- [ ] Daily cron job works (9 AM COT, every day)
- [ ] Email alerts work (F005 integration, 7-day window)
- [ ] Maintenance record creation works (recalculate next_maintenance_date)
- [ ] Photo/PDF upload works (F008 storage adapter)
- [ ] Dashboard works (equipment status, costs, upcoming maintenances)
- [ ] Audit export works (PDF with all records, photos, invoices)
- [ ] Overdue maintenances flagged (CRITICAL alerts, red badge)
- [ ] Hybrid scheduling works (whichever comes first = triggers alert)
- [ ] Error handling graceful (duplicate serial, no responsible_user, photo upload failure)
- [ ] UAT with Jefe Maquinaria + Técnico (10 test equipment, real workflow)

---

**Token-efficient format:** 60 lines | 10 E2E scenarios | 80%+ coverage target | CRITICAL: 100% alertas + 60% reducción fallas + 100% HSE compliance
