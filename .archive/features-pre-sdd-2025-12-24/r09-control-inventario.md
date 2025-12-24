# R9 - Control de Inventario

Version: 1.0 | Date: 2025-12-22 23:25 | Priority: P2 | Status: Planned

---

## Overview

Sistema de control de inventario de materiales de construcción con seguimiento de entradas, salidas, stock mínimo, alertas de reorden y proyección de necesidades por proyecto para evitar desabastecimientos y optimizar capital de trabajo.

**Key Feature:** Inventario físico vs sistema sincronizado en tiempo real, alertas automáticas de stock bajo, proyección de necesidades basada en consumo histórico.

---

## Business Context

**Problem:**
- Sin control digital de inventario (proceso manual en Excel/papel)
- Desconocimiento de stock real → compras urgentes innecesarias
- Materiales vencidos/dañados en bodega (no se detectan)
- Entregas a proyectos no registradas → pérdidas no contabilizadas
- Auditorías físicas vs sistema desactualizadas

**Solution:**
Sistema integrado: Recepción (Almacén) → Stock actualizado → Salidas a proyectos → Proyección de necesidades → Alertas de reorden automáticas.

**Impact:**
- Reducción 30% capital inmovilizado en inventario (comprar solo necesario)
- Reducción 80% compras urgentes (proyección proactiva)
- Reducción 95% pérdidas por vencimiento/daño (visibilidad stock antiguo)

---

## User Stories

| ID | Actor | Story | Acceptance Criteria |
|----|-------|-------|---------------------|
| US9.1 | Almacén | Registrar entrada de material (recepción) | - Cantidad recibida<br>- Update stock en tiempo real<br>- Notificación a proyectos |
| US9.2 | Almacén | Registrar salida a proyecto (entrega) | - Proyecto destino<br>- Cantidad entregada<br>- Stock actualizado |
| US9.3 | Técnico | Consultar stock disponible antes de requisición | - Ver stock actual<br>- Ver próximas entregas (5 días)<br>- Proyección de disponibilidad |
| US9.4 | Compras | Recibir alerta de stock bajo (reorden) | - Email automático<br>- Material + cantidad sugerida<br>- Link para crear requisición |
| US9.5 | Gerencia | Ver dashboard de inventario (valorización) | - Stock por material<br>- Valorización total (COP)<br>- Rotación de inventario (días) |

---

## Technical Approach

### Architecture

```
Recepción Material (R3 - Almacén)
  ↓
  ├─→ Cantidad recibida ingresada
  ├─→ Stock actualizado (PostgreSQL)
  └─→ Notificación a proyectos (R5)
  ↓
Salida a Proyecto (Almacén)
  ├─→ Proyecto seleccionado
  ├─→ Cantidad entregada
  ├─→ Stock restado
  └─→ Técnico notificado (material disponible)
  ↓
Stock Alert System (Daily Check)
  ├─→ Compare stock actual vs stock mínimo
  ├─→ If stock < mínimo → Alerta Compras
  └─→ Suggest reorder quantity (based on consumption rate)
  ↓
Projection Engine (AI/ML Optional)
  ├─→ Analyze historical consumption (6 months)
  ├─→ Predict future needs (next 30 days)
  └─→ Suggest proactive purchases
```

### Database Schema

```sql
CREATE TABLE inventory (
  id UUID PRIMARY KEY,
  material_id UUID REFERENCES materials(id) NOT NULL,
  material_name VARCHAR(255) NOT NULL,
  unit VARCHAR(50) NOT NULL,  -- m³, kg, ton, unit
  current_stock DECIMAL(15, 2) NOT NULL DEFAULT 0,
  min_stock DECIMAL(15, 2) NOT NULL DEFAULT 0,  -- Reorder point
  max_stock DECIMAL(15, 2),  -- Optional max capacity
  unit_cost DECIMAL(15, 2),  -- Average cost per unit
  total_value DECIMAL(15, 2) GENERATED ALWAYS AS (current_stock * unit_cost) STORED,
  last_reception_date DATE,
  last_delivery_date DATE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inventory_movements (
  id UUID PRIMARY KEY,
  material_id UUID REFERENCES materials(id),
  movement_type VARCHAR(50) NOT NULL,  -- RECEPTION, DELIVERY, ADJUSTMENT
  quantity DECIMAL(15, 2) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  purchase_id UUID REFERENCES purchases(id),  -- If reception
  project_id UUID REFERENCES projects(id),  -- If delivery
  performed_by UUID REFERENCES users(id) NOT NULL,
  notes TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## References

- PRD Feature F09 (Control Inventario)
- R3 (Purchase Tracking): docs/features/r03-seguimiento-compras.md
- R5 (Notifications): docs/features/r05-notificaciones.md
- R10 (Projection): docs/features/r10-proyeccion-financiera.md
