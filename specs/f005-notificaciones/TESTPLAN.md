# Test Plan: Sistema de Notificaciones

Version: 1.0 | Date: 2025-12-24 08:45 | Owner: Claude Code | Status: Active

---

## Reference

**SDD Version:** 1.0 | **Feature:** Sistema de Notificaciones (F005) | **Scope:** Unit + Integration + E2E | **Coverage Target:** 80% (email delivery, templates, schedulers)

---

## Test Strategy

**Philosophy:** 80% coverage on notification service (Gmail API send, template rendering, scheduler execution). **CRITICAL:** Delivery rate >99%, open rate >50%, time to action <4h. Unit tests verify template rendering + Gmail API integration. Integration tests verify full notification pipeline (query DB → template → send → log). E2E tests verify all 5 user stories (daily summary, immediate alerts, weekly summary). Performance tests verify email generation <2s, delivery <1 min.

**Critical Paths:**
1. Daily summary scheduler (8 AM) → Query DB per role → Generate emails → Send via Gmail → Log
2. Immediate alert trigger (invoice blocked) → Generate email → Send <1 min → Log → User opens <4h
3. User clicks unsubscribe → Updates prefs → Disables daily summary → Confirmation page
4. Email bounce → Mark user.email_valid = FALSE → Notify admin

---

## Unit Tests

| Module | Test Cases | Tool | Status |
|--------|-----------|------|--------|
| Gmail API send (gmail.ts) | - Send email successfully → Returns gmail_message_id<br>- Gmail API error 503 → Retry 3x with backoff<br>- Rate limit (429) → Queue for later<br>- Invalid email address → Error logged<br>- Message encoding (base64 URL-safe) correct | Vitest + mocked googleapis | TODO |
| Email template rendering (React Email) | - Daily summary (Gerencia) → Renders HTML, includes KPIs + risk alerts<br>- Daily summary (Compras) → Renders HTML, includes open purchases + >30 days<br>- Immediate alert (invoice blocked) → Renders HTML, [URGENTE] prefix<br>- Weekly summary (Gerencia) → Renders HTML, includes trend chart<br>- Plain text fallback (if HTML fails) | Vitest + @react-email/render | TODO |
| Alert condition logic (notifications.ts) | - Purchase >45 days → CRITICAL alert, recipients = [Jefe Compras, Gerencia, CEO]<br>- Purchase >30 days → HIGH alert, recipients = [Jefe Compras]<br>- Invoice blocked → HIGH alert, recipients = [Contabilidad, Jefe Compras]<br>- Price anomaly >10% → HIGH alert, recipients = [Compras, Gerencia] | Vitest | TODO |
| User preference filtering (prefs.ts) | - User disabled daily summary → Skip daily email, send immediate alerts only<br>- User customized time (9 AM) → Send at 9 AM (not 8 AM)<br>- User email invalid (bounced) → Skip user<br>- User no email address → Skip user, log warning | Vitest + PostgreSQL test DB | TODO |

---

## Integration Tests

| Component | Test Cases | Tool | Status |
|-----------|-----------|------|--------|
| Daily summary pipeline (daily-summary/route.ts) | - Full flow: Query DB for alerts → Generate emails (5 roles) → Send via Gmail → Log to notification_log<br>- Dedupe: If <23h since last sent → Skip (idempotency)<br>- Empty data (no alerts) → Do not send email<br>- Processing time <5 min (for 10 users) | Vitest + PostgreSQL test DB + mocked Gmail API | TODO |
| Weekly summary pipeline (weekly-summary/route.ts) | - Full flow: Query DB for weekly KPIs → Generate email (Gerencia only) → Send → Log<br>- Includes: purchases closed/open, weekly spend, top 5 suppliers, trend chart<br>- Processing time <2 min | Vitest + PostgreSQL test DB + mocked Gmail API | TODO |
| Immediate alert pipeline (notifications.ts) | - Event trigger (invoice blocked) → Generate email → Send <1 min → Log<br>- Priority escalation: CRITICAL → [URGENTE] prefix + CEO recipient<br>- Retry logic: Gmail API 503 → Retry 3x with backoff → Success | Vitest + PostgreSQL test DB + mocked Gmail API | TODO |
| Error handling | - Gmail API down (503) → Retry 3x → Queue for next daily run → Email admin if >1h<br>- Rate limit (429) → Implement 1.2s delay → Process in batches<br>- Template render fail → Fallback to plain text → Log error<br>- Email bounce (delivery_status = BOUNCED) → Mark user.email_valid = FALSE → Notify admin | Vitest + error scenarios | TODO |
| Scheduler trigger (Vercel Cron) | - Daily summary: Cron triggers at 8 AM COT (13:00 UTC) → Job executes<br>- Weekly summary: Cron triggers Monday 8 AM COT → Job executes<br>- Manual trigger (API call) → Job executes immediately | Vitest + cron simulation | TODO |

