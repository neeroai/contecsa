# Business Context - Contecsa Sistema de Inteligencia de Datos

Version: 1.0 | Date: 2025-12-22 22:20

---

## Company Overview

**Legal Name:** CONGLOMERADO TECNICO COLOMBIANO S.A.S. (CONTECSA S.A.S.)
**Tax ID (NIT):** 802.005.436-1
**Industry:** Infrastructure Construction - Civil Engineering
**Founded:** June 27, 1997 (28+ years)
**Headquarters:** Km 98+600 Vía Al Mar, Puerto Colombia, Atlántico, Colombia
**Company Size:** Grande (Large)
**Certification:** ISO 9001:2015 (Quality Management)

### Business Model

**Operational Structure:**
- Construction company specializing in high-complexity civil works
- Operates primarily through **Consorcios** (joint ventures) and **Uniones Temporales** (temporary unions)
- Geographic focus: Colombian Caribbean (Bolívar, Atlántico departments)
- Multi-project portfolio management across 9 active **consorcios**

**Core Competencies:**
- Road construction and paving (CIIU 4210)
- Geotechnical engineering (reinforced earth walls)
- Hydraulic works (flood control, coastal protection)
- Urban infrastructure (parks, sidewalks, drainage)

---

## Active Consorcios Portfolio (9 Projects)

| Consorcio | Participation % | Location | Project Value | Status |
|-----------|-----------------|----------|---------------|--------|
| **PAVICONSTRUJC** | Major participant | Cartagena/Manga | ~$200M COP+ | Active (41.8% of purchases) |
| **EDUBAR-KRA50** | Major participant | Barranquilla | ~$100M COP+ | Active (14.5% of purchases) |
| **PTAR-SANTO TOMAS** | Partner | Santo Tomás | ~$80M COP+ | Active (10.9% of purchases) |
| **PTAR-JUAN DE ACOSTA** | Partner | Juan de Acosta | ~$50M COP+ | Active (7.3% of purchases) |
| **PARQUES DE BOLIVAR** | Partner | Bolívar | ~$40M COP+ | Active (7.3% of purchases) |
| **Consorcio Vipar 2024** | 50% | Mompox/Magangué | $54,240M COP | Active (2 contracts) |
| **CONTECSA-ADMINISTRATIVO** | 100% | Multi-site | Internal | Active (9.1% of purchases) |
| **CORDOBA** | Partner | Córdoba | Undisclosed | Active |
| **HIDROGUJIRA** | Partner | La Guajira | Undisclosed | Active |

**Distribution Insights:**
- **PAVICONSTRUJC dominates** with 41.8% of total purchase activity
- Top 3 consorcios (PAVIC, EDUBAR, PTAR) account for 67.2% of operations
- Long-tail of smaller projects (6 consorcios account for 32.8%)

---

## Critical Business Case: Caso Cartagena

### The Incident (2-Month Overcharge Detection Failure)

**What Happened:**
- **Date:** Early 2025 (while Liced Vega on leave)
- **Project:** Cartagena (likely PAVICONSTRUJC consorcio)
- **Material:** Concrete (ready-mix concrete M42 or similar)
- **Invoices:** 3 consecutive invoices from same supplier
- **Issue:** Supplier overcharged Contecsa for concrete deliveries
- **Detection Delay:** 2 months - overcharge went undetected during this period
- **Financial Impact:** Company overpaid supplier (exact amount not disclosed)
- **Resolution:** Supplier self-detected error and issued **credit note (nota de crédito)**
- **Root Cause:** Manual price monitoring, no automated alerts, key person (Liced Vega) absent

**Quote from PO Meeting:**
> "¿Qué pasó este año? Yo me fui. Y antesito que yo me fui, pasamos tres facturas y se nos pasaron así. En Cartagena están cobrando de más que el concreto. Y se pagó así. Me fui dos meses y lo compré y se pagó. Cuando yo vuelvo, el mismo proveedor nos manda la nota de crédito. Ahí mira que nos tocamos nosotros mismos."

**Translation:**
"What happened this year? I left. And right before I left, three invoices got through. In Cartagena they were overcharging for concrete. And it got paid. I left for two months and it was bought and paid. When I return, the same supplier sends us the credit note. Look, they corrected themselves."

### Business Impact Analysis

