# Tech Stack Detailed - Contecsa

Version: 1.0 | Date: 2025-12-22 22:15

---

## Stack Philosophy

**ClaudeCode&OnlyMe Filter Applied:**
- Team: 2 people (Javier Polo + Claude Code)
- Client self-hosts (NO SaaS complexity)
- Simple, maintainable solutions
- No enterprise tooling for teams 5+

**Core Principle:** "Herramientas que 2 personas pueden mantener sin equipos grandes"

---

## Frontend Stack

### Core Framework

| Technology | Version | Rationale | Alternatives Rejected |
|------------|---------|-----------|----------------------|
| **Next.js** | 15.1+ | - App Router (server components)<br>- File-based routing<br>- Vercel first-class integration<br>- React 19 support | Remix (less mature)<br>Vite+React (no SSR) |
| **React** | 19.0+ | - Latest features (Server Actions)<br>- Async components<br>- Industry standard<br>- Rich ecosystem | Vue (team unfamiliar)<br>Svelte (smaller ecosystem) |
| **TypeScript** | 5.6+ | - Type safety (strict mode)<br>- Catch errors at compile time<br>- Better IDE support<br>- Self-documenting code | JavaScript (no type safety)<br>Flow (deprecated) |

### UI & Styling

| Technology | Version | Rationale | Alternatives Rejected |
|------------|---------|-----------|----------------------|
| **Tailwind CSS** | 4.0+ | - Utility-first (fast dev)<br>- No CSS files to manage<br>- Consistent design system<br>- Excellent IntelliSense | CSS Modules (verbose)<br>Styled Components (runtime cost)<br>SCSS (compile overhead) |
| **shadcn/ui** | Latest | - Copy-paste components<br>- Full control (no NPM dep)<br>- Accessible by default<br>- Tailwind integration | Material UI (heavy, opinionated)<br>Chakra UI (less control)<br>Ant Design (enterprise UX) |
| **Radix UI** | Latest | - Headless primitives<br>- shadcn/ui foundation<br>- Accessibility built-in<br>- Composable | Headless UI (Tailwind only)<br>React Aria (complex API) |

### Charts & Data Visualization

| Technology | Version | Rationale | Alternatives Rejected |
|------------|---------|-----------|----------------------|
| **Recharts** | ^2.15 | - React-native API<br>- Responsive by default<br>- Declarative syntax<br>- Good TypeScript support | Chart.js (imperative)<br>D3.js (steep learning curve)<br>Victory (less maintained) |
| **Tremor** | ^3.20 | - Pre-built dashboard components<br>- Beautiful defaults<br>- Tailwind integration<br>- Built for analytics UIs | - |

### State Management

| Technology | Version | Rationale | Alternatives Rejected |
|------------|---------|-----------|----------------------|
| **React Hooks** | Built-in | - useState, useReducer sufficient<br>- No global state needed<br>- Server state in Next.js<br>- Simpler mental model | Redux (overkill for 2 people)<br>Zustand (not needed)<br>Jotai (atomic approach unnecessary) |
| **React Query** | ^5.62 | - Server state management<br>- Caching, refetching<br>- Loading/error states<br>- Optimistic updates | SWR (less features)<br>Apollo Client (GraphQL only) |

---

## Backend Stack

### Core Framework

| Technology | Version | Rationale | Alternatives Rejected |
|------------|---------|-----------|----------------------|
| **Python** | 3.11+ | - **PO requirement**: "más poderosa para análisis datos"<br>- NumPy, Pandas (3D matrices)<br>- Data science ecosystem<br>- ETL expertise | Node.js (no NumPy equivalent)<br>Go (no data science libs) |
| **FastAPI** | ^0.115 | - Modern async framework<br>- Auto OpenAPI docs<br>- Type hints (Pydantic)<br>- Fast development | Django (heavy, monolithic)<br>Flask (no async, manual docs)<br>Express (not Python) |
| **Pydantic** | ^2.10 | - Data validation<br>- Type safety in Python<br>- Auto serialization<br>- FastAPI native | Marshmallow (verbose)<br>Cerberus (less integration) |

### Data Analysis & ML

