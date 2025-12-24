# SPEC: Mantenimiento Preventivo de Maquinaria

Version: 1.0 | Date: 2025-12-24 12:00 | Owner: Javier Polo | Status: Active

---

## Problem

**Current Workflow:** Mantenimientos preventivos en papel/Excel → Sin recordatorios automáticos → Mantenimientos olvidados → Fallas inesperadas (costos altos) → Sin evidencia digital para auditorías HSE → Pérdida de garantías.

**Impact:** Fallas inesperadas (costos reparación 2-3× prevención). Auditorías HSE sin evidencia (multas). Pérdida garantías (sin prueba mantenimiento). Vida útil equipos reducida (mantenimiento inadecuado).

---

## Objective

**Primary Goal:** Base de datos de maquinaria → Programación automática mantenimientos (cada X horas o Y días) → Alertas 7 días antes (F005) → Registro digital servicios → Exportación evidencia auditorías HSE → Reducción 60% fallas + 40% costos + 100% cumplimiento HSE.

**Success Metrics:**
- Reducción 60% fallas inesperadas (mantenimiento preventivo oportuno)
- Reducción 40% costos de mantenimiento (prevención < reparación)
- 100% cumplimiento auditorías HSE (evidencia digital)
- Extensión vida útil equipos +30% (mantenimiento adecuado)
- 100% alertas enviadas 7 días antes (no mantenimientos olvidados)

---

## Scope

| In | Out |
|---|------|
| Equipment registration (type, brand, model, serial) | Real-time equipment location tracking (GPS, Phase 2) |
| Maintenance scheduling (hours + days) | Predictive maintenance (ML, Phase 2) |
| 7-day advance alerts (email) | Real-time IoT monitoring (sensors, Phase 2) |
| Service record (date, tasks, parts, cost) | Spare parts inventory management (F009 integration, Phase 2) |
| Photo/PDF evidence upload | Video evidence upload (Phase 2) |
| Dashboard: Equipment status, costs, calendar | Mobile app for technicians (Phase 2) |
| Export to PDF (audit evidence) | Export to Excel (use F011 Sheets export) |
| Daily cron job (check upcoming maintenances) | Warranty management (auto-alerts before expiry, Phase 2) |
| Hybrid scheduling (hours OR days) | Hour-meter automatic sync (IoT integration, Phase 2) |

---

## Contracts

### Input (Equipment Registration)

| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| equipment_type | enum | Y | EXCAVATOR, MIXER, CRANE, DUMP_TRUCK, GENERATOR, OTHER |
| brand | string | Y | Equipment brand (e.g., Caterpillar, Komatsu) |
| model | string | Y | Model (e.g., CAT 320D) |
| serial_number | string | Y | Serial number (unique identifier) |
| purchase_date | date | Y | Date purchased (for warranty tracking) |
| warranty_expiry_date | date | N | Warranty expiry (optional) |
| assigned_project | uuid | N | Project ID (optional, can be unassigned) |
| responsible_user | uuid | Y | User ID (responsible for maintenance) |

### Output (Equipment Registered)

| Field | Type | Condition | Notes |
|-------|------|-----------|-------|
| equipment_id | uuid | Always | Equipment ID (primary key) |
| status | enum | Always | OPERATIONAL (default) |
| created_at | timestamp | Always | Registration timestamp |

### Input (Maintenance Schedule)

| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| equipment_id | uuid | Y | Equipment ID (foreign key) |
| maintenance_type | enum | Y | PREVENTIVE, CORRECTIVE, INSPECTION |
| frequency_hours | integer | N | Frequency in hours (e.g., every 500 hours) |
| frequency_days | integer | N | Frequency in days (e.g., every 90 days) |
| is_active | boolean | Y | Active/inactive schedule (default TRUE) |

**Business Rule:** At least ONE frequency (hours OR days) MUST be specified. Both can be specified (hybrid scheduling).

### Output (Maintenance Scheduled)

| Field | Type | Condition | Notes |
|-------|------|-----------|-------|
| schedule_id | uuid | Always | Schedule ID (primary key) |
| next_maintenance_date | date | Always | Calculated next maintenance date |
| next_maintenance_hours | integer | Optional | Calculated next maintenance hours (if frequency_hours specified) |

