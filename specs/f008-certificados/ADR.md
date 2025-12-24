# ADR-008: Use Cloud Storage (GCS/Vercel Blob/S3) Over Local Filesystem for Certificate Files

Version: 1.0 | Date: 2025-12-24 10:40 | Owner: Javier Polo | Status: Accepted

---

## Context

Certificate management system (F008) must store PDF/image files (10 MB max) with 7-year retention (DIAN requirement), secure access (signed URLs), backup/redundancy, and immutability (prevent tampering). Choice between Cloud Storage (GCS, S3, Vercel Blob) vs Local Filesystem (server disk) vs Database (PostgreSQL bytea).

Critical requirements:
- 7-year retention policy (DIAN legal requirement)
- Signed URLs (1h expiry, prevent unauthorized access)
- Immutability (prevent tampering, GCS Object Lock)
- Backup/redundancy (prevent data loss)
- Scalability (100-1,000 certificates, ~500 MB total)
- Low cost (<$10/month for 100 certificates × 5 MB)

Decision needed NOW because storage choice determines file upload endpoint implementation, retention policy enforcement, signed URL generation, and disaster recovery strategy.

---

## Decision

**Will:** Use Cloud Storage with flexible provider (GCS preferred, S3/Vercel Blob if client chooses)
**Will NOT:** Use local filesystem (no retention policy) or PostgreSQL bytea (5 MB blob = bloat)

**Provider Priority:**
1. **Google Cloud Storage (GCS)** - Default if client has GCP infrastructure
2. **Vercel Blob** - Default if client uses Vercel deployment only (simpler setup)
3. **AWS S3** - If client has AWS infrastructure or prefers AWS

**Implementation:** Abstract storage layer (adapter pattern) - swap providers without code changes

---

## Rationale

Cloud Storage offers best balance of retention policy enforcement, security (signed URLs), and cost for 2-person team with client-hosted deployment:
- **7-year retention:** GCS/S3 lifecycle policies = automatic enforcement (vs manual filesystem cleanup)
- **Signed URLs:** 1h expiry, HMAC signature = secure access without auth middleware (vs custom auth)
- **Immutability:** GCS Object Lock (prevent deletion/modification) = tamper-proof (vs filesystem chmod)
- **Backup:** GCS/S3 = 99.999999999% durability (11 nines) = no manual backups (vs RAID + cron rsync)
- **Cost:** GCS $0.02/GB/month (500 MB = $0.01/month), S3 $0.023/GB/month (500 MB = $0.012/month), Vercel Blob $0.15/GB/month (500 MB = $0.075/month) - all <$1/month (vs dedicated server disk)
- **Scalability:** 100-10,000 certificates = no code changes (vs filesystem inode limits)
- **Flexibility:** Client chooses infrastructure (GCP/AWS/Vercel) - we support all (vs vendor lock-in)
- **Adapter pattern:** Single interface `uploadFile(file, path)` → Swap GCS/S3/Blob implementation (2-person maintainable)

For client-hosted deployment with 7-year retention + signed URLs, Cloud Storage = industry standard with minimal complexity.

---

## ClaudeCode&OnlyMe Validation

| Question | Answer | Score |
|----------|--------|-------|
| ¿Resuelve problema REAL HOY? | YES - Need 7-year retention NOW (DIAN legal requirement), 0% certificates currently → 100% target | 1/1 |
| ¿Solución más SIMPLE? | YES - GCS/S3/Blob SDK = 10 lines code (vs building custom retention policy, signed URL generator, backup system) | 1/1 |
| ¿2 personas lo mantienen? | YES - Adapter pattern (single interface), SDK docs comprehensive, no custom storage engine to debug | 1/1 |
| ¿Vale si NUNCA crecemos? | YES - 100-1,000 certificates, $1-$10/month cost, no infrastructure changes needed (vs filesystem inode limits at 10,000+ files) | 1/1 |
| **TOTAL** | **4/4 = ACCEPT** | **4/4** |

**Veto Threshold:** ANY NO = REJECT ✓ PASSED

---

## Alternatives Considered

