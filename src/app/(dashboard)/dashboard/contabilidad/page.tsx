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

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Facturas por Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Recibidas (OCR pendiente)</span>
                <Badge variant="outline">3</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">OCR Procesado</span>
                <Badge variant="outline">5</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">En validacion</span>
                <Badge variant="outline">7</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Aprobadas para pago</span>
                <Badge variant="secondary">18</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Con errores</span>
                <Badge variant="destructive">2</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Precision OCR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              Grafica de precision OCR (en desarrollo)
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Facturas Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center p-2 hover:bg-muted rounded">
              <div>
                <span className="font-medium">Factura #FV-2024-1234</span>
                <p className="text-xs text-muted-foreground">Argos S.A. - $45.2M COP</p>
              </div>
              <Badge variant="destructive">Discrepancia precio</Badge>
            </div>
            <div className="flex justify-between items-center p-2 hover:bg-muted rounded">
              <div>
                <span className="font-medium">Factura #FV-2024-1233</span>
                <p className="text-xs text-muted-foreground">Aceros Diaco - $128.5M COP</p>
              </div>
              <Badge>En validacion</Badge>
            </div>
            <div className="flex justify-between items-center p-2 hover:bg-muted rounded">
              <div>
                <span className="font-medium">Factura #FV-2024-1232</span>
                <p className="text-xs text-muted-foreground">Concretos Premium - $87.3M COP</p>
              </div>
              <Badge variant="secondary">Aprobada</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
