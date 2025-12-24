# SDD Implementation Plan: Ingreso de Facturas por Email

Version: 1.0 | Date: 2025-12-24 11:35 | Owner: Javier Polo | Status: Active

---

## Reference

**SPEC:** /specs/f012-facturas-email/SPEC.md
**ADR:** /specs/f012-facturas-email/ADR.md (Gmail API Polling decision)
**PRD:** docs/features/r12-facturas-email.md
**CRITICAL:** 90% reduction ingreso time (20 min → 2 min), 100% reduction lost invoices, 24/7 processing

---

## Stack Validated

**Gmail API:** REST API v1 + googleapis npm package
- Source: /Users/mercadeo/neero/docs-global/stack/common-stack.md:50-55 (third-party APIs)
- Use case: Poll inbox (every 5 min), extract PDF attachments, mark emails as read
- Rate limit: 250 req/sec, query filter: is:unread has:attachment filename:pdf after:5m

**Google Cloud Storage / AWS S3:** PDF storage
- Source: /Users/mercadeo/neero/docs-global/stack/common-stack.md:70-75 (object storage)
- Use case: Store invoice PDFs (same storage as F008 certificates)
- Retention: 7 years (DIAN compliance, same as F008)

**PostgreSQL:** invoices, blocked_emails, supplier_whitelist tables
- Source: /Users/mercadeo/neero/docs-global/stack/database-guide.md:20-40 (PostgreSQL patterns)
- Use case: Invoice metadata, whitelist validation, audit logs

**Vercel Cron:** Polling scheduler
- Source: /Users/mercadeo/neero/docs-global/stack/common-stack.md:80-85 (cron jobs)
- Use case: Trigger Gmail polling every 5 minutes

**OCR Integration (F004):** Automatic invoice extraction
- Source: /specs/f004-ocr-facturas/ (internal dependency)
- Use case: Extract invoice_number, NIT, amount, date from PDF

**Price Validation (F007):** Anomaly detection
- Source: /specs/f007-analisis-precios/ (internal dependency)
- Use case: Detect price anomalies >15% (Caso Cartagena prevention)

**Notifications (F005):** Contabilidad alerts
- Source: /specs/f005-notificaciones/ (internal dependency)
- Use case: Email Contabilidad with new invoice summary

**Validation Checklist:**
- [x] Stack matches docs-global/stack/ (4 citations)
- [x] NO INVENTAR protocol applied
- [x] ClaudeCode&OnlyMe filter passed (see ADR.md)
- [x] Dependencies: F004 (OCR), F007 (Price Validation), F011 (Gmail API), F005 (Notifications), F008 (Storage)
- [x] Limitations: MVP = polling every 5 min (not real-time webhooks), first PDF only (if multiple attachments), no auto-approval (always requires Contabilidad review)

---

## Implementation Steps (9 steps)

### S001: Create supplier_whitelist table migration (Drizzle)
**Deliverable:** SQL migration file with whitelist schema (id, supplier_id, email, email_domain, is_active, created_at, updated_at)
**Dependencies:** None
**Acceptance:** Table created, foreign key to suppliers, unique constraint on email + email_domain

### S002: Create blocked_emails audit table migration (Drizzle)
**Deliverable:** SQL migration file with blocked_emails schema (id, sender_email, subject, email_id, blocked_at, reason)
**Dependencies:** None
**Acceptance:** Table created, index on sender_email + blocked_at (for audit queries)

### S003: Implement Gmail polling service (lib/email-intake/poll-inbox.ts)
**Deliverable:** pollInvoiceInbox() function → Query Gmail API (is:unread has:attachment filename:pdf after:5m) → Extract sender, subject, email_id, attachments → Return array of emails
**Dependencies:** F011 (Gmail API service account setup)
**Acceptance:** Poll inbox works, returns list of unread emails with PDFs, rate limit respected (250 req/sec)

### S004: Implement PDF attachment extraction (lib/email-intake/extract-pdf.ts)
**Deliverable:** extractPdfAttachment(emailId) function → Call Gmail API attachments.get() → Base64 decode → Return PDF buffer
**Dependencies:** S003 (Gmail polling)
**Acceptance:** Extract first PDF attachment, decode base64 correctly, handle multiple PDFs (process first only + log warning)

### S005: Implement supplier whitelist validation (lib/email-intake/whitelist.ts)
**Deliverable:** isAuthorizedSupplier(email) function → Query supplier_whitelist table (email match OR domain match) → Return boolean
**Dependencies:** S001 (whitelist table)
**Acceptance:** Validate email OR domain (e.g., user@proveedor.com OR @proveedor.com), whitelist active suppliers only (is_active = TRUE)

