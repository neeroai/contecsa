# R12 - Ingreso de Facturas por Email

Version: 1.0 | Date: 2025-12-22 23:35 | Priority: P2 | Status: Planned

---

## Overview

Sistema de ingreso automático de facturas recibidas por email (factura@contecsa.com) con OCR automático, validación vs PO y notificación a Contabilidad para eliminar captura manual y acelerar procesamiento.

**Key Feature:** Proveedor envía factura PDF a factura@contecsa.com → Sistema extrae datos automáticamente (OCR R4) → Valida vs orden de compra → Notifica Contabilidad para revisión final.

---

## Business Context

**Problem:**
- Facturas llegan por email a múltiples cuentas (compras@, contabilidad@, liced@)
- No hay inbox unificado → facturas se pierden
- Proceso manual: descargar attachment → subir a sistema → OCR → validar
- Tiempo de procesamiento: 15-20 min por factura

**Solution:**
Email dedicado factura@contecsa.com → Gmail API (R11) lee emails automáticamente → Extrae attachment PDF → Trigger OCR (R4) → Validación automática → Notificación Contabilidad.

**Impact:**
- Reducción 90% tiempo ingreso facturas (20 min → 2 min)
- Reducción 100% facturas perdidas (inbox unificado)
- Procesamiento 24/7 (no depende de horario oficina)

---

## User Stories

| ID | Actor | Story | Acceptance Criteria |
|----|-------|-------|---------------------|
| US12.1 | Proveedor | Enviar factura por email a factura@contecsa.com | - Email recibido<br>- PDF extraído automáticamente<br>- OCR procesado<br>- Confirmación automática al proveedor |
| US12.2 | Contabilidad | Recibir notificación de factura ingresada automáticamente | - Email con resumen de factura<br>- Link a factura en sistema<br>- Resultado validación vs PO |
| US12.3 | Contabilidad | Revisar facturas ingresadas por email (dashboard) | - Lista de facturas nuevas<br>- Estado: PENDIENTE_REVISIÓN<br>- Click para aprobar/corregir |
| US12.4 | Compras | Configurar proveedores autorizados (whitelist) | - Solo emails de proveedores conocidos<br>- Bloquear spam/phishing<br>- Log de emails bloqueados |

---

## Technical Approach

### Architecture

```
Gmail API (R11 Polling - every 5 min)
  ↓
  ├─→ Check inbox: factura@contecsa.com
  ├─→ Filter: subject contains "factura" OR has PDF attachment
  ├─→ Extract: sender, subject, PDF attachment
  └─→ Verify sender in whitelist (anti-spam)
  ↓
PDF Attachment Processing
  ├─→ Download PDF to temp storage
  ├─→ Upload to GCS/S3/Vercel Blob
  └─→ Trigger OCR (R4)
  ↓
OCR + Validation (R4 + R7)
  ├─→ Extract: invoice_number, NIT, amount, date
  ├─→ Find matching PO (by NIT + date range)
  ├─→ Validate price (R7 anomaly detection)
  └─→ Create invoice record (status: PENDING_REVIEW)
  ↓
Notification (R5)
  ├─→ Email Contabilidad: "Nueva factura ingresada automáticamente"
  ├─→ Dashboard: Badge con N facturas pendientes
  └─→ Optional: Reply to supplier email (confirmation)
```

### Gmail API Integration

