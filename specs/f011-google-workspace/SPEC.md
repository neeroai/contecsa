# SPEC: Google Workspace Integration

Version: 1.0 | Date: 2025-12-24 11:00 | Owner: Javier Polo | Status: Active

---

## Problem

**Current Workflow:** Excel exports manuales (2 horas) → Google Sheets manual copy-paste → Sin notificaciones automáticas compras en riesgo → Usuarios acostumbrados a Sheets (no quieren aprender nueva herramienta) → Correos corporativos Gmail (@contecsa.com) no integrados.

**Impact:** Tiempo desperdiciado 2h/reporte. Notificaciones críticas no llegan. Resistencia usuario (Sheets vs nueva UI). Sin SSO (crear cuentas manualmente).

---

## Objective

**Primary Goal:** Integración nativa Google Workspace (Gmail + Sheets + OAuth) para envío notificaciones automatizadas (Gmail API) → Exportación datos con un clic (Sheets API) → Autenticación SSO corporativa (OAuth 2.0) → Formato familiar para usuarios (sin cambios infraestructura existente).

**Success Metrics:**
- Reducción 95% tiempo exportación reportes (2h → 5 min con un clic)
- 100% notificaciones entregadas vía Gmail API (vs 0% actual)
- 100% usuarios autenticados con SSO (vs crear cuentas manualmente)
- NPS >75 (usuarios familiares con Sheets, no requiere capacitación)
- Export handles 10,000 rows <20s

---

## Scope

| In | Out |
|---|------|
| Gmail API (send emails) | Google Drive integration (Phase 2) |
| Sheets API (create/write spreadsheets) | Google Calendar sync (Phase 2) |
| OAuth 2.0 SSO (@contecsa.com domain) | Google Meet integration (Phase 2) |
| Daily email summaries (cron job) | Google Chat notifications (Phase 2) |
| Immediate alerts (compras >30d, CPI <0.9) | Gmail parsing (invoice intake, Phase 2) |
| Export dashboard to Sheets (1-click) | Real-time Sheets sync (auto-update) |
| Export purchase list to Sheets | Bulk email campaigns |
| Shareable link generation (anyone with link) | Advanced Sheets formulas (charts, pivots) |
| Service Account (automated emails/exports) | OAuth per-user consent (MVP = Service Account only) |
| Rate limiting (250 req/sec Gmail, 100 emails/day) | WhatsApp integration |

---

## Contracts

### Input (Send Email)

| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| to | string (email) | Y | Recipient email (@contecsa.com) |
| subject | string | Y | Email subject |
| html | string (HTML) | Y | Email body (HTML format) |
| from | string | N | Optional custom sender name |

### Output (Email Sent)

| Field | Type | Condition | Notes |
|-------|------|-----------|-------|
| message_id | string | Always | Gmail message ID (for tracking) |
| delivery_status | enum | Always | SENT, QUEUED, FAILED |
| sent_at | timestamp | Always | Timestamp email sent |

### Input (Export to Sheets)

| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| title | string | Y | Spreadsheet title (e.g., "Compras Export 2025-01-15") |
| data | array of objects | Y | Data rows (max 10,000 rows) |
| headers | array of strings | Y | Column headers |

### Output (Sheets Export)

| Field | Type | Condition | Notes |
|-------|------|-----------|-------|
| url | string (URL) | Always | Shareable Google Sheets URL |
| spreadsheet_id | string | Always | Google Sheets ID |
| created_at | timestamp | Always | Timestamp sheet created |

### Input (OAuth SSO Login)

| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| email | string | Y | User email (must end with @contecsa.com) |
| oauth_token | string | Y | Google OAuth token |

### Output (SSO Session)

| Field | Type | Condition | Notes |
|-------|------|-----------|-------|
| user_id | uuid | Always | User ID in system |
| session_token | string | Always | JWT session token (1h expiry) |
| email | string | Always | User email |
| profile_picture | string (URL) | Always | Google profile picture URL |

---

## Business Rules

- **Gmail API Rate Limit:** 250 req/sec → Queue emails if burst exceeds, throttle to prevent quota violation
- **Gmail Daily Limit:** 100 emails/day (free tier), 2000/day (Google Workspace) → Batch users if needed, prioritize CRITICAL alerts
- **Sheets API Rate Limit:** 100 req/100 sec/user → Batch updates, write 1,000 rows at once (not row-by-row)
- **Domain Restriction:** OAuth login only allows @contecsa.com emails → Reject other domains with error "Solo usuarios @contecsa.com"
- **Service Account Delegation:** Domain-wide delegation required (admin consent) → Without it, emails cannot be sent as notificaciones@contecsa.com
- **Shareable Link:** Default permissions = "anyone with link can view" → Option for restricted sharing (Gerencia only) if needed
- **Email Templates:** HTML format only (text fallback auto-generated) → Test with Gmail + Outlook rendering
- **Export Limit:** Max 10,000 rows per export → If >10,000, suggest filters or pagination
- **Timeout:** Gmail send <3s, Sheets create <20s → If exceeds, return error + retry suggestion
- **Audit Trail:** Log all emails sent (to, subject, sent_at) → Log all Sheets exports (title, user, created_at)

