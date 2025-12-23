# API Documentation - Contecsa Sistema

Version: 1.0 | Date: 2025-12-23 01:15 | Type: API Reference | Status: Active

---

## Overview

RESTful API para Contecsa Sistema de Inteligencia de Datos. Backend Python/FastAPI con autenticación JWT, rate limiting y validación de schemas con Pydantic.

**Base URL (Development):** `http://localhost:8000`
**Base URL (Production):** `https://api.contecsa.com` (client-hosted)

**Authentication:** JWT Bearer tokens (NextAuth.js session)
**Content-Type:** `application/json`
**Rate Limiting:** 100 requests/minute per user

---

## Authentication

### Session-Based Authentication (NextAuth.js)

**Frontend obtains JWT from NextAuth.js, passes to backend API**

```typescript
// Frontend: Get session token
import { getServerSession } from 'next-auth';

const session = await getServerSession();
const token = session?.accessToken;

// Make API request
const response = await fetch('http://localhost:8000/api/purchases', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

**Backend: Verify JWT token**

```python
# /api/middleware/auth.py
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt

security = HTTPBearer()

async def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload  # Contains user_id, email, role
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

---

## Error Handling

### Standard Error Response

```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable error message in Spanish",
  "details": {
    "field": "specific_field_with_error",
    "reason": "validation_failed"
  },
  "timestamp": "2025-12-23T01:15:00Z"
}
```

### HTTP Status Codes

| Code | Meaning | Use Case |
|------|---------|----------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate resource (e.g., duplicate invoice) |
| 422 | Unprocessable Entity | Validation error (Pydantic) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error (logged) |

---

## Endpoints by Feature

### R1: Conversational AI Agent

#### POST /api/ai/query

**Description:** Send natural language query to AI agent, receive answer with optional chart

**Authentication:** Required (any authenticated user)

**Request:**

```json
{
  "query": "necesito gráfica combustible último trimestre",
  "context": {
    "project_id": "PAVICONSTRUJC",  // optional filter
    "date_range": {
      "start": "2024-10-01",
      "end": "2024-12-31"
    }
  }
}
```

**Response:**

```json
{
  "answer": "Se consumieron 12,500 galones de combustible en PAVICONSTRUJC...",
  "chart": {
    "type": "bar",
    "data": {
      "labels": ["Octubre", "Noviembre", "Diciembre"],
      "values": [4200, 4100, 4200]
    },
    "image_url": "https://storage.googleapis.com/contecsa-files/charts/abc123.png"
  },
  "sources": [
    {
      "table": "fuel_consumption",
      "rows_analyzed": 45
    }
  ]
}
```

**Errors:**
- `400` - Query too vague, missing required context
- `500` - AI provider error (fallback to DeepSeek triggered)

---

### R2: Executive Dashboards

#### GET /api/dashboard/{role}

**Description:** Get role-specific KPIs and metrics

**Authentication:** Required (user must have specified role)

**Path Parameters:**
- `role` (string): `gerencia`, `compras`, `contabilidad`, `tecnico`, `almacen`

**Query Parameters:**
- `project_id` (optional): Filter by consorcio
- `date_range` (optional): `7d`, `30d`, `90d`, `ytd` (default: `30d`)

**Response (Gerencia):**

```json
{
  "role": "gerencia",
  "period": "30d",
  "kpis": {
    "total_spend": 1250000000,
    "open_purchases": 12,
    "avg_cycle_time": 18.5,
    "at_risk_purchases": 3,
    "budget_utilization": 67.2
  },
  "charts": [
    {
      "id": "spend_by_project",
      "type": "pie",
      "data": {
        "labels": ["PAVICONSTRUJC", "EDUBAR-KRA50", "PTAR"],
        "values": [520000000, 380000000, 350000000]
      }
    }
  ],
  "alerts": [
    {
      "severity": "high",
      "message": "3 compras con >30 días sin avance",
      "purchase_ids": ["PO-2025-001", "PO-2025-007", "PO-2025-012"]
    }
  ]
}
```

**Errors:**
- `403` - User role does not match requested dashboard

---

### R3: Purchase Tracking (7-Stage Workflow)

#### POST /api/purchases

**Description:** Create new purchase requisition (Stage 1)

**Authentication:** Required (role: Compras, Gerencia)

**Request:**

```json
{
  "project_id": "PAVICONSTRUJC",
  "material": "Cemento Argos 50kg",
  "quantity": 500,
  "unit": "bultos",
  "justification": "Fundición columnas edificio A",
  "requested_by": "user_id_123",
  "delivery_date": "2025-01-15"
}
```

**Response:**

