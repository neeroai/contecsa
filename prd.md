---
title: "Contecsa Data Intelligence System - Product Requirements"
summary: "Complete PRD for AI-powered data intelligence system replacing manual Excel purchasing. 60+ requirements across 12 modules including multi-tenant support, WhatsApp integration, SICOM ETL, and compliance features. For product, engineering, and business stakeholders."
description: "PRD for Contecsa system: requirements, use cases, modules, acceptance criteria"
date: "2025-12-22"
updated: "2026-01-15 14:30"
scope: "project"
owner: "Neero SAS"
---

## Resumen Ejecutivo

Sistema de Inteligencia de Datos impulsado por IA que **transforma completamente** la operación de compras de Contecsa, reemplazando el proceso manual en Excel (28 campos, 55 compras, 9 consorcios) con un agente conversacional + automatización E2E + dashboards en tiempo real.

**Diferenciador clave:** IA como protagonista, no como feature adicional. El usuario interactúa primero con la inteligencia (lenguaje natural), luego con formularios tradicionales.

**Impacto:** Prevenir pérdidas como el caso Cartagena (3 facturas con sobrecobro de concreto no detectadas durante 2 meses, proveedor corrigió por error propio).

---

## Contexto del Cliente

### Información de la Empresa
| Atributo | Valor |
|----------|-------|
| Razón Social | CONGLOMERADO TECNICO COLOMBIANO S.A.S. |
| NIT | 802.005.436-1 |
| Industria | Construcción / Obras Civiles / Infraestructura |
| Estructura | Empresa matriz + 9 consorcios/UT activos |
| Usuarios finales | 8-10 personas |

### Proyectos/Consorcios Activos (9)
1. PAVICONSTRUJC (41.8% de compras)
2. EDUBAR-KRA50 (14.5%)
3. PTAR-SANTO TOMAS (10.9%)
4. CONTECSA-ADMINISTRATIVO (9.1%)
5. PTAR-JUAN DE ACOSTA (7.3%)
6. PARQUES DE BOLIVAR (7.3%)
7. Otros: CORDOBA, HIDROGUJIRA, MOMPOX

### Sistema Actual
- **SICOM:** Sistema legacy años 70-80, versión 2 sin upgrade, "bodega de datos sin consultas ágiles"
- **Excel manual:** Google Sheets con 28 campos de seguimiento, 55 compras gestionadas 2024-2025
- **Proceso:** Correo electrónico + Excel + SICOM + carpetas dispersas

---

## Problema

### Dolores Críticos

**D1. Proceso Manual Intensivo**
- 28 campos a completar manualmente por cada compra
- Ciclo completo: 15-30 días (Requisición → Cierre)
- Ingreso manual de facturas "una por una" (sin OCR)
- Seguimiento centralizado en una persona (Liced Vega)

**D2. Falta de Inteligencia y Automatización**
- Cero alertas automáticas (compras vencidas, precios anómalos)
- Sin dashboards en tiempo real
- Consultas requieren exportar a Excel y manipular manualmente
- Sin proyecciones financieras automáticas

**D3. Documentación Incompleta**
- Certificados de calidad no gestionados (campo vacío en Excel)
- Fichas técnicas, garantías dispersas en carpetas
- Sin bloqueo si falta documentación obligatoria

**D4. Riesgos Financieros No Detectados**
- **Caso Cartagena (crítico):** 3 facturas con sobrecobro de concreto pasaron inadvertidas durante 2 meses, se pagó de más, proveedor emitió nota de crédito por error propio
- Sin validaciones automáticas de precios vs histórico
- Sin alertas de variaciones >10%

**D5. SICOM Obsoleto**
- Sistema años 70-80, interfaz pantalla negra
- "Bodega de datos" sin capacidad de consulta ágil
- Versión sin ruta de upgrade

**D6. Control de Cambios Deficiente**
- Cambios no autorizados en planillas Excel
- Sin historial confiable (depende de Google Sheets)
- "Basura entra, basura sale" (PO mencionó 3 veces)

---

## Solución

### Sistema de Inteligencia de Datos con IA Protagonista

**Enfoque:** IA no es una feature adicional, es el **corazón del sistema**. Usuario interactúa primero con agente conversacional, luego con formularios estructurados.