---

## Edge Cases

| Scenario | Handling | Notes |
|----------|----------|-------|
| Gmail API quota exceeded (100 emails/day) | Queue for next day → Email admin "Límite alcanzado" → Display message "Notificaciones programadas para mañana" | Track quota usage daily |
| Sheets API timeout (>20s for 10K rows) | Suggest filters "Exporta menos datos" → Retry with smaller dataset | Log slow exports |
| OAuth token expired (>1h) | Auto-refresh token (refresh_token stored) → If refresh fails, redirect to login | Silent refresh preferred |
| Invalid credentials (service account key wrong) | Error "Autenticación falló, contacta soporte" → Notify admin → Check .env GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY | Critical error, blocks all emails |
| Network failure (Gmail unreachable) | Retry 3x with exponential backoff (1s, 2s, 4s) → If all fail, queue email for later → Notify user "Email programado" | Transient error, retry later |
| User email not @contecsa.com (SSO) | Reject login "Solo usuarios @contecsa.com permitidos" → Log attempt (potential security issue) | Domain restriction enforced |
| Export >10,000 rows | Truncate to 10,000 rows → Warning "Exportación limitada, aplica filtros" → Suggest date range filter | Prevent timeout |
| Email HTML broken (missing tags) | Validate HTML before send → Auto-add DOCTYPE if missing → Fallback to plain text if invalid | Graceful degradation |
| Duplicate Sheets export (same data twice) | Allow (each export = new spreadsheet) → Append timestamp to title (avoid confusion) | No deduplication |
| Service account delegation not configured | Error "Domain-wide delegation required" → Link to setup guide → Notify admin | Blocks automated emails |

---

## Observability

**Logs:**
- `email_sent` (info) - To, subject, message_id, sent_at, delivery_status
- `email_failed` (error) - To, subject, error_message, retry_count
- `sheets_export_created` (info) - Title, spreadsheet_id, url, row_count, user, created_at
- `sheets_export_failed` (error) - Title, error_message, row_count
- `oauth_login_success` (info) - Email, user_id, session_token
- `oauth_login_rejected` (warn) - Email (non-@contecsa.com), ip_address
- `quota_exceeded` (warn) - API (Gmail/Sheets), quota_used, quota_limit

**Metrics:**
- `emails_sent_count` - Total emails sent via Gmail API (target 100% delivery)
- `email_send_time_p95` - 95th percentile email send time (target <3s)
- `email_delivery_rate` - % emails successfully delivered (target >99%)
- `sheets_exports_count` - Total Sheets exports created
- `sheets_export_time_p95` - 95th percentile export time (target <20s for 10K rows)
- `sso_login_success_rate` - % successful SSO logins (target >99%)
- `gmail_quota_usage_pct` - % of daily Gmail quota used (alert if >80%)
- `sheets_quota_usage_pct` - % of Sheets quota used (alert if >80%)

**Traces:**
- `email_send_pipeline` (span) - Full flow: Generate HTML → Authenticate → Send Gmail → Log delivery
- `sheets_export_pipeline` (span) - Full flow: Prepare data → Authenticate → Create spreadsheet → Write data → Format headers → Generate shareable link
- `oauth_login_pipeline` (span) - Full flow: OAuth callback → Validate token → Verify domain → Create session

---

## Definition of Done

- [ ] Code review approved
- [ ] Gmail API service account configured (domain-wide delegation)
- [ ] Send email endpoint working (HTML templates)
- [ ] Sheets API service account configured
- [ ] Export to Sheets endpoint working (create + write + format)
- [ ] OAuth 2.0 SSO working (@contecsa.com domain restriction)
- [ ] Daily email cron job (9 AM COT)
- [ ] Rate limiting enforced (Gmail 100/day, Sheets 100 req/100 sec)
- [ ] Email templates tested (Gmail + Outlook rendering)
- [ ] Shareable link generation working (anyone with link)
- [ ] Audit trail logs all emails + exports
- [ ] **CRITICAL:** Export time <20s (10,000 rows)
- [ ] **CRITICAL:** Email delivery rate >99%
- [ ] **CRITICAL:** SSO 100% adoption (no manual account creation)
- [ ] Quality gates pass (format, lint, types, tests 80%+, build)
- [ ] Deployed to staging
- [ ] UAT with Gerencia + Compras (daily emails + export test)

---

**Related:** F005 (Notificaciones - Gmail API integration), F002 (Dashboard - export to Sheets), F003 (Seguimiento Compras - export list) | **Dependencies:** Google Cloud service account, OAuth 2.0 client ID, domain-wide delegation (admin consent)

**Original PRD:** docs/features/r11-google-workspace.md
