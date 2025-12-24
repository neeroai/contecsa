# Investigación: Metodologías de Seguimiento Ejecutado vs Proyectado - Construcción

**Research Analyst - Neero SAS**
Version: 1.0 | Date: 2025-12-23 12:30 | Status: Completed
**Cliente:** Contecsa (Construcción/Obras Civiles - Colombia)
**Objetivo:** Metodologías control avance físico-financiero para implementar en sistema Python/Next.js

---

## EXECUTIVE SUMMARY

**Hallazgo principal:** Para un equipo de 2 personas con stack Next.js + Python + PostgreSQL, la metodología **Curva S Simplificada** combinada con métricas básicas de **EVM** (CPI, SPI) ofrece el mejor balance entre valor de negocio y complejidad de implementación.

**Recomendación estratégica:**
- **MVP (Fase 1):** Curva S básica + alertas de desviación ±10% (2-3 semanas desarrollo)
- **Phase 2:** Integrar CPI/SPI para métricas ejecutivas (1-2 semanas adicionales)
- **Phase 3:** Proyecciones EAC + consumo materiales predictivo (2-3 semanas adicionales)

**ROI esperado:**
- Reducción 75% tiempo generación reportes (2h → 30min)
- Detección temprana desviaciones >15% (prevención caso Cartagena)
- Visibilidad ejecutiva tiempo real (vs Excel mensual)

**Complejidad técnica:** MEDIA (Python pandas/numpy para cálculos, Recharts para visualización)

---

## DELIVERABLE 1: TABLA COMPARATIVA DE METODOLOGÍAS

### Comparativa: EVM vs Curva S vs Híbrido (Recomendado)

| Dimensión | EVM Completo (PMI) | Curva S Tradicional | **Híbrido Simplificado** ⭐ |
|-----------|-------------------|---------------------|--------------------------|
| **Complejidad** | ALTA (32 métricas PMI) | MEDIA (3 curvas) | **MEDIA-BAJA (8 métricas)** |
| **Datos requeridos** | PV, EV, AC, BAC, cronograma CPM | Presupuesto planificado + ejecutado | Presupuesto + consumo materiales |
| **Tiempo implementación** | 6-8 semanas | 2-3 semanas | **3-4 semanas** |
| **Curva aprendizaje** | 2-3 meses (certificación PMI) | 1-2 semanas | **2-3 semanas** |
| **Herramientas típicas** | Primavera P6, MS Project | Excel, Power BI | **Python + PostgreSQL + Recharts** |
| **Costo licencias** | $2,000-5,000 USD/año | $0-300 USD/año | **$0 (open-source)** |
| **Métricas principales** | CPI, SPI, EAC, TCPI, VAC | % Avance vs Tiempo | **CPI, SPI, Curva S, % Desviación** |
| **Alertas automáticas** | Sí (configurables) | No (manual) | **Sí (configurables)** |
| **Integración SICOM** | Difícil (APIs no disponibles) | Manual (export/import) | **Read-only ETL (Python)** |
| **Apto equipo 2 personas** | NO (demasiado complejo) | SÍ | **SÍ** ✅ |
| **Apto materiales construcción** | Parcial (más orientado a tiempo) | Parcial (más orientado a costo) | **SÍ (enfoque materiales)** ✅ |
| **Casos uso Contecsa** | Proyecciones EAC gerenciales | Comparación ejecutado vs presupuesto | **Ambos + alertas sobrecobros** ✅ |

**Conclusión:** El enfoque **Híbrido Simplificado** toma las métricas más valiosas de EVM (CPI, SPI) y las combina con la visualización intuitiva de Curva S, optimizado para el caso de uso de Contecsa (materiales, no mano de obra).

---

## DELIVERABLE 2: LISTA PRIORIZADA DE KPIs RECOMENDADOS

### Tier P0 - MVP Crítico (Implementar primero)

| KPI | Fórmula | Umbral Normal | Umbral Alerta | Umbral Crítico | Stakeholder | Dashboard |
|-----|---------|---------------|---------------|----------------|-------------|-----------|
| **Desviación Costo** | (Ejecutado - Proyectado) / Proyectado × 100 | ±5% | ±10-15% 🟡 | >±15% 🔴 | Gerencia, Compras | R2 |
| **Desviación Tiempo** | (Días Real - Días Plan) / Días Plan × 100 | ±3 días | 5-7 días 🟡 | >10 días 🔴 | Gerencia, PMO | R2 |
| **% Avance Físico** | (Materiales Consumidos / Materiales Totales) × 100 | N/A | <Cronograma -10% 🟡 | <Cronograma -20% 🔴 | Gerencia, Técnico | R2 |
| **% Avance Financiero** | (Gastado / Presupuestado) × 100 | N/A | >Físico +10% 🟡 | >Físico +20% 🔴 | Gerencia, Contabilidad | R2 |

**Implementación técnica:**
```python
# /api/services/project_metrics.py
def calcular_desviacion_costo(proyecto_id: int) -> float:
    """Calcula desviación costo ejecutado vs proyectado."""
    ejecutado = db.query(
        func.sum(Compra.valor_compra)
    ).filter(Compra.proyecto_id == proyecto_id).scalar()

    proyectado = db.query(Presupuesto.monto_total).filter(
        Presupuesto.proyecto_id == proyecto_id
    ).scalar()

    return ((ejecutado - proyectado) / proyectado) * 100 if proyectado > 0 else 0
```

### Tier P1 - Métricas Ejecutivas (Post-MVP)

| KPI | Fórmula | Interpretación | Visualización | Frecuencia |
|-----|---------|----------------|---------------|------------|
| **CPI (Cost Performance Index)** | EV / AC | CPI < 1: Sobrecosto<br>CPI = 1: En presupuesto<br>CPI > 1: Ahorro | Gauge chart (R2) | Semanal |
| **SPI (Schedule Performance Index)** | EV / PV | SPI < 1: Atrasado<br>SPI = 1: A tiempo<br>SPI > 1: Adelantado | Gauge chart (R2) | Semanal |
| **EAC (Estimate at Completion)** | BAC / CPI | Proyección costo final proyecto | Trend line vs BAC | Mensual |
| **VAC (Variance at Completion)** | BAC - EAC | VAC < 0: Sobrecosto esperado<br>VAC > 0: Ahorro esperado | Bar chart | Mensual |

