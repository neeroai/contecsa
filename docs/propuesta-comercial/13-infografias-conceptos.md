# Especificaciones Infografías (Para Diseñador Gráfico)

Version: 1.0 | Date: 2025-12-23 00:30 | Owner: Neero SAS | Status: Propuesta Comercial

[Confidencial - Solo uso interno Contecsa S.A.S.]

**AUDIENCIA:** Diseñador gráfico externo (NO técnico)
**OBJETIVO:** Crear 7 infografías conceptuales para propuesta comercial Contecsa
**FORMATO:** Descripción detallada + wireframes ASCII + specs técnicas
**LENGUAJE:** NO técnico (ejecutivos construcción, no IT)

---

## Paleta Colores Corporativa Neero

**Colores primarios:**
```
Primary Blue:   #0066CC (Confianza, tecnología)
Success Green:  #00CC66 (Éxito, crecimiento)
Alert Orange:   #FF6600 (Innovación, alertas críticas)
```

**Colores neutrales:**
```
Dark Text:      #333333
Light Bg:       #F5F5F5
White:          #FFFFFF
```

**Colores semánticos (sistema):**
```
Crítico:  #DC3545 (Rojo - alertas bloqueantes)
Alto:     #FFC107 (Amarillo - requiere atención)
Medio:    #28A745 (Verde - normal)
Bajo:     #6C757D (Gris - informativo)
```

---

## Tipografía

**Fuente recomendada:** Inter (Google Fonts - sin costo)
- Headlines: Inter Bold, 24-32pt
- Body: Inter Regular, 11-12pt
- Captions: Inter Light, 9-10pt

**Alternativa:** Roboto, Open Sans (si Inter no disponible)

---

## Infografía 1: Antes vs Después

### Objetivo

Contrastar proceso manual actual (caos) vs sistema automatizado (orden), enfatizando
impacto emocional y cuantificado.

### Concepto Visual

**Split screen 50/50 horizontal**

```
┌────────────────────────┬────────────────────────┐
│      ANTES             │      DESPUÉS           │
│   (Proceso Manual)     │  (Sistema IA Neero)    │
├────────────────────────┼────────────────────────┤
│                        │                        │
│  [Imagen caos]         │  [Imagen orden]        │
│  Excel, papeles,       │  Dashboard limpio,     │
│  Liced estresada,      │  equipo relajado,      │
│  Post-its everywhere   │  gráficas automáticas  │
│                        │                        │
├────────────────────────┼────────────────────────┤
│ 📊 MÉTRICAS ANTES:     │ 📊 MÉTRICAS DESPUÉS:   │
│                        │                        │
│ ⏱️ 85 horas/mes        │ ⏱️ 15 horas/mes        │
│    trabajo manual      │    (80% reducción)     │
│                        │                        │
│ ⚠️ 60 días             │ ⚠️ <1 minuto           │
│    detectar sobrecobro │    (detección auto)    │
│                        │                        │
│ 👤 1 persona           │ 👥 Todo el equipo      │
│    (dependencia Liced) │    (autónomo)          │
│                        │                        │
│ 😰 Estrés alto         │ 😊 Equipo relajado     │
│    (burnout riesgo)    │    (trabajo estratég.) │
│                        │                        │
│ 💰 $130M/año           │ 💰 $130M/año           │
│    pérdidas ocultas    │    ahorrados           │
└────────────────────────┴────────────────────────┘
```

### Especificaciones Técnicas

