# Project Plan: Contecsa

Version: 1.0 | Date: 2025-12-23 | Owner: Javier Polo | Status: Active

---

## Stack [VALIDATED]

| Layer | Technology | Version |
|-------|------------|---------|
| Frontend | Next.js + React | 15.1.3 + 19.0.0 |
| Language | TypeScript | 5.6.3 (strict) |
| Styling | Tailwind CSS | 4.0.0 |
| Backend | Python + FastAPI | 3.11+ |
| Database | PostgreSQL + Redis | 15 + latest |
| AI | Vercel AI SDK + Gemini | 6.0.1 |
| Deploy | Vercel + GCP/AWS | latest |

**Validation:**
- [x] NO INVENTAR protocol applied
- [x] Stack matches docs-global/stack/
- [x] ClaudeCode&OnlyMe filter passed

---

## Phases

### Phase 1: Setup [CURRENT]
- [x] Project scaffolding
- [x] AI SDK v6 integration
- [x] Documentation structure
- [ ] Quality gates CI/CD
- [ ] Database schema

### Phase 2: ETL + Data Layer
- [ ] SICOM connection (read-only)
- [ ] PostgreSQL warehouse
- [ ] Incremental sync jobs

### Phase 3: Dashboard + UI
- [ ] Executive dashboard
- [ ] Purchase tracking views
- [ ] Charts and KPIs

### Phase 4: AI Agent
- [ ] Chat interface
- [ ] Context retrieval
- [ ] Tool calling

### Phase 5: Advanced Features
- [ ] OCR facturas
- [ ] Notificaciones
- [ ] Proyecciones

---

## Integration Points

| System | Type | Status |
|--------|------|--------|
| SICOM | Legacy ERP (read-only) | Pending |
| PostgreSQL | Data warehouse | Pending |
| Gemini 2.0 Flash | Primary LLM | Configured |
| Vercel | Frontend deploy | Active |

---

## Notes

- Backend Python required by PO for complex data analysis
- SICOM is ALWAYS read-only (critical constraint)
- 14 features tracked in feature_list.json (R01-R14)
