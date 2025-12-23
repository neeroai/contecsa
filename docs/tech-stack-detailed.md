# Tech Stack Detailed - Contecsa

Version: 1.1 | Date: 2025-12-23 13:15

## Stack Philosophy

**ClaudeCode&OnlyMe Filter:** 2 people (Javier + Claude Code), client self-hosts, simple/maintainable, no enterprise tooling

## Stack Overview

| Layer | Technology | Version | Why Chosen | Why NOT Alternative |
|-------|-----------|---------|------------|---------------------|
| **Frontend Framework** |||||
| | Next.js | 15.1+ | App Router, React 19, Vercel integration | Remix (less mature), Vite+React (no SSR) |
| | React | 19.0+ | Server Actions, async components, ecosystem | Vue (unfamiliar), Svelte (smaller ecosystem) |
| | TypeScript | 5.6+ | Type safety (strict mode), IDE support | JavaScript (no types), Flow (deprecated) |
| **UI & Styling** |||||
| | Tailwind CSS | 4.0+ | Utility-first, no CSS files, consistent design | CSS Modules (verbose), Styled Components (runtime cost) |
| | shadcn/ui | Latest | Copy-paste components, full control, accessible | Material UI (heavy), Chakra UI (less control) |
| | Radix UI | Latest | Headless primitives, shadcn/ui foundation | Headless UI (limited), React Aria (complex) |
| **Charts** |||||
| | Recharts | ^2.15 | React API, responsive, declarative | Chart.js (imperative), D3.js (steep curve) |
| | Tremor | ^3.20 | Pre-built dashboards, Tailwind integration | - |
| **State** |||||
| | React Hooks | Built-in | useState/useReducer sufficient, no global state | Redux (overkill), Zustand (not needed) |
| | React Query | ^5.62 | Server state, caching, optimistic updates | SWR (less features), Apollo (GraphQL only) |
| **Backend Framework** |||||
| | Python | 3.11+ | **PO requirement** - data analysis, NumPy/Pandas | Node.js (no NumPy), Go (no data libs) |
| | FastAPI | ^0.115 | Async, auto OpenAPI docs, Pydantic | Django (heavy), Flask (no async) |
| | Pydantic | ^2.10 | Data validation, type safety, FastAPI native | Marshmallow (verbose), Cerberus (less integration) |
| **Data Analysis** |||||
| | NumPy | ^2.2 | 3D matrices (PO requirement), fast, efficient | Python lists (slow), TensorFlow (overkill) |
| | Pandas | ^2.2 | DataFrame operations, ETL, time series | Polars (less mature), Dask (not needed) |
| | Matplotlib | ^3.10 | Chart generation (AI), PNG export, standard | Plotly (heavy), Seaborn (opinionated) |
| | LangChain | ^0.3 | LLM orchestration, tool calling, memory | LlamaIndex (document-focused), Haystack (search-focused) |
| **AI SDK** |||||
| | Vercel AI SDK | 6.0.9 | Next.js integration, streaming, multi-provider | LangChain.js (less Next.js), OpenAI SDK (single provider) |
| | @ai-sdk/react | 3.0.0 | useChat hook, UI state, streaming UX | Custom implementation (reinvent wheel) |
| **LLM Providers** |||||
| | Google Gemini | 2.0-flash-exp | Speed (<1s), cost (10x cheaper), Spanish, 1M context | GPT-4 (10x expensive, slower) |
| | DeepSeek | deepseek-chat | Cost-effective backup, Spanish, no downtime risk | - |
| | Vercel AI Gateway | N/A | Centralized provider, auto fallback, usage tracking | Custom fallback logic (complex) |
| **Database** |||||
| | PostgreSQL | 15+ | ACID (audit trail), JSON, full-text, materialized views | MongoDB (no ACID), MySQL (less features), SQLite (not production) |
| | Vercel Postgres | Managed | Auto backups, zero config, point-in-time recovery | Self-hosted (maintenance), RDS (AWS lock-in) |
| | Drizzle ORM | ^0.39 | Type-safe, SQL-like, lightweight | Prisma (heavy migrations), TypeORM (verbose), Kysely (no schema) |
| | SQLAlchemy | ^2.0 | FastAPI ORM, async, Python standard | Django ORM (coupled), Peewee (less features) |
| **Caching** |||||
| | Redis | Latest | Fast KV, dashboard cache (5min TTL), session storage | Memcached (less features), in-memory (not persistent) |
| | Vercel KV | Managed | Redis-compatible, zero config, integrated | Upstash (less integration) |
| **Auth** |||||
| | NextAuth.js | ^5.0 | OAuth 2.0, Google provider, session management | Clerk (SaaS overkill), Auth0 (expensive), Supabase Auth (not using) |
| | Google OAuth 2.0 | N/A | Client uses @contecsa.com, SSO with Workspace | Email/password (security risk), SAML (complex) |
| **File Storage** |||||
| | Vercel Blob | Preferred | Integrated, simple API, CDN, pay-as-you-go | - |
| | GCS / AWS S3 | Client choice | Client-hosted option, Python SDK | - |
| **External APIs** |||||
| | Gmail API | v1 | Client uses Gmail, send notifications, track delivery | - |
| | Sheets API | v4 | Users familiar, export format, batch operations | - |
| | Google Cloud Vision | v1 | OCR invoices, high accuracy, multi-language | AWS Textract (less Spanish support) |
| **Dev Tools** |||||
| | bun | 1.3.5+ | Faster than npm/yarn/pnpm, built-in test runner | npm (slow), yarn (legacy), pnpm (less adoption) |
| | Biome | 2+ | Fast linter+formatter, zero config, Rust-based | ESLint+Prettier (2 tools, slow), Oxc (too new) |
| | Playwright | ^1.49 | E2E, multiple browsers, auto-wait, TypeScript | Cypress (slower), Selenium (outdated) |
| | pytest | ^8.3 | Python standard, fixtures, FastAPI integration | unittest (verbose), nose (unmaintained) |
| **Hosting** |||||
| | Frontend | Vercel | Zero config, auto previews, edge CDN, serverless | - |
| | Backend | GCP/AWS (client) | Cloud Run (containers) or Lambda (functions), client self-hosts | - |
| | CI/CD | GitHub Actions | Free, native GitHub, simple YAML | Jenkins (overkill), CircleCI (overkill) |
| **Monitoring** |||||
| | Vercel Analytics | Built-in | Page load, RUM, Web Vitals, zero config | Datadog (expensive), New Relic (overkill) |
| | Vercel Logs | Built-in | Application logs, errors, API requests, 30-day retention | - |
| | PostgreSQL Logs | Built-in | Slow queries, audit trail (compra_estados_log) | - |

