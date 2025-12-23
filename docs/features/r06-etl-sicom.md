# R6 - ETL SICOM (Read-Only)

Version: 1.0 | Date: 2025-12-22 22:05 | Priority: P0 | Status: Planned

---

## Overview

Proceso ETL (Extract, Transform, Load) que extrae datos históricos del sistema legacy SICOM (años 70-80) de forma READ-ONLY, transforma a datos no estructurados (matrices 3D Python) para análisis ágil y carga en PostgreSQL warehouse.

**CRITICAL:** Read-only access ONLY. NEVER modify SICOM data. Sistema nuevo es source of truth independiente.

---

## Business Context

**SICOM System:**
- Sistema legacy años 70-80, versión 2 sin ruta de upgrade
- Interfaz pantalla negra (terminal)
- "Bodega de datos sin consultas ágiles" (quote PO)
- Contiene datos históricos valiosos pero inaccesibles
- NO se puede modernizar (costo prohibitivo, riesgo alto)

**Problem:**
- Datos históricos atrapados en SICOM
- Sin capacidad de análisis ágil
- Reportes requieren exportación manual
- No se puede integrar en tiempo real con sistemas modernos

**Solution:**
ETL read-only que extrae datos periódicamente, transforma a formato analítico (Python 3D matrices) y almacena en PostgreSQL para análisis rápido con IA.

**Impact:**
- Acceso a datos históricos sin depender de SICOM
- Análisis ágil con Python/IA (vs consultas lentas SICOM)
- Base para comparaciones históricas (detectar anomalías de precios)
- Path para retiro progresivo de SICOM

---

## User Stories

| ID | Actor | Story | Acceptance Criteria |
|----|-------|-------|---------------------|
| US6.1 | Jefe Compras | Comparar precios actuales vs histórico SICOM | - ETL importa precios históricos<br>- IA agent puede consultar histórico<br>- Respuesta <5s |
| US6.2 | Gerencia | Analizar tendencias de gasto últimos 5 años | - ETL importa transacciones históricas<br>- Dashboard muestra tendencias<br>- Datos SICOM + nuevos unificados |
| US6.3 | Técnico | Consultar consumo histórico de material X por proyecto Y | - ETL importa consumos por proyecto<br>- Query rápida (<2s)<br>- Sin acceder a SICOM directamente |
| US6.4 | Admin Sistema | Ejecutar ETL manual cuando se necesite | - Botón "Sync SICOM" en admin panel<br>- Progress bar visible<br>- Log de errores si falla |

---

## Technical Approach

### ETL Architecture

```
SICOM (Legacy DB)
  ↓ (Read-only connection)
Python ETL Script
  ├─→ Extract (SQL queries to SICOM)
  ├─→ Transform (3D matrices, data cleaning)
  └─→ Load (PostgreSQL warehouse)
  ↓
PostgreSQL Warehouse
  ├─→ Table: sicom_compras_hist
  ├─→ Table: sicom_precios_hist
  ├─→ Table: sicom_proveedores_hist
  └─→ Table: sicom_proyectos_hist
```

### Tech Stack

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| ETL Engine | Python 3.11+ | Native support for 3D matrices (NumPy), data analysis (Pandas) |
| Database Driver | pyodbc or cx_Oracle | Connect to SICOM (likely Oracle/DB2 legacy) |
| Data Transform | Pandas + NumPy | Powerful data manipulation, matrix operations |
| Scheduler | cron (Linux) or Task Scheduler (Windows) | Periodic ETL execution (daily/weekly) |
| Logging | Python logging | Track ETL runs, errors, row counts |
| Storage | PostgreSQL | Warehouse for transformed data |

---

## SICOM Connection (Read-Only)

### Connection Strategy

**Option 1: Direct DB Connection (Preferred)**
- Read-only user credentials from SICOM DBA
- Connection string: `DRIVER={driver};SERVER=sicom_host;DATABASE=sicom_db;UID=readonly_user;PWD=***`
- Timeout: 30s per query
- Retry logic: 3 attempts with exponential backoff

**Option 2: CSV Export (Fallback)**
- If direct connection not feasible
- SICOM admin exports CSV monthly
- ETL script reads CSV files from shared folder
- Less real-time, but safer for legacy system

**CRITICAL RULES:**
1. **Read-only user** - No INSERT, UPDATE, DELETE permissions
2. **Non-blocking queries** - Use `WITH (NOLOCK)` or equivalent to avoid blocking SICOM users
3. **Off-hours execution** - Run ETL at night (2 AM) to avoid peak usage
4. **Error handling** - Never crash SICOM. Fail gracefully.
5. **Audit trail** - Log every query executed against SICOM

---

## Data Extraction

### Tables to Extract

