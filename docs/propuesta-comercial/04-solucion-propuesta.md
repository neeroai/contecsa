# Solución Propuesta

Version: 1.0 | Date: 2025-12-22 23:45 | Owner: Neero SAS | Status: Propuesta Comercial

[Confidencial - Solo uso interno Contecsa S.A.S.]

---

## Visión General

Neero propone un **Sistema de Inteligencia de Datos con IA** que transforma el proceso
manual actual en un asistente digital que:

1. **Previene pérdidas** detectando anomalías en menos de 1 minuto
2. **Automatiza seguimiento** de 55 compras con alertas inteligentes
3. **Libera tiempo** del equipo (80% reducción trabajo administrativo)
4. **Elimina dependencia** de una sola persona (Liced Vega)
5. **Escala sin costo** a 9+ consorcios
6. **Integra SICOM** sin modificar el sistema legacy

**Enfoque:** Software que se entrega a Contecsa (no se alquila), cliente es dueño del
código y lo opera en su propia nube (GCP o AWS según preferencia).

---

## Cómo Funciona: Los 4 Pilares

### Pilar 1: Inteligencia Artificial Conversacional

**Problema resuelto:** Hoy, obtener información requiere 2-8 horas de trabajo manual
generando reportes Excel.

**Solución:**

Converse con el sistema en lenguaje natural, como si fuera un asistente experto:

**Ejemplos de preguntas:**
- "¿Cuánto gastamos en combustible el primer trimestre?"
- "Muéstrame los 5 proveedores con mejor precio en concreto"
- "¿Qué compras llevan más de 30 días abiertas?"
- "Compara el gasto de PAVICONSTRUJC vs EDUBAR este mes"
- "Proyecta cuánto necesitaremos en cemento los próximos 3 meses"

**Respuesta del sistema:**
- Texto explicativo en lenguaje claro
- Gráficas automáticas (barras, líneas, pastel)
- Tablas con datos detallados
- **Tiempo de respuesta:** 5-10 segundos

**Tecnología subyacente:**
- Inteligencia artificial de última generación (Gemini 2.0 Flash de Google)
- Entrenada con datos históricos de Contecsa (SICOM + Excel)
- Entiende contexto de construcción y obras civiles

**Valor:**
- Gerencia obtiene KPIs sin llamar a Liced: **Autonomía**
- Decisiones basadas en datos en minutos, no días: **Agilidad**
- Cualquier usuario puede explorar información: **Democratización**

---

### Pilar 2: Prevención Automática de Pérdidas

**Problema resuelto:** Caso Cartagena (sobrecobro 25% no detectado 60 días)

**Solución:**

**Flujo automático cuando llega una factura:**

```
1. Sistema recibe factura (manual o OCR automático)
2. Identifica: Proveedor, Material, Precio unitario, Cantidad
3. Consulta histórico SICOM: ¿Cuál ha sido el precio últimos 12 meses?
4. Calcula variación: Nuevo precio vs Promedio histórico
5. Decisión:
   - Variación <5%: APROBADO automáticamente
   - Variación 5-10%: ALERTA amarilla (revisar)
   - Variación >10%: BLOQUEADO automático
6. Si BLOQUEADO:
   - Email inmediato a Jefe Compras + Gerencia
   - Gráfica histórica adjunta (visual)
   - Bloquea pago hasta revisión manual
7. Usuario revisa, decide:
   - Aprueba con justificación (ejemplo: inflación documentada)
   - Rechaza y contacta proveedor
```

**Tiempo detección:** <1 minuto (vs 60 días manual)

**Casos cubiertos:**
- Sobrecobros (Caso Cartagena)
- Pagos duplicados (misma factura 2 veces)
- Facturación sin entrega (material no recibido en almacén)
- Aumentos no negociados (proveedor sube precio sin avisar)

**Valor cuantificado:**
- Prevención $50M COP/año en pérdidas evitadas
- Relación proveedor protegida (detección temprana permite negociación cordial)
- Auditoría automática 100% de facturas (hoy: 0%)

---

### Pilar 3: Dashboards Inteligentes por Rol

**Problema resuelto:** Hoy todos ven todo en Excel (confuso), y Gerencia necesita
reportes manuales de 4 horas.

**Solución:**

**6 dashboards especializados, cada rol ve solo lo relevante:**

#### 3.1 Dashboard Gerencia

