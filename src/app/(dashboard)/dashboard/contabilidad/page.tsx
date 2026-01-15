'use client';

import { DashboardShell, KPICard } from '@/components/dashboard/dashboard-shell';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckSquare, FileText, ScanText } from 'lucide-react';

export default function ContabilidadDashboard() {
  return (
    <DashboardShell
      title="Dashboard Contabilidad"
      description="Gestion de facturas, OCR y validacion de pagos"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Facturas Pendientes"
          value="5"
          description="Por validar y aprobar"
          icon={FileText}
        />
        <KPICard
          title="OCR Procesados"
          value="23"
          description="Este mes"
          icon={ScanText}
          trend={{ value: '15%', isPositive: true }}
        />
        <KPICard title="Validadas" value="18" description="Listas para pago" icon={CheckSquare} />
        <KPICard
          title="Con Discrepancias"
          value="2"
          description="Requieren revision"
          icon={AlertCircle}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card className="animate-slide-in-from-bottom">
          <CardHeader>
            <CardTitle>Facturas por estado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Recibidas (OCR pendiente)', value: 3, width: 'w-[18%]' },
              { label: 'OCR Procesado', value: 5, width: 'w-[28%]' },
              { label: 'En validacion', value: 7, width: 'w-[36%]' },
              { label: 'Aprobadas para pago', value: 18, width: 'w-[70%]' },
              { label: 'Con errores', value: 2, width: 'w-[12%]', tone: 'danger' },
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.label}</span>
                  <Badge
                    variant={item.tone === 'danger' ? 'destructive' : 'outline'}
                    className="normal-case tracking-normal"
                  >
                    {item.value}
                  </Badge>
                </div>
                <div className="h-2 rounded-full bg-muted/70">
                  <div
                    className={`h-2 rounded-full ${item.width} ${
                      item.tone === 'danger' ? 'bg-danger' : 'bg-primary'
                    }`}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="animate-slide-in-from-bottom">
          <CardHeader>
            <CardTitle>Precision OCR</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Exactitud promedio
              </p>
              <p className="mt-2 text-3xl font-semibold">96.4%</p>
              <p className="text-sm text-muted-foreground">+1.2% vs ultimo ciclo</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
              <p className="text-sm font-semibold">Campos con mayor error</p>
              <div className="mt-3 space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Referencia de orden</span>
                  <span>3.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Impuestos</span>
                  <span>2.1%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Unidad de medida</span>
                  <span>1.4%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card className="animate-slide-in-from-bottom">
          <CardHeader>
            <CardTitle>Facturas recientes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              {
                name: 'Factura #FV-2024-1234',
                detail: 'Argos S.A. · $45.2M COP',
                status: 'Discrepancia precio',
                tone: 'danger',
              },
              {
                name: 'Factura #FV-2024-1233',
                detail: 'Aceros Diaco · $128.5M COP',
                status: 'En validacion',
                tone: 'warning',
              },
              {
                name: 'Factura #FV-2024-1232',
                detail: 'Concretos Premium · $87.3M COP',
                status: 'Aprobada',
                tone: 'success',
              },
            ].map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/70 p-3"
              >
                <div>
                  <span className="font-semibold">{item.name}</span>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                    item.tone === 'danger'
                      ? 'bg-danger-light text-danger-dark'
                      : item.tone === 'warning'
                      ? 'bg-warning-light text-warning-dark'
                      : 'bg-success-light text-success-dark'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="animate-slide-in-from-bottom">
          <CardHeader>
            <CardTitle>Validaciones en cola</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'OCR por revisar', value: '4' },
              { label: 'Cruce con OC', value: '6' },
              { label: 'Aprobacion gerencia', value: '3' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-border/70 bg-card/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-2 text-2xl font-semibold">{item.value}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
