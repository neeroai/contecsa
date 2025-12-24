# R11 - Google Workspace Integration

Version: 1.0 | Date: 2025-12-22 22:05 | Priority: P0 | Status: Planned

---

## Overview

Integración nativa con Google Workspace (Gmail + Sheets) que permite envío de notificaciones automatizadas, exportación de datos a formato familiar para usuarios y autenticación SSO corporativa.

**Key Feature:** Cliente ya usa Google Workspace, integración nativa sin cambios en infraestructura existente.

---

## Business Context

**Problem:**
- Usuario acostumbrado a Google Sheets (proceso manual actual)
- Correos corporativos en Gmail (@contecsa.com)
- Reportes se exportan manualmente a Excel (2 horas)
- Sin notificaciones automáticas de compras en riesgo

**Solution:**
Integración con Gmail API para notificaciones diarias y Sheets API para exportación con un clic, manteniendo formato familiar para usuarios.

**Impact:**
- Reducción 95% tiempo exportación reportes (2h → 5min)
- Notificaciones automáticas a correos corporativos
- No requiere capacitación (usuarios ya conocen Sheets)
- SSO con cuentas Google existentes

---

## User Stories

| ID | Actor | Story | Acceptance Criteria |
|----|-------|-------|---------------------|
| US11.1 | Jefe Compras | Exportar dashboard a Google Sheets con un clic | - Botón "Exportar a Sheets"<br>- Genera nueva hoja automáticamente<br>- Link compartible generado |
| US11.2 | Gerencia | Recibir email diario con resumen ejecutivo | - Email enviado via Gmail API<br>- Formato HTML profesional<br>- Links funcionan correctamente |
| US11.3 | Contabilidad | Exportar facturas pendientes a Sheets | - Seleccionar facturas<br>- Exportar con formato tabular<br>- Fórmulas preservadas |
| US11.4 | Técnico | Acceder sistema con cuenta Google corporativa | - Login con Google SSO<br>- No requiere crear nueva cuenta<br>- Permisos basados en email domain |

---

## Technical Approach

### Architecture

```
Contecsa App
  ↓
Google Workspace APIs
  ├─→ Gmail API (notificaciones)
  │   ├─→ Send email (daily summaries)
  │   ├─→ Send email (immediate alerts)
  │   └─→ Track delivery status
  ├─→ Sheets API (exportación)
  │   ├─→ Create spreadsheet
  │   ├─→ Write data (batch)
  │   └─→ Generate shareable link
  └─→ OAuth 2.0 (autenticación)
      ├─→ SSO login
      └─→ API access tokens
```

### Tech Stack

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Gmail API | REST API v1 | Send emails, native integration |
| Sheets API | REST API v4 | Create/edit spreadsheets, batch operations |
| Auth | OAuth 2.0 + Service Account | SSO login + API automation |
| SDK | googleapis npm package | Official Google client library |
| Scheduler | Vercel Cron | Trigger daily email job |

---

## Gmail API Integration

### Authentication Setup

**Method 1: Service Account (for automated emails)**
- Use case: Daily summaries, automated alerts
- No user interaction required
- Domain-wide delegation (admin consent)

**Method 2: OAuth 2.0 (for user actions)**
- Use case: User sends email from app
- Consent flow required
- Refresh tokens stored securely

### Configuration Steps

**1. Enable Gmail API**
```bash
# In Google Cloud Console
1. Create project "contecsa-sistema-compras"
2. Enable Gmail API
3. Create service account
4. Download JSON credentials
5. Delegate domain-wide authority (admin.google.com)
```

**2. Environment Variables**
```env
GMAIL_SERVICE_ACCOUNT_EMAIL=sistema-compras@contecsa-xyz.iam.gserviceaccount.com
GMAIL_SERVICE_ACCOUNT_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...
GMAIL_SENDER_EMAIL=notificaciones@contecsa.com
GMAIL_SENDER_NAME=Sistema Compras Contecsa
```

**3. Scopes Required**
- `https://www.googleapis.com/auth/gmail.send` - Send emails
- `https://www.googleapis.com/auth/gmail.readonly` - Read delivery status (optional)

### Send Email Function

**Implementation: `/src/lib/gmail/send-email.ts`**
```typescript
import { google } from 'googleapis';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail(options: EmailOptions): Promise<string> {
  const auth = new google.auth.JWT({
    email: process.env.GMAIL_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GMAIL_SERVICE_ACCOUNT_PRIVATE_KEY,
    scopes: ['https://www.googleapis.com/auth/gmail.send'],
    subject: process.env.GMAIL_SENDER_EMAIL, // Impersonate this user
  });

  const gmail = google.gmail({ version: 'v1', auth });

  const message = [
    `From: ${options.from || process.env.GMAIL_SENDER_NAME} <${process.env.GMAIL_SENDER_EMAIL}>`,
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
    requestBody: { raw: encodedMessage }
  });

  return res.data.id || ''; // Return Gmail message ID
}
```