**Capacidades clave:**

1. **Agente IA Conversacional**
   - "Muéstrame compras PAVICONSTRUJC Q1 2025 con precios >10% vs histórico"
   - Genera dashboards on-demand
   - Ejecuta Python para análisis complejos
   - Exporta a Excel/Sheets

2. **Automatización E2E de Compras**
   - Seguimiento automático 7 etapas (Requisición → Aprobación → Orden → Confirmación → Recepción → Certificados → Pago)
   - Alertas inteligentes (compras >30 días, documentación faltante)
   - Notificaciones diarias personalizadas por rol

3. **OCR y Validación Inteligente**
   - "Le tomas la foto a la factura y la IA la procesa"
   - Validación automática vs orden de compra
   - Detección de anomalías (sobrecobros, precios fuera de rango)

4. **Dashboards en Tiempo Real**
   - KPIs por rol (Gerencia, Compras, Contabilidad, Técnico, Almacén, Admin)
   - Análisis histórico de precios
   - Proyecciones financieras con IA

5. **Gestión de Certificados Bloqueante**
   - Control obligatorio de certificados de calidad por categoría
   - Bloqueo de cierre si falta documentación
   - Almacenamiento centralizado

---

## Requerimientos Funcionales (20 Features)

### P0 - MUST HAVE (12 features)

| ID | Feature | Descripción |
|----|---------|-------------|
| **F01** | **Autenticación SSO Google + Roles** | SSO con Google Workspace, 6 roles (Gerencia, Compras, Contabilidad, Técnico, Almacén, Admin), permisos granulares |
| **F02** | **Agente IA Conversacional** | Gemini/DeepSeek, consultas lenguaje natural, genera gráficas, ejecuta análisis Python, exporta resultados |
| **F03** | **Dashboard Ejecutivo** | KPIs tiempo real por rol, gráficas interactivas, drill-down, exportación Excel |
| **F04** | **ETL Datos Históricos** | Migración única de 55 compras desde Excel + maestros (proyectos, proveedores), transformación a base de datos estructurada |
| **F05** | **Google Workspace Integration** | Gmail API (notificaciones), Google Sheets API (exportación), integración con correos corporativos |
| **F06** | **Seguimiento Compras 7 Etapas** | Requisición → Cotización → Orden → Confirmación → Recepción → Certificados → Pago, estados claros, bitácora de cambios |
| **F07** | **Requisiciones y Aprobaciones** | Creación de requisiciones, flujo de aprobación multi-nivel configurable, delegación, trazabilidad completa |
| **F08** | **Órdenes de Compra/Servicio** | Creación ODC (materiales) / ODS (servicios), control de versiones, confirmación con evidencia |
| **F09** | **Recepción y Entradas** | Registro recepción total/parcial, remisión/acta, campo ENTREGADO (SI/NO/PARCIAL) |
| **F20** | **Control de Calidad de Datos** | Validaciones al ingreso, reglas de coherencia (fechas, montos), historial de cambios completo (quién, cuándo, qué) |
| **F21** | **Cierre Mensual y Lock** | Cierre por período con bloqueo de edición, justificación compras abiertas, bitácora de excepciones |
| **F22** | **Audit Log Completo** | Registro inmutable de todos los eventos (creación, edición, cambios de estado, aprobaciones), exportable para auditoría |

### P1 - SHOULD HAVE (5 features)

| ID | Feature | Descripción |
|----|---------|-------------|
| **F11** | **Inbox Email Facturas** | Buzón facturas@contecsa.com, ingestión automática de PDFs adjuntos, detección de duplicados |
| **F12** | **OCR Facturas** | Extracción automática (proveedor, NIT, número, fecha, monto), UI verificación humana, precisión >95% |
| **F13** | **Validación Facturas** | Validación vs orden de compra, bloqueo si OC no confirmada, alertas si monto supera tolerancia, estados: Recibida → Extraída → Validada → Bloqueada → Aprobada → Pagada |
| **F19** | **Sistema de Notificaciones** | Resumen diario personalizado por rol, alertas configurables (compras >30 días, documentación faltante, anomalías precios), escalamiento automático |
| **F23** | **Multi-Proyecto y Consorcios** | Gestión de 9 consorcios/UT, % de participación, imputación y prorrateo en reportes, permisos por proyecto |

