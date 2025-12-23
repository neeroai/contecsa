# Modelo de Servicio

Version: 1.0 | Date: 2025-12-23 00:20 | Owner: Neero SAS | Status: Propuesta Comercial

[Confidencial - Solo uso interno Contecsa S.A.S.]

---

## Filosofía de Entrega

**Neero NO es SaaS** (Software as a Service perpetuo con costos mensuales infinitos)

**Neero ES Software Entregable** (Build, Transfer, Support)

### ¿Qué Significa?

**Modelo tradicional SaaS (lo que NO hacemos):**
```
Cliente paga $X/mes perpetuamente → Vendor controla código → Sin pago, sin acceso
Dependencia infinita → Vendor puede subir precios → Cliente rehén
```

**Modelo Neero (lo que SÍ hacemos):**
```
Cliente paga $Y una vez (desarrollo) → Cliente recibe código fuente completo →
Cliente es dueño → Puede modificar, redistribuir, contratar otros developers →
Soporte opcional (no obligatorio)
```

**Beneficio cliente:**
- **Ownership total:** Código es suyo, sin restricciones
- **Exit strategy clara:** Si Neero no cumple, puede contratar otros (no lock-in)
- **Costo predecible:** Desarrollo $90M (one-time), hosting $10-12M/año (cloud provider,
  no Neero)
- **Independencia:** Después de 6 meses soporte, puede auto-soportar (si tiene IT)

---

## Fases del Servicio

### Fase 1: Desarrollo (Semanas 1-12)

**Qué hace Neero:**
- Desarrollo software completo (frontend + backend + IA)
- Integración SICOM read-only
- Capacitación usuarios (20 horas)
- UAT (User Acceptance Testing)
- Documentación (usuario + técnica)
- Deploy ambiente producción cliente

**Qué recibe Contecsa:**
- Sistema operativo 100% funcional
- Código fuente completo (GitHub repository privado)
- Documentación completa (manual usuario + arquitectura técnica)
- Usuarios capacitados (8-10 personas)
- 6 meses soporte incluido

**Costo:** $90,000,000 COP (pago por milestones)

**Entregables tangibles:**
| Entregable | Formato | Ubicación |
|------------|---------|-----------|
| Código fuente frontend | Next.js/TypeScript | GitHub repo (cliente owner) |
| Código fuente backend | Python/FastAPI | GitHub repo (cliente owner) |
| Base datos schema | SQL scripts | GitHub repo + documentación |
| Manual usuario | PDF + videos | Google Drive compartido |
| Documentación técnica | Markdown + diagramas | GitHub wiki |
| Scripts deployment | Bash/Docker | GitHub repo |
| Credenciales producción | Archivo encriptado | 1Password compartido |

---

### Fase 2: Soporte Incluido (Meses 4-9, 6 meses post-launch)

**Qué hace Neero:**
- Soporte técnico (email, WhatsApp, videollamada)
- Resolución bugs (SLA definido abajo)
- Optimización performance basada en uso real
- Capacitación adicional (5 horas incluidas)
- Actualizaciones seguridad (si vulnerabilidades críticas)

**Qué NO hace Neero (fuera de alcance):**
- Nuevos features (se cotiza aparte)
- Soporte infraestructura cloud (GCP/AWS, responsabilidad cliente)
- Training usuarios nuevos >10 (se cotiza aparte)
- Customizaciones mayores (se cotiza Fase 2)

**Costo:** $0 (incluido en $90M desarrollo)

**SLA (Service Level Agreement):**

| Tipo Incidente | Definición | Tiempo Respuesta | Tiempo Resolución | Canales |
|----------------|------------|------------------|-------------------|---------|
| **Crítico** | Sistema caído (0 usuarios pueden usar) | <2 horas | <24 horas | Email + WhatsApp + Call |
| **Alto** | Feature core no funciona (ej: alertas no envían) | <4 horas | <72 horas | Email + WhatsApp |
| **Medio** | Feature secundaria no funciona (ej: export Excel) | <8 horas | <5 días | Email |
| **Bajo** | Mejora UX, pregunta configuración | <24 horas | <10 días | Email |

