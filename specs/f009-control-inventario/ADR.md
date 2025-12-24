# ADR-009: Use PostgreSQL Over NoSQL for Inventory Control

Version: 1.0 | Date: 2025-12-24 09:10 | Owner: Javier Polo | Status: Accepted

---

## Context

Inventory control system (F009) must track stock movements (recepciones, entregas, ajustes) with >95% accuracy, prevent negative stock (race conditions), support ACID transactions, and integrate with F003 (Purchase Tracking) and F005 (Notificaciones). Choice between PostgreSQL (relational), MongoDB (document NoSQL), or Redis (in-memory).

Critical requirements:
- ACID transactions (create movement → update stock → check min → trigger alert = atomic)
- Prevent negative stock (optimistic locking, race condition handling)
- Audit trail (immutable log of all movements)
- Complex queries (JOIN inventory + movements + materials + projects)
- Data integrity (foreign keys to purchases, projects, materials)

Decision needed NOW because database selection determines schema design (normalized vs denormalized), transaction strategy (ACID vs eventual consistency), and query patterns (SQL vs document).

---

## Decision

**Will:** Use PostgreSQL 15 for inventory control
**Will NOT:** Use MongoDB or Redis

---

## Rationale

PostgreSQL offers best balance of ACID guarantees, relational integrity, and operational simplicity:
- **ACID transactions:** Multi-step inventory update (movement + stock + alert) is atomic (all or nothing)
- **Optimistic locking:** Built-in `version` field + transaction isolation prevents race conditions (2 deliveries same time = 1 succeeds, 1 retries)
- **Foreign keys:** Enforce referential integrity (movement → material_id must exist, project_id must exist)
- **Complex queries:** JOIN inventory + movements + purchases for valorization, rotation analysis
- **Audit trail:** Immutable `inventory_movements` table (append-only log)
- **Drizzle ORM:** Type-safe queries (TypeScript), migration management, zero runtime overhead
- **Already used:** Contecsa stack (F003 uses PostgreSQL) - no new database to manage
- **2-person team:** PostgreSQL = standard SQL (Javier knows), no specialized NoSQL training
- **Free tier:** Included in Vercel Postgres or client self-host (no additional cost)

For 2-person team with ACID requirements and relational data, PostgreSQL = proven, simple, zero marginal cost.

---

## ClaudeCode&OnlyMe Validation

| Question | Answer | Score |
|----------|--------|-------|
| ¿Resuelve problema REAL HOY? | YES - Need inventory control now to prevent capital waste ($30M inmovilizado), track stock movements, prevent desabastecimientos | 1/1 |
| ¿Solución más SIMPLE? | YES - PostgreSQL already in stack (F003), Drizzle ORM = type-safe SQL, no new database | 1/1 |
| ¿2 personas lo mantienen? | YES - Standard SQL (no specialized NoSQL training), Drizzle migrations = version-controlled schema | 1/1 |
| ¿Vale si NUNCA crecemos? | YES - 10-100 materials, 1,000 movements/month = trivial for PostgreSQL (handles millions of rows), no scaling needed | 1/1 |
| **TOTAL** | **4/4 = ACCEPT** | **4/4** |

**Veto Threshold:** ANY NO = REJECT ✓ PASSED

---

## Alternatives Considered

### 1. MongoDB (Document NoSQL)
**Why rejected:**
- **No ACID transactions (before v4.0):** Multi-step inventory update (movement + stock + alert) not atomic - can create movement but fail to update stock (inconsistent state)
- **Eventual consistency:** Cannot guarantee negative stock prevention (2 deliveries same time = both succeed, stock goes negative)
- **Schema flexibility unnecessary:** Inventory schema is fixed (12 fields, not changing) - document flexibility is overhead, not benefit
- **Complex queries harder:** No JOIN - must fetch movements + materials + projects separately, aggregate in application code (slow, complex)
- **Foreign key enforcement:** Application-level only (no database guarantees) - can create movement with invalid material_id
- Violates ClaudeCode&OnlyMe: NOT simplest (new database vs existing), NOT 2-person maintainable (NoSQL expertise required)

