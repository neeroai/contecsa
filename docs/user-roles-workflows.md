# User Roles and Workflows

Version: 1.0 | Date: 2025-12-22 22:30 | Priority: Core | Status: Active

---

## Overview

Sistema Contecsa tiene 8-10 usuarios activos distribuidos en 6 roles con permisos diferenciados basados en responsabilidades en el proceso de compras de infraestructura. Role-Based Access Control (RBAC) implementado con super usuario (Liced Vega) para continuidad operacional.

**Key Insight:** Liced Vega = single point of failure (aparece en mayoría de registros Excel). Sistema debe distribuir capacidades de super usuario para reducir riesgo operacional.

---

## User Distribution

| Role | Count | % Team | Primary System Access |
|------|-------|--------|----------------------|
| Gerencia | 2-3 | 25-30% | Dashboards ejecutivos, reportes, aprobaciones finales |
| Compras | 3 | 30% | Seguimiento compras, órdenes, proveedores, alertas |
| Contabilidad | 1 | 10% | Validación facturas, cierre contable, DIAN |
| Técnico | 1 | 10% | Requisiciones, consumo materiales, inventario |
| Almacén | 1 | 10% | Recepciones, entregas, certificados calidad |
| Admin | 1 | 10% | Configuración sistema, usuarios, permisos |
| **Total** | **8-10** | **100%** | |

---

## User Personas

### 1. Gerencia (Executive Management)

**Count:** 2-3 usuarios
**Level:** C-Level, Gerente de Proyecto

**Responsibilities:**
- Supervisión estratégica de compras (KPIs ejecutivos)
- Aprobación de compras >$X millones COP (gate crítico)
- Análisis financiero por consorcio (9 consorcios activos)
- Proyecciones de gasto mensual/trimestral
- Revisión de anomalías críticas (Caso Cartagena prevention)

**Primary Workflows:**
1. Review dashboard ejecutivo diario (8:00 AM - email notification)
2. Aprobar compras >threshold (notificación inmediata)
3. Revisar reporte semanal de gasto por consorcio (Monday 8 AM)
4. Revisar alertas de precios (R7 - price anomalies >10%)
5. Consultar AI agent para proyecciones ("¿cuánto gastaremos en cemento Q1?")

**System Permissions:**
- READ: All purchases, all projects, all KPIs
- WRITE: Approval decisions (final gate)
- EXECUTE: AI agent queries (unrestricted), export reports
- DENY: Edit purchase details, create orders, modify invoices

**Typical Questions for AI Agent:**
- "¿Cuál es el gasto total en PAVICONSTRUJC este mes?"
- "Muéstrame gráfica de compras >30 días por proyecto"
- "¿Cuánto hemos gastado en concreto vs presupuesto?"
- "¿Qué proveedores tienen peor desempeño (días entrega)?"

---

### 2. Compras (Procurement Team)

**Count:** 3 usuarios
**Level:** Jefe de Compras (1) + Auxiliares (2)
**Super Usuario:** Liced Vega (Jefe de Compras)

**Responsibilities:**
- Seguimiento diario de compras activas (55 compras en Excel actual)
- Creación de órdenes de compra post-aprobación requisición
- Negociación con proveedores, confirmación entregas
- Subida de certificados de calidad (blocking gate para cierre)
- Alertas de compras >30 días (R3 - purchase tracking)
- Validación de precios (R7 - anomaly detection)

**Primary Workflows:**

**Jefe de Compras (Liced Vega):**
1. Review email diario (8:00 AM) con compras en riesgo >30 días
2. Aprobar requisiciones de técnicos (gate bloqueante)
3. Crear órdenes de compra en sistema (post-aprobación)
4. Hacer seguimiento a proveedores (confirmación, entregas)
5. Subir certificados de calidad post-recepción (5 días deadline)
6. Revisar alertas de precios (R7 - si precio >10% vs histórico)
7. Exportar reportes a Google Sheets (familiar format)
8. Consultar AI agent para análisis ad-hoc

**Auxiliares de Compras:**
1. Crear borradores de órdenes de compra
2. Hacer seguimiento a proveedores (llamadas, emails)
3. Subir documentos (certificados, cotizaciones)
4. Actualizar estado de compras (7-stage workflow)
5. Notificar a Jefe de compras sobre excepciones

**System Permissions:**

**Jefe de Compras (Super Usuario):**
- READ: All purchases, all projects, supplier data, price history
- WRITE: Create/edit orders, upload certificates, approve requisitions
- EXECUTE: AI agent queries, export to Sheets, send notifications
- OVERRIDE: Edit closed purchases (audit trail), reassign tasks

