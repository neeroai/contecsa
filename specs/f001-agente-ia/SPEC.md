# SPEC: Agente IA Conversacional

Version: 1.0 | Date: 2025-12-24 05:30 | Owner: Javier Polo | Status: Active

---

## Problem

Consultas de datos requieren exportar a Excel y manipular manualmente (2 horas promedio). Usuarios no técnicos dependen de expertos para generar informes estáticos, sin capacidad de análisis predictivo ni insights en tiempo real.

---

## Objective

**Primary Goal:** Agente conversacional que entiende consultas de negocio en español, ejecuta análisis complejos, genera visualizaciones y exporta resultados en segundos.

**Success Metrics:**
- Reducción 90% tiempo generación reportes (2h → 10min)
- Democratización análisis datos (acceso sin conocimiento técnico)
- Tiempo respuesta promedio <10s para consultas simples
- Cache hit rate >60% para reducción costos API
- NPS usuarios >70 en producción

---

## Scope

| In | Out |
|---|---|
| Chat interface con lenguaje natural español | Voice input (Phase 2) |
| SQL query generation (PostgreSQL read-only) | Multi-language support (Phase 2) |
| Chart generation (bar, line, pie) | Fine-tuning custom model (Phase 2) |
| Excel/Sheets export | Scheduled reports automation (Phase 2) |
| Gemini 2.0 Flash con DeepSeek fallback | Proactive alerts/suggestions (Phase 2) |
| Rate limiting 50 queries/user/day | Persistent conversation memory (Phase 2) |

---

## Contracts

### Input

| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| user_query | string | Y | Max 500 characters, Spanish language |
| session_id | uuid | Y | Conversation context tracking |
| user_role | enum | Y | gerente\|compras\|contabilidad\|tecnico (role-based filtering) |
| export_format | enum | N | excel\|sheets\|png (default: none) |

### Output

| Field | Type | Condition | Notes |
|-------|------|-----------|-------|
| response_text | string | Always | Natural language response in Spanish |
| chart_data | object[] | On Success | matplotlib/plotly chart data if visualization requested |
| export_url | string | On Success | Downloadable link if export requested |
| data_table | object[] | On Success | Tabular results if query returns data |
| error | string | On Error | User-friendly error message in Spanish |
| cache_hit | boolean | Always | Whether response came from cache (debugging) |
| execution_time_ms | number | Always | Query execution time (monitoring) |

---

## Business Rules

- **Timeout >30s:** Abort query execution → suggest simplification to user
- **Rate limit 50/user/day:** Block new queries → show "Límite alcanzado, intenta mañana" + reset time
- **SQL read-only:** ONLY SELECT queries allowed → parameterized, no DDL/DML/DCL
- **Cache 5min TTL:** Frequent queries cached in Redis → reduce API costs
- **Query timeout 10s:** SQL execution max 10s → abort + return "Consulta muy compleja"
- **Python sandbox:** Only whitelisted libraries (pandas, numpy, matplotlib) → prevent code injection
- **Role-based filtering:** User sees ONLY authorized projects → WHERE project_id IN (user.authorized_projects)
- **Gemini fallback:** If Gemini API fails (503, 429) → automatic switch to DeepSeek without user notification

---

## Edge Cases

| Scenario | Handling | Notes |
|----------|----------|-------|
| No results found | Suggest similar successful queries from cache | "No encontré resultados. Intenta: 'Compras Q1 2025'" |
| Gemini API down | Automatic fallback to DeepSeek | Log incident, monitor fallback frequency |
| Ambiguous query | Ask clarifying questions before executing | "¿Te refieres a PAVICONSTRUJC o EDUBAR-KRA50?" |
| Rate limit exceeded | Block with friendly message + reset time | "Límite alcanzado (50/día). Resetea mañana a las 00:00." |
| SQL injection attempt | Reject query + log security incident | Parameterized queries prevent injection, but log attempts |
| Chart generation timeout | Return text response only + log error | "Datos disponibles, pero gráfica falló. Reintenta." |
| Empty table/database | Inform user + suggest data migration | "Aún no hay datos de compras. Ejecuta ETL SICOM primero." |
| Multiple interpretations | Present options to user | "Encontré 2 posibles consultas: 1) Combustible diesel 2) Combustible gasolina" |

---

## Observability

**Logs:**
- `query_received` (info) - User query logged with session_id, user_role
- `llm_call_start` (info) - LLM API call initiated (Gemini or DeepSeek)
- `llm_call_success` (info) - LLM response received, execution_time_ms
- `llm_call_error` (error) - LLM API failed, error_code, fallback_triggered
- `cache_hit` (info) - Query served from Redis cache
- `cache_miss` (info) - Query executed fresh, result cached
- `query_timeout` (warn) - Query exceeded 10s, aborted
- `rate_limit_exceeded` (warn) - User hit 50/day limit
- `security_incident` (error) - SQL injection attempt detected

**Metrics:**
- `query_latency_p95` - 95th percentile response time, alert if >15s
- `cache_hit_rate` - Percentage cached responses, alert if <50%
- `llm_api_errors` - Count API failures, alert if >5% error rate
- `fallback_triggered_count` - DeepSeek fallback usage, monitor trend
- `queries_per_user_per_day` - Usage distribution, identify heavy users

**Traces:**
- `ai_agent_query` (span) - Full query lifecycle: input → LLM → DB → response
- `sql_query_execution` (span) - SQL generation + execution time
- `chart_generation` (span) - Chart render time

---

## Definition of Done

- [ ] Code review approved (arquitectura + security review)
- [ ] All business rules tested (timeout, rate limit, SQL read-only, cache TTL)
- [ ] All edge cases tested (no results, API down, ambiguous, rate limit, injection)
- [ ] Observability implemented (logs query_received/cache_hit/error, metrics latency/cache_rate, traces ai_agent_query)
- [ ] Performance validated (10 predefined queries <10s each, cache >50%)
- [ ] Security review passed (SQL injection prevention, parameterized queries, sandbox validation)
- [ ] Documentation updated (API docs, user guide with example queries)
- [ ] Deployed to staging (Vercel preview)
- [ ] Smoke test passed (10 queries execute successfully, Gemini→DeepSeek fallback works)
- [ ] Spanish language accuracy validated by Liced Vega (super user UAT)
- [ ] Integration with Dashboard (R2) tested (chart embedding works)

---

**Related:** PRD Feature F02, Dashboard (R2) integration | **Dependencies:** PostgreSQL database schema, Python runtime, Redis cache

**Original PRD:** docs/features/r01-agente-ia.md
