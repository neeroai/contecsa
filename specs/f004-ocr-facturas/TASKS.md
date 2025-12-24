# TASKS: OCR Facturas

Version: 1.0 | Date: 2025-12-24 08:20 | Owner: Claude Code | Status: Active

---

## DOING

| ID | Task | DoD | Est |
|----|------|-----|-----|
| - | No active tasks yet | - | - |

---

## TODO (Priority Order - From PLAN.md)

| ID | Task | DoD | Est |
|----|------|-----|-----|
| T001 | Enable Google Cloud Vision API | - Enable Vision API in GCP Console<br>- Create service account "ocr-service"<br>- Grant role "Cloud Vision API User"<br>- Download JSON credentials<br>- Set GOOGLE_VISION_SERVICE_ACCOUNT_JSON env var | 2h |
| T002 | Enable AWS Textract (fallback) | - Enable Textract in AWS Console<br>- Create IAM user "ocr-textract"<br>- Grant AmazonTextractFullAccess policy<br>- Generate access key<br>- Set AWS_TEXTRACT_ACCESS_KEY env vars | 1h |
| T003 | Create invoice_images table migration | - SQL migration file with 12 fields (id, consorcio_id, purchase_order_id, image_url, original_filename, file_size_bytes, uploaded_by, uploaded_at, ocr_provider, ocr_confidence_avg, processing_time_ms, deleted_at)<br>- Index on purchase_order_id + uploaded_at<br>- Foreign key to purchase_orders table | 2h |
| T004 | Create /api/ocr/invoice route (Next.js) | - app/api/ocr/invoice/route.ts with POST endpoint<br>- Accept FormData with file<br>- Validate file format (JPG/PNG/PDF), size (<10 MB)<br>- Upload to Vercel Blob<br>- Call Python OCR service<br>- Return extracted_data + confidence_scores + validation_results | 3h |
| T005 | Scaffold Python OCR service | - api/services/ocr.py with InvoiceOCR class<br>- Methods: process_invoice(), _preprocess_image(), _call_vision_api(), _call_textract_api(), _parse_invoice_data(), _validate_vs_po(), _calculate_confidence()<br>- Type hints (Dict, List, Optional)<br>- Docstrings for all methods | 2h |
| T006 | Implement image pre-processing (OpenCV) | - api/services/ocr_preprocessing.py<br>- Functions: rotate_correct(image), enhance_contrast(image), denoise(image), grayscale_convert(image)<br>- CLAHE for contrast enhancement<br>- fastNlMeansDenoising for noise reduction<br>- Returns pre-processed image bytes | 4h |
| T007 | Implement Google Vision API integration | - api/services/ocr.py._call_vision_api()<br>- Document Text Detection (not basic OCR)<br>- Handle API errors (timeout, quota, invalid credentials)<br>- Return AnnotateImageResponse with blocks/paragraphs/words | 3h |
| T008 | Implement AWS Textract fallback | - api/services/ocr.py._call_textract_api()<br>- Trigger on Vision timeout (>10s)<br>- Use AnalyzeDocument API<br>- Parse Textract response to same format as Vision<br>- Log "fallback_triggered" metric | 3h |
| T009 | Implement field extraction parsers | - api/services/ocr.py._parse_invoice_data()<br>- Regex patterns for 15 fields (invoice_number, date, nit, supplier_name, subtotal, tax, total, items)<br>- Heuristics for field location (top = supplier, bottom = total)<br>- Handle multiple date formats (DD/MM/YYYY, YYYY-MM-DD, "Dec 22, 2025")<br>- Extract NIT (9 digits + check digit) | 6h |
| T010 | Implement confidence score calculation | - api/services/ocr.py._calculate_confidence()<br>- Average Vision API block confidence scores<br>- Per-field confidence (invoice_number, date, nit, total_amount)<br>- Overall confidence (0-100)<br>- Return confidence_scores object | 2h |
| T011 | Implement PO validation service | - api/services/ocr.py._validate_vs_po()<br>- Query purchase_orders table by supplier NIT + date range<br>- Compare extracted total_amount vs PO (±5% tolerance)<br>- Validate NIT match<br>- Validate date range (invoice_date ≥ PO date AND ≤ today)<br>- Return validation_results {status, warnings[], errors[]} | 4h |
| T012 | Implement Vercel Blob storage integration | - app/api/ocr/invoice/route.ts<br>- Upload to Vercel Blob with put()<br>- Generate signed URL (7-year expiry)<br>- Store metadata in invoice_images table<br>- Immutable storage (no delete allowed) | 2h |
| T013 | Create frontend upload component | - components/invoices/InvoiceOCRForm.tsx<br>- react-dropzone for drag-and-drop<br>- Mobile camera integration (accept="image/*")<br>- Loading state during OCR processing<br>- Error handling (invalid format, too large, no text)<br>- Pre-fill form with extracted_data | 4h |
| T014 | Create side-by-side preview UI | - components/invoices/InvoicePreview.tsx<br>- 2-column layout (image left, form right) - desktop<br>- Stacked layout (image top, form bottom) - mobile<br>- Highlight low confidence fields (<80%) yellow<br>- Display validation errors red<br>- Editable form fields (manual correction) | 4h |
| T015 | Integration with F003 (Purchase Tracking) | - Hook OCR completion → Update purchase.status to FACTURADA<br>- Validation ERROR → Set purchase.invoice_blocked = TRUE<br>- Trigger F003 XState state transition<br>- Update purchase.invoice_number, invoice_date, invoice_amount | 2h |
| T016 | Integration with F005 (Notificaciones) | - Validation error (amount >5%, NIT mismatch) → Call F005 Gmail API<br>- Send alert to Compras: "Factura bloqueada: {reason}"<br>- Email includes: invoice details, PO comparison, deviation %<br>- Email delivery <1 minute | 2h |
| T017 | Write unit tests for field extraction | - Test: Extract invoice_number from "Factura No. 12345", "Invoice #ABC-001"<br>- Test: Extract date from "2025-12-22", "22/12/2025", "Dec 22, 2025"<br>- Test: Extract NIT from "123456789-0", "NIT: 123456789-0"<br>- Test: Extract total_amount from "Total: $1,234,567", "TOTAL COP 1.234.567"<br>- Coverage >80% | 3h |
| T018 | Write unit tests for regex patterns | - Test: Invoice number pattern matches 95%+ variations<br>- Test: Date pattern handles DD/MM/YYYY, YYYY-MM-DD, "Dec 22, 2025"<br>- Test: NIT pattern validates Colombian format (9 digits + check)<br>- Test: Amount pattern handles COP formatting (dots, commas, $)<br>- Coverage >80% | 2h |
| T019 | Write unit tests for confidence score | - Test: Calculate average confidence from Vision API blocks<br>- Test: Per-field confidence (invoice_number, date, nit, total)<br>- Test: Edge case: All blocks low confidence (<50%) → Overall <50%<br>- Coverage >80% | 2h |
| T020 | Write unit tests for pre-processing | - Test: Rotation correction (deskew image)<br>- Test: Contrast enhancement (CLAHE)<br>- Test: Grayscale conversion<br>- Test: Denoising (fastNlMeans)<br>- Test: Pre-processing improves OCR accuracy (before/after)<br>- Coverage >80% | 3h |
| T021 | Write unit tests for PO validation | - Test: Amount tolerance ±5%: 1000 vs 1049 = OK, 1000 vs 1051 = ERROR<br>- Test: NIT match: same = OK, different = ERROR<br>- Test: Date range: invoice_date ≥ PO date AND ≤ today = OK<br>- Test: No PO found → WARNING (not ERROR)<br>- Coverage >80% | 2h |
| T022 | Write integration test for full OCR pipeline | - Test: Upload image → Pre-process → Vision API → Parse → Validate → Return<br>- Test: Good quality (300+ DPI) → Accuracy >95%<br>- Test: Poor quality (<300 DPI) → Accuracy >80%<br>- Test: Processing time <5s<br>- Coverage >80% | 4h |
| T023 | Write integration test for AWS Textract fallback | - Test: Vision API timeout (mock 10s delay) → Retry 1x → Fallback to Textract<br>- Test: Textract extracts same fields successfully<br>- Test: Log "fallback_triggered" incremented<br>- Coverage >80% | 2h |
| T024 | Write integration test for storage | - Test: Upload file → Store to Vercel Blob → Return signed URL<br>- Test: 7-year retention policy applied<br>- Test: Immutable storage (no delete)<br>- Test: File size validation (<10 MB)<br>- Coverage >80% | 2h |
| T025 | Write integration test for error handling | - Test: Invalid format (HEIC) → Error "Formato no soportado"<br>- Test: Too large (>10 MB) → Error "Imagen muy grande"<br>- Test: No text → Error "No se detectó texto"<br>- Test: Both APIs timeout → Error "Manual entry required"<br>- Coverage >80% | 3h |
| T026 | Write integration tests for F003/F005 | - Test: OCR success + validation OK → Update purchase.status to FACTURADA<br>- Test: Validation ERROR → purchase.invoice_blocked = TRUE<br>- Test: Validation error → F005 email sent to Compras<br>- Coverage >80% | 3h |
| T027 | Write E2E test: US4.1 (Upload and extract) | - Navigate to /invoices/new<br>- Upload test_invoice_001.jpg (good quality)<br>- Assert: Form pre-filled with extracted data<br>- Assert: All fields >80% confidence (no yellow)<br>- Assert: Processing <5s | 2h |
| T028 | Write E2E test: US4.2 (Correct OCR errors) | - Upload test_invoice_002.jpg (poor quality, blurry)<br>- Assert: Some fields <80% → Highlighted yellow<br>- Edit fields manually<br>- Click "Guardar"<br>- Assert: Invoice saved with corrected data | 2h |
| T029 | Write E2E test: US4.3 (Validate vs PO) | - Create PO with total_amount = 1000000.00<br>- Upload invoice with total_amount = 1049000.00 (+4.9%)<br>- Assert: Validation OK (within ±5%)<br>- Upload invoice with total_amount = 1060000.00 (+6%)<br>- Assert: Validation ERROR, invoice blocked, alert sent | 2h |
| T030 | Write E2E test: US4.4 (Query archived invoices) | - Navigate to /invoices/archive<br>- Search by NIT, date range<br>- Click invoice row → Modal shows image + data<br>- Click "Exportar PDF" → PDF downloaded | 2h |
| T031 | Write E2E tests for edge cases | - Blank image → Error "No se detectó texto"<br>- Invalid format → Error "Formato no soportado"<br>- Too large → Error "Imagen muy grande"<br>- OCR timeout → Fallback triggered<br>- Low confidence (<50%) → Manual entry option<br>- No PO found → Warning + link to create PO | 3h |
| T032 | Performance test OCR pipeline | - Upload 10 invoices concurrently<br>- Measure: Processing time <5s each<br>- Measure: Storage upload <3s (5 MB image)<br>- Measure: Validation <1s<br>- Measure: Page load <2s (archive with 100 rows) | 2h |
| T033 | UAT with Contabilidad | - Schedule UAT session with Contabilidad<br>- Test with 10 real invoices (5 good quality, 5 poor quality)<br>- Measure OCR accuracy (manual verification)<br>- Collect feedback (NPS survey)<br>- Validate processing time <3 min (15 min → 3 min target)<br>- Sign-off from Contabilidad | 4h |
| T034 | Cost validation | - Monitor Google Vision API usage (billing console)<br>- Verify: 66 invoices/month = $0 cost (under free tier 1,000/month)<br>- Set alert: 800 images/month → notify admin<br>- Storage cost: 132 MB/month × 84 months = 11 GB → $0.50/month<br>- Total cost <$10/month ✓ | 1h |
| T035 | Document OCR limitations and future enhancements | - MVP limitations: Single page invoices, no handwritten, no batch processing<br>- Phase 2 enhancements: Multi-page, PDF text extraction, email intake (F012), AI correction suggestions<br>- Update SPEC.md Scope (Out) section<br>- Update README with known limitations | 1h |

