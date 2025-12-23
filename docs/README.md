# Contecsa Documentation

Version: 1.0 | Date: 2025-12-23 01:30 | Type: Index | Status: Active

---

## Overview

Documentación completa del Sistema de Inteligencia de Datos para Contecsa. Incluye arquitectura, stack técnico, contexto de negocio, especificaciones de features (R1-R13), guías de integración y desarrollo.

**Audiencia:** Desarrolladores, arquitectos, product owners, equipo técnico Neero

---

## Quick Start

**For Developers:**
1. Start here: [Development Guide](development-guide.md)
2. Understand the system: [Architecture Overview](architecture-overview.md)
3. Review API: [API Documentation](api-documentation.md)

**For Product/Business:**
1. Start here: [Business Context](business-context.md)
2. Understand users: [User Roles & Workflows](user-roles-workflows.md)
3. Review features: [Features Directory](features/)

**For Architects:**
1. Start here: [Architecture Overview](architecture-overview.md)
2. Review stack: [Tech Stack Detailed](tech-stack-detailed.md)
3. Review integrations: [Integrations Directory](integrations/)

---

## Core Documentation

### Architecture & Technical Design

| Document | Description | Audience |
|----------|-------------|----------|
| [Architecture Overview](architecture-overview.md) | System architecture, component relationships, data flows, deployment model | Architects, Senior Developers |
| [Tech Stack Detailed](tech-stack-detailed.md) | Complete tech stack with rationale, decision matrices, rejected alternatives | Architects, Tech Leads |

### Business & Users

| Document | Description | Audience |
|----------|-------------|----------|
| [Business Context](business-context.md) | Caso Cartagena, 9 consorcios, SICOM constraints, current Excel process, pain points | Product Owners, Stakeholders |
| [User Roles & Workflows](user-roles-workflows.md) | 6 roles, permissions matrix, workflows, super user capabilities | Product Owners, UX Designers |

### Development & API

| Document | Description | Audience |
|----------|-------------|----------|
| [Development Guide](development-guide.md) | Setup (frontend + Python backend), Git workflow, testing, debugging, code style | All Developers |
| [API Documentation](api-documentation.md) | RESTful API endpoints, request/response schemas, authentication, error handling | Backend Developers, API Consumers |

---

## Features Documentation (R1-R13)

### Priority P0 (MVP - Must Have)

| ID | Feature | Document | Status |
|----|---------|----------|--------|
| R1 | Conversational AI Agent | [r01-agente-ia.md](features/r01-agente-ia.md) | Planned |
| R2 | Executive Dashboards | [r02-dashboard.md](features/r02-dashboard.md) | Planned |
| R3 | Purchase Tracking (7-stage) | [r03-seguimiento-compras.md](features/r03-seguimiento-compras.md) | Planned |
| R6 | SICOM ETL (Read-Only) | [r06-etl-sicom.md](features/r06-etl-sicom.md) | Planned |
| R5 | Email Notifications | [r05-notificaciones.md](features/r05-notificaciones.md) | Planned |
| R11 | Google Workspace | [r11-google-workspace.md](features/r11-google-workspace.md) | Planned |

### Priority P1 (High Priority)

| ID | Feature | Document | Status |
|----|---------|----------|--------|
| R4 | Invoice OCR | [r04-ocr-facturas.md](features/r04-ocr-facturas.md) | Planned |
| R7 | Price Anomaly Detection | [r07-analisis-precios.md](features/r07-analisis-precios.md) | Planned |
| R8 | Quality Certificates | [r08-certificados.md](features/r08-certificados.md) | Planned |

**R7 Note:** CRITICAL feature to prevent Caso Cartagena (overcharging incident). Deep dive documentation included.

### Priority P2 (Future)