**Qué ve:**
- KPIs tiempo real: Total gastado vs Presupuesto, Top 5 proveedores, Compras en riesgo
- Alertas críticas: Sobrecobros detectados, Presupuesto excedido, Certificados faltantes
- Proyecciones: Gasto estimado próximos 3 meses por consorcio
- Comparativas: Consorcio más eficiente, Proveedor mejor precio/calidad

**Actualización:** Tiempo real (datos frescos cada 5 minutos)

**Export:** PDF con 1 clic para reuniones junta directiva

#### 3.2 Dashboard Jefe de Compras

**Qué ve:**
- Estado 55 compras en 1 pantalla (color: verde/amarillo/rojo)
- Alertas: Compras >30 días sin avanzar, Proveedores sin responder
- Seguimiento: ¿En qué etapa está cada compra? (7 etapas visuales)
- Proveedores: Rendimiento histórico, Tiempo promedio entrega

**Acción directa:** Clic en compra → Ve detalle completo + histórico comunicaciones

#### 3.3 Dashboard Auxiliar Compras

**Qué ve:**
- Sus compras asignadas (no las de otros)
- Tareas pendientes: "Solicitar certificado a Proveedor X", "Confirmar entrega Almacén"
- Alertas diarias: Lista compras que requieren acción hoy

**Gamificación:** Compras cerradas mes actual, tiempo promedio cierre

#### 3.4 Dashboard Contabilidad

**Qué ve:**
- Facturas pendientes pago
- Pagos programados próximos 15 días
- Presupuesto vs Ejecutado por consorcio
- Alertas: Facturas bloqueadas (sobrecobro), Facturas vencidas

**Integración:** Export SICOM para contabilización (formato estándar)

#### 3.5 Dashboard Técnico/Obra

**Qué ve:**
- Consumo materiales por obra (cemento, concreto, acero, etc.)
- Certificados calidad: Aprobados vs Pendientes
- Alertas: Material sin certificado, Especificaciones técnicas faltantes

**Valor:** Previene usar material no certificado (riesgo calidad/auditoría)

#### 3.6 Dashboard Almacén

**Qué ve:**
- Entregas programadas próximos 7 días
- Confirmaciones pendientes (material recibido pero no registrado)
- Inventario actual vs Proyectado (si se implementa R9 Fase 2)

**Acción directa:** Confirmar recepción con foto desde celular (geolocalización)

**Valor consolidado:**
- Cada usuario trabaja 60% más rápido (ve solo lo relevante)
- Gerencia autónoma (sin esperar reportes manuales)
- Cero confusión (dashboards diseñados por rol, no hoja Excel única)

---

### Pilar 4: Automatización Workflow 7 Etapas

**Problema resuelto:** Hoy el seguimiento es manual, compras se estancan sin alertas.

**Solución:**

**Flujo automático de compra desde inicio hasta cierre:**

```
ETAPA 1: Solicitud
- Usuario crea requisición → Sistema asigna ID único
- Auto-verifica: Presupuesto disponible consorcio
- Alerta: Jefe Compras recibe notificación (email + dashboard)
- SLA: 24 horas para aprobar/rechazar

ETAPA 2: Cotización
- Sistema sugiere 3 proveedores históricos (mejor precio/calidad)
- Auxiliar solicita cotizaciones
- Sistema registra respuestas, compara precios
- Alerta: Si proveedor no responde en 5 días

ETAPA 3: Orden de Compra
- Jefe Compras aprueba proveedor seleccionado
- Sistema genera orden compra automática (plantilla)
- Email automático a proveedor con orden PDF
- Registro SICOM (integración)

ETAPA 4: Factura
- Proveedor envía factura (email o upload sistema)
- OCR extrae datos automáticamente (Pilar 2)
- Validación precio histórico (alertas sobrecobro)
- Alerta: Contabilidad revisa y aprueba

ETAPA 5: Entrega
- Sistema notifica almacén: Entrega programada
- Almacén confirma recepción (app móvil con foto)
- Bloqueo: No se puede pagar si almacén no confirma
- Alerta: Si entrega se retrasa >7 días

ETAPA 6: Certificado Calidad
- Sistema solicita automáticamente a proveedor (3 días después entrega)
- Bloqueo: No se puede cerrar compra sin certificado subido
- Alerta: Técnico revisa certificado, aprueba/rechaza
- Almacenamiento: Google Cloud Storage (5 años accesibles)

ETAPA 7: Pago y Cierre
- Contabilidad programa pago (todas validaciones pasadas)
- Sistema registra pago en SICOM
- Compra marcada CERRADA
- Métricas: Tiempo ciclo completo, Eficiencia proveedor

```

