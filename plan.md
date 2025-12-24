# Project Plan: Contecsa

Version: 1.1 | Date: 2025-12-24 09:30 | Owner: Javier Polo | Status: Active

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

### Phase 0: SDD Structure [DONE]
- [x] Created /specs/ directory (14 subdirectories)
- [x] Migrated all 14 features to SDD format (70 files)
- [x] Applied ClaudeCode&OnlyMe 4Q filter to all ADRs (4/4 YES)
- [x] Cited docs-global/stack/ for all technical decisions (NO INVENTAR)
- [x] Established quality gates (format, lint, types, test 80%+, build)
- [x] Updated feature_list.json with SDD metadata
- [x] Archived original docs to .archive/

**Milestones:**
- M1 (P0): F001, F002, F003, F006 - 270h
- M2 (P1): F004, F005, F007, F009, F010, F014 - 370h
- M3 (P2): F008, F011, F012, F013 - 330h
- **Total: 14/14 features (100%) - 970h estimated**

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
- **SDD Migration Complete:** 14/14 features in /specs/ (70 files total)
- Feature specs available: /specs/f001-f014/ (SPEC, PLAN, ADR, TESTPLAN, TASKS)
- All decisions validated with ClaudeCode&OnlyMe filter (4/4 YES)
- Ready to implement: Start with F001 (Agente IA) or F007 (Análisis Precios - CRITICAL)
