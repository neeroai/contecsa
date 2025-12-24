# SPEC: Sistema de Notificaciones

Version: 1.0 | Date: 2025-12-24 08:30 | Owner: Javier Polo | Status: Active

---

## Problem

**Current Workflow:** Sin alertas automáticas en proceso Excel manual → Compras >30 días pasan inadvertidas → Gerencia sin visibilidad de riesgos → Seguimiento reactivo (no proactivo). Contabilidad descubre facturas bloqueadas días después. Técnico no sabe si requisición fue aprobada.

**Impact:** Compras vencidas (>45 días) descubiertas tarde → Pérdidas como caso Cartagena. Tiempo de respuesta lento (sin notificación inmediata). Gerencia sin visibilidad ejecutiva (no recibe resúmenes).

---

## Objective

**Primary Goal:** Sistema de notificaciones por email que envía resumen diario consolidado (8 AM) + alertas inmediatas (event-triggered) + resumen ejecutivo semanal (lunes 8 AM), personalizado por rol, usando Gmail API. 1 email consolidado/día (no spam), contenido actionable (links directos), reducción 80% en compras vencidas.

**Success Metrics:**
- Delivery rate >99% (emails delivered successfully)
- Open rate >50% (emails opened within 24h)
- Click rate >30% (at least 1 link clicked)
- Time to action <4h (from email to user action)
- Reducción 80% en compras vencidas (>45 días inadvertidas)
- User satisfaction NPS >70 (all roles)
- Zero spam complaints

---

## Scope

| In | Out |
|---|---|
| Daily summary email (8 AM, personalizado por rol) | SMS notifications (Phase 2) |
| Immediate alerts (event-triggered: invoice blocked, price anomaly, >45 days) | Push notifications mobile (Phase 2) |
| Weekly executive summary (lunes 8 AM, Gerencia only) | WhatsApp Business API (Phase 2) |
| Gmail API integration (Google Workspace) | A/B testing subject lines (Phase 2) |
| HTML email templates (React Email or MJML) | Smart timing (ML-based send time) |
| User preferences (enable/disable, time customization) | Digest customization (select KPIs) |
| Email tracking (sent, delivered, opened, clicked) | Multi-language (Spanish only in MVP) |
| Vercel Cron scheduler (daily 8 AM, weekly Monday 8 AM) | Real-time notifications (in-app) |
| Unsubscribe flow + preferences page | Email analytics dashboard (Phase 2) |

---

## Contracts

### Input (Send Email)

| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| user_id | uuid | Y | Recipient user ID |
| notification_type | enum | Y | DAILY_SUMMARY\|IMMEDIATE_ALERT\|WEEKLY_SUMMARY |
| subject | string | Y | Email subject line (max 255 chars) |
| html_body | string | Y | HTML email content |
| data | object | N | Dynamic data for template (purchases, KPIs, alerts) |
| priority | enum | N | LOW\|MEDIUM\|HIGH\|CRITICAL (default: MEDIUM) |

### Output (Email Sent)

| Field | Type | Condition | Notes |
|-------|------|-----------|-------|
| message_id | string | Always | Gmail message ID (for tracking) |
| sent_at | timestamp | Always | Email sent timestamp |
| delivery_status | enum | Always | SENT\|QUEUED\|FAILED |
| recipient_email | string | Always | User email address |
| notification_log_id | uuid | Always | Database log entry ID |
| retry_count | number | On Failure | Number of retries (max 3) |

---

## Business Rules