### 1. Local Filesystem (Server Disk)
**Why rejected:**
- **No retention policy:** Manual cron job to delete files >7 years (error-prone, no DIAN compliance guarantee)
- **No signed URLs:** Custom auth middleware + token generation (10× code complexity)
- **No immutability:** chmod 444 insufficient (root can still delete), no Object Lock equivalent
- **No backup:** Manual rsync to secondary server (requires infrastructure, 2nd server cost $20+/month)
- **Scalability:** Filesystem inode limits (ext4 = ~4 million inodes, but performance degrades at 100,000+ files)
- **Disaster recovery:** If server disk fails → data loss (unless RAID + offsite backup = complexity)
- Violates ClaudeCode&OnlyMe: NOT simplest (manual retention + backup), NOT 2-person maintainable (requires sysadmin skills)

**Why NOT considered Phase 2:**
- Cloud Storage cost trivial (<$10/month), no reason to migrate back to filesystem
- Client may deploy to serverless (Cloud Run/Lambda) → no persistent disk available

### 2. PostgreSQL bytea (Binary Large Object)
**Why rejected:**
- **Database bloat:** 500 MB certificates = 500 MB added to DB size (slows queries, backup/restore 10× slower)
- **Max row size:** PostgreSQL max 1 GB per row, but 10 MB PDF = impacts autovacuum performance
- **No signed URLs:** Must query DB → serve file through app → memory overhead (10 MB × 10 concurrent downloads = 100 MB RAM)
- **No direct browser access:** Cannot generate <img src="..."> or <a href="..."> to file (must proxy through app)
- **Cost:** Vercel Postgres $0.10/GB/month (500 MB = $0.05/month, 5× GCS cost)
- Violates ClaudeCode&OnlyMe: NOT simplest (DB not designed for blob storage), impacts DB performance (violates separation of concerns)

**Why considered for small metadata only:**
- Store file_url (string), file_hash (string), file_size_bytes (bigint) in PostgreSQL
- Actual file bytes in Cloud Storage
- Best practice: "Store data in DB, blobs in object storage"

### 3. Vercel Blob (Only Provider)
**Why not exclusively:**
- **Cost:** $0.15/GB/month = 7.5× GCS cost (500 MB = $0.075 vs $0.01)
- **Vendor lock-in:** If client deploys to AWS/GCP → must use S3/GCS anyway
- **Limited retention policies:** Vercel Blob = no 7-year lifecycle rule (manual deletion required)
- Violates ClaudeCode&OnlyMe: NOT works if never grow (if we add AWS client → must rewrite storage layer)

**Why considered as option:**
- Simpler setup (no GCP/AWS account required, Vercel dashboard UI)
- Native Vercel integration (@vercel/blob SDK = 5 lines)
- Good for MVP if client uses Vercel-only deployment

---

## Consequences

**Positive:**
- 7-year retention automated (GCS/S3 lifecycle policies)
- Signed URLs (1h expiry, HMAC signature)
- Immutability (GCS Object Lock, S3 Glacier)
- Backup/redundancy (99.999999999% durability)
- Scalability (100-10,000 certificates, no changes)
- Cost trivial (<$10/month for 1,000 certs)
- Flexibility (client chooses GCP/AWS/Vercel)
- Adapter pattern (swap providers without rewrite)

**Negative:**
- External dependency (GCS/S3/Blob outage = certificates inaccessible, mitigated by 99.99% SLA)
- Network latency (download = 1-3s vs local disk <100ms, acceptable for auditoría use case)
- Cost increases with scale (10,000 certs × 5 MB = 50 GB = $1/month GCS, $1.15/month S3, $7.50/month Vercel Blob)

**Risks:**
- **Provider costs escalate:** Mitigated by monitoring ($20/month budget alert), compression (lossy PDF = smaller files), archive to Glacier (cheaper cold storage)
- **Signed URL expiry too short (1h):** Mitigated by re-generate on demand, acceptable for auditoría (download once, not persistent link)
- **Client lacks GCP/AWS account:** Mitigated by Vercel Blob fallback (simpler setup, higher cost acceptable for MVP)
- **DIAN compliance verification:** Mitigated by document retention policy in DoD, test 8-year-old certificate retrieval