**Why NOT considered Phase 2 fallback:**
- No compelling advantage for inventory use case (relational data, fixed schema, ACID requirements)

### 2. Redis (In-Memory)
**Why rejected:**
- **Not persistent:** Data lost on restart (unacceptable for inventory audit trail)
- **No complex queries:** Cannot JOIN inventory + movements (must read all, filter in app)
- **No foreign keys:** No referential integrity
- **Cost:** Vercel Redis $20/month (vs PostgreSQL free tier) for persistent storage + replication
- **Overkill:** Inventory queries <2s acceptable (not <10ms requirement) - in-memory speed unnecessary
- Violates ClaudeCode&OnlyMe: NOT simplest (new database), NOT free (cost scaling)

**Why considered Phase 2 enhancement:**
- Redis as **cache layer** (NOT primary database) for stock queries (cache current_stock for 5 min TTL)
- But NOT for Phase 1 (premature optimization - queries already fast)

### 3. SQLite (Embedded)
**Why rejected:**
- **No concurrent writes:** Inventory movements from multiple users (Almacén + F003 integration) = write conflicts
- **No server deployment:** Client self-hosts in GCP/AWS (needs networked database, not file-based)
- **No horizontal scaling:** Single file (vs PostgreSQL sharding if needed Phase 2)
- Violates ClaudeCode&OnlyMe: NOT suitable for multi-user (concurrent write requirement)

---

## Consequences

**Positive:**
- ACID guarantees (atomic transactions, no inconsistent state)
- Negative stock prevention (optimistic locking + transaction isolation)
- Foreign key enforcement (data integrity)
- Complex queries (JOIN inventory + movements + materials)
- Audit trail (immutable log)
- Type-safe queries (Drizzle ORM)
- Zero marginal cost (already in stack)
- Standard SQL (2-person maintainable)
- Proven at scale (millions of rows)

**Negative:**
- Schema migrations required (vs MongoDB schema-less) - but Drizzle makes this easy
- Slower than Redis (<2s vs <10ms) - but acceptable for inventory queries
- Vertical scaling limit (~10M rows) - but Contecsa = 100 materials, 1,000 movements/month = decades of runway

**Risks:**
- **Negative stock race condition:** Mitigated by optimistic locking (version field), transaction isolation (SERIALIZABLE), retry logic (3x with backoff)
- **Complex query performance (<2s):** Mitigated by indexes (material_id, timestamp), EXPLAIN ANALYZE optimization, pagination (50 rows/page)
- **Migration failures:** Mitigated by Drizzle migration rollback, test migrations in staging first
- **Concurrent write conflicts:** Mitigated by optimistic locking (retry on version conflict), queue for high-frequency updates (if needed Phase 2)

---

## Implementation Details

