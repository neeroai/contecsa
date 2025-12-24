# TASKS: Sistema de Notificaciones

Version: 1.0 | Date: 2025-12-24 08:50 | Owner: Claude Code | Status: Active

---

## DOING

| ID | Task | DoD | Est |
|----|------|-----|-----|
| - | No active tasks yet | - | - |

---

## TODO (Priority Order - From PLAN.md)

| ID | Task | DoD | Est |
|----|------|-----|-----|
| T001 | Enable Gmail API + OAuth credentials | - Enable Gmail API in Google Cloud Console<br>- Create service account "notification-service"<br>- Grant domain-wide delegation (Google Workspace admin)<br>- Download JSON credentials<br>- Set GMAIL_SERVICE_ACCOUNT_JSON env var<br>- Test: Send test email successfully | 3h |
| T002 | Create notification_log table migration | - SQL migration file with 11 fields (id, user_id, email, notification_type, subject, sent_at, gmail_message_id, delivery_status, opened_at, clicked_at, created_at)<br>- Index on user_id + sent_at<br>- Index on gmail_message_id (unique)<br>- Foreign key to users table | 2h |
| T003 | Create user_notification_prefs table migration | - SQL migration file with 7 fields (user_id, daily_summary_enabled, daily_summary_time, weekly_summary_enabled, immediate_alerts_enabled, email_format, language)<br>- Default values: daily_summary_enabled = TRUE, daily_summary_time = 08:00, language = 'es'<br>- Foreign key to users table | 2h |
| T004 | Implement Gmail API service (TypeScript) | - lib/services/gmail.ts with sendEmail(to, subject, html)<br>- getAuthClient() with OAuth 2.0 service account<br>- encodeMessage() for base64 URL-safe encoding<br>- Error handling: API down (503), rate limit (429), invalid email<br>- Returns gmail_message_id for tracking | 4h |
| T005 | Implement email template engine (React Email) | - lib/email-templates/base-layout.tsx with header, footer, responsive CSS<br>- lib/email-templates/components/{button, section, text, divider}.tsx<br>- Install @react-email/components + render<br>- Test: Render to HTML <100 KB | 3h |
| T006 | Create daily summary email template (Gerencia) | - lib/email-templates/daily-summary/gerencia.tsx<br>- Content: Total compras activas, compras en riesgo (>30 días), gasto mensual vs presupuesto, top 3 compras más grandes, link a dashboard<br>- Responsive design (mobile + desktop)<br>- UTM tracking on links | 3h |
| T007 | Create daily summary email template (Compras) | - lib/email-templates/daily-summary/compras.tsx<br>- Content: Compras abiertas asignadas, compras >30 días (urgentes), órdenes sin confirmar (>7 días), certificados faltantes, links directos<br>- Highlight >30 días in red<br>- Actionable links (Ver Compra, Contactar Proveedor) | 3h |
| T008 | Create daily summary email templates (Contabilidad, Técnico, Almacén) | - lib/email-templates/daily-summary/contabilidad.tsx (facturas pendientes, bloqueadas, total por pagar)<br>- lib/email-templates/daily-summary/tecnico.tsx (requisiciones, materiales por recibir, consumo semanal)<br>- lib/email-templates/daily-summary/almacen.tsx (recepciones pendientes, entregas parciales, próximos ingresos 7 días)<br>- All responsive + UTM tracking | 4h |
| T009 | Create immediate alert email templates | - lib/email-templates/alerts/invoice-blocked.tsx ([URGENTE] prefix, reason, invoice details, link)<br>- lib/email-templates/alerts/price-anomaly.tsx (HIGH priority, deviation %, baseline, link)<br>- lib/email-templates/alerts/purchase-45-days.tsx (CRITICAL, [URGENTE], purchase details, link)<br>- lib/email-templates/alerts/requisition-approved.tsx (MEDIUM, next step, link to create PO) | 4h |
| T010 | Create weekly executive summary template | - lib/email-templates/weekly-summary/gerencia.tsx<br>- Content: Compras cerradas vs abiertas (semana anterior), gasto total semanal, top 5 proveedores por gasto, gráfica tendencia gasto (12 semanas), compras en riesgo, próximos vencimientos<br>- Recharts integration for trend graph<br>- Responsive design | 3h |
| T011 | Implement daily summary scheduler (Vercel Cron) | - app/api/notifications/daily-summary/route.ts with GET endpoint<br>- vercel.json cron config: 8 AM COT (13:00 UTC) daily<br>- Query DB for alerts per user (grouped by role)<br>- Generate emails using templates<br>- Send via Gmail API<br>- Log to notification_log<br>- Dedupe: Skip if <23h since last sent | 4h |
| T012 | Implement weekly summary scheduler (Vercel Cron) | - app/api/notifications/weekly-summary/route.ts with GET endpoint<br>- vercel.json cron config: Monday 8 AM COT (13:00 UTC)<br>- Query DB for weekly KPIs (Gerencia only)<br>- Generate email using template<br>- Send via Gmail API<br>- Log to notification_log | 2h |
| T013 | Implement immediate alert triggers (event-driven) | - lib/services/notifications.ts with sendImmediateAlert(user_id, alert_type, data)<br>- Alert types: INVOICE_BLOCKED, PRICE_ANOMALY, PURCHASE_45_DAYS, REQUISITION_APPROVED<br>- Priority escalation: CRITICAL → [URGENTE] prefix + CEO recipient<br>- Send <1 min<br>- Log to notification_log | 3h |
| T014 | Implement user preferences API | - app/api/users/[id]/notification-prefs/route.ts (GET, PUT)<br>- GET: Return user_notification_prefs<br>- PUT: Update daily_summary_enabled, daily_summary_time<br>- Validation: time must be 08:00, 09:00, or 10:00<br>- Authorization: User can only update own prefs (or admin) | 2h |
| T015 | Implement unsubscribe flow | - app/unsubscribe/[token]/page.tsx with unsubscribe form<br>- Generate signed token (JWT with user_id + expiry 7 days)<br>- Unsubscribe link in email footer: /unsubscribe/{token}<br>- Confirm unsubscribe → Update user_notification_prefs.daily_summary_enabled = FALSE<br>- Redirect to confirmation page | 3h |
| T016 | Implement email tracking (opened, clicked) | - Tracking pixel: /api/email-tracking/pixel.png with query param notification_log_id<br>- Pixel loaded → Update notification_log.opened_at<br>- UTM params on links: utm_source=email&utm_medium=notification&utm_campaign={notification_type}<br>- Link click → Update notification_log.clicked_at (via client-side tracking) | 3h |
| T017 | Integration with F003 (Purchase Tracking) | - Hook immediate alert: Purchase >45 days → sendImmediateAlert(PURCHASE_45_DAYS)<br>- Recipients: Jefe Compras + Gerencia + CEO<br>- Trigger: Daily check at 8 AM (in daily summary job)<br>- Email sent <1 min after trigger | 1h |
| T018 | Integration with F004 (OCR Facturas) | - Hook immediate alert: Invoice blocked (validation error) → sendImmediateAlert(INVOICE_BLOCKED)<br>- Recipients: Contabilidad + Jefe Compras<br>- Trigger: F004 validation fails (amount >5%, NIT mismatch)<br>- Email sent <1 min | 1h |
| T019 | Integration with F007 (Análisis Precios) | - Hook immediate alert: Price anomaly >10% → sendImmediateAlert(PRICE_ANOMALY)<br>- Recipients: Jefe Compras + Gerencia<br>- Trigger: F007 detects anomaly (Z-score >2.5, IQR >10%)<br>- Email sent <1 min | 1h |
| T020 | Write unit tests for Gmail API send | - Test: Send email successfully → Returns gmail_message_id<br>- Test: Gmail API 503 → Retry 3x with backoff (1s, 5s, 15s)<br>- Test: Rate limit 429 → Queue for later<br>- Test: Invalid email → Error logged<br>- Coverage >80% | 2h |
| T021 | Write unit tests for email templates | - Test: Daily summary (Gerencia) renders HTML, includes KPIs<br>- Test: Daily summary (Compras) renders HTML, includes >30 days<br>- Test: Immediate alert (invoice blocked) renders HTML, [URGENTE] prefix<br>- Test: Weekly summary (Gerencia) renders HTML, trend chart<br>- Coverage >80% | 3h |
| T022 | Write unit tests for alert condition logic | - Test: Purchase >45 days → CRITICAL, recipients = [Compras, Gerencia, CEO]<br>- Test: Purchase >30 days → HIGH, recipients = [Compras]<br>- Test: Invoice blocked → HIGH, recipients = [Contabilidad, Compras]<br>- Test: Price anomaly >10% → HIGH, recipients = [Compras, Gerencia]<br>- Coverage >80% | 2h |
| T023 | Write unit tests for user preference filtering | - Test: User disabled daily summary → Skip daily, send immediate alerts only<br>- Test: User customized time (9 AM) → Send at 9 AM<br>- Test: User email invalid → Skip user<br>- Test: User no email → Skip user, log warning<br>- Coverage >80% | 2h |
| T024 | Write integration test for daily summary pipeline | - Test: Full flow: Query DB → Generate emails (5 roles) → Send Gmail → Log<br>- Test: Dedupe: If <23h since last sent → Skip<br>- Test: Empty data (no alerts) → Do not send<br>- Test: Processing time <5 min (10 users)<br>- Coverage >80% | 3h |
| T025 | Write integration test for weekly summary pipeline | - Test: Full flow: Query DB weekly KPIs → Generate email (Gerencia) → Send → Log<br>- Test: Includes: purchases closed/open, weekly spend, top 5 suppliers, trend chart<br>- Test: Processing time <2 min<br>- Coverage >80% | 2h |
| T026 | Write integration test for immediate alert pipeline | - Test: Event trigger (invoice blocked) → Generate → Send <1 min → Log<br>- Test: Priority escalation: CRITICAL → [URGENTE] + CEO<br>- Test: Retry logic: Gmail 503 → Retry 3x → Success<br>- Coverage >80% | 3h |
| T027 | Write integration test for error handling | - Test: Gmail API down (503) → Retry 3x → Queue for next daily → Email admin if >1h<br>- Test: Rate limit (429) → 1.2s delay → Process in batches<br>- Test: Template render fail → Fallback to plain text<br>- Test: Email bounce → Mark email_valid = FALSE → Notify admin<br>- Coverage >80% | 3h |
| T028 | Write integration test for scheduler trigger | - Test: Daily summary cron triggers at 8 AM COT (13:00 UTC) → Job executes<br>- Test: Weekly summary cron triggers Monday 8 AM → Job executes<br>- Test: Manual trigger (API call) → Job executes immediately<br>- Coverage >80% | 2h |
| T029 | Write E2E tests for user stories (US5.1-US5.5) | - US5.1: Jefe Compras daily summary (3 purchases >30 days)<br>- US5.2: Gerente weekly summary (KPIs + trend chart)<br>- US5.3: Contabilidad immediate alert (invoice blocked)<br>- US5.4: Almacén daily summary (pending receptions)<br>- US5.5: Técnico immediate alert (requisition approved)<br>- All 5 tests pass | 4h |
| T030 | Write E2E tests for edge cases | - User disabled daily summary → No email sent<br>- Email bounce → User email_valid = FALSE<br>- Rate limit (>100 emails/min) → Queue with delay<br>- Gmail API down → Retry 3x → Queue for next run<br>- Empty data → No email<br>- Unsubscribe flow → Prefs updated → Confirmation page<br>- All 6 tests pass | 3h |
| T031 | Performance test notification pipeline | - Measure: Email generation <2s per email<br>- Measure: Email delivery <1 min (from send to inbox)<br>- Measure: Daily summary job <5 min (10 users)<br>- Measure: Immediate alert <1 min (event → sent)<br>- Optimize if slower | 2h |
| T032 | UAT with all 5 roles | - Schedule UAT session with 10 users (2 per role: Gerencia, Compras, Contabilidad, Técnico, Almacén)<br>- Test: Daily summary sent at 8 AM (verify content relevance)<br>- Test: Weekly summary sent Monday 8 AM (Gerencia only)<br>- Test: Immediate alerts trigger correctly (invoice blocked, >45 days)<br>- Collect feedback (NPS survey)<br>- Sign-off from all roles | 4h |
| T033 | Delivery rate validation | - Send 100 test emails to real users<br>- Measure delivery rate (target >99%)<br>- Measure open rate within 24h (target >50%)<br>- Measure click rate (target >30%)<br>- Measure time to action (target <4h)<br>- Adjust if not meeting targets | 3h |
| T034 | Admin notifications and monitoring | - Create admin alert: Gmail API down >1h → Email admin<br>- Create admin alert: Email bounce detected → Email admin (weekly digest)<br>- Create admin alert: User email invalid → Email admin (daily)<br>- Dashboard: Show delivery rate, open rate, click rate, bounce rate<br>- Alerts pass (admin receives notifications) | 3h |
| T035 | Document email best practices and future enhancements | - Document: Email size <100 KB (compress images, limit content)<br>- Document: Subject line best practices (max 50 chars, actionable)<br>- Document: Unsubscribe compliance (CAN-SPAM Act)<br>- Future enhancements: SMS (Phase 2), Push notifications (Phase 2), WhatsApp (Phase 2), A/B testing<br>- Update SPEC.md Scope (Out) section | 1h |

