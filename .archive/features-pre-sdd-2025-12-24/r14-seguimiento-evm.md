# R14 - Seguimiento Avance Físico (EVM)

Version: 1.0 | Date: 2025-12-23 15:00 | Priority: P1 | Status: Research Complete - Awaiting Approval

---

## Overview

Sistema de seguimiento de avance físico de obra (ejecutado vs proyectado) usando metodología **EVM Simplificada** (Earned Value Management) para los 9 consorcios de Contecsa.

**Key Feature:** Detección temprana de sobrecostos vía comparación % avance físico vs % gasto presupuesto, con alertas automáticas si desviación >10%.

---

## Business Context

**Problem (GAP Identificado):**
- **NO existe sistema formal** de medición de avance físico de obra
- Solo se rastrea: gasto por compra, estado de entregas (SI/NO/PARCIAL)
- Sin métricas de % avance físico vs % presupuesto ejecutado
- Sin proyecciones de consumo futuro basadas en avance real
- **Caso Cartagena**: Sobrecosto detectado 2 meses después (NO había baseline de precios ni avance)

**Solution:**
Dashboard EVM con Curva S visual + KPIs automáticos (CPI, SPI, EAC) + alertas si CPI <0.9 + proyección costo final basado en tendencia avance.

**Impact:**
- Detección temprana sobrecostos (antes de terminar proyecto)
- Proyección confiable de gasto restante (EAC - AC)
- Reducción 20% proyectos sobre presupuesto (vía intervención temprana)

---

## Research Summary

**Metodologías Evaluadas** (Research Agent a3b1e47):

| Metodología | Complejidad | Precisión | Ventaja | Desventaja | Recomendado |
|-------------|-------------|-----------|---------|------------|-------------|
| **EVM** (PMI/PMBOK) | Media-Alta | 90-95% | Industria standard, métricas probadas | Curva aprendizaje alta | ✅ SÍ (simplificado) |
| **Curva S** | Baja | 70-80% | Muy visual, fácil entender | Menos granular | ✅ SÍ (complemento visual) |
| **% Completitud APU** | Baja | 75-85% | Familiar constructoras LATAM | Subjetivo | ✅ SÍ (input manual) |

**Fuentes**: Universidad de los Andes (Colombia), PMI, INVIAS, ResearchGate

**Decisión Final**: EVM Simplificado + Curva S visual + Input manual % completitud por APU

---

## User Stories

| ID | Actor | Story | Acceptance Criteria |
|----|-------|-------|---------------------|
| US14.1 | Gerencia | Ver avance físico vs financiero por proyecto | - Curva S (3 líneas: Planificado, Ejecutado, Gastado)<br>- KPI Cards: % Avance Físico, CPI, Desviación<br>- Tabla APUs con mayor desviación |
| US14.2 | Gerencia | Recibir alerta si proyecto >10% sobre presupuesto | - Email inmediato si CPI <0.9<br>- Badge rojo en dashboard<br>- Proyección EAC (costo final estimado) |
| US14.3 | Técnico | Actualizar avance físico semanal por proyecto | - Form simple: Lista APUs, input % completitud<br>- Sugerencia automática basada en compras<br>- Validación: Avisar si decremento vs semana anterior |
| US14.4 | Gerencia | Consultar proyección costo final proyecto | - EAC calculado automáticamente<br>- Forecast próximos 3 meses<br>- Comparar vs presupuesto original (BAC) |
| US14.5 | AI Agent | Responder "¿CPI de PAVICONSTRUJC?" | - Query términos EVM (CPI, SPI, EAC, VAC)<br>- Explicar significado en lenguaje simple<br>- Mostrar tendencia últimos 3 meses |

---

## Tech Approach

### Metodología: EVM Simplificado

**Fórmulas Básicas:**

| Término | Fórmula | Significado |
|---------|---------|-------------|
| **EV** (Earned Value) | Presupuesto × % Avance Físico | Valor del trabajo completado |
| **AC** (Actual Cost) | Gasto real acumulado | Lo que se ha gastado |
| **PV** (Planned Value) | BAC × (días transcurridos / días totales)* | Lo que se debería haber completado |
| **CPI** (Cost Performance Index) | EV / AC | >1 = bajo presupuesto, <1 = sobrecosto |
| **SPI** (Schedule Performance Index) | EV / PV | >1 = adelantado, <1 = atrasado |
| **EAC** (Estimate At Completion) | BAC / CPI | Costo final proyectado |
| **VAC** (Variance At Completion) | BAC - EAC | Sobrecosto/ahorro proyectado |

