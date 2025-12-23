# Arquitectura Simplificada

Version: 1.0 | Date: 2025-12-23 00:25 | Owner: Neero SAS | Status: Propuesta Comercial

[Confidencial - Solo uso interno Contecsa S.A.S.]

**NOTA:** Este documento usa lenguaje NO técnico para audiencia Gerencia/CEO.
Para detalles técnicos completos, consultar documentación IT post-firma.

---

## Visión General: ¿Cómo Funciona el Sistema?

**Metáfora simple:** El sistema es como un **asistente digital inteligente** que:

1. **Observa** todo lo que pasa en compras (facturas, órdenes, pagos)
2. **Recuerda** histórico completo (5 años SICOM + datos nuevos)
3. **Piensa** usando inteligencia artificial (como ChatGPT, pero para Contecsa)
4. **Alerta** cuando algo no cuadra (sobrecobros, retrasos, certificados faltantes)
5. **Responde** preguntas en lenguaje natural ("¿Cuánto gastamos combustible Q1?")

**NO es magia. Es software moderno funcionando 24/7.**

---

## Diagrama Conceptual: 4 Capas

```
┌──────────────────────────────────────────────────────────────┐
│  CAPA 1: USUARIOS (Quién Usa el Sistema)                    │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Gerencia │  │  Compras │  │Contabilid│  │ Técnico/ │  │
│  │          │  │          │  │    ad    │  │  Almacén │  │
│  │ Dashboard│  │ Dashboard│  │ Dashboard│  │ Dashboard│  │
│  │  Ejecut. │  │ Operativ.│  │Financial │  │ Operativ.│  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                              │
│  Acceso: Navegador web (Chrome, Edge, Safari)               │
│  Login: Cuenta Google @contecsa.com (ya familiar)           │
│  Dispositivos: Computador, tablet, celular                  │
└──────────────────────────────────────────────────────────────┘
                            ↓ ↑
                  (Usuario pregunta, sistema responde)
                            ↓ ↑
┌──────────────────────────────────────────────────────────────┐
│  CAPA 2: INTELIGENCIA ARTIFICIAL (Cerebro del Sistema)      │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  AGENTE CONVERSACIONAL (Gemini 2.0 Flash - Google)    │ │
│  │                                                        │ │
│  │  • Entiende preguntas lenguaje natural (español)      │ │
│  │  • Genera gráficas automáticamente                    │ │
│  │  • Aprende de datos históricos Contecsa              │ │
│  │                                                        │ │
│  │  Ejemplo:                                             │ │
│  │  Usuario: "¿Cuánto gastamos cemento Q1?"             │ │
│  │  IA: Consulta datos → Calcula → Genera gráfica       │ │
│  │      "Q1 2026: $48.9M cemento (3 proveedores)"        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  DETECTOR DE ANOMALÍAS (Prevención Caso Cartagena)    │ │
│  │                                                        │ │
│  │  • Compara cada factura vs histórico 5 años          │ │
│  │  • Detecta variaciones precio >10%                   │ │
│  │  • Bloquea pago automáticamente                      │ │
│  │  • Envía alerta Gerencia + Jefe Compras              │ │
│  │                                                        │ │
│  │  Tiempo detección: <1 minuto (vs 60 días manual)     │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
                            ↓ ↑
              (IA consulta datos, almacena resultados)
                            ↓ ↑
┌──────────────────────────────────────────────────────────────┐
│  CAPA 3: MOTOR DE DATOS (Memoria del Sistema)               │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  BASE DE DATOS CENTRALIZADA                           │ │
│  │                                                        │ │
│  │  Almacena:                                            │ │
│  │  • Todas las compras (55 activas + histórico)        │ │
│  │  • Facturas (PDFs + datos extraídos OCR)             │ │
│  │  • Proveedores (38 actuales + histórico)             │ │
│  │  • Precios históricos (5 años desde SICOM)           │ │
│  │  • Certificados calidad (documentos GCS/S3)          │ │
│  │  • Alertas y notificaciones                          │ │
│  │                                                        │ │
│  │  Consultas rápidas: <1 segundo (vs horas SICOM)      │ │
│  │  Backups automáticos: Diarios (7 días retención)     │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  TECNOLOGÍA: PostgreSQL (base datos moderna, confiable)     │
│  HOSTING: Google Cloud / AWS (nube cliente, no Neero)       │
└──────────────────────────────────────────────────────────────┘
                            ↓ ↑
        (Sistema sincroniza con SICOM cada noche)
                            ↓ ↑
┌──────────────────────────────────────────────────────────────┐
│  CAPA 4: INTEGRACIÓN SICOM (Conexión Sistema Legacy)        │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  CONECTOR SICOM (Solo Lectura - NO Modifica)          │ │
│  │                                                        │ │
│  │  Proceso automático nocturno (2 AM cada día):         │ │
│  │  1. Conecta a SICOM                                   │ │
│  │  2. Extrae datos: Precios, proveedores, consumos     │ │
│  │  3. Transforma a formato moderno (fácil consultar)   │ │
│  │  4. Almacena en base datos centralizada (Capa 3)     │ │
│  │  5. Desconecta (sin dejar rastro)                    │ │
│  │                                                        │ │
│  │  CRÍTICO: Solo lectura, NUNCA modifica SICOM         │ │
│  │  (Sistema oficial sigue siendo SICOM intacto)        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│              ↓ Datos históricos (read-only)                 │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         SICOM (Sistema Legacy Años 70-80)              │ │
│  │                                                        │ │
│  │  • Pantalla negra (interface texto)                   │ │
│  │  • 5+ años histórico precios, proveedores, consumos   │ │
│  │  • Sistema oficial Contecsa (NO se modifica)          │ │
│  │  • Continúa operando independientemente               │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

---

## Flujos Principales (Sin Jerga Técnica)

### Flujo 1: Prevención Sobrecobro (Caso Cartagena Killer)

**Escenario:** Proveedor envía factura concreto $350K/m³ (histórico $280K)

```
PASO 1: Factura llega
├─ Proveedor envía email con PDF
├─ Sistema detecta email automáticamente (Gmail API)
└─ Descarga PDF factura

