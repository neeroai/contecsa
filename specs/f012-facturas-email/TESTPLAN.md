# Test Plan: Ingreso de Facturas por Email

Version: 1.0 | Date: 2025-12-24 11:45 | Owner: Claude Code | Status: Active

---

## Reference

**SDD Version:** 1.0 | **Feature:** Ingreso de Facturas por Email (F012) | **Scope:** Unit + Integration + E2E | **Coverage Target:** 80% (Gmail polling, PDF extraction, OCR integration, whitelist validation)

---

## Test Strategy

**Philosophy:** 80% coverage on Gmail polling service, PDF extraction, whitelist validation, invoice ingestion pipeline. **CRITICAL:** Email processing <5 min (from email received to Contabilidad notification), OCR confidence >80%, whitelist blocking 100% spam emails. Unit tests verify Gmail API query (unread + PDF attachment filter), PDF base64 decode, whitelist validation (email OR domain), invoice creation (status = PENDING_REVIEW). Integration tests verify full pipeline (poll Gmail → extract PDF → upload storage → trigger OCR → find PO → validate price → create invoice → notify Contabilidad). E2E tests verify all 4 user stories (supplier sends invoice, Contabilidad receives notification, review dashboard, whitelist configuration). Performance tests verify processing time <5 min, OCR confidence >80%.

**Critical Paths:**
1. Poll Gmail (every 5 min) → Query (is:unread has:attachment filename:pdf after:5m) → Extract sender, email_id, attachments → Return emails
2. Extract PDF → Get attachment (Gmail API) → Base64 decode → Return PDF buffer
3. Whitelist validation → Query supplier_whitelist (email OR domain match) → Return boolean
4. Invoice ingestion → Upload PDF → Trigger OCR → Find PO (by NIT + date) → Validate price (F007) → Create invoice → Notify Contabilidad
5. Polling cron → Call pollInvoiceInbox() → For each email: validate whitelist → extract PDF → process invoice → mark as read → Return summary

---

## Unit Tests

| Module | Test Cases | Tool | Status |
|--------|-----------|------|-----------|
| Gmail polling (poll-inbox.ts) | - pollInvoiceInbox() → Queries Gmail API with filter (is:unread has:attachment filename:pdf after:5m)<br>- pollInvoiceInbox() → Returns list of emails (sender, subject, email_id, attachments)<br>- pollInvoiceInbox() with >50 emails → Batches to 50 per poll<br>- pollInvoiceInbox() with network error → Retries 3x | Vitest + mocked Gmail API | TODO |
| PDF extraction (extract-pdf.ts) | - extractPdfAttachment() → Calls Gmail API attachments.get()<br>- extractPdfAttachment() → Base64 decodes attachment data<br>- extractPdfAttachment() with multiple PDFs → Returns first PDF only + logs warning<br>- extractPdfAttachment() with no PDF → Returns null | Vitest + mocked Gmail API | TODO |
| Whitelist validation (whitelist.ts) | - isAuthorizedSupplier() → Queries supplier_whitelist (email match)<br>- isAuthorizedSupplier() → Queries supplier_whitelist (domain match, e.g., @proveedor.com)<br>- isAuthorizedSupplier() with inactive supplier (is_active = FALSE) → Returns false<br>- isAuthorizedSupplier() with unknown email → Returns false | Vitest + PostgreSQL test DB | TODO |
| Invoice ingestion (process-invoice.ts) | - processInvoiceEmail() → Uploads PDF to storage<br>- processInvoiceEmail() → Triggers OCR (mocked F004)<br>- processInvoiceEmail() → Finds matching PO (by NIT + date range)<br>- processInvoiceEmail() → Validates price (mocked F007 if PO found)<br>- processInvoiceEmail() → Creates invoice record (status = PENDING_REVIEW)<br>- processInvoiceEmail() → Notifies Contabilidad (mocked F005)<br>- processInvoiceEmail() with OCR confidence <80% → Flags for manual review<br>- processInvoiceEmail() with duplicate invoice_number → Skips + logs duplicate | Vitest + PostgreSQL test DB + mocked F004/F007/F005 | TODO |

---

## Integration Tests

