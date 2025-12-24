# SDD Implementation Plan: Gestión de Certificados

Version: 1.0 | Date: 2025-12-24 10:35 | Owner: Javier Polo | Status: Active

---

## Reference

**SPEC:** /specs/f008-certificados/SPEC.md
**ADR:** /specs/f008-certificados/ADR.md (GCS/Vercel Blob storage decision)
**PRD:** docs/features/r08-certificados.md
**CRITICAL:** 100% certificates uploaded (vs 0% current), 95% reduction search time

---

## Stack Validated

**Storage:** Google Cloud Storage (preferred) OR Vercel Blob (simpler)
- Source: /Users/mercadeo/neero/docs-global/stack/common-stack.md:70-75 (file storage)
- Use case: PDF/image storage, signed URLs, 7-year retention policy
- Alternative: AWS S3 (if client prefers AWS)

**Database:** PostgreSQL 15
- Source: /Users/mercadeo/neero/docs-global/stack/database-guide.md:15-25
- Tables: certificates (metadata), certificate_audit_log (actions)
- Use case: Certificate metadata, validation status, audit trail

**Frontend:** Next.js 15 App Router
- Source: /Users/mercadeo/neero/docs-global/stack/nextjs-react-patterns.md:10-15
- Pages: /purchases/[id] (upload cert), /certificates (search/download)
- Components: react-dropzone (drag-and-drop)

**File Upload:** react-dropzone + @vercel/blob OR @google-cloud/storage
- Source: /Users/mercadeo/neero/docs-global/stack/common-stack.md:70-75
- Use case: Drag-and-drop UX, file validation, signed URLs

**Notifications:** Gmail API (F005)
- Source: specs/f005-notificaciones/ADR.md
- Use case: Missing certificate alerts (5-day deadline), rejection notifications

**Validation Checklist:**
- [x] Stack matches docs-global/stack/ (4 citations)
- [x] NO INVENTAR protocol applied
- [x] ClaudeCode&OnlyMe filter passed (see ADR.md)
- [x] Dependencies: F003 (purchase tracking), F005 (alerts), F002 (dashboard)
- [x] Limitations: MVP = manual metadata entry (no OCR), single file per upload (no bulk)

---

## Implementation Steps (13 steps)

### S001: Create certificates table migration
**Deliverable:** SQL migration with certificates table (20 fields: id, purchase_id, material_id, certificate_number, certificate_type, issuing_lab, issue_date, expiry_date, lot_number, file_url, file_name, file_size_bytes, file_type, file_hash, validation_status, validated_by, validated_at, validation_comments, uploaded_by, uploaded_at, reception_date, deadline_date, is_missing)
**Dependencies:** PostgreSQL connection, purchases table
**Acceptance:** Table created, indexes on purchase_id/material_id/validation_status/deadline_date, foreign keys to purchases/users

### S002: Create certificate_audit_log table migration
**Deliverable:** SQL migration with certificate_audit_log table (7 fields: id, certificate_id, action, performed_by, old_value, new_value, ip_address, timestamp)
**Dependencies:** S001 (certificates table)
**Acceptance:** Table created, foreign keys to certificates/users, index on certificate_id + timestamp

### S003: Setup cloud storage (GCS or Vercel Blob)
**Deliverable:** Storage bucket configured with signed URL generation, 7-year retention policy
**Dependencies:** GCP/Vercel account, credentials
**Acceptance:** Bucket created, credentials stored in .env, test upload/download works

### S004: Implement file upload endpoint (API route)
**Deliverable:** /api/certificates/upload POST endpoint with file validation (10 MB max, PDF/JPG/PNG), SHA-256 hash calculation, upload to storage, metadata insert to PostgreSQL
**Dependencies:** S001 (certificates table), S003 (storage)
**Acceptance:** Upload works, file stored in GCS/Blob, metadata in DB, hash calculated, purchase status updated (has_certificate = TRUE)

### S005: Implement upload UI (react-dropzone)
**Deliverable:** Upload form component with drag-and-drop, metadata fields (cert number, type, lab, dates), progress indicator, deadline display
**Dependencies:** S004 (upload endpoint)
**Acceptance:** Drag-and-drop works, form validation, upload progress shown, success/error messages

### S006: Implement blocking gate (purchase closure check)
**Deliverable:** /api/purchases/close POST endpoint with certificate existence + validation check
**Dependencies:** S001 (certificates table)
**Acceptance:** Closure blocked if certificate missing OR validation_status != VALID, error message displayed, audit log entry created

### S007: Implement technical validation workflow
**Deliverable:** /api/certificates/validate POST endpoint with status update (VALID/REJECTED/PENDING), comments field, compliance standards array, rejection email (F005)
**Dependencies:** S001 (certificates table), F005 (Gmail API)
**Acceptance:** Validation works, status updated, Técnico comments saved, email sent if REJECTED, audit log entry

