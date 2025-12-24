# Test Plan: Seguimiento Compras (7 Etapas)

Version: 1.0 | Date: 2025-12-24 06:45 | Owner: Claude Code | Status: Active

---

## Reference

**SDD Version:** 1.0 | **Feature:** Seguimiento Compras (F003) | **Scope:** Unit + Integration + E2E | **Coverage Target:** 80% (state machine, blocking gates, audit log)

---

## Test Strategy

**Philosophy:** 80% coverage on state machine transitions (XState), blocking gates, and audit log. Unit tests verify valid/invalid transitions. Integration tests verify full workflow + audit trail. E2E tests verify user workflows per role (Técnico → Gerente → Compras → Almacén → Contabilidad).

**Critical Paths:**
1. Create REQUISICION → Approve → Create ORDER → Confirm → Receive → Upload certificates → Close
2. Blocking gate prevents invalid transition → User notified
3. Alert detection (>30 días) → Email sent to Jefe Compras + Gerencia
4. Concurrent state change → Optimistic locking conflict → User retries

---

## Unit Tests

| Module | Test Cases | Tool | Status |
|--------|-----------|------|--------|
| XState state machine (compraMachine) | - All 14 valid transitions succeed<br>- All invalid transitions rejected (e.g., REQUISICION → RECEPCION)<br>- Guards enforce blocking gates<br>- Actions trigger audit log + notifications | Vitest + @xstate/test | TODO |
| Blocking gates (compraGates.ts) | - Gate 1: Block ORDER if REQUISICION not approved<br>- Gate 2: Block RECEPCION if ORDEN not confirmed<br>- Gate 3: Block CERRADO if certificates missing (Concreto/Acero)<br>- Gate 4: Block CERRADO if monto_final > monto_estimado +5% | Vitest | TODO |
| Audit log (auditLog.ts) | - Log records {compra_id, from, to, user, timestamp, notas}<br>- Query by compra_id returns all transitions<br>- Query by user_id returns user actions | Vitest + PostgreSQL test DB | TODO |
| Alert detection (alertas.ts) | - detectComprasEnRiesgo() returns purchases >30 días<br>- sendAlertaEmail() sends to correct recipients<br>- Alert escalation (>45 días → CEO) | Vitest + Gmail API mock | TODO |

---

## Integration Tests

| Component | Test Cases | Tool | Status |
|-----------|-----------|------|--------|
| /api/compras/[id]/transition (full flow) | - Valid transition updates estado + logs to audit<br>- Invalid transition returns 400<br>- Blocked transition returns 400 + reason<br>- Concurrent change returns 409 conflict | Vitest + PostgreSQL test instance | TODO |
| Full workflow (REQUISICION → CERRADO) | - Create → Approve → Order → Confirm → Receive → Upload certificates → Close<br>- Audit log has 7 entries<br>- Email sent at each notification point | Vitest + Gmail API mock | TODO |
| Optimistic locking | - User A starts edit → User B edits same compra → User A saves → Conflict 409<br>- User A refreshes → Sees User B changes → Saves successfully | Vitest | TODO |
| Alert cron job | - Cron runs daily 8 AM → Detects >30 días → Email sent within 5min<br>- Email includes compra details + dashboard link | Vitest + Cron mock | TODO |

---

## E2E Tests (Playwright)

**Setup:** `bun test:e2e` | **Roles:** Técnico, Gerente, Jefe Compras, Almacén, Contabilidad

**Happy Paths (5 User Journeys):**

1. **US3.1 - Técnico Creates Requisición:**
   - Login as Técnico
   - Navigate to /compras/nueva
   - Fill form (proyecto, proveedor, categoria, descripcion, monto)
   - Submit → Estado = REQUISICION
   - Assert: Notificación enviada a Gerente
   - Assert: Progress bar shows stage 1/7

2. **US3.2 - Gerente Approves Requisición:**
   - Login as Gerente
   - Navigate to /compras (filter: estado=REQUISICION)
   - Click compra → Detail page
   - Click "Aprobar" → Provide notas
   - Assert: Estado = APROBACION
   - Assert: Notificación enviada a Jefe Compras
   - Assert: Audit log shows transition