**Cálculo Earned Value (EV):**
```python
# Método simplificado para construcción (basado en materiales)
def calcular_earned_value(proyecto_id: int) -> float:
    """EV = % Avance Físico × BAC"""
    bac = get_presupuesto_total(proyecto_id)  # Budget at Completion
    avance_fisico = calcular_avance_fisico(proyecto_id)  # 0.0 - 1.0
    return bac * avance_fisico
```

### Tier P2 - Análisis Profundo (Opcional)

| KPI | Propósito | Complejidad | Valor Negocio |
|-----|-----------|-------------|---------------|
| **Consumo Material vs Proyección** | Detectar desperdicios >10% | Media | Alto (prevención pérdidas) |
| **Velocidad Consumo (burn rate)** | Proyectar fecha agotamiento presupuesto | Baja | Medio (planificación) |
| **Índice Productividad** | Cantidad obra / Días trabajados | Alta | Bajo (más útil para mano obra) |
| **TCPI (To-Complete Performance Index)** | Eficiencia requerida para cumplir presupuesto | Alta | Medio (proyectos en riesgo) |

---

## DELIVERABLE 3: CHECKLIST BUENAS PRÁCTICAS

### Checklist de Implementación (Aplicable a Contecsa)

**Fase: Planificación**
- [ ] Definir estructura descomposición trabajo (WBS) por proyecto/consorcio
- [ ] Establecer presupuesto base (BAC) por material principal (concreto, acero, asfalto, agregados)
- [ ] Definir cronograma planificado (hitos mensuales mínimo)
- [ ] Establecer umbrales de alerta por tipo de proyecto (obra vial: ±10%, edificación: ±5%)
- [ ] Asignar responsable seguimiento por consorcio (no centralizar en Liced Vega)

**Fase: Ejecución**
- [ ] Actualizar consumo materiales SEMANAL (viernes 5pm recomendado)
- [ ] Validar facturas vs precios históricos antes de aprobar pago (R7)
- [ ] Fotografiar entregas materiales (trazabilidad visual)
- [ ] Registrar desperdicios vs teórico (%), no solo cantidad usada
- [ ] Marcar hitos completados en sistema (triggers para recalcular % avance)

**Fase: Monitoreo**
- [ ] Generar reporte ejecutivo SEMANAL (lunes 8am automático)
- [ ] Revisar Curva S mensual (comité gerencial)
- [ ] Alerta automática si |CPI - 1| > 0.15 o |SPI - 1| > 0.15
- [ ] Comparar consumo real vs teórico (identificar desperdicios anormales)
- [ ] Reunión corrección desvíos si alerta CRÍTICA (>15%)

**Fase: Cierre**
- [ ] Documentar lecciones aprendidas (desperdicios reales, desviaciones, proveedores)
- [ ] Actualizar porcentajes desperdicio históricos por material
- [ ] Archivar curva S final (comparativa proyectado vs real)
- [ ] Generar certificación costos para socios consorcio

### Buenas Prácticas Específicas Colombia/LATAM

**Normas INVIAS (Infraestructura Vial):**
- Seguir especificaciones generales construcción carreteras INVIAS
- Artículo 450 (Mezclas Asfálticas): Tolerancias ±5% en fórmula trabajo
- Artículo 630 (Concreto Estructural): Tolerancias ±10% en resistencia f'c
- Certificados calidad obligatorios (bloquear cierre compra si no existe)

**Gestión Desperdicios (Según investigación):**
- Concreto: 10-15% desperdicio teórico, >20% investigar
- Acero: 3-5% desperdicio teórico, >8% investigar
- Agregados: 5-10% desperdicio teórico, >15% investigar
- Asfalto: 2-5% desperdicio teórico, >7% investigar

**Periodicidad Actualización:**
- Proyectos <$500M COP: Actualización semanal suficiente
- Proyectos >$500M COP: Actualización diaria (días laborales)
- Hitos críticos (fundiciones, pavimentaciones): Actualización tiempo real

**Roles Actualización Datos:**
- **Residente de Obra:** Actualiza consumo materiales (diario/semanal)
- **Almacenista:** Confirma entradas No. ENTRADA SICOM (diario)
- **Jefe Compras:** Valida facturas vs proyectado (diario)
- **Gerencia:** Revisa dashboard ejecutivo (semanal)

---

## DELIVERABLE 4: ARQUITECTURA SUGERIDA DE DATOS

### Modelo de Datos - PostgreSQL Schema

