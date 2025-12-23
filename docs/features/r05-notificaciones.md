# R5 - Sistema de Notificaciones

Version: 1.0 | Date: 2025-12-22 22:05 | Priority: P0 | Status: Planned

---

## Overview

Sistema de notificaciones por email que envía resumen diario consolidado personalizado por rol (1 email por día por usuario) con compras abiertas, alertas y tareas pendientes usando Gmail API.

**Key Feature:** 1 email consolidado por día (no spam), contenido relevante por rol, actionable items (click para resolver).

---

## Business Context

**Problem:**
- Sin alertas automáticas en proceso Excel manual
- Compras >30 días pasan inadvertidas
- Gerencia sin visibilidad de compras en riesgo
- Seguimiento reactivo (no proactivo)

**Solution:**
Email diario a las 8 AM (hora Colombia) con resumen personalizado: compras abiertas, alertas por vencer, tareas pendientes, KPIs relevantes.

**Impact:**
- Detección proactiva de compras en riesgo
- Reducción 80% en compras vencidas (>30 días)
- Mejora en tiempo de respuesta (email → acción)

---

## User Stories

| ID | Actor | Story | Acceptance Criteria |
|----|-------|-------|---------------------|
| US5.1 | Jefe Compras | Recibir email diario con compras >30 días | - Email a las 8 AM<br>- Lista de compras en riesgo<br>- Link directo a cada compra |
| US5.2 | Gerente | Recibir resumen ejecutivo semanal | - Email lunes 8 AM<br>- KPIs clave<br>- Gráfica de tendencia |
| US5.3 | Contabilidad | Recibir alerta de facturas bloqueadas | - Email inmediato al bloqueo<br>- Razón del bloqueo<br>- Link a factura |
| US5.4 | Almacén | Recibir resumen de recepciones pendientes | - Email diario 10 AM<br>- Listado de recepciones pendientes<br>- Próximos ingresos (7 días) |
| US5.5 | Técnico | Recibir notificación de requisición aprobada | - Email inmediato post-aprobación<br>- Detalles de requisición<br>- Siguiente paso (crear orden) |

---

## Technical Approach

### Architecture

```
PostgreSQL (triggers + scheduler)
  ↓
Notification Service (Python/TypeScript)
  ├─→ Query DB for alerts
  ├─→ Group by user/role
  ├─→ Generate email content (HTML)
  └─→ Send via Gmail API
  ↓
Gmail API (Send Email)
  ↓
User Inbox (Gmail, Outlook, etc.)
```

### Tech Stack

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Email Provider | Gmail API (Google Workspace) | Client already uses Google, native integration |
| Email Templates | React Email or MJML | Responsive HTML emails, component-based |
| Scheduler | cron or Vercel Cron | Daily/weekly execution |
| Queue (optional) | Redis (Vercel KV) | Decouple email generation from sending |
| Logging | PostgreSQL table | Track email sent, opened, clicked |

---

## Notification Types

### 1. Daily Summary (8 AM)

**Recipients:** All users with active purchases

**Content by Role:**

**Gerencia:**
- Total compras activas
- Compras en riesgo (>30 días)
- Gasto mensual vs presupuesto
- Top 3 compras más grandes
- Link a dashboard

**Compras:**
- Compras abiertas asignadas
- Compras >30 días (urgentes)
- Órdenes sin confirmar (>7 días)
- Certificados faltantes
- Links directos a cada compra

**Contabilidad:**
- Facturas pendientes de validación
- Facturas bloqueadas (requieren acción)
- Total por pagar
- Facturas vencidas (>fecha límite)

**Técnico:**
- Requisiciones creadas (estado)
- Materiales por recibir
- Consumo semanal vs presupuesto

**Almacén:**
- Recepciones pendientes
- Entregas parciales
- Próximos ingresos (7 días)
- Órdenes confirmadas sin recepción

---

### 2. Immediate Alerts (Event-Triggered)

