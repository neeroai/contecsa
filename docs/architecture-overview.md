# Architecture Overview - Contecsa

Version: 1.2 | Date: 2025-12-23 13:00

## System Architecture

### Layers

| Layer | Components | Tech Stack | Purpose |
|-------|-----------|------------|---------|
| **Presentation** | Next.js 15 App Router | React 19, TypeScript, Tailwind 4, shadcn/ui | AI chat (R1), dashboards (R2), purchase tracking (R3) |
| **Intelligence** | AI Gateway + LangChain | Gemini 2.0 Flash → DeepSeek fallback | Natural language queries, tool calling, chart generation |
| **Application** | Next.js API + FastAPI | Next.js routes, Python 3.11 FastAPI | Frontend API + backend services (ETL, OCR, analysis) |
| **Data** | PostgreSQL + Redis + SICOM | PostgreSQL 15, Vercel KV, SICOM (70s-80s read-only) | Persistent storage, cache, legacy data sync (weekly) |
| **Integration** | Google Workspace + OCR + Storage | Gmail API, Sheets API, Vision API, Blob/GCS/S3 | Notifications, export, OCR, file storage |

### Component Relationships

| Source | Target | Endpoint/Service | Purpose/Type | Frequency/Limit |
|--------|--------|------------------|--------------|-----------------|
| **Frontend → Backend** |||||
| AI Chat | /api/ai/chat | POST | Natural language queries | On demand |
| Dashboards | /api/dashboard/{role} | GET | KPIs (gerencia/compras/contabilidad/tecnico/almacen) | Every request (5min cache) |
| Purchase Detail | /api/compras/:id | GET/PATCH | CRUD + state transitions | On user action |
| Export | /api/export/sheets | POST | Google Sheets export | On demand |
| Notifications | /api/notifications/* | GET/PATCH | User preferences | On demand |
| **Backend → Database** |||||
| Dashboard API | PostgreSQL views | SELECT | KPI queries | 5min cache |
| Purchase API | PostgreSQL | CRUD | Purchase operations | On user action |
| ETL Service | SICOM → PostgreSQL | SELECT → INSERT | Legacy data sync | Weekly (Sun 2 AM) |
| AI Agent | PostgreSQL | Generated queries | Natural language queries | On user query |
| Price Analysis (R7) | PostgreSQL warehouse | Historical queries | Anomaly detection | On purchase create/update |
| **Backend → External** |||||
| Notifications | Gmail API | Email send | Daily summaries, alerts | 2000/day |
| Export | Sheets API | Spreadsheet generation | Report export | 100/min |
| Auth | Google OAuth 2.0 | SSO login | User authentication | Unlimited |
| OCR (R4) | Google Vision API | Image analysis | Invoice extraction | 1800/min |
| AI | Gemini 2.0 Flash | LLM inference | Natural language processing | 60 RPM |
| AI fallback | DeepSeek | LLM inference | Backup provider | Unlimited |

## Data Flows

### User Query Flow (R1)
1. User input → Frontend → POST /api/ai/chat
2. Vercel AI SDK → Gemini 2.0 Flash
3. LangChain selects tool (queryDatabase) → Generate SQL
4. Execute PostgreSQL (read-only) → Python analysis
5. Stream response (text + chart + data) → Frontend renders

### Purchase Lifecycle (R3)
**States:** REQUISICION → APROBACION → ORDEN → CONFIRMACION → RECEPCION → CERTIFICADOS → CERRADO

1. Técnico creates → REQUISICION
2. Gerente approves → APROBACION → Email Compras
3. Compras creates order → ORDEN → Email supplier
4. Supplier confirms → CONFIRMACION
5. Almacén receives → RECEPCION
6. Compras uploads certs → CERTIFICADOS
7. Contabilidad validates → CERRADO

**Triggers:** Gmail API notifications, compra_estados_log audit, dashboard updates

### ETL SICOM Flow (R6)
**Schedule:** Weekly (Sunday 2 AM Colombia)

1. Cron → POST /api/etl/sicom → Connect SICOM (read-only)
2. Extract: SELECT WHERE fecha >= last_sync
3. Transform: Clean, NumPy 3D matrices, aggregations
4. Load: INSERT INTO sicom_compras_hist ON CONFLICT UPDATE
5. Log: etl_runs table → Update warehouse (R7, AI queries)

### Daily Notification Flow (R5)
**Schedule:** 8 AM Colombia

1. Cron → POST /api/notifications/daily-summary
2. Query: at-risk purchases (>30d), pending tasks per role
3. Group by user_id + role → Generate email (role template)
4. Send Gmail API → Log notification_log → Track clicks

## Deployment

**Philosophy:** Client-hosted (NOT SaaS)

| Component | Hosting | Env | URL/Config |
|-----------|---------|-----|------------|
| Frontend | Vercel | Dev/Staging/Prod | localhost:3000, preview, prod |
| Backend (Python) | GCP Cloud Run or AWS Lambda | Dev/Staging/Prod | localhost:8000, client cloud |
| Database | Vercel Postgres | Dev/Staging/Prod | Managed, auto-backups |
| Cache | Vercel KV (Redis) | All | Managed, integrated |
| Files | Vercel Blob/GCS/S3 | All | Client preference |
| SICOM | Client on-premise | All | Read-only access |

## Security

| Aspect | Implementation | Details |
|--------|----------------|---------|
| **Auth** | Google OAuth 2.0 + NextAuth.js | @contecsa.com domain, JWT session, HTTPBearer API |
| **RBAC** | Role-based permissions | Gerencia (read all), Compras (CRUD), Contabilidad (validate), Técnico (create), Almacén (receipts), Admin (all + ETL) |
| **Data** | Encryption + RLS | HTTPS TLS 1.3, PostgreSQL RLS, SICOM read-only, signed URLs (1h), httpOnly cookies |

## Performance

| Component | Target | Capacity | Strategy |
|-----------|--------|----------|----------|
| Frontend | <2s load | 100 concurrent | Vercel auto-scale |
| Dashboard API | <500ms | 50 req/sec | Redis 5min cache, DB indexes |
| AI Agent | <10s | 10 concurrent | Redis queue, rate limiting |
| ETL | <10min (10K rows) | Weekly batch | Incremental, parallel |
| Database | 1M rows (5yr) | ~100K/year | Partitioning, archive |

### Caching

| Data | Cache | TTL | Invalidation |
|------|-------|-----|--------------|
| Dashboard KPIs | Redis | 5 min | On purchase state change |
| User session | Redis | 7 days | On logout |
| AI queries | Redis | 1 hour | Manual/TTL |
| Static assets | Vercel CDN | 1 year | On deployment |
| DB views | PostgreSQL | N/A | Daily 1 AM |

## Monitoring

| Metric | Tool | Alert | Retention |
|--------|------|-------|-----------|
| API response | Vercel Analytics | >2s (95th) | 30 days |
| Errors | Vercel Logs | >1% | 30 days |
| AI latency | Custom logs | >15s | 90 days (cost tracking) |
| Slow queries | PostgreSQL logs | >3s | N/A |
| ETL | Email alert | Any failure | 90 days |
| Notifications | Gmail API | <95% delivered | 1 year |
| Audit trail | compra_estados_log | N/A | Indefinite |

## Disaster Recovery

| Item | Backup | RTO |
|------|--------|-----|
| PostgreSQL full | Daily 3 AM (7 days retention) | 4h (restore + WAL replay) |
| PostgreSQL WAL | Continuous (point-in-time 7 days) | 4h |
| Files | Daily (30 days) | 1h |
| Code | GitHub (indefinite) | 1h (redeploy) |
| SICOM unavailable | N/A | N/A (use cached warehouse) |

## Tech Decisions

| Decision | Rationale | Alternative Rejected |
|----------|-----------|----------------------|
| **Next.js 15** | Server Components, App Router, Vercel integration | Remix (less mature), Vite+React (no SSR) |
| **Python FastAPI** | PO requirement for data analysis, NumPy/Pandas | Node.js (no NumPy equivalent) |
| **PostgreSQL** | ACID, JSON support, materialized views | MongoDB (no ACID), MySQL (less features) |
| **Gemini 2.0 Flash** | 10x cheaper, <1s latency, Spanish support | GPT-4 (10x expensive, slower) |
| **Vercel** | Zero config, auto-deploy, edge network | Self-hosted (more maintenance), AWS (complex) |

## References

**Detailed docs:** docs/tech-stack-detailed.md | **Features:** docs/features/r01-r13.md | **API:** docs/api-documentation.md
