# Análisis: Control de Compras Excel - Contecsa

Version: 1.0 | Date: 2025-12-22 16:15

## Resumen Ejecutivo

Este documento analiza el archivo Excel **"CONTROL COMPRAS.xlsx"** que Contecsa utiliza actualmente para gestión manual de compras. El análisis revela un sistema de seguimiento robusto pero intensivo en labor manual, con **28 campos de seguimiento** que cubren todo el ciclo de vida de una compra, desde requisición hasta cierre con documentación completa.

**Hallazgos clave:**
- Sistema manual bien estructurado pero con alta carga operativa
- Control exhaustivo de documentación (certificados de calidad por proyecto)
- 55 compras gestionadas en periodo 2024-2025
- Proceso completo desde requisición hasta entrega y facturación
- Alta fragmentación por proyectos/consorcios (9 activos)

## Información del Archivo

| Atributo | Detalle |
|----------|---------|
| Nombre | CONTROL COMPRAS.xlsx |
| Ubicación | /Users/mercadeo/neero/contecsa/ |
| Tamaño | 58 KB |
| Hojas | 3 (Control de Compras, Direcciones de Obra, Carteras Vencidas) |
| Periodo | 2024-2025 |
| Última actualización | 2025-11-20 (según header) |

## Hoja 1: CONTROL DE COMPRAS

### Estadísticas Generales

| Métrica | Valor |
|---------|-------|
| Total registros | 55 |
| Campos de seguimiento | 28 |
| Proyectos/Consorcios activos | 9 |
| Proveedores únicos | 38 |

### Estados de Compras

| Estado | Cantidad | % |
|--------|----------|---|
| CERRADO | 53 | 96.4% |
| PTE ENTREGA | 2 | 3.6% |
| ANULADO | 1 | 1.8% (no eliminado) |

**Observación**: Compras anuladas no se eliminan del archivo, se marcan como "ANULADO" y se mantienen para trazabilidad.

### Tipos de Requerimiento

| Tipo | Cantidad | % | Descripción |
|------|----------|---|-------------|
| COMPRAS | 46 | 83.6% | Adquisición de materiales, servicios, EPP |
| PROCESOS | 6 | 10.9% | Licitaciones, contrataciones formales |
| CONTRATOS | 3 | 5.5% | Servicios profesionales, contratos |

### Distribución por Proyecto/Consorcio

| Centro de Costo | Compras | % |
|-----------------|---------|---|
| PAVICONSTRUJC | 23 | 41.8% |
| EDUBAR-KRA50 | 8 | 14.5% |
| PTAR-SANTO TOMAS | 6 | 10.9% |
| CONTECSA-ADMINISTRATIVO | 5 | 9.1% |
| PTAR-JUAN DE ACOSTA | 4 | 7.3% |
| PARQUES DE BOLIVAR | 4 | 7.3% |
| Otros (CORDOBA, HIDROGUJIRA, etc.) | 5 | 9.1% |

## Estructura de Campos (28 columnas)

### 1. REQUISICIÓN (8 campos)

Captura la solicitud inicial de compra.

| # | Campo | Tipo | Descripción | Ejemplo |
|---|-------|------|-------------|---------|
| 0 | ESTADO | Texto | Estado actual de la compra | CERRADO, PTE ENTREGA, ANULADO |
| 1 | TIPO DE REQUERIMIENTO | Texto | Categoría de compra | COMPRAS, PROCESOS, CONTRATOS |
| 2 | PRIORIDAD | Texto | Urgencia (poco usado) | Vacío en mayoría |
| 3 | FECHA RQ | Fecha | Fecha de requisición | 2025-03-21 |
| 4 | No RQ | Número | Número de requisición SICOM | 400342 |
| 5 | Quien Realiza la RQ | Texto | Persona que solicita | GREICY VALENCIA |
| 6 | Centro de costos | Texto | Proyecto/Obra asignado | PAVICONSTRUJC |
| 7 | Quien compra? | Texto | Responsable de compra | PAVICONSTRUJC, PTAR2020 |

**Observación**: Campo "No RQ" poco utilizado (muchos vacíos), sugiere que no todas las requisiciones se registran en SICOM antes de iniciar compra.

