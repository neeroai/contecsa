# SDD Implementation Plan: Sistema de Notificaciones

Version: 1.0 | Date: 2025-12-24 08:35 | Owner: Javier Polo | Status: Active

---

## Reference

**SPEC:** /specs/f005-notificaciones/SPEC.md
**ADR:** /specs/f005-notificaciones/ADR.md (Gmail API vs SendGrid vs Resend)
**PRD:** docs/features/r05-notificaciones.md
**CRITICAL:** Delivery >99%, open rate >50%, time to action <4h, 80% reduction overdue purchases

---

## Stack Validated

**Email Provider:** Gmail API (Google Workspace)
- Source: /Users/mercadeo/neero/docs-global/stack/common-stack.md:65-70
- Decision: See ADR.md (Gmail API over SendGrid)
- Use case: Client already uses Google Workspace, native integration, free tier

**Email Templates:** React Email
- Source: /Users/mercadeo/neero/docs-global/stack/common-stack.md:60-65
- Use case: Component-based HTML emails, responsive, TypeScript
- Alternative: MJML (XML-based, Phase 2 if needed)

**Scheduler:** Vercel Cron
- Source: /Users/mercadeo/neero/docs-global/stack/common-stack.md:50-55
- Use case: Daily summary (8 AM), weekly summary (Monday 8 AM)
- Config: vercel.json crons array

**Queue (Optional):** Redis (Vercel KV)
- Source: /Users/mercadeo/neero/docs-global/stack/database-guide.md:89-95
- Use case: Retry logic, rate limiting (50 emails/min), decouple send from generation
- Decision: Start without queue (10 users), add if >50 users

**Tracking:** PostgreSQL
- Source: /Users/mercadeo/neero/docs-global/stack/database-guide.md:15-25
- Tables: notification_log (sent, delivered, opened, clicked), user_notification_prefs (preferences)

**Authentication:** Google OAuth 2.0 Service Account
- Source: /Users/mercadeo/neero/docs-global/stack/common-stack.md:65-70
- Use case: Domain-wide delegation, send emails as user

**Validation Checklist:**
- [x] Stack matches docs-global/stack/ (6 citations)
- [x] NO INVENTAR protocol applied
- [x] ClaudeCode&OnlyMe filter passed (see ADR.md)
- [x] Dependencies: F003 (purchase status), F004 (invoice blocked), F007 (price anomaly)
- [x] Limitations: Spanish only (MVP), HTML only, no SMS/push

---

## Implementation Steps (15 steps)

### S001: Enable Gmail API + OAuth credentials
**Deliverable:** Service account credentials configured, domain-wide delegation enabled
**Dependencies:** Google Workspace admin access
**Acceptance:** GMAIL_SERVICE_ACCOUNT_JSON env var set, API calls successful, can send emails as any user

### S002: Create notification_log table migration
**Deliverable:** SQL migration with notification_log table (11 fields: id, user_id, email, notification_type, subject, sent_at, gmail_message_id, delivery_status, opened_at, clicked_at, created_at)
**Dependencies:** PostgreSQL connection
**Acceptance:** Table created, index on user_id + sent_at, index on gmail_message_id

### S003: Create user_notification_prefs table migration
**Deliverable:** SQL migration with user_notification_prefs table (7 fields: user_id, daily_summary_enabled, daily_summary_time, weekly_summary_enabled, immediate_alerts_enabled, email_format, language)
**Dependencies:** PostgreSQL connection, users table
**Acceptance:** Table created, foreign key to users, default values (daily_summary_enabled = TRUE)

### S004: Implement Gmail API service (TypeScript)
**Deliverable:** lib/services/gmail.ts with sendEmail(to, subject, html), getAuthClient(), encodeMessage()
**Dependencies:** S001 (credentials), googleapis package
**Acceptance:** Send test email successfully, returns gmail_message_id, handles errors (API down, rate limit)

### S005: Implement email template engine (React Email)
**Deliverable:** lib/email-templates/ with base layout, header, footer, button components
**Dependencies:** @react-email/components package
**Acceptance:** Templates render to HTML, responsive design (mobile + desktop), <100 KB size

### S006: Create daily summary email templates (5 roles)
**Deliverable:** lib/email-templates/daily-summary/{gerencia, compras, contabilidad, tecnico, almacen}.tsx
**Dependencies:** S005 (template engine)
**Acceptance:** Each role has personalized content (KPIs, alerts, tasks), links work, UTM tracking

### S007: Create immediate alert email templates
**Deliverable:** lib/email-templates/alerts/{invoice-blocked, price-anomaly, purchase-45-days, requisition-approved}.tsx
**Dependencies:** S005 (template engine)
**Acceptance:** Each alert type has template, [URGENTE] prefix for CRITICAL, actionable links

### S008: Create weekly executive summary template
**Deliverable:** lib/email-templates/weekly-summary/gerencia.tsx
**Dependencies:** S005 (template engine)
**Acceptance:** Includes: purchases closed/open, weekly spend, top 5 suppliers, trend chart, risk alerts

