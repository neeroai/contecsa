# File Storage Integration Guide

Version: 1.0 | Date: 2025-12-23 00:00 | Type: Integration | Status: Active

---

## Overview

Almacenamiento en nube para archivos del sistema (facturas PDF, certificados de calidad, fotos de materiales, reportes generados) con opciones Vercel Blob, Google Cloud Storage o AWS S3 según preferencia del cliente.

**Use Cases:**
- R4 (OCR Facturas): PDF invoices scanned
- R8 (Certificados): Quality certificates (PDF/images)
- R13 (Mantenimiento): Maintenance photos, service invoices
- Reports: Generated PDF/Excel reports

---

## Storage Options Comparison

| Feature | Vercel Blob | Google Cloud Storage | AWS S3 |
|---------|-------------|---------------------|--------|
| **Integration** | Native Vercel | SDK required | SDK required |
| **Pricing** | $0.15/GB/month | $0.02/GB/month | $0.023/GB/month |
| **Egress** | Free | $0.12/GB | $0.09/GB |
| **Setup** | 1-click | Service account | IAM role |
| **CDN** | Built-in | Cloud CDN ($) | CloudFront ($) |
| **Retention** | Manual | Object Lifecycle | Object Lifecycle |
| **Encryption** | AES-256 | AES-256 | AES-256 |
| **Best For** | Quick MVP | Google Workspace users | AWS ecosystem users |

**Recommendation:** Start with Vercel Blob (simplest), migrate to GCS if cost becomes issue (>100 GB).

---

## Option 1: Vercel Blob (Recommended for MVP)

### Setup

```bash
# Install Vercel Blob SDK
npm install @vercel/blob
```

### Environment Variables

```env
# Automatically set by Vercel on deployment
# No manual configuration needed
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
```

### Implementation

```typescript
// /src/lib/storage/blob.ts
import { put, del, list } from '@vercel/blob';

export class BlobStorage {
  async uploadFile(
    file: File,
    path: string
  ): Promise<{ url: string; downloadUrl: string }> {
    const blob = await put(path, file, {
      access: 'public', // or 'private' for restricted access
      addRandomSuffix: false,
    });

    return {
      url: blob.url,
      downloadUrl: blob.downloadUrl,
    };
  }

  async deleteFile(url: string): Promise<void> {
    await del(url);
  }

  async listFiles(prefix: string): Promise<string[]> {
    const { blobs } = await list({ prefix });
    return blobs.map(b => b.url);
  }

  generateSignedUrl(url: string, expiresIn: number = 3600): string {
    // Vercel Blob doesn't support signed URLs directly
    // For private access, use API route with authentication
    return url;
  }
}
```

### API Route (Upload)

```typescript
// /src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const folder = formData.get('folder') as string; // 'invoices', 'certificates', etc.

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  // Generate path
  const timestamp = Date.now();
  const path = `${folder}/${timestamp}-${file.name}`;

  // Upload to Vercel Blob
  const blob = await put(path, file, {
    access: 'public',
  });

  return NextResponse.json({
    url: blob.url,
    downloadUrl: blob.downloadUrl,
    path,
    size: file.size,
  });
}
```

---

## Option 2: Google Cloud Storage (Cost-Effective for >100GB)

### Setup

**1. Create GCS Bucket**

```bash
# Via gcloud CLI
gcloud storage buckets create gs://contecsa-files \
  --location=us-central1 \
  --uniform-bucket-level-access

# Set retention policy (7 years for DIAN compliance)
gcloud storage buckets update gs://contecsa-files \
  --retention-period=7y
```

**2. Service Account**

```bash
# Create service account
gcloud iam service-accounts create storage-service \
  --display-name="Storage Service Account"

# Grant permissions
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:storage-service@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/storage.objectAdmin"

# Download JSON key
gcloud iam service-accounts keys create storage-key.json \
  --iam-account=storage-service@PROJECT_ID.iam.gserviceaccount.com
```

**3. Environment Variables**

```env
GCS_PROJECT_ID=contecsa-sistema-compras
GCS_BUCKET_NAME=contecsa-files
GCS_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
```

### Implementation

```typescript
// /src/lib/storage/gcs.ts
import { Storage } from '@google-cloud/storage';

export class GCSStorage {
  private storage: Storage;
  private bucketName: string;

  constructor() {
    this.storage = new Storage({
      projectId: process.env.GCS_PROJECT_ID,
      credentials: JSON.parse(process.env.GCS_SERVICE_ACCOUNT_JSON!),
    });
    this.bucketName = process.env.GCS_BUCKET_NAME!;
  }

  async uploadFile(
    file: File,
    path: string
  ): Promise<{ url: string; publicUrl: string }> {
    const bucket = this.storage.bucket(this.bucketName);
    const blob = bucket.file(path);

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload
    await blob.save(buffer, {
      metadata: {
        contentType: file.type,
      },
    });

    // Make public (optional - for invoices/certificates)
    await blob.makePublic();

    return {
      url: `gs://${this.bucketName}/${path}`,
      publicUrl: `https://storage.googleapis.com/${this.bucketName}/${path}`,
    };
  }

  async deleteFile(path: string): Promise<void> {
    await this.storage.bucket(this.bucketName).file(path).delete();
  }

  async generateSignedUrl(
    path: string,
    expiresIn: number = 3600
  ): Promise<string> {
    const [url] = await this.storage
      .bucket(this.bucketName)
      .file(path)
      .getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + expiresIn * 1000,
      });

    return url;
  }

  async listFiles(prefix: string): Promise<string[]> {
    const [files] = await this.storage.bucket(this.bucketName).getFiles({ prefix });
    return files.map(f => f.name);
  }
}
```

---

## Option 3: AWS S3 (Alternative)

### Setup

**1. Create S3 Bucket**

```bash
# Via AWS CLI
aws s3api create-bucket \
  --bucket contecsa-files \
  --region us-east-1