**Total Estimated Time:** 88 hours (~3-4 weeks)

---

## BLOCKED

| ID | Task | Blocker | Notes |
|----|------|---------|-------|
| T001 | Enable Google Cloud Vision API | GCP credentials not yet created | Need GCP admin access |
| T002 | Enable AWS Textract | AWS credentials not yet created | Need AWS admin access |
| T015 | Integration with F003 (Purchase Tracking) | F003 not implemented yet | Can mock PO table for testing |
| T016 | Integration with F005 (Notificaciones) | F005 Gmail API not set up yet | Can use console log fallback |

---

## DONE

| ID | Task | Closed | Commit |
|----|------|--------|--------|
| - | Migration to SDD | 2025-12-24 | TBD |

---

**Dependencies:**
- T001-T002 independent (can run in parallel) - BLOCKED (external)
- T003 depends on PostgreSQL connection
- T004 depends on T003 (invoice_images table)
- T005-T011 depend on T001-T002 (API credentials)
- T012 depends on T004 (API route)
- T013-T014 depend on T004 (API route)
- T015 depends on F003 (purchase_orders table) - BLOCKED
- T016 depends on F005 (Gmail API service) - BLOCKED
- T017-T021 depend on T005-T011 (modules to test)
- T022-T026 depend on T004-T016 (full feature)
- T027-T031 depend on T013-T014 (frontend UI)
- T032-T035 depend on T027-T031 (E2E tests pass first)

**CRITICAL PRIORITY:**
- T033 (UAT with Contabilidad) is CRITICAL success metric - Must achieve >95% accuracy + NPS >70
- T027-T031 (E2E tests) must pass 100% for production readiness

---

**Last updated:** 2025-12-24 08:20 | Maintained by: Claude Code
