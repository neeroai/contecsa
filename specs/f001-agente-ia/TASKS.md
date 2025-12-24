# TASKS: Agente IA Conversacional

Version: 1.0 | Date: 2025-12-24 05:50 | Owner: Claude Code | Status: Active

---

## DOING (Current - Max 1 task)

| ID | Task | DoD | Est |
|----|------|-----|-----|
| - | No active tasks yet | - | - |

---

## TODO (Priority Order - From PLAN.md)

| ID | Task | DoD | Est |
|----|------|-----|-----|
| T001 | Create ChatMessage component | - Component renders user/assistant messages<br>- Styled with tailwind (bubbles, alignment)<br>- Accepts message object prop | 2h |
| T002 | Create ChatInput component | - Text input with send button<br>- Enter key sends message<br>- Disabled while waiting response | 1h |
| T003 | Create ChatContainer layout | - Combines ChatMessage + ChatInput<br>- Scrollable message area<br>- Auto-scroll to latest message | 2h |
| T004 | Implement /api/ai/chat route (basic) | - Accepts POST {user_query, session_id, user_role}<br>- Returns streaming response (SSE)<br>- Integrates Vercel AI SDK<br>- Logs query_received | 3h |
| T005 | Add Gemini 2.0 Flash provider | - Configure AI Gateway<br>- Add Gemini API key to env<br>- Test streaming response | 2h |
| T006 | Implement queryDatabase tool | - Generates SQL SELECT from natural language<br>- Parameterized queries enforced<br>- 10s timeout<br>- Returns data array | 4h |
| T007 | Implement SQL validator | - Rejects DDL/DML/DCL<br>- Allows SELECT only<br>- Logs injection attempts<br>- Unit tests pass (10 cases) | 3h |
| T008 | Add role-based filtering to queries | - User sees only authorized projects<br>- WHERE clause injected automatically<br>- Tested with gerente vs compras roles | 2h |
| T009 | Implement Redis cache layer | - Query hash (MD5)<br>- Cache get/set with 5min TTL<br>- cache_hit/cache_miss logs<br>- Integration test passes | 3h |
| T010 | Implement analyzeData tool (Python) | - Python sandbox execution<br>- Pandas code generation<br>- Whitelist libraries<br>- 10s timeout | 4h |
| T011 | Implement generateChart tool | - Call Python backend /charts endpoint<br>- Pass chart_type + data<br>- Return base64 PNG<br>- 3s timeout | 3h |
| T012 | Create Python backend /charts endpoint | - FastAPI route<br>- matplotlib chart generation<br>- bar/line/pie chart types<br>- Sandboxed execution | 3h |
| T013 | Implement rate limiting middleware | - Redis counter: user_id → query_count<br>- 50/day limit enforced<br>- 429 status on exceeded<br>- Daily reset at 00:00 | 2h |
| T014 | Add DeepSeek fallback provider | - Configure DeepSeek in AI Gateway<br>- Automatic fallback on Gemini failure<br>- fallback_triggered log<br>- Test with Gemini disabled | 2h |
| T015 | Implement exportToExcel tool | - Accept data table (array of objects)<br>- Generate .xlsx with xlsx library<br>- Upload to Vercel Blob<br>- Return download URL (24h expiry) | 3h |
| T016 | Create Spanish language system prompts | - Agent personality definition<br>- Business terminology examples<br>- Few-shot query examples<br>- Colombian Spanish nuances | 2h |
| T017 | Add chart embedding API for Dashboard | - Create /api/charts/:id endpoint<br>- Store chart data in PostgreSQL<br>- Return chart metadata + image URL<br>- Integration with F002 tested | 3h |
| T018 | Write unit tests for queryDatabase | - 10 test cases (valid SQL, timeout, injection)<br>- Vitest + PostgreSQL mock<br>- Coverage >80% | 2h |
| T019 | Write unit tests for cache | - 5 test cases (hit, miss, TTL, invalidation)<br>- Redis mock<br>- Coverage >80% | 1h |
| T020 | Write unit tests for rateLimit | - 5 test cases (under/over limit, reset)<br>- Redis mock<br>- Coverage >80% | 1h |
| T021 | Write integration test for /api/ai/chat | - Full query flow (input → LLM → DB → response)<br>- MSW mock for Gemini API<br>- Assert streaming response | 3h |
| T022 | Write integration test for fallback | - Simulate Gemini 503<br>- Assert DeepSeek called<br>- Assert response returned<br>- Assert fallback_triggered logged | 2h |
| T023 | Write E2E test for US1.1 (Playwright) | - "Compras PAVICONSTRUJC Q1 2025"<br>- Assert chart + table rendered<br>- Assert <10s response | 2h |
| T024 | Write E2E test for US1.2 (Playwright) | - "Gráfica combustible último año"<br>- Assert line chart PNG<br>- Assert export button works | 2h |
| T025 | Write E2E test for US1.3 (Playwright) | - "Gasto concreto este mes vs anterior"<br>- Assert text response + percentage<br>- Assert breakdown by consorcio | 2h |
| T026 | Write E2E test for cache hit (Playwright) | - Repeat query from T023<br>- Assert <1s response (cached)<br>- Assert cache_hit indicator | 1h |
| T027 | Write E2E test for rate limit (Playwright) | - Execute 51 queries<br>- Assert 51st returns 429<br>- Assert reset time displayed | 2h |
| T028 | UAT session with Liced Vega | - 10 real business queries<br>- Spanish accuracy validation<br>- Collect feedback<br>- Document issues | 3h |

**Total Estimated Time:** 62 hours (~2-3 weeks for 1 developer)

---

## BLOCKED (Dependencies / Issues)

| ID | Task | Blocker | Notes |
|----|------|---------|-------|
| - | None yet | - | - |

---

## DONE (Last 5 Completed)

| ID | Task | Closed | Commit |
|----|------|--------|--------|
| - | Migration to SDD format | 2025-12-24 | TBD |
| - | SPEC.md created | 2025-12-24 | TBD |
| - | PLAN.md created | 2025-12-24 | TBD |
| - | ADR.md created | 2025-12-24 | TBD |
| - | TESTPLAN.md created | 2025-12-24 | TBD |

---

**Dependencies:**
- T006 depends on T005 (Gemini provider must be configured first)
- T008 depends on T006 (queryDatabase must exist before adding filtering)
- T009 depends on T006 (cache wraps queryDatabase)
- T011 depends on T012 (Python backend must exist)
- T014 depends on T005 (AI Gateway must be configured)
- T017 depends on T011 (chart generation must work)
- T018-T020 depend on T006, T009, T013 (implementation must exist)
- T021-T022 depend on T004 (API route must exist)
- T023-T027 depend on T001-T017 (full feature must be implemented)
- T028 depends on T023-T027 (E2E tests must pass first)

**Notes:**
- Start with T001-T003 (UI foundation) in parallel with T004-T005 (API setup)
- T006-T008 are critical path (SQL generation + security)
- T009 can be added incrementally (cache is optimization, not MVP blocker)
- T028 (UAT) scheduled after all E2E tests pass