# Enable versioning (audit trail)
aws s3api put-bucket-versioning \
  --bucket contecsa-files \
  --versioning-configuration Status=Enabled

# Set lifecycle policy (7-year retention)
aws s3api put-bucket-lifecycle-configuration \
  --bucket contecsa-files \
  --lifecycle-configuration file://lifecycle.json
```

**2. IAM User**

```bash
# Create IAM user
aws iam create-user --user-name storage-service

# Attach policy
aws iam put-user-policy \
  --user-name storage-service \
  --policy-name S3FullAccess \
  --policy-document file://policy.json

# Create access key
aws iam create-access-key --user-name storage-service
```

**3. Environment Variables**

```env
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=us-east-1
AWS_S3_BUCKET=contecsa-files
```

### Implementation

```typescript
// /src/lib/storage/s3.ts
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export class S3Storage {
  private s3: S3Client;
  private bucketName: string;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
    this.bucketName = process.env.AWS_S3_BUCKET!;
  }

  async uploadFile(file: File, path: string): Promise<{ url: string }> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await this.s3.send(new PutObjectCommand({
      Bucket: this.bucketName,
      Key: path,
      Body: buffer,
      ContentType: file.type,
    }));

    return {
      url: `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${path}`,
    };
  }

  async deleteFile(path: string): Promise<void> {
    await this.s3.send(new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: path,
    }));
  }

  async generateSignedUrl(path: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: path,
    });

    return await getSignedUrl(this.s3, command, { expiresIn });
  }
}
```

---

## File Organization Structure

```
storage/
├── invoices/
│   ├── 2025/
│   │   ├── 01/
│   │   │   ├── 1704067200000-FAC-001.pdf
│   │   │   └── 1704153600000-FAC-002.pdf
│   │   └── 02/
│   └── 2024/
├── certificates/
│   ├── NTC/
│   │   ├── cement-cert-12345.pdf
│   │   └── concrete-cert-67890.pdf
│   └── INVIAS/
├── maintenance/
│   ├── equipment-001/
│   │   ├── service-2025-01-15.pdf
│   │   └── photo-2025-01-15.jpg
│   └── equipment-002/
└── reports/
    ├── monthly/
    │   └── 2025-01-purchases.pdf
    └── annual/
        └── 2024-summary.pdf
```

---

## Security Best Practices

| Practice | Implementation |
|----------|----------------|
| **Access Control** | Private by default, signed URLs for downloads (1h expiry) |
| **Encryption at Rest** | AES-256 (automatic in Blob, GCS, S3) |
| **Encryption in Transit** | HTTPS only (enforce in bucket policy) |
| **File Validation** | Check file type, size (<10 MB), scan for malware (ClamAV) |
| **Retention Policy** | 7 years (DIAN compliance), immutable storage (GCS Object Lock) |
| **Audit Trail** | Log all uploads/downloads in PostgreSQL |

---

## Cost Estimation

**Scenario: 100 files/month (avg 2 MB each) × 7 years retention**

| Provider | Storage (200 MB → 16.8 GB after 7 years) | Egress (10 GB/month) | Total/month |
|----------|------------------------------------------|----------------------|-------------|
| Vercel Blob | 16.8 GB × $0.15 = $2.52 | Free | **$2.52** |
| GCS | 16.8 GB × $0.02 = $0.34 | 10 GB × $0.12 = $1.20 | **$1.54** |
| AWS S3 | 16.8 GB × $0.023 = $0.39 | 10 GB × $0.09 = $0.90 | **$1.29** |

**Recommendation:** GCS or S3 for cost optimization if >100 GB storage.

---

## Integration with Features

| Feature | Files Stored | Access Pattern |
|---------|--------------|----------------|
| R4 (OCR Facturas) | Invoice PDFs (2-5 MB) | Upload → OCR → Long-term storage |
| R8 (Certificados) | Certificate PDFs (1-3 MB) | Upload → Technical validation → Archive |
| R13 (Mantenimiento) | Service photos (500 KB - 2 MB) | Upload → Attach to maintenance record |
| Reports | Generated PDFs (100 KB - 5 MB) | Generate → Store → Share link (email) |

---

## References

- Vercel Blob Docs: https://vercel.com/docs/storage/vercel-blob
- GCS Docs: https://cloud.google.com/storage/docs
- AWS S3 Docs: https://docs.aws.amazon.com/s3/
- R4 (OCR): docs/features/r04-ocr-facturas.md
- R8 (Certificates): docs/features/r08-certificados.md
