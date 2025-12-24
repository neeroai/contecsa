# Test Plan: OCR Facturas

Version: 1.0 | Date: 2025-12-24 08:15 | Owner: Claude Code | Status: Active

---

## Reference

**SDD Version:** 1.0 | **Feature:** OCR Facturas (F004) | **Scope:** Unit + Integration + E2E | **Coverage Target:** 80% (OCR extraction accuracy >95%, validation logic)

---

## Test Strategy

**Philosophy:** 80% coverage on OCR extraction functions (regex patterns, confidence scores, validation logic). **CRITICAL:** OCR accuracy >95% on good quality images, >80% on poor quality. Validation detects 100% of critical errors (amount >5%, NIT mismatch). Unit tests verify field extraction correctness. Integration tests verify full pipeline (upload → OCR → validation → save). E2E tests verify all 4 user stories. UAT with 10 real invoices from Contabilidad.

**Critical Paths:**
1. Upload invoice → Pre-process → OCR extract → Validate vs PO → Save with metadata
2. Low confidence fields (<80%) → Highlighted yellow → Manual review → Corrected → Save
3. Validation error (amount >5%) → Block invoice → Alert Compras (F005) → Manual override
4. OCR API timeout → Retry → Fallback to AWS Textract → Extract successfully

---

## Unit Tests

| Module | Test Cases | Tool | Status |
|--------|-----------|------|--------|
| Field extraction (ocr.py) | - Extract invoice_number: "Factura No. 12345", "Invoice #ABC-001"<br>- Extract date: "2025-12-22", "22/12/2025", "Dec 22, 2025"<br>- Extract NIT: "123456789-0", "NIT: 123456789-0"<br>- Extract total_amount: "Total: $1,234,567", "TOTAL COP 1.234.567"<br>- Handles missing fields (return empty string/0.0) | Pytest + fixtures (50 test invoices) | TODO |
| Regex patterns (ocr.py) | - Invoice number pattern matches 95%+ of variations<br>- Date pattern handles DD/MM/YYYY, YYYY-MM-DD, "Dec 22, 2025"<br>- NIT pattern validates Colombian format (9 digits + check digit)<br>- Amount pattern handles COP formatting (dots, commas, $ symbol) | Pytest + parameterized tests | TODO |
| Confidence score (ocr.py) | - Calculate average confidence from Vision API blocks<br>- Per-field confidence (invoice_number, date, nit, total)<br>- Overall confidence score (0-100)<br>- Edge case: All blocks low confidence (<50%) → Overall <50% | Pytest + mocked Vision API response | TODO |
| Pre-processing (ocr_preprocessing.py) | - Rotation correction (deskew image)<br>- Contrast enhancement (CLAHE)<br>- Grayscale conversion<br>- Denoising (fastNlMeans)<br>- Pre-processing improves OCR accuracy (measure before/after) | Pytest + OpenCV + test images | TODO |
| Validation vs PO (ocr.py) | - Amount tolerance ±5%: 1000 vs 1049 = OK, 1000 vs 1051 = ERROR<br>- NIT match: "123456789-0" vs "123456789-0" = OK, vs "987654321-0" = ERROR<br>- Date range: invoice_date ≥ PO date AND ≤ today = OK<br>- No PO found → WARNING (not ERROR) | Pytest + PostgreSQL test DB | TODO |

---

## Integration Tests