| Technology | Version | Rationale | Alternatives Rejected |
|------------|---------|-----------|----------------------|
| **NumPy** | ^2.2 | - 3D matrices (PO requirement)<br>- Fast numerical operations<br>- Foundation for Pandas<br>- Memory efficient | Native Python lists (slow)<br>TensorFlow (overkill) |
| **Pandas** | ^2.2 | - DataFrame operations<br>- ETL transformations<br>- Time series analysis<br>- CSV/Excel export | Polars (less mature)<br>Dask (distributed not needed) |
| **Matplotlib** | ^3.10 | - Chart generation (AI agent)<br>- Export to PNG<br>- Flexible plotting<br>- Industry standard | Plotly (heavy runtime)<br>Seaborn (opinionated) |
| **LangChain** | ^0.3 | - LLM orchestration<br>- Tool calling framework<br>- Chain of thought<br>- Memory management | LlamaIndex (document-focused)<br>Haystack (search-focused) |

---

## AI & LLM Stack

### AI SDK

| Technology | Version | Rationale | Alternatives Rejected |
|------------|---------|-----------|----------------------|
| **Vercel AI SDK** | 6.0.9 | - Native Next.js integration<br>- Streaming responses<br>- Multi-provider support<br>- React hooks (@ai-sdk/react) | LangChain.js (less Next.js integration)<br>OpenAI SDK (single provider) |
| **@ai-sdk/react** | 3.0.0 | - useChat hook<br>- UI state management<br>- Streaming UX<br>- Type-safe | Custom implementation (reinvent wheel) |

### LLM Providers

| Provider | Model | Rationale | Cost |
|----------|-------|-----------|------|
| **Google Gemini** (primary) | gemini-2.0-flash-exp | - Speed (<1s latency)<br>- Cost (10x cheaper than GPT-4)<br>- Spanish support<br>- 1M token context | $0.075/1M input tokens<br>$0.30/1M output tokens |
| **DeepSeek** (fallback) | deepseek-chat | - Cost-effective backup<br>- Good Spanish support<br>- No API downtime risk | $0.14/1M input tokens<br>$0.28/1M output tokens |

**Why NOT OpenAI GPT-4?**
- 10x more expensive than Gemini
- Slower (>3s latency)
- No better Spanish support than Gemini 2.0
- Overkill for this use case

### AI Gateway

| Technology | Rationale | Benefit |
|------------|-----------|---------|
| **Vercel AI Gateway** | - Centralized provider management<br>- Automatic fallback (Gemini → DeepSeek)<br>- Usage tracking<br>- Single API key config | - No custom fallback logic needed<br>- Cost monitoring built-in<br>- Provider-agnostic code |

---

## Database Stack

### Primary Database

| Technology | Version | Rationale | Alternatives Rejected |
|------------|---------|-----------|----------------------|
| **PostgreSQL** | 15+ | - ACID compliance (audit trail)<br>- JSON support (SICOM data)<br>- Full-text search<br>- Materialized views (dashboards)<br>- Industry standard | MongoDB (no ACID, overkill)<br>MySQL (less features)<br>SQLite (not production-ready) |
| **Vercel Postgres** | Managed | - Auto backups<br>- Zero config<br>- Point-in-time recovery<br>- Integrated with Vercel | Self-hosted (more maintenance)<br>RDS (AWS lock-in) |

### ORM & Query Builder

| Technology | Version | Rationale | Alternatives Rejected |
|------------|---------|-----------|----------------------|
| **Drizzle ORM** | ^0.39 | - Type-safe queries<br>- SQL-like syntax<br>- Lightweight<br>- Great TypeScript support | Prisma (heavy, slow migrations)<br>TypeORM (verbose decorators)<br>Kysely (no schema management) |
| **SQLAlchemy** (Python) | ^2.0 | - ORM for FastAPI<br>- Async support<br>- Python standard<br>- Complex queries | Django ORM (coupled to Django)<br>Peewee (less features) |

### Caching

| Technology | Version | Rationale | Alternatives Rejected |
|------------|---------|-----------|----------------------|
| **Redis** | Latest | - Fast key-value store<br>- Dashboard cache (5 min TTL)<br>- Session storage<br>- Queue (future) | Memcached (less features)<br>In-memory (not persistent) |
| **Vercel KV** | Managed | - Redis-compatible<br>- Zero config<br>- Integrated with Vercel | Upstash (similar but less integration) |