**Ejemplo Crítico:**
- 9:00 AM: Sistema no carga (error 500)
- 9:15 AM: Cliente reporta vía WhatsApp
- 9:30 AM: Neero developer diagnostica (30 min)
- 11:00 AM: Hotfix deployed, sistema operativo (2.5 horas)
- 11:30 AM: Postmortem email (qué pasó, cómo se previene)

**Ejemplo Alto:**
- Lunes 10 AM: Alertas email no están llegando
- Lunes 11 AM: Cliente reporta vía email
- Lunes 3 PM: Neero responde (dentro de 4h SLA)
- Martes 2 PM: Fix deployed, alertas funcionando (26 horas, dentro de 72h SLA)

---

### Fase 3: Soporte Opcional (Año 2+)

**Después de 6 meses incluidos, Contecsa elige:**

#### Opción A: Contratar Soporte Neero

**Costo:** $12,000,000 COP/año (pago mensual $1M o anual con 10% descuento)

**Incluye:**
- Mismo SLA que soporte incluido (crítico <2h, alto <4h, etc.)
- 10 horas capacitación/año (usuarios nuevos, refresher)
- Actualizaciones menores (bug fixes, seguridad)
- Prioridad desarrollo Fase 2 (si Contecsa contrata)

**Recomendado para:** Contecsa si NO tiene IT con capacidad Python/Next.js in-house

---

#### Opción B: Auto-Soporte (Código es del Cliente)

**Costo:** $0 Neero (solo costos internos Contecsa)

**Requisitos:**
- IT Contecsa con conocimientos Python + Next.js (o contratar)
- Acceso código fuente (ya tienen, es suyo)
- Documentación técnica (ya tienen)

**Contecsa puede:**
- Modificar código (agregar features, cambiar UX)
- Contratar developers in-house o freelancers externos
- Migrar a otra infraestructura cloud
- **Cero dependencia de Neero**

**Recomendado para:** Contecsa si tiene IT robusto o quiere total autonomía

---

#### Opción C: Híbrido (On-Call Emergencias)

**Costo:** $5,000,000 COP/año

**Incluye:**
- Solo incidentes CRÍTICOS (sistema caído)
- Respuesta <4 horas (vs <2h plan completo)
- Sin soporte bugs menores (cliente lo hace in-house)
- Sin capacitación incluida

**Recomendado para:** Contecsa con IT capaz, pero quiere backup emergencias

---

## Ownership del Código

### ¿Qué Significa "Cliente es Dueño"?

**Contecsa recibe:**

1. **Código fuente completo:** Todo el código (frontend, backend, IA scripts)
2. **Sin restricciones:** Puede modificar, redistribuir, vender (aunque no recomendamos)
3. **Sin royalties:** No paga a Neero si modifica o escala
4. **GitHub ownership:** Repository transferido a cuenta GitHub Contecsa

**Neero retiene:**

1. **Propiedad intelectual genérica:** Frameworks/metodologías propias (no específicas
   Contecsa)
2. **Derecho uso caso éxito:** Mencionar "Contecsa" en marketing (con aprobación cliente)
3. **Código base reutilizable:** Componentes genéricos (no lógica de negocio Contecsa)
   para otros proyectos

**Ejemplo:**
- Neero NO puede vender "Sistema Contecsa" a competidor
- Neero SÍ puede reutilizar "componente dashboards genérico" en otros proyectos
- Contecsa SÍ puede modificar TODO su código sin permiso Neero
- Contecsa SÍ puede contratar otro vendor para mantener código Neero

---

### Licencia Software

**Open Source:** NO (código privado Contecsa)

**Licencia entregada:** Propietary License (Contecsa owner)

**Términos:**
```
Copyright (c) 2026 Contecsa S.A.S.
All rights reserved.

Este software es propiedad exclusiva de Contecsa S.A.S.
Contecsa puede modificar, redistribuir, sublicenciar sin restricciones.

Neero SAS transfiere todos los derechos de propiedad intelectual
relacionados con implementación específica Contecsa, excepto componentes
genéricos/reutilizables identificados en Anexo A (SOW).
```

**Resultado práctico:** Contecsa 100% dueño, hace lo que quiera con el código.

---

## Infraestructura y Hosting

### Modelo de Deploy

**Contecsa elige dónde hostear (Neero NO controla infraestructura):**

#### Opción 1: Google Cloud Platform (GCP) - Recomendado