PASO 2: OCR extrae datos (15 segundos)
├─ Lee PDF con inteligencia artificial (Google Vision)
├─ Extrae: Proveedor, material, cantidad, precio
└─ Precisión: 99.2%

PASO 3: Validación automática precio (<30 segundos)
├─ Sistema consulta base datos: "¿Cuál precio histórico concreto?"
├─ Resultado: Promedio 24 meses = $280,000/m³
├─ Calcula: $350K - $280K = +25% variación
└─ Decisión: >10% → BLOQUEADO

PASO 4: Alerta inmediata (<1 minuto total)
├─ Email automático → Jefe Compras + Gerencia
├─ Asunto: [CRÍTICO] Sobrecobro Detectado - BLOQUEADO
├─ Contenido: Precio facturado vs histórico (gráfica adjunta)
└─ Acción requerida: Contactar proveedor

PASO 5: Jefe Compras actúa (15 minutos)
├─ Llama proveedor: "¿Por qué +25%?"
├─ Proveedor: "Error nuestro, corregimos"
└─ Nueva factura correcta ($280K)

RESULTADO: $7M ahorrados, <1 hora total (vs 60 días manual)
```

---

### Flujo 2: Consulta Agente IA (Gerencia Autonomía)

**Escenario:** CEO necesita KPIs para reunión junta (hoy 6 PM, junta mañana 8 AM)

```
PASO 1: CEO abre sistema
├─ Navegador → sistema-contecsa.com/dashboard
├─ Login automático (Google Workspace SSO)
└─ Dashboard carga en 3 segundos

PASO 2: CEO hace pregunta IA
├─ Escribe en chat: "¿Cuánto gastamos combustible Q1 2026?"
└─ IA procesa (8 segundos)

PASO 3: IA responde con análisis
├─ Consulta base datos (histórico completo)
├─ Calcula: Total, promedio mensual, comparativa Q1 2025
├─ Genera gráfica barras automáticamente
└─ Respuesta texto + gráfica HD

Respuesta IA:
"Q1 2026 gastó $12,450,000 COP en combustible (diesel + gasolina).
Desglose mensual:
- Enero: $4.1M
- Febrero: $4.2M
- Marzo: $4.15M

Comparativa Q1 2025: +8.3% (inflación combustible Colombia 7.2% anual)

Top 3 consorcios consumo:
1. PAVICONSTRUJC: $5.2M (41.8%)
2. EDUBAR-KRA50: $2.8M (22.5%)
3. PTAR: $1.9M (15.3%)

[Gráfica barras adjunta]"

PASO 4: CEO export PDF (1 clic)
├─ Botón "Export PDF Junta"
├─ Sistema genera PDF profesional (portada, gráficas HD, tablas)
└─ Descarga en 5 segundos

