# SDD Implementation Plan: Agente IA Conversacional

Version: 1.0 | Date: 2025-12-24 05:35 | Owner: Javier Polo | Status: Active

---

## Reference

**SPEC:** /specs/f001-agente-ia/SPEC.md
**ADR:** /specs/f001-agente-ia/ADR.md (Gemini 2.0 Flash decision)
**PRD:** docs/features/r01-agente-ia.md

---

## Stack Validated

**Framework:** Next.js 15 App Router
- Source: /Users/mercadeo/neero/docs-global/stack/nextjs-react-patterns.md:10-25
- Verified: App Router for streaming AI responses

**Language:** TypeScript 5.6+ (strict mode)
- Source: /Users/mercadeo/neero/docs-global/stack/common-stack.md:15-20
- Verified: Strict type checking enabled

**AI SDK:** Vercel AI SDK 6.0 + @ai-sdk/react 3.0
- Source: /Users/mercadeo/neero/docs-global/stack/common-stack.md:45-50
- Verified: Native Next.js integration, streaming responses

**LLM:** Gemini 2.0 Flash (primary), DeepSeek (fallback)
- Source: contecsa/CLAUDE.md:68-70
- Verified: PO requirement, cost-effective, Spanish support

**Orchestration:** LangChain
- Source: /Users/mercadeo/neero/docs-global/stack/common-stack.md:48-52
- Verified: Tool calling, memory management

**Database:** PostgreSQL 15 (read-only access for agent)
- Source: /Users/mercadeo/neero/docs-global/stack/database-guide.md:10-15
- Verified: Primary data warehouse

**Cache:** Redis (Vercel KV)
- Source: /Users/mercadeo/neero/docs-global/stack/database-guide.md:89-95
- Verified: Query result caching, rate limiting

**Backend:** Python 3.11+ (sandboxed execution)
- Source: contecsa/CLAUDE.md:33-38
- Verified: PO requirement for data analysis

**Validation Checklist:**
- [x] Stack matches docs-global/stack/ (7 citations)
- [x] NO INVENTAR protocol applied (all dependencies verified)
- [x] ClaudeCode&OnlyMe filter passed (see ADR.md)
- [x] Dependencies: PostgreSQL schema, Redis, Python runtime
- [x] Limitations: Spanish only (MVP), text input only

---

## Implementation Steps (13 steps)

### S001: Create chat UI components
**Deliverable:** `src/components/chat/ChatMessage.tsx`, `ChatInput.tsx`, `ChatContainer.tsx`
**Dependencies:** shadcn/ui components (button, input, card)
**Acceptance:**
- Chat interface renders correctly
- User can type and send messages
- Messages display in bubbles (user right, assistant left)
- Responsive design (mobile + desktop)

### S002: Implement /api/ai/chat route (streaming)
**Deliverable:** `src/app/api/ai/chat/route.ts` with Vercel AI SDK
**Dependencies:** S001 (UI consumes this API), @ai-sdk/react, ai package
**Acceptance:**
- API route accepts POST with user_query, session_id, user_role
- Returns streaming response (SSE)
- Integrates with Vercel AI Gateway
- Logs query_received event

### S003: LangChain tool functions
**Deliverable:** `src/lib/ai/tools/queryDatabase.ts`, `analyzeData.ts`, `generateChart.ts`
**Dependencies:** S002 (route calls tools), LangChain, PostgreSQL client
**Acceptance:**
- queryDatabase: Generates SQL SELECT queries, parameterized
- analyzeData: Executes Python pandas code in sandbox
- generateChart: Creates matplotlib charts, returns base64 PNG
- All tools have timeout 10s
- Role-based filtering applied (user.authorized_projects)

### S004: Redis cache integration
**Deliverable:** `src/lib/ai/cache.ts` with query hash → result mapping
**Dependencies:** S003 (tools cache results), Vercel KV setup
**Acceptance:**
- Query hashed (MD5 of user_query + user_role)
- Cache hit: Return cached result, log cache_hit
- Cache miss: Execute query, cache result with 5min TTL
- Cache hit rate >50% in local testing

### S005: Gemini → DeepSeek fallback logic
**Deliverable:** `src/lib/ai/providers.ts` with automatic failover
**Dependencies:** S002 (route uses providers), AI Gateway config
**Acceptance:**
- Gemini API call fails (503, 429) → DeepSeek called automatically
- Fallback triggered within 2s (no user wait)
- Logs fallback_triggered event
- Manual testing: Simulate Gemini down, verify DeepSeek works

### S006: Rate limiting middleware
**Deliverable:** `src/middleware/rateLimit.ts` - 50 queries/user/day
**Dependencies:** S002 (middleware wraps route), Redis for counter
**Acceptance:**
- Counter: user_id → query_count (daily reset at 00:00)
- Quota exceeded → 429 status + "Límite alcanzado" message
- Reset time returned in response headers
- Edge function compatible (Vercel Edge Runtime)

### S007: SQL query validation (read-only, parameterized)
**Deliverable:** `src/lib/ai/sqlValidator.ts`
**Dependencies:** S003 (queryDatabase uses validator)
**Acceptance:**
- Rejects DDL (CREATE, DROP), DML (INSERT, UPDATE, DELETE), DCL (GRANT)
- Only SELECT allowed
- Parameterized queries enforced (no string interpolation)
- SQL injection attempts logged as security_incident
- Unit tests: 10 malicious queries rejected