**Alertas automáticas en cada etapa:**
- Día 10: Compra sin avanzar → Email Jefe Compras
- Día 20: Compra sin avanzar → Email Jefe + Gerencia (escalamiento)
- Día 30: Compra crítica → Reunión requerida

**Valor:**
- Cero compras olvidadas (hoy: común)
- Cumplimiento SLAs (presión automática a proveedores lentos)
- Auditoría completa (cada paso registrado con timestamp + responsable)
- Certificados 100% gestionados (hoy: 40% vacío)

---

## Capacidades Adicionales Incluidas

### 5.1 Integración Google Workspace

**Por qué:** Contecsa ya usa Gmail y Google Sheets (familiaridad)

**Funcionalidades:**
- **Login único:** Ingresar con cuenta @contecsa.com (no crear usuario nuevo)
- **Notificaciones Gmail:** Alertas llegan al email (no app adicional)
- **Export Sheets:** Cualquier reporte se puede exportar a Google Sheets (familiaridad)
- **Calendar:** Recordatorios de pagos/entregas en Google Calendar

**Valor:** Cero curva de aprendizaje, adopción inmediata

### 5.2 Conexión SICOM (Read-Only)

**Problema resuelto:** SICOM tiene datos históricos valiosos pero inaccesibles

**Solución:**
- Sistema se conecta a SICOM automáticamente cada noche (sync)
- Extrae: Histórico precios, Proveedores, Consumos, Pagos
- Transforma datos a formato ágil (consultas en segundos, no horas)
- **CRÍTICO:** Solo lectura, NUNCA modifica SICOM (política cliente)

**Valor:**
- 5 años de histórico disponible para IA (comparaciones, proyecciones)
- Consultas que tomaban 4 horas → 10 segundos
- SICOM sigue siendo sistema oficial (integridad garantizada)

### 5.3 OCR Automático de Facturas (Fase 1C)

**Problema resuelto:** Hoy, cada factura se ingresa manualmente campo por campo (15 min)

**Solución:**
- Proveedor envía factura PDF por email
- Sistema detecta email, extrae PDF
- OCR lee factura: Proveedor, Fecha, Monto, IVA, Items, Cantidades
- Crea borrador en sistema (usuario solo revisa, no escribe)
- Ahorro: 15 min → 2 min (solo validación)

**Tecnología:** Google Vision API (99.2% precisión en facturas español)

**Valor:**
- 55 facturas/mes × 13 min ahorrados = **11.9 horas/mes**
- Cero errores transcripción (OCR más preciso que humano cansado)

### 5.4 Notificaciones Inteligentes

**Problema resuelto:** Hoy, nadie recibe alertas automáticas (todo es revisión manual)

**Solución:**

**Email diario consolidado (1 solo email, no spam):**
```
Asunto: [Contecsa] Resumen Compras - 23 Dic 2025

Hola Liced,

ALERTAS CRÍTICAS (requieren acción hoy):
- 2 facturas bloqueadas por sobrecobro >10%
- 1 certificado vencido (Proveedor XYZ, compra #1234)

COMPRAS EN RIESGO (>20 días sin avanzar):
- Compra #1235: Concreto PAVICONSTRUJC (28 días en "Cotización")
- Compra #1240: Acero PTAR (22 días en "Factura pendiente")

TAREAS PENDIENTES:
- 3 entregas programadas esta semana (confirmar con almacén)
- 5 cotizaciones por recibir (seguimiento proveedores)

KPIs DÍA:
- Compras activas: 55
- Cerradas esta semana: 8
- Presupuesto ejecutado mes: 72% de $500M

[Ver Dashboard Completo]
```

**WhatsApp (Fase 2, opcional):**
- Alertas críticas vía WhatsApp Business (sobrecobros, urgencias)

**Valor:**
- Proactivo vs Reactivo (el sistema avisa, no esperamos descubrir)
- 1 email/día (no 20 emails separados)
- Priorización automática (crítico/riesgo/info)

---

## Arquitectura Simplificada

**Diagrama conceptual (4 capas):**