```json
{
  "id": "PO-2025-015",
  "status": "REQUISICION",
  "stage": 1,
  "created_at": "2025-12-23T01:15:00Z",
  "next_action": "Aprobación Gerencia",
  "workflow": {
    "current_stage": 1,
    "total_stages": 7,
    "can_advance": false,
    "blocking_reason": "Pending approval"
  }
}
```

#### GET /api/purchases/{id}

**Description:** Get purchase details and workflow status

**Authentication:** Required

**Response:**

```json
{
  "id": "PO-2025-015",
  "project": {
    "id": "PAVICONSTRUJC",
    "name": "PAVICONSTRUJC"
  },
  "material": "Cemento Argos 50kg",
  "quantity": 500,
  "unit": "bultos",
  "workflow": {
    "current_stage": 3,
    "stage_name": "Compra",
    "days_in_stage": 5,
    "total_days_open": 12,
    "stages": [
      {
        "stage": 1,
        "name": "Requisición",
        "status": "completed",
        "completed_at": "2025-12-10T14:00:00Z"
      },
      {
        "stage": 2,
        "name": "Aprobación",
        "status": "completed",
        "completed_at": "2025-12-11T09:30:00Z"
      },
      {
        "stage": 3,
        "name": "Compra",
        "status": "in_progress",
        "started_at": "2025-12-11T10:00:00Z"
      }
    ]
  },
  "alerts": [
    {
      "type": "warning",
      "message": "Compra abierta >10 días. Delivery date: 2025-01-15"
    }
  ]
}
```

#### PUT /api/purchases/{id}/advance

**Description:** Advance purchase to next stage (blocking gates enforced)

**Authentication:** Required (role-specific permissions)

**Request:**

```json
{
  "stage": 4,
  "data": {
    "supplier_id": "PROV-001",
    "unit_price": 25000,
    "total_price": 12500000,
    "invoice_number": "FAC-12345"
  }
}
```

**Response:**

```json
{
  "id": "PO-2025-015",
  "status": "RECEPCION",
  "stage": 4,
  "updated_at": "2025-12-23T01:20:00Z",
  "next_action": "Recepción en almacén"
}
```

**Errors:**
- `400` - Cannot advance: blocking gate not satisfied
  ```json
  {
    "error": "BLOCKING_GATE",
    "message": "No se puede cerrar sin certificado de calidad",
    "details": {
      "stage": 7,
      "missing": ["quality_certificate"]
    }
  }
  ```

#### GET /api/purchases

**Description:** List purchases with filters

**Authentication:** Required

**Query Parameters:**
- `project_id` (optional): Filter by consorcio
- `status` (optional): `REQUISICION`, `APROBACION`, `COMPRA`, etc.
- `at_risk` (optional): `true` (>30 days open)
- `page` (default: 1)
- `limit` (default: 50, max: 200)

**Response:**

```json
{
  "total": 125,
  "page": 1,
  "limit": 50,
  "purchases": [
    {
      "id": "PO-2025-015",
      "project": "PAVICONSTRUJC",
      "material": "Cemento Argos 50kg",
      "stage": 3,
      "days_open": 12,
      "at_risk": false
    }
  ]
}
```

---

### R6: SICOM ETL

#### POST /api/etl/sicom/run

**Description:** Trigger manual SICOM ETL sync (normally runs weekly on cron)

**Authentication:** Required (role: Admin only)

**Request:**

```json
{
  "mode": "full",  // or "incremental"
  "date_range": {
    "start": "2024-01-01",
    "end": "2024-12-31"
  }
}
```

**Response:**

```json
{
  "etl_run_id": "etl_20251223_011500",
  "status": "running",
  "started_at": "2025-12-23T01:15:00Z",
  "estimated_duration_minutes": 25
}
```

#### GET /api/etl/sicom/status/{run_id}

**Description:** Check ETL run status

**Authentication:** Required (role: Admin, Gerencia)

**Response:**

```json
{
  "etl_run_id": "etl_20251223_011500",
  "status": "completed",
  "started_at": "2025-12-23T01:15:00Z",
  "completed_at": "2025-12-23T01:37:00Z",
  "duration_seconds": 1320,
  "records_processed": 15420,
  "records_failed": 3,
  "errors": [
    {
      "record_id": "SICOM-12345",
      "error": "Invalid quantity (negative value)",
      "action": "Skipped"
    }
  ]
}
```

**Errors:**
- `403` - Only Admin/Gerencia can trigger manual ETL
- `409` - ETL already running

---

### R5: Email Notifications

#### POST /api/notifications/send

**Description:** Send email notification (used by daily cron + immediate alerts)

**Authentication:** Required (role: Admin, system cron)

**Request:**

```json
{
  "recipient_id": "user_id_123",
  "type": "daily_summary",
  "data": {
    "at_risk_purchases": 3,
    "pending_tasks": 5,
    "purchases": [
      {
        "id": "PO-2025-001",
        "project": "PAVICONSTRUJC",
        "days_open": 35
      }
    ]
  }
}
```

