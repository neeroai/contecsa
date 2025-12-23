# Casos de Uso

Version: 1.0 | Date: 2025-12-23 00:10 | Owner: Neero SAS | Status: Propuesta Comercial

[Confidencial - Solo uso interno Contecsa S.A.S.]

---

## Introducción

Esta sección presenta **3 casos de uso reales** que demuestran cómo el Sistema de
Inteligencia de Datos transformará las operaciones diarias de Contecsa.

**Cada caso incluye:**
- Situación antes (proceso manual actual)
- Situación después (con sistema automatizado)
- Beneficio cuantificado
- Flujo paso a paso

---

## Caso de Uso 1: Prevención Sobrecobro (Killer de Caso Cartagena)

### Contexto

**Basado en:** Incidente real Q1 2025 (3 facturas concreto, sobrecobro 25%, 60 días
sin detectar)

**Actores:**
- Proveedor XYZ Concretos
- Auxiliar Compras Contecsa
- Jefe Compras
- Gerencia

---

### ANTES: Proceso Manual (60 Días Hasta Detección)

#### Semana 1: Factura Llega

**9:00 AM - Email proveedor con factura PDF**
```
De: ventas@xyzconcretos.com
Para: compras@contecsa.com
Asunto: Factura #12345 - Concreto Obra Cartagena

Adjunto factura por 100 m³ concreto 3000 PSI
Valor unitario: $350,000/m³
Total: $35,000,000 + IVA

Favor procesar pago.
```

**9:30 AM - Auxiliar Compras abre email**
- Descarga PDF factura
- Abre Google Sheets "Control Compras 2025"
- Busca fila compra #1234 (concreto PAVICONSTRUJC)

**9:45 AM - Ingreso manual 28 campos**
- Proveedor: XYZ Concretos (copy-paste)
- Cantidad: 100 m³
- Valor unitario: $350,000 (copy-paste de factura)
- Valor total: $35,000,000 (calcula en Excel)
- IVA: $6,650,000
- Estado: "Factura recibida"
- Fecha factura: 15 Ene 2025
- **Responsable:** Auxiliar NO revisa precio histórico (no tiene tiempo, no es parte
  del proceso)

**10:00 AM - Registro completado**
- Guarda Excel
- Email Jefe Compras: "Factura #12345 registrada, favor aprobar pago"

---

#### Semana 1-2: Aprobación y Pago (Sin Validación)

**Jefe Compras (día siguiente):**
- Revisa Excel, ve factura registrada
- Confía en auxiliar (siempre ha sido correcto)
- **NO compara precio vs histórico** (requeriría entrar SICOM, buscar 5 años precios,
  calcular promedio = 2 horas trabajo)
- Aprueba: Email Contabilidad "Pagar factura #12345"

**Contabilidad (3 días después):**
- Recibe aprobación, programa pago
- Transferencia: $41,650,000 COP

**Resultado:** Sobrecobro pagado, nadie detectó.

---

#### Semana 8: Detección Casual (Liced Vega Regresa)

**Liced regresa de ausencia (2 meses)**
- Revisa Excel completo (rutina mensual que solo ella hace)
- Ve factura concreto $350K/m³
- **Alerta mental:** "Concreto nunca ha costado >$300K"

**Validación manual (4 horas trabajo):**
1. Entra SICOM (sistema años 70, pantalla negra)
2. Busca histórico concreto 3000 PSI últimos 2 años
3. Exporta a Excel (SICOM no tiene gráficas)
4. Calcula promedio manualmente: $280,000/m³
5. Compara: $350K vs $280K = **+25% sobrecobro**
6. **Descubre:** $7,000,000 COP pagados de más (por 100 m³)

**Acción:**
- Email Gerencia: "Detectamos sobrecobro factura #12345"
- Llamada proveedor: "¿Por qué $350K si siempre ha sido $280K?"
- Proveedor: "Error administrativo nuestro, emitiremos nota crédito"

**Recuperación:**
- 15 días trámite nota crédito
- Dinero recuperado mes siguiente

**Costo total:**
- Dinero inmovilizado 75 días (costo oportunidad)
- 4 horas Liced + 2 horas Gerencia + 3 horas proveedor = 9 horas perdidas
- Relación proveedor afectada (desconfianza)
- **Estrés equipo**

---

### DESPUÉS: Sistema Automatizado (<1 Minuto Detección)

