# R8 - Gestión de Certificados de Calidad

Version: 1.0 | Date: 2025-12-22 23:15 | Priority: P1 | Status: Planned

---

## Overview

Sistema de gestión digital de certificados de calidad de materiales de construcción (NTC, INVIAS, ISO, proveedor) con almacenamiento en nube, validación técnica, bloqueo de cierre contable sin certificado y alertas automáticas por vencimiento.

**Key Feature:** Certificado de calidad = gate bloqueante para cierre de compra. Sin certificado → compra no se puede cerrar contablemente.

---

## Business Context

**Problem:**
- Excel actual: Campo "Certificado" SIEMPRE VACÍO (55 compras, 0 certificados registrados)
- Certificados físicos archivados en folders (no digitalizados)
- Pérdida/extravío de certificados (no hay backup)
- Auditorías internas/externas requieren certificados → búsqueda manual 2-4 horas
- Compliance NTC/INVIAS no verificado sistemáticamente
- Cierre contable sin validar calidad = riesgo técnico y legal

**Solution:**
Subida obligatoria de certificado digital (PDF/imagen) post-recepción material → Validación técnica (Ing. Técnico) → Almacenamiento en GCS/S3/Vercel Blob → Bloqueo de cierre contable si falta certificado → Alertas automáticas 5 días post-recepción.

**Impact:**
- 100% de compras con certificado digital (vs 0% actual)
- Reducción 95% tiempo búsqueda certificados (2h → 5 min búsqueda digital)
- Compliance NTC/INVIAS verificable (auditorías)
- Reducción riesgo legal (material defectuoso sin certificado)
- Backup automático (7 años retención DIAN)

---

## User Stories

| ID | Actor | Story | Acceptance Criteria |
|----|-------|-------|----------------------|
| US8.1 | Jefe Compras | Subir certificado de calidad post-recepción | - Upload PDF/imagen<br>- Metadata: material, proveedor, lote<br>- Vista previa en sistema |
| US8.2 | Técnico | Validar certificado técnicamente (NTC/INVIAS) | - Ver certificado en sistema<br>- Marcar VÁLIDO/RECHAZADO<br>- Comentarios de validación |
| US8.3 | Contabilidad | Bloqueo de cierre si falta certificado | - Sistema no permite cerrar sin certificado<br>- Alerta visual en factura<br>- Notificación a Compras |
| US8.4 | Gerencia | Consultar certificados archivados (auditoría) | - Búsqueda por material, proveedor, fecha<br>- Download PDF original<br>- Exportar listado a Sheets |
| US8.5 | Compras | Recibir alerta 5 días post-recepción sin certificado | - Email automático (R5)<br>- Dashboard alerta<br>- Link a compra para subir cert |

---

## Technical Approach

### Architecture

```
Material Reception (R3 - Almacén confirms delivery)
  ↓
Sistema crea task: "Subir certificado (deadline 5 días)"
  ↓
  ├─→ Day 0-5: Compras sube certificado (voluntary)
  └─→ Day 5: Alert triggered (R5) → Email Jefe Compras
  ↓
Upload Certificate (Frontend)
  ├─→ Drag-and-drop PDF/image
  ├─→ Upload to Storage (GCS/S3/Vercel Blob)
  ├─→ Extract metadata (OCR for cert number, date, lab)
  └─→ Store reference in PostgreSQL
  ↓
Technical Validation (Técnico)
  ├─→ View certificate in system
  ├─→ Validate compliance (NTC, INVIAS, ISO)
  ├─→ Mark: VALID, REJECTED, PENDING
  └─→ Add validation comments
  ↓
Blocking Gate (Contabilidad tries to close purchase)
  ├─→ System checks: certificate uploaded? validated?
  ├─→ NO → Block closure, show error message
  └─→ YES → Allow closure, log event
```