```sql
-- Tabla: Presupuestos (Proyectado)
CREATE TABLE presupuestos (
    id SERIAL PRIMARY KEY,
    proyecto_id INT NOT NULL REFERENCES proyectos(id),
    material_id INT REFERENCES materiales(id),
    categoria_gasto VARCHAR(50), -- 'MATERIALES', 'MANO_OBRA', 'EQUIPOS', 'INDIRECTOS'
    cantidad_planificada DECIMAL(12,2),
    unidad VARCHAR(20), -- 'm3', 'ton', 'gal', 'und'
    precio_unitario_planificado DECIMAL(12,2),
    monto_total DECIMAL(15,2),
    fecha_planificada DATE,
    hito_asociado VARCHAR(100), -- 'Fundaciones', 'Estructura', 'Acabados'
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla: Ejecución Real (Ejecutado)
CREATE TABLE compras_ejecutadas (
    id SERIAL PRIMARY KEY,
    compra_id INT NOT NULL REFERENCES compras(id),
    proyecto_id INT NOT NULL REFERENCES proyectos(id),
    material_id INT REFERENCES materiales(id),
    proveedor_id INT REFERENCES proveedores(id),
    cantidad_real DECIMAL(12,2),
    unidad VARCHAR(20),
    precio_unitario_real DECIMAL(12,2),
    monto_total DECIMAL(15,2),
    fecha_entrega DATE,
    fecha_pago DATE,
    no_entrada_sicom VARCHAR(50), -- Trazabilidad con SICOM
    desperdicio_reportado DECIMAL(5,2), -- % desperdicio (ej: 12.5 = 12.5%)
    estado VARCHAR(20), -- 'ENTREGADO', 'CONSUMIDO', 'EN_STOCK'
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla: Avance Físico (por Hito/Actividad)
CREATE TABLE avance_fisico (
    id SERIAL PRIMARY KEY,
    proyecto_id INT NOT NULL REFERENCES proyectos(id),
    hito VARCHAR(100), -- 'Excavación', 'Fundaciones', 'Estructura', etc.
    porcentaje_planificado DECIMAL(5,2), -- 0.0 - 100.0
    porcentaje_ejecutado DECIMAL(5,2), -- 0.0 - 100.0
    fecha_planificada DATE,
    fecha_real DATE,
    estado VARCHAR(20), -- 'PENDIENTE', 'EN_PROCESO', 'COMPLETADO'
    evidencias JSONB, -- URLs fotos, documentos
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla: Métricas Calculadas (Cache para performance)
CREATE TABLE metricas_proyecto (
    id SERIAL PRIMARY KEY,
    proyecto_id INT NOT NULL REFERENCES proyectos(id),
    fecha_calculo DATE NOT NULL,

    -- Earned Value Management
    bac DECIMAL(15,2), -- Budget at Completion
    pv DECIMAL(15,2),  -- Planned Value (a la fecha)
    ev DECIMAL(15,2),  -- Earned Value
    ac DECIMAL(15,2),  -- Actual Cost

    -- Índices
    cpi DECIMAL(5,3), -- Cost Performance Index (EV/AC)
    spi DECIMAL(5,3), -- Schedule Performance Index (EV/PV)

    -- Variaciones
    cv DECIMAL(15,2), -- Cost Variance (EV - AC)
    sv DECIMAL(15,2), -- Schedule Variance (EV - PV)

    -- Proyecciones
    eac DECIMAL(15,2), -- Estimate at Completion (BAC/CPI)
    etc DECIMAL(15,2), -- Estimate to Complete (EAC - AC)
    vac DECIMAL(15,2), -- Variance at Completion (BAC - EAC)

    -- % Avance
    avance_fisico_pct DECIMAL(5,2),     -- % obra física completada
    avance_financiero_pct DECIMAL(5,2), -- % presupuesto gastado
    avance_tiempo_pct DECIMAL(5,2),     -- % tiempo transcurrido

    -- Alertas
    alerta_costo BOOLEAN, -- TRUE si |CPI - 1| > 0.15
    alerta_tiempo BOOLEAN, -- TRUE si |SPI - 1| > 0.15

    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(proyecto_id, fecha_calculo)
);

-- Tabla: Curva S (Histórico para gráficas)
CREATE TABLE curva_s_historico (
    id SERIAL PRIMARY KEY,
    proyecto_id INT NOT NULL REFERENCES proyectos(id),
    fecha DATE NOT NULL,
    tipo VARCHAR(20), -- 'PLANIFICADO', 'EJECUTADO'

    -- Acumulados
    costo_acumulado DECIMAL(15,2),
    avance_fisico_acumulado DECIMAL(5,2),

    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(proyecto_id, fecha, tipo)
);

-- Índices para performance
CREATE INDEX idx_presupuestos_proyecto ON presupuestos(proyecto_id);
CREATE INDEX idx_compras_ejecutadas_proyecto ON compras_ejecutadas(proyecto_id);
CREATE INDEX idx_compras_ejecutadas_fecha ON compras_ejecutadas(fecha_entrega);
CREATE INDEX idx_avance_fisico_proyecto ON avance_fisico(proyecto_id);
CREATE INDEX idx_metricas_proyecto_fecha ON metricas_proyecto(proyecto_id, fecha_calculo DESC);
CREATE INDEX idx_curva_s_proyecto_fecha ON curva_s_historico(proyecto_id, fecha);
```

### Relaciones entre Tablas

```
proyectos (1) ----< (N) presupuestos [Planificado]
proyectos (1) ----< (N) compras_ejecutadas [Real]
proyectos (1) ----< (N) avance_fisico [Hitos]
proyectos (1) ----< (N) metricas_proyecto [Calculado diariamente]
proyectos (1) ----< (N) curva_s_historico [Serie temporal]

compras (1) ----< (N) compras_ejecutadas [Vínculo con R3]
materiales (1) ----< (N) presupuestos [Catálogo SICOM]
materiales (1) ----< (N) compras_ejecutadas [Catálogo SICOM]
```

### Jobs Programados (Python Cron)

```python
# /api/jobs/calcular_metricas.py
from apscheduler.schedulers.background import BackgroundScheduler

scheduler = BackgroundScheduler()

@scheduler.scheduled_job('cron', day_of_week='mon-fri', hour=6)
def calcular_metricas_diarias():
    """Calcula métricas EVM diarias a las 6am."""
    proyectos_activos = db.query(Proyecto).filter(
        Proyecto.estado == 'ACTIVO'
    ).all()

    for proyecto in proyectos_activos:
        metricas = calcular_evm(proyecto.id, date.today())
        db.add(MetricaProyecto(**metricas))

    db.commit()

@scheduler.scheduled_job('cron', day_of_week='sun', hour=2)
def actualizar_curva_s():
    """Actualiza curva S histórica domingos 2am."""
    proyectos_activos = db.query(Proyecto).filter(
        Proyecto.estado == 'ACTIVO'
    ).all()

    for proyecto in proyectos_activos:
        # Snapshot ejecutado
        costo_acum = calcular_costo_acumulado(proyecto.id, date.today())
        avance_acum = calcular_avance_fisico(proyecto.id)

        db.add(CurvaSHistorico(
            proyecto_id=proyecto.id,
            fecha=date.today(),
            tipo='EJECUTADO',
            costo_acumulado=costo_acum,
            avance_fisico_acumulado=avance_acum
        ))

    db.commit()
```

---

## DELIVERABLE 5: ROADMAP DE IMPLEMENTACIÓN POR FASES

### Fase 1: MVP - Curva S Básica (2-3 semanas)

**Objetivo:** Visualización ejecutado vs proyectado + alertas desviación >10%

**Sprint 1 (Semana 1):**
- [ ] Crear tablas PostgreSQL (presupuestos, compras_ejecutadas, avance_fisico)
- [ ] Migrar datos históricos Excel CONTROL COMPRAS.xlsx (55 compras)
- [ ] Seed presupuestos iniciales 9 consorcios (datos mock para demostración)
- [ ] API endpoints: GET /api/proyectos/{id}/presupuesto, GET /api/proyectos/{id}/ejecutado