| SICOM Table | Purpose | Frequency | Estimated Rows |
|-------------|---------|-----------|----------------|
| `compras` | Historical purchases | Weekly | ~10,000 |
| `proveedores` | Supplier master data | Monthly | ~500 |
| `materiales` | Material catalog | Monthly | ~2,000 |
| `precios_hist` | Price history by material/supplier | Weekly | ~50,000 |
| `proyectos` | Project/consorcio data | Monthly | ~50 |
| `facturas` | Historical invoices | Weekly | ~15,000 |

### Extraction Queries

**Example: Extract Purchases**
```sql
-- Read-only query to SICOM
SELECT
  compra_id,
  proyecto_id,
  proveedor_id,
  material_id,
  cantidad,
  precio_unitario,
  monto_total,
  fecha_compra,
  estado
FROM sicom.compras
WHERE fecha_compra >= :last_sync_date  -- Incremental load
  AND estado IN ('CERRADO', 'PAGADO')  -- Only completed purchases
ORDER BY fecha_compra DESC
LIMIT 10000;
```

**Incremental vs Full Load:**
- **Incremental (default):** Extract only new/modified records since last sync
- **Full (quarterly):** Extract all historical data (backup/reconciliation)

---

## Data Transformation (3D Matrices)

### Why 3D Matrices?

**PO Requirement:** "Python para análisis de datos, transformación a datos no estructurados, matrices tridimensionales - más rápido que SQL para IA"

**Use Case:** Multi-dimensional analysis
- **Dimension 1:** Proyectos (9 consorcios)
- **Dimension 2:** Materiales (categorías)
- **Dimension 3:** Tiempo (meses/años)

**Example 3D Matrix: Gasto por Proyecto-Material-Tiempo**
```python
import numpy as np

# Shape: (9 proyectos, 50 categorías, 24 meses)
gasto_matrix = np.zeros((9, 50, 24))

# Populate matrix from extracted data
for row in sicom_data:
    p_idx = proyecto_to_idx[row.proyecto_id]
    m_idx = material_to_idx[row.material_id]
    t_idx = month_to_idx[row.fecha_compra]
    gasto_matrix[p_idx, m_idx, t_idx] += row.monto_total

# Fast queries with NumPy
total_pavic_concreto = gasto_matrix[0, 5, :].sum()  # Project 0, Material 5, all months
promedio_mensual = gasto_matrix[:, :, :].mean(axis=2)  # Average per month
```

**Benefits:**
- 100x faster than SQL for multi-dimensional aggregations
- Native support for statistical operations (mean, std, percentiles)
- Compatible with machine learning libraries (scikit-learn, TensorFlow)
- Efficient storage (NumPy binary format)

---

## Data Loading (PostgreSQL Warehouse)

### Warehouse Schema

**Table: `sicom_compras_hist`**
```sql
CREATE TABLE sicom_compras_hist (
  sicom_id VARCHAR(50) PRIMARY KEY,
  proyecto_id UUID,
  proveedor_id UUID,
  material_id UUID,
  cantidad DECIMAL(12,2),
  precio_unitario DECIMAL(12,2),
  monto_total DECIMAL(14,2),
  fecha_compra DATE,
  estado VARCHAR(20),
  synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_fecha (fecha_compra),
  INDEX idx_proyecto (proyecto_id),
  INDEX idx_proveedor (proveedor_id)
);
```

**Table: `sicom_precios_hist`** (for R7 - price anomaly detection)
```sql
CREATE TABLE sicom_precios_hist (
  id UUID PRIMARY KEY,
  material_id UUID,
  proveedor_id UUID,
  precio_unitario DECIMAL(12,2),
  fecha DATE,
  cantidad DECIMAL(12,2),
  unidad VARCHAR(10),
  synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_material_fecha (material_id, fecha),
  INDEX idx_proveedor_material (proveedor_id, material_id)
);
```

**Load Strategy:**
- **Upsert:** `INSERT ... ON CONFLICT UPDATE` (avoid duplicates)
- **Batch size:** 1,000 rows per transaction (balance speed vs memory)
- **Validation:** Check row counts match before/after load
- **Rollback:** If load fails, rollback entire batch (atomic)

---

## ETL Scheduling

### Execution Schedule

| Frequency | Tables | Time | Rationale |
|-----------|--------|------|-----------|
| **Daily** | None | - | SICOM changes slowly, daily not needed |
| **Weekly** | compras, facturas, precios_hist | Sunday 2 AM | Capture week's activity |
| **Monthly** | proveedores, materiales, proyectos | 1st Sunday 2 AM | Master data changes infrequently |
| **On-demand** | All | Manual trigger | Admin button for immediate sync |

### Scheduler Configuration (cron)

