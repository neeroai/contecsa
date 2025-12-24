# ADR-005: Use Gmail API Over SendGrid for Email Notifications

Version: 1.0 | Date: 2025-12-24 08:40 | Owner: Javier Polo | Status: Accepted

---

## Context

Email notification system (F005) must send daily summaries (8 AM), immediate alerts (event-triggered), and weekly executive summaries (Monday 8 AM) with >99% delivery rate, >50% open rate, and <$10/month cost. Choice between Gmail API (Google Workspace), SendGrid, or Resend.

Budget: ~10 users × 3 emails/day = 30 emails/day (900 emails/month). Expected growth: 10-30 users (max 90 emails/day = 2,700 emails/month).

Decision needed NOW because email provider selection determines authentication (OAuth vs API key), template format (HTML vs proprietary), and cost structure (free vs $20/month).

---

## Decision

**Will:** Use Gmail API (Google Workspace) for email notifications
**Will NOT:** Use SendGrid or Resend

---

## Rationale

Gmail API offers best balance of cost, simplicity, and client fit:
- **Zero cost:** Google Workspace already used by client (included, no additional charge)
- **Native integration:** Client uses Gmail daily (familiar sender, trusted domain)
- **Domain-wide delegation:** Service account can send as any user@contecsa.com
- **No vendor lock-in (email):** Gmail = standard SMTP (can switch to SendGrid Phase 2 if needed)
- **Free tier:** 100 emails/min, 1 billion emails/day (Contecsa 30/day = 0.003% of limit)
- **Deliverability:** Google domain reputation high (client already sending/receiving via Gmail)
- **2-person team:** OAuth setup once, no ongoing service management vs SendGrid (API keys, billing, monitoring)
- **Simplicity:** Client knows Google Workspace admin console (vs learning SendGrid dashboard)

For 2-person team with client already on Google Workspace, Gmail API = zero marginal cost, minimal complexity, native fit.

---

## ClaudeCode&OnlyMe Validation

| Question | Answer | Score |
|----------|--------|-------|
| ¿Resuelve problema REAL HOY? | YES - Need alerts for purchases >30 days, invoice blocked, price anomalies now to prevent losses | 1/1 |
| ¿Solución más SIMPLE? | YES - Gmail API (client already has Google Workspace) vs SendGrid (new service, new billing, API key management) | 1/1 |
| ¿2 personas lo mantienen? | YES - OAuth setup once (Javier + Claude Code), no ongoing service monitoring, Google Workspace admin already exists | 1/1 |
| ¿Vale si NUNCA crecemos? | YES - Free tier covers 10-100 users forever (100 emails/min = 6,000 emails/hour >> 30/day), no cost scaling | 1/1 |
| **TOTAL** | **4/4 = ACCEPT** | **4/4** |

**Veto Threshold:** ANY NO = REJECT ✓ PASSED

---

## Alternatives Considered

### 1. SendGrid
**Why rejected:**
- **Cost:** $19.95/month (100 emails/day tier) vs Gmail API free (client already pays Google Workspace)
- **Complexity:** New service to manage (API keys, billing, monitoring) vs Gmail (OAuth once, done)
- **Client fit:** Emails from sendgrid.net vs @contecsa.com (trusted domain)
- **Deliverability:** Similar to Gmail (both >99%), no compelling advantage
- **Analytics:** SendGrid has built-in open/click tracking, but can implement manually in Gmail (tracking pixel + UTM params)
- Violates ClaudeCode&OnlyMe: NOT simplest (new service vs existing), NOT free (cost scaling if >100 emails/day)

**Why considered Phase 2 fallback:**
- Better analytics dashboard (open/click heatmaps)
- A/B testing subject lines built-in
- If Gmail API becomes unreliable, switch to SendGrid as backup

### 2. Resend
**Why rejected:**
- **Cost:** $20/month (100 emails/day) vs Gmail API free
- **React Email native:** Resend built by React Email team, tight integration - but Gmail API works with React Email too (renders to HTML)
- **Developer UX:** Excellent (simple API, good docs) - but Gmail API also well-documented
- **No free tier:** Resend charges from first email (vs Gmail free tier 100 emails/min)
- Violates ClaudeCode&OnlyMe: NOT simplest (new service), NOT free

### 3. AWS SES (Simple Email Service)
**Why rejected:**
- **Cost:** $0.10 per 1,000 emails (cheap) - but Gmail API free
- **Complexity:** AWS account setup, IAM roles, SES domain verification vs Gmail OAuth
- **Client fit:** No AWS infrastructure yet (uses GCP for SICOM ETL)
- **Deliverability:** Requires domain verification + warmup (vs Gmail instant)

---

## Consequences

**Positive:**
- Zero cost (Google Workspace already paid)
- Trusted sender (@contecsa.com domain, high reputation)
- Native client fit (users familiar with Gmail)
- 100 emails/min free tier (covers 10-100 users forever)
- Domain-wide delegation (send as any user)
- No vendor lock-in (can switch to SendGrid Phase 2)
- Simple OAuth setup (once, then forget)
- High deliverability (Google domain reputation)

**Negative:**
- No built-in analytics dashboard (must implement tracking pixel + UTM params manually)
- No A/B testing built-in (Phase 2 enhancement)
- Gmail API quotas (100 emails/min, 1 billion/day) - unlikely to hit, but must monitor
- OAuth complexity (service account + domain-wide delegation) - one-time setup burden

**Risks:**
- **Gmail API downtime (<99% delivery):** Mitigated by retry logic (3x with backoff), queue for next daily run, monitor uptime (Google SLA 99.9%+)
- **Rate limit (100 emails/min):** Mitigated by queue with 1.2s delay, batch processing (30 emails/day = far below limit)
- **OAuth credential leak:** Mitigated by storing in environment variable (not code), rotate quarterly, service account (not user password)
- **Client switches away from Google Workspace:** Mitigated by abstraction layer (can swap to SendGrid without changing templates/logic)

---

## Implementation Details

**Gmail API Setup:**
```typescript
// lib/services/gmail.ts
import { google } from 'googleapis';

function getAuthClient() {
  const credentials = JSON.parse(process.env.GMAIL_SERVICE_ACCOUNT_JSON!);
  const auth = new google.auth.JWT(
    credentials.client_email,
    undefined,
    credentials.private_key,
    ['https://www.googleapis.com/auth/gmail.send']
  );
  return auth;
}

async function sendEmail(to: string, subject: string, html: string) {
  const gmail = google.gmail({ version: 'v1', auth: getAuthClient() });

  const message = [
    `From: Sistema Compras <compras@contecsa.com>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    '',
    html
  ].join('\n');

  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const res = await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw: encodedMessage }
  });

  return res.data.id; // Gmail message ID for tracking
}
```

**Benefits:**
- Simple API (send email in 20 lines)
- Returns gmail_message_id for tracking
- Abstracted interface (can swap provider without changing callers)

---

## Related

- SPEC: /specs/f005-notificaciones/SPEC.md (Contracts, Business Rules)
- PLAN: /specs/f005-notificaciones/PLAN.md (S001: Gmail API setup, S004: Gmail service implementation)
- Gmail API Send: https://developers.google.com/gmail/api/guides/sending
- Gmail API Quotas: https://developers.google.com/gmail/api/reference/quota
- React Email: https://react.email (works with any email provider)

---

**Decision Maker:** Javier Polo + Claude Code | **Review Date:** 2025-06-24 (6 months)
