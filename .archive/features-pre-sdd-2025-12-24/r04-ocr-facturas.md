# R4 - OCR Facturas (Invoice OCR)

Version: 1.0 | Date: 2025-12-22 22:40 | Priority: P1 | Status: Planned

---

## Overview

Extracción automática de datos de facturas mediante OCR (Optical Character Recognition) para eliminar digitación manual, reducir errores y acelerar validación contable. Usuario toma foto de factura física y sistema extrae campos clave automáticamente.

**Key Feature:** "Le tomas la foto y la IA la procesa" - PO requirement from meeting 2025-12-22

---

## Business Context

**Problem:**
- Digitación manual de facturas (28 campos) toma 10-15 min por factura
- Errores de transcripción (precios, cantidades, NIT) causan bloqueos contables
- Facturas físicas archivadas sin backup digital
- Proceso lento → retraso en pagos a proveedores
- Contabilidad debe validar manualmente vs orden de compra

**Solution:**
Tomar foto de factura con móvil/escáner → OCR extrae datos automáticamente → Sistema valida vs orden de compra → Contabilidad revisa solo excepciones (no todas las facturas).

**Impact:**
- Reducción 80% tiempo captura facturas (15 min → 3 min)
- Reducción 90% errores de digitación
- Archivo digital automático (compliance DIAN)
- Validación automática vs PO (detectar discrepancias)
- Contabilidad enfocada en excepciones (no data entry)

---

## User Stories

| ID | Actor | Story | Acceptance Criteria |
|----|-------|-------|------------------------|
| US4.1 | Contabilidad | Subir foto de factura y sistema extrae datos | - Upload desde móvil/desktop<br>- OCR extrae 15+ campos<br>- Datos pre-llenados en form |
| US4.2 | Contabilidad | Corregir datos OCR si hay errores | - Campos editables<br>- Resaltar campos con baja confianza<br>- Guardar correcciones |
| US4.3 | Compras | Validar factura automáticamente vs PO | - Sistema compara factura vs PO<br>- Alerta si discrepancia >5%<br>- Bloquea factura si error crítico |
| US4.4 | Gerencia | Consultar facturas digitales archivadas | - Búsqueda por NIT, fecha, monto<br>- Ver imagen original<br>- Exportar PDF/Sheets |

---

## Technical Approach

### Architecture

```
Usuario sube imagen
  ↓
Frontend (Next.js)
  ├─→ Validación (formato, tamaño, calidad)
  ├─→ Upload a Storage (GCS/S3/Vercel Blob)
  └─→ API call /api/ocr/invoice
  ↓
Backend (Python FastAPI)
  ├─→ Fetch image from storage
  ├─→ Pre-processing (rotation, contrast, crop)
  ├─→ OCR API call (Google Vision or AWS Textract)
  ├─→ Parse OCR response → Structured data
  ├─→ Validate vs Purchase Order (PostgreSQL)
  ├─→ Calculate confidence scores
  └─→ Return extracted data + validation results
  ↓
Frontend displays:
  ├─→ Form with extracted data (editable)
  ├─→ Validation warnings (if discrepancies)
  └─→ Original image preview (side-by-side)
```

### Tech Stack

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| OCR Engine | Google Cloud Vision API (primary) | - Best for Spanish text<br>- Handles poor quality images<br>- $1.50/1000 images<br>- Form parser feature |
| OCR Engine | AWS Textract (fallback) | - Backup if GCP down<br>- Table extraction better<br>- $1.50/1000 images |
| Storage | Google Cloud Storage or Vercel Blob | - Store original images (7 years retention)<br>- Signed URLs for access |
| Image Pre-processing | OpenCV (Python) | - Rotation correction<br>- Contrast enhancement<br>- Crop/deskew |
| Validation | PostgreSQL + Python | - Compare vs purchase_orders table<br>- Price/quantity tolerance checks |
| Frontend Upload | Next.js + react-dropzone | - Drag-and-drop UX<br>- Mobile camera integration |

---

## Google Cloud Vision API Integration

### Setup

**1. Enable Vision API**
```bash
# In Google Cloud Console
1. Enable Cloud Vision API
2. Create service account "ocr-service"
3. Grant role "Cloud Vision API User"
4. Download JSON credentials
```

**2. Environment Variables**
```env
GOOGLE_CLOUD_PROJECT_ID=contecsa-sistema-compras
GOOGLE_VISION_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
INVOICE_STORAGE_BUCKET=contecsa-invoices
```

**3. Install SDK**
```bash
pip install google-cloud-vision opencv-python pillow
```

### OCR Extraction Function

