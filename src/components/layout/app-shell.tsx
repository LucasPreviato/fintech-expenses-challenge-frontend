import { Button } from '@/components/ui/button';
import { navigationItems } from '@/features/navigation/navigation-items';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-context';
import { Link, useRouterState } from '@tanstack/react-router';
import { HandCoins, LogOut } from 'lucide-react';
import type { PropsWithChildren } from 'react';

function getUserInitials(name?: string | null) {
  if (!name) {
    return 'FT';
  }

  const parts = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);

  return parts.map((part) => part[0]?.toUpperCase() ?? '').join('');
}

export function AppShell({ children }: PropsWithChildren) {
  const { user, logout } = useAuth();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const userInitials = getUserInitials(user?.name);

  return (
    <div className="flex min-h-screen bg-[radial-gradient(circle_at_top,#ffffff_0%,#f7fafc_35%,#eef3f8_100%)]">
      <aside className="hidden w-[17rem] shrink-0 border-r border-slate-200/80 bg-white/90 backdrop-blur xl:flex xl:flex-col">
        <div className="px-8 pb-8 pt-10">
          <div className="flex items-center gap-3">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <HandCoins className="size-8" strokeWidth={1.9} />
            </div>
            <div>
              <p className="text-[1.55rem] font-semibold leading-none tracking-tight text-primary">
                Fintech
              </p>
              <p className="text-[1.55rem] font-semibold leading-none tracking-tight text-foreground">
                Expenses
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-2 px-5 pb-6">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.to;

            return (
              <Link
                className={cn(
                  'flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium transition-all',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-[0_18px_30px_-18px_rgba(15,118,110,0.95)]'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-foreground',
                )}
                key={item.to}
                to={item.to}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="border-b border-slate-200/80 bg-white/75 backdrop-blur">
          <div className="flex items-center justify-between gap-4 px-6 py-5 xl:px-10">
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-primary">Sessão ativa</p>
              <p className="text-[1.7rem] font-semibold leading-none text-foreground">
                {user?.name ?? 'Usuario'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-2.5 shadow-sm md:flex">
                <div className="flex size-11 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {userInitials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {user?.name ?? 'Usuario'}
                  </p>
                  <p className="truncate text-sm text-muted">
                    {user?.email ?? 'Conta autenticada'}
                  </p>
                </div>
              </div>

              <Button onClick={logout} variant="secondary">
                <LogOut className="size-4" />
                Sair
              </Button>
            </div>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-6 py-6 xl:px-10 xl:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