**Schema (Drizzle ORM):**
```typescript
// lib/db/schema/inventory.ts
import { pgTable, uuid, varchar, decimal, timestamp, integer } from 'drizzle-orm/pg-core';

export const inventory = pgTable('inventory', {
  id: uuid('id').primaryKey().defaultRandom(),
  material_id: uuid('material_id').references(() => materials.id).notNull(),
  material_name: varchar('material_name', { length: 200 }).notNull(),
  unit: varchar('unit', { length: 20 }).notNull(), // m³, kg, ton, unit
  current_stock: decimal('current_stock', { precision: 12, scale: 3 }).notNull(),
  min_stock: decimal('min_stock', { precision: 12, scale: 3 }).notNull(),
  max_stock: decimal('max_stock', { precision: 12, scale: 3 }),
  unit_cost: decimal('unit_cost', { precision: 12, scale: 2 }).notNull(), // COP
  total_value: decimal('total_value', { precision: 15, scale: 2 }).generatedAlwaysAs(
    sql`current_stock * unit_cost`
  ), // Computed column
  last_reception_date: timestamp('last_reception_date'),
  last_delivery_date: timestamp('last_delivery_date'),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
  version: integer('version').default(1).notNull(), // Optimistic locking
});

export const inventoryMovements = pgTable('inventory_movements', {
  id: uuid('id').primaryKey().defaultRandom(),
  material_id: uuid('material_id').references(() => materials.id).notNull(),
  movement_type: varchar('movement_type', { length: 20 }).notNull(), // RECEPTION, DELIVERY, ADJUSTMENT
  quantity: decimal('quantity', { precision: 12, scale: 3 }).notNull(),
  unit: varchar('unit', { length: 20 }).notNull(),
  purchase_id: uuid('purchase_id').references(() => purchases.id),
  project_id: uuid('project_id').references(() => projects.id),
  performed_by: uuid('performed_by').references(() => users.id).notNull(),
  notes: varchar('notes', { length: 500 }),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

// Indexes
export const inventoryMaterialIdIndex = index('inventory_material_id_idx').on(inventory.material_id);
export const movementsMaterialIdTimestampIndex = index('movements_material_id_timestamp_idx').on(
  inventoryMovements.material_id,
  inventoryMovements.timestamp
);
```

**Optimistic Locking (Prevent Negative Stock):**
```typescript
// lib/services/inventory.ts
async function updateStock(material_id: string, quantity: number, movement_type: string) {
  return await db.transaction(async (tx) => {
    // 1. Read current stock + version
    const current = await tx
      .select()
      .from(inventory)
      .where(eq(inventory.material_id, material_id))
      .for('update'); // Row-level lock

    if (!current) throw new Error('Material not found');

    // 2. Calculate new stock
    const new_stock =
      movement_type === 'RECEPTION'
        ? current.current_stock + quantity
        : current.current_stock - quantity;

    // 3. Validate (prevent negative)
    if (new_stock < 0) {
      throw new Error(`Stock insuficiente, actual: ${current.current_stock}`);
    }

    // 4. Update stock (optimistic locking - version check)
    const updated = await tx
      .update(inventory)
      .set({
        current_stock: new_stock,
        version: current.version + 1,
        updated_at: new Date(),
      })
      .where(
        and(
          eq(inventory.material_id, material_id),
          eq(inventory.version, current.version) // Version check
        )
      )
      .returning();

    // 5. If version conflict (race condition) → Retry
    if (updated.length === 0) {
      throw new Error('Version conflict - retry');
    }

    // 6. Create movement (audit trail)
    await tx.insert(inventoryMovements).values({
      material_id,
      movement_type,
      quantity,
      ...
    });

    // 7. Check min_stock → Trigger alert (if needed)
    if (updated[0].current_stock < updated[0].min_stock) {
      await triggerReorderAlert(material_id);
    }

    return updated[0];
  });
}
```

**Benefits:**
- Atomic transaction (all 7 steps succeed or none)
- Optimistic locking (version field prevents race conditions)
- Foreign keys enforced (cannot create movement with invalid material_id)
- Type-safe (Drizzle ORM catches errors at compile time)
- Immutable audit trail (inventoryMovements = append-only)

---

## Related

- SPEC: /specs/f009-control-inventario/SPEC.md (Contracts, Business Rules)
- PLAN: /specs/f009-control-inventario/PLAN.md (S001: inventory table, S002: movements table, S004: stock update logic)
- Database Guide: /Users/mercadeo/neero/docs-global/stack/database-guide.md:15-25 (PostgreSQL patterns)
- Drizzle ORM: https://orm.drizzle.team/docs/overview (type-safe queries)
- Optimistic Locking: https://en.wikipedia.org/wiki/Optimistic_concurrency_control

---

**Decision Maker:** Javier Polo + Claude Code | **Review Date:** 2025-06-24 (6 months)
