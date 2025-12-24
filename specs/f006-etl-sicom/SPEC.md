# SPEC: ETL SICOM (Read-Only)

Version: 1.0 | Date: 2025-12-24 07:00 | Owner: Javier Polo | Status: Active

---

## Problem

Sistema legacy SICOM (años 70-80, versión 2 sin upgrade, pantalla negra) contiene datos históricos valiosos pero inaccesibles. "Bodega de datos sin consultas ágiles" (quote PO). Reportes requieren exportación manual. No se puede integrar en tiempo real con sistemas modernos. Datos atrapados en sistema obsoleto.

---

## Objective

**Primary Goal:** ETL (Extract, Transform, Load) read-only que extrae datos históricos de SICOM de forma segura, transforma a matrices 3D Python para análisis ágil y carga en PostgreSQL warehouse sin NUNCA modificar datos en SICOM.

**Success Metrics:**
- 100% read-only access (ZERO escrituras a SICOM, validado con auditoría)
- ETL completa weekly incremental <10 min (10K filas)
- Error rate <0.1% (1 error por 1,000 filas)
- Data freshness <168h (1 semana desde último sync exitoso)
- Acceso a datos históricos para IA agent <5s (vs minutos en SICOM)
- Path para retiro progresivo de SICOM (usuarios migran a nuevo sistema)

---

## Scope

| In | Out |
|---|---|
| Read-only connection to SICOM (DB access) | Write/modify SICOM data - NEVER |
| Extract 6 tables (compras, proveedores, materiales, precios_hist, proyectos, facturas) | Real-time CDC (Change Data Capture) - Phase 2 |
| Transform to 3D matrices (NumPy) | Machine learning models - Phase 2 |
| Load to PostgreSQL warehouse (upsert strategy) | SICOM retirement/migration - Phase 2 |
| Weekly incremental + monthly full load | Daily sync (SICOM too slow) - Phase 2 |
| On-demand manual sync (admin button) | Automatic rollback of SICOM changes - N/A |
| Error logging + email alerts | Data quality dashboard - Phase 2 |

---

## Contracts

### Input

| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| sync_mode | enum | Y | incremental\|full - incremental = new records since last sync, full = all historical |
| last_sync_date | date | N | Required for incremental, defaults to last successful run |
| tables | string[] | N | Array of table names to sync, defaults to all 6 tables |
| batch_size | int | N | Rows per transaction, defaults to 1000 |
| dry_run | boolean | N | If TRUE, extract + validate only, don't load to warehouse |

### Output

| Field | Type | Condition | Notes |
|-------|------|-----------|-------|
| run_id | uuid | Always | Unique identifier for this ETL run |
| status | enum | Always | SUCCESS\|FAILED\|PARTIAL - PARTIAL if some tables succeeded |
| rows_extracted | int | Always | Total rows extracted from SICOM |
| rows_loaded | int | On Success | Rows successfully loaded to warehouse |
| errors_count | int | Always | Count of errors during ETL (target: <0.1% of rows_extracted) |
| duration_seconds | int | Always | Total runtime in seconds |
| tables_synced | object[] | Always | Per-table stats {table, rows_extracted, rows_loaded, errors} |
| sicom_queries_executed | string[] | Always | List of SQL queries run against SICOM (audit trail) |
| error_log_url | string | On Error | Link to detailed error log file |

---

## Business Rules

- **CRITICAL - Read-Only ALWAYS:** SICOM connection uses read-only user credentials with ZERO write permissions (no INSERT, UPDATE, DELETE, DDL, DCL) - validated via database grants audit
- **Non-blocking queries:** Use `WITH (NOLOCK)` or equivalent to avoid blocking SICOM users during extraction
- **Off-hours execution:** ETL runs at 2 AM Sunday (weekly) to avoid peak SICOM usage
- **Incremental by default:** Extract only new/modified records since last_sync_date → 90% faster than full load
- **Quarterly full load:** Run full sync 1st Sunday of Jan/Apr/Jul/Oct → reconciliation + backup
- **Batch processing:** Insert 1,000 rows per transaction → balance speed vs memory, rollback entire batch on error
- **Timeout 30s per query:** Abort slow SICOM queries to prevent hanging → retry 3× with exponential backoff (1s, 2s, 4s)
- **Retry logic:** On connection failure, retry 3× before failing ETL → email admin if all retries fail
- **Data validation:** Pre-load checks (no NULLs in critical fields, no future dates, ±20% row count) + post-load checks (row count matches, no duplicates, sum(monto_total) within 0.01%)
- **Atomic load:** If load fails, rollback entire batch → warehouse never has partial/corrupted data
- **Audit trail:** Log every SQL query executed against SICOM → {run_id, query, timestamp, duration_ms}