### Email Templates

**Daily Summary Template**
```typescript
// src/lib/gmail/templates/daily-summary.ts
export function generateDailySummary(data: {
  userName: string;
  comprasEnRiesgo: number;
  tareasPendientes: number;
  compras: Array<{ id: string; proyecto: string; dias: number }>;
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; }
    .header { background: #1a73e8; color: white; padding: 20px; }
    .alert { background: #fee; border-left: 4px solid #d32f2f; padding: 10px; margin: 10px 0; }
    .button { background: #1a73e8; color: white; padding: 10px 20px; text-decoration: none; }
  </style>
</head>
<body>
  <div class="header">
    <h2>Resumen Diario - Sistema Compras Contecsa</h2>
  </div>
  <p>Hola ${data.userName},</p>
  <p>Aquí está tu resumen diario:</p>

  ${data.comprasEnRiesgo > 0 ? `
  <div class="alert">
    <h3>🔴 URGENTE - Compras en Riesgo (>30 días)</h3>
    ${data.compras.map(c => `
      <p><strong>${c.id}</strong> | ${c.proyecto} | ${c.dias} días<br>
      <a href="https://app.contecsa.com/compras/${c.id}">Ver Compra</a></p>
    `).join('')}
  </div>
  ` : ''}

  <p>Tareas pendientes: ${data.tareasPendientes}</p>
  <a href="https://app.contecsa.com/dashboard" class="button">Ver Dashboard Completo</a>
</body>
</html>
  `;
}
```

### Rate Limits

| Limit | Quota | Mitigation |
|-------|-------|------------|
| Daily send limit | 100 emails/day (free), 2000/day (Workspace) | Batch users if needed |
| Requests/sec | 250 req/sec | Queue with throttling |
| Batch size | 100 messages | Split large batches |

---

## Google Sheets API Integration

### Authentication Setup

**Service Account (recommended for exports)**
- Same service account as Gmail
- Additional scope: `https://www.googleapis.com/auth/spreadsheets`

### Export Function

**Implementation: `/src/lib/sheets/export.ts`**
```typescript
import { google } from 'googleapis';

interface ExportOptions {
  title: string;
  data: Array<Record<string, any>>;
  headers: string[];
}

export async function exportToSheets(options: ExportOptions): Promise<string> {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  // 1. Create new spreadsheet
  const createRes = await sheets.spreadsheets.create({
    requestBody: {
      properties: { title: options.title }
    }
  });

  const spreadsheetId = createRes.data.spreadsheetId!;

  // 2. Prepare data (headers + rows)
  const values = [
    options.headers,
    ...options.data.map(row => options.headers.map(h => row[h] || ''))
  ];

  // 3. Write data
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: 'Sheet1!A1',
    valueInputOption: 'RAW',
    requestBody: { values }
  });

  // 4. Format headers (bold)
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [{
        repeatCell: {
          range: { sheetId: 0, startRowIndex: 0, endRowIndex: 1 },
          cell: { userEnteredFormat: { textFormat: { bold: true } } },
          fields: 'userEnteredFormat.textFormat.bold'
        }
      }]
    }
  });

  // 5. Make shareable (anyone with link can view)
  const drive = google.drive({ version: 'v3', auth });
  await drive.permissions.create({
    fileId: spreadsheetId,
    requestBody: {
      role: 'reader',
      type: 'anyone'
    }
  });

  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;
}
```

### API Endpoint

**`/src/app/api/export/sheets/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { exportToSheets } from '@/lib/sheets/export';

export async function POST(req: NextRequest) {
  const { title, data, headers } = await req.json();

  try {
    const url = await exportToSheets({ title, data, headers });
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export to Sheets' },
      { status: 500 }
    );
  }
}
```

### Frontend Usage

**Export Button Component**
```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function ExportToSheetsButton({ data }: { data: any[] }) {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const res = await fetch('/api/export/sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Compras Export - ${new Date().toISOString().split('T')[0]}`,
          data,
          headers: ['ID', 'Proyecto', 'Proveedor', 'Monto', 'Estado']
        })
      });

      const { url } = await res.json();
      window.open(url, '_blank'); // Open Sheets in new tab
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleExport} disabled={loading}>
      {loading ? 'Exportando...' : 'Exportar a Google Sheets'}
    </Button>
  );
}
```

---

## Google SSO (OAuth 2.0)

### Configuration

**1. Create OAuth 2.0 Client**
```bash
# In Google Cloud Console
1. Go to "Credentials"
2. Create OAuth 2.0 Client ID
3. Application type: Web application
4. Authorized redirect URIs:
   - http://localhost:3000/api/auth/callback/google (dev)
   - https://app.contecsa.com/api/auth/callback/google (prod)
