# Vercel AI Gateway Integration Guide

Version: 1.0 | Date: 2025-12-22 23:55 | Type: Integration | Status: Active

---

## Overview

Vercel AI Gateway actúa como proxy centralizado para múltiples proveedores LLM (Gemini, DeepSeek, OpenAI) con manejo unificado de API keys, rate limiting, caching, observabilidad y fallback automático entre modelos.

**Key Benefit:** Centraliza configuración de proveedores LLM, facilita cambio de modelo sin cambios de código, reduce costos con caching, monitorea uso y latencia.

---

## Architecture

```
Frontend/Backend (Vercel AI SDK)
  ↓
Vercel AI Gateway (Proxy)
  ├─→ Route to provider (based on model parameter)
  ├─→ Apply rate limits
  ├─→ Check cache (reduce costs)
  └─→ Log request (observability)
  ↓
LLM Providers
  ├─→ Gemini 2.0 Flash (primary - Google)
  ├─→ DeepSeek (fallback - DeepSeek)
  └─→ OpenAI GPT-4 (optional - OpenAI)
```

---

## Setup

### 1. Enable AI Gateway (Vercel Dashboard)

```bash
# Steps:
1. Go to Vercel Dashboard → Project → Settings
2. Navigate to "AI" section
3. Enable "AI Gateway"
4. Gateway endpoint created: https://gateway.ai.vercel.app/v1
```

### 2. Configure Providers (Vercel Dashboard)

**Add Provider: Gemini (Primary)**

```yaml
Provider: Google AI
Model ID: gemini-2.0-flash-exp
API Key: [Add from Google AI Studio]
Rate Limit: 60 requests/minute (default)
Caching: Enabled (24h TTL)
```

**Add Provider: DeepSeek (Fallback)**

```yaml
Provider: DeepSeek
Model ID: deepseek-chat
API Key: [Add from DeepSeek platform]
Rate Limit: 100 requests/minute
Caching: Enabled (24h TTL)
```

**Add Provider: OpenAI (Optional)**

```yaml
Provider: OpenAI
Model ID: gpt-4-turbo
API Key: [Add from OpenAI platform]
Rate Limit: 500 requests/minute (based on tier)
Caching: Disabled (OpenAI has own caching)
```

### 3. Environment Variables

```env
# .env.local
VERCEL_AI_GATEWAY_URL=https://gateway.ai.vercel.app/v1

# Provider API keys (stored in Vercel dashboard, not code)
# These are managed via Vercel UI, not env vars
```

---

## Implementation (Vercel AI SDK 6.0)

### Basic Usage

```typescript
// /src/lib/ai/chat.ts
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_AI_API_KEY!, // Managed by AI Gateway
  baseURL: process.env.VERCEL_AI_GATEWAY_URL, // Route through gateway
});

export async function askAI(prompt: string) {
  const { text } = await generateText({
    model: google('gemini-2.0-flash-exp'),
    prompt,
    temperature: 0.7,
    maxTokens: 2048,
  });

  return text;
}
```

### Fallback Strategy (Gemini → DeepSeek)

```typescript
// /src/lib/ai/chat-with-fallback.ts
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createDeepSeek } from '@ai-sdk/deepseek';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_AI_API_KEY!,
  baseURL: process.env.VERCEL_AI_GATEWAY_URL,
});

const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY!,
  baseURL: process.env.VERCEL_AI_GATEWAY_URL,
});

export async function askAIWithFallback(prompt: string): Promise<string> {
  try {
    // Try Gemini first (faster, cheaper)
    const { text } = await generateText({
      model: google('gemini-2.0-flash-exp'),
      prompt,
      temperature: 0.7,
      maxTokens: 2048,
    });
    return text;

  } catch (error) {
    console.warn('Gemini failed, falling back to DeepSeek:', error);

    // Fallback to DeepSeek
    const { text } = await generateText({
      model: deepseek('deepseek-chat'),
      prompt,
      temperature: 0.7,
      maxTokens: 2048,
    });
    return text;
  }
}
```

### Streaming Response (Chat UI)

```typescript
// /src/app/api/ai/chat/route.ts
import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_AI_API_KEY!,
  baseURL: process.env.VERCEL_AI_GATEWAY_URL,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('gemini-2.0-flash-exp'),
    messages,
    temperature: 0.7,
    maxTokens: 2048,
  });

  return result.toDataStreamResponse();
}
```

---

## Rate Limiting

**Configuration (Vercel Dashboard → AI Gateway → Provider Settings)**

| Provider | Rate Limit | Burst Allowance | Action on Limit |
|----------|------------|-----------------|-----------------|
| Gemini | 60 req/min | 10 req burst | Return 429, retry after 1 min |
| DeepSeek | 100 req/min | 20 req burst | Return 429, retry after 1 min |
| OpenAI | 500 req/min | 50 req burst | Return 429, retry after 1 min |

**Client-Side Handling:**