| Dimension | Impact | Severity |
|-----------|--------|----------|
| **Financial** | Overpaid for 3 invoices (amount recovered via credit note) | Medium (recovered) |
| **Process** | Manual price validation failed when key person absent | High |
| **Risk** | Single point of failure (Liced Vega dependency) | Critical |
| **Reputation** | Supplier had to correct error (not detected internally) | Medium |
| **Compliance** | No contractual breach, but weak internal controls | Medium |

### Why It Matters (Strategic Imperative)

**This incident is the PRIMARY driver for Feature R7 (Price Anomaly Detection)**

The Caso Cartagena demonstrates:
1. **Centralization Risk:** Liced Vega is the only person who caught price anomalies manually
2. **Manual Process Fragility:** Excel-based price memory is not scalable or reliable
3. **No Automated Alerts:** System has no mechanism to flag price variations >10%
4. **Supplier Dependency:** Relied on supplier honesty to issue credit note (not all would)
5. **Delayed Detection:** 2 months = 60 days of financial exposure

**Regulatory Context (SICOM Legacy):**
- SICOM contains historical price data from 1970s-80s onward
- SICOM is "bodega de datos sin consultas ágiles" (data warehouse without agile queries)
- Manual cross-checking of current prices vs historical data is impractical
- R6 (ETL SICOM) + R7 (Price Analysis) together prevent future Caso Cartagena incidents

---

## Current Procurement Process (Excel-Based)

### Excel File: "CONTROL COMPRAS.xlsx"

**File Stats:**
- **Size:** 58 KB
- **Sheets:** 3 (Control de Compras, Direcciones de Obra, Carteras Vencidas)
- **Period:** 2024-2025
- **Last Update:** November 20, 2025
- **Platform:** Google Sheets (collaborative, manual entry)

**Data Volume:**
- **Total Purchases:** 55 registered
- **Tracking Fields:** 28 per purchase
- **Active Consorcios:** 9
- **Unique Suppliers:** 38

### Purchase States

| State | Count | % | Notes |
|-------|-------|---|-------|
| **CERRADO** | 53 | 96.4% | Closed (complete cycle) |
| **PTE ENTREGA** | 2 | 3.6% | Pending delivery |
| **ANULADO** | 1 | 1.8% | Cancelled (not deleted, marked for traceability) |

### Purchase Types

| Type | Count | % | Description |
|------|-------|---|-------------|
| **COMPRAS** | 46 | 83.6% | Material/service acquisition |
| **PROCESOS** | 6 | 10.9% | Formal bidding/contracting |
| **CONTRATOS** | 3 | 5.5% | Professional service contracts |

### 28-Field Tracking Structure

**Grouped by Workflow Phase:**

**1. Requisition (8 fields):**
- Estado (State)
- Tipo de Requerimiento (Type)
- Prioridad (Priority) - rarely used
- Fecha RQ (Requisition date)
- No RQ (SICOM requisition number) - often empty
- Quien Realiza la RQ (Requestor)
- Centro de Costos (Cost center/consorcio)
- Quien compra? (Purchasing responsible)

**2. Procurement Management (3 fields):**
- Material solicitado (Material description) - free text, detailed
- Observación del Proceso (Process observations) - critical unstructured data
- Proveedor (Supplier name)

**3. Purchase Order (6 fields):**
- ODC (Orden De Compra - materials)
- ODS (Orden De Servicio - services)
- Forma de Pago (Payment terms: CONTADO/CREDITO)
- Valor Compra (Purchase amount)
- Fecha ODC-ODS (Order date)
- Fecha de Pago (Payment date)

**4. Tracking (3 fields):**
- Encargado del Seguimiento (Tracking responsible) - **Liced Vega in majority**
- Observaciones de Seguimiento (Tracking notes) - free text
- Entregado (Delivered: SI/NO/PARCIAL)

**5. Warehouse & Logistics (3 fields):**
- No Entrada (Warehouse entry number - SICOM integration)
- No. Factura (Invoice number) - **mostly empty**
- Fecha de Cierre (Closure date)

**6. Certificates & Documentation (5 fields):**
- Certificado de Calidad (Quality certificate)
- Ficha Técnica (Technical datasheet)
- Garantía (Warranty)
- Observaciones de Seguimiento (Additional notes)
- Anexos (Attachments/links)

**CRITICAL FINDING:** Fields 23-27 (certificates section) are **mostly empty**, indicating:
- Certificates not being tracked in Excel
- Likely managed in physical folders or external systems
- Major improvement opportunity for R8 (Certificate Management)

