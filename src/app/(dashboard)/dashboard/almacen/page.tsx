'use client';

import { DashboardShell, KPICard } from '@/components/dashboard/dashboard-shell';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Boxes, Package, Truck } from 'lucide-react';

export default function AlmacenDashboard() {
  return (
    <DashboardShell
      title="Dashboard Almacen"
      description="Inventario, movimientos y control de stock"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Items en Stock" value="342" description="SKUs activos" icon={Package} />
        <KPICard
          title="Movimientos Hoy"
          value="18"
          description="Entradas y salidas"
          icon={Truck}
          trend={{ value: '8', isPositive: true }}
        />
        <KPICard
          title="Stock Critico"
          value="5"
          description="Requieren reposicion"
          icon={AlertTriangle}
        />
        <KPICard
          title="Valor Inventario"
          value="$284M"
          description="COP total en stock"
          icon={Boxes}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card className="animate-slide-in-from-bottom">
          <CardHeader>
            <CardTitle>Movimientos del mes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Entradas', value: 142, width: 'w-[70%]', tone: 'success' },
              { label: 'Salidas', value: 128, width: 'w-[62%]', tone: 'danger' },
              { label: 'Devoluciones', value: 3, width: 'w-[12%]' },
              { label: 'Ajustes', value: 7, width: 'w-[18%]' },
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.label}</span>
                  <span
                    className={`font-semibold ${
                      item.tone === 'success'
                        ? 'text-success-dark'
                        : item.tone === 'danger'
                        ? 'text-danger-dark'
                        : 'text-foreground'
                    }`}
                  >
                    {item.value}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted/70">
                  <div
                    className={`h-2 rounded-full ${item.width} ${
                      item.tone === 'success'
                        ? 'bg-success'
                        : item.tone === 'danger'
                        ? 'bg-danger'
                        : 'bg-primary'
                    }`}
                  />
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/70 px-4 py-3">
              <span className="text-sm font-semibold">Saldo neto</span>
              <span className="text-sm font-semibold text-success-dark">+14</span>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-slide-in-from-bottom">
          <CardHeader>
            <CardTitle>Rotacion por categoria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Cementos', value: '38%', tone: 'success' },
              { label: 'Aceros', value: '24%', tone: 'warning' },
              { label: 'PVC', value: '19%', tone: 'info' },
              { label: 'Miscelaneos', value: '11%', tone: 'info' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <span className="font-semibold">{item.label}</span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                    item.tone === 'success'
                      ? 'bg-success-light text-success-dark'
                      : item.tone === 'warning'
                      ? 'bg-warning-light text-warning-dark'
                      : 'bg-info-light text-info-dark'
                  }`}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card className="animate-slide-in-from-bottom">
          <CardHeader>
            <CardTitle>Alertas de stock</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              {
                name: 'Cemento Argos 50kg',
                detail: 'Stock 15 unidades · Min 50',
                tone: 'danger',
              },
              {
                name: 'Acero corrugado 1/2"',
                detail: 'Stock 28 unidades · Min 30',
                tone: 'warning',
              },
              {
                name: 'Tuberia PVC 4"',
                detail: 'Stock 42 unidades · Min 40',
                tone: 'warning',
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
                <Badge
                  variant={item.tone === 'danger' ? 'destructive' : 'outline'}
                  className="normal-case tracking-normal"
                >
                  {item.tone === 'danger' ? 'Critico' : 'Bajo'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="animate-slide-in-from-bottom">
          <CardHeader>
            <CardTitle>Recepciones en ventana</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'PTAR · 6 camiones', time: '08:00 - 11:00' },
              { label: 'EDUBAR · 2 entregas', time: '12:00 - 15:00' },
              { label: 'PAVI · 4 pallets', time: '16:00 - 18:00' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-border/70 bg-card/80 p-4">
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
