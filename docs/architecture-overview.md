# Architecture Overview - Contecsa Sistema de Inteligencia de Datos

Version: 1.0 | Date: 2025-12-22 22:10

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PRESENTATION LAYER                          │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  Next.js 15 App Router (React 19, TypeScript)                  │ │
│  │  - Conversational AI Chat Interface (R1)                       │ │
│  │  - Role-Based Dashboards (R2) - 5 dashboards                   │ │
│  │  - Purchase Tracking UI (R3) - 7-stage workflow                │ │
│  │  - shadcn/ui Components + Tailwind CSS 4                       │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                              ↓ ↑
┌─────────────────────────────────────────────────────────────────────┐
│                        INTELLIGENCE LAYER                           │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  Vercel AI SDK 6.0 + AI Gateway                                │ │
│  │  ┌──────────────┐      ┌──────────────┐                        │ │
│  │  │ Gemini 2.0   │  →   │  DeepSeek    │ (fallback)            │ │
│  │  │ Flash        │      │              │                        │ │
│  │  └──────────────┘      └──────────────┘                        │ │
│  │                                                                 │ │
│  │  LangChain Orchestration:                                      │ │
│  │  - Tool calling (SQL queries, Python execution, charts)        │ │
│  │  - Chain of thought reasoning                                  │ │
│  │  - Memory management (conversation context)                    │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                              ↓ ↑
┌─────────────────────────────────────────────────────────────────────┐
│                        APPLICATION LAYER                            │
│  ┌──────────────────────┐  ┌──────────────────────────────────────┐ │
│  │  Next.js API Routes  │  │  Python 3.11 FastAPI Backend         │ │
│  │  ──────────────────  │  │  ────────────────────────────────    │ │
│  │  /api/ai/chat        │  │  /api/etl/sicom (read-only)          │ │
│  │  /api/dashboard/*    │  │  /api/analysis/prices (R7)           │ │
│  │  /api/export/sheets  │  │  /api/ocr/invoice (R4)               │ │
│  │  /api/notifications  │  │  /api/data/transform (3D matrices)   │ │
│  └──────────────────────┘  └──────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                              ↓ ↑
┌─────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                                │
│  ┌──────────────────┐  ┌────────────────┐  ┌────────────────────┐  │
│  │  PostgreSQL 15   │  │  Redis Cache   │  │  SICOM Legacy      │  │
│  │  (Vercel DB)     │  │  (Vercel KV)   │  │  (1970s-80s)       │  │
│  │  ──────────────  │  │  ────────────  │  │  ───────────────   │  │
│  │  - compras       │  │  - Query cache │  │  - compras_hist    │  │
│  │  - proveedores   │  │  - Session     │  │  - proveedores     │  │
│  │  - facturas      │  │  - Dashboard   │  │  - precios_hist    │  │
│  │  - proyectos     │  │    data        │  │  **READ-ONLY**     │  │
│  │  - usuarios      │  │  (5 min TTL)   │  │                    │  │
│  │  - warehouse     │  │                │  │  ETL: Weekly sync  │  │
│  │    (SICOM data)  │  │                │  │  (Sunday 2 AM)     │  │
│  └──────────────────┘  └────────────────┘  └────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                              ↓ ↑
┌─────────────────────────────────────────────────────────────────────┐
│                       INTEGRATION LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────────────┐   │
│  │ Google       │  │ Google Cloud │  │ Vercel Blob Storage     │   │
│  │ Workspace    │  │ Vision API   │  │ (or GCS/S3)             │   │
│  │ ────────     │  │ ────────     │  │ ──────────────────      │   │
│  │ - Gmail API  │  │ - OCR        │  │ - Invoices (scans)      │   │
│  │ - Sheets API │  │ - Text       │  │ - Certificates (PDF)    │   │
│  │ - OAuth 2.0  │  │   extraction │  │ - Generated reports     │   │
│  └──────────────┘  └──────────────┘  └─────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Component Relationships

### Frontend → Backend

| Frontend Component | Backend Endpoint | Purpose |
|--------------------|------------------|---------|
| AI Chat Interface | `/api/ai/chat` | Natural language queries, chart generation |
| Dashboard (Gerencia) | `/api/dashboard/gerencia` | KPIs, trends, executive summary |
| Dashboard (Compras) | `/api/dashboard/compras` | At-risk purchases, pending orders |
| Dashboard (Contabilidad) | `/api/dashboard/contabilidad` | Pending invoices, blocked invoices |
| Dashboard (Técnico) | `/api/dashboard/tecnico` | Material consumption, budget tracking |
| Dashboard (Almacén) | `/api/dashboard/almacen` | Pending receipts, upcoming arrivals |
| Purchase Detail | `/api/compras/:id` | CRUD operations, state transitions |
| Export Button | `/api/export/sheets` | Generate Google Sheet with data |
| Notification Settings | `/api/notifications/preferences` | User notification preferences |

### Backend → Database

| Backend Service | Database | Query Type | Frequency |
|-----------------|----------|------------|-----------|
| Dashboard API | PostgreSQL views | SELECT (read-only) | Every request (5 min cache) |
| Purchase API | PostgreSQL tables | CRUD | On user action |
| ETL Service | SICOM (read-only) | SELECT | Weekly (Sunday 2 AM) |
| ETL Service | PostgreSQL warehouse | INSERT (upsert) | Weekly (after SICOM extract) |
| AI Agent | PostgreSQL | SELECT (generated queries) | On user query |
| Price Analysis (R7) | PostgreSQL warehouse | SELECT (historical prices) | On purchase create/update |

### Backend → External Services

| Backend Service | External API | Purpose | Rate Limit |
|-----------------|--------------|---------|------------|
| Notification Service | Gmail API | Send daily summaries, alerts | 2000 emails/day |
| Export Service | Sheets API | Create spreadsheets | 100 req/min |
| Auth Service | Google OAuth 2.0 | SSO login | No limit (user-initiated) |
| OCR Service (R4) | Google Vision API | Invoice text extraction | 1800 req/min |
| AI Agent | Gemini 2.0 Flash | LLM inference | 60 RPM (free tier) |
| AI Agent (fallback) | DeepSeek | LLM inference | No published limit |

---

## Data Flow Diagrams

### User Query Flow (R1 - Conversational AI)

```
User Input ("Muéstrame compras PAVICONSTRUJC >30 días")
  ↓
Next.js Frontend (AI Chat Component)
  ↓
POST /api/ai/chat
  ↓
Vercel AI SDK → AI Gateway → Gemini 2.0 Flash
  ↓
LangChain Tool Selection:
  - Tool: queryDatabase
  - Intent: Filter purchases by project and days
  ↓
Generate SQL:
  SELECT * FROM compras
  WHERE proyecto_id = 'PAVICONSTRUJC'
    AND dias_abierto > 30
    AND estado != 'CERRADO'
  ↓
Execute Query on PostgreSQL (read-only user)
  ↓
Python Code Execution (data analysis):
  - Group by supplier
  - Calculate statistics
  - Generate chart (matplotlib)
  ↓
Response Stream:
  - Text: "Encontré 8 compras en PAVICONSTRUJC..."
  - Chart: Bar graph (suppliers)
  - Data: Table with details
  ↓
Frontend renders response in chat
```

### Purchase Lifecycle (R3 - 7-Stage Workflow)

```
Técnico creates Requisición
  ↓
POST /api/compras (estado: REQUISICION)
  ↓
INSERT INTO compras (estado = 'REQUISICION')
  ↓
Trigger: Send notification to Gerencia (Gmail API)
  ↓
Gerente approves
  ↓
PATCH /api/compras/:id (estado: APROBACION)
  ↓
UPDATE compras SET estado = 'APROBACION'
INSERT INTO compra_estados_log (audit trail)
  ↓
Trigger: Send notification to Compras (Gmail API)
  ↓
Jefe Compras creates Orden
  ↓
PATCH /api/compras/:id (estado: ORDEN)
  ↓
... (continues through 7 stages)
  ↓
Final stage: CERRADO
  ↓
Trigger: Archive purchase (mark as completed)
```

### ETL SICOM Flow (R6)

```
Cron Job (Sunday 2 AM Colombia time)
  ↓
POST /api/etl/sicom (trigger: manual or scheduled)
  ↓
Python ETL Script:
  1. Connect to SICOM (read-only credentials)
  2. Extract: SELECT FROM sicom.compras WHERE fecha >= last_sync
  3. Transform:
     - Clean data (remove NULLs, validate)
     - Convert to 3D matrices (NumPy):
       gasto_matrix[proyecto][material][mes]
     - Calculate aggregations
  4. Load:
     - INSERT INTO sicom_compras_hist
       ON CONFLICT (sicom_id) DO UPDATE
     - INSERT INTO sicom_precios_hist
  5. Log:
     - INSERT INTO etl_runs (status, rows, duration)
  ↓
PostgreSQL Warehouse (updated)
  ↓
R7 Price Analysis uses warehouse data for anomaly detection
  ↓
R1 AI Agent queries warehouse for historical comparisons
```

### Daily Notification Flow (R5)

```
Cron Job (8 AM Colombia time = 1 PM UTC)
  ↓
POST /api/notifications/daily-summary
  ↓
Query PostgreSQL:
  - Get users with active purchases
  - Get purchases >30 días (at-risk)
  - Get pending tasks per user role
  ↓
Group alerts by user_id and role
  ↓
For each user:
  1. Load user preferences (notification_prefs table)
  2. Generate email content (role-specific template)
  3. Send via Gmail API
  4. Log email sent (notification_log table)
  ↓
Gmail delivers emails to @contecsa.com inboxes
  ↓
Users click links → Deep link to app
  ↓
Track click events (update notification_log.clicked_at)
```

---

## Deployment Architecture

### Client-Hosted Model

**Philosophy:** "Software se entrega, NO se alquila" (PO requirement)

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT INFRASTRUCTURE                   │
│                                                              │
│  ┌────────────────────┐        ┌──────────────────────────┐ │
│  │  Vercel (Frontend) │        │  Google Cloud / AWS       │ │
│  │  ────────────────  │        │  ───────────────────────  │ │
│  │  - Next.js App     │   ←→   │  - Python FastAPI        │ │
│  │  - Static Assets   │        │  - Cloud Run / Lambda    │ │
│  │  - Edge Functions  │        │  - PostgreSQL            │ │
│  │  - Vercel Postgres │        │  - Redis                 │ │
│  │  - Vercel KV       │        │  - Cloud Storage (files) │ │
│  └────────────────────┘        └──────────────────────────┘ │
│           ↑                               ↑                  │
│           │                               │                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              CLIENT LEGACY SYSTEMS                      │ │
│  │  ┌──────────────┐          ┌────────────────────────┐  │ │
│  │  │  SICOM       │          │  Google Workspace      │  │ │
│  │  │  (read-only) │          │  - Gmail (@contecsa)   │  │ │
│  │  │              │          │  - Google Sheets       │  │ │
│  │  └──────────────┘          │  - OAuth SSO           │  │ │
│  │                            └────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Environment Separation

| Environment | Purpose | Hosting | Database |
|-------------|---------|---------|----------|
| **Development** | Local dev + testing | localhost:3000 (Next.js)<br>localhost:8000 (FastAPI) | Local PostgreSQL or Vercel Postgres (dev) |
| **Staging** | QA, user acceptance testing | Vercel preview deployment | Vercel Postgres (staging) |
| **Production** | Live client usage | Vercel production<br>Client cloud (backend) | Client PostgreSQL instance |

**No SaaS model:** Client owns infrastructure, Neero provides code repository and deployment scripts.

---

## Security Architecture

### Authentication & Authorization

**Flow:**
```
User → Google OAuth 2.0 (@contecsa.com domain)
  ↓
NextAuth.js validates email domain
  ↓
Create session (JWT, httpOnly cookie)
  ↓
Store user in PostgreSQL (users table)
  ↓
Assign role (Gerencia, Compras, Contabilidad, Técnico, Almacén)
  ↓
API requests include session cookie
  ↓
Middleware validates JWT + role permissions
  ↓
Allow/Deny access based on role
```

### Role-Based Access Control (RBAC)

| Role | Permissions |
|------|-------------|
| **Gerencia** | Read all dashboards, view all purchases, export reports |
| **Compras** | CRUD purchases, approve requisitions, upload certificates |
| **Contabilidad** | Validate invoices, approve/block payments, close purchases |
| **Técnico** | Create requisitions, view own project consumption |
| **Almacén** | Register receipts, update delivery status |
| **Admin** | All permissions + user management + ETL triggers |

### Data Security

| Layer | Security Measure |
|-------|------------------|
| **Transport** | HTTPS only (TLS 1.3), no HTTP fallback |
| **Database** | Row-level security (RLS) by role, encrypted at rest |
| **API Keys** | Environment variables only, never in code, rotation quarterly |
| **SICOM** | Read-only user, no write permissions, connection whitelisted by IP |
| **Files** | Signed URLs (GCS/S3), 1-hour expiry, no public access |
| **Sessions** | httpOnly cookies, SameSite=Lax, 7-day expiry |

---

## Scalability Considerations

### Performance Targets

| Component | Target | Current Capacity | Scaling Strategy |
|-----------|--------|------------------|------------------|
| **Frontend** | <2s page load | 100 concurrent users | Vercel auto-scales (serverless) |
| **Dashboard API** | <500ms response | 50 req/sec | Redis cache (5 min TTL), DB indexes |
| **AI Agent** | <10s response | 10 concurrent queries | Queue system (Redis), rate limiting |
| **ETL SICOM** | <10 min for 10K rows | Weekly batch | Incremental load, parallel processing |
| **Database** | 1M rows (5 years) | ~100K rows/year | Partitioning by year, archive old data |

### Caching Strategy

| Data Type | Cache Location | TTL | Invalidation |
|-----------|----------------|-----|--------------|
| Dashboard KPIs | Redis (Vercel KV) | 5 minutes | On purchase state change |
| User session | Redis | 7 days | On logout |
| AI query results | Redis | 1 hour | Manual clear or TTL expiry |
| Static assets | Vercel CDN | 1 year | On deployment |
| Database views | PostgreSQL | N/A (materialized views) | Daily refresh at 1 AM |

---

## Monitoring & Observability

### Metrics to Track

| Metric | Tool | Alert Threshold |
|--------|------|-----------------|
| API response time | Vercel Analytics | >2s for 95th percentile |
| Error rate | Vercel Logs | >1% error rate |
| AI API latency | Custom logging | >15s for Gemini calls |
| Database slow queries | PostgreSQL logs | >3s query time |
| ETL job failures | Email alert | Any failure |
| Email delivery rate | Gmail API status | <95% delivered |

### Logging Strategy

| Log Type | Storage | Retention | Purpose |
|----------|---------|-----------|---------|
| **Application logs** | Vercel Logs | 30 days | Error tracking, debugging |
| **Audit trail** | PostgreSQL (compra_estados_log) | Indefinite | Compliance, who changed what |
| **ETL logs** | PostgreSQL (etl_runs) + file logs | 90 days | Troubleshooting ETL issues |
| **Email logs** | PostgreSQL (notification_log) | 1 year | Delivery tracking, analytics |
| **AI queries** | PostgreSQL (ai_queries_log) | 90 days | Cost tracking, usage patterns |

---

## Disaster Recovery

### Backup Strategy

| Data | Frequency | Storage | Retention |
|------|-----------|---------|-----------|
| PostgreSQL (full) | Daily at 3 AM | Vercel automatic backups | 7 days |
| PostgreSQL (WAL) | Continuous | Vercel | Point-in-time recovery (7 days) |
| File storage | Daily | GCS/S3 versioning | 30 days |
| Code repository | On every commit | GitHub | Indefinite |

### Recovery Procedures

| Scenario | RTO (Recovery Time Objective) | Procedure |
|----------|-------------------------------|-----------|
| **Database corruption** | 4 hours | Restore from latest backup, replay WAL |
| **Vercel outage** | N/A (wait for Vercel) | No action (Vercel SLA: 99.99%) |
| **Backend service down** | 1 hour | Redeploy from GitHub, health check |
| **SICOM unavailable** | N/A (read-only) | Use cached warehouse data, queue ETL |
| **Data loss (user error)** | Same day | Restore from audit trail (compra_estados_log) |

---

## Integration Architecture

### External Service Dependencies

```
Contecsa App
  ├─→ Gemini 2.0 Flash (primary LLM)
  │   └─→ DeepSeek (fallback if Gemini down)
  ├─→ Gmail API (notifications)
  │   └─→ Fallback: Queue emails, retry later
  ├─→ Google Sheets API (export)
  │   └─→ Fallback: Download as Excel instead
  ├─→ Google Vision API (OCR - R4)
  │   └─→ Fallback: Manual invoice entry
  └─→ SICOM Legacy (read-only ETL)
      └─→ Fallback: Use cached warehouse data
```

### API Gateway Pattern

**Vercel AI Gateway** centralizes LLM provider management:
- Single API key configuration
- Automatic fallback (Gemini → DeepSeek)
- Usage tracking across providers
- Cost optimization

---

## Technology Decisions

### Why Next.js 15 App Router?

| Reason | Benefit |
|--------|---------|
| Server Components | Reduce client-side JavaScript, faster initial load |
| App Router | File-based routing, simpler than Pages Router |
| React 19 | Latest features (Server Actions, async components) |
| Vercel integration | First-class deployment, zero config |

### Why Python Backend?

| Reason | Benefit |
|--------|---------|
| **PO requirement** | "Herramienta más poderosa para análisis datos" |
| NumPy/Pandas | 3D matrices, fast data transformations |
| Data science | ML-ready (future price prediction, anomaly detection) |
| ETL expertise | Strong ecosystem for ETL (pandas, SQLAlchemy) |

### Why PostgreSQL?

| Reason | Benefit |
|--------|---------|
| ACID compliance | Critical for purchase tracking, audit trail |
| JSON support | Flexible schema for SICOM legacy data |
| Views/Materialized views | Fast dashboard queries |
| Full-text search | Search purchases by description |
| Vercel Postgres | Managed service, auto-backups |

### Why Gemini 2.0 Flash?

| Reason | Benefit |
|--------|---------|
| Speed | <1s latency, critical for conversational UX |
| Cost | 10x cheaper than GPT-4 |
| Spanish support | Native Spanish training data |
| Vercel AI Gateway | Built-in support, easy integration |

---

## Future Architecture Evolution

### Phase 2 (Post-MVP)

1. **WhatsApp Business API** - Notifications via WhatsApp (R12)
2. **Mobile App** - React Native for field users (Almacén)
3. **Realtime Sync** - WebSocket for live dashboard updates
4. **Advanced Analytics** - ML-based price prediction (R10)

### Long-Term (1-2 years)

1. **SICOM Retirement** - Full migration from SICOM to new system
2. **Multi-tenant** - Support multiple construction companies
3. **Offline Mode** - PWA for offline purchase creation
4. **Blockchain Audit** - Immutable audit trail for compliance

---

## References

- PRD.md (Feature requirements)
- CLAUDE.md (Tech stack decisions)
- docs/features/ (Feature-specific architecture)
- Vercel AI SDK 6.0 Documentation
- Next.js 15 Documentation
- FastAPI Documentation
- PostgreSQL 15 Documentation