3. **US3.3 - Jefe Compras Creates Orden:**
   - Login as Jefe Compras
   - Navigate to /compras/[id]
   - Click "Crear Orden" → Select proveedor
   - Submit → Estado = ORDEN
   - Assert: Email sent to proveedor (mock)
   - Assert: Progress bar shows stage 3/7

4. **US3.4 - Compras Registers Confirmación:**
   - Login as Jefe Compras
   - Navigate to /compras/[id]
   - Click "Registrar Confirmación" → Upload evidence PDF
   - Submit → Estado = CONFIRMACION
   - Assert: Notificación enviada a Almacén

5. **US3.5 - Almacén Registers Recepción:**
   - Login as Almacén
   - Navigate to /compras (filter: estado=CONFIRMACION)
   - Click compra → Click "Registrar Recepción"
   - Enter num_entrada (e.g., "ENT-2025-042")
   - Submit → Estado = RECEPCION
   - Assert: Progress bar shows stage 5/7

6. **US3.6 - Compras Uploads Certificates:**
   - Login as Jefe Compras
   - Navigate to /compras/[id]
   - Click "Subir Certificados" → Upload 2 PDFs (Calidad, Seguridad)
   - Submit → Estado = CERTIFICADOS
   - Assert: Files uploaded to Vercel Blob
   - Assert: Checklist shows ✓ for uploaded certificates

7. **US3.7 - Contabilidad Closes Purchase:**
   - Login as Contabilidad
   - Navigate to /compras (filter: estado=CERTIFICADOS)
   - Click compra → Click "Aprobar Pago"
   - Enter monto_final (within +5% tolerance)
   - Submit → Estado = CERRADO
   - Assert: Dias_abierto calculation stops
   - Assert: Progress bar shows 7/7 complete

**Blocking Gate Tests:**
- Block ORDER creation if REQUISICION not approved → Error message displayed
- Block RECEPCION if ORDEN not confirmed → Admin bypass option shown
- Block CERRADO if certificates missing (Concreto category) → "Faltan certificados: Calidad, Seguridad"
- Block CERRADO if monto_final > monto_estimado +5% → Escalation to Gerencia

**Alert Tests:**
- Simulate compra open >30 días → Assert email sent to Jefe Compras + Gerencia
- Simulate compra open >45 días → Assert email sent 2× daily (8 AM, 5 PM) + CEO
- Click dashboard red badge → Navigate to at-risk compras list

**Concurrent Edit Test:**
- User A opens compra detail → User B edits same compra → User A submits transition
- Assert: "Compra modificada, refresca y reintenta" error
- User A refreshes → Sees updated estado → Submits successfully

---

## Quality Gates CI

| Gate | Command | Target | Status |
|------|---------|--------|--------|
| Format | `bun run format --check` | 100% | TODO |
| Lint | `bun run lint` | 0 errors | TODO |
| Types | `bun run typecheck` | 0 errors | TODO |
| Unit | `bun test --coverage` | 80%+ on lib/ + state machine | TODO |
| Build | `bun run build` | Exit 0 | TODO |
| E2E | `bun test:e2e` | All 7 user stories pass | TODO |

---

## Manual Testing Checklist

- [ ] Full workflow tested with real data (REQUISICION → CERRADO)
- [ ] All 4 blocking gates validated (aprobación, confirmación, certificados, invoice)
- [ ] Alert emails delivered reliably (<5 min from detection)
- [ ] Audit log queryable (by compra_id, by user_id)
- [ ] Optimistic locking prevents conflicts (tested with 2 concurrent users)
- [ ] Progress bar visualization accurate (shows current stage)
- [ ] Color-coded status (green/yellow/red) displays correctly
- [ ] Dashboard widget shows at-risk purchases (>30 días)
- [ ] Certificate upload works (PDF/images, <10MB, Vercel Blob)
- [ ] Email notifications sent in Spanish with correct details
- [ ] Performance: List <1s (100 purchases), Detail <500ms, Transition <200ms
- [ ] UAT with Liced Vega (super user) - full workflow sign-off
- [ ] Keyboard navigation (Tab, Enter, Esc)
- [ ] Screen reader (VoiceOver) - State changes announced

---

**Token-efficient format:** 65 lines | 7 E2E scenarios | 80%+ coverage target
