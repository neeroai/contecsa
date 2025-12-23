# Diagnóstico de Situación Actual

Version: 1.0 | Date: 2025-12-22 23:35 | Owner: Neero SAS | Status: Propuesta Comercial

[Confidencial - Solo uso interno Contecsa S.A.S.]

---

## Contexto Operacional

Contecsa S.A.S. gestiona actualmente **9 consorcios activos** en proyectos de construcción
y obras civiles, con un total de **55 compras simultáneas** en diferentes etapas de
ejecución.

**Distribución de compras por consorcio:**

| Consorcio | Compras Activas | % Total |
|-----------|----------------|---------|
| PAVICONSTRUJC | 23 | 41.8% |
| EDUBAR-KRA50 | 8 | 14.5% |
| PTAR | 6 | 10.9% |
| Otros 6 consorcios | 18 | 32.8% |

**Proveedores:** 38 proveedores únicos
**Usuarios:** 8-10 personas distribuidas en 6 roles (Gerencia, Compras, Contabilidad,
Técnico, Almacén, Administrativo)

---

## Proceso Actual de Seguimiento de Compras

### Herramienta: Google Sheets (Excel en la nube)

Cada compra se registra manualmente con **28 campos de seguimiento:**

**Campos administrativos (8):**
- Consorcio, Proyecto, Número de orden, Fecha solicitud, Solicitante, Proveedor,
  Estado actual, Fecha última actualización

**Campos financieros (7):**
- Valor unitario, Cantidad, Valor total, IVA, Retenciones, Presupuesto asignado,
  Saldo disponible

**Campos técnicos (6):**
- Descripción material/servicio, Unidad medida, Especificaciones técnicas,
  Certificado calidad, Uso en obra, Ubicación entrega

**Campos seguimiento (7):**
- Fecha cotización, Fecha orden compra, Fecha factura, Fecha pago programado,
  Fecha pago efectivo, Responsable seguimiento, Observaciones

### Volumen de Trabajo Manual

**Carga operativa actual:**
- 55 compras × 28 campos = **1,540 entradas de datos manuales** a mantener actualizadas
- Cada compra pasa por **7 etapas** desde solicitud hasta cierre
- Tiempo promedio por ciclo completo: **15-30 días**
- **Ninguna validación automática** de precios, fechas o certificados

### Dependencia Crítica: Liced Vega

**Análisis de registros Excel:**
- Liced Vega aparece como responsable en **70%+ de las compras registradas**
- Es la única persona con conocimiento completo del proceso
- Su ausencia (vacaciones, enfermedad) **paraliza el seguimiento**

**Incidente documentado:** Durante ausencia de Liced en Q1 2025, el proceso se detuvo
casi completamente, lo que contribuyó al Caso Cartagena.

---

## Sistema SICOM: El Legado de Datos

### Características

**SICOM** es el sistema de información central de Contecsa, desarrollado en los años
1970-80 y en su versión 2 desde hace décadas sin actualizaciones mayores.

**Descripción del equipo Contecsa:**
- "Pantalla negra" (interfaz texto, no gráfica)
- "Bodega de datos sin consultas ágiles"
- "No se puede modificar, es el sistema oficial"
- Almacena historial completo de operaciones (5+ años de datos)

### Limitaciones

| Limitación | Impacto en Operación |
|------------|----------------------|
| Sin API moderna | No se puede integrar fácilmente con otras herramientas |
| Consultas lentas | Obtener histórico de precios puede tomar horas |
| Interface compleja | Solo personal técnico especializado lo usa |
| Sin alertas | No notifica cambios, anomalías o vencimientos |
| Read-only política | Prohibido modificar, solo consultar |

**Resultado:** SICOM tiene los datos históricos críticos (precios, proveedores, consumos),
pero es prácticamente inaccesible para análisis ágil o toma de decisiones en tiempo real.

---

## Caso Cartagena: El Incidente Crítico

### Cronología

**Enero-Febrero 2025** (Q1)

1. **Semana 1-2:** Proveedor envía 3 facturas consecutivas de concreto para consorcio
   en Cartagena
2. **Precio facturado:** $350,000 COP/m³
3. **Precio histórico (SICOM):** $280,000 COP/m³
4. **Sobrecobro:** +25% (70,000 COP/m³)
5. **Detección:** Ninguna alerta automática
6. **Proceso:** Auxiliar contable registra facturas en Excel sin revisar histórico
7. **Aprobación:** Jefe Compras autoriza pago (confiando en registro)
8. **Pago:** Se pagan las 3 facturas con sobrecobro

**60 días después (Marzo 2025):**

9. **Detección:** Liced Vega regresa de ausencia, revisa manualmente histórico SICOM
10. **Alerta:** Identifica sobrecobro de 25%
11. **Contacto proveedor:** Se solicita explicación
12. **Resolución:** Proveedor reconoce error, emite nota crédito
13. **Recuperación:** Dinero se recupera, pero después de 2 meses

### Impacto Financiero