### 2. GESTIÓN DE COMPRAS (3 campos)

Define qué se compra y contexto.

| # | Campo | Tipo | Descripción | Ejemplo |
|---|-------|------|-------------|---------|
| 8 | Material solicitado | Texto largo | Descripción detallada del material/servicio | BATERIA DE RIESGO PSICOSOCIAL, PASAMUROS Y TAPAS BRIDADA |
| 9 | Observación del Proceso de Compras | Texto largo | Notas, condiciones de pago, especificaciones | "ANTICIPO DEL 60% SALDO A ENTREGA", "Se anula porque proyecto en suspensión" |
| 10 | PROVEEDOR | Texto | Nombre del proveedor seleccionado | YORK IVAN PUERTO BARRIOS, JIMENEZ V. PROYECTOS |

**Observación**: Campo "Observación del Proceso" es crítico - contiene información valiosa pero no estructurada (condiciones de pago, razones de anulación, especificaciones técnicas).

### 3. ORDEN DE COMPRA/SERVICIO (6 campos)

Formaliza la compra con proveedor.

| # | Campo | Tipo | Descripción | Ejemplo |
|---|-------|------|-------------|---------|
| 11 | ODC | Número | Orden De Compra (materiales) | 330, 83, 107 |
| 12 | ODS | Número | Orden De Servicio (servicios) | 107 |
| 13 | FORMA DE PAGO | Texto | Modalidad de pago | CONTADO, CREDITO |
| 14 | VALOR COMPRA | Número | Monto total de la compra | 420000, 83490400 |
| 15 | FECHA ODC-ODS | Fecha | Fecha de emisión de orden | 2025-03-21 |
| 16 | FECHA DE PAGO | Fecha | Fecha de pago al proveedor | 2025-03-27 |

**Observación**: Se usa ODC (materiales) u ODS (servicios), no ambos simultáneamente. Campo "FORMA DE PAGO" tiene solo 2 valores (CONTADO/CREDITO), sugiere que sistema nuevo podría tener más opciones (anticipos, parciales).

### 4. SEGUIMIENTO (3 campos)

Control del proceso y responsables.

| # | Campo | Tipo | Descripción | Ejemplo |
|---|-------|------|-------------|---------|
| 17 | ENCARGADO DEL SEGUIMIENTO | Texto | Responsable de hacer seguimiento | LICED VEGA (aparece en mayoría) |
| 18 | OBSERVACIONES DE SEGUIMIENTO DEL PEDIDO | Texto largo | Estado actual, notas, pendientes | "Proveedor entrega material queda pendiente por entregar 9 und" |
| 19 | ENTREGADO | Texto | ¿Se entregó el material? | SI, NO, PARCIAL |

**Observación**: LICED VEGA aparece como encargada de seguimiento en la mayoría de compras, sugiere centralización de seguimiento. Campo "ENTREGADO" permite "PARCIAL" lo cual es crítico para compras grandes.

### 5. ALMACÉN Y LOGÍSTICA (3 campos)

Recepción y facturación.

| # | Campo | Tipo | Descripción | Ejemplo |
|---|-------|------|-------------|---------|
| 20 | No ENTRADA | Código | Número de entrada a almacén SICOM | 10000096, BO00000115 |
| 21 | No. FACTURA | Texto | Número de factura del proveedor | (mayormente vacío) |
| 22 | FECHA DE CIERRE | Fecha | Fecha de cierre de la compra | 2025-04-05 |

**Observación**: Campo "No. FACTURA" sorprendentemente vacío en mayoría de registros, sugiere que no se registra en Excel (posiblemente se gestiona en SICOM o contabilidad). Campo "No ENTRADA" crítico para trazabilidad con SICOM.

### 6. CERTIFICADOS Y DOCUMENTACIÓN (5 campos)

Control de documentación técnica por proyecto.