---

## Identified Workflow (7-Stage E2E Process)

Based on Excel field structure and meeting insights:

```
1. REQUISICIÓN (Request)
   ├─ User creates requisition (often by email, not in system)
   ├─ Register: Date, Requestor, Cost Center, Material
   └─ Assign to purchasing responsible

2. GESTIÓN DE COMPRAS (Procurement)
   ├─ Responsible quotes with suppliers
   ├─ Select supplier
   ├─ Define payment terms and specifications
   └─ Record observations

3. EMISIÓN DE ORDEN (Order Issuance)
   ├─ Generate ODC (materials) or ODS (services) in SICOM
   ├─ Define payment terms and amount
   └─ Record issuance and projected payment dates

4. SEGUIMIENTO (Tracking)
   ├─ Responsible (Liced Vega) tracks progress
   ├─ Update observations on status
   └─ Mark as ENTREGADO (SI/NO/PARCIAL)

5. RECEPCIÓN EN ALMACÉN (Warehouse Receipt)
   ├─ Material enters warehouse
   ├─ Generate No. ENTRADA in SICOM
   └─ Record supplier invoice number

6. CIERRE (Closure)
   ├─ Validate complete delivery
   ├─ Request certificates/datasheets (if applicable)
   ├─ Record FECHA DE CIERRE
   └─ State changes to CERRADO

7. DOCUMENTACIÓN (Documentation - weak)
   ├─ Quality certificate (mostly not recorded)
   ├─ Technical datasheet (mostly not recorded)
   └─ Warranty (mostly not recorded)
```

**Typical Cycle Times:**
- Order → Payment: ~6 days average
- Payment → Delivery: Variable
- Delivery → Closure: ~10-15 days
- **Full Cycle:** **15-30 days typical**

---

## Pain Points (Current State)

### Operational Pain Points

| Pain Point | Impact | Severity | Evidence |
|------------|--------|----------|----------|
| **High Manual Labor** | 28 fields per purchase, manual entry | High | 55 purchases require ~1,540 field entries |
| **Frequent Empty Fields** | Certificates, invoices, technical docs not recorded | High | 5 certificate fields consistently empty |
| **No Automatic Alerts** | Purchases >30 days go unnoticed | Critical | Caso Cartagena: 2-month delay |
| **No Visible KPIs** | No dashboards or automatic indicators | Medium | Must export to Excel for analysis |
| **No Validations** | Possibility of unauthorized changes | High | Meeting: "cambios no autorizados" |
| **Single Responsible** | Liced Vega centralizes tracking (bottleneck) | Critical | Risk if she's absent (Caso Cartagena) |
| **No Change History** | Google Sheets history exists but not used proactively | Medium | Manual recovery via "relojito" |
| **Unstructured Data** | "Observaciones" has valuable but unqueryable data | Medium | Conditions, specs, reasons in free text |

### Integration Pain Points

| Pain Point | Impact | Evidence |
|------------|--------|----------|
| **SICOM Disconnection** | No RQ field often empty, manual SICOM entry | Meeting: "No todas las requisiciones se registran en SICOM" |
| **Invoice Tracking Gap** | No. Factura field mostly empty | Likely managed in accounting system separately |
| **No Real-time Visibility** | Must open Excel to check purchase status | No mobile access, no notifications |
| **No Price History** | Manual comparison vs SICOM prices (Caso Cartagena) | Meeting: "tengo que estar pendiente de los precios" |

### Compliance & Risk Pain Points

| Pain Point | Impact | Evidence |
|------------|--------|----------|
| **Unauthorized Changes** | Excel changes without approval | Meeting mentioned "cambios no autorizados frecuentes" |
| **No Audit Trail** | Change tracking exists but passive | Requires manual inspection of Google Sheets history |
| **Certificate Management Failure** | Quality certificates not enforced | 5 certificate fields empty across 55 purchases |
| **Price Anomaly Detection Failure** | Caso Cartagena: 2-month overcharge undetected | Critical business risk |

---

## SICOM Legacy System Context

### What is SICOM?

**Technical Profile:**
- **Era:** 1970s-80s system (version 2, no upgrade path)
- **Interface:** "Pantalla negra" (black screen terminal interface)
- **Status:** "Bodega de datos sin consultas ágiles" (data warehouse without agile queries)
- **Modernization:** NOT possible (prohibitively expensive, high risk)