| Component | Test Cases | Tool | Status |
|-----------|-----------|------|--------|
| Email polling pipeline | - Full flow: Poll Gmail → Extract emails → Filter unread + PDF attachments → Return list<br>- Batch processing: >50 emails → Process 50 per poll → Queue remaining for next poll<br>- Error handling: Gmail API error → Retry 3x → Alert admin if all fail | Vitest + mocked Gmail API | TODO |
| PDF extraction pipeline | - Full flow: Get email → Extract first PDF attachment → Base64 decode → Return buffer<br>- Multiple PDFs: Process first only → Log warning "Multiple PDFs, processed first only"<br>- No PDF: Skip email → Log warning → Mark as read | Vitest + mocked Gmail API | TODO |
| Whitelist validation pipeline | - Full flow: Extract sender → Query whitelist (email OR domain) → Return boolean<br>- Blocked email: Not in whitelist → Log in blocked_emails → Mark email as read<br>- Authorized supplier: In whitelist → Allow processing | Vitest + PostgreSQL test DB | TODO |
| Invoice ingestion pipeline | - Full flow: Upload PDF → Trigger OCR → Find PO → Validate price → Create invoice → Notify Contabilidad<br>- Processing time <5 min (from email received to notification)<br>- No matching PO: Create invoice with purchase_id = NULL → Flag for manual matching<br>- Price anomaly detected (F007): High priority notification to Contabilidad + Gerencia<br>- OCR fails (confidence <50%): Create invoice status = OCR_FAILED → High priority notification | Vitest + mocked F004/F007/F005 + PostgreSQL test DB | TODO |
| Polling cron pipeline | - Full flow: Cron triggers → Poll Gmail → For each email: validate whitelist → extract PDF → process invoice → mark as read → Return summary<br>- Cron runs every 5 min (verify in Vercel logs)<br>- Summary returned: { processed_count, blocked_count, error_count, last_poll_at } | Vitest + mocked Gmail API + PostgreSQL test DB | TODO |

---

## E2E Tests (Playwright)

**Setup:** `bun test:e2e` | **Environment:** Staging with test data

**Happy Paths:**

1. **US12.1 - Proveedor sends invoice to factura@contecsa.com:**
   - Send test email from authorized supplier (proveedor@example.com) with PDF attachment
   - Wait 5 min + 30 sec (cron trigger)
   - Assert: Email marked as read
   - Assert: PDF extracted and uploaded to storage
   - Assert: OCR triggered (invoice_number, NIT, amount, date extracted)
   - Assert: Invoice record created (status = PENDING_REVIEW)
   - Assert: Contabilidad notified (email received)
   - Assert: Processing time <5 min

2. **US12.2 - Contabilidad receives notification:**
   - Send test email (proveedor@example.com + PDF)
   - Wait 5 min + 30 sec
   - Assert: Notification email sent to contabilidad@contecsa.com
   - Assert: Email subject = "Nueva factura ingresada: [invoice_number]"
   - Assert: Email body includes: proveedor, invoice_number, monto, fecha, PO match result
   - Assert: Link to invoice detail works (navigate to /invoices/[id])

3. **US12.3 - Contabilidad reviews pending invoices:**
   - Seed DB: 10 invoices (status = PENDING_REVIEW)
   - Navigate to /invoices/pending (as Contabilidad)
   - Assert: Dashboard shows all 10 invoices
   - Assert: Columns: invoice_number, supplier_email, amount, invoice_date, ocr_confidence, price_validation (badge: OK/ANOMALY)
   - Assert: Click invoice → Navigate to detail page (/invoices/[id])
   - Assert: Actions: Approve, Reject, Edit

4. **US12.4 - Compras configures supplier whitelist:**
   - Navigate to /suppliers/whitelist (as Compras or Admin)
   - Add new supplier: email = proveedor@example.com, is_active = TRUE
   - Assert: Supplier added to whitelist
   - Send test email from proveedor@example.com
   - Assert: Email processed (not blocked)
   - Add domain: email_domain = @example.com, is_active = TRUE
   - Send test email from otro@example.com
   - Assert: Email processed (domain match)

**Edge Case Tests:**

