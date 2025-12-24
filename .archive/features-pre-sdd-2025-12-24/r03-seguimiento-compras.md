# R3 - Seguimiento Compras (7 Etapas)

Version: 1.0 | Date: 2025-12-22 22:05 | Priority: P0 | Status: Planned

---

## Overview

Sistema de seguimiento E2E de compras a través de 7 etapas claramente definidas (Requisición → Aprobación → Orden → Confirmación → Recepción → Certificados → Pago/Cierre), con alertas automáticas para compras >30 días abiertas y blocking gates en puntos críticos.

**Key Feature:** Estado visual claro en cada momento, alertas proactivas y trazabilidad completa de quién hizo qué y cuándo.

---

## Business Context

**Problem (Current Excel Process):**
- 28 campos manuales por compra
- Sin flujo estructurado (columnas independientes, no estados)
- Sin alertas automáticas para compras atrasadas
- Cambios no autorizados sin historial
- Ciclo completo: 15-30 días promedio
- Seguimiento centralizado en una persona (Liced Vega)

**Solution:**
Estado machine de 7 etapas con transiciones claras, validaciones automáticas en cada gate, alertas proactivas y audit log completo.

**Impact:**
- Reducción 50% tiempo ciclo compras (15-30 días → 10-15 días)
- 100% compras con trazabilidad completa
- Detección automática de compras en riesgo (>30 días)
- Liberación de tiempo de Liced Vega (automatización seguimiento)

---

## 7-Stage Workflow

### Stage Flow

```
1. REQUISICIÓN
   ↓ (Aprobador valida y aprueba)
2. APROBACIÓN
   ↓ (Compras crea orden)
3. ORDEN
   ↓ (Proveedor confirma con evidencia)
4. CONFIRMACIÓN
   ↓ (Almacén registra recepción)
5. RECEPCIÓN
   ↓ (Compras valida certificados)
6. CERTIFICADOS
   ↓ (Contabilidad valida factura y paga)
7. PAGO/CIERRE
```

---

## User Stories

| ID | Actor | Story | Acceptance Criteria |
|----|-------|-------|---------------------|
| US3.1 | Técnico | Crear requisición para materiales de obra | - Form simple con campos obligatorios<br>- Adjuntar cotizaciones<br>- Notificar automático a aprobador |
| US3.2 | Gerente | Aprobar requisiciones pendientes | - Ver lista requisiciones pendientes<br>- Aprobar/rechazar con justificación<br>- Notificar automático a Compras |
| US3.3 | Jefe Compras | Crear orden de compra a proveedor | - Seleccionar proveedor de catálogo<br>- Generar documento ODC/ODS<br>- Enviar por email automático |
| US3.4 | Proveedor | Confirmar orden recibida | - Recibe email con orden<br>- Confirma con evidencia (email/PDF)<br>- Sistema registra confirmación |
| US3.5 | Almacén | Registrar recepción de materiales | - Verificar cantidad vs orden<br>- Registrar No. ENTRADA<br>- Estado: Total/Parcial/Pendiente |
| US3.6 | Jefe Compras | Validar certificados antes de cierre | - Checklist de documentos obligatorios<br>- Bloqueo si falta certificado<br>- Upload certificados a sistema |
| US3.7 | Contabilidad | Validar factura y aprobar pago | - Validar factura vs orden<br>- Validar monto ±5% tolerancia<br>- Aprobar/bloquear para pago |
| US3.8 | Sistema | Alertar compras >30 días abiertas | - Email diario a Jefe Compras<br>- Badge rojo en dashboard<br>- Listado ordenado por antigüedad |

---

## Technical Approach

### State Machine Design

**States:** REQUISICION → APROBACION → ORDEN → CONFIRMACION → RECEPCION → CERTIFICADOS → CERRADO

**Transitions:**
| From | To | Trigger | Actor | Validation |
|------|----|---------| ------|-----------|
| - | REQUISICION | Create | Técnico/Compras | Required fields filled |
| REQUISICION | APROBACION | Approve | Gerente/Admin | Approval notes provided |
| APROBACION | ORDEN | CreateOrder | Compras | Supplier selected, amount confirmed |
| ORDEN | CONFIRMACION | Confirm | Proveedor/Compras | Evidence uploaded (email/PDF) |
| CONFIRMACION | RECEPCION | RegisterReceipt | Almacén | Entry number assigned |
| RECEPCION | CERTIFICADOS | UploadCerts | Compras | All required certificates uploaded |
| CERTIFICADOS | CERRADO | Pay | Contabilidad | Invoice validated, payment approved |