| Alert | Trigger | Recipient | Urgency |
|-------|---------|-----------|---------|
| Factura Bloqueada | Invoice validation fails | Contabilidad, Jefe Compras | High |
| Compra >45 Días | Daily check at 8 AM | Jefe Compras, Gerencia, CEO | Critical |
| Requisición Aprobada | Approval event | Técnico creator, Jefe Compras | Medium |
| Orden Confirmada | Supplier confirmation | Almacén, Jefe Compras | Medium |
| Certificado Faltante | 5 días post-recepción | Jefe Compras | High |
| Anomalía Precio (R7) | Price >10% vs histórico | Jefe Compras, Gerencia | High |

---

### 3. Weekly Executive Summary (Monday 8 AM)

**Recipients:** Gerencia only

**Content:**
- Compras cerradas vs abiertas (semana anterior)
- Gasto total semanal
- Top 5 proveedores por gasto
- Gráfica tendencia gasto (12 semanas)
- Compras en riesgo (>30 días)
- Próximos vencimientos (próxima semana)

---

## Email Template Design

### Daily Summary Example (Jefe Compras)

```html
Subject: Resumen Diario Compras - 12 activas, 3 en riesgo

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Resumen Diario - Sistema Compras Contecsa
Martes, 22 Enero 2025 - 8:00 AM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hola Liced,

Aquí está tu resumen diario:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔴 URGENTE - Compras en Riesgo (>30 días)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. C-038 | PTAR | XYZ Concreto | 35 días
   Estado: ORDEN (sin confirmar)
   → [Ver Compra] [Contactar Proveedor]

2. C-042 | PAVIC | ABC Materiales | 32 días
   Estado: RECEPCIÓN (certificado faltante)
   → [Ver Compra] [Subir Certificado]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏰ Tareas Pendientes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• 5 órdenes sin confirmar (>7 días)
• 3 certificados faltantes
• 2 facturas pendientes de validar

→ [Ver Dashboard Completo]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📈 Resumen Rápido
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Compras activas:     12
Cerradas esta semana: 3
Gasto mensual:       $45.2M COP

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Sistema Compras Contecsa | Powered by Neero
[Desuscribirse] [Preferencias]
```

---

## Gmail API Integration

### Authentication

**Method:** OAuth 2.0 Service Account (Google Workspace)

**Setup:**
1. Create service account in Google Cloud Console
2. Enable Gmail API
3. Delegate domain-wide authority
4. Download JSON credentials
5. Store in environment variable `GMAIL_SERVICE_ACCOUNT_JSON`

**Scopes Required:**
- `https://www.googleapis.com/auth/gmail.send` - Send emails
- `https://www.googleapis.com/auth/gmail.readonly` - Read delivery status (optional)

---

### Send Email Function

