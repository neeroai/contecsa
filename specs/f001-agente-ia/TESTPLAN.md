# Test Plan: Agente IA Conversacional

Version: 1.0 | Date: 2025-12-24 05:45 | Owner: Claude Code | Status: Active

---

## Reference

**SDD Version:** 1.0
**Feature:** Agente IA Conversacional (F001)
**Scope:** Unit + Integration + E2E
**Coverage Target:** 80% critical paths (LLM tools, cache, validation)

---

## Test Strategy

**Philosophy:** 80% coverage on AI tool functions, cache logic, and query validation. Unit tests verify LLM tool execution. Integration tests verify API → LLM → DB flow. E2E tests verify user workflows with real queries.

**Approach:**
- Unit: Test LangChain tool functions in isolation (Vitest + mocks)
- Integration: Test /api/ai/chat route with MSW for LLM mocking
- E2E: Test chat interface + real queries via Playwright

**Critical Paths (Must Test):**
1. User query → SQL generation → DB execution → Response
2. Cache hit path (query hash → Redis → cached response)
3. Gemini failure → DeepSeek fallback → Response
4. Rate limit enforcement (50 queries/day)
5. SQL injection prevention

---

## Unit Tests

| Module | Test Cases | Tool | Status |
|--------|-----------|------|--------|
| lib/ai/tools/queryDatabase | - Valid SQL SELECT generation<br>- Parameterization enforced<br>- DDL/DML rejected<br>- Read-only user verification<br>- 10s timeout enforcement<br>- Role-based filtering (user.authorized_projects) | Vitest + PostgreSQL mock | TODO |
| lib/ai/tools/analyzeData | - Pandas code execution in sandbox<br>- Whitelisted libraries only (pandas, numpy, matplotlib)<br>- 10s timeout enforcement<br>- File system access blocked<br>- Code injection prevention | Vitest + Python sandbox mock | TODO |
| lib/ai/cache | - Query hash generation (MD5)<br>- Cache hit returns cached result<br>- Cache miss executes query<br>- 5min TTL expiration<br>- Cache invalidation | Vitest + Redis mock | TODO |
| lib/ai/rateLimit | - User quota tracking (50/day)<br>- Daily reset at 00:00<br>- Quota exceeded returns 429<br>- Reset time in response headers<br>- Edge runtime compatibility | Vitest + Redis mock | TODO |
| lib/ai/sqlValidator | - SELECT queries allowed<br>- DDL (CREATE, DROP) rejected<br>- DML (INSERT, UPDATE, DELETE) rejected<br>- SQL injection attempts logged<br>- Parameterized queries validated | Vitest | TODO |

---

## Integration Tests

| Component | Test Cases | Tool | Status |
|-----------|-----------|------|--------|
| /api/ai/chat route | - POST with user_query, session_id, user_role<br>- Streaming response (SSE)<br>- LangChain tool calling<br>- Response format (text + chart_data + export_url)<br>- Error handling (timeout, API failure) | Vitest + MSW (mock Gemini API) | TODO |
| Gemini → DeepSeek fallback | - Simulate Gemini 503 error<br>- Verify DeepSeek called automatically<br>- Response returned within 2s of fallback<br>- fallback_triggered logged | Vitest + MSW | TODO |
| Cache integration | - First query misses cache (cache_miss logged)<br>- Second identical query hits cache (cache_hit logged)<br>- Cache hit <100ms response time<br>- TTL expiration after 5min | Vitest + Redis test instance | TODO |
| Rate limiting integration | - User makes 50 queries (all succeed)<br>- 51st query returns 429<br>- Reset time header present<br>- Quota resets after 24h | Vitest + Redis test instance | TODO |

---

## E2E Tests (Playwright)

**Setup:** `npx playwright install` | **Run:** `bun test:e2e`

**Happy Paths (10 Predefined Queries):**

1. **US1.1:** "Muéstrame compras PAVICONSTRUJC Q1 2025 con precios >10% vs histórico"
   - Assert: Chart generated (bar graph)
   - Assert: Data table displayed
   - Assert: Response time <10s
   - Assert: Price variance highlighted

2. **US1.2:** "Necesito gráfica de combustible por mes último año"
   - Assert: Line chart PNG generated
   - Assert: Export button visible
   - Assert: Chart downloadable
   - Assert: Data filtered by combustible category

3. **US1.3:** "Cuánto hemos gastado en concreto este mes vs mes anterior?"
   - Assert: Text response with totals
   - Assert: Percentage variation displayed
   - Assert: Breakdown by consorcio included
   - Assert: Response time <5s (simple query)