**Blocking Rules:**
- Cannot skip stages (e.g., cannot go REQUISICION → ORDEN)
- Cannot close without certificates (if required by category)
- Cannot pay if invoice amount exceeds order +5%
- Cannot delete purchases (only mark as cancelled with reason)

---

### Data Model

**Table: `compras`**
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| estado | ENUM | Current stage (7 stages) |
| created_at | TIMESTAMP | Creation date |
| created_by | UUID | Creator user ID |
| proyecto_id | UUID | Consorcio/project |
| proveedor_id | UUID | Supplier |
| categoria | VARCHAR | Material category |
| descripcion | TEXT | Purchase description |
| monto_estimado | DECIMAL | Estimated amount |
| monto_final | DECIMAL | Final amount |
| fecha_requisicion | DATE | Requisition date |
| fecha_aprobacion | DATE | Approval date |
| fecha_orden | DATE | Order creation date |
| fecha_confirmacion | DATE | Supplier confirmation date |
| fecha_recepcion | DATE | Receipt date |
| fecha_cierre | DATE | Closure date |
| num_entrada | VARCHAR | Warehouse entry number |
| dias_abierto | INT | Computed: days since creation if not closed |
| en_riesgo | BOOLEAN | Computed: TRUE if dias_abierto > 30 |

**Table: `compra_estados_log`** (Audit trail)
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| compra_id | UUID | Foreign key to compras |
| estado_anterior | ENUM | Previous state |
| estado_nuevo | ENUM | New state |
| timestamp | TIMESTAMP | When change occurred |
| user_id | UUID | Who made the change |
| notas | TEXT | Optional notes/reason |

---

## Alerts Configuration

### Alert Rules

| Alert Type | Condition | Recipients | Frequency |
|------------|-----------|------------|-----------|
| Compra en Riesgo | dias_abierto > 30 | Jefe Compras, Gerencia | Daily (8 AM) |
| Compra Urgente | dias_abierto > 45 | Jefe Compras, Gerencia, CEO | Daily (8 AM, 5 PM) |
| Orden Sin Confirmar | estado = ORDEN AND días > 7 | Jefe Compras | Daily (10 AM) |
| Recepción Pendiente | estado = CONFIRMACION AND días > 10 | Almacén, Jefe Compras | Daily (11 AM) |
| Certificado Faltante | estado = RECEPCION AND días > 5 | Jefe Compras | Daily (2 PM) |
| Factura Bloqueada | estado = CERTIFICADOS, factura_bloqueada = TRUE | Contabilidad, Jefe Compras | Immediate (on block) |

### Alert Escalation

**Level 1:** Email to direct responsible (e.g., Jefe Compras)
**Level 2 (+15 días):** CC Gerencia
**Level 3 (+30 días):** CC CEO + Badge rojo en dashboard

---

## Integration Points

| System | Integration Type | Purpose |
|--------|------------------|---------|
| Email (Gmail API) | Send notifications | Alert emails, order confirmations |
| Dashboard (R2) | Widget | Show at-risk purchases |
| Certificates (R8) | Upload trigger | Validate certificate upload before closure |
| Invoice Validation (R13) | Amount check | Validate invoice vs order amount |
| Audit Log (F22) | Event logging | Record all state transitions |

---

## User Interface

### Purchase Detail View

```
┌─────────────────────────────────────────────┐
│  COMPRA #C-2025-042                         │
│  Estado: CONFIRMACIÓN                       │
├─────────────────────────────────────────────┤
│  Progress Bar:                              │
│  [✓]─[✓]─[✓]─[●]─[ ]─[ ]─[ ]               │
│   REQ APR ORD CON REC CER CIE              │
│                                             │
│  Detalles:                                  │
│  - Proyecto: PAVICONSTRUJC                  │
│  - Proveedor: ABC Materiales                │
│  - Categoría: Concreto                      │
│  - Monto: $5.2M COP                         │
│  - Días abierto: 12 (🟡 Normal)            │
│                                             │
│  Timeline:                                  │
│  ✓ Requisición    2025-01-10  (Técnico A)  │
│  ✓ Aprobación     2025-01-12  (Gerente B)  │
│  ✓ Orden          2025-01-15  (Liced V)    │
│  ● Confirmación   2025-01-18  (Proveedor)  │
│  ⏳ Recepción     -             (Pendiente)│
│                                             │
│  Acciones:                                  │
│  [Registrar Recepción] [Ver Orden] [Chat]  │
└─────────────────────────────────────────────┘
```