**Quote from PO:**
> "Aquí hay una herramienta de los años 80, además, si vos, por no hablar de los 70. Pero digamos que es una, yo le llamo una bodega de datos, o sea, aquí es una bodega de datos poderosa. Es la base de datos. Exactamente, pero digamos que es bodega porque no tenemos, digamos, como nosotros hacer las consultas."

**Translation:**
"Here there's a tool from the 80s, or rather, not to mention the 70s. But let's say I call it a data warehouse, I mean, it's a powerful data warehouse. It's the database. Exactly, but let's say it's a warehouse because we don't have a way to make queries."

### SICOM Data Contained

**Modules in SICOM:**
- **Compras** (Purchases) - Historical purchase orders
- **Proveedores** (Suppliers) - Supplier master data
- **Materiales** (Materials) - Material catalog
- **Precios Históricos** (Historical Prices) - Price history by material/supplier
- **Proyectos** (Projects) - Consorcio/project data
- **Facturas** (Invoices) - Historical invoices
- **Almacén** (Warehouse) - Inventory movements (though "no se está llevando como debería" - not maintained properly)

**Quote from Meeting:**
> "Tenemos compras, tenemos materiales pétreos... teníamos almacén pero tampoco se está llevando como debería... en donde nos hemos enfocado es en los materiales y en las compras."

### SICOM Integration Points (Read-Only)

| Field in Excel | SICOM Source | Integration Type |
|----------------|--------------|------------------|
| No RQ | Requisición number | Manual (often skipped) |
| ODC/ODS | Orden de Compra/Servicio | Manual entry in SICOM, reference in Excel |
| No ENTRADA | Warehouse entry number | Critical for traceability |
| Centro de Costos | Project/Consorcio | Validated against SICOM master |
| Proveedor | Supplier master | Manual selection from SICOM catalog |

**CRITICAL CONSTRAINT:** SICOM is **READ-ONLY** for new system
- **Rule:** NEVER modify SICOM data
- **ETL Approach (R6):** Extract SICOM data → Transform to 3D matrices (Python NumPy) → Load to PostgreSQL warehouse
- **Frequency:** Weekly sync (Sunday 2 AM recommended)

---

## Key Personnel

### Liced Vega (Super User)

**Role:** Encargada de Seguimiento (Tracking Responsible)
**Observed Behavior:** Appears in "Encargado del Seguimiento" field in **majority** of Excel purchases
**Criticality:** **Single point of failure** for purchase tracking

**Evidence:**
- Excel analysis: "LICED VEGA aparece como encargada de seguimiento en la mayoría de compras"
- Caso Cartagena: Issue occurred during her 2-month absence
- PO meeting: She's the one who manually detects price anomalies

**System Implications:**
- **R3 (Purchase Tracking):** Must distribute tracking across roles, not centralize in one person
- **R5 (Notifications):** Automate alerts so tracking doesn't depend on Liced manually checking
- **R7 (Price Analysis):** Automate price validation so Liced's absence doesn't create risk

### User Roles (8-10 Total Users)

| Role | Count | Key Responsibilities | System Access Needed |
|------|-------|----------------------|----------------------|
| **Gerencia** | 2-3 | Executive dashboards, approvals, projections | R2 (Dashboard), R10 (Financial Projection) |
| **Compras** | 3 | Purchase tracking, supplier management, orders | R3 (Purchase Tracking), R7 (Price Analysis), R11 (Sheets Export) |
| **Contabilidad** | 1 | Invoice validation, payment approval, closure | R3 (Closure Gate), R13 (Invoice Validation) |
| **Técnico** | 1 | Material consumption per project, requisitions | R3 (Create Requisitions), R2 (Consumption Dashboard) |
| **Almacén** | 1 | Inventory control, material reception | R3 (Register Receipts), R9 (Inventory Control) |

**Permission Model:**
- **Liced Vega = Super User** (Can see all consorcios, full CRUD)
- **Project-based permissions:** PAVICONSTRUJC users see only their project
- **Role-based workflows:** Técnico creates, Gerencia approves, Compras executes

---

## Technical Requirements (from Business Context)

### Must-Have Features (Driven by Pain Points)

**From Caso Cartagena:**
1. **Price Anomaly Detection (R7):**
   - Alert when current price vs. historical average >10% variation
   - Supplier-specific price patterns (some suppliers always more expensive)
   - Material category price ranges (concrete, asphalt, steel)
   - Baseline calculation: 30/60/90-day moving averages

