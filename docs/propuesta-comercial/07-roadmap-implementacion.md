# Roadmap de Implementación

Version: 1.0 | Date: 2025-12-22 23:55 | Owner: Neero SAS | Status: Propuesta Comercial

[Confidencial - Solo uso interno Contecsa S.A.S.]

---

## Visión General

**Duración total Fase 1:** 12 semanas (3 meses)
**Modalidad:** Desarrollo iterativo con demos semanales
**Metodología:** Agile adaptado (sprints 2 semanas, entregables tangibles)
**Equipo Neero:** 4-5 personas dedicadas (2 developers, 1 AI specialist, 1 QA, 1 PM)
**Equipo Contecsa requerido:** Liced Vega (piloto), 1 IT (acceso SICOM), 1 Gerencia (aprobaciones)

---

## Filosofía de Implementación

### Principios Clave

1. **MVP-First:** Lanzar funcionalidad crítica primero (Prevención Caso Cartagena),
   no esperar producto "perfecto"
2. **Validación continua:** Demos cada 2 semanas con usuarios reales para ajustes tempranos
3. **Sin modificar SICOM:** Integración read-only, cero riesgo sistema legacy
4. **Capacitación integrada:** Usuarios aprenden mientras se desarrolla, no al final
5. **Exit points:** Milestones con criterios go/no-go claros (protección inversión)

---

## Roadmap Detallado

### SEMANA 0: Pre-Kick-Off (Antes de Firma Contrato)

**Objetivo:** Alineación expectativas y preparación logística

| Actividad | Responsable | Entregable |
|-----------|-------------|------------|
| Reunión presentación propuesta | Neero CEO + PM | Aprobación comercial |
| Definición alcance final | Ambos equipos | SOW firmado (Statement of Work) |
| Asignación equipo Contecsa | Contecsa Gerencia | Nombres y roles |
| Preparación accesos técnicos | Contecsa IT | Credenciales SICOM (read-only) |

**Duration:** 5-7 días hábiles

---

### FASE 1A: PREVENCIÓN CASO CARTAGENA (Semanas 1-6)

**Objetivo:** Detectar automáticamente sobrecobros en <1 minuto

#### Semana 1-2: Discovery y Arquitectura

**Sprint 1**

| Día | Actividad | Responsable | Output |
|-----|-----------|-------------|--------|
| 1 | Kick-off meeting presencial | Ambos equipos | Plan de trabajo firmado |
| 1-2 | Acceso SICOM read-only (setup técnico) | Contecsa IT + Neero Dev | Conexión verificada |
| 2-3 | Extracción histórico precios (5 años) | Neero AI Specialist | Base datos histórica |
| 3-4 | Identificación usuarios piloto | Liced + Gerencia | 3 usuarios seleccionados |
| 4-5 | Análisis datos Excel actual (28 campos) | Neero PM + Liced | Mapa campos sistema |
| 8-10 | Wireframes dashboards básicos | Neero UX + Liced | Mockups aprobados |

**Entregable semana 2:** Documento arquitectura técnica + Plan detallado semanas 3-6

---

#### Semana 3-4: Desarrollo Core Detección

**Sprint 2**

| Actividad | Días | Output |
|-----------|------|--------|
| Desarrollo base datos PostgreSQL | 2 | Schema creado |
| Integración ETL SICOM → PostgreSQL | 3 | Sync automática nocturna |
| Algoritmo detección anomalías precios (4 métodos) | 3 | Sistema detecta variaciones >10% |
| Interface email alertas (Gmail API) | 2 | Templates profesionales |
| Testing interno Neero | 2 | 50 casos prueba |

**Entregable semana 4:** Sistema funcional en ambiente desarrollo Neero

---

#### Semana 5: Desarrollo Dashboards Básicos

**Sprint 3**

| Componente | Días | Descripción |
|------------|------|-------------|
| Dashboard Gerencia (básico) | 2 | KPIs: Total gastado, Top proveedores, Alertas |
| Dashboard Compras (básico) | 2 | Estado 55 compras, Alertas >30 días |
| Seguimiento 7 etapas (visual) | 2 | State machine con colores |
| Alertas email diarias (consolidado) | 1 | 1 email resumen/día por usuario |
| Testing QA | 3 | Casos reales Excel Contecsa |

**Entregable semana 5:** Dashboards operativos + Alertas funcionando

---

#### Semana 6: UAT Fase 1A + Demo Milestone 1

**User Acceptance Testing**

