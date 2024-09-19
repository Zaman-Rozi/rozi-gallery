'use client';

import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';

import { useUser } from '@/hooks/use-user';
import { logger } from '@/lib/default-logger';
import { paths } from '@/paths';

export interface GuestGuardProps {
  children: React.ReactNode
}

export function GuestGuard({ children }: GuestGuardProps): React.JSX.Element | null {
  const router = useRouter();
  const { token } = useUser();
  const path = usePathname()



  if (token || path.includes("/gallary/")) {
    router.replace(paths.dashboard.overview);
    logger.debug('[GuestGuard]: User is logged in, redirecting to dashboard');
    return null
  }

  return <React.Fragment>{children}</React.Fragment>;
}
