# Test Plan: ETL SICOM (Read-Only)

Version: 1.0 | Date: 2025-12-24 07:15 | Owner: Claude Code | Status: Active

---

## Reference

**SDD Version:** 1.0 | **Feature:** ETL SICOM (F006) | **Scope:** Unit + Integration + E2E | **Coverage Target:** 80% (ETL pipeline, validation, read-only enforcement)

---

## Test Strategy

**Philosophy:** 80% coverage on ETL modules (extract, transform, load, validate). CRITICAL focus on read-only enforcement (ZERO write queries to SICOM). Unit tests verify query generation. Integration tests verify full pipeline. E2E tests verify data accuracy vs SICOM source.

**Critical Paths:**
1. Connect SICOM (read-only) → Extract data → Transform to 3D matrix → Load to warehouse → Validate
2. Pre-load validation (NULLs, dates, row count) → Reject invalid data → Log errors
3. Post-load validation (row count match, duplicates, sum mismatch) → Rollback on fail
4. Read-only enforcement → Block write queries → Alert admin if write attempted

---

## Unit Tests

| Module | Test Cases | Tool | Status |
|--------|-----------|------|--------|
| SICOM connection (connection.py) | - Connect succeeds with read-only credentials<br>- Timeout 30s enforced<br>- Retry 3× on failure<br>- **CRITICAL:** Write query blocked (INSERT/UPDATE/DELETE rejected) | Pytest + SICOM mock DB | TODO |
| Extraction queries (extract.py) | - Incremental query WHERE fecha >= last_sync_date<br>- Full query returns all historical<br>- Batch size 1,000 enforced<br>- Query uses `WITH (NOLOCK)` (non-blocking)<br>- **CRITICAL:** All queries are SELECT only | Pytest + SQL parser | TODO |
| 3D matrix transformation (transform.py) | - Pandas DataFrame → NumPy 3D matrix<br>- Shape: (9 proyectos, 50 materiales, 24 meses)<br>- Fast aggregations (<1s for 10K rows)<br>- Handles missing data (NaNs) | Pytest + NumPy | TODO |
| Warehouse loading (load.py) | - Batch INSERT 1,000 rows<br>- ON CONFLICT UPDATE (upsert)<br>- Rollback on error<br>- No duplicates after load | Pytest + PostgreSQL test DB | TODO |
| Pre-load validation (validate.py) | - Rejects NULLs in critical fields<br>- Rejects future dates<br>- Rejects row count outside ±20% expected<br>- Stops ETL if >10% errors | Pytest | TODO |
| Post-load validation (validate.py) | - Row count matches source<br>- No duplicate sicom_ids<br>- Sum(monto_total) within 0.01% tolerance<br>- Rollback load if validation fails | Pytest + PostgreSQL test DB | TODO |

---

## Integration Tests

| Component | Test Cases | Tool | Status |
|-----------|-----------|------|--------|
| Full ETL pipeline (sicom_etl.py) | - Extract → Transform → Load → Validate (1,000 rows)<br>- Logs to etl_runs table<br>- Emails admin on error<br>- Completes in <10min | Pytest + SICOM mock + PostgreSQL test instance | TODO |
| Incremental load | - Run ETL with last_sync_date = yesterday<br>- Extract only new records<br>- Load completes faster than full load | Pytest | TODO |
| Full load | - Run ETL with sync_mode=full<br>- Extract all historical data<br>- Load takes longer but completes successfully | Pytest | TODO |
| Error handling (timeout) | - Simulate SICOM timeout (>30s)<br>- Retry 3× with backoff<br>- ETL status = FAILED<br>- Email sent to admin | Pytest + timeout mock | TODO |
| Error handling (invalid data) | - Simulate NULL in critical field<br>- Pre-load validation rejects row<br>- ETL status = PARTIAL<br>- Error logged | Pytest | TODO |
| Error handling (disk full) | - Simulate PostgreSQL disk full<br>- ETL aborted<br>- Email admin urgently | Pytest + disk mock | TODO |
| Read-only enforcement (CRITICAL) | - Attempt INSERT query → Connection rejects<br>- Attempt UPDATE query → Connection rejects<br>- Attempt DELETE query → Connection rejects<br>- Alert admin "Write query attempted" | Pytest + SQL interceptor | TODO |