---

## Edge Cases

| Scenario | Handling | Notes |
|----------|----------|-------|
| SICOM connection timeout | Retry 3× with backoff (1s, 2s, 4s) → email admin if all fail → ETL status = FAILED | Network/VPN issues |
| Query slow (>30s) | Abort query → log warning → email admin with slow query text | SICOM overloaded or complex query |
| Invalid data (NULL in critical field) | Skip row → log to errors table → continue processing → status = PARTIAL if errors >1% | Data quality issue in SICOM |
| PostgreSQL write fail | Rollback transaction → retry batch 3× → if still fails, ETL = FAILED | Warehouse disk full or connection lost |
| Duplicate sicom_id | Upsert (ON CONFLICT UPDATE) → update synced_at timestamp | Record modified in SICOM since last sync |
| Future date in fecha_compra | Skip row → log error → "Invalid date: [value]" | Data corruption in SICOM |
| Sum mismatch after load | Rollback load → status = FAILED → email admin with mismatch details | Critical data integrity issue |
| Disk space low (<10% free) | Abort ETL → clean old logs → email admin urgently | Prevent crash |
| Manual sync during cron run | Queue manual sync → run after cron completes → prevent concurrent runs | Admin button clicked during scheduled ETL |
| SICOM unavailable (maintenance) | Retry 3× → if still down, skip this run → alert admin → next weekly run retries | SICOM downtime window |

---

## Observability

**Logs:**
- `etl_started` (info) - Run ID, sync mode, tables
- `sicom_connected` (info) - Connection string (masked password), read-only user
- `query_executed` (info) - SQL query, duration_ms, rows_returned
- `data_validated_pre` (info) - Row count, NULL check, date range check
- `batch_loaded` (info) - Table, batch number, rows loaded
- `data_validated_post` (info) - Row count match, duplicates check, sum match
- `etl_completed` (info) - Status, duration, rows extracted/loaded, errors
- `etl_failed` (error) - Reason, stack trace, last successful query
- `slow_query_detected` (warn) - Query text, duration >30s
- `sicom_write_attempted` (critical) - BLOCK and alert if write query detected (should NEVER happen)

**Metrics:**
- `etl_duration_seconds` - Average runtime per table
- `rows_extracted_count` - Total rows per table
- `rows_loaded_count` - Should match rows_extracted (100% load rate)
- `error_rate_pct` - Errors per 1,000 rows (<0.1% target)
- `success_rate_pct` - % of successful runs (>95% target)
- `data_freshness_hours` - Hours since last successful sync (<168h for weekly)
- `sicom_query_duration_p95` - 95th percentile query time (alert if >20s)
- `warehouse_disk_usage_pct` - Monitor disk space (<90% threshold)

**Traces:**
- `etl_run` (span) - Full ETL lifecycle: connect → extract → transform → load → validate
- `sicom_query` (span) - Individual query execution time
- `transform_3d_matrix` (span) - Data transformation time (NumPy operations)
- `batch_insert` (span) - PostgreSQL insert performance

---

## Definition of Done

- [ ] Code review approved
- [ ] Read-only SICOM connection validated (database grants audit = SELECT only, NO write permissions)
- [ ] ETL extracts 6 tables (compras, proveedores, materiales, precios_hist, proyectos, facturas)
- [ ] Transforms to 3D matrices (Python NumPy) for multi-dimensional analysis
- [ ] Loads to PostgreSQL warehouse with upsert strategy (no duplicates)
- [ ] Weekly cron schedule configured (Sundays 2 AM)
- [ ] Monthly full load configured (1st Sunday 2 AM)
- [ ] Error handling tested (timeout, connection fail, invalid data, disk full)
- [ ] Retry logic works (3× with exponential backoff)
- [ ] Data validation passes (pre-load + post-load checks)
- [ ] Admin dashboard shows ETL status (run history, errors, data freshness)
- [ ] On-demand manual sync button works (admin panel)
- [ ] Integration with F001 (IA agent queries warehouse successfully)
- [ ] Integration with F007 (price anomaly detection uses historical prices)
- [ ] Performance targets met (incremental <10min, error rate <0.1%)
- [ ] Quality gates pass (format, lint, types, tests 80%+, build)
- [ ] Deployed to production
- [ ] UAT with Jefe Compras (validate historical data accuracy)
- [ ] Smoke test passed (extract → transform → load 1,000 rows)

---

**Related:** F001 (IA agent queries warehouse), F007 (Análisis Precios uses historical data) | **Dependencies:** SICOM read-only access, PostgreSQL warehouse, Python 3.11+

**Original PRD:** docs/features/r06-etl-sicom.md