**Auxiliares:**
- READ: Assigned purchases, supplier data
- WRITE: Update purchase status, upload documents
- EXECUTE: AI agent queries (limited to own purchases)
- DENY: Approve requisitions, edit orders, close purchases

**Typical Questions for AI Agent:**
- "¿Cuántas compras tengo abiertas >30 días?"
- "¿Cuál es el precio promedio de cemento con Proveedor XYZ?"
- "Muéstrame todas las compras de PTAR pendientes de certificado"
- "¿Qué compras necesitan confirmación de proveedor?"

---

### 3. Contabilidad (Accounting)

**Count:** 1 usuario
**Level:** Contador, Auxiliar Contable

**Responsibilities:**
- Validación de facturas recibidas (OCR R4 + manual review)
- Verificación de compliance DIAN (factura electrónica, RADIAN)
- Cierre contable de compras (final gate)
- Reporte de facturas bloqueadas (issues to resolve)
- Conciliación de pagos con bancos
- Validación de descuentos, notas crédito (Caso Cartagena)

**Primary Workflows:**
1. Review email diario (10:00 AM) con facturas pendientes
2. Validar facturas OCR (R4 - check extracted data vs PO)
3. Marcar facturas bloqueadas (errores de precio, missing docs)
4. Cerrar compras contablemente (post-recepción + certificado)
5. Generar reporte semanal de facturas vencidas (>fecha límite)
6. Notificar a Compras sobre facturas bloqueadas
7. Consultar AI agent para conciliaciones

**System Permissions:**
- READ: All invoices, purchase orders, certificates, payments
- WRITE: Invoice validation (approve/block), accounting closure
- EXECUTE: AI agent queries (invoice analysis), export reports
- DENY: Edit purchase details, create orders, approve requisitions

**Typical Questions for AI Agent:**
- "¿Cuántas facturas están bloqueadas y por qué?"
- "Muéstrame facturas vencidas >15 días sin pago"
- "¿Cuál es el total por pagar este mes?"
- "¿Hay facturas con descuentos >10% (anomalía)?"

---

### 4. Técnico (Project Engineer)

**Count:** 1 usuario por proyecto (puede ser 1-3 usuarios total)
**Level:** Ingeniero de Proyecto, Residente de Obra

**Responsibilities:**
- Crear requisiciones de materiales (trigger de compra)
- Especificar materiales técnicos (NTC, INVIAS standards)
- Consumo de materiales por proyecto (tracking)
- Validar entregas vs especificaciones técnicas
- Reporte de desperdicios, rendimientos
- Proyección de necesidades futuras (próximo mes)

**Primary Workflows:**
1. Crear requisición de materiales en sistema (form)
2. Esperar aprobación de Jefe de Compras (notification)
3. Revisar órdenes de compra creadas (confirmación de spec)
4. Validar recepción en almacén (calidad técnica)
5. Reportar consumo semanal por proyecto (actualización inventario)
6. Consultar AI agent para proyecciones ("¿cuánto cemento necesito próximo mes?")

**System Permissions:**
- READ: Own requisitions, assigned project purchases, inventory
- WRITE: Create requisitions, report consumption
- EXECUTE: AI agent queries (material analysis)
- DENY: Approve requisitions, create orders, validate invoices

**Typical Questions for AI Agent:**
- "¿Cuánto cemento hemos consumido en PAVICONSTRUJC este mes?"
- "¿Cuál es el rendimiento promedio de acero por m³?"
- "Muéstrame gráfica de consumo combustible últimos 3 meses"
- "¿Cuándo necesitaré pedir más agregados (proyección)?"

---

### 5. Almacén (Warehouse)

**Count:** 1 usuario
**Level:** Jefe de Almacén, Almacenista

**Responsibilities:**
- Recepción de materiales (validation vs PO)
- Control de inventario físico vs sistema
- Entregas a proyectos (salidas de almacén)
- Subida de actas de recepción (R8 - certificates)
- Reporte de faltantes, excedentes, daños
- Coordinación de entregas parciales

**Primary Workflows:**
1. Review email diario (10:00 AM) con recepciones pendientes (próximas 7 días)
2. Recibir materiales de proveedores (validar cantidad, calidad)
3. Crear acta de recepción en sistema (upload R8)
4. Notificar a Compras sobre discrepancias (faltantes, daños)
5. Procesar salidas de almacén a proyectos (update inventory)
6. Generar reporte semasal de inventario (stock levels)
7. Consultar AI agent para control de stock

