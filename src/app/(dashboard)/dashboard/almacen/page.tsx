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

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Movimientos del Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Entradas</span>
                <span className="font-medium text-green-600">142</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Salidas</span>
                <span className="font-medium text-red-600">128</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Devoluciones</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Ajustes</span>
                <span className="font-medium">7</span>
              </div>
              <div className="border-t pt-2 flex items-center justify-between">
                <span className="text-sm font-medium">Saldo Neto</span>
                <span className="font-bold text-green-600">+14</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stock por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              Grafica de stock por categoria (en desarrollo)
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alertas de Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center p-2 hover:bg-muted rounded">
              <div>
                <span className="font-medium">Cemento Argos 50kg</span>
                <p className="text-xs text-muted-foreground">Stock: 15 unidades - Min: 50</p>
              </div>
              <Badge variant="destructive">Critico</Badge>
            </div>
            <div className="flex justify-between items-center p-2 hover:bg-muted rounded">
              <div>
                <span className="font-medium">Acero corrugado 1/2"</span>
                <p className="text-xs text-muted-foreground">Stock: 28 unidades - Min: 30</p>
              </div>
              <Badge>Bajo</Badge>
            </div>
            <div className="flex justify-between items-center p-2 hover:bg-muted rounded">
              <div>
                <span className="font-medium">Tuberia PVC 4"</span>
                <p className="text-xs text-muted-foreground">Stock: 42 unidades - Min: 40</p>
              </div>
              <Badge>Bajo</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