**Total Estimated Time:** 90 hours (~3-4 weeks)

---

## BLOCKED

| ID | Task | Blocker | Notes |
|----|------|---------|-------|
| T001 | Enable Gmail API + OAuth credentials | Google Workspace admin access not yet granted | Need domain-wide delegation approval |
| T017 | Integration with F003 (Purchase Tracking) | F003 not implemented yet | Can mock purchase >45 days for testing |
| T018 | Integration with F004 (OCR Facturas) | F004 not implemented yet | Can mock invoice blocked event for testing |
| T019 | Integration with F007 (Análisis Precios) | F007 not implemented yet | Can mock price anomaly event for testing |

---

## DONE

| ID | Task | Closed | Commit |
|----|------|--------|--------|
| - | Migration to SDD | 2025-12-24 | TBD |

---

**Dependencies:**
- T001 independent - BLOCKED (Google Workspace admin)
- T002-T003 depend on PostgreSQL connection
- T004 depends on T001 (Gmail API credentials)
- T005-T010 depend on React Email installed
- T011-T012 depend on T004 (Gmail service), T006-T010 (templates)
- T013 depends on T004 (Gmail service), T009 (alert templates)
- T014-T016 depend on T002-T003 (tables)
- T017-T019 depend on F003, F004, F007 - BLOCKED
- T020-T023 depend on T004-T013 (modules to test)
- T024-T028 depend on T011-T013 (schedulers + alerts)
- T029-T031 depend on T011-T016 (full feature)
- T032-T035 depend on T029-T031 (E2E tests pass first)

**CRITICAL PRIORITY:**
- T032 (UAT with 5 roles) is CRITICAL success metric - Must achieve >50% open rate + <4h action time
- T033 (Delivery rate validation) must achieve >99% delivery rate

---

**Last updated:** 2025-12-24 08:50 | Maintained by: Claude Code
