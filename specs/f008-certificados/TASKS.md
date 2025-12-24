# TASKS: Gestión de Certificados

Version: 1.0 | Date: 2025-12-24 10:50 | Owner: Claude Code | Status: Active

---

## DOING

| ID | Task | DoD | Est |
|----|------|-----|-----|
| - | No active tasks yet | - | - |

---

## TODO (Priority Order - From PLAN.md)

| ID | Task | DoD | Est |
|----|------|-----|-----|
| T001 | Create certificates table migration (Drizzle) | - SQL migration file with 20 fields (id, purchase_id, material_id, material_name, supplier_id, supplier_name, certificate_number, certificate_type, issuing_lab, issue_date, expiry_date, lot_number, file_url, file_name, file_size_bytes, file_type, file_hash, validation_status, validated_by, validated_at, validation_comments, compliance_standards, uploaded_by, uploaded_at, reception_date, deadline_date, is_missing, created_at, updated_at)<br>- Indexes on purchase_id, material_id, supplier_id, validation_status, deadline_date (WHERE is_missing = TRUE)<br>- Foreign keys to purchases, materials, suppliers, users<br>- Default validation_status = 'PENDING' | 2h |
| T002 | Create certificate_audit_log table migration (Drizzle) | - SQL migration file with 7 fields (id, certificate_id, action, performed_by, old_value, new_value, ip_address, timestamp)<br>- Index on certificate_id + timestamp (composite)<br>- Foreign keys to certificates, users<br>- Enum: action IN (UPLOADED, VALIDATED, REJECTED, DOWNLOADED, DELETED) | 1h |
| T003 | Setup Google Cloud Storage (GCS) | - GCS bucket created: contecsa-certificates<br>- Service account key stored in .env: GCS_KEY_FILE<br>- Bucket name in .env: GCS_BUCKET_NAME<br>- Test upload/download works (via gcloud CLI)<br>- 7-year retention policy configured (lifecycle rule)<br>- Object Lock enabled (immutability) | 3h |
| T004 | Setup Vercel Blob (alternative) | - Vercel Blob token in .env: BLOB_READ_WRITE_TOKEN<br>- Test upload/download works (via @vercel/blob CLI)<br>- Document: No 7-year retention policy (manual deletion required) | 1h |
| T005 | Implement storage adapter interface | - TypeScript interface IStorageProvider with 4 methods: uploadFile(), downloadFile(), deleteFile(), setRetentionPolicy()<br>- GCSProvider implements IStorageProvider<br>- VercelBlobProvider implements IStorageProvider<br>- S3Provider implements IStorageProvider (stub for future)<br>- Factory function getStorageProvider() returns correct provider based on .env STORAGE_PROVIDER | 3h |
| T006 | Implement file upload endpoint (API route) | - /api/certificates/upload POST endpoint<br>- Parse FormData (file + metadata)<br>- Validate file: max 10 MB, PDF/JPG/PNG only → Reject if invalid<br>- Calculate SHA-256 hash (crypto.createHash)<br>- Upload to storage (getStorageProvider().uploadFile())<br>- Insert metadata to certificates table (Drizzle)<br>- Update purchase: has_certificate = TRUE, certificate_uploaded_at = NOW<br>- Insert audit log entry (action = UPLOADED)<br>- Return: { success: true, certificate_id, file_url } | 4h |
| T007 | Implement upload UI component (react-dropzone) | - Component: UploadCertificateForm (purchase_id, material_name, supplier_name, reception_date props)<br>- react-dropzone drag-and-drop area (accept PDF/JPG/PNG, max 10 MB)<br>- Form fields: certificate_number, certificate_type (select: NTC/INVIAS/ISO/SUPPLIER/OTHER), issuing_lab, lot_number, issue_date, expiry_date<br>- Display deadline: reception_date + 5 days<br>- Upload progress indicator<br>- Success/error messages<br>- Responsive (mobile + desktop) | 4h |
| T008 | Implement blocking gate (purchase closure check) | - /api/purchases/close POST endpoint<br>- Query certificates table: WHERE purchase_id = $1<br>- If no certificate → Return { error: 'MISSING_CERTIFICATE', message: '...' }, HTTP 400<br>- If certificate.validation_status != 'VALID' → Return { error: 'CERTIFICATE_NOT_VALIDATED', message: '...' }, HTTP 400<br>- If certificate.validation_status = 'VALID' → Proceed with closure: UPDATE purchases SET status = 'CLOSED', closed_by = $1, closed_at = NOW<br>- Insert audit log entry (action = PURCHASE_CLOSED)<br>- Return: { success: true } | 3h |
| T009 | Implement technical validation endpoint | - /api/certificates/validate POST endpoint<br>- Input: certificate_id, validation_status (VALID/REJECTED/PENDING), comments, compliance_standards[]<br>- Update certificates table: validation_status, validated_by, validated_at = NOW, validation_comments, compliance_standards<br>- Insert audit log entry (action = VALIDATED)<br>- If validation_status = REJECTED → Call F005.sendEmail(to: Jefe Compras, subject: 'Certificado Rechazado', body: '...')<br>- Return: { success: true } | 3h |
| T010 | Implement validation UI (Técnico) | - Page: /certificates/[id] (Técnico only, RBAC)<br>- Display certificate metadata (material, supplier, cert number, dates)<br>- PDF preview (iframe with signed URL)<br>- Validation form: status (select: VALID/REJECTED/PENDING), compliance_standards (multi-select: NTC, INVIAS, ISO), comments (textarea, max 500 chars)<br>- Submit → POST /api/certificates/validate<br>- Success message + redirect to /certificates | 3h |
| T011 | Implement 5-day deadline alert (cron job) | - /api/cron/check-missing-certificates GET endpoint<br>- Query: SELECT * FROM purchases WHERE reception_date + INTERVAL '5 days' <= CURRENT_DATE AND has_certificate = FALSE AND status != 'CLOSED'<br>- For each purchase → Call F005.sendEmail(to: Jefe Compras, subject: 'Certificado faltante', body: purchase details + deadline + upload link)<br>- Update purchases: certificate_missing_alert_sent = TRUE, certificate_missing_alert_sent_at = NOW<br>- Update certificates: is_missing = TRUE (if record exists)<br>- Return: { missing_count, alerts_sent[] } | 3h |
| T012 | Configure Vercel cron for daily alerts | - vercel.json cron config: { path: '/api/cron/check-missing-certificates', schedule: '0 9 * * *' } → Daily at 9 AM COT (2 PM UTC)<br>- Test cron trigger (Vercel dashboard)<br>- Verify email sent <1 min after trigger | 1h |
| T013 | Implement certificate search API | - /api/certificates/search GET endpoint<br>- Query params: material (string), supplier (string), from_date (date), to_date (date), page (number), limit (number)<br>- Query certificates table with filters: material ILIKE '%$1%', supplier ILIKE '%$2%', issue_date BETWEEN $3 AND $4<br>- JOIN purchases to get purchase_number, project_name<br>- Paginate: LIMIT $5 OFFSET ($6 - 1) * $5<br>- Return: { certificates[], total_count, page, limit } | 3h |
| T014 | Implement certificate download (signed URL) | - /api/certificates/[id]/download GET endpoint<br>- Query certificate: file_url from certificates table<br>- Generate signed URL: getStorageProvider().downloadFile(file_url, expiryMinutes: 60)<br>- Insert audit log entry (action = DOWNLOADED, performed_by = req.userId)<br>- Return: { signed_url } (1h expiry) | 2h |
| T015 | Implement search UI (auditoría) | - Page: /certificates (Gerencia, Contabilidad, Admin only)<br>- Search form: material (input), supplier (input), date_range (date picker: from_date, to_date)<br>- Submit → GET /api/certificates/search<br>- Results table: material, supplier, cert number, issue_date, validation_status (badge), download button<br>- Pagination (20 per page)<br>- Download button → GET /api/certificates/[id]/download → Open signed URL in new tab<br>- Responsive (mobile + desktop) | 4h |
| T016 | Integrate with F003 (purchase tracking) | - Hook in F003 reception workflow: On reception confirmed (status = RECEIVED) → Display "Subir certificado" button in purchase detail<br>- Display deadline: reception_date + 5 days (red if passed, yellow if <2 days, green if >2 days)<br>- Link button → Open upload form modal (UploadCertificateForm component) | 2h |
| T017 | Integrate with F002 (dashboard) | - Add certificate status badge to purchase list: ✅ VALID (green), ❌ MISSING (red), ⏳ PENDING (yellow), 🚫 REJECTED (red)<br>- Badge query: JOIN certificates ON purchase_id, display validation_status<br>- Filter by certificate status: "Solo sin certificado", "Solo pendientes", "Solo rechazados"<br>- Click badge → Navigate to certificate detail (/certificates/[id]) | 3h |
| T018 | Write unit tests for file upload | - Test: uploadFile() → Uploads to storage, calculates hash, inserts metadata DB<br>- Test: uploadFile() with >10 MB → ERROR "Máximo 10 MB"<br>- Test: uploadFile() with .exe → ERROR "Formato no permitido"<br>- Test: calculateFileHash() → Returns SHA-256 hash correctly<br>- Coverage >80% | 3h |
| T019 | Write unit tests for blocking gate | - Test: closePurchase() without certificate → ERROR "MISSING_CERTIFICATE"<br>- Test: closePurchase() with certificate PENDING → ERROR "CERTIFICATE_NOT_VALIDATED"<br>- Test: closePurchase() with certificate VALID → Success, status = CLOSED<br>- Test: closePurchase() logs audit event<br>- Coverage >80% | 2h |
| T020 | Write unit tests for validation | - Test: validateCertificate(VALID) → Status updated, validated_at set<br>- Test: validateCertificate(REJECTED) → Email sent (mocked F005)<br>- Test: validateCertificate() logs audit event<br>- Coverage >80% | 2h |
| T021 | Write unit tests for 5-day deadline alert | - Test: checkMissingCertificates() → Detects purchases >5 days without cert<br>- Test: checkMissingCertificates() → Sends email (mocked F005)<br>- Test: checkMissingCertificates() → Updates is_missing flag<br>- Test: checkMissingCertificates() skips already alerted<br>- Coverage >80% | 2h |
| T022 | Write unit tests for search | - Test: searchCertificates(material) → Filters correctly<br>- Test: searchCertificates(supplier, date_range) → Filters correctly<br>- Test: searchCertificates() → Paginated results (20 per page)<br>- Coverage >80% | 2h |
| T023 | Write integration test for upload pipeline | - Test: Full flow: Upload → Storage → Metadata DB → Update purchase → Audit log<br>- Test: Concurrent uploads (2 users, same purchase) → Both succeed<br>- Coverage >80% | 3h |
| T024 | Write integration test for blocking gate pipeline | - Test: Purchase with VALID certificate → Closure allowed<br>- Test: Purchase without certificate → Closure blocked<br>- Test: Purchase with PENDING certificate → Closure blocked<br>- Coverage >80% | 2h |
| T025 | Write integration test for alert pipeline | - Test: 5-day deadline passed → checkMissingCertificates() → Email sent → is_missing updated<br>- Test: Email sent <1 min after cron trigger<br>- Coverage >80% | 2h |
| T026 | Write E2E test for US8.1 (upload certificate) | - Seed DB: Purchase with reception_date = 3 days ago<br>- Navigate /purchases/[id]<br>- Upload PDF (5 MB)<br>- Assert: Upload success, file in storage, metadata in DB, purchase has_certificate = TRUE<br>- Test passes | 3h |
| T027 | Write E2E test for US8.2 (validate certificate) | - Seed DB: Purchase with certificate (PENDING)<br>- Navigate /certificates/[id] (as Técnico)<br>- Validate: status = VALID, comments = "Cumple normas"<br>- Assert: Status updated, audit log entry<br>- Test passes | 2h |
| T028 | Write E2E test for US8.3 (blocking gate) | - Seed DB: Purchase without certificate<br>- Navigate /purchases/[id] (as Contabilidad)<br>- Try close → Assert: Error "Certificado faltante"<br>- Test passes | 2h |
| T029 | Write E2E test for US8.4 (search certificates) | - Seed DB: 10 purchases with certificates<br>- Navigate /certificates<br>- Search by material → Assert: Results filtered<br>- Download → Assert: Signed URL generated<br>- Test passes | 3h |
| T030 | Write E2E test for US8.5 (5-day deadline alert) | - Seed DB: Purchase with reception_date = 6 days ago, no certificate<br>- Trigger cron → Assert: Email sent, is_missing = TRUE<br>- Test passes | 2h |
| T031 | Write E2E tests for edge cases | - Test: Upload >10 MB → Rejected<br>- Test: Validate REJECTED → Email sent<br>- Test: Closure with VALID certificate → Allowed<br>- Test: Search with no results → Message displayed<br>- All 4 tests pass | 3h |
| T032 | Performance test upload/search | - Measure: Upload 5 MB PDF <5s (from click to confirmation)<br>- Measure: Search 100 certificates <1s (query time)<br>- Measure: Download signed URL <3s (GCS/S3 → browser)<br>- Optimize if slower | 3h |
| T033 | Compliance validation (7-year retention) | - Test: Upload certificate → Verify retention policy set (7 years)<br>- Test: Signed URL expiry → Generate URL → Wait 1h + 1 min → Verify 403 Forbidden<br>- Test: File hash integrity → Upload → Download → Recalculate hash → Assert match<br>- Document results in TESTPLAN.md | 3h |
| T034 | UAT with Compras + Técnico (pilot) | - Schedule UAT session with 2 users (Compras + Técnico)<br>- Test: Compras uploads 10 certificates (different types: NTC, INVIAS, ISO)<br>- Test: Técnico validates 10 certificates (approve/reject)<br>- Test: Contabilidad tries to close without certificate (blocked)<br>- Test: Gerencia searches certificates for auditoría<br>- Collect feedback (NPS survey)<br>- Measure: Upload time <5s/certificate<br>- Sign-off from both users | 6h |

