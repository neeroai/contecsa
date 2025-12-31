# CLAUDE.md

Version: 2.1 | Date: 2025-12-31 12:00

**Project**: Contecsa Sistema de Inteligencia de Datos | **Type**: web+api | **Stack**: Next.js 15 + FastAPI + PostgreSQL

## Overview

AI conversational agent + dashboard replacing manual Excel (28 fields). Read-only connection to SICOM legacy. Prevents losses like Cartagena case (undetected overbilling).

**Client**: Contecsa (construction) + 9 consortiums (PAVICONSTRUJC, EDUBAR-KRA50, PTAR, etc.)
**Phase**: Setup - baseline configuration
**Users**: 8-10 (2-3 management, 3 purchasing, 1 accounting, 1 technical, 1 warehouse)

## Stack

**Frontend**: Next.js 15 App Router | TypeScript 5.6+ | Tailwind CSS 4 | shadcn/ui
**Backend**: Python 3.11+ + FastAPI (PO requirement: complex data analysis, SICOM ETL)
**Database**: PostgreSQL 15 (warehouse) | Redis (cache) | SICOM (read-only legacy)
**AI**: Gemini 2.0 Flash → DeepSeek (fallback) | LangChain | Vercel AI SDK 6.0
**Integrations**: WhatsApp Business API (P0) | Gmail API | Sheets API | GCS/S3 | Vision/Textract OCR
**Deployment**: Frontend Vercel | Backend GCP/AWS (client self-hosted) | **NO SaaS**
**Dev Tools**: bun 1.3+ | Biome 2+ | Playwright

## Commands

```bash
# Frontend
bun run dev              # localhost:3000
bun run build
bun run lint
bun run typecheck
bun run test

# Backend
cd api
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload  # localhost:8000
```

## Structure

```
src/                    # Frontend Next.js
  app/                  # App Router
  components/ui/        # shadcn/ui
  lib/                  # Business logic
api/                    # Backend Python/FastAPI
  main.py               # FastAPI app
  routers/              # API routes
  services/             # sicom_etl.py, ai_agent.py, ocr.py
  models/               # Pydantic models
docs/                   # PRD, meets, analysis
  prd.md                # 60+ requirements, 12 modules
  meets/                # PO meetings transcripts
tests/                  # E2E Playwright
```

## Critical Architecture

**Multi-Tenant (P0 - 2025-12-24)**:
- Contecsa = master tenant
- 9+ consortiums = separate tenants (distinct legal entities)
- Cross-tenant PO tracking (eliminate dual entry)
- Use "Consorcio" not "Proyecto" in UI

**SICOM Legacy**:
- 1970-80s system, version 2, no upgrades
- Black screen, "data warehouse without agile queries"
- **READ-ONLY ALWAYS** - NEVER modify data

**Case Cartagena (Business Critical)**:
- 3 invoices concrete overbilling undetected
- Overpaid 2 months
- Feature R-REPORT3 must prevent: price variation alerts >10%

## P0 Features

| ID | Feature | Why Critical |
|----|---------|--------------|
| R-MT4 | Cross-Tenant PO Tracking | Eliminate dual entry (PO in Contecsa → warehouse in Consortium) |
| R-PROC1 | WhatsApp Requisitions | NO-NEGOTIABLE for field adoption |
| R-REPORT3 | Price Anomaly Detection | Prevent Cartagena case |
| R-QUAL1 | Certificate Blocking | No PO close without quality certificates |
| R-OCR1 | Invoice OCR via WhatsApp | Eliminate manual entry |
| R-MT2 | One-Click Consortium Creation | "Un botoncito" replicates Contecsa config |

Full: 60+ requirements in docs/prd.md

## Standards

- TypeScript strict mode | Functional > OOP | Early returns
- 2 spaces | 100 chars | Single quotes | Semicolons
- Files <600 lines | NO EMOJIS
- Quality gates MUST pass before merge (format/lint/types/tests/build)

## Tracking

| File | Purpose | Max |
|------|---------|-----|
| plan.md | Architecture + phases | 50 lines |
| todo.md | Tasks [TODO/DOING/DONE] | 50 lines |
| feature_list.json | F001-F014 features | - |
| claude-progress.md | Session handoff | Rolling |

## Critical Rules

**MANDATORIO**:
- Multi-tenant architecture (Contecsa + 9 consortiums)
- WhatsApp integration P0 (primary field interface)
- SICOM read-only ALWAYS (NEVER modify)
- Python backend (PO requirement - data analysis)
- Quality certificates blocking (R-QUAL1)
- Cross-tenant PO tracking (R-MT4 - eliminate dual entry)
- Client self-hosted (software delivered, NOT SaaS)

**NO INVENTAR**:
- Stack validated meet 2025-12-22
- Multi-tenant validated meet 2025-12-24 (Alberto Ceballos)
- See docs/meets/ for full context
- See docs/analisis-control-compras.md for current flow

**Decision Filter (ClaudeCode&OnlyMe)**:
- 2 people: Javier + Claude Code
- NO tools for teams 5+
- Simplicity > Features (complexity → no usage)

## Super User

**Liced Vega**: Purchasing tracking lead (appears in majority Excel purchases)
Suggested pilot user for MVP

## Codebase Indexing

**Context Files** (cross-platform AI support):
- `.context.md` - Repomix generated (73K tokens, auto-updated by CI)
- `.index/skeleton.json` - Machine-readable structure
- `.index/stats.json` - Code statistics
- `ARCHITECTURE.md` - Human + AI readable architecture

**Regenerate Context**:
```bash
repomix  # Uses repomix.config.json
```

**Cross-Platform Usage**:
- Claude Code: Auto-loads CLAUDE.md + ARCHITECTURE.md
- GPT/Gemini: `cat .context.md | pbcopy` then paste
- Cursor: See `.cursor/rules/` (if created)

**CI**: `.github/workflows/index.yml` auto-regenerates on push to main

## Key Docs

- `docs/prd.md` - Full PRD (1900 lines, 60+ reqs, 12 modules)
- `docs/meets/contecsa-alberto-ceballos-12-24-2025.txt` - Multi-tenant context
- `docs/meets/contecsa_meet_2025-12-22.txt` - Initial PO context
- `docs/analisis-control-compras.md` - Current workflow
- `docs/business-context.md` - Business context
- `ARCHITECTURE.md` - Architecture overview (token-efficient)

---
**Tokens**: ~950 | **Optimization**: v2.1 added codebase indexing
