'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export function KPICard({ title, value, description, icon: Icon, trend }: KPICardProps) {
  return (
    <Card className="kpi-card">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="kpi-label">{title}</CardTitle>
          {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div className="kpi-value">{value}</div>
        {trend && (
          <div
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
              trend.isPositive ? 'bg-success-light text-success-dark' : 'bg-danger-light text-danger-dark'
            }`}
          >
            {trend.isPositive ? '▲' : '▼'} {trend.value}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface DashboardShellProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function DashboardShell({ title, description, children }: DashboardShellProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
          Panel operativo
        </p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">{title}</h1>
            <p className="text-base text-muted-foreground">{description}</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <span className="rounded-full border border-border/70 px-3 py-1">Semana 3</span>
            <span className="rounded-full border border-border/70 px-3 py-1">Meta 92%</span>
            <span className="rounded-full border border-border/70 px-3 py-1">IA activa</span>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