```bash
# Weekly ETL (Sundays at 2 AM)
0 2 * * 0 /usr/bin/python3 /opt/contecsa/etl/sicom_etl.py --incremental >> /var/log/sicom_etl.log 2>&1

# Monthly full load (1st Sunday at 2 AM)
0 2 1-7 * 0 /usr/bin/python3 /opt/contecsa/etl/sicom_etl.py --full >> /var/log/sicom_etl_full.log 2>&1
```

---

## Error Handling

### Failure Scenarios

| Error | Mitigation | Notification |
|-------|------------|--------------|
| SICOM connection timeout | Retry 3x with backoff | Email admin if all retries fail |
| Query slow (>30s) | Abort query, log warning | Email admin with slow query |
| Data validation fail | Skip invalid rows, log errors | Email admin with error report |
| PostgreSQL write fail | Rollback transaction, retry | Email admin, system alert |
| Disk space low | Abort ETL, clean old logs | Email admin urgently |

### Validation Checks

**Pre-load:**
- Source row count vs expected range (±20%)
- No NULL values in critical fields (compra_id, monto, fecha)
- Date range sanity check (no future dates, no dates <1990)

**Post-load:**
- Target row count matches source
- No duplicate sicom_ids
- Sum(monto_total) matches within 0.01% (rounding tolerance)

---

## Monitoring & Logging

### ETL Run Log

**Table: `etl_runs`**
```sql
CREATE TABLE etl_runs (
  run_id UUID PRIMARY KEY,
  started_at TIMESTAMP,
  finished_at TIMESTAMP,
  status VARCHAR(20),  -- SUCCESS, FAILED, PARTIAL
  rows_extracted INT,
  rows_loaded INT,
  errors_count INT,
  duration_seconds INT,
  log_file VARCHAR(255)
);
```

### Metrics to Track

- **Duration:** Average runtime per table
- **Row counts:** Extracted vs Loaded (should match)
- **Error rate:** Errors per 1,000 rows (<0.1% acceptable)
- **Success rate:** % of successful runs (target: >95%)
- **Data freshness:** Hours since last successful sync (<168h for weekly)

---

## Performance Optimization

| Strategy | Implementation | Benefit |
|----------|----------------|---------|
| Incremental load | Only fetch new records since last sync | 90% faster than full load |
| Batch inserts | 1,000 rows per INSERT | 10x faster than row-by-row |
| Indexes | On fecha, proyecto_id, material_id | Fast queries on warehouse |
| Compression | gzip logs, NumPy compressed format | Save disk space 60% |
| Parallel processing | Multi-threading for large tables | 3x faster for big tables |

---

## Security Considerations

| Risk | Mitigation |
|------|------------|
| SICOM credentials leak | Store in environment variables (not code), rotate quarterly |
| Warehouse data exposure | Role-based access control, only IA agent has read access |
| ETL script tampering | Code review, version control (git), signed commits |
| Data exfiltration | Audit log of all warehouse queries, no direct user access |

---

## Testing Strategy

### Unit Tests
- Connection to SICOM (mock DB)
- SQL query generation correctness
- Data transformation logic (3D matrices)
- Validation checks (NULLs, duplicates, etc.)

### Integration Tests
- Full ETL flow (extract → transform → load)
- Error handling (timeout, connection fail, etc.)
- Incremental vs full load correctness
- Rollback on failure

### Performance Tests
- ETL runtime with 10K, 50K, 100K rows
- Concurrent ETL + warehouse queries
- Disk I/O impact during ETL

---

## Success Criteria

**MVP Acceptance:**
- [ ] ETL connects to SICOM read-only successfully
- [ ] Extracts 3 tables (compras, precios, proveedores)
- [ ] Transforms to 3D matrices (Python NumPy)
- [ ] Loads to PostgreSQL warehouse
- [ ] No errors on sample 1,000 rows
- [ ] Completes in <10 minutes for incremental load

**Production Ready:**
- [ ] Weekly schedule runs automatically
- [ ] Error rate <0.1% (validated with real data)
- [ ] AI agent queries warehouse successfully (R1 integration)
- [ ] Price anomaly detection works (R7 integration)
- [ ] Admin dashboard shows ETL status
- [ ] Documentation complete (connection, troubleshooting)

---

## Future Enhancements (Post-MVP)

1. **Real-time CDC** - Change Data Capture for near real-time sync
2. **Data quality dashboard** - Visual monitoring of data quality metrics
3. **Historical snapshots** - Keep monthly snapshots for time-travel queries
4. **SICOM retirement plan** - Gradual migration of SICOM users to new system
5. **Data lineage** - Track data flow from SICOM to warehouse to dashboards

---

## References

- PRD Feature F04 (ETL Datos Históricos)
- Meeting PO: docs/meets/contecsa_meet_2025-12-22.txt ("matrices tridimensionales")
- SICOM details: PRD.md (System from 1970s-80s, no upgrade path)
- Python ETL best practices: https://realpython.com/python-etl/
