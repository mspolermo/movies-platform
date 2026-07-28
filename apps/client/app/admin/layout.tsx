import type { ReactNode } from 'react';

import { AdminRootLayout } from '@/pages/AdminRootLayout';

/** Шлюз и сайдбар вокруг маршрутов админки (ADR-005). */
export default function AdminRoutesLayout({ children }: { children: ReactNode }) {
  return <AdminRootLayout>{children}</AdminRootLayout>;
}