#### Mismo Día: Factura Llega

**9:00 AM - Email proveedor con factura PDF** (igual que antes)

**9:00:15 AM - Sistema detecta email automáticamente**
- Gmail API monitorea inbox compras@contecsa.com
- Detecta email con adjunto PDF (pattern "factura")
- Descarga PDF automáticamente

**9:00:30 AM - OCR extrae datos factura**
- Google Vision API lee PDF en 3 segundos
- Extrae:
  - Proveedor: XYZ Concretos
  - Material: Concreto 3000 PSI
  - Cantidad: 100 m³
  - Valor unitario: $350,000
  - Valor total: $35,000,000
- Precisión: 99.2%

**9:00:45 AM - Validación automática precio histórico**
- Sistema consulta base datos PostgreSQL (sync SICOM nocturna)
- Query: "SELECT AVG(precio) FROM facturas WHERE material='Concreto 3000 PSI' AND
  fecha > '2023-01-01'"
- Resultado: Promedio histórico = $280,000/m³
- Cálculo variación: ($350K - $280K) / $280K = **+25%**
- **Threshold:** Variación >10% → BLOQUEADO

**9:01:00 AM - ALERTA CRÍTICA AUTOMÁTICA**

Sistema genera email inmediato:

```
De: alertas@sistema-contecsa.com
Para: jefe.compras@contecsa.com, gerencia@contecsa.com
CC: compras@contecsa.com
Asunto: [CRÍTICO] Sobrecobro Detectado - Factura #12345 BLOQUEADA

ALERTA AUTOMÁTICA - Requiere Revisión Inmediata

Factura: #12345
Proveedor: XYZ Concretos
Material: Concreto 3000 PSI
Cantidad: 100 m³

PRECIO FACTURADO: $350,000/m³
PRECIO HISTÓRICO PROMEDIO (24 meses): $280,000/m³
VARIACIÓN: +25% (+$70,000/m³)

SOBRECOBRO TOTAL: $7,000,000 COP

ACCIÓN TOMADA: Factura BLOQUEADA automáticamente. No se puede aprobar pago hasta
revisión manual.

HISTÓRICO PRECIOS (últimos 12 meses):
- Ene 2024: $275,000
- Feb 2024: $280,000
- Mar 2024: $285,000
- Promedio: $280,000
- Máximo: $290,000 (nunca >$300K)

[Ver Gráfica Histórica] [Aprobar con Justificación] [Rechazar y Contactar Proveedor]

Tiempo detección: <1 minuto
Sistema: Contecsa IA - Prevención Pérdidas
```

**Adjunto:** Gráfica automática PNG (histórico precios 24 meses, línea tendencia, valor
actual marcado en rojo)

---

#### 9:15 AM - Jefe Compras Revisa

**Jefe abre email (recibió notificación WhatsApp también)**
- Lee alerta: "25% sobrecobro, nunca hemos pagado >$300K"
- Ve gráfica histórica (visual, entiende en 10 segundos)
- **Decisión:** Contactar proveedor antes de aprobar

**9:30 AM - Llamada proveedor**
- Jefe: "Su factura #12345 tiene precio $350K, nuestro histórico es $280K. ¿Por qué
  +25%?"
- Proveedor: "Déjame revisar... (pausa 2 min)... error nuestro, debió ser $280K como
  siempre. Cancelo factura, emito correcta."

**10:00 AM - Nueva factura llega**
- Mismo proceso automático
- Precio: $280,000/m³ (correcto)
- Variación: 0%
- Sistema: APROBADO automáticamente
- Email: "Factura #12346 validada, puede proceder a pago"

**10:30 AM - Jefe aprueba pago**
- Clic botón "Aprobar" en sistema
- Email Contabilidad automático: "Proceder pago factura #12346"

---

#### Resultado: Prevención Exitosa

**Tiempo detección:** <1 minuto (vs 60 días)
**Dinero ahorrado:** $7,000,000 COP (sobrecobro nunca se pagó)
**Tiempo equipo:** 30 minutos (vs 9 horas)
**Relación proveedor:** Mantenida (error detectado antes de pago, no después)
**Estrés:** Cero (sistema hizo el trabajo pesado)

---

### Valor Cuantificado Caso 1