### Input (Maintenance Record)

| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| equipment_id | uuid | Y | Equipment ID (foreign key) |
| maintenance_type | enum | Y | PREVENTIVE, CORRECTIVE, INSPECTION |
| performed_date | date | Y | Date service performed |
| performed_by | uuid | Y | User ID (technician) |
| hours_at_service | integer | N | Equipment hours when serviced (for hour-based scheduling) |
| tasks_performed | array[string] | Y | List of tasks (e.g., ["Oil change", "Filter replacement"]) |
| parts_replaced | array[string] | N | List of parts replaced (optional) |
| cost_cop | decimal | N | Service cost (COP) |
| invoice_pdf_url | string (URL) | N | Invoice PDF (uploaded to GCS/S3) |
| photos_urls | array[string (URL)] | N | Evidence photos (uploaded to GCS/S3) |
| notes | string | N | Additional notes (max 1000 chars) |

### Output (Maintenance Recorded)

| Field | Type | Condition | Notes |
|-------|------|-----------|-------|
| record_id | uuid | Always | Record ID (primary key) |
| next_maintenance_scheduled | date | Always | Recalculated next maintenance date |
| created_at | timestamp | Always | Record timestamp |

### Input (Export Audit Evidence)

| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| equipment_id | uuid | N | Filter by equipment (optional) |
| from_date | date | N | Filter by date range (optional) |
| to_date | date | N | Filter by date range (optional) |

### Output (Audit Evidence PDF)

| Field | Type | Condition | Notes |
|-------|------|-----------|-------|
| pdf_url | string (URL) | Always | Generated PDF URL (temporary signed URL, 1h expiry) |
| equipment_count | integer | Always | Number of equipment included |
| record_count | integer | Always | Number of maintenance records included |

---

## Business Rules

- **Hybrid Scheduling:** Equipment can have BOTH hour-based (every X hours) AND time-based (every Y days) schedules → Alert triggered by WHICHEVER comes first
- **Alert Window:** 7 days before next_maintenance_date → Send email alert (F005) to responsible_user
- **Daily Cron:** Run daily at 9 AM COT (2 PM UTC) → Check all equipment with next_maintenance_date BETWEEN CURRENT_DATE AND CURRENT_DATE + 7 days → Send alerts
- **Status Update:** After maintenance recorded → Recalculate next_maintenance_date (last_maintenance_date + frequency_days) AND next_maintenance_hours (last_maintenance_hours + frequency_hours) → Update maintenance_schedules table
- **Equipment Status:** OPERATIONAL (in use), MAINTENANCE (under service), OUT_OF_SERVICE (broken, awaiting parts)
- **Warranty Tracking:** If maintenance performed BEFORE warranty_expiry_date → Flag "Warranty valid" (for audits) → If AFTER, mark "Out of warranty"
- **Evidence Upload:** Photos/PDFs uploaded to GCS/S3 (same storage as F008) → Shareable links (1h expiry for security)
- **Audit Export:** PDF includes: Equipment details, all maintenance records (date, tasks, parts, cost, photos, invoices), total cost summary
- **Cost Tracking:** All maintenance costs logged → Monthly summary per equipment → Dashboard shows total costs per project

---

## Edge Cases

| Scenario | Handling | Notes |
|----------|----------|-------|
| Maintenance overdue (next_maintenance_date past) | Send CRITICAL alert (daily until performed) → Dashboard shows OVERDUE badge (red) | High priority |
| Equipment without responsible_user | Block equipment registration → ERROR "Responsible user required" | Must assign someone |
| Maintenance schedule without frequency (no hours, no days) | Block schedule creation → ERROR "At least one frequency required" | Validation rule |
| Hour-meter not updated (hours_at_service = NULL) | Use time-based schedule only (frequency_days) → Log warning "Hour-meter not tracked" | Fallback to time-based |
| Photo upload fails (network error) | Retry 3x → If all fail, allow record creation without photos → Log error "Photo upload failed" | Don't block maintenance record |
| Duplicate serial_number | Block equipment registration → ERROR "Serial number already exists" | Unique constraint |
| Equipment status = OUT_OF_SERVICE (broken) | Skip maintenance alerts (equipment not in use) → Resume alerts when status = OPERATIONAL | Don't alert for broken equipment |
| Warranty expired (maintenance performed AFTER warranty_expiry_date) | Flag "Out of warranty" → Display warning "Service not covered by warranty" | Information only |
| Export audit evidence with no records | Return empty PDF with message "No maintenance records found" → Log warning | Valid scenario (new equipment) |
| Multiple alerts for same equipment (both hour-based and time-based due) | Send SINGLE alert (combine both maintenance types in email) → Prevent spam | Consolidate alerts |

