# Test Plan: Google Workspace Integration

Version: 1.0 | Date: 2025-12-24 11:15 | Owner: Claude Code | Status: Active

---

## Reference

**SDD Version:** 1.0 | **Feature:** Google Workspace Integration (F011) | **Scope:** Unit + Integration + E2E | **Coverage Target:** 80% (Gmail send, Sheets export, OAuth SSO)

---

## Test Strategy

**Philosophy:** 80% coverage on Gmail/Sheets services, OAuth SSO flow. **CRITICAL:** Email delivery >99%, export time <20s (10K rows), SSO 100% adoption. Unit tests verify email authentication (JWT), HTML template generation, Sheets data transformation. Integration tests verify full pipeline (send email → delivery confirmed, create Sheets → shareable link). E2E tests verify all 4 user stories (export to Sheets, daily email, SSO login, domain restriction). Performance tests verify email send <3s, Sheets export <20s (10K rows).

**Critical Paths:**
1. Send email (Gmail API) → Authenticate Service Account → Base64 encode → Send → Return message_id
2. Export to Sheets (Sheets API) → Create spreadsheet → Write data (batch) → Format headers → Generate shareable link
3. OAuth SSO login → Google consent → Callback → Verify @contecsa.com domain → Create session
4. Daily email cron → Query compras >30d → Generate HTML → Send to all users (batch)

---

## Unit Tests

| Module | Test Cases | Tool | Status |
|--------|-----------|------|--------|
| Gmail send (send-email.ts) | - sendEmail() → Authenticates with Service Account JWT<br>- sendEmail() → Encodes message in base64url format<br>- sendEmail() → Returns Gmail message_id<br>- sendEmail() with network error → Retries 3x<br>- sendEmail() with quota exceeded → ERROR "Quota exceeded" | Vitest + mocked Gmail API | TODO |
| Email templates (templates/) | - generateDailySummary() → Valid HTML (DOCTYPE, tags closed)<br>- generatePurchaseAlert() → Dynamic data injection works<br>- generateCPIAlert() → Links functional<br>- Templates render correctly (Gmail + Outlook) | Vitest + HTML validator | TODO |
| Sheets export (export.ts) | - exportToSheets() → Creates spreadsheet<br>- exportToSheets() → Writes 1,000 rows in batch<br>- exportToSheets() → Formats headers bold<br>- exportToSheets() → Generates shareable link (anyone with link)<br>- exportToSheets() with 10K rows → Completes <20s | Vitest + mocked Sheets API | TODO |
| OAuth callbacks (auth/[...nextauth]) | - signIn() with @contecsa.com email → Allowed<br>- signIn() with non-@contecsa.com → Rejected<br>- Session creation → JWT token (1h expiry)<br>- Token refresh → Auto-refresh on expiry | Vitest + NextAuth test utils | TODO |

---

## Integration Tests

| Component | Test Cases | Tool | Status |
|-----------|-----------|------|--------|
| Email send pipeline | - Full flow: Authenticate → Send email → Verify delivery (message_id returned)<br>- Retry logic: Network failure → 3 retries → Success or failure<br>- Quota handling: Quota exceeded → Queue for next day → Notify admin | Vitest + mocked Gmail API | TODO |
| Sheets export pipeline | - Full flow: Create spreadsheet → Write data (batch) → Format headers → Generate shareable link → Return URL<br>- Performance: 10,000 rows export <20s<br>- Error handling: Timeout → Suggest filters | Vitest + mocked Sheets API | TODO |
| OAuth SSO pipeline | - Full flow: Google consent → Callback → Verify domain → Create session → Redirect to dashboard<br>- Domain restriction: non-@contecsa.com → Login rejected → Error message<br>- Token refresh: Expired token → Auto-refresh → Session continues | Vitest + NextAuth + mocked OAuth | TODO |
| Daily email cron pipeline | - Full flow: Query compras >30d → Generate HTML (daily-summary template) → Send to 10 users (batch) → Log sent<br>- Email sent <15s (10 users)<br>- Audit log: All emails logged (to, subject, sent_at) | Vitest + mocked Gmail API + PostgreSQL test DB | TODO |

---

## E2E Tests (Playwright)

**Setup:** `bun test:e2e` | **Environment:** Staging with test data

**Happy Paths:**

1. **US11.1 - Jefe Compras exports dashboard to Google Sheets:**
   - Seed DB: 50 purchases with all fields (id, proyecto, proveedor, monto, estado)
   - Navigate to /dashboard (as Jefe Compras)
   - Click "Exportar a Google Sheets" button
   - Assert: Loading indicator displayed
   - Assert: Shareable link generated (opens in new tab)
   - Assert: Spreadsheet title = "Dashboard Export 2025-12-24"
   - Assert: Headers bold (ID, Proyecto, Proveedor, Monto, Estado)
   - Assert: 50 rows of data correctly exported
   - Assert: Shareable link works (anyone with link can view)

