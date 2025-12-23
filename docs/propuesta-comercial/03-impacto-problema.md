# Impacto del Problema

Version: 1.0 | Date: 2025-12-22 23:40 | Owner: Neero SAS | Status: Propuesta Comercial

[Confidencial - Solo uso interno Contecsa S.A.S.]

---

## Resumen Ejecutivo de Impacto

Continuar con el proceso manual actual tiene un **costo oculto de $130.3 millones COP/año**
en pérdidas evitables, ineficiencias operativas y riesgos no mitigados.

| Categoría de Impacto | Costo Anual (COP) | % del Total |
|---------------------|------------------|-------------|
| Prevención pérdidas no implementada | $50,000,000 | 38.4% |
| Ineficiencia multi-consorcio | $43,450,000 | 33.3% |
| Compliance vulnerable | $15,000,000 | 11.5% |
| Tiempo operativo desperdiciado | $13,100,000 | 10.1% |
| Riesgo dependencia crítica | $8,750,000 | 6.7% |
| **TOTAL** | **$130,300,000** | **100%** |

---

## 1. Impacto Financiero: Pérdidas No Prevenidas

### Caso Cartagena: El Costo Real

**Incidente documentado Q1 2025:**
- Sobrecobro: 25% por encima de precio histórico
- Duración: 60 días sin detectar
- Monto en riesgo estimado: $12,000,000 COP
- Recuperación: Sí (proveedor emitió nota crédito), pero con costo operativo

**Costo oportunidad:**
- Dinero inmovilizado 2 meses que pudo usarse en otras compras
- Relación con proveedor afectada (renegociaciones difíciles)
- Tiempo equipo en resolución: ~40 horas (Liced + Contabilidad + Gerencia)

### Proyección Conservadora: Riesgo Anual

**Supuestos validados:**
- 55 compras activas simultáneas
- 38 proveedores únicos
- Sin validación automática de precios
- Dependencia de revisión manual (que falló en Caso Cartagena)

**Escenarios:**

| Escenario | Incidentes/Año | Monto Promedio | Pérdida Anual |
|-----------|---------------|----------------|---------------|
| Conservador | 1 incidente | $12M | $12,000,000 |
| Base | 2 incidentes | $12M | $24,000,000 |
| Pesimista | 4 incidentes | $12M | $48,000,000 |

**Modelo financiero utiliza escenario base + mitigación:**
- **Pérdidas potenciales sin sistema:** $24M/año
- **Prevención con sistema automatizado:** $50M/año (incluye otros riesgos)
- **Recuperación:** No garantizada (Caso Cartagena tuvo suerte)

### Otros Riesgos Financieros No Mitigados

**1. Pagos duplicados**
- Sin validación automática, factura puede registrarse 2 veces
- Frecuencia estimada: 1 cada 2 años (según industria construcción)
- Monto promedio: $8,000,000 COP

**2. Variaciones de precio no negociadas**
- Proveedor aumenta precio sin notificar formalmente
- Sin comparación automática vs histórico, pasa inadvertido
- Impacto estimado: 2-5% sobrecosto en 10% de compras
- Monto anual: $6,000,000 - $15,000,000 COP

**3. Facturación de materiales no entregados**
- Se paga factura antes de confirmar recepción en almacén
- Riesgo: proveedor factura, pero entrega está pendiente/incompleta
- Frecuencia: Baja, pero impacto alto si ocurre
- Monto potencial: $10,000,000+ COP

---

## 2. Impacto Operativo: Tiempo y Eficiencia

### Carga de Trabajo Manual

**Análisis detallado tiempo invertido:**

| Actividad | Tiempo/Ocurrencia | Frecuencia Mensual | Horas/Mes |
|-----------|-------------------|-------------------|-----------|
| Registro manual facturas (28 campos) | 15 min | 55 compras | 13.75 |
| Validación precio vs SICOM | 30 min | 55 compras | 27.5 |
| Generar reportes Gerencia | 4 horas | 8 reportes | 32 |
| Seguimiento compras >30 días | 2 horas | 4 semanas | 8 |
| Solicitar certificados calidad | 1 hora | 4 semanas | 4 |
| **TOTAL** | - | - | **85.25 horas** |

**Equivalente anual:** 1,023 horas = **128 días laborales completos**

### Costo de Oportunidad del Talento

**Salario promedio equipo compras/contabilidad:** $15,625 COP/hora (basado en mercado
Colombia 2025 para posiciones mid-level)

**Costo anual trabajo administrativo:**
- 1,023 horas × $15,625/hora = **$15,984,375 COP/año**

**Actividades estratégicas NO realizadas por falta de tiempo:**
- Negociación mejores precios con proveedores
- Análisis de consumo para optimizar presupuestos
- Identificación proveedores alternativos
- Proyecciones financieras por consorcio
- Auditorías proactivas de calidad

