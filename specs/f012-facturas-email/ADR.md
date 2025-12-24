# ADR-012: Use Gmail API Polling (Every 5 Min) Over Real-Time Webhooks

Version: 1.0 | Date: 2025-12-24 11:40 | Owner: Javier Polo | Status: Accepted

---

## Context

Invoice ingestion system (F012) requires monitoring inbox factura@contecsa.com for new invoices. Choice between Gmail API Polling (pull every 5 min) vs Real-Time Webhooks (Gmail Push API, instant notification when email arrives).

Critical requirements:
- Process invoices 24/7 (not manual)
- Acceptable latency: <5 min from email received to Contabilidad notification
- Integrate with existing Gmail API setup (F011)
- 2-person team (no dedicated email infrastructure)
- Low complexity (no webhook infrastructure management)

Decision needed NOW because polling vs webhooks determines infrastructure complexity, latency guarantees, and operational overhead.

---

## Decision

**Will:** Use Gmail API Polling (pull every 5 minutes via Vercel Cron)
**Will NOT:** Use Gmail Push API (real-time webhooks) or third-party email forwarding services

---

## Rationale

Gmail API Polling offers best balance of acceptable latency (<5 min), zero infrastructure overhead, and 2-person maintainability:
- **Acceptable Latency:** 5 min polling = 5 min max latency (vs real-time = instant) → Acceptable for invoice processing (not time-critical like alerts)
- **Zero Infrastructure:** Vercel Cron = built-in scheduler (vs webhooks = need public endpoint + HTTPS + webhook secret management)
- **Simplicity:** Polling = stateless GET request (vs webhooks = complex: subscribe, renew subscription every 7 days, handle webhook retries, verify signatures)
- **Same Gmail API:** Reuse F011 Gmail API setup (service account already configured) (vs webhooks = additional OAuth scopes + Pub/Sub setup)
- **Cost:** Vercel Cron = $0 (included in Pro plan) (vs Gmail Push = requires Google Cloud Pub/Sub = $0.40 per million messages)
- **Reliability:** Polling = deterministic (every 5 min guaranteed) (vs webhooks = must handle retries, failures, duplicate deliveries)
- **2-person Maintainable:** No webhook infrastructure, no subscription renewal, no Pub/Sub config (vs webhooks = requires monitoring subscriptions, handling failures)

For invoice processing (not time-critical), 5 min latency = acceptable trade-off for zero infrastructure overhead.

---

## ClaudeCode&OnlyMe Validation

| Question | Answer | Score |
|----------|--------|-------|
| ¿Resuelve problema REAL HOY? | YES - Need invoice ingestion NOW (20 min manual → 2 min auto), 5 min latency acceptable for invoices (not real-time alerts) | 1/1 |
| ¿Solución más SIMPLE? | YES - Polling = 20 lines code (vs webhooks = 100+ lines: subscribe, renew, verify signatures, handle retries, Pub/Sub config) | 1/1 |
| ¿2 personas lo mantienen? | YES - No webhook infrastructure, no Pub/Sub config, no subscription renewal (vs webhooks = monitoring subscriptions, handling failures) | 1/1 |
| ¿Vale si NUNCA crecemos? | YES - 10-100 invoices/day, 5 min latency sufficient (vs webhooks = only beneficial for >1000 emails/day real-time) | 1/1 |
| **TOTAL** | **4/4 = ACCEPT** | **4/4** |

**Veto Threshold:** ANY NO = REJECT ✓ PASSED

---

## Alternatives Considered

### 1. Gmail Push API (Real-Time Webhooks)
**Why rejected:**
- **Complexity:** Requires Google Cloud Pub/Sub setup (topic creation, IAM permissions, subscription management)
- **Subscription Renewal:** Webhooks expire every 7 days → Must renew automatically (cron job) or risk missing emails
- **Webhook Infrastructure:** Need public HTTPS endpoint, webhook secret management, signature verification (HMAC-SHA256)
- **Error Handling:** Must handle retries, duplicate deliveries, webhook failures (transient errors)
- **Cost:** Pub/Sub = $0.40 per million messages (vs polling = $0)
- **Latency Benefit:** Real-time (instant) vs 5 min polling → NOT critical for invoices (not alerts)
- Violates ClaudeCode&OnlyMe: NOT simplest (Pub/Sub + webhook infrastructure vs cron), NOT 2-person maintainable (subscription renewal + monitoring)

**Why NOT considered Phase 2:**
- 5 min latency acceptable for invoices (no business requirement for real-time)
- If client needs real-time → Unlikely (invoices processed daily/weekly, not seconds)

