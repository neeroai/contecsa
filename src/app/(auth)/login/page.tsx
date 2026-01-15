'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { roleLabels } from '@/lib/navigation';
import type { UserRole } from '@/lib/types/navigation';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('compras');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - no backend yet
    // In production, this would authenticate and set session
    router.push(`/dashboard/${role}`);
  };

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="surface-panel-heavy relative overflow-hidden p-8 text-foreground">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/20" />
        <div className="relative z-10 space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.36em] text-muted-foreground">
              Contecsa · Centro de inteligencia
            </p>
            <h1 className="text-4xl font-semibold">
              Operaciones conectadas en tiempo real.
            </h1>
            <p className="text-base text-muted-foreground">
              Monitorea compras, almacén, finanzas y ejecución técnica en un solo panel
              estratégico. Señales claras, decisiones rápidas.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-card/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Velocidad operativa
              </p>
              <p className="mt-2 text-3xl font-semibold">-23%</p>
              <p className="text-sm text-muted-foreground">Tiempo de aprobación</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-card/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Ahorro mensual
              </p>
              <p className="mt-2 text-3xl font-semibold">$128M</p>
              <p className="text-sm text-muted-foreground">Impacto directo en compras</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <span className="rounded-full border border-border/70 px-3 py-1">Rastreo OCR</span>
            <span className="rounded-full border border-border/70 px-3 py-1">
              Alertas de riesgo
            </span>
            <span className="rounded-full border border-border/70 px-3 py-1">
              Flujo de aprobaciones
            </span>
          </div>
        </div>
      </div>

      <Card className="self-center">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-semibold">Iniciar Sesion</CardTitle>
          <CardDescription>Accede al tablero operativo Contecsa.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electronico</Label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@contecsa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Rol (Demo)</Label>
              <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(roleLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              Ingresar
            </Button>
            <p className="text-xs text-muted-foreground">
              Demo interna · cualquier credencial habilita el acceso.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
