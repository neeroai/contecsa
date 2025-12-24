# SDD Implementation Plan: Google Workspace Integration

Version: 1.0 | Date: 2025-12-24 11:05 | Owner: Javier Polo | Status: Active

---

## Reference

**SPEC:** /specs/f011-google-workspace/SPEC.md
**ADR:** /specs/f011-google-workspace/ADR.md (Gmail API + Service Account decision)
**PRD:** docs/features/r11-google-workspace.md
**CRITICAL:** 95% reduction export time (2h → 5 min), 100% SSO adoption

---

## Stack Validated

**Gmail API:** REST API v1 + googleapis npm package
- Source: /Users/mercadeo/neero/docs-global/stack/common-stack.md:50-55 (third-party APIs)
- Use case: Send emails (notifications, alerts), track delivery status
- Rate limit: 250 req/sec, 100 emails/day (free) / 2000/day (Workspace)

**Sheets API:** REST API v4 + googleapis npm package
- Source: /Users/mercadeo/neero/docs-global/stack/common-stack.md:50-55
- Use case: Create spreadsheets, write data (batch), format headers, shareable links
- Rate limit: 100 req/100 sec/user

**OAuth 2.0:** NextAuth.js + Google Provider
- Source: /Users/mercadeo/neero/docs-global/stack/common-stack.md:40-45 (authentication)
- Use case: SSO login (@contecsa.com domain restriction)
- Scopes: openid, profile, email

**Service Account:** Google Cloud IAM
- Source: /Users/mercadeo/neero/docs-global/stack/common-stack.md:50-55
- Use case: Automated emails/exports (no user consent required)
- Requires: Domain-wide delegation (admin consent)

**Scheduler:** Vercel Cron
- Source: /Users/mercadeo/neero/docs-global/stack/common-stack.md:80-85 (cron jobs)
- Use case: Daily email summaries (9 AM COT)

**Validation Checklist:**
- [x] Stack matches docs-global/stack/ (5 citations)
- [x] NO INVENTAR protocol applied
- [x] ClaudeCode&OnlyMe filter passed (see ADR.md)
- [x] Dependencies: F005 (notifications), F002 (dashboard export), F003 (purchase export)
- [x] Limitations: MVP = Service Account only (no per-user OAuth for emails/exports), max 10,000 rows export

---

## Implementation Steps (11 steps)

### S001: Setup Google Cloud project + service account
**Deliverable:** GCP project "contecsa-sistema", service account with Gmail + Sheets + Drive API enabled, JSON key downloaded, domain-wide delegation configured (admin.google.com)
**Dependencies:** Google Workspace admin access
**Acceptance:** Service account email exists, JSON key stored in .env, delegation verified (test with gcloud CLI)

### S002: Implement Gmail send email service
**Deliverable:** lib/gmail/send-email.ts with sendEmail(to, subject, html) function, JWT authentication (service account), base64 encoding, error handling (retry 3x)
**Dependencies:** S001 (service account)
**Acceptance:** Send test email works, delivery confirmed, message_id returned, audit log entry created

### S003: Create email templates (HTML)
**Deliverable:** lib/gmail/templates/ directory with daily-summary.ts, purchase-alert.ts, cpi-alert.ts, certificate-missing.ts templates, HTML valid (DOCTYPE, style, responsive)
**Dependencies:** None
**Acceptance:** Templates render correctly (Gmail + Outlook), dynamic data injection works, links functional

### S004: Implement Sheets export service
**Deliverable:** lib/sheets/export.ts with exportToSheets(title, data, headers) function, create spreadsheet, write data (batch 1,000 rows), format headers (bold), generate shareable link
**Dependencies:** S001 (service account)
**Acceptance:** Export 1,000 rows <5s, 10,000 rows <20s, shareable link works (anyone with link), headers bold

### S005: Implement export API endpoint
**Deliverable:** /api/export/sheets POST endpoint with input validation (max 10,000 rows), call exportToSheets(), return URL, audit log entry
**Dependencies:** S004 (export service)
**Acceptance:** Endpoint works, URL returned, audit log entry, error handling (timeout, quota exceeded)

### S006: Create export button component (frontend)
**Deliverable:** components/ExportToSheetsButton.tsx with loading state, POST /api/export/sheets, open URL in new tab, error messages
**Dependencies:** S005 (export endpoint)
**Acceptance:** Button works, loading indicator, success opens Sheets in new tab, error messages displayed