**Implementation: `/api/services/ocr.py`**

```python
from google.cloud import vision
from google.cloud import storage
import cv2
import numpy as np
from typing import Dict, List

class InvoiceOCR:
    def __init__(self):
        self.vision_client = vision.ImageAnnotatorClient()
        self.storage_client = storage.Client()

    async def process_invoice(self, image_url: str) -> Dict:
        """
        Process invoice image and extract structured data

        Returns:
        {
            "extracted_data": {...},
            "confidence_scores": {...},
            "validation_results": {...}
        }
        """
        # 1. Download image from storage
        image_bytes = self._download_image(image_url)

        # 2. Pre-process image (improve OCR accuracy)
        processed_image = self._preprocess_image(image_bytes)

        # 3. Call Google Vision API
        ocr_result = self._call_vision_api(processed_image)

        # 4. Parse OCR text → Structured data
        extracted_data = self._parse_invoice_data(ocr_result)

        # 5. Validate vs Purchase Order
        validation = await self._validate_vs_po(extracted_data)

        return {
            "extracted_data": extracted_data,
            "confidence_scores": self._calculate_confidence(ocr_result),
            "validation_results": validation,
            "original_image_url": image_url
        }

    def _preprocess_image(self, image_bytes: bytes) -> bytes:
        """
        Improve image quality for OCR
        - Rotation correction (if skewed)
        - Contrast enhancement
        - Grayscale conversion
        """
        # Convert bytes to numpy array
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Increase contrast (adaptive histogram equalization)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
        enhanced = clahe.apply(gray)

        # Denoise
        denoised = cv2.fastNlMeansDenoising(enhanced)

        # Encode back to bytes
        _, buffer = cv2.imencode('.png', denoised)
        return buffer.tobytes()

    def _call_vision_api(self, image_bytes: bytes) -> vision.AnnotateImageResponse:
        """
        Call Google Cloud Vision API (Document Text Detection)
        """
        image = vision.Image(content=image_bytes)

        # Use DOCUMENT_TEXT_DETECTION (better for structured docs)
        response = self.vision_client.document_text_detection(image=image)

        if response.error.message:
            raise Exception(f"Vision API error: {response.error.message}")

        return response

    def _parse_invoice_data(self, ocr_result) -> Dict:
        """
        Parse OCR text to extract invoice fields
        Uses regex patterns + heuristics
        """
        full_text = ocr_result.full_text_annotation.text

        # Extract fields using regex patterns
        data = {
            "invoice_number": self._extract_invoice_number(full_text),
            "date": self._extract_date(full_text),
            "nit": self._extract_nit(full_text),
            "supplier_name": self._extract_supplier_name(full_text),
            "total_amount": self._extract_total_amount(full_text),
            "subtotal": self._extract_subtotal(full_text),
            "tax_amount": self._extract_tax(full_text),
            "items": self._extract_line_items(ocr_result)  # Table extraction
        }

        return data

    def _extract_invoice_number(self, text: str) -> str:
        """
        Extract invoice number using patterns
        Examples: "Factura No. 12345", "Invoice #ABC-001"
        """
        import re
        patterns = [
            r'Factura\s+No\.?\s*[:.]?\s*(\w+[-]?\w+)',
            r'Invoice\s+#?\s*[:.]?\s*(\w+[-]?\w+)',
            r'N[oº]\.?\s+Factura\s*[:.]?\s*(\w+[-]?\w+)'
        ]
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1)
        return ""

    def _extract_date(self, text: str) -> str:
        """
        Extract date (multiple formats)
        Examples: "2025-12-22", "22/12/2025", "Dec 22, 2025"
        """
        import re
        from dateutil import parser

        # Try ISO format first
        iso_match = re.search(r'\d{4}-\d{2}-\d{2}', text)
        if iso_match:
            return iso_match.group(0)

        # Try DD/MM/YYYY
        date_match = re.search(r'\d{2}/\d{2}/\d{4}', text)
        if date_match:
            try:
                parsed = parser.parse(date_match.group(0), dayfirst=True)
                return parsed.strftime('%Y-%m-%d')
            except:
                pass

        return ""

    def _extract_nit(self, text: str) -> str:
        """
        Extract Colombian NIT
        Format: 123456789-0 (9 digits + check digit)
        """
        import re
        match = re.search(r'NIT\s*[:.]?\s*(\d{9}-\d)', text, re.IGNORECASE)
        if match:
            return match.group(1)

        # Try without NIT prefix
        match = re.search(r'\b(\d{9}-\d)\b', text)
        if match:
            return match.group(1)

        return ""

    def _extract_total_amount(self, text: str) -> float:
        """
        Extract total amount (final price)
        Examples: "Total: $1,234,567", "TOTAL COP 1.234.567"
        """
        import re

        # Look for "Total" keyword + amount
        patterns = [
            r'Total\s*[:.]?\s*\$?\s*([\d,\.]+)',
            r'TOTAL\s+COP\s+([\d,\.]+)',
            r'Valor\s+Total\s*[:.]?\s*\$?\s*([\d,\.]+)'
        ]

        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                amount_str = match.group(1).replace(',', '').replace('.', '')
                try:
                    return float(amount_str)
                except:
                    pass

        return 0.0

    def _extract_line_items(self, ocr_result) -> List[Dict]:
        """
        Extract invoice line items (table)
        Uses Vision API's block detection to identify tables
        """
        items = []

        # Parse blocks to find table structure
        # (Simplified - production would use more sophisticated logic)
        for page in ocr_result.full_text_annotation.pages:
            for block in page.blocks:
                # Check if block looks like table row
                # Extract: description, quantity, unit_price, total
                pass  # TODO: Implement table parsing

        return items

    async def _validate_vs_po(self, extracted_data: Dict) -> Dict:
        """
        Validate extracted data vs Purchase Order
        Returns warnings/errors if discrepancies
        """
        # Find matching PO by supplier NIT + date range
        po = await self._find_matching_po(
            nit=extracted_data["nit"],
            date=extracted_data["date"]
        )

        if not po:
            return {
                "status": "WARNING",
                "message": "No matching Purchase Order found",
                "suggestions": []
            }

        validation_results = {
            "status": "OK",
            "warnings": [],
            "errors": []
        }

        # Check total amount (tolerance ±5%)
        po_total = po["total_amount"]
        invoice_total = extracted_data["total_amount"]
        diff_pct = abs(invoice_total - po_total) / po_total * 100

        if diff_pct > 5:
            validation_results["errors"].append({
                "field": "total_amount",
                "message": f"Monto difiere {diff_pct:.1f}% del PO",
                "po_value": po_total,
                "invoice_value": invoice_total
            })
            validation_results["status"] = "ERROR"

        # Check supplier NIT
        if po["supplier_nit"] != extracted_data["nit"]:
            validation_results["errors"].append({
                "field": "nit",
                "message": "NIT no coincide con PO",
                "po_value": po["supplier_nit"],
                "invoice_value": extracted_data["nit"]
            })
            validation_results["status"] = "ERROR"

        return validation_results

    def _calculate_confidence(self, ocr_result) -> Dict[str, float]:
        """
        Calculate confidence score per field (0-100)
        Based on Vision API's confidence scores
        """
        avg_confidence = 0.0

        if ocr_result.full_text_annotation:
            # Vision API provides confidence per word
            total_confidence = 0.0
            word_count = 0

            for page in ocr_result.full_text_annotation.pages:
                for block in page.blocks:
                    total_confidence += block.confidence
                    word_count += 1

            if word_count > 0:
                avg_confidence = (total_confidence / word_count) * 100

        return {
            "overall": avg_confidence,
            "invoice_number": 85.0,  # TODO: Calculate per field
            "date": 90.0,
            "nit": 88.0,
            "total_amount": 92.0
        }
```

