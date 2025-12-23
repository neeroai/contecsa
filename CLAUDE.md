# CLAUDE.md - Contecsa

Version: 1.0 | Date: 2025-12-22 19:20

## 4-Level Hierarchy

1. **USER** (`~/.claude/CLAUDE.md`) - Personal preferences
2. **COMPANY** (`/neero/CLAUDE.md`) - Neero-wide context (26 projects)
3. **GLOBAL** (`docs-global/`) - Shared technical docs
4. **PROJECT** (this file) - Contecsa-specific

**Override order:** USER → COMPANY → GLOBAL → PROJECT

## Project Overview

**Name:** Contecsa - Sistema de Inteligencia de Datos
**Purpose:** Agente IA conversacional + dashboard que reemplaza proceso manual Excel (28 campos), conecta read-only a SICOM legacy, previene pérdidas como caso Cartagena (sobrecobro no detectado).
**Client:** Contecsa (construcción/obras civiles) + 9 consorcios (PAVICONSTRUJC, EDUBAR-KRA50, PTAR, etc.)
**Phase:** Setup - Configuración baseline
**Current Sprint:** Archivos configuración + tracking (NO código aplicación todavía)

## Tech Stack

### Frontend
**Framework:** Next.js 15 App Router
**Language:** TypeScript 5.6+
**Styling:** Tailwind CSS 4
**UI:** shadcn/ui

### Backend (CRÍTICO)
**Framework:** Python 3.11+ + FastAPI
**Reason:** PO lo pidió explícitamente - "herramienta más poderosa para análisis datos, matrices tridimensionales"
**Transformation:** Datos no estructurados (más rápido que SQL para IA)

### Database
**Warehouse:** PostgreSQL 15 (datos transformados)
**Caché:** Redis
**Legacy:** SICOM (años 70-80, read-only, NO modificar)

### AI/LLM
**Model:** Claude 3.5 Sonnet o GPT-4
**Framework:** LangChain (orchestration)
**SDK:** Vercel AI SDK 5.0

### Integrations
**Google Workspace:** Gmail API (notificaciones), Sheets API (exportación familiar)
**Storage:** Google Cloud Storage o AWS S3 (certificados, facturas OCR)
**OCR:** Google Vision API o AWS Textract
**WhatsApp:** Business API (Phase 2)

### Deployment
**Frontend:** Vercel Serverless
**Backend:** Google Cloud Run o AWS Lambda (cliente elige)
**CRITICAL:** Software se entrega (NO SaaS), cliente monta en su nube

### Dev Tools
**Package Manager:** pnpm 10+
**Linter/Formatter:** Biome 2+
**Testing:** Playwright (E2E)

## Stack Deviations

### Python Backend
**Using:** FastAPI + Python 3.11 (además de Next.js)
**Reason:** PO requirement - análisis datos complejo, ETL SICOM, transformación a datos no estructurados
**Impact:** Monorepo con /src (frontend) y /api (backend Python)

### Client-Hosted
**Using:** Cliente monta en su nube (GCP o AWS)
**Reason:** "Software se entrega, NO se alquila" - privacidad datos
**Impact:** Sin Vercel backend, solo frontend. Backend en GCP/AWS del cliente.

## File Structure (Monorepo)

```
.
├── src/                  # Frontend Next.js
│   ├── app/              # App Router
│   ├── components/       # React components
│   │   └── ui/           # shadcn/ui
│   ├── lib/              # Business logic
│   └── styles/           # Tailwind
├── api/                  # Backend Python/FastAPI
│   ├── main.py           # FastAPI app
│   ├── routers/          # API routes
│   ├── services/         # Business logic
│   │   ├── sicom_etl.py  # ETL SICOM read-only
│   │   ├── ai_agent.py   # Conversational AI
│   │   └── ocr.py        # Invoice OCR
│   └── models/           # Pydantic models
├── docs/
│   ├── prd-full.md       # PRD completo (26KB)
│   ├── meets/            # Reuniones PO
│   └── analisis-control-compras.md
├── tests/
└── .claude/
```

## Project Context

### SICOM Legacy
- Años 70-80, versión 2 sin upgrade
- Pantalla negra, "bodega de datos sin consultas ágiles"
- **CRÍTICO:** Read-only SIEMPRE, NO modificar datos

### Excel Actual (a reemplazar)
- 55 compras registradas (28 campos seguimiento)
- Google Sheets manual
- Cambios no autorizados frecuentes
- Certificados calidad NO gestionados (campo vacío)

### Caso Cartagena (Critical)
- 3 facturas sobrecobro concreto pasaron inadvertidas
- Se pagó de más 2 meses
- Proveedor mandó nota crédito por error propio
- **Feature R7** debe prevenir esto: alertas variación precios >10%

### Super Usuario
- **Liced Vega:** Encargada seguimiento (aparece en mayoría compras Excel)
- Usuario piloto sugerido para MVP

## Users & Roles (8-10)

- Gerencia (2-3): Dashboards ejecutivos, proyecciones
- Compras (3): Jefe + 2 auxiliares, Liced Vega = super usuario
- Contabilidad (1): Validación facturas, cierre
- Técnico (1): Consumo materiales por obra
- Almacén (1): Control inventario

## Critical Features (13)

| ID | Feature | Priority | Note |
|----|---------|----------|------|
| R1 | Agente IA Conversacional | P0 | "necesito gráfica combustible" → genera automático |
| R2 | Dashboard Ejecutivo | P0 | KPIs tiempo real, 4 roles |
| R3 | Seguimiento Compras | P0 | 7 etapas, alertas >30 días |
| R7 | Análisis Precios/Anomalías | P1 | PREVENIR CASO CARTAGENA |

Ver `prd.md` para lista completa (13 features).

## Development Commands

```bash
# Frontend
pnpm dev                 # http://localhost:3000
pnpm build
pnpm lint

# Backend (Python)
cd api
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload  # http://localhost:8000
```

## For Claude Code

**Critical Rules:**
- SICOM es read-only - NUNCA modificar datos
- Python backend es mandatorio (PO requirement)
- Seguir proceso Excel actual (28 campos) pero simplificado
- Certificados bloqueantes para cierre compras
- Google Workspace integración P0 (ya usan Gmail/Sheets)

**NO INVENTAR:**
- Stack validado con PO en meet 2025-12-22
- Ver `docs/meets/contecsa_meet_2025-12-22.txt` para contexto
- Ver `docs/analisis-control-compras.md` para flujo actual

**Decision Filter (ClaudeCode&OnlyMe):**
- 2 personas: Javier + Claude Code
- Deployment: Cliente self-host (NO SaaS)
- NO sugerir herramientas para equipos 5+

## Important Links

- PRD completo: `docs/prd-full.md`
- Meet PO: `docs/meets/contecsa_meet_2025-12-22.txt`
- Análisis Excel: `docs/analisis-control-compras.md`
- Company: `/neero/CLAUDE.md`
- Global: `docs-global/README.md`