| Día | Actividad | Participantes | Criterio Éxito |
|-----|-----------|---------------|----------------|
| 1-2 | Deploy ambiente UAT (cloud cliente) | Neero DevOps + IT | Sistema accesible URL |
| 2-3 | Migración datos históricos reales | Neero + Liced | 5 años precios SICOM |
| 3-4 | Simulación Caso Cartagena | Liced + Jefe Compras | Sistema detecta en <1 min |
| 4 | Validación alertas email | 3 usuarios piloto | Emails recibidos correctamente |
| 5 | **MILESTONE 1: Demo formal** | Gerencia + stakeholders | Aprobación go/no-go |

**Criterios aprobación Milestone 1:**

1. ✓ Sistema detecta variación precio >10% en <1 minuto
2. ✓ Email alerta llega a Jefe Compras + Gerencia automáticamente
3. ✓ Dashboards muestran datos reales Contecsa
4. ✓ Integración SICOM funciona (sync nocturna sin errores)
5. ✓ Cero modificaciones a SICOM (validado por IT)

**Si NO aprueba:** Plan de remediación sin costo, 1 semana adicional para ajustes

**Si aprueba:** Pago Milestone 2 ($27M), continuar Fase 1B

---

### FASE 1B: INTELIGENCIA IA COMPLETA (Semanas 7-10)

**Objetivo:** Agente conversacional + Dashboards completos 6 roles

#### Semana 7-8: Desarrollo Agente IA

**Sprint 4**

| Componente | Días | Descripción |
|------------|------|-------------|
| Integración Gemini 2.0 Flash | 2 | API configurada, Vercel AI Gateway |
| Training modelo con datos Contecsa | 3 | Histórico SICOM + Excel, contexto construcción |
| Interface chat (frontend) | 2 | Diseño conversacional mobile-first |
| Generación gráficas automáticas | 2 | Barras, líneas, pastel (Recharts) |
| Fallback DeepSeek (si Gemini falla) | 1 | Alta disponibilidad |

**Casos de uso prioritarios:**
- "¿Cuánto gastamos en combustible Q1 2025?"
- "Compara PAVICONSTRUJC vs EDUBAR este mes"
- "Muestra proveedores mejor precio concreto"

**Entregable semana 8:** Agente IA respondiendo consultas lenguaje natural

---

#### Semana 9: Dashboards Completos (6 Roles)

**Sprint 5**

| Dashboard | Días | Funcionalidades Clave |
|-----------|------|----------------------|
| Gerencia (completo) | 1 | KPIs, proyecciones, comparativas consorcios |
| Jefe Compras | 1 | 55 compras vista única, rendimiento proveedores |
| Auxiliar Compras | 1 | Tareas personales, alertas diarias |
| Contabilidad | 1 | Facturas pendientes, presupuesto vs ejecutado |
| Técnico/Obra | 1 | Consumo materiales, certificados calidad |
| Almacén | 0.5 | Entregas programadas, confirmaciones pendientes |
| Permisos por rol | 0.5 | Control acceso granular |

**Entregable semana 9:** 6 dashboards especializados operativos

---

#### Semana 10: UAT Fase 1B + Demo Milestone 2

**User Acceptance Testing**

| Día | Actividad | Participantes | Criterio Éxito |
|-----|-----------|---------------|----------------|
| 1-2 | Testing agente IA (50 preguntas reales) | Liced + Gerencia | Respuestas correctas >90% |
| 2-3 | Validación dashboards 6 roles | 1 usuario por rol | Datos relevantes, navegación intuitiva |
| 3-4 | ETL SICOM completo (no solo precios) | Neero + IT | Todas las tablas clave sincronizadas |
| 4 | Training usuarios (4 horas) | 6 usuarios piloto | Certificado aprobación |
| 5 | **MILESTONE 2: Demo formal** | Gerencia + stakeholders | Aprobación go/no-go |

**Criterios aprobación Milestone 2:**

1. ✓ Agente IA responde consultas lenguaje natural en <10 segundos
2. ✓ Gráficas generadas automáticamente son correctas (validadas vs Excel)
3. ✓ 6 dashboards operativos, cada rol ve solo su información
4. ✓ Usuarios piloto aprueban usabilidad (>8/10 satisfacción)
5. ✓ ETL SICOM sincroniza todas las noches sin intervención manual

**Si aprueba:** Pago Milestone 3 ($27M), continuar Fase 1C

---

### FASE 1C: AUTOMATIZACIÓN AVANZADA (Semanas 11-12)

