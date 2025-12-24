# TASKS: ETL SICOM (Read-Only)

Version: 1.0 | Date: 2025-12-24 07:20 | Owner: Claude Code | Status: Active

---

## DOING

| ID | Task | DoD | Est |
|----|------|-----|-----|
| - | No active tasks yet | - | - |

---

## TODO (Priority Order - From PLAN.md)

| ID | Task | DoD | Est |
|----|------|-----|-----|
| T001 | Request SICOM read-only credentials from DBA | - Email sent to SICOM DBA<br>- Read-only user credentials received<br>- Database grants audit: SELECT only, NO INSERT/UPDATE/DELETE | 1 week (external dependency) |
| T002 | Create sicom_compras_hist table migration | - SQL migration file<br>- 12 fields (sicom_id, proyecto_id, proveedor_id, material_id, cantidad, precio_unitario, monto_total, fecha_compra, estado, synced_at)<br>- Indexes on fecha, proyecto_id, proveedor_id<br>- Primary key: sicom_id | 2h |
| T003 | Create sicom_precios_hist table migration | - SQL migration file<br>- 8 fields (id, material_id, proveedor_id, precio_unitario, fecha, cantidad, unidad, synced_at)<br>- Indexes on material_id + fecha, proveedor_id + material_id | 2h |
| T004 | Create remaining 4 warehouse tables migrations | - sicom_proveedores_hist<br>- sicom_proyectos_hist<br>- sicom_materiales_hist<br>- sicom_facturas_hist<br>- All with appropriate indexes | 3h |
| T005 | Create etl_runs log table migration | - 9 fields (run_id, started_at, finished_at, status, rows_extracted, rows_loaded, errors_count, duration_seconds, log_file)<br>- Index on started_at | 1h |
| T006 | Implement SICOM connection module (read-only) | - api/services/sicom/connection.py<br>- pyodbc connection with readonly=True<br>- Connection timeout 30s<br>- Retry logic 3× with exponential backoff (1s, 2s, 4s)<br>- **CRITICAL:** Validate read-only at connection level | 3h |
| T007 | Implement read-only query validator | - api/services/sicom/query_validator.py<br>- Parse SQL queries<br>- Block INSERT, UPDATE, DELETE, DDL, DCL<br>- Allow SELECT only<br>- Raise exception if write query detected | 2h |
| T008 | Implement extraction query for compras table | - api/services/sicom/extract.py function: extract_compras()<br>- Incremental: WHERE fecha >= last_sync_date<br>- Full: all historical data<br>- LIMIT 10,000 per batch<br>- Use `WITH (NOLOCK)` if supported | 3h |
| T009 | Implement extraction queries for 5 remaining tables | - extract_precios(), extract_proveedores(), extract_materiales(), extract_proyectos(), extract_facturas()<br>- Same pattern as T008 (incremental + full) | 4h |
| T010 | Implement 3D matrix transformation (NumPy) | - api/services/etl/transform.py<br>- Pandas DataFrame → NumPy 3D matrix<br>- Shape: (9 proyectos, 50 materiales, 24 meses)<br>- Populate matrix from extracted data<br>- Fast aggregations (<1s for 10K rows) | 4h |
| T011 | Implement warehouse loading with upsert | - api/services/etl/load.py<br>- Batch INSERT ... ON CONFLICT UPDATE<br>- Batch size 1,000 rows per transaction<br>- Rollback entire batch on error (atomic) | 3h |
| T012 | Implement pre-load data validation | - api/services/etl/validate.py function: validate_pre_load()<br>- Check NULLs in critical fields (compra_id, monto, fecha)<br>- Check date range (no future dates, no dates <1990)<br>- Check row count ±20% expected<br>- Stop ETL if >10% errors | 3h |
| T013 | Implement post-load data validation | - api/services/etl/validate.py function: validate_post_load()<br>- Check row count matches source<br>- Check no duplicate sicom_ids<br>- Check sum(monto_total) within 0.01% tolerance<br>- Rollback load if validation fails | 3h |
| T014 | Create ETL orchestrator (main script) | - api/services/etl/sicom_etl.py<br>- Argument parser (--incremental, --full, --dry-run)<br>- Pipeline: connect → extract → validate_pre → transform → load → validate_post<br>- Log to etl_runs table<br>- Email admin on error | 4h |
| T015 | Implement error logging service | - api/services/etl/logger.py<br>- Log to file: /var/log/sicom_etl.log<br>- Log to database: etl_runs table<br>- Email admin on FAILED status | 2h |
| T016 | Implement email notification service | - api/services/etl/notifications.py<br>- Gmail API integration<br>- Email templates: success, failed, partial<br>- Include: run_id, status, rows extracted/loaded, duration, error log link | 3h |
| T017 | Configure weekly cron schedule (Sundays 2 AM) | - Linux cron job OR node-cron in Next.js<br>- Command: python api/services/etl/sicom_etl.py --incremental<br>- Log to /var/log/sicom_etl.log<br>- Email on failure | 2h |
| T018 | Configure monthly full load cron (1st Sunday 2 AM) | - Runs 1st Sunday of Jan/Apr/Jul/Oct<br>- Command: python api/services/etl/sicom_etl.py --full<br>- Backup + reconciliation purpose | 1h |
| T019 | Create admin dashboard ETL status page | - app/admin/etl/page.tsx<br>- Table: last 10 runs from etl_runs<br>- Columns: run_id, started_at, status, rows extracted/loaded, duration, errors<br>- Manual sync button: "Sync Now" | 4h |
| T020 | Implement manual sync button handler | - API route: POST /api/admin/etl/sync<br>- Triggers sicom_etl.py with --incremental<br>- Returns run_id + progress updates<br>- Queue if cron ETL already running | 3h |
| T021 | Write unit tests for SICOM connection | - Test: connection succeeds with read-only credentials<br>- Test: timeout 30s enforced<br>- Test: retry 3× on failure<br>- **CRITICAL Test:** Write query blocked (INSERT rejected) | 2h |
| T022 | Write unit tests for extraction queries | - Test: incremental query WHERE fecha >= last_sync_date<br>- Test: full query returns all historical<br>- Test: batch size 1,000 enforced<br>- **CRITICAL Test:** All queries are SELECT only | 3h |
| T023 | Write unit tests for 3D matrix transformation | - Test: Pandas → NumPy conversion<br>- Test: Shape (9, 50, 24) correct<br>- Test: Fast aggregations (<1s for 10K rows)<br>- Test: Handles missing data (NaNs) | 2h |
| T024 | Write unit tests for warehouse loading | - Test: Batch INSERT 1,000 rows<br>- Test: ON CONFLICT UPDATE (upsert)<br>- Test: Rollback on error<br>- Test: No duplicates after load | 3h |
| T025 | Write unit tests for pre/post-load validation | - Test: Rejects NULLs, future dates, row count outliers<br>- Test: Row count matches source<br>- Test: No duplicates<br>- Test: Sum within 0.01% tolerance | 3h |
| T026 | Write integration tests for full ETL pipeline | - Test: Extract → Transform → Load → Validate (1,000 rows)<br>- Test: Incremental vs full load<br>- Test: Error handling (timeout, invalid data, disk full)<br>- **CRITICAL Test:** Read-only enforcement (write query blocked) | 4h |
| T027 | Write E2E tests for admin dashboard | - Test: Manual sync button triggers ETL<br>- Test: Progress bar appears<br>- Test: etl_runs table updated<br>- Test: Email sent on error | 3h |
| T028 | Performance test ETL with 10K, 50K, 100K rows | - Measure runtime for each<br>- Target: 10K rows <10min<br>- Optimize if >10min (batch size, parallel processing) | 3h |
| T029 | UAT with Jefe Compras (validate historical data accuracy) | - Schedule UAT session<br>- Compare SICOM source vs warehouse data (sample 100 rows)<br>- Validate KPIs match (total gasto, promedio precio)<br>- Sign-off | 4h |
| T030 | SICOM DBA audit (confirm no write activity from ETL user) | - Request database audit log from SICOM DBA<br>- Verify ETL user executed SELECT only (NO write queries)<br>- Document audit results | 2h (external dependency) |