RESULTADO: 6 minutos total (vs 5 horas Liced manual)
```

---

### Flujo 3: Workflow Compra Completa (7 Etapas Automatizadas)

**Escenario:** Obra PTAR solicita 50 ton cemento urgente

```
ETAPA 1: SOLICITUD (Automatizada)
├─ Jefe Obra envía email requisición
├─ Sistema crea borrador compra automáticamente
├─ Asigna ID único: #C-2026-156
├─ Valida presupuesto disponible consorcio PTAR
└─ Alerta Jefe Compras: "Nueva requisición requiere aprobación"

ETAPA 2: COTIZACIÓN (Asistida IA)
├─ Sistema sugiere 3 proveedores (basado en histórico SICOM):
│   1. DEF Cemento: $180K/ton (mejor precio)
│   2. ABC Materiales: $185K/ton
│   3. XYZ Construcción: $190K/ton
├─ Jefe Compras selecciona DEF Cemento
└─ Sistema envía email automático solicitud cotización

ETAPA 3: ORDEN COMPRA (Automatizada)
├─ Proveedor responde cotización (confirma $180K)
├─ Jefe Compras aprueba en dashboard (1 clic)
├─ Sistema genera orden compra PDF (plantilla)
├─ Email automático proveedor con orden
└─ Registro SICOM (integración nocturna)

ETAPA 4: FACTURA (OCR + Validación)
├─ Proveedor envía factura PDF
├─ OCR extrae datos automáticamente
├─ Validación precio: $180K vs histórico $175-185K → OK (variación <5%)
├─ No bloqueo (dentro rango normal)
└─ Alerta Contabilidad: "Factura validada, proceder pago"

ETAPA 5: ENTREGA (Confirmación Almacén)
├─ Sistema notifica almacén: "Entrega programada viernes 3 PM"
├─ Almacén recibe cemento
├─ Confirma en app móvil (foto + geolocalización)
└─ Bloqueo: Pago no puede proceder hasta confirmación almacén

ETAPA 6: CERTIFICADO CALIDAD (Blocking Gate)
├─ Sistema solicita automáticamente a proveedor (email)
├─ Proveedor sube certificado PDF
├─ Técnico Contecsa revisa, aprueba
├─ Almacenamiento Google Cloud (5 años accesible)
└─ Bloqueo: Compra no se puede cerrar sin certificado aprobado

ETAPA 7: PAGO Y CIERRE (Automatizada)
├─ Todas validaciones pasadas:
│   ✓ Factura validada (precio OK)
│   ✓ Entrega confirmada (almacén)
│   ✓ Certificado aprobado (técnico)
├─ Contabilidad programa pago
├─ Sistema registra pago en SICOM (sync nocturna)
├─ Compra marcada CERRADA
└─ Métricas: Tiempo ciclo 12 días (vs 25 días promedio manual)

RESULTADO: Automatización 80% tareas, cero compras olvidadas
```

---

## Integraciones Clave (Lenguaje Simple)

### 1. Google Workspace (Ya Usan Contecsa)

**Por qué integrar:**
- Contecsa ya usa Gmail (@contecsa.com)
- Cero curva aprendizaje (familiar)
- Login único (no crear usuario nuevo)

**Qué hace:**
```
Gmail API:
├─ Detecta emails facturas automáticamente
├─ Envía notificaciones (alertas compras)
└─ Integración calendar (recordatorios pagos/entregas)

Google Sheets:
├─ Export reportes con 1 clic
└─ Formato familiar (transición suave desde Excel)

Google Drive:
├─ Almacena certificados calidad
└─ Compartir documentos entre usuarios
```

**Valor:** Adopción inmediata (no app nueva extraña)

---

### 2. SICOM (Sistema Legacy Años 70-80)

**Desafío:** SICOM tiene 5 años datos valiosos pero inaccesibles

**Solución Neero (Sin Modificar SICOM):**

```
INTEGRACIÓN READ-ONLY:

Cada noche 2 AM (automático):
1. Sistema nuevo conecta a SICOM
2. Extrae datos:
   - Precios históricos (5 años)
   - Proveedores
   - Consumos materiales
   - Pagos realizados
3. Transforma a formato moderno (PostgreSQL)
4. Almacena en base datos centralizada
5. Desconecta SICOM (sin modificar nada)