### S007: Implement OAuth 2.0 SSO (NextAuth.js)
**Deliverable:** /api/auth/[...nextauth]/route.ts with Google Provider, domain restriction (@contecsa.com), session callbacks, JWT tokens
**Dependencies:** OAuth client ID + secret in .env
**Acceptance:** Login redirects to Google, @contecsa.com allowed, other domains rejected, session created (1h expiry)

### S008: Integrate Gmail with F005 (notificaciones)
**Deliverable:** Hook F005.sendImmediateAlert() → Call lib/gmail/send-email.ts, replace mocked email with Gmail API
**Dependencies:** F005 implemented, S002 (Gmail service)
**Acceptance:** F005 alerts sent via Gmail API, delivery confirmed, audit log entry

### S009: Create daily email cron job
**Deliverable:** /api/cron/daily-summary GET endpoint with query (compras >30d, tareas pendientes), generate email (daily-summary template), send to all users (Gerencia + Compras), log sent
**Dependencies:** S002 (Gmail service), S003 (templates)
**Acceptance:** Cron runs daily (9 AM COT), emails sent <15s (10 users batch), audit log entries

### S010: Configure Vercel cron
**Deliverable:** vercel.json cron config: { path: '/api/cron/daily-summary', schedule: '0 14 * * *' } → Daily at 9 AM COT (14:00 UTC)
**Dependencies:** S009 (cron endpoint)
**Acceptance:** Cron triggers daily, verified in Vercel logs, emails sent <1 min after trigger

### S011: Add export buttons to dashboard (F002) + purchase list (F003)
**Deliverable:** Export button in dashboard (export KPIs), export button in purchase list (export all purchases), integrate ExportToSheetsButton component
**Dependencies:** S006 (export button), F002/F003 implemented
**Acceptance:** Buttons visible, click opens Sheets in new tab, data correct (headers + rows match UI)

---

## Milestones

**M1 - Setup + Services:** [S001-S004] | Target: Week 1 (Service account, Gmail/Sheets services, templates)
**M2 - API + Frontend:** [S005-S007] | Target: Week 2 (Export endpoint, button, OAuth SSO)
**M3 - Integration + Cron:** [S008-S011] | Target: Week 3 (F005 integration, daily email, dashboard/purchase export)

---

## Risk Mitigation

| Risk | Mitigation | Owner |
|------|-----------|-------|
| **Gmail quota exceeded (100 emails/day free tier)** | Upgrade to Google Workspace (2000 emails/day), batch users, prioritize CRITICAL alerts over daily summaries | Javier Polo |
| **Service account delegation not configured** | Admin configures delegation (admin.google.com), test with test email before production, document setup guide | Javier Polo |
| **OAuth token theft (session hijacking)** | HTTPS only, secure cookie flags (httpOnly, sameSite), short expiry (1h), auto-refresh tokens | Claude Code |
| **Sheets export timeout (>20s for 10K rows)** | Batch write (1,000 rows chunks), suggest filters if >10K, show progress bar, optimize query (select only needed columns) | Claude Code |
| **HTML email broken rendering (Outlook)** | Test templates with Litmus/Email on Acid, use tables (not flexbox), inline CSS, fallback to plain text | Claude Code |
| **Network failure (Gmail unreachable)** | Retry 3x with exponential backoff, queue emails for later, notify user "Email programado", monitor API status | Claude Code |
| **User resistance (prefer manual Excel)** | Training ("1-click vs 2 hours"), gamificación (badge "100 exports"), showcase time savings, Gerencia buy-in | Javier Polo |

---

## Notes

**Critical Constraints:**
- F005 (Notificaciones) must integrate with Gmail API (replace mocked emails)
- F002 (Dashboard) must have export button
- F003 (Purchase Tracking) must have export button
- MVP = Service Account only (no per-user OAuth for emails/exports until Phase 2)
- MVP = max 10,000 rows export (no pagination)
- OAuth = SSO login only (@contecsa.com domain restriction)

**Assumptions:**
- Client has Google Workspace (not free Gmail) → 2000 emails/day quota
- Admin can configure domain-wide delegation (requires super admin role)
- Users have @contecsa.com emails (verified in meet 2025-12-22)
- Sheets = familiar tool (no training required, NPS >75 expected)
- Daily email time = 9 AM COT (client preference)

**Blockers:**
- F005 (Notificaciones) must be implemented (S008 - internal dependency)
- F002 (Dashboard) must be implemented (S011 - internal dependency)
- F003 (Purchase Tracking) must be implemented (S011 - internal dependency)
- Google Workspace admin access (for domain-wide delegation) - client provides

---

**Last updated:** 2025-12-24 11:05 | Maintained by: Javier Polo + Claude Code
