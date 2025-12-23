# Development Guide - Contecsa Sistema

Version: 1.0 | Date: 2025-12-23 00:05 | Type: Developer Guide | Status: Active

---

## Overview

Guía completa para configurar entorno de desarrollo local, ejecutar el sistema frontend (Next.js) + backend (Python FastAPI), y contribuir siguiendo estándares de código del proyecto.

**Target Audience:** Desarrolladores nuevos en el proyecto, equipo Neero, Claude Code

---

## Prerequisites

### Required Software

| Tool | Version | Installation |
|------|---------|--------------|
| **bun** | 1.3.5+ | `curl -fsSL https://bun.sh/install \| bash` |
| **Node.js** | 20.x+ | https://nodejs.org (for compatibility) |
| **Python** | 3.11+ | https://python.org or `brew install python3` |
| **PostgreSQL** | 15+ | https://postgresql.org or use Vercel Postgres |
| **Git** | 2.40+ | https://git-scm.com |
| **VS Code** | Latest | https://code.visualstudio.com (recommended) |

### Optional Tools

| Tool | Purpose |
|------|---------|
| **Docker** | Run PostgreSQL locally (alternative to Vercel Postgres) |
| **Postman** | Test API endpoints |
| **Playwright** | E2E testing (installed via bun) |

---

## Project Structure

```
contecsa/
├── src/                      # Frontend (Next.js 15)
│   ├── app/                  # App Router (routes + API)
│   │   ├── (auth)/           # Auth pages (login, register)
│   │   ├── (dashboard)/      # Protected pages (dashboard, purchases, etc.)
│   │   ├── api/              # API routes (Next.js serverless)
│   │   └── layout.tsx        # Root layout
│   ├── components/           # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── dashboard/        # Dashboard-specific components
│   │   └── shared/           # Shared components
│   ├── lib/                  # Utilities, helpers
│   │   ├── ai/               # AI SDK helpers (Gemini, DeepSeek)
│   │   ├── gmail/            # Gmail API client
│   │   ├── sheets/           # Google Sheets API client
│   │   └── db/               # Database client (Drizzle ORM)
│   ├── hooks/                # Custom React hooks
│   ├── types/                # TypeScript types
│   └── styles/               # Global styles
│
├── api/                      # Backend (Python FastAPI)
│   ├── main.py               # FastAPI app entry point
│   ├── routers/              # API routers (endpoints)
│   │   ├── purchases.py      # Purchase CRUD
│   │   ├── etl.py            # SICOM ETL endpoints
│   │   └── ocr.py            # Invoice OCR endpoints
│   ├── services/             # Business logic
│   │   ├── sicom_etl.py      # SICOM ETL service
│   │   ├── ocr.py            # OCR service (Google Vision)
│   │   └── price_anomaly.py  # Price anomaly detection (R7)
│   ├── models/               # Pydantic models (schemas)
│   └── tests/                # Backend tests (pytest)
│
├── docs/                     # Documentation (this guide)
├── tests/                    # E2E tests (Playwright)
├── .claude/                  # Claude Code project files
│   ├── CLAUDE.md             # Project-specific instructions
│   ├── plan.md               # Current phase plan
│   ├── todo.md               # Task tracking
│   └── claude-progress.md    # Session handoff notes
│
├── package.json              # Frontend dependencies
├── requirements.txt          # Backend dependencies
├── tsconfig.json             # TypeScript config
├── tailwind.config.ts        # Tailwind CSS config
├── next.config.ts            # Next.js config
├── biome.json                # Biome linter/formatter config
└── .env.local                # Environment variables (local only)
```

---

## Frontend Setup (Next.js)

### 1. Clone Repository

```bash
git clone https://github.com/neero/contecsa.git
cd contecsa
```

### 2. Install Dependencies

```bash
# Using bun (recommended)
bun install

# Or npm (fallback)
npm install
```

### 3. Configure Environment Variables

```bash
# Copy template
cp .env.example .env.local

# Edit .env.local with your values
```

**Required Environment Variables:**

```env
# Database (Vercel Postgres)
POSTGRES_URL=postgres://user:password@host:5432/contecsa
POSTGRES_PRISMA_URL=postgres://user:password@host:5432/contecsa?pgbouncer=true

# NextAuth.js (Authentication)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generated-secret-32-chars  # Generate: openssl rand -base64 32

# Google OAuth (SSO)
GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xyz

# Google Workspace (Gmail + Sheets)
GMAIL_SERVICE_ACCOUNT_EMAIL=notificaciones-service@contecsa-xyz.iam.gserviceaccount.com
GMAIL_SERVICE_ACCOUNT_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}

# AI (Vercel AI Gateway)
GOOGLE_AI_API_KEY=AIzaSy...
DEEPSEEK_API_KEY=sk-...
VERCEL_AI_GATEWAY_URL=https://gateway.ai.vercel.app/v1

# Storage (Vercel Blob)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...  # Auto-set by Vercel

# Python Backend URL (local development)
PYTHON_API_URL=http://localhost:8000
```

### 4. Run Database Migrations