2. **US11.2 - Gerencia receives daily email summary:**
   - Seed DB: 3 compras >30d, 5 tareas pendientes
   - Trigger cron job: GET /api/cron/daily-summary
   - Assert: Email sent to gerencia@contecsa.com
   - Assert: Subject = "Resumen Diario - Sistema Compras Contecsa"
   - Assert: Body includes: 3 compras en riesgo (with links), 5 tareas pendientes
   - Assert: HTML renders correctly (header, alert box, button)
   - Assert: Links functional (click → navigate to /compras/[id])
   - Assert: Email sent <3s

3. **US11.3 - Contabilidad exports facturas pendientes to Sheets:**
   - Seed DB: 20 facturas (10 pending, 10 paid)
   - Navigate to /facturas (as Contabilidad)
   - Filter: status = "PENDING"
   - Click "Exportar a Google Sheets"
   - Assert: Shareable link generated
   - Assert: Spreadsheet contains only 10 pending facturas
   - Assert: Formulas preserved (SUM(monto) in footer)

4. **US11.4 - Técnico logs in with Google SSO:**
   - Navigate to /login
   - Click "Iniciar sesión con Google"
   - Google consent screen displayed (test account: tecnico@contecsa.com)
   - Consent → Callback to /api/auth/callback/google
   - Assert: Session created (JWT token stored)
   - Assert: Redirect to /dashboard
   - Assert: User profile displayed (name, email, profile picture)
   - Assert: No manual account creation required

**Edge Case Tests:**

5. **Gmail quota exceeded (100 emails/day):**
   - Simulate 101st email send
   - Assert: Error "Límite de emails alcanzado. Intenta mañana."
   - Assert: Email queued for next day
   - Assert: Admin notified (quota exceeded alert)

6. **Sheets export timeout (>20s for 50K rows):**
   - Attempt export of 50,000 rows
   - Assert: Error "Exportación tardó demasiado. Aplica filtros."
   - Assert: Suggestion "Exporta menos datos" displayed

7. **OAuth login with non-@contecsa.com email (rejected):**
   - Navigate to /login
   - Click "Iniciar sesión con Google"
   - Enter email: user@gmail.com (not @contecsa.com)
   - Consent → Callback
   - Assert: Login rejected
   - Assert: Error message "Solo usuarios @contecsa.com permitidos"
   - Assert: Redirect to /login

8. **OAuth token expired (auto-refresh):**
   - Login with Google SSO
   - Wait 1h + 1 min (token expired)
   - Navigate to /dashboard
   - Assert: Token auto-refreshed (silent refresh)
   - Assert: Session continues (no redirect to login)

9. **Service account delegation not configured:**
   - Disable domain-wide delegation (admin.google.com)
   - Attempt send email
   - Assert: Error "Domain-wide delegation required"
   - Assert: Link to setup guide displayed
   - Assert: Admin notified

10. **Email HTML broken rendering (Outlook):**
    - Send test email (daily-summary template)
    - Open in Outlook (desktop client)
    - Assert: HTML renders correctly (no broken layout)
    - Assert: Fallback to plain text if HTML invalid

**Performance Tests:**
- Email send <3s (from API call to Gmail confirmation)
- Sheets export 1,000 rows <5s
- Sheets export 10,000 rows <20s
- Daily email (10 users batch) <15s
- OAuth SSO login <2s (consent → session created)

---

## Quality Gates CI

| Gate | Command | Target | Status |
|------|---------|--------|--------|
| Format | `bun run format --check` | 100% | TODO |
| Lint | `bun run lint` | 0 errors | TODO |
| Types | `bun run typecheck` | 0 errors | TODO |
| Unit | `bun run test` (lib/gmail/*.test.ts, lib/sheets/*.test.ts) | 80%+ | TODO |
| Build | `bun run build` | Exit 0 | TODO |
| E2E | `bun test:e2e` (10 scenarios) | All 10 tests pass | TODO |

---

## Manual Testing Checklist

- [ ] **CRITICAL:** Email delivery rate >99% (no spam filtering)
- [ ] **CRITICAL:** Sheets export <20s (10,000 rows)
- [ ] **CRITICAL:** SSO 100% adoption (no manual account creation)
- [ ] Service Account authentication working (JWT)
- [ ] Gmail send email works (message_id returned)
- [ ] Email templates render correctly (Gmail + Outlook)
- [ ] Sheets export creates spreadsheet (shareable link works)
- [ ] Shareable link permissions (anyone with link can view)
- [ ] OAuth SSO login functional (@contecsa.com domain restriction)
- [ ] Daily email cron job (9 AM COT, emails sent <15s)
- [ ] Rate limiting enforced (Gmail 100/day, Sheets 100 req/100 sec)
- [ ] Quota monitoring (alert if >80% usage)
- [ ] Audit trail logs all emails + exports
- [ ] Error handling graceful (retry, queue, notify)
- [ ] UAT with Gerencia + Compras (daily email + export test, real workflow)

---

**Token-efficient format:** 60 lines | 10 E2E scenarios | 80%+ coverage target | CRITICAL: >99% delivery + <20s export + 100% SSO