### 2. Third-Party Email Forwarding (e.g., Zapier, Make.com)
**Why rejected:**
- **Cost:** Zapier = $20-50/month for email automation (vs Vercel Cron = $0)
- **Data Privacy:** Invoices sent to third-party service (vs Gmail API = direct access)
- **Reliability:** Depends on third-party uptime (vs Gmail API = 99.99% SLA)
- **Lock-in:** Vendor-specific configuration (vs Gmail API = standard Google service)
- Violates ClaudeCode&OnlyMe: NOT simplest (additional vendor vs built-in Gmail API), NOT solving problem (adds complexity, not value)

**Why NOT considered Phase 2:**
- Gmail API sufficient, no reason to add third-party dependency

### 3. IMAP Polling (Standard Email Protocol)
**Why rejected:**
- **Authentication:** Requires app-specific password (less secure than service account)
- **Rate Limits:** IMAP = slower than Gmail API, no batch requests
- **Attachment Handling:** IMAP = complex MIME parsing (vs Gmail API = base64 decode)
- **Marking Read:** IMAP = requires IMAP STORE command (vs Gmail API = messages.modify())
- Violates ClaudeCode&OnlyMe: NOT simplest (IMAP MIME parsing vs Gmail API JSON), Gmail API already setup (F011)

**Why NOT considered Phase 2:**
- Gmail API superior in every way (performance, security, simplicity)

### 4. Email Forwarding to Webhook Endpoint (e.g., SendGrid Inbound Parse)
**Why rejected:**
- **Requires SendGrid Account:** Additional vendor (vs Gmail API native)
- **Email Forwarding Setup:** Gmail forwarding rules (manual config) + SPF verification
- **Webhook Infrastructure:** Same complexity as Gmail Push (public endpoint, signature verification)
- **Cost:** SendGrid Inbound Parse = $0 (free tier) BUT requires SendGrid account setup
- Violates ClaudeCode&OnlyMe: NOT simplest (Gmail forwarding + SendGrid vs Gmail API polling), additional vendor

**Why NOT considered Phase 2:**
- Gmail API polling sufficient, no benefit from forwarding

---

## Consequences

**Positive:**
- Zero infrastructure (Vercel Cron built-in)
- Simplicity (20 lines code: poll → extract → process)
- Reuse F011 Gmail API setup (service account already configured)
- $0 marginal cost (Vercel Cron included in Pro plan)
- Deterministic polling (every 5 min guaranteed)
- 2-person maintainable (no webhook infrastructure, no subscription renewal)

**Negative:**
- Latency: Up to 5 min (vs real-time webhooks = instant) (mitigated: 5 min acceptable for invoices)
- API Calls: 288 calls/day (every 5 min) (mitigated: Gmail API quota = 250 req/sec, 288/day = 0.003% usage)

**Risks:**
- **Gmail API downtime:** Mitigated by 99.99% SLA, retry 3x with backoff, alert admin if polling fails
- **Vercel Cron failure:** Mitigated by Vercel monitoring, alert if cron doesn't run (2 consecutive failures)
- **Latency exceeds 5 min:** Mitigated by performance monitoring, alert if processing time >5 min
- **Large inbox (>100 unread emails):** Mitigated by batch processing (50 emails per poll), queue overflow for next poll

---

## Implementation Details

**Vercel Cron Configuration:**
```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/poll-invoice-emails",
      "schedule": "*/5 * * * *"  // Every 5 minutes
    }
  ]
}
```

**Gmail API Polling:**
```typescript
// /src/app/api/cron/poll-invoice-emails/route.ts
import { NextResponse } from 'next/server';
import { pollInvoiceInbox } from '@/lib/email-intake/poll-inbox';

export async function GET() {
  try {
    const result = await pollInvoiceInbox();

    return NextResponse.json({
      processed: result.processed_count,
      blocked: result.blocked_count,
      errors: result.error_count,
      last_poll_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Poll invoice emails failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

**Benefits:**
- No webhook infrastructure (no public endpoint, no signature verification)
- No Google Cloud Pub/Sub setup (no topic creation, no IAM permissions)
- No subscription renewal (polling = stateless)
- No complex error handling (polling = deterministic, retry 3x if fail)

---

## Related

- SPEC: /specs/f012-facturas-email/SPEC.md (Gmail polling integration)
- PLAN: /specs/f012-facturas-email/PLAN.md (S003: Gmail polling service)
- F011: /specs/f011-google-workspace/ADR.md (Gmail API setup reference)
- Gmail API: https://developers.google.com/gmail/api/guides/polling
- Gmail Push API: https://developers.google.com/gmail/api/guides/push (rejected alternative)
- Stack: /Users/mercadeo/neero/docs-global/stack/common-stack.md:80-85 (Vercel Cron)

---

**Decision Maker:** Javier Polo + Claude Code | **Review Date:** 2025-06-24 (6 months)