**Objetivo:** OCR facturas + Certificados + Google Workspace + Go-Live

#### Semana 11: Desarrollo Final

**Sprint 6**

| Componente | Días | Descripción |
|------------|------|-------------|
| OCR facturas (Google Vision API) | 2 | Lectura automática PDF facturas |
| Gestión certificados (blocking gates) | 2 | No se puede cerrar compra sin certificado |
| Google Workspace OAuth SSO | 1 | Login con @contecsa.com |
| Notificaciones Gmail (templates) | 1 | Emails corporativos profesionales |
| Export Google Sheets (reportes) | 1 | 1 clic → Sheet compartida |
| Testing integrado completo | 3 | E2E flows 7 etapas compra |

**Entregable semana 11:** Sistema completo con todas las features Fase 1

---

#### Semana 12: UAT Final + Go-Live Producción

**Preparación Go-Live**

| Día | Actividad | Responsable | Output |
|-----|-----------|-------------|--------|
| 1 | Migración data completa (Excel → Sistema) | Neero + Liced | 55 compras activas migradas |
| 1-2 | Testing final 8-10 usuarios | Todo el equipo Contecsa | Bugs críticos: 0 |
| 2-3 | Capacitación formal (20 horas) | Neero PM | Certificado usuarios |
| 3 | Preparación documentación usuario | Neero | Manual + videos tutoriales |
| 4 | **GO-LIVE PRODUCCIÓN** | Ambos equipos | Sistema live |
| 5 | Soporte on-site (presencial) | Neero team | Resolver dudas en vivo |

**MILESTONE 3: Go-Live Producción**

**Criterios aprobación:**

1. ✓ 55 compras activas migradas correctamente (validado registro por registro)
2. ✓ OCR facturas funciona (3 facturas reales procesadas exitosamente)
3. ✓ Certificados bloqueantes (intentar cerrar compra sin certificado → bloqueado)
4. ✓ 8-10 usuarios capacitados y certificados
5. ✓ Soporte on-site día 1 sin incidentes críticos

**Si aprueba:** Pago Milestone 4 ($9M), sistema en producción, inicia soporte 6 meses

---

## Post-Launch (Mes 4-6): Soporte y Optimización

### Mes 4: Estabilización

| Semana | Actividad | SLA |
|--------|-----------|-----|
| 1-2 | Monitoreo 24/7, soporte on-call | Respuesta <2h críticos |
| 3 | Revisión bugs reportados (priorización) | Fix críticos <24h |
| 4 | Primera optimización basada en uso real | Sprint mejoras |

**Soporte incluido:**
- Email/WhatsApp/videollamada 8AM-6PM lun-vie
- On-call emergencias 24/7 (solo críticos)
- Capacitación adicional si se requiere (5 horas incluidas)

---

### Mes 5-6: Optimización y Transferencia Conocimiento

| Actividad | Descripción |
|-----------|-------------|
| Análisis métricas uso | ¿Qué dashboards más usados? ¿Qué consultas IA frecuentes? |
| Optimización performance | Consultas lentas → indexar, caché |
| Features quick-wins | Pequeñas mejoras alto impacto (basadas en feedback) |
| Documentación técnica | Para IT Contecsa (mantenimiento futuro) |
| Training IT interno | Transferir conocimiento básico troubleshooting |

**Entregable mes 6:** Sistema optimizado + Documentación completa + IT Contecsa autónomo

---

## Gestión de Riesgos

### Riesgos Identificados y Mitigación

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Acceso SICOM retrasado | Media | Alto | Solicitar credenciales semana 0, escalar a IT Manager |
| Datos históricos incompletos | Baja | Medio | Análisis exploratorio semana 1, plan B con Excel |
| Usuarios piloto no disponibles | Baja | Medio | Identificar alternates, calendario confirmado semana 0 |
| OCR baja precisión (facturas manuscritas) | Media | Bajo | Fallback manual, priorizar facturas digitales |
| Resistencia al cambio | Media | Alto | Capacitación temprana, demos frecuentes, quick wins |
| Bugs críticos post-launch | Baja | Alto | QA riguroso, UAT exhaustivo, soporte on-site día 1 |

**Plan contingencia general:** Buffer 1 semana adicional incorporado (12 semanas plan,
13 semanas calendario real con margen)

---

## Roles y Responsabilidades

### Equipo Neero (Dedicado)