**From Excel Process:**
2. **Certificate Management (R8):**
   - Enforce certificate upload before closure (blocking gate)
   - Categories requiring certificates: Concrete, Steel, Electrical, Chemicals
   - File storage: GCS/S3 with metadata in PostgreSQL
   - Alert if certificate missing 5 days post-receipt

3. **Purchase Tracking Alerts (R3):**
   - >30 días open → alert Jefe Compras, Gerencia
   - >45 días open → escalate to CEO (critical)
   - Orden Sin Confirmar >7 días → alert Compras
   - Certificado Faltante >5 días → alert Compras

**From SICOM Constraints:**
4. **Read-Only ETL (R6):**
   - NEVER write to SICOM
   - Weekly incremental sync (Sunday 2 AM)
   - Transform to 3D matrices (NumPy) for fast analysis
   - Warehouse tables: sicom_compras_hist, sicom_precios_hist

**From Manual Labor:**
5. **Automated Notifications (R5):**
   - Daily summary email (8 AM Colombia time)
   - 1 consolidated email per user (not spam)
   - Role-specific content (Gerencia vs Compras vs Contabilidad)

**From Google Workspace Usage:**
6. **Native Integration (R11):**
   - Export to Google Sheets (familiar format)
   - Send via Gmail API (client already uses @contecsa.com)
   - SSO with Google OAuth 2.0 (@contecsa.com domain restriction)

---

## Success Metrics (Business Outcomes)

### Primary Success Metrics

| Metric | Current State | Target State | Measurement |
|--------|---------------|--------------|-------------|
| **Price Anomaly Detection Time** | 2 months (Caso Cartagena) | <24 hours | Time from invoice receipt to anomaly alert |
| **Purchase Cycle Time** | 15-30 days average | 10-15 days | Days from requisition to closure |
| **Certificate Compliance** | ~0% (empty fields) | >95% | % of purchases with required certificates uploaded |
| **At-Risk Purchases** | Not tracked | 0 purchases >45 días | Purchases open >45 days without closure |
| **Manual Report Generation Time** | 2 hours | 5 minutes | Time to generate executive report |

### Secondary Success Metrics

| Metric | Current | Target | Impact |
|--------|---------|--------|--------|
| **Liced Vega Dependency** | 100% (single point of failure) | <30% | Distribution of tracking across team |
| **Empty Excel Fields** | ~40% (certificates section) | <5% | Data completeness |
| **SICOM Query Time** | Manual, hours | Seconds (via warehouse) | Analyst productivity |
| **Unauthorized Changes** | Possible (no controls) | 0 | Audit trail enforcement |
| **Purchase Visibility** | Must open Excel | Real-time dashboard | Management decision speed |

### Risk Reduction Metrics

| Risk | Current Exposure | Target Exposure | Mitigation Feature |
|------|------------------|-----------------|-------------------|
| **Overcharge (Caso Cartagena)** | 2-month delay | <24h detection | R7 (Price Analysis) |
| **Missing Certificates** | Not enforced | 100% enforced | R8 (Certificates) + R3 (Blocking Gates) |
| **Key Person Risk (Liced)** | Critical dependency | Distributed process | R3 (Multi-user Tracking) + R5 (Automated Alerts) |
| **SICOM Data Loss** | No backup strategy | Weekly sync | R6 (ETL Read-Only) |

---

## E2E Procurement Process (Technical Detail)

### Phase 1: Requisition (REQUISICIÓN)

**Actors:** Técnico (field engineer), Project Director
**Current Process:**
- Técnico sends requisition **by email** (not in system)
- Director approves via email
- Compras records in Excel manually

**New Process (System):**
- Técnico creates requisition in app (mobile-friendly for field)
- Auto-assign to director based on cost center
- Email notification to director (R5 integration)
- Director approves in system (audit trail created)
- Auto-transition to APROBACIÓN state (R3)

**Data Required:**
- Material description (free text + catalog selection)
- Quantity (with unit: m³, ton, gallon)
- Cost center (consorcio selection from dropdown)
- Urgency (optional: Normal, Urgent, Emergency)
- Justification (why needed, for what activity)

### Phase 2: Procurement (GESTIÓN DE COMPRAS)