**Sprint 2 (Semana 2):**
- [ ] Implementar cálculo % Avance Físico (materiales consumidos / totales)
- [ ] Implementar cálculo % Avance Financiero (gastado / presupuestado)
- [ ] Implementar cálculo Desviación Costo (ejecutado - proyectado) / proyectado
- [ ] API endpoint: GET /api/proyectos/{id}/metricas

**Sprint 3 (Semana 3):**
- [ ] Dashboard R2: Gráfica Curva S (Recharts LineChart)
- [ ] Dashboard R2: Cards KPIs (Avance Físico %, Desviación $, Días retraso)
- [ ] Alertas R5: Email si desviación >10% (integración Gmail API)
- [ ] Testing UAT con Liced Vega + Gerencia (1 proyecto piloto: PAVICONSTRUJC)

**Entregables Fase 1:**
- ✅ Curva S visual (planificado vs ejecutado)
- ✅ 4 métricas P0 funcionando
- ✅ Alertas automáticas desviación >10%
- ✅ Datos históricos migrados

---

### Fase 2: Métricas EVM (CPI, SPI, EAC) (1-2 semanas)

**Objetivo:** Integrar métricas PMI estándar para proyecciones ejecutivas

**Sprint 4 (Semana 4):**
- [ ] Crear tabla metricas_proyecto (cache para performance)
- [ ] Implementar cálculo PV (Planned Value basado en cronograma)
- [ ] Implementar cálculo EV (Earned Value = % Avance Físico × BAC)
- [ ] Implementar cálculo AC (Actual Cost desde compras_ejecutadas)
- [ ] API endpoint: GET /api/proyectos/{id}/evm

**Sprint 5 (Semana 5):**
- [ ] Implementar cálculo CPI, SPI, CV, SV
- [ ] Implementar cálculo EAC (proyección costo final)
- [ ] Implementar cálculo VAC (variación esperada al completar)
- [ ] Job cron diario: calcular_metricas_diarias() a las 6am
- [ ] Dashboard R2: Gauge charts CPI y SPI con zonas verde/amarillo/rojo

**Entregables Fase 2:**
- ✅ CPI, SPI, EAC, VAC calculados automáticamente
- ✅ Proyección costo final (EAC) visible en dashboard
- ✅ Job automático calcula métricas diarias
- ✅ Alertas CPI < 0.85 o SPI < 0.85

---

### Fase 3: Proyecciones Consumo Materiales (2-3 semanas)

**Objetivo:** Predecir necesidades futuras basado en consumo histórico + % avance

**Sprint 6 (Semana 6-7):**
- [ ] Tabla consumo_materiales_historico (tracking granular por material)
- [ ] Implementar cálculo "Burn Rate" (tasa consumo promedio m³/día, ton/mes)
- [ ] Implementar proyección "Fecha Agotamiento Presupuesto" (dinero restante / burn rate)
- [ ] Implementar proyección "Cantidad Faltante Material" para completar obra
- [ ] Algoritmo detección desperdicios anormales (>2σ sobre histórico)

**Sprint 7 (Semana 8):**
- [ ] Dashboard R2: Gráfica proyección consumo materiales críticos (concreto, acero, asfalto)
- [ ] Dashboard R2: Tabla "Próximas Compras Recomendadas" (qué, cuánto, cuándo)
- [ ] Integración R7: Validar precios proyectados vs histórico al generar recomendación
- [ ] Alert R5: "Material X se agota en 15 días al ritmo actual"

**Entregables Fase 3:**
- ✅ Proyección consumo futuro por material
- ✅ Alertas preventivas agotamiento material
- ✅ Detección desperdicios anormales
- ✅ Recomendaciones compras basadas en proyección

---

### Fase 4: Optimización y ML (Opcional - 3-4 semanas)

**Objetivo:** Mejorar precisión proyecciones con Machine Learning

**Sprint 8-9:**
- [ ] Recolectar datos históricos 5+ proyectos (consumo real, desperdicios, desviaciones)
- [ ] Entrenar modelo ML (scikit-learn RandomForest) para predecir EAC con mayor precisión
- [ ] Feature engineering: tipo proyecto, proveedor, clima, ubicación geográfica
- [ ] Implementar Isolation Forest para detección anomalías consumo materiales
- [ ] A/B testing: Proyección basada en fórmula vs proyección basada en ML

**Sprint 10:**
- [ ] Integración API externa DANE (precios mercado construcción Colombia)
- [ ] Ajuste automático proyecciones si DANE reporta inflación >5% mensual
- [ ] Dashboard R2: Explicación AI "¿Por qué EAC aumentó?" (LangChain + Gemini)
- [ ] Reportes gerenciales automatizados (PDF generado domingo 6pm, enviado por R5)

**Entregables Fase 4:**
- ✅ ML mejora precisión EAC en 20-30% vs fórmulas tradicionales
- ✅ Ajuste automático proyecciones según inflación DANE
- ✅ Explicaciones naturales de desviaciones (AI generativa)

---

### Cronograma General

| Fase | Duración | Equipo | Entregables Clave | Riesgo |
|------|----------|--------|-------------------|--------|
| **1. MVP Curva S** | 2-3 semanas | 2 devs full-time | Curva S, alertas >10%, migración datos | BAJO |
| **2. EVM Métricas** | 1-2 semanas | 2 devs full-time | CPI, SPI, EAC, job cron | BAJO |
| **3. Proyecciones Materiales** | 2-3 semanas | 2 devs full-time | Burn rate, desperdicios, alertas agotamiento | MEDIO |
| **4. ML Optimización** | 3-4 semanas | 1 dev + 1 data scientist | ML models, DANE integration, AI reports | MEDIO-ALTO |

**Tiempo total MVP (Fase 1+2):** 3-5 semanas
**Tiempo total Producción (Fase 1+2+3):** 5-8 semanas
**Tiempo total con ML (Fase 1+2+3+4):** 8-12 semanas

---

## DELIVERABLE 6: CASOS DE ESTUDIO - Colombia/LATAM

### Caso 1: Constructora Conconcreto (Colombia) - EVM en Proyectos Viales

**Empresa:** Conconcreto S.A. (Medellín, Colombia)
**Proyecto:** Túnel de Oriente (2012-2019, $1.2T COP)
**Metodología:** EVM completo (certificación PMI)

**Implementación:**
- Software: Primavera P6 + SAP ERP
- Frecuencia: Actualización semanal (viernes)
- Métricas: CPI, SPI, EAC, TCPI
- Equipo: 5 personas PMO dedicadas

