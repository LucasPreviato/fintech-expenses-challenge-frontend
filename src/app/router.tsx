import { LoginPage } from '@/features/auth/pages/login-page';
import { RegisterPage } from '@/features/auth/pages/register-page';
import { CategoriesPage } from '@/routes/categories-page';
import { DashboardPage } from '@/routes/dashboard-page';
import { IndexPage } from '@/routes/index-page';
import { ProtectedLayout } from '@/routes/protected-layout';
import { PublicLayout } from '@/routes/public-layout';
import { RootLayout } from '@/routes/root-layout';
import { TransactionsPage } from '@/routes/transactions-page';
import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexPage,
});

const publicRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'public',
  component: PublicLayout,
});

const loginRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: '/login',
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: '/register',
  component: RegisterPage,
});

const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'protected',
  component: ProtectedLayout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/dashboard',
  component: DashboardPage,
});

const transactionsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/transactions',
  component: TransactionsPage,
});

const categoriesRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/categories',
  component: CategoriesPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  publicRoute.addChildren([loginRoute, registerRoute]),
  protectedRoute.addChildren([
    dashboardRoute,
    transactionsRoute,
    categoriesRoute,
  ]),
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