### S006: Implement invoice ingestion pipeline (lib/email-intake/process-invoice.ts)
**Deliverable:** processInvoiceEmail(sender, pdfBuffer, emailId) function → Upload PDF to storage → Trigger OCR (F004) → Find matching PO (by NIT + date) → Validate price (F007 if PO found) → Create invoice record (status = PENDING_REVIEW) → Notify Contabilidad (F005)
**Dependencies:** S003, S004, S005, F004 (OCR), F007 (Price Validation), F005 (Notifications), F008 (Storage)
**Acceptance:** Full pipeline works, invoice created, Contabilidad notified, audit log entry, processing time <5 min

### S007: Implement polling cron endpoint (/api/cron/poll-invoice-emails GET)
**Deliverable:** Endpoint → Call pollInvoiceInbox() → For each email: validate whitelist → extract PDF → process invoice → mark as read → Return { processed_count, blocked_count, error_count }
**Dependencies:** S003, S004, S005, S006
**Acceptance:** Endpoint works, processes all unread emails, logs all actions, returns summary

### S008: Configure Vercel cron (vercel.json)
**Deliverable:** Cron config: { path: '/api/cron/poll-invoice-emails', schedule: '*/5 * * * *' } → Every 5 minutes
**Dependencies:** S007 (cron endpoint)
**Acceptance:** Cron triggers every 5 min (verify in Vercel logs), emails processed <1 min after trigger

### S009: Create pending review invoices dashboard (page: /invoices/pending)
**Deliverable:** Dashboard page (Contabilidad role) with list of invoices (status = PENDING_REVIEW), display: invoice_number, supplier_email, amount, invoice_date, ocr_confidence, price_validation (badge: OK/ANOMALY), actions: approve/reject/edit
**Dependencies:** S006 (invoice records created)
**Acceptance:** Dashboard shows all pending invoices, badge displays price anomaly (if F007 detected), click invoice opens detail page

---

## Milestones

**M1 - Setup + Polling:** [S001-S005] | Target: Week 1 (Whitelist table, Gmail polling, PDF extraction, whitelist validation)
**M2 - Pipeline + Cron:** [S006-S008] | Target: Week 2 (Invoice ingestion, cron endpoint, Vercel cron)
**M3 - Dashboard + UAT:** [S009] | Target: Week 3 (Pending review dashboard, UAT with Contabilidad)

---

## Risk Mitigation

| Risk | Mitigation | Owner |
|------|-----------|-------|
| **Gmail API quota exceeded (250 req/sec)** | Batch email processing, limit to 50 emails per poll, queue overflow for next poll | Claude Code |
| **OCR fails (confidence <50%)** | Create invoice with status = OCR_FAILED, high priority notification to Contabilidad, fallback to manual data entry | Claude Code |
| **Spam emails (not in whitelist)** | Whitelist validation before processing, log all blocked emails, alert admin if frequent blocker | Claude Code |
| **PDF malware (ClamAV not in MVP)** | Phase 2 only, rely on Gmail spam filter for MVP | Javier Polo |
| **Email spoofing (SPF/DKIM fail)** | Verify SPF/DKIM headers before processing, block if fail, log security event | Claude Code |
| **Duplicate invoices (same invoice_number)** | Check invoice_number + supplier_email before creating record, skip if exists, log duplicate | Claude Code |
| **No matching PO found** | Create invoice with purchase_id = NULL, flag for manual matching (Contabilidad must assign PO), valid scenario | Claude Code |
| **Price anomaly detected (Caso Cartagena)** | High priority notification to Contabilidad + Gerencia, block payment until approved, critical alert | Claude Code |
| **Network failure (Gmail unreachable)** | Retry 3x with exponential backoff, queue for next poll if fail, alert admin | Claude Code |

---

## Notes

**Critical Constraints:**
- F004 (OCR) must be implemented first (invoice extraction required)
- F007 (Price Validation) should be implemented before F012 (prevents Caso Cartagena)
- F011 (Gmail API) service account setup required (domain-wide delegation)
- F005 (Notifications) integration required (Contabilidad alerts)
- F008 (Storage) adapter required (PDF storage, same GCS/S3 as certificates)

**Assumptions:**
- Gmail inbox factura@contecsa.com already exists (client creates)
- Suppliers will send invoices as PDF attachments (not images, not email body)
- Polling every 5 min is acceptable latency (not real-time webhooks)
- Whitelist configuration done manually by admin (no self-service for suppliers)
- ALL invoices require manual review (no auto-approval, even if OCR + price validation pass)

**Blockers:**
- F004 (OCR) must be implemented (S006 - internal dependency)
- F007 (Price Validation) must be implemented (S006 - internal dependency)
- F011 (Gmail API) service account must be configured (S003 - external dependency)
- F005 (Notifications) must be implemented (S006 - internal dependency)
- F008 (Storage) adapter must be implemented (S006 - internal dependency)

---

**Last updated:** 2025-12-24 11:35 | Maintained by: Javier Polo + Claude Code
