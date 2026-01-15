# Contecsa - Navigation Map

Version: 1.0 | Date: 2026-01-15

> Quick reference guide for navigating the Contecsa codebase

## Overview

This document provides a high-level map of the codebase structure and key entry points for different development tasks.

## Quick Links

| Task | Start Here | Related Files |
|------|-----------|---------------|
| **Understanding the project** | CLAUDE.md, ARCHITECTURE.md | PRD.md, docs/README.md |
| **Frontend development** | src/app/, src/components/ | src/components/INDEX.md |
| **Business logic** | src/lib/ | src/lib/INDEX.md |
| **Custom hooks** | src/hooks/ | src/hooks/INDEX.md |
| **AI integration** | src/lib/ai/ | src/lib/ai/INDEX.md |
| **Type definitions** | src/lib/types/ | src/lib/types/INDEX.md |
| **Backend API** | api/ | api/main.py |
| **Testing** | tests/ | vitest.config.ts |
| **Design system** | src/styles/ | DESIGN_SYSTEM.md |
| **Documentation** | docs/ | docs/README.md, PRD.md |

## Directory Structure

```
contecsa/
├── .context/              # Navigation aids (this file, REPO_MAP.md)
├── .claude/              # Claude Code configuration
├── docs/                 # Documentation (PRD, meetings, analysis)
│   ├── prd.md           # Product Requirements (60+ requirements)
│   ├── business-context.md
│   └── meets/           # PO meeting transcripts
├── src/                 # Frontend Next.js application
│   ├── app/             # App Router (routes + layouts)
│   │   ├── (auth)/      # Authentication routes
│   │   ├── (dashboard)/ # Protected dashboard routes
│   │   └── api/         # Next.js API routes
│   ├── components/      # React components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── layout/      # Layout components
│   │   └── dashboard/   # Dashboard-specific components
│   ├── lib/             # Business logic & utilities
│   │   ├── ai/          # AI/LLM configuration
│   │   ├── types/       # TypeScript types
│   │   └── mockup-data/ # Test data generators
│   ├── hooks/           # Custom React hooks
│   └── styles/          # Global CSS + design system
├── api/                 # Python FastAPI backend (planned)
│   ├── main.py          # FastAPI app entry point
│   ├── routers/         # API endpoints
│   ├── services/        # SICOM ETL, AI agent, OCR
│   └── models/          # Pydantic models
├── specs/               # SDD specifications
├── tests/               # Playwright E2E tests
└── public/              # Static assets

Each module has an INDEX.md file with detailed file map and exports.
```

## Key Files

### Configuration

| File | Purpose |
|------|---------|
| CLAUDE.md | Project context for Claude Code |
| ARCHITECTURE.md | System architecture overview |
| package.json | Dependencies and scripts |
| next.config.ts | Next.js configuration |
| tailwind.config.ts | Tailwind CSS configuration |
| tsconfig.json | TypeScript configuration |
| biome.json | Code formatting/linting rules |

### Development Tracking

| File | Purpose |
|------|---------|
| plan.md | Architecture + implementation phases |
| todo.md | Current tasks [TODO/DOING/DONE] |
| feature_list.json | F001-F014 feature specifications |
| claude-progress.md | Session handoff notes |

### Documentation

| File | Purpose | Tokens |
|------|---------|--------|
| PRD.md | Full PRD (60+ requirements, 12 modules) | ~1900 lines |
| docs/business-context.md | Business context & case studies | ~500 lines |
| docs/analisis-control-compras.md | Current workflow analysis | ~300 lines |
| docs/meets/ | PO meeting transcripts | Varies |

## Navigation Protocol

**Recommended workflow:**

1. **Start with context** (first session):
   - Read CLAUDE.md (project rules + stack)
   - Read ARCHITECTURE.md (system design)
   - Skim .context/REPO_MAP.md (codebase structure)
   
2. **Locate relevant code**:
   - Use .context/REPO_MAP.md to find symbols
   - Read module INDEX.md for detailed file map
   - Open specific files (2-5 max per task)
   
3. **Work iteratively**:
   - Search first: `rg '<symbol|keyword>'`
   - Open probable files based on search
   - Expand search if needed (stay focused)

**Token efficiency:**
- Base context: ~1.5K tokens (CLAUDE.md + ARCHITECTURE.md)
- With navigation: +1.5K tokens (REPO_MAP.md) = ~3K total
- Module INDEX.md: ~200-500 tokens each
- Total: <5K tokens for complete navigation (vs 75K+ full codebase)

## Module-Level Navigation

### Frontend (src/)

| Module | INDEX.md | Key Files |
|--------|----------|-----------|
| app/ | (routes) | layout.tsx, page.tsx |
| components/ | src/components/INDEX.md | ui/, layout/, dashboard/ |
| lib/ | src/lib/INDEX.md | navigation.ts, utils.ts |
| hooks/ | src/hooks/INDEX.md | use-mobile-hook.tsx |
| styles/ | (design system) | globals.css, DESIGN_SYSTEM.md |

### Backend (api/)

| Module | Key Files |
|--------|-----------|
| api/ | main.py (FastAPI app) |
| routers/ | (planned) |
| services/ | (planned: SICOM ETL, AI agent) |

### Documentation (docs/)

| Document | Purpose | When to Read |
|----------|---------|--------------|
| prd.md | Full requirements | Feature development |
| business-context.md | Business context | Understanding domain |
| analisis-control-compras.md | Current workflow | Process integration |
| meets/ | PO meetings | Requirements clarification |

## Search Patterns

**Common search queries:**

```bash
# Find function/class definition
rg "export (function|class) <name>"

# Find component usage
rg "import.*<ComponentName>"

# Find type definition
rg "interface <TypeName>|type <TypeName>"

# Find API endpoint
rg "export (GET|POST|PUT|DELETE)"

# Find environment variables
rg "process.env.<VAR_NAME>"
```

## Critical Patterns (Multi-Tenant)

**Key architectural concepts:**

1. **Multi-tenant structure**
   - Contecsa = master tenant
   - 9+ consortiums = separate tenants
   - Cross-tenant PO tracking (R-MT4)
   
2. **SICOM integration**
   - **READ-ONLY ALWAYS** (NEVER modify)
   - Legacy 1970-80s system
   - Data warehouse without agile queries
   
3. **WhatsApp-first design**
   - Primary field interface (P0 feature)
   - OCR invoice processing via WhatsApp
   - Conversational AI for requisitions

## Related Documentation

- **Project context**: CLAUDE.md
- **Architecture**: ARCHITECTURE.md
- **Repository map**: .context/REPO_MAP.md
- **Module indices**: src/{module}/INDEX.md
- **Full PRD**: docs/prd.md
- **Development guide**: docs/development-guide.md

---
**Generated:** 2026-01-15
**Purpose:** Navigation aid for efficient codebase exploration
**Token cost:** ~1.5K tokens (75% reduction vs full codebase read)
