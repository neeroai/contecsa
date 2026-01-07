# Repository Map: Contecsa

**Generated**: 2026-01-06 19:30 | **Commit**: 5b555fa | **Files**: 66 TS/TSX | **Dirs**: 42

---

## Quick Navigation

**When navigating this codebase:**
1. Use `rg '<symbol>'` to locate functions/classes/types
2. Open only 2-5 most relevant files
3. Iterate based on findings

**Key domains**:
- **Frontend pages**: `src/app/(dashboard)/` + `src/app/(auth)/`
- **Components**: `src/components/ui/` (shadcn) + `src/components/dashboard/` + `src/components/layout/`
- **Business logic**: `src/lib/mockup-data/` (types + generators)
- **AI Config**: `src/lib/ai/config.ts`
- **Navigation**: `src/lib/navigation.ts` (role-based)
- **Backend**: `api/` (empty - FastAPI planned)

---

## Directory Structure (3 levels)

```
.
├── ARCHITECTURE.md
├── CLAUDE.md
├── PRD.md
├── README.md
├── api/                          # Backend (FastAPI - not implemented yet)
├── biome.json
├── docs/
│   ├── README.md                 # Documentation index
│   ├── features/                 # R01-R14 feature docs
│   ├── integrations/             # SICOM, Google Workspace, AI Gateway
│   ├── meets/                    # PO meeting notes
│   └── research/
├── feature_list.json             # Feature tracking (Anthropic format)
├── next.config.ts
├── package.json
├── public/
├── specs/                        # SDD specs (f001-f014)
│   ├── f001-agente-ia/
│   ├── f002-dashboard/
│   ├── f003-seguimiento-compras/
│   └── ... (14 features total)
├── src/
│   ├── app/
│   │   ├── (auth)/               # Auth pages (login)
│   │   ├── (dashboard)/          # Dashboard pages (gerencia, compras, etc.)
│   │   ├── api/                  # API routes
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Home page
│   ├── components/
│   │   ├── dashboard/            # Dashboard-specific components
│   │   ├── layout/               # Layout components (header, sidebar)
│   │   └── ui/                   # shadcn/ui components (26 components)
│   ├── hooks/
│   │   ├── index.ts
│   │   └── use-mobile-hook.tsx
│   ├── lib/
│   │   ├── ai/                   # AI config (Gemini 2.0 Flash)
│   │   ├── mockup-data/          # Type system + data generators
│   │   │   ├── generators/       # User, Purchase, Invoice, Material, Supplier, Consortium, Stats
│   │   │   └── types/            # TypeScript interfaces + Zod schemas
│   │   ├── navigation.ts         # Role-based navigation config
│   │   ├── types/                # Global types (navigation)
│   │   └── utils.ts              # Utilities (cn, etc.)
│   ├── styles/                   # Design system docs + globals.css
│   └── types/
├── tailwind.config.ts
├── tests/
├── tsconfig.json
└── vercel.json
```

---

## Key Exports by Domain

### **Core Configuration**

**src/lib/ai/config.ts** (AI Gateway config)
- `aiConfig` - Gemini 2.0 Flash configuration

**src/lib/navigation.ts** (Role-based navigation)
- `navigationByRole` - Navigation items per role (gerencia, compras, contabilidad, tecnico, almacen)
- `roleLabels` - Human-readable role names

**src/lib/utils.ts** (Utilities)
- `cn()` - Tailwind class name merger

---

### **Type System** (src/lib/mockup-data/types/)

**user.ts** - User & Auth
- `Role` - 'gerencia' | 'compras' | 'contabilidad' | 'tecnico' | 'almacen'
- `User` - User interface (id, name, email, role, tenantId)
- `UserProfile` - Extended user with preferences
- `AuthSession` - Session management
- Zod schemas: `UserSchema`, `UserProfileSchema`, `AuthSessionSchema`

**purchase.ts** - Purchase Orders
- `PurchaseState` - PO lifecycle states
- `PurchaseStatusConfig` - Status color/label/actions
- `Purchase` - Purchase order interface

**invoice.ts** - Invoices
- `InvoiceStatus` - Invoice states
- `Invoice` - Invoice interface (linked to purchases)

**material.ts** - Materials
- `MaterialCategory` - Material types
- `Material` - Material catalog

**notification.ts** - Notifications
- `NotificationCategory` - Notification types
- `Notification` - Notification interface

**certificate.ts** - Quality Certificates
- `CertificateType` - Certificate types
- `QualityCertificate` - Certificate interface

**inventory.ts** - Warehouse
- `InventoryMovement` - Stock movements
- `InventoryItem` - Stock items

**project.ts** - Projects & Consortiums
- `Consortium` - Consortium/project entity
- `Project` - Project details