**Response:**

```json
{
  "notification_id": "notif_abc123",
  "status": "sent",
  "gmail_message_id": "18d2a3f4b5c6d7e8",
  "sent_at": "2025-12-23T06:00:00Z"
}
```

**Errors:**
- `429` - Gmail API rate limit (retry after 60s)

---

### R4: OCR Invoice Processing

#### POST /api/ocr/invoice

**Description:** Extract data from invoice PDF/image using Google Vision API

**Authentication:** Required (role: Compras, Contabilidad)

**Request (multipart/form-data):**

```
POST /api/ocr/invoice
Content-Type: multipart/form-data

file: [invoice.pdf]
purchase_id: PO-2025-015
```

**Response:**

```json
{
  "ocr_id": "ocr_abc123",
  "status": "completed",
  "extracted_data": {
    "invoice_number": "FAC-12345",
    "supplier_name": "Cementos Argos",
    "invoice_date": "2025-12-20",
    "total_amount": 12500000,
    "line_items": [
      {
        "description": "Cemento Argos 50kg",
        "quantity": 500,
        "unit_price": 25000,
        "total": 12500000
      }
    ]
  },
  "confidence": {
    "invoice_number": 0.98,
    "total_amount": 0.95,
    "line_items": 0.92
  },
  "validation": {
    "matches_po": true,
    "price_variance": 0.0,
    "quantity_variance": 0.0
  }
}
```

**Errors:**
- `400` - File too large (>10 MB) or unsupported format
- `422` - OCR extraction failed (low quality image)

---

### R7: Price Anomaly Detection (Caso Cartagena Prevention)

#### GET /api/prices/anomalies

**Description:** Detect price anomalies across all purchases

**Authentication:** Required (role: Compras, Gerencia, Contabilidad)

**Query Parameters:**
- `material_id` (optional): Filter by specific material
- `supplier_id` (optional): Filter by specific supplier
- `severity` (optional): `low`, `medium`, `high`, `critical`
- `days` (default: 30): Lookback window

**Response:**

```json
{
  "total_anomalies": 5,
  "breakdown": {
    "critical": 1,
    "high": 2,
    "medium": 2,
    "low": 0
  },
  "anomalies": [
    {
      "id": "anomaly_abc123",
      "purchase_id": "PO-2025-018",
      "material": "Concreto 3000 PSI",
      "supplier": "PROV-001",
      "actual_price": 120000,
      "baseline_price": 100000,
      "deviation_pct": 20.0,
      "severity": "critical",
      "detection_method": "z_score",
      "z_score": 3.2,
      "alert_sent": true,
      "status": "pending_review",
      "created_at": "2025-12-22T14:30:00Z"
    }
  ]
}
```

#### POST /api/prices/anomalies/{id}/review

**Description:** Manual review of price anomaly (approve or reject)

**Authentication:** Required (role: Gerencia, Jefe Compras)

**Request:**

```json
{
  "decision": "approved",  // or "rejected"
  "reason": "Precio correcto - material con certificación especial NTC 1000",
  "reviewed_by": "user_id_123"
}
```

**Response:**

```json
{
  "id": "anomaly_abc123",
  "status": "approved",
  "reviewed_at": "2025-12-23T01:30:00Z",
  "reviewed_by": "user_id_123"
}
```

---

### R8: Quality Certificates

#### POST /api/certificates

**Description:** Upload quality certificate for purchase

**Authentication:** Required (role: Compras, Técnico)

**Request (multipart/form-data):**

```
POST /api/certificates
Content-Type: multipart/form-data

file: [certificate.pdf]
purchase_id: PO-2025-015
certificate_type: NTC  // or INVIAS, ISO, etc.
issued_by: Cementos Argos
```

**Response:**

```json
{
  "id": "cert_abc123",
  "purchase_id": "PO-2025-015",
  "file_url": "https://storage.googleapis.com/contecsa-files/certificates/cert_abc123.pdf",
  "certificate_type": "NTC",
  "issued_by": "Cementos Argos",
  "validation_status": "pending",
  "uploaded_at": "2025-12-23T01:35:00Z",
  "uploaded_by": "user_id_123"
}
```

#### PUT /api/certificates/{id}/validate

**Description:** Technical validation of certificate (blocking gate for closure)

**Authentication:** Required (role: Técnico only)

**Request:**

```json
{
  "validation_status": "approved",  // or "rejected"
  "notes": "Certificado cumple NTC 121 para cemento Portland tipo I",
  "validated_by": "user_id_tecnico"
}
```

**Response:**

```json
{
  "id": "cert_abc123",
  "validation_status": "approved",
  "validated_at": "2025-12-23T02:00:00Z",
  "validated_by": "user_id_tecnico",
  "blocking_gate_cleared": true
}
```

