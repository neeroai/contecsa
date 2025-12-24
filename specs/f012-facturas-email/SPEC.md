# SPEC: Ingreso de Facturas por Email

Version: 1.0 | Date: 2025-12-24 11:30 | Owner: Javier Polo | Status: Active

---

## Problem

**Current Workflow:** Facturas llegan a múltiples emails (compras@, contabilidad@, liced@) → No hay inbox unificado → Facturas se pierden → Proceso manual: descargar PDF + subir a sistema + OCR + validar = 15-20 min por factura.

**Impact:** Tiempo desperdiciado 20 min/factura. Facturas perdidas (sin registro). Procesamiento depende de horario oficina (8 AM - 6 PM). Sin trazabilidad de facturas recibidas.

---

## Objective

**Primary Goal:** Inbox dedicado factura@contecsa.com → Gmail API polling automático (cada 5 min) → Extracción PDF → OCR automático (F004) → Validación vs PO (F007) → Notificación Contabilidad (F005) → Reducción 90% tiempo ingreso facturas + procesamiento 24/7.

**Success Metrics:**
- Reducción 90% tiempo ingreso facturas (20 min manual → 2 min automático)
- Reducción 100% facturas perdidas (inbox unificado, log de todos los emails)
- Procesamiento 24/7 (no depende de horario oficina)
- 95% precisión OCR (extracción automática vs revisión manual)
- <5 min latencia desde recepción email hasta notificación Contabilidad

---

## Scope

| In | Out |
|---|------|
| Gmail API polling (every 5 min) | Real-time webhooks (Gmail Push, Phase 2) |
| PDF attachment extraction | Images (JPG, PNG) as invoice format |
| Supplier whitelist (anti-spam) | Advanced spam filtering (ML-based) |
| OCR automatic (trigger F004) | Manual upload bypass (already in F004) |
| Price validation vs PO (F007 integration) | Auto-approval of invoices (always requires Contabilidad review) |
| Notification to Contabilidad (F005 integration) | Reply to supplier email (confirmation, Phase 2) |
| Dashboard: Pending review invoices | Invoice payment workflow (already in F003) |
| Security: SPF/DKIM verification | Antivirus scanning (ClamAV, Phase 2) |
| Audit log: All emails (processed + blocked) | Email forwarding to other systems |

---

## Contracts

### Input (Email Received)

| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| sender_email | string (email) | Y | Supplier email (must be in whitelist) |
| subject | string | N | Email subject (optional) |
| pdf_attachment | binary (PDF) | Y | Invoice PDF (max 10 MB, same as F004) |
| email_id | string | Y | Gmail message ID (for tracking) |
| received_at | timestamp | Y | Email timestamp (Gmail) |

### Output (Invoice Ingested)

| Field | Type | Condition | Notes |
|-------|------|-----------|-------|
| invoice_id | uuid | Always | Invoice record ID (invoices table) |
| invoice_number | string | Always | Extracted from OCR (F004) |
| supplier_email | string | Always | Email sender (logged) |
| amount | decimal | Always | Total amount (COP) from OCR |
| invoice_date | date | Always | Invoice date from OCR |
| pdf_url | string (URL) | Always | PDF stored in GCS/S3 |
| status | enum | Always | PENDING_REVIEW (always requires manual review) |
| ocr_confidence | decimal (0-100) | Always | OCR confidence score (F004) |
| price_validation | object | Always | Price anomaly detection result (F007) |
| purchase_id | uuid | Optional | Matched PO (if found) |
| ingestion_source | enum | Always | EMAIL_INTAKE (vs MANUAL_UPLOAD) |
| notified_at | timestamp | Always | Timestamp Contabilidad notified |

### Input (Supplier Whitelist Configuration)

| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| supplier_id | uuid | Y | Supplier ID (suppliers table) |
| email | string (email) | Y | Authorized supplier email |
| email_domain | string | N | Authorized domain (e.g., @proveedor.com) |
| is_active | boolean | Y | Active/inactive (for temporary block) |

### Output (Email Processing Status)

| Field | Type | Condition | Notes |
|-------|------|-----------|-------|
| processed_count | integer | Always | Emails processed successfully (last poll) |
| blocked_count | integer | Always | Emails blocked (not in whitelist) |
| error_count | integer | Always | Emails failed (OCR error, network error, etc.) |
| last_poll_at | timestamp | Always | Last poll timestamp |

---

## Business Rules

- **Polling Frequency:** Every 5 minutes → Query Gmail API (is:unread has:attachment filename:pdf after:5m)
- **Whitelist Validation:** Sender email OR domain must be in whitelist → If NOT, block email + log (blocked_emails table) + mark as read
- **PDF Extraction:** Extract first PDF attachment → If multiple PDFs, process first only + log warning
- **Auto-Processing Pipeline:** Extract PDF → Upload to storage → Trigger OCR (F004) → Find matching PO (by NIT + date range) → Validate price (F007 if PO found) → Create invoice record (status = PENDING_REVIEW) → Notify Contabilidad (F005)
- **Status:** ALL ingested invoices start as PENDING_REVIEW → Contabilidad must approve/reject manually (no auto-approval)
- **OCR Confidence Threshold:** If confidence <80% → Flag invoice for manual review (high priority alert)
- **Duplicate Detection:** Check invoice_number + supplier_email → If already exists, skip + log duplicate
- **Email Marking:** After processing, mark email as read → Archive in Gmail (keep for 90 days)
- **Audit Trail:** Log ALL emails (processed + blocked + errors) → Include sender, subject, timestamp, processing result
- **Rate Limiting:** Gmail API 250 req/sec → Batch requests if >10 emails in inbox
- **Timeout:** OCR processing >30s → Queue for retry (max 3 retries)