### List View (for Compras dashboard)

| ID | Proyecto | Proveedor | Estado | Días | Acciones |
|----|----------|-----------|--------|------|----------|
| C-042 | PAVIC | ABC Mat | CONFIRMACION | 12🟡 | [Ver] |
| C-038 | PTAR | XYZ Srl | ORDEN | 35🔴 | [Ver] |
| C-041 | EDUBAR | DEF SA | RECEPCION | 8🟢 | [Ver] |

**Color coding:**
- 🟢 Green (0-15 días)
- 🟡 Yellow (16-30 días)
- 🔴 Red (>30 días)

---

## Blocking Gates

### Gate 1: Aprobación Required
**Block:** Cannot create ORDER if REQUISICION not approved
**Message:** "Esta requisición debe ser aprobada antes de crear la orden"

### Gate 2: Confirmación Required
**Block:** Cannot register RECEPCION if ORDER not confirmed by supplier
**Message:** "El proveedor debe confirmar la orden antes de registrar recepción"
**Bypass:** Admin can override with justification

### Gate 3: Certificado Required
**Block:** Cannot close if required certificates not uploaded
**Message:** "Faltan certificados obligatorios: [lista de certificados]"
**Applies to:** Categories: Concreto, Acero, Eléctricos, Químicos

### Gate 4: Invoice Validation
**Block:** Cannot pay if invoice amount > order amount +5%
**Message:** "Monto factura excede orden en X%. Requiere aprobación Gerencia"

---

## Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| List View Load | <1s | 95th percentile, 100 purchases |
| Detail View Load | <500ms | 95th percentile |
| State Transition | <200ms | Server response time |
| Alert Processing | <5min | From condition detected to email sent |
| Concurrent State Changes | 10+ | No conflicts, optimistic locking |

---

## Testing Strategy

### Unit Tests
- State machine transitions (valid/invalid)
- Blocking gate logic
- Alert condition calculation
- Date/days calculations

### Integration Tests
- Full workflow REQUISICION → CERRADO
- Alert email delivery
- Dashboard widget updates
- Audit log integrity

### User Acceptance Tests
- Test with Liced Vega (super user) - full workflow
- Test with each role (create, approve, receive, etc.)
- Test edge cases (cancel, reopen, override gates)
- Performance test with 500+ purchases

---

## Success Criteria

**MVP Acceptance:**
- [ ] 7 stages implemented with correct transitions
- [ ] Blocking gates enforce rules
- [ ] Alerts send email for >30 días purchases
- [ ] Audit log records all transitions
- [ ] Dashboard shows at-risk purchases
- [ ] Progress bar visual on detail view

**Production Ready:**
- [ ] Tested full workflow with 10+ real purchases
- [ ] Alert emails delivered reliably (<5 min)
- [ ] No state transition conflicts (concurrent users)
- [ ] Performance targets met (load <1s)
- [ ] User satisfaction NPS >70
- [ ] Reduction in cycle time verified (15→12 días average)

---

## Future Enhancements (Post-MVP)

1. **Bulk Actions** - Approve multiple requisitions at once
2. **Workflow Templates** - Predefined workflows by category
3. **SLA Tracking** - Enforce SLA per stage (e.g., approval within 48h)
4. **Auto-reminder** - Auto-send reminders before deadlines
5. **Mobile Notifications** - Push notifications for approvals
6. **Parallel Approvals** - Multiple approvers in parallel (not sequential)

---

## References

- PRD Feature F06 (Seguimiento Compras 7 Etapas)
- Excel analysis: docs/analisis-control-compras.md (28 fields reference)
- Current workflow: docs/research/Proceso Compras Infraestructura Colombia E2E.md
- Meeting PO: docs/meets/contecsa_meet_2025-12-22.txt