### P2 - NICE TO HAVE (3 features)

| ID | Feature | Descripción |
|----|---------|-------------|
| **F10** | **Control Inventario** | Integración con recepción, validación cantidad pedida vs recibida, stock y movimientos |
| **F14** | **Carga Masiva Facturas** | Importar Excel/CSV con múltiples facturas/datos, previsualización antes de aplicar, validación de errores |
| **F24** | **Gestión de Mantenimientos Maquinaria** | Programación preventivos, alertas vencimiento, control repuestos, historial mantenimientos |

---

## Stack Tecnológico

### Plataforma Unificada: Vercel

**Frontend**
- Next.js 15 (App Router)
- React 19
- TypeScript 5.6+
- Tailwind CSS 4
- shadcn/ui (componentes)

**Backend**
- Vercel Edge Functions (TypeScript principal)
- Python (cuando se requiera análisis complejo de datos)
- Vercel Serverless Functions

**IA**
- Vercel AI SDK 6.0
- @ai-sdk/react 3.0
- Vercel AI Gateway (proxy para Gemini/DeepSeek)
- Gemini (default) → DeepSeek (fallback)
- LangChain (orchestration)

**Base de Datos**
- Vercel Postgres (PostgreSQL 15+) - datos transaccionales
- Redis (Vercel KV) - caché

**Storage**
- Vercel Blob (certificados, facturas, adjuntos)

**Integraciones**
- Gmail API (notificaciones)
- Google Sheets API (exportación)
- Google Workspace SSO

**Deployment**
- Vercel (frontend + backend unificado)
- **Modelo:** Software entregado, cliente despliega en su cuenta Vercel
- Código fuente entregado a Contecsa

---

## Arquitectura de Solución

### Arquitectura de 3 Capas

```
┌─────────────────────────────────────────────────┐
│   CAPA 1: INTELIGENCIA (IA Protagonista)       │
├─────────────────────────────────────────────────┤
│  Agente Conversacional (Gemini/DeepSeek)       │
│  - Consultas lenguaje natural                   │
│  - Generación dashboards on-demand              │
│  - Análisis predictivo                          │
│  - Detección anomalías                          │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│   CAPA 2: APLICACIÓN (Next.js + Vercel)        │
├─────────────────────────────────────────────────┤
│  Frontend (Next.js 15 App Router)               │
│  - Dashboard por rol                            │
│  - Gestión compras E2E                          │
│  - Chat con IA                                  │
│  - Gestión certificados                         │
│                                                 │
│  Backend (Edge Functions + Python)              │
│  - API Routes                                   │
│  - OCR facturas                                 │
│  - Validaciones de negocio                      │
│  - Notificaciones                               │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│   CAPA 3: DATOS (Vercel Postgres + Blob)       │
├─────────────────────────────────────────────────┤
│  Vercel Postgres                                │
│  - Compras, órdenes, facturas                   │
│  - Proyectos, proveedores, usuarios             │
│  - Audit log, historial cambios                 │
│                                                 │
│  Vercel Blob                                    │
│  - Certificados de calidad                      │
│  - Facturas (PDFs)                              │
│  - Evidencias, adjuntos                         │
│                                                 │
│  Redis (Vercel KV)                              │
│  - Caché consultas IA                           │
│  - Sesiones                                     │
└─────────────────────────────────────────────────┘
```

### Flujo de Datos

**Migración Inicial (una vez):**
```
Excel (55 compras) → Script ETL → Vercel Postgres
SICOM histórico → Migración manual opcional
```

**Operación Nueva (sistema independiente):**
```
Usuario → Agente IA → Vercel Postgres
Usuario → Formulario Compras → Vercel Postgres
Proveedor → Email factura → Inbox → OCR → Validación → Vercel Postgres
```

**Nota crítica:** NO hay integración continua con SICOM. Sistema nuevo es **source of truth** completo. SICOM se retira progresivamente.

---

## Usuarios y Roles (6)