---

## E2E Tests (Playwright)

**Setup:** `bun test:e2e` | **Environment:** Staging with SICOM mock DB

**Happy Paths:**

1. **US6.1 - Admin Triggers Manual Sync:**
   - Login as Admin
   - Navigate to /admin/etl
   - Click "Sync Now" button
   - Assert: Progress bar appears
   - Assert: ETL completes in <10min
   - Assert: etl_runs table shows status = SUCCESS
   - Assert: rows_extracted = rows_loaded

2. **US6.2 - Weekly Cron Executes ETL:**
   - Simulate Sunday 2 AM cron trigger
   - ETL runs automatically
   - Assert: Logs to /var/log/sicom_etl.log
   - Assert: Email sent to admin with summary (rows extracted/loaded, duration)

3. **US6.3 - IA Agent Queries Historical Data:**
   - User asks: "Precio promedio concreto últimos 6 meses"
   - IA agent queries sicom_precios_hist table
   - Assert: Response <5s (vs minutes in SICOM)
   - Assert: Data matches SICOM source

4. **US6.4 - Price Anomaly Detection Uses Historical Prices:**
   - F007 (Análisis Precios) queries sicom_precios_hist
   - Compares current price vs historical baseline
   - Assert: Anomaly detected if deviation >15%
   - Assert: Historical data available for all materials

**Error Path Tests:**
- SICOM connection timeout → Retry 3× → Email admin → ETL = FAILED
- Invalid data (NULL in compra_id) → Pre-load validation rejects → ETL = PARTIAL → Error logged
- PostgreSQL disk full → ETL aborted → Email admin urgently
- Sum mismatch after load → Rollback load → ETL = FAILED → Admin alerted

**Read-Only Enforcement Test (CRITICAL):**
- Inject INSERT query into extract.py (malicious code simulation)
- Assert: Connection rejects query
- Assert: ETL aborted immediately
- Assert: Admin alerted "Write query attempted: [query text]"
- Assert: SICOM data unchanged (verify with manual SICOM query)

---

## Quality Gates CI

| Gate | Command | Target | Status |
|------|---------|--------|--------|
| Format | `bun run format --check` | 100% | TODO |
| Lint | `bun run lint` (Python: `ruff check`) | 0 errors | TODO |
| Types | `bun run typecheck` (Python: `mypy api/`) | 0 errors | TODO |
| Unit | `pytest --cov=api/services/etl --cov-report=term` | 80%+ on ETL modules | TODO |
| Build | `bun run build` | Exit 0 | TODO |
| E2E | `bun test:e2e` (ETL scenarios) | All 4 user stories pass | TODO |

---

## Manual Testing Checklist

- [ ] SICOM read-only credentials validated (database grants audit = SELECT only, NO write permissions)
- [ ] Full ETL tested with real SICOM connection (1,000 rows)
- [ ] Incremental load tested (extract only new records since yesterday)
- [ ] Weekly cron runs automatically (Sundays 2 AM)
- [ ] Monthly full load runs (1st Sunday 2 AM)
- [ ] Error handling tested (timeout, connection fail, invalid data, disk full)
- [ ] Retry logic works (3× with exponential backoff)
- [ ] Pre-load validation rejects invalid data (NULLs, future dates, row count outliers)
- [ ] Post-load validation passes (row count match, no duplicates, sum within 0.01%)
- [ ] Admin dashboard shows ETL status (run history, errors, data freshness)
- [ ] Manual sync button works (admin panel)
- [ ] Email notifications sent on error (admin receives error log)
- [ ] Data freshness <168h (1 week) enforced
- [ ] IA agent (F001) queries warehouse successfully (<5s response)
- [ ] Price anomaly detection (F007) uses historical prices
- [ ] Performance: Incremental <10min, error rate <0.1%
- [ ] UAT with Jefe Compras (validate historical data accuracy vs SICOM source)
- [ ] Read-only enforcement validated (attempt write query → rejected)
- [ ] SICOM DBA confirms no write activity from ETL user (audit log review)

---

**Token-efficient format:** 60 lines | 4 E2E scenarios | 80%+ coverage target | CRITICAL: Read-only enforcement
