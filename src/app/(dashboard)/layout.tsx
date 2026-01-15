'use client';

import { AppSidebar } from '@/components/layout/app-sidebar';
import { Header } from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { UserRole } from '@/lib/types/navigation';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Extract role from pathname (e.g., /dashboard/compras -> compras)
  const segments = pathname.split('/').filter(Boolean);
  const roleSegment = segments[1] || 'compras';
  const role = roleSegment as UserRole;

  // Mock user data - in production this would come from session/auth
  const user = {
    name: 'Liced Vega',
    email: 'liced.vega@contecsa.com',
    role,
  };

  return (
    <SidebarProvider className="relative min-h-svh">
      <AppSidebar role={role} />
      <SidebarInset className="bg-transparent">
        <Header user={user} />
        <main className="flex-1 overflow-y-auto px-4 pb-10 pt-6 md:px-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