| Rol | Cantidad | Permisos | Funcionalidades Clave |
|-----|----------|----------|----------------------|
| **Gerencia** | 2-3 | Solo lectura, dashboards ejecutivos | Dashboard ejecutivo, proyecciones financieras, análisis de precios, consultas IA |
| **Compras** | 3 | Crear/editar compras, gestión completa | Requisiciones, órdenes, seguimiento, cierre, gestión proveedores. **Liced Vega = super usuario** |
| **Contabilidad** | 1 | Validación facturas, aprobación pagos | Validación facturas vs OC, aprobación pagos, cierre contable, consultas financieras |
| **Técnico/Residente** | 1 | Crear requisiciones, validar recepción | Solicitar requisiciones, validar recepción técnica, consumo por obra |
| **Almacén** | 1 | Registrar entradas, recepción física | Registrar entradas (No. ENTRADA), recepción física, control inventario |
| **Admin/Sistema** | 1 | Configuración total, todos los permisos | Gestión usuarios, roles, catálogos, configuración sistema, permisos |

---

## Modelo de Datos (Simplificado)

### Entidades Principales

**Maestros:**
- `Proyecto` (9 consorcios)
- `Proveedor` (38 proveedores únicos)
- `Usuario` (8-10 usuarios)
- `Rol` (6 roles)
- `Material` (catálogo)

**Transacciones:**
- `Requisicion` (RQ)
- `Aprobacion` (eventos de aprobación)
- `Orden` (ODC/ODS)
- `Confirmacion` (confirmación proveedor)
- `Recepcion` (entrada física)
- `Factura` (factura proveedor)
- `Pago` (pago a proveedor)
- `CierrePeriodo` (cierre mensual)

**Documentación:**
- `Documento` (certificados, fichas técnicas, garantías)
- `Anexo` (adjuntos generales)

**Auditoría:**
- `AuditLog` (registro inmutable de cambios)
- `Excepcion` (excepciones a cierres/locks)

### Relaciones Clave

```
Requisicion 1→N Orden
Orden 1→N Recepcion
Orden N→N Factura (una factura puede cubrir múltiples órdenes)
Factura 1→1 Pago
Orden 1→N Documento (certificados por compra)
```

---

## Flujo de Trabajo E2E (7 Etapas)

Basado en el Excel actual de 28 campos, simplificado a 7 etapas claras:

```
1. REQUISICIÓN
   - Usuario (Técnico/Compras) crea requisición
   - Define: proyecto, material/servicio, prioridad
   - Adjunta cotizaciones previas si existen
   ↓
2. APROBACIÓN
   - Flujo multi-nivel según monto/categoría
   - Notificación automática a aprobadores
   - Trazabilidad de rechazos/aprobaciones
   ↓
3. ORDEN
   - Compras crea ODC (materiales) u ODS (servicios)
   - Selecciona proveedor, define condiciones de pago
   - Genera documento de orden
   ↓
4. CONFIRMACIÓN
   - Proveedor confirma orden (evidencia)
   - Sin confirmación → factura bloqueada
   ↓
5. RECEPCIÓN
   - Almacén registra recepción física
   - Estados: Total / Parcial / Pendiente
   - Genera No. ENTRADA
   ↓
6. CERTIFICADOS
   - Validación de documentación obligatoria:
     * Certificado de calidad (según categoría)
     * Ficha técnica
     * Garantía (si aplica)
   - Bloqueo si falta documentación
   ↓
7. PAGO Y CIERRE
   - Contabilidad valida factura vs OC/recepción
   - Aprueba pago
   - Sistema cierra compra
   - Estado: CERRADO
```

---

## Casos de Uso Críticos

### CU1: Detección Automática de Sobrecobro (Prevenir caso Cartagena)

**Actor:** Sistema (automático)
**Objetivo:** Detectar factura con precio >10% vs histórico/orden de compra

**Flujo:**
1. Proveedor envía factura a facturas@contecsa.com
2. OCR extrae datos: proveedor, producto (Concreto M42), cantidad, precio unitario
3. Sistema busca orden de compra asociada
4. **IA compara precio factura vs:**
   - Precio en orden de compra
   - Histórico de precios del mismo producto
   - Precios promedio del proveedor