---

## Observability

**Logs:**
- `equipment_registered` (info) - Equipment_id, type, brand, model, serial_number, responsible_user
- `maintenance_scheduled` (info) - Schedule_id, equipment_id, maintenance_type, frequency_hours, frequency_days, next_maintenance_date
- `maintenance_alert_sent` (info) - Equipment_id, maintenance_type, responsible_email, next_maintenance_date
- `maintenance_recorded` (info) - Record_id, equipment_id, performed_date, tasks_performed, cost_cop
- `maintenance_overdue` (warn) - Equipment_id, next_maintenance_date (past), days_overdue
- `audit_export_generated` (info) - Equipment_count, record_count, from_date, to_date, pdf_url

**Metrics:**
- `equipment_count` - Total equipment registered
- `maintenance_alerts_sent_count` - Total alerts sent per day (target 100% coverage)
- `maintenance_records_created_count` - Total services recorded per month
- `maintenance_costs_total_cop` - Total costs per month (by project)
- `overdue_maintenances_count` - Total overdue maintenances (target 0)
- `equipment_uptime_pct` - % equipment OPERATIONAL vs MAINTENANCE/OUT_OF_SERVICE (target >90%)

**Traces:**
- `maintenance_alert_pipeline` (span) - Full flow: Daily cron → Query upcoming maintenances → Send email alerts
- `maintenance_record_pipeline` (span) - Full flow: Upload photos/PDFs → Create record → Recalculate next_maintenance_date → Update schedule
- `audit_export_pipeline` (span) - Full flow: Query records → Generate PDF → Upload to storage → Return signed URL

---

## Definition of Done

- [ ] Code review approved
- [ ] Equipment table created (equipment_type, brand, model, serial_number, status, warranty_expiry_date)
- [ ] Maintenance schedules table created (frequency_hours, frequency_days, next_maintenance_date, next_maintenance_hours)
- [ ] Maintenance records table created (performed_date, tasks_performed, parts_replaced, cost_cop, photos_urls, invoice_pdf_url)
- [ ] Equipment registration working (with responsible_user required)
- [ ] Maintenance scheduling working (hybrid: hours OR days)
- [ ] Daily cron job working (check upcoming maintenances, 7-day window)
- [ ] Email alerts working (F005 integration, 7 days before)
- [ ] Maintenance record creation working (recalculate next_maintenance_date)
- [ ] Photo/PDF upload working (GCS/S3 integration, F008 storage adapter)
- [ ] Dashboard: Equipment status, costs, upcoming maintenances
- [ ] Export audit evidence working (PDF with all records, photos, invoices)
- [ ] **CRITICAL:** 100% alerts sent 7 days before (no missed alerts)
- [ ] **CRITICAL:** Maintenance costs tracked per project (dashboard shows totals)
- [ ] **CRITICAL:** Audit evidence includes all required fields (HSE compliance)
- [ ] Quality gates pass (format, lint, types, tests 80%+, build)
- [ ] Deployed to staging
- [ ] UAT with Jefe Maquinaria + Técnico (10 test equipment, real workflow)

---

**Related:** F005 (Notificaciones - email alerts), F002 (Dashboard - equipment status widget), F009 (Inventario - spare parts integration, Phase 2), F010 (Proyección Financiera - maintenance costs, Phase 2), F008 (Certificados - storage adapter for photos/PDFs) | **Dependencies:** Daily cron job (Vercel Cron), Storage (GCS/S3), Email (F005)

**Original PRD:** docs/features/r13-mantenimiento-maq.md