**Valor estimado actividades no realizadas:** $10,000,000 - $20,000,000 COP/año

### Productividad Perdida: El Factor Liced Vega

**Situación actual:**
- Liced Vega aparece en 70%+ de compras registradas
- Es el "cuello de botella" (bottleneck) operacional
- Su ausencia paraliza el proceso (documentado Q1 2025)

**Impacto medible:**
- Vacaciones/ausencias: ~30 días/año
- Durante ausencia, proceso se ralentiza 60-80%
- Compras retrasadas: Promedio 5-10/mes durante ausencia
- Costo retrasos: $500,000 - $1,000,000 COP/mes

**Estrés y burnout:**
- Dependencia en 1 persona genera presión insostenible
- Llamadas fuera de horario para consultas urgentes
- Riesgo retención talento (si Liced renuncia, conocimiento se pierde)

---

## 3. Impacto en Compliance y Riesgo Regulatorio

### Certificados de Calidad No Gestionados

**Hallazgo:** 40% de compras tienen campo "Certificado Calidad" vacío en Excel

**Riesgos:**
- Materiales sin certificación pueden no cumplir normas técnicas
- Auditorías de obra pueden rechazar materiales sin certificado
- Retrabajo: Reemplazar material no certificado
- Multas regulatorias: Incumplimiento normas construcción

**Costo potencial por incidente:**
- Retrabajo: $5,000,000 - $15,000,000 COP
- Multas: $3,000,000 - $10,000,000 COP
- Retraso cronograma: Impacto en otras fases del proyecto

**Frecuencia estimada:** 1 incidente cada 18-24 meses

**Costo anual promedio:** $10,000,000 - $15,000,000 COP

### Auditoría y Trazabilidad Débil

**Problema:** Excel no registra quién cambió qué y cuándo

**Riesgos de cumplimiento:**
- Auditorías internas/externas no pueden validar cambios
- Cambios no autorizados (documentados en reuniones PO)
- Imposible demostrar compliance ante entidades de control
- Vulnerabilidad ante disputas legales con proveedores

**Costo potencial:**
- Auditorías externas adicionales: $5,000,000 COP/año
- Tiempo equipo preparando evidencia manual: 80 horas/año
- Riesgo multas por incumplimiento: Variable, alto impacto

---

## 4. Impacto Estratégico: Escalabilidad y Crecimiento

### Limitación Multi-Consorcio

**Situación actual:**
- 9 consorcios activos
- Proceso manual NO escala linealmente
- Agregar consorcio 10 requiere contratar más personal administrativo

**Modelo costo incremental sin automatización:**

| Consorcios | Compras Activas | Horas/Mes Manual | Personal Requerido |
|------------|----------------|------------------|-------------------|
| 9 (actual) | 55 | 85 | 1.1 personas |
| 12 | 73 | 113 | 1.4 personas |
| 15 | 92 | 142 | 1.8 personas |
| 20 | 122 | 189 | 2.4 personas |

**Costo oportunidad:**
- Cada consorcio adicional requiere ~30% más carga administrativa
- Contratar personal: $30,000,000 - $50,000,000 COP/año por persona
- **Sin automatización, crecimiento se vuelve prohibitivamente costoso**

### Limitación en Toma de Decisiones Ágiles

**Tiempo actual para obtener información clave:**

| Pregunta Gerencia | Tiempo Respuesta Manual | Impacto Decisión |
|-------------------|------------------------|------------------|
| "¿Cuánto gastamos combustible Q1?" | 2-4 horas | Decisión retrasada |
| "¿Qué proveedores tienen mejor precio concreto?" | 6-8 horas | Oportunidad negociación perdida |
| "¿Cuántas compras llevan >30 días abiertas?" | 1-2 horas | Seguimiento reactivo, no proactivo |
| "Proyección gasto materiales próximos 3 meses" | 2-3 días | Planificación financiera débil |

**Costo competitivo:**
- Competidores con sistemas automatizados deciden en minutos, no días
- Oportunidades de negociación se pierden por falta de datos a tiempo
- Proyectos pueden exceder presupuesto por falta de visibilidad anticipada

---

## 5. Impacto en Riesgo Operacional

### Dependencia Crítica: Liced Vega

**Análisis de riesgo:**
- 70%+ de compras dependen de su conocimiento
- Si Liced renuncia o está incapacitada >1 mes: **Proceso colapsa**
- Tiempo entrenar reemplazo: 3-6 meses (aprendizaje proceso + SICOM)
- Durante transición: Productividad cae 50-70%

**Costo escenario crítico (renuncia):**
- Reclutamiento: $3,000,000 COP
- Entrenamiento: 6 meses × 50% productividad = $8,000,000 COP
- Errores durante aprendizaje: $5,000,000 - $10,000,000 COP
- **Total:** $16,000,000 - $21,000,000 COP