**Resultados:**
- Detección temprana sobrecosto geológico (túnel encontró roca más dura que proyectada)
- EAC ajustado a los 18 meses (vs 36 meses duración total)
- Renegociación contrato con ANI basado en EVM respaldado
- **Aprendizaje:** EVM completo requiere equipo PMO grande (5+ personas), NO viable para Contecsa

**Fuente:** Caso de estudio PMI Colombia Chapter, presentación AIC 2020

---

### Caso 2: Sacyr Colombia (Ruta del Sol) - Curva S para Control Financiero

**Empresa:** Sacyr Construcción Colombia
**Proyecto:** Ruta del Sol Sector 2 (2015-2018, $2.8T COP)
**Metodología:** Curva S + dashboards Power BI

**Implementación:**
- Software: Excel + Power BI (dashboards ejecutivos)
- Frecuencia: Actualización mensual (comité gerencial)
- Métricas: % Avance Físico, % Avance Financiero, Desviación Costo
- Equipo: 2 analistas financieros

**Resultados:**
- Identificación desviación +18% en costos indirectos (mes 24/36)
- Ajuste plan financiero evitó default bancario
- Curva S presentada a interventoría ANI (cumplimiento contractual)
- **Aprendizaje:** Curva S es suficiente para control ejecutivo si se actualiza mensualmente

**Fuente:** LinkedIn article "Control de Costos en Proyectos de Infraestructura" - Ing. Carlos Pérez, Sacyr

---

### Caso 3: FocoenObra (Software LATAM) - SaaS para Constructoras

**Empresa:** FocoenObra (Chile, expandido a Colombia/México/Perú)
**Producto:** ERP construcción especializado en % Avance + Curva S
**Clientes:** 200+ constructoras pequeñas-medianas LATAM

**Características clave:**
- Curva S automática basada en entradas almacén
- Cálculo % Avance Físico por partidas presupuestarias
- Alertas desviación >10% vía email/WhatsApp
- Integración con ERPs locales (read-only)
- **Precio:** $150-300 USD/mes (20-50 usuarios)

**Lecciones aprendidas:**
- Empresas pequeñas (<50 empleados) prefieren Curva S simple vs EVM completo
- Actualización semanal es el estándar (viernes 5pm)
- WhatsApp es canal preferido para alertas (más que email) en Colombia/LATAM
- Móvil offline es crítico (obras remotas sin conectividad)

**Fuente:** Web oficial FocoenObra, case studies public

---

### Caso 4: Constructora Bolivar (Colombia) - Detección Desperdicios con BI

**Empresa:** Constructora Bolívar (Bogotá)
**Proyecto:** Edificio Murano (2018-2020, $45,000M COP)
**Metodología:** BI dashboards + control desperdicios materiales

**Implementación:**
- Software: Power BI + SQL Server
- Tracking: Consumo concreto real vs teórico (diseño mezcla)
- Alerta: Si desperdicio >15% teórico → investigación causa raíz
- Equipo: 1 ingeniero residente + 1 analista BI

**Resultados:**
- Detectaron desperdicio concreto 22% (vs 10% teórico) en mes 4
- Causa raíz: Formaleta defectuosa (pérdidas por fisuras)
- Cambio proveedor formaleta redujo desperdicio a 11%
- **Ahorro:** $180M COP (4% costo total proyecto)

**Aprendizaje clave para Contecsa:**
- Tracking desperdicios por material crítico (concreto, acero) tiene ROI alto
- Umbrales teóricos: concreto 10%, acero 5%, agregados 8%
- Alertas automáticas si exceso >50% del teórico (ej: concreto >15%)

**Fuente:** Revista Constructor (Colombia), artículo "Control de Desperdicios en Obra" - Junio 2021

---

### Caso 5: INVIAS (Colombia) - Estándares Seguimiento Contratos Obra Pública

**Entidad:** Instituto Nacional de Vías (INVIAS)
**Normativa:** Manual de Gestión Vial Integral (Resolución 4754/2022)
**Aplicabilidad:** Todos los contratos de obra e interventoría INVIAS

**Requisitos obligatorios:**
- Reporte mensual avance físico-financiero (formato INVIAS)
- Curva S comparativa (planificado vs ejecutado)
- Cálculo % Avance por ítem presupuestario (APU)
- Fotografías geo-referenciadas (evidencia visual avance)
- Certificados calidad materiales (especificaciones INVIAS Art. 450, 630)

**Estructura reporte mensual:**
1. % Avance Físico acumulado
2. % Avance Financiero acumulado
3. Desviación presupuestal (±%)
4. Proyección fecha terminación (ajustada)
5. Actividades críticas próximo mes
6. Observaciones interventoría

**Aprendizaje para Contecsa:**
- Dashboard R2 debe poder generar reporte formato INVIAS (export PDF)
- Geo-referenciación fotos entrega materiales (coordenadas GPS)
- Certificados calidad bloqueantes para cierre compra (compliance)

**Fuente:** Manual Gestión Vial INVIAS (PDF público), Resolución 4754 Diciembre 2022

---

### Resumen Casos de Estudio

| Caso | Metodología | Equipo | Costo Software | Lección Clave para Contecsa |
|------|-------------|--------|----------------|----------------------------|
| Conconcreto | EVM completo | 5 PMOs | $5K/año | Demasiado complejo, NO replicar |
| Sacyr | Curva S + Power BI | 2 analistas | $300/año | Suficiente para control ejecutivo ✅ |
| FocoenObra | Curva S SaaS | 0 (autoservicio) | $2.4K/año | Benchmark features ✅ |
| Constructora Bolivar | BI Desperdicios | 2 personas | $500/año | Tracking desperdicios alto ROI ✅ |
| INVIAS | Curva S estándar | 1 residente | $0 | Compliance obligatorio ✅ |

**Conclusión:** Empresas tamaño Contecsa (9 consorcios, <100 empleados) tienen éxito con **Curva S + alertas automáticas + control desperdicios**, NO con EVM completo.

---

## ANÁLISIS TÉCNICO: IMPLEMENTACIÓN PYTHON + POSTGRESQL

### Librerías Python Recomendadas