**Dinero en riesgo:** Estimado $12 millones COP durante 60 días
**Costo oportunidad:** Esos recursos no estuvieron disponibles para otras compras
**Daño reputacional:** Relación con proveedor afectada
**Estrés operacional:** Equipo bajo presión durante recuperación

### Root Cause (Causa Raíz)

**No fue error humano. Fue falta de sistema.**

1. **Sin validación automática:** Nadie compara factura vs histórico en tiempo real
2. **Dependencia persona:** Liced ausente, nadie más revisa precios
3. **SICOM inaccesible:** Consultar histórico requiere tiempo y conocimiento técnico
4. **Sin alertas:** Sistema no notifica variaciones de precio
5. **Proceso manual:** Imposible revisar todas las facturas contra 5 años de histórico

---

## Otros Pain Points Operacionales

### 1. Certificados de Calidad No Gestionados

**Hallazgo análisis Excel:**
- **40% de compras** tienen campo "Certificado Calidad" vacío
- No hay recordatorios automáticos para solicitar certificados
- No hay bloqueo para cerrar compra sin certificado
- Riesgo compliance y calidad de obra

### 2. Compras Estancadas Sin Seguimiento

**Problema:**
- Compras abiertas >30 días sin avanzar
- Nadie recibe alertas automáticas
- Proveedores no responden, pero nadie hace seguimiento proactivo
- Impacto: retrasos obra, sobrecostos

### 3. Información No Disponible para Gerencia

**Situación actual:**
- CEO/Gerencia necesita KPIs → Llama a Liced
- Liced genera reporte manual Excel: **4 horas de trabajo**
- Reporte entregado fuera de horario (estrés equipo)
- **Datos no en tiempo real** (pueden estar desactualizados)

### 4. Sin Auditoría de Cambios

**Riesgo:**
- Cualquier usuario puede modificar Excel sin registro
- No hay histórico de quién cambió qué y cuándo
- Cambios no autorizados han ocurrido (documentado en reuniones)
- Compliance vulnerable

### 5. Exportar/Importar Manual

**Proceso actual:**
- Datos en SICOM (histórico)
- Datos en Excel (seguimiento)
- Datos en emails (comunicaciones)
- **Sin sincronización automática**
- Riesgo: versiones contradictorias de la verdad

---

## Análisis de Roles y Permisos

### Situación Actual: Todos Acceden a Todo

**Problema:** Google Sheets no tiene permisos granulares por rol

| Rol | ¿Qué necesita ver? | ¿Qué puede ver hoy? |
|-----|-------------------|---------------------|
| Gerencia | KPIs, alertas críticas, proyecciones | Todo Excel (confuso) |
| Compras | Sus compras, alertas, proveedores | Todo (incluye finanzas) |
| Contabilidad | Facturas, pagos, presupuesto | Todo (incluye técnico) |
| Técnico | Consumos, certificados, calidad | Todo (incluye contabilidad) |

**Resultado:** Información irrelevante distrae, datos sensibles expuestos a todos.

---

## Comparación: Manual vs Automatizado

| Actividad | Tiempo Manual | Frecuencia | Total/Mes |
|-----------|---------------|------------|-----------|
| Registro factura (28 campos) | 15 min | 55 compras | 13.75 horas |
| Validar precio vs histórico | 30 min | 55 compras | 27.5 horas |
| Generar reporte gerencia | 4 horas | 8 veces | 32 horas |
| Seguimiento compras >30 días | 2 horas | Semanal | 8 horas |
| Solicitar certificados | 1 hora | Semanal | 4 horas |
| **TOTAL** | - | - | **85.25 horas/mes** |

**Equivalente:** 2.1 personas tiempo completo solo en administración de datos

**Con sistema automatizado:** 15-20 horas/mes (80% reducción)

---

## Oportunidad de Transformación

**Estado actual:**
- ✗ Proceso manual propenso a errores
- ✗ Dependencia crítica de 1 persona
- ✗ Sin alertas automáticas (Caso Cartagena se puede repetir)
- ✗ SICOM inaccesible para decisiones ágiles
- ✗ 85 horas/mes trabajo administrativo
- ✗ Compliance vulnerable (certificados, auditoría)

**Estado deseado:**
- ✓ Sistema inteligente con validaciones automáticas
- ✓ Equipo puede operar sin dependencia de Liced
- ✓ Alertas tiempo real (sobrecobros detectados <1 minuto)
- ✓ SICOM integrado vía lectura automática
- ✓ 15-20 horas/mes (80% ahorro tiempo)
- ✓ Compliance garantizado (bloqueos automáticos)

---

## Conclusión del Diagnóstico

Contecsa tiene **datos valiosos** (histórico SICOM 5+ años) y **procesos definidos**
(28 campos seguimiento), pero la **ejecución manual** genera:

1. **Riesgo financiero** (Caso Cartagena)
2. **Ineficiencia operativa** (85 horas/mes)
3. **Dependencia crítica** (Liced Vega)
4. **Compliance vulnerable** (certificados, auditoría)

La transformación digital no es opcional: es la diferencia entre **prevenir pérdidas**
o **descubrirlas 60 días después**.

---

**Siguiente sección:** [03 - Impacto del Problema](03-impacto-problema.md)