5. **Email from unauthorized sender (not in whitelist):**
   - Send test email from spam@unknown.com (not in whitelist) with PDF
   - Wait 5 min + 30 sec
   - Assert: Email blocked (not processed)
   - Assert: Logged in blocked_emails table (sender, subject, email_id, blocked_at, reason)
   - Assert: Email marked as read (to avoid reprocessing)
   - Assert: No invoice record created
   - Assert: No notification sent to Contabilidad

6. **Email with multiple PDF attachments:**
   - Send test email with 3 PDF attachments
   - Wait 5 min + 30 sec
   - Assert: First PDF processed only
   - Assert: Warning logged "Multiple PDFs, processed first PDF only"
   - Assert: Invoice created (first PDF data)

7. **Email without PDF attachment:**
   - Send test email with no attachments (text only)
   - Wait 5 min + 30 sec
   - Assert: Email skipped (not processed)
   - Assert: Warning logged "No PDF attachment found"
   - Assert: Email marked as read
   - Assert: No invoice record created

8. **OCR fails (confidence <50%):**
   - Send test email with low-quality PDF (blurry text)
   - Wait 5 min + 30 sec
   - Assert: Invoice created (status = OCR_FAILED)
   - Assert: High priority notification sent to Contabilidad
   - Assert: Notification includes "OCR falló, revisión manual requerida"

9. **Duplicate invoice (same invoice_number + supplier):**
   - Seed DB: Existing invoice (invoice_number = "INV-001", supplier_email = proveedor@example.com)
   - Send test email with same invoice_number
   - Wait 5 min + 30 sec
   - Assert: Email skipped (not processed)
   - Assert: Duplicate logged "Duplicate invoice detected"
   - Assert: No new invoice record created

10. **Price anomaly detected (Caso Cartagena prevention):**
    - Seed DB: Material with baseline price = $100 COP/kg
    - Send test email with invoice price = $130 COP/kg (30% deviation)
    - Wait 5 min + 30 sec
    - Assert: Invoice created (status = PENDING_REVIEW)
    - Assert: price_validation = { anomaly_detected: true, severity: "CRITICAL", deviation_percent: 30 }
    - Assert: High priority notification sent to Contabilidad + Gerencia
    - Assert: Notification includes "ALERTA: Desviación precio 30%"

**Performance Tests:**
- Email processing time <5 min (from email received to Contabilidad notification)
- OCR confidence >80% (average across 10 test invoices)
- Polling latency <1 min (cron trigger to email processing complete)
- Gmail API quota usage <10% (288 calls/day = 0.003% of 250 req/sec quota)

---

## Quality Gates CI

| Gate | Command | Target | Status |
|------|---------|--------|--------|
| Format | `bun run format --check` | 100% | TODO |
| Lint | `bun run lint` | 0 errors | TODO |
| Types | `bun run typecheck` | 0 errors | TODO |
| Unit | `bun run test` (lib/email-intake/*.test.ts) | 80%+ | TODO |
| Build | `bun run build` | Exit 0 | TODO |
| E2E | `bun test:e2e` (10 scenarios) | All 10 tests pass | TODO |

---

## Manual Testing Checklist

- [ ] **CRITICAL:** Email processing time <5 min (from email received to notification)
- [ ] **CRITICAL:** OCR confidence >80% (precision)
- [ ] **CRITICAL:** Whitelist blocking 100% spam emails
- [ ] Gmail polling works (every 5 min, Vercel Cron)
- [ ] PDF extraction works (base64 decode, first PDF only if multiple)
- [ ] Supplier whitelist validation works (email OR domain match)
- [ ] Invoice ingestion pipeline works (upload → OCR → find PO → validate price → create invoice → notify)
- [ ] OCR integration (F004) works (automatic extraction)
- [ ] Price validation (F007) works (anomaly detection if PO found)
- [ ] Notification integration (F005) works (Contabilidad email)
- [ ] Duplicate detection works (invoice_number + supplier_email)
- [ ] Pending review dashboard works (list invoices, badge price anomaly, approve/reject)
- [ ] Email marked as read after processing
- [ ] Audit trail logs all emails (processed + blocked + errors)
- [ ] Error handling graceful (retry, log, alert)
- [ ] UAT with Contabilidad + Proveedor pilot (10 test invoices, real workflow)

---

**Token-efficient format:** 60 lines | 10 E2E scenarios | 80%+ coverage target | CRITICAL: <5 min processing + >80% OCR + 100% whitelist blocking
