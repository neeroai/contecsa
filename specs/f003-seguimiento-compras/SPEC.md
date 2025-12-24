# SPEC: Seguimiento Compras (7 Etapas)

Version: 1.0 | Date: 2025-12-24 06:30 | Owner: Javier Polo | Status: Active

---

## Problem

Proceso manual Excel con 28 campos por compra, sin flujo estructurado (columnas independientes, no estados), sin alertas automáticas para compras atrasadas >30 días, cambios no autorizados sin historial. Seguimiento centralizado en una persona (Liced Vega). Ciclo completo: 15-30 días promedio.

---

## Objective

**Primary Goal:** Sistema de seguimiento E2E de compras a través de 7 etapas claramente definidas (Requisición → Aprobación → Orden → Confirmación → Recepción → Certificados → Pago/Cierre), con state machine que enforza transiciones válidas, alertas automáticas para compras >30 días y audit log completo.

**Success Metrics:**
- Reducción 50% tiempo ciclo compras (15-30 días → 10-15 días promedio)
- 100% compras con trazabilidad completa (audit log)
- Detección automática compras en riesgo (>30 días)
- Liberación de tiempo Liced Vega (automatización seguimiento)
- NPS usuarios >70 (5 roles: Técnico, Gerente, Compras, Almacén, Contabilidad)

---

## Scope

| In | Out |
|---|---|
| 7-stage state machine (REQUISICION → CERRADO) | Custom workflows (user-defined stages) - Phase 2 |
| Blocking gates at critical points (aprobación, certificados) | Parallel approvals (multiple approvers) - Phase 2 |
| Automated alerts (>30 días, >45 días urgente) | SLA enforcement per stage - Phase 2 |
| Audit log (all state transitions) | Bulk actions (approve multiple) - Phase 2 |
| Progress bar visualization | Mobile push notifications - Phase 2 |
| Color-coded status (green/yellow/red) | Workflow templates by category - Phase 2 |
| Email notifications (Gmail API) | WhatsApp notifications - Phase 2 |

---

## Contracts

### Input

| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| compra_id | uuid | Y | Purchase ID for update operations |
| estado | enum | Y | One of 7 stages: REQUISICION\|APROBACION\|ORDEN\|CONFIRMACION\|RECEPCION\|CERTIFICADOS\|CERRADO |
| proyecto_id | uuid | Y | Consorcio/project ID (user authorized only) |
| proveedor_id | uuid | Y | Supplier ID from catalog |
| categoria | string | Y | Material category (Concreto, Acero, Eléctricos, etc.) |
| descripcion | text | Y | Purchase description (min 10 chars) |
| monto_estimado | decimal | Y | Estimated amount in COP |
| monto_final | decimal | N | Final amount (required at CERRADO) |
| num_entrada | string | N | Warehouse entry number (required at RECEPCION) |
| certificados | file[] | N | Certificate uploads (required for Concreto/Acero/Eléctricos/Químicos) |
| notas_transicion | text | N | Notes for state transition (required on rejection) |

### Output

| Field | Type | Condition | Notes |
|-------|------|-----------|-------|
| compra | object | Always | Full purchase object with current estado |
| estado_actual | enum | Always | Current stage |
| dias_abierto | int | Always | Days since creation if not CERRADO |
| en_riesgo | boolean | Always | TRUE if dias_abierto > 30 |
| proxima_accion | string | On Success | Suggested next action (e.g., "Aprobar requisición") |
| bloqueada | boolean | Always | TRUE if blocking gate prevents next transition |
| razon_bloqueo | string | On blocked | Reason for block (e.g., "Faltan certificados: Calidad, Seguridad") |
| timeline | object[] | Always | Array of transitions {estado, fecha, user, notas} |
| alertas_activas | object[] | Always | Active alerts for this purchase |
| error | string | On Error | Error message in Spanish |

---

## Business Rules