**Por qué:**
- Integración nativa Gmail/Google Workspace (Contecsa ya usa)
- Gemini 2.0 Flash (IA) es de Google (latencia menor)
- Pricing competitivo vs AWS
- Soporte español LATAM

**Costo estimado mensual:**
| Servicio | Spec | Costo/Mes (USD) | Costo/Mes (COP) |
|----------|------|-----------------|-----------------|
| Cloud Run (backend) | 2 vCPU, 4 GB RAM | $50 | $200,000 |
| Cloud SQL (PostgreSQL) | db-n1-standard-2 | $90 | $360,000 |
| Cloud Storage (certs/facturas) | 100 GB | $5 | $20,000 |
| Networking | Egress 1 TB | $25 | $100,000 |
| **Subtotal GCP** | | **$170** | **$680,000** |

---

#### Opción 2: Amazon Web Services (AWS)

**Por qué:**
- Mayor oferta servicios (si Contecsa necesita features avanzadas futuro)
- Marketplace amplio (integraciones terceros)
- Contecsa ya usa AWS para otros sistemas (consolidación)

**Costo estimado mensual:**
| Servicio | Spec | Costo/Mes (USD) | Costo/Mes (COP) |
|----------|------|-----------------|-----------------|
| ECS Fargate (backend) | 2 vCPU, 4 GB RAM | $60 | $240,000 |
| RDS PostgreSQL | db.t3.medium | $100 | $400,000 |
| S3 Storage | 100 GB | $3 | $12,000 |
| Data Transfer | 1 TB | $30 | $120,000 |
| **Subtotal AWS** | | **$193** | **$772,000** |

---

#### Opción 3: Self-Hosted (On-Premise Contecsa)

**Solo si:**
- Contecsa tiene datacenter propio
- Políticas de seguridad extremas (datos no pueden salir infraestructura)
- IT robusto para mantener servidores

**Costo:**
- Servidores: Depende hardware existente
- Mantenimiento: IT Contecsa
- **NO recomendado** (cloud es más barato y confiable para mayoría casos)

---

### Responsabilidades Infraestructura

| Responsabilidad | Neero | Contecsa |
|-----------------|-------|----------|
| **Setup inicial** | ✓ Configura (semana 1-2) | Crea cuenta GCP/AWS |
| **Costos cloud** | - | ✓ Paga directo a Google/AWS |
| **Backups** | ✓ Configura automáticos | ✓ Valida que existan |
| **Seguridad** | ✓ Best practices (SSL, firewall) | ✓ Credenciales, accesos |
| **Monitoring** | ✓ Setup alertas | ✓ Recibe alertas, escala |
| **Scaling** | ✓ Consultoría (si requiere) | ✓ Decisión y pago |
| **Downtime cloud** | - | ✓ Responsabilidad GCP/AWS |

**Resultado:** Neero configura, Contecsa opera (con soporte Neero primeros 6 meses)

---

## Seguridad y Compliance

### Estándares Aplicados

**Código:**
- SonarQube análisis estático (detección vulnerabilidades)
- Dependencias actualizadas (sin CVEs conocidos)
- Secrets management (Vault, nunca hardcoded)

**Infraestructura:**
- SSL/TLS 100% comunicaciones (HTTPS, no HTTP)
- Firewall rules (solo IPs Contecsa acceden admin)
- Backups diarios encriptados (retención 7 días)

**Datos:**
- Encriptación en tránsito (TLS 1.3)
- Encriptación en reposo (PostgreSQL AES-256)
- Logs sin PII (datos personales)

**Accesos:**
- 2FA obligatorio (admin users)
- Permisos por rol (6 roles granulares)
- Logs auditoría (quién cambió qué, cuándo)

---

### Compliance

**Colombia NO requiere GDPR** (Europa) ni CCPA (California), pero Neero implementa
best practices:

| Regulación | Estado | Implementación |
|------------|--------|----------------|
| **Ley 1581/2012 (Habeas Data Colombia)** | Obligatorio | ✓ Consentimiento usuarios, política privacidad |
| **GDPR (si expande Europa)** | Opcional | ✓ Ready (delete user, export data) |
| **SOC 2 (auditoría sistemas)** | Opcional | Roadmap 2026 |
| **ISO 27001 (seguridad)** | Opcional | Roadmap 2027 |