| Métrica | Manual | Automatizado | Mejora |
|---------|--------|--------------|--------|
| **Tiempo detección** | 60 días | <1 minuto | **86,400x más rápido** |
| **Dinero en riesgo** | $7,000,000 | $0 | **$7M ahorrados** |
| **Horas equipo** | 9 horas | 0.5 horas | **95% reducción** |
| **Relación proveedor** | Dañada | Preservada | **Intangible** |
| **Probabilidad repetición** | Alta (sin alertas) | Cero (100% facturas validadas) | **Riesgo eliminado** |

**Valor anual (2 incidentes proyectados):** $14,000,000 - $24,000,000 COP ahorrados

---

## Caso de Uso 2: Liberación Liced Vega (Continuidad Negocio)

### Contexto

**Situación actual:** Liced Vega aparece en 70%+ de compras registradas Excel, es el
único "conocedor completo" del proceso.

**Escenario:** Liced toma vacaciones 15 días (derecho laboral)

---

### ANTES: Proceso Paralizado

#### Día 1 Vacaciones Liced (Lunes)

**8:00 AM - Liced no llega oficina**
- Gerencia: "¿Dónde está Liced?"
- RH: "Vacaciones aprobadas hace 2 meses, regresa en 15 días"
- Gerencia: "¿Quién maneja compras?"

**9:00 AM - Auxiliar Compras intenta cubrir**
- Abre Excel "Control Compras 2025"
- Ve 55 compras activas
- **Confusión:** ¿Cuáles requieren acción hoy? (no hay alertas)

**10:00 AM - Primera requisición nueva llega**
- Obra PTAR solicita cemento urgente (necesita viernes)
- Auxiliar: ¿A qué proveedores cotizar? (Liced sabe de memoria, auxiliar no)
- Busca historial SICOM (no sabe cómo, toma 2 horas aprender)

---

#### Día 3 Vacaciones (Miércoles)

**Acumulación problemas:**
- 3 requisiciones nuevas sin procesar (esperando Liced)
- 2 facturas llegaron, nadie las registró (Excel desactualizado)
- 1 proveedor llamó: "¿Aprobaron mi orden compra?" (nadie sabe)

**Jefe Compras llama Liced (vacaciones):**
- "Necesito saber qué proveedores usar para cemento PTAR"
- Liced (frustrada): "Revisa Excel fila 28, proveedores históricos"
- Jefe: "Excel muy confuso, mejor espero tu regreso"

**Decisión:** Posponer compras no críticas hasta regreso Liced

---

#### Día 15 Vacaciones (Dos Semanas Después)

**Liced regresa:**
- Backlog: 12 requisiciones pendientes
- 8 facturas sin registrar (proveedores molestos por retraso pago)
- 3 compras críticas estancadas >30 días (afectan cronograma obra)

**Liced trabaja 60 horas esa semana** (incluyendo fin de semana) para ponerse al día

**Costo:**
- Retrasos obra: ~$5,000,000 (penalties cronograma)
- Proveedores molestos: Relación dañada
- Burnout Liced: Riesgo renuncia
- **Lección:** Dependencia crítica de 1 persona es riesgo existencial

---

### DESPUÉS: Sistema Automatizado (Proceso Continúa Sin Liced)

#### Día 1 Vacaciones Liced (Lunes) - Sistema Operando

**8:00 AM - Liced no llega, pero sistema sí**

Email automático a Jefe Compras:
```
Resumen Diario Compras - 23 Ene 2026

ALERTAS CRÍTICAS (requieren acción hoy):
- Ninguna

COMPRAS EN RIESGO (>20 días sin avanzar):
- Compra #1240: Acero PTAR (25 días en "Cotización pendiente")
  Acción sugerida: Llamar proveedor ABC Aceros, contacto: Juan Pérez +57 XXX

TAREAS PENDIENTES HOY:
- 2 entregas programadas (confirmar con almacén)
- 1 certificado calidad vence mañana (solicitar a proveedor)

REQUISICIONES NUEVAS:
- Ninguna

Dashboard actualizado: [Ver Aquí]

Sistema Contecsa IA
```

**9:00 AM - Jefe Compras asigna tareas**
- Auxiliar 1: Confirmar entregas almacén (sistema envió lista)
- Auxiliar 2: Seguimiento compra #1240 (sistema dio contacto proveedor)

**10:00 AM - Primera requisición nueva (Cemento PTAR)**
- Obra envía email requisición
- Sistema detecta, crea borrador compra automáticamente
- **Sugiere proveedores:** Basado en histórico SICOM (3 proveedores mejores
  precio/calidad cemento)