### S008: Implement 5-day deadline alert (cron job)
**Deliverable:** /api/cron/check-missing-certificates GET endpoint with daily job (9 AM COT), query purchases with reception_date + 5 days <= today AND has_certificate = FALSE, send email (F005) to Jefe Compras
**Dependencies:** S001 (certificates table), F005 (Gmail API)
**Acceptance:** Cron job runs daily, missing certificates detected, email sent with deadline + link to upload, is_missing flag updated

### S009: Implement certificate search API
**Deliverable:** /api/certificates/search GET endpoint with filters (material, supplier, date range), query certificates table, return list with purchase metadata
**Dependencies:** S001 (certificates table)
**Acceptance:** Search works, filters applied correctly, results paginated (20 per page), <1s query time (100 certificates)

### S010: Implement certificate download (signed URL)
**Deliverable:** /api/certificates/[id]/download GET endpoint with signed URL generation (1h expiry), audit log entry (DOWNLOADED action)
**Dependencies:** S003 (storage), S002 (audit log)
**Acceptance:** Download link generated, 1h expiry enforced, file accessible, audit log entry created

### S011: Integrate with F003 (purchase tracking)
**Deliverable:** Hook in purchase reception workflow (F003) → Create certificate upload task, set deadline_date = reception_date + 5 days, display "Subir certificado" button in purchase detail
**Dependencies:** F003 implemented, S001 (certificates table)
**Acceptance:** Reception confirmed → Upload button appears, deadline displayed, purchase status shows certificate missing

### S012: Integrate with F002 (dashboard)
**Deliverable:** Certificate status badge in purchase list (✅ VALID, ❌ MISSING, ⏳ PENDING, 🚫 REJECTED), filter by certificate status
**Dependencies:** F002 implemented, S001 (certificates table)
**Acceptance:** Badge displayed correctly, filter works, click badge → certificate detail

### S013: Implement certificate search UI (auditoría)
**Deliverable:** /certificates page with search form (material, supplier, date range), results table with download links, export to Sheets button
**Dependencies:** S009 (search API), S010 (download)
**Acceptance:** Search works, results displayed, download buttons functional, export to Sheets (F011 integration Phase 2)

---

## Milestones

**M1 - Data Layer:** [S001-S003] | Target: Week 1 (Certificates tables + storage setup)
**M2 - Upload + Validation:** [S004-S007] | Target: Week 2 (Upload endpoint + UI + blocking gate + validation)
**M3 - Alerts + Integration:** [S008-S013] | Target: Week 3 (Cron job + search + F003/F002 integration)

---

## Risk Mitigation

| Risk | Mitigation | Owner |
|------|-----------|-------|
| **Storage costs escalate (1,000+ certificates)** | Monitor monthly costs, compress PDFs (lossy compression = smaller files), archive old certificates to Glacier (cheaper), set budget alert $20/month | Javier Polo |
| **File uploads timeout (slow network)** | Implement chunked upload (large files split), retry logic (3 attempts), queue background upload if fails, show progress bar | Claude Code |
| **Certificate tampering (SHA-256 bypass)** | Verify hash on download, log mismatch as CRITICAL security event, lock file in storage (GCS Object Lock prevents deletion) | Claude Code |
| **Compliance failure (DIAN 7-year retention)** | Enforce retention policy at storage level (GCS/S3 lifecycle rule), test retrieval of 8-year-old cert, document in DoD | Javier Polo |
| **User resistance (manual upload overhead)** | Training (\"por qué importa certificados\"), simplify form (5 fields max), OCR auto-fill (Phase 2), gamificación (badge \"100% certificados\") | Javier Polo |
| **Técnico validation bottleneck (1 person)** | Assign backup validator (Gerencia), auto-approve if >7 days no validation (emergency), track validation_time metric | Javier Polo |
| **Blocking gate too strict (emergency closures)** | Allow Gerencia override (with audit log + justification), track override_count metric, review monthly | Javier Polo |

---

## Notes

**Critical Constraints:**
- F003 (Purchase Tracking) must trigger certificate upload task after reception
- F005 (Notifications) must send alerts for missing certificates + rejections
- MVP = manual metadata entry (no OCR until Phase 2)
- MVP = single file per upload (no bulk upload until Phase 2)
- Storage choice: Client decides GCS vs S3 (MVP supports both)

**Assumptions:**
- Purchases have reception_date (from F003)
- Técnico has capacity to validate certificates within 24h
- Suppliers provide digital certificates (not all may, require scanning)
- 7-year retention = legal requirement (DIAN Colombia)
- Certificate types: NTC (80%), INVIAS (15%), ISO/Other (5%)

**Blockers:**
- F003 purchase tracking must be implemented (S011 - internal dependency)
- F005 Gmail API service implemented (S007-S008 - internal dependency)
- F002 dashboard implemented (S012 - internal dependency)
- Storage credentials (GCS or Vercel Blob) - client provides

---

**Last updated:** 2025-12-24 10:35 | Maintained by: Javier Polo + Claude Code