**Certificación Contecsa:**
- Sistema cumple Ley 1581/2012 desde día 1
- Si Contecsa requiere certificación formal (auditoría externa), Neero puede coordinar
  ($10-15M COP adicionales)

---

## Capacitación y Documentación

### Capacitación Usuarios (20 Horas Incluidas)

**Formato:** Presencial (Bogotá) u Online (Zoom)

**Contenido:**

| Sesión | Duración | Audiencia | Temas |
|--------|----------|-----------|-------|
| 1. Introducción | 2 horas | Todos (8-10 usuarios) | Overview sistema, login, navegación básica |
| 2. Dashboards | 3 horas | Por rol (6 sesiones 30 min c/u) | Dashboard Gerencia, Compras, Contabilidad, etc. |
| 3. Agente IA | 2 horas | Power users (Liced, Jefe Compras, Gerencia) | Consultas lenguaje natural, gráficas |
| 4. Workflow Compras | 4 horas | Compras (Liced + auxiliares) | 7 etapas, aprobar, alertas, certificados |
| 5. Administración | 3 horas | IT Contecsa | Setup usuarios, permisos, backups, troubleshooting |
| 6. Q&A Final | 2 horas | Todos | Dudas, casos edge, best practices |
| 7. Hands-On | 4 horas | Todos | Práctica con datos reales (UAT) |
| **Total** | **20 horas** | | |

**Certificación:** Al finalizar, usuarios reciben "Certificado Uso Sistema Contecsa IA"
(opcional, simbólico)

---

### Documentación Entregada

**Manual Usuario (PDF + Videos):**
- 50-80 páginas con screenshots
- Tutoriales paso a paso (crear compra, aprobar, consultar IA, etc.)
- FAQs (20-30 preguntas frecuentes)
- Videos cortos (5-10 min c/u, 10 videos total)

**Documentación Técnica (para IT):**
- Arquitectura sistema (diagramas)
- Setup infraestructura (paso a paso GCP/AWS)
- API endpoints (si Contecsa quiere integrar otros sistemas)
- Troubleshooting común (logs, errores típicos)
- Scripts mantenimiento (backups, migrations)

**Ubicación:** Google Drive compartido + GitHub Wiki (código)

---

## Escalabilidad y Upgrades

### ¿Sistema Escala con Crecimiento Contecsa?

**Sí.** Diseño arquitectura prevé:

| Escenario | Sistema Actual | Capacidad Max (sin cambios) | Si Excede |
|-----------|----------------|----------------------------|-----------|
| **Consorcios** | 9 | 20 | Agregar server (config, no código) |
| **Compras simultáneas** | 55 | 500 | Agregar server |
| **Usuarios** | 8-10 | 100 | Cambiar plan PostgreSQL |
| **Facturas OCR/mes** | ~60 | 1,000 | Agregar quota Google Vision |
| **Consultas IA/mes** | ~500 | 10,000 | Aumentar quota Gemini |

**Costos adicionales escalamiento:** Solo cloud (GCP/AWS), NO desarrollo nuevo

**Ejemplo:** Si Contecsa crece a 15 consorcios (vs 9 actual):
- Compras simultáneas: 55 → ~90
- Costo cloud: $680K/mes → ~$950K/mes
- Código: Sin cambios (ya soporta multi-consorcio)

---

### Upgrades y Nuevos Features (Fase 2 Opcional)

**Si Contecsa quiere agregar features post-Fase 1:**

| Feature | Duración | Costo Estimado | Prioridad |
|---------|----------|----------------|-----------|
| Control Inventario (R9) | 6 semanas | $25,000,000 | Media |
| Proyección Financiera IA (R10) | 8 semanas | $30,000,000 | Alta |
| Facturas Email Automáticas (R12) | 4 semanas | $15,000,000 | Media |
| Mantenimiento Maquinaria (R13) | 6 semanas | $20,000,000 | Baja |
| **Fase 2 Completa** | **24 semanas** | **$90,000,000** | - |

**Decisión:** Mes 6 post-launch Fase 1 (basado en adopción y ROI observado)

**Descuento:** Si se contrata Fase 1+2 simultáneamente: 10% descuento Fase 2 = $81M

---

## Garantías y Protección Cliente

