# Contecsa - Sistema de Inteligencia de Datos

Version: 1.1 | Date: 2025-12-22 21:45 | Owner: Neero SAS | Status: Setup

---

## Resumen

Sistema IA que reemplaza proceso manual de compras en Excel (28 campos, 55 compras) mediante **agente conversacional + dashboard + automatización**, conectando read-only a SICOM legacy (años 70-80) para prevenir pérdidas como caso Cartagena (sobrecobro concreto no detectado 2 meses).

**Cliente:** Contecsa (construcción/obras civiles) + 9 consorcios activos
**Usuarios:** 8-10 (Gerencia, Compras, Contabilidad, Técnico, Almacén)
**Modelo:** Software entregable (NO SaaS), cliente self-host en su nube (GCP/AWS)

---

## Problema

- **SICOM obsoleto:** Sistema años 70-80, versión 2 sin upgrade, "bodega de datos sin consultas ágiles"
- **Proceso manual:** 28 campos en Google Sheets, ingreso facturas uno por uno, sin alertas automáticas
- **Caso Cartagena:** 3 facturas sobrecobro pasaron inadvertidas, se pagó de más por 2 meses
- **Certificados débiles:** Documentación técnica no se gestiona (campos vacíos en Excel)
- **Sin detección anomalías:** Cambios de precios no se monitorean automáticamente

---

## Solución

### Core Features (P0)

1. **Agente IA Conversacional (R1):** Consultas lenguaje natural → ejecuta Python → genera gráficas
2. **Dashboard Ejecutivo (R2):** KPIs tiempo real por rol (Gerencia, Compras, Contabilidad, Técnico)
3. **ETL SICOM (R6):** Read-only, transforma a datos no estructurados (matrices 3D Python)
4. **Automatización Compras (R3):** Flujo 7 etapas, alertas >30 días abierta
5. **Notificaciones (R5):** Email diario Gmail, resumen compras abiertas (1 email consolidado)
6. **Google Workspace (R11):** Integración Gmail + Sheets (ya usan Google)

### High Priority (P1)

7. **OCR Facturas (R4):** "Le tomas la foto y la IA la procesa"
8. **Análisis Precios (R7):** Prevenir caso Cartagena, alertas variación >10%
9. **Certificados (R8):** Bloqueante para cierre compras, GCS/S3

### Future (P2)

10. Control Inventario (R9), Proyección Financiera (R10), Facturas Email (R12), Mantenimiento Maquinaria (R13)

---

## Stack Técnico

**Frontend:** Next.js 15+ + React 19+ + TypeScript 5.6+ + Tailwind CSS 4.0+
**Backend:** Python 3.11+ + FastAPI (PO requirement)
**Database:** PostgreSQL (warehouse) + Redis (caché) + SICOM read-only
**AI:** Vercel AI SDK 6.0 + AI Gateway (Gemini 2.0 Flash → DeepSeek fallback) + LangChain
**Storage:** Google Cloud Storage o AWS S3
**Deploy:** Frontend Vercel, Backend cliente (GCP/AWS)
**Package Manager:** bun 1.3.5

**Validación:** Stack validado contra docs-global/stack/, ClaudeCode&OnlyMe filter aplicado (2-person team)

---

## Arquitectura

```
Frontend (Next.js) ←→ API (FastAPI) ←→ PostgreSQL (warehouse)
                           ↓
                   ETL Python (read-only)
                           ↓
                     SICOM (legacy)
```

**Monorepo:** /src (Next.js) + /api (Python backend)

---

## Configuración

**Configuración completada:**

```bash
# 1. Install dependencies
bun install

# 2. Configure environment variables
cp .env.example .env.local
# Edit .env.local with:
# - AI_GATEWAY_API_KEY (from Vercel Dashboard → AI Gateway)
# - SICOM credentials (when ready)
# - Google Workspace API keys (when ready)

# 3. Run development server
bun run dev              # http://localhost:3000

# 4. Build
bun run build

# 5. Lint
bun run lint

# 6. Test AI Gateway (smoke test)
curl http://localhost:3000/api/ai/test
```

**Deploy a Vercel:**
Ver guía completa en `docs/deploy-checklist.md`

---

## Fases

| Fase | Duración | Features | Status |
|------|----------|----------|--------|
| 1. Setup | 1 semana | Baseline config + tracking + AI SDK v6 migration | Completed ✅ |
| 2. MVP | 4-6 semanas | Agente IA + Dashboard + ETL + Notificaciones | Next |
| 3. Automatización | 4 semanas | Seguimiento compras + Google Workspace + Análisis precios | Pending |
| 4. OCR + Avanzado | 8 semanas | OCR facturas + Certificados + Proyecciones + Mantenimiento | Pending |

---

## Documentación

- **PRD Completo:** `/docs/prd-full.md` (26KB, análisis detallado)
- **PRD Condensado:** `/prd.md` (91 lines, resumen ejecutivo)
- **Plan:** `/plan.md` (arquitectura, stack, fases)
- **Features:** `/feature_list.json` (13 features, 45 steps, Anthropic format)
- **Deploy Checklist:** `/docs/deploy-checklist.md` (Vercel + AI Gateway setup)
- **Meeting PO:** `/docs/meets/contecsa_meet_2025-12-22.txt` (transcripción)
- **Análisis Excel:** `/docs/analisis-control-compras.md` (28 campos, 55 compras)

---

## Contacto

**Desarrollado por:** Neero SAS
**CEO:** Javier Polo
**Cliente:** Contecsa (construcción/obras civiles)
