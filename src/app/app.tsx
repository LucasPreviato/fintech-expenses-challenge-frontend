import { router } from '@/app/router';
import { AuthProvider } from '@/providers/auth-provider';
import { queryClient } from '@/providers/query-client';
import { ToastProvider } from '@/providers/toast-provider';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}