**System Permissions:**
- READ: All purchase orders (incoming), inventory, deliveries
- WRITE: Receptions, delivery notes, inventory updates
- EXECUTE: AI agent queries (inventory analysis)
- DENY: Create orders, approve requisitions, validate invoices

**Typical Questions for AI Agent:**
- "¿Qué materiales llegan esta semana?"
- "¿Cuánto cemento tenemos en stock?"
- "Muéstrame órdenes confirmadas sin recepción (>15 días)"
- "¿Qué materiales están en nivel crítico (reorder point)?"

---

### 6. Admin (System Administrator)

**Count:** 1 usuario
**Level:** IT, System Admin

**Responsibilities:**
- Gestión de usuarios (crear, desactivar, resetear password)
- Configuración de permisos RBAC
- Configuración de integraciones (SICOM ETL, Google Workspace)
- Monitoreo de sistema (uptime, errors, performance)
- Backup y recuperación de datos
- Soporte técnico a usuarios

**Primary Workflows:**
1. Crear nuevos usuarios (onboarding)
2. Asignar roles y permisos RBAC
3. Configurar notificaciones por rol (email preferences)
4. Monitorear logs de integración SICOM ETL (weekly sync)
5. Responder a tickets de soporte (email, WhatsApp)
6. Ejecutar backups manuales (pre-migración, emergencias)

**System Permissions:**
- READ: All data, all logs, all configurations
- WRITE: User management, permissions, system configuration
- EXECUTE: All admin tools, database access (read-only SICOM)
- DENY: Edit business data (purchases, invoices, etc.) - data integrity

**Typical Questions for AI Agent:**
- "¿Cuántos usuarios están activos en el sistema?"
- "Muéstrame errores de ETL SICOM última semana"
- "¿Cuál es el uso de storage (GB) por tipo de archivo?"

---

## Permissions Matrix (RBAC)

| Action | Gerencia | Compras Jefe | Compras Aux | Contabilidad | Técnico | Almacén | Admin |
|--------|----------|--------------|-------------|--------------|---------|---------|-------|
| **PURCHASES** | | | | | | | |
| View all purchases | ✅ | ✅ | ❌ (own only) | ✅ | ❌ (project only) | ✅ | ✅ |
| Create requisition | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Approve requisition | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Create purchase order | ❌ | ✅ | ✅ (draft) | ❌ | ❌ | ❌ | ❌ |
| Edit purchase order | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Approve purchase (final) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Close purchase | ❌ | ✅ | ❌ | ✅ (accounting) | ❌ | ❌ | ❌ |
| Reopen closed purchase | ❌ | ✅ (audit) | ❌ | ❌ | ❌ | ❌ | ✅ |
| **INVOICES** | | | | | | | |
| View invoices | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Upload invoice (OCR) | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Validate invoice | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Block invoice | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **CERTIFICATES** | | | | | | | |
| View certificates | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Upload certificate | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Validate certificate | ❌ | ✅ | ❌ | ❌ | ✅ (technical) | ❌ | ❌ |
| **INVENTORY** | | | | | | | |
| View inventory | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| Create reception | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Process delivery | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Report consumption | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **DASHBOARDS** | | | | | | | |
| Executive dashboard | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Procurement dashboard | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Accounting dashboard | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Technical dashboard | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Warehouse dashboard | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **AI AGENT** | | | | | | | |
| Ask questions | ✅ | ✅ | ✅ (limited) | ✅ | ✅ | ✅ | ✅ |
| Execute code | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Export to Sheets | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ |
| **ADMIN** | | | | | | | |
| Manage users | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Configure RBAC | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| View logs | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Configure integrations | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

**Legend:**
- ✅ = Full access
- ❌ = No access
- (qualifier) = Conditional access

---

## Workflow Diagrams by Role

### Gerencia Workflow (Daily)

```
08:00 AM - Recibe email diario (Gmail API)
   ↓
   ├─→ ¿Compras en riesgo >30 días? → Review dashboard → Escalar a Jefe Compras
   ├─→ ¿Anomalías de precio (R7)? → Review detalles → Aprobar/rechazar compra
   └─→ ¿Aprobaciones pendientes? → Review compra → Aprobar/rechazar
   ↓
Durante el día:
   ├─→ Notificación compra >$X → Review → Aprobar/rechazar (gate crítico)
   ├─→ Consulta AI agent → "¿gasto PAVICONSTRUJC mes actual?" → Análisis
   └─→ Review alerta precio (R7) → "Concreto +15% vs promedio" → Investigar
   ↓
17:00 PM - Review dashboard ejecutivo (KPIs cierre día)
```

