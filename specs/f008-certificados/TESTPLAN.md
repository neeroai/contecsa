# Test Plan: Gestión de Certificados

Version: 1.0 | Date: 2025-12-24 10:45 | Owner: Claude Code | Status: Active

---

## Reference

**SDD Version:** 1.0 | **Feature:** Gestión de Certificados (F008) | **Scope:** Unit + Integration + E2E | **Coverage Target:** 80% (upload, validation, blocking gate, alerts, search)

---

## Test Strategy

**Philosophy:** 80% coverage on certificate lifecycle (upload → validate → close → search). **CRITICAL:** Blocking gate must prevent closure without VALID certificate, 5-day deadline alerts 100% reliable, 7-year retention enforced. Unit tests verify file validation (10 MB max, PDF/JPG/PNG), SHA-256 hash calculation, signed URL generation. Integration tests verify full pipeline (upload → store → metadata DB → update purchase → audit log). E2E tests verify all 5 user stories (upload, validate, block closure, search, alerts). Performance tests verify upload <5s (5 MB PDF), search <1s (100 certs).

**Critical Paths:**
1. Upload certificate (Compras) → Drag-and-drop PDF → Upload to GCS/S3/Blob → Metadata DB → Update purchase status
2. Technical validation (Técnico) → View certificate → Mark VALID/REJECTED → Email if rejected (F005)
3. Blocking gate (Contabilidad) → Try close purchase → Check certificate exists AND validated → Block if not
4. 5-day deadline alert (Cron) → Query missing certificates → Email Jefe Compras (F005)

---

## Unit Tests

| Module | Test Cases | Tool | Status |
|--------|-----------|------|--------|
| File upload (upload.ts) | - uploadFile() → Stores file in GCS/S3/Blob<br>- uploadFile() with >10 MB → ERROR "Máximo 10 MB"<br>- uploadFile() with .exe → ERROR "Formato no permitido"<br>- calculateFileHash() → Returns SHA-256 hash correctly<br>- generateSignedURL() → Returns 1h expiry URL | Vitest + mocked storage | TODO |
| Blocking gate (close.ts) | - closePurchase() without certificate → ERROR "MISSING_CERTIFICATE"<br>- closePurchase() with certificate PENDING → ERROR "CERTIFICATE_NOT_VALIDATED"<br>- closePurchase() with certificate REJECTED → ERROR "CERTIFICATE_NOT_VALIDATED"<br>- closePurchase() with certificate VALID → Success, status = CLOSED<br>- closePurchase() logs audit event | Vitest + PostgreSQL test DB | TODO |
| Technical validation (validate.ts) | - validateCertificate(VALID) → Status updated, validated_at set<br>- validateCertificate(REJECTED) → Email sent (mocked F005)<br>- validateCertificate() logs audit event<br>- validateCertificate() with comments → Comments saved | Vitest + mocked F005 | TODO |
| 5-day deadline (cron.ts) | - checkMissingCertificates() → Detects purchases >5 days without cert<br>- checkMissingCertificates() → Sends email (mocked F005)<br>- checkMissingCertificates() → Updates is_missing flag<br>- checkMissingCertificates() skips already alerted | Vitest + PostgreSQL test DB | TODO |
| Search (search.ts) | - searchCertificates(material) → Filters correctly<br>- searchCertificates(supplier, date_range) → Filters correctly<br>- searchCertificates() → Returns paginated results (20 per page)<br>- searchCertificates() → Query <1s (100 certificates) | Vitest + PostgreSQL test DB | TODO |

---

## Integration Tests