- Email Jefe Compras: "Nueva requisición #R-456, proveedores sugeridos: XYZ Cementos
  ($180K/ton), ABC Materiales ($185K/ton), DEF Construcción ($190K/ton). Aprobar?"

**10:15 AM - Jefe aprueba**
- Clic "Aprobar XYZ Cementos"
- Sistema envía email automático solicitud cotización a XYZ
- **Resultado:** Proceso avanza sin Liced

---

#### Día 3 Vacaciones (Miércoles) - Cero Backlog

**Situación:**
- 3 requisiciones procesadas (sistema sugirió proveedores)
- 2 facturas registradas (OCR automático)
- 1 orden compra aprobada (Jefe clic en dashboard)
- **Cero retrasos**

**Jefe Compras NO llama Liced** (no necesario)

---

#### Día 15 Vacaciones - Liced Regresa Relajada

**Liced regresa:**
- Revisa dashboard: Todo al día
- Lee resumen 15 días (generado automáticamente):
  - 12 requisiciones procesadas
  - 8 facturas registradas
  - 3 compras cerradas
  - Cero incidentes críticos

**Liced (sorprendida):** "¿Cómo lograron todo sin mí?"
**Jefe:** "El sistema hizo tu trabajo. Ahora puedes enfocarte en tareas estratégicas"

**Nuevo rol Liced:**
- Supervisión (no ejecución manual)
- Negociación proveedores (mejores precios)
- Optimización procesos (análisis datos sistema)
- **Trabajo 50% menos estresante, 2x más estratégico**

---

### Valor Cuantificado Caso 2

| Métrica | Manual (Sin Liced) | Automatizado | Mejora |
|---------|-------------------|--------------|--------|
| **Requisiciones procesadas** | 0-2 (paralizado) | 12 (normal) | **600% productividad** |
| **Backlog al regresar** | 12 pendientes | 0 pendientes | **Eliminado** |
| **Horas extra Liced** | 20 horas (catch-up) | 0 horas | **$300K ahorrados** |
| **Retrasos obra** | $5M (penalties) | $0 | **$5M ahorrados** |
| **Riesgo burnout** | Alto | Bajo | **Retención talento** |
| **Continuidad negocio** | Paralizado | Operativo | **100% continuidad** |

**Valor anual:** $8,750,000 COP (riesgo operacional amortizado + eficiencia)

---

## Caso de Uso 3: Dashboard Gerencia (Decisiones Ágiles)

### Contexto

**Situación:** CEO necesita presentar KPIs compras a junta directiva (reunión mañana 8 AM)

**Hoy es:** Martes 6 PM

---

### ANTES: Reporte Manual (4 Horas + Estrés)

#### Martes 6:00 PM - CEO llama Liced

**CEO:** "Necesito reporte consolidado compras Q1 para junta mañana. Top proveedores,
gasto vs presupuesto, compras en riesgo, proyección Q2."

**Liced:** "Okay, lo preparo esta noche" (suspiro interno)

---

#### Martes 6:30 PM - Liced inicia trabajo manual

**Paso 1: Exportar datos Excel (30 min)**
- Abre "Control Compras 2025" (55 filas × 28 columnas = 1,540 celdas)
- Filtra por Q1 (Ene-Mar)
- Copia a nuevo Excel "Reporte Gerencia Q1"

**Paso 2: Calcular top proveedores (45 min)**
- Tabla dinámica manual
- Suma gastos por proveedor
- Ordena descendente
- Top 5: ABC Concretos $85M, XYZ Acero $62M, DEF Cemento $48M, etc.

**Paso 3: Gasto vs presupuesto (1 hora)**
- Consultar presupuesto aprobado Q1 (busca email CFO de diciembre)
- Presupuesto: $500M
- Ejecutado: Suma manual Excel = $362M
- Diferencia: $138M disponible (72% ejecutado)
- Crear gráfica barras manual (Excel básico)

**Paso 4: Compras en riesgo (45 min)**
- Revisar 55 compras manualmente una por una
- Criterio: >30 días en mismo estado
- Identifica: 8 compras en riesgo
- Lista con observaciones

