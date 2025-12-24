# TASKS: Google Workspace Integration

Version: 1.0 | Date: 2025-12-24 11:20 | Owner: Claude Code | Status: Active

---

## DOING

| ID | Task | DoD | Est |
|----|------|-----|-----|
| - | No active tasks yet | - | - |

---

## TODO (Priority Order - From PLAN.md)

| ID | Task | DoD | Est |
|----|------|-----|-----|
| T001 | Setup GCP project "contecsa-sistema" | - GCP project created via console<br>- Project ID stored in .env: GCP_PROJECT_ID<br>- Billing enabled (verify in GCP console)<br>- Test: `gcloud projects describe contecsa-sistema` → Success | 1h |
| T002 | Create service account with Gmail/Sheets/Drive APIs | - Service account created: contecsa-sistema@PROJECT_ID.iam.gserviceaccount.com<br>- JSON key downloaded to secure location<br>- APIs enabled: Gmail, Sheets, Drive (verify in GCP console)<br>- Key stored in .env: GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY (base64 encoded)<br>- Test: `gcloud iam service-accounts list` → Shows service account | 2h |
| T003 | Configure domain-wide delegation (admin.google.com) | - Admin Console → Security → API Controls → Domain-wide Delegation<br>- Client ID added with scopes: gmail.send, spreadsheets, drive.file<br>- Delegation verified (test with gcloud CLI)<br>- Setup guide documented in docs/google-workspace-setup.md<br>- Test: Send test email works | 3h |
| T004 | Implement Gmail send email service (lib/gmail/send-email.ts) | - Function: sendEmail(to, subject, html) → Returns message_id<br>- JWT authentication (service account)<br>- Base64url encoding (RFC 4648)<br>- Error handling: Retry 3x with exponential backoff (1s, 2s, 4s)<br>- Quota tracking: Log emails_sent_count<br>- Test: Send test email → Delivery confirmed, message_id returned | 4h |
| T005 | Create email templates (lib/gmail/templates/) | - Templates: daily-summary.ts, purchase-alert.ts, cpi-alert.ts, certificate-missing.ts<br>- HTML valid: DOCTYPE, style tags, responsive (Gmail + Outlook tested)<br>- Dynamic data injection: TypeScript functions with type-safe parameters<br>- Links functional: Absolute URLs (https://sistema.contecsa.com/...)<br>- Test: Render 4 templates → HTML validates (validator.w3.org), opens correctly in Gmail + Outlook | 4h |
| T006 | Implement Sheets export service (lib/sheets/export.ts) | - Function: exportToSheets(title, data, headers) → Returns URL<br>- Create spreadsheet with title (e.g., "Dashboard Export 2025-12-24")<br>- Write data in batches (1,000 rows per batch request)<br>- Format headers: Bold, background color (#f3f4f6)<br>- Generate shareable link: anyone with link can view<br>- Test: Export 1,000 rows <5s, 10,000 rows <20s, shareable link works | 5h |
| T007 | Implement export API endpoint (/api/export/sheets POST) | - Input validation: max 10,000 rows, required fields (title, data, headers)<br>- Call exportToSheets() with validated data<br>- Insert audit log entry (sheets_export_created)<br>- Error handling: Timeout >20s → ERROR "Exportación tardó demasiado"<br>- Return: { success: true, url, spreadsheet_id, created_at }<br>- Test: POST /api/export/sheets → URL returned, audit log entry created | 3h |
| T008 | Create export button component (components/ExportToSheetsButton.tsx) | - Component with loading state (spinner + "Exportando...")<br>- POST /api/export/sheets with data from props<br>- Success → Open URL in new tab (window.open(url, '_blank'))<br>- Error messages: quota exceeded, timeout, network failure<br>- Responsive (mobile + desktop)<br>- Test: Click button → Loading indicator → Success opens Sheets in new tab | 4h |
| T009 | Implement OAuth 2.0 SSO (/api/auth/[...nextauth]/route.ts) | - NextAuth.js with Google Provider<br>- Domain restriction: signIn callback → Check email ends with @contecsa.com → Reject others<br>- Session callbacks: JWT token (1h expiry), profile picture URL<br>- Refresh token: Auto-refresh on expiry (silent refresh)<br>- Test: Login with @contecsa.com → Allowed, login with @gmail.com → Rejected | 4h |
| T010 | Integrate Gmail with F005 (notificaciones) | - Hook F005.sendImmediateAlert() → Call lib/gmail/send-email.ts<br>- Replace mocked email with Gmail API<br>- Pass alert data to email template (purchase-alert.ts or cpi-alert.ts)<br>- Insert audit log entry (email_sent)<br>- Test: Trigger F005 alert → Email sent via Gmail API, delivery confirmed | 3h |
| T011 | Create daily email cron endpoint (/api/cron/daily-summary GET) | - Query: SELECT * FROM purchases WHERE status = 'IN_PROGRESS' AND (CURRENT_DATE - reception_date) > 30<br>- Query: SELECT * FROM tasks WHERE status = 'PENDING' AND due_date < CURRENT_DATE<br>- Generate email: daily-summary template with compras en riesgo + tareas pendientes<br>- Send to all users: Gerencia + Compras (batch 10 users)<br>- Insert audit log entries (email_sent for each)<br>- Test: GET /api/cron/daily-summary → Emails sent <15s (10 users batch) | 4h |
| T012 | Configure Vercel cron (vercel.json) | - Cron config: { path: '/api/cron/daily-summary', schedule: '0 14 * * *' }<br>- Schedule: Daily at 9 AM COT (14:00 UTC)<br>- Deploy to Vercel<br>- Test: Cron triggers daily (verify in Vercel logs), emails sent <1 min after trigger | 1h |
| T013 | Add export button to dashboard (F002 integration) | - Page: /dashboard (all roles)<br>- Export button: "Exportar a Google Sheets" (icon + text)<br>- Click → Gather KPIs data (same data displayed in dashboard)<br>- Call ExportToSheetsButton component with title = "Dashboard Export [date]"<br>- Test: Click button → Shareable link opens, data matches dashboard UI | 3h |
| T014 | Add export button to purchase list (F003 integration) | - Page: /compras (Compras, Gerencia, Admin roles)<br>- Export button: "Exportar a Google Sheets" (top-right)<br>- Click → Gather all purchases data (filtered by current view)<br>- Call ExportToSheetsButton with title = "Compras Export [date]"<br>- Test: Click button → Shareable link opens, all purchases exported correctly | 3h |
| T015 | Write unit tests for Gmail send email | - Test: sendEmail() → Authenticates with Service Account JWT<br>- Test: sendEmail() → Encodes message in base64url format<br>- Test: sendEmail() → Returns Gmail message_id<br>- Test: sendEmail() with network error → Retries 3x<br>- Test: sendEmail() with quota exceeded → ERROR "Quota exceeded"<br>- Coverage >80% | 3h |
| T016 | Write unit tests for email templates | - Test: generateDailySummary() → Valid HTML (DOCTYPE, tags closed)<br>- Test: generatePurchaseAlert() → Dynamic data injection works<br>- Test: generateCPIAlert() → Links functional<br>- Test: Templates render correctly (validator.w3.org)<br>- Coverage >80% | 2h |
| T017 | Write unit tests for Sheets export | - Test: exportToSheets() → Creates spreadsheet<br>- Test: exportToSheets() → Writes 1,000 rows in batch<br>- Test: exportToSheets() → Formats headers bold<br>- Test: exportToSheets() → Generates shareable link (anyone with link)<br>- Test: exportToSheets() with 10K rows → Completes <20s<br>- Coverage >80% | 3h |
| T018 | Write unit tests for OAuth callbacks | - Test: signIn() with @contecsa.com email → Allowed<br>- Test: signIn() with non-@contecsa.com → Rejected<br>- Test: Session creation → JWT token (1h expiry)<br>- Test: Token refresh → Auto-refresh on expiry<br>- Coverage >80% | 2h |
| T019 | Write integration test for email send pipeline | - Test: Full flow: Authenticate → Send email → Verify delivery (message_id returned)<br>- Test: Retry logic: Network failure → 3 retries → Success or failure<br>- Test: Quota handling: Quota exceeded → Queue for next day → Notify admin<br>- Coverage >80% | 3h |
| T020 | Write integration test for Sheets export pipeline | - Test: Full flow: Create spreadsheet → Write data (batch) → Format headers → Generate shareable link → Return URL<br>- Test: Performance: 10,000 rows export <20s<br>- Test: Error handling: Timeout → Suggest filters<br>- Coverage >80% | 3h |
| T021 | Write integration test for OAuth SSO pipeline | - Test: Full flow: Google consent → Callback → Verify domain → Create session → Redirect to dashboard<br>- Test: Domain restriction: non-@contecsa.com → Login rejected → Error message<br>- Test: Token refresh: Expired token → Auto-refresh → Session continues<br>- Coverage >80% | 2h |
| T022 | Write integration test for daily email cron pipeline | - Test: Full flow: Query compras >30d → Generate HTML (daily-summary template) → Send to 10 users (batch) → Log sent<br>- Test: Email sent <15s (10 users)<br>- Test: Audit log: All emails logged (to, subject, sent_at)<br>- Coverage >80% | 2h |
| T023 | Write E2E test for US11.1 (export dashboard to Sheets) | - Seed DB: 50 purchases with all fields<br>- Navigate /dashboard (as Jefe Compras)<br>- Click "Exportar a Google Sheets" button<br>- Assert: Loading indicator displayed<br>- Assert: Shareable link generated (opens in new tab)<br>- Assert: Spreadsheet title = "Dashboard Export 2025-12-24"<br>- Assert: Headers bold, 50 rows correctly exported<br>- Test passes | 3h |
| T024 | Write E2E test for US11.2 (daily email summary) | - Seed DB: 3 compras >30d, 5 tareas pendientes<br>- Trigger cron job: GET /api/cron/daily-summary<br>- Assert: Email sent to gerencia@contecsa.com<br>- Assert: Subject = "Resumen Diario - Sistema Compras Contecsa"<br>- Assert: Body includes: 3 compras en riesgo, 5 tareas pendientes<br>- Assert: HTML renders correctly, links functional<br>- Test passes | 3h |
| T025 | Write E2E test for US11.3 (export facturas to Sheets) | - Seed DB: 20 facturas (10 pending, 10 paid)<br>- Navigate /facturas (as Contabilidad)<br>- Filter: status = "PENDING"<br>- Click "Exportar a Google Sheets"<br>- Assert: Shareable link generated<br>- Assert: Spreadsheet contains only 10 pending facturas<br>- Test passes | 2h |
| T026 | Write E2E test for US11.4 (SSO login) | - Navigate /login<br>- Click "Iniciar sesión con Google"<br>- Google consent screen displayed (test account: tecnico@contecsa.com)<br>- Consent → Callback to /api/auth/callback/google<br>- Assert: Session created (JWT token stored)<br>- Assert: Redirect to /dashboard<br>- Assert: User profile displayed (name, email, profile picture)<br>- Test passes | 2h |
| T027 | Write E2E tests for edge cases | - Test: Gmail quota exceeded (101st email) → Error + queued for next day<br>- Test: Sheets export timeout (50K rows) → Error "Aplica filtros"<br>- Test: OAuth login with non-@contecsa.com → Login rejected<br>- Test: OAuth token expired → Auto-refresh (silent refresh)<br>- Test: Service account delegation not configured → Error + setup guide link<br>- All 5 tests pass | 3h |
| T028 | Performance test email/export | - Measure: Email send <3s (from API call to Gmail confirmation)<br>- Measure: Sheets export 1,000 rows <5s<br>- Measure: Sheets export 10,000 rows <20s<br>- Measure: Daily email (10 users batch) <15s<br>- Measure: OAuth SSO login <2s (consent → session created)<br>- Optimize if slower | 3h |
| T029 | Manual testing checklist | - CRITICAL: Email delivery rate >99% (no spam filtering)<br>- CRITICAL: Sheets export <20s (10,000 rows)<br>- CRITICAL: SSO 100% adoption (no manual account creation)<br>- Service Account authentication working (JWT)<br>- Gmail send email works (message_id returned)<br>- Email templates render correctly (Gmail + Outlook)<br>- Sheets export creates spreadsheet (shareable link works)<br>- Shareable link permissions (anyone with link can view)<br>- OAuth SSO login functional (@contecsa.com domain restriction)<br>- Daily email cron job (9 AM COT, emails sent <15s)<br>- Rate limiting enforced (Gmail 100/day, Sheets 100 req/100 sec)<br>- Quota monitoring (alert if >80% usage)<br>- Audit trail logs all emails + exports<br>- Error handling graceful (retry, queue, notify)<br>- All 14 checks pass | 4h |
| T030 | UAT with Gerencia + Compras (pilot) | - Schedule UAT session with 2 users (Gerencia + Jefe Compras)<br>- Test: Gerencia receives daily email (verify HTML + links)<br>- Test: Jefe Compras exports dashboard to Sheets (verify data + formatting)<br>- Test: Contabilidad exports facturas pendientes to Sheets<br>- Test: Técnico logs in with Google SSO (@contecsa.com)<br>- Collect feedback (NPS survey)<br>- Measure: Export time <5 min (2h manual process → 5 min with 1-click)<br>- Sign-off from both users | 6h |

**Total Estimated Time:** 85 hours (~3-4 weeks)

---

## BLOCKED

| ID | Task | Blocker | Notes |
|----|------|---------|-------|
| T010 | Gmail integration with F005 | F005 not fully implemented yet | Can mock F005.sendImmediateAlert() for testing |
| T013 | Dashboard export button (F002) | F002 not fully implemented yet | Can add export button to dashboard independently |
| T014 | Purchase list export button (F003) | F003 not fully implemented yet | Can add export button to purchase list independently |

---

## DONE

| ID | Task | Closed | Commit |
|----|------|--------|--------|
| - | Migration to SDD | 2025-12-24 | TBD |

---

**Dependencies:**
- T001-T003 independent (GCP setup, service account, delegation)
- T004 depends on T002 (Gmail service requires service account)
- T005 independent (email templates)
- T006 depends on T002 (Sheets service requires service account)
- T007 depends on T006 (export endpoint calls Sheets service)
- T008 depends on T007 (export button calls export endpoint)
- T009 independent (OAuth SSO setup)
- T010 depends on T004, F005 (Gmail integration requires Gmail service + F005)
- T011 depends on T004, T005 (daily email cron requires Gmail service + templates)
- T012 depends on T011 (Vercel cron config requires endpoint)
- T013 depends on T008, F002 (dashboard export requires button component + F002)
- T014 depends on T008, F003 (purchase list export requires button component + F003)
- T015-T018 depend on T004-T009 (unit tests require modules implemented)
- T019-T022 depend on T004-T011 (integration tests require full pipeline)
- T023-T027 depend on T008-T014 (E2E tests require full UI)
- T028-T030 depend on T023-T027 (performance + UAT require E2E tests pass)

**CRITICAL PRIORITY:**
- T004 (Gmail send email) is CRITICAL - Email delivery >99% required
- T006 (Sheets export) is CRITICAL - Export <20s (10,000 rows) required
- T009 (OAuth SSO) is CRITICAL - SSO 100% adoption required
- T011-T012 (daily email cron) is CRITICAL - Must be 100% reliable (no missed emails)

---

**Last updated:** 2025-12-24 11:20 | Maintained by: Claude Code