4. **US1.4:** "Cuál es el consumo promedio de arena en PTAR?"
   - Assert: Average calculation correct
   - Assert: Filtered by PTAR proyecto
   - Assert: Consumption pattern suggested
   - Assert: Unit of measurement shown

5. **Cache Hit Test:** Repeat query from #3
   - Assert: Response time <1s (from cache)
   - Assert: Same result as first query
   - Assert: cache_hit indicator visible (debugging mode)

6. **Chart Export:** "Exporta la gráfica anterior a Excel"
   - Assert: Download link generated
   - Assert: File downloads successfully
   - Assert: Excel file valid (.xlsx format)
   - Assert: Includes metadata (query, timestamp)

7. **No Results:** "Compras de material inexistente"
   - Assert: "No encontré resultados" message
   - Assert: Suggested similar queries displayed
   - Assert: No error thrown

8. **Ambiguous Query:** "Muéstrame compras de combustible"
   - Assert: Clarification question asked ("¿Diesel o gasolina?")
   - Assert: Options presented to user
   - Assert: User can select option

9. **Complex Query:** "Análisis predictivo de consumo arena próximos 3 meses"
   - Assert: Response within 15s (complex analysis)
   - Assert: Python pandas code executed
   - Assert: Chart with trend line generated

10. **Fallback Test (Manual):** Disable Gemini API key
    - Assert: DeepSeek fallback triggered
    - Assert: Query still executes successfully
    - Assert: No user-visible error
    - Assert: fallback_triggered logged

**Critical Edge Cases:**

- **Rate Limit Exceeded:**
  - Execute 51 queries from same user
  - Assert: 51st query returns "Límite alcanzado (50/día)"
  - Assert: Reset time displayed
  - Assert: Next day, quota resets

- **SQL Injection Attempt:**
  - Query: "Muéstrame compras'; DROP TABLE compras;--"
  - Assert: Query rejected
  - Assert: security_incident logged
  - Assert: User-friendly error message
  - Assert: Database unchanged

- **Gemini API Timeout:**
  - Simulate 30s LLM response delay
  - Assert: Query aborted after 30s
  - Assert: "Consulta muy compleja" message
  - Assert: Suggestion to simplify

---

## Quality Gates CI

| Gate | Tool | Command | Target | Status |
|------|------|---------|--------|--------|
| Format | Biome | `bun run format --check` | 100% | TODO |
| Lint | Biome | `bun run lint` | 0 errors | TODO |
| Types | tsc | `bun run typecheck` | 0 errors | TODO |
| Unit | Vitest | `bun test --coverage` | 80%+ on lib/ai/ | TODO |
| Build | Next.js | `bun run build` | Exit 0 | TODO |
| E2E | Playwright | `bun test:e2e` | All 10 queries pass | TODO |

---

## Edge Case Coverage

- **Empty states:** No compras data (ETL not run yet) → "Aún no hay datos" message
- **API errors:** Gemini 503 → DeepSeek fallback automatic
- **Invalid input:** Non-Spanish query → "Por favor escribe en español"
- **Rate limiting:** 50/day enforced, 429 returned, reset time shown
- **Concurrent requests:** 5 simultaneous queries → all succeed (connection pooling)
- **Session expiration:** Session timeout → user re-authenticates, session_id renewed
- **Large data sets:** 1000+ compras → pagination in data table, chart aggregates

---

## Manual Testing Checklist

- [ ] Desktop browser (Chrome, Firefox, Safari)
- [ ] Mobile browser (iOS Safari, Android Chrome) - chat interface responsive
- [ ] Touch interactions (send button, export button)
- [ ] Keyboard navigation (Enter to send, Tab between UI elements)
- [ ] Screen reader (VoiceOver) - chat messages announced
- [ ] Accessibility: Color contrast (WCAG AA), focus states visible
- [ ] Performance: Lighthouse score >85 (chat page)
- [ ] Spanish language accuracy: UAT with Liced Vega (super user)
- [ ] Business terminology: "concreto", "ODC", "ODS", "consorcio" understood
- [ ] Colombian Spanish nuances: "obra" vs "proyecto", peso colombiano (COP)

---

## Sign-off

**QA Lead:** Liced Vega (UAT) | **Date:** TBD | **Status:** [ ] Ready | [x] Blocked (awaiting implementation)

**Notes:**
- Blocked until S001-S013 implementation complete
- Spanish language UAT requires Liced Vega availability (schedule 2-3h session)
- Gemini API key required for E2E tests (setup in Vercel AI Gateway)

---

**Token-efficient format:** 111 lines | 10 E2E scenarios | 80%+ coverage target