**Paso 5: Proyección Q2 (1 hora)**
- Basado en consumo Q1, extrapolar Q2
- Cálculo manual: Si Q1 = $362M, entonces Q2 ≈ $380M (asume +5% inflación)
- **No tiene datos históricos fáciles** para validar (requeriría SICOM)

---

#### Martes 11:00 PM - Liced termina reporte

**Liced envía email CEO:**
```
Asunto: Reporte Compras Q1 - Junta Directiva

Adjunto archivo Excel con:
- Top 5 proveedores (gasto Q1)
- Gasto vs presupuesto (72% ejecutado)
- 8 compras en riesgo (detalle)
- Proyección Q2 ($380M estimado)

Cualquier duda, estoy disponible mañana temprano.
```

**Liced a casa: 11:30 PM** (5 horas trabajo después de horario, agotada)

---

#### Miércoles 8:00 AM - Reunión Junta

**CEO presenta Excel Liced**
- Junta: "¿Por qué ABC Concretos es top proveedor? ¿Tenemos mejor precio?"
- CEO: "No tengo comparativa precios históricos aquí"
- Junta: "¿Proyección Q2 considera proyectos nuevos?"
- CEO: "Creo que no, es extrapolación lineal"

**Decisión junta:** "Queremos dashboards tiempo real, no reportes manuales obsoletos
al día siguiente"

---

### DESPUÉS: Dashboard Tiempo Real (1 Minuto)

#### Martes 6:00 PM - CEO abre laptop

**CEO navega:** sistema-contecsa.com/dashboard/gerencia

**Login:** Google Workspace SSO (1 clic, ya autenticado)

---

#### Martes 6:01 PM - Dashboard Carga (Tiempo Real)

**Pantalla principal:**

```
┌─────────────────────────────────────────────────────────────┐
│  DASHBOARD GERENCIA - Q1 2026                               │
│  Actualizado: 6:00:12 PM (tiempo real)                      │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────┬──────────────────────┬──────────────┐
│  GASTO TOTAL Q1      │  PRESUPUESTO         │  DISPONIBLE  │
│  $362,450,000        │  $500,000,000        │  $137,550,000│
│  ▓▓▓▓▓▓▓░░░ 72.5%   │                      │  27.5%       │
└──────────────────────┴──────────────────────┴──────────────┘

┌──────────────────────────────────────────────────────────────┐
│  TOP 5 PROVEEDORES (Q1 2026)                                 │
│                                                              │
│  1. ABC Concretos        $85,200,000  ████████████ (23.5%)  │
│  2. XYZ Acero           $62,800,000  █████████ (17.3%)      │
│  3. DEF Cemento         $48,900,000  ███████ (13.5%)        │
│  4. GHI Materiales      $38,500,000  ██████ (10.6%)         │
│  5. JKL Transporte      $29,100,000  ████ (8.0%)            │
│                                                              │
│  [Ver Comparativa Precios] [Ver Histórico 24 meses]         │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  ALERTAS CRÍTICAS                                            │
│                                                              │
│  ⚠️  8 compras >30 días sin avanzar (riesgo cronograma)     │
│  ⚠️  3 certificados calidad pendientes (compliance)         │
│  ℹ️  12 entregas programadas próximos 7 días               │
│                                                              │
│  [Ver Detalle Compras en Riesgo]                            │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  PROYECCIÓN Q2 2026 (IA-Powered)                            │
│                                                              │
│  Gasto proyectado:  $385,000,000 ± $15M                     │
│  Basado en:                                                  │
│  - Consumo Q1 ($362M)                                        │
│  - Inflación proyectada (4.8% Colombia 2026)                │
│  - Proyectos nuevos confirmados (+2 consorcios)             │
│  - Histórico Q1 vs Q2 últimos 3 años (+6.3% promedio)       │
│                                                              │
│  [Ver Escenarios] [Export PDF]                              │
└──────────────────────────────────────────────────────────────┘

[Consultar IA] [Export PDF Junta] [Configurar Alertas]
```

---

#### Martes 6:02 PM - CEO hace pregunta IA

**CEO escribe en chat:** "¿Por qué ABC Concretos es nuestro top proveedor? ¿Tenemos
mejor precio?"

