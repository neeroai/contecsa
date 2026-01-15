---
title: "Contecsa System Architecture Overview"
summary: "High-level architecture overview with structure, data flow, multi-tenant model, and critical rules. Reference guide for understanding system components and deployment topology."
description: "Architecture overview: structure, data flow, multi-tenant design, SICOM integration"
date: "2025-12-31"
updated: "2026-01-15 14:30"
scope: "project"
---

# Contecsa Architecture

## Overview

AI conversational agent + dashboard replacing manual Excel tracking (28 fields). Prevents losses like Cartagena case (undetected overbilling). Read-only connection to SICOM legacy system.

## Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Frontend | Next.js App Router | 15.x |
| UI | React + TypeScript | 19.x / 5.6+ |
| Styling | Tailwind CSS + shadcn/ui | 4.x |
| Backend | Python + FastAPI | 3.11+ |
| Database | PostgreSQL + Redis | 15.x |
| AI | Gemini 2.0 Flash / DeepSeek | Latest |
| Integrations | WhatsApp Business API | v23.0 |
| Deploy | Vercel (frontend) + Client-hosted (backend) | - |

## Structure

```
src/
  app/
    (auth)/              # Auth routes (login, register)
    (dashboard)/         # Protected dashboard routes
      dashboard/
        gerencia/        # Management view
        compras/         # Purchasing view
        almacen/         # Warehouse view
        contabilidad/    # Accounting view
        tecnico/         # Technical view
    api/ai/              # AI endpoint routes
  components/
    ui/                  # shadcn/ui components (button, card, etc.)
    layout/              # App layout (sidebar, header)
    dashboard/           # Dashboard-specific components
  lib/
    ai/                  # AI configuration
    mockup-data/         # Test data generators
    types/               # TypeScript types
  hooks/                 # React hooks
  styles/                # Global CSS + design system

api/                     # Python FastAPI backend
  routers/               # API endpoints (planned)
  services/              # SICOM ETL, AI agent, OCR (planned)
  models/                # Pydantic models (planned)

specs/                   # SDD specifications
docs/                    # PRD, meetings, analysis
tests/                   # Playwright E2E tests
```

## Data Flow

```
User Input
    |
    v
WhatsApp/Web --> Next.js API --> FastAPI Backend
                                       |
                                       v
                              PostgreSQL (warehouse)
                                       |
                                       v
                              SICOM (read-only legacy)
                                       |
                                       v
                              AI Analysis (Gemini/DeepSeek)
                                       |
                                       v
                              Response to User
```

## Multi-Tenant Architecture

| Tenant | Role | Access |
|--------|------|--------|
| Contecsa | Master | All consortiums |
| PAVICONSTRUJC | Consortium | Own data only |
| EDUBAR-KRA50 | Consortium | Own data only |
| PTAR | Consortium | Own data only |
| ... (9 total) | Consortium | Own data only |

**Cross-tenant PO tracking**: Purchase orders created in Contecsa can be received in consortium warehouses (eliminates dual entry).

## Critical Rules

1. **SICOM**: READ-ONLY always (1980s legacy system, no modifications)
2. **Multi-tenant**: Strict data isolation between consortiums
3. **Quality certificates**: Block PO closure without certificates (R-QUAL1)
4. **Price alerts**: Flag variations >10% (prevent Cartagena case)
5. **WhatsApp**: Primary field interface (P0 - non-negotiable)

## Key Endpoints (Planned)

| Method | Path | Purpose |
|--------|------|---------|
| GET | /api/health | Health check |
| POST | /api/auth/login | Authentication |
| GET | /api/purchases | List purchase orders |
| POST | /api/purchases | Create purchase order |
| GET | /api/sicom/sync | Sync from SICOM (read-only) |
| POST | /api/whatsapp/webhook | WhatsApp incoming messages |

## Dependencies

**Frontend**:
- next, react, react-dom
- tailwindcss, @shadcn/ui
- @ai-sdk/google, ai
- lucide-react, recharts

**Backend** (planned):
- fastapi, uvicorn
- sqlalchemy, asyncpg
- langchain, google-generativeai
- python-whatsapp

## Quality Gates

| Gate | Tool | Command |
|------|------|---------|
| Format | Biome | `bun run format` |
| Lint | Biome | `bun run lint` |
| Types | tsc | `bun run typecheck` |
| Tests | Vitest | `bun run test` |
| Build | Next.js | `bun run build` |

---

**Tokens**: ~650 | **Last Updated**: 2025-12-31
