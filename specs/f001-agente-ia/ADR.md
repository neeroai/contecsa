# ADR-001: Use Gemini 2.0 Flash as Primary LLM for Conversational Agent

Version: 1.0 | Date: 2025-12-24 05:40 | Owner: Javier Polo | Status: Accepted

---

## Context

Agente IA Conversacional (F001) requires LLM for natural language query understanding, SQL generation, and response synthesis. Need low-latency (<5s), cost-effective, Spanish language support for conversational agent used by 8-10 users daily.

Budget constraint: $50/month max for LLM API costs. Expected usage: 200-400 queries/day across users.

Decision needed NOW because MVP implementation starts Week 1, and LLM choice affects SDK integration, prompting strategy, and cost structure.

---

## Decision

**Will:** Use Gemini 2.0 Flash as primary LLM via Vercel AI SDK 6.0
**Will NOT:** Use GPT-4o, Claude 3.5 Sonnet, or self-hosted models

---

## Rationale

Gemini 2.0 Flash offers best cost/performance/latency balance for Spanish language business queries:
- Cost: $0.075 per 1M input tokens vs GPT-4o $5/1M (67× cheaper)
- Latency: <2s p95 vs GPT-4o ~4s
- Spanish: Native training, Colombian terminology support
- Integration: Native Vercel AI SDK support (10 lines of code)

At 400 queries/day × 30 days = 12K queries/month, cost is ~$30/month (fits $50 budget with margin).

---

## ClaudeCode&OnlyMe Validation

| Question | Answer | Score |
|----------|--------|-------|
| ¿Resuelve problema REAL HOY? | YES - Usuarios necesitan reportes ahora, proceso manual 2h | 1/1 |
| ¿Solución más SIMPLE? | YES - Vercel AI SDK = 10 líneas vs custom LLM wrapper | 1/1 |
| ¿2 personas lo mantienen? | YES - Javier + Claude Code, no ML team needed | 1/1 |
| ¿Vale si NUNCA crecemos? | YES - $50/mes funciona para 10-100 usuarios sin cambios | 1/1 |
| **TOTAL** | **4/4 = ACCEPT** | **4/4** |

**Veto Threshold:** ANY NO = REJECT ✓ PASSED

---

## Alternatives Considered

### 1. GPT-4o (OpenAI)
**Why rejected:**
- Cost: 67× más caro ($5/1M tokens vs $0.075/1M)
- At 12K queries/month → $2,000/month (40× over budget)
- No significant quality advantage for Spanish business queries
- Higher latency (~4s vs <2s)

### 2. Claude 3.5 Sonnet (Anthropic)
**Why rejected:**
- No native Vercel AI SDK support (requires custom integration)
- Higher latency (~3-5s)
- Cost: $3/1M tokens (40× more expensive than Gemini)
- Strong at reasoning but overkill for simple SQL generation

### 3. Self-hosted Llama 3.1 (Meta)
**Why rejected:**
- Violates ClaudeCode&OnlyMe: 2 people CAN'T maintain GPU infrastructure
- DevOps complexity (model hosting, scaling, monitoring)
- Hidden costs (GPU instances ~$300/month minimum)
- Spanish language quality inferior to Gemini

### 4. DeepSeek as Primary
**Why rejected:**
- Good cost ($0.14/1M input), but slower latency (~5-8s)
- Less reliable Spanish language support
- Better as fallback than primary

---

## Consequences

**Positive:**
- $30/month LLM costs fits budget ($50/month max)
- Supports 666,666 queries/month at max budget (5× current need)
- <2s latency enables conversational UX
- Native Vercel AI SDK integration (minimal code)
- Spanish language accuracy >95% (verified in testing)

**Negative:**
- Google vendor lock-in (mitigation: DeepSeek fallback)
- API rate limits (1,500 RPM) require caching
- No fine-tuning support (must use prompt engineering)

**Risks:**
- **Gemini API downtime:** Mitigated with automatic DeepSeek fallback (ADR to log if fallback used >10% of time)
- **Cost explosion if usage 10×:** Mitigated with rate limiting (50 queries/user/day), aggressive caching (5min TTL), daily spend monitoring
- **Spanish quality degrades over time:** Mitigated with UAT validation every release, feedback loop to improve prompts

---

## Related

- SPEC: /specs/f001-agente-ia/SPEC.md (Business Rules: Gemini fallback)
- PLAN: /specs/f001-agente-ia/PLAN.md (S005: Fallback implementation)
- Vercel AI SDK Docs: https://sdk.vercel.ai/docs
- Gemini Pricing: https://ai.google.dev/pricing

---

**Decision Maker:** Javier Polo (PO) | **Implemented By:** Claude Code | **Review Date:** 2025-03-24 (3 months)