## LLM Cost Comparison

| Provider | Model | Input ($/1M tokens) | Output ($/1M tokens) | Latency | Context |
|----------|-------|---------------------|----------------------|---------|---------|
| **Google Gemini** (primary) | gemini-2.0-flash-exp | $0.075 | $0.30 | <1s | 1M tokens |
| **DeepSeek** (fallback) | deepseek-chat | $0.14 | $0.28 | <2s | 128K tokens |
| OpenAI (rejected) | gpt-4 | $0.75 | $2.00 | 2-3s | 128K tokens |

**Gemini wins:** 10x cheaper, faster, 8x more context

## Technology Decision Criteria

| Criterion | Weight | Evaluation Question |
|-----------|--------|---------------------|
| **Team size** | 40% | Can 2 people maintain it? |
| **Client requirements** | 30% | Does it meet PO requirements? |
| **Stability** | 15% | Is it production-ready? |
| **Ecosystem** | 10% | Good docs, community? |
| **Cost** | 5% | Fits budget (prefer free/OSS)? |

## Rejected Technologies

| Technology | Reason |
|------------|--------|
| Storybook | Team too small (2 people), visual testing not needed |
| Jira | Team too small, GitHub Issues sufficient |
| Nx/Turborepo | Monorepo not needed, single repo simpler |
| Microservices | Team too small, monolith faster |
| Kubernetes | Team too small, serverless simpler |
| GraphQL | REST simpler, no complex relationships |
| Prisma | Heavy migrations, Drizzle lighter |
| Redux | Overkill, React Query + hooks sufficient |
| Docker Compose | Local dev doesn't need containers |

## Version Management

**Frontend:** Node 20+ LTS, bun 1.3.5+, Next.js 15.x, React 19.x, TypeScript 5.x
**Backend:** Python 3.11+ (not 3.12 yet), FastAPI 0.x, NumPy/Pandas latest stable
**Update frequency:** Quarterly (minor), immediately (security)

## Dependencies

**Frontend:** See `/package.json` for exact versions
**Backend:** See `/api/requirements.txt` for exact versions

## Configuration Files

**Frontend:** `next.config.ts`, `tailwind.config.ts`, `biome.json`
**Backend:** `pyproject.toml`, `.env`
**Reference:** See root directory for full configs

## Environment Variables

**Frontend:** See `.env.example` for required vars (Database, Redis, AI Gateway, Auth, Google APIs)
**Backend:** See `api/.env.example` for required vars (Database, SICOM, AI, Google APIs)

## References

**Official docs:** Next.js (nextjs.org/docs), Vercel AI SDK (sdk.vercel.ai), FastAPI (fastapi.tiangolo.com), PostgreSQL (postgresql.org/docs/15), Tailwind (tailwindcss.com/docs), Gemini (ai.google.dev/gemini-api/docs), Google Workspace (developers.google.com/workspace)

**Project docs:** CLAUDE.md (decision filter), docs/architecture-overview.md (system architecture), docs/api-documentation.md (API reference), docs/prd-full.md (features)