---

## API Endpoint

**`/api/app/api/ocr/invoice/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  // 1. Upload to Vercel Blob (or GCS)
  const blob = await put(`invoices/${Date.now()}-${file.name}`, file, {
    access: 'public',
  });

  // 2. Call Python backend OCR service
  const ocrResponse = await fetch('http://localhost:8000/ocr/invoice', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_url: blob.url })
  });

  const ocrData = await ocrResponse.json();

  // 3. Return extracted data + validation
  return NextResponse.json({
    extracted_data: ocrData.extracted_data,
    confidence_scores: ocrData.confidence_scores,
    validation_results: ocrData.validation_results,
    image_url: blob.url
  });
}
```

---

## Frontend Component

**Invoice Upload Form**

```typescript
'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface OCRResult {
  extracted_data: {
    invoice_number: string;
    date: string;
    nit: string;
    supplier_name: string;
    total_amount: number;
  };
  confidence_scores: Record<string, number>;
  validation_results: {
    status: 'OK' | 'WARNING' | 'ERROR';
    warnings: any[];
    errors: any[];
  };
  image_url: string;
}

export function InvoiceOCRForm() {
  const [loading, setLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [formData, setFormData] = useState({
    invoice_number: '',
    date: '',
    nit: '',
    supplier_name: '',
    total_amount: 0
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.pdf'] },
    maxFiles: 1,
    onDrop: async (files) => {
      const file = files[0];
      if (!file) return;

      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/ocr/invoice', {
          method: 'POST',
          body: formData
        });

        const result = await res.json();
        setOcrResult(result);

        // Pre-fill form with extracted data
        setFormData(result.extracted_data);
      } catch (error) {
        console.error('OCR failed:', error);
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary"
      >
        <input {...getInputProps()} />
        <p>Arrastra factura aquí o haz clic para seleccionar</p>
        <p className="text-sm text-muted-foreground">
          Formatos: JPG, PNG, PDF
        </p>
      </div>

      {loading && <p>Procesando factura con OCR...</p>}

      {/* Extracted Data Form */}
      {ocrResult && (
        <div className="grid grid-cols-2 gap-6">
          {/* Left: Form with extracted data */}
          <div className="space-y-4">
            <h3 className="font-semibold">Datos Extraídos</h3>

            <div>
              <Label>Número de Factura</Label>
              <Input
                value={formData.invoice_number}
                onChange={(e) => setFormData({...formData, invoice_number: e.target.value})}
                className={
                  ocrResult.confidence_scores.invoice_number < 80
                    ? 'border-yellow-500'
                    : ''
                }
              />
              <p className="text-xs text-muted-foreground">
                Confianza: {ocrResult.confidence_scores.invoice_number}%
              </p>
            </div>

            <div>
              <Label>Fecha</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>

            <div>
              <Label>NIT Proveedor</Label>
              <Input
                value={formData.nit}
                onChange={(e) => setFormData({...formData, nit: e.target.value})}
              />
            </div>

            <div>
              <Label>Monto Total</Label>
              <Input
                type="number"
                value={formData.total_amount}
                onChange={(e) => setFormData({...formData, total_amount: Number(e.target.value)})}
              />
            </div>

            {/* Validation Errors */}
            {ocrResult.validation_results.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertDescription>
                  {ocrResult.validation_results.errors.map((err, i) => (
                    <div key={i}>{err.message}</div>
                  ))}
                </AlertDescription>
              </Alert>
            )}

            <Button onClick={() => console.log('Save invoice')}>
              Guardar Factura
            </Button>
          </div>

          {/* Right: Image Preview */}
          <div>
            <h3 className="font-semibold mb-2">Imagen Original</h3>
            <img
              src={ocrResult.image_url}
              alt="Invoice"
              className="w-full border rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Data Fields Extracted

| Field | OCR Pattern | Validation | Confidence Threshold |
|-------|-------------|-----------|---------------------|
| Invoice Number | "Factura No. XXX" | Required, unique | >80% |
| Date | DD/MM/YYYY or YYYY-MM-DD | Must be ≤ today | >85% |
| NIT | 9 digits + check digit | Must match supplier in PO | >90% |
| Supplier Name | First text block (top) | Fuzzy match vs PO | >75% |
| Subtotal | "Subtotal: $XXX" | Math check (subtotal + tax = total) | >85% |
| Tax (IVA) | "IVA 19%: $XXX" | Calculated vs subtotal | >85% |
| Total Amount | "Total: $XXX" | ±5% tolerance vs PO | >90% |
| Line Items | Table rows | Match PO items | >70% (manual review) |

**Low Confidence Handling:**
- Fields <80% confidence → Highlighted yellow in form
- User must manually review before saving
- System suggests corrections based on PO data

---

## Error Handling

| Error | User Message | System Action |
|-------|--------------|---------------|
| OCR API timeout (>10s) | "Procesamiento tardó mucho. Intenta con mejor imagen." | Retry 1x, then suggest manual entry |
| Invalid image format | "Formato no soportado. Usa JPG, PNG o PDF." | Block upload, show supported formats |
| Image too large (>10 MB) | "Imagen muy grande. Comprime a <10 MB." | Client-side validation before upload |
| No text detected | "No se detectó texto. Verifica que imagen sea clara." | Suggest retake photo with better lighting |
| Validation error (monto ±5%) | "Monto difiere del PO. Revisar con proveedor." | Block invoice, notify Compras |
| No matching PO found | "No se encontró orden de compra. Crea PO primero." | Suggest creating PO or manual entry |

---

## Integration with R3 (Purchase Tracking)

**Workflow:**
1. Compras crea orden de compra (PO) → Estado = ORDEN
2. Proveedor entrega materiales → Almacén recibe (R8)
3. Proveedor envía factura (física o email)
4. **Contabilidad sube factura → OCR extrae datos**
5. Sistema valida vs PO automáticamente
6. ¿Validación OK? → Contabilidad aprueba → Estado = FACTURADA
7. ¿Validación ERROR? → Factura bloqueada → Notifica Compras (R5)

**Database Update:**
```sql
-- After OCR + validation success
UPDATE purchases
SET
  invoice_number = 'FAC-12345',
  invoice_date = '2025-12-22',
  invoice_amount = 1234567.00,
  invoice_image_url = 'https://storage/.../invoice.jpg',
  status = 'FACTURADA',
  updated_at = CURRENT_TIMESTAMP