### Compras Workflow (Daily)

```
08:00 AM - Recibe email diario (compras >30 días, tareas pendientes)
   ↓
   ├─→ Compras >30 días (URGENTE) → Contactar proveedor → Update sistema
   ├─→ Requisiciones pendientes aprobación → Review → Aprobar/rechazar
   └─→ Certificados faltantes (5 días post-recepción) → Solicitar a proveedor
   ↓
Durante el día:
   ├─→ Requisición nueva (técnico) → Review → Aprobar/rechazar
   ├─→ Crear orden de compra (post-aprobación) → Enviar a proveedor
   ├─→ Proveedor confirma orden → Update sistema (estado CONFIRMADA)
   ├─→ Alerta precio >10% (R7) → Consultar histórico → Contactar proveedor
   └─→ Recepción completada → Subir certificado (deadline 5 días)
   ↓
16:00 PM - Exportar reporte a Google Sheets (semanal, viernes)
```

### Contabilidad Workflow (Daily)

```
10:00 AM - Recibe email diario (facturas pendientes, bloqueadas)
   ↓
   ├─→ Facturas nuevas (OCR R4) → Validar datos extraídos → Aprobar/corregir
   ├─→ Facturas bloqueadas → Review razón → Contactar proveedor/compras
   └─→ Facturas vencidas >15 días → Escalar a gerencia
   ↓
Durante el día:
   ├─→ Factura nueva llega → OCR extrae datos → Validar vs PO
   ├─→ ¿Discrepancia precio? → Bloquear factura → Notificar compras
   ├─→ ¿Falta certificado calidad? → Bloquear → Notificar compras
   └─→ Todos los docs OK → Cerrar contablemente → Liberar para pago
   ↓
Fin de mes:
   ├─→ Generar reporte facturas pagadas vs pendientes
   └─→ Conciliar con bancos → Export to Sheets
```

### Técnico Workflow (Weekly)

```
Lunes AM - Review consumo materiales semana anterior
   ↓
   ├─→ Proyectar necesidades próxima semana
   └─→ Crear requisiciones de materiales (si necesario)
   ↓
   ├─→ Especificar material (NTC, INVIAS) → Enviar a Jefe Compras
   └─→ Esperar aprobación (notification) → Confirmar spec en PO
   ↓
Durante la semana:
   ├─→ Recepción en almacén → Validar calidad técnica → Aprobar/rechazar
   ├─→ Reportar consumo diario (update inventario)
   └─→ Consultar AI agent → "¿rendimiento acero vs presupuesto?"
   ↓
Viernes PM - Reporte semanal consumo por proyecto
```

### Almacén Workflow (Daily)

```
08:00 AM - Review email (recepciones pendientes próximos 7 días)
   ↓
   ├─→ Preparar espacio para entregas del día
   └─→ Coordinar con proyectos salidas programadas
   ↓
Durante el día:
   ├─→ Proveedor llega con materiales → Validar PO
   ├─→ Contar/pesar materiales → ¿Coincide con PO?
   ├─→ ¿Discrepancia? → Registrar en acta → Notificar compras
   ├─→ Recepción OK → Crear acta recepción → Subir a sistema (R8)
   ├─→ Almacenar materiales → Update inventario
   └─→ Procesar salidas a proyectos → Update inventario
   ↓
17:00 PM - Revisar stock levels (reorder points)
   ↓
Semanal (viernes):
   └─→ Generar reporte inventario físico vs sistema
```

---

## Super User Capabilities (Liced Vega)

### Current Problem

**Single Point of Failure:**
- Liced Vega aparece en mayoría de registros Excel (>70% de compras)
- Ausencia de Liced → Proceso se detiene
- **Caso Cartagena:** Ocurrió durante ausencia de Liced (2 meses sin detectar sobrecobro)

**Dependencies:**
- Aprobación de requisiciones (gate bloqueante)
- Seguimiento de proveedores (conocimiento tácito)
- Subida de certificados (última milla)
- Resolución de excepciones (escalamiento)

### Super User Permissions