```
┌─────────────────────────────────────────────────┐
│   CAPA 1: USUARIOS (Web + Móvil)               │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│   │ Gerencia │  │  Compras │  │Contabilid│   │
│   │Dashboard │  │Dashboard │  │Dashboard │   │
│   └──────────┘  └──────────┘  └──────────┘   │
│        ↑              ↑              ↑          │
└────────┼──────────────┼──────────────┼─────────┘
         │              │              │
┌────────┼──────────────┼──────────────┼─────────┐
│        ↓              ↓              ↓          │
│   CAPA 2: INTELIGENCIA ARTIFICIAL              │
│   ┌─────────────────────────────────────────┐ │
│   │ Agente Conversacional (Gemini 2.0)     │ │
│   │ - Responde preguntas lenguaje natural  │ │
│   │ - Genera gráficas automáticas          │ │
│   │ - Detecta anomalías precios            │ │
│   └─────────────────────────────────────────┘ │
│        ↑              ↑              ↑          │
└────────┼──────────────┼──────────────┼─────────┘
         │              │              │
┌────────┼──────────────┼──────────────┼─────────┐
│        ↓              ↓              ↓          │
│   CAPA 3: MOTOR DE DATOS                       │
│   ┌─────────────────────────────────────────┐ │
│   │ Base Datos Centralizada (PostgreSQL)   │ │
│   │ - Almacena compras, facturas, alertas  │ │
│   │ - Consultas rápidas (<1 segundo)       │ │
│   │ - Histórico 5+ años accesible          │ │
│   └─────────────────────────────────────────┘ │
│        ↑              ↑                         │
└────────┼──────────────┼─────────────────────────┘
         │              │
┌────────┼──────────────┼─────────────────────────┐
│        ↓              ↓                          │
│   CAPA 4: INTEGRACIÓN SICOM (Legacy)           │
│   ┌─────────────────────────────────────────┐ │
│   │ Conector SICOM (Solo Lectura)          │ │
│   │ - Sync automática cada noche            │ │
│   │ - Extrae histórico precios, proveedores │ │
│   │ - NUNCA modifica SICOM                  │ │
│   └─────────────────────────────────────────┘ │
│              ↓                                  │
│        [SICOM Años 70-80]                      │
│        (Sistema oficial Contecsa)              │
└─────────────────────────────────────────────────┘
```

**Beneficios arquitectura:**
- **Separación clara:** Usuarios no tocan SICOM directamente (simplicidad)
- **Inteligencia centralizada:** IA analiza todos los datos (holística)
- **SICOM protegido:** Solo lectura, integridad garantizada
- **Escalable:** Agregar consorcios no requiere cambios arquitectura

---

## Diferenciadores vs Alternativas

### vs Consultoras Grandes (Accenture, Deloitte, etc.)

| Criterio | Neero | Consultoras Grandes |
|----------|-------|---------------------|
| Precio | $90-120M COP | $200-300M+ COP |
| Tiempo implementación | 3 meses | 9-12 meses |
| Acceso equipo | Directo a developers | Via account managers |
| Ownership código | Cliente dueño | License perpetua (dependencia) |
| Especialización | Construcción LATAM | Global genérica |

**Ventaja Neero:** Mismo expertise, 60% menos costo, 3x más rápido

### vs SaaS Internacionales (Procore, etc.)

| Criterio | Neero | SaaS Genéricos |
|----------|-------|----------------|
| Precio | $90M one-time | $80-150M/año (perpetuo) |
| Customización | 100% adaptado Contecsa | Templates rígidos |
| Integración SICOM | Incluida (read-only) | No soportan legacy |
| Datos | Cliente controla (self-host) | Vendor controla (cloud externo) |
| Multi-consorcio | Optimizado | Costo por "seat" |

**Ventaja Neero:** 10x más barato largo plazo, integración SICOM incluida, privacidad

### vs Freelancers/Developers Locales

| Criterio | Neero | Freelancers |
|----------|-------|-------------|
| Soporte post-launch | 6 meses incluido | Variable (riesgo abandono) |
| Escalabilidad | Diseñado multi-consorcio | Single-purpose |
| Procesos | Profesionales (testing, doc) | Informal |
| Team backup | 5+ developers | 1 persona (riesgo) |
| IA expertise | Gemini 2.0 Flash integrado | Limitado |

**Ventaja Neero:** Confiabilidad empresa, sin riesgo abandono, expertise IA comprobado

---

## Casos de Éxito Neero (Proyectos Similares)

### 1. Permoda/Koaj (Retail Moda - Colombia)

**Desafío:** Optimización inventario multi-tienda (80+ ubicaciones)
**Solución:** Sistema IA predice demanda, automatiza reorden
**Resultado:** 25% reducción sobrestocks, 15% mejora disponibilidad
**Similaridad Contecsa:** Multi-ubicación (consorcios), predicción demanda (proyecciones)