**Actors:** Jefe Compras, Analista Compras
**Current Process:**
- Compras cotiza con proveedores (quotes via email/phone)
- Selecciona proveedor (manually in Excel)
- Define condiciones (payment terms in free text "Observaciones")

**New Process (System):**
- Create RFP (Request for Proposal) - send to multiple suppliers
- Receive quotes (via email or supplier portal future enhancement)
- Comparison matrix (price, delivery time, payment terms)
- Select supplier → record decision justification
- Alert if selected supplier != lowest price (requires approval)

**Price Validation (R7):**
- Query sicom_precios_hist for material + supplier historical prices
- Calculate deviation: (Current Price - Avg Historical Price) / Avg Historical Price
- If deviation >10% → alert Jefe Compras
- Require justification if proceeding with high-deviation price

### Phase 3: Order Issuance (EMISIÓN DE ORDEN)

**Actors:** Compras, SICOM (external system)
**Current Process:**
- Generate ODC/ODS in SICOM manually
- Copy ODC number to Excel
- Send ODC to supplier via email (PDF attachment)

**New Process (System):**
- Generate purchase order in new system
- Auto-assign ODC/ODS number (sequential)
- Generate PDF with company template
- Send via Gmail API (R11) to supplier
- Option: Also create in SICOM if required (manual step, but system reminds)

**Blocking Gates:**
- Cannot create order if requisition not approved (R3 state machine)
- Cannot create order if budget exceeded (R10 integration)

### Phase 4: Supplier Confirmation (CONFIRMACIÓN)

**Actors:** Supplier (external), Compras
**Current Process:**
- Supplier confirms order via email or phone
- Compras records confirmation manually in Excel "Observaciones"
- No formal evidence uploaded

**New Process (System):**
- Supplier sends confirmation email to dedicated address (invoices@contecsa.com)
- R12 (Email Intake) parses email, extracts order reference
- Compras uploads confirmation document (email PDF, supplier acknowledgment)
- System auto-transitions to CONFIRMACIÓN state
- Alert if order not confirmed within 7 days (R5)

### Phase 5: Warehouse Receipt (RECEPCIÓN EN ALMACÉN)

**Actors:** Almacén (warehouse clerk), Quality Control
**Current Process:**
- Material arrives at warehouse
- Almacén counts manually, generates No. ENTRADA in SICOM
- Copies No. ENTRADA to Excel
- Quality checks often informal (no system record)

**New Process (System):**
- Almacén scans delivery note (barcode/QR if available)
- Mobile app: Record quantity received, take photos
- **Offline-first:** App works without internet (sync later)
- Quality control: Record temperature (asfalto), slump (concreto), visual inspection
- If quality fails → reject delivery, alert Compras
- If quality passes → generate No. ENTRADA, sync to SICOM (optional)
- System auto-transitions to RECEPCIÓN state

**Validation (3-Way Match):**
- Order quantity vs. Received quantity vs. Invoice quantity
- Alert if variance >5%
- Partial deliveries: Mark as "PARCIAL", track pending quantity

### Phase 6: Certificate Validation (CERTIFICADOS)

**Actors:** Jefe Compras, Quality Control
**Current Process:**
- Certificate request informal (email to supplier)
- Certificates stored in physical folder or Google Drive (not tracked in Excel)
- Often missing, no enforcement

**New Process (System - R8):**
- System checks material category (Concreto, Acero, Eléctricos, Químicos)
- If certificate required → blocking gate prevents closure
- Upload certificate files (PDF, JPG) to Vercel Blob/GCS/S3
- Metadata stored in PostgreSQL (certificate_id, purchase_id, file_url, uploaded_by, uploaded_at)
- Alert if certificate not uploaded within 5 days post-receipt (R5)
- Quality control validates certificate content (not just uploaded, but correct)

