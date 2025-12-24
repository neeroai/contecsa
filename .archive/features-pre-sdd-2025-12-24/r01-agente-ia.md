# R1 - Agente IA Conversacional

Version: 1.0 | Date: 2025-12-22 22:05 | Priority: P0 | Status: Planned

---

## Overview

Agente conversacional impulsado por IA que permite consultas en lenguaje natural sobre el sistema de compras, generando respuestas, dashboards y análisis on-demand sin necesidad de formularios tradicionales.

**Philosophy:** IA como protagonista, no como feature adicional. Usuario interactúa primero con inteligencia (lenguaje natural), luego con formularios estructurados.

---

## Business Context

**Problem:**
- Consultas de datos requieren exportar a Excel y manipular manualmente (2 horas promedio)
- Sin capacidad de análisis predictivo
- Informes estáticos requieren personal técnico para generar
- Usuarios no técnicos dependen de expertos para obtener insights

**Solution:**
Agente conversacional que entiende consultas de negocio en español, ejecuta análisis complejos, genera visualizaciones y exporta resultados en segundos.

**Impact:**
- Reducción 90% tiempo generación reportes (2h → 10min)
- Democratización de análisis de datos (acceso sin conocimiento técnico)
- Insights en tiempo real para toma de decisiones

---

## User Stories

| ID | Actor | Story | Acceptance Criteria |
|----|-------|-------|---------------------|
| US1.1 | Gerente General | "Muéstrame compras PAVICONSTRUJC Q1 2025 con precios >10% vs histórico" | - Agente interpreta consulta correctamente<br>- Genera gráfica comparativa<br>- Responde en <10 segundos<br>- Identifica variaciones de precio |
| US1.2 | Jefe Compras | "Necesito gráfica de combustible por mes último año" | - Genera gráfica automáticamente<br>- Permite exportar a PNG/Excel<br>- Filtra por tipo de combustible |
| US1.3 | Contabilidad | "Cuánto hemos gastado en concreto este mes vs mes anterior?" | - Calcula totales por período<br>- Muestra variación porcentual<br>- Incluye breakdown por consorcio |
| US1.4 | Técnico | "Cuál es el consumo promedio de arena en PTAR?" | - Filtra por proyecto específico<br>- Calcula promedios por período<br>- Sugiere patrones de consumo |

---

## Technical Approach

### Architecture

```
Usuario (Chat Interface)
  ↓
Vercel AI SDK 6.0 (@ai-sdk/react)
  ↓
AI Gateway (Gemini 2.0 Flash → DeepSeek fallback)
  ↓
LangChain Orchestration
  ├─→ SQL Query Generation (PostgreSQL)
  ├─→ Python Code Execution (data analysis)
  └─→ Chart Generation (matplotlib/plotly)
  ↓
Response (Text + Charts + Data)
```

### Tech Stack

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| AI Model | Gemini 2.0 Flash (primary) | Speed, cost-efficiency, Spanish language support |
| Fallback | DeepSeek | Cost-effective alternative if Gemini unavailable |
| SDK | Vercel AI SDK 6.0 | Native Next.js integration, streaming responses |
| Gateway | Vercel AI Gateway | Centralized API key management, automatic fallback |
| Orchestration | LangChain | Tool calling, chain of thought, memory management |
| Code Exec | Python sandboxed | Data analysis (pandas), chart generation |
| Cache | Redis (Vercel KV) | Frequent query caching, reduce API costs |

### Implementation Details

**1. Chat Interface (Frontend)**
- Location: `src/app/agente/page.tsx`
- Components:
  - `ChatMessage` - Message bubbles (user/assistant)
  - `ChatInput` - Text input + voice option (future)
  - `ChartDisplay` - Render matplotlib/plotly charts
  - `DataTable` - Tabular results display
  - `ExportButton` - Export to Excel/Sheets/PNG

**2. AI Agent Backend**
- Location: `src/app/api/ai/chat/route.ts`
- Flow:
  1. Receive user query
  2. LangChain determines intent (query data, generate chart, export)
  3. Generate SQL query or Python code
  4. Execute safely (sandboxed)
  5. Stream response back to UI
  6. Cache result (key: query hash)

**3. Tool Functions (LangChain)**
- `queryDatabase`: Generate and execute SQL queries
- `analyzeData`: Execute Python pandas analysis
- `generateChart`: Create matplotlib/plotly visualizations
- `exportToSheets`: Export results to Google Sheets
- `exportToExcel`: Generate downloadable Excel file

**4. Safety & Limits**
- SQL: Read-only user, parameterized queries, timeout 10s
- Python: Sandboxed execution, whitelist libraries (pandas, numpy, matplotlib)
- Rate limiting: 50 queries/user/day
- Max response time: 30s
- Cache TTL: 5 minutes (frequent queries), 1 hour (complex analyses)

---

## Data Requirements

### Database Access

**Read-only access to:**
- Compras (purchases) - all fields
- Ordenes (orders) - all fields
- Facturas (invoices) - all fields
- Proveedores (suppliers) - name, category
- Proyectos (projects/consorcios) - name, active status
- Materiales (materials) - name, category, unit