### 2. Finsocial (Fintech - Colombia)

**Desafío:** Automatización análisis crediticio (500+ solicitudes/día)
**Solución:** IA evalúa riesgo, detecta anomalías documentos
**Resultado:** 80% reducción tiempo aprobación, 40% menos defaults
**Similaridad Contecsa:** Detección anomalías (sobrecobros), automatización validaciones

### 3. Credititulos (Finanzas - Colombia)

**Desafío:** Gestión portafolio inversiones, reportes regulatorios
**Solución:** Dashboards tiempo real, alertas compliance
**Resultado:** Cumplimiento 100% regulatorio, decisiones 5x más rápidas
**Similaridad Contecsa:** Dashboards ejecutivos, compliance certificados

### 4. Claro (Telecomunicaciones - LATAM)

**Desafío:** Análisis datos clientes multi-país (50M+ registros)
**Solución:** IA conversacional consultas lenguaje natural
**Resultado:** Equipos no técnicos obtienen insights sin analistas
**Similaridad Contecsa:** Agente conversacional, democratización datos

### 5. Dr. Andrés Durán (Salud - Colombia)

**Desafío:** Sistema gestión pacientes, historias clínicas digitales
**Solución:** Automatización workflows, alertas seguimiento
**Resultado:** 60% reducción trabajo administrativo, mejor atención paciente
**Similaridad Contecsa:** Automatización workflows 7 etapas, alertas

**Experiencia consolidada:** 15+ proyectos IA empresarial LATAM, 5 años desarrollo

---

## Modelo de Entrega y Soporte

### Software Entregable (NO SaaS)

**Qué significa:**
- Neero desarrolla el sistema
- **Contecsa recibe código fuente completo** (ownership total)
- Cliente monta en su propia nube (GCP o AWS según preferencia)
- **Sin dependencia perpetua** de Neero (cliente puede modificar o contratar otros)

**Ventajas:**
- Control total datos (privacidad, compliance)
- No hay costos mensuales infinitos (solo hosting cloud, predecible)
- Flexibilidad futura (modificaciones in-house si desea)

### Soporte Incluido (6 Meses)

**Qué cubre:**
- Bugs y errores: SLA 24h críticos, 72h normales
- Capacitación usuarios: 20 horas incluidas (presencial u online)
- Optimización basada en uso real (primera iteración)
- Actualizaciones seguridad
- Soporte técnico email/WhatsApp/videollamada

**Después de 6 meses (opcional):**
- Contrato mantenimiento: $5M COP/mes
- O cliente mantiene in-house (código es suyo)

---

## Roadmap de Implementación (3 Meses)

**Semana 1-2: Discovery**
- Kick-off, acceso SICOM, análisis datos históricos, identificación usuarios piloto

**Semana 3-6: Desarrollo Fase 1A (Prevención Caso Cartagena)**
- Detección anomalías precios, alertas email, dashboards básicos
- **Milestone 1:** Demo prevención sobrecobro con datos reales

**Semana 7-10: Desarrollo Fase 1B (Inteligencia IA)**
- Agente conversacional, dashboards completos 6 roles, ETL SICOM
- **Milestone 2:** Demo agente IA (consultas lenguaje natural)

**Semana 11-12: Desarrollo Fase 1C + Go-Live**
- OCR facturas, certificados, Google Workspace, UAT final, capacitación, lanzamiento
- **Milestone 3:** Producción operativa con soporte on-site

**Post-Launch (Mes 4-6):**
- Soporte técnico incluido, optimizaciones, preparación Fase 2 (opcional)

---

## Garantías de Resultados

**Neero garantiza (contractual):**

1. ✓ **Detección variaciones precio >10% en <1 minuto** (vs 60 días manual)
2. ✓ **Reducción 80% tiempo ingreso datos** (de 85h/mes a 15-20h/mes)
3. ✓ **Alertas automáticas compras >30 días** sin avanzar (email diario)
4. ✓ **Dashboards operativos datos tiempo real** (actualización <5 min)
5. ✓ **Integración SICOM sin modificar** sistema legacy (read-only)
6. ✓ **Soporte 6 meses post-lanzamiento** (SLA documentado)

**Si no se cumplen:** Plan de remediación sin costo adicional hasta cumplimiento

---

## Próximos Pasos

Ver sección [12 - Siguientes Pasos](12-siguientes-pasos.md) para timeline detallado.

---

**Siguiente sección:** [06 - Análisis ROI y Financiero](06-roi-analisis-financiero.md)