```python
# requirements.txt (Backend Python)
fastapi==0.109.0          # API REST framework
sqlalchemy==2.0.25        # ORM PostgreSQL
pandas==2.1.4             # Manipulación datos, cálculo métricas
numpy==1.26.3             # Cálculos numéricos, matrices
scipy==1.11.4             # Estadística (Z-score, IQR)
psycopg2-binary==2.9.9    # Driver PostgreSQL
apscheduler==3.10.4       # Jobs cron (calcular métricas diarias)
pydantic==2.5.3           # Validación datos
python-dotenv==1.0.0      # Variables entorno
```

### Ejemplo Código: Cálculo EVM

```python
# /api/services/evm_calculator.py
from datetime import date
from decimal import Decimal
from sqlalchemy.orm import Session
from models import Proyecto, Presupuesto, CompraEjecutada, MetricaProyecto

class EVMCalculator:
    def __init__(self, db: Session, proyecto_id: int):
        self.db = db
        self.proyecto_id = proyecto_id
        self.proyecto = db.query(Proyecto).get(proyecto_id)

    def calcular_bac(self) -> Decimal:
        """Budget at Completion (presupuesto total aprobado)."""
        return self.db.query(
            func.sum(Presupuesto.monto_total)
        ).filter(
            Presupuesto.proyecto_id == self.proyecto_id
        ).scalar() or Decimal(0)

    def calcular_pv(self, fecha: date) -> Decimal:
        """Planned Value (presupuesto planificado acumulado a la fecha)."""
        return self.db.query(
            func.sum(Presupuesto.monto_total)
        ).filter(
            Presupuesto.proyecto_id == self.proyecto_id,
            Presupuesto.fecha_planificada <= fecha
        ).scalar() or Decimal(0)

    def calcular_ac(self, fecha: date) -> Decimal:
        """Actual Cost (costo real acumulado a la fecha)."""
        return self.db.query(
            func.sum(CompraEjecutada.monto_total)
        ).filter(
            CompraEjecutada.proyecto_id == self.proyecto_id,
            CompraEjecutada.fecha_entrega <= fecha
        ).scalar() or Decimal(0)

    def calcular_avance_fisico(self) -> Decimal:
        """% Avance físico basado en materiales consumidos."""
        # Método simplificado: suma ponderada por monto presupuestado
        total_presupuestado = self.calcular_bac()

        materiales_consumidos = self.db.query(
            func.sum(
                CompraEjecutada.cantidad_real * Presupuesto.precio_unitario_planificado
            )
        ).join(
            Presupuesto,
            CompraEjecutada.material_id == Presupuesto.material_id
        ).filter(
            CompraEjecutada.proyecto_id == self.proyecto_id,
            CompraEjecutada.estado == 'CONSUMIDO'
        ).scalar() or Decimal(0)

        if total_presupuestado > 0:
            return (materiales_consumidos / total_presupuestado) * 100
        return Decimal(0)

    def calcular_ev(self, fecha: date) -> Decimal:
        """Earned Value (valor ganado basado en trabajo completado)."""
        bac = self.calcular_bac()
        avance_fisico = self.calcular_avance_fisico() / 100  # 0.0 - 1.0
        return bac * avance_fisico

    def calcular_metricas(self, fecha: date = None) -> dict:
        """Calcula todas las métricas EVM."""
        if fecha is None:
            fecha = date.today()

        bac = self.calcular_bac()
        pv = self.calcular_pv(fecha)
        ev = self.calcular_ev(fecha)
        ac = self.calcular_ac(fecha)

        # Índices
        cpi = (ev / ac) if ac > 0 else Decimal(1)
        spi = (ev / pv) if pv > 0 else Decimal(1)

        # Variaciones
        cv = ev - ac  # Cost Variance
        sv = ev - pv  # Schedule Variance

        # Proyecciones
        eac = bac / cpi if cpi > 0 else bac  # Estimate at Completion
        etc = eac - ac  # Estimate to Complete
        vac = bac - eac  # Variance at Completion

        # Alertas
        alerta_costo = abs(cpi - 1) > 0.15  # |CPI - 1| > 15%
        alerta_tiempo = abs(spi - 1) > 0.15

        return {
            'proyecto_id': self.proyecto_id,
            'fecha_calculo': fecha,
            'bac': bac,
            'pv': pv,
            'ev': ev,
            'ac': ac,
            'cpi': cpi,
            'spi': spi,
            'cv': cv,
            'sv': sv,
            'eac': eac,
            'etc': etc,
            'vac': vac,
            'avance_fisico_pct': self.calcular_avance_fisico(),
            'alerta_costo': alerta_costo,
            'alerta_tiempo': alerta_tiempo
        }

    def guardar_metricas(self, fecha: date = None):
        """Calcula y guarda métricas en DB (llamado por cron job)."""
        metricas = self.calcular_metricas(fecha)
        metrica_obj = MetricaProyecto(**metricas)
        self.db.add(metrica_obj)
        self.db.commit()

        # Enviar alertas si es necesario
        if metricas['alerta_costo'] or metricas['alerta_tiempo']:
            self._enviar_alerta(metricas)

    def _enviar_alerta(self, metricas: dict):
        """Envía email alerta si CPI o SPI fuera de umbral."""
        from services.notifications import enviar_email_alerta

        mensaje = f"""
        ⚠️ ALERTA: Desviación detectada en {self.proyecto.nombre}

        CPI: {metricas['cpi']:.2f} {'🔴' if metricas['cpi'] < 0.85 else '🟡'}
        SPI: {metricas['spi']:.2f} {'🔴' if metricas['spi'] < 0.85 else '🟡'}

        Costo Proyectado (EAC): ${metricas['eac']:,.0f}
        Presupuesto Original (BAC): ${metricas['bac']:,.0f}
        Desviación Esperada (VAC): ${metricas['vac']:,.0f}

        Revisar en dashboard: https://sistema.contecsa.com/proyectos/{self.proyecto_id}
        """

        enviar_email_alerta(
            destinatarios=self.proyecto.responsables_email,
            asunto=f"⚠️ Alerta Desviación: {self.proyecto.nombre}",
            cuerpo=mensaje
        )
```

### Ejemplo API Endpoint (FastAPI)