---

## Authentication & Authorization

| Technology | Version | Rationale | Alternatives Rejected |
|------------|---------|-----------|----------------------|
| **NextAuth.js** | ^5.0 (Auth.js) | - OAuth 2.0 support<br>- Google provider built-in<br>- Session management<br>- Type-safe | Clerk (SaaS, overkill)<br>Auth0 (expensive)<br>Supabase Auth (not using Supabase) |
| **Google OAuth 2.0** | N/A | - Client uses @contecsa.com<br>- SSO with Google Workspace<br>- No password management | Email/password (security risk)<br>SAML (complex setup) |

---

## File Storage

| Technology | Rationale | Use Cases | Alternatives |
|------------|-----------|-----------|--------------|
| **Vercel Blob** (preferred) | - Integrated with Vercel<br>- Simple API<br>- CDN distribution<br>- Pay-as-you-go | - Invoice scans (OCR)<br>- Quality certificates<br>- Generated reports | - |
| **Google Cloud Storage** | - Client may prefer GCP<br>- Client-hosted option<br>- Good Python SDK | Same as above | - |
| **AWS S3** | - Client may prefer AWS<br>- Ubiquitous standard<br>- Glacier for archival | Same as above | - |

**Decision:** Let client choose based on their cloud preference (Vercel/GCP/AWS)

---

## External Integrations

### Google Workspace

| API | Version | Rationale | Use Cases |
|-----|---------|-----------|-----------|
| **Gmail API** | v1 | - Client uses Gmail<br>- Send notifications<br>- Track delivery | - Daily summaries (R5)<br>- Immediate alerts<br>- Invoice intake (R12 future) |
| **Sheets API** | v4 | - Users familiar with Sheets<br>- Export to familiar format<br>- Batch operations | - Dashboard export<br>- Purchase list export<br>- Report generation |
| **Google Cloud Vision** | v1 | - OCR invoice processing<br>- High accuracy<br>- Multi-language | - Invoice OCR (R4) |

**Why NOT AWS Textract?**
- Client already uses Google Workspace
- Vision API better Spanish support
- Simpler integration (single cloud provider)

---

## Development Tools

### Package Manager

| Technology | Version | Rationale | Alternatives Rejected |
|------------|---------|-----------|----------------------|
| **bun** | 1.3.5+ | - Faster than npm/yarn/pnpm<br>- Drop-in replacement<br>- Built-in test runner<br>- Modern tooling | npm (slow)<br>yarn (legacy)<br>pnpm (less adoption) |

### Code Quality

| Technology | Version | Rationale | Alternatives Rejected |
|------------|---------|-----------|----------------------|
| **Biome** | 2+ | - Fast linter + formatter<br>- Zero config<br>- Replaces ESLint + Prettier<br>- Rust-based (speed) | ESLint + Prettier (2 tools, slow)<br>Oxc (too new) |
| **TypeScript** | 5.9.3 | - Strict mode enforced<br>- Catch errors early<br>- Better refactoring<br>- Documentation via types | - |

### Testing

| Technology | Version | Rationale | Alternatives Rejected |
|------------|---------|-----------|----------------------|
| **Playwright** | ^1.49 | - E2E testing<br>- Multiple browsers<br>- Auto-wait<br>- Great TypeScript support | Cypress (slower, less browsers)<br>Selenium (outdated API) |
| **pytest** (Python) | ^8.3 | - Python standard<br>- Fixtures, parametrize<br>- FastAPI integration | unittest (verbose)<br>nose (unmaintained) |

---

## Deployment & Infrastructure

### Hosting

| Component | Platform | Rationale |
|-----------|----------|-----------|
| **Frontend** | Vercel | - Zero config deployment<br>- Auto previews (PRs)<br>- Edge network (CDN)<br>- Serverless functions |
| **Backend (Python)** | Client choice (GCP/AWS) | - Google Cloud Run (serverless containers)<br>- AWS Lambda (serverless functions)<br>- Client self-hosts |
| **Database** | Vercel Postgres | - Managed PostgreSQL<br>- Auto backups<br>- Integrated with Vercel |
| **Cache** | Vercel KV | - Managed Redis<br>- Integrated with Vercel |

### CI/CD