| Permission | Normal User | Super User (Liced Vega) |
|------------|-------------|-------------------------|
| View all purchases | Own purchases only | ✅ All consorcios |
| Approve requisitions | ❌ | ✅ All requisitions |
| Edit closed purchases | ❌ | ✅ With audit trail |
| Reassign tasks | ❌ | ✅ Any user |
| Override blocking gates | ❌ | ✅ Emergency cases |
| Access all dashboards | Own role only | ✅ All 5 dashboards |
| Export all data | Limited | ✅ Full database |
| Configure notifications | Own only | ✅ For any user |

### Mitigation Strategy (Distribute Super User Load)

**Goal:** Reduce dependency on single person

**Approach:**

1. **Delegate Approval Authority (2+ approvers)**
   - Jefe de Compras (Liced) + Gerencia backup
   - Any approver can approve requisitions (R3)
   - Auto-escalation after 24h (if no response)

2. **Document Tribal Knowledge**
   - AI agent learns from Liced's decisions (historical data)
   - System suggests approval/rejection (ML model)
   - New users can query AI: "¿Por qué se rechazó requisición X?"

3. **Automate Routine Tasks**
   - Auto-seguimiento proveedores (R5 notifications)
   - Auto-alertas certificados faltantes (5-day deadline)
   - Auto-exportación reportes (Google Sheets weekly)

4. **Cross-Train Auxiliares**
   - Auxiliar 1 → Backup for requisition approvals
   - Auxiliar 2 → Backup for certificate uploads
   - System guides them (AI suggestions, checklists)

5. **Emergency Override (Admin)**
   - Admin can reassign tasks from Liced to other users
   - Audit trail for all reassignments
   - Gerencia notified of emergency overrides

**Success Metric:** <20% of purchases require Liced's intervention (down from 70%)

---

## Onboarding Workflow (New User)

```
1. Admin creates user account
   ↓
2. Admin assigns role (Gerencia, Compras, etc.)
   ↓
3. System sends welcome email (credentials + login link)
   ↓
4. User logs in → Forced password change
   ↓
5. System shows role-specific tutorial (5 min video)
   ↓
6. User completes interactive walkthrough (guided tour)
   ↓
7. User sets notification preferences (email time, frequency)
   ↓
8. Admin assigns user to projects/consorcios (visibility)
   ↓
9. User receives first daily email (next day 8 AM)
```

**Training Materials by Role:**
- **Gerencia:** Dashboard interpretation, approval process (10 min)
- **Compras:** 7-stage workflow, certificate upload, AI agent (30 min)
- **Contabilidad:** Invoice validation, blocking criteria (15 min)
- **Técnico:** Requisition creation, material specs (15 min)
- **Almacén:** Reception process, inventory update (20 min)

---

## Offboarding Workflow (User Leaves)

```
1. Gerencia notifies Admin (user leaving)
   ↓
2. Admin reassigns active tasks to replacement
   ↓
3. System sends handoff email (pending tasks, context)
   ↓
4. Replacement reviews tasks + AI agent context
   ↓
5. Admin deactivates user account (preserve audit trail)
   ↓
6. System revokes all permissions (RBAC)
   ↓
7. Historical data remains (user name = "Former Employee - [Name]")
```

**Critical for Liced Vega Scenario:**
- Document all open purchases (export to Sheets)
- Transfer approval authority to backup (Gerencia + Auxiliar 1)
- AI agent has full historical context (queries work)
- Replacement can ask AI: "¿Qué compras dejó Liced pendientes?"

---

## Permission Implementation (Technical)

### Database Schema

**Table: `users`**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,  -- GERENCIA, COMPRAS_JEFE, COMPRAS_AUX, etc.
  is_super_user BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);
