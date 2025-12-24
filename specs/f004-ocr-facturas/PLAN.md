# SDD Implementation Plan: OCR Facturas

Version: 1.0 | Date: 2025-12-24 08:05 | Owner: Javier Polo | Status: Active

---

## Reference

**SPEC:** /specs/f004-ocr-facturas/SPEC.md
**ADR:** /specs/f004-ocr-facturas/ADR.md (Google Vision vs AWS Textract vs Tesseract)
**PRD:** docs/features/r04-ocr-facturas.md
**CRITICAL:** 80% time reduction (15 min → 3 min), >95% accuracy, <$10/month cost

---

## Stack Validated

**OCR Engine:** Google Cloud Vision API (primary)
- Source: /Users/mercadeo/neero/docs-global/stack/common-stack.md:70-75
- Decision: See ADR.md (Google Vision over Tesseract)
- Use case: Document text detection, Spanish support, form parser

**OCR Fallback:** AWS Textract
- Source: Dual-provider resilience pattern (ADR.md)
- Use case: Fallback if Google Vision timeout/error
- Cost: $1.50/1000 images (same as Vision)

**Image Pre-processing:** OpenCV (Python)
- Source: /Users/mercadeo/neero/docs-global/stack/common-stack.md:80-85 (Python scientific libraries)
- Use case: Rotation correction, contrast enhancement, denoising
- Module: api/services/ocr_preprocessing.py

**Image Storage:** Vercel Blob
- Source: /Users/mercadeo/neero/docs-global/stack/common-stack.md:55-60
- Use case: 7-year retention (DIAN compliance), signed URLs
- Alternative: Google Cloud Storage (if client prefers GCP)

**File Upload:** react-dropzone
- Source: /Users/mercadeo/neero/docs-global/stack/nextjs-react-patterns.md:45-50
- Integration: Next.js App Router /api/ocr/invoice route
- Use case: Drag-and-drop + mobile camera

**Backend API:** Python 3.11+ FastAPI
- Source: contecsa/CLAUDE.md:34-35 ("herramienta más poderosa para análisis datos")
- Module: api/services/ocr.py (OCR orchestration + validation)

**Database:** PostgreSQL 15
- Source: /Users/mercadeo/neero/docs-global/stack/database-guide.md:15-25
- Tables: invoice_images (metadata), purchase_orders (validation)

**Validation Checklist:**
- [x] Stack matches docs-global/stack/ (6 citations)
- [x] NO INVENTAR protocol applied
- [x] ClaudeCode&OnlyMe filter passed (see ADR.md)
- [x] Dependencies: F003 (PO table), F005 (alerts)
- [x] Limitations: Single page (MVP), no handwritten invoices

---

## Implementation Steps (15 steps)

### S001: Enable Google Vision API + AWS Textract credentials
**Deliverable:** Service account credentials configured, environment variables set
**Dependencies:** Google Cloud project, AWS account
**Acceptance:** GOOGLE_VISION_SERVICE_ACCOUNT_JSON and AWS_TEXTRACT_ACCESS_KEY env vars exist, API calls successful

### S002: Create invoice_images table migration
**Deliverable:** SQL migration with invoice_images table (12 fields: id, consorcio_id, purchase_order_id, image_url, original_filename, file_size_bytes, uploaded_by, uploaded_at, ocr_provider, ocr_confidence_avg, processing_time_ms, deleted_at)
**Dependencies:** PostgreSQL connection
**Acceptance:** Table created, index on purchase_order_id + uploaded_at, foreign key to purchase_orders

### S003: Create /api/ocr/invoice route (Next.js)
**Deliverable:** app/api/ocr/invoice/route.ts with POST endpoint
**Dependencies:** S002 (invoice_images table)
**Acceptance:** Upload file → Store to Vercel Blob → Call Python OCR service → Return extracted data

### S004: Implement Python OCR service scaffold
**Deliverable:** api/services/ocr.py with InvoiceOCR class (methods: process_invoice, _preprocess_image, _call_vision_api, _parse_invoice_data, _validate_vs_po)
**Dependencies:** None
**Acceptance:** Scaffold methods defined, typing complete, docstrings written

### S005: Implement image pre-processing (OpenCV)
**Deliverable:** api/services/ocr_preprocessing.py with functions: rotate_correct(image), enhance_contrast(image), denoise(image), grayscale_convert(image)
**Dependencies:** OpenCV installed (pip install opencv-python)
**Acceptance:** Pre-processing improves OCR accuracy (measure on test dataset)

### S006: Implement Google Vision API integration
**Deliverable:** api/services/ocr.py._call_vision_api() with Document Text Detection
**Dependencies:** S001 (credentials), google-cloud-vision installed
**Acceptance:** API call successful, returns AnnotateImageResponse with blocks/paragraphs/words

### S007: Implement AWS Textract fallback
**Deliverable:** api/services/ocr.py._call_textract_api() as fallback when Vision timeout
**Dependencies:** S001 (AWS credentials), boto3 installed
**Acceptance:** Fallback triggered on Vision timeout, extracts same fields