**IA responde (8 segundos):**
```
ABC Concretos es el proveedor #1 en Q1 2026 por volumen ($85.2M), representando 23.5%
del gasto total. Sin embargo, NO es el más competitivo en precio:

COMPARATIVA PRECIO CONCRETO 3000 PSI (últimos 6 meses):
- ABC Concretos: $285,000/m³ (actual)
- XYZ Materiales: $275,000/m³ (-3.5%)
- DEF Construcción: $270,000/m³ (-5.3%)

AHORRO POTENCIAL si cambia a DEF Construcción:
- Volumen Q1: 300 m³
- Ahorro: $15,000/m³ × 300 = $4,500,000 COP

RECOMENDACIÓN: Negociar con ABC Concretos precio competitivo ($270-275K) o diversificar
a DEF Construcción para próximas órdenes.

[Ver Gráfica Comparativa] [Ver Histórico ABC]
```

**CEO:** "Perfecto, eso presento mañana" (toma screenshot)

---

#### Martes 6:05 PM - Export PDF

**CEO clic "Export PDF Junta"**

Sistema genera automáticamente:
- Portada corporativa
- 4 páginas con gráficas HD
- Tabla top proveedores
- Compras en riesgo detalladas
- Proyección Q2 con supuestos
- Pie de página: "Generado 22 Ene 2026 6:05 PM - Datos tiempo real"

**CEO descarga PDF** (listo para proyector junta)

---

#### Martes 6:06 PM - CEO cierra laptop

**Total tiempo:** 6 minutos (vs 5 horas Liced)

**Liced:** A casa 6:30 PM (horario normal, no llamadas urgentes)

---

#### Miércoles 8:00 AM - Reunión Junta

**CEO presenta dashboard (proyecta PDF)**

**Junta pregunta:** "¿Proyección Q2 considera proyectos nuevos?"
**CEO:** "Sí, IA consideró 2 consorcios nuevos confirmados. Aquí supuestos..." (muestra
slide)

**Junta pregunta:** "¿Podemos ver consumo cemento específicamente?"
**CEO:** "Dame 10 segundos..." (abre dashboard en laptop, pregunta IA, proyecta respuesta)

**Junta:** "Impresionante, esto sí es gestión data-driven"

---

### Valor Cuantificado Caso 3

| Métrica | Manual | Automatizado | Mejora |
|---------|--------|--------------|--------|
| **Tiempo generar reporte** | 5 horas | 6 minutos | **50x más rápido** |
| **Costo oportunidad Liced** | $75,000 (5h × $15K/h) | $1,500 (6min × $15K/h) | **$73,500 ahorrados** |
| **Horario trabajo** | 11 PM (burnout) | 6 PM (normal) | **Calidad vida** |
| **Frecuencia reportes** | Mensual (costoso) | Diario/On-demand (gratis) | **30x más frecuente** |
| **Calidad insights** | Básico (sumas) | Avanzado (IA comparativas) | **Decisiones mejores** |
| **Datos actualizados** | Desfasados (day-old) | Tiempo real (<5 min) | **Precisión 100%** |

**Valor anual (8 reportes/año):** $588,000 COP + valor intangible mejores decisiones

---

## Resumen Casos de Uso

### Impacto Consolidado

| Caso de Uso | Beneficio Principal | Valor Anual |
|-------------|---------------------|-------------|
| 1. Prevención Sobrecobro | Elimina pérdidas financieras | $24,000,000 |
| 2. Liberación Liced | Continuidad negocio + eficiencia | $8,750,000 |
| 3. Dashboard Gerencia | Decisiones ágiles + autonomía | $5,000,000 |
| **TOTAL** | | **$37,750,000** |

**Nota:** Total NO incluye otros beneficios (compliance $15M, multi-consorcio $43.45M,
eficiencia adicional $13.1M). Ver [ROI](06-roi-analisis-financiero.md) para consolidado
completo.

---

## Adopción y Curva de Aprendizaje

### Timeline Realista

| Semana | Usuario Promedio | Liced/Power Users | Gerencia |
|--------|------------------|-------------------|----------|
| 1 | Exploración básica | Exploración avanzada | Dashboards solo lectura |
| 2 | Uso diario limitado | Uso diario completo | Consultas IA básicas |
| 3-4 | Uso diario completo | Customización | Consultas IA avanzadas |
| 8+ | Experto (enseña otros) | Trainer interno | Champion (evangeliza) |

**Capacitación incluida:** 20 horas (suficiente para 8-10 usuarios)

---

**Siguiente sección:** [09 - Equipo Neero y Casos de Éxito](09-equipo-neero.md)
