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

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Consumo por Proyecto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>PTAR</span>
                  <span className="font-medium">$78M</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[65%]" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>EDUBAR-KRA50</span>
                  <span className="font-medium">$52M</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[43%]" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>PAVICONSTRUJC</span>
                  <span className="font-medium">$54M</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[45%]" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Materiales mas Consumidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              Grafica de materiales mas consumidos (en desarrollo)
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Requisiciones Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center p-2 hover:bg-muted rounded">
              <div>
                <span className="font-medium">REQ-2024-089</span>
                <p className="text-xs text-muted-foreground">Cemento x 200 bultos - PTAR</p>
              </div>
              <Badge>En compra</Badge>
            </div>
            <div className="flex justify-between items-center p-2 hover:bg-muted rounded">
              <div>
                <span className="font-medium">REQ-2024-088</span>
                <p className="text-xs text-muted-foreground">Acero corrugado - EDUBAR</p>
              </div>
              <Badge variant="secondary">Aprobada</Badge>
            </div>
            <div className="flex justify-between items-center p-2 hover:bg-muted rounded">
              <div>
                <span className="font-medium">REQ-2024-087</span>
                <p className="text-xs text-muted-foreground">Tuberia PVC - PAVI</p>
              </div>
              <Badge>Cotizacion</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