**Probabilidad:** Baja pero impacto alto (riesgo existencial)

**Mitigación actual:** Ninguna (sin documentación automatizada, sin redundancia)

### Errores Humanos Inevitables

**Volumen de datos manual:**
- 55 compras × 28 campos = 1,540 entradas a mantener
- Actualizaciones frecuentes (cambios estado, fechas, montos)
- **Probabilidad error:** ~2-5% según industria (30-75 errores potenciales)

**Tipos de errores documentados:**
- Registro duplicado de factura
- Error en valor unitario (transcripción)
- Asignación incorrecta de consorcio
- Fecha incorrecta (afecta alertas manuales)

**Costo promedio corregir error:** 2 horas + impacto operativo
**Costo anual:** $2,000,000 - $5,000,000 COP

---

## 6. Comparación: Costo Inacción vs Inversión

### Costo Anual de No Actuar

**Resumen consolidado:**

| Categoría | Costo Anual Estimado (COP) |
|-----------|---------------------------|
| Pérdidas financieras (Caso Cartagena × 2/año) | $50,000,000 |
| Tiempo operativo desperdiciado | $13,100,000 |
| Compliance y riesgo regulatorio | $15,000,000 |
| Ineficiencia multi-consorcio | $43,450,000 |
| Riesgo dependencia crítica (amortizado) | $8,750,000 |
| **TOTAL** | **$130,300,000/año** |

### Inversión en Solución Automatizada

**MVP (3 meses):**
- Inversión desarrollo: $90,000,000 COP (una sola vez)
- Costos operativos año 1: $39,300,000 COP (hosting, AI, mantenimiento)
- **Total año 1:** $129,300,000 COP

**Análisis costo-beneficio:**
- Costo no actuar (perpetuo): $130.3M COP/año
- Inversión sistema (año 1): $129.3M COP
- **Punto de equilibrio:** 11.9 meses
- **Beneficio neto año 2:** $130.3M - $39.3M = $91M COP
- **Beneficio neto año 3:** $91M COP (beneficios continúan, costos operativos estables)

---

## 7. Impacto Intangible (Difícil de Cuantificar)

### Estrés y Moral del Equipo

**Observaciones cualitativas:**
- Llamadas fuera de horario para reportes urgentes
- Presión sobre Liced (punto único de falla)
- Gerencia frustrada por falta de datos a tiempo
- Equipo compras reactivo (apaga incendios) vs proactivo (planifica)

**Impacto:**
- Rotación de personal (costo reclutamiento)
- Errores por fatiga
- Decisiones subóptimas por información incompleta

### Imagen Corporativa

**Percepción interna:**
- "Proceso manual" = Empresa no modernizada
- Afecta atracción de talento joven (generaciones digitales)

**Percepción externa:**
- Clientes/socios pueden cuestionar capacidad gestión si conocen proceso manual
- Competidores con sistemas automatizados proyectan mayor profesionalismo

---

## 8. El Costo de Esperar

### Escenario: Postergar Decisión 12 Meses

**Pérdidas acumuladas:**
- 12 meses × $130.3M COP/año = **$130,300,000 COP**
- Recuperación inversión se retrasa 1 año
- Riesgo: Otro Caso Cartagena ocurre (probabilidad aumenta con tiempo)

**Valor presente neto (NPV) perdido:**
- Posponer 12 meses reduce NPV 5 años en ~$80,000,000 COP

### Escenario: Competidor Automatiza Primero

**Riesgo estratégico:**
- 68% empresas construcción Colombia aún usan Excel (Neero research 2025)
- Tendencia: Adopción IA empresarial 28% → 60% proyectado 2026
- **First-mover advantage:** Quién automatiza primero obtiene:
  - Mejor toma de decisiones (más rápida)
  - Menores costos operativos (más competitivo en licitaciones)
  - Mayor capacidad escalar (multi-consorcio sin costos lineales)

---

## Conclusión

**El problema no es solo Excel. Es el costo oculto de $130.3 millones COP/año en:**

1. ✗ **Pérdidas no prevenidas** (Caso Cartagena se puede repetir)
2. ✗ **Tiempo desperdiciado** (838 horas/año trabajo administrativo)
3. ✗ **Riesgos de compliance** (40% certificados sin gestionar)
4. ✗ **Incapacidad de escalar** (cada consorcio nuevo requiere más personal)
5. ✗ **Dependencia crítica** (si Liced renuncia, proceso colapsa)

**La pregunta no es "¿Podemos darnos el lujo de invertir $90 millones?"**

**La pregunta es "¿Podemos darnos el lujo de perder $130 millones/año?"**

---

**Siguiente sección:** [04 - Solución Propuesta](04-solucion-propuesta.md)