| # | Campo | Tipo | Descripción | Ejemplo |
|---|-------|------|-------------|---------|
| 23 | CERTIFICADO DE CALIDAD | Texto | ¿Se recibió certificado? | SI, NO (mayormente vacío) |
| 24 | FICHA TECNICA | Texto | ¿Se recibió ficha técnica? | (vacío) |
| 25 | GARANTIA | Texto | ¿Se recibió garantía? | (vacío) |
| 26 | OBSERVACIONES DE SEGUIMIENTO | Texto | Notas adicionales | (vacío) |
| 27 | ANEXOS | Texto | Links o referencias a archivos | (vacío) |

**Observación crítica**: Esta sección está mayormente vacía, sugiere que:
1. No se está completando esta parte del proceso
2. Los certificados se gestionan por otro medio (carpetas físicas/digitales)
3. Es un área de mejora importante para el sistema nuevo

**Header dinámico**: Los headers de columnas 23-27 cambian según el proyecto (ej: "05. CERTIFICADOS DE CALIDAD POR PROVEEDOR - JUAN DE ACOSTA"), sugiere que hay una hoja de cálculo por proyecto o sección dinámica.

## Flujo de Trabajo Identificado

Basado en la estructura de campos, el flujo de trabajo actual es:

```
1. REQUISICIÓN
   ├─ Usuario crea requisición (por correo, no en sistema)
   ├─ Se registra: Fecha, Solicitante, Centro de Costo, Material
   └─ Asigna a responsable de compra

2. GESTIÓN DE COMPRAS
   ├─ Responsable cotiza con proveedores
   ├─ Selecciona proveedor
   ├─ Define condiciones (pago, especificaciones)
   └─ Registra observaciones del proceso

3. EMISIÓN DE ORDEN
   ├─ Genera ODC (materiales) u ODS (servicios) en SICOM
   ├─ Define forma de pago y monto
   └─ Registra fechas de emisión y pago proyectado

4. SEGUIMIENTO
   ├─ Encargado (Liced Vega) hace seguimiento
   ├─ Actualiza observaciones de estado
   └─ Marca como ENTREGADO (SI/NO/PARCIAL)

5. RECEPCIÓN EN ALMACÉN
   ├─ Material ingresa a almacén
   ├─ Se genera No. ENTRADA en SICOM
   └─ Se registra factura del proveedor

6. CIERRE
   ├─ Se valida entrega completa
   ├─ Se solicitan certificados/fichas técnicas (si aplica)
   ├─ Se registra FECHA DE CIERRE
   └─ Estado cambia a CERRADO

7. DOCUMENTACIÓN (débil)
   ├─ Certificado de calidad (mayormente no registrado)
   ├─ Ficha técnica (mayormente no registrado)
   └─ Garantía (mayormente no registrado)
```

### Tiempos Típicos

Basado en muestra de registros cerrados:

| Fase | Tiempo Típico |
|------|---------------|
| Requisición → Orden | Variable (no medido) |
| Orden → Pago | ~6 días promedio |
| Pago → Entrega | Variable |
| Entrega → Cierre | ~10-15 días |
| **Ciclo completo** | **15-30 días** |

## Ejemplo de Registro Completo

Compra típica cerrada (basada en registro real):

```
ESTADO: CERRADO
TIPO DE REQUERIMIENTO: COMPRAS
FECHA RQ: 2025-03-21
Quien Realiza la RQ: GREICY VALENCIA
Centro de costos: PAVICONSTRUJC
Quien compra?: PAVICONSTRUJC
Material solicitado: BATERIA DE RIESGO PSICOSOCIAL
Observación del Proceso de Compras: [vacío]
PROVEEDOR: YORK IVAN PUERTO BARRIOS
ODS: 107
FORMA DE PAGO: CONTADO
VALOR COMPRA: $420,000
FECHA ODC-ODS: 2025-03-21
FECHA DE PAGO: 2025-03-27
ENCARGADO DEL SEGUIMIENTO: LICED VEGA
OBSERVACIONES DE SEGUIMIENTO: Ya se presto el servicio confirma Greicy Valencia
ENTREGADO: SI
FECHA DE CIERRE: 2025-04-05
```

**Ciclo**: 15 días (desde requisición hasta cierre)

## Hoja 2: DIRECCIONES DE OBRA

Catálogo de proyectos/consorcios con direcciones.