| Component | Test Cases | Tool | Status |
|-----------|-----------|------|--------|
| Full OCR pipeline (api/services/ocr.py) | - Upload image → Pre-process → Call Vision API → Parse fields → Validate → Return extracted_data + confidence_scores + validation_results<br>- Good quality image (300+ DPI) → Accuracy >95%<br>- Poor quality image (<300 DPI, blurry) → Accuracy >80%<br>- Processing time <5s (from API call to response) | Pytest + real Vision API (test mode) | TODO |
| AWS Textract fallback (ocr.py) | - Vision API timeout (mock 10s delay) → Retry 1x → Fallback to Textract<br>- Textract extracts same fields successfully<br>- Log "fallback_triggered" metric incremented | Pytest + mocked APIs | TODO |
| Storage integration (route.ts + Vercel Blob) | - Upload file → Store to Vercel Blob → Return signed URL<br>- 7-year retention policy applied<br>- Immutable storage (no delete allowed)<br>- File size validation (<10 MB) before upload | Vitest + Vercel Blob test account | TODO |
| Error handling | - Invalid image format (HEIC) → Error "Formato no soportado"<br>- Image too large (>10 MB) → Error "Imagen muy grande"<br>- No text detected (blank image) → Error "No se detectó texto"<br>- OCR API timeout (both Vision + Textract) → Error "Manual entry required" | Pytest + error scenarios | TODO |
| Integration with F003 (Purchase Tracking) | - OCR successful + validation OK → Update purchase.status to FACTURADA<br>- Validation ERROR → purchase.invoice_blocked = TRUE<br>- State transition triggers (F003 XState machine) | Vitest + PostgreSQL test DB | TODO |
| Integration with F005 (Notificaciones) | - Validation error (amount >5%) → Call F005 Gmail API → Email sent to Compras<br>- Email includes: invoice details, PO comparison, deviation %<br>- Email delivery <1 minute | Pytest + Gmail API mock | TODO |

---

## E2E Tests (Playwright)

**Setup:** `bun test:e2e` | **Environment:** Staging with test invoices

**Happy Paths:**

1. **US4.1 - Upload invoice and system extracts data:**
   - Navigate to /invoices/new
   - Upload invoice image (test_invoice_001.jpg - good quality, 300 DPI)
   - Assert: OCR processing completes <5s
   - Assert: Form pre-filled with extracted data:
     - invoice_number = "FAC-12345"
     - date = "2025-12-22"
     - nit = "123456789-0"
     - supplier_name = "ACME Construcciones"
     - total_amount = 1234567.00
   - Assert: Confidence scores displayed per field
   - Assert: All fields >80% confidence (no yellow highlights)

2. **US4.2 - Correct OCR data if errors:**
   - Upload invoice image (test_invoice_002.jpg - poor quality, blurry)
   - Assert: Some fields <80% confidence → Highlighted yellow
   - Edit field: invoice_number "FAC-123?" → "FAC-12345" (manual correction)
   - Edit field: total_amount "1,234.567" → "1234567.00" (format fix)
   - Click "Guardar Factura"
   - Assert: Invoice saved with corrected data
   - Assert: Audit log records manual corrections

3. **US4.3 - Validate invoice automatically vs PO:**
   - Create PO with: supplier NIT = "123456789-0", total_amount = 1000000.00
   - Upload invoice with: same NIT, total_amount = 1049000.00 (+4.9%)
   - Assert: Validation status = OK (within ±5% tolerance)
   - Assert: Invoice saved successfully
   - Upload invoice with: total_amount = 1060000.00 (+6%)
   - Assert: Validation status = ERROR ("Monto difiere 6% del PO")
   - Assert: Invoice blocked (cannot save)
   - Assert: Alert sent to Compras (F005 email)

4. **US4.4 - Query archived invoices:**
   - Navigate to /invoices/archive
   - Search by NIT: "123456789-0"
   - Assert: Returns 3 invoices from that supplier
   - Search by date range: 2025-01-01 to 2025-12-31
   - Assert: Returns 55 invoices (annual total)
   - Click invoice row
   - Assert: Modal shows original image + extracted data
   - Click "Exportar PDF"
   - Assert: PDF downloaded with invoice details

**Edge Case Tests:**

5. **No text detected (blank image):**
   - Upload blank image (test_blank.jpg)
   - Assert: Error message "No se detectó texto. Verifica imagen clara."
   - Assert: Suggests retake photo with better lighting

