# API Documentation - Contecsa

Version: 1.1 | Date: 2025-12-23 11:45 | Type: API Reference

## Overview

RESTful API Python/FastAPI con autenticación JWT, rate limiting, validación Pydantic.

**Base URL:** Dev: `http://localhost:8000` | Prod: `https://api.contecsa.com`
**Auth:** JWT Bearer tokens (NextAuth.js)
**Rate Limit:** 100 req/min per user
**Content-Type:** `application/json`

## Authentication

| Aspect | Implementation |
|--------|----------------|
| **Frontend** | NextAuth.js session → JWT token → `Authorization: Bearer ${token}` header |
| **Backend** | FastAPI HTTPBearer → Verify JWT (SECRET_KEY, HS256) → Extract user_id, email, role |
| **Errors** | 401 (expired/invalid token), 403 (insufficient permissions) |

**Implementation:** `/api/middleware/auth.py`

## HTTP Status Codes

| Code | Meaning | Use Case |
|------|---------|----------|
| 200 | OK | Successful GET/PUT/DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Invalid data |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate resource |
| 422 | Unprocessable | Validation error (Pydantic) |
| 429 | Rate Limit | Exceeded 100/min |
| 500 | Server Error | Internal error (logged) |

**Error Response:** See `/api/models/error.py` for schema

## Endpoints

### R1 - Conversational AI

| Method | Path | Auth | Purpose | Request | Response |
|--------|------|------|---------|---------|----------|
| POST | /api/ai/query | Required | Natural language query | `{query, context}` | `{answer, chart?, sources}` |

### R2 - Dashboards

| Method | Path | Auth | Purpose | Params | Response |
|--------|------|------|---------|--------|----------|
| GET | /api/dashboard/{role} | Role-based | KPIs by role | role: gerencia\|compras\|contabilidad\|tecnico\|almacen<br>project_id, date_range (7d\|30d\|90d\|ytd) | `{kpis, charts[], alerts[]}` |

**Roles:** gerencia, compras, contabilidad, tecnico, almacen

### R3 - Purchase Tracking

| Method | Path | Auth | Purpose | Request/Params | Response |
|--------|------|------|---------|----------------|----------|
| GET | /api/purchases | Required | List purchases | project_id, status, dias_abierto, limit, offset | `{data[], total, page}` |
| GET | /api/purchases/{id} | Required | Purchase detail | id (UUID) | `{...purchase, estados_log[]}` |
| POST | /api/purchases | Compras | Create purchase | `{proyecto_id, proveedor_id, categoria, monto, ...}` | `{id, estado: REQUISICION}` |
| PATCH | /api/purchases/{id} | Role-based | Update/transition state | `{estado?, campo?: valor}` | Updated purchase |
| GET | /api/purchases/at-risk | Gerencia/Compras | At-risk purchases (>30d) | project_id | `{data[]}` |

**States:** REQUISICION → APROBACION → ORDEN → CONFIRMACION → RECEPCION → CERTIFICADOS → CERRADO

### R4 - Invoice OCR

| Method | Path | Auth | Purpose | Request | Response |
|--------|------|------|---------|---------|----------|
| POST | /api/invoices/upload | Compras | Upload + OCR | `multipart/form-data` (file, purchase_id) | `{invoice_id, extracted: {...}}` |
| GET | /api/invoices/{id} | Required | Invoice detail | id | `{...invoice, ocr_data}` |
| POST | /api/invoices/{id}/validate | Contabilidad | Validate invoice | `{approved: bool, notes?}` | Updated invoice |

**OCR:** Google Cloud Vision API → Extract invoice_number, date, supplier, amount, line_items

### R5 - Notifications

| Method | Path | Auth | Purpose | Params | Response |
|--------|------|------|---------|--------|----------|
| GET | /api/notifications | Required | User notifications | read (bool), limit | `{data[], unread_count}` |
| PATCH | /api/notifications/{id}/read | Required | Mark as read | id | Success |
| GET | /api/notifications/preferences | Required | User preferences | - | `{email_enabled, types[]}` |
| PUT | /api/notifications/preferences | Required | Update preferences | `{email_enabled, types[]}` | Updated prefs |

### R6 - SICOM ETL

| Method | Path | Auth | Purpose | Params | Response |
|--------|------|------|---------|--------|----------|
| POST | /api/etl/sicom/trigger | Admin | Manual ETL run | - | `{job_id, status: RUNNING}` |
| GET | /api/etl/sicom/status | Admin | ETL job status | job_id | `{status, rows_processed, errors[]}` |
| GET | /api/etl/sicom/history | Admin | ETL run history | limit | `{runs[]}` |

**Schedule:** Weekly (Sunday 2 AM Colombia) via cron

### R7 - Price Anomaly Detection

| Method | Path | Auth | Purpose | Request | Response |
|--------|------|------|---------|---------|----------|
| GET | /api/prices/history | Required | Price history | material_id, days | `{data[], baseline}` |
| POST | /api/prices/check-anomaly | System | Check price anomaly | `{invoice_id, material_id, unit_price, ...}` | `{anomaly_detected, severity, ...}` |
| GET | /api/prices/anomalies | Gerencia/Compras | List anomalies | severity, resolved (bool) | `{data[]}` |
| POST | /api/prices/anomalies/{id}/resolve | Compras | Resolve anomaly | `{resolution: APPROVE\|REJECT, justification}` | Updated anomaly |

**Severity:** LOW, MEDIUM, HIGH, CRITICAL
**Detection:** Z-score, IQR, rules (>10% threshold), cross-supplier

### R11 - Google Workspace Integration

| Method | Path | Auth | Purpose | Request | Response |
|--------|------|------|---------|---------|----------|
| POST | /api/export/sheets | Required | Export to Google Sheets | `{data_type, filters}` | `{sheet_url}` |
| POST | /api/email/send | System | Send email (Gmail API) | `{to, subject, body}` | `{message_id}` |

## Pagination

**Query Params:** `limit` (default: 50, max: 200), `offset` (default: 0)
**Response:** `{data[], total, page, pages, limit}`

## Rate Limiting

**Limits:**
- Default: 100 req/min per user
- AI agent: 10 req/min (higher cost)
- ETL trigger: 1 req/hour (Admin only)

**Headers:**
- `X-RateLimit-Limit`: 100
- `X-RateLimit-Remaining`: 95
- `X-RateLimit-Reset`: 1735000000

**Error (429):** `{error: "RATE_LIMIT_EXCEEDED", retry_after: 60}`

## Data Validation (Pydantic)

**Schemas:** `/api/models/*.py`

**Common Fields:**
- UUIDs: Standard UUID4 format
- Dates: ISO 8601 (`YYYY-MM-DD`)
- Amounts: Decimal(15,2) in COP
- Enums: Uppercase strings (e.g., `APROBACION`)

## Testing

**Postman Collection:** `/api/postman/contecsa-api.json`
**Auth Credentials:** See `.env.example`
**Test Data:** `/api/tests/fixtures/*.json`

## OpenAPI Specification

**Docs:** Auto-generated at `/docs` (Swagger UI) and `/redoc` (ReDoc)
**Schema:** `/openapi.json`

## References

**Code:** `/api/routers/*.py` | **Models:** `/api/models/*.py` | **Middleware:** `/api/middleware/` | **Tests:** `/api/tests/`