---

## Edge Cases

| Scenario | Handling | Notes |
|----------|----------|-------|
| Email without PDF attachment | Skip email → Log warning → Mark as read | Supplier may have sent text email |
| PDF >10 MB (exceeds F004 limit) | Reject email → Reply to supplier "PDF demasiado grande" → Log error | Gmail API supports up to 35 MB, but OCR (F004) max 10 MB |
| Sender not in whitelist | Block email → Log in blocked_emails table → Mark as read → Optional: Notify admin (if frequent blocker) | Anti-spam protection |
| OCR fails (confidence <50%) | Create invoice record with status = OCR_FAILED → High priority notification to Contabilidad (manual review) | Fallback to manual data entry |
| Multiple PDFs in email | Process first PDF only → Log warning "Multiple attachments, processed first PDF only" | Simplifies processing |
| Invoice number already exists (duplicate) | Skip processing → Log duplicate → Mark email as read → Optional: Notify supplier "Factura duplicada" | Prevent duplicate invoices |
| No matching PO found | Create invoice record with purchase_id = NULL → Flag for manual matching (Contabilidad must assign PO) | Valid scenario: invoice without PO |
| Price anomaly detected (F007) | Create invoice with anomaly flag → High priority notification to Contabilidad + Gerencia → Block payment until approved | CRITICAL for Caso Cartagena prevention |
| Gmail API quota exceeded (250 req/sec) | Queue emails for next poll → Log warning "Quota exceeded, retrying in 5 min" | Rare scenario (requires >1250 emails in inbox) |
| Network failure (Gmail unreachable) | Retry 3x with exponential backoff → If all fail, log error → Alert admin | Transient error |
| Email spoofing (SPF/DKIM fail) | Block email → Log in blocked_emails → Mark as read → Alert admin (potential phishing) | Security protection |

---

## Observability

**Logs:**
- `email_received` (info) - Sender, subject, has_attachment, email_id, received_at
- `email_blocked` (warn) - Sender (not in whitelist), subject, email_id
- `email_processed` (info) - Sender, invoice_id, invoice_number, amount, ocr_confidence, price_validation, processing_time_ms
- `email_failed` (error) - Sender, email_id, error_message (OCR failed, PDF too large, etc.)
- `invoice_ingested` (info) - Invoice_id, invoice_number, supplier_email, amount, purchase_id (if matched), status
- `duplicate_invoice_detected` (warn) - Invoice_number, supplier_email, existing_invoice_id
- `price_anomaly_detected` (warn) - Invoice_id, invoice_number, anomaly_score, deviation_percent (from F007)

**Metrics:**
- `emails_processed_count` - Total emails processed per poll (target: 90%+ success rate)
- `emails_blocked_count` - Total emails blocked (not in whitelist) per poll
- `email_processing_time_p95` - 95th percentile processing time (target <5 min from email received to notification)
- `ocr_confidence_avg` - Average OCR confidence (target >80%)
- `invoices_ingested_count` - Total invoices ingested (status = PENDING_REVIEW)
- `duplicate_invoices_count` - Total duplicate invoices detected
- `price_anomalies_detected_count` - Total price anomalies flagged (from F007)
- `gmail_api_quota_usage_pct` - % of Gmail API quota used (alert if >80%)

**Traces:**
- `email_intake_pipeline` (span) - Full flow: Poll Gmail → Extract PDF → Upload to storage → Trigger OCR → Find PO → Validate price → Create invoice → Notify Contabilidad
- `ocr_processing` (span) - OCR (F004) processing time
- `price_validation` (span) - Price anomaly detection (F007) processing time

---

## Definition of Done

- [ ] Code review approved
- [ ] Gmail API polling endpoint implemented (/api/cron/poll-invoice-emails)
- [ ] PDF attachment extraction working (base64 decode)
- [ ] Supplier whitelist table created (suppliers.email, suppliers.email_domain)
- [ ] Supplier whitelist validation working (email OR domain match)
- [ ] OCR automatic trigger working (F004 integration)
- [ ] Price validation working (F007 integration)
- [ ] PO matching working (by NIT + date range)
- [ ] Invoice record creation working (status = PENDING_REVIEW)
- [ ] Notification to Contabilidad working (F005 integration)
- [ ] Dashboard: Pending review invoices list (badge with count)
- [ ] Email marked as read after processing
- [ ] Audit log: All emails logged (processed + blocked + errors)
- [ ] **CRITICAL:** Email processing time <5 min (from email received to notification)
- [ ] **CRITICAL:** OCR confidence >80% (precision)
- [ ] **CRITICAL:** Whitelist blocking 100% spam emails
- [ ] Quality gates pass (format, lint, types, tests 80%+, build)
- [ ] Deployed to staging
- [ ] UAT with Contabilidad + Proveedor pilot (10 test invoices)

---

**Related:** F004 (OCR - automatic invoice extraction), F007 (Análisis Precios - price anomaly detection), F011 (Gmail API - email polling), F005 (Notificaciones - Contabilidad alerts) | **Dependencies:** Gmail API service account (F011), Storage (GCS/S3 for PDFs), Supplier whitelist configuration

**Original PRD:** docs/features/r12-facturas-email.md