- **Daily Summary Timing:** 8 AM Colombia time (1 PM UTC) → Scheduled via Vercel Cron → All users with active purchases
- **Weekly Summary Timing:** Monday 8 AM Colombia time → Scheduled via Vercel Cron → Gerencia only
- **Immediate Alerts Timing:** <1 minute from event trigger → Event-driven (invoice blocked, price anomaly, >45 days)
- **Consolidation:** 1 email per user per day (daily summary) → No multiple emails (spam prevention)
- **Personalization by Role:** Gerencia → KPIs + risk alerts | Compras → Open purchases + >30 days | Contabilidad → Blocked invoices + pending validation | Técnico → Requisition status + materials due | Almacén → Pending receptions
- **Priority Escalation:** CRITICAL (>45 days, price anomaly) → Email + subject prefix "[URGENTE]" | HIGH (invoice blocked, >30 days) → Email | MEDIUM (daily summary) → Email | LOW (weekly summary) → Email
- **Rate Limiting:** 50 emails/min max (Gmail API limit) → Queue if >50 users → Send in batches with 1.2s delay
- **Retry Logic:** Failure → Retry 3x with exponential backoff (1s, 5s, 15s) → If all fail, queue for next daily run
- **Unsubscribe:** User can disable daily summary (not immediate alerts) → Unsubscribe link in footer → Updates user_notification_prefs table
- **Email Format:** HTML (primary) + Plain text fallback (Gmail auto-generates) → Keep size <100 KB
- **Links:** All links absolute URLs (https://app.contecsa.com/...) → Trackable (UTM params for analytics)
- **User Preferences Respected:** Daily summary time (8 AM, 9 AM, 10 AM) → Language (Spanish only MVP) → Email format (HTML only MVP)

---

## Edge Cases

| Scenario | Handling | Notes |
|----------|----------|-------|
| User has no email address | Skip user, log warning → Admin dashboard shows users without email | New user onboarding must require email |
| Invalid email address (bounce) | Mark user.email_valid = FALSE, notify admin → Disable future emails until corrected | Bounce detection from Gmail API |
| Gmail API down (503 error) | Retry 3x with backoff → Queue for next daily run (8 AM tomorrow) → Email admin if >1h downtime | Resilience pattern |
| Rate limit exceeded (100 emails/min) | Implement queue with 1.2s delay between sends → Process in batches | Gmail API hard limit |
| Email template render fail | Log error → Fallback to plain text version (simple message) → Notify admin | Template syntax error |
| User disabled daily summary | Skip daily summary email → Still send immediate alerts (cannot disable) | User preference respected |
| No alerts to send (empty data) | Do not send email (avoid empty emails) → Log "no alerts" for user | Prevent spam |
| Duplicate email sent (scheduler runs twice) | Dedupe: Check notification_log last sent_at → If <23h, skip → Idempotency key | Vercel Cron edge case |
| User clicks unsubscribe | Update user_notification_prefs.daily_summary_enabled = FALSE → Redirect to confirmation page | Immediate effect |
| Large email (>100 KB) | Truncate content (e.g., limit purchases to top 10) → Add "Ver más en dashboard" link | Gmail size limits |
| Timezone confusion (8 AM what timezone?) | Always Colombia time (COT = UTC-5) → Vercel Cron uses UTC (13:00 = 8 AM COT) | Hardcoded timezone |
| Email delivery delayed (>5 min) | Log warning → Investigate Gmail API latency → If persistent, switch to SendGrid fallback (Phase 2) | SLA monitoring |

---

## Observability

**Logs:**
- `email_scheduled` (info) - Notification type, scheduled_time, user_count
- `email_sent` (info) - User, subject, notification_type, gmail_message_id
- `email_failed` (error) - User, error_message, retry_count
- `email_delivered` (info) - Gmail delivery confirmation (if available)
- `email_opened` (info) - User, opened_at (tracking pixel)
- `email_clicked` (info) - User, link_url, clicked_at (UTM tracking)
- `email_bounced` (warn) - User, bounce_reason, email marked invalid
- `gmail_api_error` (error) - Error code, retry_count, queued for retry

**Metrics:**
- `emails_sent_total` - Count by notification_type (DAILY_SUMMARY, IMMEDIATE_ALERT, WEEKLY_SUMMARY)
- `email_delivery_rate_pct` - % delivered successfully (target >99%)
- `email_open_rate_pct` - % opened within 24h (target >50%)
- `email_click_rate_pct` - % with at least 1 link clicked (target >30%)
- `email_bounce_rate_pct` - % bounced (target <1%)
- `email_send_latency_p95_ms` - 95th percentile send time (target <2000ms)
- `gmail_api_error_count` - Total API errors (target <5/day)
- `time_to_action_hours` - Time from email sent to user action (target <4h)

**Traces:**
- `daily_summary_job` (span) - Full job: query DB → generate emails → send → log
- `email_generation` (span) - Template render time
- `gmail_api_call` (span) - API call latency

---

## Definition of Done

- [ ] Code review approved
- [ ] Gmail API integration working (OAuth 2.0 service account)
- [ ] Daily summary email sent to 5+ roles (8 AM COT)
- [ ] Immediate alerts trigger correctly (invoice blocked, price anomaly, >45 days)
- [ ] Weekly executive summary sent to Gerencia (Monday 8 AM)
- [ ] Email templates render correctly (HTML + plain text fallback)
- [ ] Personalization by role (Gerencia, Compras, Contabilidad, Técnico, Almacén)
- [ ] User preferences respected (enable/disable, time customization)
- [ ] Unsubscribe flow functional (updates user_notification_prefs)
- [ ] Email tracking (notification_log table records sent, delivered, opened, clicked)
- [ ] Error handling (Gmail API down, bounce, rate limit, template fail)
- [ ] Retry logic (3x with exponential backoff)
- [ ] Links in emails work (click → app with UTM tracking)
- [ ] **CRITICAL:** Delivery rate >99% (tested 1 week)
- [ ] **CRITICAL:** Open rate >50% (validated with 10 users)
- [ ] **CRITICAL:** Time to action <4h (from email to user resolves alert)
- [ ] Quality gates pass (format, lint, types, tests 80%+, build)
- [ ] Deployed to staging
- [ ] UAT with all 5 roles (10 users total, test daily/weekly/immediate)
- [ ] Zero spam complaints

---

**Related:** F003 (Purchase Tracking - status alerts), F004 (OCR Facturas - invoice blocked alerts), F007 (Análisis Precios - price anomaly alerts) | **Dependencies:** Gmail API, PostgreSQL user_notification_prefs table, Vercel Cron

**Original PRD:** docs/features/r05-notificaciones.md
