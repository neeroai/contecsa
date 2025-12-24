# SDD Implementation Plan: ETL SICOM (Read-Only)

Version: 1.0 | Date: 2025-12-24 07:05 | Owner: Javier Polo | Status: Active

---

## Reference

**SPEC:** /specs/f006-etl-sicom/SPEC.md
**ADR:** /specs/f006-etl-sicom/ADR.md (Python ETL vs Airbyte/Fivetran)
**PRD:** docs/features/r06-etl-sicom.md
**CRITICAL:** SICOM is ALWAYS read-only - cite: contecsa/CLAUDE.md:71

---

## Stack Validated

**ETL Engine:** Python 3.11+ (FastAPI backend)
- Source: /Users/mercadeo/neero/docs-global/stack/common-stack.md:80-85
- Reason: PO requirement - "matrices tridimensionales, análisis datos Python" (contecsa/CLAUDE.md:34-35)

**Database Driver:** pyodbc (SICOM connection, likely SQL Server/Oracle)
- Source: /Users/mercadeo/neero/docs-global/stack/database-guide.md:50-55
- READ-ONLY user credentials ONLY

**Data Transform:** Pandas + NumPy (3D matrices)
- Source: /Users/mercadeo/neero/docs-global/stack/common-stack.md:80-85
- Use case: Multi-dimensional analysis (Proyectos × Materiales × Tiempo)

**Warehouse:** PostgreSQL 15 (transformed data storage)
- Source: /Users/mercadeo/neero/docs-global/stack/database-guide.md:15-25

**ORM:** Drizzle ORM (warehouse writes)
- Source: /Users/mercadeo/neero/docs-global/stack/database-guide.md:35-40

**Scheduler:** Node-cron (JavaScript cron for Next.js app)
- Source: /Users/mercadeo/neero/docs-global/stack/common-stack.md:85-90
- Alternative: Linux cron if Python ETL runs independently

**Email:** Gmail API (error notifications)
- Source: /Users/mercadeo/neero/docs-global/stack/common-stack.md:65-70

**Validation Checklist:**
- [x] Stack matches docs-global/stack/ (7 citations)
- [x] NO INVENTAR protocol applied
- [x] ClaudeCode&OnlyMe filter passed (see ADR.md)
- [x] CRITICAL: Read-only constraint enforced (contecsa/CLAUDE.md:71)
- [x] Dependencies: SICOM read-only access, PostgreSQL warehouse, Python 3.11+
- [x] Limitations: Weekly sync only (SICOM too slow for daily)

---

## Implementation Steps (13 steps)

### S001: Request SICOM read-only credentials from DBA
**Deliverable:** Read-only database user + connection string
**Dependencies:** SICOM DBA approval
**Acceptance:** User has SELECT-only grants, NO INSERT/UPDATE/DELETE permissions (audit via `SHOW GRANTS` or equivalent)

### S002: Create warehouse schema for 6 SICOM tables
**Deliverable:** SQL migrations for sicom_compras_hist, sicom_precios_hist, sicom_proveedores_hist, sicom_proyectos_hist, sicom_materiales_hist, sicom_facturas_hist
**Dependencies:** PostgreSQL connection
**Acceptance:** Tables created with indexes on fecha, proyecto_id, material_id, proveedor_id

### S003: Create etl_runs log table
**Deliverable:** SQL migration for ETL audit trail
**Dependencies:** S002 (warehouse schema)
**Acceptance:** Table tracks {run_id, started_at, finished_at, status, rows_extracted, rows_loaded, errors_count, duration_seconds, log_file}

### S004: Implement SICOM connection module (read-only)
**Deliverable:** api/services/sicom/connection.py with read-only validation
**Dependencies:** S001 (credentials)
**Acceptance:** Connection succeeds, query timeout 30s, retry logic 3×, NO write queries allowed (code review + unit test)

### S005: Implement extraction queries for 6 tables
**Deliverable:** api/services/sicom/extract.py with 6 SQL queries (incremental + full)
**Dependencies:** S004 (connection)
**Acceptance:** Queries use `WITH (NOLOCK)`, WHERE last_sync_date for incremental, LIMIT 10K per batch

### S006: Implement 3D matrix transformation (NumPy)
**Deliverable:** api/services/etl/transform.py with Pandas → NumPy conversion
**Dependencies:** S005 (extracted data)
**Acceptance:** Creates 3D matrix (9 proyectos × 50 categorías × 24 meses), fast aggregations (<1s)

