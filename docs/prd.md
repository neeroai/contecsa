# Product Requirements Document - Contecsa Sistema de Inteligencia de Datos

Version: 1.0 | Date: 2025-12-24 11:15 | Owner: Javier Polo | Status: Draft

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Business Model & Multi-Tenant Architecture](#2-business-model--multi-tenant-architecture)
3. [Pain Points](#3-pain-points)
4. [Requirements](#4-requirements)
5. [Business Processes](#5-business-processes)
6. [User Personas](#6-user-personas)
7. [Key Insights & Success Factors](#7-key-insights--success-factors)
8. [Technology Stack](#8-technology-stack)
9. [Risks & Mitigation](#9-risks--mitigation)
10. [Questions for Product Owner](#10-questions-for-product-owner)

---

## 1. Project Overview

### 1.1 Project Summary

**Project Name:** Contecsa - Sistema de Inteligencia de Datos

**Client:** CONGLOMERADO TECNICO COLOMBIANO S.A.S. (CONTECSA S.A.S.)
- **NIT:** 802.005.436-1
- **Industry:** Infrastructure Construction - Civil Engineering
- **Headquarters:** Km 98+600 Vía Al Mar, Puerto Colombia, Atlántico, Colombia
- **Certification:** ISO 9001:2015

**Purpose:**
Replace legacy SICOM system (1970s-80s technology on failing physical server) with modern cloud-based platform featuring:
- Conversational AI agent for natural language reporting
- Real-time dashboards across 4 core modules (procurement, warehouse, technical, maintenance)
- WhatsApp-first interface for field users (non-negotiable for adoption)
- Multi-tenant architecture supporting Contecsa + 9 consortiums
- OCR/AI document processing to eliminate manual data entry
- Price anomaly detection to prevent overcharge incidents (Caso Cartagena)

**Business Impact:**
Prevent critical business failures:
- **Caso Cartagena (2025):** 3 invoices with concrete overcharges went undetected for 2 months, recovered only when supplier self-issued credit note
- **SICOM Server Risk:** Physical server from 1970s-80s "va a reventar" (will explode) - no backup, no cloud migration
- **Manual Process Fragility:** 28-field Excel tracking, "telepathic purchases," dual system entry, hours spent digitizing tickets/invoices one-by-one

**Current Phase:** Setup - Configuration baseline (no application code yet)

### 1.2 Users & Roles

**Primary Users (8-10 roles):**

| Role | Count | Primary Interface | Use Case |
|------|-------|-------------------|----------|
| **Gerencia** | 2-3 | Web dashboard (executive) | KPIs, financial projections, strategic insights |
| **Jefe Compras** | 1 | Web dashboard | Purchase pipeline, supplier compliance, approvals |
| **Procurement Staff** | 2 | Web dashboard | Create POs, manage requisitions, supplier registration |
| **Contabilidad** | 1 | Web dashboard | Invoice validation, payment approval, PO closure |
| **Técnico** | 1 | Hybrid (web + WhatsApp) | Bulk materials tickets, consumption tracking |
| **Almacén Clerk** | 1 | Web dashboard + WhatsApp notifications | Inventory management, approve warehouse transactions |
| **Mantenimiento** | 1 | WhatsApp (fuel) + Web (maintenance orders) | Fuel entry, machine cost tracking |
| **Campo (Field)** | Multiple | WhatsApp primary | Requisitions, warehouse exits, photo uploads |
| **Admin (Alberto)** | 1 | Web admin panel | Create consortiums, configure workflows, user management |

**Super User:** Liced Vega (Procurement lead) - appears in majority of purchase records, primary user for MVP testing

### 1.3 Problem Statement

**Legacy System (SICOM):**
- **Age:** 1970s-80s technology, Version 2 (no upgrades)
- **Infrastructure:** Single physical server (imminent failure risk)
- **Interface:** "Pantalla negra" (black screen terminal) - poor usability
- **Vendor Lock:** No new features without server upgrade or cloud migration
- **Data Access:** "Bodega de datos sin consultas ágiles" - data warehouse without agile queries

**Current Manual Process (Excel):**
- 55 purchases tracked manually with 28 fields per record
- Google Sheets shared across team
- Frequent unauthorized changes
- Quality certificates often missing (empty fields)
- No price anomaly detection

**Critical Incident - Caso Cartagena:**
- **Date:** Early 2025 (during Liced Vega's absence)
- **Issue:** 3 concrete invoices with overcharges
- **Detection Delay:** 2 months
- **Resolution:** Supplier self-issued credit note (relied on supplier honesty)
- **Root Cause:** Manual price monitoring, single point of failure (Liced Vega), no automated alerts

**Business Impact if Not Addressed:**
- Financial losses from undetected overcharges
- Server failure = revert to Excel (operational paralysis)
- Audit compliance failures (quality certificates not tracked)
- Inefficiency: Hours spent on manual data entry (technical tickets, fuel, invoices)
- User adoption failure: Complex systems bypassed ("telepathic purchases" via verbal requests)

### 1.4 Project Scope

**Phase 1 - Core Modules (Current Focus):**
1. **Procurement (Compras):** Requisitions, POs, master orders, supplier management, approvals, time tracking
2. **Warehouse (Almacén):** Multi-warehouse support, inventory tracking, entries/exits, reconciliation
3. **Technical Area (Técnico):** Bulk materials (sand, gravel, base), reverse PO process, ticket digitization
4. **Maintenance & Machinery (Maquinaria y Equipo):** Equipment tracking, spare parts flow, fuel management, cost consolidation

**Phase 2 - Deferred:**
- Engineering workflows (project progress, EVM tracking)
- Financial modules (cash flow beyond basic reporting)
- Automated invoice email processing (facturas@ mailbox monitoring)

**Out of Scope:**
- Project management tools (Jira-like features)
- Time tracking for employees
- Payroll or HR modules

---

## 2. Business Model & Multi-Tenant Architecture

**CRITICAL DISCOVERY:** Meeting with Alberto Ceballos (2025-12-24) revealed that Contecsa operates a **complex multi-tenant business model** not documented in previous requirements. This fundamentally changes the architecture from single-tenant to multi-tenant platform.

### 2.1 Contecsa's Dual Role

**Role 1: Independent Contractor**
- Contecsa executes construction projects directly as a contractor
- Uses own procurement system (SICOM → future system)
- Manages own warehouses, machinery, inventory
- Example: CONTECSA-ADMINISTRATIVO consortium (100% internal operations)

**Role 2: Consortium Administrator**
- Contecsa creates and manages 9+ consortiums (joint ventures with other companies)
- Each consortium = separate legal entity (e.g., PAVICONSTRUJC, EDUBAR-KRA50, PTAR Santo Tomás)
- Each consortium needs own software instance (separate tenant)
- Some consortiums hide Contecsa's participation for confidentiality (different email domains)

### 2.2 Active Consortiums Portfolio

| Consorcio | Participation % | Location | Purchase Activity % | Status |
|-----------|-----------------|----------|---------------------|--------|
| **PAVICONSTRUJC** | Major | Cartagena/Manga | 41.8% | Active |
| **EDUBAR-KRA50** | Major | Barranquilla | 14.5% | Active |
| **PTAR-SANTO TOMAS** | Partner | Santo Tomás | 10.9% | Active |
| **PTAR-JUAN DE ACOSTA** | Partner | Juan de Acosta | 7.3% | Active |
| **PARQUES DE BOLIVAR** | Partner | Bolívar | 7.3% | Active |
| **Consorcio Vipar 2024** | 50% | Mompox/Magangué | Small | Active |
| **CONTECSA-ADMINISTRATIVO** | 100% | Multi-site | 9.1% | Active |
| **CORDOBA** | Partner | Córdoba | Small | Active |
| **HIDROGUJIRA** | Partner | La Guajira | Small | Active |

**Total:** 9 active consortiums (PAVIC + EDUBAR + PTAR account for 67.2% of operations)

### 2.3 Three Procurement Scenarios

**Scenario A: Consortium Purchases Directly**
```
Consortium X → Purchase Order (in Consortium X tenant) → Warehouse Entry (in Consortium X tenant)
```
- No impact to Contecsa tenant
- Fully independent operation
- Standard single-tenant flow

**Scenario B: Contecsa Purchases for Consortium (via Cost Center) ⚠️ CRITICAL**
```
Contecsa → Purchase Order (in Contecsa tenant, cost center = Consortium X) →
Material arrives → Warehouse Entry (in Consortium X tenant, NOT Contecsa)
```
- **CURRENT PAIN POINT:** Requires dual entry (PO in Contecsa system, warehouse entry in Consortium system)
- **Alberto quote:** "Me toca entrar a los dos sistemas para poder confirmar las dos cosas" (lines 83-84)
- **REQUIREMENT:** System must cross-reference/integrate PO from Contecsa with warehouse entry in Consortium
- **Business Driver:** Eliminate manual dual entry, provide traceability

**Scenario C: Contecsa Purchases for Own Operations**
```
Contecsa → Purchase Order (in Contecsa tenant) → Warehouse Entry (in Contecsa tenant)
```
- Standard flow, no cross-tenant integration needed

### 2.4 Multi-Tenant Architecture Requirements

**R-MT1: Consortium as Tenant**
- Terminology: Use "Consorcio" (not "Proyecto") in UI
- Support both: Consortiums (separate legal entities) + Projects (Contecsa as contractor)
- Each consortium = separate tenant with isolated data

**R-MT2: One-Click Consortium Creation ⭐ PRIORITY**
- Admin button: "Crear nuevo consorcio"
- Auto-replicate ALL Contecsa configuration to new consortium tenant
- Wizard: Consortium name → Upload documentation → System auto-configures
- **Alberto quote:** "Un botoncito, crear nuevo consorcio" (lines 159-160)

**What Must Be Replicated:**
- Workflow configurations (approval chains, time thresholds)
- Invoice review processes
- Notification rules (recipients customizable per consortium)
- Alert thresholds (e.g., >30 days delay alert)
- All business logic and validation rules
- Product catalog (optional - TBD with Alberto)

**What Must Be Customizable Per Consortium:**
- Email notification addresses (different domains for confidentiality)
- Warehouse definitions (central + project sites)
- Cost centers
- User access (some consortiums hide Contecsa participation)
- Supplier relationships (consortium-specific suppliers)

**R-MT3: Configurable Email Domains Per Consortium**
- Each consortium can have different notification email addresses
- **Reason:** Some consortiums hide Contecsa participation
- Example: PAVICONSTRUJC may use @paviconstrujc.com (not @contecsa.com)
- System must route notifications to consortium-specific addresses

**R-MT4: Cross-Tenant Purchase Order Tracking ⚠️ CRITICAL**
- When Contecsa creates PO for consortium (via cost center):
  - PO created in Contecsa tenant
  - Warehouse entry created in Consortium tenant
  - System must cross-reference and show traceability
- **Eliminate dual entry requirement** (current major pain point)
- Possible implementation: Shared PO reference ID, API integration, or unified tracking table

**R-MT5: Consolidated Reporting Across Tenants**
- Dashboard must show:
  - Consortium X purchases (made by consortium directly)
  - + Contecsa purchases for Consortium X (via cost center)
  - = Total spending for Consortium X
- User must be able to filter: View by consortium OR view consolidated
- Example report: "Show me all fuel costs for Consortium X across all cost centers"

### 2.5 Warehouse Complexity in Multi-Tenant Model

**Contecsa Warehouses:**
- Central warehouse (office)
- Project site warehouses (per project)

**Consortium Warehouses:**
- Always 2 per consortium: Central + Project Site
- Can include virtual "Contecsa warehouse" within consortium software (when materials arrive at Contecsa first)

**Cross-Tenant Warehouse Scenario:**
- Purchase order created in Contecsa (for Consortium X via cost center)
- Material physically arrives at Contecsa facility
- Warehouse entry created in Consortium X tenant under "Contecsa warehouse" location
- **Current:** Requires manual dual entry (PO in Contecsa, entry in Consortium)
- **Future:** Auto-sync/cross-reference via R-MT4

### 2.6 Data Isolation vs Shared Resources

**Data Isolation (Per Consortium):**
- User accounts and permissions
- Email domains and notification recipients
- Warehouse definitions
- Project-specific data (POs, invoices, entries)
- Financial data (spending, budgets)

**Potentially Shared (TBD - Questions for Alberto):**
- Product catalog (master list of materials)
- Supplier master data (if supplier works with multiple consortiums)
- Contecsa machinery (tracked in Contecsa tenant, fuel allocated via cost centers)

---

## 3. Pain Points

Based on meeting analysis with Alberto Ceballos (2025-12-24), 23 pain points identified across 7 categories:

### 3.1 SICOM Legacy System (Critical)

**P1: Technology Risk - Server Failure Imminent**
- **Issue:** Antiquated language (1970s-80s era), single physical server (no backup, no cloud)
- **Alberto quote:** "Yo digo que este año va a reventar" (line 721) - "I say this year it will explode"
- **Impact:** Server replacement cost: 15-17 million COP + migration 1-2 million COP
- **Fallback:** "Nos volvamos al Excel" (line 1413) - revert to Excel if SICOM fails
- **Severity:** CRITICAL - Single point of failure for entire operation

**P2: Version Lock-in**
- **Issue:** Current SICOM Version 2 (no upgrades available)
- **Blocker:** Vendor requires server upgrade OR cloud migration to access new features
- **Impact:** Feature requests unfulfilled due to infrastructure limitations
- **Severity:** HIGH

**P3: Black Screen Interface**
- **Issue:** Terminal-style interface ("pantalla negra"), poor usability, steep learning curve
- **Impact:** User resistance, training overhead
- **Severity:** MEDIUM

**P4: Data Warehouse Without Analytics**
- **Quote:** "Bodega de datos sin consultas ágiles" - data warehouse without agile queries
- **Impact:** Data exists but difficult to extract insights, requires manual Excel exports
- **Severity:** HIGH

### 3.2 Procurement Process Pain Points

**P5: Dual System Entry ⚠️ CRITICAL**
- **Issue:** When Contecsa purchases for consortium via cost center:
  - Purchase order in Contecsa system
  - Warehouse entry in consortium system
  - No cross-reference or traceability
- **Alberto quote:** "Me toca entrar a los dos sistemas para poder confirmar las dos cosas" (lines 83-84)
- **Impact:** Inefficiency (double work), error-prone, no audit trail
- **Severity:** CRITICAL

**P6: Requisition Process Abandoned**
- **Issue:** SICOM has requisition module, but users don't use it
- **Root Cause:** "No tiene tiempo, no sé qué" (line 1047) - too complex, time-consuming
- **Workaround:** Email-based requisitions (field staff email → manager approves → procurement creates requisition retroactively)
- **Impact:** Procurement staff duplicates work that field staff should do
- **Severity:** HIGH

**P7: Telepathic Purchases**
- **Alberto quote:** "Aquí aparecían compras telepáticas" (line 1123) - "Telepathic purchases appeared here"
- **Issue:** Requests made verbally, WhatsApp, or "telepáticamente" (telepathically)
- **Impact:** No traceability, disputes about timing ("I told you a month ago")
- **Resolution:** Force email trail for accountability
- **Severity:** MEDIUM (mitigated by email requirement)

**P8: Time-Consuming Manual Data Entry**
- **Issue:** Technical area (bulk materials) requires one-by-one ticket entry
- **Quote:** "Se demora mucho en la revisión... hay que digitar uno a uno" (lines 359-362)
- **Process:** Excel review → manual system entry (hours per month)
- **Severity:** HIGH

**P9: Fuel Entry Manual Process**
- **Issue:** Person manually digitizes fuel tickets one-by-one from photos
- **Impact:** Repetitive, error-prone, no automation
- **Severity:** MEDIUM

**P10: Certificate of Quality Management Gap**
- **Issue:** Purchase orders close but quality certificates not managed
- **Evidence:** Excel shows frequent empty certificate fields (from previous analysis)
- **Impact:** No blocking mechanism to enforce certificate upload before payment
- **Compliance Risk:** Recent audit finding
- **Severity:** HIGH

### 3.3 Inventory/Warehouse Pain Points

**P11: Field Inventory Tracking Impossible**
- **Issue:** Site warehouses difficult to keep real-time accurate
- **Current Process:** Site staff photo → Office warehouse clerk manually enters → Never matches reality
- **Alberto quote:** "Cuando tú vas a la realidad, eso no va a cuadrar nunca" (lines 258-260) - "When you go to reality, it will never match"
- **Reason:** Materials consumed irregularly (rebar runs out, partial consumption)
- **Acceptance:** Alberto accepts discrepancies: "Siempre va a dar su descuadre" (line 261)
- **Desire:** Simpler process, even if not perfect accuracy
- **Severity:** MEDIUM (accepted reality)

**P12: Duplicate Product Creation**
- **Issue:** Users create duplicate items (same product, different code/name)
- **Impact:** No central product catalog enforcement, inventory fragmentation
- **Potential Solution:** AI duplicate detection
- **Severity:** MEDIUM

**P13: Concrete Specifications**
- **Issue:** Concrete has many variants (MR45, accelerated 7-day, 20-day, etc.)
- **Impact:** Must be very specific in purchase orders (price varies significantly)
- **Requirement:** Detailed product catalog with variants
- **Severity:** MEDIUM

### 3.4 Maintenance/Machinery Pain Points

**P14: Cost Tracking Across Systems**
- **Issue:** Machinery moves between consortiums, fuel tracked in Contecsa system (can't split across consortium systems)
- **Reason:** Need consolidated fuel report per machine across all projects
- **Current:** Use cost centers within Contecsa
- **Limitation:** Can't consolidate if fuel is in separate consortium systems
- **Severity:** MEDIUM

**P15: Spare Parts Cost Allocation**
- **Issue:** Complex flow: Spare parts enter warehouse (asset) → Maintenance order created → parts issued → cost transfers to machine
- **Requirement:** Track cost per machine = parts + services + fuel
- **Validation Need:** Total purchases = warehouse inventory + machine costs
- **Severity:** MEDIUM

**P16: Service Tracking**
- **Issue:** Services (maintenance, washing) charged to maintenance orders
- **Requirement:** Consolidate service costs + parts costs per machine
- **Need:** Cross-module reporting
- **Severity:** MEDIUM

### 3.5 Reporting/Analytics Pain Points

**P17: Manual Excel Analysis**
- **Issue:** Export data from SICOM → Excel pivot tables → manual analysis
- **Impact:** Time-consuming, not real-time
- **Example:** Concrete purchase analysis requires export → filter → pivot table
- **Severity:** HIGH

**P18: No Cost Center Consolidation**
- **Issue:** Purchase data split across Contecsa + multiple consortiums
- **Impact:** Can't easily consolidate spending by cost center
- **Current:** Manual aggregation required
- **Severity:** HIGH

**P19: Cross-Module Data Reconciliation**
- **Issue:** Technical area reports 1,000 million in purchases, but Procurement doesn't match
- **Quote:** "Toda esa información debe cuadrar" (line 622) - "All that information must match"
- **Current:** Manual reconciliation, frequent discrepancies
- **Severity:** HIGH

**P20: Machine Profitability Analysis Missing**
- **Requirement:** Revenue per machine - Costs per machine = Profit per machine
- **Costs:** Parts + services + fuel
- **Current:** Difficult to consolidate across modules
- **Severity:** MEDIUM

### 3.6 Document Management Pain Points

**P21: Supplier Documentation Not Enforced**
- **Issue:** SICOM has document attachment feature (green/yellow/red indicators), but NOT currently used
- **Current:** Documents stored in Google Drive instead
- **Compliance Gap:** Environmental licenses now mandatory (recent audit requirement)
- **Need:** Matrix defining: Supplier type → Required documents (RUT, Chamber of Commerce, bank certificate, environmental license, etc.)
- **Severity:** HIGH

**P22: No Automated Document Capture**
- **Issue:** All documents manually uploaded, no data extraction
- **Opportunity:** OCR/AI could extract data from uploaded documents
- **Alberto desire:** Upload RUT → System extracts supplier data automatically
- **Severity:** MEDIUM (opportunity for efficiency)

### 3.7 User Adoption Pain Points

**P23: Complexity Drives Non-Compliance**
- **Quote:** "Si no empiezan a decir: no, que yo no lo entiendo, que no tengo tiempo, que es muy complicado" (lines 1147-1150) - "If they don't start saying: no, I don't understand, I don't have time, it's too complicated"
- **Philosophy:** Remove excuses by simplifying interfaces
- **Solution:** WhatsApp (everyone knows how to use it)
- **Quote:** "Todo el mundo maneja WhatsApp, se acabó el tema" (lines 1153-1158) - "Everyone uses WhatsApp, end of discussion"
- **Severity:** CRITICAL (adoption barrier)

---

## 4. Requirements

60+ requirements organized across 12 functional modules. Priority: P0 (must-have Phase 1), P1 (should-have Phase 1), P2 (Phase 2)

### 4.1 Multi-Tenant Management (5 Requirements)

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| R-MT1 | Consortium as Tenant | P0 | Use "Consorcio" not "Proyecto" in UI. Support both consortiums (separate legal entities) + projects (Contecsa as contractor) |
| R-MT2 | One-Click Consortium Creation | P0 | Admin button "Crear nuevo consorcio" → wizard → auto-replicate ALL Contecsa config. Alberto quote: "Un botoncito" (line 159) |
| R-MT3 | Configurable Email Domains Per Consortium | P0 | Each consortium can have different notification email addresses (different domains for confidentiality) |
| R-MT4 | Cross-Tenant PO Tracking | P0 | When Contecsa creates PO for consortium (via cost center): PO in Tenant A, warehouse entry in Tenant B, system cross-references automatically. **Eliminate dual entry** |
| R-MT5 | Consolidated Reporting Across Tenants | P1 | Dashboard shows: Consortium X direct purchases + Contecsa purchases for X (cost center) = Total. Filter by consortium or consolidated |

### 4.2 Supplier Management (6 Requirements)

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| R-SUPP1 | Supplier Self-Service Portal | P1 | Suppliers register themselves, fill form, upload required documents, submit for approval |
| R-SUPP2 | Admin Supplier Creation | P0 | Alternative: Admin creates supplier manually (for small suppliers without computer access) |
| R-SUPP3 | Document Matrix by Supplier Type | P0 | Matrix defines: Supplier type → Required documents. System blocks supplier activation if missing mandatory documents |
| R-SUPP4 | Document Status Indicators | P1 | Green: All documents complete. Yellow: Missing documents. Red/Transparent: Not compliant, cannot create POs |
| R-SUPP5 | OCR Document Extraction | P1 | Upload RUT → System extracts: NIT, legal name, address, legal representative. Upload bank certificate → extracts bank, account. Minimize manual entry |
| R-SUPP6 | Controlled vs Non-Controlled Suppliers | P1 | Flag suppliers as "controlled" (regular, audited) vs "non-controlled" (occasional). Different document/approval requirements |

### 4.3 Procurement (6 Requirements)

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| R-PROC1 | WhatsApp-Based Requisitions | P0 | Field staff send requisition via WhatsApp (text + photos). AI chatbot captures details, creates requisition, routes for approval. Manager approves via WhatsApp. **NON-NEGOTIABLE** |
| R-PROC2 | Email Traceability | P0 | All requisitions must have audit trail. Timestamp of request, approval, order creation. Eliminate "telepathic purchases" |
| R-PROC3 | Purchase Order Workflow with Time Tracking | P0 | Requisition → Approval → PO → Payment/Credit → Receipt → Certificate → Closure. Time tracking per stage. Alerts for delays (>30 days per stage) |
| R-PROC4 | Master Orders (Contratos Marco) | P0 | Create master order: Supplier, item, price, payment terms. No quantities (open-ended for bulk materials). Individual POs reference master order |
| R-PROC5 | Supplier Price Locking | P1 | POs inherit price from master order. Price change requires authorization/justification. Prevents unauthorized price modifications |
| R-PROC6 | Treasury Time Tracking (Separate from Procurement) | P1 | Payment stage is NOT procurement responsibility. Separate time tracking: "PO sent to payment" → "Payment confirmed" → "Product received". Different KPI owner (Treasury) |

### 4.4 Inventory/Warehouse (7 Requirements)

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| R-INV1 | Central Product Catalog (Mandatory) | P0 | All products must be created before requisition. Procurement responsible for product creation. Users cannot create products (prevents duplicates) |
| R-INV2 | AI Duplicate Detection | P1 | When creating product, AI checks for similar names/codes. Alert: "Similar product already exists: XYZ" |
| R-INV3 | Product Variants | P0 | Support complex variants (e.g., Concrete: MR45, MR45-7day, MR45-20day, MR45-accelerated). Each variant has different price |
| R-INV4 | WhatsApp-Based Warehouse Transactions | P0 | Site staff send photo via WhatsApp: "Salida de bodega, 3 rebar bundles, Project X". AI extracts warehouse, items, quantities, project. Creates pending exit. Office clerk approves. **CRITICAL for adoption** |
| R-INV5 | Multi-Warehouse Support | P0 | Contecsa warehouses: Central + Project sites. Consortium warehouses: Central + Project sites (per consortium). Virtual warehouses (e.g., "Contecsa warehouse" within consortium) |
| R-INV6 | Inventory Reconciliation Reports | P1 | Periodic inventory adjustments (expected vs actual). Alberto accepts discrepancies: "Siempre va a dar su descuadre" (line 261). Goal: Simplest process, acceptable accuracy |
| R-INV7 | Warehouse Entry/Exit Tracking | P0 | Entries: From PO receipt. Exits: To maintenance orders, to projects, to other warehouses. Transfers between warehouses |

### 4.5 Technical Area - Bulk Materials (5 Requirements)

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| R-TECH1 | Reverse PO Process | P0 | Master order created (no quantities, just price per unit). Engineering requests materials continuously. Supplier delivers, provides detailed delivery tickets. Monthly review: Tickets reviewed → Detailed PO created retroactively. Alberto quote: "Legalizamos posterior" (line 343) |
| R-TECH2 | WhatsApp Ticket Submission | P0 | Supplier sends delivery tickets via WhatsApp (or staff uploads). Currently: Excel template provided to supplier. Future: Upload to chatbot → AI digitizes tickets → deduplicates → creates PO |
| R-TECH3 | Ticket Deduplication | P1 | Tickets often duplicated across submissions. AI must detect and skip duplicate tickets (by ticket number + date) |
| R-TECH4 | Bulk Material Types | P0 | Sand, crushed stone, base, sub-base. Charged by volume or movement (cubic meters, trips). Support tracking: Quantity, unit, price per unit |
| R-TECH5 | Cross-Module Reconciliation | P1 | Technical area total purchases MUST match procurement total purchases. Validation rule: If Technical reports 1B, Procurement should be ≥1B. System generates reconciliation report |

### 4.6 Maintenance & Machinery (9 Requirements)

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| R-MAINT1 | Equipment Master Data | P0 | Create equipment: Contecsa-owned + supplier/rented equipment. Both types can receive fuel (need to be in system) |
| R-MAINT2 | Preventive Maintenance Scheduling | P1 | Maintenance calendar (e.g., A/C maintenance every 6 months). Alerts for upcoming maintenance. Alberto notes: Feature existed in SICOM but not working |
| R-MAINT3 | Maintenance Order Cost Tracking | P0 | Maintenance order created for machine. Spare parts issued from warehouse → cost transfers to machine. Services charged to order → cost to machine. Fuel charged (via cost center) |
| R-MAINT4 | Spare Parts Flow | P0 | Purchase → Warehouse entry (asset on balance sheet). Maintenance order → Issue parts → Cost transfers to machine (expense). Inventory value decreases, machine cost increases |
| R-MAINT5 | Machine Cost Consolidation | P0 | Total machine cost = Spare parts + Services + Fuel. Report: Cost per machine over period. Validation: Total purchases = Warehouse inventory + Total machine costs |
| R-MAINT6 | Machine Revenue Tracking (Future) | P2 | Track revenue generated by machine (billable hours/days). Machine P&L: Revenue - (Parts + Services + Fuel) = Profit. Alberto quote: "Ármame el estado por máquina" (line 489) |
| R-MAINT7 | Fuel Tracking by Machine | P0 | Three fuel categories: Línea Blanca (trucks, pickups, generators), Línea Amarilla (heavy machinery), Volcos (large trucks). All tracked in Contecsa system (even for consortium projects). Reason: Machine moves between consortiums |
| R-MAINT8 | WhatsApp Fuel Entry | P0 | Fuel attendant sends photo of fuel tickets via WhatsApp. Currently: Manually digitizes one-by-one. Future: AI extracts data → creates fuel entries → routes for approval |
| R-MAINT9 | Cost Center Fuel Allocation | P0 | When machine works on consortium project, fuel charged via cost center. Enables reporting: Fuel consumed by consortium (despite being in Contecsa system) |

### 4.7 Notifications & Alerts (6 Requirements)

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| R-NOTIF1 | Multi-Channel Notifications | P0 | Email + WhatsApp for all alerts. User preference: Choose channels per alert type |
| R-NOTIF2 | Workflow Alerts | P0 | Requisition pending approval. PO pending creation. Payment pending. Product overdue for receipt (>30 days from payment). Certificate missing (blocks payment/closure) |
| R-NOTIF3 | Inventory Alerts | P1 | Stock below minimum threshold. Reorder point triggered |
| R-NOTIF4 | Maintenance Alerts | P1 | Preventive maintenance due. Machine downtime alert |
| R-NOTIF5 | Daily Summary | P1 | Role-based: Each user receives summary of pending tasks. Example: Procurement sees pending approvals, overdue receipts. Example: Warehouse sees pending entries/exits |
| R-NOTIF6 | Configurable per Consortium | P0 | Each consortium has different notification email addresses. System must route notifications to consortium-specific addresses |

### 4.8 OCR & Document Processing (4 Requirements)

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| R-OCR1 | Invoice OCR via WhatsApp | P0 | User sends invoice photo via WhatsApp. AI extracts: Supplier, invoice number, date, total, line items. Creates pending invoice in system. Routes to analyst for approval (not auto-approved) |
| R-OCR2 | Delivery Ticket OCR | P0 | For bulk materials (technical area). Extract: Ticket number, date, material type, quantity, unit |
| R-OCR3 | Fuel Ticket OCR | P0 | Extract: Date, machine ID, fuel type, gallons, cost |
| R-OCR4 | Supplier Document OCR | P1 | RUT, Chamber of Commerce, bank certificates. Extract key data to pre-fill supplier registration |

### 4.9 Reporting & Analytics - AI Agent (6 Requirements)

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| R-REPORT1 | Conversational AI Agent | P0 | Natural language queries: "Muéstrame gráfica de combustible último trimestre". AI generates charts, tables, reports on demand. Access to all data across modules |
| R-REPORT2 | Dashboard by Role | P0 | Gerente General: Executive KPIs, financial projections. Jefe de Compras: Purchase pipeline, delays, spending trends. Contabilidad: Invoices pending approval, payment status. Técnico: Materials consumption by project. Almacén: Inventory levels, pending transactions |
| R-REPORT3 | Historical Price Analysis | P0 | Track item prices over time. Detect anomalies: Price increase >10% from last purchase. Alert: "Precio de cemento subió 15% vs promedio 6 meses". **PREVENT CASO CARTAGENA** |
| R-REPORT4 | Cross-Module Consolidation | P1 | Procurement total = Technical total + Direct purchases. Warehouse value + Machine costs = Total purchases. Fuel by machine across all consortiums |
| R-REPORT5 | Export to Google Sheets | P1 | Users familiar with Sheets. One-click export of reports/tables to Sheets. Maintain compatibility with current workflows |
| R-REPORT6 | Machine P&L Report (Future) | P2 | Revenue per machine. Cost per machine (parts + services + fuel). Profit per machine |

### 4.10 Integration & Authentication (4 Requirements)

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| R-INTEG1 | Google Workspace SSO | P0 | SSO via Google accounts. No separate username/password. Reduces friction, improves adoption. Alberto quote: "Ahí es donde empieza Cristo a padecer" (line 1473) - referring to managing separate credentials |
| R-INTEG2 | SICOM Data Migration | P0 | Extract historical data from SICOM. One-time migration to new system. SICOM is read-only, old language, on physical server |
| R-INTEG3 | Email Integration (Phase 2) | P2 | Automated invoice email processing. Facturas@ mailbox monitoring. Auto-reject malformed invoices. Send notifications to suppliers re: issues |
| R-INTEG4 | WhatsApp Business API | P0 | Bidirectional communication. User sends message → AI responds. System sends alerts → User receives on WhatsApp. Critical for field adoption |

### 4.11 Quality & Compliance (4 Requirements)

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| R-QUAL1 | Certificate Blocking | P0 | Cannot close purchase without quality certificates. Technical area must validate and upload. Contabilidad cannot pay/close until certificates uploaded. Alberto quote: "No se puede cerrar hasta aquí la documentación de calidad" (lines 213-215) |
| R-QUAL2 | Document Compliance Matrix | P0 | Supplier type → Required documents (configurable). System enforces: Cannot activate supplier without compliance |
| R-QUAL3 | Environmental Documentation | P0 | Recent audit finding: Environmental licenses not tracked. Add to supplier document matrix. Flag suppliers requiring environmental compliance |
| R-QUAL4 | Traceability/Audit Trail | P0 | Every action logged: Who, what, when. Requisition → Approval → PO → Payment → Receipt → Closure. Emails, WhatsApp messages linked to transactions |

### 4.12 User Experience (5 Requirements)

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| R-UX1 | Simplicity Over Features | P0 | Alberto philosophy: Remove complexity to drive adoption. WhatsApp removes all excuses ("no time," "don't understand," "too complex") |
| R-UX2 | Mobile-First for Field Users | P0 | Site staff, warehouse staff, maintenance staff use mobile. WhatsApp chatbot as primary interface. Minimal app download requirements |
| R-UX3 | Desktop for Office Users | P0 | Procurement, accounting, management use web dashboard. Rich analytics, multi-module views |
| R-UX4 | Role-Based UI | P0 | Each role sees only relevant modules. Modules appear in left sidebar based on permissions |
| R-UX5 | Modern Visual Design | P1 | Alberto shown mockup: "Última tecnología" (line 1565). Charts, graphs, clean interface. Contrast to SICOM "black screen" |

---

## 5. Business Processes

6 detailed business processes documenting current state (pain points) vs future state (with new system)

### 5.1 Procurement Process

**Current State (Email-Based):**

**Step 1: Requisition**
- **Ideal (not happening):** User creates requisition in SICOM
- **Actual:** User sends email to manager with purchase request
- **Why:** SICOM requisition module too complex/time-consuming

**Step 2: Approval**
- Manager replies to email: "Autorizado"
- Email timestamp = official approval time (SLA starts)

**Step 3: Procurement Creates Requisition**
- Procurement staff manually creates requisition in system
- **Pain Point:** Duplicates work that field staff should have done
- Fills in all details from email

**Step 4: Purchase Order Creation**
- Procurement creates PO from requisition
- Selects supplier, items, quantities, prices
- References master order if exists (price locked)

**Step 5: Send to Payment or Supplier**
- **Option A (Credit):** Send PO to supplier directly → Start receipt countdown
- **Option B (Prepay):** Send to Treasury for payment → Wait for payment confirmation → Then receipt countdown

**Step 6: Payment (if applicable)**
- Treasury pays invoice
- Reports payment confirmation
- Receipt countdown starts

**Step 7: Receipt**
- Product arrives at warehouse
- Warehouse entry created
- **For consortium purchases via Contecsa cost center:** Manual dual entry required (Contecsa + Consortium)

**Step 8: Quality Certificates**
- Technical area validates product
- Uploads quality certificates
- **Current:** Often skipped (Excel shows many blanks)
- **Should block:** Cannot close PO without certificates

**Step 9: Closure**
- Accounting closes PO
- Marks transaction complete

**Future State (WhatsApp-Enabled):**

**Step 1: Requisition via WhatsApp**
- Field user sends WhatsApp: "Necesito 50 sacos cemento, Proyecto X, urgente"
- Optionally includes photos (product specs, site conditions)

**Step 2: AI Captures Requisition**
- Chatbot extracts: Item, quantity, project, urgency
- Creates requisition draft
- Asks clarifying questions if needed

**Step 3: Manager Approval via WhatsApp**
- Manager receives notification: "Requisición pendiente: 50 sacos cemento, Proyecto X"
- Replies: "Aprobar" or "Rechazar [reason]"
- System updates requisition status

**Step 4: Procurement Reviews**
- Procurement sees approved requisition (already in system)
- **No need to recreate from email**
- Creates PO directly

**Steps 5-9:** Same as current, but with better tracking/notifications

### 5.2 Bulk Materials Process (Technical Area)

**Current Process:**

**Step 1: Master Order**
- Create master contract: Supplier X provides gravel at $2,000/m³
- Payment terms: Net 15
- No quantities (open-ended)

**Step 2: Continuous Delivery**
- Engineering requests materials as needed (ongoing)
- Supplier delivers to site
- Provides delivery tickets (daily/weekly)

**Step 3: Monthly Ticket Collection**
- Supplier sends all tickets for month
- Currently: Excel template → Supplier fills → Sends file
- Or: Paper tickets → Staff photographs

**Step 4: Manual Review**
- Staff reviews tickets one-by-one in Excel
- Checks for duplicates (ticket number repeat)
- Calculates totals per material type
- **Pain Point:** "Se demora mucho en la revisión... hay que digitar uno a uno" (lines 359-362)

**Step 5: Retroactive PO**
- Create detailed PO: "March deliveries: 500 m³ gravel @ $2,000 = $1,000,000"
- References master order
- Enters into SICOM

**Future Process (AI-Enabled):**

**Steps 1-2:** Same

**Step 3: WhatsApp Ticket Upload**
- Supplier or staff sends tickets via WhatsApp (photos or documents)

**Step 4: AI Digitization**
- AI extracts: Ticket #, date, material, quantity, price
- Detects duplicates automatically
- Flags anomalies (price variance, unusual quantity)

**Step 5: Review & Approval**
- Staff reviews AI-extracted data (much faster)
- Approves/corrects as needed

**Step 6: Auto-Generate PO**
- System creates PO from approved tickets
- References master order

### 5.3 Warehouse Management Process

**Current Process (Office Warehouse):**

**Entry:**
- PO fulfilled → Product arrives
- Warehouse clerk creates entry in SICOM
- Links to PO, updates inventory

**Exit:**
- Maintenance order, project request, or transfer
- Warehouse clerk creates exit in SICOM
- Updates inventory, transfers cost (if to maintenance order)

**Current Process (Site Warehouse):**

**Entry:**
- Product arrives at site
- Site staff photographs delivery document
- Sends photo to office warehouse clerk
- Office clerk manually creates entry in SICOM

**Exit:**
- Site staff handwrites exit slip
- Photographs slip
- Sends to office clerk
- Office clerk manually creates exit in SICOM

**Problem:** "Eso no va a cuadrar nunca" (line 259) - inventory always has discrepancies

**Future Process (WhatsApp-Enabled):**

**Entry (Site):**
- Site staff sends WhatsApp: [photo] "Llegó cemento, 100 sacos, Proyecto X"
- AI extracts data, creates pending entry
- Office clerk receives notification, approves
- System records entry

**Exit (Site):**
- Site staff sends WhatsApp: [photo] "Salida 3 bultos varilla, bodega obra"
- AI extracts data, creates pending exit
- Office clerk approves
- System records exit, updates inventory

**Benefit:** Faster, same accuracy (or better), less manual typing

### 5.4 Maintenance & Machinery Process

**Spare Parts Flow:**

**Step 1: Purchase**
- PO for spare parts → Warehouse entry
- Cost on balance sheet (asset: inventory)

**Step 2: Maintenance Order**
- Machine requires maintenance → Create maintenance order
- Issue parts from warehouse to maintenance order
- Cost transfers from inventory to machine (expense)

**Step 3: Service Addition**
- External service (e.g., mechanic labor, washing)
- Charge service to maintenance order
- Cost to machine

**Step 4: Close Order**
- Maintenance complete
- Order closed
- Total cost = Parts + Services (recorded against machine)

**Fuel Flow:**

**Step 1: Fuel Purchase**
- Purchase fuel (PO or prepaid account)

**Step 2: Fuel Dispensing**
- Machine refuels (at site or fuel station)
- Fuel ticket generated (machine ID, gallons, date)

**Step 3: Ticket Entry**
- Currently: Manual entry one-by-one
- Future: Photo via WhatsApp → AI extracts → Entry created

**Step 4: Cost Allocation**
- Fuel cost assigned to machine
- If machine on consortium project, use cost center for reporting

**Consolidation:**
- Total machine cost = Parts + Services + Fuel
- Validation: Total purchases = Warehouse inventory + All machine costs

### 5.5 Supplier Registration Process

**Current (SICOM):**
- Admin creates supplier manually in SICOM
- Document upload feature exists (unused)
- Documents stored in Google Drive separately

**Future (Two Modes):**

**Mode 1: Supplier Self-Service**
- Send supplier portal link
- Supplier fills form: Name, NIT, address, contact, type
- Uploads required documents (per matrix):
  - RUT
  - Chamber of Commerce certificate
  - Bank certificate
  - Legal representative ID
  - Environmental license (if applicable)
- Submits for approval

**Mode 2: Admin Creates**
- For small suppliers without computer access
- Admin manually creates supplier
- Uploads documents on behalf of supplier

**Approval Flow:**
- System validates: All required documents uploaded?
- Green: Complete → Supplier active, can receive POs
- Yellow: Incomplete → Supplier pending, cannot receive POs
- Admin reviews documents, activates supplier

**OCR Enhancement:**
- Admin uploads RUT PDF
- AI extracts: NIT, legal name, address, legal representative
- Auto-fills supplier form (admin verifies)

### 5.6 Cross-Tenant Purchase Flow (NEW - Multi-Tenant Specific)

**Scenario B: Contecsa Purchases for Consortium via Cost Center**

**Step 1: Requisition (Consortium Project)**
- Field user at consortium project sends WhatsApp requisition
- Requisition captured with project = Consortium X

**Step 2: Purchase Decision**
- Manager approves
- **Decision:** Purchase through Contecsa (via cost center) OR purchase through Consortium directly

**Step 3A: If Purchase via Contecsa (Scenario B)**
- Procurement creates PO in **Contecsa tenant**
- Cost center = Consortium X
- PO sent to supplier

**Step 4: Material Delivery**
- Material arrives (at Contecsa warehouse OR at Consortium site)

**Step 5: Warehouse Entry**
- If material at Consortium site:
  - Warehouse entry created in **Consortium X tenant** (NOT Contecsa)
  - Warehouse = Project Site (Consortium X)
- If material at Contecsa warehouse first:
  - Warehouse entry created in **Consortium X tenant**
  - Warehouse = "Contecsa" (virtual warehouse within Consortium)

**Step 6: Cross-Tenant Reconciliation (R-MT4)**
- System cross-references:
  - PO #12345 in Contecsa tenant (cost center = Consortium X)
  - Warehouse entry #WE-987 in Consortium X tenant
- Links created automatically (API integration or shared reference table)
- Dashboard shows full traceability:
  - Contecsa view: "PO #12345 received in Consortium X warehouse (WE-987)"
  - Consortium view: "Warehouse entry #WE-987 from Contecsa PO #12345"

**Step 7: Reporting**
- Consolidated report:
  - Consortium X total spending = Direct POs (in Consortium tenant) + Contecsa POs (in Contecsa tenant, cost center X)

**Alternative: If Purchase via Consortium (Scenario A)**
- Procurement creates PO in **Consortium X tenant**
- Warehouse entry in **Consortium X tenant**
- No cross-tenant integration needed

---

## 6. User Personas

8 detailed user personas with primary interfaces, use cases, pain points, and success metrics

### 6.1 Field Staff (Site Engineers, Foremen)

**Primary Interface:** WhatsApp

**Use Cases:**
- Create requisitions (materials, tools, services)
- Report warehouse exits (materials consumed on site)
- Upload photos (delivery tickets, site conditions, product defects)
- Receive notifications (requisition status, approvals, delays)

**Pain Points:**
- **P6:** Requisition process abandoned (too complex, no time)
- **P7:** "Telepathic purchases" (verbal requests, no traceability)
- **P11:** Field inventory tracking impossible (manual photo → clerk entry → never accurate)

**Needs:**
- Simple, fast interface (WhatsApp)
- No training required
- Works on any mobile device
- No separate app download

**Success Metrics:**
- 90%+ of requisitions created via WhatsApp (not email)
- <2 min to create requisition (vs 10+ min in SICOM)
- 80%+ user satisfaction (ease of use)

**Quote:** Alberto: "Todo el mundo maneja WhatsApp, se acabó el tema" (lines 1153-1158)

### 6.2 Procurement Staff (Liced Vega + Team)

**Primary Interface:** Web Dashboard

**Count:** 2-3 users (Jefe Compras + 2 auxiliares)

**Use Cases:**
- Review approved requisitions (created via WhatsApp)
- Create purchase orders (POs)
- Manage suppliers (registration, document compliance, approvals)
- Track procurement pipeline (requisition → PO → receipt → closure)
- Monitor supplier performance (delivery times, quality issues)
- Respond to alerts (overdue receipts, missing certificates, price anomalies)

**Pain Points:**
- **P6:** Duplicating work (recreating requisitions from emails)
- **P5:** Dual system entry (PO in Contecsa, warehouse entry in Consortium)
- **P8:** Time-consuming manual data entry (technical tickets)
- **P10:** Certificate management gap (no blocking mechanism)

**Needs:**
- Requisitions pre-created by field users (via WhatsApp)
- Single system (no dual entry)
- Automated alerts (delays, missing items)
- Price anomaly detection (prevent Caso Cartagena)
- Supplier document compliance (enforced by system)

**Success Metrics:**
- 50%+ reduction in time to create PO (requisition already in system)
- 0 instances of dual entry (cross-tenant automation)
- 100% certificate compliance before PO closure
- 0 overcharge incidents (price anomaly alerts)

**Super User:** Liced Vega (appears in majority of purchase records, primary MVP tester)

### 6.3 Warehouse Clerk

**Primary Interface:** Web Dashboard + WhatsApp Notifications

**Count:** 1 user

**Use Cases:**
- Approve warehouse entries initiated by field (via WhatsApp)
- Approve warehouse exits initiated by field (via WhatsApp)
- Manage inventory (stock levels, reorder points, reconciliation)
- Transfer materials between warehouses
- Receive notifications (pending approvals, stock alerts)

**Pain Points:**
- **P11:** Manual entry from photos (site staff photo → clerk types one-by-one)
- **P11:** Inventory never matches reality ("Eso no va a cuadrar nunca")

**Needs:**
- Automated data extraction (AI reads photos, pre-fills entries)
- Approval workflow (not full manual entry)
- Accept inventory discrepancies (Alberto: "Siempre va a dar su descuadre" - line 261)
- Simpler process > perfect accuracy

**Success Metrics:**
- 70%+ reduction in time per warehouse transaction (AI extraction)
- 90%+ of field transactions approved within 1 hour
- Inventory variance <15% (acceptable threshold)

### 6.4 Technical Area Staff

**Primary Interface:** Hybrid (Web + WhatsApp)

**Count:** 1 user

**Use Cases:**
- Upload bulk materials tickets (via WhatsApp)
- Review AI-extracted ticket data (web dashboard)
- Approve/correct digitized tickets
- Generate retroactive POs (from approved tickets)
- Track materials consumption by project
- Reconcile technical area purchases with procurement totals

**Pain Points:**
- **P8:** Time-consuming manual data entry ("Se demora mucho... hay que digitar uno a uno" - lines 359-362)
- **P8:** Tickets duplicated across submissions (manual deduplication)

**Needs:**
- OCR ticket extraction (AI reads photos, extracts data)
- Duplicate detection (AI flags repeat ticket numbers)
- Anomaly alerts (price variance, unusual quantity)
- One-click PO generation (from approved tickets)

**Success Metrics:**
- 80%+ reduction in time to process monthly tickets (AI extraction)
- <5% duplicate tickets (AI detection)
- 100% reconciliation (Technical total = Procurement total)

### 6.5 Maintenance Staff

**Primary Interface:** WhatsApp (Fuel) + Web (Maintenance Orders)

**Count:** 1 user

**Use Cases:**
- Enter fuel tickets (via WhatsApp photos)
- Create maintenance orders (web dashboard)
- Issue spare parts from warehouse (to maintenance orders)
- Charge services to maintenance orders (external labor, washing)
- Track machine costs (parts + services + fuel)
- Generate machine cost reports

**Pain Points:**
- **P9:** Fuel entry manual process (person digitizes fuel tickets one-by-one from photos)
- **P14:** Cost tracking across systems (machinery moves between consortiums)
- **P15:** Spare parts cost allocation (complex flow: warehouse → order → machine)

**Needs:**
- OCR fuel ticket extraction (AI reads photos)
- Cross-consortium fuel tracking (via cost centers)
- Automated cost transfers (warehouse → maintenance order → machine)
- Consolidated machine reports (parts + services + fuel)

**Success Metrics:**
- 75%+ reduction in time per fuel entry (AI extraction)
- 100% fuel cost allocation to correct machine + cost center
- Real-time machine cost visibility (no manual consolidation)

### 6.6 Accounting (Contabilidad)

**Primary Interface:** Web Dashboard

**Count:** 1 user

**Use Cases:**
- Validate invoices (match to POs, verify amounts)
- Approve payments (after certificate upload)
- Close purchase orders (after all validations pass)
- Monitor payment status (pending, approved, paid)
- Reconcile financial data (purchases vs payments)

**Pain Points:**
- **P10:** Certificate management gap (no blocking mechanism before closure)
- **P5:** Dual system entry (reconciling Contecsa + Consortium data)

**Needs:**
- Certificate blocking (cannot pay without quality certificates)
- Invoice OCR (AI extracts data, pre-fills validation)
- Automated reconciliation (PO amount = Invoice amount)
- Cross-tenant visibility (Contecsa + Consortium POs)

**Success Metrics:**
- 100% certificate compliance (no payments without certificates)
- 50%+ reduction in time per invoice validation (OCR extraction)
- 0 discrepancies between PO and invoice (automated matching)

### 6.7 Management (Gerencia)

**Primary Interface:** Web Dashboard (Executive View)

**Count:** 2-3 users

**Use Cases:**
- View executive KPIs (spending trends, budget vs actual, delays)
- Analyze financial projections (cash flow, cost forecasts)
- Monitor machine profitability (revenue - costs per machine)
- Query AI agent (natural language: "Show me fuel costs Q4 2025")
- Export reports to Google Sheets (for board presentations)

**Pain Points:**
- **P17:** Manual Excel analysis (export SICOM → pivot tables)
- **P18:** No cost center consolidation (Contecsa + Consortiums)
- **P19:** Cross-module data reconciliation (manual, frequent discrepancies)

**Needs:**
- Real-time dashboards (no Excel exports)
- Conversational AI agent ("Muéstrame gráfica combustible")
- Consolidated cross-tenant reporting (Contecsa + all Consortiums)
- Drill-down capability (high-level KPI → detailed transactions)

**Success Metrics:**
- 90%+ of reports generated via AI agent (not manual Excel)
- <5 min to answer executive questions (vs hours with SICOM)
- 100% data consistency across modules (automated reconciliation)

### 6.8 Admin (Alberto Ceballos)

**Primary Interface:** Web Admin Panel

**Count:** 1 user

**Use Cases:**
- Create new consortiums (one-click: replicate Contecsa configuration)
- Configure workflows (approval chains, time thresholds, alerts)
- Manage users (roles, permissions, access per consortium)
- Define notification rules (email addresses, WhatsApp numbers, alert types per consortium)
- Monitor system health (server status, API integrations, data sync)

**Pain Points:**
- **No easy way to create consortiums** (currently requires separate SICOM installation)
- **Configuration replication manual** (re-enter workflows, rules for each consortium)
- **Cross-tenant visibility missing** (cannot see consolidated view)

**Needs:**
- One-click consortium creation ("Un botoncito" - line 159)
- Configuration templates (Contecsa = master template → replicate to consortiums)
- Customization per consortium (email domains, users, warehouses)
- Admin dashboard (system health, tenant status, integration monitoring)

**Success Metrics:**
- <10 min to create new consortium (vs days with SICOM)
- 100% configuration consistency (auto-replicated from Contecsa)
- Zero downtime during consortium creation

---

## 7. Key Insights & Success Factors

### 7.1 Critical Success Factors

**1. WhatsApp is Non-Negotiable**
- **Alberto's philosophy:** "Todo el mundo maneja WhatsApp, se acabó el tema" (lines 1153-1158) - "Everyone uses WhatsApp, end of discussion"
- **Reason:** Field staff won't adopt complex desktop system
- **Impact:** WhatsApp removes all excuses ("no time," "don't understand," "too complex")
- **Implementation:** R-PROC1 (requisitions), R-INV4 (warehouse), R-MAINT8 (fuel), R-TECH2 (tickets), R-OCR1-4 (documents)

**2. Multi-Tenant is Core, Not Optional**
- **Business model:** Contecsa + 9+ consortiums require separate tenants
- **Impact:** Cannot be afterthought, must be foundational architecture
- **Reason:** Each consortium = separate legal entity, different email domain, confidential
- **Implementation:** R-MT1-5 (tenant management, cross-tenant integration, consolidated reporting)

**3. Cross-Tenant Integration is Critical**
- **Pain Point #1:** Dual system entry (PO in Contecsa, warehouse entry in Consortium)
- **Quote:** "Me toca entrar a los dos sistemas para poder confirmar las dos cosas" (lines 83-84)
- **Impact:** Major inefficiency, error-prone, no audit trail
- **Implementation:** R-MT4 (cross-tenant PO tracking with automatic reconciliation)

**4. Simplicity > Features**
- **Alberto philosophy:** "Lo que yo he aprendido es quitarle las excusas" (line 1145) - "What I've learned is to remove excuses"
- **Evidence:** Complex requisition module abandoned, email workaround adopted
- **Principle:** Prefer simple, imperfect solution over complex, perfect one
- **Example:** Inventory will always have discrepancies ("Siempre va a dar su descuadre" - line 261), accept it, make process easy

**5. Traceability is Mandatory**
- **Reason:** Email replaced verbal requests specifically for audit trail
- **Requirement:** System must log everything: who, what, when
- **Implementation:** R-QUAL4 (audit trail), R-PROC2 (email traceability)
- **Benefit:** Supports dispute resolution, compliance, audits
- **Quote:** "Aquí aparecían compras telepáticas" (line 1123) - eliminated by email requirement

**6. OCR/AI is Efficiency Multiplier**
- **Pain Point:** Manual data entry is biggest time sink (technical tickets, fuel, invoices)
- **Impact:** AI digitization can 10x speed of current processes
- **ROI Driver:** Hours saved per month (technical tickets, fuel entries, invoice validation)
- **Implementation:** R-OCR1-4 (invoice, tickets, fuel, supplier documents)

**7. Certificate Blocking is Compliance Requirement**
- **Audit Finding:** Recent audit showed gap (certificates not tracked)
- **Requirement:** Must enforce: No closure without certificates
- **Impact:** Prevents payment for non-compliant products
- **Implementation:** R-QUAL1 (certificate blocking)
- **Quote:** "No se puede cerrar hasta aquí la documentación de calidad" (lines 213-215)

**8. Cost Center Reporting is Complex**
- **Need:** Report by consortium, by project, by cost center, consolidated
- **Challenge:** Machinery costs (especially fuel) span multiple consortiums
- **Solution:** Fuel tracked in Contecsa (not per consortium) + allocated via cost centers
- **Implementation:** R-MAINT9 (cost center fuel allocation), R-MT5 (consolidated reporting)

### 7.2 Technology Preferences (Confirmed with Alberto)

**Backend: Python (Non-Negotiable)**
- **Source:** Alberto explicitly requested Python (previous meeting)
- **Reason:** "Herramienta más poderosa para análisis datos, matrices tridimensionales"
- **Use Case:** ETL from SICOM, non-relational data transformation, AI/ML processing

**Frontend: Modern, Visual**
- **Alberto reaction:** Excited by mockup: "Última tecnología" (line 1565)
- **Needs:** Charts, graphs, clean interface
- **Contrast:** SICOM "pantalla negra" (black screen terminal)

**Authentication: Google Workspace**
- **Current:** Company uses Gmail, Google Drive
- **Benefit:** SSO via Google eliminates password fatigue
- **Quote:** "Ahí es donde empieza Cristo a padecer" (line 1473) - on managing separate credentials

**Mobile: WhatsApp Business API**
- **Not:** Native app (adoption barrier, installation friction)
- **Reason:** WhatsApp = universal, no installation, familiar UX
- **Adoption:** 100% of users already use WhatsApp daily

**Deployment: Client-Hosted**
- **Model:** Software delivered to client (NOT SaaS)
- **Infrastructure:** Deployed on client's cloud (GCP or AWS, client chooses)
- **Reason:** Data privacy, control, ownership

### 7.3 Scope Prioritization (Alberto's View)

**Phase 1 (Core - "Lo que está moviendo la empresa"):**
1. Procurement (compras)
2. Warehouse (almacén)
3. Technical area (técnico)
4. Maintenance & machinery (maquinaria y equipo)

**Quote:** "Compras, almacén, técnico, maquinaria y equipo, eso es lo que estamos usando hoy día" (lines 597-599)

**Reason:** These are operational backbone, high risk if SICOM fails

**Phase 2 (Future):**
- Engineering workflows (project progress, budgets)
- Financial modules (cash flow, beyond basic reporting)
- Automated invoice email processing (facturas@)

**Quote:** "Por ahora nos centramos en compras, almacén, técnico, maquinaria y equipo" (line 631)

---

## 8. Technology Stack

### 8.1 Backend

**Framework:** Python 3.11+ with FastAPI
- **Reason:** PO requirement (Alberto) - "herramienta más poderosa para análisis datos, matrices tridimensionales"
- **Use Cases:** ETL from SICOM, non-relational data transformation, AI/ML processing
- **Deployment:** Google Cloud Run or AWS Lambda (client chooses)

**API Design:** RESTful API + GraphQL (optional for complex queries)

### 8.2 Frontend

**Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5.6+
- **Styling:** Tailwind CSS 4
- **UI Components:** shadcn/ui
- **Deployment:** Vercel Serverless

### 8.3 Database

**Data Warehouse:** PostgreSQL 15 (transformed data)
- **Rationale:** Relational data (POs, invoices, inventory, users)
- **Features:** JSONB for flexible schemas, full-text search, geospatial support

**Cache:** Redis
- **Use Cases:** Session management, real-time notifications, rate limiting

**Legacy:** SICOM (1970s-80s)
- **Access:** Read-only (one-time ETL migration)
- **Constraint:** NO modifications to SICOM data

### 8.4 AI/LLM

**Primary Model:** Gemini 2.0 Flash
- **Use Cases:** Conversational agent, OCR processing, anomaly detection

**Fallback Model:** DeepSeek
- **Reason:** Cost optimization, redundancy

**Framework:** LangChain (orchestration)
- **Features:** Prompt templates, agent workflows, tool calling

**SDK:** Vercel AI SDK 6.0 + @ai-sdk/react 3.0
- **Benefits:** Streaming responses, React hooks, UI components

**Gateway:** Vercel AI Gateway
- **Features:** Provider proxy, API key management, rate limiting

### 8.5 Integrations

**Google Workspace:**
- Gmail API (email notifications)
- Google Sheets API (export reports - user familiarity)
- Google Auth (SSO)

**Storage:**
- Google Cloud Storage or AWS S3 (client chooses)
- **Use Cases:** Certificates, invoices, delivery tickets, supplier documents

**OCR:**
- Google Vision API or AWS Textract
- **Use Cases:** Invoice extraction, ticket digitization, RUT/certificate parsing

**WhatsApp:**
- WhatsApp Business API (Phase 1)
- **Use Cases:** Requisitions, warehouse transactions, fuel entry, ticket submission, notifications

### 8.6 Development Tools

**Package Manager:** bun 1.3+

**Linter/Formatter:** Biome 2+

**Testing:** Playwright (E2E)

### 8.7 Deployment Architecture

**Frontend:** Vercel Serverless (Next.js)

**Backend:** Client's cloud (GCP Cloud Run or AWS Lambda)
- **Reason:** Software delivered, NOT SaaS
- **Client chooses:** GCP or AWS

**Database:** Client's cloud (Cloud SQL or RDS)

**CRITICAL:** Software se entrega (delivered), NO se alquila (not rented) - client owns infrastructure

---

## 9. Risks & Mitigation

6 critical risks with severity, impact, and mitigation strategies

### 9.1 SICOM Server Failure (Imminent) ⚠️ CRITICAL

**Risk:**
- **Quote:** "Yo digo que este año va a reventar" (line 721) - "I say this year it will explode"
- Physical server from 1970s-80s, no backup, no cloud migration
- Server replacement cost: 15-17M COP + migration 1-2M COP
- **If fails before new system ready:** "Nos volvamos al Excel" (line 1413) - operational paralysis

**Impact:** HIGH
- Loss of all operational data (if no backup recoverable)
- Revert to manual Excel processes (massive inefficiency)
- Cannot create POs, track inventory, generate reports

**Mitigation:**
1. **Prioritize SICOM data migration early** (R-INTEG2) - extract data ASAP (before server fails)
2. **Create Excel fallback templates** (procurement, warehouse, maintenance) - tested and ready
3. **Weekly SICOM backups** (if technically feasible) - until migration complete
4. **Fast-track MVP** - get core modules (procurement, warehouse) operational within 3 months

**Owner:** Dev Team + Alberto (coordinate backup access)

### 9.2 Multi-Tenant Complexity Underestimation ⚠️ HIGH

**Risk:**
- Multi-tenant architecture significantly more complex than single-tenant
- Cross-tenant data sync has failure modes (PO in Tenant A, warehouse entry in Tenant B)
- Data isolation vs shared resources unclear (products, suppliers, machinery)
- One-click consortium creation (R-MT2) requires sophisticated replication logic

**Impact:** MEDIUM-HIGH
- Architecture redesign mid-project (costly, delays)
- Data leakage between consortiums (confidentiality breach)
- Performance degradation (cross-tenant queries)
- Bugs in cross-tenant sync (dual entry problem persists)

**Mitigation:**
1. **Prototype multi-tenant architecture early** (Week 1-2) - validate approach with Alberto
2. **Clarify data isolation requirements** (10 questions in Section 10)
3. **Design cross-tenant sync mechanism** (shared reference table, API integration, or event-driven)
4. **Test consortium creation workflow** (replicate configuration, validate customization)
5. **Performance testing** (cross-tenant queries, consolidated reporting)

**Owner:** Architecture Team + Dev Team

### 9.3 WhatsApp API Limitations ⚠️ MEDIUM

**Risk:**
- WhatsApp Business API has usage limits (rate limiting, message templates)
- May have latency or availability issues
- Cost per message (variable based on volume)
- Template approval process (Facebook review required)

**Impact:** MEDIUM
- Degraded user experience (delayed notifications, failed messages)
- Increased costs (if volume exceeds projections)
- Adoption failure (if WhatsApp interface is unreliable)

**Mitigation:**
1. **Design graceful degradation** (email fallback if WhatsApp unavailable)
2. **Template pre-approval** (submit all message templates early for Facebook review)
3. **Rate limiting monitoring** (track usage, alert if approaching limits)
4. **Cost forecasting** (estimate message volume, budget accordingly)
5. **Latency tolerance** (UX design accepts 1-2 min delays for non-urgent messages)

**Owner:** Integration Team + Product Owner

### 9.4 User Adoption (Field Staff) ⚠️ CRITICAL

**Risk:**
- If WhatsApp interface is clunky, field staff won't use it
- Reverts to "telepathic purchases" (verbal requests, no traceability)
- Resistance to change (comfort with email workaround)
- Training overhead (if interface not intuitive)

**Impact:** HIGH
- System adoption failure (Phase 1 modules unused)
- ROI not realized (manual processes continue)
- User frustration, resistance

**Mitigation:**
1. **Extensive UX testing with actual field staff** (before MVP launch) - not just mockups
2. **Iterative design** (test → feedback → refine → test)
3. **Pilot with 2-3 users** (Liced Vega + 2 field staff) - validate usability
4. **Training videos** (WhatsApp usage, short 1-2 min demos)
5. **Champion identification** (early adopters who evangelize to peers)
6. **Fallback to email** (if user cannot/will not use WhatsApp) - don't force 100% adoption

**Owner:** UX Team + Product Owner

### 9.5 Data Migration from SICOM ⚠️ MEDIUM

**Risk:**
- Old system, antiquated language, data quality unknown
- May have encoding issues (1970s-80s era character sets)
- Missing data, inconsistencies (historical data gaps)
- No documentation (schema, field meanings)

**Impact:** MEDIUM
- Incomplete migration (lost historical data)
- Data corruption (import errors)
- Extended migration timeline (manual cleanup)

**Mitigation:**
1. **Early data audit** (sample 100 records from each SICOM table, assess quality)
2. **Incremental migration** (start with recent data, backfill historical later)
3. **Data validation** (cross-check migrated data against SICOM, reconcile discrepancies)
4. **Schema documentation** (reverse-engineer SICOM schema with Alberto's help)
5. **Manual cleanup budget** (allocate time for data corrections)

**Owner:** Data Migration Team + Alberto (domain expert)

### 9.6 Scope Creep ⚠️ MEDIUM

**Risk:**
- Alberto showed entire SICOM (many modules beyond Phase 1)
- Easy to over-promise features beyond procurement, warehouse, technical, maintenance
- Feature requests during development (e.g., "can we also track X?")

**Impact:** MEDIUM
- Project delays (timeline extended)
- Budget overrun (more dev hours)
- Core features compromised (resources diverted)

**Mitigation:**
1. **Strict Phase 1 boundaries** (procurement, warehouse, technical, maintenance ONLY)
2. **Feature backlog** (capture requests for Phase 2, acknowledge but defer)
3. **Change request process** (formal approval required for scope additions)
4. **Regular alignment meetings** (weekly with Alberto, review scope)
5. **PRD as contract** (this document defines scope, deviations require amendment)

**Owner:** Project Manager + Product Owner

---

## 10. Questions for Product Owner

10 critical questions to clarify multi-tenant mechanics, data isolation, and implementation details. To be addressed in next meeting with Alberto Ceballos.

### 10.1 Multi-Tenant Data Isolation

**Q1: Do consortiums share any master data (products, suppliers)?**
- **Context:** When creating new consortium, should product catalog be replicated or shared?
- **Option A:** Shared product catalog (all consortiums use same product definitions)
- **Option B:** Isolated product catalog (each consortium has own products, no cross-contamination)
- **Implication:** Affects R-MT2 (consortium creation) - what gets replicated vs shared

**Q2: Can suppliers work with multiple consortiums?**
- **Context:** If Supplier X provides materials to both Contecsa and PAVICONSTRUJC, is it one supplier or two?
- **Option A:** Shared supplier master data (one supplier record, multiple consortium relationships)
- **Option B:** Isolated supplier records (each consortium has own supplier list)
- **Implication:** Affects supplier management (R-SUPP1-6) - data model design

### 10.2 Consortium User Access

**Q3: Do Contecsa staff have access to consortium tenants (for support/admin)?**
- **Context:** If PAVICONSTRUJC has an issue, can Alberto or Liced Vega log in to troubleshoot?
- **Option A:** Contecsa admin has super-user access to all consortium tenants
- **Option B:** Consortiums are fully isolated, Contecsa cannot access
- **Implication:** Affects user roles/permissions (R-UX4) - role-based access control

**Q4: Who manages user accounts for consortiums?**
- **Context:** When new consortium is created, who creates user accounts for their staff?
- **Option A:** Contecsa admin creates users on behalf of consortium
- **Option B:** Consortium has own admin who manages users
- **Implication:** Affects user management features - admin panel design

### 10.3 Cost Center Mechanics

**Q5: How is cost center assigned when Contecsa purchases for consortium?**
- **Context:** When creating PO in Contecsa system for Consortium X materials
- **Option A:** Manual selection during PO creation (dropdown: select consortium/project)
- **Option B:** Auto-derived from project/warehouse destination (system infers cost center)
- **Implication:** Affects PO workflow (R-PROC3) - UX design, automation

**Q6: Can one PO have multiple cost centers (split allocation)?**
- **Context:** If single PO has materials for multiple projects/consortiums
- **Option A:** Yes, PO line items can have different cost centers
- **Option B:** No, one PO = one cost center (split requires multiple POs)
- **Implication:** Affects PO data model - complexity of cost allocation

### 10.4 Machine Ownership & Fuel Tracking

**Q7: Are machines Contecsa-owned or consortium-owned?**
- **Context:** Equipment tracked in R-MAINT1
- **Option A:** All machines are Contecsa-owned (consortiums "rent" machines from Contecsa)
- **Option B:** Some machines are consortium-owned (purchased by consortium for specific project)
- **Implication:** Affects machine master data - ownership flag, depreciation, cost recovery

**Q8: Fuel consolidation reporting - for cost recovery or profitability analysis?**
- **Context:** R-MAINT7 (fuel tracking), R-MAINT9 (cost center allocation)
- **Option A:** Cost recovery (Contecsa bills consortiums for fuel consumed on their projects)
- **Option B:** Profitability analysis (internal reporting, machine P&L)
- **Implication:** Affects reporting features - invoicing vs analytics

### 10.5 Quality Certificates

**Q9: What types of quality certificates are required?**
- **Context:** R-QUAL1 (certificate blocking)
- **Examples:** Material test reports (concrete, steel), supplier certificates (ISO, environmental), product certifications
- **Question:** Does it vary by product type (materials vs services)? Who issues certificates (supplier, internal QA, third-party)?
- **Implication:** Affects certificate upload workflow - forms, validations, approval chains

**Q10: Should environmental license expiration be tracked (with renewal alerts)?**
- **Context:** R-QUAL3 (environmental documentation)
- **Option A:** Yes, track expiration dates and send renewal alerts (60 days before expiry)
- **Option B:** No, just yes/no (has valid license), manual renewal tracking
- **Implication:** Affects supplier compliance features - calendar, alerts, automation

---

## Appendix A: Meeting Transcript References

**Source:** Meeting with Alberto Ceballos (PO/IT Manager), December 24, 2025
**File:** `/Users/mercadeo/neero/contecsa/docs/meets/contecsa-alberto-ceballos-12-24-2025.txt`
**Lines:** 1-1612

**Key Quotes Referenced:**
- Line 721: "Yo digo que este año va a reventar" (SICOM server failure)
- Line 83-84: "Me toca entrar a los dos sistemas" (dual entry pain point)
- Lines 123-127: "Toda la parametrización de Contecsa debe replicarse" (multi-tenant replication)
- Lines 159-160: "Un botoncito, crear nuevo consorcio" (one-click consortium creation)
- Lines 1153-1158: "Todo el mundo maneja WhatsApp, se acabó el tema" (WhatsApp adoption)
- Line 1145: "Lo que yo he aprendido es quitarle las excusas" (simplicity philosophy)
- Lines 258-260: "Eso no va a cuadrar nunca" (inventory accuracy acceptance)
- Lines 359-362: "Se demora mucho... hay que digitar uno a uno" (manual entry pain)
- Line 489: "Ármame el estado por máquina" (machine P&L requirement)
- Lines 213-215: "No se puede cerrar sin certificados" (certificate blocking)
- Line 1123: "Aquí aparecían compras telepáticas" (traceability issue)
- Line 1413: "Nos volvamos al Excel" (SICOM failure fallback)
- Line 1473: "Ahí es donde empieza Cristo a padecer" (password fatigue)

---

## Appendix B: Document Metadata

**Version History:**
- v1.0 (2025-12-24): Initial PRD created from Alberto Ceballos meeting analysis

**Related Documents:**
- `business-context.md` - Company overview, Caso Cartagena incident, consortium portfolio
- `user-roles-workflows.md` - Detailed user workflows, current state processes
- `architecture-overview.md` - Technical architecture, stack decisions
- `features/r01-r14.md` - Individual feature specifications (Phase 1)
- `meets/contecsa-alberto-ceballos-12-24-2025.txt` - Meeting transcript (source material)

**Contributors:**
- Alberto Ceballos (Product Owner, IT Manager)
- Javier Polo (CEO, Neero SAS)
- Claude Code (Requirements Analysis, Documentation)

**Review Status:** Draft - Pending validation with Alberto Ceballos

**Next Steps:**
1. Review PRD with Alberto (validate multi-tenant requirements, answer 10 questions)
2. Prioritize R-MT1-5 (multi-tenant) + R-PROC1 (WhatsApp requisitions) for MVP
3. Prototype cross-tenant PO tracking (R-MT4) - technical feasibility
4. Create detailed feature specs for R-MT2 (one-click consortium creation)
5. Begin SICOM data migration planning (R-INTEG2) - urgency due to server risk

---

**End of PRD**