```typescript
import { google } from 'googleapis';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

async function sendEmail(options: EmailOptions) {
  const gmail = google.gmail({ version: 'v1', auth: getAuthClient() });

  const message = [
    `From: ${options.from || 'Sistema Compras <compras@contecsa.com>'}`,
    `To: ${options.to}`,
    `Subject: ${options.subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    '',
    options.html
  ].join('\n');

  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const res = await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: encodedMessage
    }
  });

  return res.data.id; // Email message ID
}
```

---

## Scheduler Configuration

### Daily Summary (8 AM Colombia Time)

**Vercel Cron:**
```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/notifications/daily-summary",
      "schedule": "0 13 * * *"  // 8 AM COT = 1 PM UTC
    },
    {
      "path": "/api/notifications/weekly-summary",
      "schedule": "0 13 * * 1"  // Monday 8 AM COT
    }
  ]
}
```

**Endpoint:** `/api/notifications/daily-summary/route.ts`

```typescript
export async function GET(request: Request) {
  // 1. Query DB for alerts per user
  const alerts = await getAlertsByUser();

  // 2. Generate email content per user
  const emails = alerts.map(generateEmailContent);

  // 3. Send emails via Gmail API
  await Promise.all(emails.map(sendEmail));

  // 4. Log sent emails
  await logEmailsSent(emails);

  return Response.json({ sent: emails.length });
}
```

---

## Email Tracking

### Logging

**Table: `notification_log`**
```sql
CREATE TABLE notification_log (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  email VARCHAR(255) NOT NULL,
  notification_type VARCHAR(50),  -- DAILY_SUMMARY, ALERT, WEEKLY
  subject VARCHAR(255),
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  gmail_message_id VARCHAR(255),
  delivery_status VARCHAR(20),  -- SENT, DELIVERED, BOUNCED, FAILED
  opened_at TIMESTAMP,
  clicked_at TIMESTAMP
);
```

**Metrics:**
- **Delivery rate:** % emails delivered successfully (target: >99%)
- **Open rate:** % emails opened within 24h (target: >60%)
- **Click rate:** % emails with at least 1 link clicked (target: >30%)
- **Bounce rate:** % emails bounced (target: <1%)

---

## Personalization

### User Preferences

**Table: `user_notification_prefs`**
```sql
CREATE TABLE user_notification_prefs (
  user_id UUID PRIMARY KEY,
  daily_summary_enabled BOOLEAN DEFAULT TRUE,
  daily_summary_time TIME DEFAULT '08:00',  -- User can customize time
  weekly_summary_enabled BOOLEAN DEFAULT TRUE,
  immediate_alerts_enabled BOOLEAN DEFAULT TRUE,
  email_format VARCHAR(20) DEFAULT 'HTML',  -- HTML or PLAIN_TEXT
  language VARCHAR(10) DEFAULT 'es'  -- Spanish by default
);
```

**User Control:**
- Unsubscribe link in every email
- Preferences page in app (`/settings/notifications`)
- Customize time of daily summary (8 AM, 9 AM, 10 AM)
- Disable specific alert types

---

## Error Handling

| Error | Mitigation | Notification |
|-------|------------|--------------|
| Gmail API down | Retry 3x with backoff, queue for later | Email admin if >1h downtime |
| Invalid email address | Log error, skip user, notify admin | Weekly report of invalid emails |
| Rate limit (100 emails/min) | Implement queue with throttling | Auto-slow down sending |
| Email bounce | Mark user email as invalid, notify admin | Admin dashboard shows bounced emails |
| Template render fail | Fallback to plain text version | Log error, send simplified email |

---

## Testing Strategy

### Unit Tests
- Email template rendering (all roles)
- Gmail API send function (mock API)
- Alert condition logic
- User preference filtering

### Integration Tests
- Full flow: DB query → template → send → log
- Scheduler trigger (Vercel Cron)
- Error handling (Gmail API down, bounce, etc.)

### User Acceptance Tests
- Send test emails to all roles (6 personas)
- Verify content relevance
- Test links (click → correct destination)
- Test unsubscribe flow

---

## Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Email generation time | <2s per email | Server-side render |
| Sending rate | 50 emails/min | Gmail API limit compliance |
| Total daily job time | <5 min | For 10 users |
| Delivery time | <1 min | From send to inbox |
| Template render size | <100 KB | Keep emails lightweight |

---

## Success Criteria

**MVP Acceptance:**
- [ ] Daily summary email sent to 3+ roles
- [ ] Immediate alerts trigger correctly (factura bloqueada, etc.)
- [ ] Gmail API authentication working
- [ ] Email templates render correctly (HTML + plain text fallback)
- [ ] Links in emails work (click → app)
- [ ] Unsubscribe flow functional

**Production Ready:**
- [ ] All 6 roles receiving personalized emails
- [ ] Delivery rate >99% (tested 1 week)
- [ ] Open rate >50% (validated with users)
- [ ] No spam complaints
- [ ] User preferences respected
- [ ] Admin dashboard shows email metrics

---

## Future Enhancements (Post-MVP)

1. **SMS Notifications** - Critical alerts via SMS (Twilio)
2. **Push Notifications** - Mobile app push (Firebase Cloud Messaging)
3. **WhatsApp Integration** - Use WhatsApp Business API for alerts
4. **Digest Customization** - Users select which KPIs to include
5. **Smart Timing** - ML to optimize send time per user (when they're most likely to open)
6. **A/B Testing** - Test subject lines, content for higher engagement

---

## References

- PRD Feature F19 (Sistema de Notificaciones)
- Gmail API Documentation: https://developers.google.com/gmail/api
- React Email: https://react.email
- Vercel Cron: https://vercel.com/docs/cron-jobs
- Google Workspace admin: docs/integrations/google-workspace.md
