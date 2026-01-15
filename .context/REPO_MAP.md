.
├── ARCHITECTURE.md
├── CLAUDE.md
├── PRD.md
├── README.md
├── api
├── biome.json
├── bun.lock
├── claude-progress.md
├── components.json
├── docs
│   ├── README.md
│   ├── analisis-control-compras.md
│   ├── architecture-overview.md
│   ├── business-context.md
│   ├── development-guide.md
│   ├── features
│   │   ├── r01-agente-ia.md
│   │   ├── r02-dashboard.md
│   │   ├── r03-seguimiento-compras.md
│   │   ├── r04-ocr-facturas.md
│   │   ├── r05-notificaciones.md
│   │   ├── r06-etl-sicom.md
│   │   ├── r07-analisis-precios.md
│   │   ├── r08-certificados.md
│   │   ├── r09-control-inventario.md
│   │   ├── r10-proyeccion-financiera.md
│   │   ├── r11-google-workspace.md
│   │   ├── r12-facturas-email.md
│   │   ├── r13-mantenimiento-maq.md
│   │   └── r14-seguimiento-evm.md
│   ├── files
│   │   └── CONTROL COMPRAS.xlsx
│   ├── integrations
│   │   ├── ai-gateway.md
│   │   ├── google-workspace.md
│   │   ├── sicom-etl.md
│   │   └── storage.md
│   ├── meets
│   │   └── contecsa-alberto-ceballos-12-24-2025.txt
│   ├── prd.md
│   ├── research
│   │   ├── Investigación Contecsa_ Contexto para Proyecto.md
│   │   └── ejecutado-vs-proyectado-metodologias.md
│   └── tech-stack-detailed.md
├── docs-global -> ../docs-global
├── feature_list.json
├── index.html
├── next-env.d.ts
├── next.config.ts
├── package.json
├── plan.md
├── public
├── specs
│   ├── f001-agente-ia
│   │   ├── ADR.md
│   │   ├── PLAN.md
│   │   ├── SPEC.md
│   │   ├── TASKS.md
│   │   └── TESTPLAN.md
│   ├── f002-dashboard
│   │   ├── ADR.md
│   │   ├── PLAN.md
│   │   ├── SPEC.md
│   │   ├── TASKS.md
│   │   └── TESTPLAN.md
│   ├── f003-seguimiento-compras
│   │   ├── ADR.md
│   │   ├── PLAN.md
│   │   ├── SPEC.md
│   │   ├── TASKS.md
│   │   └── TESTPLAN.md
│   ├── f004-ocr-facturas
│   │   ├── ADR.md
│   │   ├── PLAN.md
│   │   ├── SPEC.md
│   │   ├── TASKS.md
│   │   └── TESTPLAN.md
│   ├── f005-notificaciones
│   │   ├── ADR.md
│   │   ├── PLAN.md
│   │   ├── SPEC.md
│   │   ├── TASKS.md
│   │   └── TESTPLAN.md
│   ├── f006-etl-sicom
│   │   ├── ADR.md
│   │   ├── PLAN.md
│   │   ├── SPEC.md
│   │   ├── TASKS.md
│   │   └── TESTPLAN.md
│   ├── f007-analisis-precios
│   │   ├── ADR.md
│   │   ├── PLAN.md
│   │   ├── SPEC.md
│   │   ├── TASKS.md
│   │   └── TESTPLAN.md
│   ├── f008-certificados
│   │   ├── ADR.md
│   │   ├── PLAN.md
│   │   ├── SPEC.md
│   │   ├── TASKS.md
│   │   └── TESTPLAN.md
│   ├── f009-control-inventario
│   │   ├── ADR.md
│   │   ├── PLAN.md
│   │   ├── SPEC.md
│   │   ├── TASKS.md
│   │   └── TESTPLAN.md
│   ├── f010-proyeccion-financiera
│   │   ├── ADR.md
│   │   ├── PLAN.md
│   │   ├── SPEC.md
│   │   ├── TASKS.md
│   │   └── TESTPLAN.md
│   ├── f011-google-workspace
│   │   ├── ADR.md
│   │   ├── PLAN.md
│   │   ├── SPEC.md
│   │   ├── TASKS.md
│   │   └── TESTPLAN.md
│   ├── f012-facturas-email
│   │   ├── ADR.md
│   │   ├── PLAN.md
│   │   ├── SPEC.md
│   │   ├── TASKS.md
│   │   └── TESTPLAN.md
│   ├── f013-mantenimiento-maq
│   │   ├── ADR.md
│   │   ├── PLAN.md
│   │   ├── SPEC.md
│   │   ├── TASKS.md
│   │   └── TESTPLAN.md
│   └── f014-seguimiento-evm
│       ├── ADR.md
│       ├── PLAN.md
│       ├── SPEC.md
│       ├── TASKS.md
│       └── TESTPLAN.md
├── src
│   ├── app
│   │   ├── (auth)
│   │   ├── (dashboard)
│   │   ├── api
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components
│   │   ├── INDEX.md
│   │   ├── dashboard
│   │   ├── layout
│   │   └── ui
│   ├── hooks
│   │   ├── INDEX.md
│   │   ├── index.ts
│   │   └── use-mobile-hook.tsx
│   ├── lib
│   │   ├── INDEX.md
│   │   ├── ai
│   │   ├── mockup-data
│   │   ├── navigation.ts
│   │   ├── types
│   │   └── utils.ts
│   ├── styles
│   │   ├── COLOR_PALETTE.md
│   │   ├── COMPONENT_SPECS.md
│   │   ├── DESIGN_SYSTEM.md
│   │   ├── README.md
│   │   ├── TOKEN_REFERENCE.md
│   │   └── globals.css
│   └── types
├── tailwind.config.ts
├── tests
│   └── setup.ts
├── todo.md
├── tsconfig.json
├── tsconfig.tsbuildinfo
├── vercel.json
└── vitest.config.ts

