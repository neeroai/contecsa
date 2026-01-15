'use client';

import { DashboardShell, KPICard } from '@/components/dashboard/dashboard-shell';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Boxes, ClipboardList, TrendingUp, Wrench } from 'lucide-react';

export default function TecnicoDashboard() {
  return (
    <DashboardShell
      title="Dashboard Tecnico"
      description="Requisiciones, consumo de materiales y mantenimiento"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Requisiciones Activas"
          value="12"
          description="En proceso de compra"
          icon={ClipboardList}
        />
        <KPICard
          title="Consumo del Mes"
          value="$184M"
          description="COP en materiales"
          icon={Boxes}
          trend={{ value: '5%', isPositive: false }}
        />
        <KPICard
          title="Mantenimientos"
          value="4"
          description="Programados este mes"
          icon={Wrench}
        />
        <KPICard
          title="Eficiencia Uso"
          value="94%"
          description="vs planificado"
          icon={TrendingUp}
          trend={{ value: '2%', isPositive: true }}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="animate-slide-in-from-bottom">
          <CardHeader>
            <CardTitle>Consumo por proyecto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'PTAR', value: '$78M', progress: 'w-[65%]' },
              { label: 'EDUBAR-KRA50', value: '$52M', progress: 'w-[43%]' },
              { label: 'PAVICONSTRUJC', value: '$54M', progress: 'w-[45%]' },
              { label: 'San Pedro', value: '$21M', progress: 'w-[22%]' },
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">{item.label}</span>
                  <span className="font-semibold">{item.value}</span>
                </div>
                <div className="h-2 rounded-full bg-muted/70">
                  <div className={`h-2 rounded-full bg-primary ${item.progress}`} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="animate-slide-in-from-bottom">
          <CardHeader>
            <CardTitle>Mantenimiento activo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Flota de volquetas', detail: '3 equipos · 2 dias' },
              { label: 'Planta mezclas', detail: 'Inspeccion semanal' },
              { label: 'Compresores', detail: 'Cambio de filtros' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-border/70 bg-card/80 p-4">
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card className="animate-slide-in-from-bottom">
          <CardHeader>
            <CardTitle>Requisiciones recientes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              {
                name: 'REQ-2024-089',
                detail: 'Cemento x 200 bultos · PTAR',
                status: 'En compra',
              },
              {
                name: 'REQ-2024-088',
                detail: 'Acero corrugado · EDUBAR',
                status: 'Aprobada',
              },
              {
                name: 'REQ-2024-087',
                detail: 'Tuberia PVC · PAVI',
                status: 'Cotizacion',
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
                <Badge className="normal-case tracking-normal">{item.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="animate-slide-in-from-bottom">
          <CardHeader>
            <CardTitle>Materiales mas consumidos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Cemento', value: '38%' },
              { label: 'Acero', value: '22%' },
              { label: 'Aditivos', value: '18%' },
              { label: 'PVC', value: '14%' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <span className="font-semibold">{item.label}</span>
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {item.value}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