```

**Table: `permissions`**
```sql
CREATE TABLE permissions (
  id UUID PRIMARY KEY,
  role VARCHAR(50) NOT NULL,
  resource VARCHAR(50) NOT NULL,  -- PURCHASE, INVOICE, CERTIFICATE, etc.
  action VARCHAR(50) NOT NULL,    -- CREATE, READ, UPDATE, DELETE, APPROVE
  allowed BOOLEAN NOT NULL,
  conditions JSONB  -- e.g., {"own_only": true, "project_only": ["PTAR"]}
);
```

**Table: `user_projects`** (visibility scope)
```sql
CREATE TABLE user_projects (
  user_id UUID REFERENCES users(id),
  project_id UUID REFERENCES projects(id),
  PRIMARY KEY (user_id, project_id)
);
```

### Middleware (Authorization)

**Pseudocode:**
```typescript
// src/lib/auth/can.ts
export async function can(
  userId: string,
  action: string,
  resource: string,
  resourceId?: string
): Promise<boolean> {
  const user = await getUser(userId);

  // Super user bypass (audit logged)
  if (user.is_super_user) {
    logSuperUserAction(userId, action, resource, resourceId);
    return true;
  }

  // Check role-based permissions
  const permission = await getPermission(user.role, resource, action);
  if (!permission.allowed) return false;

  // Apply conditions (e.g., own_only, project_only)
  if (permission.conditions?.own_only) {
    const resourceOwner = await getResourceOwner(resource, resourceId);
    return resourceOwner === userId;
  }

  if (permission.conditions?.project_only) {
    const userProjects = await getUserProjects(userId);
    const resourceProject = await getResourceProject(resource, resourceId);
    return userProjects.includes(resourceProject);
  }

  return true;
}
```

**Usage:**
```typescript
// API route example
if (!(await can(userId, 'APPROVE', 'REQUISITION', requisitionId))) {
  return new Response('Forbidden', { status: 403 });
}
```

---

## Audit Trail (User Actions)

**Table: `audit_log`**
```sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,  -- CREATED_PURCHASE, APPROVED_INVOICE, etc.
  resource VARCHAR(50) NOT NULL,
  resource_id UUID NOT NULL,
  old_value JSONB,  -- Before state
  new_value JSONB,  -- After state
  ip_address VARCHAR(45),
  user_agent VARCHAR(255),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Logged Actions:**
- All WRITE operations (create, update, delete)
- All APPROVE/REJECT decisions
- All super user overrides
- All permission changes (by admin)
- All data exports (to Sheets, CSV)

**Retention:** 7 years (compliance with Colombian law)

---

## Mobile Access (R13 - Future)

**Use Case:** Gerencia/Compras need mobile access (site visits, travel)

**Approach:**
- Responsive web app (Next.js mobile-optimized)
- Progressive Web App (PWA) - offline capability
- Push notifications (critical alerts)
- Mobile-friendly dashboards (swipeable cards)

**Permissions:** Same RBAC as desktop (role-based)

**Offline Mode:**
- Cache recent purchases (last 30 days)
- Queue actions (sync when online)
- Read-only dashboards (cached data)

---

## Integration with Features

| Feature | Role-Based Behavior |
|---------|---------------------|
| R1 (AI Agent) | Query scope limited by role (Técnico → own project only) |
| R2 (Dashboard) | 5 different dashboards by role (Gerencia ≠ Compras) |
| R3 (Purchase Tracking) | Visibility: Gerencia/Compras (all), Técnico (own requisitions) |
| R5 (Notifications) | Email content personalized by role (Gerencia → KPIs, Compras → tasks) |
| R6 (SICOM ETL) | Admin only can trigger manual sync |
| R7 (Price Anomalies) | Alerts: Gerencia + Compras Jefe only (not Auxiliares) |
| R8 (Certificates) | Upload: Compras + Almacén, Validate: Técnico (quality) |
| R11 (Google Workspace) | Export to Sheets: Gerencia + Compras Jefe only |

---

## Success Metrics (RBAC Effectiveness)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Super user dependency | <20% purchases require Liced | % purchases with Liced actions |
| Onboarding time | <30 min | Time to first successful action |
| Permission violations | 0 | Audit log review (weekly) |
| User satisfaction (RBAC) | >80% | "¿El sistema muestra solo lo que necesitas?" |
| Cross-training success | 2+ backup approvers | # users who can approve requisitions |

---

## Future Enhancements (Post-MVP)

1. **Dynamic Permissions** - Admin can create custom roles (not just 6 predefined)
2. **Temporary Delegation** - Liced delegates authority during vacation (time-bound)
3. **Approval Workflows** - Multi-level approvals for purchases >$X (configurable)
4. **AI-Suggested Permissions** - "User X always queries Project Y → Suggest adding to scope"
5. **Mobile Biometric Auth** - Fingerprint/Face ID for mobile app login

---

## References

- PRD Feature F18 (Gestión de Usuarios y Permisos)
- Meeting PO: docs/meets/contecsa_meet_2025-12-22.txt (Liced Vega super user)
- Excel Analysis: docs/analisis-control-compras.md (Liced appears in 70% of records)
- Business Context: docs/business-context.md (Single point of failure analysis)
- R2 Dashboard: docs/features/r02-dashboard.md (Role-based dashboards)
- R3 Purchase Tracking: docs/features/r03-seguimiento-compras.md (Approval gates)