*PV Simplificado (asume avance lineal, no cronograma CPM detallado)

**Ejemplo PAVICONSTRUJC:**
- **BAC** (Presupuesto Total): $500M COP
- **Días transcurridos / totales**: 180 / 360 (50% tiempo)
- **PV**: $500M × 50% = $250M (debería haberse completado)
- **Avance Físico Real**: 40% (medido por Técnico)
- **EV**: $500M × 40% = $200M (valor completado)
- **AC** (Gasto Real): $220M (de `project_spend`)
- **CPI**: $200M / $220M = **0.91** → 🔴 **Alerta: 9% sobrecosto**
- **SPI**: $200M / $250M = **0.80** → 🟡 **Alerta: 20% retraso**
- **EAC**: $500M / 0.91 = **$549M** → Proyección: $49M sobre presupuesto
- **VAC**: $500M - $549M = **-$49M** sobrecosto proyectado

---

## Database Schema

### Nuevas Tablas

**1. `project_apus`** (Análisis Precios Unitarios)
```sql
CREATE TABLE project_apus (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  apu_code VARCHAR(50),              -- "APU-001"
  apu_name VARCHAR(255),             -- "Excavación manual"
  unit VARCHAR(50),                  -- "m³", "ton", "unidad"
  quantity_budgeted DECIMAL(15, 4),  -- Cantidad presupuestada
  unit_price_cop DECIMAL(15, 2),     -- Precio unitario
  total_price_cop DECIMAL(15, 2),    -- Subtotal
  category VARCHAR(100),             -- "Movimiento tierras", "Concreto"
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**2. `project_physical_progress`** (Avance Físico)
```sql
CREATE TABLE project_physical_progress (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  apu_id UUID REFERENCES project_apus(id),
  measurement_date DATE NOT NULL,
  quantity_executed DECIMAL(15, 4),  -- Acumulado
  pct_complete DECIMAL(5, 2),        -- 0-100
  measured_by UUID REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(project_id, apu_id, measurement_date)
);
```

**3. `v_project_evm`** (Vista KPIs)
```sql
-- Calcula automáticamente: EV, AC, PV, CPI, SPI, EAC, VAC
-- Ver plan completo para SQL detallado
```

### Integración con Features Existentes

| Feature | Tabla Compartida | Uso |
|---------|------------------|-----|
| R10 (Proyección Financiera) | `project_budgets`, `project_spend` | Reutilizar AC (gasto real), BAC (presupuesto total) |
| R3 (Seguimiento Compras) | `purchases` | Vincular compras → APUs vía categoría → Inferir % avance |
| R2 (Dashboard) | N/A | Nuevo dashboard "Avance Físico" con Curva S + KPIs |

---

## Roadmap (3 Fases)

### FASE 0: Setup Datos Maestros (1-2 semanas)
**Responsable:** Gerencia + Técnico
- Definir 10-20 APUs para PAVICONSTRUJC (categorías amplias)
- Cargar presupuesto inicial (BAC), fechas inicio/fin
- Entrenar Técnico en medición avance

### FASE 1: MVP - Dashboard + Carga Manual (2-3 semanas)
**Scope:** Form carga avance semanal + Dashboard Curva S + Alertas
- Backend: Endpoints POST /physical-progress, GET /evm-summary
- Frontend: Form avance (`/proyectos/[id]/avance`), Dashboard EVM
- Alertas: Email si CPI <0.9, badge rojo dashboard

**Periodicidad:** Semanal (Viernes PM, ~15 min) - Evaluar sostenibilidad mes 1

### FASE 2: Automatización Parcial (Post-MVP, 2-3 semanas)
**Scope:** Sugerencia automática % avance basado en compras materiales
- Algoritmo: `pct_progress = min(100, total_purchased / (budgeted × waste_factor))`
- Waste factor: 15% concreto, 5% acero, 10% otros

### FASE 3: Proyecciones (Post-MVP, 1-2 semanas)
**Scope:** Forecast EAC basado en tendencia CPI últimos 3 meses
- Alerta proactiva: "A este ritmo, sobrecosto de $X millones al terminar"

---

## Decisiones de Diseño (Aprobadas)

✅ **Proyecto Piloto:** PAVICONSTRUJC (consorcio más grande, 41.8% compras)
✅ **Granularidad APUs:** 10-20 APUs (categorías amplias - rápido configurar)
✅ **Periodicidad:** Semanal (Viernes PM) - Revisar sostenibilidad mes 1
✅ **Metodología:** EVM Simplificado + Curva S visual
✅ **PV:** Cálculo lineal por tiempo (no cronograma CPM detallado)

---

## Simplificaciones (Equipo 2 Personas)

**NO Implementar:**
- ❌ Integración MS Project / Primavera
- ❌ PV basado en cronograma CPM detallado
- ❌ Reportes PMBOK completos
- ❌ Mobile app específica (usar responsive web)

**SÍ Implementar (Simplificado):**
- ✅ EVM KPIs básicos (CPI, SPI, EAC) - auto-calculados
- ✅ Curva S visual (intuitivo Gerencia)
- ✅ Sugerencia automática vía compras (reducir manual)
- ✅ Integración R10, R3, R2 (reutilizar datos existentes)

---

## KPIs de Éxito (6 meses post-implementación)

| Métrica | Baseline | Objetivo | Medición |
|---------|----------|----------|----------|
| % Proyectos con seguimiento avance | 0% | 100% (9 consorcios) | COUNT mediciones |
| Detección temprana sobrecosto | 0 alertas/año | 3+ alertas/año | Alertas CPI <0.9 |
| Tiempo actualización avance | N/A | <15 min/semana | Timer form |
| Precisión proyección EAC | N/A | 85-95% vs real | Comparar EAC vs costo final |
| Reducción sobrecostos | Desconocido | -20% proyectos | % proyectos >110% presupuesto |

---

## Riesgos y Mitigación

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| **Datos históricos inexistentes** | ALTA | ALTO | Empezar con proyectos nuevos, no retroalimentar |
| **Resistencia usuario** (Técnico no quiere medir) | MEDIA | ALTO | Simplificar form, sugerencia automática, capacitación |
| **Overhead semanal insostenible** | MEDIA | MEDIO | Evaluar mes 1, reducir a quincenal si necesario |
| **Cálculo EVM incorrecto** | BAJA | CRÍTICO | Testing exhaustivo, validar vs datos reales |
| **Presupuestos cambian mid-project** | ALTA | MEDIO | Permitir actualizar BAC con audit trail |

---

## Preguntas Pendientes

1. **Desperdicios/Waste Factor:** ¿Tienen datos históricos % desperdicio por material?
   - Si no → Usar promedio industria: 15% concreto, 5% acero, 10% otros

2. **Integración SICOM:** ¿SICOM tiene presupuestos originales (APUs)?
   - Si sí → Importar vía ETL R6
   - Si no → Carga manual desde Excel/Sheets

3. **Alertas:** ¿Umbral 10% sobrecosto correcto o más conservador (5%)?

---

## References

- **Plan Completo:** `/Users/mercadeo/.claude/plans/effervescent-wondering-falcon.md`
- **Research Agent:** `/Users/mercadeo/.claude/plans/effervescent-wondering-falcon-agent-a3b1e47.md`
- **Feature R10:** Proyección Financiera (`r10-proyeccion-financiera.md`)
- **Feature R3:** Seguimiento Compras (`r03-seguimiento-compras.md`)
- **Feature R2:** Dashboard Ejecutivo (`r02-dashboard.md`)
- **PMI EVM Guide:** https://www.pmi.org/learning/library/earned-value-management-guide
- **Universidad de los Andes:** EVM Construction methodology (Colombia)
- **INVIAS:** Infrastructure project standards (Colombia)

---

## Status

**Current Phase:** Research Complete - Awaiting User Approval

**Next Steps:**
1. Usuario revisa documentación completa
2. Usuario aprueba implementación (o solicita cambios)
3. Si aprobado → Iniciar Fase 0 (Setup datos maestros)

**IMPORTANTE:** NO implementar hasta aprobación manual del usuario.

---

**Research Completed:** 2025-12-23 15:00
**Investigación por:** Research Agent (general-purpose + research-analyst)
**Documentado por:** Claude Code
**Tokens Investigación:** ~630K tokens (web searches, academic sources, LATAM cases)