| Proyecto | NIT | Dirección |
|----------|-----|-----------|
| CONGLOMERADO TECNICO COLOMBIANO | 802005436-1 | KM 98+600 VIA AL MAR - PUERTO COLOMBIA |
| CONSORCIO PAVICONSTRUJC | 901868807-0 | Urb portales de la India / Manga |
| CONSORCIO REDES | 901957105-0 | Coordenadas GPS (campamento + punto atención) |
| CONSORCIO DESARROLLO VIAL B/QUILLA | 901816477-0 | Calle 80 con carrera 50 y 49 |

**Observación**: Esta hoja sirve como catálogo de centros de costo válidos. Sistema nuevo debería importar esto como maestro de proyectos.

## Hoja 3: CARTERAS VENCIADAS

Control de cuentas por pagar vencidas.

| Proveedor | Valor | Proyecto | Vencimiento |
|-----------|-------|----------|-------------|
| G Y J FERRETERIAS S A | $15,665,874 | EDUBAR-KRA50 | 2025-12-20 |
| ALFONSOEME | $2,234,106 | CONTECSA-ADMINISTRATIVO | 2025-10-15 |
| CONCESION JY | $7,415,235.58 | MOMPOX 21 | (vacío) |

**Observación**: Esta hoja es crítica para control financiero pero está poco estructurada. Sistema nuevo debería generar esto automáticamente desde compras pendientes de pago.

## Insights y Observaciones

### Fortalezas del Sistema Actual

1. **Cobertura completa del ciclo**: Desde requisición hasta cierre con documentación
2. **Trazabilidad**: Integración con SICOM vía No. ODC/ODS y No. ENTRADA
3. **Control de estados**: Estados claros (CERRADO, PTE ENTREGA, ANULADO)
4. **Seguimiento personalizado**: Campo de observaciones permite contexto rico
5. **Entregas parciales**: Reconoce que compras grandes pueden tener entregas parciales

### Debilidades del Sistema Actual

1. **Alta carga manual**: 28 campos a completar por compra
2. **Campos vacíos frecuentes**: Certificados, fichas técnicas, garantías, facturas no se registran
3. **Sin alertas automáticas**: No hay notificaciones de compras vencidas o pendientes
4. **Sin KPIs visibles**: No hay dashboards o indicadores automáticos
5. **Sin validaciones**: Posibilidad de cambios no autorizados (mencionado en reunión)
6. **Un solo encargado**: Liced Vega centraliza seguimiento, riesgo de cuello de botella
7. **Sin historial de cambios**: Google Sheets tiene historial pero no se usa proactivamente
8. **Información no estructurada**: Campo "Observaciones" tiene datos valiosos pero no consultables

### Áreas de Mejora Críticas

1. **Documentación técnica**: Certificados de calidad, fichas técnicas, garantías no se gestionan
2. **Alertas proactivas**: Compras vencidas, entregas pendientes, documentación faltante
3. **Registro de facturas**: Campo vacío sugiere desconexión con proceso de pago
4. **Proyecciones**: No hay visibilidad de gastos proyectados vs presupuesto
5. **Análisis de proveedores**: No hay métricas de desempeño (tiempos, calidad, precios)

## Mapeo a Requerimientos del PRD

Este análisis valida y enriquece los requerimientos del PRD:

### RF1: Agente IA Conversacional
**Casos de uso identificados:**
- "Muéstrame todas las compras de PAVICONSTRUJC del Q1 2025"
- "¿Qué proveedores han entregado parcialmente?"
- "Compara tiempo de ciclo de compras CONTADO vs CREDITO"
- "¿Cuántas compras están pendientes de certificado de calidad?"

### RF2: Dashboard Ejecutivo
**KPIs sugeridos basados en Excel:**
- Total compras por estado (CERRADO, PTE ENTREGA, ANULADO)
- Monto comprometido por proyecto
- Tiempo promedio de ciclo por tipo de compra
- % de compras con certificados completos
- Top 10 proveedores por volumen
- Distribución de compras CONTADO vs CREDITO

