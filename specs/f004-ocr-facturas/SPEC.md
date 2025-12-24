# SPEC: OCR Facturas (Invoice OCR)

Version: 1.0 | Date: 2025-12-24 08:00 | Owner: Javier Polo | Status: Active

---

## Problem

**Current Workflow:** Digitación manual de facturas (28 campos) toma 10-15 min por factura. Errores de transcripción (precios, cantidades, NIT) causan bloqueos contables. Facturas físicas archivadas sin backup digital → no compliance DIAN. Contabilidad valida manualmente vs orden de compra (lento, propenso a errores).

**Impact:** 55 compras/mes × 15 min = 13.75 horas/mes desperdiciadas en data entry. Errores causan retrasos en pagos a proveedores. Sin archivo digital → riesgo auditoría DIAN.

---

## Objective

**Primary Goal:** Sistema de extracción automática de datos de facturas mediante OCR (Google Vision API) que reduce tiempo captura 80% (15 min → 3 min), elimina errores de digitación 90%, valida automáticamente vs orden de compra, y archiva digitalmente para compliance DIAN (7 años).

**Success Metrics:**
- Tiempo captura factura <3 min (reducción 80% vs manual 15 min)
- Precisión OCR >95% en imágenes buena calidad, >80% en mala calidad
- Tasa de error validación vs PO <5% (detección discrepancias automática)
- Satisfacción usuario (Contabilidad) NPS >70
- Costo <$10/mes (66 facturas/mes × $1.50/1000 = gratis bajo tier free)
- Compliance DIAN: 100% facturas archivadas digitalmente (7 años retención)

---

## Scope

