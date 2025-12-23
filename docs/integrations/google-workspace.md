# Google Workspace Integration Guide

Version: 1.0 | Date: 2025-12-22 23:50 | Type: Integration | Status: Active

---

## Overview

Integración con Google Workspace (Gmail + Google Sheets + OAuth 2.0) para notificaciones automáticas por email, exportación de datos a formato familiar para usuarios y autenticación SSO con cuentas corporativas @contecsa.com.

**Business Context:** Cliente ya usa Google Workspace para email corporativo y gestión manual en Sheets → Integración nativa sin cambios en infraestructura existente.

---

## Services Integrated

| Service | Use Case | Features Used |
|---------|----------|---------------|
| Gmail API | Email notifications (R5, R11) | Send emails, daily summaries, immediate alerts |
| Google Sheets API | Data export (R11) | Create spreadsheets, write data, shareable links |
| OAuth 2.0 | SSO authentication (R11) | Login with Google, domain restriction (@contecsa.com) |
| Google Drive API | Certificate storage (R8, optional) | File upload, permissions, versioning |

---

## Gmail API Integration

### Setup

**1. Enable Gmail API (Google Cloud Console)**

```bash
# Steps:
1. Go to https://console.cloud.google.com
2. Create project: "contecsa-sistema-compras"
3. Enable APIs: Gmail API, Google Sheets API, Google Drive API (optional)
4. Create service account: "notificaciones-service"
5. Download JSON credentials
6. Delegate domain-wide authority (admin.google.com):
   - Email: notificaciones-service@contecsa-xyz.iam.gserviceaccount.com
   - Scopes:
     - https://www.googleapis.com/auth/gmail.send
     - https://www.googleapis.com/auth/gmail.readonly (optional)
```

**2. Environment Variables**

```env
# .env.local
GMAIL_SERVICE_ACCOUNT_EMAIL=notificaciones-service@contecsa-xyz.iam.gserviceaccount.com
GMAIL_SERVICE_ACCOUNT_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...
GMAIL_SENDER_EMAIL=notificaciones@contecsa.com
GMAIL_SENDER_NAME=Sistema Compras Contecsa
```

**3. Implementation (TypeScript/Node.js)**

```typescript
// /src/lib/gmail/client.ts
import { google } from 'googleapis';

export class GmailClient {
  private gmail;

  constructor() {
    const auth = new google.auth.JWT({
      email: process.env.GMAIL_SERVICE_ACCOUNT_EMAIL!,
      key: process.env.GMAIL_SERVICE_ACCOUNT_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/gmail.send'],
      subject: process.env.GMAIL_SENDER_EMAIL!, // Impersonate this user
    });

    this.gmail = google.gmail({ version: 'v1', auth });
  }

  async sendEmail(options: {
    to: string;
    subject: string;
    html: string;
    from?: string;
  }): Promise<string> {
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

    const res = await this.gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: encodedMessage }
    });

    return res.data.id || '';
  }
}
```

### Email Templates

**Daily Summary Template (R5)**

```typescript
// /src/lib/gmail/templates/daily-summary.ts
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
    .button { background: #1a73e8; color: white; padding: 10px 20px; text-decoration: none; display: inline-block; }
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
    <h3>URGENTE - Compras en Riesgo (>30 días)</h3>
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
| Daily send limit | 2,000 emails/day (Workspace) | Batch users, monitor usage |
| Requests/second | 250 req/sec | Throttle with queue (10 emails/batch) |
| Batch size | 100 messages max | Split large batches |

---

## Google Sheets API Integration

### Setup (same service account as Gmail)

**Additional Scope:**
- `https://www.googleapis.com/auth/spreadsheets`
- `https://www.googleapis.com/auth/drive.file` (for creating files)

### Implementation

```typescript
// /src/lib/sheets/client.ts
import { google } from 'googleapis';

export class SheetsClient {
  private sheets;
  private drive;

  constructor() {
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
      key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file'
      ],
    });

    this.sheets = google.sheets({ version: 'v4', auth });
    this.drive = google.drive({ version: 'v3', auth });
  }

  async exportToSheets(options: {
    title: string;
    data: Array<Record<string, any>>;
    headers: string[];
  }): Promise<string> {
    // 1. Create new spreadsheet
    const createRes = await this.sheets.spreadsheets.create({
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
    await this.sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Sheet1!A1',
      valueInputOption: 'RAW',
      requestBody: { values }
    });

    // 4. Format headers (bold)
    await this.sheets.spreadsheets.batchUpdate({
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
    await this.drive.permissions.create({
      fileId: spreadsheetId,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      }
    });

    return `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;
  }
}
```

### API Endpoint

```typescript
// /src/app/api/export/sheets/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { SheetsClient } from '@/lib/sheets/client';

export async function POST(req: NextRequest) {
  const { title, data, headers } = await req.json();

  try {
    const sheetsClient = new SheetsClient();
    const url = await sheetsClient.exportToSheets({ title, data, headers });

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

---

## OAuth 2.0 SSO (NextAuth.js)

### Setup

**1. Create OAuth 2.0 Client ID (Google Cloud Console)**

```bash
# Steps:
1. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
2. Application type: Web application
3. Authorized redirect URIs:
   - http://localhost:3000/api/auth/callback/google (dev)
   - https://app.contecsa.com/api/auth/callback/google (prod)
4. Copy Client ID and Client Secret
```

**2. Environment Variables**

```env
GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xyz
NEXTAUTH_URL=https://app.contecsa.com
NEXTAUTH_SECRET=generated-secret-32-chars  # Generate with: openssl rand -base64 32
```

**3. NextAuth.js Configuration**

```typescript
// /src/app/api/auth/[...nextauth]/route.ts
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
      return false; // Deny access
    },
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.userId = profile?.sub;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.userId = token.userId;
      return session;
    }
  }
});

export { handler as GET, handler as POST };
```

---

## Security Considerations

| Risk | Mitigation |
|------|------------|
| Service account key leak | Store in env vars (not code), rotate quarterly |
| Unauthorized email sending | Rate limit per user (10 emails/day), log all sends |
| Data exposure in Sheets | Default: "anyone with link", option for restricted sharing |
| OAuth token theft | HTTPS only, secure cookie flags (httpOnly), short expiry (1h) |
| Domain spoofing | Verify `hd` parameter in OAuth, restrict to @contecsa.com only |

---

## Error Handling

| Error | User Message | System Action |
|-------|--------------|---------------|
| Gmail API quota exceeded | "Límite de emails alcanzado. Intenta mañana." | Queue for next day, notify admin |
| Sheets API timeout | "Exportación tardó demasiado. Intenta con menos datos." | Suggest filters, log error |
| Invalid credentials | "Error de autenticación. Contacta soporte." | Notify admin, check env vars |
| Network failure | "Error de conexión. Verifica tu internet." | Retry 3x with exponential backoff |

---

## Testing Strategy

### Unit Tests
- Service account authentication (Gmail + Sheets)
- Email template generation (HTML validity)
- Sheet data transformation (headers + rows)
- OAuth domain restriction (@contecsa.com)

### Integration Tests
- Full flow: Create sheet → Write data → Get shareable link
- Full flow: Generate email → Send via Gmail → Check delivery (mock)
- OAuth flow: Login → Callback → Session creation

---

## References

- R5 (Notifications): docs/features/r05-notificaciones.md
- R11 (Google Workspace): docs/features/r11-google-workspace.md
- Gmail API Docs: https://developers.google.com/gmail/api
- Sheets API Docs: https://developers.google.com/sheets/api
- NextAuth.js Google Provider: https://next-auth.js.org/providers/google