---

## E2E Tests (Playwright)

**Setup:** `bun test:e2e` | **Environment:** Staging with test users

**Happy Paths:**

1. **US5.1 - Jefe Compras daily summary (purchases >30 days):**
   - Seed DB: 3 purchases >30 days (35, 32, 28 days old)
   - Trigger daily summary cron (8 AM)
   - Assert: Email sent to Jefe Compras (liced@contecsa.com)
   - Assert: Subject = "Resumen Diario Compras - 12 activas, 3 en riesgo"
   - Assert: Email body includes:
     - "🔴 URGENTE - Compras en Riesgo (>30 días)"
     - List of 3 purchases with links
   - Assert: notification_log entry created (sent_at, gmail_message_id)

2. **US5.2 - Gerente weekly summary:**
   - Seed DB: Weekly KPIs (10 purchases closed, $45M spend, top 5 suppliers)
   - Trigger weekly summary cron (Monday 8 AM)
   - Assert: Email sent to Gerencia only (gerente@contecsa.com)
   - Assert: Subject = "Resumen Ejecutivo Semanal - Semana 3, 2025"
   - Assert: Email body includes:
     - Purchases closed vs open (last week)
     - Weekly spend total
     - Top 5 suppliers chart
     - Trend graph (12 weeks)
   - Assert: notification_log entry created

3. **US5.3 - Contabilidad immediate alert (invoice blocked):**
   - Trigger invoice blocked event (F004 validation error: amount >5%)
   - Assert: Email sent <1 min to Contabilidad + Jefe Compras
   - Assert: Subject = "[URGENTE] Factura Bloqueada - FAC-12345"
   - Assert: Email body includes:
     - Reason: "Monto difiere 6% del PO"
     - Invoice details
     - Link to invoice page
   - Assert: notification_log entry created (priority = HIGH)

4. **US5.4 - Almacén daily summary (pending receptions):**
   - Seed DB: 5 pending receptions, 3 próximos ingresos (7 días)
   - Trigger daily summary cron (10 AM for Almacén)
   - Assert: Email sent to Almacén (almacen@contecsa.com)
   - Assert: Email body includes:
     - List of 5 pending receptions
     - List of 3 próximos ingresos (next 7 days)
   - Assert: notification_log entry created

5. **US5.5 - Técnico immediate alert (requisition approved):**
   - Trigger requisition approved event (F003 state transition)
   - Assert: Email sent <1 min to Técnico creator
   - Assert: Subject = "Requisición R-042 Aprobada"
   - Assert: Email body includes:
     - Requisition details
     - Next step: "Crear orden de compra"
     - Link to create PO
   - Assert: notification_log entry created

**Edge Case Tests:**

6. **User disabled daily summary:**
   - Set user_notification_prefs.daily_summary_enabled = FALSE
   - Trigger daily summary cron
   - Assert: No email sent to that user
   - Assert: notification_log has no entry for that user

7. **Email bounce (invalid email):**
   - Set test user email = "invalid@nonexistent.com"
   - Send email
   - Assert: Gmail API returns bounce error
   - Assert: user.email_valid = FALSE
   - Assert: Admin notification sent ("User email invalid")