**Required Certificates (by Material):**
- Concreto: Certificado de Calidad, Ensayo de Resistencia (f'c)
- Acero: Mill Certificate (certificado de acería), Colada
- Asfalto: Certificado de Calidad, Diseño de Mezcla
- Químicos: Ficha de Seguridad (MSDS), Certificado de Pureza

### Phase 7: Payment & Closure (PAGO/CIERRE)

**Actors:** Contabilidad, Tesorería, Gerencia
**Current Process:**
- Contabilidad validates invoice vs order
- If OK → approves payment
- Tesorería pays supplier
- Compras records "FECHA DE CIERRE" and changes state to "CERRADO"

**New Process (System):**
- Invoice arrives (OCR R4 or manual entry)
- Validate invoice amount vs order amount (tolerance ±5%)
- If exceeds tolerance → require Gerencia approval
- Validate certificate upload (if required by category)
- Validate No. ENTRADA exists
- Validate payment terms (if CREDITO, check if within credit days)
- Contabilidad approves → generates payment instruction
- Tesorería executes payment → records payment date
- System auto-closes purchase, sends closure notification (R5)
- Generate certificate of cost (certificación de costos) for consorcio partners

**Audit Trail (compra_estados_log):**
- Every state transition logged: user_id, timestamp, old_state, new_state, notes
- Immutable log (no deletes, only inserts)
- Queryable for forensic audit

---

## Competitive Context & Risk Environment

### Infrastructure Sector in Colombia

**Characteristics:**
- High-value contracts (>$1M USD typical)
- Multi-year project duration (1-5 years)
- Strict regulatory oversight (INVIAS, ANI, DIAN)
- Complex funding (government advance payments, milestone-based)
- Joint venture model (consorcios) is standard practice

**Risks:**
- **Overruns:** Material price volatility (steel, asphalt, fuel)
- **Delays:** Weather (Caribbean rainy season), logistics (remote sites)
- **Compliance:** Environmental (CRA, Corpocesar), labor (parafiscales)
- **Reputation:** Association with controversial projects (e.g., "Más Vías")

### Reputational Risk: "Más Vías" Program Controversy

**Context (from research):**
- Gobernación del Atlántico program (~$1B COP for 150 km roads)
- Contecsa appears in **Consorcio CMX Atlántico**
- Investigative journalism (Infobae) linked program to figures from "Carrusel de la Contratación" scandal

**System Implication:**
- Transparency is not optional, it's survival
- Every transaction must have audit trail
- R3 (Audit Log) + R7 (Price Validation) serve as **compliance shield**
- System should enable Contecsa to prove: "Every peso spent has documentation"

---

## Technology Context (Current State)

### Current Tools

| Tool | Usage | Users | Pain Points |
|------|-------|-------|-------------|
| **Google Sheets** | Purchase tracking (Excel file) | 5+ (Compras, Gerencia) | Manual entry, no validations, change risk |
| **SICOM** | Legacy ERP (1970s-80s) | 2-3 (trained users only) | Black screen, no agile queries, version 2 (no upgrade) |
| **Email (Gmail)** | All communications | All users | Requisitions lost in inbox, no structured data |
| **Google Drive** | File storage (informal) | All users | No indexing, no metadata, no search |
| **WhatsApp** | Informal coordination | Field users | No audit trail, data lost |

### Infrastructure Constraints

**Connectivity:**
- **Urban sites (Barranquilla, Cartagena):** Good 4G/fiber connectivity
- **Remote sites (Mompox, Magangué):** Intermittent cellular, no fiber
- **Implication:** Mobile app MUST be **offline-first** (R3, R9)

**Devices:**
- **Office staff:** Windows laptops, smartphones (Android/iOS mix)
- **Field staff (Técnicos, Almacén):** Smartphones only (Android majority)
- **Implication:** Responsive web app + PWA (progressive web app) for mobile

---

## References

**Source Documents:**
- `/Users/mercadeo/neero/contecsa/docs/analisis-control-compras.md` (Excel analysis, 28 fields, 55 purchases)
- `/Users/mercadeo/neero/contecsa/docs/meets/contecsa_meet_2025-12-22.txt` (PO meeting, Caso Cartagena, SICOM discussion)
- `/Users/mercadeo/neero/contecsa/docs/research/Investigación Contecsa_ Contexto para Proyecto.md` (Strategic context, consorcios, risk analysis)
- `/Users/mercadeo/neero/contecsa/docs/research/Proceso Compras Infraestructura Colombia E2E.md` (E2E procurement process, technical controls)
- PRD.md (Feature requirements F01-F20)

**External References:**
- Infobae: "Gobernación del Atlántico está bajo la lupa por un megaproyecto" (October 31, 2024)
- INVIAS Standards: Artículos 450 (Asfalto), 630 (Concreto)
- NTC Standards: 396 (Slump), 3318 (Premezclado)
- DIAN: Resolución 000165 de 2023, Anexo Técnico 1.9 (Electronic Invoicing)