### S007: Implement warehouse loading with upsert
**Deliverable:** api/services/etl/load.py with batch INSERT ... ON CONFLICT UPDATE
**Dependencies:** S002 (warehouse schema)
**Acceptance:** Batch size 1,000 rows, rollback on error, no duplicates

### S008: Implement pre-load data validation
**Deliverable:** api/services/etl/validate.py with checks (NULLs, date range, row count)
**Dependencies:** S005 (extracted data)
**Acceptance:** Rejects invalid rows, logs errors, stops ETL if >10% errors

### S009: Implement post-load data validation
**Deliverable:** api/services/etl/validate.py with checks (row count match, duplicates, sum mismatch)
**Dependencies:** S007 (loaded data)
**Acceptance:** Rollback load if validation fails, log detailed error

### S010: Create ETL orchestrator (main script)
**Deliverable:** api/services/etl/sicom_etl.py with full pipeline (extract → transform → load → validate)
**Dependencies:** S004-S009 (all modules)
**Acceptance:** Handles --incremental and --full flags, logs to etl_runs table, emails on error

### S011: Configure weekly cron schedule
**Deliverable:** cron job (Sundays 2 AM) + node-cron config in Next.js
**Dependencies:** S010 (ETL script)
**Acceptance:** Runs automatically, logs to /var/log/sicom_etl.log, sends email on failure

### S012: Create admin dashboard for ETL status
**Deliverable:** app/admin/etl/page.tsx with run history + manual sync button
**Dependencies:** S003 (etl_runs table)
**Acceptance:** Shows last 10 runs, status, duration, errors, "Sync Now" button triggers on-demand ETL

### S013: Integration testing + UAT with Jefe Compras
**Deliverable:** E2E test (extract → load 1,000 rows) + UAT validation of historical data accuracy
**Dependencies:** S001-S012 (full feature)
**Acceptance:** ETL completes in <10min, error rate <0.1%, data matches SICOM source, UAT sign-off

---

## Milestones

**M1 - SICOM Access + Warehouse:** [S001-S003] | Target: Week 1 (Credentials + DB schema)
**M2 - ETL Pipeline:** [S004-S007] | Target: Week 2 (Extract + Transform + Load)
**M3 - Validation + Orchestration:** [S008-S010] | Target: Week 3 (Validation + Main script)
**M4 - Automation + Monitoring:** [S011-S013] | Target: Week 4 (Cron + Dashboard + UAT)

---

## Risk Mitigation

| Risk | Mitigation | Owner |
|------|-----------|-------|
| **ACCIDENTALLY write to SICOM (CRITICAL)** | Read-only user grants enforced at DB level + code review REQUIRED + unit test blocks write queries + audit log of all queries | Javier Polo |
| SICOM connection unstable | Retry logic (3×), timeout 30s, off-hours execution (2 AM), fallback to CSV export if direct DB fails | Claude Code |
| SICOM queries slow (>30s) | Abort slow queries, log warning, email admin, optimize query (add indexes if possible, or reduce date range) | Javier Polo |
| Data quality issues (NULLs, invalid dates) | Pre-load validation, skip invalid rows, log errors, ETL = PARTIAL if errors >1% | Claude Code |
| Warehouse disk full | Monitor disk usage (<90%), clean old logs, alert admin at 85% | Claude Code |
| ETL runtime >1 hour | Optimize batch size, parallel processing for large tables, use incremental load (not full) | Claude Code |
| VPN required for SICOM access | Document VPN setup, auto-reconnect on disconnect, alert if VPN down | Javier Polo |
| Data freshness degradation (>1 week) | Alert admin if last successful run >168h, escalate to CEO if >2 weeks | Claude Code |

---

## Notes

**Critical Constraints:**
- SICOM is 1970s-80s legacy system → fragile, NO direct modification, read-only ONLY
- F001 (IA agent) depends on warehouse data for historical queries
- F007 (Análisis Precios) depends on sicom_precios_hist for anomaly detection

**Assumptions:**
- SICOM DBA provides read-only credentials (no write permissions)
- SICOM database is SQL Server or Oracle (pyodbc compatible)
- VPN access required to connect to SICOM network
- Average 10K new rows per week (incremental load)
- Full historical data ~100K rows total (initial full load)

**Blockers:**
- SICOM read-only credentials (request from DBA, may take 1-2 weeks)
- VPN access to SICOM network
- SICOM database schema documentation (need table/column names)

---

**Last updated:** 2025-12-24 07:05 | Maintained by: Javier Polo + Claude Code
