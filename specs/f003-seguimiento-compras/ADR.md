# ADR-003: Use XState Over Custom State Machine for Purchase Workflow

Version: 1.0 | Date: 2025-12-24 06:40 | Owner: Javier Polo | Status: Accepted

---

## Context

Seguimiento Compras (F003) requires robust state machine for 7-stage workflow (REQUISICION → APROBACION → ORDEN → CONFIRMACION → RECEPCION → CERTIFICADOS → CERRADO) with blocking gates, concurrent change handling, and audit logging.

Budget: No additional state management budget (prefer open-source). Expected usage: 50-100 active purchases at any time, ~20 state transitions per day.

Decision needed NOW because state machine is foundation for all workflow logic, blocking gates, and audit trail.

---

## Decision

**Will:** Use XState (TypeScript state machine library)
**Will NOT:** Build custom state machine, use simple enum-based state management, or use Redux state machine

---

## Rationale

XState offers best balance of robustness, maintainability, and TypeScript integration:
- Free + open-source (MIT license) vs building custom (high maintenance cost)
- Type-safe state transitions + guards (compile-time validation)
- Built-in support for guards (blocking gates), actions (audit log), and context (compra data)
- Visualizer tool for debugging state machine (xstate.js.org/viz)
- 12K+ GitHub stars, active community, enterprise-proven (Microsoft, Amazon use it)
- No vendor lock-in (can export to JSON or migrate if needed)

For 2-person team, XState = minimal learning curve (2-3 hours), extensive examples, well-documented patterns for guards and actions.

---

## ClaudeCode&OnlyMe Validation

| Question | Answer | Score |
|----------|--------|-------|
| ¿Resuelve problema REAL HOY? | YES - Need state machine now, 7 stages + blocking gates critical | 1/1 |
| ¿Solución más SIMPLE? | YES - Declarative config vs imperative custom code, 50 lines XState vs 300+ lines custom | 1/1 |
| ¿2 personas lo mantienen? | YES - Javier + Claude Code, no state machine experts needed, visual debugger helps | 1/1 |
| ¿Vale si NUNCA crecemos? | YES - Works for 10-1000 purchases without changes, no scaling issues | 1/1 |
| **TOTAL** | **4/4 = ACCEPT** | **4/4** |

**Veto Threshold:** ANY NO = REJECT ✓ PASSED

---

## Alternatives Considered

### 1. Custom State Machine (Switch/Case)
**Why rejected:**
- 300+ lines of imperative code vs 50 lines declarative XState config
- Error-prone (easy to miss edge cases, invalid transitions)
- Hard to visualize workflow (no debugging tools)
- High maintenance burden for 2-person team
- No built-in guards or actions (must build ourselves)

### 2. Simple Enum-Based State Management
**Why rejected:**
- No transition validation (can skip stages, e.g., REQUISICION → CERRADO)
- Blocking gates must be manually checked in every API route (duplicated logic)
- No audit trail built-in (must add manually)
- Scales poorly as workflow complexity grows (e.g., parallel approvals in Phase 2)

### 3. Redux State Machine
**Why rejected:**
- Violates ClaudeCode&OnlyMe: Redux = overkill for 2-person team
- Not designed for workflow state machines (actions/reducers != state transitions)
- More boilerplate than XState (actions, reducers, middleware vs single config)
- No visual debugger for state machines specifically

---

## Consequences

**Positive:**
- Zero cost (MIT license)
- Type-safe transitions (TypeScript errors if invalid state transition)
- Declarative config (easy to read, modify, review)
- Built-in guards for blocking gates (clean separation of concerns)
- Visual debugger (xstate.js.org/viz) for troubleshooting
- Audit trail via actions (log all transitions automatically)
- Future-proof for parallel approvals (XState supports parallel states)

**Negative:**
- Learning curve 2-3 hours (acceptable for 2-person team)
- Bundle size ~20KB (acceptable for workflow-critical feature)
- Not a standard React state library (Redux/Zustand more common, but XState is workflow-specific)

**Risks:**
- **XState abandonment:** Mitigated by large community (12K stars), active maintenance (last release <1 month), can export to JSON and migrate if needed
- **Overengineering:** Mitigated by 4/4 YES on ClaudeCode&OnlyMe, simple use case (7 states, 14 transitions)

---

## Implementation Example

**XState Config (lib/state-machines/compraMachine.ts):**
```typescript
import { createMachine } from 'xstate';

export const compraMachine = createMachine({
  id: 'compra',
  initial: 'REQUISICION',
  states: {
    REQUISICION: {
      on: {
        APPROVE: {
          target: 'APROBACION',
          guard: 'isApprovalValid', // Blocking gate
          actions: ['logTransition', 'notifyCompras']
        }
      }
    },
    APROBACION: {
      on: {
        CREATE_ORDER: {
          target: 'ORDEN',
          guard: 'hasSupplierSelected',
          actions: ['logTransition', 'sendOrderEmail']
        }
      }
    },
    // ... 5 more states
  }
}, {
  guards: {
    isApprovalValid: (context) => context.approver_notes.length > 0,
    hasSupplierSelected: (context) => !!context.proveedor_id,
    hasCertificates: (context) => context.certificados.length >= 2
  },
  actions: {
    logTransition: (context, event) => auditLog.log(context.id, event),
    notifyCompras: (context) => sendEmail('compras@contecsa.com', ...)
  }
});
```

**Benefits:**
- Guards enforce blocking gates declaratively
- Actions handle audit log + notifications automatically
- Type-safe (TypeScript knows valid states/transitions)

---

## Related

- SPEC: /specs/f003-seguimiento-compras/SPEC.md (Business Rules section)
- PLAN: /specs/f003-seguimiento-compras/PLAN.md (S002: Define XState config)
- XState Docs: https://xstate.js.org/docs/
- XState Visualizer: https://xstate.js.org/viz

---

**Decision Maker:** Javier Polo + Claude Code | **Review Date:** 2025-06-24 (6 months)