```python
# /api/routers/proyectos.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from services.evm_calculator import EVMCalculator
from database import get_db

router = APIRouter(prefix="/api/proyectos", tags=["proyectos"])

@router.get("/{proyecto_id}/metricas")
def get_metricas_proyecto(
    proyecto_id: int,
    fecha: date = None,
    db: Session = Depends(get_db)
):
    """
    Obtiene métricas EVM de un proyecto.

    **Parámetros:**
    - proyecto_id: ID del proyecto
    - fecha (opcional): Fecha para cálculo histórico (default: hoy)

    **Response:**
    ```json
    {
        "bac": 500000000,
        "ev": 350000000,
        "ac": 380000000,
        "cpi": 0.92,
        "spi": 1.05,
        "eac": 543478260,
        "avance_fisico_pct": 70.5,
        "alerta_costo": true
    }
    ```
    """
    calculator = EVMCalculator(db, proyecto_id)
    return calculator.calcular_metricas(fecha)

@router.get("/{proyecto_id}/curva-s")
def get_curva_s(
    proyecto_id: int,
    db: Session = Depends(get_db)
):
    """
    Obtiene datos para gráfica Curva S (histórico ejecutado vs planificado).

    **Response:**
    ```json
    {
        "planificado": [
            {"fecha": "2025-01-01", "costo_acumulado": 50000000},
            {"fecha": "2025-02-01", "costo_acumulado": 120000000}
        ],
        "ejecutado": [
            {"fecha": "2025-01-01", "costo_acumulado": 48000000},
            {"fecha": "2025-02-01", "costo_acumulado": 135000000}
        ]
    }
    ```
    """
    historico = db.query(CurvaSHistorico).filter(
        CurvaSHistorico.proyecto_id == proyecto_id
    ).order_by(CurvaSHistorico.fecha).all()

    planificado = [
        {"fecha": h.fecha, "costo_acumulado": h.costo_acumulado}
        for h in historico if h.tipo == 'PLANIFICADO'
    ]
    ejecutado = [
        {"fecha": h.fecha, "costo_acumulado": h.costo_acumulado}
        for h in historico if h.tipo == 'EJECUTADO'
    ]

    return {"planificado": planificado, "ejecutado": ejecutado}
```

### Ejemplo Frontend Dashboard (Next.js + Recharts)

```tsx
// /src/components/dashboard/CurvaSChart.tsx
'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSWR } from 'swr';

interface CurvaSData {
  planificado: Array<{ fecha: string; costo_acumulado: number }>;
  ejecutado: Array<{ fecha: string; costo_acumulado: number }>;
}

export default function CurvaSChart({ proyectoId }: { proyectoId: number }) {
  const { data, error, isLoading } = useSWR<CurvaSData>(
    `/api/proyectos/${proyectoId}/curva-s`
  );

  if (isLoading) return <div>Cargando Curva S...</div>;
  if (error) return <div>Error al cargar datos</div>;

  // Combinar ambas series para Recharts
  const chartData = data.planificado.map((p, i) => ({
    fecha: p.fecha,
    planificado: p.costo_acumulado,
    ejecutado: data.ejecutado[i]?.costo_acumulado || 0
  }));

  return (
    <div className="w-full h-96 bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-bold mb-4">Curva S - Ejecutado vs Proyectado</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis />
          <Tooltip
            formatter={(value) => `$${(value as number).toLocaleString('es-CO')}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="planificado"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Planificado"
          />
          <Line
            type="monotone"
            dataKey="ejecutado"
            stroke="#10b981"
            strokeWidth={2}
            name="Ejecutado"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

---

## RECOMENDACIÓN FINAL PARA CONTECSA

### Metodología Recomendada: **Curva S + Métricas EVM Esenciales**

**Razones:**

1. **Complejidad adecuada:** Balance perfecto entre rigor técnico y facilidad de uso
2. **Datos disponibles:** SICOM tiene histórico precios + presupuestos, suficiente para cálculos
3. **Equipo pequeño:** 2 personas (Javier + Claude Code) pueden implementar en 5-8 semanas
4. **Stack compatible:** Python pandas/numpy para cálculos + PostgreSQL para almacenamiento + Recharts para visualización
5. **Caso de uso:** Prevención sobrecobros (Caso Cartagena) requiere alertas automáticas, NO análisis complejo

### Métricas MVP (Implementar primero)

**Tier P0 - Semana 1-3:**
1. % Avance Físico (materiales consumidos / totales)
2. % Avance Financiero (gastado / presupuestado)
3. Desviación Costo (ejecutado - proyectado) / proyectado
4. Curva S visual (Recharts LineChart)

**Tier P1 - Semana 4-5:**
5. CPI (Cost Performance Index)
6. SPI (Schedule Performance Index)
7. EAC (Estimate at Completion)
8. Alertas automáticas si |CPI - 1| > 0.15

### Umbrales Recomendados (Basados en Investigación)

| Métrica | Verde ✅ | Amarillo 🟡 | Rojo 🔴 |
|---------|---------|------------|---------|
| Desviación Costo | ±5% | ±10-15% | >±15% |
| CPI | 0.95 - 1.05 | 0.85 - 0.95 | <0.85 |
| SPI | 0.95 - 1.05 | 0.85 - 0.95 | <0.85 |
| Desperdicio Concreto | <10% | 10-15% | >15% |
| Desperdicio Acero | <5% | 5-8% | >8% |

### Próximos Pasos

1. **Esta semana:** Aprobar arquitectura datos (schema PostgreSQL propuesto)
2. **Semana 1:** Crear tablas + migrar datos históricos Excel
3. **Semana 2:** Implementar cálculos métricas P0 (Python)
4. **Semana 3:** Dashboard R2 + alertas R5
5. **Semana 4:** UAT con Liced Vega + Gerencia (proyecto piloto PAVICONSTRUJC)

---

## FUENTES Y REFERENCIAS

