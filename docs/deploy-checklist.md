# Deploy Checklist - Vercel

Version: 1.0 | Date: 2025-12-22

## Pre-Deploy

- [ ] Build local exitoso (`bun run build`)
- [ ] Tests pasando (cuando existan)
- [ ] Variables de entorno documentadas

## Configurar Vercel AI Gateway

### Dashboard → AI Gateway

1. **Enable AI Gateway** para el proyecto Contecsa
2. **Configurar Providers:**
   - **Primary**: Gemini (Google)
     - Model: `gemini-2.0-flash-exp`
     - API Key: (proveer key de Google AI Studio)
   - **Fallback**: DeepSeek
     - API Key: (proveer key de DeepSeek)
3. **Copiar AI_GATEWAY_API_KEY** generado

### Dashboard → Settings → Environment Variables

Configure las siguientes variables:

| Variable | Scope | Valor |
|----------|-------|-------|
| `AI_GATEWAY_API_KEY` | Production, Preview | (from AI Gateway dashboard) |
| `AI_SDK_LOG_WARNINGS` | All | `false` |
| `DATABASE_URL` | All | Auto (Vercel Postgres) |
| `BLOB_READ_WRITE_TOKEN` | All | Auto (Vercel Blob) |

## Deploy en Vercel

### Dashboard → Settings → Build & Development

| Setting | Value |
|---------|-------|
| Framework Preset | Next.js |
| Build Command | `bun run build` |
| Output Directory | `.next` |
| Install Command | `bun install` |
| Development Command | `bun run dev` |
| Node.js Version | 20.x |

### Región

- **Recomendado**: `gru1` (São Paulo) - Más cercano a LATAM
- **Alternativa**: `iad1` (Washington DC) - Si gru1 no está disponible

## Post-Deploy

### Smoke Test

1. Deploy a **Preview Environment** primero
2. Test smoke endpoint:
   ```bash
   curl https://[preview-url]/api/ai/test
   ```
3. Expected response:
   ```json
   {
     "success": true,
     "response": "AI SDK v6 funcionando",
     "version": "ai-sdk-v6-with-ai-gateway",
     "model": "gemini-2.0-flash-exp"
   }
   ```

### Verificaciones

- [ ] Build en Vercel exitoso
- [ ] Preview deployment funcional
- [ ] Smoke test en preview URL exitoso
- [ ] Sin errores en Vercel Logs

### Production Deploy

- [ ] Merge a `main` branch
- [ ] Deploy production automático
- [ ] Monitoreo activo (primeras 24h)
- [ ] Sin errores en Vercel Analytics

## Troubleshooting

### Error: AI_GATEWAY_API_KEY not configured

**Síntoma:** API retorna error 500

**Fix:**
1. Vercel Dashboard → Settings → Environment Variables
2. Agregar `AI_GATEWAY_API_KEY` con valor del AI Gateway dashboard
3. Redeploy

### Error: Model not found / Provider error

**Síntoma:** API retorna error relacionado a modelo

**Fix:**
1. Vercel Dashboard → AI Gateway
2. Verificar que Gemini esté configurado como provider
3. Verificar que API key de Google sea válida
4. Redeploy

### Error: Build failed (bun not supported)

**Síntoma:** Build falla en Vercel con error de bun

**Fix:**
1. Cambiar `vercel.json`:
   ```json
   {
     "installCommand": "npm install",
     "buildCommand": "npm run build"
   }
   ```
2. Redeploy

## Rollback (si falla)

1. **Identificar error** en Vercel Logs
2. **Revert commit**:
   ```bash
   git revert HEAD
   git push origin main
   ```
3. **Redeploy** desde Vercel dashboard (seleccionar commit previo)

**Tiempo estimado de rollback:** <15 minutos

## Próximos Pasos (Post-Deploy Exitoso)

1. Eliminar smoke test endpoint `/api/ai/test` (solo para validación)
2. Implementar Feature F02 (Agente IA Conversacional)
3. Setup Vercel KV (Redis) para caché
4. Configurar Vercel Analytics
5. Monitoreo AI Gateway metrics (latency, costs, errors)