**Total Estimated Time:** 73 hours (~3-4 weeks, excluding T001 + T030 external dependencies)

---

## BLOCKED

| ID | Task | Blocker | Notes |
|----|------|---------|-------|
| T001 | Request SICOM read-only credentials | Waiting for SICOM DBA approval | May take 1-2 weeks, critical path blocker |

---

## DONE

| ID | Task | Closed | Commit |
|----|------|--------|--------|
| - | Migration to SDD | 2025-12-24 | TBD |

---

**Dependencies:**
- T002-T005 independent (can run in parallel)
- T006-T009 depend on T001 (credentials required)
- T010 depends on T008-T009 (extracted data needed)
- T011 depends on T002-T005 (warehouse schema must exist)
- T012-T013 depend on T010 (transform module needed)
- T014-T016 depend on T006-T013 (all ETL modules)
- T017-T018 depend on T014 (orchestrator must exist)
- T019-T020 depend on T005 (etl_runs table must exist)
- T021-T025 depend on T006-T013 (modules to test)
- T026-T027 depend on T014-T020 (full feature)
- T028-T030 depend on T026-T027 (tests pass first)

**CRITICAL Constraint:**
- T001 is blocking path - Request SICOM credentials IMMEDIATELY (week 1 priority)
- T007 (read-only validator) is CRITICAL security control - Must be code reviewed + tested before production