5. **Detecta anomalía:** Precio factura $X vs Orden $Y (diferencia +15%)
6. **Alerta URGENTE** a Jefe de Compras + Gerencia
7. Email: "⚠️ ALERTA: Posible sobrecobro - Factura #123 - Diferencia: $Z (+15%)"
8. Factura bloqueada para pago hasta revisión
9. Compras revisa y rechaza/acepta según justificación

**Resultado:** Sobrecobros detectados en minutos (vs semanas/meses en Excel manual)

### CU2: Consulta Conversacional - Gerencia

**Actor:** Gerente General
**Objetivo:** Análisis rápido sin exportar Excel

**Flujo:**
1. Gerente abre chat con IA
2. Escribe: "Muéstrame compras PAVICONSTRUJC de Q1 2025 con precios de concreto >10% vs 2024"
3. Agente IA:
   - Interpreta consulta
   - Consulta base de datos
   - Ejecuta análisis en Python
   - Genera gráfica comparativa
4. Responde en 5 segundos:
   - "Encontré 8 compras de concreto en PAVICONSTRUJC Q1 2025"
   - "Precio promedio 2025: $X (+12% vs 2024)"
   - "Proveedor con mayor incremento: ABC (+18%)"
   - Gráfica de líneas (precio vs tiempo)
5. Gerente hace follow-up: "Exporta esto a Google Sheets"
6. IA genera archivo y comparte link

**Resultado:** Información en 10 segundos vs 2 horas de trabajo manual en Excel

### CU3: Bloqueo por Certificado Faltante

**Actor:** Auxiliar Compras (Liced Vega)
**Objetivo:** Cerrar compra de concreto

**Flujo:**
1. Liced intenta marcar compra #42 como CERRADO
2. Sistema valida checklist de cierre:
   - ✅ Orden creada
   - ✅ Orden confirmada
   - ✅ Material recibido (No. ENTRADA registrado)
   - ✅ Factura validada
   - ❌ **Certificado de calidad: FALTANTE**
3. **Sistema bloquea cierre:**
   - "⚠️ No se puede cerrar: Falta certificado de calidad (obligatorio para categoría CONCRETO)"
4. Liced solicita certificado a proveedor
5. Proveedor envía PDF por correo
6. Liced adjunta certificado en sistema
7. Sistema valida que documento es PDF/imagen
8. ✅ Ahora permite cierre

**Resultado:** 100% de compras cerradas con documentación completa (vs 35% actual en Excel)

---

## Métricas de Éxito

### Operativas
- **Reducción 70% tiempo generación reportes** (de 2h a 20min)
- **Reducción 90% ingreso manual facturas** (OCR automático)
- **100% compras con seguimiento automatizado** (vs Excel manual)
- **Reducción 50% tiempo ciclo compras** (de 15-30 días a 10-15 días)

### Financieras
- **Detección automática 100% anomalías precios >10%** (prevenir caso Cartagena)
- **0 sobrecobros no detectados** (alerta en tiempo real)
- **Ahorro estimado 5-10% en costos de compras** (mejores controles)

### Calidad
- **Precisión >95% en OCR facturas**
- **Reducción 80% errores de digitación**
- **100% compras cerradas con certificados** (vs 35% actual)
- **100% datos críticos con audit log**

### Adopción
- **80% usuarios activos diarios** (post-capacitación)
- **NPS >70** (satisfacción usuarios)
- **<2 horas capacitación por usuario**

---

## Riesgos y Mitigaciones

### R1: Migración de Datos desde Excel/SICOM
**Probabilidad:** Media | **Impacto:** Alto

**Riesgo:** Datos históricos incompletos o inconsistentes ("basura entra, basura sale")

**Mitigación:**
- Script ETL robusto con limpieza de datos
- Validación manual de datos críticos pre-migración
- Migración progresiva (no "big bang")
- Permitir convivencia Excel + Sistema (primeras semanas)

### R2: Resistencia al Cambio
**Probabilidad:** Media | **Impacto:** Alto

**Riesgo:** Usuarios acostumbrados a Excel rechazan sistema nuevo

**Mitigación:**
- Involucrar a Liced Vega (super usuario) desde diseño
- UI familiar (similar a Excel en estructura visual)
- Exportación a Excel siempre disponible
- Capacitación personalizada por rol (2h por usuario)
- Quick wins visibles (alertas automáticas desde día 1)