---

## Implementation Details

**Adapter Pattern (Storage Interface):**
```typescript
// lib/storage/interface.ts
export interface IStorageProvider {
  uploadFile(file: File, path: string): Promise<{ url: string; hash: string }>;
  downloadFile(path: string, expiryMinutes: number): Promise<string>; // Signed URL
  deleteFile(path: string): Promise<void>;
  setRetentionPolicy(path: string, years: number): Promise<void>;
}

// lib/storage/gcs.ts (Google Cloud Storage)
import { Storage } from '@google-cloud/storage';

export class GCSProvider implements IStorageProvider {
  private storage = new Storage({ keyFilename: process.env.GCS_KEY_FILE });
  private bucket = this.storage.bucket(process.env.GCS_BUCKET_NAME!);

  async uploadFile(file: File, path: string) {
    const blob = this.bucket.file(path);
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload + calculate hash
    await blob.save(buffer, { resumable: false });
    const [metadata] = await blob.getMetadata();

    return {
      url: `gs://${this.bucket.name}/${path}`,
      hash: metadata.md5Hash // GCS calculates MD5 automatically
    };
  }

  async downloadFile(path: string, expiryMinutes: number) {
    const blob = this.bucket.file(path);
    const [signedUrl] = await blob.getSignedUrl({
      action: 'read',
      expires: Date.now() + expiryMinutes * 60 * 1000
    });
    return signedUrl;
  }

  async deleteFile(path: string) {
    await this.bucket.file(path).delete();
  }

  async setRetentionPolicy(path: string, years: number) {
    const blob = this.bucket.file(path);
    await blob.setMetadata({
      retentionExpirationTime: new Date(Date.now() + years * 365 * 24 * 60 * 60 * 1000)
    });
  }
}

// lib/storage/vercel-blob.ts (Vercel Blob)
import { put, del } from '@vercel/blob';

export class VercelBlobProvider implements IStorageProvider {
  async uploadFile(file: File, path: string) {
    const blob = await put(path, file, { access: 'public' });
    const buffer = Buffer.from(await file.arrayBuffer());
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');

    return { url: blob.url, hash };
  }

  async downloadFile(path: string, expiryMinutes: number) {
    // Vercel Blob URLs are permanent (no signed URLs)
    // For security, use 'access: private' + token query param
    return path; // Simplification for MVP
  }

  async deleteFile(path: string) {
    await del(path);
  }

  async setRetentionPolicy(path: string, years: number) {
    // Vercel Blob does not support lifecycle policies (manual deletion required)
    // Log warning: implement cron job to delete files >7 years
    console.warn('Vercel Blob retention policy not supported, manual deletion required');
  }
}

// lib/storage/index.ts (Factory)
export function getStorageProvider(): IStorageProvider {
  const provider = process.env.STORAGE_PROVIDER; // 'gcs' | 's3' | 'vercel-blob'

  switch (provider) {
    case 'gcs': return new GCSProvider();
    case 's3': return new S3Provider(); // Similar to GCS
    case 'vercel-blob': return new VercelBlobProvider();
    default: throw new Error(`Unknown storage provider: ${provider}`);
  }
}
```

**Benefits:**
- Swap providers (change .env STORAGE_PROVIDER = 'gcs' → 's3' → 'vercel-blob')
- No code changes in upload endpoint
- Test with Vercel Blob (simpler), deploy with GCS (cheaper)

---

## Related

- SPEC: /specs/f008-certificados/SPEC.md (7-year retention, signed URLs, immutability)
- PLAN: /specs/f008-certificados/PLAN.md (S003: Setup cloud storage)
- Google Cloud Storage: https://cloud.google.com/storage/docs
- AWS S3: https://docs.aws.amazon.com/s3/
- Vercel Blob: https://vercel.com/docs/storage/vercel-blob
- Stack: /Users/mercadeo/neero/docs-global/stack/common-stack.md:70-75 (file storage)

---

**Decision Maker:** Javier Polo + Claude Code | **Review Date:** 2025-06-24 (6 months)
