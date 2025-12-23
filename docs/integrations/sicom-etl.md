# SICOM ETL Integration Guide

Version: 1.0 | Date: 2025-12-22 23:45 | Type: Integration | Status: Active

---

## Overview

Integración ETL (Extract, Transform, Load) con sistema legacy SICOM (años 70-80) para extraer datos de compras, transformar a formato estructurado y cargar en PostgreSQL warehouse para análisis con IA conversacional y dashboards.

**CRÍTICO:** SICOM es READ-ONLY. NUNCA modificar datos en SICOM. Solo lectura y extracción.

---

## SICOM System Context

### Technical Specs

| Attribute | Value |
|-----------|-------|
| System | SICOM v2 (sin upgrade path) |
| Era | Años 1970-1980 (mainframe-style) |
| Interface | Pantalla negra (terminal-style) |
| Database | Propietario (no SQL estándar) |
| Access Mode | **READ-ONLY** (critical constraint) |
| Data Structure | Matrices tridimensionales (no tabular) |
| Query Language | Propietario (similar COBOL/RPG) |

### Business Description (from PO)

> "Es una bodega de datos pero no se puede hacer consultas ágiles, todo es reactivo"
> — Meeting 2025-12-22

**Translation:** Data warehouse with slow, inflexible query system → Need to extract to modern database for agile queries.

---

## Architecture

```
SICOM Legacy System (Read-Only)
  ↓
Python ETL Service (FastAPI)
  ├─→ Connect to SICOM (proprietary connector)
  ├─→ Extract raw data (3D matrices, unstructured)
  ├─→ Transform to structured format (pandas DataFrames)
  └─→ Load to PostgreSQL (purchases, suppliers, materials, etc.)
  ↓
PostgreSQL Warehouse (Vercel Postgres)
  ├─→ Normalized tables (purchase tracking data)
  ├─→ AI agent queries (R1)
  ├─→ Dashboard queries (R2)
  └─→ Reports generation

Sync Schedule: Weekly (Sunday 2 AM COT) + Manual trigger option
```

---

## Connection Setup

### Method 1: ODBC Connector (if available)

```python
# /api/services/sicom_etl.py
import pyodbc

class SICOMConnector:
    def __init__(self):
        self.connection_string = (
            f"DRIVER={{SICOM ODBC Driver}};"
            f"SERVER={os.getenv('SICOM_HOST')};"
            f"DATABASE={os.getenv('SICOM_DATABASE')};"
            f"UID={os.getenv('SICOM_USER')};"
            f"PWD={os.getenv('SICOM_PASSWORD')};"
            f"ReadOnly=1;"  # CRITICAL: Force read-only mode
        )

    def connect(self):
        try:
            conn = pyodbc.connect(self.connection_string, timeout=30)
            conn.readonly = True  # Extra safety
            return conn
        except Exception as e:
            logger.error(f"SICOM connection failed: {e}")
            raise
```

### Method 2: Screen Scraping (if no API/ODBC)

```python
# Alternative if no database access (worst case)
from selenium import webdriver

class SICOMScreenScraper:
    """
    Last resort: Automate terminal interface
    NOT RECOMMENDED - fragile, slow
    """
    def __init__(self):
        self.driver = webdriver.Chrome()

    def extract_purchase_data(self):
        # Navigate terminal screens
        # Parse text output
        # Convert to structured data
        pass  # Implementation depends on SICOM terminal structure
```

### Method 3: File Export (recommended if available)

```python
# If SICOM can export to CSV/TXT files
class SICOMFileImporter:
    """
    SICOM exports data to shared folder
    ETL reads files and processes
    """
    def read_export_file(self, file_path: str):
        import pandas as pd

        # Read SICOM export (fixed-width or delimited)
        df = pd.read_csv(file_path, encoding='latin-1', sep='|')

        return df
```

---

## Data Extraction

### 3D Matrix Structure (Unstructured)

**SICOM stores data as 3D matrices (PO description):**
- Dimension 1: Projects (9 consorcios)
- Dimension 2: Materials (cement, concrete, steel, etc.)
- Dimension 3: Time (monthly aggregates)

**Example structure (conceptual):**
```
SICOM_DATA[project][material][month] = {
    quantity: 1500,
    unit_cost: 25000,
    total_cost: 37500000,
    supplier_code: "PROV-001"
}
```

**Transformation needed:**
3D matrix → Tabular format (rows × columns) for PostgreSQL