---

### **Data Generators** (src/lib/mockup-data/generators/)

**users.ts** - User data
- `generateUsers()` - Generate 10 mock users
- `USERS` - Static user dataset
- `getUsersByRole(role)` - Filter by role
- `getLicedVega()` - Get super user (from requirements)

**suppliers.ts** - Supplier data
- `Supplier` - Interface
- `generateSuppliers()` - 27 Colombian suppliers
- `SUPPLIERS` - Static dataset
- `getSupplierByName(name)` - Lookup

**materials.ts** - Material catalog
- `generateMaterials()` - 30 construction materials
- `MATERIALS` - Static dataset
- `getMaterialByCode(code)` - Lookup
- `getMaterialsByCategory(category)` - Filter

**purchases.ts** - Purchase orders
- `generatePurchases()` - 55 POs with realistic workflow
- `PURCHASES` - Static dataset
- `getPurchasesByState(state)` - Filter
- `getOverduePurchases()` - Late POs
- `getPurchasesStats()` - Aggregations

**invoices.ts** - Invoices
- `generateInvoices()` - 198 invoices
- `INVOICES` - Static dataset
- `getCasoCartagenaInvoices()` - Critical test case (3 overbilling invoices)
- `getInvoicesWithAnomalies()` - Price anomalies >10%
- `getInvoiceStats()` - Aggregations

**consorcios.ts** - Consortiums & Projects
- `generateConsorcios()` - 9 consortiums
- `generateProjects()` - 15 projects
- `CONSORCIOS`, `PROJECTS` - Static datasets
- `getConsortiumByCode(code)` - Lookup
- `getProjectsByConsortium(id)` - Filter

**stats.ts** - Statistics helpers
- Price variation calculations
- Aggregation utilities

---

### **Pages** (src/app/)

**layout.tsx** - Root layout
- `metadata` - SEO metadata
- `RootLayout` - Root component (providers, fonts)

**page.tsx** - Home page
- `HomePage` - Landing/redirect logic

**(auth)/login/page.tsx** - Auth
- `LoginPage` - Login form

**(dashboard)/dashboard/gerencia/page.tsx** - Gerencia dashboard
- `GerenciaDashboard` - Executive dashboard

**(dashboard)/dashboard/compras/page.tsx** - Compras dashboard
- `ComprasDashboard` - Purchasing dashboard

**(dashboard)/dashboard/contabilidad/page.tsx** - Contabilidad dashboard
- `ContabilidadDashboard` - Accounting dashboard

**api/ai/test/route.ts** - API route
- `GET` - AI test endpoint

---

### **Components**

**Layout** (src/components/layout/)
- `Header` - Top navigation bar (user menu, notifications)
- `AppSidebar` - Left sidebar (role-based navigation)

**Dashboard** (src/components/dashboard/)
- `KPICard` - Metric display card
- `DashboardShell` - Dashboard wrapper component

**UI** (src/components/ui/) - shadcn/ui components (26 total)
- `Avatar`, `AvatarImage`, `AvatarFallback`
- `Breadcrumb`, `BreadcrumbItem`, etc.
- `Calendar`, `CalendarDayButton`
- `Form`, `FormField`, `FormLabel`, etc.
- `Skeleton` - Loading skeleton

---

### **Hooks** (src/hooks/)

**use-mobile-hook.tsx**
- `useIsMobile()` - Responsive breakpoint hook

---

## Navigation Protocol (from CLAUDE.md)

**Operational Rule**: DO NOT read everything. Follow this flow:

1. **Search first**: `rg '<symbol|endpoint|keyword>'` to locate
2. **Open 2-5 files**: Most probable files based on search results
3. **Iterate**: Expand search if needed, but stay focused

**Noise directories** (ignored in searches):
- node_modules/, dist/, build/, .next/, coverage/, .git/
- .archive/, _archive/
- specs/ (feature specs documented in docs/)

---

## Regenerate This Map

```bash
# Update REPO_MAP.md
tree -L 3 -I 'node_modules|dist|build|.next|coverage|.git' > .context/REPO_MAP.md
rg -n --glob '*.ts' --glob '*.tsx' '^(export |export default )' src/ >> .context/REPO_MAP.md

# Or use CI (automated daily + on push)
# See .github/workflows/index.yml
```

---

## Token Budget

**This file**: ~1,500 tokens (symbol index)
**Base context**: CLAUDE.md (1K) + ARCHITECTURE.md (500) = ~1.5K tokens
**With navigation**: +REPO_MAP.md (1.5K) = **~3K tokens max**

**Philosophy**: One file, simple tools (tree + rg), zero dependencies, git-tracked