| Technology | Rationale |
|------------|-----------|
| **GitHub Actions** | - Free for private repos<br>- Native GitHub integration<br>- Simple YAML config<br>- Matrix builds |
| **Vercel Git Integration** | - Auto deploy on push<br>- Preview deployments (PRs)<br>- Production on merge to main |

**Why NOT Jenkins/CircleCI?**
- Overkill for 2-person team
- GitHub Actions sufficient
- No self-hosted CI needed

---

## Monitoring & Observability

| Technology | Purpose | Rationale |
|------------|---------|-----------|
| **Vercel Analytics** | - Page load times<br>- Real User Monitoring (RUM)<br>- Web Vitals | - Built-in to Vercel<br>- Zero config |
| **Vercel Logs** | - Application logs<br>- Error tracking<br>- API request logs | - Built-in to Vercel<br>- 30-day retention |
| **PostgreSQL Logs** | - Slow query logs<br>- Audit trail (compra_estados_log) | - Built-in to database<br>- Query performance |

**Why NOT Datadog/New Relic?**
- Expensive ($50-500/month)
- Overkill for 2-person team
- Vercel built-in tools sufficient for MVP

---

## Documentation

| Technology | Purpose | Rationale |
|------------|---------|-----------|
| **Markdown** | - Technical docs (/docs)<br>- README files<br>- Feature specs | - Simple, version-controlled<br>- GitHub renders natively |
| **Mermaid** (future) | - Architecture diagrams<br>- Flow charts | - Text-based (git-friendly)<br>- GitHub renders natively |

**Why NOT Confluence/Notion?**
- SaaS lock-in
- Docs live with code (git)
- Markdown is portable

---

## Dependencies Summary

### Frontend (package.json)

```json
{
  "dependencies": {
    "next": "15.5.9",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "typescript": "5.9.3",
    "tailwindcss": "4.1.18",
    "ai": "6.0.9",
    "@ai-sdk/react": "3.0.0",
    "@ai-sdk/google": "1.2.6",
    "@tanstack/react-query": "5.62.14",
    "drizzle-orm": "0.39.4",
    "next-auth": "5.0.0-beta.25",
    "recharts": "2.15.6",
    "@radix-ui/react-*": "latest",
    "googleapis": "144.0.0"
  },
  "devDependencies": {
    "@biomejs/biome": "2.0.0",
    "@playwright/test": "1.49.1",
    "@types/node": "22.14.2",
    "@types/react": "19.0.10",
    "@types/react-dom": "19.0.5"
  }
}
```

### Backend (requirements.txt)

```txt
fastapi==0.115.6
uvicorn[standard]==0.34.2
pydantic==2.10.6
sqlalchemy[asyncio]==2.0.36
psycopg[binary]==3.2.3
numpy==2.2.4
pandas==2.2.3
matplotlib==3.10.3
langchain==0.3.20
langchain-google-genai==2.1.5
google-api-python-client==2.163.0
google-auth-httplib2==0.2.0
google-auth-oauthlib==1.2.2
redis==5.2.2
pytest==8.3.5
httpx==0.28.2
```

---

## Technology Decision Matrix

### Criteria for Technology Selection

| Criterion | Weight | Evaluation |
|-----------|--------|------------|
| **Team size** | 40% | Can 2 people maintain it? |
| **Client requirements** | 30% | Does it meet PO requirements? |
| **Stability** | 15% | Is it production-ready? |
| **Ecosystem** | 10% | Good documentation, community? |
| **Cost** | 5% | Fits budget (prefer free/open-source)? |

### Example: Why Gemini 2.0 Flash over GPT-4?

| Criterion | Gemini 2.0 Flash | GPT-4 | Winner |
|-----------|------------------|-------|--------|
| **Cost** | $0.075/1M tokens | $0.75/1M tokens (10x) | ✅ Gemini |
| **Speed** | <1s latency | 2-3s latency | ✅ Gemini |
| **Spanish** | Excellent | Excellent | 🟰 Tie |
| **Context** | 1M tokens | 128K tokens | ✅ Gemini |
| **Total** | **Winner** | - | **Gemini 2.0 Flash** |

### Example: Why Python Backend?

