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

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Proyeccion Financiera</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Grafica de proyeccion financiera (en desarrollo)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Consumo por Proyecto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Grafica de consumo por proyecto (en desarrollo)
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Proyectos - Estado General</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between p-2 hover:bg-muted rounded">
              <span className="font-medium">PAVICONSTRUJC</span>
              <span className="text-green-600">En tiempo y presupuesto</span>
            </div>
            <div className="flex justify-between p-2 hover:bg-muted rounded">
              <span className="font-medium">EDUBAR-KRA50</span>
              <span className="text-green-600">Avance normal</span>
            </div>
            <div className="flex justify-between p-2 hover:bg-muted rounded">
              <span className="font-medium">PTAR</span>
              <span className="text-yellow-600">Alerta: sobrecosto 5%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