### Garantía Satisfacción (90 Días Post-Launch)

**Si sistema NO cumple garantías (ver lista abajo), Neero remediará SIN costo adicional.**

**Garantías específicas:**
1. Detección variaciones precio >10% en <1 minuto
2. Reducción 80% tiempo ingreso datos manual
3. Dashboards actualizan en <5 minutos
4. Integración SICOM sin modificar sistema legacy
5. Agente IA responde en <10 segundos
6. Cero downtime >4 horas acumulado primer mes

**Si remediación falla (60 días después de reportar):**
- Cliente puede solicitar reembolso 50% inversión ($45M)
- Cliente retiene código fuente (sigue siendo dueño)

**Excepciones:** Garantía NO cubre errores causados por cliente (modificaciones código,
datos SICOM corruptos, fuerza mayor)

---

### Protección contra Quiebra Neero

**Pregunta válida:** "¿Qué pasa si Neero quiebra año 2?"

**Respuesta:**
- Código es del cliente (sin dependencia existencial)
- Documentación técnica completa (puede contratar otros)
- Sistema sigue funcionando (no hay "kill switch")
- Puede contratar developers freelance/boutiques para mantener

**Code Escrow (Opcional):**
- Neero deposita código en escrow tercero neutral
- Si Neero quiebra, código se libera automáticamente a Contecsa
- Costo: $2M COP/año (opcional, mayoría clientes no usa porque ya tienen código)

---

## Comunicación y Soporte

### Canales Soporte (6 Meses Incluidos + Opcional Año 2+)

| Canal | Horario | Uso Recomendado | SLA Respuesta |
|-------|---------|----------------|---------------|
| **Email** | 24/7 | Bugs no críticos, preguntas | <24h |
| **WhatsApp** | 8 AM - 6 PM lun-vie | Urgencias, coordinación | <2h |
| **Videollamada** | 8 AM - 6 PM (agendar 4h antes) | Training, troubleshooting complejo | N/A |
| **On-call** | 24/7 (solo CRÍTICO) | Sistema caído | <2h |

**Email soporte:** soporte@neero.ai
**WhatsApp soporte:** +57 XXX XXX XXXX
**Agendar videollamada:** calendly.com/neero-soporte

---

### Reportes Mensuales (Opcional, Post-Launch)

**Si Contecsa contrata soporte año 2+, incluye reporte mensual:**

```
REPORTE MENSUAL - Febrero 2026

MÉTRICAS SISTEMA:
- Uptime: 99.8% (6 horas downtime mantenimiento programado)
- Usuarios activos: 9/10 (90%)
- Consultas IA: 342 (↑15% vs Enero)
- Facturas OCR: 58 (↑5% vs Enero)
- Alertas enviadas: 127 (críticas: 3, altas: 12, medias: 112)

INCIDENTES:
- Críticos: 0
- Altos: 1 (alertas email fallaron 4h, resuelto <24h)
- Medios: 3 (export Excel lento, optimizado)

OPTIMIZACIONES REALIZADAS:
- Query dashboards acelerado 40% (indexing PostgreSQL)
- OCR precisión mejorado 99.0% → 99.4% (training adicional)

RECOMENDACIONES:
- Considerar agregar Feature R10 (Proyección Financiera) basado en
  alta frecuencia consultas IA relacionadas (67 en Febrero)

Próxima revisión: 15 Marzo 2026
```

**Valor:** Transparencia total, cliente sabe qué pasa con su sistema

---

## Conclusión Modelo Servicio

**Neero entrega SOFTWARE, no servicio perpetuo.**

**Contecsa recibe:**
- ✓ Código fuente completo (ownership 100%)
- ✓ Sistema operativo llave en mano
- ✓ Documentación completa
- ✓ Capacitación 20 horas
- ✓ Soporte 6 meses incluido
- ✓ Exit strategy clara (sin lock-in)

**Contecsa elige (después 6 meses):**
- Opción A: Contratar soporte Neero ($12M/año)
- Opción B: Auto-soportar (código es suyo, $0 Neero)
- Opción C: Híbrido ($5M/año emergencias)

**Filosofía:** Cliente primero, transparencia radical, sin dependencias ocultas.

---

**Siguiente sección:** [12 - Siguientes Pasos](12-siguientes-pasos.md)