| Rol | Nombre | Responsabilidad |
|-----|--------|----------------|
| Project Manager | TBD | Coordinación, comunicación, milestones |
| Lead Developer (Backend) | TBD | Python/FastAPI, ETL SICOM, PostgreSQL |
| Lead Developer (Frontend) | TBD | Next.js, Dashboards, UX |
| AI Specialist | TBD | Gemini integration, training modelo, anomalías |
| QA Engineer | TBD | Testing, UAT, documentación bugs |

**Dedicación:** 80-100% tiempo durante 12 semanas

---

### Equipo Contecsa (Part-Time)

| Rol | Nombre | Responsabilidad | Tiempo Estimado |
|-----|--------|----------------|-----------------|
| Usuario Piloto | Liced Vega | Validación proceso, UAT, feedback | 10-15 h/semana |
| IT Manager | TBD | Acceso SICOM, infraestructura cloud | 5 h/semana |
| Gerencia Sponsor | TBD | Aprobaciones, go/no-go decisions | 2 h/semana |
| Usuarios Testing | 5 personas | UAT semanas 6, 10, 12 | 4 h/semana (picos) |

**Total tiempo Contecsa:** ~25-30 horas/semana equipo completo (manejable)

---

## Comunicación y Governance

### Ceremonias Regulares

| Reunión | Frecuencia | Duración | Participantes |
|---------|-----------|----------|---------------|
| Daily standup | Lun-Vie | 15 min | Equipo Neero (interno) |
| Demo semanal | Viernes | 1 hora | Neero PM + Liced + IT |
| Sprint review | Cada 2 sem | 2 horas | Ambos equipos + Gerencia |
| Milestone review | Sem 6, 10, 12 | 3 horas | Stakeholders + aprobadores |

**Comunicación asíncrona:**
- Slack/WhatsApp: Actualizaciones diarias
- Email: Reportes semanales (viernes EOD)
- Dashboard proyecto: Progreso visible 24/7 (Notion/Jira)

---

## Criterios de Éxito Generales

**Al final de 12 semanas, el sistema debe:**

1. ✓ **Prevenir Caso Cartagena:** Detectar variaciones precio >10% en <1 minuto
2. ✓ **Liberar tiempo:** Reducir 80% trabajo manual (85h/mes → 15-20h/mes)
3. ✓ **Eliminar dependencia:** Cualquier usuario puede operar sin Liced
4. ✓ **Dashboards operativos:** 6 roles, datos tiempo real (<5 min actualización)
5. ✓ **Agente IA funcional:** Responde consultas lenguaje natural en <10 seg
6. ✓ **Integración SICOM:** Sync automática nocturna, read-only, cero modificaciones
7. ✓ **Adopción usuario:** >80% usuarios activos semanalmente
8. ✓ **Satisfacción:** >8/10 en encuesta post-launch
9. ✓ **Cero incidentes críticos:** Primer mes producción
10. ✓ **Documentación completa:** Manual usuario + Documentación técnica IT

---

## Escalamiento Post-Fase 1 (Opcional)

### Fase 2: Features Avanzadas (Meses 4-7)

**Si Contecsa decide continuar:**

| Feature | Duración | Costo Estimado |
|---------|----------|----------------|
| Control Inventario (R9) | 6 semanas | $25M COP |
| Proyección Financiera (R10) | 8 semanas | $30M COP |
| Facturas Email Automáticas (R12) | 4 semanas | $15M COP |
| Mantenimiento Maquinaria (R13) | 6 semanas | $20M COP |

**Total Fase 2:** $90M COP (similar Fase 1, pero funcionalidad adicional)

**Decision point:** Mes 6 post-launch, basado en:
- Adopción Fase 1 (si >80% usuarios activos → continuar)
- ROI observado (si beneficios cumplen proyección → continuar)
- Presupuesto disponible cliente

---

## Conclusión Roadmap

**12 semanas estructuradas en 3 fases, 3 milestones go/no-go:**
- **Semana 6:** Prevención Caso Cartagena operativa
- **Semana 10:** Agente IA + Dashboards completos
- **Semana 12:** Sistema completo en producción

**Filosofía:** Entregables tangibles cada 2-4 semanas, no esperar mes 12 para ver resultado

**Protección inversión:** Milestones con criterios claros, cliente puede detener si no
cumple expectativas (riesgo compartido)

**Soporte incluido:** 6 meses post-launch garantiza estabilidad y adopción

---

**Siguiente sección:** [11 - Inversión y Propuesta Comercial](11-inversion-propuesta.md)
