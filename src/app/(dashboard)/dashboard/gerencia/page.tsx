'use client';

import { DashboardShell, KPICard } from '@/components/dashboard/dashboard-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, DollarSign, FolderKanban, TrendingUp } from 'lucide-react';

export default function GerenciaDashboard() {
  return (
    <DashboardShell
      title="Dashboard Gerencia"
      description="Vision ejecutiva de proyectos, presupuesto y analisis EVM"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Proyectos Activos"
          value="9"
          description="Consorcios en ejecucion"
          icon={FolderKanban}
        />
        <KPICard
          title="Presupuesto Total"
          value="$2.4B"
          description="COP ejecutado este año"
          icon={DollarSign}
          trend={{ value: '12%', isPositive: true }}
        />
        <KPICard
          title="EVM - CPI"
          value="0.98"
          description="Cost Performance Index"
          icon={TrendingUp}
          trend={{ value: '-2%', isPositive: false }}
        />
        <KPICard
          title="Alertas Criticas"
          value="2"
          description="Requieren atencion inmediata"
          icon={AlertTriangle}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="animate-slide-in-from-bottom">
          <CardHeader>
            <CardTitle>Proyeccion financiera</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Ingresos proyectados
                </p>
                <p className="mt-2 text-3xl font-semibold">$3.1B</p>
                <p className="text-sm text-muted-foreground">Cierre Q4</p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Margen esperado
                </p>
                <p className="mt-2 text-3xl font-semibold">18.6%</p>
                <p className="text-sm text-muted-foreground">+2.1% vs plan</p>
              </div>
            </div>
            <div className="rounded-2xl border border-border/70 bg-card/80 p-4">
              <p className="text-sm font-semibold">Riesgos de presupuesto</p>
              <div className="mt-3 space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>PTAR · Variacion insumos</span>
                  <span className="text-warning-dark">+4.5%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>EDUBAR · Fletes</span>
                  <span className="text-warning-dark">+3.2%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-slide-in-from-bottom">
          <CardHeader>
            <CardTitle>Consumo por proyecto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'PTAR', value: '$940M', progress: 'w-[72%]' },
              { label: 'EDUBAR-KRA50', value: '$620M', progress: 'w-[54%]' },
              { label: 'PAVICONSTRUJC', value: '$480M', progress: 'w-[38%]' },
              { label: 'San Pedro', value: '$260M', progress: 'w-[22%]' },
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">{item.label}</span>
                  <span className="text-sm font-semibold">{item.value}</span>
                </div>
                <div className="h-2 rounded-full bg-muted/70">
                  <div className={`h-2 rounded-full bg-primary ${item.progress}`} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card className="animate-slide-in-from-bottom">
          <CardHeader>
            <CardTitle>Proyectos · Estado general</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              { name: 'PAVICONSTRUJC', status: 'En tiempo y presupuesto', tone: 'success' },
              { name: 'EDUBAR-KRA50', status: 'Avance normal', tone: 'success' },
              { name: 'PTAR', status: 'Sobrecosto 5%', tone: 'warning' },
              { name: 'Conexiones Norte', status: 'Riesgo cronograma', tone: 'danger' },
            ].map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/70 p-3"
              >
                <span className="font-semibold">{item.name}</span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                    item.tone === 'success'
                      ? 'bg-success-light text-success-dark'
                      : item.tone === 'warning'
                      ? 'bg-warning-light text-warning-dark'
                      : 'bg-danger-light text-danger-dark'
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
            <CardTitle>Alertas ejecutivas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Contrato PTAR', detail: 'Ajuste de costos · 48h' },
              { label: 'Proyecto Norte', detail: 'Requiere aprobacion de cambio' },
              { label: 'EDUBAR-KRA50', detail: 'Liberar presupuesto de compra' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-border/70 bg-card/80 p-4">
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