### S009: Implement daily summary scheduler (Vercel Cron)
**Deliverable:** app/api/notifications/daily-summary/route.ts + vercel.json cron config (8 AM COT = 13:00 UTC)
**Dependencies:** S004 (Gmail service), S006 (templates), S002 (notification_log)
**Acceptance:** Runs daily at 8 AM COT, queries DB for alerts per user, generates emails, sends via Gmail, logs to notification_log

### S010: Implement weekly summary scheduler (Vercel Cron)
**Deliverable:** app/api/notifications/weekly-summary/route.ts + vercel.json cron config (Monday 8 AM COT)
**Dependencies:** S004 (Gmail service), S008 (template), S002 (notification_log)
**Acceptance:** Runs Monday 8 AM COT, sends to Gerencia only, includes weekly KPIs + trend chart

### S011: Implement immediate alert triggers (event-driven)
**Deliverable:** lib/services/notifications.ts with sendImmediateAlert(user_id, alert_type, data)
**Dependencies:** S004 (Gmail service), S007 (alert templates)
**Acceptance:** Triggered from F003 (purchase >45 days), F004 (invoice blocked), F007 (price anomaly), sends <1 min, logs

### S012: Implement user preferences API
**Deliverable:** app/api/users/[id]/notification-prefs/route.ts (GET, PUT)
**Dependencies:** S003 (user_notification_prefs table)
**Acceptance:** User can enable/disable daily summary, customize time (8/9/10 AM), preferences respected in S009

### S013: Implement unsubscribe flow
**Deliverable:** app/unsubscribe/[token]/page.tsx with confirmation + update user_notification_prefs
**Dependencies:** S003 (user_notification_prefs table)
**Acceptance:** Unsubscribe link in email footer → Updates daily_summary_enabled = FALSE → Confirmation page → Immediate effect

### S014: Implement email tracking (opened, clicked)
**Deliverable:** Tracking pixel (1×1 image) for opened_at, UTM params for clicked_at
**Dependencies:** S002 (notification_log table)
**Acceptance:** Opened_at logged when pixel loaded, clicked_at logged when link clicked, updates notification_log

### S015: Integration with F003, F004, F007
**Deliverable:** Hook immediate alerts into F003 (purchase >45 days), F004 (invoice blocked), F007 (price anomaly)
**Dependencies:** F003, F004, F007 implemented
**Acceptance:** Purchase >45 days → Email Jefe Compras + Gerencia + CEO, Invoice blocked → Email Contabilidad + Compras, Price anomaly → Email Compras + Gerencia

---

## Milestones

**M1 - Gmail API + Templates:** [S001-S005] | Target: Week 1 (Credentials + base templates)
**M2 - Schedulers + Alerts:** [S006-S011] | Target: Week 2 (Daily/weekly cron + immediate alerts)
**M3 - User Prefs + Integration:** [S012-S015] | Target: Week 3 (Preferences + F003/F004/F007 integration)

---

## Risk Mitigation

| Risk | Mitigation | Owner |
|------|-----------|-------|
| **Gmail API down (delivery <99%)** | Retry 3x with exponential backoff, queue for next daily run, monitor uptime, Phase 2: SendGrid fallback | Claude Code |
| **Rate limit (100 emails/min)** | Implement queue with 1.2s delay, batch processing, Redis for queuing if >50 users | Claude Code |
| **Email bounces (>1%)** | Validate email format on user creation, mark invalid emails, admin dashboard shows bounced emails | Javier Polo |
| **Low open rate (<50%)** | A/B test subject lines (Phase 2), optimize send time per user (Phase 2), improve email content | Javier Polo |
| **Spam complaints** | 1 email/day consolidation (no spam), clear unsubscribe link, relevant content only, user preferences | Claude Code |
| Template render fail | Fallback to plain text version, log error, notify admin, test templates in CI | Claude Code |
| **Gmail API credentials leak** | Store in environment variable (not code), rotate quarterly, use service account (not API key) | Javier Polo |
| Timezone confusion (COT vs UTC) | Document clearly (8 AM COT = 13:00 UTC), test scheduler with multiple timezones | Claude Code |
| Large email size (>100 KB) | Truncate content (limit purchases to top 10), compress images, avoid inline CSS | Claude Code |
| Vercel Cron unreliable | Monitor cron execution, alert if job fails, manual trigger API as backup | Javier Polo |

---

## Notes

**Critical Constraints:**
- Gmail API free tier: 100 emails/min, 1 billion emails/day (Contecsa 10 users = 10-30 emails/day = free)
- Vercel Cron: 1 cron per deployment (Pro plan), must be in vercel.json
- React Email: Requires Node.js 16+, builds to static HTML
- Delivery rate >99%: Gmail API SLA 99.9%, but must handle retries for network errors

**Assumptions:**
- All users have valid email addresses (enforced at user creation)
- Google Workspace domain-wide delegation enabled (admin access required)
- Users check email daily (open rate >50%)
- Immediate alerts <1 min delivery (Gmail API typically <10s)
- Spanish language only (MVP limitation)

**Blockers:**
- Google Workspace admin access (S001 - external dependency)
- F003 implemented (S015 - internal dependency)
- F004 implemented (S015 - internal dependency)
- F007 implemented (S015 - internal dependency)

---

**Last updated:** 2025-12-24 08:35 | Maintained by: Javier Polo + Claude Code