### RF3: Automatización de Seguimiento de Compras
**Workflow basado en Excel actual:**
1. Requisición → auto-extraer de correo
2. Orden emitida → alertar si no se confirma en 48h
3. Pago programado → alertar 2 días antes
4. Entrega esperada → alertar si no llega en fecha
5. Cierre pendiente → alertar si compra >30 días sin cerrar
6. Documentación faltante → alertar certificados/fichas pendientes

### RF4: Procesamiento Automático de Facturas
**Validación**: Campo "No. FACTURA" vacío confirma que ingreso manual no se está haciendo. OCR puede ahorrar este dolor completamente.

### RF5: Sistema de Notificaciones
**Alertas críticas identificadas:**
- Compras PTE ENTREGA >15 días
- Certificados de calidad pendientes
- Pagos próximos a vencer
- Compras sin cerrar >30 días desde entrega

### RF6: ETL y Transformación de Datos
**Campos a extraer de SICOM:**
- No. ODC/ODS → para cruzar con este Excel
- No. ENTRADA → para validar recepción en almacén
- Centro de costos → para validar proyecto existe
- Proveedor → para maestro de proveedores

### RF7: Control de Calidad de Datos
**Validaciones necesarias:**
- FECHA DE PAGO > FECHA ODC-ODS
- FECHA DE CIERRE > FECHA DE PAGO
- Centro de costos válido (de hoja "DIRECCIONES DE OBRA")
- ESTADO solo puede ser: CERRADO, PTE ENTREGA, ANULADO
- Si ENTREGADO=SI → debe tener FECHA DE CIERRE

### RF8: Gestión de Mantenimientos
**No aplica**: Este Excel es solo de compras, no de mantenimientos. RF8 es adicional.

## Recomendaciones para el Sistema Nuevo

### 1. Migración de Datos
- Importar estas 55 compras como datos históricos
- Usar hoja "DIRECCIONES DE OBRA" como maestro de proyectos
- Importar proveedores únicos (38) como maestro de proveedores

### 2. Simplificación de Campos
- Reducir 28 campos a ~15 campos obligatorios + 5 opcionales
- Hacer campos como "PRIORIDAD" realmente útiles o eliminarlos
- Separar "Observaciones" en campos estructurados cuando sea posible

### 3. Automatización de Documentación
- Obligar carga de certificados de calidad (bloqueante para cierre)
- Permitir adjuntar múltiples archivos (certificados, fichas, garantías)
- Validar que documentación requerida esté completa antes de CERRAR

### 4. Integración SICOM
- Auto-llenar No. ODC/ODS desde SICOM si compra se crea allá
- Auto-actualizar No. ENTRADA cuando se registra en SICOM
- Sincronización bidireccional para evitar doble captura

### 5. Roles y Permisos
- Permitir que cada proyecto tenga su encargado de seguimiento (no solo Liced)
- Permisos por proyecto (PAVICONSTRUJC solo ve sus compras)
- Auditoría de cambios (quién cambió qué y cuándo)

### 6. UX Mejorado
- Vista Kanban de compras (Requisición → Cotización → Orden → Entrega → Cierre)
- Filtros rápidos por: Estado, Proyecto, Proveedor, Fecha
- Búsqueda full-text en observaciones
- Exportación a Excel con formato similar al actual (familiaridad)

## Conclusión

El sistema Excel actual de Contecsa demuestra un proceso de compras bien pensado y exhaustivo, pero limitado por la naturaleza manual de Excel. Los 28 campos de seguimiento revelan una operación rigurosa que valora la trazabilidad y documentación.

Las áreas críticas de mejora son:
1. **Automatización de alertas** (compras vencidas, documentación pendiente)
2. **Gestión de documentación técnica** (certificados, fichas, garantías)
3. **Visibilidad en tiempo real** (dashboards, KPIs)
4. **Reducción de carga manual** (OCR de facturas, auto-llenado de campos)

El sistema nuevo debe replicar la robustez del proceso actual mientras elimina el dolor de la captura manual y agrega inteligencia (alertas, proyecciones, análisis).

---

**Próximo paso**: Usar este análisis para diseñar mockups de interfaz que sean familiares para los usuarios actuales del Excel.