| ID | Feature | Document | Status |
|----|---------|----------|--------|
| R9 | Inventory Control | [r09-control-inventario.md](features/r09-control-inventario.md) | Planned |
| R10 | Financial Projection | [r10-proyeccion-financiera.md](features/r10-proyeccion-financiera.md) | Planned |
| R12 | Email Invoice Intake | [r12-facturas-email.md](features/r12-facturas-email.md) | Planned |
| R13 | Equipment Maintenance | [r13-mantenimiento-maq.md](features/r13-mantenimiento-maq.md) | Planned |

---

## Integration Guides

| Integration | Document | Description |
|-------------|----------|-------------|
| SICOM ETL | [sicom-etl.md](integrations/sicom-etl.md) | Read-only ETL from legacy SICOM (1970s), 3D matrices transformation |
| Google Workspace | [google-workspace.md](integrations/google-workspace.md) | Gmail API, Sheets API, OAuth 2.0 SSO |
| AI Gateway | [ai-gateway.md](integrations/ai-gateway.md) | Vercel AI Gateway, Gemini → DeepSeek fallback, caching |
| File Storage | [storage.md](integrations/storage.md) | Vercel Blob / GCS / S3 options comparison |

---

## Project Files (Tracking)

Located in `/.claude/`:

| File | Purpose | Format | Max Lines |
|------|---------|--------|-----------|
| CLAUDE.md | Project-specific instructions | Markdown | No limit |
| plan.md | Architecture, stack, current phase | Markdown | 50 |
| todo.md | Task tracking (TODO/DOING/DONE) | Markdown | 50 |
| prd.md | Requirements, features | Markdown | 100 |
| claude-progress.md | Session handoff notes | Markdown | Rolling |

---

## Additional Resources

### Research & Meetings

| Document | Description |
|----------|-------------|
| docs/prd-full.md | Full PRD (26 KB) with detailed requirements |
| docs/meets/contecsa_meet_2025-12-22.txt | PO meeting transcript (SICOM context, decisions) |
| docs/analisis-control-compras.md | Excel analysis (28 fields, 55 purchases) |
| docs/research/ | Business context, E2E process (56 KB consolidated into business-context.md) |

### Deployment

| Document | Description |
|----------|-------------|
| docs/deploy-checklist.md | Vercel AI Gateway setup checklist |

---

## Documentation Standards

All documentation follows Neero standards:

- **Metadata:** All .md files have `Version: X.Y | Date: YYYY-MM-DD HH:MM`
- **Format:** Token-efficient (Tables > YAML > Lists)
- **Max Line Length:** 100 characters
- **No Emojis:** Professional technical documentation
- **NO INVENTAR:** Only document verified information from existing docs/code

---

## Navigation Tips

**By Role:**
- **Developers:** Start with [Development Guide](development-guide.md)
- **Architects:** Start with [Architecture Overview](architecture-overview.md)
- **Product Owners:** Start with [Business Context](business-context.md)
- **API Consumers:** Start with [API Documentation](api-documentation.md)

**By Feature:**
- All features: Browse [Features Directory](features/)
- Critical feature (Caso Cartagena): [R7 - Price Anomaly Detection](features/r07-analisis-precios.md)

**By Integration:**
- All integrations: Browse [Integrations Directory](integrations/)
- SICOM (Legacy): [SICOM ETL Guide](integrations/sicom-etl.md)

---

## Contributing

When updating documentation:

1. **Add metadata** to all new .md files
2. **Update date** in metadata on every edit
3. **Follow token-efficient format** (tables preferred)
4. **Verify information** against code/PRD (NO INVENTAR)
5. **Update this index** if adding new docs

---

## Quick Links

- Project Root: [../README.md](../README.md)
- PRD Full: [prd-full.md](prd-full.md)
- CLAUDE.md: [../.claude/CLAUDE.md](../.claude/CLAUDE.md)
- Package.json: [../package.json](../package.json)

---

**Total Documentation:** 25 files (23 created, 2 updated)
**Completion:** 100% (all phases complete)
**Last Updated:** 2025-12-23 01:30