```python
def transform_3d_to_tabular(sicom_data: dict) -> pd.DataFrame:
    """
    Convert SICOM 3D matrix to pandas DataFrame (tabular)
    """
    rows = []

    for project_id, materials in sicom_data.items():
        for material_id, months in materials.items():
            for month, data in months.items():
                rows.append({
                    'project_id': project_id,
                    'material_id': material_id,
                    'month': month,
                    'quantity': data['quantity'],
                    'unit_cost': data['unit_cost'],
                    'total_cost': data['total_cost'],
                    'supplier_code': data['supplier_code']
                })

    df = pd.DataFrame(rows)
    return df
```

---

## ETL Pipeline Implementation

```python
# /api/services/sicom_etl.py
import pandas as pd
import numpy as np
from datetime import datetime

class SICOMETLPipeline:
    def __init__(self):
        self.connector = SICOMConnector()  # or FileImporter()
        self.db = PostgresConnection()

    async def run_full_etl(self):
        """
        Full ETL: Extract → Transform → Load
        """
        try:
            # 1. EXTRACT
            logger.info("Starting SICOM extraction...")
            raw_data = await self.extract_sicom_data()
            logger.info(f"Extracted {len(raw_data)} records from SICOM")

            # 2. TRANSFORM
            logger.info("Transforming data...")
            transformed_data = self.transform_data(raw_data)
            logger.info(f"Transformed to {len(transformed_data)} structured records")

            # 3. LOAD
            logger.info("Loading to PostgreSQL...")
            await self.load_to_postgres(transformed_data)
            logger.info("ETL completed successfully")

            # 4. LOG SUCCESS
            await self.log_etl_run(status='SUCCESS', records=len(transformed_data))

        except Exception as e:
            logger.error(f"ETL failed: {e}")
            await self.log_etl_run(status='FAILED', error=str(e))
            raise

    async def extract_sicom_data(self) -> dict:
        """
        Extract raw data from SICOM (read-only)
        """
        conn = self.connector.connect()

        # Query SICOM (syntax depends on SICOM version)
        # Example: proprietary query language
        query = """
            QUERY PURCHASES WHERE DATE >= '2020-01-01'
            INCLUDE MATERIALS, SUPPLIERS, PROJECTS
            FORMAT MATRIX
        """

        result = conn.execute_query(query)  # Returns 3D matrix

        conn.close()
        return result

    def transform_data(self, raw_data: dict) -> pd.DataFrame:
        """
        Transform SICOM 3D matrix to structured DataFrame
        """
        # 1. Convert 3D matrix to tabular
        df = transform_3d_to_tabular(raw_data)

        # 2. Data cleaning
        df = self.clean_data(df)

        # 3. Enrichment (map codes to names)
        df = self.enrich_data(df)

        # 4. Validation
        df = self.validate_data(df)

        return df

    def clean_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Data cleaning: nulls, types, duplicates
        """
        # Remove nulls in critical fields
        df = df.dropna(subset=['project_id', 'material_id', 'quantity'])

        # Convert types
        df['quantity'] = pd.to_numeric(df['quantity'], errors='coerce')
        df['unit_cost'] = pd.to_numeric(df['unit_cost'], errors='coerce')

        # Remove duplicates
        df = df.drop_duplicates(subset=['project_id', 'material_id', 'month'])

        return df

    def enrich_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Map SICOM codes to readable names
        """
        # Map project codes to consorcio names
        project_map = {
            'PROJ-001': 'PAVICONSTRUJC',
            'PROJ-002': 'EDUBAR-KRA50',
            'PROJ-003': 'PTAR',
            # ... etc.
        }

        df['project_name'] = df['project_id'].map(project_map)

        # Map material codes to names
        material_map = self.load_material_mapping()
        df['material_name'] = df['material_id'].map(material_map)

        return df

    def validate_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Validate data quality
        """
        # Check for negative quantities (data error)
        invalid_qty = df[df['quantity'] < 0]
        if len(invalid_qty) > 0:
            logger.warning(f"Found {len(invalid_qty)} records with negative quantity")
            df = df[df['quantity'] >= 0]  # Filter out

        # Check for extreme unit costs (outliers)
        mean_cost = df['unit_cost'].mean()
        std_cost = df['unit_cost'].std()
        df['is_outlier'] = np.abs((df['unit_cost'] - mean_cost) / std_cost) > 3

        return df

    async def load_to_postgres(self, df: pd.DataFrame):
        """
        Bulk insert into PostgreSQL
        """
        # Convert DataFrame to records
        records = df.to_dict('records')

        # Upsert into PostgreSQL (insert or update if exists)
        await self.db.execute_many("""
            INSERT INTO sicom_purchases (
                project_id, project_name, material_id, material_name,
                month, quantity, unit_cost, total_cost, supplier_code
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (project_id, material_id, month)
            DO UPDATE SET
                quantity = EXCLUDED.quantity,
                unit_cost = EXCLUDED.unit_cost,
                total_cost = EXCLUDED.total_cost,
                updated_at = CURRENT_TIMESTAMP
        """, records)

    async def log_etl_run(self, status: str, records: int = 0, error: str = None):
        """
        Log ETL execution for monitoring
        """
        await self.db.execute("""
            INSERT INTO etl_log (
                source, status, records_processed, error_message, executed_at
            ) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
        """, ('SICOM', status, records, error))
```

