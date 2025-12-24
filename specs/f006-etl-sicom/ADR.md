# ADR-006: Use Python ETL Over Airbyte/Fivetran for SICOM Integration

Version: 1.0 | Date: 2025-12-24 07:10 | Owner: Javier Polo | Status: Accepted

---

## Context

ETL SICOM (F006) requires extracting historical data from 1970s-80s legacy system (SICOM), transforming to 3D matrices for analysis, and loading to PostgreSQL warehouse. Need solution that is read-only safe, supports complex transformations (NumPy 3D matrices), and is maintainable by 2-person team.

Budget: No ETL SaaS budget (Fivetran $1.50/credit expensive). Expected usage: Weekly sync of 10K rows incremental, 100K rows full load quarterly.

Decision needed NOW because ETL is critical dependency for F001 (IA agent historical queries) and F007 (price anomaly detection).

---

## Decision

**Will:** Build custom Python ETL script
**Will NOT:** Use Airbyte, Fivetran, or other commercial ETL SaaS

---

## Rationale

Python ETL offers best balance of control, cost, and transformation flexibility:
- Free + full control (vs Fivetran $1.50/credit, Airbyte $20/month hosted)
- Custom 3D matrix transformations (PO requirement: "matrices tridimensionales Python")
- Read-only safety enforced at code level (can validate every query, block writes)
- Pandas + NumPy = native Python ecosystem (no new tools to learn)
- 2-person team can maintain ~200 lines ETL script (vs learning Airbyte connectors)
- SICOM is too legacy (1970s-80s) for standard connectors (would need custom connector anyway)

For 2-person team, Python ETL = minimal complexity, full transparency, no vendor lock-in, perfect fit for PO requirement.

---

## ClaudeCode&OnlyMe Validation

| Question | Answer | Score |
|----------|--------|-------|
| ¿Resuelve problema REAL HOY? | YES - Need historical data now for IA agent + price anomaly detection | 1/1 |
| ¿Solución más SIMPLE? | YES - 200 lines Python vs learning Airbyte/Fivetran complex UI + custom connectors | 1/1 |
| ¿2 personas lo mantienen? | YES - Javier + Claude Code, Python script = transparent code, no black box | 1/1 |
| ¿Vale si NUNCA crecemos? | YES - Works for 10-100K rows weekly without changes, no scaling issues | 1/1 |
| **TOTAL** | **4/4 = ACCEPT** | **4/4** |

**Veto Threshold:** ANY NO = REJECT ✓ PASSED

---

## Alternatives Considered

### 1. Airbyte (Open-Source ETL Platform)
**Why rejected:**
- Requires custom connector for SICOM (no pre-built connector for 1970s-80s legacy DB)
- Overkill for 1 source → 1 destination (vs Airbyte = enterprise multi-source platform)
- 3D matrix transformation not supported (Airbyte = simple row-by-row mapping)
- Learning curve 1-2 weeks (vs 1 day for Python script)
- Self-hosted = Docker maintenance burden, hosted = $20/month
- Violates ClaudeCode&OnlyMe: Too complex for 2-person team

### 2. Fivetran (Commercial ETL SaaS)
**Why rejected:**
- Cost prohibitive: $1.50/credit, ~$100-200/month for weekly syncs
- No SICOM connector (would require custom connector development)
- Violates ClaudeCode&OnlyMe: SaaS for teams 10+, not 2-person team
- No support for 3D matrix transformations (PO requirement)
- Vendor lock-in (data pipeline controlled by external service)

### 3. dbt (Data Build Tool)
**Why rejected:**
- dbt is for TRANSFORM only (assumes data already in warehouse)
- Still need EXTRACT + LOAD (Python script or Airbyte)
- Adds extra layer of complexity (SQL models + Python ETL)
- Overkill for simple weekly batch ETL (vs dbt = incremental materialized views)

---

## Consequences

**Positive:**
- Zero cost (Python + Pandas + NumPy = free, open-source)
- Full control over read-only enforcement (validate every SQL query in code)
- Custom transformations (3D matrices = PO requirement satisfied)
- Transparent code (200 lines Python = easy to review, debug, modify)
- No vendor lock-in (can migrate to Airbyte later if needed)
- Fast iteration (change code + redeploy vs configure UI + test)

**Negative:**
- Manual code maintenance (vs Airbyte auto-updates connectors)
- Custom error handling (vs Airbyte built-in retry/logging)
- No visual UI for monitoring (vs Airbyte dashboard) - mitigated by admin dashboard in F006

**Risks:**
- **ETL script bugs:** Mitigated by unit tests (80%+ coverage), code review, dry-run mode before production
- **Performance degradation (>1 hour runtime):** Mitigated by batch processing (1,000 rows/batch), incremental load (not full), parallel processing for large tables
- **SICOM schema changes:** Mitigated by pre-load validation (detect column mismatches), alert admin, fail gracefully

---

## Implementation Example

**Python ETL Script (api/services/etl/sicom_etl.py):**
```python
import pandas as pd
import numpy as np
import pyodbc
from drizzle import db

# CRITICAL: Read-only connection
conn = pyodbc.connect(
    'DRIVER={SQL Server};SERVER=sicom_host;DATABASE=sicom_db;UID=readonly_user;PWD=***',
    readonly=True  # Enforce read-only at driver level
)

# Extract (SELECT only, NO writes)
query = """
SELECT compra_id, proyecto_id, material_id, monto, fecha
FROM sicom.compras
WHERE fecha >= ? AND estado = 'CERRADO'
ORDER BY fecha DESC
LIMIT 10000
"""
df = pd.read_sql(query, conn, params=[last_sync_date])

# Transform to 3D matrix (PO requirement)
# Shape: (9 proyectos, 50 materiales, 24 meses)
gasto_matrix = np.zeros((9, 50, 24))
for _, row in df.iterrows():
    p_idx = proyecto_to_idx[row.proyecto_id]
    m_idx = material_to_idx[row.material_id]
    t_idx = month_to_idx[row.fecha]
    gasto_matrix[p_idx, m_idx, t_idx] += row.monto

# Load to warehouse (Drizzle ORM)
db.sicom_compras_hist.insert_many(
    df.to_dict('records'),
    on_conflict='update'  # Upsert strategy
)

# Validate
assert df.shape[0] == db.sicom_compras_hist.count(where={'synced_at': today})
```

**Benefits:**
- Read-only enforced at connection level
- Pandas → NumPy = 3D matrix in 10 lines
- Drizzle ORM = type-safe upsert
- Clear, auditable code (vs Airbyte black box)

---

## Related

- SPEC: /specs/f006-etl-sicom/SPEC.md (Critical read-only constraint)
- PLAN: /specs/f006-etl-sicom/PLAN.md (S004-S010: ETL pipeline steps)
- PO Requirement: contecsa/CLAUDE.md:34-35 ("matrices tridimensionales Python")
- CRITICAL: contecsa/CLAUDE.md:71 ("SICOM read-only ALWAYS")

---

**Decision Maker:** Javier Polo + Claude Code | **Review Date:** 2025-06-24 (6 months)