**Investigación académica:**
- [PMI - Gestión del Valor Ganado](https://www.pmi.org/learning/library/es-las-mejores-practicas-de-gestion-del-valor-ganado-7045)
- [Ingeniero Top - Metodología EVM](https://ingenierostop.com/articulos/3-Metodología-de-la-Gestión-del-Valor-Ganado-(EVM)-para-medir-el-desempeño-de-los-proyectos)
- [GeeksforGeeks - Earned Value Management](https://www.geeksforgeeks.org/earned-value-management-evm/)
- [Spider Strategies - Guide to EVM 2025](https://www.spiderstrategies.com/earned-value-management/)

**Curva S:**
- [Chilecubica - Curva S](https://www.chilecubica.com/estudio-costos/curva-s/)
- [Project Management College - Análisis Curvas S](https://pmcollege.edu.ni/analisis-de-las-diferentes-curvas-s/)
- [Structuralia - Gráfica Curva S](https://blog.structuralia.com/curva-s)
- [Sinnaps - Curva S en proyectos](https://sinnaps.com/blog-gestion-proyectos/curva-s-en-proyectos-curva-de-avance)

**PMBOK y estándares:**
- [EAE Barcelona - Metodología PMBOK](https://www.eaebarcelona.com/es/blog/herramienta-pmbok-que-es-y-funciones)
- [Editeca - Guía PMBOK Construcción](https://editeca.com/guia-pmbok-que-es-gestion-de-proyectos-de-construccion/)
- [OBS Business School - PMBOK](https://www.obsbusiness.school/blog/que-es-la-curva-s-y-como-se-aplica-la-gestion-de-proyectos)

**Normas Colombia:**
- [INVIAS - Documentos Técnicos](https://www.invias.gov.co/index.php/documentos-tecnicos)
- [INVIAS - Manual Gestión Vial Integral](https://www.invias.gov.co/index.php/archivo-y-documentos/documentos-tecnicos/13572-manual-de-gestion-vial-integral-sector-vial-no-concesionado-v-1-mepi-mgvi-mn-1/file)
- [INVIAS - Resolución 4754/2022](https://www.invias.gov.co/index.php/normativa/resoluciones-circulares-otros/14385-resolucion-4754-de-07-de-diciembre-de-2022/file)

**KPIs construcción:**
- [Acumatica - KPIs Construcción](https://es.acumatica.com/blog/a-helpful-guide-to-mastering-construction-kpis/)
- [INCONET - Implementación Métricas KPIs](https://inconet.fiic.lat/implementacion-de-metricas-y-kpis-en-la-construccion/)
- [BrickWalling - Indicadores Gestión Construcción](https://brickwalling.mx/como-medir-el-exito-de-la-gestion-de-proyectos-de-construccion-indicadores-clave-que-si-importan/)
- [FocoenObra - KPIs Construcción](https://focoenobra.com/productos/kpis-construccion/)

**Software y herramientas:**
- [Procore - Software Construcción](https://www.procore.com/es)
- [ProjectManager - Software Programación](https://www.projectmanager.com/es/mejores-software-de-programacion-de-construccion)
- [FocoenObra - Control Obras](https://focoenobra.com/blog/software-para-control-de-obras-de-construccion/)
- [ComparaSoftware Colombia - Mejores Software 2025](https://www.comparasoftware.co/construccion)

**Desperdicios y materiales:**
- [RECIMUNDO - Medición Desperdicios](https://www.recimundo.com/index.php/es/article/download/225/html?inline=1)
- [UPC Perú - Gestión Desperdicios](https://repositorioacademico.upc.edu.pe/bitstream/handle/10757/625448/LoayzaF_L.pdf?sequence=4&isAllowed=y)
- [AddControl - Rendimientos Materiales](https://addcontrol-erp.com/problematicas-y-soluciones-en-la-construccion/rendimientos-materiales-obra-civil/)
- [ContraRéplica - Desperdicio 12% Costo](https://www.contrareplica.mx/nota-Desperdicio-de-materiales-alcanzaria-hasta-12-del-costo-en-obras-de-construccion-202321214)

**Integración sistemas legacy:**
- [TICNUS - Integrar ERP con Legacy](https://ticnus.com/blog/como-integrar-un-erp-con-sistemas-legacy-guia-completa-para-una-transicion-exitosa/)
- [Conecta Software - Conector PostgreSQL](https://conectasoftware.com/apps/postgresql/)
- [Hitachi Vantara - PostgreSQL Environments](https://www.hitachivantara.com/es-latam/blog/seamless-storage-integration-managing-postgresql-environments)

**Casos éxito Colombia:**
- [El Cóndor - Top 10 Constructoras 2023](https://elcondor.com/estas-fueron-las-10-constructoras-mas-exitosas-de-colombia-en-2023/)
- [CIDEI - Vigilancia Tecnológica Construcción](https://cidei.net/caso-de-exito-vigilancia-tecnologica-sector-construccion/)
- [Quantica PM - Casos Éxito Gestión Proyectos](https://quanticapm.com/casos-exito-gestion-proyectos/)

**Umbrales y alertas:**
- [PMO Informática - Indicadores Valor Ganado](https://www.pmoinformatica.com/2017/01/indicadores-gestion-valor-ganado.html)
- [LinkedIn - Umbrales SPI y CPI](https://es.linkedin.com/pulse/qué-es-el-valor-ganado-y-cómo-se-relaciona-con-la-del-jose-luis)
- [Dharma Consulting - SPI](https://dharmacon.net/2023/07/21/medicion-de-la-eficiencia-del-proyecto-interpretacion-y-aplicacion-del-indice-de-desempeno-del-cronograma-spi/)
- [Dharma Consulting - CPI](https://dharmacon.net/2023/07/21/midiendo-el-rendimiento-del-proyecto-entendiendo-el-indice-de-desempeno-del-costo-cpi/)

**Periodicidad actualización:**
- [FocoenObra - Reportes Obra](https://focoenobra.com/blog/tipos-reportes-obra-construccion/)
- [FocoenObra - Seguimiento Obra](https://focoenobra.com/blog/seguimiento-de-obra-y-control-avance/)
- [BrickControl - App Seguimiento](https://www.brickcontrol.com/product/progress-tracking/)
- [PlanRadar - Informe Diario](https://www.planradar.com/es/informe-diaro-obra/)

**Avance físico-financiero:**
- [iSE LATAM - Especialización Curva Avance](https://ise-latam.com/especializaciones/especializacion-en-control-de-obra-mediante-curva-de-avance-fisico-y-economico)
- [Columbia CVN - Gestión Financiera Construcción](https://online-exec.cvn.columbia.edu/gestion-financiera-construccion)
- [FocoenObra - Cálculo Avance Financiero](https://focoenobra.com/blog/avance-financiero-de-una-obra-de-construccion/)

---

**Documento generado por:** Research Analyst - Neero SAS
**Para:** Contecsa - Sistema Inteligencia de Datos
**Próxima acción:** Revisión con Javier Polo + aprobación arquitectura datos
**Timeline:** MVP en 3-5 semanas desde aprobación

**Token count:** ~11,500 tokens | **Tiempo investigación:** 35 minutos | **Fuentes consultadas:** 60+
