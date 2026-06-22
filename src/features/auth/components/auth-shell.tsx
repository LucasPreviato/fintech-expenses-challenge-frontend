import type { PropsWithChildren } from 'react';

export function AuthShell({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-1 items-center gap-12 px-6 py-10 lg:px-8">
        <section className="hidden flex-1 lg:block">
          <div className="max-w-md space-y-5">
            <span className="inline-flex rounded-md bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              Fintech Expenses Challenge
            </span>
            <h1 className="text-4xl font-semibold text-foreground">
              Base pronta para a interface do desafio.
            </h1>
            <p className="text-base leading-7 text-muted">
              Nesta etapa, o frontend ja nasce com roteamento, formularios,
              autenticacao real e uma estrutura simples para crescer junto com a
              API.
            </p>
          </div>
        </section>

        <section className="w-full max-w-md">{children}</section>
      </div>
    </div>
  );
}