### Tech Stack

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Storage | Google Cloud Storage (preferred) | - PDF/image storage<br>- 7-year retention policy<br>- Signed URLs (secure access)<br>- $0.02/GB/month |
| Storage | Vercel Blob (alternative) | - Native Vercel integration<br>- Simpler setup<br>- $0.15/GB/month (pricier) |
| Storage | AWS S3 (fallback) | - If client prefers AWS<br>- Object Lock (immutability)<br>- $0.023/GB/month |
| Metadata DB | PostgreSQL (Vercel Postgres) | - Certificate metadata<br>- Validation status<br>- Audit trail |
| OCR (optional) | Google Vision API | - Extract cert number, date<br>- Auto-fill metadata<br>- Reduce manual entry |
| Upload UI | react-dropzone | - Drag-and-drop UX<br>- File type validation<br>- Progress indicator |

---

## Database Schema

### Table: `certificates`

```sql
CREATE TABLE certificates (
  id UUID PRIMARY KEY,
  purchase_id UUID REFERENCES purchases(id) NOT NULL,
  material_id UUID REFERENCES materials(id) NOT NULL,
  material_name VARCHAR(255) NOT NULL,
  supplier_id UUID REFERENCES suppliers(id) NOT NULL,
  supplier_name VARCHAR(255) NOT NULL,

  -- Certificate details
  certificate_number VARCHAR(100),
  certificate_type VARCHAR(50),  -- NTC, INVIAS, ISO_9001, SUPPLIER_INTERNAL, etc.
  issuing_lab VARCHAR(255),  -- Laboratory/entity that issued cert
  issue_date DATE,
  expiry_date DATE,
  lot_number VARCHAR(100),  -- Material batch/lot number

  -- Storage
  file_url VARCHAR(512) NOT NULL,  -- GCS/S3/Blob URL
  file_name VARCHAR(255) NOT NULL,
  file_size_bytes BIGINT,
  file_type VARCHAR(50),  -- PDF, JPG, PNG
  file_hash VARCHAR(64),  -- SHA-256 hash (detect tampering)

  -- Validation
  validation_status VARCHAR(50) DEFAULT 'PENDING',  -- PENDING, VALID, REJECTED, EXPIRED
  validated_by UUID REFERENCES users(id),
  validated_at TIMESTAMP,
  validation_comments TEXT,
  compliance_standards VARCHAR(255)[],  -- Array: ["NTC 121", "INVIAS 630", ...]

  -- Metadata
  uploaded_by UUID REFERENCES users(id) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reception_date DATE NOT NULL,  -- When material was received
  deadline_date DATE NOT NULL,  -- uploaded_date + 5 days
  is_missing BOOLEAN DEFAULT FALSE,  -- Alert flag if deadline passed

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_certificates_purchase ON certificates(purchase_id);
CREATE INDEX idx_certificates_material ON certificates(material_id);
CREATE INDEX idx_certificates_supplier ON certificates(supplier_id);
CREATE INDEX idx_certificates_status ON certificates(validation_status);
CREATE INDEX idx_certificates_deadline ON certificates(deadline_date) WHERE is_missing = TRUE;
```

### Table: `certificate_audit_log`

```sql
CREATE TABLE certificate_audit_log (
  id UUID PRIMARY KEY,
  certificate_id UUID REFERENCES certificates(id),
  action VARCHAR(50) NOT NULL,  -- UPLOADED, VALIDATED, REJECTED, DOWNLOADED, DELETED
  performed_by UUID REFERENCES users(id),
  old_value JSONB,
  new_value JSONB,
  ip_address VARCHAR(45),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Upload Certificate Function

**Frontend Component**

```typescript
'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';

interface UploadCertificateProps {
  purchaseId: string;
  materialName: string;
  supplierName: string;
  receptionDate: string;
}