8. **Rate limit (>100 emails/min):**
   - Seed DB: 150 users (simulating scale)
   - Trigger daily summary cron
   - Assert: First 100 emails sent immediately
   - Assert: Remaining 50 queued with 1.2s delay
   - Assert: All 150 emails sent <3 min

9. **Gmail API down (503 error):**
   - Mock Gmail API to return 503 error
   - Trigger daily summary cron
   - Assert: Retry 3x with exponential backoff (1s, 5s, 15s)
   - Assert: After 3 failures, queued for next daily run
   - Assert: Admin notification sent ("Gmail API down >1h")

10. **Empty data (no alerts):**
    - Seed DB: No purchases >30 days, no alerts
    - Trigger daily summary cron for Compras
    - Assert: No email sent (avoid empty emails)
    - Assert: notification_log has entry "no alerts" (for audit)

11. **Unsubscribe flow:**
    - Click unsubscribe link in email footer
    - Assert: Redirects to /unsubscribe/[token]
    - Confirm unsubscribe
    - Assert: user_notification_prefs.daily_summary_enabled = FALSE
    - Assert: Confirmation page displayed
    - Next daily summary cron
    - Assert: No email sent to that user

**Performance Tests:**
- Email generation time <2s per email (measure template render)
- Email delivery <1 min (from send API call to Gmail inbox)
- Daily summary job <5 min (for 10 users, query DB → send all)
- Weekly summary job <2 min (for 1 user, generate trend chart)
- Immediate alert <1 min (from event trigger to email sent)

---

## Quality Gates CI

| Gate | Command | Target | Status |
|------|---------|--------|--------|
| Format | `bun run format --check` | 100% | TODO |
| Lint | `bun run lint` | 0 errors | TODO |
| Types | `bun run typecheck` | 0 errors | TODO |
| Unit | `bun run test` (lib/services/gmail.test.ts, lib/email-templates/*.test.tsx) | 80%+ | TODO |
| Build | `bun run build` | Exit 0 | TODO |
| E2E | `bun test:e2e` (11 scenarios) | All 11 tests pass | TODO |

---

## Manual Testing Checklist

- [ ] **CRITICAL:** Delivery rate >99% (send 100 test emails, verify 99+ delivered)
- [ ] **CRITICAL:** Open rate >50% (send 20 test emails to real users, track opens within 24h)
- [ ] **CRITICAL:** Time to action <4h (send immediate alert, measure time until user clicks link)
- [ ] Gmail API authentication working (OAuth 2.0 service account, domain-wide delegation)
- [ ] Daily summary sent at 8 AM COT (verify timezone correct: 13:00 UTC = 8 AM COT)
- [ ] Weekly summary sent Monday 8 AM COT (verify day + timezone correct)
- [ ] Immediate alerts sent <1 min (invoice blocked, price anomaly, >45 days)
- [ ] Email templates render correctly (HTML + responsive mobile/desktop)
- [ ] Personalization by role (Gerencia sees KPIs, Compras sees >30 days, etc.)
- [ ] Links in emails work (click → correct destination with UTM tracking)
- [ ] Unsubscribe flow works (updates user_notification_prefs, confirmation page)
- [ ] User preferences respected (disabled daily summary → no email sent)
- [ ] Email tracking works (opened_at logged when pixel loaded, clicked_at logged when link clicked)
- [ ] Error handling graceful (Gmail API down, bounce, rate limit, template fail)
- [ ] Retry logic works (3x with backoff: 1s, 5s, 15s)
- [ ] Admin notifications (email bounce, Gmail API down >1h, invalid emails)
- [ ] No spam complaints (test with 10 real users for 1 week)
- [ ] Integration tested: F003 (purchase >45 days), F004 (invoice blocked), F007 (price anomaly)

---

**Token-efficient format:** 75 lines | 11 E2E scenarios | 80%+ coverage target | CRITICAL: >99% delivery + >50% open rate + <4h action time
