'use client';

import { DashboardShell, KPICard } from '@/components/dashboard/dashboard-shell';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Clock, ShoppingCart, TrendingDown } from 'lucide-react';

export default function ComprasDashboard() {
  return (
    <DashboardShell
      title="Dashboard Compras"
      description="Seguimiento de compras, inventario y analisis de precios"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Compras Activas"
          value="55"
          description="Registradas en seguimiento"
          icon={ShoppingCart}
        />
        <KPICard
          title="Pendientes >30 dias"
          value="3"
          description="Requieren seguimiento"
          icon={Clock}
          trend={{ value: '-2', isPositive: true }}
        />
        <KPICard
          title="Alertas de Precio"
          value="2"
          description="Variacion >10% vs promedio"
          icon={AlertTriangle}
        />
        <KPICard
          title="Ahorro del Mes"
          value="$12.4M"
          description="COP vs cotizacion inicial"
          icon={TrendingDown}
          trend={{ value: '8%', isPositive: true }}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="animate-slide-in-from-bottom">
          <CardHeader>
            <CardTitle>Flujo de compras por etapa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Cotizacion', value: 8, width: 'w-[35%]' },
              { label: 'Aprobacion Gerencia', value: 5, width: 'w-[22%]' },
              { label: 'Orden Compra Emitida', value: 12, width: 'w-[48%]' },
              { label: 'Recepcion Pendiente', value: 18, width: 'w-[64%]' },
              { label: 'Certificado Calidad', value: 3, width: 'w-[15%]', tone: 'danger' },
              { label: 'Facturacion', value: 6, width: 'w-[28%]' },
              { label: 'Completado', value: 3, width: 'w-[12%]' },
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
            <CardTitle>Radar de materiales criticos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: 'Acero corrugado 1/2"', risk: 'Alerta precio +12%', tone: 'warning' },
              { name: 'Cemento Argos 50kg', risk: 'Stock 8 dias', tone: 'danger' },
              { name: 'Tuberia PVC 4"', risk: 'Proveedor sin despacho', tone: 'info' },
            ].map((item) => (
              <div
                key={item.name}
                className="rounded-2xl border border-border/70 bg-background/70 p-4"
              >
                <p className="text-sm font-semibold">{item.name}</p>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{item.risk}</span>
                  <span
                    className={`rounded-full px-3 py-1 font-semibold uppercase tracking-[0.16em] ${
                      item.tone === 'danger'
                        ? 'bg-danger-light text-danger-dark'
                        : item.tone === 'warning'
                        ? 'bg-warning-light text-warning-dark'
                        : 'bg-info-light text-info-dark'
                    }`}
                  >
                    {item.tone}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="animate-slide-in-from-bottom">
          <CardHeader>
            <CardTitle>Compras recientes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              {
                name: 'Cemento Argos 50kg',
                detail: 'OC #1234 · PTAR',
                status: 'En transito',
              },
              {
                name: 'Acero corrugado 1/2"',
                detail: 'OC #1233 · EDUBAR',
                status: 'Recibido',
              },
              {
                name: 'Concreto premezclado 3000psi',
                detail: 'OC #1232 · PAVI',
                status: 'Calidad pendiente',
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
            <CardTitle>Oportunidades de ahorro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Consolidacion de compras', value: '$3.2M', delta: '+6%' },
              { label: 'Renegociacion de fletes', value: '$1.8M', delta: '+4%' },
              { label: 'Ajuste de volumen', value: '$920K', delta: '+2%' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-semibold">{item.label}</p>
                  <p className="text-xs text-muted-foreground">Impacto mensual estimado</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{item.value}</p>
                  <p className="text-xs text-success-dark">{item.delta}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