| Elemento | Valor |
|----------|-------|
| **Dimensiones** | 1920 × 1080 px (16:9, presentación) |
| **DPI** | 300 (print quality) |
| **Formato entrega** | PNG transparente + PDF vectorial |
| **Colores ANTES** | Grises (#6C757D), rojos (#DC3545) - Caos |
| **Colores DESPUÉS** | Azules (#0066CC), verdes (#00CC66) - Orden |
| **Iconos** | Material Icons o Font Awesome (consistentes) |

### Texto Exacto a Usar

**Headline (centrado arriba):**
```
Transformación Digital Contecsa: Proceso Manual → Sistema IA
```

**Columna ANTES (izquierda):**
```
ANTES: Proceso Manual
• 85 horas/mes trabajo administrativo
• 60 días detectar sobrecobros
• Dependencia crítica 1 persona (Liced)
• Estrés equipo (burnout)
• $130M COP/año pérdidas ocultas
```

**Columna DESPUÉS (derecha):**
```
DESPUÉS: Sistema IA Neero
• 15 horas/mes (80% reducción)
• <1 minuto detección automática
• Equipo autónomo (cero dependencia)
• Trabajo estratégico (sin estrés)
• $130M COP/año ahorrados
```

### Notas para Diseñador

- **Emocional:** Lado izquierdo "pesado" visualmente (caos), derecho "limpio" (orden)
- **Iconos:** Usar emojis sutiles (⏱️ ⚠️ 👤 😰 💰) para escaneo rápido
- **Contraste:** ANTES oscuro/denso, DESPUÉS luminoso/espaciado
- **Foco:** Destacar "$130M/año" ambos lados (rojo izquierda, verde derecha)

---

## Infografía 2: Arquitectura Simplificada (4 Capas)

### Objetivo

Explicar cómo funciona el sistema SIN tecnicismos, usando metáforas visuales familiares
(usuarios → cerebro → memoria → conexión legacy).

### Concepto Visual

**4 capas verticales con flujo de arriba a abajo**

```
┌─────────────────────────────────────────────────────────────┐
│  CAPA 1: USUARIOS (¿Quién Usa?)                            │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐        │
│  │Geren │  │Compras│  │Contab│  │Técnico│  │Almacén│       │
│  │cia   │  │       │  │ilidad│  │       │  │       │       │
│  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘        │
│  Icono: 👔          💼         💵         🔧         📦     │
│  Acceso: Navegador web (Chrome, Edge, Safari)              │
└─────────────────────────────────────────────────────────────┘
                          ↓ ↑
                  (Pregunta / Respuesta)
                          ↓ ↑
┌─────────────────────────────────────────────────────────────┐
│  CAPA 2: INTELIGENCIA ARTIFICIAL (Cerebro)                 │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  🧠 Agente Conversacional                            │  │
│  │  "¿Cuánto gastamos combustible Q1?" → Responde      │  │
│  │  Genera gráficas automáticamente                    │  │
│  └─────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  🚨 Detector Anomalías Precios                      │  │
│  │  Sobrecobro >10% → BLOQUEO + Alerta <1 minuto      │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ↓ ↑
              (Consulta / Almacena Datos)
                          ↓ ↑
┌─────────────────────────────────────────────────────────────┐
│  CAPA 3: MOTOR DE DATOS (Memoria)                          │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  💾 Base Datos Centralizada                         │  │
│  │  • 55 compras activas + histórico 5 años           │  │
│  │  • Facturas, certificados, proveedores             │  │
│  │  • Consultas <1 segundo (vs horas manual)          │  │
│  │  • Backups automáticos diarios                     │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ↓ ↑
             (Sync automática cada noche)
                          ↓ ↑
┌─────────────────────────────────────────────────────────────┐
│  CAPA 4: INTEGRACIÓN SICOM (Sistema Legacy)                │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  🔌 Conector SICOM (Solo Lectura)                  │  │
│  │  • Extrae histórico precios, proveedores, consumos │  │
│  │  • NUNCA modifica SICOM (solo lee)                 │  │
│  │  • Proceso automático 2 AM cada día                │  │
│  └─────────────────────────────────────────────────────┘  │
│             ↓                                               │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  🏢 SICOM (Años 70-80)                             │  │
│  │  Sistema oficial Contecsa (intacto)                │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Especificaciones Técnicas

| Elemento | Valor |
|----------|-------|
| **Dimensiones** | 1080 × 1920 px (9:16, vertical óptimo) |
| **DPI** | 300 |
| **Formato** | PNG + PDF vectorial |
| **Flechas** | Bidireccionales (↓↑), color #0066CC |
| **Capas separadas** | 20px padding entre cada capa |

### Texto Exacto

**Headline:**
```
Arquitectura Sistema Contecsa IA: 4 Capas Simples
```

**Capa 1 (arriba):**
```
USUARIOS: Acceso dashboard por rol (Gerencia, Compras, Contabilidad...)
Dispositivos: Web, tablet, celular | Login: Google Workspace
```

**Capa 2:**
```
INTELIGENCIA ARTIFICIAL: Agente conversacional + Detector anomalías
Previene Caso Cartagena: Sobrecobro >10% bloqueado automáticamente
```

**Capa 3:**
```
MOTOR DE DATOS: Almacena compras, facturas, histórico 5 años
Consultas <1 segundo | Backups diarios | Siempre disponible
```

**Capa 4 (abajo):**
```
INTEGRACIÓN SICOM: Solo lectura (NUNCA modifica)
Sync automática nocturna | SICOM sigue siendo sistema oficial
```

### Notas Diseñador

- **Simplicidad:** Evitar jerga técnica (PostgreSQL, API, etc.)
- **Iconos:** Emojis grandes (🧠 🚨 💾 🔌 🏢) para identidad visual
- **Flujo:** Flechas claras arriba↔abajo (usuario pregunta → sistema responde)
- **Color coding:** Cada capa color diferente (azul, verde, naranja, gris)

---

## Infografía 3: Flujo Prevención Caso Cartagena

### Objetivo

Demostrar VELOCIDAD detección (60 días → <1 minuto) mediante timeline visual dramático.

### Concepto Visual

**Timeline horizontal con 6 pasos + comparativa ANTES/DESPUÉS**

```
┌─────────────────────────────────────────────────────────────────┐
│  Prevención Caso Cartagena: Detección Automática Sobrecobros   │
└─────────────────────────────────────────────────────────────────┘

PASO 1: Factura Llega
  ⏱️ 9:00 AM
  📧 Proveedor envía email PDF
  [Icono: email con PDF adjunto]

PASO 2: OCR Extrae Datos
  ⏱️ 9:00:15 AM (15 segundos)
  🤖 IA lee PDF automáticamente
  [Icono: scanner inteligente]
  Extrae: Proveedor, Material, Precio

PASO 3: Validación Histórico
  ⏱️ 9:00:45 AM (30 segundos)
  📊 Compara vs 5 años precios
  [Gráfica mini: $350K vs promedio $280K]
  Cálculo: +25% variación

PASO 4: Detección Anomalía
  ⏱️ 9:00:50 AM (5 segundos)
  🚨 >10% threshold → BLOQUEADO
  [Icono: Stop sign rojo]

PASO 5: Alerta Inmediata
  ⏱️ 9:01:00 AM (10 segundos)
  ✉️ Email Gerencia + Jefe Compras
  [Pantalla email con gráfica adjunta]
  "CRÍTICO: Sobrecobro +25% detectado"

PASO 6: Decisión Gerencia
  ⏱️ 9:15 AM (14 minutos)
  📞 Jefe llama proveedor
  "¿Por qué +25%?"
  Proveedor corrige error

┌─────────────────────────────────────────────────────────────────┐
│  COMPARATIVA DRAMÁTICA:                                         │
│                                                                 │
│  ANTES (Manual):                                                │
│  ├─ 60 DÍAS hasta detección                                   │
│  ├─ $7M pagados de más (recuperados después)                  │
│  └─ 9 horas trabajo equipo                                     │
│                                                                 │
│  DESPUÉS (Sistema IA):                                          │
│  ├─ <1 MINUTO detección automática                            │
│  ├─ $7M ahorrados (nunca se pagó)                             │
│  └─ 30 minutos trabajo equipo                                  │
│                                                                 │
│  RESULTADO: 86,400x más rápido | $7M ahorrados                │
└─────────────────────────────────────────────────────────────────┘
```

### Especificaciones Técnicas

| Elemento | Valor |
|----------|-------|
| **Dimensiones** | 1920 × 1080 px (horizontal timeline óptimo) |
| **Timeline** | Flechas →  conectando 6 pasos |
| **Timestamps** | Bold, color #0066CC, tamaño 14pt |
| **Comparativa** | Tabla al final, fondo gris claro #F5F5F5 |
| **Énfasis** | "86,400x" y "$7M" en grande, color verde #00CC66 |

### Texto Exacto

**Headline:**
```
Prevención Caso Cartagena: De 60 Días a <1 Minuto
```

(Resto de texto en wireframe arriba)

### Notas Diseñador

- **Drama:** Timeline comprimida visualmente (mostrar velocidad)
- **Contraste:** ANTES rojo/grande vs DESPUÉS verde/compacto
- **Foco:** "86,400x más rápido" es el hero number (destacar mucho)

---

## Infografía 4: Workflow 7 Etapas Compras

### Objetivo

Explicar proceso automatizado compra desde solicitud hasta cierre, enfatizando alertas
automáticas en cada etapa.

### Concepto Visual

**Flowchart vertical con 7 etapas + panel lateral estadísticas tiempo real**

```
┌─────────────────────────────────────┬──────────────────────┐
│  WORKFLOW 7 ETAPAS                  │  TIEMPO REAL         │
│                                     │                      │
│  1️⃣ SOLICITUD                      │  📊 ESTADO ACTUAL   │
│  ├─ Obra envía requisición         │  55 compras activas  │
│  ├─ Sistema crea borrador auto     │                      │
│  └─ Alerta: Jefe Compras aprobar  │  ✅ 38 en proceso   │
│      ⏱️ SLA: 24 horas              │  ⚠️ 3 en riesgo     │
│                ↓                    │  🔴 14 cerradas/mes │
│                                     │                      │
│  2️⃣ COTIZACIÓN                     │  ⏱️ TIEMPO PROMEDIO │
│  ├─ Sistema sugiere 3 proveedores  │  • Solicitud→Cierre:│
│  ├─ Basado en histórico (mejor $)  │    15 días (vs 25)  │
│  └─ Alerta: Proveedor no responde │  • Ahorro: 40%      │
│      ⏱️ >5 días                    │                      │
│                ↓                    │  📈 TENDENCIA       │
│                                     │  Compras/mes: ↑12%  │
│  3️⃣ ORDEN COMPRA                   │  Tiempo ciclo: ↓40% │
│  ├─ Jefe aprueba (1 clic)          │                      │
│  ├─ PDF generado automáticamente   │                      │
│  └─ Email proveedor con orden      │                      │
│                ↓                    │                      │
│                                     │                      │
│  4️⃣ FACTURA                        │                      │
│  ├─ OCR extrae datos PDF           │                      │
│  ├─ Validación precio histórico    │                      │
│  └─ BLOQUEO si >10% variación     │                      │
│      ⚠️ Alerta crítica            │                      │
│                ↓                    │                      │
│                                     │                      │
│  5️⃣ ENTREGA                        │                      │
│  ├─ Notificación almacén           │                      │
│  ├─ Confirmación app móvil (foto)  │                      │
│  └─ BLOQUEO: No pago sin confirmar│                      │
│                ↓                    │                      │
│                                     │                      │
│  6️⃣ CERTIFICADO CALIDAD            │                      │
│  ├─ Solicitud automática proveedor │                      │
│  ├─ Técnico revisa y aprueba       │                      │
│  └─ BLOQUEO: No cierre sin cert.  │                      │
│      ⚠️ Alerta vencimiento        │                      │
│                ↓                    │                      │
│                                     │                      │
│  7️⃣ PAGO Y CIERRE                  │                      │
│  ├─ Todas validaciones ✓           │                      │
│  ├─ Contabilidad programa pago     │                      │
│  └─ Compra CERRADA (métricas)     │                      │
│                                     │                      │
└─────────────────────────────────────┴──────────────────────┘
```

### Especificaciones Técnicas

| Elemento | Valor |
|----------|-------|
| **Dimensiones** | 1920 × 1200 px (layout dual columna) |
| **Flowchart** | Flechas verticales ↓, color azul #0066CC |
| **Alertas** | Iconos ⚠️🔴⏱️ rojos/naranjas (destacados) |
| **Panel lateral** | Fondo gris claro, métricas actualizables |
| **Etapas** | Emojis numerados 1️⃣-7️⃣ grandes |

### Texto Exacto

(Ver wireframe arriba - texto completo)

### Notas Diseñador

- **Automatización:** Destacar "automático" en cada etapa (verde)
- **Alertas:** Destacar "BLOQUEO" en rojo (crítico para calidad)
- **Panel lateral:** Números grandes, actualización "tiempo real" (efecto moderno)

---

## Infografía 5: ROI Timeline 36 Meses

### Objetivo

Mostrar inversión vs beneficios acumulados en gráfico línea, enfatizando payback 7.3 meses
y crecimiento exponencial valor.

### Concepto Visual

**Gráfico de líneas con dos series + tabla resumen**

```
┌──────────────────────────────────────────────────────────────┐
│  ROI Timeline: Inversión vs Beneficios (36 Meses)           │
└──────────────────────────────────────────────────────────────┘

$200M ┤                                         ╱╱╱ BENEFICIOS
      │                                     ╱╱╱╱    (verde)
      │                                 ╱╱╱╱
$150M ┤                             ╱╱╱╱
      │                         ╱╱╱╱
      │                     ╱╱╱╱
$100M ┤ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━  INVERSIÓN (rojo)
      │                 ╱╱              (plana después mes 12)
      │             ╱╱╱
 $50M ┤         ╱╱╱       ⭐ PAYBACK MES 7.3
      │     ╱╱╱
      │ ╱╱╱
   $0 ┼─────────────────────────────────────────────────────→
      0   3   6   9   12  15  18  21  24  27  30  33  36
                        MESES

┌──────────────────────────────────────────────────────────────┐
│  RESUMEN FINANCIERO:                                         │
│                                                              │
│  Inversión Total Año 1:     $129.3M COP                     │
│  Beneficios Año 1:          $130.3M COP                     │
│  ─────────────────────────────────────────────────────────  │
│  ROI Año 1:                 0.8%                            │
│  ROI Año 2:                 75.1%                           │
│  ROI Año 3:                 189.5% ⭐                       │
│  ─────────────────────────────────────────────────────────  │
│  Payback:                   7.3 meses                       │
│  NPV 5 años:                $304.8M COP                     │
│  Ratio beneficio:costo:     3.8:1                           │
└──────────────────────────────────────────────────────────────┘
```

### Especificaciones Técnicas

| Elemento | Valor |
|----------|-------|
| **Dimensiones** | 1920 × 1440 px (gráfico + tabla) |
| **Línea Inversión** | Roja #DC3545, grosor 3px, plana después mes 12 |
| **Línea Beneficios** | Verde #00CC66, grosor 3px, curva ascendente |
| **Payback marker** | Estrella ⭐ amarilla #FFC107 en intersección |
| **Grid** | Gris claro #E0E0E0, cada $50M y 3 meses |
| **Tabla** | Fondo blanco, bordes grises, números bold |

### Texto Exacto

(Ver wireframe arriba)

### Notas Diseñador

- **Intersección:** Payback mes 7.3 es punto focal (estrella grande)
- **Crecimiento:** Línea verde acelera visual (curva exponencial)
- **Tabla:** Números ROI año 3 (189.5%) más grandes (hero metric)

---

## Infografía 6: Dashboards por Rol (6 Mockups)

### Objetivo

Mostrar que cada usuario ve solo información relevante mediante 6 mockups wireframe
dashboards específicos por rol.

### Concepto Visual

**Grid 2×3 con 6 mockups low-fidelity**

```
┌──────────────────────┬──────────────────────┬──────────────────────┐
│  1. GERENCIA         │  2. JEFE COMPRAS     │  3. AUXILIAR COMPRAS │
│                      │                      │                      │
│  ┌────────────────┐  │  ┌────────────────┐  │  ┌────────────────┐  │
│  │ KPIs Ejecutivos│  │  │ 55 Compras     │  │  │ Mis Tareas Hoy │  │
│  │ ━━━━━━━━━━━━━  │  │  │ ▓▓▓░░░░░░      │  │  │ • Factura #123 │  │
│  │ Gasto: $362M   │  │  │ ✅38 ⚠️3 🔴14 │  │  │ • Confirmar XX │  │
│  │ vs $500M (72%) │  │  │                │  │  │ • Llamar prov  │  │
│  │                │  │  │ Top Proveedores│  │  │                │  │
│  │ [Gráfica pizza]│  │  │ 1. ABC $85M    │  │  │ [Lista checks] │  │
│  │ PAVI 41.8%     │  │  │ 2. XYZ $62M    │  │  │                │  │
│  │ EDUB 14.5%     │  │  │ 3. DEF $48M    │  │  │ Compras cerr:7 │  │
│  │                │  │  │                │  │  │ Tiempo prom:12d│  │
│  └────────────────┘  │  └────────────────┘  │  └────────────────┘  │
│                      │                      │                      │
├──────────────────────┼──────────────────────┼──────────────────────┤
│  4. CONTABILIDAD     │  5. TÉCNICO/OBRA     │  6. ALMACÉN          │
│                      │                      │                      │
│  ┌────────────────┐  │  ┌────────────────┐  │  ┌────────────────┐  │
│  │ Facturas Pend. │  │  │ Certificados   │  │  │ Entregas Semana│  │
│  │ • #123 $35M ✓  │  │  │ • Cemento ✓    │  │  │ Lun: Cemento   │  │
│  │ • #124 $8M 🔴  │  │  │ • Concreto ⚠️  │  │  │ Mar: Acero     │  │
│  │   (bloqueado)  │  │  │ • Acero ⏳     │  │  │ Jue: Concreto  │  │
│  │                │  │  │                │  │  │                │  │
│  │ Presupuesto    │  │  │ Consumos Obra  │  │  │ Confirmar:     │  │
│  │ [Gráfica barr] │  │  │ [Gráfica línea]│  │  │ [ ] Cemento    │  │
│  │ PAVI: 72% ejec.│  │  │ Cemento: 850ton│  │  │ [✓] Acero      │  │
│  └────────────────┘  │  └────────────────┘  │  └────────────────┘  │
└──────────────────────┴──────────────────────┴──────────────────────┘

DATOS REALES CONTECSA:
• 55 compras activas • 9 consorcios • $362M gastado Q1
• PAVICONSTRUJC 41.8%, EDUBAR 14.5%, PTAR 10.9%
```

### Especificaciones Técnicas

| Elemento | Valor |
|----------|-------|
| **Dimensiones individuales** | 800 × 600 px cada mockup |
| **Grid total** | 1920 × 1800 px (6 mockups) |
| **Wireframe style** | Low-fidelity (cajas, líneas, iconos simples) |
| **Colores** | Gris claro fondo, azul headers, datos negros |
| **Separación** | 20px padding entre mockups |

### Texto Exacto

(Ver wireframe arriba - cada mockup tiene texto específico)

### Notas Diseñador

- **Baja fidelidad:** NO diseño final, solo concepto (wireframe)
- **Datos reales:** Usar números Contecsa (55 compras, 9 consorcios, etc.)
- **Diferenciación:** Cada dashboard visualmente distinto (por rol)

---

## Infografía 7: Beneficios Cuantificados (Donut Chart)

### Objetivo

Mostrar desglose beneficios año 1 ($130.3M) en gráfico pastel/donut visualmente impactante.

### Concepto Visual

**Donut chart con 5 segmentos + leyenda detallada**

```
┌────────────────────────────────────────────────────────────────┐
│  Beneficios Cuantificados Año 1: $130.3 Millones COP          │
└────────────────────────────────────────────────────────────────┘

                    ╱╲
                 ╱      ╲
              ╱            ╲
           ╱   $130.3M      ╲
          │                  │
          │    TOTAL         │
          │   BENEFICIOS     │
           ╲                ╱
              ╲            ╱
                 ╲      ╱
                    ╲╱

Segmentos (clockwise desde arriba):
1. Prevención Pérdidas (38.4%) - Verde oscuro #00CC66
   $50M COP/año
2. Multi-Consorcio (33.3%) - Azul #0066CC
   $43.45M COP/año
3. Compliance (11.5%) - Naranja #FF6600
   $15M COP/año
4. Eficiencia Operacional (10.1%) - Verde claro #7FDB7F
   $13.1M COP/año
5. Riesgo Dependencia (6.7%) - Amarillo #FFC107
   $8.75M COP/año

┌────────────────────────────────────────────────────────────────┐
│  LEYENDA DETALLADA:                                            │
│                                                                │
│  🟢 PREVENCIÓN PÉRDIDAS ($50M - 38.4%)                        │
│     • Caso Cartagena × 2/año evitado                          │
│     • Pagos duplicados bloqueados                             │
│     • Variaciones precio no negociadas detectadas             │
│                                                                │
│  🔵 ESCALABILIDAD MULTI-CONSORCIO ($43.45M - 33.3%)           │
│     • Sin costo adicional escalar 9→15 consorcios            │
│     • Proceso automatizado vs contratar personal              │
│                                                                │
│  🟠 COMPLIANCE Y CERTIFICADOS ($15M - 11.5%)                  │
│     • Certificados calidad 100% gestionados                   │
│     • Auditorías automáticas (sin multas)                     │
│                                                                │
│  🟢 EFICIENCIA OPERACIONAL ($13.1M - 10.1%)                   │
│     • 838 horas/año ahorradas (trabajo manual)                │
│     • Equipo enfocado en tareas estratégicas                  │
│                                                                │
│  🟡 MITIGACIÓN RIESGO DEPENDENCIA ($8.75M - 6.7%)             │
│     • Cero dependencia crítica 1 persona (Liced)              │
│     • Continuidad negocio garantizada                         │
└────────────────────────────────────────────────────────────────┘
```

### Especificaciones Técnicas

| Elemento | Valor |
|----------|-------|
| **Dimensiones** | 1920 × 1200 px (donut + leyenda) |
| **Donut center** | "$130.3M" en grande (48pt), bold |
| **Segmentos** | 5 colores distintos (ver arriba) |
| **Grosor donut** | 120px (anillo grueso) |
| **Leyenda** | Bullets con iconos emoji, texto 12pt |
| **Porcentajes** | Dentro segmentos si espacio, sino fuera |

### Texto Exacto

(Ver wireframe arriba - completo)

### Notas Diseñador

- **Centro focal:** "$130.3M TOTAL" es hero number (muy grande)
- **Color coding:** Consistente con marca Neero (verde éxito, azul tech, etc.)
- **Leyenda:** Texto conciso pero completo (CEO debe entender sin explicación)
- **Orden:** Segmentos más grandes primero (clockwise)

---

## Entrega Final

### Formatos Requeridos

**Para cada infografía:**
1. **PNG alta resolución** (300 DPI, transparente si aplica)
2. **PDF vectorial** (editable Adobe Illustrator/Inkscape)
3. **Fuentes embebidas** (si usa tipografías custom)

### Estructura Carpetas

```
/infografias-contecsa-neero/
├── 01-antes-despues.png
├── 01-antes-despues.pdf
├── 02-arquitectura-4-capas.png
├── 02-arquitectura-4-capas.pdf
├── 03-flujo-caso-cartagena.png
├── 03-flujo-caso-cartagena.pdf
├── 04-workflow-7-etapas.png
├── 04-workflow-7-etapas.pdf
├── 05-roi-timeline-36-meses.png
├── 05-roi-timeline-36-meses.pdf
├── 06-dashboards-6-roles.png
├── 06-dashboards-6-roles.pdf
├── 07-beneficios-donut-chart.png
├── 07-beneficios-donut-chart.pdf
└── README.txt (este documento resumen)
```

### Timeline Entrega

- **Briefing diseñador:** Día 1
- **Primera ronda mockups:** Día 3-4
- **Feedback Neero:** Día 5
- **Segunda ronda refinada:** Día 6-7
- **Entrega final:** Día 8-10

**TOTAL:** 10 días hábiles máximo

---

## Contacto Coordinación

**Project Manager Neero:**
Email: proyectos@neero.ai
WhatsApp: +57 XXX XXX XXXX

**Feedback/Aprobaciones:**
- Enviar mockups round 1 vía email (PNG preview)
- Reunión Zoom 1 hora para revisar juntos
- Entrega final vía WeTransfer o Google Drive

---

**Presupuesto estimado:** $5-8M COP (7 infografías profesionales)

**IMPORTANTE:** Estas infografías serán parte de propuesta $90M COP. Calidad enterprise
es crítica (impresión CEO/Gerencia).