```bash
# Push schema to database (Drizzle ORM)
bun run db:push

# Seed database with sample data (optional)
bun run db:seed
```

### 5. Start Development Server

```bash
# Start Next.js dev server (hot reload)
bun run dev

# Server will be available at: http://localhost:3000
```

### 6. Development Commands

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server (http://localhost:3000) |
| `bun run build` | Build production bundle |
| `bun run start` | Start production server |
| `bun run lint` | Run Biome linter |
| `bun run format` | Format code with Biome |
| `bun run typecheck` | Run TypeScript type checking |
| `bun run test:e2e` | Run Playwright E2E tests |

---

## Backend Setup (Python FastAPI)

### 1. Create Virtual Environment

```bash
cd api/
python3 -m venv venv

# Activate virtual environment
# macOS/Linux:
source venv/bin/activate

# Windows:
venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

**requirements.txt:**

```txt
fastapi==0.115.0
uvicorn[standard]==0.32.0
pydantic==2.10.0
pandas==2.2.0
numpy==2.2.0
opencv-python==4.10.0
google-cloud-vision==3.8.0
google-cloud-storage==2.18.0
psycopg2-binary==2.9.10
python-dotenv==1.0.1
```

### 3. Configure Environment Variables

```env
# api/.env
DATABASE_URL=postgres://user:password@host:5432/contecsa

# SICOM (read-only)
SICOM_HOST=sicom.contecsa.local
SICOM_DATABASE=SICOM_DB
SICOM_USER=readonly_user
SICOM_PASSWORD=readonly_password

# Google Cloud (OCR + Storage)
GCS_PROJECT_ID=contecsa-sistema-compras
GCS_BUCKET_NAME=contecsa-files
GOOGLE_CLOUD_CREDENTIALS={"type":"service_account",...}
```

### 4. Start Backend Server

```bash
# Development mode (auto-reload)
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Server will be available at: http://localhost:8000
# API docs (Swagger): http://localhost:8000/docs
```

### 5. Test API Endpoints

```bash
# Health check
curl http://localhost:8000/health

# Test OCR endpoint
curl -X POST http://localhost:8000/ocr/invoice \
  -H "Content-Type: application/json" \
  -d '{"image_url":"https://example.com/invoice.pdf"}'
```

---

## Development Workflows

### Git Workflow (GitHub Flow)

**Branches:**
- `main` - Production-ready code
- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/what-changed` - Documentation updates

**Workflow:**

```bash
# 1. Create feature branch
git checkout -b feature/r04-ocr-facturas

# 2. Make changes, commit frequently
git add .
git commit -m "feat: implement OCR invoice extraction"

# 3. Push to remote
git push origin feature/r04-ocr-facturas

# 4. Create Pull Request on GitHub
# 5. After review + approval → Merge to main
# 6. Delete feature branch
git branch -d feature/r04-ocr-facturas
```

**Commit Message Convention:**

```
<type>: <description>

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation only
- style: Code style (formatting, no logic change)
- refactor: Code refactor (no behavior change)
- test: Add/update tests
- chore: Build/tooling changes

Examples:
feat: add OCR invoice extraction (R4)
fix: prevent duplicate price anomaly alerts
docs: update development guide with Python setup
```

### Code Review Checklist

**Before submitting PR:**
- [ ] Code follows TypeScript strict mode (frontend)
- [ ] Type annotations added (Python backend)
- [ ] Biome linter passes (`bun run lint`)
- [ ] TypeScript type check passes (`bun run typecheck`)
- [ ] Build succeeds (`bun run build`)
- [ ] E2E tests pass (if applicable)
- [ ] No console.log/print statements in production code
- [ ] Environment variables documented in .env.example
- [ ] PR description explains WHAT changed and WHY

---

## Testing Strategy

### Unit Tests (Backend - pytest)

```python
# api/tests/test_price_anomaly.py
import pytest
from services.price_anomaly import detect_price_anomaly

def test_caso_cartagena_detection():
    """
    Simulate Caso Cartagena: +20% price anomaly should be detected
    """
    result = detect_price_anomaly(
        material_id="concreto-3000-psi",
        supplier_id="supplier-abc",
        unit_price=120,  # 20% above baseline (100)
        material_category="CONCRETO"
    )

    assert result['anomaly_detected'] == True
    assert result['severity'] in ['HIGH', 'CRITICAL']
    assert result['deviation_pct'] >= 15
```

**Run tests:**

```bash
cd api/
pytest tests/ -v
```

### E2E Tests (Playwright)

```typescript
// tests/e2e/purchase-tracking.spec.ts
import { test, expect } from '@playwright/test';

test('should create purchase and track through workflow', async ({ page }) => {
  // 1. Login
  await page.goto('http://localhost:3000/login');
  await page.fill('[name="email"]', 'jefe.compras@contecsa.com');
  await page.fill('[name="password"]', 'password');
  await page.click('button[type="submit"]');

  // 2. Create requisition
  await page.click('a[href="/requisitions/new"]');
  await page.fill('[name="material"]', 'Cemento Argos 50kg');
  await page.fill('[name="quantity"]', '100');
  await page.click('button:has-text("Crear Requisición")');

  // 3. Verify requisition created
  await expect(page.locator('text=Requisición creada exitosamente')).toBeVisible();
});
```

**Run E2E tests:**

```bash
bun run test:e2e
```

---

## Debugging

### Frontend (Next.js)

**VS Code Launch Configuration (.vscode/launch.json):**

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "bun run dev"
    }
  ]
}
```

**Browser DevTools:**
- Chrome DevTools → Network tab (inspect API calls)
- React DevTools (inspect component state)
- Console (check for errors)

### Backend (Python)

**VS Code Launch Configuration:**

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python: FastAPI",
      "type": "python",
      "request": "launch",
      "module": "uvicorn",
      "args": ["main:app", "--reload"],
      "jinja": true
    }
  ]
}
```