```typescript
// /src/lib/ai/rate-limit-handler.ts
export async function callAIWithRetry(
  fn: () => Promise<string>,
  maxRetries: int = 3
): Promise<string> {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429) {
        // Rate limit exceeded
        const retryAfter = error.headers?.['retry-after'] || 60;
        console.warn(`Rate limited. Retrying after ${retryAfter}s...`);

        await sleep(retryAfter * 1000);
        retries++;
      } else {
        throw error; // Other error, don't retry
      }
    }
  }

  throw new Error('Max retries exceeded');
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

---

## Caching (Cost Optimization)

**AI Gateway automatically caches responses for 24h (configurable)**

**How it works:**
1. Request sent to AI Gateway with prompt
2. Gateway checks cache (SHA-256 hash of prompt + model)
3. If cache hit → Return cached response (0 cost, <10ms latency)
4. If cache miss → Call LLM provider → Cache response

**Cache Key Example:**
```
SHA-256(model=gemini-2.0-flash-exp&prompt=¿Cuánto gastamos en cemento?)
→ 3f8a9b2c...
```

**Benefits:**
- Repeated questions (e.g., "¿Cuánto gastamos en cemento?") → 0 cost after first call
- Reduces latency from 1-2s → <10ms
- Especially useful for dashboard queries (same query on page load)

**Configuration (Vercel Dashboard):**
- TTL: 24 hours (default, adjustable 1h - 7 days)
- Max cache size: 100 MB per project
- Cache invalidation: Automatic after TTL or manual via API

---

## Observability (Monitoring)

**Vercel AI Gateway Dashboard provides:**

| Metric | Description | Use Case |
|--------|-------------|----------|
| Request count | Total AI requests (per day/week/month) | Track usage trends |
| Latency (P50, P95, P99) | Response time percentiles | Detect performance issues |
| Cache hit rate | % requests served from cache | Optimize caching strategy |
| Error rate | % requests that failed | Monitor reliability |
| Cost per model | $ spent on each LLM provider | Optimize model selection |
| Tokens used | Input + output tokens per model | Track API costs |

**Alert Configuration (Vercel Dashboard):**
- Alert if error rate >5% (1 hour window)
- Alert if cost >$100/day (budget overrun)
- Alert if latency P95 >3s (performance degradation)

---

## Model Selection Strategy

**Decision Matrix:**

| Use Case | Model | Rationale |
|----------|-------|-----------|
| Chat/queries (general) | Gemini 2.0 Flash | Fast (<1s), cheap ($0.075/1M), excellent Spanish |
| Complex analysis | Gemini 2.0 Flash | 1M token context, handles long documents |
| Fallback (if Gemini down) | DeepSeek | Reliable, good quality, $0.14/1M |
| High-stakes decisions | GPT-4 Turbo (optional) | Best reasoning, but expensive ($10/1M) |

**Code Example (Dynamic Selection):**

```typescript
function selectModel(taskComplexity: 'simple' | 'complex' | 'critical') {
  switch (taskComplexity) {
    case 'simple':
      return google('gemini-2.0-flash-exp'); // Cheap, fast
    case 'complex':
      return google('gemini-2.0-flash-exp'); // 1M context
    case 'critical':
      return openai('gpt-4-turbo'); // Best quality
  }
}

const result = await generateText({
  model: selectModel('simple'),
  prompt: '¿Cuánto gastamos en cemento?'
});
```

---

## Security

| Risk | Mitigation |
|------|------------|
| API key leak | Keys stored in Vercel (not code), auto-rotation supported |
| Unauthorized access | Requests authenticated via Vercel session/API key |
| Prompt injection | Input sanitization, prompt engineering best practices |
| Data leakage (to LLM) | NO sensitive data (PII, credentials) in prompts, audit logs |

---

## Cost Management

**Budget Alerts (Vercel Dashboard):**
- Set monthly budget: $100/month
- Alert at 50%, 80%, 90% budget
- Auto-disable AI Gateway if 100% exceeded (optional)

**Cost Optimization Strategies:**
1. **Use caching:** 80% cache hit rate = 80% cost reduction
2. **Limit tokens:** Set maxTokens=2048 (not 4096) for most queries
3. **Prefer Gemini:** 10x cheaper than GPT-4 ($0.075 vs $0.75/1M)
4. **Batch requests:** Group similar queries to leverage caching

**Example Cost Calculation:**
- 1,000 queries/day × 30 days = 30,000 queries/month
- Avg tokens per query: 500 input + 1,000 output = 1,500 tokens
- Total tokens: 30,000 × 1,500 = 45M tokens
- Cost (Gemini): 45M × $0.075/1M = $3.37/month
- **With 80% cache hit:** $3.37 × 0.20 = $0.67/month

---

## References

- Vercel AI Gateway Docs: https://vercel.com/docs/ai/ai-gateway
- Vercel AI SDK 6.0: https://sdk.vercel.ai/docs
- R1 (AI Agent): docs/features/r01-agente-ia.md
- Tech Stack: docs/tech-stack-detailed.md (AI section)
- Deploy Checklist: docs/deploy-checklist.md (AI Gateway setup)