---

## Scheduling (Vercel Cron)

```typescript
// /src/app/api/cron/sicom-etl/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  // Call Python backend ETL service
  const res = await fetch('http://localhost:8000/etl/sicom/run', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${process.env.ETL_API_KEY}` }
  });

  const result = await res.json();

  return NextResponse.json({
    status: result.status,
    records: result.records_processed,
    duration_seconds: result.duration
  });
}
```

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/sicom-etl",
      "schedule": "0 7 * * 0"  // Sunday 2 AM COT (7 AM UTC)
    }
  ]
}
```

---

## Monitoring & Alerts

### ETL Log Table

```sql
CREATE TABLE etl_log (
  id UUID PRIMARY KEY,
  source VARCHAR(50) NOT NULL,  -- 'SICOM'
  status VARCHAR(50) NOT NULL,  -- SUCCESS, FAILED, PARTIAL
  records_processed INT DEFAULT 0,
  records_failed INT DEFAULT 0,
  duration_seconds INT,
  error_message TEXT,
  executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Alert on Failure

```python
async def log_etl_run(self, status: str, records: int = 0, error: str = None):
    # ... (insert log)

    # Alert admin if failed
    if status == 'FAILED':
        await send_email(
            to='admin@contecsa.com',
            subject='ALERTA: ETL SICOM Falló',
            html=f"""
                <h2>ETL SICOM Failure</h2>
                <p><strong>Error:</strong> {error}</p>
                <p><strong>Time:</strong> {datetime.now()}</p>
                <p><strong>Action:</strong> Check logs and retry manually.</p>
            """
        )
```

---

## Error Handling

| Error | Mitigation | Recovery |
|-------|------------|----------|
| SICOM down/unreachable | Retry 3x with 5-min delay | Alert admin, skip sync |
| Connection timeout | Increase timeout to 60s | Retry with larger batches |
| Invalid data (null keys) | Filter out invalid records | Log warning, process valid records only |
| Duplicate records | Use UPSERT (ON CONFLICT) | Update existing, no error |
| PostgreSQL constraint violation | Log error, skip record | Continue processing others |

---

## Security & Compliance

### Critical Rules

| Rule | Implementation |
|------|----------------|
| **READ-ONLY ACCESS** | SICOM credentials have read-only permissions (enforced by SICOM admin) |
| **NO WRITE OPERATIONS** | ETL code NEVER executes UPDATE/DELETE/INSERT on SICOM |
| **Audit Trail** | All ETL runs logged with timestamp, user, records processed |
| **Credentials Security** | SICOM credentials in env vars (not code), rotated quarterly |
| **Network Security** | ETL service → SICOM via private network (no public internet) |

---

## Performance Targets

| Metric | Target | Actual (to be measured) |
|--------|--------|-------------------------|
| ETL duration (weekly sync) | <30 min | TBD |
| Records processed/min | >1,000 | TBD |
| Data freshness | ≤7 days (weekly sync) | Weekly |
| Failure rate | <5% (1 failure per 20 runs) | TBD |

---

## Manual Trigger (Emergency)

```bash
# Admin can trigger ETL manually via API
curl -X POST https://app.contecsa.com/api/etl/sicom/run \
  -H "Authorization: Bearer $ADMIN_API_KEY"
```

---

## References

- PRD Feature F06 (ETL SICOM): docs/PRD.md
- R6 Feature Doc: docs/features/r06-etl-sicom.md
- Meeting PO: docs/meets/contecsa_meet_2025-12-22.txt (SICOM context)
- Architecture: docs/architecture-overview.md (Data flow section)
