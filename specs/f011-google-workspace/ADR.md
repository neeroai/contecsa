# ADR-011: Use Gmail API + Service Account Over Third-Party Email Services

Version: 1.0 | Date: 2025-12-24 11:10 | Owner: Javier Polo | Status: Accepted

---

## Context

Notification system (F005) + data export (F002/F003) require email delivery and spreadsheet creation. Choice between Gmail API (native Google Workspace integration) vs Third-Party Email (SendGrid, AWS SES, Mailgun) and Sheets API vs CSV/Excel downloads.

Critical requirements:
- Client already uses Google Workspace (@contecsa.com emails)
- Users familiar with Google Sheets (current manual process)
- SSO preferred (reduce account creation overhead)
- Export format = Sheets (not Excel, users explicitly prefer Sheets)
- Email sender = notificaciones@contecsa.com (corporate domain)
- 2-person team (no dedicated email infrastructure team)

Decision needed NOW because email provider determines deliverability rate, SPF/DKIM configuration, cost model, and export format determines user adoption (Sheets vs Excel familiarity).

---

## Decision

**Will:** Use Gmail API + Google Sheets API + OAuth 2.0 (native Google Workspace integration)
**Will NOT:** Use SendGrid, AWS SES, or custom SMTP for emails, or CSV/Excel for exports

---

## Rationale

Gmail API + Sheets API offers best balance of zero-configuration (client already has Workspace), native integration (no SPF/DKIM setup), and user familiarity for 2-person team:
- **Zero-configuration:** Client has Google Workspace → Gmail API works instantly (vs SendGrid SPF/DKIM DNS records setup = 2 days)
- **Native integration:** Send from notificaciones@contecsa.com (corporate domain) → No "via sendgrid.net" header (vs SendGrid requires DNS verification)
- **Cost:** Included in Workspace ($6/user/month already paid) → $0 marginal cost (vs SendGrid $20/month for 100 emails/day)
- **Deliverability:** Gmail → Gmail inbox = 99.9% deliverability (vs SendGrid = 95-98%, often spam filtered)
- **User familiarity:** Sheets export = no training (users already use Sheets daily) (vs Excel = download file, manual upload to Drive)
- **SSO built-in:** OAuth 2.0 @contecsa.com domain = instant login (vs custom account creation + password management)
- **Service Account:** Automated emails/exports without user consent (vs OAuth per-user = complex consent flow for 10 users)
- **Simplicity:** googleapis SDK = 10 lines code (vs SendGrid SDK + Sheets API = 2 SDKs to maintain)
- **2-person maintainable:** No email infrastructure (no SMTP server, no queue, no retry logic) (vs SendGrid = webhook setup, bounce handling)

For client with existing Workspace + users familiar with Sheets, Gmail/Sheets API = native solution with zero overhead.

---

## ClaudeCode&OnlyMe Validation

| Question | Answer | Score |
|----------|--------|-------|
| ¿Resuelve problema REAL HOY? | YES - Need notifications NOW (compras >30d), exports NOW (2h manual → 5 min), client already has Workspace | 1/1 |
| ¿Solución más SIMPLE? | YES - googleapis SDK = 10 lines (vs SendGrid SDK + Sheets SDK + SPF/DKIM config = 50+ lines + DNS setup) | 1/1 |
| ¿2 personas lo mantienen? | YES - No email server, no queue, no bounce handling, Service Account = automated (vs SendGrid = webhook integration, retry logic, bounce handling) | 1/1 |
| ¿Vale si NUNCA crecemos? | YES - 10-100 users, 100 emails/day (free) / 2000 emails/day (Workspace), no infrastructure changes (vs SendGrid $20/month forever) | 1/1 |
| **TOTAL** | **4/4 = ACCEPT** | **4/4** |

**Veto Threshold:** ANY NO = REJECT ✓ PASSED

---

## Alternatives Considered

### 1. SendGrid (Third-Party Email Service)
**Why rejected:**
- **SPF/DKIM setup:** Requires DNS TXT records (2 days setup, client admin overhead)
- **"via sendgrid.net":** Email header shows "via sendgrid.net" unless domain verified (confuses recipients)
- **Cost:** $20/month for 100 emails/day (vs $0 with Workspace)
- **Deliverability:** 95-98% (vs Gmail API 99.9% Gmail → Gmail)
- **Complexity:** Webhook integration for bounces, retry logic, queue management (vs Service Account = fire-and-forget)
- **2-person team:** Requires monitoring SendGrid dashboard, handling bounces, managing API keys (vs Gmail API = same credentials for emails + Sheets)
- Violates ClaudeCode&OnlyMe: NOT simplest (SPF/DKIM + webhooks vs single SDK), NOT 2-person maintainable (monitoring + bounces)

**Why NOT considered Phase 2:**
- Gmail API sufficient (2000 emails/day), no reason to add SendGrid complexity
- If client cancels Workspace → Unlikely (entire company uses Workspace)