6. **Invalid image format:**
   - Upload HEIC file (test_invoice.heic)
   - Assert: Client-side validation blocks upload
   - Assert: Error "Formato no soportado. Usa JPG, PNG o PDF."

7. **Image too large (>10 MB):**
   - Upload 15 MB image (test_large.jpg)
   - Assert: Client-side validation blocks upload
   - Assert: Error "Imagen muy grande. Comprime a <10 MB."
   - Assert: Shows compression tool suggestion

8. **OCR API timeout:**
   - Mock Vision API delay 15s (timeout threshold 10s)
   - Upload invoice
   - Assert: Retry 1x after 10s
   - Assert: Fallback to AWS Textract triggered
   - Assert: Textract extracts data successfully
   - Assert: Log "fallback_triggered" incremented

9. **Low confidence all fields (<50%):**
   - Upload extremely poor quality image (test_poor_quality.jpg)
   - Assert: Warning "Calidad imagen baja. OCR puede no ser confiable."
   - Assert: Option to enter data manually instead of OCR
   - Click "Ingreso Manual"
   - Assert: Redirects to manual entry form

10. **No matching PO found:**
    - Upload invoice with NIT = "999999999-9" (no PO exists)
    - Assert: Warning "No se encontró orden de compra. Crea PO primero."
    - Assert: Link to create PO (F003 integration)
    - Click link
    - Assert: Navigates to /purchases/new with supplier NIT pre-filled

**Performance Tests:**
- Upload 10 invoices concurrently → All complete <5s each
- OCR processing time <5s (from API call to response)
- Storage upload time <3s (5 MB image to Vercel Blob)
- Validation time <1s (compare vs PO)
- Page load time <2s (invoice archive with 100 rows)

---

## Quality Gates CI

| Gate | Command | Target | Status |
|------|---------|--------|--------|
| Format | `bun run format --check` (Python: `black api/`) | 100% | TODO |
| Lint | `bun run lint` (Python: `ruff check api/`) | 0 errors | TODO |
| Types | `bun run typecheck` (Python: `mypy api/`) | 0 errors | TODO |
| Unit | `pytest --cov=api/services/ocr --cov-report=term` | 80%+ on OCR extraction | TODO |
| Build | `bun run build` | Exit 0 | TODO |
| E2E | `bun test:e2e` (10 scenarios) | All 10 tests pass | TODO |

---

## Manual Testing Checklist

- [ ] **CRITICAL:** OCR accuracy >95% on 10 test invoices (good quality 300+ DPI)
- [ ] **CRITICAL:** OCR accuracy >80% on 10 test invoices (poor quality, blurry, mobile photos)
- [ ] **CRITICAL:** Validation detects 100% of critical errors (amount >5%, NIT mismatch)
- [ ] Upload invoice from desktop (drag-and-drop UX smooth)
- [ ] Upload invoice from mobile (camera integration works)
- [ ] Pre-processing improves accuracy (compare before/after OpenCV)
- [ ] Confidence scores accurate (fields <80% → manual review required)
- [ ] Low confidence fields highlighted yellow (visual indicator)
- [ ] Validation errors displayed (red alert with details)
- [ ] Side-by-side preview (image + form) responsive (desktop 2 columns, mobile stacked)
- [ ] AWS Textract fallback works (Vision API timeout simulation)
- [ ] Storage retention 7 years (Vercel Blob policy configured)
- [ ] Integration tested: F003 (PO validation) + F005 (alerts)
- [ ] Cost validated <$10/month (under Google Vision free tier, 66 invoices/month)
- [ ] UAT with Contabilidad (10 real invoices, accuracy verified, NPS >70)
- [ ] Error handling graceful (timeout, invalid format, no text, no PO)
- [ ] Processing time <5s (from upload to extracted data displayed)

---

**Token-efficient format:** 80 lines | 10 E2E scenarios | 80%+ coverage target | CRITICAL: >95% accuracy + 100% validation detection
