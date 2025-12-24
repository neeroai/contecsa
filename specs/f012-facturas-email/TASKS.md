# TASKS: Ingreso de Facturas por Email

Version: 1.0 | Date: 2025-12-24 11:50 | Owner: Claude Code | Status: Active

---

## DOING

| ID | Task | DoD | Est |
|----|------|-----|-----|
| - | No active tasks yet | - | - |

---

## TODO (Priority Order - From PLAN.md)

| ID | Task | DoD | Est |
|----|------|-----|-----|
| T001 | Create supplier_whitelist table migration (Drizzle) | - SQL migration file with 7 fields (id, supplier_id, email, email_domain, is_active, created_at, updated_at)<br>- Foreign key to suppliers table<br>- Unique constraint on email + email_domain (prevent duplicates)<br>- Index on email + email_domain (fast whitelist queries)<br>- Default is_active = TRUE | 2h |
| T002 | Create blocked_emails audit table migration (Drizzle) | - SQL migration file with 6 fields (id, sender_email, subject, email_id, blocked_at, reason)<br>- Index on sender_email + blocked_at (for audit queries)<br>- Reason enum: NOT_IN_WHITELIST, SPF_FAIL, DKIM_FAIL, OTHER | 1h |
| T003 | Implement Gmail polling service (lib/email-intake/poll-inbox.ts) | - Function: pollInvoiceInbox() → Returns { emails[], last_poll_at }<br>- Query Gmail API: is:unread has:attachment filename:pdf after:5m<br>- Extract: sender, subject, email_id, attachments (array of attachment IDs)<br>- Rate limit: Batch to 50 emails per poll (if >50, queue remaining for next poll)<br>- Error handling: Retry 3x with exponential backoff (1s, 2s, 4s)<br>- Test: Poll inbox → Returns list of emails with PDFs | 4h |
| T004 | Implement PDF attachment extraction (lib/email-intake/extract-pdf.ts) | - Function: extractPdfAttachment(emailId) → Returns PDF buffer (Uint8Array)<br>- Call Gmail API: users().messages().attachments().get()<br>- Base64 decode: base64.urlsafe_b64decode()<br>- Handle multiple PDFs: Process first only + log warning "Multiple PDFs"<br>- Handle no PDF: Return null (skip email)<br>- Test: Extract PDF → Buffer returned, multiple PDFs → First only | 3h |
| T005 | Implement supplier whitelist validation (lib/email-intake/whitelist.ts) | - Function: isAuthorizedSupplier(email) → Returns boolean<br>- Query supplier_whitelist: WHERE (email = $1 OR email_domain = $2) AND is_active = TRUE<br>- Extract domain from email: email.split('@')[1]<br>- Cache whitelist (Redis, 5 min TTL) for performance<br>- Test: Validate email match, validate domain match, validate inactive supplier (FALSE) | 3h |
| T006 | Implement blocked email logging (lib/email-intake/block-email.ts) | - Function: logBlockedEmail(sender, subject, emailId, reason) → Inserts blocked_emails row<br>- Mark email as read: Gmail API users().messages().modify()<br>- Optional: Alert admin if frequent blocker (>10 blocks/day from same sender)<br>- Test: Block email → Logged in DB, email marked as read | 2h |
| T007 | Implement invoice ingestion pipeline (lib/email-intake/process-invoice.ts) | - Function: processInvoiceEmail(sender, pdfBuffer, emailId) → Returns invoice_id<br>- Step 1: Upload PDF to storage (GCS/S3/Vercel Blob, same adapter as F008)<br>- Step 2: Trigger OCR (F004 integration): ocrInvoice(pdfUrl) → Returns { invoice_number, NIT, amount, date, confidence }<br>- Step 3: Find matching PO: Query purchases WHERE supplier.nit = $1 AND reception_date BETWEEN $2 - 30 days AND $2 + 30 days<br>- Step 4: Validate price (F007 integration if PO found): detectPriceAnomaly(materialId, supplierId, unitPrice) → Returns { anomaly_detected, severity, deviation_percent }<br>- Step 5: Create invoice record (status = PENDING_REVIEW, ingestion_source = EMAIL_INTAKE)<br>- Step 6: Notify Contabilidad (F005 integration): sendEmail(to: contabilidad@, subject: "Nueva factura", body: invoice summary + link)<br>- Error handling: OCR fails (confidence <50%) → Create invoice status = OCR_FAILED + high priority notification<br>- Test: Full pipeline → Invoice created, Contabilidad notified, processing time <5 min | 6h |
| T008 | Implement duplicate invoice detection (lib/email-intake/check-duplicate.ts) | - Function: isDuplicateInvoice(invoiceNumber, supplierEmail) → Returns boolean<br>- Query invoices: WHERE invoice_number = $1 AND supplier_email = $2<br>- If exists → Log duplicate + skip processing + mark email as read<br>- Test: Duplicate invoice → Skipped, logged | 2h |
| T009 | Implement polling cron endpoint (/api/cron/poll-invoice-emails GET) | - Endpoint: Call pollInvoiceInbox() → For each email: validate whitelist → extract PDF → check duplicate → process invoice → mark as read<br>- Summary: { processed_count, blocked_count, error_count, last_poll_at }<br>- Error handling: Catch all errors, log, continue processing next email (don't stop on single failure)<br>- Test: GET /api/cron/poll-invoice-emails → Summary returned, all emails processed | 4h |
| T010 | Configure Vercel cron (vercel.json) | - Cron config: { path: '/api/cron/poll-invoice-emails', schedule: '*/5 * * * *' } → Every 5 minutes<br>- Deploy to Vercel<br>- Test: Cron triggers every 5 min (verify in Vercel logs), emails processed <1 min after trigger | 1h |
| T011 | Create pending review invoices dashboard (/invoices/pending page) | - Page: /invoices/pending (Contabilidad role only, RBAC)<br>- Query invoices: WHERE status = 'PENDING_REVIEW' ORDER BY created_at DESC LIMIT 20<br>- Table columns: invoice_number, supplier_email, amount, invoice_date, ocr_confidence (badge: >80% = green, <80% = yellow), price_validation (badge: OK = green, ANOMALY = red), actions (approve, reject, edit)<br>- Click invoice row → Navigate to /invoices/[id] (detail page)<br>- Pagination (20 per page)<br>- Responsive (mobile + desktop)<br>- Test: Dashboard shows all pending invoices, badge displays correctly, click navigates | 5h |
| T012 | Create supplier whitelist configuration page (/suppliers/whitelist) | - Page: /suppliers/whitelist (Compras or Admin role only)<br>- List whitelist: Query supplier_whitelist JOIN suppliers<br>- Add form: email (input), email_domain (input), supplier_id (select dropdown), is_active (checkbox)<br>- Edit whitelist: Toggle is_active (activate/deactivate supplier)<br>- Delete whitelist: Remove from supplier_whitelist (soft delete preferred)<br>- Test: Add supplier → Whitelist updated, toggle active → Updated, delete → Removed | 4h |
| T013 | Write unit tests for Gmail polling | - Test: pollInvoiceInbox() → Queries Gmail API with correct filter<br>- Test: pollInvoiceInbox() → Returns list of emails (sender, subject, email_id)<br>- Test: pollInvoiceInbox() with >50 emails → Batches to 50<br>- Test: pollInvoiceInbox() with network error → Retries 3x<br>- Coverage >80% | 3h |
| T014 | Write unit tests for PDF extraction | - Test: extractPdfAttachment() → Calls Gmail API attachments.get()<br>- Test: extractPdfAttachment() → Base64 decodes correctly<br>- Test: extractPdfAttachment() with multiple PDFs → Returns first only + logs warning<br>- Test: extractPdfAttachment() with no PDF → Returns null<br>- Coverage >80% | 2h |
| T015 | Write unit tests for whitelist validation | - Test: isAuthorizedSupplier() → Email match returns TRUE<br>- Test: isAuthorizedSupplier() → Domain match returns TRUE<br>- Test: isAuthorizedSupplier() with inactive supplier → Returns FALSE<br>- Test: isAuthorizedSupplier() with unknown email → Returns FALSE<br>- Coverage >80% | 2h |
| T016 | Write unit tests for invoice ingestion | - Test: processInvoiceEmail() → Uploads PDF to storage<br>- Test: processInvoiceEmail() → Triggers OCR (mocked F004)<br>- Test: processInvoiceEmail() → Finds matching PO<br>- Test: processInvoiceEmail() → Validates price (mocked F007 if PO found)<br>- Test: processInvoiceEmail() → Creates invoice record (status = PENDING_REVIEW)<br>- Test: processInvoiceEmail() → Notifies Contabilidad (mocked F005)<br>- Test: processInvoiceEmail() with OCR confidence <80% → Flags for manual review<br>- Test: processInvoiceEmail() with duplicate → Skips + logs<br>- Coverage >80% | 4h |
| T017 | Write integration test for email polling pipeline | - Test: Full flow: Poll Gmail → Extract emails → Filter unread + PDF attachments → Return list<br>- Test: Batch processing: >50 emails → Process 50 per poll<br>- Test: Error handling: Gmail API error → Retry 3x → Alert admin<br>- Coverage >80% | 3h |
| T018 | Write integration test for PDF extraction pipeline | - Test: Full flow: Get email → Extract first PDF → Base64 decode → Return buffer<br>- Test: Multiple PDFs: Process first only → Log warning<br>- Test: No PDF: Skip email → Log warning → Mark as read<br>- Coverage >80% | 2h |
| T019 | Write integration test for whitelist validation pipeline | - Test: Full flow: Extract sender → Query whitelist (email OR domain) → Return boolean<br>- Test: Blocked email: Not in whitelist → Log in blocked_emails → Mark as read<br>- Test: Authorized supplier: In whitelist → Allow processing<br>- Coverage >80% | 2h |
| T020 | Write integration test for invoice ingestion pipeline | - Test: Full flow: Upload PDF → Trigger OCR → Find PO → Validate price → Create invoice → Notify Contabilidad<br>- Test: Processing time <5 min (from email received to notification)<br>- Test: No matching PO: Create invoice with purchase_id = NULL<br>- Test: Price anomaly detected (F007): High priority notification to Contabilidad + Gerencia<br>- Test: OCR fails (confidence <50%): Create invoice status = OCR_FAILED<br>- Coverage >80% | 4h |
| T021 | Write integration test for polling cron pipeline | - Test: Full flow: Cron triggers → Poll Gmail → For each email: validate whitelist → extract PDF → process invoice → mark as read → Return summary<br>- Test: Summary returned: { processed_count, blocked_count, error_count, last_poll_at }<br>- Coverage >80% | 2h |
| T022 | Write E2E test for US12.1 (supplier sends invoice) | - Send test email from authorized supplier (proveedor@example.com) with PDF<br>- Wait 5 min + 30 sec (cron trigger)<br>- Assert: Email marked as read<br>- Assert: PDF extracted and uploaded<br>- Assert: OCR triggered<br>- Assert: Invoice created (status = PENDING_REVIEW)<br>- Assert: Contabilidad notified<br>- Assert: Processing time <5 min<br>- Test passes | 3h |
| T023 | Write E2E test for US12.2 (Contabilidad receives notification) | - Send test email (proveedor@example.com + PDF)<br>- Wait 5 min + 30 sec<br>- Assert: Notification email sent to contabilidad@contecsa.com<br>- Assert: Email subject = "Nueva factura ingresada: [invoice_number]"<br>- Assert: Email body includes proveedor, amount, PO match result<br>- Assert: Link to invoice detail works<br>- Test passes | 2h |
| T024 | Write E2E test for US12.3 (review dashboard) | - Seed DB: 10 invoices (status = PENDING_REVIEW)<br>- Navigate /invoices/pending (as Contabilidad)<br>- Assert: Dashboard shows all 10 invoices<br>- Assert: Columns: invoice_number, supplier_email, amount, ocr_confidence, price_validation<br>- Assert: Click invoice → Navigate to detail page<br>- Test passes | 2h |
| T025 | Write E2E test for US12.4 (whitelist configuration) | - Navigate /suppliers/whitelist (as Compras)<br>- Add new supplier: email = proveedor@example.com<br>- Assert: Supplier added<br>- Send test email from proveedor@example.com<br>- Assert: Email processed (not blocked)<br>- Add domain: @example.com<br>- Send test email from otro@example.com<br>- Assert: Email processed (domain match)<br>- Test passes | 3h |
| T026 | Write E2E tests for edge cases | - Test: Email from unauthorized sender → Blocked + logged<br>- Test: Email with multiple PDFs → First processed only<br>- Test: Email without PDF → Skipped + logged<br>- Test: OCR fails (confidence <50%) → Invoice status = OCR_FAILED<br>- Test: Duplicate invoice → Skipped + logged<br>- Test: Price anomaly detected → High priority notification<br>- All 6 tests pass | 4h |
| T027 | Performance test email processing | - Measure: Email processing time <5 min (from email received to Contabilidad notification)<br>- Measure: OCR confidence >80% (average across 10 test invoices)<br>- Measure: Polling latency <1 min (cron trigger to processing complete)<br>- Measure: Gmail API quota usage <10% (288 calls/day)<br>- Optimize if slower | 3h |
| T028 | Manual testing checklist | - CRITICAL: Email processing time <5 min<br>- CRITICAL: OCR confidence >80%<br>- CRITICAL: Whitelist blocking 100% spam emails<br>- Gmail polling works (every 5 min, Vercel Cron)<br>- PDF extraction works (base64 decode, first PDF only if multiple)<br>- Supplier whitelist validation works (email OR domain match)<br>- Invoice ingestion pipeline works (upload → OCR → find PO → validate price → create invoice → notify)<br>- OCR integration (F004) works<br>- Price validation (F007) works<br>- Notification integration (F005) works<br>- Duplicate detection works<br>- Pending review dashboard works<br>- Email marked as read after processing<br>- Audit trail logs all emails<br>- Error handling graceful<br>- All 15 checks pass | 4h |
| T029 | UAT with Contabilidad + Proveedor pilot | - Schedule UAT session with 2 users (Contabilidad + Proveedor pilot)<br>- Test: Proveedor sends 10 test invoices (different types: NTC, INVIAS, ISO)<br>- Test: Contabilidad receives notifications (10 emails)<br>- Test: Contabilidad reviews pending invoices dashboard<br>- Test: Contabilidad approves/rejects invoices<br>- Test: Admin configures supplier whitelist (add/edit/delete)<br>- Collect feedback (NPS survey)<br>- Measure: Processing time <5 min/invoice<br>- Sign-off from both users | 6h |

**Total Estimated Time:** 75 hours (~3 weeks)

---

## BLOCKED

| ID | Task | Blocker | Notes |
|----|------|---------|-------|
| T007 | Invoice ingestion pipeline | F004 (OCR) not fully implemented yet | Can mock F004.ocrInvoice() for testing |
| T007 | Invoice ingestion pipeline | F007 (Price Validation) not fully implemented yet | Can mock F007.detectPriceAnomaly() for testing |
| T007 | Invoice ingestion pipeline | F005 (Notifications) not fully implemented yet | Can mock F005.sendEmail() for testing |
| T007 | Invoice ingestion pipeline | F008 (Storage adapter) not fully implemented yet | Can mock storage.uploadFile() for testing |

---

## DONE

| ID | Task | Closed | Commit |
|----|------|--------|--------|
| - | Migration to SDD | 2025-12-24 | TBD |

---

**Dependencies:**
- T001-T002 independent (table migrations)
- T003 depends on F011 (Gmail API service account setup)
- T004 depends on T003 (PDF extraction requires Gmail polling)
- T005 depends on T001 (whitelist validation queries whitelist table)
- T006 depends on T002 (blocked email logging uses blocked_emails table)
- T007 depends on T004, T005, F004, F007, F005, F008 (invoice ingestion requires all components)
- T008 independent (duplicate detection)
- T009 depends on T003, T004, T005, T007, T008 (cron endpoint orchestrates all)
- T010 depends on T009 (Vercel cron requires endpoint)
- T011 depends on T007 (dashboard displays invoices created by pipeline)
- T012 depends on T001 (whitelist config UI modifies whitelist table)
- T013-T016 depend on T003-T007 (unit tests require modules implemented)
- T017-T021 depend on T003-T009 (integration tests require full pipeline)
- T022-T026 depend on T009-T012 (E2E tests require full UI)
- T027-T029 depend on T022-T026 (performance + UAT require E2E tests pass)

**CRITICAL PRIORITY:**
- T007 (invoice ingestion pipeline) is CRITICAL - Email processing <5 min required
- T003 (Gmail polling) is CRITICAL - Must run every 5 min reliably
- T005 (whitelist validation) is CRITICAL - Must block 100% spam emails
- T009-T010 (polling cron) is CRITICAL - Must be 100% reliable (no missed polls)

---

**Last updated:** 2025-12-24 11:50 | Maintained by: Claude Code