export function UploadCertificateForm({
  purchaseId,
  materialName,
  supplierName,
  receptionDate
}: UploadCertificateProps) {
  const [uploading, setUploading] = useState(false);
  const [metadata, setMetadata] = useState({
    certificate_number: '',
    certificate_type: 'NTC',
    issuing_lab: '',
    issue_date: '',
    expiry_date: '',
    lot_number: ''
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpg', '.jpeg', '.png']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10 MB
    onDrop: async (files) => {
      const file = files[0];
      if (!file) return;

      setUploading(true);

      try {
        // 1. Upload to Vercel Blob (or GCS)
        const formData = new FormData();
        formData.append('file', file);
        formData.append('purchase_id', purchaseId);
        formData.append('metadata', JSON.stringify(metadata));

        const res = await fetch('/api/certificates/upload', {
          method: 'POST',
          body: formData
        });

        const result = await res.json();

        if (result.success) {
          alert('Certificado subido exitosamente');
          window.location.reload();
        } else {
          alert(`Error: ${result.error}`);
        }
      } catch (error) {
        console.error('Upload failed:', error);
        alert('Error al subir certificado');
      } finally {
        setUploading(false);
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
        <p>Arrastra certificado aquí o haz clic para seleccionar</p>
        <p className="text-sm text-muted-foreground">
          Formatos: PDF, JPG, PNG (máx 10 MB)
        </p>
      </div>

      {/* Metadata Form */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Número de Certificado</Label>
          <Input
            value={metadata.certificate_number}
            onChange={(e) => setMetadata({...metadata, certificate_number: e.target.value})}
            placeholder="NTC-12345"
          />
        </div>

        <div>
          <Label>Tipo de Certificado</Label>
          <select
            value={metadata.certificate_type}
            onChange={(e) => setMetadata({...metadata, certificate_type: e.target.value})}
            className="w-full border rounded p-2"
          >
            <option value="NTC">NTC (Norma Técnica Colombiana)</option>
            <option value="INVIAS">INVIAS (Instituto Vías)</option>
            <option value="ISO_9001">ISO 9001</option>
            <option value="SUPPLIER_INTERNAL">Certificado Proveedor</option>
            <option value="OTHER">Otro</option>
          </select>
        </div>

        <div>
          <Label>Laboratorio Emisor</Label>
          <Input
            value={metadata.issuing_lab}
            onChange={(e) => setMetadata({...metadata, issuing_lab: e.target.value})}
            placeholder="Laboratorio XYZ"
          />
        </div>

        <div>
          <Label>Número de Lote</Label>
          <Input
            value={metadata.lot_number}
            onChange={(e) => setMetadata({...metadata, lot_number: e.target.value})}
            placeholder="LOTE-2025-001"
          />
        </div>

        <div>
          <Label>Fecha de Emisión</Label>
          <Input
            type="date"
            value={metadata.issue_date}
            onChange={(e) => setMetadata({...metadata, issue_date: e.target.value})}
          />
        </div>

        <div>
          <Label>Fecha de Vencimiento (opcional)</Label>
          <Input
            type="date"
            value={metadata.expiry_date}
            onChange={(e) => setMetadata({...metadata, expiry_date: e.target.value})}
          />
        </div>
      </div>

      {/* Alert: Deadline */}
      <Alert>
        <p className="text-sm">
          <strong>Deadline:</strong> {new Date(receptionDate).getDate() + 5} días desde recepción
          ({receptionDate})
        </p>
      </Alert>

      {uploading && <p>Subiendo certificado...</p>}
    </div>
  );
}
```

---

**Backend API Endpoint**

```typescript
// /src/app/api/certificates/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const purchase_id = formData.get('purchase_id') as string;
  const metadata = JSON.parse(formData.get('metadata') as string);

  if (!file || !purchase_id) {
    return NextResponse.json(
      { error: 'Missing file or purchase_id' },
      { status: 400 }
    );
  }

  // 1. Calculate file hash (detect tampering)
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

  // 2. Upload to Vercel Blob (or GCS/S3)
  const blob = await put(`certificates/${purchase_id}/${Date.now()}-${file.name}`, file, {
    access: 'public', // Or 'private' with signed URLs
  });

  // 3. Store metadata in PostgreSQL
  const certificate = await db.query(`
    INSERT INTO certificates (
      purchase_id,
      material_id,
      material_name,
      supplier_id,
      supplier_name,
      certificate_number,
      certificate_type,
      issuing_lab,
      issue_date,
      expiry_date,
      lot_number,
      file_url,
      file_name,
      file_size_bytes,
      file_type,
      file_hash,
      uploaded_by,
      reception_date,
      deadline_date
    )
    SELECT
      $1,
      p.material_id,
      p.material_name,
      p.supplier_id,
      p.supplier_name,
      $2, $3, $4, $5, $6, $7,
      $8, $9, $10, $11, $12,
      $13,
      p.reception_date,
      p.reception_date + INTERVAL '5 days'
    FROM purchases p
    WHERE p.id = $1
    RETURNING *
  `, [
    purchase_id,
    metadata.certificate_number,
    metadata.certificate_type,
    metadata.issuing_lab,
    metadata.issue_date || null,
    metadata.expiry_date || null,
    metadata.lot_number,
    blob.url,
    file.name,
    file.size,
    file.type,
    fileHash,
    req.userId // Assume middleware adds userId from session
  ]);

  // 4. Update purchase status
  await db.execute(`
    UPDATE purchases
    SET has_certificate = TRUE,
        certificate_uploaded_at = CURRENT_TIMESTAMP
    WHERE id = $1
  `, [purchase_id]);

  // 5. Log audit event
  await db.execute(`
    INSERT INTO certificate_audit_log (certificate_id, action, performed_by)
    VALUES ($1, 'UPLOADED', $2)
  `, [certificate.id, req.userId]);

  return NextResponse.json({
    success: true,
    certificate_id: certificate.id,
    file_url: blob.url
  });
}
```

---

## Automatic Alerts (5-Day Deadline)

**Scheduled Job: Check missing certificates daily**

```typescript
// /src/app/api/cron/check-missing-certificates/route.ts
import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/gmail/send-email';

export async function GET() {
  // Find purchases: reception_date + 5 days < today AND no certificate
  const missingCertificates = await db.query(`
    SELECT
      p.id as purchase_id,
      p.purchase_number,
      p.material_name,
      p.supplier_name,
      p.reception_date,
      p.reception_date + INTERVAL '5 days' as deadline_date,
      u.email as responsible_email,
      u.name as responsible_name
    FROM purchases p
    JOIN users u ON p.assigned_to = u.id
    WHERE p.reception_date IS NOT NULL
      AND p.has_certificate = FALSE
      AND p.reception_date + INTERVAL '5 days' <= CURRENT_DATE
      AND p.status != 'CLOSED'
  `);

  for (const purchase of missingCertificates) {
    // Send alert email (R5)
    await sendEmail({
      to: purchase.responsible_email,
      subject: `ALERTA: Certificado faltante - ${purchase.material_name}`,
      html: `
        <h2>Certificado de Calidad Faltante</h2>

        <p>Hola ${purchase.responsible_name},</p>

        <p>La compra <strong>${purchase.purchase_number}</strong> tiene recepción confirmada
        pero <strong>NO tiene certificado de calidad</strong> subido al sistema.</p>

        <ul>
          <li><strong>Material:</strong> ${purchase.material_name}</li>
          <li><strong>Proveedor:</strong> ${purchase.supplier_name}</li>
          <li><strong>Fecha Recepción:</strong> ${purchase.reception_date}</li>
          <li><strong>Deadline:</strong> ${purchase.deadline_date} (VENCIDO)</li>
        </ul>

        <p><strong>Acción Requerida:</strong> Subir certificado inmediatamente. Sin certificado,
        la compra no se puede cerrar contablemente.</p>

        <p><a href="https://app.contecsa.com/purchases/${purchase.purchase_id}">Subir Certificado Ahora</a></p>
      `
    });

    // Mark as missing in database (for dashboard flag)
    await db.execute(`
      UPDATE purchases
      SET certificate_missing_alert_sent = TRUE,
          certificate_missing_alert_sent_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `, [purchase.purchase_id]);
  }

  return NextResponse.json({
    missing_count: missingCertificates.length,
    alerts_sent: missingCertificates.map(p => p.purchase_number)
  });
}
```

**Vercel Cron Configuration:**

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/check-missing-certificates",
      "schedule": "0 9 * * *"  // Daily at 9 AM COT (2 PM UTC)
    }
  ]
}
```

---

## Technical Validation Workflow

**Técnico validates certificate compliance**

```typescript
// /src/app/api/certificates/validate/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { certificate_id, validation_status, comments, compliance_standards } = await req.json();

  // Update certificate validation
  await db.execute(`
    UPDATE certificates
    SET
      validation_status = $1,
      validated_by = $2,
      validated_at = CURRENT_TIMESTAMP,
      validation_comments = $3,
      compliance_standards = $4
    WHERE id = $5
  `, [
    validation_status,  // VALID, REJECTED, PENDING
    req.userId,
    comments,
    compliance_standards,  // ["NTC 121", "INVIAS 630"]
    certificate_id
  ]);

  // If REJECTED → Notify Compras
  if (validation_status === 'REJECTED') {
    const cert = await db.fetch_one(`
      SELECT c.*, p.purchase_number
      FROM certificates c
      JOIN purchases p ON c.purchase_id = p.id
      WHERE c.id = $1
    `, [certificate_id]);

    await sendEmail({
      to: 'jefe.compras@contecsa.com',
      subject: `Certificado Rechazado - ${cert.material_name}`,
      html: `
        <h2>Certificado Rechazado por Técnico</h2>

        <p><strong>Compra:</strong> ${cert.purchase_number}</p>
        <p><strong>Material:</strong> ${cert.material_name}</p>
        <p><strong>Razón:</strong> ${comments}</p>

        <p><strong>Acción Requerida:</strong> Contactar proveedor para certificado correcto.</p>
      `
    });
  }

  // Log audit event
  await db.execute(`
    INSERT INTO certificate_audit_log (certificate_id, action, performed_by, new_value)
    VALUES ($1, 'VALIDATED', $2, $3)
  `, [certificate_id, req.userId, JSON.stringify({ validation_status, comments })]);

  return NextResponse.json({ success: true });
}
```

---

## Blocking Gate (Contabilidad Closure)

**Check certificate before allowing purchase closure**

```typescript
// /src/app/api/purchases/close/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { purchase_id } = await req.json();

  // 1. Check if certificate exists and is VALID
  const certificate = await db.fetch_one(`
    SELECT validation_status
    FROM certificates
    WHERE purchase_id = $1
  `, [purchase_id]);

  if (!certificate) {
    return NextResponse.json({
      error: 'MISSING_CERTIFICATE',
      message: 'No se puede cerrar la compra sin certificado de calidad. Sube el certificado primero.'
    }, { status: 400 });
  }

  if (certificate.validation_status !== 'VALID') {
    return NextResponse.json({
      error: 'CERTIFICATE_NOT_VALIDATED',
      message: `Certificado en estado: ${certificate.validation_status}. Debe estar VALIDADO por técnico.`
    }, { status: 400 });
  }

  // 2. Proceed with closure (all gates passed)
  await db.execute(`
    UPDATE purchases
    SET
      status = 'CLOSED',
      closed_by = $1,
      closed_at = CURRENT_TIMESTAMP
    WHERE id = $2
  `, [req.userId, purchase_id]);

  return NextResponse.json({ success: true, message: 'Compra cerrada exitosamente' });
}
```

---

## Certificate Search & Download

**Auditoría: Search certificates by material, supplier, date**

```typescript
// /src/app/api/certificates/search/route.ts
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const material = searchParams.get('material');
  const supplier = searchParams.get('supplier');
  const from_date = searchParams.get('from_date');
  const to_date = searchParams.get('to_date');

  const certificates = await db.query(`
    SELECT
      c.*,
      p.purchase_number,
      p.project_name
    FROM certificates c
    JOIN purchases p ON c.purchase_id = p.id
    WHERE 1=1
      ${material ? 'AND c.material_name ILIKE $1' : ''}
      ${supplier ? 'AND c.supplier_name ILIKE $2' : ''}
      ${from_date ? 'AND c.issue_date >= $3' : ''}
      ${to_date ? 'AND c.issue_date <= $4' : ''}
    ORDER BY c.issue_date DESC
  `, [
    material ? `%${material}%` : null,
    supplier ? `%${supplier}%` : null,
    from_date,
    to_date
  ].filter(Boolean));

  return NextResponse.json({ certificates });
}
```

---

## Integration with Features

| Feature | Integration Point |
|---------|-------------------|
| R3 (Purchase Tracking) | Certificate upload triggers after reception confirmed |
| R5 (Notifications) | Alert emails for missing certificates (5-day deadline) |
| R2 (Dashboard) | Show certificate status per purchase (icon: ✅ ❌ ⏳) |
| R4 (OCR) | Optional: OCR extract cert number/date from PDF |
| R11 (Google Sheets) | Export certificate list to Sheets (auditoría) |

---

## Security Considerations

| Risk | Mitigation |
|------|------------|
| Unauthorized access to certificates | RBAC (only Compras, Técnico, Contabilidad, Gerencia, Admin) |
| Certificate tampering | SHA-256 hash stored, verify on download |
| File URL leak | Signed URLs with 1h expiry (GCS/S3), not public Blob |
| DIAN compliance (7-year retention) | GCS Object Lock (immutable), automated retention policy |
| Certificate forgery | Technical validation (Técnico reviews manually) |

---

## Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Upload time (5 MB PDF) | <5s | From click to confirmation |
| Search time (100 certs) | <1s | PostgreSQL query time |
| Download time (signed URL) | <3s | GCS/S3 → browser |
| Alert latency (missing cert) | <1h | From deadline to email sent |
| Storage cost | <$5/month | 100 certificates × 2 MB × $0.02/GB |

---

## Testing Strategy

### Unit Tests
- Certificate upload (file validation, metadata storage)
- Blocking gate logic (closure prevented without cert)
- Alert trigger (5-day deadline detection)
- Hash calculation (file integrity)

### Integration Tests
- Full flow: Reception → Upload → Validate → Close
- Missing certificate alert (cron job)
- Search functionality (filters work correctly)
- Download signed URL (access control)

### User Acceptance Tests
- Compras uploads 10 certificates (different types: NTC, INVIAS, ISO)
- Técnico validates 10 certificates (approve/reject)
- Contabilidad tries to close without certificate (blocked)
- Gerencia searches certificates for auditoría

---

## Success Criteria

**MVP Acceptance:**
- [ ] Upload certificate (PDF/image) successfully
- [ ] Store metadata in PostgreSQL + file in GCS/S3/Blob
- [ ] Blocking gate works (cannot close without cert)
- [ ] Alert sent 5 days post-reception (if missing)
- [ ] Technical validation workflow functional

**Production Ready:**
- [ ] 100% of purchases with certificate (vs 0% current)
- [ ] Search/download works (auditoría use case)
- [ ] Retention policy enforced (7 years)
- [ ] User satisfaction NPS >75 (Compras, Técnico, Contabilidad)
- [ ] Zero certificate losses (vs frequent current state)

---

## Future Enhancements (Post-MVP)

1. **OCR Certificate Extraction** - Auto-extract cert number, date, lab from PDF
2. **Expiry Alerts** - Warn if certificate expires before project completion
3. **Bulk Upload** - Upload 10+ certificates at once
4. **Certificate Templates** - Pre-fill metadata for common suppliers
5. **Mobile Upload** - Native camera integration (on-site upload)
6. **Blockchain Verification** - Immutable audit trail (optional for high-value projects)

---

## References

- PRD Feature F08 (Gestión Certificados)
- Excel Analysis: docs/analisis-control-compras.md (Certificate field always empty)
- R3 (Purchase Tracking): docs/features/r03-seguimiento-compras.md (Reception workflow)
- R5 (Notifications): docs/features/r05-notificaciones.md (Alert system)
- NTC Standards: https://www.icontec.org/
- INVIAS: https://www.invias.gov.co/