### R3: Dependencia de APIs IA (Gemini/DeepSeek)
**Probabilidad:** Baja | **Impacto:** Medio

**Riesgo:** API caída o costos escalables

**Mitigación:**
- AI Gateway con fallback automático (Gemini → DeepSeek)
- Caché agresivo de consultas frecuentes (Redis)
- Límites de uso por usuario/día
- Sistema funciona SIN IA (formularios tradicionales siempre disponibles)

### R4: Multi-Proyecto/Consorcios (9 entidades)
**Probabilidad:** Media | **Impacto:** Medio

**Riesgo:** Complejidad de permisos y prorrateo por consorcio

**Mitigación:**
- Feature P1 (no MVP), tiempo para diseño robusto
- Validación con usuarios de múltiples consorcios
- Permisos granulares por proyecto desde MVP
- Documentación clara de modelo de consorcios

### R5: Calidad de Datos (basura entra, basura sale)
**Probabilidad:** Alta | **Impacto:** Alto

**Riesgo:** Usuarios ingresan datos mal desde inicio

**Mitigación:**
- Validaciones estrictas al ingreso (F20)
- Catálogos cerrados (proveedores, proyectos, materiales)
- Reglas de coherencia (fechas, montos)
- Audit log completo (reversión de cambios)
- Alertas de datos inconsistentes

---

## Supuestos

1. ✅ Contecsa tiene cuenta Google Workspace activa
2. ✅ Usuarios tienen acceso a internet estable en oficinas
3. ✅ Personal clave disponible para capacitación (2-3 semanas)
4. ✅ Presupuesto aprobado para cuenta Vercel + APIs IA
5. ✅ No hay restricciones legales para usar IA en análisis de datos
6. ✅ Liced Vega (super usuario) participa activamente en diseño/pruebas
7. ✅ Datos históricos Excel (55 compras) están disponibles y accesibles
8. ✅ Cliente acepta convivencia Excel + Sistema nuevo (primeras semanas)

---

## Modelo de Negocio

### Opción Acordada: Software Entregado (No SaaS)

**Qué se entrega:**
- Código fuente completo (repositorio GitHub/GitLab)
- Documentación técnica y de usuario
- Scripts de migración de datos
- Configuración Vercel (archivos `vercel.json`, variables de entorno)

**Responsabilidades del cliente (Contecsa):**
- Crear cuenta Vercel (team plan)
- Desplegar aplicación en su cuenta Vercel
- Contratar servicios necesarios:
  - Vercel Postgres
  - Vercel Blob
  - APIs IA (Gemini/DeepSeek)
- Gestionar usuarios y roles
- Backups y mantenimiento

**Responsabilidades de Neero (opcionales):**
- Soporte técnico (paquete mensual)
- Actualizaciones del sistema (nuevas features)
- Capacitación adicional
- Consultoría para optimizaciones

**Modelo de ingresos Neero:**
- Venta de software (one-time)
- Soporte mensual (recurrente, opcional)
- Horas de consultoría (bajo demanda)

---

## Próximos Pasos

1. ⏳ **Validación del PRD** con Gerencia/PO de Contecsa
2. ⏳ **Sesión de diseño UX** con Liced Vega (super usuario)
3. ⏳ **Análisis técnico datos Excel** (validar calidad de 55 compras)
4. ⏳ **Propuesta comercial** basada en este PRD
5. ⏳ **Kickoff de desarrollo** (si aprobado)

---

## Referencias

- **Excel actual:** `/compras.html` (visualización interactiva) + análisis detallado en `/docs/analisis-control-compras.md`
- **PRD original completo:** `/prd-full.md` (26KB, contexto extendido)
- **Reunión PO:** `/docs/meets/contecsa_meet_2025-12-22.txt`
- **Proceso E2E:** `/docs/Proceso Compras Infraestructura Colombia E2E.md`

---

**Documento consolidado por:** Neero SAS + Javier Polo (CEO)
**Basado en:** 3 PRDs previos + Excel de 55 compras + Decisiones PO
**Próxima revisión:** Post-validación con Contecsa