### S008: Chart generation (Python backend)
**Deliverable:** `api/routers/charts.py` - FastAPI endpoint
**Dependencies:** S003 (generateChart tool calls this), Python runtime
**Acceptance:**
- Accepts chart_type (bar|line|pie), data (JSON array)
- Generates matplotlib chart
- Returns base64 PNG image
- Timeout 3s
- Sandboxed execution (no file system access)

### S009: Excel export function
**Deliverable:** `src/lib/ai/tools/exportToExcel.ts`
**Dependencies:** S003 (tool), xlsx library
**Acceptance:**
- Accepts data table (array of objects)
- Generates .xlsx file
- Returns download URL (Vercel Blob storage)
- File expires after 24h
- Includes metadata (query, timestamp, user)

### S010: Integration with Dashboard (R2)
**Deliverable:** Chart embedding in dashboard widgets
**Dependencies:** S008 (chart generation), F002 (Dashboard feature)
**Acceptance:**
- Generated charts can be embedded in dashboard
- Chart data shared via API /api/charts/:id
- Dashboard fetches chart by ID
- Real-time updates when chart regenerated

### S011: Spanish language prompt engineering
**Deliverable:** `src/lib/ai/prompts.ts` - System prompts in Spanish
**Dependencies:** S002 (route uses prompts)
**Acceptance:**
- System prompt defines agent personality (helpful, concise, business-focused)
- Examples of business queries (concreto, combustible, ODC, ODS)
- Handles Colombian Spanish nuances (consorcio, obra, etc.)
- Few-shot examples for query interpretation

### S012: Unit tests (tool functions, validation)
**Deliverable:** `tests/unit/ai/` - Vitest tests
**Dependencies:** S003-S009 (all tools implemented)
**Acceptance:**
- queryDatabase: 10 test cases (valid SQL, injection attempts, timeout)
- analyzeData: 5 test cases (pandas code, sandbox, timeout)
- cache: 5 test cases (hit, miss, TTL expiration)
- rateLimit: 5 test cases (under limit, exceeded, reset)
- Coverage >80% on ai/tools/

### S013: E2E tests (10 predefined queries)
**Deliverable:** `tests/e2e/ai-agent.spec.ts` - Playwright tests
**Dependencies:** S001-S011 (full feature implemented)
**Acceptance:**
- US1.1: "Compras PAVICONSTRUJC Q1 2025" → Chart + data table
- US1.2: "Gráfica combustible último año" → Line chart PNG export
- US1.3: "Gasto concreto este mes vs anterior" → Text response + percentage
- US1.4: "Consumo promedio arena PTAR" → Average calculation
- Edge cases: No results, rate limit, ambiguous query
- All 10 queries execute in <10s

---

## Milestones

**M1 - Chat + LLM Integration:** [S001-S004] | Target: Week 1
- Chat interface functional
- Vercel AI SDK streaming works
- LangChain tools execute SQL queries
- Redis caching reduces API costs

**M2 - Advanced Features:** [S005-S009] | Target: Week 2
- Gemini → DeepSeek fallback automatic
- Rate limiting enforced
- SQL validation prevents injection
- Charts generated via Python backend
- Excel export available

**M3 - Integration + Testing:** [S010-S013] | Target: Week 3
- Dashboard integration complete
- Spanish prompts optimized
- Unit tests >80% coverage
- E2E tests all passing
- UAT with Liced Vega

---

## Risk Mitigation

| Risk | Mitigation | Owner |
|------|-----------|-------|
| Gemini API costs explode | Aggressive caching (5min TTL), rate limiting (50/day), monitor daily spend, alert if >$10/day | Javier Polo |
| SQL injection despite safeguards | Read-only DB user, parameterized queries ONLY, query validation, security audit before production | Claude Code |
| Python code execution timeout | 10s hard timeout, async execution, fallback to SQL-only mode if Python fails | Claude Code |
| Spanish language accuracy <95% | Prompt engineering with few-shot examples, business terminology glossary, UAT with native speakers | Liced Vega |
| Gemini API downtime (>1h) | DeepSeek automatic fallback, monitor uptime, alert if fallback used >10% of time | Javier Polo |
| Cache memory overflow | Redis max memory 100MB, LRU eviction policy, monitor cache size, alert if >80% | Claude Code |

---

## Notes

**Critical Constraints:**
- SICOM integration (R6) must complete BEFORE agent has purchase data to query
- Dashboard (R2) should be implemented in parallel for chart embedding
- PostgreSQL schema must include price history for anomaly detection queries

**Assumptions:**
- Users primarily use desktop (mobile chat UX is secondary)
- Spanish language only for MVP (English in Phase 2)
- 10 concurrent users max (no load balancing needed yet)

**Blockers:**
- Python runtime must be deployed separately (FastAPI on Google Cloud Run or AWS Lambda)
- Vercel AI Gateway setup requires API keys for Gemini + DeepSeek

**Previous ADRs:** None (first AI feature)

---

**Last updated:** 2025-12-24 05:35 | Maintained by: Javier Polo + Claude Code