**No write access** - Agent cannot modify data, only query and analyze.

### Context Data

Agent has access to:
- 9 active consorcios names
- 28 purchase tracking fields
- Historical data (55 purchases from Excel migration)
- Price history for anomaly detection
- Material categories and suppliers

---

## Integration Points

| System | Integration Type | Purpose |
|--------|------------------|---------|
| PostgreSQL | Read-only queries | Data source for analyses |
| Python Runtime | Sandboxed execution | Complex calculations, chart generation |
| Google Sheets API | Export | Familiar format for users |
| Redis Cache | Query caching | Performance, cost reduction |
| Dashboard (R2) | Embedded charts | Reuse generated visualizations |

---

## User Interface

### Chat Interface

```
┌─────────────────────────────────────────┐
│  Agente IA - Sistema Compras Contecsa  │
├─────────────────────────────────────────┤
│                                         │
│  [User]                                 │
│  Muéstrame compras PAVICONSTRUJC Q1     │
│                                         │
│              [Assistant]                │
│  Encontré 23 compras en PAVICONSTRUJC   │
│  Q1 2025. Aquí está el resumen:        │
│  - Total: $45.2M COP                   │
│  - Proveedores: 12                     │
│  - Top categoría: Concreto (35%)       │
│  [Chart: Bar graph by category]        │
│  [Export] [Ver detalles]               │
│                                         │
├─────────────────────────────────────────┤
│  Escribe tu consulta... [Enviar]       │
└─────────────────────────────────────────┘
```

### Response Types

1. **Text Response** - Simple answers to factual questions
2. **Data Table** - Tabular results (sortable, filterable)
3. **Chart** - Visualizations (bar, line, pie)
4. **Export Link** - Downloadable Excel/Sheets link
5. **Follow-up Suggestions** - Related queries user might ask

---

## Security Considerations

| Risk | Mitigation |
|------|------------|
| SQL Injection | Parameterized queries, read-only user, query validation |
| Code Injection | Sandboxed Python, whitelist libraries, timeout limits |
| Data Exposure | Role-based filtering (user sees only authorized projects) |
| API Costs | Aggressive caching, rate limiting, daily quota per user |
| Prompt Injection | Input sanitization, system prompt protection |

---

## Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Response Time (simple) | <5s | 95th percentile |
| Response Time (complex) | <15s | 95th percentile |
| Cache Hit Rate | >60% | Daily average |
| Chart Generation | <3s | After data retrieval |
| Concurrent Users | 10+ | Without degradation |

---

## Testing Strategy

### Unit Tests
- SQL query generation correctness
- Python code sandboxing
- Chart rendering
- Export functions

### Integration Tests
- End-to-end query flow
- Gemini → DeepSeek fallback
- Cache invalidation
- Rate limiting enforcement

### User Acceptance Tests
- Test with Liced Vega (super user)
- Real-world queries from Gerencia, Compras, Contabilidad
- Spanish language nuances
- Business-specific terminology (concreto, ODC, ODS, etc.)

---

## Error Handling

| Error Scenario | User Message | System Action |
|----------------|--------------|---------------|
| AI API down | "El agente está temporalmente no disponible. Por favor intenta en unos minutos." | Switch to DeepSeek, log incident |
| Query timeout | "Esta consulta es muy compleja. Por favor simplifica o contacta soporte." | Abort query, suggest simpler version |
| No results | "No encontré resultados para tu consulta. Intenta reformularla." | Suggest similar successful queries |
| Rate limit | "Has alcanzado el límite de consultas por hoy. Intenta mañana." | Block new queries, show limit reset time |

---

## Success Criteria

**MVP Acceptance:**
- [ ] Agente responde correctamente a 10 consultas predefinidas
- [ ] Genera gráficas de barras, líneas y pie
- [ ] Exporta resultados a Excel
- [ ] Tiempo respuesta promedio <10s
- [ ] Cache funciona correctamente (hit rate >50%)
- [ ] Fallback Gemini → DeepSeek funciona sin intervención

**Production Ready:**
- [ ] Prueba con 3+ usuarios reales (Gerencia, Compras, Contabilidad)
- [ ] Maneja 50+ consultas/día sin errores
- [ ] Spanish language accuracy >95%
- [ ] Satisfacción usuarios NPS >70
- [ ] Documentación de uso completa

---

## Future Enhancements (Post-MVP)

1. **Voice Input** - Speak queries instead of typing
2. **Proactive Alerts** - Agent suggests insights based on anomalies
3. **Multi-language** - English support for international users
4. **Fine-tuning** - Custom model trained on Contecsa data
5. **Memory** - Agent remembers previous conversations
6. **Scheduled Reports** - "Send me weekly summary every Monday"

---

## References

- PRD Feature F02 (Agente IA Conversacional)
- Vercel AI SDK 6.0 Documentation
- LangChain Python Documentation
- Meeting PO: docs/meets/contecsa_meet_2025-12-22.txt
- AI Gateway Setup: docs/deploy-checklist.md