### 2. AWS SES (Amazon Simple Email Service)
**Why rejected:**
- **AWS account required:** Client must create AWS account (additional vendor)
- **Sandbox mode:** Initially limited to 200 emails/day (must request production access)
- **Configuration overhead:** IAM roles, SES domain verification, SNS topics for bounces
- **Cost:** $0.10 per 1,000 emails (vs $0 with Workspace) + data transfer fees
- **Complexity:** Similar to SendGrid (webhooks, bounces, queue)
- Violates ClaudeCode&OnlyMe: NOT simplest (AWS IAM + SES + SNS vs single Gmail API), requires AWS account (additional infrastructure)

**Why NOT considered Phase 2:**
- Only beneficial if client already has AWS infrastructure
- Gmail API + Workspace = simpler

### 3. Custom SMTP Server (Self-Hosted)
**Why rejected:**
- **Infrastructure:** Requires dedicated server (EC2, GCP Compute Engine), Postfix/Sendmail setup
- **Maintenance:** Queue management, spam filtering, blacklist monitoring, SSL certificates
- **Deliverability:** Self-hosted = often spam filtered (no reputation), requires warmup period
- **Cost:** Server $20-50/month + monitoring + maintenance time
- Violates ClaudeCode&OnlyMe: NOT simplest (Postfix config = 100+ lines), NOT 2-person maintainable (requires sysadmin skills)

**Why NOT considered Phase 2:**
- No benefits over Gmail API, only adds complexity

### 4. Excel/CSV Downloads (Instead of Sheets Export)
**Why rejected:**
- **User workflow:** Download CSV → Upload to Google Drive → Open in Sheets (3 steps vs 1-click Sheets export)
- **Familiarity:** Users prefer Sheets (meet 2025-12-22: "acostumbrados a Sheets")
- **Collaboration:** CSV = local file (no sharing), Sheets = shareable link (anyone with link)
- **Formulas:** CSV = no formulas, Sheets = formulas preserved (SUM, AVERAGE)
- Violates ClaudeCode&OnlyMe: NOT solving problem (users want Sheets, not Excel)

**Why considered for fallback:**
- If Sheets API quota exceeded → Offer CSV download as fallback
- But primary export = Sheets

---

## Consequences

**Positive:**
- Zero-configuration (client has Workspace)
- Native integration (send from @contecsa.com, no "via" header)
- $0 marginal cost (included in Workspace)
- 99.9% deliverability (Gmail → Gmail)
- User familiarity (Sheets = no training)
- SSO built-in (OAuth @contecsa.com)
- Service Account (automated emails without user consent)
- Simplicity (googleapis SDK = 10 lines)
- 2-person maintainable (no email infrastructure)

**Negative:**
- Google Workspace dependency (if client cancels → must migrate to SendGrid, mitigated: entire company uses Workspace)
- Quota limits (100 emails/day free, 2000/day Workspace) (mitigated: client has Workspace = 2000/day sufficient)
- Gmail API downtime (99.99% SLA, rare, mitigated: retry 3x with backoff)

**Risks:**
- **Client cancels Workspace:** Mitigated by business dependency (entire company uses Workspace, unlikely to cancel)
- **Quota exceeded (2000 emails/day):** Mitigated by batching users, prioritizing CRITICAL alerts, tracking quota usage daily
- **Service Account delegation not configured:** Mitigated by setup guide, admin training session, test with test email before production
- **Gmail API breaking changes:** Mitigated by googleapis SDK (Google maintains compatibility), monitoring release notes

---

## Implementation Details

**Service Account Setup:**
```bash
# 1. Create service account in GCP Console
gcloud iam service-accounts create contecsa-sistema \\
  --display-name="Contecsa Sistema Compras"

# 2. Download JSON key
gcloud iam service-accounts keys create ~/contecsa-key.json \\
  --iam-account=contecsa-sistema@PROJECT_ID.iam.gserviceaccount.com

# 3. Enable APIs
gcloud services enable gmail.googleapis.com sheets.googleapis.com drive.googleapis.com

# 4. Domain-wide delegation (admin.google.com)
# Admin Console → Security → API Controls → Domain-wide Delegation
# Add client ID from service account, scopes:
# - https://www.googleapis.com/auth/gmail.send
# - https://www.googleapis.com/auth/spreadsheets
# - https://www.googleapis.com/auth/drive.file
```

**Benefits:**
- Automated emails/exports without user consent
- Single credentials for Gmail + Sheets + Drive
- No OAuth consent flow for each user
- 2-person team can manage (no complex auth)

---

## Related

- SPEC: /specs/f011-google-workspace/SPEC.md (Gmail/Sheets integration, SSO)
- PLAN: /specs/f011-google-workspace/PLAN.md (S001: Service Account setup)
- F005: /specs/f005-notificaciones/ADR.md (Gmail API decision reference)
- Gmail API: https://developers.google.com/gmail/api
- Sheets API: https://developers.google.com/sheets/api
- Service Accounts: https://cloud.google.com/iam/docs/service-accounts
- Stack: /Users/mercadeo/neero/docs-global/stack/common-stack.md:50-55 (third-party APIs)

---

**Decision Maker:** Javier Polo + Claude Code | **Review Date:** 2025-06-24 (6 months)