WHERE id = 'purchase-uuid';
```

---

## Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| OCR processing time | <5s | From upload to extracted data |
| OCR accuracy (good quality) | >95% | % fields correctly extracted |
| OCR accuracy (poor quality) | >80% | With manual correction |
| Upload time (5 MB image) | <3s | From click to storage |
| Validation time | <1s | Compare vs PO |

---

## Cost Estimation

**Google Cloud Vision API Pricing:**
- First 1,000 images/month: FREE
- $1.50 per 1,000 images after that

**Contecsa Volume:**
- ~55 purchases/month (current)
- Assume 1.2 invoices per purchase (some partial invoices)
- Total: ~66 invoices/month
- **Cost:** FREE (under 1,000/month threshold)

**Storage Costs (Vercel Blob or GCS):**
- Average invoice image: 2 MB
- 66 invoices/month × 2 MB = 132 MB/month
- Retention: 7 years (compliance) = 132 MB × 84 = 11 GB
- **Cost:** ~$0.50/month (GCS standard storage)

**Total Monthly Cost:** <$1.00 (negligible)

---

## Security Considerations

| Risk | Mitigation |
|------|------------|
| Sensitive financial data in images | Encrypt at rest (GCS encryption), signed URLs with expiry |
| Unauthorized access to invoices | RBAC (only Contabilidad, Compras, Admin can view) |
| Image tampering | Store hash of original image, detect modifications |
| OCR API key leak | Use service account (not API key), rotate quarterly |
| DIAN compliance (7-year retention) | Immutable storage (GCS Object Lock), audit trail |

---

## Testing Strategy

### Unit Tests
- OCR extraction accuracy (test dataset of 50 invoices)
- Regex patterns (invoice number, NIT, amounts)
- Validation logic (PO matching, tolerance checks)
- Confidence score calculation

### Integration Tests
- Full flow: Upload → OCR → Validation → Save
- Error handling (timeout, invalid image, no PO)
- Storage integration (Vercel Blob / GCS)

### User Acceptance Tests
- Contabilidad uploads real invoices (10 samples)
- Verify extracted data accuracy (manual comparison)
- Test correction workflow (low confidence fields)
- Test validation errors (mismatched amounts)

---

## Success Criteria

**MVP Acceptance:**
- [ ] Upload invoice image (drag-and-drop UX)
- [ ] OCR extracts 8+ key fields (>80% accuracy)
- [ ] Validation vs PO works correctly
- [ ] Low confidence fields highlighted for review
- [ ] Original image stored + accessible

**Production Ready:**
- [ ] OCR accuracy >95% (good quality images)
- [ ] Processing time <5s per invoice
- [ ] Validation detects 100% of critical errors (amount, NIT)
- [ ] User satisfaction NPS >70 (Contabilidad)
- [ ] Cost <$10/month (66 invoices/month)

---

## Future Enhancements (Post-MVP)

1. **Email Intake (R12)** - Forward invoice to email → Automatic OCR
2. **Multi-page Invoices** - Handle 2-5 page invoices (itemized)
3. **PDF Text Extraction** - Use native PDF parsing (faster than OCR)
4. **AI Correction Suggestions** - LLM suggests corrections for low confidence
5. **Mobile App** - Native camera integration (better UX than web upload)
6. **Batch Processing** - Upload 10+ invoices at once
7. **Historical Price Check (R7)** - OCR triggers price anomaly detection

---

## References

- PRD Feature F04 (OCR Facturas)
- Meeting PO: docs/meets/contecsa_meet_2025-12-22.txt ("Le tomas la foto y la IA la procesa")
- R3 (Purchase Tracking): docs/features/r03-seguimiento-compras.md (Invoice validation gate)
- R5 (Notifications): docs/features/r05-notificaciones.md (Invoice blocked alerts)
- R7 (Price Anomalies): docs/features/r07-analisis-precios.md (Integration for price check)
- Google Vision API: https://cloud.google.com/vision/docs/ocr
- AWS Textract: https://aws.amazon.com/textract/