### S008: Implement field extraction parsers
**Deliverable:** api/services/ocr.py._parse_invoice_data() with regex patterns for 15 fields (invoice_number, date, nit, supplier_name, subtotal, tax, total, items)
**Dependencies:** S006 (Vision API integration)
**Acceptance:** Extracts invoice_number >85%, date >90%, NIT >90%, total >90% accuracy on test dataset

### S009: Implement confidence score calculation
**Deliverable:** api/services/ocr.py._calculate_confidence() returns per-field confidence 0-100
**Dependencies:** S006 (Vision API block confidence scores)
**Acceptance:** Confidence scores correlate with extraction accuracy (fields <80% → manual review)

### S010: Implement PO validation service
**Deliverable:** api/services/ocr.py._validate_vs_po() compares extracted data vs purchase_orders table
**Dependencies:** S002 (purchase_orders table from F003)
**Acceptance:** Detects amount variance >5%, NIT mismatch, date out of range → Returns validation_results object

### S011: Implement storage integration (Vercel Blob)
**Deliverable:** app/api/ocr/invoice/route.ts uploads to Vercel Blob with 7-year retention
**Dependencies:** Vercel Blob SDK (@vercel/blob)
**Acceptance:** Image stored, signed URL generated, 7-year expiry set, immutable storage (no delete)

### S012: Create frontend upload component
**Deliverable:** components/invoices/InvoiceOCRForm.tsx with react-dropzone, image preview, extracted data form
**Dependencies:** S003 (API route)
**Acceptance:** Drag-and-drop upload, mobile camera integration, loading state, error handling

### S013: Create side-by-side preview UI
**Deliverable:** components/invoices/InvoicePreview.tsx shows original image + editable form side-by-side
**Dependencies:** S012 (upload component)
**Acceptance:** Responsive layout (2 columns desktop, stacked mobile), highlight low confidence fields yellow, validation errors red

### S014: Integration with F003 (Purchase Tracking)
**Deliverable:** Hook in F003 invoice validation gate: OCR → Validate → Update purchase status to FACTURADA
**Dependencies:** F003 implemented
**Acceptance:** Invoice validation updates purchase.status, triggers state transition (F003 XState machine)

### S015: Integration with F005 (Notificaciones)
**Deliverable:** Call F005 Gmail API to send alert when invoice blocked (validation error)
**Dependencies:** F005 implemented
**Acceptance:** Email sent to Compras when amount variance >5% or NIT mismatch

---

## Milestones

**M1 - OCR Core:** [S001-S009] | Target: Week 1 (Vision API + parsing + confidence)
**M2 - Validation + Storage:** [S010-S011] | Target: Week 2 (PO validation + Vercel Blob)
**M3 - UI + Integration:** [S012-S015] | Target: Week 3 (Frontend + F003/F005 integration)

---

## Risk Mitigation

| Risk | Mitigation | Owner |
|------|-----------|-------|
| **OCR accuracy <95% (poor image quality)** | Pre-processing (OpenCV), confidence scores, fallback to AWS Textract, manual review option | Claude Code |
| **Google Vision API cost >$10/month** | Monitor usage, first 1,000 images free, 66 invoices/month = $0 cost (under free tier) | Javier Polo |
| **OCR API timeout/failure** | Retry 1x, dual-provider (AWS Textract fallback), graceful degradation (manual entry option) | Claude Code |
| **Validation false positives (>5% error rate)** | Adjustable tolerance (±5% vs PO), fuzzy NIT matching, manual override workflow | Javier Polo |
| Handwritten invoices (accuracy <50%) | Warning message "Factura manuscrita no soportada", suggest manual entry | Claude Code |
| Multi-page invoices (MVP limitation) | Warning "Solo primera página procesada", Phase 2 enhancement | Javier Polo |
| **Image storage compliance (DIAN 7 years)** | Vercel Blob retention policy, immutable storage (Object Lock), audit trail | Javier Polo |
| Duplicate invoice numbers | Uniqueness validation before save, error message "Factura ya existe" | Claude Code |

---

## Notes

**Critical Constraints:**
- Google Vision API free tier: 1,000 images/month (Contecsa ~66/month = $0 cost)
- F003 (Purchase Tracking) must be implemented for PO validation
- F005 (Notificaciones) must be implemented for invoice blocked alerts
- DIAN compliance: 7-year retention, immutable storage, audit trail

**Assumptions:**
- Invoice images average 2 MB (132 MB/month storage)
- Good quality images (300+ DPI) → 95%+ accuracy
- Poor quality images (scanned, handwritten) → 80%+ accuracy with manual review
- Single page invoices (MVP limitation)
- Spanish text only (Vision API supports multilingual)

**Blockers:**
- Google Cloud Vision API credentials (S001 - external dependency)
- AWS Textract credentials (S001 - external dependency)
- F003 purchase_orders table (S010 - internal dependency)
- F005 Gmail API service (S015 - internal dependency)

---

**Last updated:** 2025-12-24 08:05 | Maintained by: Javier Polo + Claude Code