| Criterion | Python + FastAPI | Node.js + Express | Winner |
|-----------|------------------|-------------------|--------|
| **PO requirement** | ✅ Explicitly requested | ❌ Not requested | ✅ Python |
| **Data analysis** | NumPy, Pandas (mature) | Limited options | ✅ Python |
| **3D matrices** | NumPy native | Requires external libs | ✅ Python |
| **Team familiarity** | Javier knows Python | Both familiar | 🟰 Tie |
| **Total** | **Winner** | - | **Python** |

---

## Rejected Technologies

| Technology | Reason for Rejection |
|------------|----------------------|
| **Storybook** | Team too small (2 people), visual testing not needed |
| **Jira** | Team too small, GitHub Issues sufficient |
| **Nx/Turborepo** | Monorepo not needed, single repo is simple |
| **Microservices** | Team too small, monolith faster to develop |
| **Kubernetes** | Team too small, serverless simpler |
| **GraphQL** | REST API simpler, no complex relationships |
| **Prisma** | Heavy migrations, Drizzle lighter and faster |
| **Redux** | Overkill for small app, React Query + hooks sufficient |
| **Docker Compose** | Local dev doesn't need containers, Vercel handles prod |

---

## Version Management

### Frontend Versioning

- **Node.js**: 20+ (LTS)
- **bun**: 1.3.5+ (latest stable)
- **Next.js**: 15.x (latest stable)
- **React**: 19.x (latest)
- **TypeScript**: 5.x (latest)

**Update frequency:** Quarterly (every 3 months) for minor versions, immediately for security patches

### Backend Versioning

- **Python**: 3.11+ (not 3.12 yet, ensure library compatibility)
- **FastAPI**: 0.x (semantic versioning, minor updates monthly)
- **NumPy/Pandas**: Latest stable

**Update frequency:** Monthly for dependencies, quarterly for Python version

---

## Configuration Files

### Frontend Configuration

**`next.config.ts`**
```typescript
import type { NextConfig } from 'next';

const config: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
    ],
  },
};

export default config;
```

**`tailwind.config.ts`**
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
```

**`biome.json`**
```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "files": {
    "ignore": [".next", "node_modules", "out", ".vercel"]
  },
  "formatter": {
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "always"
    }
  }
}
```

### Backend Configuration

**`pyproject.toml`** (Python project config)
```toml
[project]
name = "contecsa-api"
version = "1.0.0"
requires-python = ">=3.11"

[tool.pytest.ini_options]
pythonpath = "."
testpaths = ["tests"]
asyncio_mode = "auto"

[tool.ruff]
line-length = 100
target-version = "py311"
```

---

## Environment Variables

### Required Environment Variables

**Frontend (.env.local)**
```env
# Database
POSTGRES_URL=postgresql://user:pass@host/db
POSTGRES_PRISMA_URL=postgresql://user:pass@host/db?pgbouncer=true

# Redis Cache
KV_URL=redis://user:pass@host:port
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...

# AI Gateway
VERCEL_AI_GATEWAY_API_KEY=...

# Auth
NEXTAUTH_URL=https://app.contecsa.com
NEXTAUTH_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Google APIs
GOOGLE_SERVICE_ACCOUNT_EMAIL=...
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=...
GMAIL_SENDER_EMAIL=notificaciones@contecsa.com
```

**Backend (.env)**
```env
# Database
DATABASE_URL=postgresql://user:pass@host/db

# SICOM Legacy
SICOM_DB_HOST=...
SICOM_DB_USER=readonly_user
SICOM_DB_PASSWORD=...
SICOM_DB_NAME=sicom

# AI
GEMINI_API_KEY=...
DEEPSEEK_API_KEY=...

# Google APIs
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json

# Environment
ENV=production
LOG_LEVEL=info
```

---

## References

- Next.js 15 Documentation: https://nextjs.org/docs
- Vercel AI SDK 6.0: https://sdk.vercel.ai/docs
- FastAPI Documentation: https://fastapi.tiangolo.com
- PostgreSQL 15 Documentation: https://www.postgresql.org/docs/15/
- Tailwind CSS 4: https://tailwindcss.com/docs
- Gemini API: https://ai.google.dev/gemini-api/docs
- Google Workspace APIs: https://developers.google.com/workspace
- PRD.md (Feature requirements)
- CLAUDE.md (Decision filter, standards)
- docs/architecture-overview.md (System architecture)
