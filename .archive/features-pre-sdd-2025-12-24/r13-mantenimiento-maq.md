# R13 - Mantenimiento Preventivo de Maquinaria

Version: 1.0 | Date: 2025-12-22 23:40 | Priority: P2 | Status: Planned

---

## Overview

Sistema de gestión de mantenimiento preventivo de maquinaria y equipos de construcción con calendario automático de mantenimientos, alertas por vencimiento, registro de servicios realizados y control de costos de mantenimiento.

**Key Feature:** Calendario de mantenimientos predictivo basado en horas de uso + tiempo transcurrido, alertas automáticas 7 días antes de mantenimiento preventivo, historial digital completo por equipo.

---

## Business Context

**Problem:**
- Mantenimientos preventivos se olvidan → fallas inesperadas → costos altos
- Sin registro digital de servicios realizados (papel/Excel)
- Pérdida de garantías por falta de evidencia de mantenimiento
- Auditorías HSE (salud y seguridad) requieren evidencia de mantenimiento

**Solution:**
Base de datos de maquinaria → Programación automática de mantenimientos (cada X horas o Y días) → Alertas 7 días antes → Registro digital de servicios → Exportación de evidencia para auditorías.

**Impact:**
- Reducción 60% fallas inesperadas (mantenimiento preventivo oportuno)
- Reducción 40% costos de mantenimiento (prevención < reparación)
- 100% cumplimiento auditorías HSE (evidencia digital)
- Extensión vida útil equipos +30% (mantenimiento adecuado)

---

## User Stories

| ID | Actor | Story | Acceptance Criteria |
|----|-------|-------|---------------------|
| US13.1 | Jefe Maquinaria | Registrar nueva maquinaria en sistema | - Datos del equipo (marca, modelo, serie)<br>- Programación mantenimientos (horas/días)<br>- Responsable asignado |
| US13.2 | Jefe Maquinaria | Recibir alerta 7 días antes de mantenimiento | - Email automático (R5)<br>- Equipo, tipo de mantenimiento<br>- Link para registrar servicio |
| US13.3 | Técnico | Registrar mantenimiento realizado | - Fecha de servicio<br>- Tareas realizadas<br>- Repuestos usados<br>- Upload fotos/PDFs |
| US13.4 | Gerencia | Ver dashboard de maquinaria (estado, costos) | - Equipos por estado (operativo, mantenimiento, fuera de servicio)<br>- Costos mensuales de mantenimiento<br>- Próximos mantenimientos (calendario) |
| US13.5 | HSE | Exportar evidencia de mantenimientos (auditoría) | - Filtrar por equipo, fecha<br>- Descargar PDF con historial<br>- Incluye fotos, facturas |

---

## Technical Approach

### Architecture

```
Equipment Registration
  ↓
  ├─→ Maintenance schedule (every X hours OR Y days)
  └─→ Assign responsible user
  ↓
Daily Check (Cron Job)
  ├─→ Calculate next maintenance date/hours
  ├─→ If within 7 days → Send alert (R5)
  └─→ Dashboard: Show upcoming maintenances
  ↓
Maintenance Performed
  ├─→ Technician registers service
  ├─→ Upload evidence (photos, invoices)
  ├─→ Update next_maintenance_date
  └─→ Log event (audit trail)
```

### Database Schema

```sql
CREATE TABLE equipment (
  id UUID PRIMARY KEY,
  equipment_type VARCHAR(100) NOT NULL,  -- EXCAVATOR, MIXER, CRANE, etc.
  brand VARCHAR(100),
  model VARCHAR(100),
  serial_number VARCHAR(100) UNIQUE,
  purchase_date DATE,
  warranty_expiry_date DATE,
  status VARCHAR(50) DEFAULT 'OPERATIONAL',  -- OPERATIONAL, MAINTENANCE, OUT_OF_SERVICE
  assigned_project UUID REFERENCES projects(id),
  responsible_user UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE maintenance_schedules (
  id UUID PRIMARY KEY,
  equipment_id UUID REFERENCES equipment(id) NOT NULL,
  maintenance_type VARCHAR(100) NOT NULL,  -- PREVENTIVE, CORRECTIVE, INSPECTION
  frequency_hours INT,  -- e.g., every 500 hours
  frequency_days INT,   -- e.g., every 90 days
  last_maintenance_date DATE,
  last_maintenance_hours INT,
  next_maintenance_date DATE,
  next_maintenance_hours INT,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE maintenance_records (
  id UUID PRIMARY KEY,
  equipment_id UUID REFERENCES equipment(id) NOT NULL,
  maintenance_type VARCHAR(100) NOT NULL,
  performed_date DATE NOT NULL,
  performed_by UUID REFERENCES users(id),
  hours_at_service INT,
  tasks_performed TEXT[],  -- Array of tasks
  parts_replaced TEXT[],
  cost_cop DECIMAL(15, 2),
  invoice_pdf_url VARCHAR(512),
  photos_urls VARCHAR(512)[],
  notes TEXT,
  next_maintenance_scheduled DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Alert System

```python
# Daily cron job: Check upcoming maintenances
async def check_upcoming_maintenances():
    """
    Find equipment needing maintenance in next 7 days
    """
    upcoming = await db.query("""
        SELECT
            e.id as equipment_id,
            e.equipment_type,
            e.brand,
            e.model,
            e.serial_number,
            ms.maintenance_type,
            ms.next_maintenance_date,
            u.email as responsible_email,
            u.name as responsible_name
        FROM equipment e
        JOIN maintenance_schedules ms ON e.id = ms.equipment_id
        JOIN users u ON e.responsible_user = u.id
        WHERE ms.next_maintenance_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
          AND ms.is_active = TRUE
          AND e.status = 'OPERATIONAL'
    """)

    for maint in upcoming:
        # Send alert email
        await send_email(
            to=maint['responsible_email'],
            subject=f"Mantenimiento Próximo: {maint['equipment_type']} {maint['model']}",
            html=f"""
                <h2>Mantenimiento Preventivo Próximo</h2>

                <p>Hola {maint['responsible_name']},</p>

                <p>El siguiente equipo requiere mantenimiento en <strong>{maint['next_maintenance_date']}</strong>:</p>

                <ul>
                    <li><strong>Equipo:</strong> {maint['equipment_type']} {maint['brand']} {maint['model']}</li>
                    <li><strong>Serie:</strong> {maint['serial_number']}</li>
                    <li><strong>Tipo:</strong> {maint['maintenance_type']}</li>
                    <li><strong>Fecha:</strong> {maint['next_maintenance_date']}</li>
                </ul>

                <p><a href="https://app.contecsa.com/equipment/{maint['equipment_id']}">Registrar Mantenimiento</a></p>
            """
        )
```

---

## Integration with Features

| Feature | Integration Point |
|---------|-------------------|
| R5 (Notifications) | Email alerts for upcoming maintenance |
| R2 (Dashboard) | Equipment status dashboard (Gerencia) |
| R9 (Inventory) | Track spare parts usage |
| R10 (Financial) | Maintenance costs per project |

---

## References

- PRD Feature F13 (Mantenimiento Maquinaria)
- R5 (Notifications): docs/features/r05-notificaciones.md
- R2 (Dashboard): docs/features/r02-dashboard.md
