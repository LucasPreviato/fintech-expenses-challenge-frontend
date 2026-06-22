# Fintech Expenses Challenge Frontend

Frontend do desafio tecnico de gestao financeira corporativa, construido com React, TypeScript, TanStack Router, TanStack React Query e Tailwind CSS.

## Links 

link do deploy front: https://fintech-expenses-challenge-frontend.vercel.app/login

link do deploy api: https://fintech-expenses-challenge-api.onrender.com/docs

 - repositorio frontend: https://github.com/LucasPreviato/fintech-expenses-challenge-frontend

 - repositorio backend: https://github.com/LucasPreviato/fintech-expenses-challenge-api 



## Objetivo

Entregar a interface do MVP pedido no desafio com:

- autenticacao com login, cadastro e sessao persistida;
- dashboard consumindo dados consolidados da API;
- listagem de transacoes com filtros, paginacao e formulario de criacao/edicao;
- gerenciamento de categorias;
- feedback visual para loading, erro, sucesso e expiracao de sessao.

## Alinhamento com o desafio

O documento `.docs/desafio_nestjs_react.md` pede um frontend com React 18+, TypeScript, hooks, roteamento, tratamento de erro e um gerenciamento de estado justificado.

Neste projeto, esse alinhamento foi feito assim:

- React com componentes funcionais e hooks;
- TypeScript tipando rotas, formularios, payloads e respostas da API;
- roteamento com TanStack Router;
- comunicacao HTTP com Axios;
- validacao de formularios com `react-hook-form` + `zod`;
- gerenciamento de estado com combinacao de Context API e React Query;
- dashboard, categorias e transacoes consumindo endpoints reais do backend.

## State Management

A escolha de gerenciamento de estado foi intencionalmente dividida em duas camadas:

- `Context API` para estado de sessao e autenticacao, porque esse estado e pequeno, global e precisa ser acessado por qualquer rota protegida;
- `TanStack React Query` para estado assíncrono do servidor, porque lida melhor com cache, refetch, loading, erro, invalidacao e sincronizacao com a API.

Essa combinacao evita criar uma store global para tudo. No contexto deste desafio, ela deixa a aplicacao mais simples de entender:

- sessao do usuario fica centralizada no `AuthProvider`;
- dados remotos ficam perto das features que os consomem;
- mutacoes invalidam queries sem duplicar estado manualmente;
- filtros, drawer state e formularios permanecem como estado local de pagina, onde fazem mais sentido.

## Seguranca e sessao

O frontend usa `accessToken` persistido localmente e revalida a sessao com `/auth/me` no bootstrap.

Tambem foi centralizado um interceptor global de `401` no cliente HTTP. Com isso:

- o token e enviado automaticamente nas requisicoes autenticadas;
- qualquer resposta `401` pode limpar a sessao de forma centralizada;
- a interface volta para estado autenticado invalido sem depender de tratamento manual em cada tela.

Esse fluxo reduz acoplamento entre as features e melhora o comportamento quando a sessao expira.

## Contrato de datas

As transacoes usam data civil, mas trafegam com payload ISO.

O contrato adotado no frontend e:

- o input de data captura `YYYY-MM-DD`;
- no submit, o frontend envia a data como ISO em UTC no inicio do dia, por exemplo `2026-06-22T00:00:00.000Z`;
- o backend persiste e retorna ISO;
- na interface, quando a intencao e mostrar a data civil da transacao, o valor deve ser renderizado sem reinterpretar horario como se fosse evento local com hora relevante.

Esse ponto foi documentado porque datas financeiras costumam sofrer com ambiguidades de timezone mesmo em MVPs.

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

## Estrutura

- `src/app` - bootstrap do app e configuracao principal
- `src/providers` - auth, query client e toast
- `src/features/auth` - login, cadastro, sessao e contratos de autenticacao
- `src/features/dashboard` - filtros e indicadores consolidados
- `src/features/categories` - CRUD de categorias
- `src/features/transactions` - listagem, filtros, formulario, mutacoes e resumo
- `src/routes` - paginas e layouts protegidos/publicos
- `src/lib` - cliente HTTP, env e utilitarios
- `src/components/ui` - componentes base reutilizaveis

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

4. Para validar a aplicacao:

```bash
pnpm typecheck
pnpm lint
pnpm build
```

## Variavel de ambiente

```env
VITE_API_URL=http://localhost:3333
```

Essa variavel define a URL base usada pelo cliente HTTP em autenticacao, dashboard, categorias e transacoes.

## Rotas principais

- `/login`
- `/register`
- `/dashboard`
- `/transactions`
- `/categories`