- **State Sequence:** Cannot skip stages → REQUISICION → APROBACION → ORDEN → CONFIRMACION → RECEPCION → CERTIFICADOS → CERRADO
- **Blocking Gate (Aprobación):** Cannot create ORDEN if REQUISICION not approved → "Requisición debe ser aprobada primero"
- **Blocking Gate (Confirmación):** Cannot register RECEPCION if ORDEN not confirmed by supplier → "Proveedor debe confirmar orden primero" (Admin can override with justification)
- **Blocking Gate (Certificados):** Cannot reach CERRADO if required certificates not uploaded → "Faltan certificados obligatorios: [lista]" (applies to Concreto, Acero, Eléctricos, Químicos)
- **Blocking Gate (Invoice):** Cannot CERRADO if monto_final > monto_estimado +5% → "Monto factura excede orden en X%, requiere aprobación Gerencia"
- **Alert >30 días:** Email diario (8 AM) a Jefe Compras + Gerencia con listado compras abiertas >30 días
- **Alert >45 días:** Email urgente (8 AM, 5 PM) a Jefe Compras + Gerencia + CEO con badge rojo en dashboard
- **Audit Log:** ALL state transitions logged → {compra_id, estado_anterior, estado_nuevo, timestamp, user_id, notas}
- **No Deletion:** Purchases cannot be deleted → only marked as CANCELADO with reason
- **Role-Based Access:** Users see ONLY authorized consorcios → WHERE proyecto_id IN (user.authorized_consorcios)
- **Optimistic Locking:** Concurrent state changes prevented → version field incremented on update

---

## Edge Cases

| Scenario | Handling | Notes |
|----------|----------|-------|
| Invalid transition | Return 400 + "Transición inválida: [from] → [to]" | E.g., REQUISICION → RECEPCION |
| Concurrent state change | Return 409 + "Compra modificada, refresca y reintenta" | Optimistic locking failure |
| Missing required field | Return 400 + "Campo requerido: [field]" | E.g., num_entrada at RECEPCION |
| Certificate not uploaded | Block CERRADO + "Faltan certificados: [lista]" | Category-specific validation |
| Invoice amount exceeds +5% | Block CERRADO + "Requiere aprobación Gerencia" | Escalation to Gerente |
| Supplier doesn't confirm | Auto-reminder email after 7 días + escalate to Jefe Compras | Alert: "Orden sin confirmar >7 días" |
| Recepción pendiente >10 días | Email Almacén + Jefe Compras | Alert: "Recepción pendiente >10 días" |
| Admin bypass gate | Log bypass + require justification | E.g., override confirmación requirement |
| Purchase older than 90 días | Auto-escalate to CEO + red badge | Critical delay detection |

---

## Observability

**Logs:**
- `compra_created` (info) - User, proyecto, monto
- `compra_estado_changed` (info) - From, to, user, dias_abierto
- `compra_bloqueada` (warn) - Reason, user attempted transition
- `compra_en_riesgo` (warn) - Compra ID, dias_abierto, estado
- `alerta_enviada` (info) - Alert type, recipients, compra_id
- `gate_bypass` (warn) - User, gate, justification
- `concurrent_conflict` (error) - Compra ID, user1, user2

**Metrics:**
- `compras_por_estado` - Count per stage, track bottlenecks
- `tiempo_ciclo_p50_p95` - 50th/95th percentile cycle time in days
- `compras_en_riesgo_count` - Count of purchases >30 días
- `alertas_enviadas_count` - Alert delivery rate
- `state_transition_time_ms` - Server response time for transitions
- `blocking_gates_hit_count` - How often gates prevent transitions

**Traces:**
- `compra_lifecycle` (span) - Full workflow REQUISICION → CERRADO
- `state_transition` (span) - Individual transition processing time
- `alert_processing` (span) - From condition detected to email sent

---

## Definition of Done

- [ ] Code review approved
- [ ] 7-stage state machine implemented with correct transitions
- [ ] Blocking gates enforce rules (aprobación, confirmación, certificados, invoice)
- [ ] Alerts send email for >30 días purchases (daily 8 AM)
- [ ] Audit log records all state transitions (timestamp, user, notas)
- [ ] Dashboard widget shows at-risk purchases (red badge)
- [ ] Progress bar visualization on detail view (7 stages)
- [ ] Color-coded status (green 0-15, yellow 16-30, red >30 días)
- [ ] Role-based access (users see only authorized consorcios)
- [ ] Optimistic locking prevents concurrent conflicts
- [ ] Performance targets met (list <1s, detail <500ms, transition <200ms)
- [ ] Tested full workflow with 10+ real purchases
- [ ] Quality gates pass (format, lint, types, tests 80%+, build)
- [ ] Deployed to staging
- [ ] UAT with Liced Vega (super user) + 3 other roles
- [ ] Smoke test passed (create → approve → order → confirm → receive → certificates → close)

---

**Related:** F002 (Dashboard widget), F005 (Email notifications), F008 (Certificates validation) | **Dependencies:** PostgreSQL (compras table + audit log), Gmail API

**Original PRD:** docs/features/r03-seguimiento-compras.md