| In | Out |
|---|---|
| OCR extracción 15+ campos (factura #, fecha, NIT, proveedor, monto, items) | Email auto-intake (Phase 2 - F012) |
| Validación automática vs orden de compra (±5% tolerancia) | Multi-page invoices (2-5 páginas itemizadas) |
| Pre-procesamiento imagen (rotación, contraste, crop) | PDF text extraction nativo (vs OCR) |
| Confidence scores + resaltado campos baja confianza (<80%) | AI correction suggestions (LLM) |
| Storage original imagen (7 años compliance DIAN) | Mobile app nativo (vs web upload) |
| Google Vision API (primary) + AWS Textract (fallback) | Batch processing (10+ facturas simultáneas) |
| Drag-and-drop upload (móvil/desktop) | Tesseract self-hosted (cost/accuracy trade-off) |
| Side-by-side imagen original vs datos extraídos | Historical price anomaly check (Phase 2) |

---

## Contracts

### Input

| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| invoice_image | binary | Y | JPG/PNG/PDF, max 10 MB, min 300 DPI |
| purchase_order_id | uuid | N | For automatic validation (if available) |
| uploaded_by | uuid | Y | User ID (Contabilidad) |
| consorcio_id | uuid | Y | Project/consorcio for cost allocation |

### Output

| Field | Type | Condition | Notes |
|-------|------|-----------|-------|
| extracted_data | object | Always | 15 fields (invoice_number, date, nit, supplier_name, subtotal, tax, total, items[]) |
| confidence_scores | object | Always | Per-field confidence 0-100 (invoice_number, date, nit, total_amount) |
| validation_results | object | On PO Match | {status: OK\|WARNING\|ERROR, warnings[], errors[]} |
| image_url | string | Always | Signed URL to stored image (7-year expiry) |
| processing_time_ms | number | Always | OCR latency (target <5000ms) |
| ocr_provider | enum | Always | GOOGLE_VISION\|AWS_TEXTRACT (fallback tracking) |

---

## Business Rules

- **OCR Confidence Threshold:** Fields <80% confidence → Highlighted yellow → Manual review required before save
- **Validation Tolerance:** Total amount ±5% vs PO → ERROR → Block invoice → Notify Compras (F005 integration)
- **NIT Validation:** Must match supplier NIT in PO → ERROR if mismatch → Suggest creating new PO
- **Date Validation:** Invoice date ≤ today AND ≥ PO date → ERROR if future or before PO
- **Storage Retention:** 7 years minimum (DIAN compliance) → Immutable storage (GCS Object Lock)
- **File Size Limit:** Max 10 MB → Client-side validation → Compress if larger
- **Supported Formats:** JPG, PNG, PDF (first page only in MVP)
- **Processing Timeout:** 10s max → Retry 1x → Fallback to AWS Textract → If both fail, suggest manual entry
- **Image Quality:** Min 300 DPI recommended → If <300 DPI, show warning "Imagen baja calidad, OCR puede fallar"
- **Concurrent Edits:** Optimistic locking (version field) → Prevent overwrite if PO changed while OCR processing
- **Audit Trail:** Log all OCR calls (image_url, provider, confidence_scores, processing_time, user_id)

---

## Edge Cases

| Scenario | Handling | Notes |
|----------|----------|-------|
| No text detected (blank image) | Error: "No se detectó texto. Verifica imagen clara." → Suggest retake with better lighting | OCR returns empty string |
| Invalid image format (e.g., HEIC) | Error: "Formato no soportado. Usa JPG, PNG o PDF." → Block upload | Client-side validation |
| Image too large (>10 MB) | Error: "Imagen muy grande. Comprime a <10 MB." → Show compression tools | Client-side validation |
| OCR API timeout (>10s) | Retry 1x → Fallback to AWS Textract → If both fail: "Procesamiento tardó mucho. Intenta con mejor imagen o ingreso manual." | Dual-provider resilience |
| Low confidence all fields (<50%) | Warning: "Calidad imagen baja. OCR puede no ser confiable. ¿Ingresar manualmente?" → Offer manual entry | Poor image quality |
| No matching PO found | Warning: "No se encontró orden de compra. Crea PO primero." → Link to PO creation (F003) | Suggest create PO workflow |
| Amount variance >5% vs PO | Error: "Monto difiere {diff_pct}% del PO. Revisar con proveedor." → Block invoice → Notify Compras → Manual override option | Price discrepancy |
| Duplicate invoice number | Error: "Factura #{invoice_number} ya existe en sistema." → Prevent duplicate payment | Uniqueness check |
| Multi-page invoice | Only process first page (MVP) → Warning: "Factura tiene {page_count} páginas. Solo primera página procesada." → Phase 2 enhancement | MVP limitation |
| PDF with native text | Use PDF text extraction (faster than OCR) → Phase 2 optimization | Not implemented in MVP |
| Handwritten invoice | OCR accuracy <50% → Warning: "Factura manuscrita no soportada. Ingreso manual requerido." | Vision API limitation |
| Invoice in English (not Spanish) | OCR should still work (Vision API multilingual) → Validate supplier name fuzzily | Edge case for importaciones |

---

## Observability

**Logs:**
- `invoice_ocr_started` (info) - User, image_url, file_size, format
- `ocr_provider_called` (info) - Provider (GOOGLE_VISION\|AWS_TEXTRACT), latency_ms
- `ocr_extraction_complete` (info) - Extracted fields, confidence_scores, processing_time
- `validation_vs_po` (warn) - PO match status, errors[], warnings[]
- `invoice_blocked` (error) - Factura ID, reason (amount variance, NIT mismatch), notification sent
- `low_confidence_detected` (warn) - Fields <80%, manual_review_required
- `ocr_api_timeout` (error) - Provider, retry_count, fallback_triggered
- `invoice_saved` (info) - Factura ID, user_id, corrected_fields[]

**Metrics:**
- `ocr_requests_total` - Count by provider (GOOGLE_VISION, AWS_TEXTRACT)
- `ocr_latency_p95_ms` - 95th percentile latency (target <5000ms)
- `ocr_accuracy_pct` - % fields correctly extracted (measured vs manual validation)
- `low_confidence_rate_pct` - % invoices with <80% confidence (target <20%)
- `validation_error_rate_pct` - % invoices with PO validation errors (target <5%)
- `invoice_processing_time_p50_ms` - Median time upload → save (target <180,000ms = 3 min)
- `fallback_triggered_count` - Times AWS Textract used (Google Vision failure)
- `manual_review_count` - Invoices requiring manual correction (target <30%)

**Traces:**
- `invoice_ocr_pipeline` (span) - Full flow: upload → pre-process → OCR → parse → validate → save
- `image_preprocessing` (span) - OpenCV operations (rotation, contrast, denoise)
- `vision_api_call` (span) - Google Vision API latency
- `po_validation` (span) - Database query + comparison logic

---

## Definition of Done

- [ ] Code review approved
- [ ] Upload invoice image (drag-and-drop UX, mobile camera)
- [ ] Google Vision API OCR extracts 15 fields (invoice #, date, NIT, supplier, subtotal, tax, total, items)
- [ ] Pre-processing (rotation correction, contrast enhancement, grayscale)
- [ ] Confidence scores calculated per field (<80% → highlighted yellow)
- [ ] Validation vs PO (±5% tolerance, NIT match, date range)
- [ ] Error handling (timeout, invalid format, no text, no PO)
- [ ] AWS Textract fallback (if Google Vision timeout)
- [ ] Original image stored (GCS/Vercel Blob, 7-year retention)
- [ ] Side-by-side preview (image + editable form)
- [ ] Integration with F003 (Purchase Tracking - invoice validation gate)
- [ ] Integration with F005 (Notificaciones - invoice blocked alerts)
- [ ] **CRITICAL:** OCR accuracy >95% on 10 test invoices (good quality)
- [ ] **CRITICAL:** Validation detects 100% of critical errors (amount >5%, NIT mismatch)
- [ ] Processing time <5s (from upload to extracted data)
- [ ] Quality gates pass (format, lint, types, tests 80%+, build)
- [ ] Deployed to staging
- [ ] UAT with Contabilidad (10 real invoices, accuracy verified)
- [ ] Cost validated <$10/month (under Google Vision free tier)

---

**Related:** F003 (Purchase Tracking - validation gate), F005 (Notificaciones - alerts), F007 (Análisis Precios - price extraction), F012 (Email Intake - Phase 2) | **Dependencies:** Google Vision API, Vercel Blob/GCS, PostgreSQL purchase_orders table

**Original PRD:** docs/features/r04-ocr-facturas.md
