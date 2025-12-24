# SPEC: Gestión de Certificados de Calidad

Version: 1.0 | Date: 2025-12-24 10:30 | Owner: Javier Polo | Status: Active

---

## Problem

**Current Workflow:** Excel campo "Certificado" SIEMPRE VACÍO (55 compras, 0% certificados registrados) → Certificados físicos en folders (no digitalizados) → Pérdida/extravío sin backup → Búsqueda manual 2-4 horas para auditorías → Compliance NTC/INVIAS no verificado → Cierre contable SIN validar calidad (riesgo técnico + legal).

**Impact:** Riesgo técnico (material defectuoso sin certificado). Riesgo legal (DIAN auditoría sin respaldo). Tiempo desperdiciado 2-4h por búsqueda. Capital en riesgo (compras sin validar calidad).

---

## Objective

**Primary Goal:** Sistema gestión digital certificados calidad (NTC, INVIAS, ISO, proveedor) con upload obligatorio post-recepción → Validación técnica (Ing. Técnico) → Almacenamiento nube (GCS/S3/Vercel Blob) → Bloqueo cierre contable si falta certificado → Alertas automáticas 5 días post-recepción.

**Success Metrics:**
- 100% compras con certificado digital (vs 0% actual)
- Reducción 95% tiempo búsqueda (2h → 5 min búsqueda digital)
- Compliance NTC/INVIAS verificable (100% auditorías)
- Retención 7 años (DIAN compliance)
- <5s upload time (5 MB PDF)

---

## Scope

| In | Out |
|---|------|
| Upload PDF/imagen (drag-and-drop) | OCR automático (Phase 2) |
| Metadata manual (cert number, tipo, lab) | Blockchain verification (Phase 2) |
| Almacenamiento nube (GCS/S3/Vercel Blob) | Mobile app nativa (usar responsive web) |
| Validación técnica (VALID/REJECTED/PENDING) | Template pre-fill (Phase 2) |
| Blocking gate cierre contable | Bulk upload 10+ certs (Phase 2) |
| Alertas 5 días deadline (F005) | Expiry alerts (Phase 2) |
| Búsqueda por material/proveedor/fecha | AI-powered quality check |
| Download PDF (signed URL) | Integration MS SharePoint |
| Audit trail (upload, validate, download) | WhatsApp upload (Phase 2) |
| Retención 7 años (DIAN) | Automated certificate request to supplier |

---

## Contracts

### Input (Upload Certificate)

| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| file | File (PDF/JPG/PNG) | Y | Max 10 MB |
| purchase_id | uuid | Y | Purchase to attach certificate |
| certificate_number | string | N | Optional if OCR extracts |
| certificate_type | enum | Y | NTC, INVIAS, ISO_9001, SUPPLIER_INTERNAL, OTHER |
| issuing_lab | string | N | Laboratory/entity that issued cert |
| issue_date | date | N | Certificate issue date |
| expiry_date | date | N | Optional expiry (some don't expire) |
| lot_number | string | N | Material batch/lot |

### Output (Certificate Metadata)

| Field | Type | Condition | Notes |
|-------|------|-----------|-------|
| id | uuid | Always | Certificate ID |
| file_url | string (URL) | Always | GCS/S3/Blob signed URL (1h expiry) |
| file_hash | string (SHA-256) | Always | Detect tampering |
| validation_status | enum | Always | PENDING, VALID, REJECTED, EXPIRED |
| validated_by | uuid | If validated | Técnico user ID |
| validated_at | timestamp | If validated | Validation timestamp |
| deadline_date | date | Always | reception_date + 5 days |
| is_missing | boolean | Always | True if deadline passed without upload |

---

## Business Rules

- **Upload Trigger:** Material reception confirmed (F003) → Create task "Subir certificado (deadline 5 días)"
- **Upload Deadline:** 5 calendar days from reception_date → If not uploaded, trigger alert (F005)
- **Blocking Gate:** Purchase closure (Contabilidad) → Check certificate exists AND validation_status = VALID → If NO, block with error "Certificado faltante o no validado"
- **File Validation:** Max 10 MB, formats PDF/JPG/PNG, SHA-256 hash stored for tampering detection
- **Storage Policy:** 7-year retention (DIAN requirement) → GCS Object Lock (immutable) or S3 Glacier
- **Technical Validation:** Técnico reviews certificate → Mark VALID (compliant), REJECTED (wrong cert/missing data), PENDING (under review)
- **Validation Required:** Certificate must be VALID (not just uploaded) to allow purchase closure
- **Alert Email:** If validation_status = REJECTED → Email Jefe Compras (F005) with reason + action required
- **Audit Trail:** Log all actions (UPLOADED, VALIDATED, REJECTED, DOWNLOADED, DELETED) in certificate_audit_log table
- **Access Control:** RBAC - Only Compras, Técnico, Contabilidad, Gerencia, Admin can access certificates
- **Download Security:** Signed URLs with 1h expiry (GCS/S3) → Prevents unauthorized access after link shared

---

## Edge Cases

| Scenario | Handling | Notes |
|----------|----------|-------|
| Certificado nunca subido (deadline vencido) | Flag is_missing = TRUE → Dashboard red badge → Alert sent daily until uploaded | Allow closure override by Gerencia (emergency) |
| Certificado REJECTED by Técnico | Email Jefe Compras (reason + reupload link) → Purchase cannot close until new cert uploaded + validated | Track rejection count (if >2, escalate to Gerencia) |
| File corrupted (SHA-256 mismatch) | Error "Archivo corrupto, subir nuevamente" → Prevent storage | Log tampering attempt |
| Certificado sin expiry_date | Allow (many NTC don't expire) → No expiry alerts | Display "Sin vencimiento" in UI |
| Upload >10 MB (large scan) | Reject with error "Máximo 10 MB, comprimir PDF" → Suggest online compression | Consider compression API (Phase 2) |
| Multiple certificates per purchase | Allow (e.g., concreto + acero in same purchase) → Link via purchase_id | Display list in purchase detail |
| Certificate for different material (wrong upload) | Técnico marks REJECTED → Comments "Material incorrecto" → Compras re-uploads | Validation prevents mismatch |
| DIAN auditoría request (7+ years old) | Query certificate_audit_log → Download from GCS/S3 → Export to PDF | Retention policy ensures availability |
| Network timeout during upload | Retry logic (3 attempts) → If fails, queue for background upload | Show progress bar |
| Concurrent validation (2 Técnicos) | Optimistic locking (version field) → Last validation wins, log both | Rare scenario, document in audit trail |

---

## Observability

**Logs:**
- `certificate_uploaded` (info) - Purchase, material, file_size, uploaded_by, file_url
- `certificate_validated` (info) - Certificate, validation_status, validated_by, comments
- `certificate_rejected` (warn) - Certificate, reason, Técnico, Compras notified
- `certificate_missing_alert` (warn) - Purchase, deadline_date, days_overdue, alert_sent
- `purchase_closure_blocked` (warn) - Purchase, reason (MISSING_CERTIFICATE or CERTIFICATE_NOT_VALIDATED)
- `certificate_downloaded` (info) - Certificate, downloaded_by, audit_purpose
- `certificate_tampered` (critical) - Certificate, file_hash mismatch detected

**Metrics:**
- `certificates_uploaded_count` - Total certificates uploaded (target 100% purchases)
- `certificate_upload_time_p95` - 95th percentile upload time (target <5s)
- `certificate_validation_time_p50` - Median time from upload → validation (target <24h)
- `certificate_missing_alerts_count` - Alerts sent for missing certificates (target <5% purchases)
- `purchase_closures_blocked_count` - Closures blocked by missing/invalid cert (indicates compliance)
- `certificate_search_time_p95` - 95th percentile search time (target <1s for 100 certs)
- `certificate_rejection_rate` - % certificates rejected by Técnico (target <10%)

**Traces:**
- `certificate_upload_pipeline` (span) - Full flow: Upload → Hash → Store → Metadata DB → Update purchase status
- `certificate_validation_pipeline` (span) - Full flow: Técnico review → Update status → Email if rejected
- `purchase_closure_pipeline` (span) - Full flow: Check certificate → Validate status → Allow/block closure

---

## Definition of Done

- [ ] Code review approved
- [ ] certificates + certificate_audit_log tables created (PostgreSQL)
- [ ] Upload endpoint working (GCS/S3/Vercel Blob)
- [ ] File validation (10 MB max, PDF/JPG/PNG)
- [ ] SHA-256 hash calculation + tampering detection
- [ ] Blocking gate prevents closure without VALID certificate
- [ ] 5-day deadline alert (cron job, F005 integration)
- [ ] Technical validation workflow (VALID/REJECTED/PENDING)
- [ ] Search/download functionality (auditoría use case)
- [ ] Audit trail logs all actions
- [ ] RBAC enforced (Compras, Técnico, Contabilidad only)
- [ ] Signed URLs (1h expiry) for secure download
- [ ] **CRITICAL:** 100% purchases with certificates (vs 0% current)
- [ ] **CRITICAL:** Search time <1s (100 certificates)
- [ ] Quality gates pass (format, lint, types, tests 80%+, build)
- [ ] Deployed to staging
- [ ] UAT with Compras + Técnico (10 uploads + validations)

---

**Related:** F003 (Seguimiento Compras - reception trigger), F005 (Notificaciones - alerts), F002 (Dashboard - cert status), F004 (OCR - optional Phase 2) | **Dependencies:** GCS/S3/Vercel Blob setup, PostgreSQL certificates tables, F005 alerts

**Original PRD:** docs/features/r08-certificados.md