Mañana siguiente:
- Datos SICOM disponibles en dashboards
- Consultas <1 segundo (vs horas en SICOM)
- IA puede analizar histórico completo
```

**CRÍTICO:** SICOM NO se modifica. Sigue siendo sistema oficial. Solo se lee.

**Beneficio:** Histórico accesible para IA sin arriesgar integridad SICOM

---

### 3. Almacenamiento Documentos (Certificados, Facturas)

**Problema:** Hoy certificados en papel o Excel vacío (40% compras)

**Solución:**

```
Google Cloud Storage (o AWS S3):

Almacena:
├─ PDFs facturas (OCR procesados)
├─ Certificados calidad (scans/fotos)
├─ Órdenes compra (generadas automáticamente)
└─ Reportes históricos (exports)

Características:
├─ Acceso 24/7 desde dashboard
├─ Búsqueda por nombre/fecha/proveedor
├─ Retención 5 años (compliance)
└─ Backups automáticos
```

**Valor:** Cero documentos perdidos, auditoría 100%

---

## Seguridad (Sin Tecnicismos)

### ¿Datos Seguros?

**Sí. Tres capas protección:**

**Capa 1: Encriptación (Candado Digital)**
- Todos los datos viajan "encriptados" (imposible interceptar)
- Como WhatsApp: Solo Contecsa puede leer sus datos
- Estándar bancario (mismo que usa Bancolombia, Davivienda)

**Capa 2: Permisos por Rol (Quién Ve Qué)**
```
Gerencia → Ve todo
Compras → Ve solo compras (no finanzas sensibles)
Contabilidad → Ve facturas/pagos (no técnico)
Técnico → Ve certificados/consumos (no finanzas)
Almacén → Ve entregas (no precios)
```
**Valor:** Cada usuario ve solo lo relevante (privacidad interna)

**Capa 3: Auditoría (Registro Todo)**
- Sistema registra QUIÉN cambió QUÉ y CUÁNDO
- Imposible modificar sin dejar rastro
- Auditorías internas/externas pueden validar

---

### ¿Qué Pasa si Alguien Hackea?

**Protección multi-nivel:**

1. **Login 2FA** (Two-Factor Authentication)
   - Password + código celular
   - Como banco online (doble verificación)

2. **Firewall**
   - Solo IPs Contecsa pueden acceder
   - Intentos no autorizados bloqueados automáticamente

3. **Backups Diarios**
   - Si algo se corrompe, restaurar versión ayer
   - 7 días histórico backups

4. **Monitoreo 24/7**
   - Alertas automáticas si comportamiento sospechoso
   - Neero notificado inmediatamente

**Estadísticas:** Neero 6 años operación, cero hackeos exitosos

---

## Escalabilidad (¿Crece con Contecsa?)

### Escenario 1: Contecsa Crece a 15 Consorcios (vs 9 Actual)

**¿Sistema soporta?**
- Sí, sin cambios código
- Solo agregar servidor cloud (configuración, no desarrollo)
- Costo adicional: ~$300K/mes cloud (GCP/AWS)

**Tiempo implementación nuevo consorcio:** 1-2 días (setup, no meses)

---

### Escenario 2: Usuarios Aumentan 10 → 50

**¿Sistema soporta?**
- Sí, diseñado para 100+ usuarios
- Solo cambiar plan base datos (clic en GCP/AWS)
- Costo adicional: ~$150K/mes

---

### Escenario 3: Facturas Aumentan 60/mes → 500/mes

**¿Sistema soporta?**
- Sí, OCR diseñado para 1,000/mes sin problemas
- Solo aumentar quota Google Vision API
- Costo adicional: ~$200K/mes

**Conclusión:** Sistema escala linealmente (más uso = más costo cloud, NO nuevo desarrollo)

---

## Despliegue (¿Dónde Vive el Sistema?)

### Opción Recomendada: Google Cloud Platform (GCP)

**Por qué GCP:**
- Integración nativa Gmail/Google Workspace (ya usan)
- Gemini 2.0 (IA) es de Google (latencia menor)
- Soporte español LATAM

**Costo mensual:** ~$680,000 COP (hosting + base datos + storage + IA)

**Responsabilidad:**
- Neero: Configura inicial (semana 1-2)
- Contecsa: Paga directo a Google (factura mensual)
- Soporte: Neero incluido 6 meses

---

### Alternativa: AWS (Amazon Web Services)

**Si Contecsa prefiere:**
- Más oferta servicios
- Contecsa ya usa AWS para otros sistemas

**Costo mensual:** ~$770,000 COP (similar GCP)

---

### NO Recomendado: On-Premise (Servidores Contecsa)

**Solo si:**
- Políticas seguridad extremas (datos NO pueden salir)
- Contecsa tiene datacenter propio

**Desventajas:**
- Costo hardware (~$50M COP inicial)
- Mantenimiento IT Contecsa (tiempo + expertise)
- Sin escalabilidad ágil

**Veredicto:** Cloud (GCP/AWS) es 3x más barato largo plazo + confiable

---

## Tecnologías Usadas (Muy Resumido)

**Para audiencia NO técnica:**

| Componente | Tecnología | Analogía Simple |
|------------|------------|-----------------|
| **Interface (lo que ven usuarios)** | Next.js + React | Como Gmail (web moderna, rápida, responsive) |
| **Cerebro IA** | Gemini 2.0 Flash | Como ChatGPT, pero entrenado para Contecsa |
| **Base datos** | PostgreSQL | Como Excel gigante, consultas velocidad luz |
| **Lectura facturas** | Google Vision OCR | Como scanner inteligente lee PDFs |
| **Integración SICOM** | Python custom | Traductor SICOM (años 70) ↔ Sistema moderno |
| **Almacenamiento docs** | Google Cloud Storage | Como Google Drive, pero industrial |
| **Hosting** | GCP / AWS | Como Netflix (siempre disponible, escalable) |

**Conclusión:** Tecnologías clase mundial (mismas que usan Google, Amazon, Netflix)

---

## Mantenimiento (¿Qué Requiere Sistema?)

### Diario (Automático, Cero Intervención)

- Sync SICOM (2 AM cada noche)
- Backups base datos
- Monitoreo salud sistema
- Alertas si algo falla

---

### Mensual (Neero Incluido 6 Meses)

- Revisión logs errores
- Optimización performance (si consultas lentas)
- Actualizaciones seguridad
- Reporte uso (métricas)

---

### Anual (Opcional Después 6 Meses)

- Upgrade versiones (IA, frameworks)
- Nuevos features (si Contecsa solicita Fase 2)
- Auditoría seguridad completa
- Optimización costos cloud

**Costo año 2+:** $12M COP/año soporte Neero (opcional) o auto-mantener (código es del cliente)

---

## Preguntas Frecuentes (No Técnicas)

### "¿Sistema reemplaza SICOM?"

**NO.** SICOM sigue siendo sistema oficial. Nuevo sistema:
- Lee SICOM (solo lectura, no modifica)
- Presenta datos de forma moderna
- Agrega inteligencia (alertas, IA)

**Metáfora:** SICOM = bodega datos, Sistema nuevo = GPS para navegar bodega

---

### "¿Necesitamos internet 24/7?"

**Sí.** Sistema vive en nube (GCP/AWS), requiere conexión internet.

**Contingencia:** Si internet cae Contecsa:
- Sistema no accesible (como Gmail sin internet)
- Datos siguen seguros en cloud
- Cuando internet regresa, sistema funciona normal

**Mitigación:** Contecsa dual ISP (dos proveedores internet) para redundancia

---

### "¿Qué pasa si Google Cloud falla?"

**Respuesta:**
- Uptime Google Cloud: 99.95% (5 horas downtime/año promedio)
- SLA Google: Si baja <99.95%, reembolso
- Backups diarios: Si desastre, restaurar versión ayer

**Realidad:** Google Cloud más confiable que servidor on-premise Contecsa (estadísticamente)

---

### "¿Podemos modificar sistema nosotros?"

**Sí.** Código es del cliente. Pueden:
- Contratar developers in-house
- Modificar UX, agregar features
- Integrar otros sistemas

**Precaución:** Modificaciones no soportadas por Neero (pierden garantía). Recomendamos
contratar Neero para features nuevos (calidad garantizada).

---

## Conclusión Arquitectura

**Sistema NO es "caja negra" mágica.**

**Sistema ES:**
- 4 capas claras (Usuarios → IA → Datos → SICOM)
- Integraciones conocidas (Gmail, Google Cloud, SICOM)
- Tecnologías probadas (mismas que usan Google, Amazon)
- Escalable con Contecsa (9 consorcios → 20+ sin problema)

**Diseño para:** Contecsa HOY (9 consorcios, 55 compras, 8-10 usuarios)

**Preparado para:** Contecsa MAÑANA (15+ consorcios, 100+ compras, 50+ usuarios)

---

**Para detalles técnicos completos:** Documentación IT entregada post-firma contrato

**Siguiente sección:** [08 - Casos de Uso](08-casos-uso.md)