| Component | Test Cases | Tool | Status |
|-----------|-----------|------|--------|
| Upload pipeline | - Full flow: Drag-and-drop → Upload to storage → Calculate hash → Insert metadata DB → Update purchase status (has_certificate = TRUE) → Audit log entry<br>- Concurrent uploads (2 users, same purchase) → Both succeed, 2 certificates linked<br>- Upload failure (storage timeout) → Rollback metadata insertion | Vitest + PostgreSQL test DB + mocked storage | TODO |
| Validation pipeline | - Full flow: Técnico marks VALID → Status updated → Audit log entry<br>- Técnico marks REJECTED → Email sent (F005) → Status updated → Audit log entry<br>- Validation with comments → Comments saved, compliance_standards array populated | Vitest + PostgreSQL test DB + mocked F005 | TODO |
| Blocking gate pipeline | - Full flow: Purchase with VALID certificate → Closure allowed → Status = CLOSED → Audit log<br>- Purchase without certificate → Closure blocked → Error message → No status change<br>- Purchase with PENDING certificate → Closure blocked → Error message | Vitest + PostgreSQL test DB | TODO |
| Alert pipeline (F005 integration) | - Full flow: 5-day deadline passed → checkMissingCertificates() → Email sent → is_missing flag updated<br>- Email sent <1 min after cron trigger<br>- Email includes purchase number, material, deadline, upload link | Vitest + mocked F005 | TODO |
| Search + Download pipeline | - Full flow: Search by material → Results displayed → Click download → Signed URL generated (1h expiry) → File accessible → Audit log entry (DOWNLOADED) | Vitest + PostgreSQL test DB + mocked storage | TODO |

---

## E2E Tests (Playwright)

**Setup:** `bun test:e2e` | **Environment:** Staging with test data

**Happy Paths:**

1. **US8.1 - Compras uploads certificate post-reception:**
   - Seed DB: Purchase with reception_date = 3 days ago, has_certificate = FALSE
   - Navigate to /purchases/[id]
   - Assert: "Subir certificado" button visible, deadline displayed (reception_date + 5 days)
   - Click "Subir certificado"
   - Drag-and-drop PDF (5 MB)
   - Fill metadata: cert_number = "NTC-12345", cert_type = "NTC", issuing_lab = "Lab XYZ", issue_date = "2025-01-01"
   - Submit form
   - Assert: Upload success message, file stored in GCS/Blob, metadata in DB, purchase status has_certificate = TRUE
   - Assert: Certificate visible in purchase detail (badge ⏳ PENDING)

2. **US8.2 - Técnico validates certificate (VALID):**
   - Seed DB: Purchase with certificate (validation_status = PENDING)
   - Navigate to /certificates/[id] (as Técnico)
   - Assert: Certificate PDF preview visible
   - Fill validation form: status = VALID, compliance_standards = ["NTC 121", "INVIAS 630"], comments = "Cumple normas"
   - Submit validation
   - Assert: Validation success message, status updated to VALID, validated_at set, audit log entry
   - Assert: Purchase detail shows badge ✅ VALID

3. **US8.3 - Contabilidad tries to close without certificate (blocked):**
   - Seed DB: Purchase with no certificate (has_certificate = FALSE)
   - Navigate to /purchases/[id] (as Contabilidad)
   - Click "Cerrar compra"
   - Assert: Error message "No se puede cerrar la compra sin certificado de calidad"
   - Assert: Purchase status still RECEIVED (not CLOSED)
   - Assert: Red alert badge displayed

4. **US8.4 - Gerencia searches certificates for auditoría:**
   - Seed DB: 10 purchases with certificates (different materials, suppliers, dates)
   - Navigate to /certificates (as Gerencia)
   - Fill search form: material = "Concreto", date_range = "2025-01-01 to 2025-12-31"
   - Submit search
   - Assert: Results filtered correctly (5 certificates for Concreto)
   - Click download button on first result
   - Assert: Signed URL generated, file downloads successfully, audit log entry (DOWNLOADED)

5. **US8.5 - Compras receives 5-day deadline alert:**
   - Seed DB: Purchase with reception_date = 6 days ago, has_certificate = FALSE
   - Trigger cron job: GET /api/cron/check-missing-certificates
   - Assert: Email sent to Jefe Compras
   - Assert: Email subject = "ALERTA: Certificado faltante - [material_name]"
   - Assert: Email body includes purchase number, material, deadline (VENCIDO), upload link
   - Assert: is_missing flag updated to TRUE
   - Assert: Dashboard shows red badge for missing certificate

**Edge Case Tests:**

6. **Upload >10 MB file (rejected):**
   - Navigate to /purchases/[id]
   - Drag-and-drop PDF (15 MB)
   - Assert: Error message "Máximo 10 MB, comprimir PDF"
   - Assert: File NOT uploaded, metadata NOT in DB