```

**2. Environment Variables**
```env
GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xyz
NEXTAUTH_URL=https://app.contecsa.com
NEXTAUTH_SECRET=generated-secret-32-chars
```

**3. NextAuth.js Configuration**
```typescript
// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          hd: 'contecsa.com', // Restrict to company domain
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
    })
  ],
  callbacks: {
    async signIn({ account, profile }) {
      // Only allow @contecsa.com emails
      if (profile?.email?.endsWith('@contecsa.com')) {
        return true;
      }
      return false;
    }
  }
});

export { handler as GET, handler as POST };
```

---

## Integration Points

| System | Integration Type | Purpose |
|--------|------------------|---------|
| R5 (Notificaciones) | Gmail API | Send daily summaries, immediate alerts |
| R2 (Dashboard) | Sheets API | Export KPIs, charts data |
| R3 (Seguimiento Compras) | Sheets API | Export purchase list |
| R4 (OCR Facturas) | Gmail API | Invoice intake from email (future) |
| Auth System | OAuth 2.0 | SSO login with Google accounts |

---

## Security Considerations

| Risk | Mitigation |
|------|------------|
| Service account key leak | Store in env vars (not code), rotate quarterly |
| Unauthorized email sending | Rate limit per user (10 emails/day), log all sends |
| Data exposure in Sheets | Default: "anyone with link", option for restricted sharing |
| OAuth token theft | HTTPS only, secure cookie flags, short expiry (1h) |
| Domain spoofing | Verify `hd` parameter in OAuth, restrict to @contecsa.com |

---

## Error Handling

| Error | User Message | System Action |
|-------|--------------|---------------|
| Gmail API quota exceeded | "Límite de emails alcanzado. Intenta mañana." | Queue for next day, notify admin |
| Sheets API timeout | "Exportación tardó demasiado. Intenta con menos datos." | Suggest filters, log error |
| Invalid credentials | "Error de autenticación. Contacta soporte." | Notify admin, check env vars |
| Network failure | "Error de conexión. Verifica tu internet." | Retry 3x with backoff |

---

## Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Email send time | <3s | From API call to Gmail confirmation |
| Sheet creation time | <5s | For 1,000 rows |
| Batch email (10 users) | <15s | Sequential sending |
| Sheet export (10K rows) | <20s | Including formatting |

---

## Testing Strategy

### Unit Tests
- Service account authentication
- Email template generation (HTML validity)
- Sheet data transformation (headers + rows)
- Rate limiting logic

### Integration Tests
- Full flow: Create sheet → Write data → Get shareable link
- Full flow: Generate email → Send via Gmail → Check delivery
- OAuth flow: Login → Callback → Session creation

### User Acceptance Tests
- Export dashboard to Sheets (Gerencia)
- Receive daily email (Compras)
- Login with Google SSO (all roles)
- Verify @contecsa.com domain restriction

---

## Success Criteria

**MVP Acceptance:**
- [ ] Service account authentication working
- [ ] Send email via Gmail API successfully
- [ ] Export data to Google Sheets (basic)
- [ ] Shareable link generated correctly
- [ ] OAuth SSO login functional
- [ ] Domain restriction (@contecsa.com) enforced

**Production Ready:**
- [ ] Daily emails sent reliably (delivery rate >99%)
- [ ] Export handles 10,000+ rows without timeout
- [ ] Email templates render correctly (Gmail, Outlook)
- [ ] Rate limits enforced (no quota violations)
- [ ] User satisfaction NPS >75
- [ ] Documentation complete (setup, troubleshooting)

---

## Future Enhancements (Post-MVP)

1. **Google Drive Integration** - Store invoices, certificates in Drive
2. **Google Calendar** - Sync deadlines, approval reminders
3. **Google Meet** - Schedule meetings from purchase detail view
4. **Advanced Sheets** - Auto-update Sheets on data change (real-time sync)
5. **Gmail Parsing** - R12 invoice intake from email (OCR)
6. **Google Chat** - Notifications via Chat (alternative to email)

---

## References

- PRD Feature F05 (Google Workspace Integration)
- Gmail API Documentation: https://developers.google.com/gmail/api
- Sheets API Documentation: https://developers.google.com/sheets/api
- NextAuth.js Google Provider: https://next-auth.js.org/providers/google
- Meeting PO: docs/meets/contecsa_meet_2025-12-22.txt (Workspace usage confirmed)
- R5 (Notificaciones): docs/features/r05-notificaciones.md