42 directories, 135 files


## Exported Symbols

src/app/page.tsx:3:export default function HomePage() {
src/hooks/use-mobile-hook.tsx:7:export function useIsMobile() {
src/lib/navigation.ts:19:export const navigationByRole: Record<UserRole, NavGroup[]> = {
src/lib/navigation.ts:159:export const roleLabels: Record<UserRole, string> = {
src/lib/mockup-data/generators/index.ts:14:export * from './utils';
src/lib/mockup-data/generators/index.ts:19:export {
src/lib/mockup-data/generators/index.ts:31:export {
src/lib/mockup-data/generators/index.ts:40:export type { Supplier } from './suppliers';
src/lib/mockup-data/generators/index.ts:45:export {
src/lib/mockup-data/generators/index.ts:58:export {
src/lib/mockup-data/generators/index.ts:70:export {
src/lib/mockup-data/generators/index.ts:83:export {
src/lib/mockup-data/generators/index.ts:97:export * from './stats';
src/lib/utils.ts:4:export function cn(...inputs: ClassValue[]) {
src/components/dashboard/dashboard-shell.tsx:17:export function KPICard({ title, value, description, icon: Icon, trend }: KPICardProps) {
src/components/dashboard/dashboard-shell.tsx:51:export function DashboardShell({ title, description, children }: DashboardShellProps) {
src/app/(dashboard)/layout.tsx:9:export default function DashboardLayout({
src/lib/types/navigation.ts:3:export type UserRole = 'gerencia' | 'compras' | 'contabilidad' | 'tecnico' | 'almacen';
src/lib/types/navigation.ts:5:export interface NavItem {
src/lib/types/navigation.ts:12:export interface NavGroup {
src/lib/types/navigation.ts:17:export interface UserInfo {
src/hooks/index.ts:1:export { useIsMobile } from './use-mobile-hook';
src/lib/mockup-data/generators/stats.ts:25:export function getMockupDataSummary() {
src/lib/mockup-data/generators/stats.ts:41:export function validateMockupData(): {
src/lib/mockup-data/generators/stats.ts:111:export const MOCKUP_DATA = {
src/lib/mockup-data/generators/stats.ts:124:export default MOCKUP_DATA;
src/app/(auth)/login/page.tsx:19:export default function LoginPage() {
src/lib/mockup-data/generators/users.ts:25:export function generateUser(
src/lib/mockup-data/generators/users.ts:56:export function generateUsers(): User[] {
src/lib/mockup-data/generators/users.ts:136:export const USERS = generateUsers();
src/lib/mockup-data/generators/users.ts:141:export function getUsersByRole(role: Role): User[] {
src/lib/mockup-data/generators/users.ts:148:export function getUserByName(firstName: string, lastName: string): User | undefined {
src/lib/mockup-data/generators/users.ts:157:export function getLicedVega(): User {
src/lib/mockup-data/generators/users.ts:168:export function getRandomUserByRole(role: Role): User {
src/components/layout/header.tsx:40:export function Header({ user }: HeaderProps) {
src/lib/mockup-data/generators/suppliers.ts:23:export interface Supplier {
src/lib/mockup-data/generators/suppliers.ts:40:export function generateSupplier(
src/lib/mockup-data/generators/suppliers.ts:86:export function generateSuppliers(): Supplier[] {
src/lib/mockup-data/generators/suppliers.ts:165:export const SUPPLIERS = generateSuppliers();
src/lib/mockup-data/generators/suppliers.ts:170:export function getSupplierByName(name: string): Supplier | undefined {
src/lib/mockup-data/generators/suppliers.ts:177:export function getSuppliersByCategory(category: string): Supplier[] {
src/lib/mockup-data/generators/suppliers.ts:184:export function getRandomSupplier(): Supplier {
src/lib/mockup-data/generators/suppliers.ts:191:export function getRandomSupplierByCategory(category: string): Supplier {
src/app/(auth)/layout.tsx:1:export default function AuthLayout({
src/app/(dashboard)/dashboard/contabilidad/page.tsx:8:export default function ContabilidadDashboard() {
src/app/api/ai/test/route.ts:9:export async function GET() {
src/components/layout/app-sidebar.tsx:27:export function AppSidebar({ role }: AppSidebarProps) {
src/lib/mockup-data/generators/invoices.ts:463:export function generateInvoices(): Invoice[] {
src/lib/mockup-data/generators/invoices.ts:485:export const INVOICES = generateInvoices();
src/lib/mockup-data/generators/invoices.ts:490:export function getCasoCartagenaInvoices(): Invoice[] {
src/lib/mockup-data/generators/invoices.ts:499:export function getInvoicesByStatus(status: InvoiceStatus): Invoice[] {
src/lib/mockup-data/generators/invoices.ts:506:export function getInvoicesWithAnomalies(): Invoice[] {
src/lib/mockup-data/generators/invoices.ts:513:export function getInvoicesByPurchase(purchaseId: string): Invoice[] {
src/lib/mockup-data/generators/invoices.ts:520:export function getInvoiceStats() {
src/app/(dashboard)/dashboard/gerencia/page.tsx:7:export default function GerenciaDashboard() {
src/lib/ai/config.ts:11:export const aiConfig = {
src/lib/ai/config.ts:20:export default aiConfig;
src/app/(dashboard)/dashboard/compras/page.tsx:8:export default function ComprasDashboard() {
src/lib/mockup-data/generators/materials.ts:576:export function generateMaterials(): Material[] {
src/lib/mockup-data/generators/materials.ts:583:export const MATERIALS = generateMaterials();
src/lib/mockup-data/generators/materials.ts:588:export function getMaterialByCode(code: string): Material | undefined {
src/lib/mockup-data/generators/materials.ts:595:export function getMaterialsByCategory(category: MaterialCategory): Material[] {
src/lib/mockup-data/generators/materials.ts:602:export function getRandomMaterial(): Material {
src/lib/mockup-data/generators/materials.ts:609:export function getRandomMaterialByCategory(category: MaterialCategory): Material {
src/app/layout.tsx:24:export const metadata: Metadata = {
src/app/layout.tsx:29:export default function RootLayout({
src/components/ui/sheet.tsx:110:export {
src/app/(dashboard)/dashboard/tecnico/page.tsx:8:export default function TecnicoDashboard() {
src/components/ui/form.tsx:164:export {
src/components/ui/avatar.tsx:47:export { Avatar, AvatarImage, AvatarFallback };
src/components/ui/tabs.tsx:55:export { Tabs, TabsList, TabsTrigger, TabsContent };
src/components/ui/skeleton.tsx:7:export { Skeleton };
src/lib/mockup-data/generators/purchases.ts:354:export function generatePurchases(): Purchase[] {
src/lib/mockup-data/generators/purchases.ts:389:export const PURCHASES = generatePurchases();
src/lib/mockup-data/generators/purchases.ts:394:export function getPurchasesByState(state: PurchaseState): Purchase[] {
src/lib/mockup-data/generators/purchases.ts:401:export function getOverduePurchases(): Purchase[] {
src/lib/mockup-data/generators/purchases.ts:408:export function getPurchasesByProject(projectId: string): Purchase[] {
src/lib/mockup-data/generators/purchases.ts:415:export function getPurchasesByColor(color: StatusColor): Purchase[] {
src/lib/mockup-data/generators/purchases.ts:422:export function getPurchasesStats() {
src/components/ui/alert-dialog.tsx:105:export {
src/lib/mockup-data/types/user.ts:16:export type Role = 'gerencia' | 'compras' | 'contabilidad' | 'tecnico' | 'almacen';
src/lib/mockup-data/types/user.ts:18:export const RoleEnum = {
src/lib/mockup-data/types/user.ts:29:export interface RoleMetadata {
src/lib/mockup-data/types/user.ts:35:export const ROLE_METADATA: Record<Role, RoleMetadata> = {
src/lib/mockup-data/types/user.ts:66:export interface User {
src/lib/mockup-data/types/user.ts:84:export interface UserProfile extends User {
src/lib/mockup-data/types/user.ts:93:export interface UserPreferences {
src/lib/mockup-data/types/user.ts:105:export interface AuthSession {
src/lib/mockup-data/types/user.ts:119:export const RoleSchema = z.enum(['gerencia', 'compras', 'contabilidad', 'tecnico', 'almacen']);
src/lib/mockup-data/types/user.ts:124:export const UserPreferencesSchema = z.object({
src/lib/mockup-data/types/user.ts:136:export const UserSchema = z.object({
src/lib/mockup-data/types/user.ts:154:export const UserProfileSchema = UserSchema.extend({
src/lib/mockup-data/types/user.ts:163:export const AuthSessionSchema = z.object({
src/lib/mockup-data/types/user.ts:177:export type UserPreferencesType = z.infer<typeof UserPreferencesSchema>;
src/lib/mockup-data/types/user.ts:178:export type UserType = z.infer<typeof UserSchema>;
src/lib/mockup-data/types/user.ts:179:export type UserProfileType = z.infer<typeof UserProfileSchema>;
src/lib/mockup-data/types/user.ts:180:export type AuthSessionType = z.infer<typeof AuthSessionSchema>;
src/components/ui/breadcrumb.tsx:93:export {
src/lib/mockup-data/generators/consorcios.ts:290:export function generateConsorcios(): Consortium[] {
src/lib/mockup-data/generators/consorcios.ts:418:export function generateProjects(): Project[] {
src/lib/mockup-data/generators/consorcios.ts:458:export const CONSORCIOS = generateConsorcios();
src/lib/mockup-data/generators/consorcios.ts:459:export const PROJECTS = generateProjects();
src/lib/mockup-data/generators/consorcios.ts:464:export function getConsortiumByCode(code: string): Consortium | undefined {
src/lib/mockup-data/generators/consorcios.ts:471:export function getProjectsByConsortium(consortiumId: string): Project[] {
src/lib/mockup-data/generators/consorcios.ts:478:export function getRandomProject(): Project {
src/components/ui/input.tsx:22:export { Input };
src/components/ui/progress.tsx:25:export { Progress };
src/lib/mockup-data/generators/utils.ts:83:export const rng = new SeededRandom(42);
src/lib/mockup-data/generators/utils.ts:88:export function deterministicUUID(seed: string): string {
src/lib/mockup-data/generators/utils.ts:105:export function generateNIT(): string {
src/lib/mockup-data/generators/utils.ts:115:export function generatePhone(mobile = true): string {
src/lib/mockup-data/generators/utils.ts:126:export function generateAddress(): string {
src/lib/mockup-data/generators/utils.ts:139:export const COLOMBIAN_CITIES = [
src/lib/mockup-data/generators/utils.ts:160:export const COLOMBIAN_FIRST_NAMES = [
src/lib/mockup-data/generators/utils.ts:196:export const COLOMBIAN_LAST_NAMES = [
src/lib/mockup-data/generators/utils.ts:222:export function generateName(): { firstName: string; lastName: string } {
src/lib/mockup-data/generators/utils.ts:232:export function generateEmail(
src/lib/mockup-data/generators/utils.ts:251:export function addDays(date: Date, days: number): Date {
src/lib/mockup-data/generators/utils.ts:257:export function addMonths(date: Date, months: number): Date {
src/lib/mockup-data/generators/utils.ts:263:export function subtractDays(date: Date, days: number): Date {
src/lib/mockup-data/generators/utils.ts:267:export function subtractMonths(date: Date, months: number): Date {
src/lib/mockup-data/generators/utils.ts:274:export function formatDate(date: Date): string {
src/lib/mockup-data/generators/utils.ts:281:export function formatMonth(date: Date): string {
src/lib/mockup-data/generators/utils.ts:288:export function getCurrentDate(): Date {
src/lib/mockup-data/generators/utils.ts:295:export function daysBetween(date1: Date, date2: Date): number {
src/lib/mockup-data/generators/utils.ts:303:export function randomDate(start: Date, end: Date): Date {
src/lib/mockup-data/generators/utils.ts:313:export function formatCurrency(amount: number, currency = 'COP'): string {
src/lib/mockup-data/generators/utils.ts:327:export function generatePONumber(date: Date, sequence: number): string {
src/lib/mockup-data/generators/utils.ts:339:export function generateInvoiceNumber(date: Date, sequence: number): string {
src/lib/mockup-data/generators/utils.ts:350:export function calculateStats(values: number[]): {
src/lib/mockup-data/generators/utils.ts:379:export function calculateZScore(value: number, mean: number, stdDev: number): number {
src/components/ui/chart.tsx:11:export type ChartConfig = {
src/components/ui/chart.tsx:326:export {
src/components/ui/card.tsx:58:export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
src/lib/mockup-data/types/material.ts:16:export type MaterialCategory =
src/lib/mockup-data/types/material.ts:33:export const MaterialCategoryEnum = {
src/lib/mockup-data/types/material.ts:54:export interface CategoryMetadata {
src/lib/mockup-data/types/material.ts:61:export const MATERIAL_CATEGORY_METADATA: Record<MaterialCategory, CategoryMetadata> = {
src/lib/mockup-data/types/material.ts:157:export type MaterialStatus = 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED';
src/lib/mockup-data/types/material.ts:159:export const MaterialStatusEnum = {
src/lib/mockup-data/types/material.ts:169:export interface PriceHistoryEntry {
src/lib/mockup-data/types/material.ts:186:export interface Material {
src/lib/mockup-data/types/material.ts:242:export interface MaterialFilter {
src/lib/mockup-data/types/material.ts:254:export interface MaterialComparison {
src/lib/mockup-data/types/material.ts:270:export interface SupplierPricingInfo {
src/lib/mockup-data/types/material.ts:283:export const MaterialCategorySchema = z.enum([
src/lib/mockup-data/types/material.ts:304:export const MaterialStatusSchema = z.enum(['ACTIVE', 'INACTIVE', 'DISCONTINUED']);
src/lib/mockup-data/types/material.ts:309:export const PriceHistoryEntrySchema = z.object({
src/lib/mockup-data/types/material.ts:326:export const MaterialSchema = z.object({
src/lib/mockup-data/types/material.ts:366:export const MaterialFilterSchema = z.object({
src/lib/mockup-data/types/material.ts:378:export const SupplierPricingInfoSchema = z.object({
src/lib/mockup-data/types/material.ts:391:export const MaterialComparisonSchema = z.object({
src/lib/mockup-data/types/material.ts:407:export type MaterialType = z.infer<typeof MaterialSchema>;
src/lib/mockup-data/types/material.ts:408:export type PriceHistoryEntryType = z.infer<typeof PriceHistoryEntrySchema>;
src/lib/mockup-data/types/material.ts:409:export type MaterialFilterType = z.infer<typeof MaterialFilterSchema>;
src/lib/mockup-data/types/material.ts:410:export type SupplierPricingInfoType = z.infer<typeof SupplierPricingInfoSchema>;
src/lib/mockup-data/types/material.ts:411:export type MaterialComparisonType = z.infer<typeof MaterialComparisonSchema>;
src/components/ui/select.tsx:142:export {
src/components/ui/calendar.tsx:177:export { Calendar, CalendarDayButton };
src/components/ui/alert.tsx:49:export { Alert, AlertTitle, AlertDescription };
src/components/ui/label.tsx:21:export { Label };
src/app/(dashboard)/dashboard/almacen/page.tsx:8:export default function AlmacenDashboard() {
src/components/ui/table.tsx:91:export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
src/components/ui/badge.tsx:26:export interface BadgeProps
src/components/ui/badge.tsx:34:export { Badge, badgeVariants };
src/components/ui/sonner.tsx:37:export { Toaster };
src/components/ui/sidebar.tsx:721:export {
src/components/ui/separator.tsx:26:export { Separator };
src/components/ui/dialog.tsx:93:export {
src/components/ui/tooltip.tsx:30:export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
src/components/ui/button.tsx:37:export interface ButtonProps
src/components/ui/button.tsx:53:export { Button, buttonVariants };
src/components/ui/dropdown-menu.tsx:171:export {
src/lib/mockup-data/types/invoice.ts:17:export type OCRConfidence = 'HIGH' | 'MEDIUM' | 'LOW';
src/lib/mockup-data/types/invoice.ts:19:export const OCRConfidenceEnum = {
src/lib/mockup-data/types/invoice.ts:28:export type InvoiceStatus =
src/lib/mockup-data/types/invoice.ts:37:export const InvoiceStatusEnum = {
src/lib/mockup-data/types/invoice.ts:51:export interface ExtractedFields {
src/lib/mockup-data/types/invoice.ts:74:export interface ExtractedField<T> {
src/lib/mockup-data/types/invoice.ts:83:export interface ValidationResult {
src/lib/mockup-data/types/invoice.ts:93:export interface ValidationError {
src/lib/mockup-data/types/invoice.ts:103:export interface ValidationWarning {
src/lib/mockup-data/types/invoice.ts:114:export interface PriceVariance {
src/lib/mockup-data/types/invoice.ts:131:export interface Invoice {
src/lib/mockup-data/types/invoice.ts:203:export interface InvoiceLineMatch {
src/lib/mockup-data/types/invoice.ts:221:export interface InvoiceAttachment {
src/lib/mockup-data/types/invoice.ts:234:export interface InvoiceAuditEntry {
src/lib/mockup-data/types/invoice.ts:255:export const OCRConfidenceSchema = z.enum(['HIGH', 'MEDIUM', 'LOW']);
src/lib/mockup-data/types/invoice.ts:260:export const InvoiceStatusSchema = z.enum([
src/lib/mockup-data/types/invoice.ts:273:export const ExtractedFieldSchema = <T extends z.ZodTypeAny>(innerSchema: T) =>
src/lib/mockup-data/types/invoice.ts:283:export const ExtractedFieldsSchema = z.object({
src/lib/mockup-data/types/invoice.ts:306:export const ValidationErrorSchema = z.object({
src/lib/mockup-data/types/invoice.ts:316:export const ValidationWarningSchema = z.object({
src/lib/mockup-data/types/invoice.ts:326:export const ValidationResultSchema = z.object({
src/lib/mockup-data/types/invoice.ts:336:export const PriceVarianceSchema = z.object({
src/lib/mockup-data/types/invoice.ts:352:export const InvoiceLineMatchSchema = z.object({
src/lib/mockup-data/types/invoice.ts:370:export const InvoiceAttachmentSchema = z.object({
src/lib/mockup-data/types/invoice.ts:383:export const InvoiceAuditEntrySchema = z.object({
src/lib/mockup-data/types/invoice.ts:405:export const InvoiceSchema = z.object({
src/lib/mockup-data/types/invoice.ts:453:export type InvoiceType = z.infer<typeof InvoiceSchema>;
src/lib/mockup-data/types/invoice.ts:454:export type ExtractedFieldsType = z.infer<typeof ExtractedFieldsSchema>;
src/lib/mockup-data/types/invoice.ts:455:export type ValidationResultType = z.infer<typeof ValidationResultSchema>;
src/lib/mockup-data/types/invoice.ts:456:export type PriceVarianceType = z.infer<typeof PriceVarianceSchema>;
src/lib/mockup-data/types/invoice.ts:457:export type InvoiceLineMatchType = z.infer<typeof InvoiceLineMatchSchema>;
src/lib/mockup-data/types/invoice.ts:458:export type InvoiceAttachmentType = z.infer<typeof InvoiceAttachmentSchema>;
src/lib/mockup-data/types/invoice.ts:459:export type InvoiceAuditEntryType = z.infer<typeof InvoiceAuditEntrySchema>;
src/components/ui/checkbox.tsx:28:export { Checkbox };
src/lib/mockup-data/types/certificate.ts:18:export type CertificateType = 'CALIDAD' | 'SEGURIDAD' | 'AMBIENTAL' | 'FACTURA';
src/lib/mockup-data/types/certificate.ts:20:export const CertificateTypeEnum = {
src/lib/mockup-data/types/certificate.ts:30:export interface CertificateTypeMetadata {
src/lib/mockup-data/types/certificate.ts:38:export const CERTIFICATE_TYPE_METADATA: Record<CertificateType, CertificateTypeMetadata> = {
src/lib/mockup-data/types/certificate.ts:72:export type CertificateStatus =
src/lib/mockup-data/types/certificate.ts:81:export const CertificateStatusEnum = {
src/lib/mockup-data/types/certificate.ts:94:export interface CertificateVerification {
src/lib/mockup-data/types/certificate.ts:107:export interface Certificate {
src/lib/mockup-data/types/certificate.ts:176:export interface CertificateRequirement {
src/lib/mockup-data/types/certificate.ts:192:export interface CertificateAlert {
src/lib/mockup-data/types/certificate.ts:212:export interface CertificateReport {
src/lib/mockup-data/types/certificate.ts:229:export interface CertificateBlockerStatus {
src/lib/mockup-data/types/certificate.ts:243:export interface CertificateBatchUpdate {
src/lib/mockup-data/types/certificate.ts:254:export const CertificateTypeSchema = z.enum(['CALIDAD', 'SEGURIDAD', 'AMBIENTAL', 'FACTURA']);
src/lib/mockup-data/types/certificate.ts:259:export const CertificateStatusSchema = z.enum([
src/lib/mockup-data/types/certificate.ts:272:export const CertificateVerificationSchema = z.object({
src/lib/mockup-data/types/certificate.ts:285:export const CertificateSchema = z.object({
src/lib/mockup-data/types/certificate.ts:334:export const CertificateRequirementSchema = z.object({
src/lib/mockup-data/types/certificate.ts:350:export const CertificateAlertSchema = z.object({
src/lib/mockup-data/types/certificate.ts:371:export const CertificateBlockerStatusSchema = z.object({
src/lib/mockup-data/types/certificate.ts:385:export const CertificateReportSchema = z.object({
src/lib/mockup-data/types/certificate.ts:402:export type CertificateType_Inferred = z.infer<typeof CertificateSchema>;
src/lib/mockup-data/types/certificate.ts:403:export type CertificateVerificationType = z.infer<typeof CertificateVerificationSchema>;
src/lib/mockup-data/types/certificate.ts:404:export type CertificateRequirementType = z.infer<typeof CertificateRequirementSchema>;
src/lib/mockup-data/types/certificate.ts:405:export type CertificateAlertType = z.infer<typeof CertificateAlertSchema>;
src/lib/mockup-data/types/certificate.ts:406:export type CertificateBlockerStatusType = z.infer<typeof CertificateBlockerStatusSchema>;
src/lib/mockup-data/types/certificate.ts:407:export type CertificateReportType = z.infer<typeof CertificateReportSchema>;
src/lib/mockup-data/types/project.ts:17:export type ProjectStatus = 'PLANNING' | 'ACTIVE' | 'SUSPENDED' | 'COMPLETED' | 'CLOSED';
src/lib/mockup-data/types/project.ts:19:export const ProjectStatusEnum = {
src/lib/mockup-data/types/project.ts:32:export interface EVMMetrics {
src/lib/mockup-data/types/project.ts:49:export interface BudgetLine {
src/lib/mockup-data/types/project.ts:63:export interface Budget {
src/lib/mockup-data/types/project.ts:79:export interface Forecast {
src/lib/mockup-data/types/project.ts:91:export interface Consortium {
src/lib/mockup-data/types/project.ts:111:export interface ConsortiumMember {
src/lib/mockup-data/types/project.ts:126:export interface Project {
src/lib/mockup-data/types/project.ts:189:export interface ProjectMonthlySummary {
src/lib/mockup-data/types/project.ts:205:export interface ProjectFilter {
src/lib/mockup-data/types/project.ts:220:export const ProjectStatusSchema = z.enum([
src/lib/mockup-data/types/project.ts:231:export const BudgetLineSchema = z.object({
src/lib/mockup-data/types/project.ts:245:export const BudgetSchema = z.object({
src/lib/mockup-data/types/project.ts:261:export const EVMMetricsSchema = z.object({
src/lib/mockup-data/types/project.ts:278:export const ForecastSchema = z.object({
src/lib/mockup-data/types/project.ts:290:export const ConsortiumMemberSchema = z.object({
src/lib/mockup-data/types/project.ts:304:export const ConsortiumSchema = z.object({
src/lib/mockup-data/types/project.ts:324:export const ProjectSchema = z.object({
src/lib/mockup-data/types/project.ts:369:export const ProjectMonthlySummarySchema = z.object({
src/lib/mockup-data/types/project.ts:385:export const ProjectFilterSchema = z.object({
src/lib/mockup-data/types/project.ts:400:export type ProjectType = z.infer<typeof ProjectSchema>;
src/lib/mockup-data/types/project.ts:401:export type BudgetType = z.infer<typeof BudgetSchema>;
src/lib/mockup-data/types/project.ts:402:export type BudgetLineType = z.infer<typeof BudgetLineSchema>;
src/lib/mockup-data/types/project.ts:403:export type EVMMetricsType = z.infer<typeof EVMMetricsSchema>;
src/lib/mockup-data/types/project.ts:404:export type ForecastType = z.infer<typeof ForecastSchema>;
src/lib/mockup-data/types/project.ts:405:export type ConsortiumType = z.infer<typeof ConsortiumSchema>;
src/lib/mockup-data/types/project.ts:406:export type ConsortiumMemberType = z.infer<typeof ConsortiumMemberSchema>;
src/lib/mockup-data/types/project.ts:407:export type ProjectMonthlySummaryType = z.infer<typeof ProjectMonthlySummarySchema>;
src/lib/mockup-data/types/project.ts:408:export type ProjectFilterType = z.infer<typeof ProjectFilterSchema>;
src/lib/mockup-data/types/notification.ts:17:export type NotificationType =
src/lib/mockup-data/types/notification.ts:39:export const NotificationTypeEnum = {
src/lib/mockup-data/types/notification.ts:65:export type AlertPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
src/lib/mockup-data/types/notification.ts:67:export const AlertPriorityEnum = {
src/lib/mockup-data/types/notification.ts:77:export type AlertType =
src/lib/mockup-data/types/notification.ts:85:export const AlertTypeEnum = {
src/lib/mockup-data/types/notification.ts:97:export type NotificationChannel = 'EMAIL' | 'IN_APP' | 'SMS' | 'PUSH' | 'WEBHOOK';
src/lib/mockup-data/types/notification.ts:99:export const NotificationChannelEnum = {
src/lib/mockup-data/types/notification.ts:110:export type DeliveryStatus = 'QUEUED' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED' | 'BOUNCED';
src/lib/mockup-data/types/notification.ts:112:export const DeliveryStatusEnum = {
src/lib/mockup-data/types/notification.ts:124:export interface NotificationMetadata {
src/lib/mockup-data/types/notification.ts:136:export interface DeliveryAttempt {
src/lib/mockup-data/types/notification.ts:154:export interface NotificationRule {
src/lib/mockup-data/types/notification.ts:171:export interface NotificationTarget {
src/lib/mockup-data/types/notification.ts:183:export interface Notification {
src/lib/mockup-data/types/notification.ts:234:export interface NotificationTemplate {
src/lib/mockup-data/types/notification.ts:252:export interface NotificationDigest {
src/lib/mockup-data/types/notification.ts:267:export interface NotificationStats {
src/lib/mockup-data/types/notification.ts:284:export const NotificationTypeSchema = z.enum([
src/lib/mockup-data/types/notification.ts:310:export const AlertPrioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);
src/lib/mockup-data/types/notification.ts:315:export const AlertTypeSchema = z.enum([
src/lib/mockup-data/types/notification.ts:327:export const NotificationChannelSchema = z.enum(['EMAIL', 'IN_APP', 'SMS', 'PUSH', 'WEBHOOK']);
src/lib/mockup-data/types/notification.ts:332:export const DeliveryStatusSchema = z.enum([
src/lib/mockup-data/types/notification.ts:344:export const NotificationMetadataSchema = z.object({
src/lib/mockup-data/types/notification.ts:356:export const DeliveryAttemptSchema = z.object({
src/lib/mockup-data/types/notification.ts:374:export const NotificationTargetSchema = z.object({
src/lib/mockup-data/types/notification.ts:386:export const NotificationSchema = z.object({
src/lib/mockup-data/types/notification.ts:423:export type NotificationType_Inferred = z.infer<typeof NotificationSchema>;
src/lib/mockup-data/types/notification.ts:424:export type DeliveryAttemptType = z.infer<typeof DeliveryAttemptSchema>;
src/lib/mockup-data/types/notification.ts:425:export type NotificationMetadataType = z.infer<typeof NotificationMetadataSchema>;
src/lib/mockup-data/types/notification.ts:426:export type NotificationTargetType = z.infer<typeof NotificationTargetSchema>;
src/components/ui/spinner.tsx:16:export { Spinner };
src/lib/mockup-data/types/purchase.ts:23:export type PurchaseState =
src/lib/mockup-data/types/purchase.ts:32:export const PurchaseStateEnum = {
src/lib/mockup-data/types/purchase.ts:45:export interface StateMetadata {
src/lib/mockup-data/types/purchase.ts:52:export const PURCHASE_STATE_METADATA: Record<PurchaseState, StateMetadata> = {
src/lib/mockup-data/types/purchase.ts:103:export type StatusColor = 'green' | 'yellow' | 'red';
src/lib/mockup-data/types/purchase.ts:108:export const STATE_TRANSITIONS: Record<PurchaseState, PurchaseState[]> = {
src/lib/mockup-data/types/purchase.ts:121:export interface AuditLogEntry {
src/lib/mockup-data/types/purchase.ts:139:export interface Purchase {
src/lib/mockup-data/types/purchase.ts:192:export interface PurchaseMaterial {
src/lib/mockup-data/types/purchase.ts:209:export interface Attachment {
src/lib/mockup-data/types/purchase.ts:223:export interface PurchaseNote {
src/lib/mockup-data/types/purchase.ts:235:export interface AlertFlag {
src/lib/mockup-data/types/purchase.ts:253:export const PurchaseStateSchema = z.enum([
src/lib/mockup-data/types/purchase.ts:266:export const StatusColorSchema = z.enum(['green', 'yellow', 'red']);
src/lib/mockup-data/types/purchase.ts:271:export const AuditLogEntrySchema = z.object({
src/lib/mockup-data/types/purchase.ts:288:export const PurchaseMaterialSchema = z.object({
src/lib/mockup-data/types/purchase.ts:305:export const AttachmentSchema = z.object({
src/lib/mockup-data/types/purchase.ts:319:export const PurchaseNoteSchema = z.object({
src/lib/mockup-data/types/purchase.ts:331:export const AlertFlagSchema = z.object({
src/lib/mockup-data/types/purchase.ts:350:export const PurchaseSchema = z.object({
src/lib/mockup-data/types/purchase.ts:390:export type PurchaseType = z.infer<typeof PurchaseSchema>;
src/lib/mockup-data/types/purchase.ts:391:export type PurchaseMaterialType = z.infer<typeof PurchaseMaterialSchema>;
src/lib/mockup-data/types/purchase.ts:392:export type AttachmentType = z.infer<typeof AttachmentSchema>;
src/lib/mockup-data/types/purchase.ts:393:export type PurchaseNoteType = z.infer<typeof PurchaseNoteSchema>;
src/lib/mockup-data/types/purchase.ts:394:export type AlertFlagType = z.infer<typeof AlertFlagSchema>;
src/lib/mockup-data/types/purchase.ts:395:export type AuditLogEntryType = z.infer<typeof AuditLogEntrySchema>;
src/lib/mockup-data/types/inventory.ts:16:export type MovementType = 'RECEPTION' | 'DELIVERY' | 'ADJUSTMENT' | 'CONSUMPTION' | 'RETURN';
src/lib/mockup-data/types/inventory.ts:18:export const MovementTypeEnum = {
src/lib/mockup-data/types/inventory.ts:29:export interface WarehouseLocation {
src/lib/mockup-data/types/inventory.ts:43:export interface StockLevel {
src/lib/mockup-data/types/inventory.ts:61:export interface MaterialMovement {
src/lib/mockup-data/types/inventory.ts:95:export interface InventoryCount {
src/lib/mockup-data/types/inventory.ts:111:export interface InventoryCountLine {
src/lib/mockup-data/types/inventory.ts:126:export interface ConsumptionForecast {
src/lib/mockup-data/types/inventory.ts:140:export interface Inventory {
src/lib/mockup-data/types/inventory.ts:196:export interface InventoryAlert {
src/lib/mockup-data/types/inventory.ts:216:export interface InventorySummary {
src/lib/mockup-data/types/inventory.ts:231:export const MovementTypeSchema = z.enum([
src/lib/mockup-data/types/inventory.ts:242:export const WarehouseLocationSchema = z.object({
src/lib/mockup-data/types/inventory.ts:256:export const StockLevelSchema = z.object({
src/lib/mockup-data/types/inventory.ts:274:export const MaterialMovementSchema = z.object({
src/lib/mockup-data/types/inventory.ts:300:export const InventoryCountLineSchema = z.object({
src/lib/mockup-data/types/inventory.ts:315:export const InventoryCountSchema = z.object({
src/lib/mockup-data/types/inventory.ts:331:export const ConsumptionForecastSchema = z.object({
src/lib/mockup-data/types/inventory.ts:345:export const InventoryAlertSchema = z.object({
src/lib/mockup-data/types/inventory.ts:366:export const InventorySchema = z.object({
src/lib/mockup-data/types/inventory.ts:406:export const InventorySummarySchema = z.object({
src/lib/mockup-data/types/inventory.ts:421:export type InventoryType = z.infer<typeof InventorySchema>;
src/lib/mockup-data/types/inventory.ts:422:export type StockLevelType = z.infer<typeof StockLevelSchema>;
src/lib/mockup-data/types/inventory.ts:423:export type MaterialMovementType = z.infer<typeof MaterialMovementSchema>;
src/lib/mockup-data/types/inventory.ts:424:export type InventoryCountType = z.infer<typeof InventoryCountSchema>;
src/lib/mockup-data/types/inventory.ts:425:export type InventoryCountLineType = z.infer<typeof InventoryCountLineSchema>;
src/lib/mockup-data/types/inventory.ts:426:export type ConsumptionForecastType = z.infer<typeof ConsumptionForecastSchema>;
src/lib/mockup-data/types/inventory.ts:427:export type InventoryAlertType = z.infer<typeof InventoryAlertSchema>;
src/lib/mockup-data/types/inventory.ts:428:export type InventorySummaryType = z.infer<typeof InventorySummarySchema>;
src/lib/mockup-data/types/inventory.ts:429:export type WarehouseLocationType = z.infer<typeof WarehouseLocationSchema>;
src/lib/mockup-data/types/index.ts:18:export type {
src/lib/mockup-data/types/index.ts:27:export {
src/lib/mockup-data/types/index.ts:45:export type {
src/lib/mockup-data/types/index.ts:57:export {
src/lib/mockup-data/types/index.ts:81:export type {
src/lib/mockup-data/types/index.ts:96:export {
src/lib/mockup-data/types/index.ts:123:export type {
src/lib/mockup-data/types/index.ts:134:export {
src/lib/mockup-data/types/index.ts:156:export type {
src/lib/mockup-data/types/index.ts:169:export {
src/lib/mockup-data/types/index.ts:196:export type {
src/lib/mockup-data/types/index.ts:209:export {
src/lib/mockup-data/types/index.ts:236:export type {
src/lib/mockup-data/types/index.ts:249:export {
src/lib/mockup-data/types/index.ts:273:export type {
src/lib/mockup-data/types/index.ts:289:export {
src/lib/mockup-data/types/index.ts:365:export { z } from 'zod';
