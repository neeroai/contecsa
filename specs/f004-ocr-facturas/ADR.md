# ADR-004: Use Google Vision API Over Tesseract Self-Hosted for Invoice OCR

Version: 1.0 | Date: 2025-12-24 08:10 | Owner: Javier Polo | Status: Accepted

---

## Context

Invoice OCR (F004) must extract 15 fields from scanned/photographed invoices with >95% accuracy, <5s latency, and <$10/month cost. Choice between managed OCR APIs (Google Vision, AWS Textract) vs self-hosted open-source (Tesseract OCR).

Budget: ~66 invoices/month (current volume), Spanish language support required, poor quality images common (photos from mobile, not scanned).

Decision needed NOW because OCR engine selection determines infrastructure (self-hosted vs API), accuracy expectations, and maintenance burden.

---

## Decision

**Will:** Use Google Cloud Vision API (primary) + AWS Textract (fallback)
**Will NOT:** Use Tesseract OCR self-hosted

---

## Rationale

Google Vision API offers best balance of accuracy, cost, and maintainability:
- **Accuracy:** 95%+ on good quality images (vs Tesseract 80-85%)
- **Spanish support:** Native Spanish language model (vs Tesseract requires training)
- **Form parser:** Built-in structure detection for invoices (vs manual parsing)
- **Free tier:** 1,000 images/month free (Contecsa 66/month = $0 cost forever)
- **Zero maintenance:** Managed service (vs Tesseract = server, updates, model training)
- **Fallback resilience:** AWS Textract if Google timeout (vs single point of failure)
- **Pre-processing:** Can skip complex pre-processing (Vision handles poor quality)
- **2-person team:** API call in 10 lines (vs Tesseract = server setup, tuning, monitoring)

For 2-person team, managed API = minimal complexity, predictable cost ($0 under free tier), no infrastructure burden.

---

## ClaudeCode&OnlyMe Validation

| Question | Answer | Score |
|----------|--------|-------|
| ¿Resuelve problema REAL HOY? | YES - Contabilidad spends 13.75 hours/month on manual data entry, errors cause payment delays | 1/1 |
| ¿Solución más SIMPLE? | YES - API call (10 lines) vs Tesseract (server setup, Docker, model training, monitoring) | 1/1 |
| ¿2 personas lo mantienen? | YES - Javier + Claude Code, no server to maintain, no model to retrain, just API calls + parsing logic | 1/1 |
| ¿Vale si NUNCA crecemos? | YES - Free tier covers 66-200 invoices/month forever, no scale issues, works for 10-100 users | 1/1 |
| **TOTAL** | **4/4 = ACCEPT** | **4/4** |

**Veto Threshold:** ANY NO = REJECT ✓ PASSED

---

## Alternatives Considered

### 1. Tesseract OCR (Self-Hosted Open-Source)
**Why rejected:**
- **Lower accuracy:** 80-85% on Spanish invoices (vs Vision 95%+) → More manual review burden
- **Maintenance:** Requires server (Docker container), updates, monitoring, model training for Spanish
- **Pre-processing:** Requires extensive OpenCV pre-processing (rotation, deskew, contrast) for decent accuracy
- **Infrastructure cost:** Server hosting ($20-50/month) > Google Vision free tier ($0)
- **No form parser:** Must manually detect table structure (invoice line items)
- **Single point of failure:** No built-in fallback (vs dual-provider Google+AWS)
- Violates ClaudeCode&OnlyMe: NOT simplest (server maintenance), NOT 2-person maintainable (ML expertise for tuning)

### 2. AWS Textract Only (No Google Vision)
**Why rejected:**
- **Cost parity:** Same price as Google Vision ($1.50/1000 images)
- **Spanish support:** Slightly worse than Google Vision (English-optimized)
- **No free tier:** Textract charges from first image (vs Google 1,000 free/month)
- **Dual-provider resilience:** Better to use Google primary + AWS fallback (not single vendor)

**Why used as FALLBACK:**
- Resilience: If Google Vision timeout/error, AWS Textract ensures 99.9%+ uptime
- Table extraction: Textract better at structured tables (invoice line items) - useful in Phase 2

### 3. Azure Form Recognizer
**Why rejected:**
- **Cost:** Similar to Google/AWS (~$1.50/1000)
- **Vendor lock-in:** Contecsa already uses GCP (SICOM ETL, storage) - prefer GCP for consistency
- **No compelling advantage:** Similar accuracy/features to Google Vision

---

## Consequences

**Positive:**
- Zero cost (under free tier forever: 66 invoices/month < 1,000)
- Highest accuracy (95%+ on good quality, 80%+ on poor quality)
- Zero infrastructure (no server, no Docker, no deployments)
- Spanish language native support
- Form parser built-in (invoice structure detection)
- Dual-provider resilience (Google + AWS fallback)
- Fast implementation (API SDK ready-to-use)
- Auto-scaling (Google manages capacity)

**Negative:**
- Vendor lock-in to Google Cloud (mitigated: AWS Textract fallback)
- API dependency (requires internet) - not offline-capable
- Privacy concern (images sent to Google) - mitigated: encryption in transit + at rest, no Google retention
- Cost scaling risk (if >1,000 invoices/month) - mitigated: Monitor usage, currently 66/month = safe

**Risks:**
- **Google Vision API downtime:** Mitigated by AWS Textract fallback (dual-provider 99.9%+ uptime)
- **Cost overrun (>1,000/month):** Mitigated by usage monitoring, alerts at 800 images/month, current volume 66/month = 15× margin
- **Accuracy degradation (poor quality images):** Mitigated by OpenCV pre-processing, confidence scores, manual review option

---

## Implementation Details

**Dual-Provider Architecture:**
```python
async def process_invoice(image_url: str) -> Dict:
    try:
        # Primary: Google Vision API
        result = await call_vision_api(image_url)
        return result
    except VisionAPITimeout:
        # Fallback: AWS Textract
        logger.warning("Vision API timeout, falling back to Textract")
        result = await call_textract_api(image_url)
        return result
    except Exception as e:
        # Both failed: Suggest manual entry
        logger.error(f"OCR failed: {e}")
        raise OCRFailedException("Manual entry required")
```

**Cost Monitoring:**
```python
# Alert if approaching free tier limit (800 images/month)
if monthly_image_count > 800:
    send_alert(
        to="admin@contecsa.com",
        subject="OCR usage nearing free tier limit",
        message=f"Processed {monthly_image_count} images this month (limit: 1,000 free)"
    )
```

**Benefits:**
- Resilience: 99.9%+ uptime (dual-provider)
- Cost control: Alerts before hitting paid tier
- Flexibility: Can switch providers if needed (abstracted interface)

---

## Related

- SPEC: /specs/f004-ocr-facturas/SPEC.md (Contracts, Business Rules)
- PLAN: /specs/f004-ocr-facturas/PLAN.md (S006: Vision API integration, S007: Textract fallback)
- Google Vision API: https://cloud.google.com/vision/docs/ocr
- AWS Textract: https://aws.amazon.com/textract/
- Tesseract OCR: https://github.com/tesseract-ocr/tesseract

---

**Decision Maker:** Javier Polo + Claude Code | **Review Date:** 2025-06-24 (6 months)