7. **Técnico validates certificate (REJECTED):**
   - Seed DB: Purchase with certificate (validation_status = PENDING)
   - Navigate to /certificates/[id] (as Técnico)
   - Fill validation form: status = REJECTED, comments = "Certificado incorrecto, falta firma"
   - Submit validation
   - Assert: Email sent to Jefe Compras (F005) with rejection reason
   - Assert: Status updated to REJECTED, purchase cannot close
   - Assert: Purchase detail shows badge 🚫 REJECTED

8. **Upload certificate with expiry_date in past (expired):**
   - Navigate to /purchases/[id]
   - Upload certificate with expiry_date = "2024-01-01" (past)
   - Assert: Warning message "Certificado expirado"
   - Assert: validation_status = EXPIRED (auto-set if expiry_date < today)
   - Assert: Purchase cannot close until new certificate uploaded

9. **Closure with VALID certificate (allowed):**
   - Seed DB: Purchase with certificate (validation_status = VALID)
   - Navigate to /purchases/[id] (as Contabilidad)
   - Click "Cerrar compra"
   - Assert: Success message "Compra cerrada exitosamente"
   - Assert: Purchase status = CLOSED, closed_at timestamp set
   - Assert: Audit log entry (PURCHASE_CLOSED)

10. **Search with no results:**
    - Navigate to /certificates
    - Fill search form: material = "Material inexistente"
    - Submit search
    - Assert: "No se encontraron certificados" message
    - Assert: Suggestion "Intenta con otro filtro"

**Performance Tests:**
- Upload 5 MB PDF <5s (from click to confirmation)
- Search 100 certificates <1s (query time)
- Download signed URL <3s (GCS/S3 → browser)
- Cron job (check missing certificates) <1 min (for 50 purchases)

**Compliance Validation (CRITICAL):**
- 7-year retention: Upload certificate → Wait simulated 7 years + 1 day → Verify file still accessible (test with mocked retention policy)
- Signed URL expiry: Generate signed URL → Wait 1h + 1 min → Verify URL returns 403 Forbidden
- File hash integrity: Upload PDF → Calculate hash → Download → Recalculate hash → Assert hashes match (detect tampering)

---

## Quality Gates CI

| Gate | Command | Target | Status |
|------|---------|--------|--------|
| Format | `bun run format --check` | 100% | TODO |
| Lint | `bun run lint` | 0 errors | TODO |
| Types | `bun run typecheck` | 0 errors | TODO |
| Unit | `bun run test` (lib/services/certificates.test.ts) | 80%+ | TODO |
| Build | `bun run build` | Exit 0 | TODO |
| E2E | `bun test:e2e` (10 scenarios) | All 10 tests pass | TODO |

---

## Manual Testing Checklist

- [ ] **CRITICAL:** Blocking gate prevents closure without VALID certificate
- [ ] **CRITICAL:** 100% purchases with certificates (vs 0% current)
- [ ] **CRITICAL:** 5-day deadline alert 100% reliable (no missed emails)
- [ ] Upload works (GCS/S3/Vercel Blob, <5s for 5 MB PDF)
- [ ] File validation works (10 MB max, PDF/JPG/PNG only)
- [ ] SHA-256 hash calculation correct (detect tampering)
- [ ] Signed URL generation works (1h expiry enforced)
- [ ] Technical validation workflow functional (VALID/REJECTED/PENDING)
- [ ] Search works (filters by material, supplier, date range)
- [ ] Download works (signed URL, audit log entry)
- [ ] Alert sent if deadline passed (5 days post-reception)
- [ ] Email sent if certificate rejected (F005 integration)
- [ ] Audit trail logs all actions (UPLOADED, VALIDATED, DOWNLOADED)
- [ ] RBAC enforced (Compras, Técnico, Contabilidad, Gerencia only)
- [ ] Dashboard shows certificate status (✅ ❌ ⏳ 🚫)
- [ ] Retention policy enforced (7 years, test with mocked policy)
- [ ] UAT with Compras + Técnico (10 uploads + validations, real workflow)

---

**Token-efficient format:** 60 lines | 10 E2E scenarios | 80%+ coverage target | CRITICAL: 100% certificates + blocking gate + 5-day alerts
