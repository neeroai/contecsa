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

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Compras por Etapa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Cotizacion</span>
                <Badge variant="outline">8</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Aprobacion Gerencia</span>
                <Badge variant="outline">5</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Orden Compra Emitida</span>
                <Badge variant="outline">12</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Recepcion Pendiente</span>
                <Badge variant="outline">18</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Certificado Calidad</span>
                <Badge variant="destructive">3</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Facturacion</span>
                <Badge variant="outline">6</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Completado</span>
                <Badge variant="secondary">3</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Materiales Criticos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Grafica de materiales criticos (en desarrollo)
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compras Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center p-2 hover:bg-muted rounded">
              <div>
                <span className="font-medium">Cemento Argos 50kg</span>
                <p className="text-xs text-muted-foreground">OC #1234 - PTAR</p>
              </div>
              <Badge>En transito</Badge>
            </div>
            <div className="flex justify-between items-center p-2 hover:bg-muted rounded">
              <div>
                <span className="font-medium">Acero corrugado 1/2"</span>
                <p className="text-xs text-muted-foreground">OC #1233 - EDUBAR</p>
              </div>
              <Badge variant="secondary">Recibido</Badge>
            </div>
            <div className="flex justify-between items-center p-2 hover:bg-muted rounded">
              <div>
                <span className="font-medium">Concreto premezclado 3000psi</span>
                <p className="text-xs text-muted-foreground">OC #1232 - PAVI</p>
              </div>
              <Badge variant="destructive">Cert. calidad pendiente</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