**Errors:**
- `403` - Only Técnico role can validate certificates
- `400` - Certificate already validated

---

## Data Models (Pydantic Schemas)

### Purchase Model

```python
# /api/models/purchase.py
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class PurchaseCreate(BaseModel):
    project_id: str = Field(..., min_length=3, max_length=50)
    material: str = Field(..., min_length=3, max_length=200)
    quantity: float = Field(..., gt=0)
    unit: str = Field(..., max_length=20)
    justification: str = Field(..., min_length=10)
    requested_by: str
    delivery_date: datetime

class PurchaseResponse(BaseModel):
    id: str
    status: str  # REQUISICION, APROBACION, etc.
    stage: int  # 1-7
    created_at: datetime
    updated_at: datetime
    workflow: dict

    class Config:
        from_attributes = True
```

### Price Anomaly Model

```python
# /api/models/price_anomaly.py
from pydantic import BaseModel, Field
from datetime import datetime

class PriceAnomalyResponse(BaseModel):
    id: str
    purchase_id: str
    material: str
    supplier: str
    actual_price: float
    baseline_price: float
    deviation_pct: float = Field(..., ge=0)
    severity: str  # low, medium, high, critical
    detection_method: str  # baseline, z_score, iqr, rule_based
    z_score: Optional[float]
    alert_sent: bool
    status: str  # pending_review, approved, rejected
    created_at: datetime

    class Config:
        from_attributes = True
```

### OCR Result Model

```python
# /api/models/ocr.py
from pydantic import BaseModel
from typing import List, Dict

class InvoiceLineItem(BaseModel):
    description: str
    quantity: float
    unit_price: float
    total: float

class OCRResult(BaseModel):
    ocr_id: str
    status: str  # processing, completed, failed
    extracted_data: Dict[str, any]
    confidence: Dict[str, float]
    validation: Dict[str, bool]

    class Config:
        from_attributes = True
```

---

## Rate Limiting

**Strategy:** Token bucket algorithm (100 requests/minute per user)

**Headers:**

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1703376000  # Unix timestamp
```

**Error Response (429):**

```json
{
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "Límite de 100 solicitudes/minuto alcanzado",
  "retry_after": 42
}
```

---

## Pagination

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 50, max: 200)

**Response Format:**

```json
{
  "total": 1250,
  "page": 1,
  "limit": 50,
  "total_pages": 25,
  "has_next": true,
  "has_prev": false,
  "results": [ ... ]
}
```

---

## Webhooks (Future - Phase 2)

**Planned Events:**
- `purchase.created`
- `purchase.stage_advanced`
- `price_anomaly.detected`
- `certificate.validated`
- `etl.completed`

**Webhook Payload:**

```json
{
  "event": "price_anomaly.detected",
  "timestamp": "2025-12-23T01:40:00Z",
  "data": {
    "anomaly_id": "anomaly_abc123",
    "purchase_id": "PO-2025-018",
    "severity": "critical"
  }
}
```

---

## OpenAPI Specification

**Interactive API Docs (Swagger UI):**
- Development: `http://localhost:8000/docs`
- Production: `https://api.contecsa.com/docs`

**OpenAPI JSON:**
- `http://localhost:8000/openapi.json`

---

## Testing

### Test Credentials (Development Only)

```json
{
  "gerencia": {
    "email": "gerencia@contecsa.com",
    "password": "test123",
    "role": "gerencia"
  },
  "compras": {
    "email": "liced.vega@contecsa.com",
    "password": "test123",
    "role": "compras"
  }
}
```

### Example cURL Requests

**Get JWT Token (via NextAuth.js):**

```bash
# Login via frontend, extract token from session
TOKEN=$(curl -X POST http://localhost:3000/api/auth/callback/credentials \
  -d "email=compras@contecsa.com&password=test123" | jq -r '.accessToken')
```

**Create Purchase:**

```bash
curl -X POST http://localhost:8000/api/purchases \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "PAVICONSTRUJC",
    "material": "Cemento Argos 50kg",
    "quantity": 500,
    "unit": "bultos",
    "justification": "Fundición columnas edificio A",
    "requested_by": "user_id_123",
    "delivery_date": "2025-01-15T00:00:00Z"
  }'
```

**Get Dashboard KPIs:**

```bash
curl -X GET "http://localhost:8000/api/dashboard/gerencia?date_range=30d" \
  -H "Authorization: Bearer $TOKEN"
```

---

## References

- FastAPI Docs: https://fastapi.tiangolo.com
- Pydantic Models: https://docs.pydantic.dev
- JWT Authentication: https://jwt.io
- R1-R13 Feature Specs: docs/features/
- Development Guide: docs/development-guide.md