**Logging:**

```python
# Use Python logging (not print)
import logging

logger = logging.getLogger(__name__)
logger.info("Processing invoice: %s", invoice_id)
logger.error("OCR failed: %s", error)
```

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| `Module not found` (TypeScript) | Run `bun install`, restart TS server (VS Code: Cmd+Shift+P → "Restart TS Server") |
| `Database connection failed` | Check `.env.local` DATABASE_URL, verify Vercel Postgres is accessible |
| `Gmail API 403 Forbidden` | Verify service account has domain-wide delegation in admin.google.com |
| `SICOM connection timeout` | Check VPN/network access to SICOM server (likely internal network only) |
| `Python import errors` | Activate virtual environment (`source venv/bin/activate`) |
| `Build fails on Vercel` | Check env vars in Vercel dashboard match .env.local |

---

## Code Style Guide

### TypeScript/JavaScript

**Rules:**
- **Strict mode:** Enabled in tsconfig.json
- **Spacing:** 2 spaces (no tabs)
- **Line length:** Max 100 characters
- **Quotes:** Single quotes (except JSX → double quotes)
- **Semicolons:** Always
- **Naming:**
  - Components: PascalCase (`DashboardCard.tsx`)
  - Functions: camelCase (`calculateTotal()`)
  - Constants: UPPER_SNAKE_CASE (`MAX_RETRIES`)
  - Files: kebab-case (`purchase-tracking.ts`)

**Example:**

```typescript
// GOOD
export function calculatePriceDeviation(
  actual: number,
  baseline: number
): number {
  return ((actual - baseline) / baseline) * 100;
}

// BAD
function CalcPriceDev(a,b) {
  return a-b/b*100
}
```

### Python

**Rules (PEP 8):**
- **Spacing:** 4 spaces (no tabs)
- **Line length:** Max 100 characters
- **Naming:**
  - Functions: snake_case (`detect_price_anomaly`)
  - Classes: PascalCase (`SICOMConnector`)
  - Constants: UPPER_SNAKE_CASE (`MAX_RETRIES`)

**Type Annotations:**

```python
# Always use type annotations
def detect_price_anomaly(
    material_id: str,
    unit_price: float,
    baseline: float
) -> dict:
    return {"anomaly_detected": unit_price > baseline * 1.1}
```

---

## Environment Management

### Local Development

```env
# .env.local (never commit to git)
NODE_ENV=development
DATABASE_URL=postgres://localhost:5432/contecsa_dev
PYTHON_API_URL=http://localhost:8000
```

### Staging (Vercel Preview)

```env
# Vercel dashboard → Environment Variables → Preview
NODE_ENV=staging
DATABASE_URL=postgres://staging.vercel-storage.com/contecsa
PYTHON_API_URL=https://api-staging.contecsa.com
```

### Production (Vercel)

```env
# Vercel dashboard → Environment Variables → Production
NODE_ENV=production
DATABASE_URL=postgres://production.vercel-storage.com/contecsa
PYTHON_API_URL=https://api.contecsa.com
```

---

## Deployment

### Frontend (Vercel)

**Automatic Deployment:**
- Push to `main` → Auto-deploy to production
- Push to feature branch → Auto-deploy to preview URL

**Manual Deployment:**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Backend (Client-Hosted)

**Deployment is client responsibility (self-host)**

**Suggested Platforms:**
- **Google Cloud Run** (containerized FastAPI)
- **AWS Lambda** (serverless FastAPI)
- **Traditional VPS** (Ubuntu + nginx + uvicorn)

**Dockerfile (example):**

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## Documentation Standards

**When creating/updating docs:**
- Add metadata header (Version, Date)
- Use tables for comparisons (token-efficient)
- NO EMOJIS in documentation files
- Max 100 chars per line
- Cross-reference related docs (relative paths)

**Example Metadata:**

```markdown
# Feature Name

Version: 1.0 | Date: 2025-12-23 00:05 | Priority: P0 | Status: Active

---

## Overview
...
```

---

## References

- Architecture: docs/architecture-overview.md
- Tech Stack: docs/tech-stack-detailed.md
- Feature Docs: docs/features/
- Integration Guides: docs/integrations/
- Project CLAUDE.md: CLAUDE.md
- Company CLAUDE.md: /neero/CLAUDE.md