```python
# /api/services/email_intake.py
from google.oauth2 import service_account
from googleapiclient.discovery import build
import base64

class InvoiceEmailIntake:
    def __init__(self):
        self.gmail = build('gmail', 'v1', credentials=self.get_credentials())

    async def poll_invoice_inbox(self):
        """
        Check factura@contecsa.com for new invoices
        Run every 5 min (Vercel Cron)
        """
        # 1. Query emails (last 10 min, unread, has PDF attachment)
        results = self.gmail.users().messages().list(
            userId='me',
            q='is:unread has:attachment filename:pdf after:10m'
        ).execute()

        messages = results.get('messages', [])

        for msg_meta in messages:
            # 2. Get full message
            msg = self.gmail.users().messages().get(
                userId='me',
                id=msg_meta['id'],
                format='full'
            ).execute()

            # 3. Extract metadata
            headers = msg['payload']['headers']
            sender = next(h['value'] for h in headers if h['name'] == 'From')
            subject = next(h['value'] for h in headers if h['name'] == 'Subject')

            # 4. Verify sender in whitelist
            if not await self.is_authorized_supplier(sender):
                await self.log_blocked_email(sender, subject)
                self.mark_as_read(msg_meta['id'])
                continue

            # 5. Extract PDF attachment
            pdf_data = self.extract_pdf_attachment(msg)

            if pdf_data:
                # 6. Process invoice
                await self.process_invoice_email(
                    sender=sender,
                    subject=subject,
                    pdf_data=pdf_data,
                    email_id=msg_meta['id']
                )

                # 7. Mark as read
                self.mark_as_read(msg_meta['id'])

    def extract_pdf_attachment(self, msg) -> bytes:
        """Extract PDF from email attachments"""
        parts = msg['payload'].get('parts', [])

        for part in parts:
            if part['filename'].endswith('.pdf'):
                attachment_id = part['body']['attachmentId']

                attachment = self.gmail.users().messages().attachments().get(
                    userId='me',
                    messageId=msg['id'],
                    id=attachment_id
                ).execute()

                data = attachment['data']
                return base64.urlsafe_b64decode(data)

        return None

    async def is_authorized_supplier(self, email: str) -> bool:
        """Check if sender is authorized supplier"""
        domain = email.split('@')[1] if '@' in email else ''

        supplier = await db.fetch_one("""
            SELECT id FROM suppliers
            WHERE email = %s OR email_domain = %s
        """, (email, domain))

        return supplier is not None

    async def process_invoice_email(self, sender, subject, pdf_data, email_id):
        """
        Full processing: Upload → OCR → Validate → Notify
        """
        # 1. Upload PDF to storage
        pdf_url = await upload_to_storage(
            data=pdf_data,
            filename=f"invoices/email/{email_id}.pdf"
        )

        # 2. Trigger OCR (R4)
        ocr_result = await ocr_invoice(pdf_url)

        # 3. Find matching PO
        po = await find_matching_po(
            nit=ocr_result['nit'],
            date=ocr_result['date']
        )

        # 4. Validate price (R7)
        if po:
            price_validation = await detect_price_anomaly(
                material_id=po['material_id'],
                supplier_id=po['supplier_id'],
                unit_price=ocr_result['total_amount'] / po['quantity']
            )
        else:
            price_validation = {"anomaly_detected": False}

        # 5. Create invoice record
        invoice = await db.query("""
            INSERT INTO invoices (
                invoice_number,
                supplier_email,
                purchase_id,
                amount,
                invoice_date,
                pdf_url,
                status,
                ingestion_source,
                ocr_data,
                price_validation
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING id
        """, (
            ocr_result.get('invoice_number'),
            sender,
            po['id'] if po else None,
            ocr_result.get('total_amount'),
            ocr_result.get('date'),
            pdf_url,
            'PENDING_REVIEW',
            'EMAIL_INTAKE',
            json.dumps(ocr_result),
            json.dumps(price_validation)
        ))

        # 6. Notify Contabilidad
        await send_email(
            to='contabilidad@contecsa.com',
            subject=f'Nueva factura ingresada: {ocr_result.get("invoice_number")}',
            html=f"""
                <h2>Factura Ingresada Automáticamente</h2>

                <p><strong>Proveedor:</strong> {sender}</p>
                <p><strong>Número:</strong> {ocr_result.get('invoice_number')}</p>
                <p><strong>Monto:</strong> ${ocr_result.get('total_amount'):,} COP</p>
                <p><strong>Fecha:</strong> {ocr_result.get('date')}</p>

                <p><strong>Validación:</strong>
                {' OK - Coincide con PO' if po else ' ADVERTENCIA - No se encontró PO'}
                </p>

                <p><a href="https://app.contecsa.com/invoices/{invoice['id']}">Revisar Factura</a></p>
            """
        )

        # 7. Optional: Reply to supplier (confirmation)
        if SEND_CONFIRMATION_TO_SUPPLIER:
            await self.reply_to_supplier(email_id, ocr_result)
```

### Cron Job

```typescript
// /src/app/api/cron/poll-invoice-emails/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  // Call Python backend
  const res = await fetch('http://localhost:8000/email-intake/poll', {
    method: 'POST'
  });

  const result = await res.json();

  return NextResponse.json({
    processed: result.processed_count,
    blocked: result.blocked_count
  });
}
```

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/poll-invoice-emails",
      "schedule": "*/5 * * * *"  // Every 5 minutes
    }
  ]
}
```

---

## Security Considerations

| Risk | Mitigation |
|------|------------|
| Spam/phishing emails | Whitelist only known supplier emails/domains |
| Malware in PDF | Scan with antivirus before processing (ClamAV) |
| Invoice forgery | Validate NIT vs registered suppliers, check digital signature (if available) |
| Email spoofing | Verify SPF/DKIM headers |
| Unauthorized access to inbox | Gmail API uses service account (not user password) |

---

## References

- PRD Feature F12 (Facturas Email)
- R4 (OCR): docs/features/r04-ocr-facturas.md
- R7 (Price Validation): docs/features/r07-analisis-precios.md
- R11 (Gmail API): docs/features/r11-google-workspace.md
- R5 (Notifications): docs/features/r05-notificaciones.md