**Total Estimated Time:** 80 hours (~3-4 weeks)

---

## BLOCKED

| ID | Task | Blocker | Notes |
|----|------|---------|-------|
| T016 | F003 integration | F003 not fully implemented yet | Can mock F003 purchase reception workflow for testing |
| T017 | F002 integration | F002 not fully implemented yet | Can add certificate badge to purchase list independently |
| T009 | Rejection email (F005) | F005 not fully implemented yet | Can mock F005.sendEmail() for testing |
| T011 | 5-day alert email (F005) | F005 not fully implemented yet | Can mock F005.sendEmail() for testing |

---

## DONE

| ID | Task | Closed | Commit |
|----|------|--------|--------|
| - | Migration to SDD | 2025-12-24 | TBD |

---

**Dependencies:**
- T001-T002 independent (table migrations)
- T003-T004 independent (storage setup, choose one)
- T005 depends on T003 OR T004 (adapter pattern requires storage provider)
- T006 depends on T001, T005 (certificates table + storage adapter)
- T007 depends on T006 (upload UI calls upload endpoint)
- T008 depends on T001 (blocking gate checks certificates table)
- T009 depends on T001, F005 (validation endpoint + email)
- T010 depends on T009 (validation UI calls validation endpoint)
- T011 depends on T001, F005 (cron job + email)
- T012 depends on T011 (cron config requires endpoint)
- T013 depends on T001 (search queries certificates table)
- T014 depends on T001, T005 (download generates signed URL)
- T015 depends on T013, T014 (search UI calls search + download endpoints)
- T016 depends on T007, F003 (integration requires upload form + F003 reception)
- T017 depends on T001, F002 (dashboard badge queries certificates table)
- T018-T025 depend on T006-T013 (tests require modules implemented)
- T026-T031 depend on T007-T017 (E2E tests require full UI)
- T032-T034 depend on T026-T031 (performance + UAT require E2E tests pass)

**CRITICAL PRIORITY:**
- T008 (blocking gate) is CRITICAL success metric - Must prevent closure without VALID certificate
- T011-T012 (5-day deadline alert) is CRITICAL - Must be 100% reliable (no missed emails)
- T033 (7-year retention) is CRITICAL - DIAN compliance requirement

---

**Last updated:** 2025-12-24 10:50 | Maintained by: Claude Code
