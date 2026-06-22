import { Button } from '@/components/ui/button';
import { navigationItems } from '@/features/navigation/navigation-items';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-context';
import { Link, useRouterState } from '@tanstack/react-router';
import type { PropsWithChildren } from 'react';

export function AppShell({ children }: PropsWithChildren) {
  const { user, logout } = useAuth();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="hidden w-64 shrink-0 border-r bg-card lg:flex lg:flex-col">
        <div className="border-b px-6 py-5">
          <p className="text-sm font-medium text-primary">Fintech Expenses</p>
          <h1 className="mt-1 text-lg font-semibold">Frontend Bootstrap</h1>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.to;

            return (
              <Link
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted hover:bg-muted-surface hover:text-foreground',
                )}
                key={item.to}
                to={item.to}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="border-b bg-card">
          <div className="flex items-center justify-between gap-4 px-6 py-4">
            <div>
              <p className="text-sm text-muted">Ambiente inicial</p>
              <p className="text-base font-semibold text-foreground">
                {user?.name ?? 'Usuario'}
              </p>
            </div>

            <Button onClick={logout} variant="secondary">
              Sair
            </Button>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
