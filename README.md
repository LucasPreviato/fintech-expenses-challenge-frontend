# Fintech Expenses Challenge Frontend

Frontend do desafio tecnico de gestao financeira corporativa, construido com React, TypeScript, TanStack Router, React Query e Tailwind CSS.

## Objetivo

Criar uma base de frontend limpa, enxuta e pronta para crescer junto com a API do desafio, mantendo:

- autenticacao com telas de login e cadastro;
- navegacao publica e autenticada;
- estrutura pronta para dashboard, transacoes e categorias;
- tipagem forte e separacao simples de responsabilidades.

## Escopo desta etapa

Esta primeira entrega inicia o projeto para publicacao no GitHub e continuidade do desafio.

Ja estao prontos:

- scaffold com Vite + React + TypeScript;
- roteamento com TanStack Router;
- React Query preparado para consumo futuro da API;
- formularios com `react-hook-form` + `zod`;
- layout base para areas publicas e autenticadas;
- autenticacao real integrada com `login`, `register` e `/auth/me`;
- persistencia de sessao com `localStorage` e revalidacao no bootstrap;
- placeholders para `dashboard`, `transactions` e `categories`;

Ainda nao foi implementado nesta etapa:

- CRUDs, filtros e dashboard consumindo endpoints reais.

## Decisoes de projeto

- O frontend foi mantido separado da API, em um projeto irmao, para facilitar deploy e evolucao independente.
- Usei TanStack Router para manter roteamento tipado e organizado sem adicionar complexidade visual.
- Usei React Query como base de state assíncrono porque ele resolve bem cache, loading, invalidacao e integracao com APIs REST sem exigir um gerenciamento de estado mais pesado.
- Os componentes de UI foram mantidos simples, inspirados na abordagem do `shadcn/ui`, mas sem inflar a base com primitives desnecessarias nesta fase.
- O layout foi propositalmente contido e utilitario, alinhado ao tipo de produto pedido no desafio.

## Stack

- React
- TypeScript
- Vite
- TanStack Router
- TanStack React Query
- React Hook Form
- Zod
- Axios
- Tailwind CSS

## Estrutura inicial

- `src/app` - bootstrap do app e configuracao do router
- `src/providers` - providers globais como auth e react query
- `src/features/auth` - telas, schemas e tipos de autenticacao
- `src/routes` - layouts e paginas iniciais
- `src/components/ui` - primitives de interface
- `src/lib` - utilitarios e cliente HTTP

## Pre-requisitos

- Node.js 24.16.0
- pnpm 11.8.0

## Como rodar

1. Instale as dependencias:

```bash
pnpm install
```

2. Crie o arquivo de ambiente:

```bash
cp .env.example .env
```

3. Inicie o projeto:

```bash
pnpm dev
```

4. Para validar a base:

```bash
pnpm typecheck
pnpm lint
pnpm build
```

## Variaveis de ambiente

```env
VITE_API_URL=http://localhost:3333
```

Essa variavel define a URL base consumida pelo cliente HTTP da autenticacao e das proximas features.

## Rotas iniciais

- `/login`
- `/register`
- `/dashboard`
- `/transactions`
- `/categories`

## Proximos passos naturais

- criar camada de servicos para `categories`, `transactions` e `dashboard`;
- adicionar formularios reais, filtros e paginacao;
- evoluir feedback de erro e sucesso com notificacoes globais;
- preparar deploy publico.
