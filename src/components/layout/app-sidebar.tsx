'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { navigationByRole, roleLabels } from '@/lib/navigation';
import type { UserRole } from '@/lib/types/navigation';
import { Building2, Radar, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AppSidebarProps {
  role: UserRole;
}

export function AppSidebar({ role }: AppSidebarProps) {
  const pathname = usePathname();
  const navigation = navigationByRole[role];

  return (
    <Sidebar className="border-r border-sidebar-border/70 bg-sidebar/95 backdrop-blur">
      <SidebarHeader>
        <div className="flex items-center gap-3 rounded-2xl border border-sidebar-border bg-sidebar-accent/60 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="flex flex-1 flex-col">
            <span className="text-sm font-semibold tracking-wide text-sidebar-foreground">
              Contecsa
            </span>
            <span className="text-xs uppercase tracking-[0.24em] text-sidebar-foreground/70">
              Centro de comando
            </span>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between rounded-2xl border border-sidebar-border bg-sidebar-accent/40 px-3 py-2 text-xs text-sidebar-foreground/80">
          <span className="flex items-center gap-2 font-semibold uppercase tracking-[0.2em]">
            <Radar className="h-3.5 w-3.5" /> Estado vivo
          </span>
          <Badge
            className="border-sidebar-border bg-sidebar-primary/20 text-sidebar-foreground"
            variant="outline"
          >
            {roleLabels[role]}
          </Badge>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navigation.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-xs uppercase tracking-[0.2em] text-sidebar-foreground/60">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className="rounded-2xl data-[active=true]:bg-sidebar-primary/20 data-[active=true]:text-sidebar-foreground"
                      >
                        <Link href={item.href}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                      {item.badge !== undefined && (
                        <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between rounded-2xl border border-sidebar-border bg-sidebar-accent/40 px-3 py-2 text-xs text-sidebar-foreground/70">
          <span className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5" />
            Sync 08:32
          </span>
          <span>v0.1.0</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
